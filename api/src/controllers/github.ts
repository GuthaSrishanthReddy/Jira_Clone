import { catchErrors } from 'errors';
import { EntityNotFoundError, BadUserInputError } from 'errors';
import prisma from 'database/prisma';
import { runScan, runFullScan } from 'services/repoScanner';

// Save / update GitHub integration settings for a project
export const updateGithubSettings = catchErrors(async (req, res) => {
  const projectId = req.currentUser.projectId;

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new EntityNotFoundError('Project');

  const { githubRepoOwner, githubRepoName, githubDefaultBranch, githubAccessToken, aiBugMonitoringEnabled } = req.body;

  // Validate that owner and name are present when enabling monitoring
  if (aiBugMonitoringEnabled) {
    if (!githubRepoOwner || !githubRepoName) {
      throw new BadUserInputError({
        fields: {
          githubRepoOwner: !githubRepoOwner ? 'Repo owner is required to enable monitoring.' : undefined,
          githubRepoName: !githubRepoName ? 'Repo name is required to enable monitoring.' : undefined,
        },
      });
    }
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: {
      ...(githubRepoOwner !== undefined && { githubRepoOwner: githubRepoOwner || null }),
      ...(githubRepoName !== undefined && { githubRepoName: githubRepoName || null }),
      ...(githubDefaultBranch !== undefined && { githubDefaultBranch: githubDefaultBranch || 'main' }),
      // Only update token if a non-empty value is sent (preserve existing if omitted)
      ...(githubAccessToken !== undefined && githubAccessToken !== '' && { githubAccessToken }),
      ...(aiBugMonitoringEnabled !== undefined && { aiBugMonitoringEnabled }),
      // Reset last scanned SHA when repo config changes
      ...(githubRepoOwner !== undefined || githubRepoName !== undefined
        ? { lastScannedCommitSha: null }
        : {}),
    },
    select: {
      id: true,
      githubRepoOwner: true,
      githubRepoName: true,
      githubDefaultBranch: true,
      aiBugMonitoringEnabled: true,
      lastScannedCommitSha: true,
      // Intentionally NOT returning githubAccessToken to the client
    },
  });

  res.respond({ project: updated });
});

// Trigger a manual scan for the current project
export const triggerScan = catchErrors(async (req, res) => {
  const projectId = req.currentUser.projectId;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      githubRepoOwner: true,
      githubRepoName: true,
      githubAccessToken: true,
    },
  });

  if (!project) throw new EntityNotFoundError('Project');

  if (!project.githubRepoOwner || !project.githubRepoName || !project.githubAccessToken) {
    throw new BadUserInputError({
      message: 'GitHub integration is not fully configured. Add repo owner, name, and access token.',
    });
  }

  // Run scan — responds immediately with the count of findings
  const findingCount = await runScan(projectId);

  res.respond({ findingCount });
});

// Trigger a one-time full repo scan (walks all code files)
export const triggerFullScan = catchErrors(async (req, res) => {
  const projectId = req.currentUser.projectId;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, githubRepoOwner: true, githubRepoName: true, githubAccessToken: true },
  });

  if (!project) throw new EntityNotFoundError('Project');

  if (!project.githubRepoOwner || !project.githubRepoName || !project.githubAccessToken) {
    throw new BadUserInputError({
      message: 'GitHub integration is not fully configured. Add repo owner, name, and access token.',
    });
  }

  const findingCount = await runFullScan(projectId);

  res.respond({ findingCount });
});

// Get findings for the current project — critical first, then by recency
export const getFindings = catchErrors(async (req, res) => {
  const projectId = req.currentUser.projectId;
  const { scanId } = req.query;

  const findings = await prisma.repoFinding.findMany({
    where: {
      projectId,
      ...(scanId ? { scanId: Number(scanId) } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      title: true,
      severity: true,
      filePath: true,
      reason: true,
      suggestedFix: true,
      shouldCreateIssue: true,
      issueId: true,
      createdAt: true,
      scan: { select: { id: true, commitSha: true, startedAt: true } },
      // Include assignees of the promoted issue so the UI can show who was assigned
      issue: {
        select: {
          users: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
    },
  });

  // Sort: critical → high → medium → low, then by recency within each tier
  const SEVERITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  findings.sort((a, b) => {
    const diff = (SEVERITY_ORDER[a.severity] ?? 4) - (SEVERITY_ORDER[b.severity] ?? 4);
    return diff !== 0 ? diff : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  res.respond({ findings });
});

// Get scan history for the current project
export const getScans = catchErrors(async (req, res) => {
  const projectId = req.currentUser.projectId;

  const scans = await prisma.repoScan.findMany({
    where: { projectId },
    orderBy: { startedAt: 'desc' },
    take: 20,
    select: {
      id: true,
      status: true,
      isFullScan: true,
      startedAt: true,
      completedAt: true,
      commitSha: true,
      error: true,
      _count: { select: { findings: true } },
    },
  });

  res.respond({ scans });
});

// Promote a finding into a board Issue and optionally assign it to a team member
export const promoteToIssue = catchErrors(async (req, res) => {
  const projectId = req.currentUser.projectId;
  const findingId = Number(req.params.findingId);
  const { assigneeId } = req.body;

  const finding = await prisma.repoFinding.findUnique({ where: { id: findingId } });
  if (!finding || finding.projectId !== projectId) throw new EntityNotFoundError('RepoFinding');
  if (finding.issueId) {
    res.respond({ issueId: finding.issueId });
    return;
  }

  const existingIssues = await prisma.issue.findMany({
    where: { projectId, status: 'backlog' },
    select: { listPosition: true },
  });
  const maxPos = existingIssues.length > 0
    ? Math.max(...existingIssues.map(i => i.listPosition))
    : 0;

  const SEVERITY_TO_PRIORITY: Record<string, string> = {
    critical: '5',
    high: '4',
    medium: '3',
    low: '2',
  };

  const description = `<p><strong>File:</strong> ${finding.filePath}</p><p>${finding.reason}</p>${finding.suggestedFix ? `<p><strong>Suggested fix:</strong> ${finding.suggestedFix}</p>` : ''}`;
  const descriptionText = `File: ${finding.filePath}\n${finding.reason}${finding.suggestedFix ? `\nSuggested fix: ${finding.suggestedFix}` : ''}`;

  // Validate the assignee belongs to this project
  let validAssigneeId: number | null = null;
  if (assigneeId) {
    const assignee = await prisma.user.findFirst({ where: { id: Number(assigneeId), projectId } });
    if (assignee) validAssigneeId = assignee.id;
  }

  const issue = await prisma.issue.create({
    data: {
      title: finding.title,
      type: 'bug',
      status: 'backlog',
      priority: SEVERITY_TO_PRIORITY[finding.severity] ?? '3',
      listPosition: maxPos + 1,
      description,
      descriptionText,
      // The manager who assigns is the reporter
      reporterId: req.currentUser.id,
      projectId,
      ...(validAssigneeId ? { users: { connect: [{ id: validAssigneeId }] } } : {}),
    },
    include: {
      users: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  await prisma.repoFinding.update({
    where: { id: findingId },
    data: { issueId: issue.id },
  });

  res.respond({ issueId: issue.id, assignees: issue.users });
});

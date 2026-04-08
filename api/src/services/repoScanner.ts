import prisma from 'database/prisma';
import { IssueType, IssueStatus, IssuePriority } from 'constants/issues';
import { getRepoInfo, getCommitsSince, getOpenPullRequestDiffs, getLatestCommitSha, getRepoTree, getFileContents } from './github';
import { analyzeCodeDiffs, analyzeFileContents } from './aiAnalysis';

const SEVERITY_TO_PRIORITY: Record<string, string> = {
  critical: IssuePriority.HIGHEST,
  high: IssuePriority.HIGH,
  medium: IssuePriority.MEDIUM,
  low: IssuePriority.LOW,
};

type ScanResult = {
  findingCount: number;
  autoCreatedIssueCount: number;
  autoIssueWarning: string | null;
};

const buildFindingDescription = (finding: {
  filePath: string;
  reason: string;
  suggestedFix: string | null;
}) => ({
  description: `<p><strong>File:</strong> ${finding.filePath}</p><p>${finding.reason}</p>${finding.suggestedFix ? `<p><strong>Suggested fix:</strong> ${finding.suggestedFix}</p>` : ''}`,
  descriptionText: `File: ${finding.filePath}\n${finding.reason}${finding.suggestedFix ? `\nSuggested fix: ${finding.suggestedFix}` : ''}`,
});

const autoCreateIssuesForFindings = async (
  projectId: number,
  findings: Array<{
    id: number;
    title: string;
    severity: string;
    filePath: string;
    reason: string;
    suggestedFix: string | null;
    shouldCreateIssue: boolean;
  }>,
): Promise<{ autoCreatedIssueCount: number; autoIssueWarning: string | null }> => {
  const findingsToPromote = findings.filter(finding => finding.shouldCreateIssue);
  if (findingsToPromote.length === 0) {
    return { autoCreatedIssueCount: 0, autoIssueWarning: null };
  }

  const firstUser = await prisma.user.findFirst({ where: { projectId } });
  if (!firstUser) {
    return {
      autoCreatedIssueCount: 0,
      autoIssueWarning: `Found ${findingsToPromote.length} issue-worthy finding(s), but none were added to the board because the project has no users.`,
    };
  }

  let autoCreatedIssueCount = 0;
  let skippedIssueCount = 0;

  for (const finding of findingsToPromote) {
    try {
      const existingIssues = await prisma.issue.findMany({
        where: { projectId, status: IssueStatus.BACKLOG },
        select: { listPosition: true },
      });
      const maxPos = existingIssues.length > 0
        ? Math.max(...existingIssues.map(issue => issue.listPosition))
        : 0;
      const { description, descriptionText } = buildFindingDescription(finding);

      const issue = await prisma.issue.create({
        data: {
          title: finding.title,
          type: IssueType.BUG,
          status: IssueStatus.BACKLOG,
          priority: SEVERITY_TO_PRIORITY[finding.severity] ?? IssuePriority.MEDIUM,
          listPosition: maxPos + 1,
          description,
          descriptionText,
          reporterId: firstUser.id,
          projectId,
        },
      });

      await prisma.repoFinding.update({
        where: { id: finding.id },
        data: { issueId: issue.id },
      });

      autoCreatedIssueCount++;
    } catch (err) {
      skippedIssueCount++;
      console.error(`[RepoScanner] Failed to auto-create issue for finding ${finding.id}:`, err);
    }
  }

  return {
    autoCreatedIssueCount,
    autoIssueWarning:
      skippedIssueCount > 0
        ? `Saved ${findingsToPromote.length} issue-worthy finding(s), but only ${autoCreatedIssueCount} were added to the board. ${skippedIssueCount} could not be auto-created.`
        : null,
  };
};

/**
 * Run a full AI-powered repo scan for a project.
 * Creates a RepoScan record, fetches diffs, runs AI analysis,
 * stores findings, and auto-creates Issues for high-confidence findings.
 */
export const runScan = async (projectId: number): Promise<ScanResult> => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  const token = project?.githubAccessToken || process.env.GITHUB_TOKEN;

  if (
    !project ||
    !project.githubRepoOwner ||
    !project.githubRepoName ||
    !token
  ) {
    throw new Error(`Project ${projectId} is missing GitHub configuration.`);
  }

  const { githubRepoOwner: owner, githubRepoName: repo, githubDefaultBranch: configuredBranch, lastScannedCommitSha } = project;

  // Verify access and get the real default branch from GitHub
  // This catches 404/401 before creating the scan record
  const repoInfo = await getRepoInfo(owner, repo, token);
  // Use the GitHub-reported default branch; only override if the user explicitly set one
  const branch = configuredBranch && configuredBranch !== 'main'
    ? configuredBranch
    : repoInfo.defaultBranch;

  // Create scan record in 'running' state
  const scan = await prisma.repoScan.create({
    data: { projectId, status: 'running' },
  });

  try {
    // Fetch new commits and open PR diffs in parallel
    const [commits, prs, latestSha] = await Promise.all([
      getCommitsSince(owner, repo, branch, token, lastScannedCommitSha),
      getOpenPullRequestDiffs(owner, repo, token),
      getLatestCommitSha(owner, repo, branch, token),
    ]);

    // Run AI analysis on the diffs
    const rawFindings = await analyzeCodeDiffs(commits, prs, project.name);

    // Persist each finding
    const findingRecords = await Promise.all(
      rawFindings.map(f =>
        prisma.repoFinding.create({
          data: {
            scanId: scan.id,
            projectId,
            title: f.title,
            severity: f.severity,
            filePath: f.filePath,
            reason: f.reason,
            suggestedFix: f.suggestedFix ?? null,
            shouldCreateIssue: f.shouldCreateIssue,
          },
        }),
      ),
    );

    // Auto-create Issues for findings where shouldCreateIssue = true
    // We need a reporter — use the first user in the project
    const { autoCreatedIssueCount, autoIssueWarning } = await autoCreateIssuesForFindings(
      projectId,
      findingRecords,
    );

    // Mark scan completed and update lastScannedCommitSha
    await prisma.repoScan.update({
      where: { id: scan.id },
      data: {
        status: 'completed',
        completedAt: new Date(),
        commitSha: latestSha,
      },
    });

    if (latestSha) {
      await prisma.project.update({
        where: { id: projectId },
        data: { lastScannedCommitSha: latestSha },
      });
    }

    return {
      findingCount: findingRecords.length,
      autoCreatedIssueCount,
      autoIssueWarning,
    };
  } catch (err) {
    await prisma.repoScan.update({
      where: { id: scan.id },
      data: {
        status: 'failed',
        completedAt: new Date(),
        error: err instanceof Error ? err.message : String(err),
      },
    });
    throw err;
  }
};

/**
 * Run a one-time full repo scan — walks all code files, sends them to AI in
 * chunks, stores findings, and auto-creates Issues for high-confidence ones.
 */
export const runFullScan = async (projectId: number): Promise<ScanResult> => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  const token = project?.githubAccessToken || process.env.GITHUB_TOKEN;

  if (
    !project ||
    !project.githubRepoOwner ||
    !project.githubRepoName ||
    !token
  ) {
    throw new Error(`Project ${projectId} is missing GitHub configuration.`);
  }

  const { githubRepoOwner: owner, githubRepoName: repo, githubDefaultBranch: configuredBranch } = project;

  const repoInfo = await getRepoInfo(owner, repo, token);
  const branch = configuredBranch && configuredBranch !== 'main'
    ? configuredBranch
    : repoInfo.defaultBranch;

  const scan = await prisma.repoScan.create({
    data: { projectId, status: 'running', isFullScan: true },
  });

  try {
    // Walk the full file tree and fetch contents
    const filePaths = await getRepoTree(owner, repo, branch, token);
    const files = await getFileContents(owner, repo, filePaths, token);

    const rawFindings = await analyzeFileContents(files, project.name);

    const findingRecords = await Promise.all(
      rawFindings.map(f =>
        prisma.repoFinding.create({
          data: {
            scanId: scan.id,
            projectId,
            title: f.title,
            severity: f.severity,
            filePath: f.filePath,
            reason: f.reason,
            suggestedFix: f.suggestedFix ?? null,
            shouldCreateIssue: f.shouldCreateIssue,
          },
        }),
      ),
    );

    const { autoCreatedIssueCount, autoIssueWarning } = await autoCreateIssuesForFindings(
      projectId,
      findingRecords,
    );

    const latestSha = await getLatestCommitSha(owner, repo, branch, token);

    await prisma.repoScan.update({
      where: { id: scan.id },
      data: { status: 'completed', completedAt: new Date(), commitSha: latestSha },
    });

    if (latestSha) {
      await prisma.project.update({
        where: { id: projectId },
        data: { lastScannedCommitSha: latestSha },
      });
    }

    return {
      findingCount: findingRecords.length,
      autoCreatedIssueCount,
      autoIssueWarning,
    };
  } catch (err) {
    await prisma.repoScan.update({
      where: { id: scan.id },
      data: {
        status: 'failed',
        completedAt: new Date(),
        error: err instanceof Error ? err.message : String(err),
      },
    });
    throw err;
  }
};

/**
 * Run scans for all projects that have AI monitoring enabled.
 * Called by the background cron job.
 */
export const runAllEnabledScans = async (): Promise<void> => {
  const hasEnvToken = !!process.env.GITHUB_TOKEN;
  const projects = await prisma.project.findMany({
    where: {
      aiBugMonitoringEnabled: true,
      githubRepoOwner: { not: null },
      githubRepoName: { not: null },
      // If a fallback env token exists, include projects without a per-project token
      ...(hasEnvToken ? {} : { githubAccessToken: { not: null } }),
    },
    select: { id: true },
  });

  for (const project of projects) {
    try {
      await runScan(project.id);
    } catch (err) {
      // Log but don't crash the cron job if one project fails
      console.error(`[RepoScanner] Scan failed for project ${project.id}:`, err);
    }
  }
};

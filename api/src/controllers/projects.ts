import { catchErrors } from 'errors';
import { EntityNotFoundError, BadUserInputError } from 'errors';
import { generateErrors } from 'utils/validation';
import is from 'utils/validation';
import { serializeDemoUser } from 'utils/demoUsers';
import prisma from 'database/prisma';
import { issuePartial } from 'serializers/issues';
import { ProjectCategory } from 'constants/projects';

// GET /projects — returns all projects with summary stats for the hub dashboard
export const getAllProjectsWithStats = catchErrors(async (req, res) => {
  const projects = await prisma.project.findMany({
    include: {
      users: { select: { id: true, name: true, avatarUrl: true } },
      issues: {
        select: {
          id: true,
          status: true,
          type: true,
          priority: true,
          updatedAt: true,
          users: { select: { id: true } },
        },
      },
      findings: { select: { id: true, severity: true } },
      scans: {
        select: { id: true, status: true, completedAt: true },
        orderBy: { startedAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const currentUserId = req.currentUser.id;

  const result = projects.map(project => {
    // Single pass over issues — avoids 5+ separate .filter() calls per project
    let doneIssues = 0, inProgressIssues = 0, backlogIssues = 0, bugIssues = 0, myIssueCount = 0;
    let latestMs = 0;
    for (const i of project.issues) {
      if (i.status === 'done') doneIssues++;
      else if (i.status === 'inprogress') inProgressIssues++;
      else if (i.status === 'backlog') backlogIssues++;
      if (i.type === 'bug') bugIssues++;
      if (i.users.some(u => u.id === currentUserId)) myIssueCount++;
      const t = new Date(i.updatedAt).getTime();
      if (t > latestMs) latestMs = t;
    }
    const totalIssues = project.issues.length;
    const completionRate = totalIssues > 0 ? Math.round((doneIssues / totalIssues) * 100) : 0;

    // Single pass over findings
    let criticalFindings = 0, highFindings = 0;
    for (const f of project.findings) {
      if (f.severity === 'critical') criticalFindings++;
      else if (f.severity === 'high') highFindings++;
    }
    const aiHealthScore = project.githubRepoName
      ? Math.max(0, 100 - criticalFindings * 30 - highFindings * 10)
      : null;

    const lastActivity = latestMs > 0 ? new Date(latestMs) : project.updatedAt;

    return {
      id: project.id,
      name: project.name,
      url: project.url,
      description: project.description,
      category: project.category,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      githubRepoOwner: project.githubRepoOwner,
      githubRepoName: project.githubRepoName,
      aiBugMonitoringEnabled: project.aiBugMonitoringEnabled,
      users: project.users,
      lastScan: project.scans[0] || null,
      stats: {
        totalIssues,
        doneIssues,
        inProgressIssues,
        backlogIssues,
        bugIssues,
        completionRate,
        myIssueCount,
        criticalFindings,
        highFindings,
        totalFindings: project.findings.length,
        aiHealthScore,
        teamSize: project.users.length,
        lastActivity,
      },
    };
  });

  res.respond({ projects: result });
});

// Validation rules for project fields
const projectValidations = {
  name: [is.required(), is.maxLength(100)], // Name is required and max 100 chars
  url: is.url(), // Must be a valid URL if provided
  category: [is.required(), is.oneOf(Object.values(ProjectCategory))], // Must match enum
};

// Fetch project along with its users and issues
export const getProjectWithUsersAndIssues = catchErrors(async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.currentUser.projectId }, // Get current user's project
    include: {
      users: true, // Include all users in the project
      issues: { include: { users: { select: { id: true } } } }, // Include issue-user mapping
    },
  });

  if (!project) throw new EntityNotFoundError('Project');

  res.respond({
    project: {
      ...project,
      users: project.users.map(user => serializeDemoUser(user)),
      // Transform issues to include only userIds instead of full user objects
      issues: project.issues.map(issue => ({
        ...issuePartial(issue),
        userIds: issue.users.map(u => u.id),
      })),
    },
  });
});

// Update project details
export const update = catchErrors(async (req, res) => {
  const id = req.currentUser.projectId;

  // Check if project exists
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) throw new EntityNotFoundError('Project');

  // Merge existing data with incoming request for validation
  const merged = { ...existing, ...req.body };

  // Validate merged data
  const errors = generateErrors(merged, projectValidations);
  if (Object.keys(errors).length > 0) {
    throw new BadUserInputError({ fields: errors });
  }

  // Update only provided fields (partial update)
  const project = await prisma.project.update({
    where: { id },
    data: {
      ...(req.body.name !== undefined && { name: req.body.name }),
      ...(req.body.url !== undefined && { url: req.body.url }),
      ...(req.body.description !== undefined && { description: req.body.description }),
      ...(req.body.category !== undefined && { category: req.body.category }),
    },
  });

  res.respond({ project });
});

/**
 * Helper Function: getProjectStats
 * --------------------------------
 * This function calculates useful statistics for a project.
 * It can be reused anywhere (controllers, services, dashboards).
 *
 * Returns:
 * - totalIssues → total number of issues in the project
 * - completedIssues → issues marked as "done"
 * - openIssues → issues not completed
 */
// export const getProjectStats = async (projectId) => {
//   // Fetch only required fields for efficiency
//   const issues = await prisma.issue.findMany({
//     where: { projectId },
//     select: { status: true },
//   });

//   const totalIssues = issues.length;

//   // Count completed issues
//   const completedIssues = issues.filter(i => i.status === 'done').length;

//   // Remaining issues
//   const openIssues = totalIssues - completedIssues;

//   return {
//     totalIssues,
//     completedIssues,
//     openIssues,
//   };
// };

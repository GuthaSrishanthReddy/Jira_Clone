import { catchErrors } from 'errors';
import { EntityNotFoundError, BadUserInputError } from 'errors';
import { generateErrors } from 'utils/validation';
import is from 'utils/validation';
import prisma from 'database/prisma';
import { issuePartial } from 'serializers/issues';
import { ProjectCategory } from 'constants/projects';

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

import { catchErrors } from 'errors';
import { EntityNotFoundError, BadUserInputError } from 'errors';
import { generateErrors } from 'utils/validation';
import is from 'utils/validation';
import prisma from 'database/prisma';
import { issuePartial } from 'serializers/issues';
import { ProjectCategory } from 'constants/projects';

const projectValidations = {
  name: [is.required(), is.maxLength(100)],
  url: is.url(),
  category: [is.required(), is.oneOf(Object.values(ProjectCategory))],
};

export const getProjectWithUsersAndIssues = catchErrors(async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.currentUser.projectId },
    include: {
      users: true,
      issues: { include: { users: { select: { id: true } } } },
    },
  });

  if (!project) throw new EntityNotFoundError('Project');

  res.respond({
    project: {
      ...project,
      issues: project.issues.map(issue => ({
        ...issuePartial(issue),
        userIds: issue.users.map(u => u.id),
      })),
    },
  });
});

export const update = catchErrors(async (req, res) => {
  const id = req.currentUser.projectId;
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) throw new EntityNotFoundError('Project');

  const merged = { ...existing, ...req.body };
  const errors = generateErrors(merged, projectValidations);
  if (Object.keys(errors).length > 0) throw new BadUserInputError({ fields: errors });

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

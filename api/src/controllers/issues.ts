import striptags from 'striptags';

import { catchErrors } from 'errors';
import { EntityNotFoundError, BadUserInputError, ForbiddenError } from 'errors';
import { generateErrors } from 'utils/validation';
import is from 'utils/validation';
import prisma from 'database/prisma';
import { issuePartial } from 'serializers/issues';
import { IssueType, IssueStatus, IssuePriority } from 'constants/issues';

const issueValidations = {
  title: [is.required(), is.maxLength(200)],
  type: [is.required(), is.oneOf(Object.values(IssueType))],
  status: [is.required(), is.oneOf(Object.values(IssueStatus))],
  priority: [is.required(), is.oneOf(Object.values(IssuePriority))],
  listPosition: is.required(),
  reporterId: is.required(),
};

// Fields a member (non-manager) is allowed to update on their own issues
const MEMBER_ALLOWED_FIELDS = new Set(['status', 'listPosition', 'timeSpent', 'timeRemaining']);

export const getProjectIssues = catchErrors(async (req, res) => {
  const { id: userId, projectId, role } = req.currentUser;
  const { searchTerm } = req.query;
  const isManager = role === 'manager';

  const issues = await prisma.issue.findMany({
    where: {
      projectId,
      // Members only see their assigned issues
      ...(isManager ? {} : { users: { some: { id: userId } } }),
      ...(searchTerm
        ? {
            OR: [
              { title: { contains: String(searchTerm), mode: 'insensitive' } },
              { descriptionText: { contains: String(searchTerm), mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: { users: { select: { id: true } } },
  });

  res.respond({
    issues: issues.map(issue => ({
      ...issuePartial(issue),
      userIds: issue.users.map(u => u.id),
    })),
  });
});

export const getIssueWithUsersAndComments = catchErrors(async (req, res) => {
  const { id: userId, projectId, role } = req.currentUser;
  const isManager = role === 'manager';

  const issue = await prisma.issue.findUnique({
    where: { id: Number(req.params.issueId) },
    include: {
      users: true,
      comments: { include: { user: true } },
    },
  });

  if (!issue) throw new EntityNotFoundError('Issue');

  // Ensure the issue belongs to the user's project
  if (issue.projectId !== projectId) throw new EntityNotFoundError('Issue');

  // Members can only view issues they are assigned to
  if (!isManager && !issue.users.some(u => u.id === userId)) {
    throw new ForbiddenError('You can only view issues assigned to you.');
  }

  res.respond({
    issue: {
      ...issue,
      userIds: issue.users.map(u => u.id),
    },
  });
});

export const create = catchErrors(async (req, res) => {
  // Only managers can create issues
  if (req.currentUser.role !== 'manager') {
    throw new ForbiddenError('Only managers can create issues.');
  }

  const body = req.body;
  const listPosition = await calculateListPosition(body.projectId, body.status);
  const errors = generateErrors({ ...body, listPosition }, issueValidations);
  if (Object.keys(errors).length > 0) throw new BadUserInputError({ fields: errors });

  const descriptionText = body.description ? striptags(body.description) : null;

  const issue = await prisma.issue.create({
    data: {
      title: body.title,
      type: body.type,
      status: body.status,
      priority: body.priority,
      listPosition,
      description: body.description || null,
      descriptionText,
      estimate: body.estimate || null,
      timeSpent: body.timeSpent || null,
      timeRemaining: body.timeRemaining || null,
      reporterId: body.reporterId,
      projectId: body.projectId,
      users: body.userIds?.length
        ? { connect: (body.userIds as number[]).map((id: number) => ({ id })) }
        : undefined,
    },
    include: { users: { select: { id: true } } },
  });

  res.respond({ issue: { ...issue, userIds: issue.users.map(u => u.id) } });
});

export const update = catchErrors(async (req, res) => {
  const id = Number(req.params.issueId);
  const { id: userId, projectId, role } = req.currentUser;
  const isManager = role === 'manager';

  const existing = await prisma.issue.findUnique({
    where: { id },
    include: { users: { select: { id: true } } },
  });
  if (!existing) throw new EntityNotFoundError('Issue');
  if (existing.projectId !== projectId) throw new EntityNotFoundError('Issue');

  const body = req.body;

  if (!isManager) {
    // Members can only update their own assigned issues
    if (!existing.users.some(u => u.id === userId)) {
      throw new ForbiddenError('You can only update issues assigned to you.');
    }
    // Members can only touch a limited set of fields
    const requestedFields = Object.keys(body);
    const forbidden = requestedFields.filter(f => !MEMBER_ALLOWED_FIELDS.has(f));
    if (forbidden.length > 0) {
      throw new ForbiddenError(`Members cannot update: ${forbidden.join(', ')}.`);
    }
  }

  const descriptionText =
    body.description !== undefined
      ? body.description
        ? striptags(body.description)
        : null
      : undefined;

  const issue = await prisma.issue.update({
    where: { id },
    data: {
      ...(body.title !== undefined && isManager && { title: body.title }),
      ...(body.type !== undefined && isManager && { type: body.type }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.priority !== undefined && isManager && { priority: body.priority }),
      ...(body.listPosition !== undefined && { listPosition: body.listPosition }),
      ...(body.description !== undefined && isManager && { description: body.description }),
      ...(descriptionText !== undefined && isManager && { descriptionText }),
      ...(body.estimate !== undefined && isManager && { estimate: body.estimate }),
      ...(body.timeSpent !== undefined && { timeSpent: body.timeSpent }),
      ...(body.timeRemaining !== undefined && { timeRemaining: body.timeRemaining }),
      ...(body.userIds !== undefined && isManager && {
        users: { set: (body.userIds as number[]).map((uid: number) => ({ id: uid })) },
      }),
    },
    include: { users: { select: { id: true } } },
  });

  res.respond({ issue: { ...issue, userIds: issue.users.map(u => u.id) } });
});

export const remove = catchErrors(async (req, res) => {
  // Only managers can delete issues
  if (req.currentUser.role !== 'manager') {
    throw new ForbiddenError('Only managers can delete issues.');
  }

  const id = Number(req.params.issueId);
  const existing = await prisma.issue.findUnique({ where: { id } });
  if (!existing) throw new EntityNotFoundError('Issue');

  const issue = await prisma.issue.delete({ where: { id } });
  res.respond({ issue });
});

const calculateListPosition = async (projectId: number, status: string): Promise<number> => {
  const issues = await prisma.issue.findMany({
    where: { projectId, status },
    select: { listPosition: true },
  });

  const listPositions = issues.map(({ listPosition }) => listPosition);

  if (listPositions.length > 0) {
    return Math.min(...listPositions) / 2;
  }
  return 1;
};

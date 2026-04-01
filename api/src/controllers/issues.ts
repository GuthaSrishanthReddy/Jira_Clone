import striptags from 'striptags';

import { catchErrors } from 'errors';
import { EntityNotFoundError, BadUserInputError } from 'errors';
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

export const getProjectIssues = catchErrors(async (req, res) => {
  const { projectId } = req.currentUser;
  const { searchTerm } = req.query;

  const issues = await prisma.issue.findMany({
    where: {
      projectId,
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
  const issue = await prisma.issue.findUnique({
    where: { id: Number(req.params.issueId) },
    include: {
      users: true,
      comments: { include: { user: true } },
    },
  });

  if (!issue) throw new EntityNotFoundError('Issue');

  res.respond({
    issue: {
      ...issue,
      userIds: issue.users.map(u => u.id),
    },
  });
});

export const create = catchErrors(async (req, res) => {
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
  const existing = await prisma.issue.findUnique({ where: { id } });
  if (!existing) throw new EntityNotFoundError('Issue');

  const body = req.body;
  const descriptionText =
    body.description !== undefined
      ? body.description
        ? striptags(body.description)
        : null
      : undefined;

  const issue = await prisma.issue.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.type !== undefined && { type: body.type }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.priority !== undefined && { priority: body.priority }),
      ...(body.listPosition !== undefined && { listPosition: body.listPosition }),
      ...(body.description !== undefined && { description: body.description }),
      ...(descriptionText !== undefined && { descriptionText }),
      ...(body.estimate !== undefined && { estimate: body.estimate }),
      ...(body.timeSpent !== undefined && { timeSpent: body.timeSpent }),
      ...(body.timeRemaining !== undefined && { timeRemaining: body.timeRemaining }),
      ...(body.userIds !== undefined && {
        users: { set: (body.userIds as number[]).map((uid: number) => ({ id: uid })) },
      }),
    },
    include: { users: { select: { id: true } } },
  });

  res.respond({ issue: { ...issue, userIds: issue.users.map(u => u.id) } });
});

export const remove = catchErrors(async (req, res) => {
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

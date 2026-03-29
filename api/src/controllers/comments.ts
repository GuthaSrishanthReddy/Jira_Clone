import { catchErrors } from 'errors';
import { EntityNotFoundError, BadUserInputError } from 'errors';
import { generateErrors } from 'utils/validation';
import is from 'utils/validation';
import prisma from 'database/prisma';

const commentValidations = {
  body: [is.required(), is.maxLength(50000)],
};

export const create = catchErrors(async (req, res) => {
  const errors = generateErrors(req.body, commentValidations);
  if (Object.keys(errors).length > 0) throw new BadUserInputError({ fields: errors });

  const comment = await prisma.comment.create({
    data: {
      body: req.body.body,
      userId: req.body.userId,
      issueId: req.body.issueId,
    },
  });
  res.respond({ comment });
});

export const update = catchErrors(async (req, res) => {
  const id = Number(req.params.commentId);
  const existing = await prisma.comment.findUnique({ where: { id } });
  if (!existing) throw new EntityNotFoundError('Comment');

  const comment = await prisma.comment.update({
    where: { id },
    data: { body: req.body.body },
  });
  res.respond({ comment });
});

export const remove = catchErrors(async (req, res) => {
  const id = Number(req.params.commentId);
  const existing = await prisma.comment.findUnique({ where: { id } });
  if (!existing) throw new EntityNotFoundError('Comment');

  const comment = await prisma.comment.delete({ where: { id } });
  res.respond({ comment });
});

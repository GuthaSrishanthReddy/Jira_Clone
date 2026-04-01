import { catchErrors, BadUserInputError, EntityNotFoundError } from 'errors';
import { signToken } from 'utils/authToken';
import ensureDemoProject from 'database/ensureDemoProject';
import prisma from 'database/prisma';
import { demoUsers } from 'constants/demoUsers';
import { serializeDemoUser } from 'utils/demoUsers';

export const createGuestAccount = catchErrors(async (_req, res) => {
  const project = await ensureDemoProject();
  const user = project.users.find(candidate => candidate.email === demoUsers[0].email);

  if (!user) throw new EntityNotFoundError('User');

  res.respond({
    authToken: signToken({ sub: user.id }),
    currentUser: serializeDemoUser(user),
  });
});

export const getLoginUsers = catchErrors(async (_req, res) => {
  const project = await ensureDemoProject();

  const users = project.users
    .map(user => serializeDemoUser(user))
    .sort((left, right) => left.id - right.id);

  res.respond({ users });
});

export const login = catchErrors(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();

  if (!email) {
    throw new BadUserInputError({ fields: { email: 'This field is required' } });
  }

  await ensureDemoProject();

  const user = await prisma.user.findFirst({
    where: {
      email: { equals: email, mode: 'insensitive' },
    },
  });

  if (!user) {
    throw new BadUserInputError({ fields: { email: 'No demo user matches this email' } });
  }

  res.respond({
    authToken: signToken({ sub: user.id }),
    currentUser: serializeDemoUser(user),
  });
});

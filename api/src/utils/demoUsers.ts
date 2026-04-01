import { User } from '@prisma/client';

import { demoUsers } from 'constants/demoUsers';

type SerializedUser = User & {
  userType: string;
  title: string;
};

const fallbackProfile = {
  userType: 'member',
  title: 'Team member',
};

export const getDemoUserProfile = (email: string) =>
  demoUsers.find(user => user.email.toLowerCase() === email.toLowerCase()) || fallbackProfile;

export const serializeDemoUser = (user: User): SerializedUser => {
  const profile = getDemoUserProfile(user.email);

  return {
    ...user,
    userType: profile.userType,
    title: profile.title,
  };
};

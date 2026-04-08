import { demoUsers } from 'constants/demoUsers';

type UserWithRole = { id: number; name: string; email: string; avatarUrl: string; projectId: number; role: string; createdAt: Date; updatedAt: Date };

type SerializedUser = UserWithRole & {
  userType: string;
  title: string;
};

const fallbackProfile = {
  userType: 'member',
  title: 'Team Member',
};

export const getDemoUserProfile = (email: string) =>
  demoUsers.find(user => user.email.toLowerCase() === email.toLowerCase()) || fallbackProfile;

export const serializeDemoUser = (user: UserWithRole): SerializedUser => {
  const profile = getDemoUserProfile(user.email);

  return {
    ...user,
    // role comes directly from the DB — used for authorization (manager | member)
    role: user.role ?? 'member',
    userType: profile.userType,
    title: profile.title,
  };
};

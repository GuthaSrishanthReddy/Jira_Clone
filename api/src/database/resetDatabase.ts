import prisma from 'database/prisma';

const resetDatabase = async (): Promise<void> => {
  await prisma.$executeRaw`DELETE FROM "_IssueUsers"`;
  await prisma.comment.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.user.deleteMany();
  await prisma.project.deleteMany();
};

export default resetDatabase;

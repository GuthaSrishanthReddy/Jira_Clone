import striptags from 'striptags';
import { User } from '@prisma/client';
import { ProjectCategory } from 'constants/projects';
import { IssueType, IssueStatus, IssuePriority } from 'constants/issues';
import prisma from 'database/prisma';

const createTestAccount = async (): Promise<User> => {
  const project = await prisma.project.create({
    data: {
      name: 'Project name',
      url: 'https://www.testurl.com',
      description: 'Project description',
      category: ProjectCategory.SOFTWARE,
      users: {
        create: [
          { name: 'Gaben', email: 'gaben@jira.test', avatarUrl: 'https://i.ibb.co/6RJ5hq6/gaben.jpg' },
          { name: 'Yoda', email: 'yoda@jira.test', avatarUrl: 'https://i.ibb.co/6n0hLML/baby-yoda.jpg' },
        ],
      },
    },
    include: { users: true },
  });

  const [gaben, yoda] = project.users;

  const issues = await Promise.all([
    prisma.issue.create({
      data: {
        title: 'Issue title 1',
        type: IssueType.TASK,
        status: IssueStatus.BACKLOG,
        priority: IssuePriority.LOWEST,
        listPosition: 1,
        reporterId: gaben.id,
        projectId: project.id,
      },
    }),
    prisma.issue.create({
      data: {
        title: 'Issue title 2',
        type: IssueType.TASK,
        status: IssueStatus.BACKLOG,
        priority: IssuePriority.MEDIUM,
        listPosition: 2,
        estimate: 5,
        description: 'Issue description 2',
        descriptionText: striptags('Issue description 2'),
        reporterId: gaben.id,
        projectId: project.id,
        users: { connect: [{ id: gaben.id }] },
      },
    }),
    prisma.issue.create({
      data: {
        title: 'Issue title 3',
        type: IssueType.STORY,
        status: IssueStatus.SELECTED,
        priority: IssuePriority.HIGH,
        listPosition: 3,
        estimate: 10,
        description: 'Issue description 3',
        descriptionText: striptags('Issue description 3'),
        reporterId: gaben.id,
        projectId: project.id,
        users: { connect: [{ id: gaben.id }, { id: yoda.id }] },
      },
    }),
  ]);

  await prisma.comment.create({
    data: {
      body: 'Comment body',
      issueId: issues[0].id,
      userId: gaben.id,
    },
  });

  return gaben;
};

export default createTestAccount;

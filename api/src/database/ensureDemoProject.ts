import striptags from 'striptags';
import { Project, User } from '@prisma/client';

import { demoUsers } from 'constants/demoUsers';
import { ProjectCategory } from 'constants/projects';
import { IssueType, IssueStatus, IssuePriority } from 'constants/issues';
import prisma from 'database/prisma';

type ProjectWithUsers = Project & { users: User[] };

const ensureDemoProject = async (): Promise<ProjectWithUsers> => {
  const existingUsers = await prisma.user.findMany({
    where: { email: { in: demoUsers.map(user => user.email) } },
    orderBy: { id: 'asc' },
  });

  if (existingUsers.length > 0) {
    const projectId = existingUsers[0].projectId;

    for (const demoUser of demoUsers) {
      const hasUser = existingUsers.some(user => user.email === demoUser.email);

      if (!hasUser) {
        await prisma.user.create({
          data: {
            name: demoUser.name,
            email: demoUser.email,
            avatarUrl: demoUser.avatarUrl,
            projectId,
          },
        });
      }
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { users: true, issues: { select: { id: true } } },
    });

    if (!project) {
      throw new Error('Demo project could not be loaded.');
    }

    if (project.issues.length === 0) {
      await seedProjectIssues(project.id);
    }

    return prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      include: { users: true },
    });
  }

  const project = await prisma.project.create({
    data: {
      name: 'Singularity 2.0',
      url: 'https://www.atlassian.com/software/jira',
      description:
        'A Jira-style software project demo with workflow tracking, issue triage, release planning, and role-based collaboration.',
      category: ProjectCategory.SOFTWARE,
      users: {
        create: demoUsers.map(user => ({
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        })),
      },
    },
    include: { users: true },
  });

  await seedProjectIssues(project.id);

  return prisma.project.findUniqueOrThrow({
    where: { id: project.id },
    include: { users: true },
  });
};

const seedProjectIssues = async (projectId: number) => {
  const users = await prisma.user.findMany({
    where: { projectId },
    orderBy: { id: 'asc' },
  });

  const gaben = users.find(user => user.email === 'gaben@jira.guest');
  const yoda = users.find(user => user.email === 'yoda@jira.guest');
  const rick = users.find(user => user.email === 'rick@jira.guest');
  const leia = users.find(user => user.email === 'leia@jira.guest');

  if (!gaben || !yoda || !rick || !leia) {
    throw new Error('Demo users are missing.');
  }

  const desc1 = `<p>Your teams can collaborate in Jira applications by breaking down pieces of work into issues. Issues can represent tasks, software bugs, feature requests or any other type of project work.</p><p><br></p><h3>Jira Software issue types:</h3><p><br></p><h1><strong>Bug</strong></h1><p>A bug is a problem which impairs or prevents the functions of a product.</p><p><br></p><h1><strong>Story</strong></h1><p>A user story is the smallest unit of work that needs to be done.</p><p><br></p><h1><strong>Task</strong></h1><p>A task represents work that needs to be done.</p>`;
  const desc2 = `<h2>Key terms to know</h2><p><br></p><h3>Issues</h3><p>A Jira issue is a single work item tracked from creation to completion.</p><p><br></p><h3>Projects</h3><p>A project is a collection of issues held in common by purpose or context.</p><p><br></p><h3>Workflows</h3><p>Workflows represent the sequential path an issue takes from creation to completion.</p>`;
  const desc3 = `<p>An issue's status indicates its current place in the project's workflow.</p><p><br></p><h3>Statuses</h3><p>Backlog, Selected, In Progress, and Done.</p>`;
  const desc4 = `<p>You can use rich text with images and formatting in issue descriptions.</p>`;
  const desc5 = `<p>An issue's priority indicates its relative importance from Lowest to Highest.</p>`;
  const desc6 = `<h2>Try assigning Pickle Rick to this issue.</h2>`;
  const desc7 = `<p>Track how much time has been spent working on an issue, and how much remains.</p>`;
  const desc8 = `<p>Adding comments to an issue is a useful way to record additional detail and collaborate with team members.</p>`;

  const issues = await Promise.all([
    prisma.issue.create({ data: { title: 'This is an issue of type: Task.', type: IssueType.TASK, status: IssueStatus.BACKLOG, priority: IssuePriority.HIGH, listPosition: 1, description: desc1, descriptionText: striptags(desc1), estimate: 8, timeSpent: 4, reporterId: yoda.id, projectId, users: { connect: [{ id: rick.id }] } } }),
    prisma.issue.create({ data: { title: "Click on an issue to see what's behind it.", type: IssueType.TASK, status: IssueStatus.BACKLOG, priority: IssuePriority.LOW, listPosition: 2, description: desc2, descriptionText: striptags(desc2), estimate: 5, timeSpent: 2, reporterId: gaben.id, projectId, users: { connect: [{ id: rick.id }] } } }),
    prisma.issue.create({ data: { title: 'Try dragging issues to different columns to transition their status.', type: IssueType.STORY, status: IssueStatus.BACKLOG, priority: IssuePriority.MEDIUM, listPosition: 3, description: desc3, descriptionText: striptags(desc3), estimate: 15, timeSpent: 12, reporterId: yoda.id, projectId } }),
    prisma.issue.create({ data: { title: 'You can use rich text with images in issue descriptions.', type: IssueType.STORY, status: IssueStatus.BACKLOG, priority: IssuePriority.LOWEST, listPosition: 4, description: desc4, descriptionText: striptags(desc4), estimate: 4, timeSpent: 4, reporterId: leia.id, projectId, users: { connect: [{ id: gaben.id }] } } }),
    prisma.issue.create({ data: { title: 'Each issue can be assigned priority from lowest to highest.', type: IssueType.TASK, status: IssueStatus.SELECTED, priority: IssuePriority.HIGHEST, listPosition: 5, description: desc5, descriptionText: striptags(desc5), estimate: 4, timeSpent: 1, reporterId: gaben.id, projectId } }),
    prisma.issue.create({ data: { title: 'Each issue has a single reporter but can have multiple assignees.', type: IssueType.STORY, status: IssueStatus.SELECTED, priority: IssuePriority.HIGH, listPosition: 6, description: desc6, descriptionText: striptags(desc6), estimate: 6, timeSpent: 3, reporterId: yoda.id, projectId, users: { connect: [{ id: yoda.id }, { id: gaben.id }] } } }),
    prisma.issue.create({ data: { title: 'You can track how many hours were spent working on an issue, and how many hours remain.', type: IssueType.TASK, status: IssueStatus.INPROGRESS, priority: IssuePriority.LOWEST, listPosition: 7, description: desc7, descriptionText: striptags(desc7), estimate: 12, timeSpent: 11, reporterId: rick.id, projectId, users: { connect: [{ id: rick.id }] } } }),
    prisma.issue.create({ data: { title: 'Try leaving a comment on this issue.', type: IssueType.TASK, status: IssueStatus.DONE, priority: IssuePriority.MEDIUM, listPosition: 8, description: desc8, descriptionText: striptags(desc8), estimate: 10, timeSpent: 2, reporterId: leia.id, projectId, users: { connect: [{ id: yoda.id }] } } }),
  ]);

  await Promise.all([
    prisma.comment.create({ data: { body: 'An old silent pond...\nA frog jumps into the pond,\nsplash! Silence again.', issueId: issues[0].id, userId: gaben.id } }),
    prisma.comment.create({ data: { body: 'Autumn moonlight\na worm digs silently\ninto the chestnut.', issueId: issues[1].id, userId: yoda.id } }),
    prisma.comment.create({ data: { body: 'In the twilight rain\nthese brilliant-hued hibiscus\na lovely sunset.', issueId: issues[2].id, userId: leia.id } }),
    prisma.comment.create({ data: { body: 'A summer river being crossed\nhow pleasing\nwith sandals in my hands!', issueId: issues[3].id, userId: rick.id } }),
  ]);
};

export default ensureDemoProject;

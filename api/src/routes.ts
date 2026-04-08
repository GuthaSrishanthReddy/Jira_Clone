import * as authentication from 'controllers/authentication';
import * as ai from 'controllers/ai';
import * as comments from 'controllers/comments';
import * as issues from 'controllers/issues';
import * as projects from 'controllers/projects';
import * as github from 'controllers/github';
import * as test from 'controllers/test';
import * as users from 'controllers/users';
import { requireManager } from 'middleware/authorization';

export const attachPublicRoutes = (app: any): void => {
  if (process.env.NODE_ENV === 'test') {
    app.delete('/test/reset-database', test.resetDatabase);
    app.post('/test/create-account', test.createAccount);
  }

  app.post('/authentication/guest', authentication.createGuestAccount);
  app.get('/authentication/users', authentication.getLoginUsers);
  app.post('/authentication/login', authentication.login);
};

export const attachPrivateRoutes = (app: any): void => {
  app.post('/ai/issue-draft', ai.createIssueDraft);

  app.post('/comments', comments.create);
  app.put('/comments/:commentId', comments.update);
  app.delete('/comments/:commentId', comments.remove);

  app.get('/issues', issues.getProjectIssues);
  app.get('/issues/:issueId', issues.getIssueWithUsersAndComments);
  app.post('/issues', issues.create);
  app.put('/issues/:issueId', issues.update);
  app.delete('/issues/:issueId', issues.remove);

  app.get('/projects', projects.getAllProjectsWithStats);
  app.get('/project', projects.getProjectWithUsersAndIssues);
  app.put('/project', requireManager, projects.update);  // manager only

  // All GitHub / AI scanning routes are manager-only
  app.put('/project/github', requireManager, github.updateGithubSettings);
  app.post('/project/github/scan', requireManager, github.triggerScan);
  app.post('/project/github/scan/full', requireManager, github.triggerFullScan);
  app.get('/project/github/findings', requireManager, github.getFindings);
  app.get('/project/github/scans', requireManager, github.getScans);
  app.post('/project/github/findings/:findingId/promote', requireManager, github.promoteToIssue);

  app.get('/currentUser', users.getCurrentUser);
};

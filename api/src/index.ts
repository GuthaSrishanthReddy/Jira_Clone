import 'module-alias/register';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';

import { addRespondToResponse } from 'middleware/response';
import { authenticateUser } from 'middleware/authentication';
import { handleError } from 'middleware/errors';
import { RouteNotFoundError } from 'errors';
import { runAllEnabledScans } from 'services/repoScanner';
import { ensureCompanionProjects } from 'database/ensureDemoProject';

import { attachPublicRoutes, attachPrivateRoutes } from './routes';

const initializeExpress = (): void => {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:8081' }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(addRespondToResponse);

  attachPublicRoutes(app);

  app.use('/', authenticateUser);

  attachPrivateRoutes(app);

  app.use((req, _res, next) => next(new RouteNotFoundError(req.originalUrl)));
  app.use(handleError);

  app.listen(process.env.PORT || 3000);
};

const initializeCronJobs = (): void => {
  // Run AI repo scans every 30 minutes for all enabled projects
  cron.schedule('*/30 * * * *', async () => {
    console.log('[Cron] Running scheduled AI repo scans...');
    try {
      await runAllEnabledScans();
    } catch (err) {
      console.error('[Cron] Scheduled scan error:', err);
    }
  });
};

initializeExpress();
initializeCronJobs();

// Seed companion projects once at startup (not on every login request)
ensureCompanionProjects().catch(err =>
  console.error('[Startup] Failed to seed companion projects:', err),
);

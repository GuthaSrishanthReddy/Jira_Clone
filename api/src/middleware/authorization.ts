import { catchErrors, ForbiddenError } from 'errors';

/**
 * Middleware that restricts access to manager-role users only.
 * Attach to any route that should not be accessible by regular members.
 */
export const requireManager = catchErrors(async (req, _res, next) => {
  if (req.currentUser.role !== 'manager') {
    throw new ForbiddenError('This action requires a manager role.');
  }
  next();
});

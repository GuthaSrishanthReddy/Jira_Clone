import { catchErrors } from 'errors';
import { serializeDemoUser } from 'utils/demoUsers';

export const getCurrentUser = catchErrors((req, res) => {
  res.respond({ currentUser: serializeDemoUser(req.currentUser) });
});

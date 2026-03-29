import { pick } from 'lodash';
import { Issue } from '@prisma/client';

export const issuePartial = (issue: Issue) =>
  pick(issue, [
    'id',
    'title',
    'type',
    'status',
    'priority',
    'listPosition',
    'createdAt',
    'updatedAt',
  ]);

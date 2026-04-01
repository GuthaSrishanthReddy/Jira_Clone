import React from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';

import { Breadcrumbs } from 'shared/components';
import { IssueStatusCopy, IssuePriorityCopy, IssueTypeCopy } from 'shared/constants/issues';

import { Page, Heading, Subheading, Feed, FeedCard, FeedDate, FeedBody, FeedTitle, FeedMeta, FeedTags, Tag } from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
};

const Activity = ({ project }) => {
  const activityItems = orderBy(
    project.issues.map(issue => ({
      id: issue.id,
      title: issue.title,
      type: issue.type,
      status: issue.status,
      priority: issue.priority,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
      assignees: project.users.filter(user => issue.userIds.includes(user.id)).map(user => user.name),
    })),
    ['updatedAt'],
    ['desc'],
  );

  return (
    <Page>
      <Breadcrumbs items={['Projects', project.name, 'Activity']} />
      <Heading>Activity</Heading>
      <Subheading>
        Follow what has been changing across the project, from newly created work to the issues that
        have moved most recently.
      </Subheading>

      <Feed>
        {activityItems.map(item => (
          <FeedCard key={item.id}>
            <FeedDate>{new Date(item.updatedAt).toLocaleString()}</FeedDate>
            <FeedBody>
              <FeedTitle>{item.title}</FeedTitle>
              <FeedMeta>
                {item.updatedAt === item.createdAt
                  ? 'Issue created in the workspace.'
                  : 'Issue details or workflow state changed recently.'}
                {item.assignees.length > 0 ? ` Assigned to ${item.assignees.join(', ')}.` : ' No assignee yet.'}
              </FeedMeta>
              <FeedTags>
                <Tag>{`${item.type}-${item.id}`}</Tag>
                <Tag>{IssueTypeCopy[item.type]}</Tag>
                <Tag>{IssueStatusCopy[item.status]}</Tag>
                <Tag>{IssuePriorityCopy[item.priority]}</Tag>
              </FeedTags>
            </FeedBody>
          </FeedCard>
        ))}
      </Feed>
    </Page>
  );
};

Activity.propTypes = propTypes;

export default Activity;

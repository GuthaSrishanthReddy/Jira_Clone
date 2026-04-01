import React from 'react';
import PropTypes from 'prop-types';
import { orderBy, sumBy } from 'lodash';

import useCurrentUser from 'shared/hooks/currentUser';
import { Breadcrumbs } from 'shared/components';
import { IssueStatus, IssueStatusCopy, IssuePriorityCopy } from 'shared/constants/issues';

import {
  Page,
  Heading,
  Subheading,
  Hero,
  HeroText,
  HeroTitle,
  HeroDescription,
  HeroStats,
  StatCard,
  StatLabel,
  StatValue,
  Grid,
  Card,
  CardTitle,
  List,
  ListItem,
  ItemMain,
  ItemTitle,
  ItemMeta,
  Badge,
  EmptyState,
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
};

const Dashboard = ({ project }) => {
  const { currentUser } = useCurrentUser();

  const myIssues = currentUser
    ? project.issues.filter(issue => issue.userIds.includes(currentUser.id))
    : [];
  const recentIssues = orderBy(project.issues, ['updatedAt'], ['desc']).slice(0, 6);
  const teamLoad = orderBy(
    project.users.map(user => ({
      ...user,
      assignedCount: project.issues.filter(issue => issue.userIds.includes(user.id)).length,
    })),
    ['assignedCount', 'name'],
    ['desc', 'asc'],
  );
  const completionRate = project.issues.length
    ? Math.round(
        (project.issues.filter(issue => issue.status === IssueStatus.DONE).length /
          project.issues.length) *
          100,
      )
    : 0;
  const estimatedHours = sumBy(project.issues, issue => issue.estimate || 0);
  const loggedHours = sumBy(project.issues, issue => issue.timeSpent || 0);

  return (
    <Page>
      <Breadcrumbs items={['Projects', project.name, 'Dashboard']} />
      <Heading>Dashboard</Heading>
      <Subheading>
        Keep an eye on your Jira-style workspace with a quick read on your work, recent issue
        movement, and overall delivery health.
      </Subheading>

      <Hero>
        <HeroText>
          <HeroTitle>{currentUser ? `${currentUser.name}, here is your workspace` : project.name}</HeroTitle>
          <HeroDescription>
            Review personal assignments, delivery momentum, and where the team is spending time
            without leaving the project.
          </HeroDescription>
        </HeroText>
        <HeroStats>
          <StatCard>
            <StatLabel>My issues</StatLabel>
            <StatValue>{myIssues.length}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Completion</StatLabel>
            <StatValue>{`${completionRate}%`}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>Logged / Est.</StatLabel>
            <StatValue>{`${loggedHours}h / ${estimatedHours}h`}</StatValue>
          </StatCard>
        </HeroStats>
      </Hero>

      <Grid>
        <Card>
          <CardTitle>My work</CardTitle>
          {myIssues.length === 0 ? (
            <EmptyState>You do not have assigned issues right now.</EmptyState>
          ) : (
            <List>
              {orderBy(myIssues, ['updatedAt'], ['desc']).slice(0, 6).map(issue => (
                <ListItem key={issue.id}>
                  <ItemMain>
                    <ItemTitle>{issue.title}</ItemTitle>
                    <ItemMeta>{`${IssueStatusCopy[issue.status]} • ${IssuePriorityCopy[issue.priority]}`}</ItemMeta>
                  </ItemMain>
                  <Badge>{`${issue.type}-${issue.id}`}</Badge>
                </ListItem>
              ))}
            </List>
          )}
        </Card>

        <Card>
          <CardTitle>Recent issue activity</CardTitle>
          <List>
            {recentIssues.map(issue => (
              <ListItem key={issue.id}>
                <ItemMain>
                  <ItemTitle>{issue.title}</ItemTitle>
                  <ItemMeta>{`Updated ${new Date(issue.updatedAt).toLocaleDateString()}`}</ItemMeta>
                </ItemMain>
                <Badge>{IssueStatusCopy[issue.status]}</Badge>
              </ListItem>
            ))}
          </List>
        </Card>

        <Card>
          <CardTitle>Team workload</CardTitle>
          <List>
            {teamLoad.map(user => (
              <ListItem key={user.id}>
                <ItemMain>
                  <ItemTitle>{user.name}</ItemTitle>
                  <ItemMeta>{user.title || user.email}</ItemMeta>
                </ItemMain>
                <Badge>{`${user.assignedCount} issues`}</Badge>
              </ListItem>
            ))}
          </List>
        </Card>

        <Card>
          <CardTitle>Release snapshot</CardTitle>
          <List>
            {Object.values(IssueStatus).map(status => (
              <ListItem key={status}>
                <ItemMain>
                  <ItemTitle>{IssueStatusCopy[status]}</ItemTitle>
                  <ItemMeta>Current board count</ItemMeta>
                </ItemMain>
                <Badge>{project.issues.filter(issue => issue.status === status).length}</Badge>
              </ListItem>
            ))}
          </List>
        </Card>
      </Grid>
    </Page>
  );
};

Dashboard.propTypes = propTypes;

export default Dashboard;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import useCurrentUser from 'shared/hooks/currentUser';
import { removeStoredAuthToken } from 'shared/utils/authToken';
import { IssuePriorityCopy, IssueStatus, IssueStatusCopy, IssueTypeCopy } from 'shared/constants/issues';
import { Breadcrumbs, Button } from 'shared/components';

import {
  Page,
  Heading,
  Subheading,
  Hero,
  Identity,
  ProfileAvatar,
  IdentityText,
  Name,
  Role,
  Email,
  Actions,
  Grid,
  Card,
  CardTitle,
  List,
  ListItem,
  SelectableListItem,
  Label,
  Value,
  Hint,
  DetailCard,
  DetailHeader,
  DetailTitle,
  DetailDescription,
  DetailList,
  DetailListItem,
  DetailPrimary,
  DetailTitleText,
  DetailMeta,
  DetailBadge,
  DetailEmpty,
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
};

const ProjectProfile = ({ project }) => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser({ cachePolicy: 'no-cache' });
  const [activeWorkloadView, setActiveWorkloadView] = useState('assigned');

  const handleSignOut = () => {
    removeStoredAuthToken();
    navigate('/', { replace: true });
  };

  if (!currentUser) {
    return null;
  }

  const assignedIssues = project.issues.filter(issue => issue.userIds.includes(currentUser.id));
  const completedIssues = assignedIssues.filter(issue => issue.status === IssueStatus.DONE);

  const workloadViews = {
    assigned: {
      title: 'Assigned issues',
      value: assignedIssues.length,
      description: 'Issues currently assigned to you in this demo workspace.',
      items: assignedIssues,
    },
    completed: {
      title: 'Completed issues',
      value: completedIssues.length,
      description: 'Assigned issues that have already reached Done.',
      items: completedIssues,
    },
    team: {
      title: 'Team members',
      value: project.users.length,
      description: 'Everyone who can collaborate inside this seeded project.',
      items: project.users,
    },
  };

  const activeView = workloadViews[activeWorkloadView];

  return (
    <Page>
      <Breadcrumbs items={['Projects', project.name, 'Profile']} />
      <Heading>Profile</Heading>
      <Subheading>
        Manage your demo account, review your workspace role, and sign out when you want to return
        to the landing page.
      </Subheading>

      <Hero>
        <Identity>
          <ProfileAvatar avatarUrl={currentUser.avatarUrl} name={currentUser.name} size={72} />
          <IdentityText>
            <Name>{currentUser.name}</Name>
            <Role>{currentUser.title}</Role>
            <Email>{currentUser.email}</Email>
          </IdentityText>
        </Identity>

        <Actions>
          <Button type="button" variant="secondary" onClick={() => navigate('/project/board')}>
            Open board
          </Button>
          <Button type="button" variant="danger" onClick={handleSignOut}>
            Sign out
          </Button>
        </Actions>
      </Hero>

      <Grid>
        <Card>
          <CardTitle>Account details</CardTitle>
          <List>
            <ListItem>
              <Label>User type</Label>
              <Value>{currentUser.userType}</Value>
            </ListItem>
            <ListItem>
              <Label>Project role</Label>
              <Value>{currentUser.title}</Value>
            </ListItem>
            <ListItem>
              <Label>Workspace access</Label>
              <Value>{project.name}</Value>
            </ListItem>
          </List>
        </Card>

        <Card>
          <CardTitle>Your workload</CardTitle>
          <List>
            <SelectableListItem
              as="button"
              type="button"
              $isActive={activeWorkloadView === 'assigned'}
              onClick={() => setActiveWorkloadView('assigned')}
            >
              <Label>Assigned issues</Label>
              <Value>{assignedIssues.length}</Value>
            </SelectableListItem>
            <SelectableListItem
              as="button"
              type="button"
              $isActive={activeWorkloadView === 'completed'}
              onClick={() => setActiveWorkloadView('completed')}
            >
              <Label>Completed issues</Label>
              <Value>{completedIssues.length}</Value>
            </SelectableListItem>
            <SelectableListItem
              as="button"
              type="button"
              $isActive={activeWorkloadView === 'team'}
              onClick={() => setActiveWorkloadView('team')}
            >
              <Label>Team size</Label>
              <Value>{project.users.length}</Value>
            </SelectableListItem>
          </List>
          <DetailCard>
            <DetailHeader>
              <div>
                <DetailTitle>{activeView.title}</DetailTitle>
                <DetailDescription>{activeView.description}</DetailDescription>
              </div>
              <DetailBadge>{activeView.value}</DetailBadge>
            </DetailHeader>

            <DetailList>
              {activeWorkloadView === 'team' ? (
                activeView.items.map(member => (
                  <DetailListItem key={member.id}>
                    <DetailPrimary>
                      <DetailTitleText>{member.name}</DetailTitleText>
                      <DetailMeta>{member.email}</DetailMeta>
                    </DetailPrimary>
                    <DetailBadge>{member.title}</DetailBadge>
                  </DetailListItem>
                ))
              ) : activeView.items.length > 0 ? (
                activeView.items.map(issue => (
                  <DetailListItem key={issue.id}>
                    <DetailPrimary>
                      <DetailTitleText>{issue.title}</DetailTitleText>
                      <DetailMeta>
                        {`${IssueTypeCopy[issue.type]}-${issue.id}`}
                        {issue.priority ? ` - ${IssuePriorityCopy[issue.priority]}` : ''}
                      </DetailMeta>
                    </DetailPrimary>
                    <DetailBadge>{IssueStatusCopy[issue.status]}</DetailBadge>
                  </DetailListItem>
                ))
              ) : (
                <DetailEmpty>
                  {activeWorkloadView === 'completed'
                    ? 'No completed issues are assigned to this user yet.'
                    : 'No issues are assigned to this user yet.'}
                </DetailEmpty>
              )}
            </DetailList>
          </DetailCard>
          <Hint>
            This profile is tied to the seeded Jira-style demo login, so you can switch accounts any
            time from the home page after signing out.
          </Hint>
        </Card>
      </Grid>
    </Page>
  );
};

ProjectProfile.propTypes = propTypes;

export default ProjectProfile;

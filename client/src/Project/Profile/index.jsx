import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import useCurrentUser from 'shared/hooks/currentUser';
import { removeStoredAuthToken } from 'shared/utils/authToken';
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
  Label,
  Value,
  Hint,
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
};

const ProjectProfile = ({ project }) => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser({ cachePolicy: 'no-cache' });

  const handleSignOut = () => {
    removeStoredAuthToken();
    navigate('/', { replace: true });
  };

  if (!currentUser) {
    return null;
  }

  const assignedIssues = project.issues.filter(issue => issue.userIds.includes(currentUser.id));
  const completedIssues = assignedIssues.filter(issue => issue.status === 'done');

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
            <ListItem>
              <Label>Assigned issues</Label>
              <Value>{assignedIssues.length}</Value>
            </ListItem>
            <ListItem>
              <Label>Completed issues</Label>
              <Value>{completedIssues.length}</Value>
            </ListItem>
            <ListItem>
              <Label>Team size</Label>
              <Value>{project.users.length}</Value>
            </ListItem>
          </List>
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

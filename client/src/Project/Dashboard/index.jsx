import React from 'react';
import PropTypes from 'prop-types';
import { orderBy, sumBy } from 'lodash';

import useCurrentUser from 'shared/hooks/currentUser';
import { IssueStatus, IssueStatusCopy, IssuePriority } from 'shared/constants/issues';
import { issueTypeColors, issueStatusBackgroundColors, issueStatusColors } from 'shared/utils/styles';

import {
  Page,
  UserBanner,
  BannerLeft,
  UserAvatarImg,
  UserAvatarFallback,
  BannerUserInfo,
  BannerLabel,
  BannerName,
  BannerRole,
  BannerStats,
  BannerStat,
  BannerStatValue,
  BannerStatLabel,
  HubLink,
  SectionHeader,
  SectionTitle,
  SectionBadge,
  Grid,
  Card,
  List,
  ListItem,
  ItemLeft,
  TypeDot,
  ItemMain,
  ItemTitle,
  ItemMeta,
  StatusBadge,
  SnapshotList,
  SnapshotRow,
  SnapshotRowHeader,
  SnapshotLabel,
  SnapshotCount,
  SnapshotBar,
  SnapshotFill,
  WorkloadItem,
  WorkloadAvatar,
  WorkloadAvatarFallback,
  WorkloadInfo,
  WorkloadName,
  WorkloadMeta,
  WorkloadBadge,
  EmptyState,
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
};

const avatarColors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const getAvatarColor = name => avatarColors[(name || '').charCodeAt(0) % avatarColors.length];
const getInitials = name =>
  (name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

const priorityColors = {
  5: '#DC2626', 4: '#EF4444', 3: '#F59E0B', 2: '#22C55E', 1: '#86EFAC',
};

const snapshotBarColors = {
  [IssueStatus.BACKLOG]: '#94A3B8',
  [IssueStatus.SELECTED]: '#D97706',
  [IssueStatus.INPROGRESS]: '#2563EB',
  [IssueStatus.DONE]: '#16A34A',
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

  const totalIssues = project.issues.length;
  const doneCount = project.issues.filter(i => i.status === IssueStatus.DONE).length;
  const completionRate = totalIssues ? Math.round((doneCount / totalIssues) * 100) : 0;
  const estimatedHours = sumBy(project.issues, i => i.estimate || 0);
  const loggedHours = sumBy(project.issues, i => i.timeSpent || 0);

  return (
    <Page>
      {/* ── Signed-in user banner ── */}
      <UserBanner>
        <BannerLeft>
          {currentUser?.avatarUrl ? (
            <UserAvatarImg src={currentUser.avatarUrl} alt={currentUser.name} />
          ) : (
            <UserAvatarFallback>{getInitials(currentUser?.name)}</UserAvatarFallback>
          )}
          <BannerUserInfo>
            <BannerLabel>Signed in as</BannerLabel>
            <BannerName>{currentUser?.name || 'You'}</BannerName>
            <BannerRole>
              {currentUser?.title || 'Team member'} · {project.name}
            </BannerRole>
          </BannerUserInfo>
        </BannerLeft>

        <BannerStats>
          <BannerStat>
            <BannerStatValue>{myIssues.length}</BannerStatValue>
            <BannerStatLabel>My Issues</BannerStatLabel>
          </BannerStat>
          <BannerStat>
            <BannerStatValue>{completionRate}%</BannerStatValue>
            <BannerStatLabel>Done</BannerStatLabel>
          </BannerStat>
          <BannerStat>
            <BannerStatValue>{loggedHours}h</BannerStatValue>
            <BannerStatLabel>Logged</BannerStatLabel>
          </BannerStat>
          <BannerStat>
            <BannerStatValue>{estimatedHours}h</BannerStatValue>
            <BannerStatLabel>Estimated</BannerStatLabel>
          </BannerStat>
        </BannerStats>

        <HubLink to="/projects">
          ← All projects
        </HubLink>
      </UserBanner>

      <Grid>
        {/* ── My work ── */}
        <Card>
          <SectionHeader>
            <SectionTitle>My work</SectionTitle>
            {myIssues.length > 0 && <SectionBadge>{myIssues.length}</SectionBadge>}
          </SectionHeader>
          {myIssues.length === 0 ? (
            <EmptyState>No issues assigned to you right now.</EmptyState>
          ) : (
            <List>
              {orderBy(myIssues, ['updatedAt'], ['desc']).slice(0, 6).map(issue => (
                <ListItem key={issue.id}>
                  <ItemLeft>
                    <TypeDot $color={issueTypeColors[issue.type]} />
                    <ItemMain>
                      <ItemTitle>{issue.title}</ItemTitle>
                      <ItemMeta>
                        {IssueStatusCopy[issue.status]}
                        {issue.priority && ` · P${issue.priority}`}
                      </ItemMeta>
                    </ItemMain>
                  </ItemLeft>
                  <StatusBadge
                    $bg={issueStatusBackgroundColors[issue.status]}
                    $color={issueStatusColors[issue.status]}
                  >
                    {IssueStatusCopy[issue.status]}
                  </StatusBadge>
                </ListItem>
              ))}
            </List>
          )}
        </Card>

        {/* ── Recent activity ── */}
        <Card>
          <SectionHeader>
            <SectionTitle>Recent activity</SectionTitle>
          </SectionHeader>
          <List>
            {recentIssues.map(issue => (
              <ListItem key={issue.id}>
                <ItemLeft>
                  <TypeDot $color={issueTypeColors[issue.type]} />
                  <ItemMain>
                    <ItemTitle>{issue.title}</ItemTitle>
                    <ItemMeta>
                      Updated {new Date(issue.updatedAt).toLocaleDateString()}
                    </ItemMeta>
                  </ItemMain>
                </ItemLeft>
                <StatusBadge
                  $bg={issueStatusBackgroundColors[issue.status]}
                  $color={issueStatusColors[issue.status]}
                >
                  {IssueStatusCopy[issue.status]}
                </StatusBadge>
              </ListItem>
            ))}
          </List>
        </Card>

        {/* ── Team workload ── */}
        <Card>
          <SectionHeader>
            <SectionTitle>Team workload</SectionTitle>
          </SectionHeader>
          <List>
            {teamLoad.map(user => (
              <WorkloadItem key={user.id}>
                {user.avatarUrl ? (
                  <WorkloadAvatar src={user.avatarUrl} alt={user.name} />
                ) : (
                  <WorkloadAvatarFallback $bg={getAvatarColor(user.name)}>
                    {getInitials(user.name)}
                  </WorkloadAvatarFallback>
                )}
                <WorkloadInfo>
                  <WorkloadName>
                    {user.name}
                    {currentUser && user.id === currentUser.id && (
                      <span style={{ marginLeft: 6, fontSize: 11, color: '#4F46E5', fontWeight: 700 }}>you</span>
                    )}
                  </WorkloadName>
                  <WorkloadMeta>{user.title || user.email}</WorkloadMeta>
                </WorkloadInfo>
                <WorkloadBadge>{user.assignedCount}</WorkloadBadge>
              </WorkloadItem>
            ))}
          </List>
        </Card>

        {/* ── Release snapshot ── */}
        <Card>
          <SectionHeader>
            <SectionTitle>Release snapshot</SectionTitle>
            <SectionBadge>{totalIssues} total</SectionBadge>
          </SectionHeader>
          <SnapshotList>
            {Object.values(IssueStatus).map(status => {
              const count = project.issues.filter(i => i.status === status).length;
              const pct = totalIssues ? Math.round((count / totalIssues) * 100) : 0;
              return (
                <SnapshotRow key={status}>
                  <SnapshotRowHeader>
                    <SnapshotLabel>{IssueStatusCopy[status]}</SnapshotLabel>
                    <SnapshotCount>{count} · {pct}%</SnapshotCount>
                  </SnapshotRowHeader>
                  <SnapshotBar>
                    <SnapshotFill $pct={pct} $color={snapshotBarColors[status]} />
                  </SnapshotBar>
                </SnapshotRow>
              );
            })}
          </SnapshotList>
        </Card>
      </Grid>
    </Page>
  );
};

Dashboard.propTypes = propTypes;

export default Dashboard;

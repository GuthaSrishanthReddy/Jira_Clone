import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { groupBy, orderBy, sumBy } from 'lodash';

import {
  Breadcrumbs,
  Avatar,
  IssuePriorityIcon,
  IssueTypeIcon,
} from 'shared/components';
import {
  IssuePriorityCopy,
  IssueStatus,
  IssueStatusCopy,
  IssueType,
  IssueTypeCopy,
} from 'shared/constants/issues';

import {
  Page,
  Heading,
  Subheading,
  Hero,
  HeroTitle,
  HeroText,
  HeroStats,
  StatCard,
  StatLabel,
  StatValue,
  Section,
  SectionTitle,
  Grid,
  Card,
  CardTitle,
  CardBody,
  List,
  ListItem,
  Badge,
  MutedText,
  TeamList,
  TeamMember,
  TeamMeta,
  InlineMeta,
} from './Styles';

const propTypes = {
  moduleId: PropTypes.oneOf(['issues', 'pages', 'reports', 'components']).isRequired,
  project: PropTypes.object.isRequired,
};

const moduleMeta = {
  issues: {
    title: 'Issues and filters',
    description:
      'Browse the full issue set with grouped summaries for status, priority, and assignment.',
  },
  pages: {
    title: 'Pages',
    description:
      'Keep a lightweight knowledge hub for the project with the brief, workflow notes, and team references.',
  },
  reports: {
    title: 'Reports',
    description:
      'Review delivery health, workload mix, and progress trends derived from the current project data.',
  },
  components: {
    title: 'Components',
    description:
      'See the work split by issue type so the demo project still has a useful structure view without a separate components model.',
  },
};

const ProjectModules = ({ moduleId, project }) => {
  const meta = moduleMeta[moduleId];

  return (
    <Page>
      <Breadcrumbs items={['Projects', project.name, meta.title]} />
      <Heading>{meta.title}</Heading>
      <Subheading>{meta.description}</Subheading>

      <Hero>
        <div>
          <HeroTitle>{project.name}</HeroTitle>
          <HeroText>{getHeroText(moduleId, project)}</HeroText>
        </div>
        <HeroStats>
          {getHeroStats(moduleId, project).map(stat => (
            <StatCard key={stat.label}>
              <StatLabel>{stat.label}</StatLabel>
              <StatValue>{stat.value}</StatValue>
            </StatCard>
          ))}
        </HeroStats>
      </Hero>

      {renderModuleBody(moduleId, project)}
    </Page>
  );
};

const renderModuleBody = (moduleId, project) => {
  switch (moduleId) {
    case 'issues':
      return <IssuesModule project={project} />;
    case 'pages':
      return <PagesModule project={project} />;
    case 'reports':
      return <ReportsModule project={project} />;
    case 'components':
      return <ComponentsModule project={project} />;
    default:
      return null;
  }
};

const IssuesModule = ({ project }) => {
  const assignedIssues = getIssues(project, issue => issue.userIds.length > 0);
  const unassignedIssues = getIssues(project, issue => issue.userIds.length === 0);
  const groupedByPriority = groupBy(project.issues, 'priority');

  return (
    <Section>
      <SectionTitle>Issue overview</SectionTitle>
      <Grid>
        <Card>
          <CardTitle>Assigned work</CardTitle>
          <CardBody>
            <List>
              {assignedIssues.slice(0, 8).map(issue => (
                <IssueListItem key={issue.id} issue={issue} />
              ))}
            </List>
          </CardBody>
        </Card>

        <Card>
          <CardTitle>Unassigned work</CardTitle>
          <CardBody>
            {unassignedIssues.length === 0 ? (
              <MutedText>Every issue currently has an owner.</MutedText>
            ) : (
              <List>
                {unassignedIssues.slice(0, 8).map(issue => (
                  <IssueListItem key={issue.id} issue={issue} />
                ))}
              </List>
            )}
          </CardBody>
        </Card>
      </Grid>

      <Grid>
        <Card>
          <CardTitle>Priority breakdown</CardTitle>
          <CardBody>
            <List>
              {orderBy(
                Object.keys(groupedByPriority).map(priority => ({
                  priority,
                  count: groupedByPriority[priority].length,
                })),
                ['priority'],
                ['desc'],
              ).map(item => (
                <ListItem key={item.priority}>
                  <InlineMeta>
                    <IssuePriorityIcon priority={item.priority} />
                    <span>{IssuePriorityCopy[item.priority]}</span>
                  </InlineMeta>
                  <Badge>{item.count}</Badge>
                </ListItem>
              ))}
            </List>
          </CardBody>
        </Card>

        <Card>
          <CardTitle>Team coverage</CardTitle>
          <CardBody>
            <TeamList>
              {project.users.map(user => (
                <TeamMember key={user.id}>
                  <Avatar avatarUrl={user.avatarUrl} name={user.name} size={32} />
                  <TeamMeta>
                    <strong>{user.name}</strong>
                    <MutedText>{`${countIssuesForUser(project.issues, user.id)} assigned issues`}</MutedText>
                  </TeamMeta>
                </TeamMember>
              ))}
            </TeamList>
          </CardBody>
        </Card>
      </Grid>
    </Section>
  );
};

const PagesModule = ({ project }) => (
  <Section>
    <SectionTitle>Project pages</SectionTitle>
    <Grid>
      <Card>
        <CardTitle>Project brief</CardTitle>
        <CardBody>
          {project.description ? (
            <div dangerouslySetInnerHTML={{ __html: project.description }} />
          ) : (
            <MutedText>No project brief has been added yet.</MutedText>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardTitle>Workflow notes</CardTitle>
        <CardBody>
          <List>
            {Object.values(IssueStatus).map(status => (
              <ListItem key={status}>
                <span>{IssueStatusCopy[status]}</span>
                <Badge>{countIssuesByStatus(project.issues, status)}</Badge>
              </ListItem>
            ))}
          </List>
        </CardBody>
      </Card>
    </Grid>

    <Grid>
      <Card>
        <CardTitle>Team directory</CardTitle>
        <CardBody>
          <TeamList>
            {project.users.map(user => (
              <TeamMember key={user.id}>
                <Avatar avatarUrl={user.avatarUrl} name={user.name} size={36} />
                <TeamMeta>
                  <strong>{user.name}</strong>
                  <MutedText>{user.email}</MutedText>
                </TeamMeta>
              </TeamMember>
            ))}
          </TeamList>
        </CardBody>
      </Card>

      <Card>
        <CardTitle>Knowledge base</CardTitle>
        <CardBody>
          <List>
            <ListItem>
              <span>Board workflow</span>
              <Badge>{`${project.issues.length} tracked issues`}</Badge>
            </ListItem>
            <ListItem>
              <span>Project category</span>
              <Badge>{project.category}</Badge>
            </ListItem>
            <ListItem>
              <span>Team members</span>
              <Badge>{project.users.length}</Badge>
            </ListItem>
          </List>
        </CardBody>
      </Card>
    </Grid>
  </Section>
);

const ReportsModule = ({ project }) => {
  const estimateTotal = sumBy(project.issues, issue => issue.estimate || 0);
  const spentTotal = sumBy(project.issues, issue => issue.timeSpent || 0);
  const doneCount = countIssuesByStatus(project.issues, IssueStatus.DONE);
  const completionRate = project.issues.length
    ? Math.round((doneCount / project.issues.length) * 100)
    : 0;
  const recentIssues = orderBy(project.issues, ['updatedAt'], ['desc']).slice(0, 6);

  return (
    <Section>
      <SectionTitle>Delivery reports</SectionTitle>
      <Grid>
        <Card>
          <CardTitle>Progress summary</CardTitle>
          <CardBody>
            <List>
              <ListItem>
                <span>Completion rate</span>
                <Badge>{`${completionRate}%`}</Badge>
              </ListItem>
              <ListItem>
                <span>Estimated hours</span>
                <Badge>{`${estimateTotal}h`}</Badge>
              </ListItem>
              <ListItem>
                <span>Logged hours</span>
                <Badge>{`${spentTotal}h`}</Badge>
              </ListItem>
            </List>
          </CardBody>
        </Card>

        <Card>
          <CardTitle>Issue mix</CardTitle>
          <CardBody>
            <List>
              {Object.values(IssueType).map(type => (
                <ListItem key={type}>
                  <InlineMeta>
                    <IssueTypeIcon type={type} />
                    <span>{IssueTypeCopy[type]}</span>
                  </InlineMeta>
                  <Badge>{countIssuesByType(project.issues, type)}</Badge>
                </ListItem>
              ))}
            </List>
          </CardBody>
        </Card>
      </Grid>

      <Card>
        <CardTitle>Recently updated</CardTitle>
        <CardBody>
          <List>
            {recentIssues.map(issue => (
              <ListItem key={issue.id}>
                <span>{issue.title}</span>
                <Badge>{moment(issue.updatedAt).fromNow()}</Badge>
              </ListItem>
            ))}
          </List>
        </CardBody>
      </Card>
    </Section>
  );
};

const ComponentsModule = ({ project }) => {
  const groupedByType = groupBy(project.issues, 'type');

  return (
    <Section>
      <SectionTitle>Component groups</SectionTitle>
      <Grid>
        {Object.values(IssueType).map(type => (
          <Card key={type}>
            <CardTitle>{IssueTypeCopy[type]}</CardTitle>
            <CardBody>
              <MutedText>{`${(groupedByType[type] || []).length} issues in this group`}</MutedText>
              <List>
                {(groupedByType[type] || []).slice(0, 8).map(issue => (
                  <IssueListItem key={issue.id} issue={issue} />
                ))}
              </List>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Section>
  );
};

const IssueListItem = ({ issue }) => (
  <ListItem>
    <InlineMeta>
      <IssueTypeIcon type={issue.type} />
      <span>{issue.title}</span>
    </InlineMeta>
    <Badge>{IssueStatusCopy[issue.status]}</Badge>
  </ListItem>
);

IssueListItem.propTypes = {
  issue: PropTypes.object.isRequired,
};

const getHeroText = (moduleId, project) => {
  switch (moduleId) {
    case 'issues':
      return `The project currently tracks ${project.issues.length} issues across ${project.users.length} team members.`;
    case 'pages':
      return 'Project pages bring the brief, workflow, and team context together in one place.';
    case 'reports':
      return `${countIssuesByStatus(project.issues, IssueStatus.INPROGRESS)} items are actively in progress right now.`;
    case 'components':
      return 'Components are grouped by issue type in this demo so work can still be explored by functional area.';
    default:
      return '';
  }
};

const getHeroStats = (moduleId, project) => {
  switch (moduleId) {
    case 'issues':
      return [
        { label: 'Total issues', value: project.issues.length },
        {
          label: 'Assigned',
          value: getIssues(project, issue => issue.userIds.length > 0).length,
        },
        {
          label: 'Unassigned',
          value: getIssues(project, issue => issue.userIds.length === 0).length,
        },
      ];
    case 'pages':
      return [
        { label: 'Pages', value: 4 },
        { label: 'Team members', value: project.users.length },
        { label: 'Workflow states', value: Object.keys(IssueStatus).length },
      ];
    case 'reports':
      return [
        {
          label: 'Completion',
          value: `${Math.round((countIssuesByStatus(project.issues, IssueStatus.DONE) / project.issues.length) * 100 || 0)}%`,
        },
        { label: 'Logged', value: `${sumBy(project.issues, issue => issue.timeSpent || 0)}h` },
        { label: 'Estimated', value: `${sumBy(project.issues, issue => issue.estimate || 0)}h` },
      ];
    case 'components':
      return [
        { label: 'Task', value: countIssuesByType(project.issues, IssueType.TASK) },
        { label: 'Bug', value: countIssuesByType(project.issues, IssueType.BUG) },
        { label: 'Story', value: countIssuesByType(project.issues, IssueType.STORY) },
      ];
    default:
      return [];
  }
};

const getIssues = (project, predicate) =>
  orderBy(project.issues.filter(predicate), ['updatedAt', 'listPosition'], ['desc', 'asc']);

const countIssuesByStatus = (issues, status) => issues.filter(issue => issue.status === status).length;

const countIssuesByType = (issues, type) => issues.filter(issue => issue.type === type).length;

const countIssuesForUser = (issues, userId) =>
  issues.filter(issue => issue.userIds.includes(userId)).length;

ProjectModules.propTypes = propTypes;

IssuesModule.propTypes = { project: PropTypes.object.isRequired };
PagesModule.propTypes = { project: PropTypes.object.isRequired };
ReportsModule.propTypes = { project: PropTypes.object.isRequired };
ComponentsModule.propTypes = { project: PropTypes.object.isRequired };

export default ProjectModules;

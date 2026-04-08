import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import useApi from 'shared/hooks/api';
import useCurrentUser from 'shared/hooks/currentUser';
import { removeStoredAuthToken } from 'shared/utils/authToken';
import { PageLoader, PageError, Logo } from 'shared/components';

import {
  categoryColors,
  Page,
  Topbar,
  TopbarBrand,
  TopbarSearch,
  SearchInput,
  SearchIcon,
  TopbarRight,
  TopbarUserChip,
  TopbarUserName,
  SignOutBtn,
  Hero,
  HeroLeft,
  HeroAvatar,
  HeroAvatarFallback,
  HeroText,
  HeroGreeting,
  HeroName,
  HeroRole,
  HeroStats,
  HeroStatCard,
  HeroStatValue,
  HeroStatLabel,
  Toolbar,
  FilterTabs,
  FilterTab,
  SortLabel,
  Grid,
  Card,
  CardAccent,
  CardBody,
  CardHeader,
  CardTitle,
  GithubBadge,
  CategoryBadge,
  CardDescription,
  TeamRow,
  AvatarStack,
  MemberAvatar,
  AvatarFallback,
  AvatarOverflow,
  TeamLabel,
  StatsRow,
  StatPill,
  StatDot,
  ProgressSection,
  ProgressHeader,
  ProgressLabel,
  ProgressValue,
  ProgressBar,
  ProgressFill,
  AIBadge,
  AIBadgeDot,
  CardFooter,
  LastActivity,
  CardActions,
  OpenBoardBtn,
  DashboardLink,
  EmptyState,
} from './Styles';

const avatarColors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const getAvatarColor = name =>
  avatarColors[(name || '').charCodeAt(0) % avatarColors.length];

const getInitials = name =>
  (name || '?')
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

const formatRelativeTime = dateStr => {
  if (!dateStr) return 'No activity';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
};

const getAIBadge = (stats, githubRepoName) => {
  if (!githubRepoName) {
    return { bg: '#F8FAFC', color: '#94A3B8', border: '#E2E8F0', dot: '#CBD5E1', label: 'Connect GitHub for AI insights' };
  }
  if (stats.criticalFindings > 0) {
    return { bg: '#FEF2F2', color: '#DC2626', border: '#FCA5A5', dot: '#EF4444', label: `${stats.criticalFindings} critical finding${stats.criticalFindings > 1 ? 's' : ''}` };
  }
  if (stats.highFindings > 0) {
    return { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A', dot: '#F59E0B', label: `${stats.highFindings} risk${stats.highFindings > 1 ? 's' : ''} detected` };
  }
  return { bg: '#F0FDF4', color: '#16A34A', border: '#86EFAC', dot: '#22C55E', label: 'AI Healthy' };
};

const FILTERS = ['all', 'software', 'marketing', 'business'];

const ProjectCard = ({ project, onOpenBoard, onOpenDashboard }) => {
  const catKey = (project.category || 'software').toLowerCase();
  const cat = categoryColors[catKey] || categoryColors.software;
  const { stats, users, githubRepoName, githubRepoOwner } = project;
  const visibleUsers = users.slice(0, 4);
  const overflowCount = users.length - visibleUsers.length;
  const aiBadge = getAIBadge(stats, githubRepoName);
  const progressColor = stats.completionRate === 100 ? '#16A34A' : cat.bg;

  return (
    <Card>
      <CardAccent $color={cat.bg} />
      <CardBody>
        <CardHeader>
          <div>
            <CardTitle>{project.name}</CardTitle>
            <CategoryBadge $bg={cat.light} $textColor={cat.text}>
              {catKey}
            </CategoryBadge>
          </div>
          {githubRepoName && (
            <GithubBadge
              href={`https://github.com/${githubRepoOwner}/${githubRepoName}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              {githubRepoName}
            </GithubBadge>
          )}
        </CardHeader>

        {project.description && (
          <CardDescription>{project.description}</CardDescription>
        )}

        <TeamRow>
          <AvatarStack>
            {visibleUsers.map((user, i) =>
              user.avatarUrl ? (
                <MemberAvatar key={user.id} src={user.avatarUrl} alt={user.name} $first={i === 0} />
              ) : (
                <AvatarFallback key={user.id} $first={i === 0} $bg={getAvatarColor(user.name)}>
                  {getInitials(user.name)}
                </AvatarFallback>
              ),
            )}
            {overflowCount > 0 && <AvatarOverflow>+{overflowCount}</AvatarOverflow>}
          </AvatarStack>
          <TeamLabel>
            {stats.teamSize === 0
              ? 'No members'
              : `${stats.teamSize} member${stats.teamSize > 1 ? 's' : ''}`}
          </TeamLabel>
        </TeamRow>

        <StatsRow>
          <StatPill $bg="#EFF6FF" $color="#2563EB">
            <StatDot $color="#3B82F6" />
            {stats.inProgressIssues} in progress
          </StatPill>
          <StatPill $bg="#FEF2F2" $color="#DC2626">
            <StatDot $color="#EF4444" />
            {stats.bugIssues} bug{stats.bugIssues !== 1 ? 's' : ''}
          </StatPill>
          <StatPill $bg="#F0FDF4" $color="#16A34A">
            <StatDot $color="#22C55E" />
            {stats.doneIssues} done
          </StatPill>
        </StatsRow>

        <ProgressSection>
          <ProgressHeader>
            <ProgressLabel>{stats.totalIssues} total issues</ProgressLabel>
            <ProgressValue>{stats.completionRate}%</ProgressValue>
          </ProgressHeader>
          <ProgressBar>
            <ProgressFill $pct={stats.completionRate} $color={progressColor} />
          </ProgressBar>
        </ProgressSection>

        <AIBadge $bg={aiBadge.bg} $color={aiBadge.color} $border={aiBadge.border}>
          <AIBadgeDot $color={aiBadge.dot} />
          <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor" style={{ opacity: 0.7, flexShrink: 0 }}>
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 14.094A5.973 5.973 0 004 17v1H1v-1a3 3 0 013.75-2.906z" />
          </svg>
          AI · {aiBadge.label}
        </AIBadge>
      </CardBody>

      <CardFooter>
        <LastActivity>Active {formatRelativeTime(stats.lastActivity)}</LastActivity>
        <CardActions>
          <DashboardLink onClick={onOpenDashboard}>Dashboard</DashboardLink>
          <OpenBoardBtn onClick={onOpenBoard}>Open Board →</OpenBoardBtn>
        </CardActions>
      </CardFooter>
    </Card>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const ProjectsHub = () => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [{ data, error, isLoading }] = useApi.get('/projects');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const handleSignOut = () => {
    removeStoredAuthToken();
    navigate('/', { replace: true });
  };

  const projects = data?.projects || [];

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesCategory = filter === 'all' || p.category === filter;
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [projects, filter, search]);

  // Global stats across all projects
  const globalStats = useMemo(() => {
    const totalOpen = projects.reduce(
      (sum, p) => sum + p.stats.totalIssues - p.stats.doneIssues,
      0,
    );
    const totalInProgress = projects.reduce((sum, p) => sum + p.stats.inProgressIssues, 0);
    const totalBugs = projects.reduce((sum, p) => sum + p.stats.bugIssues, 0);
    const avgCompletion =
      projects.length > 0
        ? Math.round(
            projects.reduce((sum, p) => sum + p.stats.completionRate, 0) / projects.length,
          )
        : 0;
    const myTotal = projects.reduce((sum, p) => sum + p.stats.myIssueCount, 0);
    return { totalOpen, totalInProgress, totalBugs, avgCompletion, myTotal };
  }, [projects]);

  if (isLoading) return <PageLoader />;
  if (error) return <PageError />;

  return (
    <Page>
      {/* ── Top navigation bar ── */}
      <Topbar>
        <TopbarBrand to="/projects">
          <Logo size={28} />
          ProjectHub
        </TopbarBrand>

        <TopbarSearch>
          <SearchIcon>
            <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </SearchIcon>
          <SearchInput
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </TopbarSearch>

        <TopbarRight>
          {currentUser && (
            <TopbarUserChip onClick={() => navigate('/project/profile')}>
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: '#818CF8', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700,
                  }}
                >
                  {getInitials(currentUser.name)}
                </div>
              )}
              <TopbarUserName>{currentUser.name}</TopbarUserName>
            </TopbarUserChip>
          )}
          <SignOutBtn onClick={handleSignOut}>Sign out</SignOutBtn>
        </TopbarRight>
      </Topbar>

      {/* ── Welcome hero ── */}
      <Hero>
        <HeroLeft>
          {currentUser?.avatarUrl ? (
            <HeroAvatar src={currentUser.avatarUrl} alt={currentUser.name} />
          ) : (
            <HeroAvatarFallback>
              {getInitials(currentUser?.name)}
            </HeroAvatarFallback>
          )}
          <HeroText>
            <HeroGreeting>{getGreeting()}</HeroGreeting>
            <HeroName>{currentUser?.name || 'Welcome back'}</HeroName>
            <HeroRole>
              {currentUser?.title || 'Team member'} · {projects.length} active project{projects.length !== 1 ? 's' : ''}
            </HeroRole>
          </HeroText>
        </HeroLeft>

        <HeroStats>
          <HeroStatCard>
            <HeroStatValue>{globalStats.myTotal}</HeroStatValue>
            <HeroStatLabel>My Issues</HeroStatLabel>
          </HeroStatCard>
          <HeroStatCard>
            <HeroStatValue>{globalStats.totalInProgress}</HeroStatValue>
            <HeroStatLabel>In Progress</HeroStatLabel>
          </HeroStatCard>
          <HeroStatCard>
            <HeroStatValue>{globalStats.totalBugs}</HeroStatValue>
            <HeroStatLabel>Open Bugs</HeroStatLabel>
          </HeroStatCard>
          <HeroStatCard>
            <HeroStatValue>{globalStats.avgCompletion}%</HeroStatValue>
            <HeroStatLabel>Avg Done</HeroStatLabel>
          </HeroStatCard>
        </HeroStats>
      </Hero>

      {/* ── Filter toolbar ── */}
      <Toolbar>
        <FilterTabs>
          {FILTERS.map(f => (
            <FilterTab key={f} $active={filter === f} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All projects' : f.charAt(0).toUpperCase() + f.slice(1)}
            </FilterTab>
          ))}
        </FilterTabs>
        <SortLabel>{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}</SortLabel>
      </Toolbar>

      {/* ── Project grid ── */}
      <Grid>
        {filteredProjects.length === 0 ? (
          <EmptyState>No projects match your search.</EmptyState>
        ) : (
          filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenBoard={() => navigate('/project/board')}
              onOpenDashboard={() => navigate('/project/dashboard')}
            />
          ))
        )}
      </Grid>
    </Page>
  );
};

export default ProjectsHub;

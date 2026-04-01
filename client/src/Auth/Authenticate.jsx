import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from 'shared/utils/api';
import toast from 'shared/utils/toast';
import { getStoredAuthToken, storeAuthToken } from 'shared/utils/authToken';
import { PageLoader, Button, Input, Logo, Avatar, ProjectAvatar } from 'shared/components';

import {
  Page,
  Topbar,
  Brand,
  Nav,
  NavLink,
  TopbarActions,
  SearchButton,
  SignInLink,
  Announcement,
  AnnouncementText,
  Hero,
  HeroCopy,
  HeroEyebrow,
  HeroTitle,
  HeroText,
  HeroActions,
  ShowcaseRow,
  ShowcaseCard,
  ShowcaseTag,
  ShowcaseTitle,
  ShowcaseMock,
  ShowcaseDarkMock,
  ShowcaseList,
  ShowcaseLine,
  LoginCard,
  LoginTitle,
  LoginText,
  LoginForm,
  InputWrap,
  Separator,
  SeparatorLine,
  SeparatorText,
  Accounts,
  AccountCard,
  AccountMeta,
  AccountText,
  AccountName,
  AccountEmail,
  RolePill,
  FieldLabel,
  Hint,
} from './Styles';

const Authenticate = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isSubmitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const isAuthenticated = !!getStoredAuthToken();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.get('/authentication/users');
        setUsers(response.users);
        if (response.users[0]) {
          setEmail(response.users[0].email);
        }
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [navigate]);

  const handleLogin = async targetEmail => {
    try {
      setSubmitting(true);
      const { authToken } = await api.post('/authentication/login', { email: targetEmail });
      storeAuthToken(authToken);
      navigate('/project');
    } catch (error) {
      toast.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Page>
      <Topbar>
        <Brand>
          <ProjectAvatar size={34} />
          <span>Jira</span>
        </Brand>

        <Nav>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#solutions">Solutions</NavLink>
          <NavLink href="#guide">Guide</NavLink>
          <NavLink href="#templates">Templates</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
        </Nav>

        <TopbarActions>
          <SearchButton type="button">Search</SearchButton>
          {isAuthenticated ? (
            <Button type="button" variant="primary" onClick={() => navigate('/project')}>
              Open app
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={() => handleLogin(email)}
              isWorking={isSubmitting}
            >
              Get it free
            </Button>
          )}
          <SignInLink href="#login">Sign in</SignInLink>
        </TopbarActions>
      </Topbar>

      <Announcement>
        <AnnouncementText>
          Atlassian-style demo workspace with seeded users, project roles, and a functional Jira board.
        </AnnouncementText>
      </Announcement>

      <Hero>
        <HeroCopy>
          <HeroEyebrow>Project management for software teams</HeroEyebrow>
          <HeroTitle>
            Focus on outcomes,
            <br />
            not admin
          </HeroTitle>
          <HeroText>
            Plan work, triage bugs, manage releases, and explore a Jira-like workflow with role-based
            demo users that log in to the same shared workspace.
          </HeroText>
          <HeroActions>
            {isAuthenticated ? (
              <Button type="button" variant="primary" onClick={() => navigate('/project')}>
                Open workspace
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                onClick={() => handleLogin(email)}
                isWorking={isSubmitting}
              >
                Start demo
              </Button>
            )}
            <Button type="button" variant="secondary" onClick={() => navigate('/project')}>
              Preview app
            </Button>
          </HeroActions>
        </HeroCopy>

        <LoginCard id="login">
          <LoginTitle>{isAuthenticated ? 'You are signed in' : 'Sign in'}</LoginTitle>
          <LoginText>
            {isAuthenticated
              ? 'Your demo session is active. Open the workspace or switch to a different seeded user below.'
              : 'Use a demo Jira account or enter one of the seeded emails below.'}
          </LoginText>

          <LoginForm
            onSubmit={event => {
              event.preventDefault();
              handleLogin(email);
            }}
          >
            <InputWrap>
              <FieldLabel htmlFor="auth-email">Work email</FieldLabel>
              <Input
                id="auth-email"
                name="email"
                value={email}
                onChange={setEmail}
                placeholder="you@company.com"
              />
            </InputWrap>

            <Button type="submit" variant="primary" isWorking={isSubmitting}>
              Sign in
            </Button>
          </LoginForm>

          <Separator>
            <SeparatorLine />
            <SeparatorText>Or continue with</SeparatorText>
            <SeparatorLine />
          </Separator>

          <Accounts>
            {users.map(user => (
              <AccountCard
                key={user.id}
                disabled={isSubmitting}
                onClick={() => handleLogin(user.email)}
                type="button"
              >
                <AccountMeta>
                  <Avatar avatarUrl={user.avatarUrl} name={user.name} size={40} />
                  <AccountText>
                    <AccountName>{user.name}</AccountName>
                    <AccountEmail>{user.email}</AccountEmail>
                  </AccountText>
                </AccountMeta>
                <RolePill>{user.title}</RolePill>
              </AccountCard>
            ))}
          </Accounts>
          <Hint>
            Try `gaben@jira.guest`, `yoda@jira.guest`, `rick@jira.guest`, or
            `leia@jira.guest`.
          </Hint>
        </LoginCard>

        <ShowcaseRow>
          <ShowcaseCard id="features">
            <ShowcaseTag>Project and task tracking</ShowcaseTag>
            <ShowcaseTitle>Software development</ShowcaseTitle>
            <ShowcaseDarkMock>
              <ShowcaseList>
                <ShowcaseLine $short />
                <ShowcaseLine />
                <ShowcaseLine $short />
                <ShowcaseLine />
              </ShowcaseList>
            </ShowcaseDarkMock>
          </ShowcaseCard>

          <ShowcaseCard id="solutions">
            <ShowcaseTag $tone="green">Plan and launch campaigns</ShowcaseTag>
            <ShowcaseTitle>Marketing</ShowcaseTitle>
            <ShowcaseMock>
              <ShowcaseList>
                <ShowcaseLine />
                <ShowcaseLine $short />
                <ShowcaseLine />
                <ShowcaseLine $short />
              </ShowcaseList>
            </ShowcaseMock>
          </ShowcaseCard>

          <ShowcaseCard id="guide">
            <ShowcaseTag $tone="purple">Turn ideas into delivery</ShowcaseTag>
            <ShowcaseTitle>Project management</ShowcaseTitle>
            <ShowcaseMock>
              <ShowcaseList>
                <ShowcaseLine />
                <ShowcaseLine />
                <ShowcaseLine $short />
                <ShowcaseLine />
              </ShowcaseList>
            </ShowcaseMock>
          </ShowcaseCard>

          <ShowcaseCard id="templates">
            <ShowcaseTag $tone="amber">Manage and track projects</ShowcaseTag>
            <ShowcaseTitle>IT</ShowcaseTitle>
            <ShowcaseMock>
              <ShowcaseList>
                <ShowcaseLine $short />
                <ShowcaseLine />
                <ShowcaseLine $short />
                <ShowcaseLine />
              </ShowcaseList>
            </ShowcaseMock>
          </ShowcaseCard>
        </ShowcaseRow>
      </Hero>
    </Page>
  );
};

export default Authenticate;

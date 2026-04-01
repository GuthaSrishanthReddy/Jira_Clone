import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import useCurrentUser from 'shared/hooks/currentUser';
import { removeStoredAuthToken } from 'shared/utils/authToken';
import { Icon, AboutTooltip } from 'shared/components';

import {
  NavLeft,
  LogoLink,
  StyledLogo,
  Bottom,
  Item,
  ItemText,
  AccountSection,
  ProfileCard,
  ProfileAvatar,
  ProfileMeta,
  ProfileName,
  ProfileRole,
  SignOutButton,
} from './Styles';

const propTypes = {
  issueSearchModalOpen: PropTypes.func.isRequired,
  issueCreateModalOpen: PropTypes.func.isRequired,
};

const ProjectNavbarLeft = ({ issueSearchModalOpen, issueCreateModalOpen }) => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser({ cachePolicy: 'no-cache' });

  const handleSignOut = () => {
    removeStoredAuthToken();
    navigate('/', { replace: true });
  };

  return (
    <NavLeft>
      <LogoLink to="/">
        <StyledLogo color="#fff" />
      </LogoLink>

      <Item onClick={issueSearchModalOpen}>
        <Icon type="search" size={22} top={1} left={3} />
        <ItemText>Search issues</ItemText>
      </Item>

      <Item onClick={issueCreateModalOpen}>
        <Icon type="plus" size={27} />
        <ItemText>Create Issue</ItemText>
      </Item>

      <Bottom>
        <AboutTooltip
          placement="right"
          offset={{ top: -218 }}
          renderLink={linkProps => (
            <Item {...linkProps}>
              <Icon type="help" size={25} />
              <ItemText>About</ItemText>
            </Item>
          )}
        />

        {currentUser && (
          <AccountSection>
            <ProfileCard to="/project/profile">
              <ProfileAvatar avatarUrl={currentUser.avatarUrl} name={currentUser.name} size={34} />
              <ProfileMeta>
                <ProfileName>{currentUser.name}</ProfileName>
                <ProfileRole>{currentUser.title}</ProfileRole>
              </ProfileMeta>
            </ProfileCard>
            <SignOutButton type="button" onClick={handleSignOut}>
              Sign out
            </SignOutButton>
          </AccountSection>
        )}
      </Bottom>
    </NavLeft>
  );
};

ProjectNavbarLeft.propTypes = propTypes;

export default ProjectNavbarLeft;

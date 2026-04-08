import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { ProjectCategoryCopy } from 'shared/constants/projects';
import { Icon, ProjectAvatar } from 'shared/components';

import {
  Sidebar,
  ProjectInfo,
  ProjectTexts,
  ProjectName,
  ProjectCategory,
  Divider,
  LinkItem,
  LinkText,
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
};

const ProjectSidebar = ({ project }) => (
  <Sidebar>
    <LinkItem as={NavLink} to="/projects" style={{ margin: '8px 8px 0', color: '#94A3B8', fontSize: 12 }}>
      <Icon type="chevron-left" size={14} />
      <LinkText style={{ fontSize: 12, color: '#94A3B8' }}>All projects</LinkText>
    </LinkItem>

    <ProjectInfo>
      <ProjectAvatar />
      <ProjectTexts>
        <ProjectName>{project.name}</ProjectName>
        <ProjectCategory>{ProjectCategoryCopy[project.category]} project</ProjectCategory>
      </ProjectTexts>
    </ProjectInfo>

    {renderLinkItem('Dashboard', 'board', '/project/dashboard')}
    {renderLinkItem('Activity', 'reports', '/project/activity')}
    <Divider />
    {renderLinkItem('Kanban Board', 'board', '/project/board')}
    {renderLinkItem('Profile', 'feedback', '/project/profile')}
    {renderLinkItem('Project settings', 'settings', '/project/settings')}
    <Divider />
    {renderLinkItem('Issues and filters', 'issues', '/project/issues')}
    {renderLinkItem('Pages', 'page', '/project/pages')}
    {renderLinkItem('AI Findings', 'reports', '/project/reports')}
    {renderLinkItem('Components', 'component', '/project/components')}
  </Sidebar>
);

const renderLinkItem = (text, iconType, path) => {
  return (
    <LinkItem as={NavLink} to={path} end>
      <Icon type={iconType} />
      <LinkText>{text}</LinkText>
    </LinkItem>
  );
};

ProjectSidebar.propTypes = propTypes;

export default ProjectSidebar;

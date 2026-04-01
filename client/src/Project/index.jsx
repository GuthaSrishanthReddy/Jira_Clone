import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import useApi from 'shared/hooks/api';
import { updateArrayItemById } from 'shared/utils/javascript';
import { getStoredAuthToken } from 'shared/utils/authToken';
import { PageLoader, PageError, Modal } from 'shared/components';

import NavbarLeft from './NavbarLeft';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Activity from './Activity';
import Board from './Board';
import IssueSearch from './IssueSearch';
import IssueCreate from './IssueCreate';
import ProjectSettings from './ProjectSettings';
import ProjectModules from './ProjectModules';
import ProjectProfile from './Profile';
import { ProjectPage } from './Styles';

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authToken = getStoredAuthToken();

  const [{ data, error, setLocalData }, fetchProject] = useApi.get('/project');

  if (!authToken) {
    return <Navigate replace to="/" />;
  }

  if (!data) return <PageLoader />;
  if (error) return <PageError />;

  const { project } = data;

  const updateLocalProjectIssues = (issueId, updatedFields) => {
    setLocalData(currentData => ({
      project: {
        ...currentData.project,
        issues: updateArrayItemById(currentData.project.issues, issueId, updatedFields),
      },
    }));
  };

  const isIssueSearchOpen = isModalOpen(location.search, 'issue-search');
  const isIssueCreateOpen = isModalOpen(location.search, 'issue-create');

  const openModal = modalName => {
    navigate(
      {
        pathname: location.pathname,
        search: buildModalSearch(location.search, modalName, true),
      },
      { replace: false },
    );
  };

  const closeModal = modalName => {
    navigate(
      {
        pathname: location.pathname,
        search: buildModalSearch(location.search, modalName, false),
      },
      { replace: false },
    );
  };

  return (
    <ProjectPage>
      <NavbarLeft
        issueSearchModalOpen={() => openModal('issue-search')}
        issueCreateModalOpen={() => openModal('issue-create')}
      />

      <Sidebar project={project} />

      {isIssueSearchOpen && (
        <Modal
          isOpen
          testid="modal:issue-search"
          variant="aside"
          width={600}
          onClose={() => closeModal('issue-search')}
          renderContent={() => <IssueSearch project={project} />}
        />
      )}

      {isIssueCreateOpen && (
        <Modal
          isOpen
          testid="modal:issue-create"
          width={800}
          withCloseIcon={false}
          onClose={() => closeModal('issue-create')}
          renderContent={modal => (
            <IssueCreate
              project={project}
              fetchProject={fetchProject}
              onCreate={() => navigate('/project/board')}
              modalClose={modal.close}
            />
          )}
        />
      )}

      <Routes>
        <Route path="dashboard" element={<Dashboard project={project} />} />
        <Route path="activity" element={<Activity project={project} />} />
        <Route
          path="board/*"
          element={
            <Board
              project={project}
              fetchProject={fetchProject}
              updateLocalProjectIssues={updateLocalProjectIssues}
            />
          }
        />
        <Route
          path="settings"
          element={<ProjectSettings project={project} fetchProject={fetchProject} />}
        />
        <Route path="issues" element={<ProjectModules moduleId="issues" project={project} />} />
        <Route path="pages" element={<ProjectModules moduleId="pages" project={project} />} />
        <Route
          path="reports"
          element={<ProjectModules moduleId="reports" project={project} />}
        />
        <Route
          path="components"
          element={<ProjectModules moduleId="components" project={project} />}
        />
        <Route path="profile" element={<ProjectProfile project={project} />} />
        <Route path="*" element={<Navigate replace to="dashboard" />} />
      </Routes>
    </ProjectPage>
  );
};

const isModalOpen = (search, modalName) => {
  const params = new URLSearchParams(search);
  return params.has(`modal-${modalName}`);
};

const buildModalSearch = (search, modalName, shouldOpen) => {
  const params = new URLSearchParams(search);
  const key = `modal-${modalName}`;

  if (shouldOpen) {
    params.set(key, 'true');
  } else {
    params.delete(key);
  }

  const nextSearch = params.toString();
  return nextSearch ? `?${nextSearch}` : '';
};

export default Project;

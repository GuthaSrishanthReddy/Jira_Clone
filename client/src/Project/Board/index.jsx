import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';

import useMergeState from 'shared/hooks/mergeState';
import { Breadcrumbs, Modal } from 'shared/components';

import Header from './Header';
import Filters from './Filters';
import Lists from './Lists';
import IssueDetails from './IssueDetails';

const propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
  updateLocalProjectIssues: PropTypes.func.isRequired,
};

const defaultFilters = {
  searchTerm: '',
  userIds: [],
  myOnly: false,
  recent: false,
};

const IssueDetailsModal = ({ projectUsers, fetchProject, updateLocalProjectIssues }) => {
  const { issueId } = useParams();
  const navigate = useNavigate();

  return (
    <Modal
      isOpen
      testid="modal:issue-details"
      width={1040}
      withCloseIcon={false}
      onClose={() => navigate('/project/board')}
      renderContent={modal => (
        <IssueDetails
          issueId={issueId}
          projectUsers={projectUsers}
          fetchProject={fetchProject}
          updateLocalProjectIssues={updateLocalProjectIssues}
          modalClose={modal.close}
        />
      )}
    />
  );
};

const ProjectBoard = ({ project, fetchProject, updateLocalProjectIssues }) => {
  const [filters, mergeFilters] = useMergeState(defaultFilters);

  return (
    <Fragment>
      <Breadcrumbs items={['Projects', project.name, 'Kanban Board']} />
      <Header />
      <Filters
        projectUsers={project.users}
        defaultFilters={defaultFilters}
        filters={filters}
        mergeFilters={mergeFilters}
      />
      <Lists
        project={project}
        filters={filters}
        updateLocalProjectIssues={updateLocalProjectIssues}
      />
      <Routes>
        <Route
          path="issues/:issueId"
          element={
            <IssueDetailsModal
              projectUsers={project.users}
              fetchProject={fetchProject}
              updateLocalProjectIssues={updateLocalProjectIssues}
            />
          }
        />
      </Routes>
    </Fragment>
  );
};

ProjectBoard.propTypes = propTypes;

export default ProjectBoard;

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { ProjectCategory, ProjectCategoryCopy } from 'shared/constants/projects';
import toast from 'shared/utils/toast';
import useApi from 'shared/hooks/api';
import { Form, Breadcrumbs } from 'shared/components';

import {
  FormCont,
  FormHeading,
  FormElement,
  ActionButton,
  SectionDivider,
  SectionHeading,
  TokenHint,
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
};

const ProjectSettings = ({ project, fetchProject }) => {
  const [{ isUpdating }, updateProject] = useApi.put('/project');
  const [{ isUpdating: isSavingGithub }, updateGithub] = useApi.put('/project/github');

  // Local state for fields that live outside Formik
  const [accessToken, setAccessToken] = useState('');
  const [monitoringEnabled, setMonitoringEnabled] = useState(
    Boolean(project.aiBugMonitoringEnabled),
  );

  return (
    <>
      {/* ── Project Details ── */}
      <Form
        initialValues={Form.initialValues(project, get => ({
          name: get('name'),
          url: get('url'),
          category: get('category'),
          description: get('description'),
        }))}
        validations={{
          name: [Form.is.required(), Form.is.maxLength(100)],
          url: Form.is.url(),
          category: Form.is.required(),
        }}
        onSubmit={async (values, form) => {
          try {
            await updateProject(values);
            await fetchProject();
            toast.success('Changes have been saved successfully.');
          } catch (error) {
            Form.handleAPIError(error, form);
          }
        }}
      >
        <FormCont>
          <FormElement>
            <Breadcrumbs items={['Projects', project.name, 'Project Details']} />
            <FormHeading>Project Details</FormHeading>

            <Form.Field.Input name="name" label="Name" />
            <Form.Field.Input name="url" label="URL" />
            <Form.Field.TextEditor
              name="description"
              label="Description"
              tip="Describe the project in as much detail as you'd like."
            />
            <Form.Field.Select name="category" label="Project Category" options={categoryOptions} />

            <ActionButton type="submit" variant="primary" isWorking={isUpdating}>
              Save changes
            </ActionButton>
          </FormElement>
        </FormCont>
      </Form>

      {/* ── GitHub Integration ── */}
      <Form
        initialValues={Form.initialValues(project, get => ({
          githubRepoOwner: get('githubRepoOwner') || '',
          githubRepoName: get('githubRepoName') || '',
          githubDefaultBranch: get('githubDefaultBranch') || 'main',
        }))}
        validations={{}}
        onSubmit={async (values, form) => {
          try {
            await updateGithub({
              ...values,
              aiBugMonitoringEnabled: monitoringEnabled,
              // Only send token if user typed something
              ...(accessToken ? { githubAccessToken: accessToken } : {}),
            });
            await fetchProject();
            if (accessToken) setAccessToken('');
            toast.success('GitHub integration settings saved.');
          } catch (error) {
            Form.handleAPIError(error, form);
          }
        }}
      >
        <FormCont>
          <FormElement>
            <SectionDivider />
            <SectionHeading>GitHub Integration</SectionHeading>

            <Form.Field.Input
              name="githubRepoOwner"
              label="Repository Owner"
              tip="GitHub username or org name (e.g. facebook)"
            />
            <Form.Field.Input
              name="githubRepoName"
              label="Repository Name"
              tip="Just the repo name, not the full URL (e.g. react)"
            />
            <Form.Field.Input
              name="githubDefaultBranch"
              label="Default Branch"
              tip="Branch to monitor (e.g. main or master)"
            />

            {/* Access token — never round-trips from server */}
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
                Personal Access Token
              </label>
              <input
                type="password"
                value={accessToken}
                onChange={e => setAccessToken(e.target.value)}
                placeholder={project.githubAccessToken ? '(token saved — leave blank to keep)' : 'ghp_...'}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #dfe1e6',
                  borderRadius: 4,
                  fontSize: 14,
                }}
              />
              <TokenHint>
                Needs <strong>repo</strong> scope. Stored server-side only — never sent to the browser after save.
              </TokenHint>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={monitoringEnabled}
                  onChange={e => setMonitoringEnabled(e.target.checked)}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                Enable AI Bug Monitoring
              </label>
              <TokenHint>When enabled, the repo is scanned automatically every 30 minutes.</TokenHint>
            </div>

            <ActionButton type="submit" variant="primary" isWorking={isSavingGithub}>
              Save GitHub settings
            </ActionButton>
          </FormElement>
        </FormCont>
      </Form>
    </>
  );
};

const categoryOptions = Object.values(ProjectCategory).map(category => ({
  value: category,
  label: ProjectCategoryCopy[category],
}));

ProjectSettings.propTypes = propTypes;

export default ProjectSettings;

import React, { useEffect, useMemo, useState } from 'react';
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
  SectionCard,
  SectionTop,
  EditAnchor,
  SummaryCard,
  SummaryList,
  SummaryItem,
  SummaryLabel,
  SummaryValue,
  TokenHint,
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
  fetchProject: PropTypes.func.isRequired,
};

const ProjectSettings = ({ project, fetchProject }) => {
  const [{ isUpdating }, updateProject] = useApi.put('/project');
  const [{ isUpdating: isSavingGithub }, updateGithub] = useApi.put('/project/github');

  const [accessToken, setAccessToken] = useState('');
  const [monitoringEnabled, setMonitoringEnabled] = useState(Boolean(project.aiBugMonitoringEnabled));
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingGithub, setIsEditingGithub] = useState(false);

  useEffect(() => {
    setMonitoringEnabled(Boolean(project.aiBugMonitoringEnabled));
  }, [project.aiBugMonitoringEnabled]);

  const descriptionSummary = useMemo(() => {
    const description = project.description || '';
    const plainText = description
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return plainText || 'Not set';
  }, [project.description]);

  return (
    <>
      <FormCont>
        <SectionCard>
          <Breadcrumbs items={['Projects', project.name, 'Project Details']} />
          <SectionTop>
            <FormHeading>Project Details</FormHeading>
            {!isEditingDetails && (
              <EditAnchor href="#project-details-edit" onClick={() => setIsEditingDetails(true)}>
                Edit
              </EditAnchor>
            )}
          </SectionTop>

          {!isEditingDetails && (
            <SummaryCard>
              <SummaryList>
                <SummaryItem>
                  <SummaryLabel>Name</SummaryLabel>
                  <SummaryValue>{project.name || 'Not set'}</SummaryValue>
                </SummaryItem>
                <SummaryItem>
                  <SummaryLabel>URL</SummaryLabel>
                  <SummaryValue>{project.url || 'Not set'}</SummaryValue>
                </SummaryItem>
                <SummaryItem>
                  <SummaryLabel>Description</SummaryLabel>
                  <SummaryValue>{descriptionSummary}</SummaryValue>
                </SummaryItem>
                <SummaryItem>
                  <SummaryLabel>Project Category</SummaryLabel>
                  <SummaryValue>{ProjectCategoryCopy[project.category] || project.category || 'Not set'}</SummaryValue>
                </SummaryItem>
              </SummaryList>
            </SummaryCard>
          )}

          {isEditingDetails && (
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
                  setIsEditingDetails(false);
                  toast.success('Changes have been saved successfully.');
                } catch (error) {
                  Form.handleAPIError(error, form);
                }
              }}
            >
              <FormElement id="project-details-edit">
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
            </Form>
          )}
        </SectionCard>
      </FormCont>

      <FormCont>
        <SectionCard>
          <SectionDivider />
          <SectionTop>
            <SectionHeading>GitHub Integration</SectionHeading>
            {!isEditingGithub && (
              <EditAnchor href="#github-integration-edit" onClick={() => setIsEditingGithub(true)}>
                Edit
              </EditAnchor>
            )}
          </SectionTop>

          {!isEditingGithub && (
            <SummaryCard>
              <SummaryList>
                <SummaryItem>
                  <SummaryLabel>Repository Owner</SummaryLabel>
                  <SummaryValue>{project.githubRepoOwner || 'Not set'}</SummaryValue>
                </SummaryItem>
                <SummaryItem>
                  <SummaryLabel>Repository Name</SummaryLabel>
                  <SummaryValue>{project.githubRepoName || 'Not set'}</SummaryValue>
                </SummaryItem>
                <SummaryItem>
                  <SummaryLabel>Default Branch</SummaryLabel>
                  <SummaryValue>{project.githubDefaultBranch || 'main'}</SummaryValue>
                </SummaryItem>
                <SummaryItem>
                  <SummaryLabel>Personal Access Token</SummaryLabel>
                  <SummaryValue>{project.githubRepoOwner && project.githubRepoName ? 'Saved server-side' : 'Not set'}</SummaryValue>
                </SummaryItem>
                <SummaryItem>
                  <SummaryLabel>AI Bug Monitoring</SummaryLabel>
                  <SummaryValue>{project.aiBugMonitoringEnabled ? 'Enabled' : 'Disabled'}</SummaryValue>
                </SummaryItem>
              </SummaryList>
            </SummaryCard>
          )}

          {isEditingGithub && (
            <Form
              initialValues={Form.initialValues(project, get => ({
                githubRepoOwner: get('githubRepoOwner') || '',
                githubRepoName: get('githubRepoName') || '',
                githubDefaultBranch: get('githubDefaultBranch') || 'main',
              }))}
              validations={{}}
              onSubmit={async (values, form) => {
                if (monitoringEnabled && (!values.githubRepoOwner || !values.githubRepoName)) {
                  form.setErrors({
                    githubRepoOwner: !values.githubRepoOwner
                      ? 'Repo owner is required to enable monitoring.'
                      : undefined,
                    githubRepoName: !values.githubRepoName
                      ? 'Repo name is required to enable monitoring.'
                      : undefined,
                  });
                  toast.error('Add the repository owner and repository name before enabling AI Bug Monitoring.');
                  return;
                }

                try {
                  await updateGithub({
                    ...values,
                    aiBugMonitoringEnabled: monitoringEnabled,
                    ...(accessToken ? { githubAccessToken: accessToken } : {}),
                  });
                  await fetchProject();
                  if (accessToken) setAccessToken('');
                  setIsEditingGithub(false);
                  toast.success('GitHub integration settings saved.');
                } catch (error) {
                  Form.handleAPIError(error, form);
                }
              }}
            >
              <FormElement id="github-integration-edit">
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

                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>
                    Personal Access Token
                  </label>
                  <input
                    type="password"
                    value={accessToken}
                    onChange={e => setAccessToken(e.target.value)}
                    placeholder="Leave blank to keep current token"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      border: '1px solid #dfe1e6',
                      borderRadius: 4,
                      fontSize: 14,
                    }}
                  />
                  <TokenHint>
                    Needs <strong>repo</strong> scope. Stored server-side only and not returned to the browser after save.
                  </TokenHint>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setMonitoringEnabled(current => !current)}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setMonitoringEnabled(current => !current);
                      }
                    }}
                    aria-pressed={monitoringEnabled}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      fontWeight: 600,
                      padding: 0,
                      border: 0,
                      background: 'transparent',
                      color: 'inherit',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={monitoringEnabled}
                      onChange={() => {}}
                      readOnly
                      tabIndex={-1}
                      aria-hidden="true"
                      style={{ width: 16, height: 16, pointerEvents: 'none' }}
                    />
                    <span>
                      Enable AI Bug Monitoring
                    </span>
                  </button>
                  <TokenHint>
                    When enabled, the repo is scanned automatically every 30 minutes. Repository owner and repository name must be filled in before this can be saved.
                  </TokenHint>
                </div>

                <ActionButton type="submit" variant="primary" isWorking={isSavingGithub}>
                  Save GitHub settings
                </ActionButton>
              </FormElement>
            </Form>
          )}
        </SectionCard>
      </FormCont>
    </>
  );
};

const categoryOptions = Object.values(ProjectCategory).map(category => ({
  value: category,
  label: ProjectCategoryCopy[category],
}));

ProjectSettings.propTypes = propTypes;

export default ProjectSettings;

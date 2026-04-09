import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import useApi from 'shared/hooks/api';
import useCurrentUser from 'shared/hooks/currentUser';
import api from 'shared/utils/api';
import toast from 'shared/utils/toast';
import { PageError } from 'shared/components';

import {
  SEVERITY,
  Page,
  PageHeader,
  TitleSection,
  PageTitle,
  AiIcon,
  PageSubtitle,
  ScanActions,
  ScanMeta,
  ScanBtn,
  FullScanBtn,
  WarningBanner,
  WarningIcon,
  SummaryBar,
  SummaryCard,
  SummaryCount,
  SummaryLabel,
  UnassignedCard,
  UnassignedCount,
  UnassignedLabel,
  FilterRow,
  FilterTabs,
  FilterTab,
  ResultCount,
  FindingList,
  FindingRow,
  FindingRowInner,
  SeverityStrip,
  FindingContent,
  FindingTopRow,
  SeverityPill,
  FindingTitle,
  FindingPath,
  FindingReason,
  SuggestedFix,
  FixHint,
  FixText,
  AssignFooter,
  AssignLabel,
  AvatarPickerRow,
  AssignableAvatar,
  AssignableAvatarImg,
  AssignableAvatarFallback,
  SelectedCheck,
  AssignBtn,
  AssignedInfo,
  AssignedAvatar,
  AssignedAvatarFallback,
  AssignedText,
  BoardLink,
  HistorySection,
  HistoryTitle,
  HistoryList,
  HistoryRow,
  ScanStatus,
  ScanText,
  EmptyState,
  EmptyIcon,
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
};

const AVATAR_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
const getAvatarColor = name => AVATAR_COLORS[(name || '').charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = name =>
  (name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

const SEVERITIES = ['critical', 'high', 'medium', 'low'];
const FILTERS = ['all', 'unassigned', 'critical', 'high', 'medium', 'low'];

// ─── Avatar picker ────────────────────────────────────────────────────────────
const MemberAvatar = ({ user, selected, onSelect }) => (
  <AssignableAvatar
    $selected={selected}
    onClick={() => onSelect(selected ? null : user.id)}
    title={user.name}
    type="button"
  >
    {user.avatarUrl ? (
      <AssignableAvatarImg src={user.avatarUrl} alt={user.name} />
    ) : (
      <AssignableAvatarFallback $bg={getAvatarColor(user.name)}>
        {getInitials(user.name)}
      </AssignableAvatarFallback>
    )}
    {selected && (
      <SelectedCheck>
        <svg width="12" height="12" viewBox="0 0 20 20" fill="white">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </SelectedCheck>
    )}
  </AssignableAvatar>
);

// ─── Single finding row ───────────────────────────────────────────────────────
const FindingItem = ({ finding, users, selectedAssigneeId, onSelectAssignee, onAssign, isAssigning }) => {
  const assignees = finding.issue?.users || [];
  const isAssigned = !!finding.issueId;
  const primaryAssignee = assignees[0];

  return (
    <FindingRow>
      <FindingRowInner>
        <SeverityStrip $severity={finding.severity} />
        <FindingContent>
          <FindingTopRow>
            <SeverityPill $severity={finding.severity}>
              {finding.severity}
            </SeverityPill>
            <FindingTitle>{finding.title}</FindingTitle>
          </FindingTopRow>

          <FindingPath>{finding.filePath}</FindingPath>
          <FindingReason>{finding.reason}</FindingReason>

          {finding.suggestedFix && (
            <SuggestedFix>
              <FixHint>Suggested fix</FixHint>
              <FixText>{finding.suggestedFix}</FixText>
            </SuggestedFix>
          )}
        </FindingContent>
      </FindingRowInner>

      <AssignFooter>
        {isAssigned ? (
          <AssignedInfo>
            {primaryAssignee ? (
              primaryAssignee.avatarUrl ? (
                <AssignedAvatar src={primaryAssignee.avatarUrl} alt={primaryAssignee.name} />
              ) : (
                <AssignedAvatarFallback $bg={getAvatarColor(primaryAssignee.name)}>
                  {getInitials(primaryAssignee.name)}
                </AssignedAvatarFallback>
              )
            ) : null}
            <AssignedText>
              {primaryAssignee ? `Assigned to ${primaryAssignee.name}` : 'On board'}
            </AssignedText>
            <BoardLink>· Issue #{finding.issueId}</BoardLink>
          </AssignedInfo>
        ) : (
          <>
            <AssignLabel>Assign to:</AssignLabel>
            <AvatarPickerRow>
              {users.map(user => (
                <MemberAvatar
                  key={user.id}
                  user={user}
                  selected={selectedAssigneeId === user.id}
                  onSelect={onSelectAssignee}
                />
              ))}
            </AvatarPickerRow>
            <AssignBtn
              disabled={!selectedAssigneeId || isAssigning}
              onClick={onAssign}
              type="button"
            >
              {isAssigning ? 'Assigning…' : 'Assign to Board →'}
            </AssignBtn>
          </>
        )}
      </AssignFooter>
    </FindingRow>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const AIFindings = ({ project }) => {
  const { currentUser } = useCurrentUser({ cachePolicy: 'no-cache' });
  const [isScanning, setIsScanning] = useState(false);
  const [isFullScanning, setIsFullScanning] = useState(false);
  const [promotingId, setPromotingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [scanWarning, setScanWarning] = useState(null);
  // { [findingId]: userId | null }
  const [assigneeMap, setAssigneeMap] = useState({});
  const isManager = currentUser?.role === 'manager';

  const [{ data: findingsData, error: findingsError, setLocalData: setFindingsData }, refetchFindings] =
    useApi.get('/project/github/findings', {}, { lazy: !isManager, cachePolicy: 'no-cache' });
  const [{ data: scansData }, refetchScans] =
    useApi.get('/project/github/scans', {}, { lazy: !isManager, cachePolicy: 'no-cache' });

  const isConfigured = !!(project.githubRepoOwner && project.githubRepoName);
  const findings = findingsData?.findings ?? [];
  const completedScans = useMemo(
    () => (scansData?.scans ?? []).filter(scan => scan.status === 'completed'),
    [scansData],
  );
  const latestScan = completedScans[0];

  // ── Severity counts ────────────────────────────────────────────────────────
  const counts = useMemo(() => {
    const c = { critical: 0, high: 0, medium: 0, low: 0, unassigned: 0 };
    for (const f of findings) {
      if (f.severity in c) c[f.severity]++;
      if (!f.issueId) c.unassigned++;
    }
    return c;
  }, [findings]);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (filter === 'all') return findings;
    if (filter === 'unassigned') return findings.filter(f => !f.issueId);
    return findings.filter(f => f.severity === filter);
  }, [findings, filter]);

  useEffect(() => {
    if (!isManager) return;

    refetchFindings();
    refetchScans();
  }, [isManager, refetchFindings, refetchScans]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleScanNow = async () => {
    if (isScanning) return;
    setIsScanning(true);
    try {
      const result = await api.post('/project/github/scan');
      const data = result;
      setScanWarning(result.autoIssueWarning || null);
      toast.success(`Scan complete — ${data.findingCount} finding(s) found.`);
      refetchFindings();
      refetchScans();
    } catch (err) {
      setScanWarning(null);
      toast.error(err?.error?.message || 'Scan failed. Check your GitHub settings.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleFullScan = async () => {
    if (isFullScanning) return;
    const confirmed = window.confirm(
      `Full Repo Scan will read every code file in ${project.githubRepoOwner}/${project.githubRepoName} and send them to the AI.\n\nThis may take 1–5 minutes. Continue?`,
    );
    if (!confirmed) return;
    setIsFullScanning(true);
    try {
      const result = await api.post('/project/github/scan/full');
      const data = result;
      setScanWarning(result.autoIssueWarning || null);
      toast.success(`Full scan complete — ${data.findingCount} finding(s) found.`);
      refetchFindings();
      refetchScans();
    } catch (err) {
      setScanWarning(null);
      toast.error(err?.message || 'Full scan failed.');
    } finally {
      setIsFullScanning(false);
    }
  };

  const handleAssign = async (findingId) => {
    const assigneeId = assigneeMap[findingId];
    if (!assigneeId || promotingId) return;
    setPromotingId(findingId);
    try {
      const { assignees } = await api.post(
        `/project/github/findings/${findingId}/promote`,
        { assigneeId },
      );
      toast.success('Bug assigned and added to the board.');
      // Optimistically update local state with assignee info
      setFindingsData(current => ({
        findings: current.findings.map(f =>
          f.id === findingId
            ? { ...f, issueId: -1, issue: { users: assignees || [] } }
            : f,
        ),
      }));
    } catch {
      toast.error('Failed to assign bug. Please try again.');
    } finally {
      setPromotingId(null);
    }
  };

  const setAssignee = (findingId, userId) =>
    setAssigneeMap(prev => ({ ...prev, [findingId]: userId }));

  if (findingsError) return <PageError />;

  if (!isManager) {
    return (
      <Page>
        <PageHeader>
          <TitleSection>
            <PageTitle>
              <AiIcon>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="white">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 14.094A5.973 5.973 0 004 17v1H1v-1a3 3 0 013.75-2.906z"/>
                </svg>
              </AiIcon>
              AI Bug Triage
            </PageTitle>
            <PageSubtitle>
              This area is available to project managers only.
            </PageSubtitle>
          </TitleSection>
        </PageHeader>

        <EmptyState>
          <EmptyIcon>Restricted</EmptyIcon>
          You can view project work, but GitHub scanning and AI triage require a manager role.
        </EmptyState>
      </Page>
    );
  }

  const isBusy = isScanning || isFullScanning;

  return (
    <Page>
      {/* ── Header ── */}
      <PageHeader>
        <TitleSection>
          <PageTitle>
            <AiIcon>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="white">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 14.094A5.973 5.973 0 004 17v1H1v-1a3 3 0 013.75-2.906z"/>
              </svg>
            </AiIcon>
            AI Bug Triage
          </PageTitle>
          <PageSubtitle>
            {isConfigured
              ? `Monitoring ${project.githubRepoOwner}/${project.githubRepoName} · Review findings and assign them to engineers`
              : 'Connect a GitHub repo in Project Settings to enable AI scanning.'}
          </PageSubtitle>
        </TitleSection>

        <ScanActions>
          <ScanMeta>
            {latestScan
              ? `Last scan ${moment(latestScan.startedAt).fromNow()} · ${latestScan.status}`
              : 'No scans yet'}
          </ScanMeta>
          <FullScanBtn onClick={handleFullScan} disabled={!isConfigured || isBusy}>
            {isFullScanning ? 'Scanning…' : 'Full Scan'}
          </FullScanBtn>
          <ScanBtn onClick={handleScanNow} disabled={!isConfigured || isBusy}>
            {isScanning ? 'Scanning…' : 'Scan Now'}
          </ScanBtn>
        </ScanActions>
      </PageHeader>

      {/* ── Severity summary cards ── */}
      {scanWarning && (
        <WarningBanner>
          <WarningIcon>!</WarningIcon>
          <div>{scanWarning}</div>
        </WarningBanner>
      )}

      <SummaryBar>
        {SEVERITIES.map(sev => (
          <SummaryCard
            key={sev}
            $severity={sev}
            $active={filter === sev}
            onClick={() => setFilter(f => f === sev ? 'all' : sev)}
            title={`Filter by ${sev}`}
          >
            <SummaryCount $severity={sev}>{counts[sev]}</SummaryCount>
            <SummaryLabel $severity={sev}>{sev}</SummaryLabel>
          </SummaryCard>
        ))}
        <UnassignedCard $active={filter === 'unassigned'} onClick={() => setFilter(f => f === 'unassigned' ? 'all' : 'unassigned')}>
          <UnassignedCount>{counts.unassigned}</UnassignedCount>
          <UnassignedLabel>Unassigned</UnassignedLabel>
        </UnassignedCard>
      </SummaryBar>

      {/* ── Filter tabs ── */}
      <FilterRow>
        <FilterTabs>
          {FILTERS.map(f => (
            <FilterTab key={f} $active={filter === f} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </FilterTab>
          ))}
        </FilterTabs>
        <ResultCount>
          {filtered.length} finding{filtered.length !== 1 ? 's' : ''}
        </ResultCount>
      </FilterRow>

      {/* ── Findings ── */}
      {filtered.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🔍</EmptyIcon>
          {isConfigured
            ? findings.length === 0
              ? 'No findings yet. Click "Scan Now" to analyse your latest commits.'
              : 'No findings match this filter.'
            : 'Configure GitHub integration in Project Settings to get started.'}
        </EmptyState>
      ) : (
        <FindingList>
          {filtered.map(finding => (
            <FindingItem
              key={finding.id}
              finding={finding}
              users={project.users}
              selectedAssigneeId={assigneeMap[finding.id] ?? null}
              onSelectAssignee={userId => setAssignee(finding.id, userId)}
              onAssign={() => handleAssign(finding.id)}
              isAssigning={promotingId === finding.id}
            />
          ))}
        </FindingList>
      )}

      {/* ── Scan history ── */}
      {completedScans.length > 0 && (
        <HistorySection>
          <HistoryTitle>Scan History</HistoryTitle>
          <HistoryList>
            {completedScans.map(scan => (
              <HistoryRow key={scan.id}>
                <ScanStatus $status={scan.status}>{scan.status}</ScanStatus>
                {scan.isFullScan && (
                  <ScanText style={{ color: '#4F46E5', fontWeight: 700 }}>Full scan</ScanText>
                )}
                <ScanText>{moment(scan.startedAt).format('MMM D, YYYY HH:mm')}</ScanText>
                {scan.commitSha && <ScanText><code>{scan.commitSha.slice(0, 7)}</code></ScanText>}
                <ScanText>{scan._count.findings} finding(s)</ScanText>
              </HistoryRow>
            ))}
          </HistoryList>
        </HistorySection>
      )}
    </Page>
  );
};

AIFindings.propTypes = propTypes;

export default AIFindings;

import styled from 'styled-components';

import { color, font, mixin } from 'shared/utils/styles';
import { IssueStatus } from 'shared/constants/issues';

const columnAccentColors = {
  [IssueStatus.BACKLOG]: color.statusBacklog,
  [IssueStatus.SELECTED]: color.statusSelected,
  [IssueStatus.INPROGRESS]: color.statusInProgress,
  [IssueStatus.DONE]: color.statusDone,
};

const columnBgColors = {
  [IssueStatus.BACKLOG]: color.columnBacklog,
  [IssueStatus.SELECTED]: color.columnSelected,
  [IssueStatus.INPROGRESS]: color.columnInProgress,
  [IssueStatus.DONE]: color.columnDone,
};

export const List = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 220px;
  min-height: 400px;
  border-radius: 12px;
  background: ${props => columnBgColors[props.$status] || color.backgroundLightest};
  border: 1px solid ${color.borderLightest};
  overflow: hidden;
`;

export const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px 10px;
  border-bottom: 2px solid ${props => columnAccentColors[props.$status] || color.borderLight};
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  color: ${color.textMedium};
  ${font.size(11.5)};
  ${font.bold};
  letter-spacing: 0.06em;
  ${mixin.truncateText}
`;

export const IssuesCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: ${props => columnAccentColors[props.$status] || color.backgroundLight};
  color: #ffffff;
  ${font.size(11)};
  ${font.bold};
  text-transform: none;
  letter-spacing: 0;
`;

export const Issues = styled.div`
  padding: 8px;
  flex: 1;
`;

import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

import { color, font, mixin, issueTypeColors } from 'shared/utils/styles';
import { Avatar } from 'shared/components';
import { IssueType } from 'shared/constants/issues';

export const IssueLink = styled(Link)`
  display: block;
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const Issue = styled.div`
  padding: 12px 14px 10px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid ${color.borderLightest};
  ${mixin.boxShadowCard}
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
  ${mixin.clickable}
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${props => issueTypeColors[props.$issueType] || color.primary};
    border-radius: 10px 0 0 10px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px -4px rgba(0, 0, 0, 0.12);
    border-color: ${color.borderLight};
  }

  ${props =>
    props.$isBeingDragged &&
    css`
      transform: rotate(2deg) scale(1.02);
      box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.18);
      border-color: ${color.primary};
    `}
`;

export const Title = styled.p`
  padding: 0 0 10px 10px;
  ${font.size(13.5)}
  ${font.medium}
  color: ${color.textDark};
  line-height: 1.4;
`;

export const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
`;

export const Assignees = styled.div`
  display: flex;
  flex-direction: row-reverse;
  margin-left: 4px;
`;

export const AssigneeAvatar = styled(Avatar)`
  margin-left: -4px;
  box-shadow: 0 0 0 2px #fff;
  transition: transform 0.15s;
  &:hover {
    transform: translateY(-2px);
    z-index: 1;
  }
`;

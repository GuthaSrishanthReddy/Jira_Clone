import styled from 'styled-components';

import { color, font, mixin } from 'shared/utils/styles';
import { InputDebounced, Avatar, Button } from 'shared/components';

export const Filters = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 4px;
  flex-wrap: wrap;
  gap: 8px;
`;

export const SearchInput = styled(InputDebounced)`
  width: 180px;
`;

export const Avatars = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

export const AvatarIsActiveBorder = styled.div`
  display: inline-flex;
  margin-left: -4px;
  border-radius: 50%;
  transition: transform 0.15s;
  ${mixin.clickable};
  ${props =>
    props.$isActive &&
    `box-shadow: 0 0 0 3px ${color.primary}; border-radius: 50%;`}
  &:hover {
    transform: translateY(-4px);
    z-index: 1;
  }
`;

export const StyledAvatar = styled(Avatar)`
  box-shadow: 0 0 0 2px #fff;
`;

export const StyledButton = styled(Button)`
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  ${font.size(13)}
  ${props =>
    props.$isActive &&
    `
    background: ${color.primaryLight};
    color: ${color.primary};
    border-color: ${color.primary};
  `}
`;

export const ClearAll = styled.div`
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  color: ${color.textMedium};
  ${font.size(13)}
  ${mixin.clickable}
  &:hover {
    background: ${color.backgroundLight};
    color: ${color.textDark};
  }
`;

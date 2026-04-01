import styled from 'styled-components';

import { color, sizes, font, mixin, zIndexValues } from 'shared/utils/styles';

export const Sidebar = styled.div`
  position: fixed;
  z-index: ${zIndexValues.navLeft - 1};
  top: 0;
  left: ${sizes.appNavBarLeftWidth}px;
  height: 100vh;
  width: ${sizes.secondarySideBarWidth}px;
  padding: 0 0 24px;
  background: #ffffff;
  border-right: 1px solid ${color.borderLightest};
  ${mixin.scrollableY}
  ${mixin.customScrollbar()}
  @media (max-width: 1100px) {
    width: ${sizes.secondarySideBarWidth - 10}px;
  }
  @media (max-width: 999px) {
    display: none;
  }
`;

export const ProjectInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 16px 16px;
  border-bottom: 1px solid ${color.borderLightest};
  margin-bottom: 8px;
`;

export const ProjectTexts = styled.div`
  padding: 0 0 0 12px;
  min-width: 0;
`;

export const ProjectName = styled.div`
  color: ${color.textDark};
  ${font.size(14)};
  ${font.bold};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProjectCategory = styled.div`
  color: ${color.textLight};
  ${font.size(12)};
  ${font.regular};
  margin-top: 2px;
`;

export const Divider = styled.div`
  margin: 8px 16px 4px;
  border-top: 1px solid ${color.borderLightest};
`;

export const SectionLabel = styled.div`
  padding: 12px 20px 4px;
  color: ${color.textLight};
  ${font.size(11)};
  ${font.bold};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

export const LinkItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 9px 16px;
  margin: 1px 8px;
  border-radius: 8px;
  ${mixin.clickable}
  color: ${color.textMedium};
  transition: background 0.15s, color 0.15s;
  ${props =>
    !props.to
      ? `cursor: not-allowed; opacity: 0.55;`
      : `&:hover {
           background: ${color.backgroundLightest};
           color: ${color.textDark};
         }`}
  i {
    font-size: 18px;
    width: 20px;
    text-align: center;
    flex-shrink: 0;
    color: inherit;
  }
  &.active {
    color: ${color.primary};
    background: ${color.primaryLight};
    i {
      color: ${color.primary};
    }
  }
`;

export const LinkText = styled.span`
  padding: 0 0 0 12px;
  ${font.size(14)};
  ${font.medium};
`;

export const NotImplemented = styled.div`
  display: inline-block;
  position: absolute;
  right: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  color: ${color.textLight};
  background: ${color.backgroundLight};
  opacity: 0;
  ${font.size(10.5)};
  ${font.bold}
  text-transform: uppercase;
  letter-spacing: 0.04em;
  pointer-events: none;
  ${LinkItem}:hover & {
    opacity: 1;
  }
`;

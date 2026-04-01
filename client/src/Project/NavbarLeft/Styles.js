import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { font, sizes, color, mixin, zIndexValues } from 'shared/utils/styles';
import { Logo } from 'shared/components';

export const NavLeft = styled.aside`
  z-index: ${zIndexValues.navLeft};
  position: fixed;
  top: 0;
  left: 0;
  overflow-x: hidden;
  height: 100vh;
  width: ${sizes.appNavBarLeftWidth}px;
  background: ${color.backgroundDarkPrimary};
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  ${mixin.hardwareAccelerate}
  display: flex;
  flex-direction: column;
  &:hover {
    width: 216px;
    box-shadow: 4px 0 24px 0 rgba(0, 0, 0, 0.35);
  }
`;

export const LogoLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 20px 0 12px;
  transition: opacity 0.15s;
  &:hover {
    opacity: 0.85;
  }
`;

export const StyledLogo = styled(Logo)`
  display: inline-block;
  margin-left: 16px;
  flex-shrink: 0;
  ${mixin.clickable}
`;

export const Bottom = styled.div`
  margin-top: auto;
  padding-bottom: 16px;
`;

export const Divider = styled.div`
  height: 1px;
  margin: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
`;

export const Item = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  padding: 0 0 0 22px;
  color: rgba(255, 255, 255, 0.65);
  transition: color 0.15s, background 0.15s;
  ${mixin.clickable}
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.95);
  }
  &.active {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.12);
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      bottom: 8px;
      width: 3px;
      border-radius: 0 3px 3px 0;
      background: #818CF8;
    }
  }
  i {
    font-size: 20px;
    flex-shrink: 0;
    width: 24px;
    text-align: center;
  }
`;

export const ItemText = styled.span`
  margin-left: 14px;
  white-space: nowrap;
  visibility: hidden;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.15s, visibility 0.15s, transform 0.15s;
  ${font.medium}
  ${font.size(13)}
  letter-spacing: 0.01em;
  ${NavLeft}:hover & {
    visibility: visible;
    opacity: 1;
    transform: translateX(0);
  }
`;

import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { font, sizes, color, mixin, zIndexValues } from 'shared/utils/styles';
import { Logo, Avatar } from 'shared/components';

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

export const AccountSection = styled.div`
  margin: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
`;

export const ProfileCard = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 54px;
  padding: 10px 12px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.92);
  transition: background 0.15s, transform 0.15s;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  &.active {
    background: rgba(255, 255, 255, 0.12);
  }
`;

export const ProfileAvatar = styled(Avatar)`
  flex-shrink: 0;
`;

export const ProfileMeta = styled.div`
  min-width: 0;
  visibility: hidden;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.15s, visibility 0.15s, transform 0.15s;
  ${NavLeft}:hover & {
    visibility: visible;
    opacity: 1;
    transform: translateX(0);
  }
`;

export const ProfileName = styled.div`
  color: #ffffff;
  ${font.size(13)}
  ${font.bold}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProfileRole = styled.div`
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.65);
  ${font.size(11.5)}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SignOutButton = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.78);
  text-align: left;
  ${font.size(12.5)}
  ${font.medium}
  transition: background 0.15s, color 0.15s;
  visibility: hidden;
  opacity: 0;
  transform: translateX(-6px);
  ${NavLeft}:hover & {
    visibility: visible;
    opacity: 1;
    transform: translateX(0);
  }
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }
`;

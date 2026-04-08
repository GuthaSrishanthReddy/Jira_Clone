import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';

import { color, font, mixin } from 'shared/utils/styles';

// ─── Category color map ────────────────────────────────────────────────────
export const categoryColors = {
  software: { bg: '#4F46E5', light: '#EEF2FF', text: '#3730A3' },
  marketing: { bg: '#10B981', light: '#ECFDF5', text: '#065F46' },
  business: { bg: '#F59E0B', light: '#FFFBEB', text: '#92400E' },
};

// ─── Page shell ────────────────────────────────────────────────────────────
export const Page = styled.div`
  min-height: 100vh;
  background: #F8FAFC;
`;

// ─── Top navigation bar ────────────────────────────────────────────────────
export const Topbar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 16px;
  height: 56px;
  padding: 0 32px;
  background: ${color.backgroundDarkPrimary};
  box-shadow: 0 1px 0 rgba(255,255,255,0.06);
`;

export const TopbarBrand = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  color: #fff;
  ${font.bold}
  ${font.size(16)}
  letter-spacing: -0.01em;
  &:hover { opacity: 0.85; }
`;

export const TopbarSearch = styled.div`
  flex: 1;
  max-width: 400px;
  position: relative;
  margin-left: 16px;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 34px;
  padding: 0 12px 0 36px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.1);
  color: #fff;
  ${font.size(13)}
  outline: none;
  transition: border 0.15s, background 0.15s;
  &::placeholder { color: rgba(255,255,255,0.45); }
  &:focus {
    border-color: rgba(255,255,255,0.4);
    background: rgba(255,255,255,0.14);
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.45);
  display: flex;
  align-items: center;
`;

export const TopbarRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const TopbarUserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 6px;
  border-radius: 999px;
  background: rgba(255,255,255,0.1);
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: rgba(255,255,255,0.17); }
`;

export const TopbarUserName = styled.span`
  color: rgba(255,255,255,0.9);
  ${font.size(13)}
  ${font.medium}
`;

export const SignOutBtn = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.8);
  ${font.size(12.5)}
  ${font.medium}
  transition: background 0.15s, color 0.15s;
  &:hover { background: rgba(255,255,255,0.2); color: #fff; }
`;

// ─── Welcome hero ──────────────────────────────────────────────────────────
export const Hero = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 36px 32px 28px;
  background: linear-gradient(135deg, ${color.backgroundDarkPrimary} 0%, #2D2B6B 100%);
  @media (max-width: 800px) { flex-direction: column; align-items: flex-start; }
`;

export const HeroLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const HeroAvatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.2);
  object-fit: cover;
  flex-shrink: 0;
`;

export const HeroAvatarFallback = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.2);
  background: ${color.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  ${font.size(24)}
  ${font.bold}
  flex-shrink: 0;
`;

export const HeroText = styled.div``;

export const HeroGreeting = styled.div`
  color: rgba(255,255,255,0.6);
  ${font.size(13)}
  ${font.medium}
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

export const HeroName = styled.h1`
  margin-top: 2px;
  color: #fff;
  ${font.size(26)}
  ${font.bold}
  letter-spacing: -0.02em;
`;

export const HeroRole = styled.div`
  margin-top: 4px;
  color: rgba(255,255,255,0.55);
  ${font.size(13)}
`;

export const HeroStats = styled.div`
  display: flex;
  gap: 12px;
  @media (max-width: 600px) { flex-wrap: wrap; }
`;

export const HeroStatCard = styled.div`
  min-width: 110px;
  padding: 14px 18px;
  border-radius: 14px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  text-align: center;
`;

export const HeroStatValue = styled.div`
  color: #fff;
  ${font.size(28)}
  ${font.bold}
  letter-spacing: -0.03em;
  line-height: 1;
`;

export const HeroStatLabel = styled.div`
  margin-top: 5px;
  color: rgba(255,255,255,0.5);
  ${font.size(11)}
  ${font.medium}
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// ─── Toolbar (filters + sort) ──────────────────────────────────────────────
export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 32px 4px;
`;

export const FilterTabs = styled.div`
  display: flex;
  gap: 4px;
`;

export const FilterTab = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  ${font.size(13)}
  ${font.medium}
  transition: background 0.15s, color 0.15s;
  ${({ $active }) =>
    $active
      ? css`
          background: ${color.primary};
          color: #fff;
        `
      : css`
          background: transparent;
          color: ${color.textMedium};
          &:hover { background: ${color.backgroundLight}; color: ${color.textDark}; }
        `}
`;

export const SortLabel = styled.span`
  color: ${color.textLight};
  ${font.size(12.5)}
  ${font.medium}
`;

// ─── Projects grid ─────────────────────────────────────────────────────────
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  padding: 20px 32px 48px;
  @media (max-width: 1100px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;

// ─── Project card ──────────────────────────────────────────────────────────
export const Card = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background: #fff;
  border: 1px solid ${color.borderLightest};
  ${mixin.boxShadowCard}
  overflow: hidden;
  transition: box-shadow 0.18s, transform 0.18s;
  &:hover {
    box-shadow: 0 8px 28px -4px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04);
    transform: translateY(-2px);
  }
`;

export const CardAccent = styled.div`
  height: 4px;
  background: ${({ $color }) => $color || color.primary};
`;

export const CardBody = styled.div`
  padding: 18px 20px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

export const CardTitle = styled.h2`
  color: ${color.textDarkest};
  ${font.size(16)}
  ${font.bold}
  letter-spacing: -0.01em;
  line-height: 1.3;
`;

export const GithubBadge = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  background: #f1f5f9;
  color: ${color.textMedium};
  ${font.size(11)}
  ${font.medium}
  white-space: nowrap;
  flex-shrink: 0;
  text-decoration: none;
  transition: background 0.15s;
  &:hover { background: #e2e8f0; }
`;

export const CategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  margin-top: 6px;
  border-radius: 6px;
  background: ${({ $bg }) => $bg || color.backgroundLightPrimary};
  color: ${({ $textColor }) => $textColor || color.primary};
  ${font.size(11)}
  ${font.bold}
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

export const CardDescription = styled.p`
  margin-top: 10px;
  color: ${color.textMedium};
  ${font.size(13)}
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// ─── Team avatars ──────────────────────────────────────────────────────────
export const TeamRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
`;

export const AvatarStack = styled.div`
  display: flex;
`;

export const MemberAvatar = styled.img`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid #fff;
  object-fit: cover;
  margin-left: ${({ $first }) => ($first ? '0' : '-8px')};
`;

export const AvatarFallback = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-left: ${({ $first }) => ($first ? '0' : '-8px')};
  background: ${({ $bg }) => $bg || color.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  ${font.size(10)}
  ${font.bold}
`;

export const AvatarOverflow = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-left: -8px;
  background: ${color.backgroundLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${color.textMedium};
  ${font.size(9.5)}
  ${font.bold}
`;

export const TeamLabel = styled.span`
  color: ${color.textLight};
  ${font.size(12)}
`;

// ─── Issue stats ───────────────────────────────────────────────────────────
export const StatsRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
`;

export const StatPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 999px;
  background: ${({ $bg }) => $bg || color.backgroundLightest};
  color: ${({ $color }) => $color || color.textMedium};
  ${font.size(12)}
  ${font.medium}
`;

export const StatDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $color }) => $color || color.textLight};
  flex-shrink: 0;
`;

// ─── Progress ──────────────────────────────────────────────────────────────
export const ProgressSection = styled.div`
  margin-top: 14px;
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

export const ProgressLabel = styled.span`
  color: ${color.textLight};
  ${font.size(11.5)}
`;

export const ProgressValue = styled.span`
  color: ${color.textMedium};
  ${font.size(11.5)}
  ${font.bold}
`;

export const ProgressBar = styled.div`
  height: 5px;
  border-radius: 999px;
  background: ${color.backgroundLight};
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: ${({ $color }) => $color || color.primary};
  width: ${({ $pct }) => Math.min($pct, 100)}%;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

// ─── AI health badge ───────────────────────────────────────────────────────
export const AIBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  padding: 5px 10px;
  border-radius: 8px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  ${font.size(12)}
  ${font.medium}
  border: 1px solid ${({ $border }) => $border};
`;

export const AIBadgeDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

// ─── Card footer ───────────────────────────────────────────────────────────
export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 16px;
  padding: 12px 20px;
  border-top: 1px solid ${color.borderLightest};
  background: ${color.backgroundLightest};
`;

export const LastActivity = styled.span`
  color: ${color.textLight};
  ${font.size(11.5)}
`;

export const CardActions = styled.div`
  display: flex;
  gap: 6px;
`;

export const OpenBoardBtn = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  background: ${color.primary};
  color: #fff;
  ${font.size(12.5)}
  ${font.bold}
  transition: background 0.15s;
  ${mixin.clickable}
  &:hover { background: ${color.primaryDark}; }
`;

export const DashboardLink = styled.button`
  padding: 6px 10px;
  border-radius: 8px;
  background: transparent;
  color: ${color.textMedium};
  ${font.size(12.5)}
  ${font.medium}
  transition: background 0.15s, color 0.15s;
  ${mixin.clickable}
  &:hover { background: ${color.backgroundLight}; color: ${color.textDark}; }
`;

// ─── Empty / loading states ────────────────────────────────────────────────
export const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 64px 0;
  color: ${color.textLight};
  ${font.size(15)}
`;

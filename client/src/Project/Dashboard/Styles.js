import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import { color, font, mixin } from 'shared/utils/styles';

export const Page = styled.div`
  width: 100%;
`;

// ─── User banner ────────────────────────────────────────────────────────────
export const UserBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 28px;
  border-radius: 20px;
  background: linear-gradient(135deg, ${color.backgroundDarkPrimary} 0%, #312E81 100%);
  margin-bottom: 24px;
  @media (max-width: 760px) { flex-direction: column; align-items: flex-start; }
`;

export const BannerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

export const UserAvatarImg = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.25);
  object-fit: cover;
  flex-shrink: 0;
`;

export const UserAvatarFallback = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.25);
  background: #818CF8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  ${font.size(26)}
  ${font.bold}
  flex-shrink: 0;
`;

export const BannerUserInfo = styled.div``;

export const BannerLabel = styled.div`
  color: rgba(255,255,255,0.5);
  ${font.size(11.5)}
  ${font.medium}
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const BannerName = styled.h1`
  margin-top: 2px;
  color: #fff;
  ${font.size(24)}
  ${font.bold}
  letter-spacing: -0.02em;
`;

export const BannerRole = styled.div`
  margin-top: 3px;
  color: rgba(255,255,255,0.55);
  ${font.size(13)}
`;

export const BannerStats = styled.div`
  display: flex;
  gap: 10px;
  @media (max-width: 600px) { flex-wrap: wrap; }
`;

export const BannerStat = styled.div`
  min-width: 96px;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  text-align: center;
`;

export const BannerStatValue = styled.div`
  color: #fff;
  ${font.size(26)}
  ${font.bold}
  letter-spacing: -0.03em;
  line-height: 1;
`;

export const BannerStatLabel = styled.div`
  margin-top: 4px;
  color: rgba(255,255,255,0.5);
  ${font.size(10.5)}
  ${font.medium}
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

export const HubLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  border-radius: 8px;
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.85);
  ${font.size(12.5)}
  ${font.medium}
  transition: background 0.15s;
  &:hover { background: rgba(255,255,255,0.2); color: #fff; }
`;

// ─── Section header ─────────────────────────────────────────────────────────
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

export const SectionTitle = styled.h2`
  color: ${color.textDark};
  ${font.size(15)}
  ${font.bold}
`;

export const SectionBadge = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  background: ${color.backgroundLightPrimary};
  color: ${color.primary};
  ${font.size(12)}
  ${font.bold}
`;

// ─── Grid ────────────────────────────────────────────────────────────────────
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  @media (max-width: 950px) { grid-template-columns: 1fr; }
`;

// ─── Card ────────────────────────────────────────────────────────────────────
export const Card = styled.div`
  padding: 20px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid ${color.borderLightest};
  ${mixin.boxShadowCard}
`;

// ─── Issue list items ─────────────────────────────────────────────────────────
export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: ${color.backgroundLightest};
  transition: background 0.12s;
  cursor: default;
  &:hover { background: #EEF2FF; }
`;

export const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const TypeDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color || color.primary};
  flex-shrink: 0;
`;

export const ItemMain = styled.div`
  min-width: 0;
`;

export const ItemTitle = styled.div`
  color: ${color.textDark};
  ${font.size(13.5)}
  ${font.medium}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ItemMeta = styled.div`
  margin-top: 2px;
  color: ${color.textLight};
  ${font.size(11.5)}
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 8px;
  border-radius: 6px;
  background: ${({ $bg }) => $bg || color.backgroundLightPrimary};
  color: ${({ $color }) => $color || color.primary};
  white-space: nowrap;
  ${font.size(11)}
  ${font.bold}
  flex-shrink: 0;
`;

// ─── Release snapshot — horizontal bars ───────────────────────────────────────
export const SnapshotList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SnapshotRow = styled.div``;

export const SnapshotRowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

export const SnapshotLabel = styled.span`
  color: ${color.textDark};
  ${font.size(13)}
  ${font.medium}
`;

export const SnapshotCount = styled.span`
  color: ${color.textLight};
  ${font.size(12)}
`;

export const SnapshotBar = styled.div`
  height: 6px;
  border-radius: 999px;
  background: ${color.backgroundLight};
  overflow: hidden;
`;

export const SnapshotFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: ${({ $color }) => $color || color.primary};
  width: ${({ $pct }) => Math.min($pct, 100)}%;
`;

// ─── Team workload ─────────────────────────────────────────────────────────────
export const WorkloadItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 10px;
  background: ${color.backgroundLightest};
`;

export const WorkloadAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

export const WorkloadAvatarFallback = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg || color.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  ${font.size(11)}
  ${font.bold}
  flex-shrink: 0;
`;

export const WorkloadInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const WorkloadName = styled.div`
  color: ${color.textDark};
  ${font.size(13)}
  ${font.medium}
`;

export const WorkloadMeta = styled.div`
  color: ${color.textLight};
  ${font.size(11.5)}
`;

export const WorkloadBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 22px;
  padding: 0 7px;
  border-radius: 999px;
  background: ${color.backgroundLightPrimary};
  color: ${color.primary};
  ${font.size(12)}
  ${font.bold}
  flex-shrink: 0;
`;

// ─── Empty state ──────────────────────────────────────────────────────────────
export const EmptyState = styled.div`
  padding: 20px 0 8px;
  color: ${color.textLight};
  ${font.size(13.5)}
  text-align: center;
`;

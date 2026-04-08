import styled, { css } from 'styled-components';
import { color, font, mixin } from 'shared/utils/styles';

// ─── Severity palette ───────────────────────────────────────────────────────
export const SEVERITY = {
  critical: { bg: '#FFF1F2', border: '#FECDD3', text: '#BE123C', strip: '#E11D48', pill: '#FFE4E6' },
  high:     { bg: '#FFF7ED', border: '#FED7AA', text: '#C2410C', strip: '#EA580C', pill: '#FFEDD5' },
  medium:   { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309', strip: '#D97706', pill: '#FEF3C7' },
  low:      { bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D', strip: '#16A34A', pill: '#DCFCE7' },
};

const sev = (key) => ({ $severity }) => (SEVERITY[$severity] || SEVERITY.low)[key];

// ─── Page shell ─────────────────────────────────────────────────────────────
export const Page = styled.div`
  width: 100%;
`;

// ─── Header ─────────────────────────────────────────────────────────────────
export const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

export const TitleSection = styled.div``;

export const PageTitle = styled.h1`
  display: flex;
  align-items: center;
  gap: 10px;
  ${font.size(24)}
  ${font.bold}
  color: ${color.textDarkest};
  letter-spacing: -0.02em;
`;

export const AiIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  flex-shrink: 0;
`;

export const PageSubtitle = styled.p`
  margin-top: 4px;
  color: ${color.textMedium};
  ${font.size(13.5)}
`;

export const ScanActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const ScanMeta = styled.div`
  color: ${color.textLight};
  ${font.size(12.5)}
  text-align: right;
`;

export const ScanBtn = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  background: ${color.primary};
  color: #fff;
  ${font.size(13)}
  ${font.bold}
  transition: background 0.15s;
  ${mixin.clickable}
  &:hover:not(:disabled) { background: ${color.primaryDark}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const FullScanBtn = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${color.borderLight};
  background: #fff;
  color: ${color.textDark};
  ${font.size(13)}
  ${font.medium}
  transition: background 0.15s, border-color 0.15s;
  ${mixin.clickable}
  &:hover:not(:disabled) { background: ${color.backgroundLightest}; border-color: ${color.primary}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const WarningBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 18px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #FFF7ED;
  border: 1px solid #FED7AA;
  color: #9A3412;
  ${font.size(13)}
`;

export const WarningIcon = styled.span`
  flex-shrink: 0;
  ${font.bold}
`;

// ─── Severity summary bar ────────────────────────────────────────────────────
export const SummaryBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const SummaryCard = styled.div`
  flex: 1;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 12px;
  border-radius: 12px;
  background: ${sev('bg')};
  border: 1px solid ${sev('border')};
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.15s;
  ${({ $active, $severity }) => $active && `
    box-shadow: 0 0 0 2px ${(SEVERITY[$severity] || SEVERITY.low).strip};
    transform: translateY(-1px);
  `}
`;

export const SummaryCount = styled.div`
  color: ${sev('text')};
  ${font.size(28)}
  ${font.bold}
  line-height: 1;
  letter-spacing: -0.03em;
`;

export const SummaryLabel = styled.div`
  margin-top: 4px;
  color: ${sev('text')};
  ${font.size(11)}
  ${font.bold}
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.75;
`;

export const UnassignedCard = styled.div`
  flex: 1;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 12px;
  border-radius: 12px;
  background: ${color.backgroundLightest};
  border: 1px solid ${color.borderLightest};
  cursor: pointer;
  transition: box-shadow 0.15s;
  ${({ $active }) => $active && css`
    box-shadow: 0 0 0 2px ${color.primary};
  `}
`;

export const UnassignedCount = styled.div`
  color: ${color.textDark};
  ${font.size(28)}
  ${font.bold}
  line-height: 1;
  letter-spacing: -0.03em;
`;

export const UnassignedLabel = styled.div`
  margin-top: 4px;
  color: ${color.textLight};
  ${font.size(11)}
  ${font.bold}
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

// ─── Filter row ──────────────────────────────────────────────────────────────
export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

export const FilterTabs = styled.div`
  display: flex;
  gap: 4px;
`;

export const FilterTab = styled.button`
  padding: 5px 12px;
  border-radius: 8px;
  ${font.size(13)}
  ${font.medium}
  transition: background 0.12s, color 0.12s;
  ${({ $active }) =>
    $active
      ? css`background: ${color.primary}; color: #fff;`
      : css`color: ${color.textMedium}; &:hover { background: ${color.backgroundLight}; color: ${color.textDark}; }`}
`;

export const ResultCount = styled.span`
  color: ${color.textLight};
  ${font.size(12.5)}
`;

// ─── Finding rows ────────────────────────────────────────────────────────────
export const FindingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FindingRow = styled.div`
  border-radius: 14px;
  background: #fff;
  border: 1px solid ${color.borderLightest};
  ${mixin.boxShadowCard}
  overflow: hidden;
  transition: box-shadow 0.15s;
  &:hover {
    box-shadow: 0 4px 16px -4px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04);
  }
`;

export const FindingRowInner = styled.div`
  display: flex;
`;

export const SeverityStrip = styled.div`
  width: 4px;
  flex-shrink: 0;
  background: ${sev('strip')};
`;

export const FindingContent = styled.div`
  flex: 1;
  padding: 16px 20px;
  min-width: 0;
`;

export const FindingTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex-wrap: wrap;
`;

export const SeverityPill = styled.span`
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 6px;
  background: ${sev('pill')};
  color: ${sev('text')};
  ${font.size(11)}
  ${font.bold}
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const FindingTitle = styled.h3`
  ${font.size(14.5)}
  ${font.bold}
  color: ${color.textDarkest};
  margin: 0;
  line-height: 1.4;
`;

export const FindingPath = styled.div`
  margin-top: 5px;
  color: ${color.textLight};
  ${font.size(12)}
  font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FindingReason = styled.p`
  margin-top: 10px;
  color: ${color.textMedium};
  ${font.size(13.5)}
  line-height: 1.6;
`;

export const SuggestedFix = styled.div`
  margin-top: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #F8FAFC;
  border: 1px solid ${color.borderLightest};
`;

export const FixHint = styled.span`
  display: block;
  ${font.size(11)}
  ${font.bold}
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${color.textLight};
  margin-bottom: 4px;
`;

export const FixText = styled.p`
  ${font.size(13)}
  color: ${color.textDark};
  line-height: 1.55;
  margin: 0;
`;

// ─── Assignment footer ───────────────────────────────────────────────────────
export const AssignFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 20px;
  background: ${color.backgroundLightest};
  border-top: 1px solid ${color.borderLightest};
  flex-wrap: wrap;
`;

export const AssignLabel = styled.span`
  color: ${color.textLight};
  ${font.size(12.5)}
  ${font.medium}
  white-space: nowrap;
  flex-shrink: 0;
`;

export const AvatarPickerRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  flex: 1;
  flex-wrap: wrap;
`;

export const AssignableAvatar = styled.button`
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  padding: 0;
  border: 2px solid ${({ $selected }) => $selected ? color.primary : 'transparent'};
  box-shadow: ${({ $selected }) => $selected ? `0 0 0 2px ${color.primaryLight}` : 'none'};
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.12s;
  ${mixin.clickable}
  &:hover { transform: scale(1.1); border-color: ${color.primary}; }
  overflow: hidden;
`;

export const AssignableAvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
`;

export const AssignableAvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${({ $bg }) => $bg || color.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  ${font.size(11)}
  ${font.bold}
`;

export const SelectedCheck = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(79,70,229,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AssignBtn = styled.button`
  padding: 7px 16px;
  border-radius: 8px;
  background: ${({ disabled }) => disabled ? color.backgroundLight : color.primary};
  color: ${({ disabled }) => disabled ? color.textLight : '#fff'};
  ${font.size(13)}
  ${font.bold}
  transition: background 0.15s;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  white-space: nowrap;
  flex-shrink: 0;
  &:hover:not(:disabled) { background: ${color.primaryDark}; }
`;

// ─── Already-assigned state ──────────────────────────────────────────────────
export const AssignedInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AssignedAvatar = styled.img`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
`;

export const AssignedAvatarFallback = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg || color.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  ${font.size(10)}
  ${font.bold}
`;

export const AssignedText = styled.span`
  color: ${color.success};
  ${font.size(13)}
  ${font.bold}
`;

export const BoardLink = styled.span`
  color: ${color.textLight};
  ${font.size(12)}
`;

// ─── Scan history ────────────────────────────────────────────────────────────
export const HistorySection = styled.div`
  margin-top: 36px;
  padding-top: 24px;
  border-top: 1px solid ${color.borderLightest};
`;

export const HistoryTitle = styled.h3`
  ${font.size(15)}
  ${font.bold}
  color: ${color.textDark};
  margin-bottom: 12px;
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const HistoryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid ${color.borderLightest};
  flex-wrap: wrap;
`;

export const ScanStatus = styled.span`
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  border-radius: 6px;
  ${font.size(11.5)}
  ${font.bold}
  flex-shrink: 0;
  ${({ $status }) => {
    if ($status === 'completed') return css`background:#D1FAE5;color:#065F46;`;
    if ($status === 'failed') return css`background:#FEE2E2;color:#991B1B;`;
    return css`background:#FEF3C7;color:#92400E;`;
  }}
`;

export const ScanText = styled.span`
  ${font.size(12.5)}
  color: ${color.textMedium};
`;

// ─── Empty / not configured ──────────────────────────────────────────────────
export const EmptyState = styled.div`
  padding: 64px 24px;
  text-align: center;
  color: ${color.textLight};
  ${font.size(15)}
  border-radius: 14px;
  background: #fff;
  border: 1px solid ${color.borderLightest};
`;

export const EmptyIcon = styled.div`
  font-size: 36px;
  margin-bottom: 12px;
`;

import { css } from 'styled-components';
import Color from 'color';

import { IssueType, IssueStatus, IssuePriority } from 'shared/constants/issues';

export const color = {
  primary: '#4F46E5',         // indigo-600
  primaryDark: '#3730A3',     // indigo-800
  primaryLight: '#EEF2FF',    // indigo-50

  success: '#10B981',         // emerald-500
  danger: '#EF4444',          // red-500
  warning: '#F59E0B',         // amber-500
  secondary: '#F1F5F9',       // slate-100

  textDarkest: '#0F172A',     // slate-900
  textDark: '#1E293B',        // slate-800
  textMedium: '#475569',      // slate-600
  textLight: '#94A3B8',       // slate-400
  textLink: '#4F46E5',        // indigo

  backgroundDarkPrimary: '#1E1B4B',   // deep indigo (sidebar)
  backgroundDarkSecondary: '#2D2B6B', // slightly lighter indigo
  backgroundMedium: '#CBD5E1',        // slate-300
  backgroundLight: '#E2E8F0',         // slate-200
  backgroundLightest: '#F8FAFC',      // slate-50
  backgroundLightPrimary: '#EEF2FF',  // indigo-50
  backgroundLightSuccess: '#ECFDF5',  // emerald-50

  borderLightest: '#E2E8F0',  // slate-200
  borderLight: '#CBD5E1',     // slate-300
  borderInputFocus: '#6366F1', // indigo-500

  // Status-specific column accent colors
  statusBacklog: '#64748B',       // slate-500
  statusSelected: '#D97706',      // amber-600
  statusInProgress: '#2563EB',    // blue-600
  statusDone: '#16A34A',          // green-600

  // Kanban column backgrounds
  columnBacklog: '#F8FAFC',
  columnSelected: '#FFFBEB',
  columnInProgress: '#EFF6FF',
  columnDone: '#F0FDF4',
};

export const issueTypeColors = {
  [IssueType.TASK]: '#3B82F6',   // blue-500
  [IssueType.BUG]: '#EF4444',    // red-500
  [IssueType.STORY]: '#10B981',  // emerald-500
};

export const issuePriorityColors = {
  [IssuePriority.HIGHEST]: '#DC2626', // red-600
  [IssuePriority.HIGH]: '#EF4444',    // red-500
  [IssuePriority.MEDIUM]: '#F59E0B',  // amber-500
  [IssuePriority.LOW]: '#22C55E',     // green-500
  [IssuePriority.LOWEST]: '#86EFAC', // green-300
};

export const issueStatusColors = {
  [IssueStatus.BACKLOG]: color.textMedium,
  [IssueStatus.INPROGRESS]: '#FFFFFF',
  [IssueStatus.SELECTED]: color.textDark,
  [IssueStatus.DONE]: '#FFFFFF',
};

export const issueStatusBackgroundColors = {
  [IssueStatus.BACKLOG]: color.backgroundLight,
  [IssueStatus.INPROGRESS]: color.primary,
  [IssueStatus.SELECTED]: '#F59E0B',
  [IssueStatus.DONE]: color.success,
};

export const sizes = {
  appNavBarLeftWidth: 68,
  secondarySideBarWidth: 240,
  minViewportWidth: 1000,
};

export const zIndexValues = {
  modal: 1000,
  dropdown: 101,
  navLeft: 100,
};

const interStack = '"Inter", "CircularStdBook", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export const font = {
  regular: `font-family: ${interStack}; font-weight: 400;`,
  medium: `font-family: ${interStack}; font-weight: 500;`,
  bold: `font-family: ${interStack}; font-weight: 600;`,
  black: `font-family: ${interStack}; font-weight: 700;`,
  size: size => `font-size: ${size}px;`,
};

export const mixin = {
  darken: (colorValue, amount) =>
    Color(colorValue)
      .darken(amount)
      .string(),
  lighten: (colorValue, amount) =>
    Color(colorValue)
      .lighten(amount)
      .string(),
  rgba: (colorValue, opacity) =>
    Color(colorValue)
      .alpha(opacity)
      .string(),
  boxShadowMedium: css`
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  `,
  boxShadowDropdown: css`
    box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05);
  `,
  boxShadowCard: css`
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.07);
  `,
  truncateText: css`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  `,
  clickable: css`
    cursor: pointer;
    user-select: none;
  `,
  hardwareAccelerate: css`
    transform: translateZ(0);
  `,
  cover: css`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  `,
  placeholderColor: colorValue => css`
    ::-webkit-input-placeholder {
      color: ${colorValue} !important;
      opacity: 1 !important;
    }
    :-moz-placeholder {
      color: ${colorValue} !important;
      opacity: 1 !important;
    }
    ::-moz-placeholder {
      color: ${colorValue} !important;
      opacity: 1 !important;
    }
    :-ms-input-placeholder {
      color: ${colorValue} !important;
      opacity: 1 !important;
    }
  `,
  scrollableY: css`
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  `,
  customScrollbar: ({ width = 6, background = color.borderLight } = {}) => css`
    &::-webkit-scrollbar {
      width: ${width}px;
    }
    &::-webkit-scrollbar-track {
      background: none;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 99px;
      background: ${background};
      &:hover {
        background: ${color.borderInputFocus};
      }
    }
  `,
  backgroundImage: imageURL => css`
    background-image: url("${imageURL}");
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: ${color.backgroundLight};
  `,
  link: (colorValue = color.textLink) => css`
    cursor: pointer;
    color: ${colorValue};
    ${font.medium}
    &:hover, &:visited, &:active {
      color: ${colorValue};
    }
    &:hover {
      text-decoration: underline;
    }
  `,
  tag: (background = color.backgroundLight, colorValue = color.textDark) => css`
    display: inline-flex;
    align-items: center;
    height: 22px;
    padding: 0 8px;
    border-radius: 6px;
    cursor: pointer;
    user-select: none;
    color: ${colorValue};
    background: ${background};
    ${font.bold}
    ${font.size(11)}
    i {
      margin-left: 4px;
    }
  `,
};

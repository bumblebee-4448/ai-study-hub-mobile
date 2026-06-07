/**
 * Design System - Color Palette, Typography, Spacing
 * Material Design 3 inspired theme for AcademiShare
 */

import { Platform } from 'react-native';

// ============================================================================
// COLORS - Material Design 3 Color System
// ============================================================================

export const COLORS = {
  // Primary Brand Color
  primary: '#004ac6',
  'on-primary': '#ffffff',
  'primary-container': '#2563eb',
  'on-primary-container': '#eeefff',
  'primary-fixed': '#dbe1ff',
  'primary-fixed-dim': '#b4c5ff',
  'on-primary-fixed': '#00174b',
  'on-primary-fixed-variant': '#003ea8',

  // Secondary
  secondary: '#2b6193',
  'on-secondary': '#ffffff',
  'secondary-container': '#93c5fd',
  'on-secondary-container': '#145283',
  'secondary-fixed': '#d0e4ff',
  'secondary-fixed-dim': '#9ccaff',
  'on-secondary-fixed': '#001d35',
  'on-secondary-fixed-variant': '#03497a',

  // Tertiary
  tertiary: '#943700',
  'on-tertiary': '#ffffff',
  'tertiary-container': '#bc4800',
  'on-tertiary-container': '#ffede6',
  'tertiary-fixed': '#ffdbcd',
  'tertiary-fixed-dim': '#ffb596',
  'on-tertiary-fixed': '#360f00',
  'on-tertiary-fixed-variant': '#7d2d00',

  // Error
  error: '#ba1a1a',
  'on-error': '#ffffff',
  'error-container': '#ffdad6',
  'on-error-container': '#93000a',

  // Background & Surface
  background: '#faf8ff',
  'on-background': '#191b23',
  surface: '#faf8ff',
  'on-surface': '#191b23',
  'on-surface-variant': '#434655',
  'surface-variant': '#e1e2ed',
  'surface-bright': '#faf8ff',
  'surface-dim': '#d9d9e5',
  'surface-container-lowest': '#ffffff',
  'surface-container-low': '#f3f3fe',
  'surface-container': '#ededf9',
  'surface-container-high': '#e7e7f3',
  'surface-container-highest': '#e1e2ed',

  // Other
  'inverse-surface': '#2e3039',
  'inverse-on-surface': '#f0f0fb',
  'inverse-primary': '#b4c5ff',
  'surface-tint': '#0053db',
  outline: '#737686',
  'outline-variant': '#c3c6d7',
};

// ============================================================================
// TYPOGRAPHY - Font Sizes and Styles
// ============================================================================

export const TYPOGRAPHY = {
  'display': {
    fontSize: 48,
    lineHeight: 52.8,
    letterSpacing: -0.96,
    fontWeight: '700' as const,
  },
  'headline-lg': {
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.32,
    fontWeight: '700' as const,
  },
  'headline-md': {
    fontSize: 24,
    lineHeight: 31.2,
    fontWeight: '600' as const,
  },
  'headline-lg-mobile': {
    fontSize: 24,
    lineHeight: 28.8,
    fontWeight: '700' as const,
  },
  'body-lg': {
    fontSize: 18,
    lineHeight: 28.8,
    fontWeight: '400' as const,
  },
  'body-md': {
    fontSize: 16,
    lineHeight: 25.6,
    fontWeight: '400' as const,
  },
  'label-md': {
    fontSize: 14,
    lineHeight: 19.6,
    letterSpacing: 0.1,
    fontWeight: '600' as const,
  },
  'label-sm': {
    fontSize: 12,
    lineHeight: 16.8,
    fontWeight: '500' as const,
  },
};

// ============================================================================
// SPACING - Sizing and Gaps
// ============================================================================

export const SPACING = {
  'base': 8,
  'sm': 8,
  'md': 16,
  'lg': 24,
  'xl': 32,
  'margin-mobile': 16,
  'margin-desktop': 40,
  'container-max': 1280,
  'gutter': 24,
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const BORDER_RADIUS = {
  'none': 0,
  'xs': 2,
  'sm': 4,
  'md': 8,
  'lg': 12,
  'xl': 16,
  'full': 24,
};

// ============================================================================
// Fonts (Legacy - kept for backwards compatibility)
// ============================================================================

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ============================================================================
// Legacy Colors (kept for backwards compatibility with existing code)
// ============================================================================

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

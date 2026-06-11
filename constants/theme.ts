/**
 * Design System - Color Palette, Typography, Spacing
 * Material Design 3 inspired theme for AcademiShare
 */

import { Platform } from "react-native";

export const COLORS = {
  primary: "#004ac6",
  "on-primary": "#ffffff",
  "primary-container": "#2563eb",
  "on-primary-container": "#eeefff",
  "primary-fixed": "#dbe1ff",
  "primary-fixed-dim": "#b4c5ff",
  "on-primary-fixed": "#00174b",
  "on-primary-fixed-variant": "#003ea8",

  secondary: "#2b6193",
  "on-secondary": "#ffffff",
  "secondary-container": "#93c5fd",
  "on-secondary-container": "#145283",
  "secondary-fixed": "#d0e4ff",
  "secondary-fixed-dim": "#9ccaff",
  "on-secondary-fixed": "#001d35",
  "on-secondary-fixed-variant": "#03497a",

  tertiary: "#943700",
  "on-tertiary": "#ffffff",
  "tertiary-container": "#bc4800",
  "on-tertiary-container": "#ffede6",
  "tertiary-fixed": "#ffdbcd",
  "tertiary-fixed-dim": "#ffb596",
  "on-tertiary-fixed": "#360f00",
  "on-tertiary-fixed-variant": "#7d2d00",

  error: "#ba1a1a",
  "on-error": "#ffffff",
  "error-container": "#ffdad6",
  "on-error-container": "#93000a",

  surface: "#faf8ff",
  "surface-dim": "#d9d9e5",
  "surface-bright": "#faf8ff",
  "surface-container-lowest": "#ffffff",
  "surface-container-low": "#f3f3fe",
  "surface-container": "#ededf9",
  "surface-container-high": "#e7e7f3",
  "surface-container-highest": "#e1e2ed",
  "surface-variant": "#e1e2ed",
  "surface-tint": "#0053db",

  background: "#faf8ff",
  "on-background": "#191b23",
  "on-surface": "#191b23",
  "on-surface-variant": "#434655",

  outline: "#737686",
  "outline-variant": "#c3c6d7",

  "inverse-surface": "#2e3039",
  "inverse-on-surface": "#f0f0fb",
  "inverse-primary": "#b4c5ff",
} as const;

export const TYPOGRAPHY = {
  display: {
    fontSize: 48,
    lineHeight: 53,
    letterSpacing: -0.96,
    fontWeight: "700" as const,
  },
  "headline-lg": {
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.32,
    fontWeight: "700" as const,
  },
  "headline-lg-mobile": {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "700" as const,
  },
  "headline-md": {
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "600" as const,
  },
  "body-lg": {
    fontSize: 18,
    lineHeight: 29,
    fontWeight: "400" as const,
  },
  "body-md": {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "400" as const,
  },
  "label-md": {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.14,
    fontWeight: "600" as const,
  },
  "label-sm": {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "500" as const,
  },
} as const;

export const SPACING = {
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "margin-mobile": 16,
  "margin-desktop": 40,
  "container-max": 1280,
  gutter: 24,
} as const;

export const BORDER_RADIUS = {
  none: 0,
  xs: 2,
  sm: 2,
  md: 8,
  lg: 4,
  xl: 8,
  full: 12,
} as const;

export const FONT_FAMILY = Platform.select({
  ios: { sans: "System" },
  android: { sans: "Roboto" },
  default: { sans: "System" },
});

<<<<<<< HEAD
export const theme = {
  colors: {
    primary: '#6366f1', // Indigo
    primaryGradient: ['#6366f1', '#8b5cf6'] as const, // Indigo to Violet
    secondary: '#06b6d4', // Cyan
    secondaryGradient: ['#06b6d4', '#3b82f6'] as const, // Cyan to Blue
    success: '#10b981', // Emerald green
    successBg: '#ecfdf5',
    warning: '#f59e0b', // Amber/orange
    warningBg: '#fffbe6',
    danger: '#f43f5e', // Rose red
    dangerBg: '#fff1f2',
    backgroundLight: '#f8fafc', // Slate 50
    backgroundDark: '#0f172a',  // Slate 900
    cardLight: '#ffffff',
    cardDark: '#1e293b',        // Slate 800
    borderLight: '#f1f5f9',     // Slate 100
    borderDark: '#334155',      // Slate 700
    textPrimaryLight: '#0f172a', // Slate 900
    textPrimaryDark: '#f8fafc',
    textSecondaryLight: '#64748b', // Slate 500
    textSecondaryDark: '#94a3b8',
=======
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
>>>>>>> dev
  },
  shadows: {
    soft: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.03,
      shadowRadius: 12,
      elevation: 2,
    },
    medium: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.06,
      shadowRadius: 18,
      elevation: 4,
    },
  },
<<<<<<< HEAD
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 24,
    round: 9999,
  }
};

=======
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Colors = {
  light: {
    text: COLORS["on-surface"],
    background: COLORS.background,
    tint: COLORS.primary,
    icon: COLORS["on-surface-variant"],
    tabIconDefault: COLORS["on-surface-variant"],
    tabIconSelected: COLORS.primary,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#fff",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#fff",
  },
};
>>>>>>> dev

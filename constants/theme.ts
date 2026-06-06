/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

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
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 24,
    round: 9999,
  }
};


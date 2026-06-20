export type ThemePreference = "system" | "light" | "dark";
export type ResolvedThemeScheme = "light" | "dark";
export type SystemColorScheme = ResolvedThemeScheme | null | undefined;

export type AppThemeColors = {
  primary: string;
  primaryStrong: string;
  primaryMuted: string;
  onPrimary: string;
  secondary: string;
  success: string;
  successMuted: string;
  successText: string;
  warning: string;
  warningMuted: string;
  warningText: string;
  danger: string;
  dangerMuted: string;
  dangerText: string;
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceMuted: string;
  surfaceSubtle: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  border: string;
  borderStrong: string;
  icon: string;
  overlay: string;
  shadow: string;
  inverseSurface: string;
  inverseText: string;
  tabActive: string;
  tabInactive: string;
};

export type AppTheme = {
  scheme: ResolvedThemeScheme;
  isDark: boolean;
  colors: AppThemeColors;
};

export const THEME_PREFERENCE_LABELS: Record<ThemePreference, string> = {
  system: "Theo hệ thống",
  light: "Sáng",
  dark: "Tối",
};

const LIGHT_COLORS: AppThemeColors = {
  primary: "#004ac6",
  primaryStrong: "#003ea8",
  primaryMuted: "#eff6ff",
  onPrimary: "#ffffff",
  secondary: "#2b6193",
  success: "#10b981",
  successMuted: "#ecfdf5",
  successText: "#047857",
  warning: "#f59e0b",
  warningMuted: "#fffbeb",
  warningText: "#b45309",
  danger: "#dc2626",
  dangerMuted: "#fef2f2",
  dangerText: "#b91c1c",
  background: "#f8fafc",
  surface: "#ffffff",
  surfaceRaised: "#ffffff",
  surfaceMuted: "#f8fafc",
  surfaceSubtle: "#f1f5f9",
  text: "#0f172a",
  textMuted: "#475569",
  textSubtle: "#64748b",
  border: "#e2e8f0",
  borderStrong: "#cbd5e1",
  icon: "#475569",
  overlay: "rgba(15, 23, 42, 0.38)",
  shadow: "#0f172a",
  inverseSurface: "#0f172a",
  inverseText: "#ffffff",
  tabActive: "#004ac6",
  tabInactive: "#94a3b8",
};

const DARK_COLORS: AppThemeColors = {
  primary: "#7dd3fc",
  primaryStrong: "#38bdf8",
  primaryMuted: "#0c2a3a",
  onPrimary: "#06101f",
  secondary: "#a5b4fc",
  success: "#34d399",
  successMuted: "#063a2a",
  successText: "#86efac",
  warning: "#fbbf24",
  warningMuted: "#3a2605",
  warningText: "#fde68a",
  danger: "#fb7185",
  dangerMuted: "#3d1018",
  dangerText: "#fecdd3",
  background: "#070b12",
  surface: "#101827",
  surfaceRaised: "#172033",
  surfaceMuted: "#0c1424",
  surfaceSubtle: "#1f2a3d",
  text: "#f8fafc",
  textMuted: "#cbd5e1",
  textSubtle: "#94a3b8",
  border: "#263247",
  borderStrong: "#3b4963",
  icon: "#cbd5e1",
  overlay: "rgba(0, 0, 0, 0.58)",
  shadow: "#000000",
  inverseSurface: "#f8fafc",
  inverseText: "#0f172a",
  tabActive: "#7dd3fc",
  tabInactive: "#7c8799",
};

export const APP_THEME_COLORS: Record<ResolvedThemeScheme, AppThemeColors> = {
  light: LIGHT_COLORS,
  dark: DARK_COLORS,
};

export function resolveThemePreference(
  preference: ThemePreference,
  systemScheme: SystemColorScheme
): ResolvedThemeScheme {
  if (preference === "light" || preference === "dark") {
    return preference;
  }

  return systemScheme === "dark" ? "dark" : "light";
}

export function getAppTheme(scheme: ResolvedThemeScheme): AppTheme {
  return {
    scheme,
    isDark: scheme === "dark",
    colors: APP_THEME_COLORS[scheme],
  };
}

import { useMemo } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

import {
  getAppTheme,
  resolveThemePreference,
  THEME_PREFERENCE_LABELS,
} from "../services/themeResolver";
import type { ThemePreference } from "../services/themeResolver";
import { useThemeStore } from "../store/themeStore";

export function useAppTheme() {
  const systemScheme = useSystemColorScheme();
  const preference = useThemeStore((state) => state.preference);
  const setThemePreference = useThemeStore((state) => state.setThemePreference);
  const hasHydrated = useThemeStore((state) => state._hasHydrated);

  const scheme = resolveThemePreference(preference, systemScheme);
  const appTheme = useMemo(() => getAppTheme(scheme), [scheme]);

  return {
    ...appTheme,
    preference,
    preferenceLabel: THEME_PREFERENCE_LABELS[preference],
    hasHydrated,
    setThemePreference,
  };
}

export type { ThemePreference };

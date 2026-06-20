import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { secureStorageService } from "@/services/storage/secureStorage";
import type { ThemePreference } from "../services/themeResolver";

type ThemeState = {
  preference: ThemePreference;
  _hasHydrated: boolean;
  setThemePreference: (preference: ThemePreference) => void;
  setHydrated: (state: boolean) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: "system",
      _hasHydrated: false,
      setThemePreference: (preference) => set({ preference }),
      setHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => secureStorageService),
      partialize: (state) => ({
        preference: state.preference,
      }),
      onRehydrateStorage: () => {
        return (hydratedState, error) => {
          if (!error && hydratedState) {
            hydratedState.setHydrated(true);
          }
        };
      },
    }
  )
);

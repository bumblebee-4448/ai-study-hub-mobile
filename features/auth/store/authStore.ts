import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStorageService } from '@/services/storage/secureStorage';
import type { AuthState } from '../types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      role: null,
      user: null,
      isLoginPromptOpen: false,
      _hasHydrated: false,
      setAuth: (accessToken, role, user, refreshToken) =>
        set((state) => ({
          accessToken,
          role,
          user: user !== undefined ? user : state.user,
          refreshToken: refreshToken !== undefined ? refreshToken : state.refreshToken,
        })),
      logout: () => {
        set({ accessToken: null, refreshToken: null, role: null, user: null });
        const storage = secureStorageService as any;
        if (storage.removeItem) {
          storage.removeItem('auth-storage').catch((err: any) => {
            console.error('Failed to clear auth storage during logout:', err);
          });
        }
      },
      setLoginPromptOpen: (open) => set({ isLoginPromptOpen: open }),
      setHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorageService),
      // Persist only security-sensitive/session information, not temporary UI state or hydration flag
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        role: state.role,
        user: state.user,
      }),
      onRehydrateStorage: (state) => {
        // Return a callback that runs after hydration is complete
        return (hydratedState, error) => {
          if (!error && hydratedState) {
            hydratedState.setHydrated(true);
          }
        };
      },
    }
  )
);

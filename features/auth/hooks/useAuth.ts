import { useMemo } from "react";

import { useAuthStore } from "../store/authStore";
import { useLogout } from "./useLogout";

export const useAuth = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const isLoginPromptOpen = useAuthStore((state) => state.isLoginPromptOpen);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const setLoginPromptOpen = useAuthStore((state) => state.setLoginPromptOpen);
  const logout = useLogout();

  return useMemo(
    () => ({
      accessToken,
      refreshToken,
      role,
      user,
      isAuthenticated: Boolean(accessToken),
      isLoginPromptOpen,
      hasHydrated,
      setLoginPromptOpen,
      logout,
    }),
    [
      accessToken,
      hasHydrated,
      isLoginPromptOpen,
      logout,
      refreshToken,
      role,
      setLoginPromptOpen,
      user,
    ]
  );
};

import { useCallback } from "react";

import { useProfileStore } from "@/features/profile/store/profileStore";
import { apiClient } from "@/services/api/axiosClient";
import { useAuthStore } from "../store/authStore";
import { getRedirectHrefForRole } from "../services/sessionRouting";
import { useRootRouteReset } from "./useRootRouteReset";

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.logout);
  const clearProfile = useProfileStore((state) => state.clearProfile);
  const resetToRootRoute = useRootRouteReset();

  return useCallback(async () => {
    try {
      await apiClient.post("/auth/logout", undefined, { skipAlert: true });
    } catch {
      // Local logout should still complete if the session is already invalid.
    } finally {
      clearProfile();
      clearAuth();
      resetToRootRoute(getRedirectHrefForRole(null));
    }
  }, [clearAuth, clearProfile, resetToRootRoute]);
};

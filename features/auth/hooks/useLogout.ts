import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/services/api/axiosClient";
import { useAuthStore } from "../store/authStore";
import { getRedirectHrefForRole } from "../services/sessionRouting";
import { useRootRouteReset } from "./useRootRouteReset";

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const resetToRootRoute = useRootRouteReset();
  const { mutate } = useMutation({
    mutationFn: async () => {
      try {
        await apiClient.post("/auth/logout", undefined, { skipAlert: true });
      } catch {
        // Local logout should still complete if the session is already invalid.
      }
    },
    onSettled: () => {
      queryClient.clear();
      clearAuth();
      resetToRootRoute(getRedirectHrefForRole(null));
    },
  });

  return useCallback(() => {
    mutate();
  }, [mutate]);
};

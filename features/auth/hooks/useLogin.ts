import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profileKeys } from "@/services/api/queryKeys";

import type { LoginFormType } from "../schemas/authSchema";
import { loginWithEmail } from "../services/authService";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginFormType) => loginWithEmail(credentials),
    onSuccess: (result) => {
      setAuth(
        result.accessToken,
        result.role,
        result.user,
        result.refreshToken
      );
      queryClient.setQueryData(profileKeys.detail(), result.profile);
    },
  });
};

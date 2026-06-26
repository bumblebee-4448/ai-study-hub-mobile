import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

import { mapBackendRole } from "@/features/auth/services/authMappers";
import { useLogout } from "@/features/auth";
import { useAuthStore } from "@/features/auth/store/authStore";
import { profileKeys } from "@/services/api/queryKeys";
import { getQueryErrorMessage } from "@/services/api/queryState";

import {
  fetchCurrentProfile,
  updateCurrentProfile,
} from "../services/profileService";
import type { UpdateProfileFormValues, UserProfile } from "../types";

const syncAuthStore = (profile: UserProfile) => {
  const authState = useAuthStore.getState();
  const nextRole = mapBackendRole(profile.role);

  if (!authState.accessToken) {
    return;
  }

  if (
    authState.role === nextRole &&
    authState.user?.id === profile.id &&
    authState.user?.email === profile.email &&
    authState.user?.name === profile.name &&
    authState.user?.avatarUrl === profile.avatarUrl &&
    authState.user?.status === profile.status
  ) {
    return;
  }

  authState.setAuth(
    authState.accessToken,
    nextRole,
    {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      status: profile.status,
    },
    authState.refreshToken ?? undefined
  );
};

export const useProfile = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const logout = useLogout();

  const profileQuery = useQuery({
    queryKey: profileKeys.detail(),
    queryFn: fetchCurrentProfile,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (profileQuery.data) {
      syncAuthStore(profileQuery.data);
    }
  }, [profileQuery.data]);

  const updateProfileMutation = useMutation({
    mutationFn: async (values: UpdateProfileFormValues) => {
      const currentProfile =
        queryClient.getQueryData<UserProfile>(profileKeys.detail()) ??
        profileQuery.data;

      if (!currentProfile) {
        throw new Error("Không tìm thấy hồ sơ hiện tại.");
      }

      return updateCurrentProfile(currentProfile.id, values);
    },
    onSuccess: (nextProfile) => {
      queryClient.setQueryData(profileKeys.detail(), nextProfile);
      syncAuthStore(nextProfile);
    },
  });

  const loadProfile = useCallback(async () => {
    const result = await profileQuery.refetch();
    return result.data ?? null;
  }, [profileQuery]);

  const saveProfile = useCallback(
    async (values: UpdateProfileFormValues) => {
      return updateProfileMutation.mutateAsync(values);
    },
    [updateProfileMutation]
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const clearProfile = useCallback(() => {
    queryClient.removeQueries({ queryKey: profileKeys.all });
  }, [queryClient]);

  const setProfile = useCallback(
    (profile: UserProfile) => {
      queryClient.setQueryData(profileKeys.detail(), profile);
      syncAuthStore(profile);
    },
    [queryClient]
  );

  return {
    profile: profileQuery.data ?? null,
    isLoading: profileQuery.isLoading,
    error: profileQuery.isError
      ? getQueryErrorMessage(profileQuery.error, "Không thể tải hồ sơ.")
      : null,
    clearProfile,
    loadProfile,
    saveProfile,
    setProfile,
    handleLogout,
  };
};

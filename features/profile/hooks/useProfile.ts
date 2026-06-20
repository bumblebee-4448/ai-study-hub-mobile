import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef } from "react";

import { mapBackendRole } from "@/features/auth/services/authMappers";
import { useLogout } from "@/features/auth";
import { useAuthStore } from "@/features/auth/store/authStore";

import {
  fetchCurrentProfile,
  getProfileErrorMessage,
  updateCurrentProfile,
} from "../services/profileService";
import { useProfileStore } from "../store/profileStore";
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
  const {
    profile,
    isLoading,
    error,
    setLoading,
    setError,
    setProfile,
    clearProfile,
  } = useProfileStore();
  const logout = useLogout();
  const loadProfileRef = useRef<() => Promise<UserProfile | null>>(async () =>
    null
  );

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextProfile = await fetchCurrentProfile();
      setProfile(nextProfile);
      syncAuthStore(nextProfile);
      return nextProfile;
    } catch (loadError) {
      setError(getProfileErrorMessage(loadError));
      return null;
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading, setProfile]);

  useEffect(() => {
    loadProfileRef.current = loadProfile;
  }, [loadProfile]);

  useFocusEffect(
    useCallback(() => {
      loadProfileRef.current();
    }, [])
  );

  const saveProfile = useCallback(
    async (values: UpdateProfileFormValues) => {
      if (!profile) {
        throw new Error("Không tìm thấy hồ sơ hiện tại.");
      }

      const nextProfile = await updateCurrentProfile(profile.id, values);
      setProfile(nextProfile);
      syncAuthStore(nextProfile);
      return nextProfile;
    },
    [profile, setProfile]
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return {
    profile,
    isLoading,
    error,
    clearProfile,
    loadProfile,
    saveProfile,
    setProfile,
    handleLogout,
  };
};

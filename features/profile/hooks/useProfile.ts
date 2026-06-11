import { useCallback } from "react";
import { useProfileStore } from "../store/profileStore";
import { useAuthStore } from "@/features/auth/store/authStore";

export const useProfile = () => {
  const { profile, isLoading, error, setProfile, clearProfile } =
    useProfileStore();
  const { logout: clearAuth } = useAuthStore();

  const handleLogout = useCallback(() => {
    clearProfile();
    clearAuth();
  }, [clearProfile, clearAuth]);

  return { profile, isLoading, error, setProfile, handleLogout };
};

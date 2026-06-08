import { useCallback } from "react";
import { useProfileStore } from "../store/profileStore";

export const useProfile = () => {
  const { profile, isLoading, error, setProfile, clearProfile } =
    useProfileStore();

  const handleLogout = useCallback(() => {
    clearProfile();
  }, [clearProfile]);

  return { profile, isLoading, error, setProfile, handleLogout };
};

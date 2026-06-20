/**
 * Profile Feature — Zustand Store
 * Feature-level state for user profile data
 */

import { create } from "zustand";
import { ProfileState, UserProfile } from "../types";
import { areProfilesEqual } from "../services/profileMappers";

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  setLoading: (isLoading: boolean) =>
    set((state) => (state.isLoading === isLoading ? state : { isLoading })),
  setError: (error: string | null) =>
    set((state) => (state.error === error ? state : { error })),
  setProfile: (profile: UserProfile) =>
    set((state) =>
      areProfilesEqual(state.profile, profile) && state.error === null
        ? state
        : { profile, error: null }
    ),
  clearProfile: () =>
    set((state) =>
      state.profile === null && state.error === null && !state.isLoading
        ? state
        : { profile: null, error: null, isLoading: false }
    ),
}));

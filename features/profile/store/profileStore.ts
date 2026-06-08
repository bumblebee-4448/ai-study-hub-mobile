/**
 * Profile Feature — Zustand Store
 * Feature-level state for user profile data
 */

import { create } from "zustand";
import { ProfileState, UserProfile } from "../types";

const DEMO_PROFILE: UserProfile = {
  id: "user-001",
  name: "Nguyễn Văn A",
  university: "Sinh viên Đại học Khoa học",
  yearMajor: "Năm 3 - Công nghệ thông tin",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuByChcQ0XwJZE7ksDTDKK-d6leBoSCIpKJxnQGdxZX9s1Ai_dywhkwWtVXxQ67QZVEDBVwOIymfGb8dteXSO5w_L3S3NXtPl-DG6rWfCYFJWKQr-IJhRH7LrI2MejDxLUeSGX3eYrwFuboLtXR-rLII6GQvJ-Ln2lFUM3hgldUii1oCouxPVqTcIyiETtvwO61CT-qUBGle-Lca3bCK6mRSaMotdAi_2wOOgPB6xy-Ab7uJcXNrKX1brKh6rqCbsrSI81BQTvUIB50",
  documentCount: 12,
  savedCount: 48,
  points: 156,
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: DEMO_PROFILE,
  isLoading: false,
  error: null,
  setProfile: (profile: UserProfile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));

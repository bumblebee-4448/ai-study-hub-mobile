/**
 * Profile Feature — Type Definitions
 */

export interface UserProfile {
  id: string;
  name: string;
  university: string;
  /** e.g. "Năm 3 - Công nghệ thông tin" */
  yearMajor: string;
  avatarUrl: string;
  documentCount: number;
  savedCount: number;
  points: number;
}

export interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
}

export type ProfileMenuItem =
  | "my-documents"
  | "saved"
  | "contribute"
  | "settings"
  | "logout";

import type { AccountStatus } from "@/features/auth/types";

export type BackendProfileRole = "USER" | "ADMIN" | "MODERATOR" | string;

export interface BackendProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  role: BackendProfileRole;
  status?: AccountStatus;
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: BackendProfileRole;
  status?: AccountStatus;
  createdAt?: string;
}

export interface UpdateProfileFormValues {
  name: string;
  avatarUrl?: string;
}

export interface UpdateProfilePayload {
  name: string;
  avatarUrl?: string;
}

export interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
}

export type ProfileMenuItem =
  | "my-documents"
  | "saved"
  | "contribute"
  | "settings"
  | "logout";

export type DocumentStatus = "public" | "pending";

export interface MyDocument {
  id: string;
  title: string;
  subject: string;
  size: string;
  uploadedAt: string;
  status: DocumentStatus;
  format: "pdf" | "docx" | "zip" | "pptx";
}

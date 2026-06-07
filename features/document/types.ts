/**
 * Document Feature - Type Definitions
 */

export interface Document {
  id: string;
  title: string;
  icon: "picture_as_pdf" | "description" | "folder_zip";
  downloads: number;
  category?: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  categoryColor: "primary" | "secondary";
  imageUrl: string;
}

export interface QuickPrompt {
  id: string;
  label: string;
}

export interface DocumentState {
  trendingDocuments: Document[];
  recommendedCourses: Course[];
  quickPrompts: QuickPrompt[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// ── Upload ──────────────────────────────────────────────────────────────

export interface UploadCategory {
  value: string;
  label: string;
}

export interface PickedFile {
  /** Display name shown in the UI */
  name: string;
  /** URI returned by expo-document-picker */
  uri: string;
  /** MIME type, e.g. application/pdf */
  mimeType: string | undefined;
  /** File size in bytes */
  size: number | undefined;
}

export interface UploadFormData {
  title: string;
  category: string;
  description?: string;
}

export type UploadStatus = "idle" | "uploading" | "success" | "error";

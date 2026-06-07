/**
 * Document Feature - Type Definitions
 */

export interface Document {
  id: string;
  title: string;
  format?: "pdf" | "docx" | "pptx" | "zip";
  icon?: "picture_as_pdf" | "description" | "folder_zip";
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

export interface PickedFile {
  name: string;
  uri: string;
  mimeType: string | undefined;
  size: number | undefined;
}

export interface UploadCategory {
  value: string;
  label: string;
}

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface RelatedDocument {
  id: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  downloads: number;
}

export interface DocumentDetail {
  id: string;
  title: string;
  format: string;
  fileSize: string;
  thumbnailUrl: string;
  author: string;
  authorAvatarUrl: string;
  publishedAt: string;
  views: number;
  downloads: number;
  description: string;
  tags: string[];
  relatedDocuments: RelatedDocument[];
}

export interface EditDocumentParams {
  documentId: string;
  title: string;
  category: string;
  description?: string;
  tags?: string;
  fileName?: string;
  fileSize?: number;
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

// ── Edit ─────────────────────────────────────────────────────────────────

/** Parameters passed to EditDocumentScreen (via navigation / route props) */
export interface EditDocumentParams {
  /** The document ID being edited */
  documentId: string;
  /** Pre-filled title shown in the form */
  title: string;
  /** Pre-filled category value */
  category: string;
  /** Pre-filled description */
  description?: string;
  /** Pre-filled comma-separated tags string */
  tags?: string;
  /** Display name of the attached file */
  fileName?: string;
  /** File size in bytes */
  fileSize?: number;
}

// ── Document Detail ────────────────────────────────────────────────────────

/** A related document shown in the sidebar / related section */
export interface RelatedDocument {
  id: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  downloads: number;
}

/** Full detail data for DocumentDetailScreen */
export interface DocumentDetail {
  id: string;
  title: string;
  /** File format badge, e.g. "PDF" */
  format: string;
  /** File size display string, e.g. "2.4 MB" */
  fileSize: string;
  thumbnailUrl: string;
  author: string;
  authorAvatarUrl: string;
  /** Display date string */
  publishedAt: string;
  views: number;
  downloads: number;
  /** Long-form description shown below the divider */
  description: string;
  /** Tag labels shown as chips */
  tags: string[];
  /** Shown in the "Tài liệu liên quan" section */
  relatedDocuments: RelatedDocument[];
}

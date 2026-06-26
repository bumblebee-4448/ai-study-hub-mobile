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
  /** Display name shown in the UI */
  name: string;
  /** URI returned by expo-document-picker */
  uri: string;
  /** MIME type, e.g. application/pdf */
  mimeType: string | undefined;
  /** File size in bytes */
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

/** Full detail data for DocumentDetailScreen */
export interface DocumentDetail {
  id: string;
  title: string;
  subjectId?: string;
  isPublic?: boolean;
  /** File format badge, e.g. "PDF" */
  format: string;
  /** File size display string, e.g. "2.4 MB" */
  fileSize: string;
  sizeInBytes?: number;
  fileName?: string;
  thumbnailUrl: string;
  author: string;
  authorAvatarUrl: string;
  /** Display date string */
  publishedAt: string;
  views: number;
  downloads: number;
  /** Long-form description shown below the divider */
  description: string;
  rawDescription?: string;
  /** Tag labels shown as chips */
  tags: string[];
  /** Shown in the "Tài liệu liên quan" section */
  relatedDocuments: RelatedDocument[];
}

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

export interface UpdateDocumentPayload {
  title?: string;
  description?: string;
  subjectId?: string;
  isPublic?: boolean;
}

export interface DocumentState {
  trendingDocuments: Document[];
  recommendedCourses: Course[];
  quickPrompts: QuickPrompt[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// ── Upload ──────────────────────────────────────────────────────────────

export interface UploadFormData {
  title: string;
  category: string;
  description?: string;
}

// Moderator document API integration

export type BackendDocumentStatus = "PENDING" | "ACTIVE" | "REJECTED" | "DELETED";

export type ModeratorDocumentStatusFilter = Extract<
  BackendDocumentStatus,
  "PENDING" | "ACTIVE" | "REJECTED"
>;

export interface BackendModeratorDocumentAuthor {
  id: string;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface BackendModeratorDocumentSubject {
  id: string;
  name?: string | null;
  code?: string | null;
}

export interface BackendModeratorDocument {
  id: string;
  title: string;
  description?: string | null;
  fileUrl?: string | null;
  publicId?: string | null;
  status: BackendDocumentStatus;
  isPublic?: boolean;
  createdAt: string;
  updatedAt?: string | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  format?: string | null;
  sizeInBytes?: number | null;
  author?: BackendModeratorDocumentAuthor | null;
  subject?: BackendModeratorDocumentSubject | null;
}

export interface ModeratorDocumentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BackendModeratorDocumentListResponse {
  documents: BackendModeratorDocument[];
  pagination: ModeratorDocumentPagination;
}

export interface ModeratorDocument {
  id: string;
  title: string;
  description: string;
  status: BackendDocumentStatus;
  statusLabel: string;
  authorName: string;
  subjectName: string;
  formatLabel: string;
  sizeLabel: string;
  fileUrl?: string;
  createdAtLabel: string;
  updatedAtLabel: string;
  rejectionReason: string | null;
  canReview: boolean;
}

export interface ModeratorDocumentListResult {
  documents: ModeratorDocument[];
  pagination: ModeratorDocumentPagination;
}

export interface ModeratorDashboardSummary {
  pendingCount: number;
  activeCount: number;
  rejectedCount: number;
  recentDocuments: ModeratorDocument[];
}

export interface Document {
  id: string;
  title: string;
  format: "pdf" | "docx" | "pptx" | "zip";
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

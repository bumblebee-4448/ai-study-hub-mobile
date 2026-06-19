export type BackendDocumentStatus = "PENDING" | "ACTIVE" | "REJECTED" | "DELETED";

export interface BackendDocumentAuthor {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

export interface BackendDocumentSubject {
  id: string;
  name: string;
  code?: string | null;
}

export interface BackendDocument {
  id: string;
  title: string;
  publicId?: string;
  status: BackendDocumentStatus;
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string;
  rejectionReason?: string | null;
  format?: string | null;
  sizeInBytes?: number | null;
  author?: BackendDocumentAuthor | null;
  subject?: BackendDocumentSubject | null;
}

export interface UserDocument {
  id: string;
  title: string;
  subjectLabel: string;
  authorLabel: string;
  status: BackendDocumentStatus;
  statusLabel: string;
  visibilityLabel: string;
  formatLabel: string;
  sizeLabel: string;
  createdAtLabel: string;
  rejectionReason?: string | null;
}

export interface UserDocumentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BackendDocumentListResponse {
  documents: BackendDocument[];
  pagination: UserDocumentPagination;
}

export interface UserDocumentListResult {
  documents: UserDocument[];
  pagination: UserDocumentPagination;
}

export interface PickedUploadFile {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
}

export interface CreateUserDocumentFormValues {
  title: string;
  description?: string;
  subjectId?: string;
  isPublic: boolean;
}

export interface BackendSubject {
  id: string;
  name: string;
  code: string;
  schoolId?: string;
  createdAt?: string;
}

export interface BackendSubjectListResponse {
  subjects: BackendSubject[];
  pagination: UserDocumentPagination;
}

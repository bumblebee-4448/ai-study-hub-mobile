import type {
  BackendDocument,
  BackendDocumentListResponse,
  BackendDocumentStatus,
  UserDocument,
  UserDocumentListResult,
} from "../types";

const STATUS_LABELS: Record<BackendDocumentStatus, string> = {
  ACTIVE: "Đã duyệt",
  PENDING: "Chờ duyệt",
  REJECTED: "Từ chối",
  DELETED: "Đã xóa",
};

const padDatePart = (value: number) => String(value).padStart(2, "0");

const formatDate = (dateValue: string) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return [
    padDatePart(date.getDate()),
    padDatePart(date.getMonth() + 1),
    date.getFullYear(),
  ].join("/");
};

export const formatDocumentSize = (sizeInBytes?: number | null) => {
  if (!sizeInBytes && sizeInBytes !== 0) {
    return "";
  }

  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeInBytes / 1024 / 1024).toFixed(1)} MB`;
};

const getSubjectLabel = (document: BackendDocument) => {
  if (!document.subject) {
    return "Chưa phân loại";
  }

  return document.subject.code
    ? `${document.subject.name} (${document.subject.code})`
    : document.subject.name;
};

export const mapBackendDocumentToUserDocument = (
  document: BackendDocument
): UserDocument => ({
  id: document.id,
  title: document.title,
  subjectLabel: getSubjectLabel(document),
  authorLabel: document.author?.name || "Không rõ tác giả",
  status: document.status,
  statusLabel: STATUS_LABELS[document.status] ?? document.status,
  visibilityLabel: document.isPublic ? "Công khai" : "Riêng tư",
  formatLabel: document.format?.toUpperCase() || "FILE",
  sizeLabel: formatDocumentSize(document.sizeInBytes),
  createdAtLabel: formatDate(document.createdAt),
  rejectionReason: document.rejectionReason ?? null,
  rejectionFlags: document.rejectionFlags ?? [],
});

export const mapBackendDocumentList = (
  response: BackendDocumentListResponse
): UserDocumentListResult => ({
  documents: response.documents.map(mapBackendDocumentToUserDocument),
  pagination: response.pagination,
});

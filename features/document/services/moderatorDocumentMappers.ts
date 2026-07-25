import type {
  BackendDocumentStatus,
  BackendModeratorDocument,
  BackendModeratorDocumentListResponse,
  ModeratorDocument,
  ModeratorDocumentListResult,
} from "../types";

const STATUS_LABELS: Record<BackendDocumentStatus, string> = {
  PENDING: "Chờ duyệt",
  ACTIVE: "Đã duyệt",
  REJECTED: "Từ chối",
  DELETED: "Đã xóa",
};

export const getModeratorStatusLabel = (status: BackendDocumentStatus) =>
  STATUS_LABELS[status] ?? status;

const formatModeratorDate = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Không rõ ngày";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
  }).format(date);
};

export const formatModeratorDocumentSize = (sizeInBytes?: number | null) => {
  if (sizeInBytes === undefined || sizeInBytes === null) {
    return "Không rõ dung lượng";
  }

  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  }

  if (sizeInBytes < 1024 * 1024 * 1024) {
    return `${(sizeInBytes / 1024 / 1024).toFixed(1)} MB`;
  }

  return `${(sizeInBytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
};

const getSubjectName = (document: BackendModeratorDocument) => {
  const subject = document.subject;

  if (!subject?.name) {
    return "Chưa phân loại";
  }

  return subject.code ? `${subject.name} (${subject.code})` : subject.name;
};

export const mapBackendDocumentToModeratorDocument = (
  document: BackendModeratorDocument
): ModeratorDocument => ({
  id: document.id,
  title: document.title,
  description: document.description ?? "",
  status: document.status,
  statusLabel: getModeratorStatusLabel(document.status),
  authorName: document.author?.name || "Không rõ tác giả",
  subjectName: getSubjectName(document),
  formatLabel: document.format?.toUpperCase() || "FILE",
  sizeLabel: formatModeratorDocumentSize(document.sizeInBytes),
  fileUrl: document.fileUrl ?? undefined,
  createdAtLabel: formatModeratorDate(document.createdAt),
  updatedAtLabel: document.updatedAt ? formatModeratorDate(document.updatedAt) : "",
  rejectionReason: document.rejectionReason ?? null,
  rejectionFlags: document.rejectionFlags ?? [],
  canReview: document.status === "PENDING",
});

export const mapBackendModeratorDocumentList = (
  response: BackendModeratorDocumentListResponse
): ModeratorDocumentListResult => ({
  documents: response.documents.map(mapBackendDocumentToModeratorDocument),
  pagination: response.pagination,
});

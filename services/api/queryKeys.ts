import type { FetchAdminAccountsParams, FetchAdminSubjectsParams } from "@/features/admin/types";
import type { ModeratorDocumentListParams } from "@/features/document/services/moderatorDocumentQuery";
import type { DocumentListParams } from "@/features/user/services/userDocumentQuery";

export const profileKeys = {
  all: ["profile"] as const,
  detail: () => [...profileKeys.all, "detail"] as const,
};

export const userSubjectKeys = {
  all: ["user-subjects"] as const,
  list: () => [...userSubjectKeys.all, "list"] as const,
};

export const userDocumentKeys = {
  all: ["user-documents"] as const,
  recent: (limit: number) => [...userDocumentKeys.all, "recent", { limit }] as const,
  library: (params: DocumentListParams = {}) =>
    [...userDocumentKeys.all, "library", params] as const,
  mine: (params: DocumentListParams = {}) =>
    [...userDocumentKeys.all, "mine", params] as const,
};

export const documentKeys = {
  all: ["documents"] as const,
  detail: (id: string) => [...documentKeys.all, "detail", id] as const,
};

export const moderatorDocumentKeys = {
  all: ["moderator-documents"] as const,
  dashboard: () => [...moderatorDocumentKeys.all, "dashboard"] as const,
  list: (params: ModeratorDocumentListParams = {}) =>
    [...moderatorDocumentKeys.all, "list", params] as const,
  detail: (id: string) => [...moderatorDocumentKeys.all, "detail", id] as const,
};

export const adminKeys = {
  all: ["admin"] as const,
  dashboard: () => [...adminKeys.all, "dashboard"] as const,
  accounts: (params: FetchAdminAccountsParams = {}) =>
    [...adminKeys.all, "accounts", params] as const,
  accountDetail: (id: string) =>
    [...adminKeys.all, "accounts", "detail", id] as const,
  subjects: (params: FetchAdminSubjectsParams = {}) =>
    [...adminKeys.all, "subjects", params] as const,
  subjectDetail: (id: string) =>
    [...adminKeys.all, "subjects", "detail", id] as const,
};

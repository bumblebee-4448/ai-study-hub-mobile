import { apiClient } from "@/services/api/axiosClient";
import type { ModeratorDocumentListParams } from "./moderatorDocumentQuery";
import { buildModeratorDocumentListParams } from "./moderatorDocumentQuery";
import type {
  ModeratorDocumentListResult,
  ModeratorDocument,
  ModeratorDashboardSummary,
  BackendModeratorDocument,
} from "../types";
import {
  mapBackendModeratorDocumentList,
  mapBackendDocumentToModeratorDocument,
} from "./moderatorDocumentMappers";

export const fetchModeratorDocuments = async (
  params: ModeratorDocumentListParams = {}
): Promise<ModeratorDocumentListResult> => {
  const queryParams = buildModeratorDocumentListParams(params);
  const response = await apiClient.get<unknown, any>("/documents", {
    params: queryParams,
  });
  return mapBackendModeratorDocumentList(response);
};

export const fetchModeratorDocumentDetail = async (
  id: string
): Promise<ModeratorDocument> => {
  const response = await apiClient.get<unknown, BackendModeratorDocument>(
    `/documents/${id}`
  );
  return mapBackendDocumentToModeratorDocument(response);
};

export const approveDocument = async (id: string): Promise<void> => {
  await apiClient.post(`/documents/${id}/approve`);
};

export const rejectDocument = async (
  id: string,
  rejectionReason: string
): Promise<void> => {
  await apiClient.post(`/documents/${id}/reject`, { rejectionReason });
};

export const fetchModeratorDashboardSummary = async (): Promise<ModeratorDashboardSummary> => {
  const [pendingRes, activeRes, rejectedRes] = await Promise.all([
    fetchModeratorDocuments({ page: 1, limit: 1, status: "PENDING" }),
    fetchModeratorDocuments({ page: 1, limit: 1, status: "ACTIVE" }),
    fetchModeratorDocuments({ page: 1, limit: 1, status: "REJECTED" }),
  ]);

  const recentPending = await fetchModeratorDocuments({
    page: 1,
    limit: 5,
    status: "PENDING",
  });

  return {
    pendingCount: pendingRes.pagination.total,
    activeCount: activeRes.pagination.total,
    rejectedCount: rejectedRes.pagination.total,
    recentDocuments: recentPending.documents,
  };
};

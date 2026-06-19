import { apiClient } from "@/services/api/axiosClient";
import type {
  BackendDocumentListResponse,
  UserDocumentListResult,
} from "../types";
import type { DocumentListParams } from "./userDocumentQuery";
import { buildLibraryDocumentParams } from "./userDocumentQuery";
import { mapBackendDocumentList } from "./userDocumentMappers";

const fetchDocumentList = async (
  path: "/documents" | "/documents/me",
  params: DocumentListParams
): Promise<UserDocumentListResult> => {
  const response = await apiClient.get<unknown, BackendDocumentListResponse>(
    path,
    {
      params,
    }
  );

  return mapBackendDocumentList(response);
};

export const fetchRecentDocuments = (limit = 6) =>
  fetchDocumentList("/documents", { page: 1, limit });

export const fetchLibraryDocuments = (params: DocumentListParams = {}) =>
  fetchDocumentList("/documents", buildLibraryDocumentParams(params));

export const fetchMyDocuments = (params: DocumentListParams = {}) =>
  fetchDocumentList("/documents/me", { page: 1, limit: 20, ...params });

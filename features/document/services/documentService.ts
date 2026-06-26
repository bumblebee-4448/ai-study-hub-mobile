import { apiClient } from "@/services/api/axiosClient";
import type { DocumentDetail, RelatedDocument, UpdateDocumentPayload } from "../types";
import {
  mapBackendDocumentToDetail,
  mapBackendDocumentToRelated,
} from "./documentMappers";

/**
 * Fetch related documents in the same subject, excluding the current document.
 */
export const fetchRelatedDocuments = async (
  subjectId: string,
  excludeId: string
): Promise<RelatedDocument[]> => {
  try {
    const response = await apiClient.get<unknown, any>("/documents", {
      params: {
        page: 1,
        limit: 5,
        subjectId,
      },
    });

    const docs = response.documents || [];
    
    return docs
      .filter((d: any) => d.id !== excludeId)
      .map(mapBackendDocumentToRelated);
  } catch (error) {
    console.warn("Failed to fetch related documents:", error);
    return [];
  }
};

/**
 * Fetch detail of a single document by its ID and fetch its related documents.
 */
export const fetchDocumentDetail = async (id: string): Promise<DocumentDetail> => {
  const response = await apiClient.get<unknown, any>(`/documents/${id}`);
  const detail = mapBackendDocumentToDetail(response);

  const subjectId = response.subject?.id;
  if (subjectId) {
    const related = await fetchRelatedDocuments(subjectId, id);
    detail.relatedDocuments = related;
  }

  return detail;
};

export const updateDocument = async (
  id: string,
  payload: UpdateDocumentPayload
): Promise<DocumentDetail> => {
  const response = await apiClient.patch<unknown, any>(
    `/documents/${id}`,
    payload
  );

  return mapBackendDocumentToDetail(response);
};

export const deleteDocument = async (id: string): Promise<void> => {
  await apiClient.delete(`/documents/${id}`);
};

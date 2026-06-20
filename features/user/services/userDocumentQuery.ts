import type { BackendDocumentStatus } from "../types";

export interface DocumentListParams {
  page?: number;
  limit?: number;
  status?: BackendDocumentStatus;
  subjectId?: string;
}

export const buildLibraryDocumentParams = (
  params: DocumentListParams = {}
): DocumentListParams => {
  const { subjectId, ...rest } = params;
  const normalizedSubjectId = subjectId?.trim();

  return {
    page: 1,
    limit: 20,
    ...rest,
    ...(normalizedSubjectId ? { subjectId: normalizedSubjectId } : {}),
  };
};

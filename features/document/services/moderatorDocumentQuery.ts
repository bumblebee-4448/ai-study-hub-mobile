import type { ModeratorDocumentStatusFilter } from "../types";

export interface ModeratorDocumentListParams {
  page?: number;
  limit?: number;
  status?: ModeratorDocumentStatusFilter;
}

export const buildModeratorDocumentListParams = (
  params: ModeratorDocumentListParams = {}
) => ({
  page: params.page ?? 1,
  limit: params.limit ?? 20,
  status: params.status ?? "PENDING",
});

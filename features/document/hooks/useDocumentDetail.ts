import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { documentKeys } from "@/services/api/queryKeys";
import { getQueryErrorMessage } from "@/services/api/queryState";

import { fetchDocumentDetail } from "../services/documentService";

export const useDocumentDetail = (documentId: string) => {
  const query = useQuery({
    queryKey: documentKeys.detail(documentId),
    queryFn: () => fetchDocumentDetail(documentId),
    enabled: Boolean(documentId),
    staleTime: 2 * 60 * 1000,
  });

  const refresh = useCallback(async () => {
    await query.refetch();
  }, [query]);

  return {
    document: query.data ?? null,
    isLoading: query.isLoading || query.isRefetching,
    error: query.isError
      ? getQueryErrorMessage(
          query.error,
          "Không thể tải thông tin chi tiết tài liệu."
        )
      : null,
    refresh,
  };
};

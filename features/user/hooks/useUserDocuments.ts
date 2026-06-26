import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { getQueryErrorMessage } from "@/services/api/queryState";
import { userDocumentKeys } from "@/services/api/queryKeys";

import type { UserDocumentListResult } from "../types";
import {
  fetchLibraryDocuments,
  fetchMyDocuments,
  fetchRecentDocuments,
} from "../services/userDocumentService";
import type { DocumentListParams } from "../services/userDocumentQuery";

const EMPTY_RESULT: UserDocumentListResult = {
  documents: [],
  pagination: {
    page: 1,
    limit: 0,
    total: 0,
    totalPages: 1,
  },
};

const useUserDocumentQuery = ({
  queryKey,
  queryFn,
}: {
  queryKey: readonly unknown[];
  queryFn: () => Promise<UserDocumentListResult>;
}) => {
  const query = useQuery({
    queryKey,
    queryFn,
    staleTime: 60 * 1000,
  });

  const refresh = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const result = query.data ?? EMPTY_RESULT;

  return {
    documents: result.documents,
    pagination: result.pagination,
    isLoading: query.isLoading || query.isRefetching,
    error: query.isError
      ? getQueryErrorMessage(query.error, "Không thể tải danh sách tài liệu.")
      : null,
    refresh,
  };
};

export const useRecentDocuments = (limit = 6) =>
  useUserDocumentQuery({
    queryKey: userDocumentKeys.recent(limit),
    queryFn: () => fetchRecentDocuments(limit),
  });

export const useLibraryDocuments = (subjectId?: string) => {
  const params: DocumentListParams = subjectId ? { subjectId } : {};

  return useUserDocumentQuery({
    queryKey: userDocumentKeys.library(params),
    queryFn: () => fetchLibraryDocuments(params),
  });
};

export const useMyDocuments = () =>
  useUserDocumentQuery({
    queryKey: userDocumentKeys.mine(),
    queryFn: () => fetchMyDocuments(),
  });

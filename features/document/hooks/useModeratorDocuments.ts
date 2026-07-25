import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { moderatorDocumentKeys } from "@/services/api/queryKeys";
import { getQueryErrorMessage } from "@/services/api/queryState";

import type { ModeratorDocumentStatusFilter } from "../types";
import {
  fetchModeratorDocuments,
  fetchModeratorDashboardSummary,
} from "../services/moderatorDocumentService";

const PAGE_SIZE = 10;

export const useModeratorDocuments = (
  initialStatus: ModeratorDocumentStatusFilter = "PENDING"
) => {
  const [status, setStatus] =
    useState<ModeratorDocumentStatusFilter>(initialStatus);

  const query = useInfiniteQuery({
    queryKey: moderatorDocumentKeys.list({ status, limit: PAGE_SIZE }),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchModeratorDocuments({
        page: pageParam,
        limit: PAGE_SIZE,
        status,
      }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 60 * 1000,
  });

  const documents = useMemo(
    () => query.data?.pages.flatMap((page) => page.documents) ?? [],
    [query.data]
  );

  const lastPage = query.data?.pages.at(-1);
  const pagination = lastPage?.pagination ?? {
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  };

  const refresh = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  const changeStatus = useCallback((newStatus: ModeratorDocumentStatusFilter) => {
    setStatus(newStatus);
  }, []);

  return {
    status,
    documents,
    isLoading: query.isLoading || query.isRefetching || query.isFetchingNextPage,
    error: query.isError
      ? getQueryErrorMessage(
          query.error,
          "Đã xảy ra lỗi khi tải danh sách tài liệu."
        )
      : null,
    page: pagination.page,
    total: pagination.total,
    totalPages: pagination.totalPages,
    refresh,
    loadMore,
    changeStatus,
  };
};

export const useModeratorDashboard = () => {
  const query = useQuery({
    queryKey: moderatorDocumentKeys.dashboard(),
    queryFn: fetchModeratorDashboardSummary,
    staleTime: 60 * 1000,
  });

  const refresh = useCallback(async () => {
    await query.refetch();
  }, [query]);

  return {
    summary: query.data ?? null,
    isLoading: query.isLoading || query.isRefetching,
    error: query.isError
      ? getQueryErrorMessage(
          query.error,
          "Không thể tải thông tin bảng điều khiển."
        )
      : null,
    refresh,
  };
};

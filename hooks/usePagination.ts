import { useCallback, useState } from "react";

export interface PaginationState {
  page: number;
  limit: number;
}

export const usePagination = (initialLimit = 10) => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: initialLimit,
  });

  const setPage = useCallback((page: number) => {
    setPagination((current) => ({
      ...current,
      page: Math.max(1, page),
    }));
  }, []);

  const resetPage = useCallback(() => {
    setPagination((current) =>
      current.page === 1 ? current : { ...current, page: 1 }
    );
  }, []);

  const setLimit = useCallback((limit: number) => {
    setPagination({
      page: 1,
      limit: Math.max(1, limit),
    });
  }, []);

  return {
    page: pagination.page,
    limit: pagination.limit,
    setPage,
    setLimit,
    resetPage,
  };
};

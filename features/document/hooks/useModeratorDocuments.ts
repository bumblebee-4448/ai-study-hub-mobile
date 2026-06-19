import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ModeratorDocument,
  ModeratorDocumentStatusFilter,
  ModeratorDashboardSummary,
} from "../types";
import {
  fetchModeratorDocuments,
  fetchModeratorDashboardSummary,
} from "../services/moderatorDocumentService";

export const useModeratorDocuments = (
  initialStatus: ModeratorDocumentStatusFilter = "PENDING"
) => {
  const [status, setStatus] = useState<ModeratorDocumentStatusFilter>(initialStatus);
  const [documents, setDocuments] = useState<ModeratorDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const hasLoadedRef = useRef(false);

  const fetchDocs = useCallback(
    async (
      targetPage: number,
      targetStatus: ModeratorDocumentStatusFilter,
      refreshList = false
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchModeratorDocuments({
          page: targetPage,
          limit: 10,
          status: targetStatus,
        });
        if (refreshList || targetPage === 1) {
          setDocuments(result.documents);
        } else {
          setDocuments((prev) => [...prev, ...result.documents]);
        }
        setPage(result.pagination.page);
        setTotal(result.pagination.total);
        setTotalPages(result.pagination.totalPages);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi khi tải danh sách tài liệu."
        );
      } finally {
        hasLoadedRef.current = true;
        setIsLoading(false);
      }
    },
    []
  );

  const refresh = useCallback(() => {
    fetchDocs(1, status, true);
  }, [fetchDocs, status]);

  const loadMore = useCallback(() => {
    if (page < totalPages && !isLoading) {
      fetchDocs(page + 1, status, false);
    }
  }, [fetchDocs, page, totalPages, isLoading, status]);

  const changeStatus = useCallback(
    (newStatus: ModeratorDocumentStatusFilter) => {
      setStatus(newStatus);
      setDocuments([]);
      fetchDocs(1, newStatus, true);
    },
    [fetchDocs]
  );

  useEffect(() => {
    fetchDocs(1, status, true);
  }, [status, fetchDocs]);

  useFocusEffect(
    useCallback(() => {
      if (hasLoadedRef.current) {
        fetchDocs(1, status, true);
      }
    }, [fetchDocs, status])
  );

  return {
    status,
    documents,
    isLoading,
    error,
    page,
    total,
    totalPages,
    refresh,
    loadMore,
    changeStatus,
  };
};

export const useModeratorDashboard = () => {
  const [summary, setSummary] = useState<ModeratorDashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchModeratorDashboardSummary();
      setSummary(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tải thông tin bảng điều khiển."
      );
    } finally {
      hasLoadedRef.current = true;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      if (hasLoadedRef.current) {
        refresh();
      }
    }, [refresh])
  );

  return {
    summary,
    isLoading,
    error,
    refresh,
  };
};

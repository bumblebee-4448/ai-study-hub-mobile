import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ModeratorDocument } from "../types";
import {
  fetchModeratorDocumentDetail,
  approveDocument as approveApi,
  rejectDocument as rejectApi,
} from "../services/moderatorDocumentService";

export const useModeratorDocumentDetail = (documentId: string) => {
  const [document, setDocument] = useState<ModeratorDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const refresh = useCallback(async () => {
    if (!documentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchModeratorDocumentDetail(documentId);
      setDocument(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tải thông tin chi tiết tài liệu."
      );
    } finally {
      hasLoadedRef.current = true;
      setIsLoading(false);
    }
  }, [documentId]);

  const approve = useCallback(async () => {
    if (!documentId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await approveApi(documentId);
      await refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi duyệt tài liệu."
      );
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [documentId, refresh]);

  const reject = useCallback(
    async (rejectionReason: string) => {
      if (!documentId) return;
      if (!rejectionReason.trim()) {
        throw new Error("Lý do từ chối không được để trống.");
      }
      setIsSubmitting(true);
      setError(null);
      try {
        await rejectApi(documentId, rejectionReason);
        await refresh();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi khi từ chối tài liệu."
        );
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [documentId, refresh]
  );

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
    document,
    isLoading,
    isSubmitting,
    error,
    refresh,
    approve,
    reject,
  };
};

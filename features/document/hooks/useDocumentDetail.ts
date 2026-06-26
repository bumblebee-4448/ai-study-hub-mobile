import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DocumentDetail } from "../types";
import { fetchDocumentDetail } from "../services/documentService";

export const useDocumentDetail = (documentId: string) => {
  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const refresh = useCallback(async () => {
    if (!documentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchDocumentDetail(documentId);
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
    error,
    refresh,
  };
};

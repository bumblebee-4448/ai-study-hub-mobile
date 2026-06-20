import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import type { UserDocument, UserDocumentListResult } from "../types";
import {
  fetchLibraryDocuments,
  fetchMyDocuments,
  fetchRecentDocuments,
} from "../services/userDocumentService";

type DocumentLoader = () => Promise<UserDocumentListResult>;

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Không thể tải danh sách tài liệu.";
};

const useDocumentLoader = (loader: DocumentLoader) => {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loader();
      setDocuments(result.documents);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      hasLoadedRef.current = true;
      setIsLoading(false);
    }
  }, [loader]);

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
    documents,
    isLoading,
    error,
    refresh,
  };
};

export const useRecentDocuments = (limit = 6) => {
  const loader = useCallback(() => fetchRecentDocuments(limit), [limit]);
  return useDocumentLoader(loader);
};

export const useLibraryDocuments = (subjectId?: string) => {
  const loader = useCallback(
    () => fetchLibraryDocuments({ subjectId }),
    [subjectId]
  );
  return useDocumentLoader(loader);
};

export const useMyDocuments = () => {
  const loader = useCallback(() => fetchMyDocuments(), []);
  return useDocumentLoader(loader);
};

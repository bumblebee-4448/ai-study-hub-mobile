import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import {
  documentKeys,
  moderatorDocumentKeys,
} from "@/services/api/queryKeys";
import { getQueryErrorMessage } from "@/services/api/queryState";

import {
  approveDocument as approveApi,
  analyzeModeratorDocument as analyzeApi,
  fetchModeratorDocumentDetail,
  rejectDocument as rejectApi,
} from "../services/moderatorDocumentService";
import type { ModeratorAnalysis } from "../types";

export const useModeratorDocumentDetail = (documentId: string) => {
  const queryClient = useQueryClient();
  const [analysis, setAnalysis] = useState<ModeratorAnalysis | null>(null);
  const query = useQuery({
    queryKey: moderatorDocumentKeys.detail(documentId),
    queryFn: () => fetchModeratorDocumentDetail(documentId),
    enabled: Boolean(documentId),
    staleTime: 60 * 1000,
  });

  const invalidateModeratorDocuments = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: moderatorDocumentKeys.all }),
      queryClient.invalidateQueries({ queryKey: documentKeys.detail(documentId) }),
    ]);
  }, [documentId, queryClient]);

  const approveMutation = useMutation({
    mutationFn: approveApi,
    onSuccess: invalidateModeratorDocuments,
  });

  const rejectMutation = useMutation({
    mutationFn: ({
      id,
      rejectionReason,
    }: {
      id: string;
      rejectionReason: string;
    }) => rejectApi(id, rejectionReason),
    onSuccess: invalidateModeratorDocuments,
  });

  const analyzeMutation = useMutation({
    mutationFn: analyzeApi,
    onSuccess: setAnalysis,
  });

  const refresh = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const approve = useCallback(async () => {
    if (!documentId) {
      return;
    }

    await approveMutation.mutateAsync(documentId);
  }, [approveMutation, documentId]);

  const reject = useCallback(
    async (rejectionReason: string) => {
      if (!documentId) {
        return;
      }

      if (!rejectionReason.trim()) {
        throw new Error("Lý do từ chối không được để trống.");
      }

      await rejectMutation.mutateAsync({
        id: documentId,
        rejectionReason,
      });
    },
    [documentId, rejectMutation]
  );

  const analyze = useCallback(async () => {
    if (!documentId) {
      return null;
    }

    return analyzeMutation.mutateAsync(documentId);
  }, [analyzeMutation, documentId]);

  const actionError = approveMutation.error ?? rejectMutation.error;

  return {
    document: query.data ?? null,
    isLoading: query.isLoading || query.isRefetching,
    isSubmitting: approveMutation.isPending || rejectMutation.isPending,
    isAnalyzing: analyzeMutation.isPending,
    analysis,
    analyzeError: analyzeMutation.error
      ? getQueryErrorMessage(
          analyzeMutation.error,
          "Không thể phân tích tài liệu bằng AI lúc này."
        )
      : null,
    error: query.isError
      ? getQueryErrorMessage(
          query.error,
          "Không thể tải thông tin chi tiết tài liệu."
        )
      : actionError
        ? getQueryErrorMessage(
            actionError,
            "Đã xảy ra lỗi khi cập nhật trạng thái tài liệu."
          )
        : null,
    refresh,
    approve,
    reject,
    analyze,
  };
};

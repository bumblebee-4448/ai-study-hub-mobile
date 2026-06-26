import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  documentKeys,
  moderatorDocumentKeys,
} from "@/services/api/queryKeys";
import { getQueryErrorMessage } from "@/services/api/queryState";

import {
  approveDocument as approveApi,
  fetchModeratorDocumentDetail,
  rejectDocument as rejectApi,
} from "../services/moderatorDocumentService";

export const useModeratorDocumentDetail = (documentId: string) => {
  const queryClient = useQueryClient();
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

  const actionError = approveMutation.error ?? rejectMutation.error;

  return {
    document: query.data ?? null,
    isLoading: query.isLoading || query.isRefetching,
    isSubmitting: approveMutation.isPending || rejectMutation.isPending,
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
  };
};

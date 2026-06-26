import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  documentKeys,
  moderatorDocumentKeys,
  userDocumentKeys,
} from "@/services/api/queryKeys";
import { getQueryErrorMessage } from "@/services/api/queryState";

import { deleteUserDocument as deleteUserDocumentApi } from "../services/userDocumentService";

export const useDeleteUserDocument = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteUserDocumentApi,
    onSuccess: async (_result, documentId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userDocumentKeys.all }),
        queryClient.invalidateQueries({ queryKey: documentKeys.detail(documentId) }),
        queryClient.invalidateQueries({ queryKey: moderatorDocumentKeys.all }),
      ]);
    },
  });

  const deleteDocument = useCallback(
    async (documentId: string) => {
      try {
        await deleteMutation.mutateAsync(documentId);
      } catch (error) {
        throw new Error(
          getQueryErrorMessage(
            error,
            "Không thể xóa tài liệu. Vui lòng thử lại."
          )
        );
      }
    },
    [deleteMutation]
  );

  return {
    deleteDocument,
    isDeleting: deleteMutation.isPending,
  };
};

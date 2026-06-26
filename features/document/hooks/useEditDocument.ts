import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  documentKeys,
  moderatorDocumentKeys,
  userDocumentKeys,
} from "@/services/api/queryKeys";
import { getQueryErrorMessage } from "@/services/api/queryState";

import type { EditDocumentFormType } from "../schemas/documentSchema";
import {
  deleteDocument as deleteDocumentApi,
  updateDocument as updateDocumentApi,
} from "../services/documentService";
import type { UpdateDocumentPayload } from "../types";

const buildUpdatePayload = (
  values: EditDocumentFormType
): UpdateDocumentPayload => ({
  title: values.title.trim(),
  description: values.description?.trim() || undefined,
  subjectId: values.category,
});

export const useEditDocument = (documentId: string) => {
  const queryClient = useQueryClient();

  const invalidateDocumentData = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: documentKeys.detail(documentId) }),
      queryClient.invalidateQueries({ queryKey: userDocumentKeys.all }),
      queryClient.invalidateQueries({ queryKey: moderatorDocumentKeys.all }),
    ]);
  }, [documentId, queryClient]);

  const updateMutation = useMutation({
    mutationFn: (values: EditDocumentFormType) =>
      updateDocumentApi(documentId, buildUpdatePayload(values)),
    onSuccess: async (document) => {
      queryClient.setQueryData(documentKeys.detail(documentId), document);
      await invalidateDocumentData();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteDocumentApi(documentId),
    onSuccess: invalidateDocumentData,
  });

  const updateDocument = useCallback(
    async (values: EditDocumentFormType) => {
      if (!documentId) {
        throw new Error("Không tìm thấy mã tài liệu.");
      }

      await updateMutation.mutateAsync(values);
    },
    [documentId, updateMutation]
  );

  const deleteDocument = useCallback(async () => {
    if (!documentId) {
      throw new Error("Không tìm thấy mã tài liệu.");
    }

    await deleteMutation.mutateAsync();
  }, [deleteMutation, documentId]);

  const actionError = updateMutation.error ?? deleteMutation.error;

  return {
    updateDocument,
    deleteDocument,
    isSaving: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    error: actionError
      ? getQueryErrorMessage(
          actionError,
          "Không thể cập nhật tài liệu. Vui lòng thử lại."
        )
      : null,
  };
};

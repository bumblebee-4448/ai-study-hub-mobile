import * as DocumentPicker from "expo-document-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { chatKeys, userDocumentKeys } from "@/services/api/queryKeys";

import type { CreateUserDocumentFormValues, PickedUploadFile } from "../types";
import { uploadUserDocument } from "../services/userUploadService";
import {
  ALLOWED_UPLOAD_MIME_TYPES,
  validatePickedUploadFile,
} from "../services/userUploadValidation";
import { useUserSubjects } from "./useUserSubjects";

const initialValues: CreateUserDocumentFormValues = {
  title: "",
  description: "",
  subjectId: "",
  isPublic: false,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const useUserUploadDocument = () => {
  const queryClient = useQueryClient();
  const subjectsQuery = useUserSubjects();
  const [values, setValues] =
    useState<CreateUserDocumentFormValues>(initialValues);
  const [pickedFile, setPickedFile] = useState<PickedUploadFile | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: uploadUserDocument,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userDocumentKeys.all });
      await queryClient.invalidateQueries({
        queryKey: chatKeys.readyDocuments(),
      });
    },
  });

  const setTitle = useCallback((title: string) => {
    setValues((current) => ({ ...current, title }));
  }, []);

  const setDescription = useCallback((description: string) => {
    setValues((current) => ({ ...current, description }));
  }, []);

  const setSubjectId = useCallback((subjectId: string) => {
    setValues((current) => ({ ...current, subjectId }));
  }, []);

  const setIsPublic = useCallback((isPublic: boolean) => {
    setValues((current) => ({ ...current, isPublic }));
  }, []);

  const pickFile = useCallback(async () => {
    setFileError(null);
    setSubmitError(null);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];
      const file: PickedUploadFile = {
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType ?? undefined,
        size: asset.size ?? undefined,
      };
      const validationError = validatePickedUploadFile(file);

      if (validationError) {
        setPickedFile(null);
        setFileError(validationError);
        return;
      }

      setPickedFile(file);
    } catch {
      setFileError("Không thể mở trình chọn tệp. Vui lòng thử lại.");
    }
  }, []);

  const clearFile = useCallback(() => {
    setPickedFile(null);
    setFileError(null);
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setPickedFile(null);
    setFileError(null);
    setSubmitError(null);
  }, []);

  const submitUpload = useCallback(async () => {
    if (uploadMutation.isPending) {
      return false;
    }

    if (!pickedFile) {
      setFileError("Vui lòng chọn tệp tài liệu trước.");
      return false;
    }

    if (!values.title.trim()) {
      setSubmitError("Vui lòng nhập tên tài liệu.");
      return false;
    }

    setSubmitError(null);

    try {
      await uploadMutation.mutateAsync({
        file: pickedFile,
        values,
      });
      resetForm();
      return true;
    } catch (error) {
      setSubmitError(
        getErrorMessage(error, "Đã xảy ra lỗi. Vui lòng thử lại."),
      );
      return false;
    }
  }, [pickedFile, resetForm, uploadMutation, values]);

  return {
    values,
    pickedFile,
    fileError,
    subjects: subjectsQuery.subjects,
    subjectsError: subjectsQuery.error,
    isLoadingSubjects: subjectsQuery.isLoading,
    isSubmitting: uploadMutation.isPending,
    submitError,
    setTitle,
    setDescription,
    setSubjectId,
    setIsPublic,
    pickFile,
    clearFile,
    loadSubjects: subjectsQuery.refresh,
    submitUpload,
  };
};

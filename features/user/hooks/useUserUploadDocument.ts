import * as DocumentPicker from "expo-document-picker";
import { useCallback, useEffect, useRef, useState } from "react";

import type {
  BackendSubject,
  CreateUserDocumentFormValues,
  PickedUploadFile,
} from "../types";
import {
  fetchUserUploadSubjects,
  uploadUserDocument,
} from "../services/userUploadService";
import {
  ALLOWED_UPLOAD_MIME_TYPES,
  validatePickedUploadFile,
} from "../services/userUploadValidation";

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
  const [values, setValues] =
    useState<CreateUserDocumentFormValues>(initialValues);
  const [pickedFile, setPickedFile] = useState<PickedUploadFile | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<BackendSubject[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const loadSubjects = useCallback(async () => {
    setIsLoadingSubjects(true);
    setSubjectsError(null);

    try {
      const result = await fetchUserUploadSubjects();
      setSubjects(result.subjects);
    } catch (error) {
      setSubjectsError(
        getErrorMessage(error, "Không thể tải danh sách môn học.")
      );
    } finally {
      setIsLoadingSubjects(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

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
        type: [...ALLOWED_UPLOAD_MIME_TYPES, "*/*"],
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
    if (submittingRef.current) {
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

    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await uploadUserDocument({
        file: pickedFile,
        values,
      });
      resetForm();
      return true;
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Đã xảy ra lỗi. Vui lòng thử lại."));
      return false;
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [pickedFile, resetForm, values]);

  return {
    values,
    pickedFile,
    fileError,
    subjects,
    subjectsError,
    isLoadingSubjects,
    isSubmitting,
    submitError,
    setTitle,
    setDescription,
    setSubjectId,
    setIsPublic,
    pickFile,
    clearFile,
    loadSubjects,
    submitUpload,
  };
};

import type { CreateUserDocumentFormValues } from "../types";

export interface BackendUploadFields {
  title: string;
  description?: string;
  subjectId?: string;
  isPublic: "true" | "false";
}

export const buildBackendUploadFields = (
  values: CreateUserDocumentFormValues
): BackendUploadFields => {
  const description = values.description?.trim();
  const subjectId = values.subjectId?.trim();

  return {
    title: values.title.trim(),
    ...(description ? { description } : {}),
    ...(subjectId ? { subjectId } : {}),
    isPublic: values.isPublic ? "true" : "false",
  };
};

import type { CreateUserDocumentFormValues, PickedUploadFile } from "../types";
import { buildBackendUploadFields } from "./userBackendUploadMappers";

export const UPLOAD_DOCUMENT_ERROR =
  "Không thể tải tài liệu lên. Vui lòng thử lại sau.";

const getApiClient = async () => {
  const module = await import("../../../services/api/axiosClient");
  return module.apiClient;
};

const buildBackendUploadFormData = (
  file: PickedUploadFile,
  values: CreateUserDocumentFormValues
) => {
  const formData = new FormData();

  formData.append("file", {
    uri: file.uri,
    name: file.name,
    type: file.mimeType ?? "application/octet-stream",
  } as unknown as Blob);

  for (const [key, value] of Object.entries(buildBackendUploadFields(values))) {
    formData.append(key, value);
  }

  return formData;
};

export const uploadUserDocument = async ({
  file,
  values,
}: {
  file: PickedUploadFile;
  values: CreateUserDocumentFormValues;
}) => {
  const apiClient = await getApiClient();

  try {
    return await apiClient.post(
      "/documents/upload",
      buildBackendUploadFormData(file, values),
      {
        headers: { "Content-Type": "multipart/form-data" },
        skipAlert: true,
        timeout: 60000,
      }
    );
  } catch {
    throw new Error(UPLOAD_DOCUMENT_ERROR);
  }
};

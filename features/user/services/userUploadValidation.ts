import type { PickedUploadFile } from "../types";

export const MAX_UPLOAD_SIZE_BYTES = 50 * 1024 * 1024;

export const ALLOWED_UPLOAD_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export const ALLOWED_UPLOAD_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
];

const getExtension = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension ? `.${extension}` : "";
};

export const validatePickedUploadFile = (
  file: PickedUploadFile
): string | null => {
  const mimeType = file.mimeType ?? "";
  const extension = getExtension(file.name);
  const isAllowedMime = ALLOWED_UPLOAD_MIME_TYPES.includes(mimeType);
  const isAllowedExtension = ALLOWED_UPLOAD_EXTENSIONS.includes(extension);

  if (!isAllowedMime && !isAllowedExtension) {
    return "Chỉ hỗ trợ PDF, DOC, DOCX, PPT, PPTX. Vui lòng chọn lại.";
  }

  const size = file.size ?? 0;
  if (size > MAX_UPLOAD_SIZE_BYTES) {
    const sizeInMb = (size / 1024 / 1024).toFixed(1);
    return `Tệp ${sizeInMb} MB vượt quá giới hạn 50 MB.`;
  }

  return null;
};

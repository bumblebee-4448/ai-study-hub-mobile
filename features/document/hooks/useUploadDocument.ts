/**
 * Document Feature — useUploadDocument hook
 * Encapsulates file picking, validation, and form submission for UploadScreen.
 *
 * Rules:
 *  - Allowed MIME types: PDF, DOCX, PPTX
 *  - Max size: 50 MB
 *  - Uses expo-document-picker for native file access
 */

import * as DocumentPicker from "expo-document-picker";
import { useCallback, useState } from "react";
import { PickedFile, UploadStatus } from "../types";

// ── Constants ────────────────────────────────────────────────────────────────

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

const ALLOWED_MIMES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".ppt", ".pptx"];

// ── Hook ─────────────────────────────────────────────────────────────────────

interface UseUploadDocumentReturn {
  pickedFile: PickedFile | null;
  fileError: string | null;
  uploadStatus: UploadStatus;
  pickFile: () => Promise<void>;
  clearFile: () => void;
  submitUpload: (formData: {
    title: string;
    category: string;
    description?: string;
  }) => Promise<void>;
}

export const useUploadDocument = (): UseUploadDocumentReturn => {
  const [pickedFile, setPickedFile] = useState<PickedFile | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");

  /** Validate MIME / extension & size */
  const validate = useCallback(
    (asset: DocumentPicker.DocumentPickerAsset): string | null => {
      const mime = asset.mimeType ?? "";
      const name = asset.name ?? "";
      const ext = "." + name.split(".").pop()?.toLowerCase();

      const isMimeOk = ALLOWED_MIMES.includes(mime);
      const isExtOk = ALLOWED_EXTENSIONS.includes(ext);

      if (!isMimeOk && !isExtOk) {
        return "Chỉ hỗ trợ PDF, DOCX, PPTX. Vui lòng chọn lại.";
      }

      const size = asset.size ?? 0;
      if (size > MAX_SIZE_BYTES) {
        const mb = (size / 1024 / 1024).toFixed(1);
        return `Tệp ${mb} MB vượt quá giới hạn 50 MB.`;
      }

      return null;
    },
    []
  );

  const pickFile = useCallback(async () => {
    setFileError(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          // Android fallback — let the system filter; we re-validate after
          "*/*",
        ],
        copyToCacheDirectory: false,
        multiple: false,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      const error = validate(asset);
      if (error) {
        setFileError(error);
        setPickedFile(null);
        return;
      }

      setPickedFile({
        name: asset.name,
        uri: asset.uri,
        mimeType: asset.mimeType ?? undefined,
        size: asset.size ?? undefined,
      });
    } catch {
      setFileError("Không thể mở trình chọn tệp. Vui lòng thử lại.");
    }
  }, [validate]);

  const clearFile = useCallback(() => {
    setPickedFile(null);
    setFileError(null);
  }, []);

  const submitUpload = useCallback(
    async (formData: {
      title: string;
      category: string;
      description?: string;
    }) => {
      if (!pickedFile) {
        setFileError("Vui lòng chọn tệp trước khi tải lên.");
        return;
      }

      setUploadStatus("uploading");

      try {
        // TODO: replace with real API call via axiosClient
        await new Promise<void>((resolve) => setTimeout(resolve, 1500));
        console.log("Upload payload:", { ...formData, file: pickedFile });
        setUploadStatus("success");
      } catch {
        setUploadStatus("error");
      }
    },
    [pickedFile]
  );

  return {
    pickedFile,
    fileError,
    uploadStatus,
    pickFile,
    clearFile,
    submitUpload,
  };
};

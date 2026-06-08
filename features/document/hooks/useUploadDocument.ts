import * as DocumentPicker from "expo-document-picker";
import { useCallback, useState } from "react";
import { PickedFile, UploadStatus } from "../types";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_MIMES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".ppt", ".pptx"];

const validateFile = (
  asset: DocumentPicker.DocumentPickerAsset
): string | null => {
  const mime = asset.mimeType ?? "";
  const ext = "." + (asset.name ?? "").split(".").pop()?.toLowerCase();

  if (!ALLOWED_MIMES.includes(mime) && !ALLOWED_EXTENSIONS.includes(ext)) {
    return "Chỉ hỗ trợ PDF, DOCX, PPTX. Vui lòng chọn lại.";
  }

  const size = asset.size ?? 0;
  if (size > MAX_FILE_SIZE) {
    return `Tệp ${(size / 1024 / 1024).toFixed(1)} MB vượt quá giới hạn 50 MB.`;
  }

  return null;
};

export const useUploadDocument = () => {
  const [pickedFile, setPickedFile] = useState<PickedFile | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");

  const pickFile = useCallback(async () => {
    setFileError(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [...ALLOWED_MIMES, "*/*"],
        copyToCacheDirectory: false,
        multiple: false,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      const error = validateFile(asset);

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
  }, []);

  const clearFile = useCallback(() => {
    setPickedFile(null);
    setFileError(null);
  }, []);

  const submitUpload = useCallback(
    async (formData: { title: string; category: string; description?: string }) => {
      if (!pickedFile) {
        setFileError("Vui lòng chọn tệp trước khi tải lên.");
        return;
      }
      setUploadStatus("uploading");
      try {
        await new Promise<void>((resolve) => setTimeout(resolve, 1500));
        void formData;
        setUploadStatus("success");
      } catch {
        setUploadStatus("error");
      }
    },
    [pickedFile]
  );

  return { pickedFile, fileError, uploadStatus, pickFile, clearFile, submitUpload };
};

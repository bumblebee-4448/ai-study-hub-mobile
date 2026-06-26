import { useCallback, useMemo, useState } from "react";

import { useMyDocuments, type BackendDocumentStatus, type UserDocument } from "@/features/user";
import type { DocumentStatus, MyDocument } from "../types";

const mapStatus = (status: BackendDocumentStatus): DocumentStatus => {
  if (status === "ACTIVE") {
    return "public";
  }

  if (status === "REJECTED") {
    return "rejected";
  }

  if (status === "DELETED") {
    return "deleted";
  }

  return "pending";
};

const mapFormat = (formatLabel: string): MyDocument["format"] => {
  const normalizedFormat = formatLabel.toLowerCase();

  if (normalizedFormat.includes("doc")) {
    return "docx";
  }

  if (normalizedFormat.includes("ppt")) {
    return "pptx";
  }

  if (normalizedFormat.includes("zip")) {
    return "zip";
  }

  if (normalizedFormat.includes("pdf")) {
    return "pdf";
  }

  return "file";
};

export const mapUserDocumentToProfileDocument = (
  document: UserDocument
): MyDocument => ({
  id: document.id,
  title: document.title,
  subject: document.subjectLabel,
  size: document.sizeLabel || "Không rõ dung lượng",
  uploadedAt: document.createdAtLabel || "Không rõ ngày tải",
  status: mapStatus(document.status),
  format: mapFormat(document.formatLabel),
});

export const useProfileDocuments = () => {
  const { documents, pagination, isLoading, error, refresh } = useMyDocuments();
  const [hiddenDocumentIds, setHiddenDocumentIds] = useState<string[]>([]);

  const hiddenIdSet = useMemo(
    () => new Set(hiddenDocumentIds),
    [hiddenDocumentIds]
  );

  const profileDocuments = useMemo(
    () =>
      documents
        .map(mapUserDocumentToProfileDocument)
        .filter((document) => !hiddenIdSet.has(document.id)),
    [documents, hiddenIdSet]
  );

  const hideDocument = useCallback((documentId: string) => {
    setHiddenDocumentIds((currentIds) =>
      currentIds.includes(documentId)
        ? currentIds
        : [...currentIds, documentId]
    );
  }, []);

  const refreshDocuments = useCallback(async () => {
    setHiddenDocumentIds([]);
    await refresh();
  }, [refresh]);

  return {
    documents: profileDocuments,
    pagination,
    isLoading,
    error,
    refresh: refreshDocuments,
    hideDocument,
  };
};

import {
  EditDocumentScreen,
  useDocumentDetail,
  useEditDocument,
  type EditDocumentParams,
  type UploadCategory,
} from "@/features/document";
import { useUserSubjects } from "@/features/user";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

export default function EditDocumentRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const documentId = id || "";
  const detail = useDocumentDetail(documentId);
  const subjects = useUserSubjects();
  const editDocument = useEditDocument(documentId);

  const initialData = useMemo<EditDocumentParams | undefined>(() => {
    if (!detail.document) {
      return undefined;
    }

    return {
      documentId: detail.document.id,
      title: detail.document.title,
      category: detail.document.subjectId ?? "",
      description: detail.document.rawDescription,
      tags: detail.document.tags.join(", "),
      fileName: detail.document.fileName,
      fileSize: detail.document.sizeInBytes,
    };
  }, [detail.document]);

  const categories = useMemo<UploadCategory[]>(
    () =>
      subjects.subjects.map((subject) => ({
        value: subject.id,
        label: subject.code ? `${subject.name} (${subject.code})` : subject.name,
      })),
    [subjects.subjects]
  );

  const error = detail.error ?? subjects.error ?? editDocument.error;

  return (
    <EditDocumentScreen
      initialData={initialData}
      categories={categories}
      isLoading={detail.isLoading}
      error={error}
      onRetry={detail.refresh}
      isSaving={editDocument.isSaving}
      isDeleting={editDocument.isDeleting}
      onBack={() => router.back()}
      onSave={editDocument.updateDocument}
      onDelete={editDocument.deleteDocument}
    />
  );
}

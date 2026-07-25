import { DocumentDetailScreen, useDocumentDetail } from "@/features/document";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function DocumentDetailRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { document, isLoading, error, refresh } = useDocumentDetail(id || "");

  return (
    <DocumentDetailScreen
      document={document || undefined}
      isLoading={isLoading}
      error={error}
      onRetry={refresh}
      onBack={() => router.back()}
      onBookmark={(docId) => {
        // Placeholder for bookmark logic
      }}
      onDownload={(docId) => {
        // Placeholder for download logic
      }}
      onRelatedPress={(relId) => {
        router.push({ pathname: "/document/[id]" as any, params: { id: relId } });
      }}
    />
  );
}

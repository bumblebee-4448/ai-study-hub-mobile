import { DocumentDetailScreen } from "@/features/document";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function DocumentDetailRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <DocumentDetailScreen
      onBack={() => router.back()}
      onBookmark={(docId) => {
        // Placeholder for bookmark logic
      }}
      onDownload={(docId) => {
        // Placeholder for download logic
      }}
      onRelatedPress={(relId) => {
        router.push({ pathname: "/document/[id]", params: { id: relId } });
      }}
    />
  );
}

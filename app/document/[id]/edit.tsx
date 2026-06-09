import { EditDocumentScreen } from "@/features/document";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function EditDocumentRoute() {
  const router = useRouter();
  useLocalSearchParams<{ id: string }>();

  return (
    <EditDocumentScreen
      onBack={() => router.back()}
      onSave={(data) => {
        // Placeholder for save logic
        router.back();
      }}
      onDelete={(docId) => {
        // Placeholder for delete logic
        router.back();
      }}
    />
  );
}

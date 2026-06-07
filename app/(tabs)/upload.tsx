/**
 * Upload Tab — delegates entirely to the Document feature's upload screen.
 * Business logic lives in features/document/, not here.
 */
import { UploadScreen } from "@/features/document";
import { useRouter } from "expo-router";

export default function UploadRoute() {
  const router = useRouter();
  
  return (
    <UploadScreen
      onCancel={() => {
        router.push("/(tabs)");
      }}
      onSuccess={() => {
        router.push("/(tabs)");
      }}
    />
  );
}

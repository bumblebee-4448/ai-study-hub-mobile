import { UploadScreen } from "@/features/document";
import { useRouter } from "expo-router";

export default function UploadRoute() {
  const router = useRouter();

  return (
    <UploadScreen
      onCancel={() => {
        router.push("/");
      }}
      onSuccess={() => {
        router.push("/");
      }}
    />
  );
}

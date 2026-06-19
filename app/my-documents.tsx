import { MyDocumentScreen } from "@/features/profile";
import { useRouter } from "expo-router";

export default function MyDocumentsRoute() {
  const router = useRouter();
  
  return (
    <MyDocumentScreen
      onBack={() => router.back()}
      onUpload={() => router.push("/(student-tabs)/upload")}
      onEdit={(id) => {
        router.push({ pathname: "/document/[id]/edit", params: { id } });
      }}
    />
  );
}

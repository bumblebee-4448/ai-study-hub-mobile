import { DocumentHomeScreen } from "@/features/document";
import { useRouter } from "expo-router";

export default function HomeRoute() {
  const router = useRouter();

  return (
    <DocumentHomeScreen
      onDocumentPress={(id) => {
        router.push({ pathname: "/document/[id]" as any, params: { id } });
      }}
      onCoursePress={(id) => {
        // Can route to a course detail page in the future if available
      }}
    />
  );
}

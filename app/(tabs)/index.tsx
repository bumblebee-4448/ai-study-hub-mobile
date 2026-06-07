/**
 * Home Tab — delegates entirely to the Document feature's home screen.
 * Business logic lives in features/document/, not here.
 */
import { DocumentHomeScreen } from "@/features/document";
import { useRouter } from "expo-router";

export default function HomeRoute() {
  const router = useRouter();
  
  return (
    <DocumentHomeScreen
      onDocumentPress={(id) => {
        router.push({ pathname: "/document/[id]", params: { id } });
      }}
      onCoursePress={(id) => {
        // Can route to a course detail page in the future if available
      }}
    />
  );
}

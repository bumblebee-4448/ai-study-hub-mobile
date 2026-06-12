import { DocumentHomeScreen } from "@/features/document";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useProfileStore } from "@/features/profile/store/profileStore";

export default function HomeRoute() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const { profile } = useProfileStore();

  return (
    <DocumentHomeScreen
      isLoggedIn={!!accessToken}
      avatarUrl={profile?.avatarUrl}
      onLoginPress={() => {
        router.push("/login");
      }}
      onDocumentPress={(id) => {
        router.push({ pathname: "/document/[id]" as any, params: { id } });
      }}
      onCoursePress={(id) => {
        // Can route to a course detail page in the future if available
      }}
    />
  );
}

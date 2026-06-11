import { EditProfileScreen } from "@/features/profile";
import { useRouter } from "expo-router";

export default function ProfileEditRoute() {
  const router = useRouter();
  return <EditProfileScreen onBack={() => router.back()} onSaved={() => router.back()} />;
}

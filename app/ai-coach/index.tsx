import { AIChatScreen } from "@/features/chat";
import { useRouter } from "expo-router";

export default function AIChatRoute() {
  const router = useRouter();

  return <AIChatScreen onBack={() => router.back()} />;
}

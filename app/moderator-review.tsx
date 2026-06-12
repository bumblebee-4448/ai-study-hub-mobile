import { useAuthStore } from "@/features/auth";
import { ModeratorReviewScreen } from "@/features/document";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

export default function ModeratorReview() {
  const router = useRouter();
  const { role, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (role !== "moderator") {
      router.replace("/login");
    }
  }, [role, _hasHydrated, router]);

  if (!_hasHydrated) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (role !== "moderator") return null;

  return (
    <>
      {/* Override header options từ trong component để chắc chắn nhất */}
      <Stack.Screen
        options={{
          title: "Document Review",
          headerBackTitle: " ",
          headerBackTitleVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ paddingHorizontal: 8, paddingVertical: 4 }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={26} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <ModeratorReviewScreen />
    </>
  );
}

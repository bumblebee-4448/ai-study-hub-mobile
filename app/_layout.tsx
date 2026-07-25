import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import * as SystemUI from "expo-system-ui";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";

import { ErrorBoundary } from "@/components/error-boundary";
import { useAppTheme } from "@/features/theme";
import {
  configureQueryManagers,
  queryClient,
} from "@/services/api/queryClient";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

export default function RootLayout() {
  const { colors, isDark } = useAppTheme();
  const navigationTheme = useMemo(() => {
    const baseTheme = isDark ? DarkTheme : DefaultTheme;

    return {
      ...baseTheme,
      dark: isDark,
      colors: {
        ...baseTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.danger,
      },
    };
  }, [colors, isDark]);

  useEffect(() => {
    configureQueryManagers();
  }, []);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch((error) => {
      console.error("Failed to update system UI background:", error);
    });
  }, [colors.background]);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <SafeAreaProvider>
          <ThemeProvider value={navigationTheme}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="register" options={{ headerShown: false }} />
              <Stack.Screen
                name="(admin-tabs)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(moderator-tabs)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(student-tabs)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", headerShown: false }}
              />
              <Stack.Screen
                name="profile-edit"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="my-documents"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="document/[id]"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="document/[id]/edit"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="ai-coach/index" options={{ headerShown: false }} />
              <Stack.Screen
                name="moderator-review"
                options={{ headerBackTitle: " ", title: "Review Tài liệu" }}
              />
            </Stack>
            <StatusBar
              style={isDark ? "light" : "dark"}
              backgroundColor={colors.background}
            />
          </ThemeProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

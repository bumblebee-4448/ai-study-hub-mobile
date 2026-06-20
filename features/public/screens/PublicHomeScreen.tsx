import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BookOpen, LogIn, Search, Upload } from "lucide-react-native";

import { ScreenSafeAreaView } from "@/components/screen-safe-area-view";
import { SPACING, TYPOGRAPHY } from "@/constants/theme";
import { useAuthStore } from "@/features/auth";
import {
  getPublicRootRedirectHref,
  type RootRouteHref,
} from "@/features/auth/services/sessionRouting";
import { useRootRouteReset } from "@/features/auth/hooks/useRootRouteReset";
import { useAppTheme, type AppThemeColors } from "@/features/theme";

export const PublicHomeScreen = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, role, _hasHydrated } = useAuthStore();
  const resetToRootRoute = useRootRouteReset();
  const lastRedirectTargetRef = useRef<RootRouteHref | null>(null);

  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const redirectTarget = useMemo<RootRouteHref | null>(() => {
    if (!_hasHydrated) {
      return null;
    }

    return getPublicRootRedirectHref({
      currentPathname: pathname,
      accessToken,
      role,
    });
  }, [_hasHydrated, accessToken, pathname, role]);

  useEffect(() => {
    if (!redirectTarget || lastRedirectTargetRef.current === redirectTarget) {
      return;
    }

    lastRedirectTargetRef.current = redirectTarget;
    resetToRootRoute(redirectTarget);
  }, [redirectTarget, resetToRootRoute]);

  return (
    <ScreenSafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.brandMark}>
          <BookOpen size={34} color={colors.primary} />
        </View>

        <View style={styles.copyBlock}>
          <Text style={styles.title}>AcademicShare</Text>
          <Text style={styles.subtitle}>
            Không gian chia sẻ tài liệu học tập, tìm kiếm học liệu và đóng góp
            tri thức cho cộng đồng sinh viên.
          </Text>
        </View>

        <View style={styles.featureList}>
          <View style={styles.featureRow}>
            <Search size={18} color={colors.primary} />
            <Text style={styles.featureText}>Khám phá tài liệu theo môn học</Text>
          </View>
          <View style={styles.featureRow}>
            <Upload size={18} color={colors.primary} />
            <Text style={styles.featureText}>Quản lý tài liệu cá nhân</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login")}
          activeOpacity={0.85}
        >
          <LogIn size={20} color={colors.onPrimary} />
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </ScreenSafeAreaView>
  );
};

const createStyles = (colors: AppThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING["margin-mobile"],
    gap: SPACING.xl,
  },
  brandMark: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryMuted,
  },
  copyBlock: {
    gap: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY["headline-lg-mobile"],
    color: colors.primary,
    fontWeight: "800",
  },
  subtitle: {
    ...TYPOGRAPHY["body-lg"],
    color: colors.textMuted,
    lineHeight: 26,
  },
  featureList: {
    gap: SPACING.md,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  featureText: {
    ...TYPOGRAPHY["body-md"],
    color: colors.text,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.base,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: SPACING.md,
  },
  loginButtonText: {
    ...TYPOGRAPHY["label-md"],
    color: colors.onPrimary,
    fontWeight: "700",
  },
});

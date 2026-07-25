import { useRouter } from "expo-router";
import {
  CalendarDays,
  ChevronRight,
  FileText,
  Globe,
  LogOut,
  Mail,
  Monitor,
  Moon,
  Pencil,
  RefreshCw,
  ShieldCheck,
  Sun,
  User,
} from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ScreenSafeAreaView } from "@/components/screen-safe-area-view";
import { SCREEN_CONTENT_TOP_PADDING } from "@/constants/safeArea";
import { useAuthStore } from "@/features/auth";
import {
  THEME_PREFERENCE_LABELS,
  useAppTheme,
  type AppThemeColors,
  type ThemePreference,
} from "@/features/theme";
import { useProfile } from "../hooks/useProfile";

const ROLE_LABELS: Record<string, string> = {
  USER: "Sinh viên",
  MODERATOR: "Kiểm duyệt viên",
  ADMIN: "Quản trị viên",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Đã xác minh",
  UNVERIFIED: "Chưa xác minh",
  BANNED: "Đã khóa",
  DELETED: "Đã xóa",
};

const THEME_OPTIONS: Array<{
  value: ThemePreference;
  label: string;
  Icon: typeof Monitor;
}> = [
  { value: "system", label: "Hệ thống", Icon: Monitor },
  { value: "light", label: "Sáng", Icon: Sun },
  { value: "dark", label: "Tối", Icon: Moon },
];

const formatDate = (value?: string) => {
  if (!value) {
    return "Chưa có dữ liệu";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Chưa có dữ liệu";
  }

  return date.toLocaleDateString("vi-VN");
};

export const ProfileScreen = () => {
  const router = useRouter();
  const { profile, isLoading, error, loadProfile, handleLogout } = useProfile();
  const { role } = useAuthStore();
  const { colors, preference, setThemePreference } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleMenuPress = useCallback(
    (key: string) => {
      if (key === "logout") {
        Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất không?", [
          { text: "Hủy", style: "cancel" },
          { text: "Đăng xuất", style: "destructive", onPress: handleLogout },
        ]);
        return;
      }

      if (key === "profile-edit") {
        router.push("/profile-edit" as any);
        return;
      }

      if (key === "my-documents") {
        router.push("/my-documents" as any);
        return;
      }

      if (key === "moderator-review") {
        router.push("/moderator-review" as any);
      }
    },
    [handleLogout, router]
  );

  if (isLoading && !profile) {
    return (
      <ScreenSafeAreaView style={styles.container}>
        <View style={styles.stateBox}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.stateText}>Đang tải hồ sơ...</Text>
        </View>
      </ScreenSafeAreaView>
    );
  }

  if (error && !profile) {
    return (
      <ScreenSafeAreaView style={styles.container}>
        <View style={styles.stateBox}>
          <Text style={styles.stateText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
            <RefreshCw size={16} color={colors.primary} />
            <Text style={styles.retryText}>Tải lại</Text>
          </TouchableOpacity>
        </View>
      </ScreenSafeAreaView>
    );
  }

  if (!profile) {
    return null;
  }

  const roleLabel = ROLE_LABELS[profile.role] ?? profile.role;
  const statusLabel = profile.status
    ? STATUS_LABELS[profile.status] ?? profile.status
    : "Chưa có dữ liệu";

  return (
    <ScreenSafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>AcademicShare</Text>
          <Text style={styles.pageTitle}>Hồ sơ</Text>
          <Text style={styles.pageSubtitle}>
            Quản lý tài khoản và cài đặt cá nhân.
          </Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {profile.avatarUrl ? (
              <Image
                source={{ uri: profile.avatarUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <User size={30} color={colors.primary} />
            )}
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {profile.name}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {profile.email}
            </Text>
            <View style={styles.badgeRow}>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{roleLabel}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{statusLabel}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleMenuPress("profile-edit")}
            activeOpacity={0.75}
          >
            <Pencil size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoGroup}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Mail size={18} color={colors.icon} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {profile.email}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <ShieldCheck size={18} color={colors.icon} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Trạng thái</Text>
              <Text style={styles.infoValue}>{statusLabel}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <CalendarDays size={18} color={colors.icon} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Ngày tham gia</Text>
              <Text style={styles.infoValue}>{formatDate(profile.createdAt)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>QUẢN LÝ</Text>
          <View style={styles.menuGroup}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress("profile-edit")}
              activeOpacity={0.75}
            >
              <View style={styles.menuIcon}>
                <Pencil size={18} color={colors.primary} />
              </View>
              <Text style={styles.menuLabel}>Chỉnh sửa thông tin</Text>
              <ChevronRight size={18} color={colors.textSubtle} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress("my-documents")}
              activeOpacity={0.75}
            >
              <View style={styles.menuIcon}>
                <FileText size={18} color={colors.primary} />
              </View>
              <Text style={styles.menuLabel}>Tài liệu của tôi</Text>
              <ChevronRight size={18} color={colors.textSubtle} />
            </TouchableOpacity>

            {role === "moderator" ? (
              <>
                <View style={styles.divider} />
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuPress("moderator-review")}
                  activeOpacity={0.75}
                >
                  <View style={styles.menuIcon}>
                    <ShieldCheck size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.menuLabel}>Duyệt tài liệu</Text>
                  <ChevronRight size={18} color={colors.textSubtle} />
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>CÀI ĐẶT</Text>
          <View style={styles.menuGroup}>
            <View style={styles.themeSetting}>
              <View style={styles.themeHeader}>
                <View style={styles.menuIconMuted}>
                  <Moon size={18} color={colors.icon} />
                </View>
                <View style={styles.themeTextRow}>
                  <Text style={styles.menuLabel}>Giao diện</Text>
                  <Text style={styles.menuValue}>
                    {THEME_PREFERENCE_LABELS[preference]}
                  </Text>
                </View>
              </View>

              <View style={styles.themeSegmented}>
                {THEME_OPTIONS.map(({ value, label, Icon }) => {
                  const isSelected = preference === value;

                  return (
                    <TouchableOpacity
                      key={value}
                      style={[
                        styles.themeOption,
                        isSelected && styles.themeOptionActive,
                      ]}
                      onPress={() => setThemePreference(value)}
                      activeOpacity={0.82}
                    >
                      <Icon
                        size={14}
                        color={isSelected ? colors.onPrimary : colors.icon}
                      />
                      <Text
                        style={[
                          styles.themeOptionText,
                          isSelected && styles.themeOptionTextActive,
                        ]}
                        numberOfLines={1}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.menuItem}>
              <View style={styles.menuIconMuted}>
                <Globe size={18} color={colors.icon} />
              </View>
              <Text style={styles.menuLabel}>Ngôn ngữ</Text>
              <Text style={styles.menuValue}>Tiếng Việt</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => handleMenuPress("logout")}
          activeOpacity={0.75}
        >
          <LogOut size={18} color={colors.danger} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenSafeAreaView>
  );
};

const createStyles = (colors: AppThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: SCREEN_CONTENT_TOP_PADDING,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 22,
    gap: 4,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSubtle,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
  },
  pageSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSubtle,
  },
  profileCard: {
    minHeight: 108,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryMuted,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
    gap: 4,
  },
  userName: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.text,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSubtle,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 2,
  },
  roleBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.inverseSurface,
  },
  roleText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.inverseText,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.surfaceSubtle,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryMuted,
  },
  infoGroup: {
    marginTop: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  infoRow: {
    minHeight: 64,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    minWidth: 0,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSubtle,
  },
  infoValue: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  menuSection: {
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 12,
    fontWeight: "800",
    color: colors.textSubtle,
  },
  menuGroup: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  menuItem: {
    minHeight: 58,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  themeSetting: {
    paddingVertical: 12,
  },
  themeHeader: {
    minHeight: 34,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  themeTextRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  themeSegmented: {
    minHeight: 48,
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: 8,
    padding: 4,
    flexDirection: "row",
    gap: 4,
    backgroundColor: colors.surfaceMuted,
  },
  themeOption: {
    flex: 1,
    minHeight: 40,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  themeOptionActive: {
    backgroundColor: colors.primary,
  },
  themeOptionText: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
  },
  themeOptionTextActive: {
    color: colors.onPrimary,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryMuted,
    marginRight: 12,
  },
  menuIconMuted: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: colors.textMuted,
  },
  menuValue: {
    fontSize: 13,
    color: colors.textSubtle,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 60,
  },
  logoutButton: {
    height: 52,
    borderRadius: 8,
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.dangerMuted,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.danger,
  },
  stateBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  stateText: {
    fontSize: 14,
    textAlign: "center",
    color: colors.textSubtle,
  },
  retryButton: {
    minHeight: 42,
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primaryMuted,
  },
  retryText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
  },
});

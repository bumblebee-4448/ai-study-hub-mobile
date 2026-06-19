import { useRouter } from "expo-router";
import {
  CalendarDays,
  ChevronRight,
  FileText,
  Globe,
  LogOut,
  Mail,
  Moon,
  Pencil,
  RefreshCw,
  ShieldCheck,
  User,
} from "lucide-react-native";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuthStore } from "@/features/auth";
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
      <SafeAreaView style={styles.container}>
        <View style={styles.stateBox}>
          <ActivityIndicator size="small" color="#004ac6" />
          <Text style={styles.stateText}>Đang tải hồ sơ...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.stateBox}>
          <Text style={styles.stateText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
            <RefreshCw size={16} color="#004ac6" />
            <Text style={styles.retryText}>Tải lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>AcademiShare</Text>
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
              <User size={30} color="#004ac6" />
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
            <Pencil size={18} color="#004ac6" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoGroup}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Mail size={18} color="#475569" />
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
              <ShieldCheck size={18} color="#475569" />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Trạng thái</Text>
              <Text style={styles.infoValue}>{statusLabel}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <CalendarDays size={18} color="#475569" />
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
                <Pencil size={18} color="#004ac6" />
              </View>
              <Text style={styles.menuLabel}>Chỉnh sửa thông tin</Text>
              <ChevronRight size={18} color="#94a3b8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress("my-documents")}
              activeOpacity={0.75}
            >
              <View style={styles.menuIcon}>
                <FileText size={18} color="#004ac6" />
              </View>
              <Text style={styles.menuLabel}>Tài liệu của tôi</Text>
              <ChevronRight size={18} color="#94a3b8" />
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
                    <ShieldCheck size={18} color="#004ac6" />
                  </View>
                  <Text style={styles.menuLabel}>Duyệt tài liệu</Text>
                  <ChevronRight size={18} color="#94a3b8" />
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>CÀI ĐẶT</Text>
          <View style={styles.menuGroup}>
            <View style={styles.menuItem}>
              <View style={styles.menuIconMuted}>
                <Moon size={18} color="#64748b" />
              </View>
              <Text style={styles.menuLabel}>Giao diện</Text>
              <Text style={styles.menuValue}>Theo hệ thống</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.menuItem}>
              <View style={styles.menuIconMuted}>
                <Globe size={18} color="#64748b" />
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
          <LogOut size={18} color="#dc2626" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 22,
    gap: 4,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
  },
  pageSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#64748b",
  },
  profileCard: {
    minHeight: 108,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff6ff",
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
    color: "#0f172a",
  },
  userEmail: {
    fontSize: 13,
    color: "#64748b",
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
    backgroundColor: "#0f172a",
  },
  roleText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#f1f5f9",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#334155",
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff6ff",
  },
  infoGroup: {
    marginTop: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
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
    backgroundColor: "#f8fafc",
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    minWidth: 0,
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  infoValue: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },
  menuSection: {
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 12,
    fontWeight: "800",
    color: "#94a3b8",
  },
  menuGroup: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  menuItem: {
    minHeight: 58,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff6ff",
    marginRight: 12,
  },
  menuIconMuted: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
  },
  menuValue: {
    fontSize: 13,
    color: "#64748b",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
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
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#dc2626",
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
    color: "#64748b",
  },
  retryButton: {
    minHeight: 42,
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#eff6ff",
  },
  retryText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#004ac6",
  },
});

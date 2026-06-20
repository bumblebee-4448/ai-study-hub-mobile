import { useRouter } from "expo-router";
import { RefreshCw, UserCircle } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ScreenSafeAreaView } from "@/components/screen-safe-area-view";
import { SCREEN_HEADER_TOP_PADDING } from "@/constants/safeArea";
import {
  fetchAdminAccounts,
  fetchAdminDashboardStats,
} from "../services/adminApi";
import { mapAdminDashboardStats } from "../services/adminMappers";
import type { AdminAccountItem, AdminDashboardStats } from "../types";
import { StatsCard } from "../components/StatsCard";
import { useAppTheme, type AppThemeColors } from "@/features/theme";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const ratio = (value: number, total: number) => {
  if (total <= 0) {
    return 0;
  }

  return Math.min(1, value / total);
};

export const DashboardScreen = () => {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [stats, setStats] = useState<AdminDashboardStats>(() =>
    mapAdminDashboardStats(null)
  );
  const [recentUsers, setRecentUsers] = useState<AdminAccountItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [dashboardStats, accounts] = await Promise.all([
        fetchAdminDashboardStats(),
        fetchAdminAccounts(),
      ]);

      setStats(dashboardStats);
      setRecentUsers(accounts.slice(0, 4));
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Không thể tải dữ liệu trang chủ.")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const cards = useMemo(
    () => [
      {
        title: "Tổng người dùng",
        value: stats.accounts.total.toLocaleString("vi-VN"),
        progress: ratio(stats.accounts.active, stats.accounts.total),
        isDark: true,
        onPress: () => router.push("/users" as any),
      },
      {
        title: "Môn học",
        value: stats.subjects.total.toLocaleString("vi-VN"),
        progress: stats.subjects.total > 0 ? 1 : 0,
        color: colors.secondary,
        onPress: () => router.push("/subjects" as any),
      },
      {
        title: "Tài liệu chờ duyệt",
        value: stats.documents.pending.toLocaleString("vi-VN"),
        progress: ratio(stats.documents.pending, stats.documents.total),
        color: colors.warning,
      },
      {
        title: "Tài liệu đã duyệt",
        value: stats.documents.active.toLocaleString("vi-VN"),
        progress: ratio(stats.documents.active, stats.documents.total),
        color: colors.success,
      },
    ],
    [colors, router, stats]
  );

  return (
    <ScreenSafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.welcomeText}>Quản trị hệ thống</Text>
          <Text style={styles.title}>Trang chủ</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/profile" as any)}
          style={styles.profileButton}
          activeOpacity={0.75}
        >
          <UserCircle size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator color={colors.primary} size="small" />
            <Text style={styles.stateText}>Đang tải dữ liệu trang chủ...</Text>
          </View>
        ) : null}

        {!isLoading && errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadDashboard}
              activeOpacity={0.75}
            >
              <RefreshCw size={16} color={colors.primary} />
              <Text style={styles.retryText}>Tải lại</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!isLoading && !errorMessage ? (
          <>
            <View style={styles.statsGrid}>
              {cards.map((card) => (
                <StatsCard key={card.title} {...card} />
              ))}
            </View>

            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>Tình trạng tài khoản</Text>
              <View style={styles.summaryGrid}>
                <SummaryItem
                  label="Đang hoạt động"
                  value={stats.accounts.active}
                  color={colors.success}
                  styles={styles}
                />
                <SummaryItem
                  label="Chưa xác thực"
                  value={stats.accounts.unverified}
                  color={colors.warning}
                  styles={styles}
                />
                <SummaryItem
                  label="Đã khóa"
                  value={stats.accounts.banned}
                  color={colors.danger}
                  styles={styles}
                />
              </View>
            </View>

            <View style={styles.listSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Người dùng gần đây</Text>
                <TouchableOpacity onPress={() => router.push("/users" as any)}>
                  <Text style={styles.seeAll}>Xem tất cả</Text>
                </TouchableOpacity>
              </View>

              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <TouchableOpacity
                    key={user.id}
                    style={styles.userRow}
                    onPress={() => router.push("/users" as any)}
                    activeOpacity={0.75}
                  >
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{user.initials}</Text>
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName} numberOfLines={1}>
                        {user.name}
                      </Text>
                      <Text style={styles.userEmail} numberOfLines={1}>
                        {user.email}
                      </Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{user.statusLabel}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyText}>Chưa có người dùng để hiển thị.</Text>
              )}
            </View>
          </>
        ) : null}
      </ScrollView>
    </ScreenSafeAreaView>
  );
};

function SummaryItem({
  label,
  value,
  color,
  styles,
}: {
  label: string;
  value: number;
  color: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.summaryItem}>
      <View style={[styles.summaryDot, { backgroundColor: color }]} />
      <Text style={styles.summaryValue}>{value.toLocaleString("vi-VN")}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const createStyles = (colors: AppThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: SCREEN_HEADER_TOP_PADDING,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.textSubtle,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 110,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  stateBox: {
    minHeight: 260,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  stateText: {
    fontSize: 14,
    color: colors.textSubtle,
  },
  errorBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.dangerMuted,
    padding: 16,
    gap: 14,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.dangerText,
  },
  retryButton: {
    alignSelf: "flex-start",
    minHeight: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
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
  summarySection: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  summaryGrid: {
    marginTop: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  summaryItem: {
    minHeight: 58,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 10,
  },
  summaryValue: {
    width: 52,
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.textMuted,
  },
  listSection: {
    marginTop: 2,
  },
  seeAll: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "800",
  },
  userRow: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryMuted,
    marginRight: 12,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  userEmail: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSubtle,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.surfaceSubtle,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.textMuted,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSubtle,
  },
});

import React, { useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatsCard } from "@/features/admin/components/StatsCard";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useProfileStore } from "@/features/profile/store/profileStore";
import { ChevronRight, Clock, CheckCircle } from "lucide-react-native";
import { useModeratorDashboard } from "../hooks";
import { useAppTheme, type AppThemeColors } from "@/features/theme";

export const ModeratorDashboardScreen = () => {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { profile } = useProfileStore();
  const { summary, isLoading, error, refresh } = useModeratorDashboard();

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Đang tải thông tin bảng điều khiển...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Lỗi: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Chào mừng trở lại,</Text>
          <Text style={styles.title}>Kiểm duyệt viên</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(moderator-tabs)/profile")}
          style={styles.avatarContainer}
          activeOpacity={0.7}
        >
          {profile?.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
          ) : (
            <Image
              source={{ uri: "https://i.pravatar.cc/100?img=12" }}
              style={styles.avatar}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatsCard
            title="Tài liệu chờ duyệt"
            value={summary?.pendingCount.toString() || "0"}
            progress={0.5}
            isDark={true}
            onPress={() =>
              router.push({
                pathname: "/(moderator-tabs)/review",
                params: { status: "PENDING" },
              })
            }
          />
          <StatsCard
            title="Tài liệu đã duyệt"
            value={summary?.activeCount.toString() || "0"}
            progress={0.8}
            color={colors.success}
            onPress={() =>
              router.push({
                pathname: "/(moderator-tabs)/review",
                params: { status: "ACTIVE" },
              })
            }
          />
          <StatsCard
            title="Tài liệu bị từ chối"
            value={summary?.rejectedCount.toString() || "0"}
            progress={0.2}
            color={colors.danger}
            onPress={() =>
              router.push({
                pathname: "/(moderator-tabs)/review",
                params: { status: "REJECTED" },
              })
            }
          />
        </View>

        {/* Recently Reviewed List */}
        <View style={styles.listSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tài liệu mới gửi lên</Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(moderator-tabs)/review",
                  params: { status: "PENDING" },
                })
              }
            >
              <Text style={styles.seeAll}>Xem hàng đợi</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reviewList}>
            {!summary || summary.recentDocuments.length === 0 ? (
              <View style={styles.emptyState}>
                <CheckCircle size={36} color={colors.success} />
                <Text style={styles.emptyText}>
                  Hộp thư sạch! Không có tài liệu nào chờ duyệt.
                </Text>
              </View>
            ) : (
              summary.recentDocuments.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.reviewItem}
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push({
                      pathname: "/(moderator-tabs)/review",
                      params: { selectedId: item.id, status: "PENDING" },
                    })
                  }
                >
                  <View style={[styles.iconBox, styles.pendingIcon]}>
                    <Clock size={18} color={colors.warning} />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.itemAuthor}>
                      {item.authorName} • {item.createdAtLabel}
                    </Text>
                  </View>
                  <ChevronRight size={18} color={colors.textSubtle} />
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: AppThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSubtle,
  },
  errorText: {
    fontSize: 15,
    color: colors.danger,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: colors.onPrimary,
    fontWeight: "bold",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  welcomeText: {
    fontSize: 14,
    color: colors.textSubtle,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  listSection: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  seeAll: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "bold",
  },
  reviewList: {
    marginTop: 8,
  },
  reviewItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  pendingIcon: {
    backgroundColor: colors.warningMuted,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  itemAuthor: {
    fontSize: 12,
    color: colors.textSubtle,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSubtle,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});

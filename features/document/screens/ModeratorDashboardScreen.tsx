import { COLORS, TYPOGRAPHY, SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProfileStore } from "@/features/profile/store/profileStore";
import { useRouter } from "expo-router";

export const ModeratorDashboardScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile } = useProfileStore();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: SPACING.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Chào mừng, Admin</Text>
            <Text style={styles.subtitle}>
              Dưới đây là trạng thái hiện tại của hệ thống.
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(moderator-tabs)/profile")}>
            {profile?.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={20} color={COLORS["on-surface-variant"]} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS["on-surface-variant"]}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm tài liệu, người dùng..."
            placeholderTextColor={COLORS["outline"]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TỔNG QUAN KIỂM DUYỆT</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewCard}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.primary }]}>
                <Ionicons name="document-text" size={24} color={COLORS["on-primary"]} />
              </View>
              <View style={styles.overviewTextContainer}>
                <Text style={styles.overviewValue}>1,240</Text>
                <Text style={styles.overviewLabel}>Tổng số{"\n"}tài liệu</Text>
              </View>
            </View>

            <View style={styles.overviewCard}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.tertiary }]}>
                <Ionicons name="time" size={24} color={COLORS["on-tertiary"]} />
              </View>
              <View style={styles.overviewTextContainer}>
                <Text style={styles.overviewValue}>12</Text>
                <Text style={styles.overviewLabel}>Chờ{"\n"}duyệt</Text>
              </View>
            </View>

            <View style={styles.overviewCard}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS["surface-container-high"] }]}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.overviewTextContainer}>
                <Text style={styles.overviewValue}>1,185</Text>
                <Text style={styles.overviewLabel}>Đã duyệt</Text>
              </View>
            </View>

            <View style={styles.overviewCard}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS["error-container"] }]}>
                <Ionicons name="close-circle" size={24} color={COLORS["on-error-container"]} />
              </View>
              <View style={styles.overviewTextContainer}>
                <Text style={styles.overviewValue}>43</Text>
                <Text style={styles.overviewLabel}>Từ chối</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HOẠT ĐỘNG GẦN ĐÂY</Text>
          <View style={styles.activitiesCard}>
            <View style={styles.activityItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.primary} />
              <View style={styles.activityTextContainer}>
                <Text style={styles.activityText}>
                  Tài liệu <Text style={styles.boldText}>"Quantum Computing..."</Text> đã được duyệt
                </Text>
                <Text style={styles.activityTime}>2 phút trước</Text>
              </View>
            </View>
            <View style={styles.divider} />

            <View style={styles.activityItem}>
              <Ionicons name="flag-outline" size={20} color={COLORS.error} />
              <View style={styles.activityTextContainer}>
                <Text style={styles.activityText}>
                  Cảnh báo mới trên <Text style={styles.boldText}>"CS101 Policy..."</Text>
                </Text>
                <Text style={styles.activityTime}>15 phút trước</Text>
              </View>
            </View>
            <View style={styles.divider} />

            <View style={styles.activityItem}>
              <Ionicons name="person-add-outline" size={20} color={COLORS["on-surface-variant"]} />
              <View style={styles.activityTextContainer}>
                <Text style={styles.activityText}>
                  Kiểm duyệt viên mới <Text style={styles.boldText}>Dr. Sarah Smith</Text> đã tham gia
                </Text>
                <Text style={styles.activityTime}>1 giờ trước</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>THAO TÁC NHANH</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="time-outline" size={18} color={COLORS["on-surface"]} />
              <Text style={styles.quickActionText}>Nhật ký hệ thống</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Ionicons name="people-outline" size={18} color={COLORS["on-surface"]} />
              <Text style={styles.quickActionText}>Quản lý người dùng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickActionButton, styles.quickActionSettings]}>
              <Ionicons name="settings-outline" size={18} color={COLORS["on-surface"]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>THỐNG KÊ NHANH</Text>
          <View style={styles.statsCard}>
            <Text style={styles.statsCardTitle}>TIẾN ĐỘ TUẦN NÀY</Text>
            <View style={styles.barChartContainer}>
              {/* Mock Bar Chart */}
              <View style={[styles.bar, { height: 40 }]} />
              <View style={[styles.bar, { height: 60 }]} />
              <View style={[styles.bar, { height: 35 }]} />
              <View style={[styles.bar, { height: 75 }]} />
              <View style={[styles.bar, { height: 55 }]} />
              <View style={[styles.bar, { height: 85 }]} />
              <View style={[styles.bar, { height: 20, backgroundColor: COLORS["outline-variant"] }]} />
            </View>
            <View style={styles.barChartLabels}>
              <Text style={styles.chartLabelText}>T2</Text>
              <Text style={styles.chartLabelText}>CN</Text>
            </View>
          </View>

          <View style={[styles.statsCard, { marginTop: SPACING.lg }]}>
            <Text style={styles.statsCardTitle}>TỶ LỆ CHÍNH XÁC</Text>
            <View style={styles.donutChartContainer}>
              <View style={styles.donutOuter}>
                <View style={styles.donutInner}>
                  <Text style={styles.donutText}>98%</Text>
                </View>
              </View>
            </View>
            <Text style={styles.statsDescription}>+2.4% so với tháng trước</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.gutter,
    paddingTop: SPACING.xl,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS["surface-container-high"],
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...TYPOGRAPHY["headline-md"],
    color: COLORS["on-surface"],
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface-variant"],
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS["surface-container-lowest"],
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    height: 48,
    marginBottom: SPACING.xl,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface"],
    height: "100%",
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface-variant"],
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
    textTransform: "uppercase",
  },
  overviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: SPACING.md,
  },
  overviewCard: {
    width: "47%",
    backgroundColor: COLORS["surface-container-lowest"],
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: 8,
    padding: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  overviewTextContainer: {
    flex: 1,
  },
  overviewValue: {
    ...TYPOGRAPHY["headline-md"],
    color: COLORS["on-surface"],
    fontSize: 20,
    marginBottom: 2,
  },
  overviewLabel: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },
  activitiesCard: {
    backgroundColor: COLORS["surface-container-lowest"],
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: 8,
    padding: SPACING.md,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: SPACING.sm,
  },
  activityTextContainer: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  activityText: {
    ...TYPOGRAPHY["body-md"],
    fontSize: 14,
    color: COLORS["on-surface"],
    lineHeight: 20,
  },
  boldText: {
    fontWeight: "600",
  },
  activityTime: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS["outline-variant"],
    opacity: 0.5,
    marginVertical: SPACING.sm,
  },
  quickActionsContainer: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS["surface-container-low"],
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: 8,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  quickActionSettings: {
    flex: 0,
    paddingHorizontal: SPACING.lg,
  },
  quickActionText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
  },
  statsCard: {
    backgroundColor: COLORS["surface-container-low"],
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: 8,
    padding: SPACING.lg,
  },
  statsCardTitle: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
    letterSpacing: 1.5,
    marginBottom: SPACING.lg,
  },
  barChartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 100,
    marginBottom: SPACING.sm,
  },
  bar: {
    width: "12%",
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  barChartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chartLabelText: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },
  donutChartContainer: {
    alignItems: "center",
    marginVertical: SPACING.md,
  },
  donutOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: COLORS.primary,
    borderTopColor: COLORS.primary,
    borderRightColor: COLORS.primary,
    borderBottomColor: COLORS.primary,
    borderLeftColor: COLORS["outline-variant"], // to simulate 98%
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "45deg" }], // Just to make the 2% gap at the top-left
  },
  donutInner: {
    transform: [{ rotate: "-45deg" }], // Correct text rotation
  },
  donutText: {
    ...TYPOGRAPHY["headline-md"],
    color: COLORS.primary,
  },
  statsDescription: {
    ...TYPOGRAPHY["body-md"],
    fontSize: 14,
    color: COLORS["on-surface-variant"],
    textAlign: "center",
  },
});

import { useRouter } from "expo-router";
import {
  BookMarked,
  BookOpen,
  ChevronRight,
  Clock,
  FileText,
  Plus,
  Upload,
} from "lucide-react-native";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ScreenSafeAreaView } from "@/components/screen-safe-area-view";
import { SCREEN_HEADER_TOP_PADDING } from "@/constants/safeArea";
import { MyDocumentItem } from "../components/MyDocumentItem";
import { useMyDocuments, useRecentDocuments } from "../hooks/useUserDocuments";
import { useAppTheme, type AppThemeColors } from "@/features/theme";

export const UserHomeScreen = () => {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const recent = useRecentDocuments(5);
  const mine = useMyDocuments();

  const handleDocumentPress = (id: string) => {
    router.push({ pathname: "/document/[id]" as any, params: { id } });
  };

  const isRefreshing = recent.isLoading || mine.isLoading;

  const handleRefresh = () => {
    recent.refresh();
    mine.refresh();
  };

  /* ────────── Quick Actions ────────── */
  const QUICK_ACTIONS = [
    {
      label: "Tải lên",
      icon: <Upload size={20} color={colors.primary} />,
      bg: colors.primaryMuted,
      onPress: () => router.push("/(student-tabs)/upload" as any),
    },
    {
      label: "Thư viện",
      icon: <BookMarked size={20} color={colors.secondary} />,
      bg: colors.surfaceSubtle,
      onPress: () => router.push("/(student-tabs)/library" as any),
    },
    {
      label: "Tài liệu",
      icon: <FileText size={20} color={colors.warning} />,
      bg: colors.warningMuted,
      onPress: () => router.push("/(student-tabs)/my-documents" as any),
    },
  ];

  /* ────────── Section Renderer ────────── */
  const renderDocumentSection = (
    title: string,
    icon: React.ReactNode,
    documents: typeof recent.documents,
    isLoading: boolean,
    error: string | null,
    onRetry: () => void,
    emptyText: string,
    onSeeAll?: () => void
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          {icon}
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {onSeeAll && documents.length > 0 && (
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={onSeeAll}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAllText}>Xem tất cả</Text>
            <ChevronRight size={14} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.stateBox}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.stateText}>Đang tải...</Text>
        </View>
      ) : error ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
            <Text style={styles.retryBtnText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : documents.length === 0 ? (
        <View style={styles.stateBox}>
          <Text style={styles.stateText}>{emptyText}</Text>
        </View>
      ) : (
        <View style={styles.documentList}>
          {documents.map((doc) => (
            <MyDocumentItem
              key={doc.id}
              document={doc}
              onPress={handleDocumentPress}
            />
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScreenSafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>ACADEMICSHARE</Text>
          <Text style={styles.pageTitle}>Trang chủ</Text>
          <Text style={styles.pageSubtitle}>
            Theo dõi tài liệu mới và truy cập nhanh thư viện cá nhân
          </Text>
        </View>

        {/* ── Quick Actions ── */}
        <View style={styles.quickActionsRow}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickActionCard}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.bg }]}>
                {action.icon}
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Recent Documents ── */}
        {renderDocumentSection(
          "Tài liệu gần đây",
          <Clock size={18} color={colors.primary} />,
          recent.documents,
          recent.isLoading,
          recent.error,
          recent.refresh,
          "Chưa có tài liệu gần đây.",
          () => router.push("/(student-tabs)/library" as any)
        )}

        {/* ── My Documents ── */}
        {renderDocumentSection(
          "Thư viện của tôi",
          <BookOpen size={18} color={colors.success} />,
          mine.documents.slice(0, 4),
          mine.isLoading,
          mine.error,
          mine.refresh,
          "Bạn chưa có tài liệu nào.",
          () => router.push("/(student-tabs)/my-documents" as any)
        )}
      </ScrollView>


    </ScreenSafeAreaView>
  );
};

const createStyles = (colors: AppThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  /* ── Header ── */
  header: {
    paddingHorizontal: 24,
    paddingTop: SCREEN_HEADER_TOP_PADDING,
    paddingBottom: 20,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: colors.textSubtle,
    lineHeight: 18,
    marginTop: 4,
  },

  /* ── Quick Actions ── */
  quickActionsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 6,
  },
  quickActionCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    gap: 8,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSubtle,
  },

  /* ── Sections ── */
  section: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },

  /* ── Document List ── */
  documentList: {
    gap: 10,
  },

  /* ── State Boxes ── */
  stateBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  stateText: {
    fontSize: 14,
    color: colors.textSubtle,
    textAlign: "center",
  },
  retryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 10,
  },
  retryBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },


});

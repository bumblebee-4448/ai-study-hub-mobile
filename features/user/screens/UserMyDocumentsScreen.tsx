import { useRouter } from "expo-router";
import {
  BookOpen,
  Download,
  Eye,
  FileText,
  Plus,
  Search,
  Trophy,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ScreenSafeAreaView } from "@/components/screen-safe-area-view";
import { SCREEN_HEADER_TOP_PADDING } from "@/constants/safeArea";
import { MyDocStatsCard } from "../components/MyDocStatsCard";
import type { MyDocStatsCardData } from "../components/MyDocStatsCard";
import { MyDocumentItem } from "../components/MyDocumentItem";
import { useMyDocuments } from "../hooks/useUserDocuments";
import { useAppTheme, type AppThemeColors } from "@/features/theme";
import type { BackendDocumentStatus, UserDocument } from "../types";

const FILTER_OPTIONS: { key: "ALL" | BackendDocumentStatus; label: string }[] = [
  { key: "ALL", label: "Tất cả" },
  { key: "ACTIVE", label: "Đã duyệt" },
  { key: "PENDING", label: "Chờ duyệt" },
  { key: "REJECTED", label: "Từ chối" },
];

export const UserMyDocumentsScreen = () => {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const mine = useMyDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "ALL" | BackendDocumentStatus
  >("ALL");

  /* ────────── Derived stats ────────── */
  const stats = useMemo((): MyDocStatsCardData[] => {
    const docs = mine.documents;
    const totalDocs = docs.length;
    const activeDocs = docs.filter((d) => d.status === "ACTIVE").length;

    return [
      {
        label: "Tổng tài liệu",
        value: totalDocs,
        icon: <FileText size={20} color={colors.primary} />,
        accentColor: colors.primary,
        accentBg: colors.primaryMuted,
      },
      {
        label: "Lượt xem",
        value: "—",
        icon: <Eye size={20} color={colors.secondary} />,
        accentColor: colors.secondary,
        accentBg: colors.surfaceSubtle,
      },
      {
        label: "Lượt tải",
        value: "—",
        icon: <Download size={20} color={colors.warning} />,
        accentColor: colors.warning,
        accentBg: colors.warningMuted,
      },
      {
        label: "Đóng góp",
        value: activeDocs,
        icon: <Trophy size={20} color={colors.success} />,
        accentColor: colors.success,
        accentBg: colors.successMuted,
      },
    ];
  }, [colors, mine.documents]);

  /* ────────── Filtered + searched documents ────────── */
  const filteredDocuments = useMemo(() => {
    let docs = mine.documents;

    // Filter by status
    if (activeFilter !== "ALL") {
      docs = docs.filter((d) => d.status === activeFilter);
    }

    // Search by title
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      docs = docs.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.subjectLabel.toLowerCase().includes(query)
      );
    }

    return docs;
  }, [mine.documents, activeFilter, searchQuery]);

  /* ────────── Handlers ────────── */
  const handleDocumentPress = (id: string) => {
    router.push({ pathname: "/document/[id]" as any, params: { id } });
  };

  const handleEdit = (id: string) => {
    router.push({ pathname: "/document/[id]/edit" as any, params: { id } });
  };

  const handleUpload = () => {
    router.push("/(student-tabs)/upload" as any);
  };

  /* ────────── List Header ────────── */
  const renderListHeader = () => (
    <View style={styles.listHeaderWrapper}>
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.eyebrow}>AcademicShare</Text>
          <Text style={styles.pageTitle}>Tài liệu của tôi</Text>
          <Text style={styles.pageSubtitle}>
            Quản lý và theo dõi tài liệu bạn đã đóng góp
          </Text>
        </View>
      </View>

      {/* Stats Grid - 2x2 */}
      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <MyDocStatsCard data={stats[0]} />
          <MyDocStatsCard data={stats[1]} />
        </View>
        <View style={styles.statsRow}>
          <MyDocStatsCard data={stats[2]} />
          <MyDocStatsCard data={stats[3]} />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={18} color={colors.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm tài liệu..."
          placeholderTextColor={colors.textSubtle}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTER_OPTIONS.map((filter) => {
          const isActive = activeFilter === filter.key;
          return (
            <TouchableOpacity
              key={filter.key}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => setActiveFilter(filter.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterTabText,
                  isActive && styles.filterTabTextActive,
                ]}
              >
                {filter.label}
              </Text>
              {isActive && filter.key !== "ALL" && (
                <View style={styles.filterCount}>
                  <Text style={styles.filterCountText}>
                    {mine.documents.filter((d) =>
                      filter.key === "ALL" ? true : d.status === filter.key
                    ).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Results count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredDocuments.length} tài liệu
        </Text>
      </View>
    </View>
  );

  /* ────────── Empty State ────────── */
  const renderEmptyState = () => {
    if (mine.isLoading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.emptyText}>Đang tải tài liệu...</Text>
        </View>
      );
    }

    if (mine.error) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.emptyTitle}>Không thể tải dữ liệu</Text>
          <Text style={styles.emptyText}>{mine.error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={mine.refresh}>
            <Text style={styles.retryBtnText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (searchQuery.trim() || activeFilter !== "ALL") {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
          <Text style={styles.emptyText}>
            Thử thay đổi từ khóa hoặc bộ lọc trạng thái
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIconContainer}>
          <BookOpen size={36} color={colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>Chưa có tài liệu</Text>
        <Text style={styles.emptyText}>
          Bắt đầu đóng góp tài liệu học tập đầu tiên của bạn
        </Text>
        <TouchableOpacity style={styles.emptyUploadBtn} onPress={handleUpload}>
          <Plus size={18} color={colors.onPrimary} />
          <Text style={styles.emptyUploadBtnText}>Tải lên tài liệu</Text>
        </TouchableOpacity>
      </View>
    );
  };

  /* ────────── Render ────────── */
  return (
    <ScreenSafeAreaView style={styles.container}>
      <FlatList
        data={filteredDocuments}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <MyDocumentItem
              document={item}
              onPress={handleDocumentPress}
              onEdit={handleEdit}
              onDelete={(id) => {
                // TODO: connect to actual delete API
              }}
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={mine.isLoading}
            onRefresh={mine.refresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </ScreenSafeAreaView>
  );
};

const createStyles = (colors: AppThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },

  /* ── List Header ── */
  listHeaderWrapper: {
    paddingBottom: 4,
  },

  /* ── Page Header ── */
  pageHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: SCREEN_HEADER_TOP_PADDING,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
    gap: 4,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: colors.textSubtle,
    lineHeight: 18,
    marginTop: 2,
  },


  /* ── Stats Grid ── */
  statsGrid: {
    gap: 10,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },

  /* ── Search ── */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 16,
    paddingHorizontal: 14,
    height: 44,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    height: 44,
  },

  /* ── Filters ── */
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginTop: 14,
    gap: 8,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSubtle,
  },
  filterTabTextActive: {
    color: colors.onPrimary,
  },
  filterCount: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  filterCountText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.onPrimary,
  },

  /* ── Results Header ── */
  resultsHeader: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSubtle,
  },

  /* ── Cards ── */
  cardWrapper: {
    paddingHorizontal: 24,
  },
  separator: {
    height: 10,
  },

  /* ── Empty State ── */
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSubtle,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyUploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyUploadBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.onPrimary,
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 10,
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
});

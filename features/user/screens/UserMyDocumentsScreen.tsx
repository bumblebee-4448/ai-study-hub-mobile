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
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { MyDocStatsCard } from "../components/MyDocStatsCard";
import type { MyDocStatsCardData } from "../components/MyDocStatsCard";
import { MyDocumentItem } from "../components/MyDocumentItem";
import { useMyDocuments } from "../hooks/useUserDocuments";
import type { BackendDocumentStatus, UserDocument } from "../types";

const FILTER_OPTIONS: { key: "ALL" | BackendDocumentStatus; label: string }[] = [
  { key: "ALL", label: "Tất cả" },
  { key: "ACTIVE", label: "Đã duyệt" },
  { key: "PENDING", label: "Chờ duyệt" },
  { key: "REJECTED", label: "Từ chối" },
];

export const UserMyDocumentsScreen = () => {
  const router = useRouter();
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
        icon: <FileText size={20} color="#6366f1" />,
        accentColor: "#6366f1",
        accentBg: "#eef2ff",
      },
      {
        label: "Lượt xem",
        value: "—",
        icon: <Eye size={20} color="#06b6d4" />,
        accentColor: "#06b6d4",
        accentBg: "#ecfeff",
      },
      {
        label: "Lượt tải",
        value: "—",
        icon: <Download size={20} color="#f59e0b" />,
        accentColor: "#f59e0b",
        accentBg: "#fffbeb",
      },
      {
        label: "Đóng góp",
        value: activeDocs,
        icon: <Trophy size={20} color="#10b981" />,
        accentColor: "#10b981",
        accentBg: "#ecfdf5",
      },
    ];
  }, [mine.documents]);

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
          <Text style={styles.eyebrow}>AcademiShare</Text>
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
        <Search size={18} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm tài liệu..."
          placeholderTextColor="#94a3b8"
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
          <ActivityIndicator size="large" color="#6366f1" />
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
          <BookOpen size={36} color="#6366f1" />
        </View>
        <Text style={styles.emptyTitle}>Chưa có tài liệu</Text>
        <Text style={styles.emptyText}>
          Bắt đầu đóng góp tài liệu học tập đầu tiên của bạn
        </Text>
        <TouchableOpacity style={styles.emptyUploadBtn} onPress={handleUpload}>
          <Plus size={18} color="#ffffff" />
          <Text style={styles.emptyUploadBtnText}>Tải lên tài liệu</Text>
        </TouchableOpacity>
      </View>
    );
  };

  /* ────────── Render ────────── */
  return (
    <SafeAreaView style={styles.container}>
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
            colors={["#6366f1"]}
            tintColor="#6366f1"
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
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
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  headerLeft: {
    flex: 1,
    gap: 4,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6366f1",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    lineHeight: 18,
    marginTop: 2,
  },


  /* ── Stats Grid ── */
  statsGrid: {
    gap: 10,
    paddingHorizontal: 20,
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
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 14,
    height: 44,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    gap: 10,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0f172a",
    height: 44,
  },

  /* ── Filters ── */
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
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
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterTabActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
  filterTabTextActive: {
    color: "#ffffff",
  },
  filterCount: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  filterCountText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },

  /* ── Results Header ── */
  resultsHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94a3b8",
  },

  /* ── Cards ── */
  cardWrapper: {
    paddingHorizontal: 20,
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
    backgroundColor: "#eef2ff",
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
    color: "#0f172a",
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
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
    backgroundColor: "#6366f1",
    borderRadius: 12,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyUploadBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
});

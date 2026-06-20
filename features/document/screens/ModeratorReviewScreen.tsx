import React, { useMemo, useState, useEffect } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronRight,
} from "lucide-react-native";
import { useLocalSearchParams } from "expo-router";
import { useModeratorDocuments } from "../hooks";
import { ModeratorDocumentDetailScreen } from "./ModeratorDocumentDetailScreen";
import { useAppTheme, type AppThemeColors } from "@/features/theme";
import type { ModeratorDocumentStatusFilter } from "../types";

const FILTERS = [
  { label: "Chờ duyệt", value: "PENDING" },
  { label: "Đã duyệt", value: "ACTIVE" },
  { label: "Từ chối", value: "REJECTED" },
] as const;

export const ModeratorReviewScreen = () => {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const params = useLocalSearchParams<{ status?: string; selectedId?: string }>();
  const initialStatus =
    params.status === "ACTIVE" ||
    params.status === "REJECTED" ||
    params.status === "PENDING"
      ? (params.status as ModeratorDocumentStatusFilter)
      : "PENDING";

  const {
    status,
    documents,
    isLoading,
    error,
    page,
    total,
    totalPages,
    refresh,
    loadMore,
    changeStatus,
  } = useModeratorDocuments(initialStatus);

  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  useEffect(() => {
    if (params.selectedId) {
      setSelectedDocId(params.selectedId);
    }
  }, [params.selectedId]);

  if (selectedDocId) {
    return (
      <ModeratorDocumentDetailScreen
        documentId={selectedDocId}
        onBack={() => {
          setSelectedDocId(null);
          // Refresh list when returning from detail
          refresh();
        }}
      />
    );
  }

  const getStatusIcon = (docStatus: string) => {
    switch (docStatus) {
      case "ACTIVE":
        return <CheckCircle2 size={16} color={colors.success} />;
      case "REJECTED":
        return <XCircle size={16} color={colors.danger} />;
      default:
        return <Clock size={16} color={colors.warning} />;
    }
  };

  const getStatusStyle = (docStatus: string) => {
    switch (docStatus) {
      case "ACTIVE":
        return styles.activeBadge;
      case "REJECTED":
        return styles.rejectedBadge;
      default:
        return styles.pendingBadge;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Hàng đợi kiểm duyệt</Text>
          <Text style={styles.headerSubtitle}>
            {total} tài liệu {status === "PENDING" ? "chờ xử lý" : status === "ACTIVE" ? "đã duyệt" : "đã từ chối"}
          </Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={22} color={colors.icon} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              onPress={() => changeStatus(f.value)}
              style={[
                styles.filterChip,
                status === f.value && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  status === f.value && styles.filterTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && page === 1}
            onRefresh={refresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Lỗi: {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refresh}>
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        )}

        {documents.length === 0 && !isLoading && (
          <View style={styles.emptyState}>
            <CheckCircle2 size={48} color={colors.success} />
            <Text style={styles.emptyText}>Danh sách trống</Text>
          </View>
        )}

        {documents.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => setSelectedDocId(doc.id)}
          >
            <View style={styles.cardTop}>
              <View style={styles.formatBadge}>
                <FileText size={14} color={colors.icon} />
                <Text style={styles.formatText}>
                  {doc.formatLabel} • {doc.sizeLabel}
                </Text>
              </View>
              <View style={[styles.statusBadge, getStatusStyle(doc.status)]}>
                {getStatusIcon(doc.status)}
                <Text style={styles.statusBadgeText}>{doc.statusLabel}</Text>
              </View>
            </View>

            <Text style={styles.docTitle} numberOfLines={2}>
              {doc.title}
            </Text>

            <View style={styles.cardFooter}>
              <View style={styles.authorRow}>
                <View style={styles.authorAvatarPlaceholder}>
                  <Text style={styles.avatarInitial}>
                    {doc.authorName ? doc.authorName[0].toUpperCase() : "U"}
                  </Text>
                </View>
                <Text style={styles.authorName}>{doc.authorName}</Text>
              </View>
              <View style={styles.uploadedAtRow}>
                <Clock size={12} color={colors.textSubtle} />
                <Text style={styles.uploadedAtText}>{doc.createdAtLabel}</Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{doc.subjectName}</Text>
              </View>
              <View style={styles.detailLink}>
                <Text style={styles.detailLinkText}>
                  {doc.status === "PENDING" ? "Kiểm tra" : "Xem chi tiết"}
                </Text>
                <ChevronRight size={16} color={colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {isLoading && page > 1 && (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={{ marginVertical: 16 }}
          />
        )}

        {page < totalPages && !isLoading && (
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={loadMore}
            activeOpacity={0.7}
          >
            <Text style={styles.loadMoreText}>Tải thêm tài liệu</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: AppThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSubtle,
    marginTop: 2,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  filterContainer: {
    paddingBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSubtle,
  },
  filterTextActive: {
    color: colors.onPrimary,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  formatBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  formatText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSubtle,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  authorAvatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.textSubtle,
  },
  authorName: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "500",
  },
  uploadedAtRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  uploadedAtText: {
    fontSize: 12,
    color: colors.textSubtle,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 6,
    maxWidth: "70%",
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSubtle,
  },
  detailLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  detailLinkText: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.primary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
  pendingBadge: {
    backgroundColor: colors.warningMuted,
  },
  activeBadge: {
    backgroundColor: colors.successMuted,
  },
  rejectedBadge: {
    backgroundColor: colors.dangerMuted,
  },
  loadMoreButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSubtle,
    fontWeight: "500",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: colors.danger,
    textAlign: "center",
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
});

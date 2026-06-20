import { useRouter } from "expo-router";
import {
  BookOpen,
  RefreshCw,
  Search,
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { MyDocumentItem } from "../components/MyDocumentItem";
import { useLibraryDocuments } from "../hooks/useUserDocuments";
import { fetchUserSubjects } from "../services/userSubjectService";
import { useAppTheme, type AppThemeColors } from "@/features/theme";
import type { BackendSubject, UserDocument } from "../types";

const subjectLabel = (subject?: BackendSubject) => {
  if (!subject) return "";
  return subject.code ? `${subject.name} (${subject.code})` : subject.name;
};

export const UserLibraryScreen = () => {
  const router = useRouter();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [subjects, setSubjects] = useState<BackendSubject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const library = useLibraryDocuments(selectedSubjectId);

  const loadSubjects = useCallback(async () => {
    setIsLoadingSubjects(true);
    setSubjectsError(null);
    try {
      const result = await fetchUserSubjects();
      setSubjects(result?.subjects || []);
    } catch {
      setSubjectsError("Không thể tải danh sách môn học.");
    } finally {
      setIsLoadingSubjects(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  /* ────────── Filtered documents ────────── */
  const filteredDocuments = useMemo(() => {
    const docs = library.documents || [];
    if (!searchQuery.trim()) return docs;
    const query = searchQuery.toLowerCase().trim();
    return docs.filter(
      (d) =>
        d?.title?.toLowerCase()?.includes(query) ||
        d?.subjectLabel?.toLowerCase()?.includes(query)
    );
  }, [library.documents, searchQuery]);

  const selectedSubject = useMemo(
    () => (subjects || []).find((s) => s && s.id === selectedSubjectId),
    [selectedSubjectId, subjects]
  );

  const handleDocumentPress = (id: string) => {
    router.push({ pathname: "/document/[id]" as any, params: { id } });
  };

  /* ────────── List Header ────────── */
  const renderListHeader = () => (
    <View style={styles.listHeaderWrapper}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>ACADEMICSHARE</Text>
        <Text style={styles.pageTitle}>Thư viện</Text>
        <Text style={styles.pageSubtitle}>
          Khám phá tài liệu đang có trên hệ thống
        </Text>
      </View>

      {/* Search */}
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

      {/* Subject Filters */}
      <View style={styles.filterSection}>
        {isLoadingSubjects ? (
          <View style={styles.filterLoadingRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.filterLoadingText}>Đang tải môn học...</Text>
          </View>
        ) : subjectsError ? (
          <View style={styles.filterErrorRow}>
            <Text style={styles.filterErrorText}>{subjectsError}</Text>
            <TouchableOpacity
              style={styles.filterRetryBtn}
              onPress={loadSubjects}
            >
              <RefreshCw size={14} color={colors.primary} />
              <Text style={styles.filterRetryText}>Tải lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                !selectedSubjectId && styles.filterTabActive,
              ]}
              onPress={() => setSelectedSubjectId("")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterTabText,
                  !selectedSubjectId && styles.filterTabTextActive,
                ]}
              >
                Tất cả
              </Text>
            </TouchableOpacity>

            {(subjects || []).map((subject) => {
              if (!subject || !subject.id) return null;
              const isActive = subject.id === selectedSubjectId;
              return (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.filterTab,
                    isActive && styles.filterTabActive,
                  ]}
                  onPress={() => setSelectedSubjectId(subject.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      isActive && styles.filterTabTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {subjectLabel(subject)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Results count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredDocuments.length} tài liệu
          {selectedSubject ? ` · ${selectedSubject.name}` : ""}
        </Text>
      </View>
    </View>
  );

  /* ────────── Empty State ────────── */
  const renderEmptyState = () => {
    if (library.isLoading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.emptyText}>Đang tải tài liệu...</Text>
        </View>
      );
    }

    if (library.error) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.emptyTitle}>Không thể tải dữ liệu</Text>
          <Text style={styles.emptyText}>{library.error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={library.refresh}>
            <Text style={styles.retryBtnText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (searchQuery.trim()) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
          <Text style={styles.emptyText}>
            Thử thay đổi từ khóa hoặc bộ lọc môn học
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIconContainer}>
          <BookOpen size={36} color={colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>
          {selectedSubject
            ? "Chưa có tài liệu cho môn học này"
            : "Thư viện hiện chưa có tài liệu"}
        </Text>
        <Text style={styles.emptyText}>
          Hãy đóng góp tài liệu đầu tiên cho thư viện
        </Text>
      </View>
    );
  };

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
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={library.isLoading}
            onRefresh={library.refresh}
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
  listHeaderWrapper: {
    paddingBottom: 4,
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
  filterSection: {
    paddingHorizontal: 24,
    marginTop: 14,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterTab: {
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
  filterLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  filterLoadingText: {
    fontSize: 13,
    color: colors.textSubtle,
  },
  filterErrorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  filterErrorText: {
    flex: 1,
    fontSize: 13,
    color: colors.danger,
  },
  filterRetryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
  },
  filterRetryText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
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
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSubtle,
    textAlign: "center",
    lineHeight: 20,
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

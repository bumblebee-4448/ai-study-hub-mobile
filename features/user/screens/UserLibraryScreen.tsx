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
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { MyDocumentItem } from "../components/MyDocumentItem";
import { useLibraryDocuments } from "../hooks/useUserDocuments";
import { fetchUserSubjects } from "../services/userSubjectService";
import type { BackendSubject, UserDocument } from "../types";

const subjectLabel = (subject: BackendSubject) =>
  subject.code ? `${subject.name} (${subject.code})` : subject.name;

export const UserLibraryScreen = () => {
  const router = useRouter();
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
      setSubjects(result.subjects);
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
    if (!searchQuery.trim()) return library.documents;
    const query = searchQuery.toLowerCase().trim();
    return library.documents.filter(
      (d) =>
        d.title.toLowerCase().includes(query) ||
        d.subjectLabel.toLowerCase().includes(query)
    );
  }, [library.documents, searchQuery]);

  const selectedSubject = useMemo(
    () => subjects.find((s) => s.id === selectedSubjectId),
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
        <Text style={styles.eyebrow}>ACADEMISHARE</Text>
        <Text style={styles.pageTitle}>Thư viện</Text>
        <Text style={styles.pageSubtitle}>
          Khám phá tài liệu đang có trên hệ thống
        </Text>
      </View>

      {/* Search */}
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

      {/* Subject Filters */}
      <View style={styles.filterSection}>
        {isLoadingSubjects ? (
          <View style={styles.filterLoadingRow}>
            <ActivityIndicator size="small" color="#6366f1" />
            <Text style={styles.filterLoadingText}>Đang tải môn học...</Text>
          </View>
        ) : subjectsError ? (
          <View style={styles.filterErrorRow}>
            <Text style={styles.filterErrorText}>{subjectsError}</Text>
            <TouchableOpacity
              style={styles.filterRetryBtn}
              onPress={loadSubjects}
            >
              <RefreshCw size={14} color="#6366f1" />
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

            {subjects.map((subject) => {
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
          <ActivityIndicator size="large" color="#6366f1" />
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
          <BookOpen size={36} color="#6366f1" />
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
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={library.isLoading}
            onRefresh={library.refresh}
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
  listHeaderWrapper: {
    paddingBottom: 4,
  },

  /* ── Header ── */
  header: {
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
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6366f1",
    letterSpacing: 0.5,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
    marginTop: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    lineHeight: 18,
    marginTop: 4,
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
  filterSection: {
    paddingHorizontal: 20,
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
  filterLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  filterLoadingText: {
    fontSize: 13,
    color: "#94a3b8",
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
    color: "#dc2626",
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
    color: "#6366f1",
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
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
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

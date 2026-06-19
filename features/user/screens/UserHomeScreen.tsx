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
import React from "react";
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

import { MyDocumentItem } from "../components/MyDocumentItem";
import { useMyDocuments, useRecentDocuments } from "../hooks/useUserDocuments";

export const UserHomeScreen = () => {
  const router = useRouter();
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
      icon: <Upload size={20} color="#6366f1" />,
      bg: "#eef2ff",
      onPress: () => router.push("/(student-tabs)/upload" as any),
    },
    {
      label: "Thư viện",
      icon: <BookMarked size={20} color="#06b6d4" />,
      bg: "#ecfeff",
      onPress: () => router.push("/(student-tabs)/library" as any),
    },
    {
      label: "Tài liệu",
      icon: <FileText size={20} color="#f59e0b" />,
      bg: "#fffbeb",
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
            <ChevronRight size={14} color="#6366f1" />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.stateBox}>
          <ActivityIndicator size="small" color="#6366f1" />
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#6366f1"]}
            tintColor="#6366f1"
          />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>ACADEMISHARE</Text>
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
          <Clock size={18} color="#6366f1" />,
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
          <BookOpen size={18} color="#10b981" />,
          mine.documents.slice(0, 4),
          mine.isLoading,
          mine.error,
          mine.refresh,
          "Bạn chưa có tài liệu nào.",
          () => router.push("/(student-tabs)/my-documents" as any)
        )}
      </ScrollView>

      {/* ── Floating Upload Button ── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(student-tabs)/upload" as any)}
        activeOpacity={0.8}
      >
        <Plus size={22} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingBottom: 100,
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

  /* ── Quick Actions ── */
  quickActionsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 6,
  },
  quickActionCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
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
    color: "#64748b",
  },

  /* ── Sections ── */
  section: {
    paddingHorizontal: 20,
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
    color: "#0f172a",
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6366f1",
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
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    gap: 10,
  },
  stateText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },
  retryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
  },
  retryBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
  },

  /* ── FAB ── */
  fab: {
    position: "absolute",
    right: 20,
    bottom: 90,
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

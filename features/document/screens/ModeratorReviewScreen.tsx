import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";

// ── Dummy Data ──────────────────────────────────────────────────────────────

interface ReviewDocument {
  id: string;
  title: string;
  author: string;
  uploadedAt: string;
  format: string;
  size: string;
  description?: string;
  isUrgent?: boolean;
}

const REVIEW_DOCUMENTS: ReviewDocument[] = [
  {
    id: "doc-1",
    title: "Advanced Algorithms for Quantum Computing Applications in Cryptography",
    author: "Dr. Elena Rostova",
    uploadedAt: "2h ago",
    format: "PDF",
    size: "2.4MB",
    description: "This paper explores the theoretical limits of current post-quantum cryptographic methods against Shor's algorithm variants...",
  },
  {
    id: "doc-2",
    title: "Introduction to Machine Learning: Neural Networks and Deep Learning Fundamentals",
    author: "Prof. Alan Turing",
    uploadedAt: "4h ago",
    format: "DOCX",
    size: "1.1MB",
    description: "A comprehensive guide for beginners outlining the basic architecture of perceptrons and backpropagation algorithms...",
  },
  {
    id: "doc-3",
    title: "Report on Academic Integrity Policy Violations Q3",
    author: "Admin",
    uploadedAt: "5h ago",
    format: "PDF",
    size: "500KB",
    isUrgent: true,
  },
];

const FILTERS = ["Pending Review", "High Urgency", "Computer Science", "Mathematics"];

// ── Components ───────────────────────────────────────────────────────────────

export const ModeratorReviewScreen = () => {
  const [activeFilter, setActiveFilter] = useState("Pending Review");

  const renderDocumentCard = (doc: ReviewDocument) => (
    <View key={doc.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          {doc.isUrgent && (
            <MaterialCommunityIcons
              name="alert"
              size={20}
              color={COLORS.error}
              style={{ marginRight: 6 }}
            />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.docTitle} numberOfLines={2}>
              {doc.title}
            </Text>
            <Text style={styles.docMeta}>
              by {doc.author} • Uploaded {doc.uploadedAt}
            </Text>
          </View>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {doc.format} • {doc.size}
          </Text>
        </View>
      </View>

      {doc.description && (
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText} numberOfLines={2}>
            {doc.description}
          </Text>
        </View>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.btnReject} activeOpacity={0.75}>
          <MaterialCommunityIcons name="close-circle-outline" size={18} color={COLORS.error} />
          <Text style={styles.btnRejectText}>Reject</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.btnDetail} activeOpacity={0.75}>
          <Ionicons name="eye-outline" size={18} color={COLORS["on-primary"]} />
          <Text style={styles.btnDetailText}>See Detail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AcademiShare</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialCommunityIcons name="filter-variant" size={24} color={COLORS["on-surface-variant"]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={24} color={COLORS["on-surface-variant"]} />
          </TouchableOpacity>
          <Image
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOdq3b_ELYMC3GxquZ7RauzvzJ1pHpMfQQrorUfffyd_17r085qf5-VDo_tbKXmF7wHmykjJTozbpZ1TVNWoFmCwhZDY1dnPGSwk2XO-8bo-kYFGg-_BZqDhSl37KgNuJRR8jaqk4y-7pWYY09g8q--SUumhwSPTxLbMb5m84GyF68wDcKUE1AsUixdGwr9QeL4zaC2sAvFTWbPk0oMt2v9Rd-qCdCDR0sJUgAjYmwtjT5NJnGazypV9ma9i_j8OnIIMkdTuQ34E0" }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <View style={styles.mainContainer}>
        {/* Filter Tabs */}
        <View style={styles.filterWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {FILTERS.map((filter) => {
              const isActive = filter === activeFilter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setActiveFilter(filter)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Document List */}
        <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
          {REVIEW_DOCUMENTS.map(renderDocumentCard)}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING["margin-mobile"],
    borderBottomWidth: 1,
    borderBottomColor: COLORS["outline-variant"],
    backgroundColor: COLORS["surface-container-lowest"],
  },
  headerTitle: {
    ...TYPOGRAPHY["headline-md"],
    color: COLORS.primary,
    fontWeight: "700",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconBtn: {
    padding: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
  },
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  filterWrapper: {
    paddingVertical: SPACING.md,
  },
  filterScroll: {
    paddingHorizontal: SPACING["margin-mobile"],
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    backgroundColor: COLORS.surface,
  },
  filterChipActive: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS["primary-container"],
  },
  filterText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface-variant"],
  },
  filterTextActive: {
    color: COLORS["on-primary-container"],
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SPACING["margin-mobile"],
    gap: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS["surface-container-lowest"],
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  docTitle: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
    marginBottom: 4,
  },
  docMeta: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },
  badge: {
    backgroundColor: COLORS["surface-container-high"],
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeText: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },
  descriptionBox: {
    backgroundColor: COLORS["surface-container-low"],
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
  },
  descriptionText: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface-variant"],
    fontSize: 14,
  },
  actionRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: 8,
  },
  btnReject: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.sm,
  },
  btnRejectText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS.error,
  },
  btnDetail: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.sm,
  },
  btnDetailText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-primary"],
  },
});

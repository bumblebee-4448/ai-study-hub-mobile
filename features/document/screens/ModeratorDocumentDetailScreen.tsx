import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";

// ── Types ────────────────────────────────────────────────────────────────────

export interface ReviewDocumentDetail {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  uploadedAt: string;
  format: string;
  size: string;
  description?: string;
  isUrgent?: boolean;
  category?: string;
  year?: string;
  pageCount?: number;
  aiTrustScore?: number; // 0-100
}

interface Props {
  document: ReviewDocumentDetail;
  onBack: () => void;
  onApprove: (doc: ReviewDocumentDetail) => void;
  onReject: (doc: ReviewDocumentDetail, reason: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const ModeratorDocumentDetailScreen: React.FC<Props> = ({
  document: doc,
  onBack,
  onApprove,
  onReject,
}) => {
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = () => {
    Alert.alert(
      "Duyệt tài liệu",
      `Bạn có chắc chắn muốn duyệt tài liệu "${doc.title}"?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Duyệt",
          onPress: () => {
            onApprove(doc);
            onBack();
          },
        },
      ]
    );
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      Alert.alert("Bắt buộc", "Vui lòng cung cấp lý do từ chối.");
      return;
    }
    onReject(doc, rejectReason.trim());
    setRejectModalVisible(false);
    setRejectReason("");
    onBack();
  };

  const trustColor =
    (doc.aiTrustScore ?? 0) >= 80
      ? "#16a34a"
      : (doc.aiTrustScore ?? 0) >= 50
      ? "#d97706"
      : COLORS.error;

  const trustLabel =
    (doc.aiTrustScore ?? 0) >= 80
      ? "Cao"
      : (doc.aiTrustScore ?? 0) >= 50
      ? "Trung bình"
      : "Thấp";

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={26} color={COLORS["on-surface"]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết tài liệu</Text>
        {doc.isUrgent ? (
          <View style={styles.urgentBadge}>
            <MaterialCommunityIcons name="alert" size={16} color={COLORS.error} />
          </View>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── Document Preview ─────────────────────────────────────────── */}
        <View style={styles.previewBox}>
          <View style={styles.previewInner}>
            <MaterialCommunityIcons
              name={doc.format === "PDF" ? "file-pdf-box" : doc.format === "DOCX" ? "file-word-box" : "file-document"}
              size={64}
              color={COLORS.primary}
            />
            <Text style={styles.previewMeta}>
              Tài liệu {doc.format} • {doc.size}
            </Text>
            <TouchableOpacity style={styles.viewAllBtn} activeOpacity={0.85}>
              <Ionicons name="search-outline" size={16} color={COLORS["on-primary"]} />
              <Text style={styles.viewAllText}>Xem toàn bộ tài liệu</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Category Tags ────────────────────────────────────────────── */}
        {(doc.category || doc.year) && (
          <View style={styles.tagRow}>
            {doc.category && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{doc.category.toUpperCase()}</Text>
              </View>
            )}
            {doc.year && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{doc.year.toUpperCase()}</Text>
              </View>
            )}
          </View>
        )}

        {/* ── Title ────────────────────────────────────────────────────── */}
        <Text style={styles.docTitle}>{doc.title}</Text>

        {/* ── Meta Grid ────────────────────────────────────────────────── */}
        <View style={styles.metaGrid}>
          {/* Uploader */}
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>TẢI LÊN BỞI</Text>
            <View style={styles.metaAuthorRow}>
              {doc.authorAvatar ? (
                <Image source={{ uri: doc.authorAvatar }} style={styles.metaAvatar} />
              ) : (
                <View style={[styles.metaAvatar, styles.metaAvatarPlaceholder]}>
                  <Text style={styles.metaAvatarText}>{doc.author[0]}</Text>
                </View>
              )}
              <Text style={styles.metaValue}>{doc.author}</Text>
            </View>
          </View>

          {/* Upload date */}
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>NGÀY TẢI LÊN</Text>
            <Text style={styles.metaValue}>{doc.uploadedAt}</Text>
          </View>

          {/* Page count */}
          {doc.pageCount != null && (
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>SỐ TRANG</Text>
              <Text style={styles.metaValue}>{doc.pageCount} trang</Text>
            </View>
          )}

          {/* AI Trust Score */}
          {doc.aiTrustScore != null && (
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>ĐỘ TIN CẬY AI</Text>
              <View style={styles.metaTrustRow}>
                <View style={[styles.trustDot, { backgroundColor: trustColor }]} />
                <Text style={[styles.metaValue, { color: trustColor }]}>
                  {trustLabel} ({doc.aiTrustScore}%)
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ── Description ──────────────────────────────────────────────── */}
        {doc.description && (
          <View style={styles.descSection}>
            <Text style={styles.descLabel}>MÔ TẢ CHI TIẾT</Text>
            <Text style={styles.descText}>{doc.description}</Text>
          </View>
        )}

        {/* Bottom spacer for fixed buttons */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Fixed Action Buttons ─────────────────────────────────────── */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.btnReject}
          activeOpacity={0.8}
          onPress={() => setRejectModalVisible(true)}
        >
          <MaterialCommunityIcons name="close-circle-outline" size={18} color={COLORS.error} />
          <Text style={styles.btnRejectText}>Từ chối</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnApprove}
          activeOpacity={0.8}
          onPress={handleApprove}
        >
          <MaterialCommunityIcons name="check-circle-outline" size={18} color={COLORS["on-primary"]} />
          <Text style={styles.btnApproveText}>Duyệt</Text>
        </TouchableOpacity>
      </View>

      {/* ── Reject Reason Modal ──────────────────────────────────────── */}
      <Modal
        visible={rejectModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRejectModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Từ chối tài liệu</Text>
              <TouchableOpacity onPress={() => setRejectModalVisible(false)}>
                <Ionicons name="close" size={22} color={COLORS["on-surface-variant"]} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Vui lòng cung cấp lý do để tác giả có thể chỉnh sửa và nộp lại.
            </Text>

            <TextInput
              style={styles.reasonInput}
              placeholder="VD: Thiếu trích dẫn, nội dung vi phạm chính sách..."
              placeholderTextColor={COLORS.outline}
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setRejectModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalRejectBtn} onPress={handleRejectSubmit}>
                <Text style={styles.modalRejectText}>Xác nhận từ chối</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  // Header
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING["margin-mobile"],
    borderBottomWidth: 1,
    borderBottomColor: COLORS["outline-variant"],
    backgroundColor: COLORS["surface-container-lowest"],
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
    fontSize: 16,
    fontWeight: "700",
  },
  urgentBadge: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING["margin-mobile"],
    paddingTop: SPACING.xl,
    gap: SPACING.lg,
  },
  // Preview box
  previewBox: {
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS["surface-container-low"],
    overflow: "hidden",
  },
  previewInner: {
    paddingVertical: 40,
    alignItems: "center",
    gap: SPACING.md,
  },
  previewMeta: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.base,
  },
  viewAllText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-primary"],
  },
  // Tags
  tagRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: COLORS["surface-container-high"],
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  tagText: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  // Title
  docTitle: {
    ...TYPOGRAPHY["headline-md"],
    color: COLORS["on-surface"],
    fontWeight: "700",
    lineHeight: 32,
  },
  // Meta grid
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.base,
  },
  metaCard: {
    flex: 1,
    minWidth: "45%",
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    gap: 6,
    backgroundColor: COLORS["surface-container-lowest"],
  },
  metaLabel: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
    fontWeight: "700",
    letterSpacing: 0.6,
    fontSize: 10,
  },
  metaValue: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
  },
  metaAuthorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  metaAvatarPlaceholder: {
    backgroundColor: COLORS["primary-fixed"],
    alignItems: "center",
    justifyContent: "center",
  },
  metaAvatarText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  metaTrustRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  trustDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Description
  descSection: {
    gap: SPACING.base,
  },
  descLabel: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
    fontWeight: "700",
    letterSpacing: 0.6,
    fontSize: 10,
  },
  descText: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface-variant"],
    lineHeight: 24,
  },
  // Action bar
  actionBar: {
    flexDirection: "row",
    gap: SPACING.md,
    paddingHorizontal: SPACING["margin-mobile"],
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS["outline-variant"],
    backgroundColor: COLORS["surface-container-lowest"],
  },
  btnReject: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: COLORS.error,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.sm,
  },
  btnRejectText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS.error,
  },
  btnApprove: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.sm,
  },
  btnApproveText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-primary"],
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
  },
  modalCard: {
    width: "100%",
    backgroundColor: COLORS["surface-container-lowest"],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xl,
    gap: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
    fontSize: 16,
    fontWeight: "700",
  },
  modalSubtitle: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface-variant"],
    fontSize: 14,
    lineHeight: 20,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface"],
    minHeight: 100,
  },
  modalActions: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: BORDER_RADIUS.sm,
  },
  modalCancelText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface-variant"],
  },
  modalRejectBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.sm,
  },
  modalRejectText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-error"],
  },
});

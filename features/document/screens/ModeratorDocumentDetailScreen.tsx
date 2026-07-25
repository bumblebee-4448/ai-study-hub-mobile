import React, { useMemo, useState } from "react";
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
  ActivityIndicator,
  Linking,
} from "react-native";
import {
  ChevronLeft,
  FileText,
  Calendar,
  Layers,
  CheckCircle,
  XCircle,
  Search,
  X,
  Sparkles,
  AlertTriangle,
} from "lucide-react-native";
import { useModeratorDocumentDetail } from "../hooks";
import type { DocumentWarningFlag } from "../types";
import { useAppTheme, type AppThemeColors } from "@/features/theme";

const AI_FLAG_LABELS: Record<DocumentWarningFlag, string> = {
  SPAM: "Spam/quảng cáo",
  TOXIC: "Nội dung độc hại",
  ACADEMIC_INTEGRITY_RISK: "Rủi ro liêm chính học thuật",
};

interface Props {
  documentId: string;
  onBack: () => void;
}

export const ModeratorDocumentDetailScreen: React.FC<Props> = ({
  documentId,
  onBack,
}) => {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {
    document: doc,
    isLoading,
    isSubmitting,
    error,
    refresh,
    approve,
    reject,
    analysis,
    analyze,
    isAnalyzing,
    analyzeError,
  } = useModeratorDocumentDetail(documentId);

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = () => {
    if (!doc) return;
    Alert.alert(
      "Xác nhận duyệt",
      `Tài liệu "${doc.title}" sẽ được xuất bản lên hệ thống.`,
      [
        { text: "Để sau", style: "cancel" },
        {
          text: "Duyệt ngay",
          onPress: async () => {
            try {
              await approve();
              Alert.alert("Thành công", "Đã duyệt tài liệu thành công.");
              onBack();
            } catch (err) {
              // Error is already handled by hook and set to state, but we show alert
              Alert.alert("Lỗi", err instanceof Error ? err.message : "Đã xảy ra lỗi.");
            }
          },
        },
      ]
    );
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập lý do từ chối.");
      return;
    }
    try {
      await reject(rejectReason.trim());
      setRejectModalVisible(false);
      setRejectReason("");
      Alert.alert("Thành công", "Tài liệu đã bị từ chối.");
      onBack();
    } catch (err) {
      Alert.alert("Lỗi", err instanceof Error ? err.message : "Đã xảy ra lỗi.");
    }
  };

  const handleAnalyze = async () => {
    try {
      await analyze();
    } catch {
      // The hook exposes a localized error inside the AI card.
    }
  };

  const handleViewFile = async () => {
    if (doc?.fileUrl) {
      try {
        const supported = await Linking.canOpenURL(doc.fileUrl);
        if (supported) {
          await Linking.openURL(doc.fileUrl);
        } else {
          Alert.alert("Lỗi", "Không thể mở liên kết tài liệu này.");
        }
      } catch (err) {
        Alert.alert("Lỗi", "Đã xảy ra lỗi khi mở tài liệu.");
      }
    } else {
      Alert.alert("Thông báo", "Tài liệu này không có liên kết tập tin.");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Đang tải chi tiết tài liệu...</Text>
      </SafeAreaView>
    );
  }

  if (error && !doc) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Lỗi: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backLink} onPress={onBack}>
          <Text style={styles.backLinkText}>Quay lại danh sách</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!doc) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Không tìm thấy tài liệu.</Text>
        <TouchableOpacity style={styles.backLink} onPress={onBack}>
          <Text style={styles.backLinkText}>Quay lại danh sách</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kiểm tra nội dung</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Document Preview */}
        <View style={styles.previewContainer}>
          <View style={styles.previewCard}>
            <FileText size={64} color={colors.primary} strokeWidth={1.5} />
            <Text style={styles.formatText}>
              {doc.formatLabel} • {doc.sizeLabel}
            </Text>
            {doc.fileUrl && (
              <TouchableOpacity
                style={styles.previewButton}
                onPress={handleViewFile}
              >
                <Search size={18} color={colors.onPrimary} />
                <Text style={styles.previewButtonText}>Xem chi tiết file</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.tagRow}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{doc.subjectName}</Text>
            </View>
            <View
              style={[
                styles.statusTag,
                doc.status === "ACTIVE"
                  ? styles.activeTag
                  : doc.status === "REJECTED"
                  ? styles.rejectedTag
                  : styles.pendingTag,
              ]}
            >
              <Text style={styles.statusTagText}>{doc.statusLabel}</Text>
            </View>
          </View>

          <Text style={styles.docTitle}>{doc.title}</Text>

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>NGƯỜI TẢI LÊN</Text>
              <View style={styles.metaValueRow}>
                <View style={styles.avatarMini}>
                  <Text style={styles.avatarText}>
                    {doc.authorName ? doc.authorName[0].toUpperCase() : "U"}
                  </Text>
                </View>
                <Text style={styles.metaValueText} numberOfLines={1}>
                  {doc.authorName}
                </Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>NGÀY TẢI</Text>
              <View style={styles.metaValueRow}>
                <Calendar size={14} color={colors.icon} />
                <Text style={styles.metaValueText}>{doc.createdAtLabel}</Text>
              </View>
            </View>
          </View>

          {doc.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>MÔ TẢ NỘI DUNG</Text>
              <Text style={styles.descriptionText}>{doc.description}</Text>
            </View>
          ) : null}

          {doc.canReview ? (
            <View style={styles.aiCard}>
              <View style={styles.aiHeader}>
                <View style={styles.aiHeaderTitleRow}>
                  <View style={styles.aiIconContainer}>
                    <Sparkles size={18} color={colors.primary} />
                  </View>
                  <View style={styles.aiHeaderTextBlock}>
                    <Text style={styles.aiTitle}>AI Moderator</Text>
                    <Text style={styles.aiSubtitle}>
                      Phân tích nội dung trước khi duyệt
                    </Text>
                  </View>
                </View>
                {analysis ? (
                  <Text style={styles.aiCompletedLabel}>Đã phân tích</Text>
                ) : null}
              </View>

              {!analysis && !isAnalyzing ? (
                <TouchableOpacity
                  style={styles.aiAnalyzeButton}
                  onPress={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  <Sparkles size={17} color={colors.onPrimary} />
                  <Text style={styles.aiAnalyzeButtonText}>Phân tích bằng AI</Text>
                </TouchableOpacity>
              ) : null}

              {isAnalyzing ? (
                <View style={styles.aiLoadingRow}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.aiLoadingText}>AI đang phân tích tài liệu...</Text>
                </View>
              ) : null}

              {analyzeError ? (
                <View style={styles.aiErrorBox}>
                  <AlertTriangle size={17} color={colors.danger} />
                  <View style={styles.aiErrorContent}>
                    <Text style={styles.aiErrorText}>{analyzeError}</Text>
                    <TouchableOpacity onPress={handleAnalyze}>
                      <Text style={styles.aiRetryText}>Thử lại</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}

              {analysis ? (
                <View style={styles.aiResultContainer}>
                  <View
                    style={[
                      styles.aiRecommendation,
                      analysis.moderationSuggestion === "REJECT"
                        ? styles.aiRecommendationReject
                        : styles.aiRecommendationApprove,
                    ]}
                  >
                    <Text style={styles.aiRecommendationLabel}>ĐỀ XUẤT CỦA AI</Text>
                    <Text style={styles.aiRecommendationText}>
                      {analysis.moderationSuggestion === "REJECT"
                        ? "Nên từ chối"
                        : "Nên duyệt"}
                    </Text>
                  </View>

                  <View style={styles.aiResultSection}>
                    <Text style={styles.aiSectionLabel}>TÓM TẮT NỘI DUNG</Text>
                    <Text style={styles.aiBodyText}>{analysis.summary}</Text>
                  </View>

                  <View style={styles.aiResultSection}>
                    <Text style={styles.aiSectionLabel}>CỜ CẢNH BÁO</Text>
                    {analysis.flags.length > 0 ? (
                      <View style={styles.aiFlagsRow}>
                        {analysis.flags.map((flag) => (
                          <View key={flag} style={styles.aiFlagChip}>
                            <AlertTriangle size={13} color={colors.warningText} />
                            <Text style={styles.aiFlagText}>{AI_FLAG_LABELS[flag]}</Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.aiBodyText}>Không phát hiện cờ cảnh báo.</Text>
                    )}
                  </View>

                  <View style={styles.aiResultSection}>
                    <Text style={styles.aiSectionLabel}>LÝ DO ĐỀ XUẤT</Text>
                    <Text style={styles.aiBodyText}>{analysis.moderationReason}</Text>
                  </View>
                </View>
              ) : null}
            </View>
          ) : null}

          {doc.status === "REJECTED" && doc.rejectionReason ? (
            <View style={styles.rejectionReasonContainer}>
              <Text style={styles.rejectionReasonLabel}>LÝ DO TỪ CHỐI</Text>
              <Text style={styles.rejectionReasonText}>{doc.rejectionReason}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Action Bar */}
      {doc.canReview && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => setRejectModalVisible(true)}
            disabled={isSubmitting}
          >
            <XCircle size={20} color={colors.icon} />
            <Text style={styles.rejectButtonText}>Từ chối</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={handleApprove}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <>
                <CheckCircle size={20} color={colors.onPrimary} />
                <Text style={styles.approveButtonText}>Duyệt bài</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Reject Modal */}
      <Modal visible={rejectModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lý do từ chối</Text>
              <TouchableOpacity onPress={() => setRejectModalVisible(false)}>
                <X size={20} color={colors.icon} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.reasonInput}
              placeholder="Nhập lý do chi tiết..."
              multiline
              value={rejectReason}
              onChangeText={setRejectReason}
              placeholderTextColor={colors.textSubtle}
            />
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setRejectModalVisible(false)}
                disabled={isSubmitting}
              >
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleRejectSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={colors.onPrimary} />
                ) : (
                  <Text style={styles.modalConfirmText}>Xác nhận</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (colors: AppThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSubtle,
  },
  errorText: {
    fontSize: 15,
    color: colors.danger,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryText: {
    color: colors.onPrimary,
    fontWeight: "bold",
  },
  backLink: {
    paddingVertical: 8,
  },
  backLinkText: {
    color: colors.textSubtle,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  previewContainer: {
    marginBottom: 32,
  },
  previewCard: {
    height: 240,
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  formatText: {
    fontSize: 14,
    color: colors.textSubtle,
    fontWeight: "500",
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  previewButtonText: {
    color: colors.onPrimary,
    fontWeight: "bold",
    fontSize: 14,
  },
  infoSection: {
    gap: 16,
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primaryMuted,
    borderRadius: 8,
  },
  categoryTagText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
  },
  pendingTag: {
    backgroundColor: colors.warningMuted,
  },
  activeTag: {
    backgroundColor: colors.successMuted,
  },
  rejectedTag: {
    backgroundColor: colors.dangerMuted,
  },
  docTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    lineHeight: 32,
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  metaItem: {
    width: "48%",
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.textSubtle,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  metaValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarMini: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surfaceSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.text,
  },
  metaValueText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "500",
    maxWidth: "80%",
  },
  descriptionContainer: {
    marginTop: 8,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  descriptionLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.textSubtle,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 24,
  },
  aiCard: {
    marginTop: 8,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    backgroundColor: colors.surface,
    gap: 16,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  aiHeaderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  aiIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryMuted,
  },
  aiHeaderTextBlock: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  aiSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: colors.textSubtle,
  },
  aiCompletedLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.successText,
  },
  aiAnalyzeButton: {
    minHeight: 46,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
  },
  aiAnalyzeButtonText: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: "800",
  },
  aiLoadingRow: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  aiLoadingText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  aiErrorBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.dangerMuted,
  },
  aiErrorContent: {
    flex: 1,
    gap: 6,
  },
  aiErrorText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.dangerText,
  },
  aiRetryText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.danger,
  },
  aiResultContainer: {
    gap: 16,
  },
  aiRecommendation: {
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
  },
  aiRecommendationApprove: {
    backgroundColor: colors.successMuted,
    borderLeftColor: colors.success,
  },
  aiRecommendationReject: {
    backgroundColor: colors.dangerMuted,
    borderLeftColor: colors.danger,
  },
  aiRecommendationLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: colors.textSubtle,
  },
  aiRecommendationText: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  aiResultSection: {
    gap: 8,
  },
  aiSectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: colors.textSubtle,
  },
  aiBodyText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textMuted,
  },
  aiFlagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  aiFlagChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.warningMuted,
  },
  aiFlagText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.warningText,
  },
  rejectionReasonContainer: {
    marginTop: 8,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.dangerMuted,
  },
  rejectionReasonLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.danger,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  rejectionReasonText: {
    fontSize: 15,
    color: colors.dangerText,
    lineHeight: 24,
    backgroundColor: colors.dangerMuted,
    padding: 12,
    borderRadius: 8,
  },
  actionBar: {
    flexDirection: "row",
    padding: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  rejectButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rejectButtonText: {
    fontWeight: "bold",
    color: colors.textSubtle,
  },
  approveButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  approveButtonText: {
    fontWeight: "bold",
    color: colors.onPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  reasonInput: {
    height: 120,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    padding: 16,
    textAlignVertical: "top",
    color: colors.text,
    marginBottom: 24,
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  modalCancelText: {
    fontWeight: 'bold',
    color: colors.textSubtle,
  },
  modalConfirmButton: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.danger,
  },
  modalConfirmText: {
    fontWeight: 'bold',
    color: colors.onPrimary,
  }
});

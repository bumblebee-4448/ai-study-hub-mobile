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
} from "lucide-react-native";
import { useModeratorDocumentDetail } from "../hooks";

interface Props {
  documentId: string;
  onBack: () => void;
}

export const ModeratorDocumentDetailScreen: React.FC<Props> = ({
  documentId,
  onBack,
}) => {
  const {
    document: doc,
    isLoading,
    isSubmitting,
    error,
    refresh,
    approve,
    reject,
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
        <ActivityIndicator size="large" color="#3b82f6" />
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
          <ChevronLeft size={24} color="#0f172a" />
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
            <FileText size={64} color="#3b82f6" strokeWidth={1.5} />
            <Text style={styles.formatText}>
              {doc.formatLabel} • {doc.sizeLabel}
            </Text>
            {doc.fileUrl && (
              <TouchableOpacity
                style={styles.previewButton}
                onPress={handleViewFile}
              >
                <Search size={18} color="#fff" />
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
                <Calendar size={14} color="#64748b" />
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
            <XCircle size={20} color="#64748b" />
            <Text style={styles.rejectButtonText}>Từ chối</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={handleApprove}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <CheckCircle size={20} color="#fff" />
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
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.reasonInput}
              placeholder="Nhập lý do chi tiết..."
              multiline
              value={rejectReason}
              onChangeText={setRejectReason}
              placeholderTextColor="#94a3b8"
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
                  <ActivityIndicator size="small" color="#fff" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
  },
  errorText: {
    fontSize: 15,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    marginBottom: 12,
  },
  retryText: {
    color: "white",
    fontWeight: "bold",
  },
  backLink: {
    paddingVertical: 8,
  },
  backLinkText: {
    color: "#64748b",
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
    borderBottomColor: "#f1f5f9",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
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
    backgroundColor: "#f8fafc",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  formatText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#0f172a",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  previewButtonText: {
    color: "#fff",
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
    backgroundColor: "#eff6ff",
    borderRadius: 8,
  },
  categoryTagText: {
    color: "#3b82f6",
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
    color: "#334155",
  },
  pendingTag: {
    backgroundColor: "#fffbeb",
  },
  activeTag: {
    backgroundColor: "#f0fdf4",
  },
  rejectedTag: {
    backgroundColor: "#fef2f2",
  },
  docTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
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
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#94a3b8",
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
    backgroundColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  metaValueText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500",
    maxWidth: "80%",
  },
  descriptionContainer: {
    marginTop: 8,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  descriptionLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#94a3b8",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
  },
  rejectionReasonContainer: {
    marginTop: 8,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#fef2f2",
  },
  rejectionReasonLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ef4444",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  rejectionReasonText: {
    fontSize: 15,
    color: "#ef4444",
    lineHeight: 24,
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 8,
  },
  actionBar: {
    flexDirection: "row",
    padding: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    backgroundColor: "#fff",
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
    borderColor: "#e2e8f0",
  },
  rejectButtonText: {
    fontWeight: "bold",
    color: "#64748b",
  },
  approveButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#0f172a",
  },
  approveButtonText: {
    fontWeight: "bold",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
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
    color: "#0f172a",
  },
  reasonInput: {
    height: 120,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    textAlignVertical: "top",
    color: "#0f172a",
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
    backgroundColor: "#f1f5f9",
  },
  modalCancelText: {
    fontWeight: 'bold',
    color: '#64748b',
  },
  modalConfirmButton: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
  },
  modalConfirmText: {
    fontWeight: 'bold',
    color: '#fff',
  }
});

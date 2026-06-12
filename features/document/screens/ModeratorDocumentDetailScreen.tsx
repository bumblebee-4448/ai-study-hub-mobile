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
import { 
  ChevronLeft, 
  FileText, 
  User, 
  Calendar, 
  Layers, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Search,
  X
} from "lucide-react-native";

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
  aiTrustScore?: number;
}

interface Props {
  document: ReviewDocumentDetail;
  onBack: () => void;
  onApprove: (doc: ReviewDocumentDetail) => void;
  onReject: (doc: ReviewDocumentDetail, reason: string) => void;
}

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
      "Xác nhận duyệt",
      `Tài liệu "${doc.title}" sẽ được xuất bản lên hệ thống.`,
      [
        { text: "Để sau", style: "cancel" },
        {
          text: "Duyệt ngay",
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
      Alert.alert("Lỗi", "Vui lòng nhập lý do từ chối.");
      return;
    }
    onReject(doc, rejectReason.trim());
    setRejectModalVisible(false);
    setRejectReason("");
    onBack();
  };

  const scoreColor = (doc.aiTrustScore ?? 0) >= 80 ? '#10b981' : (doc.aiTrustScore ?? 0) >= 50 ? '#f59e0b' : '#ef4444';

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

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Document Preview Placeholder */}
        <View style={styles.previewContainer}>
          <View style={styles.previewCard}>
            <FileText size={64} color="#3b82f6" strokeWidth={1.5} />
            <Text style={styles.formatText}>{doc.format} • {doc.size}</Text>
            <TouchableOpacity style={styles.previewButton}>
              <Search size={18} color="#fff" />
              <Text style={styles.previewButtonText}>Xem chi tiết file</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.tagRow}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>{doc.category}</Text>
            </View>
            <View style={styles.yearTag}>
              <Text style={styles.yearTagText}>{doc.year}</Text>
            </View>
          </View>

          <Text style={styles.docTitle}>{doc.title}</Text>

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>NGƯỜI TẢI LÊN</Text>
              <View style={styles.metaValueRow}>
                <View style={styles.avatarMini}>
                  <Text style={styles.avatarText}>{doc.author[0]}</Text>
                </View>
                <Text style={styles.metaValueText}>{doc.author}</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>NGÀY TẢI</Text>
              <View style={styles.metaValueRow}>
                <Calendar size={14} color="#64748b" />
                <Text style={styles.metaValueText}>{doc.uploadedAt}</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>SỐ TRANG</Text>
              <View style={styles.metaValueRow}>
                <Layers size={14} color="#64748b" />
                <Text style={styles.metaValueText}>{doc.pageCount} trang</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>ĐỘ TIN CẬY AI</Text>
              <View style={styles.metaValueRow}>
                <ShieldCheck size={14} color={scoreColor} />
                <Text style={[styles.metaValueText, { color: scoreColor, fontWeight: 'bold' }]}>
                  {doc.aiTrustScore}% Accurate
                </Text>
              </View>
            </View>
          </View>

          {doc.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>MÔ TẢ NỘI DUNG</Text>
              <Text style={styles.descriptionText}>{doc.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.rejectButton} onPress={() => setRejectModalVisible(true)}>
          <XCircle size={20} color="#64748b" />
          <Text style={styles.rejectButtonText}>Từ chối</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.approveButton} onPress={handleApprove}>
          <CheckCircle size={20} color="#fff" />
          <Text style={styles.approveButtonText}>Duyệt bài</Text>
        </TouchableOpacity>
      </View>

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
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setRejectModalVisible(false)}>
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={handleRejectSubmit}>
                <Text style={styles.modalConfirmText}>Xác nhận</Text>
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
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
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  formatText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  previewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoSection: {
    gap: 16,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },
  categoryTagText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '700',
  },
  yearTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  yearTagText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
  },
  docTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    lineHeight: 32,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  metaItem: {
    width: '48%',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  metaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarMini: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  metaValueText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  descriptionContainer: {
    marginTop: 8,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  descriptionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },
  actionBar: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fff',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rejectButtonText: {
    fontWeight: 'bold',
    color: '#64748b',
  },
  approveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#0f172a',
  },
  approveButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  reasonInput: {
    height: 120,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    textAlignVertical: 'top',
    color: '#0f172a',
    marginBottom: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  modalCancelText: {
    fontWeight: 'bold',
    color: '#64748b',
  },
  modalConfirmButton: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
  },
  modalConfirmText: {
    fontWeight: 'bold',
    color: '#fff',
  }
});

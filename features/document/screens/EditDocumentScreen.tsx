import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  FlatList,
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
import { EditDocumentFormSchema, EditDocumentFormType } from "../schemas/documentSchema";
import { EditDocumentParams } from "../types";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "khmt", label: "Khoa học Máy tính" },
  { value: "ai", label: "Trí tuệ Nhân tạo" },
  { value: "kt", label: "Kinh tế học" },
  { value: "hh", label: "Hóa học" },
  { value: "toan", label: "Toán học ứng dụng" },
  { value: "vl", label: "Vật lý đại cương" },
];

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const DEMO_DATA: EditDocumentParams = {
  documentId: "doc-demo-001",
  title: "Báo cáo Nghiên cứu Trí tuệ Nhân tạo Toàn diện 2024",
  category: "ai",
  description: "Tài liệu tổng hợp các xu hướng mới nhất về Học máy và ứng dụng của AI trong công nghiệp.",
  tags: "AI, Machine Learning, Công nghiệp 4.0",
  fileName: "Baocao_NghienCuu_AI_v2.pdf",
  fileSize: 4_404_428,
};

interface EditDocumentScreenProps {
  initialData?: EditDocumentParams;
  onBack?: () => void;
  onSave?: (data: EditDocumentFormType & { documentId: string }) => void;
  onDelete?: (documentId: string) => void;
}

export const EditDocumentScreen: React.FC<EditDocumentScreenProps> = ({
  initialData,
  onBack,
  onSave,
  onDelete,
}) => {
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const data = initialData ?? DEMO_DATA;

  const { control, handleSubmit, formState: { errors } } = useForm<EditDocumentFormType>({
    resolver: zodResolver(EditDocumentFormSchema),
    defaultValues: {
      title: data.title,
      category: data.category,
      description: data.description ?? "",
      tags: data.tags ?? "",
    },
  });

  const onSubmit = useCallback(
    async (formData: EditDocumentFormType) => {
      setIsSaving(true);
      try {
        await new Promise<void>((resolve) => setTimeout(resolve, 1200));
        onSave?.({ ...formData, documentId: data.documentId });
        Alert.alert("Thành công", "Tài liệu đã được cập nhật!", [
          { text: "OK", onPress: onBack },
        ]);
      } catch {
        Alert.alert("Lỗi", "Không thể cập nhật. Vui lòng thử lại.");
      } finally {
        setIsSaving(false);
      }
    },
    [data.documentId, onBack, onSave]
  );

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc muốn xóa tài liệu này không? Hành động này không thể hoàn tác.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await new Promise<void>((resolve) => setTimeout(resolve, 800));
              onDelete?.(data.documentId);
              Alert.alert("Đã xóa", "Tài liệu đã được xóa thành công.", [
                { text: "OK", onPress: onBack },
              ]);
            } catch {
              Alert.alert("Lỗi", "Không thể xóa. Vui lòng thử lại.");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  }, [data.documentId, onBack, onDelete]);

  const busy = isSaving || isDeleting;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS["on-surface-variant"]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Chỉnh sửa tài liệu</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.previewCard}>
          <View style={styles.previewIconBox}>
            <MaterialCommunityIcons
              name="file-document"
              size={28}
              color={COLORS["on-primary-container"]}
            />
          </View>
          <View style={styles.previewInfo}>
            <Text style={styles.previewName} numberOfLines={1}>
              {data.fileName ?? "Tài liệu chưa đặt tên"}
            </Text>
            <Text style={styles.previewMeta}>
              {formatFileSize(data.fileSize)}{data.fileSize ? " • " : ""}Tải lên 2 ngày trước
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Tiêu đề tài liệu</Text>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.title && styles.inputError]}
                  placeholder="Nhập tiêu đề..."
                  placeholderTextColor={COLORS.outline}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="next"
                  maxLength={120}
                />
              )}
            />
            {errors.title && <Text style={styles.fieldError}>{errors.title.message}</Text>}
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Danh mục</Text>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    style={[styles.input, styles.selectRow, errors.category && styles.inputError]}
                    onPress={() => setCategoryModalVisible(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.selectText, !value && { color: COLORS.outline }]}>
                      {value ? CATEGORIES.find((c) => c.value === value)?.label : "Chọn danh mục"}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color={COLORS.outline} />
                  </TouchableOpacity>

                  <Modal
                    visible={categoryModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setCategoryModalVisible(false)}
                  >
                    <TouchableOpacity
                      style={styles.modalOverlay}
                      activeOpacity={1}
                      onPress={() => setCategoryModalVisible(false)}
                    >
                      <View style={styles.modalSheet}>
                        <Text style={styles.modalTitle}>Chọn danh mục</Text>
                        <FlatList
                          data={CATEGORIES}
                          keyExtractor={(item) => item.value}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              style={[styles.modalOption, item.value === value && styles.modalOptionActive]}
                              onPress={() => { onChange(item.value); setCategoryModalVisible(false); }}
                            >
                              <Text style={[styles.modalOptionText, item.value === value && styles.modalOptionTextActive]}>
                                {item.label}
                              </Text>
                              {item.value === value && (
                                <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                              )}
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    </TouchableOpacity>
                  </Modal>
                </>
              )}
            />
            {errors.category && <Text style={styles.fieldError}>{errors.category.message}</Text>}
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Mô tả tóm tắt</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="Tóm tắt ngắn gọn nội dung..."
                  placeholderTextColor={COLORS.outline}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={500}
                />
              )}
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Thẻ (Tags)</Text>
            <Controller
              control={control}
              name="tags"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.tags && styles.inputError]}
                  placeholder="AI, Machine Learning, ..."
                  placeholderTextColor={COLORS.outline}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="done"
                  maxLength={200}
                />
              )}
            />
            <Text style={styles.hint}>Phân cách các thẻ bằng dấu phẩy.</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btnSave, busy && styles.btnDisabled]}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
            disabled={busy}
          >
            {isSaving ? (
              <ActivityIndicator color={COLORS["on-primary"]} size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="content-save" size={20} color={COLORS["on-primary"]} />
                <Text style={styles.btnSaveText}>Cập nhật thay đổi</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnDelete, busy && styles.btnDisabled]}
            onPress={handleDelete}
            activeOpacity={0.8}
            disabled={busy}
          >
            {isDeleting ? (
              <ActivityIndicator color={COLORS.error} size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="delete-outline" size={20} color={COLORS.error} />
                <Text style={styles.btnDeleteText}>Xóa tài liệu này</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING["margin-mobile"],
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS["outline-variant"],
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    ...TYPOGRAPHY["headline-md"],
    fontWeight: "700",
    color: COLORS["on-surface"],
    textAlign: "center",
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING["margin-mobile"],
    paddingTop: SPACING.lg,
    gap: SPACING.lg,
  },

  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS["surface-container-low"],
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
  },
  previewIconBox: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS["primary-container"],
    alignItems: "center",
    justifyContent: "center",
  },
  previewInfo: { flex: 1, minWidth: 0 },
  previewName: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
  },
  previewMeta: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
    marginTop: 2,
  },

  form: { gap: SPACING.lg },
  fieldBlock: { gap: SPACING.sm },
  label: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
  },
  input: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface"],
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  textarea: {
    height: 100,
    paddingTop: SPACING.md,
  },
  fieldError: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS.error,
  },
  hint: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },

  selectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface"],
    flex: 1,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  modalSheet: {
    width: "100%",
    backgroundColor: COLORS["surface-container-lowest"],
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.base,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  modalTitle: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface-variant"],
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS["outline-variant"],
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
  },
  modalOptionActive: {
    backgroundColor: COLORS["surface-container-low"],
  },
  modalOptionText: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface"],
    flex: 1,
  },
  modalOptionTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  actions: { gap: SPACING.md },
  btnSave: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.base,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
  },
  btnSaveText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-primary"],
  },
  btnDelete: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.base,
    backgroundColor: "transparent",
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1.5,
    borderColor: COLORS.error,
    paddingVertical: SPACING.lg,
  },
  btnDeleteText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS.error,
  },
  btnDisabled: { opacity: 0.55 },
});

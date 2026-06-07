/**
 * Document Feature — EditDocumentScreen
 *
 * Màn hình chỉnh sửa tài liệu đã tải lên.
 *
 * UI layout (theo HTML mẫu):
 *  - Sticky header: nút back + tiêu đề "Chỉnh sửa tài liệu"
 *  - File preview card: icon description + tên file + dung lượng
 *  - Form: Tiêu đề, Danh mục (modal picker), Mô tả (textarea 4 dòng), Tags
 *  - Nút "Cập nhật thay đổi" (filled primary)
 *  - Nút "Xóa tài liệu này" (outlined error)
 *
 * Nhận dữ liệu ban đầu qua prop `initialData: EditDocumentParams`.
 * Khi dùng với Expo Router, truyền từ router.push({ params }).
 */

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

import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "@/constants/theme";
import {
  EditDocumentFormSchema,
  EditDocumentFormType,
} from "../schemas/documentSchema";
import { EditDocumentParams } from "../types";

// ── Categories ────────────────────────────────────────────────────────────────

const CATEGORIES: { value: string; label: string }[] = [
  { value: "khmt", label: "Khoa học Máy tính" },
  { value: "ai", label: "Trí tuệ Nhân tạo" },
  { value: "kt", label: "Kinh tế học" },
  { value: "hh", label: "Hóa học" },
  { value: "toan", label: "Toán học ứng dụng" },
  { value: "vl", label: "Vật lý đại cương" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface EditDocumentScreenProps {
  initialData?: EditDocumentParams;
  onBack?: () => void;
  onSave?: (data: EditDocumentFormType & { documentId: string }) => void;
  onDelete?: (documentId: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const EditDocumentScreen: React.FC<EditDocumentScreenProps> = ({
  initialData,
  onBack,
  onSave,
  onDelete,
}) => {
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Default demo data so the screen renders meaningfully in isolation
  const defaults: EditDocumentParams = initialData ?? {
    documentId: "doc-demo-001",
    title: "Báo cáo Nghiên cứu Trí tuệ Nhân tạo Toàn diện 2024",
    category: "ai",
    description:
      "Tài liệu tổng hợp các xu hướng mới nhất về Học máy và ứng dụng của AI trong công nghiệp. Bao gồm phân tích dữ liệu từ 500 doanh nghiệp hàng đầu.",
    tags: "AI, Machine Learning, Công nghiệp 4.0",
    fileName: "Baocao_NghienCuu_AI_v2.pdf",
    fileSize: 4_404_428, // 4.2 MB
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditDocumentFormType>({
    resolver: zodResolver(EditDocumentFormSchema),
    defaultValues: {
      title: defaults.title,
      category: defaults.category,
      description: defaults.description ?? "",
      tags: defaults.tags ?? "",
    },
  });

  // ── Handlers ────────────────────────────────────────────────────────────────

  const onSubmit = useCallback(
    async (data: EditDocumentFormType) => {
      setIsSaving(true);
      try {
        // TODO: replace with real API call
        await new Promise<void>((resolve) => setTimeout(resolve, 1200));
        onSave?.({ ...data, documentId: defaults.documentId });
        Alert.alert("Thành công", "Tài liệu đã được cập nhật!", [
          { text: "OK", onPress: onBack },
        ]);
      } catch {
        Alert.alert("Lỗi", "Không thể cập nhật. Vui lòng thử lại.");
      } finally {
        setIsSaving(false);
      }
    },
    [defaults.documentId, onBack, onSave]
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
              // TODO: replace with real API call
              await new Promise<void>((resolve) => setTimeout(resolve, 800));
              onDelete?.(defaults.documentId);
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
  }, [defaults.documentId, onBack, onDelete]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Sticky Header ──────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Quay lại"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS["on-surface-variant"]} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          Chỉnh sửa tài liệu
        </Text>

        {/* Spacer to center-align title */}
        <View style={styles.headerSpacer} />
      </View>

      {/* ── Scrollable body ────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── File Preview Card ──────────────────────────────────────── */}
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
              {defaults.fileName ?? "Tài liệu chưa đặt tên"}
            </Text>
            <Text style={styles.previewMeta}>
              {formatFileSize(defaults.fileSize)}
              {defaults.fileSize ? " • " : ""}
              Tải lên 2 ngày trước
            </Text>
          </View>
        </View>

        {/* ── Form ────────────────────────────────────────────────────── */}
        <View style={styles.form}>
          {/* Field: Tiêu đề */}
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
            {errors.title ? (
              <Text style={styles.fieldError}>{errors.title.message}</Text>
            ) : null}
          </View>

          {/* Field: Danh mục */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Danh mục</Text>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <>
                  <TouchableOpacity
                    style={[
                      styles.input,
                      styles.selectRow,
                      errors.category && styles.inputError,
                    ]}
                    onPress={() => setCategoryModalVisible(true)}
                    activeOpacity={0.8}
                    accessibilityLabel="Chọn danh mục"
                  >
                    <Text
                      style={[
                        styles.selectText,
                        !value && { color: COLORS.outline },
                      ]}
                    >
                      {value
                        ? CATEGORIES.find((c) => c.value === value)?.label
                        : "Chọn danh mục"}
                    </Text>
                    <Ionicons
                      name="chevron-down"
                      size={18}
                      color={COLORS.outline}
                    />
                  </TouchableOpacity>

                  {/* Modal Picker */}
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
                              style={[
                                styles.modalOption,
                                item.value === value &&
                                  styles.modalOptionActive,
                              ]}
                              onPress={() => {
                                onChange(item.value);
                                setCategoryModalVisible(false);
                              }}
                            >
                              <Text
                                style={[
                                  styles.modalOptionText,
                                  item.value === value &&
                                    styles.modalOptionTextActive,
                                ]}
                              >
                                {item.label}
                              </Text>
                              {item.value === value && (
                                <Ionicons
                                  name="checkmark"
                                  size={18}
                                  color={COLORS.primary}
                                />
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
            {errors.category ? (
              <Text style={styles.fieldError}>{errors.category.message}</Text>
            ) : null}
          </View>

          {/* Field: Mô tả */}
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
            {errors.description ? (
              <Text style={styles.fieldError}>{errors.description.message}</Text>
            ) : null}
          </View>

          {/* Field: Tags */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Thẻ (Tags)</Text>
            <Controller
              control={control}
              name="tags"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.tags && styles.inputError]}
                  placeholder="AI, Machine Learning, Công nghiệp 4.0"
                  placeholderTextColor={COLORS.outline}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="done"
                  maxLength={200}
                />
              )}
            />
            {errors.tags ? (
              <Text style={styles.fieldError}>{errors.tags.message}</Text>
            ) : null}
            <Text style={styles.hint}>Phân cách các thẻ bằng dấu phẩy.</Text>
          </View>
        </View>

        {/* ── Action Buttons ───────────────────────────────────────────── */}
        <View style={styles.actions}>
          {/* Primary — Update */}
          <TouchableOpacity
            style={[styles.btnSave, isSaving && styles.btnDisabled]}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
            disabled={isSaving || isDeleting}
            accessibilityLabel="Cập nhật thay đổi"
          >
            {isSaving ? (
              <ActivityIndicator color={COLORS["on-primary"]} size="small" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="content-save"
                  size={20}
                  color={COLORS["on-primary"]}
                />
                <Text style={styles.btnSaveText}>Cập nhật thay đổi</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Destructive — Delete */}
          <TouchableOpacity
            style={[styles.btnDelete, isDeleting && styles.btnDisabled]}
            onPress={handleDelete}
            activeOpacity={0.8}
            disabled={isSaving || isDeleting}
            accessibilityLabel="Xóa tài liệu này"
          >
            {isDeleting ? (
              <ActivityIndicator color={COLORS.error} size="small" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={20}
                  color={COLORS.error}
                />
                <Text style={styles.btnDeleteText}>Xóa tài liệu này</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom padding for tab bar */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  // ── Header ──
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
  // Same width as backBtn to keep title visually centred
  headerSpacer: {
    width: 40,
  },

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING["margin-mobile"],
    paddingTop: SPACING.lg,
    gap: SPACING.lg,
  },

  // ── File Preview Card ──
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
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
  previewInfo: {
    flex: 1,
    minWidth: 0,
  },
  previewName: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
  },
  previewMeta: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
    marginTop: 2,
  },

  // ── Form ──
  form: {
    gap: SPACING.lg,
  },
  fieldBlock: {
    gap: SPACING.sm / 2,
  },
  label: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
    marginBottom: 2,
  },
  input: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface"],
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  textarea: {
    height: 100,
    paddingTop: 12,
  },
  fieldError: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS.error,
    marginTop: 2,
  },
  hint: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
    marginTop: 2,
  },

  // ── Category selector ──
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

  // ── Modal Picker ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalSheet: {
    width: "100%",
    backgroundColor: COLORS["surface-container-lowest"],
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 8,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  modalTitle: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface-variant"],
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS["outline-variant"],
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
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

  // ── Action Buttons ──
  actions: {
    gap: 12,
    marginTop: 8,
  },
  btnSave: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 16,
  },
  btnSaveText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-primary"],
  },
  btnDelete: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "transparent",
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1.5,
    borderColor: COLORS.error,
    paddingVertical: 16,
  },
  btnDeleteText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS.error,
  },
  btnDisabled: {
    opacity: 0.55,
  },
});

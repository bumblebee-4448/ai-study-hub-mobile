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
import { UploadFormSchema, UploadFormType } from "../schemas/documentSchema";
import { useUploadDocument } from "../hooks/useUploadDocument";
import { UploadCategory } from "../types";

const CATEGORIES: UploadCategory[] = [
  { value: "khmt", label: "Khoa học Máy tính" },
  { value: "ai", label: "Trí tuệ Nhân tạo" },
  { value: "kt", label: "Kinh tế học" },
  { value: "hh", label: "Hóa học" },
  { value: "toan", label: "Toán học ứng dụng" },
  { value: "vl", label: "Vật lý đại cương" },
];

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

interface UploadScreenProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({
  onCancel,
  onSuccess,
}) => {
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const { pickedFile, fileError, uploadStatus, pickFile, clearFile, submitUpload } =
    useUploadDocument();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadFormType>({
    resolver: zodResolver(UploadFormSchema),
    defaultValues: { title: "", category: "", description: "" },
  });

  const onSubmit = useCallback(
    async (data: UploadFormType) => {
      await submitUpload(data);
      if (uploadStatus !== "error") {
        reset();
        clearFile();
        Alert.alert("Thành công", "Tài liệu đã được tải lên!", [
          { text: "OK", onPress: onSuccess },
        ]);
      }
    },
    [submitUpload, uploadStatus, reset, clearFile, onSuccess]
  );

  const isUploading = uploadStatus === "uploading";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>AcademiShare</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Tải tài liệu lên</Text>

        <TouchableOpacity
          style={[styles.dropZone, pickedFile && styles.dropZoneActive]}
          onPress={pickFile}
          activeOpacity={0.8}
        >
          {pickedFile ? (
            <>
              <MaterialCommunityIcons
                name="file-check"
                size={40}
                color={COLORS.primary}
              />
              <Text style={styles.fileName} numberOfLines={1}>
                {pickedFile.name}
              </Text>
              <Text style={styles.fileMeta}>
                {pickedFile.size ? formatFileSize(pickedFile.size) : ""}
              </Text>
              <TouchableOpacity onPress={clearFile} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>Chọn lại</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <MaterialCommunityIcons
                name="cloud-upload-outline"
                size={40}
                color={COLORS["on-surface-variant"]}
              />
              <Text style={styles.dropZoneHint}>
                Nhấn để chọn tài liệu
              </Text>
              <Text style={styles.dropZoneMeta}>
                PDF, DOCX, PPTX — Tối đa 50 MB
              </Text>
            </>
          )}
        </TouchableOpacity>

        {fileError && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={18} color={COLORS.error} />
            <Text style={styles.errorText}>{fileError}</Text>
          </View>
        )}

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
            {errors.title && (
              <Text style={styles.fieldError}>{errors.title.message}</Text>
            )}
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
                              style={[
                                styles.modalOption,
                                item.value === value && styles.modalOptionActive,
                              ]}
                              onPress={() => {
                                onChange(item.value);
                                setCategoryModalVisible(false);
                              }}
                            >
                              <Text
                                style={[
                                  styles.modalOptionText,
                                  item.value === value && styles.modalOptionTextActive,
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
            {errors.category && (
              <Text style={styles.fieldError}>{errors.category.message}</Text>
            )}
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
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnCancel}
            onPress={onCancel}
            disabled={isUploading}
          >
            <Text style={styles.btnCancelText}>Hủy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnUpload, isUploading && styles.btnDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isUploading}
            activeOpacity={0.8}
          >
            {isUploading ? (
              <ActivityIndicator color={COLORS["on-primary"]} size="small" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="cloud-upload"
                  size={18}
                  color={COLORS["on-primary"]}
                />
                <Text style={styles.btnUploadText}>Tải lên</Text>
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
    justifyContent: "center",
    paddingHorizontal: SPACING["margin-mobile"],
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS["outline-variant"],
  },
  logo: {
    ...TYPOGRAPHY["headline-md"],
    fontWeight: "700",
    color: COLORS.primary,
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING["margin-mobile"],
    paddingTop: SPACING.xl,
    gap: SPACING.lg,
  },

  pageTitle: {
    ...TYPOGRAPHY["headline-lg-mobile"],
    color: COLORS["on-surface"],
  },

  dropZone: {
    borderWidth: 2,
    borderColor: COLORS["outline-variant"],
    borderStyle: "dashed",
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.xl,
    alignItems: "center",
    gap: SPACING.base,
    backgroundColor: COLORS["surface-container-low"],
  },
  dropZoneActive: {
    borderColor: COLORS.primary,
    borderStyle: "solid",
  },
  dropZoneHint: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
  },
  dropZoneMeta: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },
  fileName: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS.primary,
    paddingHorizontal: SPACING.lg,
  },
  fileMeta: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },
  clearBtn: {
    marginTop: SPACING.sm,
  },
  clearBtnText: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
    textDecorationLine: "underline",
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.base,
    padding: SPACING.md,
    backgroundColor: COLORS["error-container"],
    borderRadius: BORDER_RADIUS.lg,
  },
  errorText: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS.error,
    flex: 1,
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

  actions: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  btnCancel: {
    flex: 1,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
  },
  btnCancelText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface-variant"],
  },
  btnUpload: {
    flex: 2,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.base,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.primary,
  },
  btnUploadText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-primary"],
  },
  btnDisabled: {
    opacity: 0.55,
  },
});

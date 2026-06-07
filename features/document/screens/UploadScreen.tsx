/**
 * Document Feature — UploadScreen
 * Converts HTML upload page to React Native.
 *
 * UI:
 *  - Sticky header: AcademiShare logo + avatar
 *  - Upload zone: dashed border, cloud-upload icon, format/size hint
 *  - File error banner (format mismatch or > 50 MB)
 *  - Form: Title (TextInput), Category (inline picker), Description (TextArea)
 *  - Buttons: Hủy (outline) | Tải lên (filled)
 *  - Category dropdown implemented as a native Modal (no extra deps)
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import React, { useState, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  FlatList,
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

import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from "@/constants/theme";
import { UploadFormSchema, UploadFormType } from "../schemas/documentSchema";
import { useUploadDocument } from "../hooks/useUploadDocument";
import { UploadCategory } from "../types";

// ── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES: UploadCategory[] = [
  { value: "cs", label: "Khoa học máy tính" },
  { value: "math", label: "Toán học ứng dụng" },
  { value: "phys", label: "Vật lý đại cương" },
  { value: "eco", label: "Kinh tế học" },
];

// ── Component ────────────────────────────────────────────────────────────────

export const UploadScreen: React.FC = () => {
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

  // ── Handlers ──────────────────────────────────────────────────────────────

  const onCancel = useCallback(() => {
    clearFile();
    reset();
  }, [clearFile, reset]);

  const onSubmit = useCallback(
    async (data: UploadFormType) => {
      await submitUpload(data);
      if (uploadStatus !== "error") {
        Alert.alert("Thành công", "Tài liệu đã được tải lên thành công!", [
          { text: "OK", onPress: onCancel },
        ]);
      }
    },
    [submitUpload, uploadStatus, onCancel]
  );

  // ── Helpers ───────────────────────────────────────────────────────────────

  const formatSize = (bytes: number | undefined): string => {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Sticky Header ─────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.logo}>AcademiShare</Text>
        <Image
          source={{
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0WHyA_G4bjXLc_4wiWyt39AIrIQqf-s9q1OJF8Lu6MT2ixy89pL7VcdhP3WEtcHRG0UpAm55ztMsVmDa-slgyf2EWtaC-AJRE5U-Dw7oLRzei3DSkSTv3uNIjyCXP_6xbaMVTyE3UROBawmr5sIrB1sT4aTQaCCAuR6o17MxZhodtsC8ShQqu7MPF87B5brcTul4NqMWx_tmxIf0f5oGhY1OD3WBud7gs-uvYiQ3MifA1r4-Kq1b04e94V-Lu9R5ptFL2C6pCDRs",
          }}
          style={styles.avatar}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Page Title ──────────────────────────────────────────── */}
        <View style={styles.pageTitleBlock}>
          <Text style={styles.pageTitle}>Tải lên tài liệu</Text>
          <Text style={styles.pageSubtitle}>
            Chia sẻ kiến thức với cộng đồng học thuật.
          </Text>
        </View>

        {/* ── Upload Zone ─────────────────────────────────────────── */}
        <TouchableOpacity
          style={[
            styles.dropZone,
            pickedFile && styles.dropZoneSelected,
            !!fileError && styles.dropZoneError,
          ]}
          onPress={pickFile}
          activeOpacity={0.75}
          accessibilityLabel="Chọn tệp để tải lên"
        >
          {pickedFile ? (
            /* ── File picked state ── */
            <View style={styles.filePickedRow}>
              <MaterialCommunityIcons
                name="file-check-outline"
                size={36}
                color={COLORS.primary}
              />
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {pickedFile.name}
                </Text>
                <Text style={styles.fileSize}>{formatSize(pickedFile.size)}</Text>
              </View>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation?.();
                  clearFile();
                }}
                style={styles.removeBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={22} color={COLORS.outline} />
              </TouchableOpacity>
            </View>
          ) : (
            /* ── Empty state ── */
            <>
              <MaterialCommunityIcons
                name="cloud-upload-outline"
                size={48}
                color={COLORS.primary}
                style={styles.uploadIcon}
              />
              <Text style={styles.dropZoneTitle}>Nhấn để chọn tệp</Text>
              <Text style={styles.dropZoneHint}>
                Hỗ trợ PDF, DOCX, PPTX (Tối đa 50 MB)
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* ── File error banner ───────────────────────────────────── */}
        {fileError ? (
          <View style={styles.errorBanner}>
            <Ionicons
              name="warning-outline"
              size={16}
              color={COLORS.error}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.errorBannerText}>{fileError}</Text>
          </View>
        ) : null}

        {/* ── Form ────────────────────────────────────────────────── */}
        <View style={styles.form}>
          {/* Title */}
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

          {/* Category — inline modal picker */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Danh mục / Môn học</Text>
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

                  {/* Modal picker */}
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

          {/* Description */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Mô tả (Không bắt buộc)</Text>
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
                  numberOfLines={3}
                  textAlignVertical="top"
                  maxLength={500}
                />
              )}
            />
            {errors.description ? (
              <Text style={styles.fieldError}>{errors.description.message}</Text>
            ) : null}
          </View>
        </View>

        {/* ── Action Buttons ──────────────────────────────────────── */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.btnCancel}
            onPress={onCancel}
            activeOpacity={0.75}
          >
            <Text style={styles.btnCancelText}>Hủy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btnSubmit,
              uploadStatus === "uploading" && styles.btnSubmitDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.8}
            disabled={uploadStatus === "uploading"}
          >
            {uploadStatus === "uploading" ? (
              <ActivityIndicator color={COLORS["on-primary"]} size="small" />
            ) : (
              <Text style={styles.btnSubmitText}>Tải lên</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* bottom padding so content clears the tab bar */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING["margin-mobile"],
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS["outline-variant"],
  },
  logo: {
    ...TYPOGRAPHY["headline-md"],
    color: COLORS.primary,
    fontWeight: "700",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING["margin-mobile"],
    paddingTop: 24,
    gap: 24,
  },

  // Page title
  pageTitleBlock: { gap: 4 },
  pageTitle: {
    ...TYPOGRAPHY["headline-lg-mobile"],
    color: COLORS["on-surface"],
  },
  pageSubtitle: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface-variant"],
  },

  // Drop zone
  dropZone: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS["surface-container-lowest"],
    minHeight: 140,
  },
  dropZoneSelected: {
    borderColor: COLORS.primary,
    borderStyle: "solid",
    backgroundColor: COLORS["surface-container-low"],
  },
  dropZoneError: {
    borderColor: COLORS.error,
  },
  uploadIcon: {
    marginBottom: 8,
    opacity: 0.9,
  },
  dropZoneTitle: {
    ...TYPOGRAPHY["body-lg"],
    color: COLORS["on-surface"],
    marginBottom: 4,
  },
  dropZoneHint: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
    textAlign: "center",
  },

  // File picked state inside drop zone
  filePickedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  fileInfo: { flex: 1 },
  fileName: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
    flexShrink: 1,
  },
  fileSize: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
    marginTop: 2,
  },
  removeBtn: {
    padding: 4,
  },

  // Error banner below drop zone
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS["error-container"],
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorBannerText: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS.error,
    flex: 1,
  },

  // Form
  form: { gap: 16 },
  fieldBlock: { gap: 4 },
  label: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
    marginBottom: 2,
  },
  input: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface"],
    backgroundColor: COLORS["surface-container-lowest"],
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  textarea: {
    height: 88,
    paddingTop: 12,
  },
  fieldError: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS.error,
    marginTop: 2,
  },

  // Category selector
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

  // Modal picker
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
    borderRadius: BORDER_RADIUS.lg,
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
  },
  modalOptionTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  // Action buttons
  actionRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  btnCancel: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  btnCancelText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS.primary,
  },
  btnSubmit: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSubmitDisabled: {
    opacity: 0.65,
  },
  btnSubmitText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-primary"],
  },
});

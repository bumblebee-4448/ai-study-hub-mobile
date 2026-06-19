import { useRouter } from "expo-router";
import {
  Check,
  ChevronDown,
  FileText,
  RefreshCw,
  UploadCloud,
  X,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useUserUploadDocument } from "../hooks/useUserUploadDocument";
import type { BackendSubject } from "../types";

const formatFileSize = (bytes?: number) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const subjectLabel = (subject?: BackendSubject) => {
  if (!subject) return "Chọn môn học";
  return subject.code ? `${subject.name} (${subject.code})` : subject.name;
};

export const UserContributeScreen = () => {
  const router = useRouter();
  const [subjectModalVisible, setSubjectModalVisible] = useState(false);
  const upload = useUserUploadDocument();
  const selectedSubject = useMemo(
    () =>
      upload.subjects.find((subject) => subject.id === upload.values.subjectId),
    [upload.subjects, upload.values.subjectId]
  );

  const handleSubmit = async () => {
    const didUpload = await upload.submitUpload();
    if (!didUpload) return;

    Alert.alert("Tải lên thành công", "Tài liệu đã được lưu vào tài khoản.", [
      {
        text: "Xem tài liệu",
        onPress: () => router.push("/(student-tabs)/my-documents" as any),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>ACADEMISHARE</Text>
          <Text style={styles.pageTitle}>Đóng góp</Text>
          <Text style={styles.pageSubtitle}>
            Tải tài liệu học tập mới lên thư viện của bạn
          </Text>
        </View>

        {/* ── Upload Area ── */}
        <View style={styles.formWrapper}>
          <TouchableOpacity
            style={[
              styles.uploadBox,
              upload.pickedFile && styles.uploadBoxSelected,
              upload.fileError && styles.uploadBoxError,
            ]}
            onPress={upload.pickFile}
            activeOpacity={0.78}
            disabled={upload.isSubmitting}
          >
            {upload.pickedFile ? (
              <View style={styles.fileRow}>
                <View style={styles.fileIconBox}>
                  <FileText size={24} color="#6366f1" />
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {upload.pickedFile.name}
                  </Text>
                  <Text style={styles.fileMeta}>
                    {formatFileSize(upload.pickedFile.size)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.fileClearBtn}
                  onPress={(event) => {
                    event.stopPropagation?.();
                    upload.clearFile();
                  }}
                  disabled={upload.isSubmitting}
                >
                  <X size={18} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyUpload}>
                <View style={styles.uploadIconBox}>
                  <UploadCloud size={28} color="#6366f1" />
                </View>
                <Text style={styles.uploadTitle}>Chọn tệp tài liệu</Text>
                <Text style={styles.uploadHint}>
                  PDF, DOC, DOCX, PPT, PPTX
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {upload.fileError ? (
            <Text style={styles.errorText}>{upload.fileError}</Text>
          ) : null}

          {/* ── Form Fields ── */}
          <View style={styles.form}>
            {/* Title */}
            <View style={styles.fieldCard}>
              <Text style={styles.label}>Tên tài liệu</Text>
              <TextInput
                style={styles.input}
                value={upload.values.title}
                onChangeText={upload.setTitle}
                placeholder="Ví dụ: Đề cương Giải tích 1"
                placeholderTextColor="#94a3b8"
                editable={!upload.isSubmitting}
                maxLength={120}
              />
            </View>

            {/* Subject */}
            <View style={styles.fieldCard}>
              <Text style={styles.label}>Môn học</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setSubjectModalVisible(true)}
                activeOpacity={0.8}
                disabled={upload.isSubmitting || upload.isLoadingSubjects}
              >
                <Text
                  style={[
                    styles.selectText,
                    !selectedSubject && styles.placeholderText,
                  ]}
                  numberOfLines={1}
                >
                  {upload.isLoadingSubjects
                    ? "Đang tải môn học..."
                    : subjectLabel(selectedSubject)}
                </Text>
                <ChevronDown size={18} color="#94a3b8" />
              </TouchableOpacity>
              {upload.subjectsError ? (
                <View style={styles.retryRow}>
                  <Text style={styles.errorTextSmall}>
                    {upload.subjectsError}
                  </Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={upload.loadSubjects}
                  >
                    <RefreshCw size={14} color="#6366f1" />
                    <Text style={styles.retryText}>Tải lại</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            {/* Description */}
            <View style={styles.fieldCard}>
              <Text style={styles.label}>Mô tả</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                value={upload.values.description}
                onChangeText={upload.setDescription}
                placeholder="Tóm tắt nội dung tài liệu..."
                placeholderTextColor="#94a3b8"
                editable={!upload.isSubmitting}
                multiline
                maxLength={500}
                textAlignVertical="top"
              />
            </View>

            {/* Visibility Toggle */}
            <View style={styles.visibilityCard}>
              <View style={styles.visibilityText}>
                <Text style={styles.label}>Công khai tài liệu</Text>
                <Text style={styles.visibilityHint}>
                  {upload.values.isPublic
                    ? "Gửi tài liệu vào hàng chờ duyệt."
                    : "Chỉ bạn thấy tài liệu này."}
                </Text>
              </View>
              <Switch
                value={upload.values.isPublic}
                onValueChange={upload.setIsPublic}
                disabled={upload.isSubmitting}
                trackColor={{ false: "#e2e8f0", true: "#a5b4fc" }}
                thumbColor={upload.values.isPublic ? "#6366f1" : "#f8fafc"}
              />
            </View>
          </View>

          {upload.submitError ? (
            <Text style={styles.errorText}>{upload.submitError}</Text>
          ) : null}

          {/* ── Submit Button ── */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              upload.isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={upload.isSubmitting}
          >
            {upload.isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Tải lên</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Subject Modal ── */}
        <Modal
          visible={subjectModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setSubjectModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSubjectModalVisible(false)}
          >
            <View
              style={styles.modalSheet}
              onStartShouldSetResponder={() => true}
            >
              <Text style={styles.modalTitle}>Chọn môn học</Text>
              <FlatList
                data={upload.subjects}
                keyExtractor={(subject) => subject.id}
                ListHeaderComponent={
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => {
                      upload.setSubjectId("");
                      setSubjectModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalOptionText}>Chưa chọn</Text>
                    {!upload.values.subjectId ? (
                      <Check size={18} color="#6366f1" />
                    ) : null}
                  </TouchableOpacity>
                }
                renderItem={({ item }) => {
                  const selected = item.id === upload.values.subjectId;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.modalOption,
                        selected && styles.modalOptionActive,
                      ]}
                      onPress={() => {
                        upload.setSubjectId(item.id);
                        setSubjectModalVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          selected && styles.modalOptionTextActive,
                        ]}
                        numberOfLines={1}
                      >
                        {subjectLabel(item)}
                      </Text>
                      {selected ? (
                        <Check size={18} color="#6366f1" />
                      ) : null}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingBottom: 110,
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

  /* ── Form Wrapper ── */
  formWrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  /* ── Upload Box ── */
  uploadBox: {
    minHeight: 140,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#c7d2fe",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  uploadBoxSelected: {
    borderStyle: "solid",
    borderColor: "#6366f1",
    backgroundColor: "#eef2ff",
  },
  uploadBoxError: {
    borderColor: "#fca5a5",
    backgroundColor: "#fef2f2",
  },
  emptyUpload: {
    alignItems: "center",
    gap: 8,
  },
  uploadIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  uploadHint: {
    fontSize: 13,
    color: "#94a3b8",
  },
  fileRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  fileIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef2ff",
  },
  fileInfo: {
    flex: 1,
    minWidth: 0,
  },
  fileName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  fileMeta: {
    marginTop: 3,
    fontSize: 13,
    color: "#94a3b8",
  },
  fileClearBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },

  /* ── Form ── */
  form: {
    marginTop: 20,
    gap: 14,
  },
  fieldCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    gap: 8,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#0f172a",
    backgroundColor: "#f8fafc",
  },
  textarea: {
    minHeight: 100,
  },
  selectInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f8fafc",
  },
  selectText: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    color: "#0f172a",
  },
  placeholderText: {
    color: "#94a3b8",
  },
  retryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
  },
  retryText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6366f1",
  },

  /* ── Visibility ── */
  visibilityCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  visibilityText: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  visibilityHint: {
    fontSize: 12,
    lineHeight: 17,
    color: "#94a3b8",
  },

  /* ── Error ── */
  errorText: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 18,
    color: "#dc2626",
  },
  errorTextSmall: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: "#dc2626",
  },

  /* ── Submit ── */
  submitButton: {
    height: 50,
    marginTop: 20,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366f1",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.68,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },

  /* ── Modal ── */
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
  },
  modalSheet: {
    maxHeight: "72%",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  modalTitle: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  modalOption: {
    minHeight: 48,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalOptionActive: {
    backgroundColor: "#eef2ff",
  },
  modalOptionText: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    color: "#0f172a",
  },
  modalOptionTextActive: {
    fontWeight: "700",
    color: "#6366f1",
  },
});

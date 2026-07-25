import {
  AlertCircle,
  BookOpen,
  Edit3,
  Eye,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ScreenSafeAreaView } from "@/components/screen-safe-area-view";
import { SCREEN_HEADER_TOP_PADDING } from "@/constants/safeArea";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { useAppTheme, type AppThemeColors } from "@/features/theme";
import {
  useAdminSubjectDetail,
  useAdminSubjects,
  useDeleteAdminSubject,
  useSaveAdminSubject,
} from "../hooks/useAdminQueries";
import type {
  AdminSubjectFormValues,
  AdminSubjectItem,
} from "../types";

const emptyDraft: AdminSubjectFormValues = {
  name: "",
  code: "",
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const SubjectsScreen = () => {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 300);
  const { page, limit, setPage, resetPage } = usePagination(10);
  const [selectedSubject, setSelectedSubject] =
    useState<AdminSubjectItem | null>(null);
  const [editSubject, setEditSubject] = useState<AdminSubjectItem | null>(null);
  const [draft, setDraft] = useState<AdminSubjectFormValues>(emptyDraft);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const subjectsQuery = useAdminSubjects({
    page,
    limit,
    search: debouncedQuery || undefined,
  });
  const subjectDetailQuery = useAdminSubjectDetail(selectedSubject?.id);
  const saveSubjectMutation = useSaveAdminSubject();
  const deleteSubjectMutation = useDeleteAdminSubject();

  const subjects = subjectsQuery.subjects;
  const pagination = subjectsQuery.pagination;
  const selectedSubjectForModal = subjectDetailQuery.subject ?? selectedSubject;
  const isLoading = subjectsQuery.isLoading;
  const isDetailLoading =
    subjectDetailQuery.isLoading && Boolean(selectedSubject?.id);
  const isSaving = saveSubjectMutation.isPending;
  const isDeleting = deleteSubjectMutation.isPending;
  const errorMessage = subjectsQuery.error || subjectDetailQuery.error;

  const visibleRange = useMemo(() => {
    if (pagination.total === 0) {
      return "0";
    }

    const start = (pagination.page - 1) * pagination.limit + 1;
    const end = Math.min(pagination.page * pagination.limit, pagination.total);
    return `${start}-${end}`;
  }, [pagination]);

  const openCreate = useCallback(() => {
    setEditSubject(null);
    setDraft(emptyDraft);
    setFormErrorMessage("");
    setIsFormOpen(true);
  }, []);

  const openEdit = useCallback((subject: AdminSubjectItem) => {
    setEditSubject(subject);
    setDraft({
      name: subject.name,
      code: subject.code,
    });
    setFormErrorMessage("");
    setIsFormOpen(true);
  }, []);

  const openDetail = useCallback((subject: AdminSubjectItem) => {
    setSelectedSubject(subject);
  }, []);

  const handleSaveSubject = useCallback(async () => {
    if (!draft.name.trim() || !draft.code.trim()) {
      setFormErrorMessage("Vui lòng nhập đầy đủ tên và mã môn học.");
      return;
    }

    setFormErrorMessage("");

    try {
      await saveSubjectMutation.mutateAsync({
        id: editSubject?.id,
        values: draft,
      });
      Alert.alert(
        "Thành công",
        editSubject ? "Đã cập nhật môn học." : "Đã thêm môn học mới."
      );

      setIsFormOpen(false);
      setEditSubject(null);
      setDraft(emptyDraft);
      resetPage();
    } catch (error) {
      setFormErrorMessage(
        getErrorMessage(
          error,
          editSubject ? "Không thể cập nhật môn học." : "Không thể thêm môn học."
        )
      );
    }
  }, [draft, editSubject, resetPage, saveSubjectMutation]);

  const handleDeleteSubject = useCallback(
    (subject: AdminSubjectItem) => {
      Alert.alert(
        "Xóa môn học",
        `Môn học ${subject.name} (${subject.code}) sẽ bị xóa khỏi hệ thống.`,
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Xóa",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteSubjectMutation.mutateAsync(subject.id);
                Alert.alert("Thành công", "Đã xóa môn học.");
                setSelectedSubject(null);
                resetPage();
              } catch (error) {
                Alert.alert(
                  "Lỗi",
                  getErrorMessage(error, "Không thể xóa môn học.")
                );
              }
            },
          },
        ]
      );
    },
    [deleteSubjectMutation, resetPage]
  );

  const goToPage = useCallback(
    (nextPage: number) => {
      setPage(Math.min(Math.max(nextPage, 1), pagination.totalPages || 1));
    },
    [pagination.totalPages, setPage]
  );

  return (
    <ScreenSafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>Quản trị hệ thống</Text>
          <Text style={styles.title}>Môn học</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openCreate}>
          <Plus size={22} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.searchBar}>
          <Search size={18} color={colors.icon} />
          <TextInput
            autoCapitalize="none"
            onChangeText={(value) => {
              setQuery(value);
              resetPage();
            }}
            placeholder="Tìm theo tên hoặc mã môn học..."
            placeholderTextColor={colors.textSubtle}
            style={styles.searchInput}
            value={query}
          />
        </View>

        <View style={styles.resultHeader}>
          <View>
            <Text style={styles.resultTitle}>Danh sách môn học</Text>
            <Text style={styles.resultSubtitle}>
              Hiển thị {visibleRange} trên {pagination.total}
            </Text>
          </View>
          <View style={styles.pageBadge}>
            <Text style={styles.pageBadgeText}>
              {pagination.page}/{pagination.totalPages}
            </Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator color={colors.primary} size="small" />
            <Text style={styles.stateText}>Đang tải môn học...</Text>
          </View>
        ) : null}

        {!isLoading && errorMessage ? (
          <View style={styles.errorBox}>
            <AlertCircle size={18} color={colors.danger} />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => subjectsQuery.refresh()}
            >
              <RefreshCw size={16} color={colors.primary} />
              <Text style={styles.retryText}>Tải lại</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!isLoading && !errorMessage && subjects.length === 0 ? (
          <Text style={styles.emptyText}>Không tìm thấy môn học phù hợp.</Text>
        ) : null}

        {!isLoading && !errorMessage
          ? subjects.map((subject) => (
              <SubjectCard
                isDeleting={isDeleting}
                key={subject.id}
                onDelete={handleDeleteSubject}
                onEdit={openEdit}
                onPress={openDetail}
                subject={subject}
              />
            ))
          : null}

        {!isLoading && !errorMessage && pagination.totalPages > 1 ? (
          <View style={styles.pagination}>
            <TouchableOpacity
              disabled={pagination.page <= 1}
              onPress={() => goToPage(pagination.page - 1)}
              style={[
                styles.pageButton,
                pagination.page <= 1 && styles.pageButtonDisabled,
              ]}
            >
              <Text style={styles.pageButtonText}>Trước</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={pagination.page >= pagination.totalPages}
              onPress={() => goToPage(pagination.page + 1)}
              style={[
                styles.pageButton,
                pagination.page >= pagination.totalPages &&
                  styles.pageButtonDisabled,
              ]}
            >
              <Text style={styles.pageButtonText}>Sau</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>

      <SubjectDetailModal
        isDeleting={isDeleting}
        isLoading={isDetailLoading}
        onClose={() => setSelectedSubject(null)}
        onDelete={handleDeleteSubject}
        onEdit={openEdit}
        subject={selectedSubjectForModal}
      />

      <SubjectFormModal
        draft={draft}
        errorMessage={formErrorMessage}
        isSaving={isSaving}
        isUpdate={Boolean(editSubject)}
        onCancel={() => setIsFormOpen(false)}
        onChange={setDraft}
        onSave={handleSaveSubject}
        visible={isFormOpen}
      />
    </ScreenSafeAreaView>
  );
};

function SubjectCard({
  subject,
  isDeleting,
  onPress,
  onEdit,
  onDelete,
}: {
  subject: AdminSubjectItem;
  isDeleting: boolean;
  onPress: (subject: AdminSubjectItem) => void;
  onEdit: (subject: AdminSubjectItem) => void;
  onDelete: (subject: AdminSubjectItem) => void;
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      activeOpacity={0.78}
      onPress={() => onPress(subject)}
      style={styles.subjectCard}
    >
      <View style={styles.subjectIcon}>
        <BookOpen size={20} color={colors.primary} />
      </View>
      <View style={styles.subjectInfo}>
        <Text style={styles.subjectName} numberOfLines={1}>
          {subject.name}
        </Text>
        <Text style={styles.subjectCode}>Mã môn: {subject.code}</Text>
        <Text style={styles.subjectDate}>Tạo ngày {subject.createdAtLabel}</Text>
      </View>
      <View style={styles.iconColumn}>
        <View style={styles.iconRow}>
          <View style={styles.iconButton}>
            <Eye size={15} color={colors.icon} />
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={() => onEdit(subject)}>
            <Edit3 size={15} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          disabled={isDeleting}
          onPress={() => onDelete(subject)}
          style={[styles.iconButton, styles.deleteIconButton]}
        >
          <Trash2 size={15} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function SubjectDetailModal({
  subject,
  isLoading,
  isDeleting,
  onClose,
  onEdit,
  onDelete,
}: {
  subject: AdminSubjectItem | null;
  isLoading: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onEdit: (subject: AdminSubjectItem) => void;
  onDelete: (subject: AdminSubjectItem) => void;
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={Boolean(subject) || isLoading}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chi tiết môn học</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={colors.icon} />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.modalState}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.stateText}>Đang tải chi tiết...</Text>
            </View>
          ) : null}

          {!isLoading && subject ? (
            <>
              <View style={styles.detailHero}>
                <View style={styles.detailIcon}>
                  <BookOpen size={26} color={colors.primary} />
                </View>
                <Text style={styles.detailName}>{subject.name}</Text>
                <Text style={styles.detailCode}>{subject.code}</Text>
              </View>

              <DetailRow label="Mã môn học" value={subject.code} />
              <DetailRow label="Tên môn học" value={subject.name} />
              <DetailRow label="Ngày tạo" value={subject.createdAtLabel} />
              <DetailRow label="Cập nhật" value={subject.updatedAtLabel} />

              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => onEdit(subject)}
                >
                  <Edit3 size={18} color={colors.primary} />
                  <Text style={styles.secondaryButtonText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={isDeleting}
                  style={[styles.dangerButton, isDeleting && styles.disabledButton]}
                  onPress={() => onDelete(subject)}
                >
                  <Trash2 size={18} color={colors.onPrimary} />
                  <Text style={styles.dangerButtonText}>
                    {isDeleting ? "Đang xóa..." : "Xóa"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function SubjectFormModal({
  visible,
  draft,
  errorMessage,
  isSaving,
  isUpdate,
  onChange,
  onSave,
  onCancel,
}: {
  visible: boolean;
  draft: AdminSubjectFormValues;
  errorMessage: string;
  isSaving: boolean;
  isUpdate: boolean;
  onChange: (draft: AdminSubjectFormValues) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal animationType="slide" onRequestClose={onCancel} transparent visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalBackdrop}
      >
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
                {isUpdate ? "Cập nhật môn học" : "Thêm môn học"}
              </Text>
              <Text style={styles.modalSubtitle}>
                {isUpdate
                  ? "Thay đổi tên hoặc mã môn học."
                  : "Thêm môn học mới vào hệ thống."}
              </Text>
            </View>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <X size={20} color={colors.icon} />
            </TouchableOpacity>
          </View>

          {errorMessage ? (
            <Text style={styles.formErrorText}>{errorMessage}</Text>
          ) : null}

          <FormInput
            autoCapitalize="characters"
            label="Mã môn học"
            onChangeText={(code) => onChange({ ...draft, code })}
            placeholder="VD: MOB101"
            value={draft.code}
          />
          <FormInput
            label="Tên môn học"
            onChangeText={(name) => onChange({ ...draft, name })}
            placeholder="VD: Lập trình di động"
            value={draft.name}
          />

          <TouchableOpacity
            disabled={isSaving}
            style={[styles.primaryButton, isSaving && styles.disabledButton]}
            onPress={onSave}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.onPrimary} size="small" />
            ) : (
              <Save size={18} color={colors.onPrimary} />
            )}
            <Text style={styles.primaryButtonText}>
              {isSaving
                ? "Đang lưu..."
                : isUpdate
                  ? "Lưu thay đổi"
                  : "Tạo môn học"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  autoCapitalize?: "none" | "characters";
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSubtle}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const createStyles = (colors: AppThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: SCREEN_HEADER_TOP_PADDING,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    fontSize: 13,
    color: colors.textSubtle,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 110,
  },
  searchBar: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 10,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    color: colors.text,
  },
  resultHeader: {
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  resultSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSubtle,
  },
  pageBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.surfaceSubtle,
  },
  pageBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textMuted,
  },
  stateBox: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  stateText: {
    fontSize: 14,
    color: colors.textSubtle,
  },
  errorBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.dangerMuted,
    padding: 14,
    gap: 10,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.dangerText,
  },
  retryButton: {
    alignSelf: "flex-start",
    height: 38,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primaryMuted,
  },
  retryText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },
  emptyText: {
    paddingVertical: 24,
    fontSize: 14,
    textAlign: "center",
    color: colors.textSubtle,
  },
  subjectCard: {
    minHeight: 92,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  subjectIcon: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  subjectInfo: {
    flex: 1,
    minWidth: 0,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  subjectCode: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },
  subjectDate: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSubtle,
  },
  iconColumn: {
    alignItems: "flex-end",
    gap: 8,
    marginLeft: 10,
  },
  iconRow: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  deleteIconButton: {
    backgroundColor: colors.dangerMuted,
  },
  pagination: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  pageButton: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryMuted,
  },
  pageButtonDisabled: {
    opacity: 0.45,
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  modalCard: {
    maxHeight: "88%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: colors.surface,
    padding: 20,
  },
  modalHeader: {
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  modalSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSubtle,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  modalState: {
    minHeight: 160,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  detailHero: {
    alignItems: "center",
    marginBottom: 18,
  },
  detailIcon: {
    width: 68,
    height: 68,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryMuted,
    marginBottom: 10,
  },
  detailName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  detailCode: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "800",
    color: colors.primary,
  },
  detailRow: {
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textSubtle,
  },
  detailValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  modalActionRow: {
    marginTop: 18,
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.primaryMuted,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primary,
  },
  dangerButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.danger,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.onPrimary,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    marginBottom: 7,
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.text,
  },
  formErrorText: {
    marginBottom: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.dangerMuted,
    padding: 12,
    fontSize: 13,
    lineHeight: 19,
    color: colors.dangerText,
  },
  primaryButton: {
    height: 50,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.onPrimary,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

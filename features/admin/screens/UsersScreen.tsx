import {
  AlertCircle,
  Ban,
  Eye,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  UserPlus,
  X,
} from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  LayoutAnimation,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

import { ScreenSafeAreaView } from "@/components/screen-safe-area-view";
import { SCREEN_HEADER_TOP_PADDING } from "@/constants/safeArea";
import { useAppTheme, type AppThemeColors } from "@/features/theme";
import {
  useAdminAccountDetail,
  useAdminAccounts,
  useBanAdminAccount,
  useCreateAdminAccount,
} from "../hooks/useAdminQueries";
import type {
  AdminAccountItem,
  AdminAccountRole,
  AdminAccountStatus,
  CreateAdminAccountFormValues,
} from "../types";

const roleFilters: Array<{ label: string; value: "all" | AdminAccountRole }> = [
  { label: "Tất cả", value: "all" },
  { label: "Người dùng", value: "USER" },
  { label: "Kiểm duyệt", value: "MODERATOR" },
];

const statusFilters: Array<{
  label: string;
  value: "all" | AdminAccountStatus;
}> = [
  { label: "Tất cả", value: "all" },
  { label: "Hoạt động", value: "ACTIVE" },
  { label: "Chưa xác thực", value: "UNVERIFIED" },
  { label: "Đã khóa", value: "BANNED" },
];

const emptyDraft: CreateAdminAccountFormValues = {
  name: "",
  email: "",
  password: "",
  avatarUrl: "",
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const getStatusColors = (status: AdminAccountStatus, colors: AppThemeColors) => {
  switch (status) {
    case "ACTIVE":
      return { backgroundColor: colors.successMuted, color: colors.successText };
    case "UNVERIFIED":
      return { backgroundColor: colors.warningMuted, color: colors.warningText };
    case "BANNED":
      return { backgroundColor: colors.dangerMuted, color: colors.dangerText };
    default:
      return { backgroundColor: colors.surfaceSubtle, color: colors.textMuted };
  }
};

export const UsersScreen = () => {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | AdminAccountRole>(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | AdminAccountStatus
  >("all");
  const [selectedUser, setSelectedUser] = useState<AdminAccountItem | null>(
    null
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draft, setDraft] =
    useState<CreateAdminAccountFormValues>(emptyDraft);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const accountsQuery = useAdminAccounts();
  const selectedUserDetail = useAdminAccountDetail(selectedUser?.id);
  const createAccountMutation = useCreateAdminAccount();
  const banAccountMutation = useBanAdminAccount();

  const users = accountsQuery.users;
  const selectedUserForModal = selectedUserDetail.user ?? selectedUser;
  const isLoading = accountsQuery.isLoading;
  const isDetailLoading =
    selectedUserDetail.isLoading && Boolean(selectedUser?.id);
  const isSaving = createAccountMutation.isPending;
  const isBanning = banAccountMutation.isPending;
  const errorMessage = accountsQuery.error || selectedUserDetail.error;

  const activeRoleLabel = useMemo(() => {
    if (roleFilter === "all") return "";
    return roleFilters.find((f) => f.value === roleFilter)?.label || "";
  }, [roleFilter]);

  const activeStatusLabel = useMemo(() => {
    if (statusFilter === "all") return "";
    return statusFilters.find((f) => f.value === statusFilter)?.label || "";
  }, [statusFilter]);

  const toggleFilter = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsFilterExpanded((prev) => !prev);
  }, []);

  const handleClearRoleFilter = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRoleFilter("all");
  }, []);

  const handleClearStatusFilter = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStatusFilter("all");
  }, []);

  const handleClearAllFilters = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRoleFilter("all");
    setStatusFilter("all");
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return users.filter((user) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [query, roleFilter, statusFilter, users]);

  const openDetail = useCallback((user: AdminAccountItem) => {
    setSelectedUser(user);
  }, []);

  const handleCreateUser = useCallback(async () => {
    if (
      !draft.name.trim() ||
      !draft.email.trim() ||
      draft.password.trim().length < 8
    ) {
      setFormErrorMessage(
        "Vui lòng nhập tên, email và mật khẩu ít nhất 8 ký tự."
      );
      return;
    }

    setFormErrorMessage("");

    try {
      await createAccountMutation.mutateAsync(draft);
      setIsCreateOpen(false);
      setDraft(emptyDraft);
      Alert.alert("Thành công", "Đã tạo tài khoản kiểm duyệt viên.");
    } catch (error) {
      setFormErrorMessage(getErrorMessage(error, "Không thể tạo tài khoản."));
    }
  }, [createAccountMutation, draft]);

  const handleBanUser = useCallback(
    (user: AdminAccountItem) => {
      Alert.alert(
        "Khóa người dùng",
        `Tài khoản ${user.name} sẽ chuyển sang trạng thái đã khóa.`,
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Khóa",
            style: "destructive",
            onPress: async () => {
              try {
                await banAccountMutation.mutateAsync(user.id);
                Alert.alert("Thành công", "Đã khóa tài khoản.");
                setSelectedUser(null);
              } catch (error) {
                Alert.alert(
                  "Lỗi",
                  getErrorMessage(error, "Không thể khóa tài khoản.")
                );
              }
            },
          },
        ]
      );
    },
    [banAccountMutation]
  );

  return (
    <ScreenSafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>Quản trị hệ thống</Text>
          <Text style={styles.title}>Người dùng</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setFormErrorMessage("");
            setDraft(emptyDraft);
            setIsCreateOpen(true);
          }}
          activeOpacity={0.75}
        >
          <Plus size={22} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={18} color={colors.icon} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Tìm theo tên hoặc email..."
              placeholderTextColor={colors.textSubtle}
              style={styles.searchInput}
              autoCapitalize="none"
            />
            {query.length > 0 ? (
              <TouchableOpacity
                onPress={() => setQuery("")}
                style={styles.clearSearchButton}
                activeOpacity={0.7}
              >
                <X size={16} color={colors.icon} />
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity
            style={[
              styles.filterButton,
              (roleFilter !== "all" || statusFilter !== "all") && styles.filterButtonActive,
            ]}
            onPress={toggleFilter}
            activeOpacity={0.75}
          >
            <SlidersHorizontal
              size={18}
              color={
                roleFilter !== "all" || statusFilter !== "all"
                  ? colors.primary
                  : colors.icon
              }
            />
            {(roleFilter !== "all" || statusFilter !== "all") ? (
              <View style={styles.filterDot} />
            ) : null}
          </TouchableOpacity>
        </View>

        {isFilterExpanded ? (
          <View style={styles.filterContainer}>
            <FilterGroup
              label="Vai trò"
              options={roleFilters}
              value={roleFilter}
              onChange={(val) => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setRoleFilter(val);
              }}
            />
            <FilterGroup
              label="Trạng thái"
              options={statusFilters}
              value={statusFilter}
              onChange={(val) => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setStatusFilter(val);
              }}
            />
          </View>
        ) : null}

        {/* Active Filters Row */}
        {(roleFilter !== "all" || statusFilter !== "all") ? (
          <View style={styles.activeFiltersRow}>
            {roleFilter !== "all" ? (
              <View style={styles.activeFilterTag}>
                <Text style={styles.activeFilterTagText} numberOfLines={1}>
                  Vai trò: {activeRoleLabel}
                </Text>
                <TouchableOpacity
                  onPress={handleClearRoleFilter}
                  style={styles.activeFilterTagClose}
                  activeOpacity={0.7}
                >
                  <X size={12} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ) : null}

            {statusFilter !== "all" ? (
              <View style={styles.activeFilterTag}>
                <Text style={styles.activeFilterTagText} numberOfLines={1}>
                  Trạng thái: {activeStatusLabel}
                </Text>
                <TouchableOpacity
                  onPress={handleClearStatusFilter}
                  style={styles.activeFilterTagClose}
                  activeOpacity={0.7}
                >
                  <X size={12} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={handleClearAllFilters}
              style={styles.clearAllFilters}
              activeOpacity={0.7}
            >
              <Text style={styles.clearAllFiltersText}>Xóa lọc</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>Danh sách tài khoản</Text>
          <Text style={styles.resultCount}>
            {filteredUsers.length}/{users.length}
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator color={colors.primary} size="small" />
            <Text style={styles.stateText}>Đang tải người dùng...</Text>
          </View>
        ) : null}

        {!isLoading && errorMessage ? (
          <View style={styles.errorBox}>
            <AlertCircle size={18} color={colors.danger} />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => accountsQuery.refresh()}
            >
              <RefreshCw size={16} color={colors.primary} />
              <Text style={styles.retryText}>Tải lại</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!isLoading && !errorMessage && filteredUsers.length === 0 ? (
          <Text style={styles.emptyText}>Không có tài khoản phù hợp.</Text>
        ) : null}

        {!isLoading && !errorMessage
          ? filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                isBanning={isBanning}
                onBan={handleBanUser}
                onPress={openDetail}
                user={user}
              />
            ))
          : null}
      </ScrollView>

      <UserDetailModal
        isLoading={isDetailLoading}
        isBanning={isBanning}
        onBan={handleBanUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUserForModal}
      />

      <CreateUserModal
        draft={draft}
        errorMessage={formErrorMessage}
        isSaving={isSaving}
        onCancel={() => setIsCreateOpen(false)}
        onChange={setDraft}
        onSave={handleCreateUser}
        visible={isCreateOpen}
      />
    </ScreenSafeAreaView>
  );
};

function FilterGroup<TValue extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ label: string; value: TValue }>;
  value: TValue;
  onChange: (value: TValue) => void;
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.filterGroup}>
      <Text style={styles.filterLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chipRow}>
          {options.map((option) => {
            const isActive = value === option.value;

            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => onChange(option.value)}
                activeOpacity={0.75}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

function UserCard({
  user,
  isBanning,
  onPress,
  onBan,
}: {
  user: AdminAccountItem;
  isBanning: boolean;
  onPress: (user: AdminAccountItem) => void;
  onBan: (user: AdminAccountItem) => void;
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const statusColors = getStatusColors(user.status, colors);

  return (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => onPress(user)}
      activeOpacity={0.78}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.initials}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {user.name}
        </Text>
        <Text style={styles.userEmail} numberOfLines={1}>
          {user.email}
        </Text>
        <Text style={styles.userMeta}>{user.roleLabel}</Text>
      </View>
      <View style={styles.cardActions}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors.backgroundColor },
          ]}
        >
          <Text style={[styles.statusText, { color: statusColors.color }]}>
            {user.statusLabel}
          </Text>
        </View>
        <View style={styles.iconRow}>
          <View style={styles.iconButton}>
            <Eye size={15} color={colors.icon} />
          </View>
          {user.canBan ? (
            <TouchableOpacity
              disabled={isBanning}
              onPress={() => onBan(user)}
              style={styles.iconButton}
            >
              <Ban size={15} color={colors.danger} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function UserDetailModal({
  user,
  isLoading,
  isBanning,
  onClose,
  onBan,
}: {
  user: AdminAccountItem | null;
  isLoading: boolean;
  isBanning: boolean;
  onClose: () => void;
  onBan: (user: AdminAccountItem) => void;
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={Boolean(user) || isLoading}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chi tiết tài khoản</Text>
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

          {!isLoading && user ? (
            <>
              <View style={styles.detailHero}>
                <View style={styles.detailAvatar}>
                  <Text style={styles.detailAvatarText}>{user.initials}</Text>
                </View>
                <Text style={styles.detailName}>{user.name}</Text>
                <Text style={styles.detailEmail}>{user.email}</Text>
              </View>

              <DetailRow label="Vai trò" value={user.roleLabel} />
              <DetailRow label="Trạng thái" value={user.statusLabel} />
              <DetailRow label="Ngày tạo" value={user.createdAtLabel} />
              <DetailRow label="Cập nhật" value={user.updatedAtLabel} />

              {user.canBan ? (
                <TouchableOpacity
                  disabled={isBanning}
                  style={[styles.dangerButton, isBanning && styles.disabledButton]}
                  onPress={() => onBan(user)}
                  activeOpacity={0.75}
                >
                  <Ban size={18} color={colors.onPrimary} />
                  <Text style={styles.dangerButtonText}>
                    {isBanning ? "Đang khóa..." : "Khóa tài khoản"}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function CreateUserModal({
  visible,
  draft,
  errorMessage,
  isSaving,
  onChange,
  onSave,
  onCancel,
}: {
  visible: boolean;
  draft: CreateAdminAccountFormValues;
  errorMessage: string;
  isSaving: boolean;
  onChange: (draft: CreateAdminAccountFormValues) => void;
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
              <Text style={styles.modalTitle}>Thêm kiểm duyệt viên</Text>
              <Text style={styles.modalSubtitle}>
                Tài khoản mới sẽ được kích hoạt ngay.
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
            label="Họ và tên"
            onChangeText={(name) => onChange({ ...draft, name })}
            placeholder="VD: Nguyễn Văn A"
            value={draft.name}
          />
          <FormInput
            autoCapitalize="none"
            keyboardType="email-address"
            label="Email"
            onChangeText={(email) => onChange({ ...draft, email })}
            placeholder="moderator@example.com"
            value={draft.email}
          />
          <FormInput
            label="Mật khẩu"
            onChangeText={(password) => onChange({ ...draft, password })}
            placeholder="Tối thiểu 8 ký tự"
            secureTextEntry
            value={draft.password}
          />
          <FormInput
            autoCapitalize="none"
            keyboardType="url"
            label="Ảnh đại diện"
            onChangeText={(avatarUrl) => onChange({ ...draft, avatarUrl })}
            placeholder="https://example.com/avatar.png"
            value={draft.avatarUrl ?? ""}
          />

          <TouchableOpacity
            disabled={isSaving}
            style={[styles.primaryButton, isSaving && styles.disabledButton]}
            onPress={onSave}
            activeOpacity={0.75}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.onPrimary} size="small" />
            ) : (
              <UserPlus size={18} color={colors.onPrimary} />
            )}
            <Text style={styles.primaryButtonText}>
              {isSaving ? "Đang tạo..." : "Tạo tài khoản"}
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
  keyboardType,
  secureTextEntry,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  autoCapitalize?: "none";
  keyboardType?: "default" | "email-address" | "url";
  secureTextEntry?: boolean;
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSubtle}
        secureTextEntry={secureTextEntry}
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
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    color: colors.text,
  },
  clearSearchButton: {
    padding: 4,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  filterButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  filterDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  filterContainer: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    gap: 4,
  },
  filterGroup: {
    marginBottom: 10,
  },
  filterLabel: {
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "800",
    color: colors.textSubtle,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 8,
  },
  activeFiltersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  activeFilterTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    paddingLeft: 8,
    paddingRight: 4,
    paddingVertical: 4,
    gap: 6,
  },
  activeFilterTagText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  activeFilterTagClose: {
    padding: 2,
    borderRadius: 4,
    backgroundColor: colors.surface,
  },
  clearAllFilters: {
    marginLeft: "auto",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearAllFiltersText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    textDecorationLine: "underline",
  },
  chip: {
    minHeight: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSubtle,
  },
  chipTextActive: {
    color: colors.primary,
  },
  resultHeader: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  resultCount: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.textSubtle,
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
  userCard: {
    minHeight: 86,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.text,
  },
  userEmail: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSubtle,
  },
  userMeta: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
  },
  cardActions: {
    alignItems: "flex-end",
    marginLeft: 10,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },
  iconRow: {
    marginTop: 8,
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
  detailAvatar: {
    width: 68,
    height: 68,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryMuted,
    marginBottom: 10,
  },
  detailAvatarText: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.primary,
  },
  detailName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  detailEmail: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textSubtle,
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
  dangerButton: {
    height: 48,
    borderRadius: 8,
    marginTop: 18,
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
  disabledButton: {
    opacity: 0.7,
  },
});

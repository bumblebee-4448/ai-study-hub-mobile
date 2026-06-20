import type {
  AdminAccountItem,
  AdminAccountRole,
  AdminAccountStatus,
  AdminDashboardStats,
  AdminStatusTone,
  AdminSubjectItem,
  AdminSubjectListResponse,
  AdminSubjectFormValues,
  AdminSubjectPayload,
  BackendAdminAccount,
  BackendAdminSubject,
  CreateAdminAccountFormValues,
  CreateAdminAccountPayload,
} from "../types";

const ROLE_LABELS: Record<AdminAccountRole, string> = {
  ADMIN: "Quản trị viên",
  MODERATOR: "Kiểm duyệt viên",
  USER: "Người dùng",
};

const STATUS_LABELS: Record<AdminAccountStatus, string> = {
  ACTIVE: "Đang hoạt động",
  BANNED: "Đã khóa",
  UNVERIFIED: "Chưa xác thực",
  DELETED: "Đã xóa",
};

const STATUS_TONES: Record<AdminAccountStatus, AdminStatusTone> = {
  ACTIVE: "success",
  BANNED: "error",
  UNVERIFIED: "warning",
  DELETED: "neutral",
};

const optionalString = (value?: string | null) => {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
};

const numberOrZero = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

export const formatAdminDate = (
  value?: string | null,
  fallback = "Chưa có dữ liệu"
) => {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const getAdminAccountRoleLabel = (role: AdminAccountRole) =>
  ROLE_LABELS[role] ?? role;

export const getAdminAccountStatusLabel = (status: AdminAccountStatus) =>
  STATUS_LABELS[status] ?? status;

export const getAdminAccountStatusTone = (
  status: AdminAccountStatus
): AdminStatusTone => STATUS_TONES[status] ?? "neutral";

export const getInitials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "?";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

export const mapAdminDashboardStats = (
  stats: Partial<AdminDashboardStats> | null | undefined
): AdminDashboardStats => ({
  accounts: {
    total: numberOrZero(stats?.accounts?.total),
    active: numberOrZero(stats?.accounts?.active),
    banned: numberOrZero(stats?.accounts?.banned),
    unverified: numberOrZero(stats?.accounts?.unverified),
  },
  subjects: {
    total: numberOrZero(stats?.subjects?.total),
  },
  documents: {
    total: numberOrZero(stats?.documents?.total),
    active: numberOrZero(stats?.documents?.active),
    pending: numberOrZero(stats?.documents?.pending),
    rejected: numberOrZero(stats?.documents?.rejected),
  },
});

export const mapAdminAccount = (
  account: BackendAdminAccount
): AdminAccountItem => {
  const createdAt = optionalString(account.createdAt);
  const updatedAt = optionalString(account.updatedAt);

  return {
    id: account.id,
    name: account.name,
    email: account.email,
    avatarUrl: optionalString(account.avatarUrl),
    role: account.role,
    roleLabel: getAdminAccountRoleLabel(account.role),
    status: account.status,
    statusLabel: getAdminAccountStatusLabel(account.status),
    statusTone: getAdminAccountStatusTone(account.status),
    createdAt,
    createdAtLabel: formatAdminDate(createdAt),
    updatedAt,
    updatedAtLabel: formatAdminDate(updatedAt, "Chưa cập nhật"),
    initials: getInitials(account.name),
    canBan: account.role !== "ADMIN" && account.status === "ACTIVE",
  };
};

export const mapAdminAccounts = (
  accounts: readonly BackendAdminAccount[] | null | undefined
) => (accounts ?? []).map(mapAdminAccount);

export const mapAdminSubject = (
  subject: BackendAdminSubject
): AdminSubjectItem => {
  const createdAt = optionalString(subject.createdAt);
  const updatedAt = optionalString(subject.updatedAt);

  return {
    id: subject.id,
    name: subject.name,
    code: subject.code,
    schoolId: optionalString(subject.schoolId),
    createdAt,
    createdAtLabel: formatAdminDate(createdAt),
    updatedAt,
    updatedAtLabel: formatAdminDate(updatedAt, "Chưa cập nhật"),
  };
};

export const mapAdminSubjectListResponse = (response: {
  subjects?: readonly BackendAdminSubject[];
  pagination?: Partial<AdminSubjectListResponse["pagination"]>;
}): AdminSubjectListResponse => ({
  subjects: (response.subjects ?? []).map(mapAdminSubject),
  pagination: {
    page: numberOrZero(response.pagination?.page) || 1,
    limit: numberOrZero(response.pagination?.limit) || 10,
    total: numberOrZero(response.pagination?.total),
    totalPages: numberOrZero(response.pagination?.totalPages) || 1,
  },
});

export const buildCreateAdminAccountPayload = (
  values: CreateAdminAccountFormValues
): CreateAdminAccountPayload => {
  const avatarUrl = optionalString(values.avatarUrl);

  return {
    name: values.name.trim(),
    email: values.email.trim(),
    password: values.password,
    role: "MODERATOR",
    status: "ACTIVE",
    ...(avatarUrl ? { avatarUrl } : {}),
  };
};

export const buildAdminSubjectPayload = (
  values: AdminSubjectFormValues
): AdminSubjectPayload => ({
  name: values.name.trim(),
  code: values.code.trim().toUpperCase(),
});

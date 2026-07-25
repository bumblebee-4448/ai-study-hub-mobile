export interface AdminStats {
  totalUsers: number;
  totalDocs: number;
  totalFeedbacks: number;
  totalViews: number;
  userGrowth: number[];
}

export interface UserAdmin {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'student' | 'teacher';
  joinedDate: string;
  status: 'active' | 'blocked' | 'pending';
  avatar?: string;
}

export interface SystemSettings {
  appName: string;
  logoUrl?: string;
  adminEmail: string;
}

export type AdminAccountRole = "ADMIN" | "MODERATOR" | "USER";
export type AdminAccountStatus =
  | "ACTIVE"
  | "BANNED"
  | "UNVERIFIED"
  | "DELETED";

export type AdminStatusTone = "success" | "warning" | "error" | "neutral";

export interface AdminDashboardStats {
  accounts: {
    total: number;
    active: number;
    banned: number;
    unverified: number;
  };
  subjects: {
    total: number;
  };
  documents: {
    total: number;
    active: number;
    pending: number;
    rejected: number;
  };
}

export interface BackendAdminAccount {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  role: AdminAccountRole;
  status: AdminAccountStatus;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AdminAccountItem {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: AdminAccountRole;
  roleLabel: string;
  status: AdminAccountStatus;
  statusLabel: string;
  statusTone: AdminStatusTone;
  createdAt?: string;
  createdAtLabel: string;
  updatedAt?: string;
  updatedAtLabel: string;
  initials: string;
  canBan: boolean;
}

export interface CreateAdminAccountFormValues {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

export interface CreateAdminAccountPayload {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
  role: "MODERATOR";
  status: "ACTIVE";
}

export interface FetchAdminAccountsParams {
  createdFrom?: string;
  createdTo?: string;
}

export interface BackendAdminSubject {
  id: string;
  name: string;
  code: string;
  schoolId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AdminSubjectItem {
  id: string;
  name: string;
  code: string;
  schoolId?: string;
  createdAt?: string;
  createdAtLabel: string;
  updatedAt?: string;
  updatedAtLabel: string;
}

export interface FetchAdminSubjectsParams {
  page?: number;
  limit?: number;
  search?: string;
  schoolId?: string;
}

export interface AdminSubjectPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminSubjectListResponse {
  subjects: AdminSubjectItem[];
  pagination: AdminSubjectPagination;
}

export interface AdminSubjectFormValues {
  name: string;
  code: string;
}

export interface AdminSubjectPayload {
  name: string;
  code: string;
}

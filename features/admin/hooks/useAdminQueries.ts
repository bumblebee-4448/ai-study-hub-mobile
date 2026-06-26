import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adminKeys } from "@/services/api/queryKeys";
import { getQueryErrorMessage } from "@/services/api/queryState";

import {
  banAdminAccount,
  createAdminAccount,
  createAdminSubject,
  deleteAdminSubject,
  fetchAdminAccountDetail,
  fetchAdminAccounts,
  fetchAdminDashboardStats,
  fetchAdminSubjectDetail,
  fetchAdminSubjects,
  updateAdminSubject,
} from "../services/adminApi";
import { mapAdminDashboardStats } from "../services/adminMappers";
import type {
  AdminDashboardStats,
  AdminSubjectFormValues,
  AdminSubjectItem,
  AdminSubjectPagination,
  CreateAdminAccountFormValues,
  FetchAdminAccountsParams,
  FetchAdminSubjectsParams,
} from "../types";

const EMPTY_STATS: AdminDashboardStats = mapAdminDashboardStats(null);

const EMPTY_SUBJECT_PAGINATION: AdminSubjectPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
};

export const useAdminDashboard = () => {
  const query = useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: async () => {
      const [stats, accounts] = await Promise.all([
        fetchAdminDashboardStats(),
        fetchAdminAccounts(),
      ]);

      return {
        stats,
        recentUsers: accounts.slice(0, 4),
      };
    },
    staleTime: 60 * 1000,
  });

  return {
    stats: query.data?.stats ?? EMPTY_STATS,
    recentUsers: query.data?.recentUsers ?? [],
    isLoading: query.isLoading || query.isRefetching,
    error: query.isError
      ? getQueryErrorMessage(query.error, "Không thể tải dữ liệu trang chủ.")
      : "",
    refresh: query.refetch,
  };
};

export const useAdminAccounts = (params: FetchAdminAccountsParams = {}) => {
  const query = useQuery({
    queryKey: adminKeys.accounts(params),
    queryFn: () => fetchAdminAccounts(params),
    staleTime: 60 * 1000,
  });

  return {
    users: query.data ?? [],
    isLoading: query.isLoading || query.isRefetching,
    error: query.isError
      ? getQueryErrorMessage(query.error, "Không thể tải danh sách người dùng.")
      : "",
    refresh: query.refetch,
  };
};

export const useAdminAccountDetail = (id?: string | null) => {
  const query = useQuery({
    queryKey: adminKeys.accountDetail(id ?? ""),
    queryFn: () => fetchAdminAccountDetail(id ?? ""),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });

  return {
    user: query.data ?? null,
    isLoading: query.isLoading || query.isRefetching,
    error: query.isError
      ? getQueryErrorMessage(query.error, "Không thể tải chi tiết tài khoản.")
      : "",
    refresh: query.refetch,
  };
};

export const useCreateAdminAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateAdminAccountFormValues) =>
      createAdminAccount(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
};

export const useBanAdminAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => banAdminAccount(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
};

export const useAdminSubjects = (params: FetchAdminSubjectsParams = {}) => {
  const query = useQuery({
    queryKey: adminKeys.subjects(params),
    queryFn: () => fetchAdminSubjects(params),
    staleTime: 60 * 1000,
  });

  return {
    subjects: query.data?.subjects ?? [],
    pagination: query.data?.pagination ?? EMPTY_SUBJECT_PAGINATION,
    isLoading: query.isLoading || query.isRefetching,
    error: query.isError
      ? getQueryErrorMessage(query.error, "Không thể tải danh sách môn học.")
      : "",
    refresh: query.refetch,
  };
};

export const useAdminSubjectDetail = (id?: string | null) => {
  const query = useQuery({
    queryKey: adminKeys.subjectDetail(id ?? ""),
    queryFn: () => fetchAdminSubjectDetail(id ?? ""),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });

  return {
    subject: query.data ?? null,
    isLoading: query.isLoading || query.isRefetching,
    error: query.isError
      ? getQueryErrorMessage(query.error, "Không thể tải chi tiết môn học.")
      : "",
    refresh: query.refetch,
  };
};

export const useSaveAdminSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id?: string;
      values: AdminSubjectFormValues;
    }): Promise<AdminSubjectItem> =>
      id ? updateAdminSubject(id, values) : createAdminSubject(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
};

export const useDeleteAdminSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminSubject(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
};

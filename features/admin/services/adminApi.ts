import { apiClient } from "@/services/api/axiosClient";

import type {
  AdminAccountItem,
  AdminDashboardStats,
  AdminSubjectFormValues,
  AdminSubjectItem,
  AdminSubjectListResponse,
  BackendAdminAccount,
  BackendAdminSubject,
  CreateAdminAccountFormValues,
  FetchAdminAccountsParams,
  FetchAdminSubjectsParams,
} from "../types";
import {
  buildAdminSubjectPayload,
  buildCreateAdminAccountPayload,
  mapAdminAccount,
  mapAdminAccounts,
  mapAdminDashboardStats,
  mapAdminSubject,
  mapAdminSubjectListResponse,
} from "./adminMappers";

export const fetchAdminDashboardStats =
  async (): Promise<AdminDashboardStats> => {
    const response = await apiClient.get<unknown, AdminDashboardStats>(
      "/admin/dashboard",
      { skipAlert: true }
    );

    return mapAdminDashboardStats(response);
  };

export const fetchAdminAccounts = async (
  params: FetchAdminAccountsParams = {}
): Promise<AdminAccountItem[]> => {
  const response = await apiClient.get<unknown, BackendAdminAccount[]>(
    "/accounts",
    {
      params: {
        ...(params.createdFrom ? { createdFrom: params.createdFrom } : {}),
        ...(params.createdTo ? { createdTo: params.createdTo } : {}),
      },
      skipAlert: true,
    }
  );

  return mapAdminAccounts(response);
};

export const fetchAdminAccountDetail = async (
  id: string
): Promise<AdminAccountItem> => {
  const response = await apiClient.get<unknown, BackendAdminAccount>(
    `/accounts/${id}`,
    { skipAlert: true }
  );

  return mapAdminAccount(response);
};

export const createAdminAccount = async (
  values: CreateAdminAccountFormValues
): Promise<unknown> => {
  return apiClient.post(
    "/accounts",
    buildCreateAdminAccountPayload(values),
    { skipAlert: true }
  );
};

export const banAdminAccount = async (id: string): Promise<unknown> => {
  return apiClient.patch(`/accounts/${id}/ban`, undefined, {
    skipAlert: true,
  });
};

export const fetchAdminSubjects = async (
  params: FetchAdminSubjectsParams = {}
): Promise<AdminSubjectListResponse> => {
  const response = await apiClient.get<
    unknown,
    {
      subjects?: BackendAdminSubject[];
      pagination?: AdminSubjectListResponse["pagination"];
    }
  >("/subjects", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      ...(params.schoolId ? { schoolId: params.schoolId } : {}),
      ...(params.search ? { search: params.search } : {}),
    },
    skipAlert: true,
  });

  return mapAdminSubjectListResponse(response ?? {});
};

export const fetchAdminSubjectDetail = async (
  id: string
): Promise<AdminSubjectItem> => {
  const response = await apiClient.get<unknown, BackendAdminSubject>(
    `/subjects/${id}`,
    { skipAlert: true }
  );

  return mapAdminSubject(response);
};

export const createAdminSubject = async (
  values: AdminSubjectFormValues
): Promise<AdminSubjectItem> => {
  const response = await apiClient.post<unknown, BackendAdminSubject>(
    "/subjects",
    buildAdminSubjectPayload(values),
    { skipAlert: true }
  );

  return mapAdminSubject(response);
};

export const updateAdminSubject = async (
  id: string,
  values: AdminSubjectFormValues
): Promise<AdminSubjectItem> => {
  const response = await apiClient.patch<unknown, BackendAdminSubject>(
    `/subjects/${id}`,
    buildAdminSubjectPayload(values),
    { skipAlert: true }
  );

  return mapAdminSubject(response);
};

export const deleteAdminSubject = async (id: string): Promise<unknown> => {
  return apiClient.delete(`/subjects/${id}`, { skipAlert: true });
};

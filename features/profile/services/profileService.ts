import axios from "axios";

import { apiClient } from "@/services/api/axiosClient";

import type {
  BackendProfile,
  UpdateProfileFormValues,
  UserProfile,
} from "../types";
import {
  buildUpdateProfilePayload,
  mapBackendProfileToUserProfile,
} from "./profileMappers";

export const fetchCurrentProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<unknown, BackendProfile>("/auth/me", {
    skipAlert: true,
  });

  return mapBackendProfileToUserProfile(response);
};

export const updateCurrentProfile = async (
  profileId: string,
  values: UpdateProfileFormValues
): Promise<UserProfile> => {
  await apiClient.patch(`/accounts/${profileId}`, buildUpdateProfilePayload(values), {
    skipAlert: true,
  });

  return fetchCurrentProfile();
};

export const getProfileErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    const message =
      data?.errors?.originalMessage ||
      data?.errors?.detail ||
      data?.errors?.rootCauseDetail ||
      (data?.message !== "An unexpected error occurred" ? data?.message : null) ||
      data?.Message;

    if (message) {
      return Array.isArray(message) ? message.join("\n") : String(message);
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Không thể tải hồ sơ. Vui lòng thử lại.";
};

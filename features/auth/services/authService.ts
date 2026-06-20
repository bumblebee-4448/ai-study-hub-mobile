import axios from "axios";

import { apiClient } from "@/services/api/axiosClient";
import type { UserProfile } from "@/features/profile/types";
import type { LoginFormType } from "../schemas/authSchema";
import type { User, UserRole } from "../types";
import { getOrCreateDeviceId } from "./deviceIdService";
import {
  getHomeRouteForRole,
  mapBackendRole,
  mapCurrentUserToAuthUser,
  mapCurrentUserToProfile,
} from "./authMappers";
import type { CurrentUserResponse } from "./authMappers";

interface MobileSigninResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
  user: User;
  profile: UserProfile;
  homeRoute: string;
}

const assertTokenResponse = (
  response: MobileSigninResponse
): MobileSigninResponse => {
  if (!response?.accessToken || !response?.refreshToken) {
    throw new Error("Phản hồi đăng nhập không hợp lệ.");
  }

  return response;
};

export const loginWithEmail = async (
  credentials: LoginFormType
): Promise<LoginResult> => {
  const deviceId = await getOrCreateDeviceId();
  const email = credentials.email.trim().toLowerCase();

  const tokenResponse = await apiClient.post<unknown, MobileSigninResponse>(
    "/auth/mobile-signin",
    {
      email,
      password: credentials.password,
      deviceId,
    },
    { skipAlert: true }
  );
  const { accessToken, refreshToken } = assertTokenResponse(tokenResponse);

  const currentUser = await apiClient.get<unknown, CurrentUserResponse>(
    "/auth/me",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      skipAlert: true,
    }
  );
  const role = mapBackendRole(currentUser.role);

  return {
    accessToken,
    refreshToken,
    role,
    user: mapCurrentUserToAuthUser(currentUser),
    profile: mapCurrentUserToProfile(currentUser),
    homeRoute: getHomeRouteForRole(role),
  };
};

export const getAuthErrorMessage = (error: unknown) => {
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

  if (error instanceof Error) {
    return error.message;
  }

  return "Không thể đăng nhập, vui lòng thử lại.";
};

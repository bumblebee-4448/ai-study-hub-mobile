import axios from "axios";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useProfileStore } from "@/features/profile/store/profileStore";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAlert?: boolean;
  }
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.example.com";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh Token Queue Pattern
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => {
    if (token) p.resolve(token);
    else p.reject(error);
  });
  failedQueue = [];
};

// Response Interceptor: Handle Refresh Token & Normalization
apiClient.interceptors.response.use(
  (response) => {
    return response.data?.data !== undefined ? response.data.data : response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const isAuthRelated = originalRequest.url?.includes("/auth/");
    const is401 = error.response?.status === 401;
    const notRetriedYet = !originalRequest._retry;

    if (is401 && !isAuthRelated && notRetriedYet) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call the refresh API using plain axios to avoid infinite loops
        const res = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = res.data?.data?.accessToken ?? res.data?.accessToken;
        const newRefreshToken = res.data?.data?.refreshToken ?? res.data?.refreshToken ?? refreshToken;

        // Save new credentials to the store
        const authState = useAuthStore.getState();
        authState.setAuth(
          newAccessToken,
          authState.role!,
          authState.user || undefined,
          newRefreshToken
        );

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Log out on refresh failure
        useAuthStore.getState().logout();
        useProfileStore.getState().clearProfile();
        
        if (!originalRequest.skipAlert) {
          Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại.");
        }
        
        router.replace("/login");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Common error handling
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (originalRequest.skipAlert) {
      return Promise.reject(error);
    }

    // Normalize error message
    const data = error.response?.data;
    const message =
      data?.errors?.originalMessage ||
      data?.errors?.detail ||
      data?.errors?.rootCauseDetail ||
      (data?.message !== "An unexpected error occurred" ? data?.message : null) || 
      data?.Message || 
      (error.code === "ECONNABORTED" ? "Kết nối quá hạn, vui lòng thử lại" : error.message) || 
      "Đã có lỗi xảy ra";

    if (!isAuthRelated) {
      Alert.alert("Lỗi kết nối", message);
    }

    return Promise.reject(error);
  }
);

import NetInfo from "@react-native-community/netinfo";
import {
  QueryClient,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { AppState, Platform } from "react-native";

const isServerError = (error: unknown) => {
  const status = (error as { response?: { status?: number } })?.response?.status;
  return !status || status >= 500;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: (failureCount, error) => failureCount < 2 && isServerError(error),
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: false,
    },
  },
});

let queryManagersConfigured = false;

export const configureQueryManagers = () => {
  if (queryManagersConfigured) {
    return;
  }

  queryManagersConfigured = true;

  onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((state) => {
      setOnline(Boolean(state.isConnected));
    })
  );

  focusManager.setEventListener((handleFocus) => {
    const subscription = AppState.addEventListener("change", (status) => {
      if (Platform.OS !== "web") {
        handleFocus(status === "active");
      }
    });

    return () => subscription.remove();
  });
};

import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/store/authStore";
import { chatKeys } from "@/services/api/queryKeys";
import { fetchChatReadyDocuments } from "../services/chatService";

export const useChatReadyDocuments = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const query = useQuery({
    queryKey: chatKeys.readyDocuments(),
    queryFn: fetchChatReadyDocuments,
    enabled: hasHydrated && Boolean(accessToken),
    staleTime: 30 * 1000,
    refetchInterval: (query) =>
      query.state.data && query.state.data.length > 0 ? false : 5000,
  });

  return {
    documents: query.data ?? [],
    isLoading: query.isLoading,
    isRefreshing: query.isRefetching,
    error: query.error,
    refresh: query.refetch,
  };
};

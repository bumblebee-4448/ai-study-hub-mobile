import { useQuery } from "@tanstack/react-query";

import { chatKeys } from "@/services/api/queryKeys";
import { fetchChatReadyDocuments } from "../services/chatService";

export const useChatReadyDocuments = () => {
  const query = useQuery({
    queryKey: chatKeys.readyDocuments(),
    queryFn: fetchChatReadyDocuments,
    staleTime: 30 * 1000,
  });

  return {
    documents: query.data ?? [],
    isLoading: query.isLoading,
    isRefreshing: query.isRefetching,
    error: query.error,
    refresh: query.refetch,
  };
};

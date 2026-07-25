import { useMutation, useQueryClient } from "@tanstack/react-query";

import { chatKeys } from "@/services/api/queryKeys";
import { sendChatMessage } from "../services/chatService";

export const useSendChatMessage = (sessionId: string | null) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (content: string) => {
      if (!sessionId) {
        return Promise.reject(new Error("Chat session is not ready"));
      }

      return sendChatMessage(sessionId, content);
    },
    onSuccess: async (exchange) => {
      queryClient.setQueryData(
        chatKeys.messages(exchange.session.id),
        (messages: (typeof exchange.userMessage)[] | undefined) => [
          ...(messages ?? []),
          exchange.userMessage,
          exchange.message,
        ],
      );
      await queryClient.invalidateQueries({
        queryKey: chatKeys.sessions(exchange.session.documentId),
      });
    },
  });

  return mutation;
};

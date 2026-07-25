import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import { chatKeys } from "@/services/api/queryKeys";
import {
  createDocumentChatSession,
  fetchChatMessages,
  fetchDocumentChatSessions,
} from "../services/chatService";

export const useDocumentChat = (documentId: string) => {
  const queryClient = useQueryClient();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const sessionsQuery = useQuery({
    queryKey: chatKeys.sessions(documentId),
    queryFn: () => fetchDocumentChatSessions(documentId),
    enabled: Boolean(documentId),
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (activeSessionId || !sessionsQuery.data) return;
    setActiveSessionId(sessionsQuery.data[0]?.id ?? null);
  }, [activeSessionId, sessionsQuery.data]);

  const messagesQuery = useQuery({
    queryKey: chatKeys.messages(activeSessionId ?? ""),
    queryFn: () => fetchChatMessages(activeSessionId as string),
    enabled: Boolean(activeSessionId),
  });

  const createSessionMutation = useMutation({
    mutationFn: () => createDocumentChatSession(documentId),
    onSuccess: async (session) => {
      setActiveSessionId(session.id);
      await queryClient.invalidateQueries({
        queryKey: chatKeys.sessions(documentId),
      });
    },
  });

  const createNewSession = useCallback(async () => {
    const session = await createSessionMutation.mutateAsync();
    setActiveSessionId(session.id);
    queryClient.setQueryData(chatKeys.messages(session.id), []);
    return session;
  }, [createSessionMutation, queryClient]);

  const selectSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId);
  }, []);

  return {
    sessions: sessionsQuery.data ?? [],
    activeSessionId,
    messages: messagesQuery.data ?? [],
    isLoadingSessions: sessionsQuery.isLoading,
    isLoadingMessages: messagesQuery.isLoading,
    isCreatingSession: createSessionMutation.isPending,
    sessionError: sessionsQuery.error,
    messageError: messagesQuery.error,
    createNewSession,
    selectSession,
    refreshMessages: messagesQuery.refetch,
  };
};

import { apiClient } from "@/services/api/axiosClient";

import type {
  ChatExchange,
  ChatMessage,
  ChatReadyDocument,
  ChatSession,
} from "../types";
import {
  mapChatExchange,
  mapChatMessage,
  mapChatReadyDocument,
  mapChatSession,
} from "./chatMappers";

const CHAT_ERROR_FALLBACK = "Vượt quá quota hằng ngày.";

interface BackendChatReadyDocumentsResponse {
  documents?: unknown[];
}

interface BackendChatSessionsResponse {
  sessions?: unknown[];
}

interface BackendChatMessagesResponse {
  messages?: unknown[];
}

interface BackendChatExchangeResponse {
  session: unknown;
  userMessage: unknown;
  message: unknown;
}

export const fetchChatReadyDocuments = async (): Promise<
  ChatReadyDocument[]
> => {
  const response = await apiClient.get<
    unknown,
    BackendChatReadyDocumentsResponse
  >("/documents/me/chat-ready", { skipAlert: true });

  return (response.documents ?? []).map((document) =>
    mapChatReadyDocument(document as any),
  );
};

export const fetchDocumentChatSessions = async (
  documentId: string,
): Promise<ChatSession[]> => {
  const response = await apiClient.get<unknown, BackendChatSessionsResponse>(
    `/documents/${documentId}/chat/sessions`,
    { skipAlert: true },
  );

  return (response.sessions ?? []).map((session) =>
    mapChatSession(session as any),
  );
};

export const createDocumentChatSession = async (
  documentId: string,
): Promise<ChatSession> => {
  const response = await apiClient.post<unknown, { session: unknown }>(
    `/documents/${documentId}/chat/sessions`,
    {},
    { skipAlert: true },
  );

  return mapChatSession(response.session as any);
};

export const fetchChatMessages = async (
  sessionId: string,
): Promise<ChatMessage[]> => {
  const response = await apiClient.get<unknown, BackendChatMessagesResponse>(
    `/chat/sessions/${sessionId}/messages`,
    { skipAlert: true },
  );

  return (response.messages ?? []).map((message) =>
    mapChatMessage(message as any),
  );
};

export const sendChatMessage = async (
  sessionId: string,
  content: string,
): Promise<ChatExchange> => {
  const response = await apiClient.post<unknown, BackendChatExchangeResponse>(
    `/chat/sessions/${sessionId}/messages`,
    { content },
    { skipAlert: true },
  );

  return mapChatExchange(response as any);
};

const getApiErrorMessage = (error: unknown): string | null => {
  if (!error || typeof error !== "object") return null;

  const response = (error as { response?: { data?: unknown } }).response;
  const data = response?.data;
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  const errors =
    record.errors && typeof record.errors === "object"
      ? (record.errors as Record<string, unknown>)
      : null;

  const candidates = [
    errors?.originalMessage,
    errors?.detail,
    errors?.rootCauseDetail,
    record.message,
    record.Message,
  ];

  return (
    candidates.find(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    ) ?? null
  );
};

export const getChatErrorMessage = (error: unknown): string => {
  const apiMessage = getApiErrorMessage(error);
  const normalizedMessage = apiMessage?.toLowerCase() ?? "";

  console.error("[AI Chat Error]", error);

  if (normalizedMessage.includes("quota")) {
    return CHAT_ERROR_FALLBACK;
  }

  if (normalizedMessage.includes("disabled")) {
    return "Tính năng AI chat hiện đang tắt.";
  }

  if (normalizedMessage.includes("not found")) {
    return "Không tìm thấy phiên trò chuyện.";
  }

  return CHAT_ERROR_FALLBACK;
};

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
  const response = await apiClient.get<unknown, any>(
    "/documents/me/chat-ready",
    { skipAlert: true },
  );

  const rawList: unknown[] = Array.isArray(response)
    ? response
    : Array.isArray(response?.documents)
      ? response.documents
      : Array.isArray(response?.data)
        ? response.data
        : [];

  return rawList
    .map((document: unknown) => mapChatReadyDocument(document))
    .filter((document): document is ChatReadyDocument => document !== null);
};

export const fetchDocumentChatSessions = async (
  documentId: string,
): Promise<ChatSession[]> => {
  const response = await apiClient.get<unknown, any>(
    `/documents/${documentId}/chat/sessions`,
    { skipAlert: true },
  );

  const rawList = Array.isArray(response)
    ? response
    : Array.isArray(response?.sessions)
      ? response.sessions
      : Array.isArray(response?.data)
        ? response.data
        : [];

  return rawList.filter(Boolean).map((session: any) => mapChatSession(session));
};

export const createDocumentChatSession = async (
  documentId: string,
): Promise<ChatSession> => {
  const response = await apiClient.post<
    unknown,
    { session?: unknown; data?: unknown }
  >(`/documents/${documentId}/chat/sessions`, {}, { skipAlert: true });

  const rawSession =
    (response as any)?.session ?? (response as any)?.data ?? response;

  return mapChatSession(rawSession as any);
};

export const fetchChatMessages = async (
  sessionId: string,
): Promise<ChatMessage[]> => {
  const response = await apiClient.get<unknown, any>(
    `/chat/sessions/${sessionId}/messages`,
    { skipAlert: true },
  );

  const rawList = Array.isArray(response)
    ? response
    : Array.isArray(response?.messages)
      ? response.messages
      : Array.isArray(response?.data)
        ? response.data
        : [];

  return rawList.filter(Boolean).map((message: any) => mapChatMessage(message));
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

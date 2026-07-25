import type {
  ChatCitation,
  ChatExchange,
  ChatMessage,
  ChatReadyDocument,
  ChatSession,
} from "../types";

interface BackendChatReadyDocument {
  id: string;
  title: string;
  format?: string | null;
  sizeInBytes?: number | null;
  createdAt: string;
  subject?: { id: string; name: string } | null;
}

interface BackendChatCitation {
  chunkId?: string;
  chunkIndex?: number;
  pageStart?: number | null;
  pageEnd?: number | null;
  score?: number;
  preview?: string;
}

interface BackendChatMessage {
  id: string;
  role?: string | null;
  content?: string | null;
  citations?: BackendChatCitation[] | null;
  createdAt: string;
}

interface BackendChatSession {
  id: string;
  documentId: string;
  title?: string | null;
  status?: string | null;
  model?: string | null;
  lastMessageAt: string;
  createdAt: string;
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;

  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) return `${Math.round(kilobytes)} KB`;

  const megabytes = kilobytes / 1024;
  if (megabytes < 1024) return `${megabytes.toFixed(1)} MB`;

  return `${(megabytes / 1024).toFixed(1)} GB`;
};

const mapChatCitation = (citation: BackendChatCitation): ChatCitation => ({
  chunkId: citation.chunkId ?? "",
  chunkIndex: citation.chunkIndex ?? 0,
  pageStart: citation.pageStart ?? null,
  pageEnd: citation.pageEnd ?? null,
  score: citation.score ?? 0,
  preview: citation.preview ?? "",
});

export const mapChatReadyDocument = (
  document: BackendChatReadyDocument,
): ChatReadyDocument => ({
  id: document.id,
  title: document.title,
  format: (document.format ?? "FILE").replace(/^\./, "").toUpperCase(),
  sizeInBytes: document.sizeInBytes ?? 0,
  sizeLabel: formatBytes(document.sizeInBytes ?? 0),
  createdAt: document.createdAt,
  subjectName: document.subject?.name ?? "Không phân loại",
  isChatReady: true,
});

export const mapChatSession = (session: BackendChatSession): ChatSession => ({
  id: session.id,
  documentId: session.documentId,
  title: session.title ?? "AI Study Coach",
  status: session.status ?? "ACTIVE",
  model: session.model ?? "",
  lastMessageAt: session.lastMessageAt,
  createdAt: session.createdAt,
});

export const mapChatMessage = (message: BackendChatMessage): ChatMessage => ({
  id: message.id,
  role: message.role === "assistant" ? "assistant" : "user",
  content: message.content ?? "",
  citations: Array.isArray(message.citations)
    ? message.citations.map(mapChatCitation)
    : [],
  createdAt: message.createdAt,
});

export const mapChatExchange = (exchange: {
  session: BackendChatSession;
  userMessage: BackendChatMessage;
  message: BackendChatMessage;
}): ChatExchange => ({
  session: mapChatSession(exchange.session),
  userMessage: mapChatMessage(exchange.userMessage),
  message: mapChatMessage(exchange.message),
});

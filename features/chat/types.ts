export interface ChatReadyDocument {
  id: string;
  title: string;
  format: string;
  sizeInBytes: number;
  sizeLabel: string;
  createdAt: string;
  subjectName: string;
  isChatReady: true;
}

export type ChatMessageRole = "user" | "assistant";

export interface ChatCitation {
  chunkId: string;
  chunkIndex: number;
  pageStart: number | null;
  pageEnd: number | null;
  score: number;
  preview: string;
}

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  citations: ChatCitation[];
  createdAt: string;
}

export interface ChatSession {
  id: string;
  documentId: string;
  title: string;
  status: string;
  model: string;
  lastMessageAt: string;
  createdAt: string;
}

export interface ChatExchange {
  session: ChatSession;
  userMessage: ChatMessage;
  message: ChatMessage;
}

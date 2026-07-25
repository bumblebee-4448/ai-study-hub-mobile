# AI Document Chat Design

**Date:** 2026-07-25  
**Status:** Approved design  
**Scope:** Backend API and React Native mobile client

## Goal

Allow an authenticated student to open an AI Study Coach bubble, choose one document that has finished text extraction and embedding, and ask questions answered only from that document.

## Product decisions

- The entry point is a floating bubble in the bottom-right corner, positioned above the student bottom navigation.
- The bubble copy is `Bạn có tài liệu vừa upload, hỏi đáp ngay ?`.
- The bubble is shown when the user has at least one document ready for chat.
- Each chat session is scoped to exactly one document.
- The source picker displays only documents that are `ACTIVE`, owned by the current user, have at least one chunk, and have embeddings for every chunk.
- A session can be resumed. If a selected document has no session, the client creates one.
- The first MVP uses a full-screen AI Coach route rather than a bottom sheet or a permanent navigation tab.
- AI answers display source citations returned by the backend.
- Provider/configuration details are logged in the backend and Metro terminal; the UI uses a safe fallback message instead of exposing infrastructure details.

## Non-goals

- Multi-document questions within one session.
- A general-purpose assistant unrelated to an uploaded document.
- Streaming responses or voice input.
- A native PDF/Word viewer inside the chat screen.
- Persisting a new document processing-status field in the MVP.

## Architecture

The existing backend RAG pipeline remains the source of truth. Upload processing extracts text into `document_chunks`, then generates an embedding for each chunk. The chat service embeds the user question, ranks the document's chunks, sends the selected context to Gemini, and stores both messages and citations.

The mobile client adds a chat feature and consumes the existing session/message APIs. A new authenticated readiness endpoint prevents the source picker from showing documents that would fail at chat time.

```text
Student tab layout
  -> FloatingAIChatBubble
  -> /ai-coach
  -> GET /documents/me/chat-ready
  -> Select one ready document
  -> GET /documents/:documentId/chat/sessions
  -> Resume latest session or POST a new session
  -> GET /chat/sessions/:sessionId/messages
  -> POST /chat/sessions/:sessionId/messages
  -> Render assistant answer and citations
```

## Backend design

### Readiness endpoint

Add an authenticated route:

```http
GET /api/v1/documents/me/chat-ready
```

The route uses `JwtAuthGuard` and `VerifiedAccountGuard`. It returns only the current user's non-deleted, `ACTIVE` documents for which:

1. At least one `document_chunks` record exists.
2. No chunk for the document has an empty embedding.

The readiness check must not treat a document with zero chunks as ready, and must not treat a document with only partially generated embeddings as ready.

The response follows the existing response interceptor convention. The client receives:

```ts
interface ChatReadyDocument {
  id: string;
  title: string;
  format: string;
  sizeInBytes: number;
  createdAt: string;
  subject?: {
    id: string;
    name: string;
  } | null;
}

interface ChatReadyDocumentsResponse {
  documents: ChatReadyDocument[];
}
```

The endpoint may reuse the existing document repository/service boundaries, but it must not expose documents from another user or documents that the existing chat authorization would reject.

### Existing chat endpoints

No route shape changes are required for the existing chat API:

```http
POST /api/v1/documents/:documentId/chat/sessions
GET  /api/v1/documents/:documentId/chat/sessions
GET  /api/v1/chat/sessions/:sessionId/messages
POST /api/v1/chat/sessions/:sessionId/messages
DELETE /api/v1/chat/sessions/:sessionId
```

The client must use the latest active session for the selected document when resuming. Double taps on document selection must be guarded in the UI so that they cannot create duplicate sessions.

The send-message response continues to contain the updated session, the saved user message, and the saved assistant message. Assistant citations retain the existing shape:

```ts
interface ChatCitation {
  chunkId: string;
  chunkIndex: number;
  pageStart: number | null;
  pageEnd: number | null;
  score: number;
  preview: string;
}
```

### Logging and error policy

Backend services use NestJS `Logger` for:

- Missing or invalid Gemini configuration.
- Embedding and generation failures.
- Quota rejection.
- Readiness and document-processing failures.
- Session/document identifiers needed to trace a request.

Logs must never include `GEMINI_API_KEY`, refresh tokens, or complete sensitive document content. The existing HTTP error response remains useful for debugging server-side, but the mobile client maps AI runtime/provider errors to a safe UI message.

The canonical UI fallback is:

```text
Vượt quá quota hằng ngày.
```

The client preserves a specific authorization or validation message when it is safe and actionable. Unknown provider, configuration, and network failures are logged to the Metro terminal and use the fallback message above in the UI.

## Mobile design

### Route and placement

Add a full-screen route:

```text
app/ai-coach/index.tsx
```

Register it in the root stack with the header hidden. The student tab layout renders the floating bubble above the tab navigator. The bubble uses the bottom-tab height and safe-area inset so it remains visible without covering navigation controls.

The bubble is scoped to the student experience. It is not rendered in admin, moderator, login, or public routes.

### Feature structure

Create a feature-based module:

```text
features/chat/
  components/
    FloatingAIChatBubble.tsx
    ChatSourcePicker.tsx
    ChatMessageList.tsx
    ChatComposer.tsx
    ChatCitation.tsx
  hooks/
    useChatReadyDocuments.ts
    useDocumentChat.ts
    useChatMessages.ts
    useSendChatMessage.ts
  screens/
    AIChatScreen.tsx
  services/
    chatService.ts
    chatMappers.ts
  types.ts
  index.ts
```

Add chat query keys to `services/api/queryKeys.ts`:

```ts
chatKeys.readyDocuments()
chatKeys.sessions(documentId)
chatKeys.messages(sessionId)
```

React Query owns server state. Local component state owns only the selected document, active session, composer draft, source-picker visibility, sending state, and bubble dismissal state. No new global Zustand store is needed for the MVP.

### Source picker state

The AI Coach screen opens in source-picker mode. It fetches `GET /documents/me/chat-ready` and renders newest documents first.

Each source row includes:

- Document title.
- File format and size.
- Upload date.
- `Sẵn sàng hỏi đáp` badge.

When the response is empty, display a clear empty state explaining that uploaded documents must finish processing before they can be used. Processing or failed documents are not rendered as selectable rows.

When a row is selected:

1. Disable repeated selection while loading.
2. Fetch active sessions for that document.
3. Use the newest active session if one exists.
4. Otherwise create a session with the backend default title.
5. Fetch messages for the active session.
6. Switch to chat mode.

The chat header provides `Đổi tài liệu` to return to the source picker and `Chat mới` to create another session for the same document.

### Chat screen

The chat screen contains:

- Back navigation.
- `AI Study Coach` title.
- Selected document chip.
- Change-document and new-session actions.
- Initial assistant greeting.
- Suggestion prompts for summary, key concepts, definitions, and review questions.
- Scrollable user/assistant message list.
- Assistant loading indicator.
- Multiline composer with a send button and the backend's 2,000-character limit.
- Citation blocks showing chunk/page metadata and a shortened preview.

The composer remains above the keyboard. Sending is disabled for empty or whitespace-only input and while a request is in flight. The draft remains available if sending fails so the user can retry.

### Bubble lifecycle

The bubble is refreshed when the user returns to the student area and after upload success invalidates `chatKeys.readyDocuments()`. It is hidden when no ready document exists. A local dismiss action hides it for the current screen session; navigating away and back may show it again if a ready document still exists.

## Testing and acceptance criteria

### Backend tests

- Readiness returns only owned, active documents with chunks and complete embeddings.
- Readiness excludes zero-chunk, partially embedded, pending, rejected, deleted, and foreign documents.
- Chat session authorization continues to prevent access to another user's session/document.
- Existing chat tests continue to cover retrieval, prompt context, quota, persistence, and provider failure.
- `pnpm exec jest --runInBand` passes.
- `pnpm exec nest build` passes.

### Mobile tests and checks

- Chat mappers normalize ready documents, sessions, messages, and citations.
- Source selection resumes an existing session or creates exactly one new session.
- Empty, loading, retry, quota, and unknown-error states render the specified UI.
- Bubble is positioned above bottom navigation and is not rendered for non-student routes.
- `pnpm exec tsc --noEmit` passes.
- `pnpm exec expo lint` passes.

### Manual Android acceptance flow

1. Start local API, Redis, and the document worker with a valid Gemini key.
2. Sign in as a student.
3. Upload a supported document and wait until its embeddings are complete.
4. Confirm the floating bubble appears above the bottom navigation.
5. Tap the bubble and confirm only ready documents are listed.
6. Select one document and confirm a session is created or resumed.
7. Send a question about the document and confirm the answer and citations render.
8. Leave and reopen AI Coach; confirm the latest session history is restored.
9. Trigger an unavailable/configured provider or quota response; confirm terminal logs contain diagnostic context and the UI shows the safe fallback message.

## Rollout order

1. Implement and test the backend readiness endpoint.
2. Implement mobile chat types, mappers, API service, and query hooks.
3. Implement source picker and full-screen chat screen.
4. Add the student-layout floating bubble and upload-query invalidation.
5. Run automated checks and the Android acceptance flow.


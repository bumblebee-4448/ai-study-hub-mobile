# AI Document Chat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an authenticated student AI Coach flow where a floating bubble opens a full-screen source picker and a one-document-per-session RAG chat.

**Architecture:** Add a backend readiness endpoint that filters the user's active documents by complete chunk embeddings, then reuse the existing chat session/message API. Add a feature-based mobile chat module backed by React Query, mount the bubble above the student tab bar, and navigate to a full-screen `/ai-coach` route.

**Tech Stack:** NestJS, Prisma MongoDB, Jest, Gemini through the existing `AIService`, React Native 0.81, Expo Router, React Query 5, TypeScript, `node:test` with Node type stripping for pure mapper tests.

## Global Constraints

- Each chat session is scoped to exactly one document.
- The source picker only displays current-user `ACTIVE` documents with at least one chunk and no chunk missing an embedding.
- The bubble copy is exactly `Bạn có tài liệu vừa upload, hỏi đáp ngay ?`.
- The bubble is positioned above the bottom navigation in the bottom-right corner and is student-only.
- Unknown AI provider/configuration/network errors are logged to the terminal and use `Vượt quá quota hằng ngày.` as the mobile fallback.
- Do not expose Gemini keys, refresh tokens, or complete document content in logs.
- Do not add a new persisted document processing-status field in the MVP.
- Preserve the existing uncommitted upload-flow changes; stage only files belonging to this feature in feature commits.
- Backend API paths are versioned automatically as `/api/v1`; mobile services use paths without the `/api/v1` prefix, matching `axiosClient`.

---

### Task 1: Add the backend chat-ready document endpoint

**Files:**
- Modify: `backend/api/src/modules/documents/documents.controller.ts`
- Modify: `backend/api/src/modules/documents/documents.service.ts`
- Test: `backend/api/src/modules/documents/documents.service.spec.ts`
- Test: `backend/api/src/modules/documents/documents.controller.spec.ts`

**Interfaces:**
- Produces `DocumentsService.findMineChatReady(userId: string)`, returning `{ message: string; data: { documents: ChatReadyDocument[] } }`.
- Produces `GET /api/v1/documents/me/chat-ready`, guarded by `JwtAuthGuard` and `VerifiedAccountGuard`.
- `ChatReadyDocument` contains `id`, `title`, `format`, `sizeInBytes`, `createdAt`, and nullable `subject { id, name }`.

- [ ] **Step 1: Write failing service tests for readiness filtering**

Add a `describe('findMineChatReady')` block to `documents.service.spec.ts` with these behaviors:

```ts
it('returns only active owned documents whose chunks all have embeddings', async () => {
  prismaMock.documents.findMany.mockResolvedValue([
    {
      id: 'ready-1',
      title: 'Ready document',
      format: 'pdf',
      sizeInBytes: 1200,
      createdAt: new Date('2026-07-25T00:00:00.000Z'),
      subject: { id: 'subject-1', name: 'AI' },
    },
    {
      id: 'partial-1',
      title: 'Partial document',
      format: 'docx',
      sizeInBytes: 1300,
      createdAt: new Date('2026-07-24T00:00:00.000Z'),
      subject: null,
    },
  ]);
  prismaMock.document_chunks.findMany.mockResolvedValue([
    { documentId: 'partial-1' },
  ]);

  await expect(service.findMineChatReady('user-1')).resolves.toEqual({
    message: 'Chat-ready documents fetched successfully',
    data: {
      documents: [expect.objectContaining({ id: 'ready-1' })],
    },
  });
});

it('excludes documents with zero chunks and documents with missing embeddings', async () => {
  prismaMock.documents.findMany.mockResolvedValue([]);
  prismaMock.document_chunks.findMany.mockResolvedValue([]);

  const result = await service.findMineChatReady('user-1');

  expect(result.data.documents).toEqual([]);
});
```

Use the existing service test mocks and add only the Prisma calls required by this method.

- [ ] **Step 2: Run the focused service tests and verify the expected failure**

Run from `backend/api`:

```powershell
pnpm exec jest src/modules/documents/documents.service.spec.ts --runInBand
```

Expected: FAIL because `findMineChatReady` does not exist yet.

- [ ] **Step 3: Implement the minimal readiness query**

Add a private select for the source picker and implement `findMineChatReady` in `DocumentsService`:

1. Query the current user's `ACTIVE` documents with `chunks: { some: {} }`, ordered by `createdAt desc`, selecting only the source-picker fields.
2. Query `document_chunks` for those document IDs where `embedding: { isEmpty: true }`, selecting only `documentId`.
3. Remove every document whose ID appears in the missing-embedding set.
4. Return the exact success message and `{ documents }` data shape.

The two-step query avoids loading embedding vectors into the API response and treats zero chunks and partial embeddings as not ready.

- [ ] **Step 4: Run the service tests and verify they pass**

Run:

```powershell
pnpm exec jest src/modules/documents/documents.service.spec.ts --runInBand
```

Expected: PASS.

- [ ] **Step 5: Write the failing controller route test**

Add a controller test that calls `findMineChatReady` with a user payload and asserts the service receives `user.sub`:

```ts
it('returns the current user chat-ready documents', async () => {
  documentsServiceMock.findMineChatReady.mockResolvedValue({
    message: 'Chat-ready documents fetched successfully',
    data: { documents: [] },
  });

  await expect(
    controller.findMineChatReady({ sub: 'user-1' } as any),
  ).resolves.toEqual(expect.objectContaining({ data: { documents: [] } }));

  expect(documentsServiceMock.findMineChatReady).toHaveBeenCalledWith('user-1');
});
```

- [ ] **Step 6: Run the controller test to verify it fails for the missing route method**

Run:

```powershell
pnpm exec jest src/modules/documents/documents.controller.spec.ts --runInBand
```

Expected: FAIL because the controller method is not defined.

- [ ] **Step 7: Add the guarded controller route**

Add the route before `@Get(':id')` so the literal `me/chat-ready` path is not captured by the document ID route:

```ts
@Version('1')
@UseGuards(JwtAuthGuard, VerifiedAccountGuard)
@Get('me/chat-ready')
findMineChatReady(@User() user: TokenPayload) {
  return this.documentsService.findMineChatReady(user.sub);
}
```

- [ ] **Step 8: Run backend focused tests, build, and commit only backend chat-ready files**

Run:

```powershell
pnpm exec jest src/modules/documents/documents.service.spec.ts src/modules/documents/documents.controller.spec.ts --runInBand
pnpm exec tsc --noEmit
pnpm exec nest build
```

Expected: all focused tests, TypeScript, and build pass. Commit only the endpoint source/spec files with:

```powershell
git add api/src/modules/documents/documents.controller.ts api/src/modules/documents/documents.service.ts api/src/modules/documents/documents.controller.spec.ts api/src/modules/documents/documents.service.spec.ts
git commit -m "feat: expose chat-ready documents"
```

Do not stage the existing upload-flow files in the same commit.

### Task 2: Add mobile chat contracts, service, mappers, and query hooks

**Files:**
- Create: `features/chat/types.ts`
- Create: `features/chat/services/chatMappers.ts`
- Create: `features/chat/services/chatMappers.test.ts`
- Create: `features/chat/services/chatService.ts`
- Create: `features/chat/hooks/useChatReadyDocuments.ts`
- Create: `features/chat/hooks/useDocumentChat.ts`
- Create: `features/chat/hooks/useSendChatMessage.ts`
- Create: `features/chat/hooks/index.ts`
- Create: `features/chat/services/index.ts`
- Modify: `services/api/queryKeys.ts`

**Interfaces:**
- `fetchChatReadyDocuments(): Promise<ChatReadyDocument[]>` calls `GET /documents/me/chat-ready`.
- `fetchDocumentChatSessions(documentId: string): Promise<ChatSession[]>` calls `GET /documents/:documentId/chat/sessions`.
- `createDocumentChatSession(documentId: string): Promise<ChatSession>` calls `POST /documents/:documentId/chat/sessions` with an empty body.
- `fetchChatMessages(sessionId: string): Promise<ChatMessage[]>` calls `GET /chat/sessions/:sessionId/messages`.
- `sendChatMessage(sessionId: string, content: string): Promise<ChatExchange>` calls `POST /chat/sessions/:sessionId/messages` with `{ content }`.
- `getChatErrorMessage(error: unknown): string` preserves safe API messages and falls back to `Vượt quá quota hằng ngày.`.

- [ ] **Step 1: Write the failing mapper tests**

Create `chatMappers.test.ts` using `node:test` and `node:assert/strict`:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { mapChatReadyDocument, mapChatMessage } from './chatMappers.ts';

test('maps a backend ready document to the source-picker model', () => {
  assert.deepEqual(
    mapChatReadyDocument({
      id: 'doc-1',
      title: 'AI Notes',
      format: 'pdf',
      sizeInBytes: 2048,
      createdAt: '2026-07-25T00:00:00.000Z',
      subject: { id: 'subject-1', name: 'Artificial Intelligence' },
    }),
    {
      id: 'doc-1',
      title: 'AI Notes',
      format: 'PDF',
      sizeInBytes: 2048,
      sizeLabel: '2 KB',
      createdAt: '2026-07-25T00:00:00.000Z',
      subjectName: 'Artificial Intelligence',
      isChatReady: true,
    },
  );
});

test('maps assistant citations without discarding page metadata', () => {
  const message = mapChatMessage({
    id: 'message-1',
    role: 'assistant',
    content: 'Answer',
    citations: [{ chunkId: 'chunk-1', chunkIndex: 2, pageStart: 3, pageEnd: 4, score: 0.91, preview: 'Context' }],
    createdAt: '2026-07-25T00:00:00.000Z',
  });

  assert.equal(message.citations[0].pageStart, 3);
  assert.equal(message.citations[0].pageEnd, 4);
});
```

- [ ] **Step 2: Run the mapper tests and verify the expected failure**

Run from `ai-study-hub-mobile`:

```powershell
node --experimental-strip-types --test features/chat/services/chatMappers.test.ts
```

Expected: FAIL because the mapper module and types do not exist.

- [ ] **Step 3: Define the chat domain types**

Create `types.ts` with the exact models required by the UI:

```ts
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

export type ChatMessageRole = 'user' | 'assistant';

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
```

- [ ] **Step 4: Implement mappers and run the mapper tests green**

Implement `mapChatReadyDocument` with uppercase format, a readable byte-size label, a subject fallback of `Không phân loại`, and `isChatReady: true`. Implement `mapChatMessage` with a normalized role, empty citations when the backend returns null, and the backend timestamp.

Run:

```powershell
node --experimental-strip-types --test features/chat/services/chatMappers.test.ts
```

Expected: PASS.

- [ ] **Step 5: Implement the chat service with the existing Axios response convention**

Create `chatService.ts` with typed backend response shapes. Use these exact calls:

```ts
apiClient.get('/documents/me/chat-ready')
apiClient.get(`/documents/${documentId}/chat/sessions`)
apiClient.post(`/documents/${documentId}/chat/sessions`, {})
apiClient.get(`/chat/sessions/${sessionId}/messages`)
apiClient.post(`/chat/sessions/${sessionId}/messages`, { content })
```

Map the unwrapped `documents`, `sessions`, `messages`, and `data.message` values before returning them to hooks.

- [ ] **Step 6: Add query keys and hooks**

Add:

```ts
export const chatKeys = {
  all: ['chat'] as const,
  readyDocuments: () => [...chatKeys.all, 'ready-documents'] as const,
  sessions: (documentId: string) => [...chatKeys.all, 'sessions', documentId] as const,
  messages: (sessionId: string) => [...chatKeys.all, 'messages', sessionId] as const,
};
```

Implement `useChatReadyDocuments` as a query enabled for the authenticated student, `useDocumentChat` as a query that selects the newest session and loads its messages, and `useSendChatMessage` as a mutation that updates the active message query with the returned user and assistant messages.

`getChatErrorMessage` must use the existing API error shape when it contains a safe message; otherwise it returns `Vượt quá quota hằng ngày.` and logs the original error with `console.error`.

- [ ] **Step 7: Run mapper tests and mobile TypeScript verification**

Run:

```powershell
node --experimental-strip-types --test features/chat/services/chatMappers.test.ts
pnpm exec tsc --noEmit
```

Expected: PASS with no TypeScript errors.

- [ ] **Step 8: Commit only the mobile chat data-layer files**

```powershell
git add features/chat services/api/queryKeys.ts
git commit -m "feat: add mobile document chat data layer"
```

### Task 3: Build the AI Coach source picker and chat components

**Files:**
- Create: `features/chat/components/FloatingAIChatBubble.tsx`
- Create: `features/chat/components/ChatSourcePicker.tsx`
- Create: `features/chat/components/ChatMessageList.tsx`
- Create: `features/chat/components/ChatComposer.tsx`
- Create: `features/chat/components/ChatCitation.tsx`
- Create: `features/chat/screens/AIChatScreen.tsx`
- Create: `features/chat/components/index.ts`
- Create: `features/chat/screens/index.ts`
- Create: `features/chat/index.ts`

**Interfaces:**
- `FloatingAIChatBubble` accepts `onPress: () => void`, `onDismiss?: () => void`, and `hasReadyDocuments: boolean`.
- `ChatSourcePicker` accepts `documents`, `isLoading`, `error`, and `onSelect(documentId)`.
- `AIChatScreen` owns selected-document/session orchestration and renders source picker or chat mode.

- [ ] **Step 1: Add the component contracts and compile-failing exports**

Create the public component interfaces and export them through the feature index. Import the components from a temporary route-level type check so TypeScript reports the missing implementations before UI code is added.

Run:

```powershell
pnpm exec tsc --noEmit
```

Expected: FAIL with missing component/module errors.

- [ ] **Step 2: Implement the bubble above the bottom navigation**

Use `useBottomTabBarHeight`, `useSafeAreaInsets`, and `useAppTheme`. Render nothing when `hasReadyDocuments` is false. Position the prompt card and floating action button with an absolute bottom offset of `tabBarHeight + insets.bottom + 12`, right offset `16`, and a z-index above the tab bar. Use the exact prompt copy and an accessible label.

- [ ] **Step 3: Implement the source picker**

Render a full-screen safe-area view with the title `AI Study Coach`, subtitle `Chọn tài liệu để bắt đầu hỏi đáp`, a `FlatList` of ready documents, a `Sẵn sàng hỏi đáp` badge, loading skeleton/indicator, retry action, and the empty message from the approved design. Disable a row while the parent is selecting a document.

- [ ] **Step 4: Implement citation and message rendering**

Implement `ChatCitation` as a compact expandable source row showing page range when available and the normalized preview. Implement `ChatMessageList` with user and assistant bubble styles, initial assistant greeting, suggestion prompts, assistant loading row, and citations beneath assistant messages.

- [ ] **Step 5: Implement the composer**

Use a multiline `TextInput`, a send button, the 2,000-character limit, disabled state for empty/pending input, and keyboard-safe bottom padding. Keep the draft in the parent when a send mutation fails.

- [ ] **Step 6: Implement AIChatScreen orchestration**

Start in source-picker mode. After document selection, fetch sessions and either select the latest session or create one exactly once. Fetch its messages, show the selected document chip, and render `Đổi tài liệu` and `Chat mới` actions. On send, call `useSendChatMessage`, append the returned exchange through React Query, and use `getChatErrorMessage` for the UI error.

- [ ] **Step 7: Run TypeScript and lint for the component task**

Run:

```powershell
pnpm exec tsc --noEmit
pnpm exec expo lint
```

Expected: both commands pass.

- [ ] **Step 8: Commit the chat UI components**

```powershell
git add features/chat
git commit -m "feat: add AI Coach chat screens"
```

### Task 4: Integrate the route, student bubble, and upload refresh

**Files:**
- Modify: `app/_layout.tsx`
- Modify: `app/(student-tabs)/_layout.tsx`
- Create: `app/ai-coach/index.tsx`
- Modify: `features/document/hooks/useUploadDocument.ts`
- Modify: `features/user/hooks/useUserUploadDocument.ts`

**Interfaces:**
- `/ai-coach` renders `AIChatScreen` and uses Expo Router navigation only at the route boundary.
- Both upload hooks invalidate `chatKeys.readyDocuments()` after a successful upload.

- [ ] **Step 1: Add the route screen and verify the route import fails before registration**

Create `app/ai-coach/index.tsx`:

```tsx
export default function AIChatRoute() {
  return <AIChatScreen />;
}
```

Run TypeScript and confirm the route/feature imports are the only missing references before adding navigation registration.

- [ ] **Step 2: Register the full-screen route**

Add:

```tsx
<Stack.Screen name="ai-coach" options={{ headerShown: false }} />
```

Keep the route outside the student tab group so the chat screen does not display the bottom tab bar.

- [ ] **Step 3: Mount the bubble in the student tab layout**

Wrap the existing `RoleGate` children in a `View` with `flex: 1`, render `<Tabs />`, then render `FloatingAIChatBubble` with `router.push('/ai-coach')`. Use `useChatReadyDocuments` to determine visibility. Keep admin/moderator layouts untouched.

- [ ] **Step 4: Invalidate ready documents after both upload flows**

Import `chatKeys` in both upload hooks and extend each `onSuccess` callback:

```ts
await queryClient.invalidateQueries({ queryKey: userDocumentKeys.all });
await queryClient.invalidateQueries({ queryKey: chatKeys.readyDocuments() });
```

Do not change upload request payloads or reset behavior.

- [ ] **Step 5: Run mobile verification**

Run:

```powershell
pnpm exec tsc --noEmit
pnpm exec expo lint
```

Expected: PASS.

- [ ] **Step 6: Commit route and integration files only**

```powershell
git add app/_layout.tsx app/(student-tabs)/_layout.tsx app/ai-coach/index.tsx features/document/hooks/useUploadDocument.ts features/user/hooks/useUserUploadDocument.ts
git commit -m "feat: integrate AI Coach entry point"
```

### Task 5: Run full verification and Android acceptance flow

**Files:**
- Test: `backend/api/src/modules/documents/documents.service.spec.ts`
- Test: `backend/api/src/modules/documents/documents.controller.spec.ts`
- Test: `ai-study-hub-mobile/features/chat/services/chatMappers.test.ts`

- [ ] **Step 1: Run all backend tests and build**

From `backend/api`:

```powershell
pnpm exec jest --runInBand
pnpm exec tsc --noEmit
pnpm exec nest build
```

Expected: all backend tests pass, TypeScript exits 0, and Nest build succeeds.

- [ ] **Step 2: Run all mobile static checks and mapper tests**

From `ai-study-hub-mobile`:

```powershell
node --experimental-strip-types --test features/chat/services/chatMappers.test.ts
pnpm exec tsc --noEmit
pnpm exec expo lint
```

Expected: all commands pass.

- [ ] **Step 3: Execute the Android manual flow**

With API, local Redis, document worker, and a valid Gemini key running:

1. Sign in as a student.
2. Upload a supported PDF/DOCX/TXT document.
3. Wait for document chunks and embeddings to finish.
4. Confirm the bubble appears above the bottom navigation.
5. Open AI Coach and confirm only ready documents are listed.
6. Select a document, send a document-specific question, and confirm the assistant answer plus citations.
7. Leave and reopen AI Coach and confirm the latest session history is restored.
8. Verify config/provider errors are visible in the API/Metro terminal while the mobile UI shows `Vượt quá quota hằng ngày.`.

- [ ] **Step 4: Review the final diff without staging unrelated upload work**

Run from each repository:

```powershell
git status --short
git diff --check
```

Confirm the feature commits contain only chat/readiness/integration files and the pre-existing upload modifications remain separate.


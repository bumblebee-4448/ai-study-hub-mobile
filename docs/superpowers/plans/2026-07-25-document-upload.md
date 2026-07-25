# Document Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the mobile upload form create a document through `POST /api/v1/documents/upload`, with the backend uploading the file to Cloudinary and reusing the existing document creation pipeline.

**Architecture:** Add a small backend `DocumentStorageService` for signed Cloudinary upload/delete operations. Add a multipart controller endpoint and DTO that normalize mobile text fields, then compose Cloudinary metadata into the existing `DocumentsService.create` method. Keep the mobile form unchanged except for letting Axios generate the multipart boundary.

**Tech Stack:** NestJS 11, TypeScript, Jest, native `fetch`/`FormData`/`Blob`, Cloudinary Upload API, Expo DocumentPicker, Axios, React Query.

## Global Constraints

- Never expose `CLOUDINARY_API_SECRET` to the mobile app.
- Preserve the existing `DocumentsService.create` behavior for validation, status, queueing, and moderator broadcasts.
- Do not overwrite unrelated existing changes in either repository.
- A failed database creation after a successful Cloudinary upload must trigger best-effort asset cleanup.
- Use TDD: each production change must follow a failing test.

---

### Task 1: Add failing backend upload tests

**Files:**
- Create: `backend/api/src/modules/documents/document-storage.service.spec.ts`
- Modify: `backend/api/src/modules/documents/documents.controller.spec.ts`
- Modify: `backend/api/src/modules/documents/documents.service.spec.ts`

**Interfaces:**
- `DocumentStorageService.upload(file)` will return `{ fileUrl, publicId, sizeInBytes, format, resourceType }`.
- `DocumentsService.createFromUpload(file, dto, authorId)` will call storage upload, then `create`, and clean up on create failure.
- `DocumentsController.upload(file, dto, user)` will delegate to `createFromUpload` with `user.sub`.

- [ ] **Step 1: Write the storage service tests**

Cover these behaviors:

```ts
it('maps a successful Cloudinary response to document metadata', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({
      secure_url: 'https://res.cloudinary.com/demo/raw/upload/doc.pdf',
      public_id: 'documents/doc-1',
      bytes: 1234,
      format: 'pdf',
      resource_type: 'raw',
    }),
  });

  await expect(service.upload(file)).resolves.toEqual({
    fileUrl: 'https://res.cloudinary.com/demo/raw/upload/doc.pdf',
    publicId: 'documents/doc-1',
    sizeInBytes: 1234,
    format: 'pdf',
    resourceType: 'raw',
  });
});

it('throws when Cloudinary rejects the upload', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 400,
    text: jest.fn().mockResolvedValue('bad request'),
  });

  await expect(service.upload(file)).rejects.toThrow('Cloudinary upload failed');
});
```

- [ ] **Step 2: Add service orchestration tests**

Add a `DocumentStorageService` mock to the existing `DocumentsService` test module and verify:

```ts
it('creates document metadata from uploaded storage metadata', async () => {
  storageMock.upload.mockResolvedValue(storageMetadata);
  jest.spyOn(service, 'create').mockResolvedValue(documentResponse as any);

  await expect(service.createFromUpload(file, dto, 'user-1')).resolves.toEqual(
    documentResponse,
  );
  expect(service.create).toHaveBeenCalledWith(
    { ...dto, ...storageMetadata },
    'user-1',
  );
});

it('deletes the uploaded asset when document creation fails', async () => {
  storageMock.upload.mockResolvedValue(storageMetadata);
  jest.spyOn(service, 'create').mockRejectedValue(new Error('database failed'));

  await expect(service.createFromUpload(file, dto, 'user-1')).rejects.toThrow(
    'database failed',
  );
  expect(storageMock.destroy).toHaveBeenCalledWith(storageMetadata);
});
```

- [ ] **Step 3: Add controller delegation test**

Extend `documentsServiceMock` with `createFromUpload` and assert the controller forwards the file, DTO, and `user.sub`.

- [ ] **Step 4: Run the focused tests and verify RED**

Run from `backend/api`:

```bash
pnpm exec jest src/modules/documents/document-storage.service.spec.ts src/modules/documents/documents.service.spec.ts src/modules/documents/documents.controller.spec.ts --runInBand
```

Expected result: FAIL because the new service, DTO path, and orchestration method do not exist yet.

### Task 2: Implement Cloudinary storage adapter

**Files:**
- Create: `backend/api/src/modules/documents/document-storage.service.ts`
- Modify: `backend/api/src/modules/documents/documents.module.ts`
- Modify: `backend/api/src/modules/documents/index.ts`

**Interfaces:**
- `DocumentUploadFile`: `{ buffer: Buffer; originalname: string; mimetype: string; size: number }`.
- `UploadedDocumentMetadata`: `{ fileUrl: string; publicId: string; sizeInBytes: number; format: string; resourceType: string }`.
- `upload(file: DocumentUploadFile): Promise<UploadedDocumentMetadata>`.
- `destroy(asset: Pick<UploadedDocumentMetadata, 'publicId' | 'resourceType'>): Promise<void>`.

- [ ] **Step 1: Implement signed raw upload**

Use the configured `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`; sign `timestamp`, post a `Blob` made from the file buffer to `/raw/upload`, parse the JSON response, and reject non-2xx responses without logging secret or response body contents.

- [ ] **Step 2: Implement best-effort destroy**

Reuse the existing signed destroy behavior from `DocumentsService`, but keep it in the storage adapter. Try the stored resource type and the existing fallback resource types; treat `ok` and `not found` as completed cleanup.

- [ ] **Step 3: Register the provider and run the focused tests**

Run the Task 1 command. Expected result: storage tests and existing document tests pass.

### Task 3: Add the backend multipart endpoint

**Files:**
- Create: `backend/api/src/modules/documents/dto/upload-document.dto.ts`
- Modify: `backend/api/src/modules/documents/dto/index.ts`
- Modify: `backend/api/src/modules/documents/documents.controller.ts`
- Modify: `backend/api/src/modules/documents/documents.service.ts`
- Modify: `backend/api/src/modules/documents/documents.module.ts`

**Interfaces:**
- `UploadDocumentDto`: `title`, optional `description`, optional `subjectId`, `isPublic` normalized from multipart strings to boolean.
- Route: `POST /api/v1/documents/upload` guarded by `JwtAuthGuard` and `VerifiedAccountGuard`.

- [ ] **Step 1: Add DTO validation**

Use `class-validator` and `class-transformer` so `isPublic` accepts only `true`/`false` strings or booleans; reject other values. Keep `title` required and trim optional text fields through the existing service composition.

- [ ] **Step 2: Add controller interceptor and delegation**

Use Nest `FileInterceptor('file')` with an in-memory file and a conservative hard limit. Return a `BadRequestException` when no file is supplied, then call `documentsService.createFromUpload(file, dto, user.sub)`.

- [ ] **Step 3: Add service orchestration**

Upload first, merge returned metadata with the DTO, call the existing `create`, and call storage `destroy` if `create` rejects. Preserve the original error after cleanup.

- [ ] **Step 4: Run focused tests and backend typecheck**

Run:

```bash
pnpm exec jest src/modules/documents/document-storage.service.spec.ts src/modules/documents/documents.service.spec.ts src/modules/documents/documents.controller.spec.ts --runInBand
pnpm run check-types
```

Expected result: both commands exit successfully.

### Task 4: Align the mobile multipart request

**Files:**
- Modify: `ai-study-hub-mobile/features/user/services/userUploadService.ts`

**Interfaces:**
- Keep the current form fields and `POST /documents/upload` path.
- Do not send Cloudinary metadata from the mobile client.

- [ ] **Step 1: Remove the manually forced multipart content type**

Keep the `FormData` payload, but remove the explicit `Content-Type` header so Axios/native networking can add the correct multipart boundary. Preserve timeout and error behavior.

- [ ] **Step 2: Run mobile typecheck**

Run:

```bash
pnpm exec tsc --noEmit
```

Expected result: the upload changes introduce no new TypeScript errors. An existing `useScrollOffset`/`useScrollViewOffset` error may remain and must be reported separately if still present.

### Task 5: Verify the complete change

**Files:**
- No additional production files.

- [ ] **Step 1: Inspect the diff**

Confirm only upload-related backend files, the mobile upload service, and the approved design/plan docs changed. Do not stage or revert unrelated existing user changes.

- [ ] **Step 2: Run final verification**

Run backend focused tests, backend typecheck, and mobile typecheck again. Record exact failures if pre-existing failures remain.

- [ ] **Step 3: Report runtime setup**

Confirm the backend `.env` has Cloudinary credentials and tell the user to restart the API after the code change. Mention that the mobile device must reach `EXPO_PUBLIC_API_URL`.

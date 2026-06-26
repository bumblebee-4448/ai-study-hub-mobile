# Moderator Mobile Real API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace moderator mock data in the mobile app with real backend document APIs and Vietnamese UI copy.

**Architecture:** Keep the moderator flow inside the existing `features/document` feature. Add moderator-specific types, pure mappers, API service wrappers, and hooks, then reconnect the dashboard, review queue, and detail screen to those hooks. The UI only renders fields returned by the backend document contracts.

**Tech Stack:** Expo SDK 54, Expo Router 6, React Native 0.81, TypeScript, Axios via `services/api/axiosClient.ts`, Node test runner for pure mapper/query tests.

---

## File Structure

- Modify `features/document/types.ts`: add backend document payload types and moderator UI model types.
- Create `features/document/services/moderatorDocumentMappers.ts`: pure mapping, date, size, status-label helpers.
- Create `features/document/services/moderatorDocumentMappers.test.mjs`: failing-first tests for mapper behavior.
- Create `features/document/services/moderatorDocumentQuery.ts`: pure list query defaults for moderator document lists.
- Create `features/document/services/moderatorDocumentQuery.test.mjs`: failing-first tests for query defaults.
- Create `features/document/services/moderatorDocumentService.ts`: API wrappers for list/detail/approve/reject/dashboard summary.
- Create `features/document/hooks/useModeratorDocuments.ts`: list/dashboard loading, refresh, error state.
- Create `features/document/hooks/useModeratorDocumentDetail.ts`: detail loading and approve/reject submit state.
- Modify `features/document/hooks/index.ts`: export moderator hooks.
- Modify `features/document/screens/ModeratorDashboardScreen.tsx`: remove hard-coded counters, chart, tools, and recent mock data.
- Modify `features/document/screens/ModeratorReviewScreen.tsx`: remove `REVIEW_DOCUMENTS`, unsupported filters, AI score, and urgent mock logic.
- Modify `features/document/screens/ModeratorDocumentDetailScreen.tsx`: fetch detail by id, remove fields not in backend, wire approve/reject API actions.
- Modify `app/(moderator-tabs)/_layout.tsx`: change `Home` to `Trang chủ`.
- Modify `app/moderator-review.tsx`: change stack title to `Duyệt tài liệu`.

Before editing any already-dirty file, run `git diff -- <file>` and keep existing user changes unless they directly conflict with this plan.

### Task 1: Moderator Mapper Types And Tests

**Files:**
- Modify: `features/document/types.ts`
- Create: `features/document/services/moderatorDocumentMappers.ts`
- Test: `features/document/services/moderatorDocumentMappers.test.mjs`

- [ ] **Step 1: Write the failing mapper test**

Create `features/document/services/moderatorDocumentMappers.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";

let moderatorMappers = {};

try {
  moderatorMappers = await import("./moderatorDocumentMappers.ts");
} catch {
  moderatorMappers = {};
}

test("maps backend moderator document detail into supported UI fields", () => {
  assert.equal(
    typeof moderatorMappers.mapBackendDocumentToModeratorDocument,
    "function",
    "mapBackendDocumentToModeratorDocument should be exported"
  );

  const mapped = moderatorMappers.mapBackendDocumentToModeratorDocument({
    id: "doc-1",
    title: "Giải tích 1 - Đề cương ôn tập",
    description: "Tài liệu ôn tập cuối kỳ.",
    fileUrl: "https://example.com/doc.pdf",
    publicId: "academishare/doc-1",
    status: "PENDING",
    isPublic: true,
    createdAt: "2026-06-20T03:30:00.000Z",
    updatedAt: "2026-06-20T04:00:00.000Z",
    rejectionReason: null,
    format: "pdf",
    sizeInBytes: 1572864,
    author: {
      id: "user-1",
      name: "Nguyễn Văn A",
      email: "student@example.com",
      avatarUrl: null,
    },
    subject: {
      id: "subject-1",
      name: "Giải tích",
      code: "MAE101",
    },
    aiTrustScore: 98,
    pageCount: 45,
    isUrgent: true,
    year: "Year 4",
  });

  assert.deepEqual(mapped, {
    id: "doc-1",
    title: "Giải tích 1 - Đề cương ôn tập",
    description: "Tài liệu ôn tập cuối kỳ.",
    status: "PENDING",
    statusLabel: "Chờ duyệt",
    authorName: "Nguyễn Văn A",
    subjectName: "Giải tích (MAE101)",
    formatLabel: "PDF",
    sizeLabel: "1.5 MB",
    fileUrl: "https://example.com/doc.pdf",
    createdAtLabel: "20/06/2026",
    updatedAtLabel: "20/06/2026",
    rejectionReason: null,
    canReview: true,
  });

  assert.equal(Object.hasOwn(mapped, "aiTrustScore"), false);
  assert.equal(Object.hasOwn(mapped, "pageCount"), false);
  assert.equal(Object.hasOwn(mapped, "isUrgent"), false);
  assert.equal(Object.hasOwn(mapped, "year"), false);
});

test("maps fallback labels for missing optional document fields", () => {
  assert.equal(
    typeof moderatorMappers.mapBackendDocumentToModeratorDocument,
    "function",
    "mapBackendDocumentToModeratorDocument should be exported"
  );

  assert.deepEqual(
    moderatorMappers.mapBackendDocumentToModeratorDocument({
      id: "doc-2",
      title: "Tài liệu chưa đủ metadata",
      status: "REJECTED",
      createdAt: "invalid-date",
      rejectionReason: "Thiếu mô tả.",
      author: null,
      subject: null,
      format: null,
      sizeInBytes: null,
    }),
    {
      id: "doc-2",
      title: "Tài liệu chưa đủ metadata",
      description: "",
      status: "REJECTED",
      statusLabel: "Từ chối",
      authorName: "Không rõ tác giả",
      subjectName: "Chưa phân loại",
      formatLabel: "FILE",
      sizeLabel: "Không rõ dung lượng",
      fileUrl: undefined,
      createdAtLabel: "Không rõ ngày",
      updatedAtLabel: "",
      rejectionReason: "Thiếu mô tả.",
      canReview: false,
    }
  );
});

test("formats file size through KB MB and GB", () => {
  assert.equal(
    typeof moderatorMappers.formatModeratorDocumentSize,
    "function",
    "formatModeratorDocumentSize should be exported"
  );

  assert.equal(
    moderatorMappers.formatModeratorDocumentSize(undefined),
    "Không rõ dung lượng"
  );
  assert.equal(moderatorMappers.formatModeratorDocumentSize(512), "512 B");
  assert.equal(moderatorMappers.formatModeratorDocumentSize(2048), "2.0 KB");
  assert.equal(
    moderatorMappers.formatModeratorDocumentSize(1572864),
    "1.5 MB"
  );
  assert.equal(
    moderatorMappers.formatModeratorDocumentSize(3221225472),
    "3.0 GB"
  );
});

test("maps moderator status labels in Vietnamese", () => {
  assert.equal(
    typeof moderatorMappers.getModeratorStatusLabel,
    "function",
    "getModeratorStatusLabel should be exported"
  );

  assert.equal(moderatorMappers.getModeratorStatusLabel("PENDING"), "Chờ duyệt");
  assert.equal(moderatorMappers.getModeratorStatusLabel("ACTIVE"), "Đã duyệt");
  assert.equal(moderatorMappers.getModeratorStatusLabel("REJECTED"), "Từ chối");
  assert.equal(moderatorMappers.getModeratorStatusLabel("DELETED"), "Đã xóa");
});

test("maps backend list response and preserves pagination", () => {
  assert.equal(
    typeof moderatorMappers.mapBackendModeratorDocumentList,
    "function",
    "mapBackendModeratorDocumentList should be exported"
  );

  const result = moderatorMappers.mapBackendModeratorDocumentList({
    documents: [
      {
        id: "doc-3",
        title: "Cơ sở dữ liệu",
        status: "ACTIVE",
        createdAt: "2026-06-19T10:00:00.000Z",
        format: "docx",
        sizeInBytes: 2048,
        author: { id: "user-2", name: "Trần Thị B", avatarUrl: null },
        subject: { id: "subject-2", name: "Cơ sở dữ liệu", code: "DBI202" },
      },
    ],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    },
  });

  assert.equal(result.documents.length, 1);
  assert.equal(result.documents[0].statusLabel, "Đã duyệt");
  assert.deepEqual(result.pagination, {
    page: 1,
    limit: 20,
    total: 1,
    totalPages: 1,
  });
});
```

- [ ] **Step 2: Run the mapper test and verify RED**

Run:

```powershell
node --experimental-strip-types features/document/services/moderatorDocumentMappers.test.mjs
```

Expected: FAIL with `mapBackendDocumentToModeratorDocument should be exported`.

- [ ] **Step 3: Add moderator types**

Append this block to `features/document/types.ts` after the existing exports:

```ts
// Moderator document API integration

export type BackendDocumentStatus = "PENDING" | "ACTIVE" | "REJECTED" | "DELETED";

export type ModeratorDocumentStatusFilter = Extract<
  BackendDocumentStatus,
  "PENDING" | "ACTIVE" | "REJECTED"
>;

export interface BackendModeratorDocumentAuthor {
  id: string;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface BackendModeratorDocumentSubject {
  id: string;
  name?: string | null;
  code?: string | null;
}

export interface BackendModeratorDocument {
  id: string;
  title: string;
  description?: string | null;
  fileUrl?: string | null;
  publicId?: string | null;
  status: BackendDocumentStatus;
  isPublic?: boolean;
  createdAt: string;
  updatedAt?: string | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  format?: string | null;
  sizeInBytes?: number | null;
  author?: BackendModeratorDocumentAuthor | null;
  subject?: BackendModeratorDocumentSubject | null;
}

export interface ModeratorDocumentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BackendModeratorDocumentListResponse {
  documents: BackendModeratorDocument[];
  pagination: ModeratorDocumentPagination;
}

export interface ModeratorDocument {
  id: string;
  title: string;
  description: string;
  status: BackendDocumentStatus;
  statusLabel: string;
  authorName: string;
  subjectName: string;
  formatLabel: string;
  sizeLabel: string;
  fileUrl?: string;
  createdAtLabel: string;
  updatedAtLabel: string;
  rejectionReason: string | null;
  canReview: boolean;
}

export interface ModeratorDocumentListResult {
  documents: ModeratorDocument[];
  pagination: ModeratorDocumentPagination;
}

export interface ModeratorDashboardSummary {
  pendingCount: number;
  activeCount: number;
  rejectedCount: number;
  recentDocuments: ModeratorDocument[];
}
```

- [ ] **Step 4: Add the mapper implementation**

Create `features/document/services/moderatorDocumentMappers.ts`:

```ts
import type {
  BackendDocumentStatus,
  BackendModeratorDocument,
  BackendModeratorDocumentListResponse,
  ModeratorDocument,
  ModeratorDocumentListResult,
} from "../types";

const STATUS_LABELS: Record<BackendDocumentStatus, string> = {
  PENDING: "Chờ duyệt",
  ACTIVE: "Đã duyệt",
  REJECTED: "Từ chối",
  DELETED: "Đã xóa",
};

export const getModeratorStatusLabel = (status: BackendDocumentStatus) =>
  STATUS_LABELS[status] ?? status;

const formatModeratorDate = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Không rõ ngày";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const formatModeratorDocumentSize = (sizeInBytes?: number | null) => {
  if (sizeInBytes === undefined || sizeInBytes === null) {
    return "Không rõ dung lượng";
  }

  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  }

  if (sizeInBytes < 1024 * 1024 * 1024) {
    return `${(sizeInBytes / 1024 / 1024).toFixed(1)} MB`;
  }

  return `${(sizeInBytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
};

const getSubjectName = (document: BackendModeratorDocument) => {
  const subject = document.subject;

  if (!subject?.name) {
    return "Chưa phân loại";
  }

  return subject.code ? `${subject.name} (${subject.code})` : subject.name;
};

export const mapBackendDocumentToModeratorDocument = (
  document: BackendModeratorDocument
): ModeratorDocument => ({
  id: document.id,
  title: document.title,
  description: document.description ?? "",
  status: document.status,
  statusLabel: getModeratorStatusLabel(document.status),
  authorName: document.author?.name || "Không rõ tác giả",
  subjectName: getSubjectName(document),
  formatLabel: document.format?.toUpperCase() || "FILE",
  sizeLabel: formatModeratorDocumentSize(document.sizeInBytes),
  fileUrl: document.fileUrl ?? undefined,
  createdAtLabel: formatModeratorDate(document.createdAt),
  updatedAtLabel: document.updatedAt ? formatModeratorDate(document.updatedAt) : "",
  rejectionReason: document.rejectionReason ?? null,
  canReview: document.status === "PENDING",
});

export const mapBackendModeratorDocumentList = (
  response: BackendModeratorDocumentListResponse
): ModeratorDocumentListResult => ({
  documents: response.documents.map(mapBackendDocumentToModeratorDocument),
  pagination: response.pagination,
});
```

- [ ] **Step 5: Run the mapper test and verify GREEN**

Run:

```powershell
node --experimental-strip-types features/document/services/moderatorDocumentMappers.test.mjs
```

Expected: PASS all 5 tests.

- [ ] **Step 6: Commit mapper task changes**

Run:

```powershell
git add features/document/types.ts features/document/services/moderatorDocumentMappers.ts features/document/services/moderatorDocumentMappers.test.mjs
git commit -m "feat: add moderator document mappers"
```

If `features/document/types.ts` already contains unrelated user changes, inspect `git diff -- features/document/types.ts` before staging and commit only when the staged diff matches this task.

### Task 2: Moderator Query, Service, And Hooks

**Files:**
- Create: `features/document/services/moderatorDocumentQuery.ts`
- Test: `features/document/services/moderatorDocumentQuery.test.mjs`
- Create: `features/document/services/moderatorDocumentService.ts`
- Create: `features/document/hooks/useModeratorDocuments.ts`
- Create: `features/document/hooks/useModeratorDocumentDetail.ts`
- Modify: `features/document/hooks/index.ts`

- [ ] **Step 1: Write the failing query test**

Create `features/document/services/moderatorDocumentQuery.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";

let moderatorQuery = {};

try {
  moderatorQuery = await import("./moderatorDocumentQuery.ts");
} catch {
  moderatorQuery = {};
}

test("builds default pending moderator document params", () => {
  assert.equal(
    typeof moderatorQuery.buildModeratorDocumentListParams,
    "function",
    "buildModeratorDocumentListParams should be exported"
  );

  assert.deepEqual(moderatorQuery.buildModeratorDocumentListParams(), {
    page: 1,
    limit: 20,
    status: "PENDING",
  });
});

test("keeps explicit status page and limit for moderator document params", () => {
  assert.equal(
    typeof moderatorQuery.buildModeratorDocumentListParams,
    "function",
    "buildModeratorDocumentListParams should be exported"
  );

  assert.deepEqual(
    moderatorQuery.buildModeratorDocumentListParams({
      page: 3,
      limit: 5,
      status: "REJECTED",
    }),
    {
      page: 3,
      limit: 5,
      status: "REJECTED",
    }
  );
});
```

- [ ] **Step 2: Run the query test and verify RED**

Run:

```powershell
node --experimental-strip-types features/document/services/moderatorDocumentQuery.test.mjs
```

Expected: FAIL with `buildModeratorDocumentListParams should be exported`.

- [ ] **Step 3: Add query helper**

Create `features/document/services/moderatorDocumentQuery.ts`:

```ts
import type { ModeratorDocumentStatusFilter } from "../types";

export interface ModeratorDocumentListParams {
  page?: number;
  limit?: number;
  status?: ModeratorDocumentStatusFilter;
}

export const buildModeratorDocumentListParams = (
  params: ModeratorDocumentListParams = {}
) => ({
  page: params.page ?? 1,
  limit: params.limit ?? 20,
  status: params.status ?? "PENDING",
});
```

- [ ] **Step 4: Run the query test and verify GREEN**

Run:

```powershell
node --experimental-strip-types features/document/services/moderatorDocumentQuery.test.mjs
```

Expected: PASS both query tests.

- [ ] **Step 5: Add API service wrappers**

Create `features/document/services/moderatorDocumentService.ts`:

```ts
import { apiClient } from "@/services/api/axiosClient";

import type {
  BackendModeratorDocument,
  BackendModeratorDocumentListResponse,
  ModeratorDashboardSummary,
  ModeratorDocument,
  ModeratorDocumentListResult,
  ModeratorDocumentStatusFilter,
} from "../types";
import {
  mapBackendDocumentToModeratorDocument,
  mapBackendModeratorDocumentList,
} from "./moderatorDocumentMappers";
import {
  buildModeratorDocumentListParams,
  type ModeratorDocumentListParams,
} from "./moderatorDocumentQuery";

const fetchModeratorDocumentList = async (
  params: ModeratorDocumentListParams = {}
): Promise<ModeratorDocumentListResult> => {
  const response = await apiClient.get<unknown, BackendModeratorDocumentListResponse>(
    "/documents",
    {
      params: buildModeratorDocumentListParams(params),
    }
  );

  return mapBackendModeratorDocumentList(response);
};

export const fetchModeratorDocuments = (
  params: ModeratorDocumentListParams = {}
) => fetchModeratorDocumentList(params);

export const fetchModeratorDocumentDetail = async (
  id: string
): Promise<ModeratorDocument> => {
  const response = await apiClient.get<unknown, BackendModeratorDocument>(
    `/documents/${id}`
  );

  return mapBackendDocumentToModeratorDocument(response);
};

export const approveModeratorDocument = async (
  id: string
): Promise<ModeratorDocument> => {
  const response = await apiClient.post<unknown, BackendModeratorDocument>(
    `/documents/${id}/approve`
  );

  return mapBackendDocumentToModeratorDocument(response);
};

export const rejectModeratorDocument = async (
  id: string,
  rejectionReason: string
): Promise<ModeratorDocument> => {
  const response = await apiClient.post<unknown, BackendModeratorDocument>(
    `/documents/${id}/reject`,
    { rejectionReason }
  );

  return mapBackendDocumentToModeratorDocument(response);
};

const fetchCountByStatus = async (status: ModeratorDocumentStatusFilter) =>
  fetchModeratorDocumentList({ status, page: 1, limit: 5 });

export const fetchModeratorDashboard =
  async (): Promise<ModeratorDashboardSummary> => {
    const [pending, active, rejected] = await Promise.all([
      fetchCountByStatus("PENDING"),
      fetchCountByStatus("ACTIVE"),
      fetchCountByStatus("REJECTED"),
    ]);

    return {
      pendingCount: pending.pagination.total,
      activeCount: active.pagination.total,
      rejectedCount: rejected.pagination.total,
      recentDocuments: pending.documents.slice(0, 5),
    };
  };
```

- [ ] **Step 6: Add moderator list/dashboard hooks**

Create `features/document/hooks/useModeratorDocuments.ts`:

```ts
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import type {
  ModeratorDashboardSummary,
  ModeratorDocument,
  ModeratorDocumentListResult,
  ModeratorDocumentPagination,
  ModeratorDocumentStatusFilter,
} from "../types";
import {
  fetchModeratorDashboard,
  fetchModeratorDocuments,
} from "../services/moderatorDocumentService";

const DEFAULT_PAGINATION: ModeratorDocumentPagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
};

const EMPTY_DASHBOARD: ModeratorDashboardSummary = {
  pendingCount: 0,
  activeCount: 0,
  rejectedCount: 0,
  recentDocuments: [],
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const useModeratorDocuments = (
  status: ModeratorDocumentStatusFilter,
  limit = 20
) => {
  const [documents, setDocuments] = useState<ModeratorDocument[]>([]);
  const [pagination, setPagination] =
    useState<ModeratorDocumentPagination>(DEFAULT_PAGINATION);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result: ModeratorDocumentListResult = await fetchModeratorDocuments({
        status,
        page: 1,
        limit,
      });
      setDocuments(result.documents);
      setPagination(result.pagination);
    } catch (loadError) {
      setError(
        getErrorMessage(loadError, "Không thể tải danh sách tài liệu.")
      );
    } finally {
      hasLoadedRef.current = true;
      setIsLoading(false);
    }
  }, [limit, status]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      if (hasLoadedRef.current) {
        refresh();
      }
    }, [refresh])
  );

  return {
    documents,
    pagination,
    isLoading,
    error,
    refresh,
  };
};

export const useModeratorDashboard = () => {
  const [summary, setSummary] =
    useState<ModeratorDashboardSummary>(EMPTY_DASHBOARD);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setSummary(await fetchModeratorDashboard());
    } catch (loadError) {
      setError(
        getErrorMessage(loadError, "Không thể tải dữ liệu kiểm duyệt.")
      );
    } finally {
      hasLoadedRef.current = true;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      if (hasLoadedRef.current) {
        refresh();
      }
    }, [refresh])
  );

  return {
    summary,
    isLoading,
    error,
    refresh,
  };
};
```

- [ ] **Step 7: Add moderator detail hook**

Create `features/document/hooks/useModeratorDocumentDetail.ts`:

```ts
import { useCallback, useEffect, useState } from "react";

import type { ModeratorDocument } from "../types";
import {
  approveModeratorDocument,
  fetchModeratorDocumentDetail,
  rejectModeratorDocument,
} from "../services/moderatorDocumentService";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const useModeratorDocumentDetail = (documentId: string | null) => {
  const [document, setDocument] = useState<ModeratorDocument | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(documentId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!documentId) {
      setDocument(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setDocument(await fetchModeratorDocumentDetail(documentId));
    } catch (loadError) {
      setError(
        getErrorMessage(loadError, "Không thể tải chi tiết tài liệu.")
      );
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const approve = useCallback(async () => {
    if (!documentId) {
      return null;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const approvedDocument = await approveModeratorDocument(documentId);
      setDocument(approvedDocument);
      return approvedDocument;
    } catch (submitError) {
      setError(
        getErrorMessage(submitError, "Không thể duyệt tài liệu.")
      );
      throw submitError;
    } finally {
      setIsSubmitting(false);
    }
  }, [documentId]);

  const reject = useCallback(
    async (reason: string) => {
      if (!documentId) {
        return null;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const rejectedDocument = await rejectModeratorDocument(
          documentId,
          reason
        );
        setDocument(rejectedDocument);
        return rejectedDocument;
      } catch (submitError) {
        setError(
          getErrorMessage(submitError, "Không thể từ chối tài liệu.")
        );
        throw submitError;
      } finally {
        setIsSubmitting(false);
      }
    },
    [documentId]
  );

  return {
    document,
    isLoading,
    isSubmitting,
    error,
    refresh,
    approve,
    reject,
  };
};
```

- [ ] **Step 8: Export moderator hooks**

Modify `features/document/hooks/index.ts`:

```ts
/**
 * Document Feature - Hooks Index
 */

export { useDocument, useDocumentSearch, useQuickPrompts } from "./useDocument";
export { useUploadDocument } from "./useUploadDocument";
export {
  useModeratorDashboard,
  useModeratorDocuments,
} from "./useModeratorDocuments";
export { useModeratorDocumentDetail } from "./useModeratorDocumentDetail";
```

- [ ] **Step 9: Run data-layer tests and type-check touched files**

Run:

```powershell
node --experimental-strip-types features/document/services/moderatorDocumentMappers.test.mjs
node --experimental-strip-types features/document/services/moderatorDocumentQuery.test.mjs
npx tsc --noEmit
```

Expected: both Node tests PASS. `npx tsc --noEmit` should PASS or report pre-existing unrelated errors; capture the first unrelated error if it fails.

- [ ] **Step 10: Commit service and hooks task changes**

Run:

```powershell
git add features/document/services/moderatorDocumentQuery.ts features/document/services/moderatorDocumentQuery.test.mjs features/document/services/moderatorDocumentService.ts features/document/hooks/useModeratorDocuments.ts features/document/hooks/useModeratorDocumentDetail.ts features/document/hooks/index.ts
git commit -m "feat: add moderator document api hooks"
```

If `features/document/hooks/index.ts` already contains unrelated user changes, inspect `git diff -- features/document/hooks/index.ts` before staging and commit only when the staged diff matches this task.

### Task 3: Real API Moderator Dashboard

**Files:**
- Modify: `features/document/screens/ModeratorDashboardScreen.tsx`

- [ ] **Step 1: Inspect pre-existing dashboard changes**

Run:

```powershell
git diff -- features/document/screens/ModeratorDashboardScreen.tsx
```

Expected: review whether the file has user changes. Preserve unrelated changes.

- [ ] **Step 2: Replace mock dashboard state with hook-backed data**

Update imports in `features/document/screens/ModeratorDashboardScreen.tsx` to include:

```ts
import React from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatsCard } from "@/features/admin/components/StatsCard";
import { useRouter } from "expo-router";
import { useProfileStore } from "@/features/profile/store/profileStore";
import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
} from "lucide-react-native";

import { useModeratorDashboard } from "../hooks";
import type { ModeratorDocument } from "../types";
```

Delete the `RECENT_REVIEWS` array and the unused `logout` extraction.

Add these helpers above the component:

```ts
const getProgress = (value: number, total: number) => {
  if (total <= 0) {
    return 0;
  }

  return Math.min(value / total, 1);
};

const getStatusIcon = (document: ModeratorDocument) => {
  if (document.status === "PENDING") {
    return <Clock size={18} color="#f59e0b" />;
  }

  if (document.status === "ACTIVE") {
    return <CheckCircle size={18} color="#10b981" />;
  }

  return <AlertTriangle size={18} color="#f43f5e" />;
};
```

Inside the component, call the dashboard hook:

```ts
const { summary, isLoading, error, refresh } = useModeratorDashboard();
const totalDocuments =
  summary.pendingCount + summary.activeCount + summary.rejectedCount;
```

- [ ] **Step 3: Render real cards, loading, error, and recent documents**

In the `ScrollView`, add `refreshControl`:

```tsx
refreshControl={
  <RefreshControl refreshing={isLoading} onRefresh={refresh} />
}
```

Replace the stats grid with only real API-backed cards:

```tsx
<View style={styles.statsGrid}>
  <StatsCard
    title="Tài liệu chờ duyệt"
    value={String(summary.pendingCount)}
    progress={getProgress(summary.pendingCount, totalDocuments)}
    isDark={true}
    onPress={() => router.push("/(moderator-tabs)/review")}
  />
  <StatsCard
    title="Đã duyệt"
    value={String(summary.activeCount)}
    progress={getProgress(summary.activeCount, totalDocuments)}
    color="#10b981"
    onPress={() => router.push("/(moderator-tabs)/review")}
  />
  <StatsCard
    title="Từ chối"
    value={String(summary.rejectedCount)}
    progress={getProgress(summary.rejectedCount, totalDocuments)}
    color="#f43f5e"
    onPress={() => router.push("/(moderator-tabs)/review")}
  />
</View>
```

Replace title text `Moderator` with:

```tsx
<Text style={styles.title}>Kiểm duyệt viên</Text>
```

Remove the weekly efficiency chart and quick tools sections.

Before the recent list, render loading and error states:

```tsx
{isLoading && summary.recentDocuments.length === 0 ? (
  <View style={styles.stateBox}>
    <ActivityIndicator color="#0f172a" />
    <Text style={styles.stateText}>Đang tải dữ liệu kiểm duyệt...</Text>
  </View>
) : null}

{error ? (
  <View style={styles.stateBox}>
    <AlertTriangle size={20} color="#f43f5e" />
    <Text style={styles.stateText}>{error}</Text>
    <TouchableOpacity onPress={refresh} style={styles.retryButton}>
      <Text style={styles.retryText}>Thử lại</Text>
    </TouchableOpacity>
  </View>
) : null}
```

Render `summary.recentDocuments` instead of `RECENT_REVIEWS`:

```tsx
{summary.recentDocuments.length > 0 ? (
  summary.recentDocuments.map((item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.reviewItem}
      onPress={() => router.push("/(moderator-tabs)/review")}
    >
      <View
        style={[
          styles.iconBox,
          item.status === "PENDING"
            ? styles.pendingIcon
            : item.status === "ACTIVE"
              ? styles.approvedIcon
              : styles.rejectedIcon,
        ]}
      >
        {getStatusIcon(item)}
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.itemAuthor}>
          {item.authorName} • {item.createdAtLabel}
        </Text>
      </View>
      <ChevronRight size={18} color="#cbd5e1" />
    </TouchableOpacity>
  ))
) : !isLoading && !error ? (
  <View style={styles.stateBox}>
    <FileText size={20} color="#94a3b8" />
    <Text style={styles.stateText}>Không có tài liệu chờ duyệt.</Text>
  </View>
) : null}
```

Add styles used above:

```ts
stateBox: {
  alignItems: "center",
  backgroundColor: "#f8fafc",
  borderColor: "#f1f5f9",
  borderRadius: 12,
  borderWidth: 1,
  gap: 8,
  padding: 16,
},
stateText: {
  color: "#64748b",
  fontSize: 13,
  textAlign: "center",
},
retryButton: {
  backgroundColor: "#0f172a",
  borderRadius: 10,
  paddingHorizontal: 16,
  paddingVertical: 10,
},
retryText: {
  color: "#fff",
  fontSize: 13,
  fontWeight: "700",
},
```

- [ ] **Step 4: Run focused verification**

Run:

```powershell
npx tsc --noEmit
```

Expected: PASS or only pre-existing unrelated type errors. The dashboard file must not introduce new TypeScript errors.

- [ ] **Step 5: Commit dashboard changes**

Run:

```powershell
git add features/document/screens/ModeratorDashboardScreen.tsx
git commit -m "feat: connect moderator dashboard to real api"
```

### Task 4: Real API Moderator Review Queue

**Files:**
- Modify: `features/document/screens/ModeratorReviewScreen.tsx`

- [ ] **Step 1: Inspect pre-existing review screen changes**

Run:

```powershell
git diff -- features/document/screens/ModeratorReviewScreen.tsx
```

Expected: review whether the file has user changes. Preserve unrelated changes.

- [ ] **Step 2: Replace mock list and filters with status-backed state**

Delete `REVIEW_DOCUMENTS`, `FILTERS`, imports for `Search`, `Filter`, `Eye`, and `AlertCircle`.

Use these imports:

```ts
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  XCircle,
} from "lucide-react-native";

import { useModeratorDocuments } from "../hooks";
import type { ModeratorDocumentStatusFilter } from "../types";
import { ModeratorDocumentDetailScreen } from "./ModeratorDocumentDetailScreen";
```

Add filter constants:

```ts
const FILTERS: Array<{
  label: string;
  status: ModeratorDocumentStatusFilter;
}> = [
  { label: "Chờ duyệt", status: "PENDING" },
  { label: "Đã duyệt", status: "ACTIVE" },
  { label: "Từ chối", status: "REJECTED" },
];

const EMPTY_MESSAGES: Record<ModeratorDocumentStatusFilter, string> = {
  PENDING: "Không có tài liệu chờ duyệt.",
  ACTIVE: "Chưa có tài liệu đã duyệt.",
  REJECTED: "Chưa có tài liệu bị từ chối.",
};
```

Use real hook state:

```ts
const [activeStatus, setActiveStatus] =
  useState<ModeratorDocumentStatusFilter>("PENDING");
const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
const { documents, pagination, isLoading, error, refresh } =
  useModeratorDocuments(activeStatus);
const activeFilterLabel = useMemo(
  () => FILTERS.find((filter) => filter.status === activeStatus)?.label ?? "",
  [activeStatus]
);
```

When `selectedDocumentId` exists, render detail:

```tsx
if (selectedDocumentId) {
  return (
    <ModeratorDocumentDetailScreen
      documentId={selectedDocumentId}
      onBack={() => setSelectedDocumentId(null)}
      onCompleted={() => {
        setSelectedDocumentId(null);
        refresh();
      }}
    />
  );
}
```

- [ ] **Step 3: Render API-backed queue states**

Update subtitle:

```tsx
<Text style={styles.headerSubtitle}>
  {pagination.total} tài liệu {activeFilterLabel.toLowerCase()}
</Text>
```

Use filter chip press:

```tsx
onPress={() => setActiveStatus(filter.status)}
style={[
  styles.filterChip,
  activeStatus === filter.status && styles.filterChipActive,
]}
```

Render list with refresh control:

```tsx
<ScrollView
  style={styles.list}
  contentContainerStyle={styles.listContent}
  refreshControl={
    <RefreshControl refreshing={isLoading} onRefresh={refresh} />
  }
  showsVerticalScrollIndicator={false}
>
```

Add state blocks before cards:

```tsx
{isLoading && documents.length === 0 ? (
  <View style={styles.stateBox}>
    <ActivityIndicator color="#0f172a" />
    <Text style={styles.stateText}>Đang tải danh sách tài liệu...</Text>
  </View>
) : null}

{error ? (
  <View style={styles.stateBox}>
    <AlertTriangle size={20} color="#ef4444" />
    <Text style={styles.stateText}>{error}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={refresh}>
      <Text style={styles.retryText}>Thử lại</Text>
    </TouchableOpacity>
  </View>
) : null}

{!isLoading && !error && documents.length === 0 ? (
  <View style={styles.stateBox}>
    <FileText size={22} color="#94a3b8" />
    <Text style={styles.stateText}>{EMPTY_MESSAGES[activeStatus]}</Text>
  </View>
) : null}
```

Map real documents:

```tsx
{documents.map((doc) => (
  <TouchableOpacity
    key={doc.id}
    style={styles.card}
    activeOpacity={0.7}
    onPress={() => setSelectedDocumentId(doc.id)}
  >
    <View style={styles.cardTop}>
      <View style={styles.formatBadge}>
        <FileText size={14} color="#64748b" />
        <Text style={styles.formatText}>
          {doc.formatLabel} • {doc.sizeLabel}
        </Text>
      </View>
      <View style={styles.statusBadge}>
        {doc.status === "PENDING" ? (
          <Clock size={14} color="#f59e0b" />
        ) : doc.status === "ACTIVE" ? (
          <CheckCircle2 size={14} color="#10b981" />
        ) : (
          <XCircle size={14} color="#ef4444" />
        )}
        <Text style={styles.statusText}>{doc.statusLabel}</Text>
      </View>
    </View>

    <Text style={styles.docTitle} numberOfLines={2}>
      {doc.title}
    </Text>

    <View style={styles.cardFooter}>
      <View style={styles.authorRow}>
        <View style={styles.authorAvatarPlaceholder}>
          <Text style={styles.avatarInitial}>{doc.authorName[0]}</Text>
        </View>
        <Text style={styles.authorName} numberOfLines={1}>
          {doc.authorName}
        </Text>
      </View>
      <View style={styles.uploadedAtRow}>
        <Clock size={12} color="#94a3b8" />
        <Text style={styles.uploadedAtText}>{doc.createdAtLabel}</Text>
      </View>
    </View>

    <View style={styles.cardActions}>
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{doc.subjectName}</Text>
      </View>
      <View style={styles.detailLink}>
        <Text style={styles.detailLinkText}>Kiểm tra</Text>
        <ChevronRight size={16} color="#3b82f6" />
      </View>
    </View>
  </TouchableOpacity>
))}
```

Add styles:

```ts
statusBadge: {
  alignItems: "center",
  flexDirection: "row",
  gap: 4,
},
statusText: {
  color: "#64748b",
  fontSize: 11,
  fontWeight: "700",
},
stateBox: {
  alignItems: "center",
  backgroundColor: "#f8fafc",
  borderColor: "#f1f5f9",
  borderRadius: 12,
  borderWidth: 1,
  gap: 8,
  padding: 18,
},
stateText: {
  color: "#64748b",
  fontSize: 13,
  textAlign: "center",
},
retryButton: {
  backgroundColor: "#0f172a",
  borderRadius: 10,
  paddingHorizontal: 16,
  paddingVertical: 10,
},
retryText: {
  color: "#fff",
  fontSize: 13,
  fontWeight: "700",
},
```

Remove `aiBadge`, `aiLabel`, and `aiValue` styles if unused.

- [ ] **Step 4: Run focused verification**

Run:

```powershell
npx tsc --noEmit
```

Expected: PASS or only pre-existing unrelated type errors. The review screen must not introduce new TypeScript errors.

- [ ] **Step 5: Commit review queue changes**

Run:

```powershell
git add features/document/screens/ModeratorReviewScreen.tsx
git commit -m "feat: connect moderator review queue to real api"
```

### Task 5: Real API Moderator Detail And Actions

**Files:**
- Modify: `features/document/screens/ModeratorDocumentDetailScreen.tsx`

- [ ] **Step 1: Inspect pre-existing detail screen changes**

Run:

```powershell
git diff -- features/document/screens/ModeratorDocumentDetailScreen.tsx
```

Expected: review whether the file has user changes. Preserve unrelated changes.

- [ ] **Step 2: Replace prop contract and unsupported fields**

Change props to:

```ts
interface Props {
  documentId: string;
  onBack: () => void;
  onCompleted: () => void;
}
```

Remove `ReviewDocumentDetail` and imports for `Image`, `Layers`, `ShieldCheck`, and `User`.

Use imports:

```ts
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ExternalLink,
  FileText,
  X,
  XCircle,
} from "lucide-react-native";

import { useModeratorDocumentDetail } from "../hooks";
```

Inside the component:

```ts
const {
  document: doc,
  isLoading,
  isSubmitting,
  error,
  refresh,
  approve,
  reject,
} = useModeratorDocumentDetail(documentId);
```

- [ ] **Step 3: Wire approve, reject, and open-file actions**

Use these handlers:

```ts
const handleOpenFile = async () => {
  if (!doc?.fileUrl) {
    return;
  }

  try {
    await Linking.openURL(doc.fileUrl);
  } catch {
    Alert.alert("Không thể mở tệp", "Vui lòng thử lại sau.");
  }
};

const handleApprove = () => {
  if (!doc) {
    return;
  }

  Alert.alert(
    "Xác nhận duyệt",
    `Tài liệu "${doc.title}" sẽ được xuất bản lên hệ thống.`,
    [
      { text: "Để sau", style: "cancel" },
      {
        text: "Duyệt ngay",
        onPress: async () => {
          try {
            await approve();
            Alert.alert("Thành công", "Đã duyệt tài liệu.");
            onCompleted();
          } catch {
            Alert.alert("Lỗi", "Không thể duyệt tài liệu.");
          }
        },
      },
    ]
  );
};

const handleRejectSubmit = async () => {
  const reason = rejectReason.trim();

  if (!reason) {
    Alert.alert("Lỗi", "Vui lòng nhập lý do từ chối.");
    return;
  }

  try {
    await reject(reason);
    setRejectModalVisible(false);
    setRejectReason("");
    Alert.alert("Thành công", "Đã từ chối tài liệu.");
    onCompleted();
  } catch {
    Alert.alert("Lỗi", "Không thể từ chối tài liệu.");
  }
};
```

Render loading and error before document content:

```tsx
{isLoading ? (
  <View style={styles.stateBox}>
    <ActivityIndicator color="#0f172a" />
    <Text style={styles.stateText}>Đang tải chi tiết tài liệu...</Text>
  </View>
) : null}

{error && !isLoading ? (
  <View style={styles.stateBox}>
    <AlertTriangle size={22} color="#ef4444" />
    <Text style={styles.stateText}>{error}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={refresh}>
      <Text style={styles.retryText}>Thử lại</Text>
    </TouchableOpacity>
  </View>
) : null}
```

If `!doc && !isLoading`, render only the state block and no action bar.

- [ ] **Step 4: Render only real backend fields**

Use these fields in content:

```tsx
<View style={styles.previewCard}>
  <FileText size={64} color="#3b82f6" strokeWidth={1.5} />
  <Text style={styles.formatText}>
    {doc.formatLabel} • {doc.sizeLabel}
  </Text>
  {doc.fileUrl ? (
    <TouchableOpacity style={styles.previewButton} onPress={handleOpenFile}>
      <ExternalLink size={18} color="#fff" />
      <Text style={styles.previewButtonText}>Mở tệp</Text>
    </TouchableOpacity>
  ) : null}
</View>
```

Replace tag row:

```tsx
<View style={styles.tagRow}>
  <View style={styles.categoryTag}>
    <Text style={styles.categoryTagText}>{doc.subjectName}</Text>
  </View>
  <View style={styles.yearTag}>
    <Text style={styles.yearTagText}>{doc.statusLabel}</Text>
  </View>
</View>
```

Replace meta grid with author/date/format/size:

```tsx
<View style={styles.metaGrid}>
  <View style={styles.metaItem}>
    <Text style={styles.metaLabel}>NGƯỜI TẢI LÊN</Text>
    <View style={styles.metaValueRow}>
      <View style={styles.avatarMini}>
        <Text style={styles.avatarText}>{doc.authorName[0]}</Text>
      </View>
      <Text style={styles.metaValueText} numberOfLines={1}>
        {doc.authorName}
      </Text>
    </View>
  </View>

  <View style={styles.metaItem}>
    <Text style={styles.metaLabel}>NGÀY TẢI</Text>
    <View style={styles.metaValueRow}>
      <Calendar size={14} color="#64748b" />
      <Text style={styles.metaValueText}>{doc.createdAtLabel}</Text>
    </View>
  </View>

  <View style={styles.metaItem}>
    <Text style={styles.metaLabel}>ĐỊNH DẠNG</Text>
    <View style={styles.metaValueRow}>
      <FileText size={14} color="#64748b" />
      <Text style={styles.metaValueText}>{doc.formatLabel}</Text>
    </View>
  </View>

  <View style={styles.metaItem}>
    <Text style={styles.metaLabel}>DUNG LƯỢNG</Text>
    <View style={styles.metaValueRow}>
      <FileText size={14} color="#64748b" />
      <Text style={styles.metaValueText}>{doc.sizeLabel}</Text>
    </View>
  </View>
</View>
```

Render description:

```tsx
<View style={styles.descriptionContainer}>
  <Text style={styles.descriptionLabel}>MÔ TẢ NỘI DUNG</Text>
  <Text style={styles.descriptionText}>
    {doc.description || "Tài liệu chưa có mô tả."}
  </Text>
</View>
```

Render rejection reason only when present:

```tsx
{doc.rejectionReason ? (
  <View style={styles.descriptionContainer}>
    <Text style={styles.descriptionLabel}>LÝ DO TỪ CHỐI</Text>
    <Text style={styles.descriptionText}>{doc.rejectionReason}</Text>
  </View>
) : null}
```

Only render action bar when `doc.canReview` is true:

```tsx
{doc?.canReview ? (
  <View style={styles.actionBar}>
    <TouchableOpacity
      style={[styles.rejectButton, isSubmitting && styles.disabledButton]}
      onPress={() => setRejectModalVisible(true)}
      disabled={isSubmitting}
    >
      <XCircle size={20} color="#64748b" />
      <Text style={styles.rejectButtonText}>Từ chối</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.approveButton, isSubmitting && styles.disabledButton]}
      onPress={handleApprove}
      disabled={isSubmitting}
    >
      <CheckCircle size={20} color="#fff" />
      <Text style={styles.approveButtonText}>Duyệt tài liệu</Text>
    </TouchableOpacity>
  </View>
) : null}
```

Disable confirm while submitting:

```tsx
<TouchableOpacity
  style={[styles.modalConfirmButton, isSubmitting && styles.disabledButton]}
  onPress={handleRejectSubmit}
  disabled={isSubmitting}
>
  <Text style={styles.modalConfirmText}>
    {isSubmitting ? "Đang gửi..." : "Xác nhận"}
  </Text>
</TouchableOpacity>
```

Add styles:

```ts
stateBox: {
  alignItems: "center",
  backgroundColor: "#f8fafc",
  borderColor: "#f1f5f9",
  borderRadius: 12,
  borderWidth: 1,
  gap: 8,
  marginTop: 24,
  padding: 18,
},
stateText: {
  color: "#64748b",
  fontSize: 13,
  textAlign: "center",
},
retryButton: {
  backgroundColor: "#0f172a",
  borderRadius: 10,
  paddingHorizontal: 16,
  paddingVertical: 10,
},
retryText: {
  color: "#fff",
  fontSize: 13,
  fontWeight: "700",
},
disabledButton: {
  opacity: 0.6,
},
```

Remove `scoreColor` and styles only used by AI score or page count after replacing JSX.

- [ ] **Step 5: Run focused verification**

Run:

```powershell
npx tsc --noEmit
```

Expected: PASS or only pre-existing unrelated type errors. The detail screen must not introduce new TypeScript errors.

- [ ] **Step 6: Commit detail changes**

Run:

```powershell
git add features/document/screens/ModeratorDocumentDetailScreen.tsx
git commit -m "feat: connect moderator detail actions to real api"
```

### Task 6: Vietnamese Route Titles And Public Exports

**Files:**
- Modify: `app/(moderator-tabs)/_layout.tsx`
- Modify: `app/moderator-review.tsx`
- Modify: `features/document/index.ts`

- [ ] **Step 1: Inspect pre-existing route changes**

Run:

```powershell
git diff -- "app/(moderator-tabs)/_layout.tsx"
git diff -- app/moderator-review.tsx
git diff -- features/document/index.ts
```

Expected: review existing changes in route files and preserve unrelated work.

- [ ] **Step 2: Update moderator tab title**

In `app/(moderator-tabs)/_layout.tsx`, change:

```ts
title: "Home",
```

to:

```ts
title: "Trang chủ",
```

- [ ] **Step 3: Update stack title**

In `app/moderator-review.tsx`, change:

```ts
title: "Document Review",
```

to:

```ts
title: "Duyệt tài liệu",
```

- [ ] **Step 4: Export moderator hooks from document public API**

In `features/document/index.ts`, extend the hooks export block:

```ts
export {
  useDocument,
  useDocumentSearch,
  useModeratorDashboard,
  useModeratorDocumentDetail,
  useModeratorDocuments,
  useQuickPrompts,
  useUploadDocument,
} from "./hooks";
```

- [ ] **Step 5: Search for leftover moderator mock strings**

Run:

```powershell
rg -n "REVIEW_DOCUMENTS|RECENT_REVIEWS|AI Score|Accurate|Urgent|Review Queue|Document Review|Home|Moderator" app features/document
```

Expected: no hits in moderator flow except acceptable type names such as `ModeratorReviewScreen`.

- [ ] **Step 6: Commit title/export changes**

Run:

```powershell
git add "app/(moderator-tabs)/_layout.tsx" app/moderator-review.tsx features/document/index.ts
git commit -m "chore: localize moderator route titles"
```

If these files had pre-existing unrelated edits, inspect `git diff --staged` before committing and do not include unrelated hunks.

### Task 7: Final Verification

**Files:**
- Verify all files touched by Tasks 1-6.

- [ ] **Step 1: Run mapper and query tests**

Run:

```powershell
node --experimental-strip-types features/document/services/moderatorDocumentMappers.test.mjs
node --experimental-strip-types features/document/services/moderatorDocumentQuery.test.mjs
```

Expected: both commands PASS.

- [ ] **Step 2: Run lint**

Run:

```powershell
npm run lint
```

Expected: PASS. If it fails because of unrelated pre-existing files, capture the first unrelated error and confirm no moderator file is listed.

- [ ] **Step 3: Run TypeScript**

Run:

```powershell
npx tsc --noEmit
```

Expected: PASS. If it fails because of unrelated pre-existing files, capture the first unrelated error and confirm no moderator file is listed.

- [ ] **Step 4: Start Expo for manual smoke testing**

Run:

```powershell
npm run start -- --clear
```

Expected: Expo starts successfully and prints the local development URL. Keep this process running only if the user wants to test immediately.

- [ ] **Step 5: Manual smoke test moderator flow**

Using a moderator account:

1. Log in and confirm the moderator tab lands on `Trang chủ`.
2. Confirm dashboard shows real counts for `Tài liệu chờ duyệt`, `Đã duyệt`, `Từ chối`.
3. Open `Duyệt tài liệu`.
4. Switch filters `Chờ duyệt`, `Đã duyệt`, `Từ chối`.
5. Open a pending document detail.
6. Confirm no AI score, page count, year, urgent badge, weekly chart, report card, or tools card appears.
7. Use `Mở tệp` when `fileUrl` exists.
8. Approve one pending document and confirm it leaves the pending list after refresh.
9. Reject one pending document with a non-empty reason and confirm it leaves the pending list after refresh.

- [ ] **Step 6: Final status check**

Run:

```powershell
git status --short
```

Expected: only intentional task files are modified or committed. Existing unrelated dirty files can remain, but they must be called out in the final response.

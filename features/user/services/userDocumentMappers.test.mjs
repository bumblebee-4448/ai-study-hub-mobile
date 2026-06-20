import assert from "node:assert/strict";
import test from "node:test";

import {
  formatDocumentSize,
  mapBackendDocumentToUserDocument,
} from "./userDocumentMappers.ts";

test("formats document size for compact display", () => {
  assert.equal(formatDocumentSize(undefined), "");
  assert.equal(formatDocumentSize(820), "820 B");
  assert.equal(formatDocumentSize(1536), "1.5 KB");
  assert.equal(formatDocumentSize(1572864), "1.5 MB");
});

test("maps backend document record into a user document row", () => {
  const document = {
    id: "doc-1",
    title: "Giải tích 1 - Đề cương ôn tập",
    publicId: "academishare/doc-1",
    status: "PENDING",
    isPublic: true,
    createdAt: "2026-06-19T10:30:00.000Z",
    updatedAt: "2026-06-19T12:30:00.000Z",
    rejectionReason: null,
    format: "pdf",
    sizeInBytes: 1572864,
    author: {
      id: "user-1",
      name: "Nguyễn Văn A",
      avatarUrl: null,
    },
    subject: {
      id: "subject-1",
      name: "Giải tích",
      code: "MAE101",
    },
  };

  assert.deepEqual(mapBackendDocumentToUserDocument(document), {
    id: "doc-1",
    title: "Giải tích 1 - Đề cương ôn tập",
    subjectLabel: "Giải tích (MAE101)",
    authorLabel: "Nguyễn Văn A",
    status: "PENDING",
    statusLabel: "Chờ duyệt",
    visibilityLabel: "Công khai",
    formatLabel: "PDF",
    sizeLabel: "1.5 MB",
    createdAtLabel: "19/06/2026",
    rejectionReason: null,
  });
});

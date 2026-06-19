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

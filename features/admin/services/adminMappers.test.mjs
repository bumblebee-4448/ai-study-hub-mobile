import assert from "node:assert/strict";
import test from "node:test";

let adminMappers = {};

try {
  adminMappers = await import("./adminMappers.ts");
} catch {
  adminMappers = {};
}

test("maps dashboard stats with defensive zero defaults", () => {
  assert.equal(
    typeof adminMappers.mapAdminDashboardStats,
    "function",
    "mapAdminDashboardStats should be exported"
  );

  assert.deepEqual(
    adminMappers.mapAdminDashboardStats({
      accounts: {
        total: 18,
        active: 12,
      },
      subjects: {
        total: 7,
      },
      documents: {
        total: 30,
        pending: 4,
      },
    }),
    {
      accounts: {
        total: 18,
        active: 12,
        banned: 0,
        unverified: 0,
      },
      subjects: {
        total: 7,
      },
      documents: {
        total: 30,
        active: 0,
        pending: 4,
        rejected: 0,
      },
    }
  );
});

test("maps account records into Vietnamese admin list items", () => {
  assert.equal(
    typeof adminMappers.mapAdminAccount,
    "function",
    "mapAdminAccount should be exported"
  );

  assert.deepEqual(
    adminMappers.mapAdminAccount({
      id: "account-1",
      name: "Nguyễn Văn A",
      email: "admin-user@example.com",
      avatarUrl: null,
      role: "MODERATOR",
      status: "ACTIVE",
      createdAt: "2026-06-19T10:00:00.000Z",
      updatedAt: "2026-06-19T12:00:00.000Z",
    }),
    {
      id: "account-1",
      name: "Nguyễn Văn A",
      email: "admin-user@example.com",
      avatarUrl: undefined,
      role: "MODERATOR",
      roleLabel: "Kiểm duyệt viên",
      status: "ACTIVE",
      statusLabel: "Đang hoạt động",
      statusTone: "success",
      createdAt: "2026-06-19T10:00:00.000Z",
      createdAtLabel: "19/06/2026",
      updatedAt: "2026-06-19T12:00:00.000Z",
      updatedAtLabel: "19/06/2026",
      initials: "NA",
      canBan: true,
    }
  );
});

test("maps subject records and falls back for invalid dates", () => {
  assert.equal(
    typeof adminMappers.mapAdminSubject,
    "function",
    "mapAdminSubject should be exported"
  );

  assert.deepEqual(
    adminMappers.mapAdminSubject({
      id: "subject-1",
      name: "Mobile Programming",
      code: "MOB101",
      schoolId: "school-1",
      createdAt: "invalid-date",
      updatedAt: null,
    }),
    {
      id: "subject-1",
      name: "Mobile Programming",
      code: "MOB101",
      schoolId: "school-1",
      createdAt: "invalid-date",
      createdAtLabel: "Chưa có dữ liệu",
      updatedAt: undefined,
      updatedAtLabel: "Chưa cập nhật",
    }
  );
});

test("builds trimmed subject and account payloads", () => {
  assert.equal(
    typeof adminMappers.buildCreateAdminAccountPayload,
    "function",
    "buildCreateAdminAccountPayload should be exported"
  );
  assert.equal(
    typeof adminMappers.buildAdminSubjectPayload,
    "function",
    "buildAdminSubjectPayload should be exported"
  );

  assert.deepEqual(
    adminMappers.buildCreateAdminAccountPayload({
      name: "  Trần Kiểm Duyệt  ",
      email: "  mod@example.com  ",
      password: "password123",
      avatarUrl: "   ",
    }),
    {
      name: "Trần Kiểm Duyệt",
      email: "mod@example.com",
      password: "password123",
      role: "MODERATOR",
      status: "ACTIVE",
    }
  );

  assert.deepEqual(
    adminMappers.buildAdminSubjectPayload({
      name: "  Lập trình di động  ",
      code: " mob201 ",
    }),
    {
      name: "Lập trình di động",
      code: "MOB201",
    }
  );
});

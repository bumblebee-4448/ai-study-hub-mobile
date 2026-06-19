import assert from "node:assert/strict";
import test from "node:test";

import {
  getHomeRouteForRole,
  mapBackendRole,
  mapCurrentUserToAuthUser,
  mapCurrentUserToProfile,
} from "./authMappers.ts";

test("maps backend auth roles into mobile roles", () => {
  assert.equal(mapBackendRole("USER"), "student");
  assert.equal(mapBackendRole("ADMIN"), "admin");
  assert.equal(mapBackendRole("MODERATOR"), "moderator");
  assert.throws(() => mapBackendRole("TEACHER"), /Unsupported user role/);
});

test("maps current user response into auth and profile state", () => {
  const currentUser = {
    id: "user-1",
    email: "student@example.com",
    name: "Student One",
    avatarUrl: null,
    role: "USER",
    status: "UNVERIFIED",
    createdAt: "2026-06-19T10:00:00.000Z",
  };

  assert.deepEqual(mapCurrentUserToAuthUser(currentUser), {
    id: "user-1",
    email: "student@example.com",
    name: "Student One",
    avatarUrl: undefined,
    status: "UNVERIFIED",
  });

  assert.deepEqual(mapCurrentUserToProfile(currentUser), {
    id: "user-1",
    email: "student@example.com",
    name: "Student One",
    avatarUrl: undefined,
    role: "USER",
    status: "UNVERIFIED",
    createdAt: "2026-06-19T10:00:00.000Z",
  });
});

test("routes users to the role-specific home tabs", () => {
  assert.equal(getHomeRouteForRole("student"), "/(student-tabs)");
  assert.equal(getHomeRouteForRole("admin"), "/(admin-tabs)");
  assert.equal(getHomeRouteForRole("moderator"), "/(moderator-tabs)");
});

import assert from "node:assert/strict";
import test from "node:test";

let profileMappers = {};

try {
  profileMappers = await import("./profileMappers.ts");
} catch {
  profileMappers = {};
}

test("maps backend current user into profile state", () => {
  assert.equal(
    typeof profileMappers.mapBackendProfileToUserProfile,
    "function",
    "mapBackendProfileToUserProfile should be exported"
  );

  assert.deepEqual(
    profileMappers.mapBackendProfileToUserProfile({
      id: "user-1",
      email: "student@example.com",
      name: "Student One",
      avatarUrl: null,
      role: "USER",
      status: "ACTIVE",
      createdAt: "2026-06-19T10:00:00.000Z",
    }),
    {
      id: "user-1",
      email: "student@example.com",
      name: "Student One",
      avatarUrl: undefined,
      role: "USER",
      status: "ACTIVE",
      createdAt: "2026-06-19T10:00:00.000Z",
    }
  );
});

test("builds trimmed update profile payload and omits blank avatar", () => {
  assert.equal(
    typeof profileMappers.buildUpdateProfilePayload,
    "function",
    "buildUpdateProfilePayload should be exported"
  );

  assert.deepEqual(
    profileMappers.buildUpdateProfilePayload({
      name: "  Nguyễn Văn A  ",
      avatarUrl: "   ",
    }),
    {
      name: "Nguyễn Văn A",
    }
  );
});

test("keeps valid avatar url in update profile payload", () => {
  assert.equal(
    typeof profileMappers.buildUpdateProfilePayload,
    "function",
    "buildUpdateProfilePayload should be exported"
  );

  assert.deepEqual(
    profileMappers.buildUpdateProfilePayload({
      name: "Student One",
      avatarUrl: "  https://example.com/avatar.png  ",
    }),
    {
      name: "Student One",
      avatarUrl: "https://example.com/avatar.png",
    }
  );
});

test("compares profile values to avoid redundant profile store updates", () => {
  assert.equal(
    typeof profileMappers.areProfilesEqual,
    "function",
    "areProfilesEqual should be exported"
  );

  const profile = {
    id: "user-1",
    email: "student@example.com",
    name: "Student One",
    avatarUrl: undefined,
    role: "USER",
    status: "ACTIVE",
    createdAt: "2026-06-19T10:00:00.000Z",
  };

  assert.equal(profileMappers.areProfilesEqual(profile, { ...profile }), true);
  assert.equal(
    profileMappers.areProfilesEqual(profile, {
      ...profile,
      name: "Student Two",
    }),
    false
  );
  assert.equal(profileMappers.areProfilesEqual(null, profile), false);
});

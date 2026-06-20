import assert from "node:assert/strict";
import test from "node:test";

import {
  getPublicRootRedirectHref,
  getRedirectHrefForRole,
  getRouteForRole,
  isRoleAllowed,
  resetRootRoute,
} from "./sessionRouting.ts";

test("returns the correct home route for each session role", () => {
  assert.equal(getRouteForRole("student"), "/(student-tabs)");
  assert.equal(getRouteForRole("admin"), "/(admin-tabs)");
  assert.equal(getRouteForRole("moderator"), "/(moderator-tabs)");
  assert.equal(getRouteForRole(null), "/");
});

test("checks whether the current role can access a protected role shell", () => {
  assert.equal(isRoleAllowed("student", ["student"]), true);
  assert.equal(isRoleAllowed("admin", ["student"]), false);
  assert.equal(isRoleAllowed(null, ["student"]), false);
});

test("returns Expo Router hrefs for role redirects", () => {
  assert.equal(getRedirectHrefForRole("student"), "/(student-tabs)");
  assert.equal(getRedirectHrefForRole("admin"), "/(admin-tabs)");
  assert.equal(getRedirectHrefForRole("moderator"), "/(moderator-tabs)");
  assert.equal(getRedirectHrefForRole(null), "/login");
});

test("redirects the public root only when root is the active pathname", () => {
  assert.equal(
    getPublicRootRedirectHref({
      currentPathname: "/",
      accessToken: "access-token",
      role: "student",
    }),
    "/(student-tabs)"
  );

  assert.equal(
    getPublicRootRedirectHref({
      currentPathname: "/login",
      accessToken: "access-token",
      role: "student",
    }),
    null
  );

  assert.equal(
    getPublicRootRedirectHref({
      currentPathname: "/",
      accessToken: null,
      role: null,
    }),
    null
  );
});

test("defers reset to the target route without dismissing back to root first", async () => {
  const calls = [];
  const router = {
    replace: (href) => calls.push(["replace", href]),
    canDismiss: () => {
      calls.push(["canDismiss"]);
      return true;
    },
    dismissAll: () => calls.push(["dismissAll"]),
    navigate: (href) => calls.push(["navigate", href]),
  };

  resetRootRoute(router, "/(student-tabs)");

  assert.deepEqual(calls, []);
  await new Promise((resolve) => setTimeout(resolve, 200));

  assert.deepEqual(calls, [["replace", "/(student-tabs)"]]);
});

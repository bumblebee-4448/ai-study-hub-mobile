import assert from "node:assert/strict";
import test from "node:test";

let safeArea = {};

try {
  safeArea = await import("./safeArea.ts");
} catch {
  safeArea = {};
}

test("uses top-only screen edges so tab screens do not double count bottom inset", () => {
  assert.deepEqual(safeArea.SCREEN_SAFE_AREA_EDGES, ["top", "left", "right"]);
});

test("uses compact top spacing after native safe area", () => {
  assert.equal(safeArea.SCREEN_HEADER_TOP_PADDING, 8);
  assert.equal(safeArea.SCREEN_CONTENT_TOP_PADDING, 12);
});

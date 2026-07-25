import assert from "node:assert/strict";
import test from "node:test";

import { mapBackendDocumentToModeratorDocument } from "./moderatorDocumentMappers.ts";

test("preserves AI rejection flags on moderator document mapping", () => {
  const document = mapBackendDocumentToModeratorDocument({
    id: "doc-1",
    title: "Sensitive notes",
    status: "REJECTED",
    createdAt: "2026-07-25T00:00:00.000Z",
    rejectionFlags: ["SPAM", "ACADEMIC_INTEGRITY_RISK"],
  });

  assert.deepEqual(document.rejectionFlags, [
    "SPAM",
    "ACADEMIC_INTEGRITY_RISK",
  ]);
});

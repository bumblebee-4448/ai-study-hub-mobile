import assert from "node:assert/strict";
import test from "node:test";

let documentQuery = {};

try {
  documentQuery = await import("./userDocumentQuery.ts");
} catch {
  documentQuery = {};
}

test("builds library document params without subject filter by default", () => {
  assert.equal(
    typeof documentQuery.buildLibraryDocumentParams,
    "function",
    "buildLibraryDocumentParams should be exported"
  );

  assert.deepEqual(documentQuery.buildLibraryDocumentParams(), {
    page: 1,
    limit: 20,
  });
});

test("builds library document params with trimmed subject filter", () => {
  assert.equal(
    typeof documentQuery.buildLibraryDocumentParams,
    "function",
    "buildLibraryDocumentParams should be exported"
  );

  assert.deepEqual(
    documentQuery.buildLibraryDocumentParams({
      subjectId: "  subject-1  ",
      limit: 12,
    }),
    {
      page: 1,
      limit: 12,
      subjectId: "subject-1",
    }
  );
});

test("omits blank subject filter from library document params", () => {
  assert.equal(
    typeof documentQuery.buildLibraryDocumentParams,
    "function",
    "buildLibraryDocumentParams should be exported"
  );

  assert.deepEqual(
    documentQuery.buildLibraryDocumentParams({ subjectId: "   " }),
    {
      page: 1,
      limit: 20,
    }
  );
});

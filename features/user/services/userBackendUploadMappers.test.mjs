import assert from "node:assert/strict";
import test from "node:test";

let backendUploadMappers = {};

try {
  backendUploadMappers = await import("./userBackendUploadMappers.ts");
} catch {
  backendUploadMappers = {};
}

test("builds backend upload fields from trimmed form values", () => {
  assert.equal(
    typeof backendUploadMappers.buildBackendUploadFields,
    "function",
    "buildBackendUploadFields should be exported"
  );

  assert.deepEqual(
    backendUploadMappers.buildBackendUploadFields({
      title: "  Lesson 6  ",
      description: "  Encapsulation in OOP  ",
      subjectId: "  subject-1  ",
      isPublic: true,
    }),
    {
      title: "Lesson 6",
      description: "Encapsulation in OOP",
      subjectId: "subject-1",
      isPublic: "true",
    }
  );
});

test("omits empty optional backend upload fields", () => {
  assert.equal(
    typeof backendUploadMappers.buildBackendUploadFields,
    "function",
    "buildBackendUploadFields should be exported"
  );

  assert.deepEqual(
    backendUploadMappers.buildBackendUploadFields({
      title: "Private note",
      description: "   ",
      subjectId: "",
      isPublic: false,
    }),
    {
      title: "Private note",
      isPublic: "false",
    }
  );
});


import assert from "node:assert/strict";
import test from "node:test";

let uploadValidation = {};

try {
  uploadValidation = await import("./userUploadValidation.ts");
} catch {
  uploadValidation = {};
}

test("accepts allowed upload files by MIME type or extension", () => {
  assert.equal(
    typeof uploadValidation.validatePickedUploadFile,
    "function",
    "validatePickedUploadFile should be exported"
  );

  assert.equal(
    uploadValidation.validatePickedUploadFile({
      name: "slides.pptx",
      uri: "file:///cache/slides.pptx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      size: 1024,
    }),
    null
  );

  assert.equal(
    uploadValidation.validatePickedUploadFile({
      name: "notes.pdf",
      uri: "file:///cache/notes.pdf",
      size: 1024,
    }),
    null
  );
});

test("rejects unsupported upload file formats", () => {
  assert.equal(
    typeof uploadValidation.validatePickedUploadFile,
    "function",
    "validatePickedUploadFile should be exported"
  );

  assert.equal(
    uploadValidation.validatePickedUploadFile({
      name: "image.png",
      uri: "file:///cache/image.png",
      mimeType: "image/png",
      size: 1024,
    }),
    "Chỉ hỗ trợ PDF, DOC, DOCX, PPT, PPTX. Vui lòng chọn lại."
  );
});

test("rejects upload files larger than 50 MB", () => {
  assert.equal(
    typeof uploadValidation.validatePickedUploadFile,
    "function",
    "validatePickedUploadFile should be exported"
  );

  assert.equal(
    uploadValidation.validatePickedUploadFile({
      name: "big-file.pdf",
      uri: "file:///cache/big-file.pdf",
      mimeType: "application/pdf",
      size: 51 * 1024 * 1024,
    }),
    "Tệp 51.0 MB vượt quá giới hạn 50 MB."
  );
});


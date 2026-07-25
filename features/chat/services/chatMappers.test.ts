import assert from "node:assert/strict";
import test from "node:test";

import { mapChatMessage, mapChatReadyDocument } from "./chatMappers.ts";

test("maps a backend ready document to the source-picker model", () => {
  assert.deepEqual(
    mapChatReadyDocument({
      id: "doc-1",
      title: "AI Notes",
      format: "pdf",
      sizeInBytes: 2048,
      createdAt: "2026-07-25T00:00:00.000Z",
      subject: { id: "subject-1", name: "Artificial Intelligence" },
    }),
    {
      id: "doc-1",
      title: "AI Notes",
      format: "PDF",
      sizeInBytes: 2048,
      sizeLabel: "2 KB",
      createdAt: "2026-07-25T00:00:00.000Z",
      subjectName: "Artificial Intelligence",
      isChatReady: true,
    },
  );
});

test("maps assistant citations without discarding page metadata", () => {
  const message = mapChatMessage({
    id: "message-1",
    role: "assistant",
    content: "Answer",
    citations: [
      {
        chunkId: "chunk-1",
        chunkIndex: 2,
        pageStart: 3,
        pageEnd: 4,
        score: 0.91,
        preview: "Context",
      },
    ],
    createdAt: "2026-07-25T00:00:00.000Z",
  });

  assert.equal(message.citations[0].pageStart, 3);
  assert.equal(message.citations[0].pageEnd, 4);
});

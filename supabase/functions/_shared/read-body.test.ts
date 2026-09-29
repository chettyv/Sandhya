import assert from "node:assert/strict";
import test from "node:test";

import { readBodyWithLimit } from "./read-body.ts";

test("reads a body below the byte limit", async () => {
  const body = await readBodyWithLimit(
    new Request("https://example.test", { method: "POST", body: "hello" }),
    5,
  );
  assert.deepEqual([...body], [...new TextEncoder().encode("hello")]);
});

test("accepts a body exactly at the byte limit", async () => {
  const body = await readBodyWithLimit(
    new Request("https://example.test", { method: "POST", body: "hello" }),
    5,
  );
  assert.equal(body.byteLength, 5);
});

test("rejects Content-Length over the limit before reading or parsing", async () => {
  const request = {
    headers: new Headers({ "content-length": "6" }),
    body: {
      getReader() {
        throw new Error("body should not be read");
      },
    },
  } as unknown as Request;

  await assert.rejects(() => readBodyWithLimit(request, 5), { status: 413 });
});

test("rejects a chunked body after the first over-limit read", async () => {
  let pulls = 0;
  let cancelled = false;
  const chunks = ["hel", "lo", "!", "never-read"];
  const request = new Request("https://example.test", {
    method: "POST",
    body: new ReadableStream({
      pull(controller) {
        const chunk = chunks[pulls];
        pulls += 1;
        if (chunk) controller.enqueue(new TextEncoder().encode(chunk));
        else controller.close();
      },
      cancel() {
        cancelled = true;
      },
    }),
    duplex: "half",
  } as RequestInit);

  await assert.rejects(() => readBodyWithLimit(request, 5), { status: 413 });
  assert.equal(pulls, 3);
  assert.equal(cancelled, true);
});

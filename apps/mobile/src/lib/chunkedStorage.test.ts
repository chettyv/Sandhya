import { beforeEach, describe, expect, it, vi } from "vitest";

const store = new Map<string, string>();
let writes = 0;
let gate: Promise<void> = Promise.resolve();

vi.mock("./secureStorage", () => ({
  getItemAsync: async (key: string) => store.get(key) ?? null,
  setItemAsync: async (key: string, value: string) => {
    await gate;
    writes += 1;
    store.set(key, value);
  },
  deleteItemAsync: async (key: string) => {
    store.delete(key);
  },
}));

const { chunkedStorage } = await import("./chunkedStorage");

const KEY = "test-state";
const chunkKeys = () =>
  [...store.keys()].filter((k) => k.startsWith(`${KEY}-`) && k !== `${KEY}-index`);
const indexed = () =>
  JSON.parse(store.get(`${KEY}-index`) ?? "null") as { prefix: string; count: number } | null;

beforeEach(() => {
  store.clear();
  writes = 0;
  gate = Promise.resolve();
});

describe("chunkedStorage", () => {
  it("round-trips values larger than one chunk", async () => {
    const value = "x".repeat(1300);
    await chunkedStorage.setItem(KEY, value);
    expect(indexed()?.count).toBe(3);
    expect(await chunkedStorage.getItem(KEY)).toBe(value);
  });

  it("serialises concurrent writes so the last call wins and no chunks are orphaned", async () => {
    await Promise.all([
      chunkedStorage.setItem(KEY, "first".repeat(200)),
      chunkedStorage.setItem(KEY, "second".repeat(200)),
      chunkedStorage.setItem(KEY, "third".repeat(200)),
    ]);
    expect(await chunkedStorage.getItem(KEY)).toBe("third".repeat(200));
    const index = indexed();
    expect(index).not.toBeNull();
    // Every surviving chunk belongs to the live index; superseded sets are gone.
    expect(chunkKeys().every((k) => k.startsWith(`${index!.prefix}-`))).toBe(true);
    expect(chunkKeys()).toHaveLength(index!.count);
  });

  it("coalesces a burst of writes into at most one in flight plus one waiting", async () => {
    let release!: () => void;
    gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const burst = ["a", "b", "c", "d", "e"].map((v) => chunkedStorage.setItem(KEY, v));
    // None of the five has started when the last call lands, so they collapse
    // into a single write of the newest value: one chunk + one index.
    release();
    await Promise.all(burst);
    expect(writes).toBe(2);
    expect(await chunkedStorage.getItem(KEY)).toBe("e");
  });

  it("reads a legacy single-value key when no index exists", async () => {
    store.set(KEY, "legacy");
    expect(await chunkedStorage.getItem(KEY)).toBe("legacy");
    await chunkedStorage.setItem(KEY, "migrated");
    expect(store.has(KEY)).toBe(false);
    expect(await chunkedStorage.getItem(KEY)).toBe("migrated");
  });

  it("removes the index, every chunk and the legacy key", async () => {
    await chunkedStorage.setItem(KEY, "y".repeat(600));
    await chunkedStorage.removeItem(KEY);
    expect(store.size).toBe(0);
    expect(await chunkedStorage.getItem(KEY)).toBeNull();
  });
});

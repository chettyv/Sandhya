import { beforeEach, describe, expect, it, vi } from "vitest";

const store = new Map<string, string>();

vi.mock("./secureStorage", () => ({
  getItemAsync: async (key: string) => store.get(key) ?? null,
  setItemAsync: async (key: string, value: string) => {
    store.set(key, value);
  },
  deleteItemAsync: async (key: string) => {
    store.delete(key);
  },
}));

const {
  GUEST_JOURNAL_SCOPE,
  clearLocalJournal,
  readLocalJournal,
  removeLocalJournalEntry,
  updateLocalJournal,
  writeLocalJournal,
} = await import("./localJournalStorage");

const entry = (id: string) => ({ id, text: id, mood: "Thoughtful", date: "2026-09-29" });

beforeEach(() => {
  store.clear();
});

describe("local journal storage", () => {
  it("serializes concurrent per-scope updates without losing either entry", async () => {
    await Promise.all([
      updateLocalJournal(GUEST_JOURNAL_SCOPE, async (entries) => {
        await Promise.resolve();
        return [...entries, entry("first")];
      }),
      updateLocalJournal(GUEST_JOURNAL_SCOPE, (entries) => [...entries, entry("second")]),
    ]);

    expect((await readLocalJournal(GUEST_JOURNAL_SCOPE)).map((item) => item.id)).toEqual([
      "first",
      "second",
    ]);
  });

  it("keeps guest and authenticated journal scopes isolated", async () => {
    const userScope = "11111111-1111-1111-1111-111111111111";
    await writeLocalJournal([entry("guest")], GUEST_JOURNAL_SCOPE);
    await writeLocalJournal([entry("account")], userScope);

    await clearLocalJournal(userScope);

    expect((await readLocalJournal(GUEST_JOURNAL_SCOPE)).map((item) => item.id)).toEqual(["guest"]);
    expect(await readLocalJournal(userScope)).toEqual([]);
  });

  it("removes concurrent deletions without losing the remaining entry", async () => {
    await writeLocalJournal([entry("first"), entry("second"), entry("keep")]);

    await Promise.all([removeLocalJournalEntry("first"), removeLocalJournalEntry("second")]);

    expect((await readLocalJournal()).map((item) => item.id)).toEqual(["keep"]);
  });

  it("ignores malformed indexes and oversized stored entries safely", async () => {
    store.set("sandhya-local-journal-index", JSON.stringify({ prefix: "bad", count: 99_999 }));
    expect(await readLocalJournal()).toEqual([]);

    store.set(
      "sandhya-local-journal-index",
      JSON.stringify({ prefix: "sandhya-local-journal-bad", count: 1 }),
    );
    store.set(
      "sandhya-local-journal-bad-0",
      JSON.stringify([{ ...entry("too-large"), text: "x".repeat(5_000) }]),
    );

    expect(await readLocalJournal()).toEqual([]);
  });

  it("clear removes the index and all indexed chunks", async () => {
    await writeLocalJournal([entry("one"), entry("two")]);
    await clearLocalJournal();

    expect([...store.keys()]).toEqual([]);
  });
});

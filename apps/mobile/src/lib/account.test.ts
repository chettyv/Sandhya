import { beforeEach, describe, expect, it, vi } from "vitest";

const storage = new Map<string, string>();
const insertResult = vi.fn();
const supabaseMock = {
  auth: {
    getSession: vi.fn(),
  },
  from: vi.fn(),
};

vi.mock("./secureStorage", () => ({
  getItemAsync: async (key: string) => storage.get(key) ?? null,
  setItemAsync: async (key: string, value: string) => {
    storage.set(key, value);
  },
  deleteItemAsync: async (key: string) => {
    storage.delete(key);
  },
}));
vi.mock("./notifications", () => ({ configureDailyReminder: vi.fn() }));
vi.mock("./supabase", () => ({ supabase: supabaseMock }));

const { loadSavedItemsAfterSync, saveJournalEntry } = await import("./account");
const { useAppStore } = await import("../store/useAppStore");
const { readLocalJournal } = await import("./localJournalStorage");

beforeEach(() => {
  storage.clear();
  vi.clearAllMocks();
  supabaseMock.auth.getSession.mockResolvedValue({
    data: { session: { user: { id: "11111111-1111-1111-1111-111111111111" } } },
    error: null,
  });
  insertResult.mockResolvedValue({
    data: null,
    error: new Error("journal insert failed"),
  });
  supabaseMock.from.mockReturnValue({
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({ single: insertResult }),
    }),
  });
  useAppStore.setState({ savedIds: [], savedItemTypes: {} });
});

describe("account state lifecycle", () => {
  it("replaces the remote saved snapshot and keeps types aligned with IDs", () => {
    const replaceSavedItems = useAppStore.getState().replaceSavedItems;
    replaceSavedItems([
      { itemId: "old", itemType: "concept" },
      { itemId: "keep", itemType: "practice" },
    ]);
    replaceSavedItems([{ itemId: "new", itemType: "festival" }]);

    expect(useAppStore.getState().savedIds).toEqual(["new"]);
    expect(useAppStore.getState().savedItemTypes).toEqual({ new: "festival" });
  });

  it("keeps a local authenticated entry and reports unsynced when insert fails", async () => {
    const result = await saveJournalEntry("Keep this locally", "Thoughtful");

    expect(result.synced).toBe(false);
    expect(result.id).toMatch(/^local-/);
    expect(
      (await readLocalJournal("11111111-1111-1111-1111-111111111111")).map((item) => item.text),
    ).toEqual(["Keep this locally"]);
  });

  it("does not load a remote saved snapshot when uploading local saves fails", async () => {
    const select = vi.fn();
    const upsert = vi.fn().mockResolvedValue({ error: new Error("saved-items upload failed") });
    supabaseMock.from.mockReturnValue({ upsert, select });

    const result = await loadSavedItemsAfterSync([
      { itemId: "11111111-1111-1111-1111-111111111111", itemType: "concept" },
    ]);

    expect(result).toBeNull();
    expect(upsert).toHaveBeenCalledOnce();
    expect(select).not.toHaveBeenCalled();
  });
});

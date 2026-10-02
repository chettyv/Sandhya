import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { Alert, type AlertButton } from "react-native";

import JournalScreen from "../app/journal";

import { writeLocalJournal } from "@/lib/localJournalStorage";

type Session = { user: { id: string } } | null;
type JournalRow = { id: string; entry: string; mood: string; date: string };
type JournalResponse = { data: JournalRow[] | null; error: Error | null };
const USER_A = "11111111-1111-1111-1111-111111111111";
const USER_B = "22222222-2222-2222-2222-222222222222";
let mockSession: Session;
const mockAuthListeners = new Set<(event: string, session: Session) => void>();
const mockGetSession = jest.fn<() => Promise<{ data: { session: Session } }>>();
const mockReadRemote = jest.fn<(userId: string | undefined) => Promise<JournalResponse>>();
const mockSync = jest.fn<(userId?: string) => Promise<void>>();
const mockSave = jest.fn<() => Promise<{ id: string; date: string; synced: boolean }>>();
const mockDelete = jest.fn<(id: string) => Promise<void>>();

jest.mock("@/lib/account", () => ({
  syncLocalJournalEntries: (userId?: string) => mockSync(userId),
  saveJournalEntry: () => mockSave(),
  deleteJournalEntry: (id: string) => mockDelete(id),
}));

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: () => mockGetSession(),
      onAuthStateChange: (listener: (event: string, session: Session) => void) => {
        mockAuthListeners.add(listener);
        return {
          data: { subscription: { unsubscribe: () => mockAuthListeners.delete(listener) } },
        };
      },
    },
    from: () => {
      let userId = mockSession?.user.id;
      const query = {
        select: () => query,
        eq: (_column: string, value: string) => {
          userId = value;
          return query;
        },
        order: () => query,
        // Deliberately let an aborted transport still resolve: the screen must
        // also reject stale results when cancellation arrives too late.
        abortSignal: () => query,
        then: (resolve: (value: JournalResponse) => unknown, reject: (error: unknown) => unknown) =>
          mockReadRemote(userId).then(resolve, reject),
      };
      return query;
    },
  },
}));

function row(id: string, entry: string): JournalRow {
  return { id, entry, mood: "Thoughtful", date: "2026-09-30" };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

async function changeAccount(userId: string | null, event = userId ? "SIGNED_IN" : "SIGNED_OUT") {
  await act(async () => {
    mockSession = userId ? { user: { id: userId } } : null;
    for (const listener of mockAuthListeners) listener(event, mockSession);
  });
}

let alerts: jest.Spied<typeof Alert.alert>;

beforeEach(() => {
  globalThis.__memorySecureStore.clear();
  mockSession = { user: { id: USER_A } };
  mockGetSession.mockReset().mockImplementation(async () => ({ data: { session: mockSession } }));
  mockReadRemote.mockReset().mockImplementation(async (userId) => ({
    data:
      userId === USER_A
        ? [row("entry-a", "Account A private entry")]
        : [row("entry-b", "Account B private entry")],
    error: null,
  }));
  mockSync.mockReset().mockResolvedValue(undefined);
  mockSave.mockReset().mockResolvedValue({ id: "saved", date: "2026-09-30", synced: true });
  mockDelete.mockReset().mockResolvedValue(undefined);
  alerts = jest.spyOn(Alert, "alert").mockImplementation(() => undefined);
});

afterEach(async () => {
  await cleanup();
  alerts.mockRestore();
  mockAuthListeners.clear();
});

describe("journal account privacy", () => {
  it("clears mounted entries and drafts across A → sign-out → B", async () => {
    await render(<JournalScreen />);
    await waitFor(() => expect(screen.getByText("Account A private entry")).toBeTruthy());
    await fireEvent.press(screen.getByText("Write a new entry"));
    await fireEvent.changeText(screen.getByLabelText("Journal entry"), "Account A private draft");

    await changeAccount(null);
    expect(screen.queryByLabelText("Journal entry")).toBeNull();
    expect(screen.queryByText("Account A private entry")).toBeNull();
    await fireEvent.press(screen.getByText("Write a new entry"));
    expect(screen.getByLabelText("Journal entry").props.value).toBe("");
    await fireEvent.press(screen.getByText("Cancel"));

    await changeAccount(USER_B);
    await waitFor(() => expect(screen.getByText("Account B private entry")).toBeTruthy());
    expect(screen.queryByText("Account A private entry")).toBeNull();
  });

  it("ignores a delayed A read after sign-out and B sign-in", async () => {
    const pending = deferred<JournalResponse>();
    mockReadRemote.mockImplementation(async (userId) =>
      userId === USER_A
        ? pending.promise
        : { data: [row("entry-b", "Account B private entry")], error: null },
    );
    await render(<JournalScreen />);
    await waitFor(() => expect(mockReadRemote).toHaveBeenCalledWith(USER_A));
    await changeAccount(null);
    await changeAccount(USER_B);
    await act(async () =>
      pending.resolve({ data: [row("entry-a", "Delayed A private entry")], error: null }),
    );

    await waitFor(() => expect(screen.queryByText("Delayed A private entry")).toBeNull());
    expect(screen.getByText("Account B private entry")).toBeTruthy();
  });

  it("does not let a delayed initial session override a newer auth event", async () => {
    const snapshot = deferred<{ data: { session: Session } }>();
    mockGetSession.mockImplementation(() => snapshot.promise);
    await render(<JournalScreen />);
    await changeAccount(USER_B);
    await act(async () => snapshot.resolve({ data: { session: { user: { id: USER_A } } } }));

    await waitFor(() => expect(screen.getByText("Account B private entry")).toBeTruthy());
    expect(screen.queryByText("Account A private entry")).toBeNull();
  });

  it("ignores an A save completion and its alert after the account changes", async () => {
    const pending = deferred<{ id: string; date: string; synced: boolean }>();
    mockSave.mockImplementation(() => pending.promise);
    await render(<JournalScreen />);
    await waitFor(() => expect(screen.getByText("Account A private entry")).toBeTruthy());
    await fireEvent.press(screen.getByText("Write a new entry"));
    await fireEvent.changeText(screen.getByLabelText("Journal entry"), "A saved after switch");
    await fireEvent.press(screen.getByText("Save privately"));
    await changeAccount(USER_B);
    await act(async () => pending.resolve({ id: "late-save", date: "2026-09-30", synced: false }));

    expect(screen.queryByText("A saved after switch")).toBeNull();
    await waitFor(() => expect(screen.getByText("Account B private entry")).toBeTruthy());
    expect(alerts).not.toHaveBeenCalled();
  });

  it("does not execute an old account's delete confirmation in the new account", async () => {
    await render(<JournalScreen />);
    await waitFor(() => expect(screen.getByText("Account A private entry")).toBeTruthy());
    await fireEvent.press(screen.getByLabelText("Delete journal entry"));
    const confirm = (alerts.mock.calls[0][2] as AlertButton[]).find(
      (button) => button.text === "Delete",
    );
    expect(confirm).toBeDefined();
    await changeAccount(USER_B);
    await act(async () => confirm?.onPress?.());

    expect(mockDelete).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByText("Account B private entry")).toBeTruthy());
  });

  it("ignores a delayed delete error after the account changes", async () => {
    const pending = deferred<void>();
    mockDelete.mockImplementation(() => pending.promise);
    await render(<JournalScreen />);
    await waitFor(() => expect(screen.getByText("Account A private entry")).toBeTruthy());
    await fireEvent.press(screen.getByLabelText("Delete journal entry"));
    const confirm = (alerts.mock.calls[0][2] as AlertButton[]).find(
      (button) => button.text === "Delete",
    );
    expect(confirm).toBeDefined();
    await act(async () => confirm?.onPress?.());
    alerts.mockClear();
    await changeAccount(USER_B);
    await act(async () => pending.reject(new Error("Old account delete failed")));

    expect(alerts).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByText("Account B private entry")).toBeTruthy());
  });

  it("keeps a draft on same-user refresh and preserves guest entries on sign-in", async () => {
    mockSession = null;
    await writeLocalJournal([
      { id: "local-guest", text: "Guest reflection", mood: "Peaceful", date: "2026-09-30" },
    ]);
    await render(<JournalScreen />);
    await waitFor(() => expect(screen.getByText("Guest reflection")).toBeTruthy());
    await changeAccount(USER_A);
    await waitFor(() => expect(screen.getByText("Account A private entry")).toBeTruthy());
    expect(screen.getByText("Guest reflection")).toBeTruthy();
    expect(mockSync).toHaveBeenCalledWith(USER_A);
    await fireEvent.press(screen.getByText("Write a new entry"));
    await fireEvent.changeText(screen.getByLabelText("Journal entry"), "Keep this draft");
    await changeAccount(USER_A, "TOKEN_REFRESHED");
    expect(screen.getByLabelText("Journal entry").props.value).toBe("Keep this draft");
  });

  it("still displays saves and removes entries for the current account", async () => {
    await render(<JournalScreen />);
    await waitFor(() => expect(screen.getByText("Account A private entry")).toBeTruthy());
    await fireEvent.press(screen.getByText("Write a new entry"));
    await fireEvent.changeText(screen.getByLabelText("Journal entry"), "Current account save");
    await fireEvent.press(screen.getByText("Save privately"));
    await waitFor(() => expect(screen.getByText("Current account save")).toBeTruthy());
    await fireEvent.press(screen.getAllByLabelText("Delete journal entry")[0]);
    const confirm = (alerts.mock.calls[0][2] as AlertButton[]).find(
      (button) => button.text === "Delete",
    );
    expect(confirm).toBeDefined();
    await act(async () => confirm?.onPress?.());
    expect(screen.queryByText("Current account save")).toBeNull();
  });
});

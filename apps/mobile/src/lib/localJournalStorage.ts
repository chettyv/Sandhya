import * as SecureStore from "./secureStorage";

export type LocalJournalEntry = {
  id: string;
  text: string;
  mood: string;
  date: string;
};

const LEGACY_KEY = "sandhya-local-journal";
const INDEX_KEY = "sandhya-local-journal-index";
const CHUNK_SIZE = 512;
const MAX_ENTRIES = 50;
const MAX_CHUNKS = 512;
const MAX_SERIALIZED_LENGTH = CHUNK_SIZE * MAX_CHUNKS;
export const GUEST_JOURNAL_SCOPE = "guest";

type JournalIndex = { prefix: string; count: number };
type JournalUpdater = (
  entries: LocalJournalEntry[],
) => LocalJournalEntry[] | Promise<LocalJournalEntry[]>;

const scopeLocks = new Map<string, Promise<void>>();

export async function readLocalJournal(scope = GUEST_JOURNAL_SCOPE): Promise<LocalJournalEntry[]> {
  return withScopeLock(scope, () => readLocalJournalUnsafe(scope));
}

async function readLocalJournalUnsafe(scope: string): Promise<LocalJournalEntry[]> {
  const index = await readIndex(scope);
  if (index) {
    const chunks = await Promise.all(
      Array.from({ length: index.count }, (_, chunkIndex) =>
        SecureStore.getItemAsync(`${index.prefix}-${chunkIndex}`),
      ),
    );
    const parsed = parseEntries(chunks.join(""));
    if (parsed) return parsed;
  }

  // Migrate the old single-value format lazily on the next guest write.
  const legacy = scope === GUEST_JOURNAL_SCOPE ? await SecureStore.getItemAsync(LEGACY_KEY) : null;
  return parseEntries(legacy) ?? [];
}

export async function updateLocalJournal(
  scope: string,
  updater: JournalUpdater,
): Promise<LocalJournalEntry[]> {
  return withScopeLock(scope, async () => {
    const current = await readLocalJournalUnsafe(scope);
    const next = (await updater(current)).slice(0, MAX_ENTRIES);
    if (next.length) await writeLocalJournalUnsafe(next, scope);
    else await clearLocalJournalUnsafe(scope);
    return next;
  });
}

export async function writeLocalJournal(
  entries: LocalJournalEntry[],
  scope = GUEST_JOURNAL_SCOPE,
): Promise<void> {
  await withScopeLock(scope, () => writeLocalJournalUnsafe(entries, scope));
}

async function writeLocalJournalUnsafe(entries: LocalJournalEntry[], scope: string): Promise<void> {
  const bounded = entries.slice(0, MAX_ENTRIES);
  const serialized = JSON.stringify(bounded);
  const prefix = `${journalPrefix(scope)}-${uniqueSuffix()}`;
  const chunks = split(serialized, CHUNK_SIZE);
  const previousIndex = await readIndex(scope);

  await Promise.all(
    chunks.map((chunk, chunkIndex) => SecureStore.setItemAsync(`${prefix}-${chunkIndex}`, chunk)),
  );
  await SecureStore.setItemAsync(indexKey(scope), JSON.stringify({ prefix, count: chunks.length }));
  await removeChunks(previousIndex);
  if (scope === GUEST_JOURNAL_SCOPE) await SecureStore.deleteItemAsync(LEGACY_KEY);
}

export async function clearLocalJournal(scope = GUEST_JOURNAL_SCOPE): Promise<void> {
  await withScopeLock(scope, () => clearLocalJournalUnsafe(scope));
}

async function clearLocalJournalUnsafe(scope: string): Promise<void> {
  const index = await readIndex(scope);
  await removeChunks(index);
  await SecureStore.deleteItemAsync(indexKey(scope));
  if (scope === GUEST_JOURNAL_SCOPE) await SecureStore.deleteItemAsync(LEGACY_KEY);
}

export async function removeLocalJournalEntry(
  entryId: string,
  scopes: string[] = [GUEST_JOURNAL_SCOPE],
): Promise<void> {
  for (const scope of [...new Set(scopes)]) {
    await withScopeLock(scope, async () => {
      const entries = await readLocalJournalUnsafe(scope);
      const remaining = entries.filter((item) => item.id !== entryId);
      if (remaining.length === entries.length) return;
      if (remaining.length) await writeLocalJournalUnsafe(remaining, scope);
      else await clearLocalJournalUnsafe(scope);
    });
  }
}

function withScopeLock<T>(scope: string, operation: () => Promise<T>): Promise<T> {
  const key = indexKey(scope);
  const previous = scopeLocks.get(key) ?? Promise.resolve();
  const current = previous.then(operation, operation);
  const settled = current.then(
    () => undefined,
    () => undefined,
  );
  scopeLocks.set(key, settled);
  return current.finally(() => {
    if (scopeLocks.get(key) === settled) scopeLocks.delete(key);
  });
}

async function readIndex(scope: string): Promise<JournalIndex | null> {
  const value = await SecureStore.getItemAsync(indexKey(scope));
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<JournalIndex>;
    const count = parsed.count;
    if (
      typeof parsed.prefix === "string" &&
      /^[a-z0-9-]+$/i.test(parsed.prefix) &&
      typeof count === "number" &&
      Number.isInteger(count) &&
      count >= 0 &&
      count <= MAX_CHUNKS
    ) {
      return { prefix: parsed.prefix, count };
    }
  } catch {
    // Treat malformed local storage as empty and leave unrelated keys untouched.
  }
  return null;
}

function indexKey(scope: string): string {
  return scope === GUEST_JOURNAL_SCOPE ? INDEX_KEY : `${INDEX_KEY}-${safeScope(scope)}`;
}

function journalPrefix(scope: string): string {
  return scope === GUEST_JOURNAL_SCOPE
    ? "sandhya-local-journal"
    : `sandhya-local-journal-${safeScope(scope)}`;
}

function safeScope(scope: string): string {
  return /^[0-9a-f-]{8,80}$/i.test(scope) ? scope : "guest";
}

async function removeChunks(index: JournalIndex | null): Promise<void> {
  if (!index) return;
  await Promise.all(
    Array.from({ length: index.count }, (_, chunkIndex) =>
      SecureStore.deleteItemAsync(`${index.prefix}-${chunkIndex}`),
    ),
  );
}

function parseEntries(value: string | null): LocalJournalEntry[] | null {
  if (!value || value.length > MAX_SERIALIZED_LENGTH) return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(isLocalJournalEntry).slice(0, MAX_ENTRIES);
  } catch {
    return null;
  }
}

function isLocalJournalEntry(value: unknown): value is LocalJournalEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<LocalJournalEntry>;
  return (
    typeof entry.id === "string" &&
    entry.id.length <= 200 &&
    typeof entry.text === "string" &&
    entry.text.length <= 4_000 &&
    typeof entry.mood === "string" &&
    entry.mood.length <= 80 &&
    typeof entry.date === "string" &&
    entry.date.length <= 40
  );
}

function split(value: string, size: number): string[] {
  if (!value) return [""];
  return Array.from({ length: Math.ceil(value.length / size) }, (_, index) =>
    value.slice(index * size, (index + 1) * size),
  );
}

function uniqueSuffix(): string {
  const uuid = globalThis.crypto?.randomUUID?.();
  return uuid
    ? uuid.replace(/-/g, "")
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

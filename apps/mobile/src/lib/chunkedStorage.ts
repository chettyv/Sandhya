import * as SecureStore from "./secureStorage";

type StorageIndex = { prefix: string; count: number };
const CHUNK_SIZE = 512;

// Zustand's persist middleware writes on every setState, so several writes for
// the same key are routinely in flight at once. Each write reads the previous
// index, writes fresh chunks, then swaps the index; if two interleave, the one
// that finishes last wins regardless of which carried the newer state, and the
// loser's chunks are orphaned. Serialise all mutations per key so writes land
// in call order and every superseded chunk set is cleaned up.
const queues = new Map<string, Promise<unknown>>();
type PendingWrite = { value: string; done: Promise<void> };
const pendingWrites = new Map<string, PendingWrite>();

function enqueue<T>(key: string, task: () => Promise<T>): Promise<T> {
  const previous = queues.get(key) ?? Promise.resolve();
  const next = previous.then(task, task);
  queues.set(
    key,
    next.catch(() => undefined),
  );
  return next;
}

/** A Zustand-compatible storage adapter that avoids native SecureStore blob limits. */
export const chunkedStorage = {
  async getItem(key: string): Promise<string | null> {
    return enqueue(key, async () => {
      const index = await readIndex(key);
      if (index) {
        const chunks = await Promise.all(
          Array.from({ length: index.count }, (_, chunkIndex) =>
            SecureStore.getItemAsync(`${index.prefix}-${chunkIndex}`),
          ),
        );
        if (chunks.some((chunk) => chunk === null)) return null;
        return chunks.join("");
      }
      return SecureStore.getItemAsync(key);
    });
  },

  async setItem(key: string, value: string): Promise<void> {
    // Zustand persists the whole state on every setState, so a burst of
    // updates (hydration, profile load, onboarding answers) would otherwise
    // queue one full chunked write each. Only the newest value matters: if a
    // write for this key is already waiting its turn, replace its payload and
    // share its promise instead of appending another write.
    const waiting = pendingWrites.get(key);
    if (waiting) {
      waiting.value = value;
      return waiting.done;
    }
    const slot: PendingWrite = { value, done: Promise.resolve() };
    pendingWrites.set(key, slot);
    slot.done = enqueue(key, async () => {
      pendingWrites.delete(key);
      const latest = slot.value;
      const previousIndex = await readIndex(key);
      const prefix = `${key}-${uniqueSuffix()}`;
      const chunks = split(latest, CHUNK_SIZE);
      await Promise.all(
        chunks.map((chunk, chunkIndex) =>
          SecureStore.setItemAsync(`${prefix}-${chunkIndex}`, chunk),
        ),
      );
      await SecureStore.setItemAsync(
        `${key}-index`,
        JSON.stringify({ prefix, count: chunks.length }),
      );
      await removeChunks(previousIndex);
      await SecureStore.deleteItemAsync(key);
    });
    return slot.done;
  },

  async removeItem(key: string): Promise<void> {
    return enqueue(key, async () => {
      const index = await readIndex(key);
      await removeChunks(index);
      await SecureStore.deleteItemAsync(`${key}-index`);
      await SecureStore.deleteItemAsync(key);
    });
  },
};

async function readIndex(key: string): Promise<StorageIndex | null> {
  const value = await SecureStore.getItemAsync(`${key}-index`);
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<StorageIndex>;
    const count = parsed.count;
    if (
      typeof parsed.prefix === "string" &&
      /^[a-z0-9-]+$/i.test(parsed.prefix) &&
      typeof count === "number" &&
      Number.isInteger(count) &&
      count >= 0 &&
      count <= 10_000
    ) {
      return { prefix: parsed.prefix, count };
    }
  } catch {
    // Fall back to the legacy single-value key when the index is malformed.
  }
  return null;
}

async function removeChunks(index: StorageIndex | null): Promise<void> {
  if (!index) return;
  await Promise.all(
    Array.from({ length: index.count }, (_, chunkIndex) =>
      SecureStore.deleteItemAsync(`${index.prefix}-${chunkIndex}`),
    ),
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

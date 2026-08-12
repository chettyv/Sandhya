import * as SecureStore from "./secureStorage";

type StorageIndex = { prefix: string; count: number };
const CHUNK_SIZE = 512;

/** A Zustand-compatible storage adapter that avoids native SecureStore blob limits. */
export const chunkedStorage = {
  async getItem(key: string): Promise<string | null> {
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
  },

  async setItem(key: string, value: string): Promise<void> {
    const previousIndex = await readIndex(key);
    const prefix = `${key}-${uniqueSuffix()}`;
    const chunks = split(value, CHUNK_SIZE);
    await Promise.all(
      chunks.map((chunk, chunkIndex) => SecureStore.setItemAsync(`${prefix}-${chunkIndex}`, chunk)),
    );
    await SecureStore.setItemAsync(
      `${key}-index`,
      JSON.stringify({ prefix, count: chunks.length }),
    );
    await removeChunks(previousIndex);
    await SecureStore.deleteItemAsync(key);
  },

  async removeItem(key: string): Promise<void> {
    const index = await readIndex(key);
    await removeChunks(index);
    await SecureStore.deleteItemAsync(`${key}-index`);
    await SecureStore.deleteItemAsync(key);
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

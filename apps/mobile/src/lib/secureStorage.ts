/**
 * Web fallback for the small key/value surface used by the app.
 * Native builds resolve secureStorage.native.ts and use encrypted SecureStore.
 * Web storage is only a preview-compatible fallback; production web auth must
 * still be protected by HTTPS, Supabase PKCE, and the server's RLS policies.
 */
type WebStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

function getStorage(): WebStorage | undefined {
  return (globalThis as typeof globalThis & { localStorage?: WebStorage }).localStorage;
}

export async function getItemAsync(key: string): Promise<string | null> {
  try {
    return getStorage()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export async function setItemAsync(key: string, value: string): Promise<void> {
  try {
    getStorage()?.setItem(key, value);
  } catch {
    // Storage may be unavailable in privacy mode or a restricted iframe.
  }
}

export async function deleteItemAsync(key: string): Promise<void> {
  try {
    getStorage()?.removeItem(key);
  } catch {
    // Storage may be unavailable in privacy mode or a restricted iframe.
  }
}

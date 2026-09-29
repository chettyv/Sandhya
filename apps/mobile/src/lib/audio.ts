export type AudioAsset = {
  key: string;
  uri: string;
  durationMs: number;
  language: string;
  speed: "clear" | "slow";
};

export type AudioPlaybackState =
  | "loading"
  | "playing"
  | "paused"
  | "ended"
  | "error"
  | "unavailable";

export type AudioPlaybackSnapshot = {
  state: AudioPlaybackState;
  asset: AudioAsset | null;
  error?: string;
};

/**
 * The checked-in manifest is intentionally empty until a named human reader,
 * rights review, and both clear/slow recordings exist. The optional manifest
 * parameter keeps the resolver pure and testable without making production
 * screens accept arbitrary URLs.
 */
export const AUDIO_MANIFEST: readonly AudioAsset[] = [];

export function resolveShlokaAudio(
  slug: string,
  speed: AudioAsset["speed"],
  manifest: readonly unknown[] = AUDIO_MANIFEST,
): AudioAsset | null {
  const normalizedSlug = slug.trim().toLowerCase();
  if (!normalizedSlug) return null;
  const requested = findAudioAsset(manifest, `shloka/${normalizedSlug}/${speed}`, speed);
  if (requested) return requested;
  // A slow repeat is allowed to fall back to a reviewed clear reading while
  // the second pass is being recorded, but the caller still sees the asset's
  // actual speed and must not label it as slow.
  return speed === "slow"
    ? findAudioAsset(manifest, `shloka/${normalizedSlug}/clear`, "clear")
    : null;
}

export function resolveChallengeAudio(
  clearKey: string | null,
  slowKey: string | null,
  speed: AudioAsset["speed"],
  manifest: readonly unknown[] = AUDIO_MANIFEST,
): AudioAsset | null {
  const requestedKey = speed === "slow" ? slowKey : clearKey;
  const requested = findAudioAsset(manifest, requestedKey, speed);
  if (requested) return requested;
  return speed === "slow" ? findAudioAsset(manifest, clearKey, "clear") : null;
}

export function unavailableAudioState(): AudioPlaybackSnapshot {
  return { state: "unavailable", asset: null };
}

function findAudioAsset(
  manifest: readonly unknown[],
  key: string | null | undefined,
  speed: AudioAsset["speed"],
): AudioAsset | null {
  if (!key) return null;
  const candidate = manifest.find(
    (entry) => isAudioAsset(entry) && entry.key === key && entry.speed === speed,
  );
  return isAudioAsset(candidate) ? candidate : null;
}

function isAudioAsset(value: unknown): value is AudioAsset {
  if (value === null || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.key === "string" &&
    row.key.trim().length > 0 &&
    typeof row.uri === "string" &&
    row.uri.trim().length > 0 &&
    typeof row.durationMs === "number" &&
    Number.isFinite(row.durationMs) &&
    row.durationMs > 0 &&
    typeof row.language === "string" &&
    row.language.trim().length > 0 &&
    (row.speed === "clear" || row.speed === "slow")
  );
}

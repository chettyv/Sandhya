// Renders the actual variation data stored in Supabase jsonb columns
// (festivals.regional_variations, concepts.tradition_variations) instead of a
// constant boilerplate sentence. The schema models variation; the UI must
// show it. (02-plan.md Phase 0.5, Fix 2.)
//
// Observed shapes: {"note": "..."} today; keyed records like
// {"bengal": "...", "gujarat": "..."} are supported so richer rows render the
// day they are written. Anything unusable falls back to the caller's generic
// sentence rather than rendering "[object Object]".

export function describeVariations(value: unknown, fallback: string): string {
  const described = describe(value);
  return described ?? fallback;
}

function describe(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (Array.isArray(value)) {
    const parts = value
      .map((entry) => describe(entry))
      .filter((entry): entry is string => entry !== null);
    return parts.length > 0 ? parts.join("\n") : null;
  }
  if (value && typeof value === "object") {
    const parts = Object.entries(value as Record<string, unknown>)
      .map(([key, entry]) => {
        const described = describe(entry);
        if (!described) {
          return null;
        }
        return isPlainNoteKey(key) ? described : `${labelize(key)}: ${described}`;
      })
      .filter((entry): entry is string => entry !== null);
    return parts.length > 0 ? parts.join("\n") : null;
  }
  return null;
}

function isPlainNoteKey(key: string): boolean {
  const normalized = key.trim().toLowerCase();
  return normalized === "note" || normalized === "notes" || normalized === "general";
}

function labelize(key: string): string {
  const spaced = key.trim().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
  return spaced.length > 0 ? spaced[0].toUpperCase() + spaced.slice(1) : spaced;
}

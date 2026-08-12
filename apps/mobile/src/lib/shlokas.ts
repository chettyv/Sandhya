import { localDateKey } from "./activity";

import shlokaBank from "@/data/shlokaBank.json";

// Generated from content/shlokas/** by scripts/generate-shloka-bank.mjs —
// reviewed entries only. Bundled so the daily shloka works offline.
export type ShlokaWord = { word: string; meaning: string };
export type Shloka = {
  slug: string;
  textRef: string;
  tradition: string;
  tags: string[];
  devanagari: string;
  iast: string;
  sayIt: string;
  translation: string;
  source: string;
  words: ShlokaWord[];
  meaning: string;
  reflection: string;
  // Per-language variants keyed by ISO 639-1 code; English lives in
  // translation/meaning above.
  translations: Record<string, string>;
  meanings: Record<string, string>;
};

export const shlokas = shlokaBank as Shloka[];

export function getShloka(slug: string | undefined): Shloka | undefined {
  return shlokas.find((entry) => entry.slug === slug);
}

export function availableContentLanguages(): string[] {
  const languages = new Set(["en"]);
  for (const entry of shlokas) {
    for (const code of Object.keys(entry.translations)) languages.add(code);
    for (const code of Object.keys(entry.meanings)) languages.add(code);
  }
  return [...languages];
}

export function shlokaTranslation(shloka: Shloka, language: string): string {
  return (language !== "en" && shloka.translations[language]) || shloka.translation;
}

export function shlokaMeaning(shloka: Shloka, language: string): string {
  return (language !== "en" && shloka.meanings[language]) || shloka.meaning;
}

// Deterministic daily pick: everyone with the same focus sees the same verse
// on the same local date. Verses matching any of the user's focus tags rotate
// as their own pool; with no tags (or no matches) the whole bank rotates.
export function dailyShloka(
  focusTags: string[] = [],
  dateKey = localDateKey(),
): Shloka | undefined {
  if (shlokas.length === 0) return undefined;
  const pool =
    focusTags.length > 0
      ? shlokas.filter((entry) => entry.tags.some((tag) => focusTags.includes(tag)))
      : [];
  const source = pool.length > 0 ? pool : shlokas;
  const [year = 0, month = 1, day = 1] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000);
  return source[dayOfYear % source.length];
}

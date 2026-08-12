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
  dailyPool: boolean;
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

// Reader grouping: "gita-12-3" -> chapter key "gita-12". Works for any text
// whose slugs end in a verse number.
export function chapterKey(slug: string): string {
  return slug.replace(/-\d+$/, "");
}

export type ReaderChapter = { key: string; title: string; verses: Shloka[] };

export function readerChapters(): ReaderChapter[] {
  const groups = new Map<string, Shloka[]>();
  for (const entry of shlokas) {
    const key = chapterKey(entry.slug);
    const group = groups.get(key);
    if (group) group.push(entry);
    else groups.set(key, [entry]);
  }
  return [...groups.entries()].map(([key, verses]) => {
    const match = verses[0]?.textRef.match(/^(.*?)\s+(\d+)\.\d+$/);
    return {
      key,
      title: match ? `${match[1]} — Chapter ${match[2]}` : (verses[0]?.textRef ?? key),
      verses,
    };
  });
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
  // Only curated daily_pool verses rotate — many Gita verses are fragments of
  // longer sentences and belong to the reader, not a standalone daily verse.
  const curated = shlokas.filter((entry) => entry.dailyPool);
  const base = curated.length > 0 ? curated : shlokas;
  const pool =
    focusTags.length > 0
      ? base.filter((entry) => entry.tags.some((tag) => focusTags.includes(tag)))
      : [];
  const source = pool.length > 0 ? pool : base;
  const [year = 0, month = 1, day = 1] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000);
  return source[dayOfYear % source.length];
}

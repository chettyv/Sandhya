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

// Reader grouping. Chapter-style slugs ("gita-12-3") group per chapter
// ("gita-12"); short texts (Hanuman Chalisa, Isha Upanishad) group whole,
// keyed by their slug prefix, with named units (shanti mantra, dohas) placed
// in liturgical order around the numbered verses.
export function chapterKey(slug: string): string {
  const chapterStyle = slug.match(/^([a-z-]+-\d+)-\d+$/);
  if (chapterStyle?.[1]) return chapterStyle[1];
  return slug.replace(/-(\d+|shanti|doha-\d+)$/, "");
}

// Liturgical position within a group: openings first, numbered units in
// order, closings last.
function readerRank(slug: string): number {
  if (slug.endsWith("-shanti")) return -100;
  const doha = slug.match(/-doha-(\d+)$/);
  if (doha) return Number(doha[1]) === 3 ? 10_000 : -10 + Number(doha[1]);
  const number = slug.match(/-(\d+)$/);
  return number ? Number(number[1]) : 0;
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
    verses.sort((a, b) => readerRank(a.slug) - readerRank(b.slug));
    const chapterStyle = verses[0]?.textRef.match(/^(.*?)\s+(\d+)\.\d+$/);
    const title = chapterStyle
      ? `${chapterStyle[1]} — Chapter ${chapterStyle[2]}`
      : (verses[0]?.textRef
          .replace(/[,]?\s*(chaupai|opening doha|closing doha|shanti mantra).*$/i, "")
          .replace(/\s+\d+$/, "") ?? key);
    return { key, title, verses };
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

// Deterministic daily pick: everyone with the same preferences sees the same
// verse on the same local date. Preference tags ORDER the rotation — they
// never narrow it. Verses matching the user's tags are woven through the full
// curated pool at even density, so a preference leads without ever hiding the
// rest of the bank. (Same rule as tradition ranking in retrieval: rank, don't
// narrow — 02-plan.md Phase 0.5 / B4.)
export function dailyShloka(
  preferenceTags: string[] = [],
  dateKey = localDateKey(),
): Shloka | undefined {
  return dailyShlokaFrom(shlokas, preferenceTags, dateKey);
}

// Injectable-bank variant so rotation behaviour is testable while the
// committed bank ships approved-only (and may be empty in CI).
export function dailyShlokaFrom(
  bank: Shloka[],
  preferenceTags: string[] = [],
  dateKey = localDateKey(),
): Shloka | undefined {
  const sequence = rotationSequence(bank, preferenceTags);
  if (sequence.length === 0) return undefined;
  const [year = 0, month = 1, day = 1] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000);
  return sequence[dayOfYear % sequence.length];
}

// Daily prayer segmentation: units carrying the morning/evening context tags
// (shanti mantras, recited prayers) surface by local time of day — the
// sandhyā moments the app is named for. Deterministic per date so everyone
// sees the same prayer on the same day; hidden entirely while no prayer-
// tagged content is live in the bank.
export type PrayerContext = "morning" | "evening";

export function prayerContextForHour(hour: number): PrayerContext {
  return hour >= 4 && hour < 15 ? "morning" : "evening";
}

export function dailyPrayer(
  context: PrayerContext,
  dateKey = localDateKey(),
  bank: Shloka[] = shlokas,
): Shloka | undefined {
  const pool = bank.filter((entry) => entry.tags.includes(context));
  if (pool.length === 0) return undefined;
  const [year = 0, month = 1, day = 1] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000);
  return pool[dayOfYear % pool.length];
}

// The reordered daily pool: every curated verse exactly once, with
// tag-matching verses distributed evenly through the sequence (proportional
// merge), so any join date lands in a preference-flavoured rotation.
export function rotationSequence(bank: Shloka[], preferenceTags: string[] = []): Shloka[] {
  // Only curated daily_pool verses rotate — many Gita verses are fragments of
  // longer sentences and belong to the reader, not a standalone daily verse.
  const curated = bank.filter((entry) => entry.dailyPool);
  const base = curated.length > 0 ? curated : bank;
  if (preferenceTags.length === 0) return base;
  const preferred = base.filter((entry) => entry.tags.some((tag) => preferenceTags.includes(tag)));
  if (preferred.length === 0 || preferred.length === base.length) return base;
  const rest = base.filter((entry) => !preferred.includes(entry));
  // Proportional merge; ties favour the preferred list so day one leads with
  // the user's own practice.
  const woven: Shloka[] = [];
  let preferredIndex = 0;
  let restIndex = 0;
  while (preferredIndex < preferred.length || restIndex < rest.length) {
    const preferredProgress = preferredIndex / preferred.length;
    const restProgress = restIndex / rest.length;
    if (preferredIndex < preferred.length && preferredProgress <= restProgress) {
      woven.push(preferred[preferredIndex++]);
    } else {
      woven.push(rest[restIndex++]);
    }
  }
  return woven;
}

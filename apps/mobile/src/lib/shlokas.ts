import { localDateKey } from "./activity";

import shlokaBank from "@/data/shlokaBank.core.json";

// Generated from content/shlokas/** by scripts/generate-shloka-bank.mjs —
// reviewed entries only. Bundled so the daily shloka works offline. The core
// view carries everything the lists, reader and daily card need; the
// word-by-word gloss and prose meanings live in shlokaBank.details.json and
// are loaded by the verse page on demand, so a cold start does not pay for
// them (see loadShlokaDetails).
export type ShlokaWord = { word: string; meaning: string };
export type ShlokaDetails = {
  words: ShlokaWord[];
  meaning: string;
  // Per-language prose meanings keyed by ISO 639-1 code; English is `meaning`.
  meanings: Record<string, string>;
};
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
  reflection: string;
  // Per-language verse translations keyed by ISO 639-1 code; English is
  // `translation`.
  translations: Record<string, string>;
};

export const shlokas = shlokaBank as Shloka[];

export function getShloka(slug: string | undefined): Shloka | undefined {
  return shlokas.find((entry) => entry.slug === slug);
}

let detailsPromise: Promise<Record<string, ShlokaDetails>> | undefined;

/** Loads the word-by-word gloss and meanings for every verse; cached after the first call. */
export function loadShlokaDetails(): Promise<Record<string, ShlokaDetails>> {
  detailsPromise ??= import("@/data/shlokaBank.details.json").then(
    (module) => (module.default ?? module) as Record<string, ShlokaDetails>,
  );
  return detailsPromise;
}

export async function getShlokaDetails(slug: string): Promise<ShlokaDetails | undefined> {
  return (await loadShlokaDetails())[slug];
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
  // A chaptered text's opening shanti mantra ("katha-shanti") keys to the bare
  // text name, which would otherwise surface as a one-verse "chapter" of its
  // own. Fold it into the text's first chapter, where readerRank already
  // places it before verse 1.
  for (const [key, verses] of groups) {
    if (!verses.every((verse) => verse.slug.endsWith("-shanti"))) continue;
    const firstChapter = [...groups.keys()].find(
      (candidate) => candidate !== key && candidate.startsWith(`${key}-`),
    );
    if (!firstChapter) continue;
    groups.get(firstChapter)!.push(...verses);
    groups.delete(key);
  }
  return [...groups.entries()].map(([key, verses]) => {
    verses.sort((a, b) => readerRank(a.slug) - readerRank(b.slug));
    const lead = verses.find((verse) => !verse.slug.endsWith("-shanti")) ?? verses[0];
    return { key, title: readerChapterTitle(lead?.textRef ?? key), verses };
  });
}

/**
 * A chapter title from the textRef of the group's first verse, with that
 * verse's own number removed — the group is the chapter, not its opening line.
 *
 *   "Bhagavad Gita 2.13"                                → "Bhagavad Gita — Chapter 2"
 *   "Katha Upanishad 1.2.5"                             → "Katha Upanishad 1.2"
 *   "Aditya Hridayam 1 (Valmiki Ramayana, Yuddha Kanda)" → "Aditya Hridayam (Valmiki Ramayana, Yuddha Kanda)"
 *   "Hanuman Chalisa, chaupai 1"                        → "Hanuman Chalisa"
 *   "Isha Upanishad 1"                                  → "Isha Upanishad"
 */
export function readerChapterTitle(textRef: string): string {
  const threePart = textRef.match(/^(.*?)\s+(\d+\.\d+)\.\d+$/);
  if (threePart) return `${threePart[1]} ${threePart[2]}`;
  const chapterStyle = textRef.match(/^(.*?)\s+(\d+)\.\d+$/);
  if (chapterStyle) return `${chapterStyle[1]} — Chapter ${chapterStyle[2]}`;
  return textRef
    .replace(/[,]?\s*(chaupai|opening doha|closing doha|shanti mantra).*$/i, "")
    .replace(/\s+\d+(\s*\(.*\))$/, "$1")
    .replace(/\s+\d+$/, "");
}

export function availableContentLanguages(): string[] {
  // Every language with a prose meaning also has a verse translation, so the
  // core view is enough to enumerate the offer.
  const languages = new Set(["en"]);
  for (const entry of shlokas) {
    for (const code of Object.keys(entry.translations)) languages.add(code);
  }
  return [...languages];
}

// Source lines from the bank often carry a percent-encoded Wikisource URL;
// show the decoded form (falls back to the raw string on a malformed one).
export function readableSource(source: string): string {
  try {
    return decodeURI(source);
  } catch {
    return source;
  }
}

export function shlokaTranslation(shloka: Shloka, language: string): string {
  return (language !== "en" && shloka.translations[language]) || shloka.translation;
}

export function shlokaMeaning(details: ShlokaDetails, language: string): string {
  return (language !== "en" && details.meanings[language]) || details.meaning;
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
  preferredPrefixes: string[] = [],
): Shloka | undefined {
  return dailyShlokaFrom(shlokas, preferenceTags, dateKey, preferredPrefixes);
}

// Injectable-bank variant so rotation behaviour is testable while the
// committed bank ships approved-only (and may be empty in CI).
export function dailyShlokaFrom(
  bank: Shloka[],
  preferenceTags: string[] = [],
  dateKey = localDateKey(),
  preferredPrefixes: string[] = [],
): Shloka | undefined {
  const sequence = rotationSequence(bank, preferenceTags, preferredPrefixes);
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
//
// Two ordering signals, both from onboarding, both ORDER and never narrow:
// - preferredPrefixes: the text the user chose to begin with ("read" intent).
//   Verses from that text are woven to the front at even density.
// - preferenceTags: household-practice tags, applied within each half.
export function rotationSequence(
  bank: Shloka[],
  preferenceTags: string[] = [],
  preferredPrefixes: string[] = [],
): Shloka[] {
  // Only curated daily_pool verses rotate — many Gita verses are fragments of
  // longer sentences and belong to the reader, not a standalone daily verse.
  const curated = bank.filter((entry) => entry.dailyPool);
  const base = curated.length > 0 ? curated : bank;
  const byTags = (pool: Shloka[]) => {
    if (preferenceTags.length === 0) return pool;
    const preferred = pool.filter((entry) =>
      entry.tags.some((tag) => preferenceTags.includes(tag)),
    );
    if (preferred.length === 0 || preferred.length === pool.length) return pool;
    return weave(
      preferred,
      pool.filter((entry) => !preferred.includes(entry)),
    );
  };
  if (preferredPrefixes.length === 0) return byTags(base);
  const fromText = base.filter((entry) =>
    preferredPrefixes.some((prefix) => entry.slug.startsWith(prefix)),
  );
  if (fromText.length === 0 || fromText.length === base.length) return byTags(base);
  const others = base.filter((entry) => !fromText.includes(entry));
  return weave(byTags(fromText), byTags(others));
}

// Proportional merge; ties favour the preferred list so the sequence leads
// with the user's own choice.
function weave(preferred: Shloka[], rest: Shloka[]): Shloka[] {
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

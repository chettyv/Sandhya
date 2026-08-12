import { localDateKey } from "./activity";

import shlokaBank from "@/data/shlokaBank.json";

// Generated from content/shlokas/** by scripts/generate-shloka-bank.mjs —
// reviewed entries only. Bundled so the daily shloka works offline.
export type ShlokaWord = { word: string; meaning: string };
export type Shloka = {
  slug: string;
  textRef: string;
  tradition: string;
  devanagari: string;
  iast: string;
  sayIt: string;
  translation: string;
  source: string;
  words: ShlokaWord[];
  meaning: string;
  reflection: string;
};

export const shlokas = shlokaBank as Shloka[];

export function getShloka(slug: string | undefined): Shloka | undefined {
  return shlokas.find((entry) => entry.slug === slug);
}

// Same rotation scheme as daily reflections: day-of-year modulo bank size,
// so everyone sees the same shloka on the same local date.
export function dailyShloka(dateKey = localDateKey()): Shloka | undefined {
  if (shlokas.length === 0) return undefined;
  const [year = 0, month = 1, day = 1] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000);
  return shlokas[dayOfYear % shlokas.length];
}

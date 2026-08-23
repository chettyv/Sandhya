import type { Curiosity, Intent, StartingText } from "@/features/onboarding/types";
import type { Concept, Practice } from "@/types/content";

// Where the profile lands on the home tab. Pure functions so the routing the
// onboarding promises ("this picks the practice at the top of your day") is
// testable, and so the payoff screen and the home tab agree.

export const startingTextPrefixes: Record<StartingText, string[]> = {
  gita: ["gita-"],
  chalisa: ["chalisa-"],
  upanishads: ["isha-", "kena-", "katha-", "mundaka-", "mandukya-", "shvetashvatara-"],
  "soundarya-lahari": ["soundarya-lahari-"],
  "bhaja-govindam": ["bhaja-govindam-"],
  any: [],
};

// Reader chapter keys (see readerChapters in shlokas.ts) the text opens at.
export const startingTextChapter: Record<StartingText, string | null> = {
  gita: "gita-2",
  chalisa: "chalisa",
  upanishads: "isha",
  "soundarya-lahari": "soundarya-lahari",
  "bhaja-govindam": "bhaja-govindam",
  any: null,
};

const conceptIdsByCuriosity: Record<Curiosity, string[]> = {
  lamp: ["00000000-0000-0000-0000-000000000732", "00000000-0000-0000-0000-000000000736"],
  mantras: ["00000000-0000-0000-0000-000000000733", "00000000-0000-0000-0000-000000000734"],
  festivals: ["00000000-0000-0000-0000-000000000732", "00000000-0000-0000-0000-000000000737"],
  ideas: ["00000000-0000-0000-0000-000000000701", "00000000-0000-0000-0000-000000000702"],
};

export type StartingProfile = {
  intent: Intent | null;
  practiceMinutes: number | null;
  startingText: StartingText | null;
  curiosity: Curiosity | null;
  householdPractices: string[];
  reminderEnabled: boolean;
  reminderTime: string;
};

function timeOfDay(profile: StartingProfile): "morning" | "evening" | null {
  if (!profile.reminderEnabled) return null;
  const hour = Number(profile.reminderTime.slice(0, 2));
  if (Number.isNaN(hour)) return null;
  return hour < 15 ? "morning" : "evening";
}

// Picks the practice that leads the home tab. Scores are additive so a lamp
// household with a morning reminder and five minutes lands on the diya
// practice, while someone with two minutes and no household practice gets the
// breath pause. Ties keep catalogue order (the free starter set first).
export function pickStartingPractice(
  practices: Practice[],
  profile: StartingProfile,
): Practice | undefined {
  if (practices.length === 0) return undefined;
  const budget = profile.practiceMinutes;
  const candidates = budget
    ? practices.filter((practice) => practice.durationMinutes <= budget)
    : practices;
  const pool = candidates.length > 0 ? candidates : practices;
  const slot = timeOfDay(profile);
  let best = pool[0];
  let bestScore = -Infinity;
  for (const practice of pool) {
    let score = 0;
    const title = practice.title.toLowerCase();
    if (profile.householdPractices.includes("lamp") && /diya|lamp|arati/.test(title)) score += 3;
    if (profile.householdPractices.includes("chalisa") && practice.category === "Mantra")
      score += 3;
    if (slot === "morning" && /morning/.test(title)) score += 2;
    if (slot === "evening" && /evening/.test(title)) score += 2;
    if (slot === "morning" && /evening/.test(title)) score -= 2;
    if (slot === "evening" && /morning/.test(title)) score -= 2;
    if (practice.level === "Beginner") score += 1;
    if (practice.isPremium) score -= 1;
    // Prefer using the time the user offered, without exceeding it.
    if (budget) score += practice.durationMinutes / budget;
    if (score > bestScore) {
      bestScore = score;
      best = practice;
    }
  }
  return best;
}

// The two "Continue learning" tiles on the home tab, chosen by what the user
// asked to have explained. Falls back to catalogue order.
export function pickConcepts(concepts: Concept[], curiosity: Curiosity | null): Concept[] {
  const wanted = curiosity ? conceptIdsByCuriosity[curiosity] : [];
  const chosen = wanted
    .map((id) => concepts.find((concept) => concept.id === id))
    .filter((concept): concept is Concept => Boolean(concept));
  for (const concept of concepts) {
    if (chosen.length >= 2) break;
    if (!chosen.includes(concept)) chosen.push(concept);
  }
  return chosen.slice(0, 2);
}

export type StartingPoint =
  | { kind: "practice"; practice: Practice; title: string; detail: string }
  | { kind: "chapter"; chapter: string; title: string; detail: string }
  | { kind: "concept"; concept: Concept; title: string; detail: string }
  | { kind: "shloka"; slug: string; title: string; detail: string }
  | { kind: "reader"; title: string; detail: string }
  | { kind: "explore"; title: string; detail: string };

// One recommended first action, derived from intent and its branch answer.
export function startingPointFor(
  profile: StartingProfile,
  practices: Practice[],
  concepts: Concept[],
): StartingPoint | null {
  switch (profile.intent) {
    case "practice": {
      const practice = pickStartingPractice(practices, profile);
      if (!practice) return null;
      return {
        kind: "practice",
        practice,
        title: practice.title,
        detail: `${practice.durationMinutes} min · ${practice.category}`,
      };
    }
    case "read": {
      const chapter = profile.startingText ? startingTextChapter[profile.startingText] : null;
      if (!chapter)
        return {
          kind: "reader",
          title: "Open the reader",
          detail: "Twelve texts, verse by verse",
        };
      return {
        kind: "chapter",
        chapter,
        title: chapterTitle(chapter),
        detail: "Open in the reader",
      };
    }
    case "understand":
    case "explore": {
      switch (profile.curiosity) {
        case "lamp": {
          const practice =
            practices.find((entry) => /diya|lamp/i.test(entry.title)) ??
            pickStartingPractice(practices, profile);
          if (!practice) return null;
          return {
            kind: "practice",
            practice,
            title: practice.title,
            detail: `${practice.durationMinutes} min · what to do, and what it means`,
          };
        }
        case "mantras":
          return {
            kind: "shloka",
            slug: "prayer-gayatri",
            title: "The Gāyatrī mantra, word by word",
            detail: "Say it, then see what each word means",
          };
        case "festivals":
          return {
            kind: "explore",
            title: "The festival guides",
            detail: "What each one is for, with variations named",
          };
        default: {
          const concept = pickConcepts(concepts, profile.curiosity ?? "ideas")[0];
          if (!concept) return null;
          return {
            kind: "concept",
            concept,
            title: concept.term,
            detail: concept.definition,
          };
        }
      }
    }
    default:
      return null;
  }
}

const chapterTitles: Record<string, string> = {
  "gita-2": "Bhagavad Gita, chapter 2",
  chalisa: "Hanuman Chalisa",
  isha: "Isha Upanishad",
  "soundarya-lahari": "Soundarya Lahari",
  "bhaja-govindam": "Bhaja Govindam",
};

function chapterTitle(chapter: string): string {
  return chapterTitles[chapter] ?? chapter;
}

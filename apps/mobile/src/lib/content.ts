import { useQuery } from "@tanstack/react-query";

import {
  concepts as fallbackConcepts,
  deities as fallbackDeities,
  dailyReflections as fallbackDailyReflections,
  festivals as fallbackFestivals,
  getFallbackDailyReflection,
  practices as fallbackPractices,
  sacredTexts as fallbackTexts,
} from "@/data/content";
import { localDateKey } from "@/lib/activity";
import { useSubscription } from "@/lib/subscriptions";
import { supabase } from "@/lib/supabase";
import { describeVariations } from "@/lib/variationNotes";
import type {
  Concept,
  Deity,
  Festival,
  FestivalDateReckoning,
  Practice,
  SacredText,
} from "@/types/content";

export type DailyReflectionContent = ReturnType<typeof getFallbackDailyReflection>;
export type ContentSource = "fallback" | "partial" | "connected";

export type ContentLibrary = {
  source: ContentSource;
  dailyReflection: DailyReflectionContent;
  dailyReflections: DailyReflectionContent[];
  festivals: Festival[];
  practices: Practice[];
  concepts: Concept[];
  deities: Deity[];
  texts: SacredText[];
};

function getFallbackLibrary(): ContentLibrary {
  return {
    source: "fallback",
    dailyReflection: getFallbackDailyReflection(),
    dailyReflections: fallbackDailyReflections,
    festivals: fallbackFestivals,
    practices: fallbackPractices,
    concepts: fallbackConcepts,
    deities: fallbackDeities,
    texts: fallbackTexts,
  };
}

function dateParts(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  return {
    dayLabel: String(parsed.getDate()).padStart(2, "0"),
    monthLabel: parsed.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
  };
}

const RECKONING_SYSTEMS = new Set(["amanta", "purnimanta", "solar", "other"]);

/** Accepts the festivals.date_reckoning jsonb; anything incomplete is treated as absent. */
function parseDateReckoning(value: unknown): FestivalDateReckoning | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const system = typeof raw.system === "string" ? raw.system.toLowerCase() : "";
  const location = typeof raw.location === "string" ? raw.location.trim() : "";
  const source = typeof raw.source === "string" ? raw.source.trim() : "";
  if (!RECKONING_SYSTEMS.has(system) || !location || !source) return null;
  return {
    system: system as FestivalDateReckoning["system"],
    community:
      typeof raw.community === "string" && raw.community.trim() ? raw.community.trim() : undefined,
    location,
    source,
    disagreement:
      typeof raw.disagreement === "string" && raw.disagreement.trim()
        ? raw.disagreement.trim()
        : undefined,
  };
}

function mergeByKey<T>(primary: T[], fallback: T[], key: (item: T) => string): T[] {
  const seen = new Set(primary.map((item) => key(item).trim().toLowerCase()));
  return [...primary, ...fallback.filter((item) => !seen.has(key(item).trim().toLowerCase()))];
}

async function fetchLibrary(): Promise<ContentLibrary> {
  if (!supabase) return getFallbackLibrary();
  const now = new Date();
  const startOfYearUtc = Date.UTC(now.getFullYear(), 0, 1);
  const currentDateUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const dateSlot = Math.floor((currentDateUtc - startOfYearUtc) / 86_400_000) + 1;
  const [reflectionResult, festivalResult, practiceResult, conceptResult, deityResult, textResult] =
    await Promise.all([
      supabase
        .from("daily_reflections")
        .select("*")
        .eq("date_slot", dateSlot)
        .order("tradition")
        .limit(1)
        .maybeSingle(),
      supabase.from("festivals").select("*").order("upcoming_dates"),
      supabase.from("practice_guides").select("*").order("created_at"),
      supabase.from("concepts").select("*").order("term"),
      supabase
        .from("deities")
        .select("id,name,other_names,short_description,full_description,traditions")
        .order("name"),
      supabase
        .from("texts")
        .select("id,title,title_sanskrit,category,description,estimated_date,tradition_primary")
        .order("title"),
    ]);
  const reflection = reflectionResult.data as
    | {
        id: string;
        title: string;
        reflection_text: string;
        practice_prompt?: string | null;
        journal_prompt: string | null;
        tradition: string;
        is_premium?: boolean;
      }
    | undefined;
  const remoteReflection =
    !reflectionResult.error && reflection
      ? {
          id: reflection.id,
          eyebrow: `A reflection from ${reflection.tradition || "Hindu"} tradition`,
          title: reflection.title,
          body: reflection.reflection_text,
          practicePrompt:
            reflection.practice_prompt ??
            "Choose one responsibility. Before you begin, take a breath and name the care you want to bring to it.",
          prompt: reflection.journal_prompt ?? "What would you like to carry into today?",
          isPremium: Boolean(reflection.is_premium),
        }
      : null;
  const festivals = (festivalResult.error ? [] : (festivalResult.data ?? [])).flatMap((row) => {
    const item = row as {
      id: string;
      name: string;
      name_variants?: string[];
      upcoming_dates?: string[];
      short_description?: string | null;
      full_story?: string | null;
      meaning?: string | null;
      home_observance?: string | null;
      regional_variations?: Record<string, unknown> | null;
      date_reckoning?: Record<string, unknown> | null;
      traditions?: string[];
      image_url?: string | null;
    };
    const date =
      (item.upcoming_dates ?? []).filter((candidate) => candidate >= localDateKey(now)).sort()[0] ??
      item.upcoming_dates?.[0];
    // A date is published only with its reckoning (CLAUDE.md); without one
    // the row is shown as a guide, never as a bare date.
    const reckoning = date ? parseDateReckoning(item.date_reckoning) : null;
    const normalizedDate = date && reckoning ? date : null;
    const parts = normalizedDate
      ? dateParts(normalizedDate)
      : { dayLabel: "—", monthLabel: "GUIDE" };
    return [
      {
        id: item.id,
        name: item.name,
        variant: item.name_variants?.[0],
        date: normalizedDate,
        dateReckoning: reckoning,
        ...parts,
        summary: item.short_description ?? "A festival in the Hindu calendar.",
        meaning:
          item.meaning ??
          item.full_story ??
          "Learn about this festival and the ways communities observe it.",
        observance: item.home_observance ? item.home_observance.split("\n").filter(Boolean) : [],
        variationNote: describeVariations(
          item.regional_variations,
          "Observances vary by family, region, and tradition.",
        ),
        color: "#7F6278",
        isPremium: Boolean((item as { is_premium?: boolean }).is_premium),
      } satisfies Festival,
    ];
  });
  const practices = (practiceResult.error ? [] : (practiceResult.data ?? [])).map((row) => {
    const item = row as {
      id: string;
      title: string;
      category: string;
      duration_minutes?: number | null;
      difficulty: string;
      steps?: Array<{ title?: string; body?: string }> | string[];
      materials_needed?: string[] | null;
      tradition_notes?: string | null;
      warnings?: string | null;
      is_premium?: boolean;
    };
    const category =
      item.category === "puja" || item.category === "diya"
        ? "Puja"
        : item.category === "mantra"
          ? "Mantra"
          : item.category === "meditation"
            ? "Meditation"
            : "Reflection";
    const steps = (item.steps ?? []).map((step) =>
      typeof step === "string" ? step : [step.title, step.body].filter(Boolean).join(": "),
    );
    return {
      id: item.id,
      title: item.title,
      category,
      durationMinutes: item.duration_minutes ?? 5,
      level:
        item.difficulty === "advanced"
          ? "Intermediate"
          : item.difficulty === "intermediate"
            ? "Intermediate"
            : "Beginner",
      summary: item.tradition_notes ?? "A guided practice for a few quiet minutes.",
      steps,
      materials: item.materials_needed ?? [],
      traditionNote: item.tradition_notes ?? undefined,
      warnings: item.warnings ?? undefined,
      isPremium: Boolean(item.is_premium),
    } satisfies Practice;
  });
  const concepts = (conceptResult.error ? [] : (conceptResult.data ?? [])).map((row) => {
    const item = row as {
      id: string;
      term: string;
      term_sanskrit?: string | null;
      short_definition?: string | null;
      full_explanation?: string | null;
      tradition_variations?: Record<string, unknown> | null;
    };
    return {
      id: item.id,
      term: item.term,
      sanskrit: item.term_sanskrit ?? "",
      definition: item.short_definition ?? "A concept explored across Hindu traditions.",
      explanation: item.full_explanation ?? item.short_definition ?? "",
      variationNote: item.tradition_variations
        ? describeVariations(
            item.tradition_variations,
            "Interpretations vary across texts, schools, and communities.",
          )
        : undefined,
    } satisfies Concept;
  });
  const texts = (textResult.error ? [] : (textResult.data ?? [])).map((row) => {
    const item = row as {
      id: string;
      title: string;
      title_sanskrit?: string | null;
      category: string;
      description?: string | null;
      estimated_date?: string | null;
      tradition_primary?: string | null;
    };
    return {
      id: item.id,
      title: item.title,
      sanskrit: item.title_sanskrit ?? undefined,
      category: item.category.replace("_", " "),
      description:
        item.description ??
        "A source work explored through passages, context, and multiple perspectives.",
      estimatedDate: item.estimated_date ?? undefined,
      tradition: item.tradition_primary ?? "general",
    } satisfies SacredText;
  });
  const deities = (deityResult.error ? [] : (deityResult.data ?? [])).map((row) => {
    const item = row as {
      id: string;
      name: string;
      other_names?: string[] | null;
      short_description?: string | null;
      full_description?: string | null;
      traditions?: string[] | null;
    };
    return {
      id: item.id,
      name: item.name,
      otherNames: item.other_names ?? [],
      shortDescription:
        item.short_description ?? "A deity understood through many Hindu traditions and practices.",
      fullDescription:
        item.full_description ??
        item.short_description ??
        "Learn from a tradition-specific source.",
      traditions: item.traditions ?? [],
    } satisfies Deity;
  });
  const remoteErrors = [
    reflectionResult,
    festivalResult,
    practiceResult,
    conceptResult,
    deityResult,
    textResult,
  ].filter((result) => result.error).length;
  // The notice this feeds tells the user the live library could not be
  // reached, so only failed requests count. A table that answers with zero
  // rows is not a connectivity problem: the bundled library is the library
  // for that section by design, and warning about it on every screen while
  // the backend is still being seeded would be false.
  const source: ContentSource =
    remoteErrors === 6 ? "fallback" : remoteErrors > 0 ? "partial" : "connected";

  return {
    source,
    dailyReflection: remoteReflection ?? getFallbackDailyReflection(now),
    dailyReflections: remoteReflection
      ? [
          remoteReflection,
          ...fallbackDailyReflections.filter((item) => item.id !== remoteReflection.id),
        ]
      : fallbackDailyReflections,
    festivals: mergeByKey(festivals, fallbackFestivals, (item) => item.name),
    practices: mergeByKey(practices, fallbackPractices, (item) => item.title),
    concepts: mergeByKey(concepts, fallbackConcepts, (item) => item.term),
    deities: mergeByKey(deities, fallbackDeities, (item) => item.name),
    texts: mergeByKey(texts, fallbackTexts, (item) => item.title),
  };
}

export function useCuratedContent() {
  const { data: subscription } = useSubscription();
  return useQuery({
    queryKey: ["curated-content", subscription.plan],
    queryFn: fetchLibrary,
    // The bundled library renders synchronously, but it must count as stale
    // from the start: with the default 5-minute staleTime, initialData alone
    // is treated as fresh and the live Supabase fetch never runs, so every
    // screen shows the "offline library" notice even when online.
    initialData: getFallbackLibrary(),
    initialDataUpdatedAt: 0,
  });
}

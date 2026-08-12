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
import type { Concept, Deity, Festival, Practice, SacredText } from "@/types/content";

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
      traditions?: string[];
      image_url?: string | null;
    };
    const date =
      (item.upcoming_dates ?? []).filter((candidate) => candidate >= localDateKey(now)).sort()[0] ??
      item.upcoming_dates?.[0];
    const normalizedDate = date ?? null;
    const parts = normalizedDate
      ? dateParts(normalizedDate)
      : { dayLabel: "—", monthLabel: "GUIDE" };
    return [
      {
        id: item.id,
        name: item.name,
        variant: item.name_variants?.[0],
        date: normalizedDate,
        ...parts,
        summary: item.short_description ?? "A festival in the Hindu calendar.",
        meaning:
          item.meaning ??
          item.full_story ??
          "Learn about this festival and the ways communities observe it.",
        observance: item.home_observance ? item.home_observance.split("\n").filter(Boolean) : [],
        variationNote: item.regional_variations
          ? "Dates and observances can vary by region, tradition, and local calendar."
          : "Observances vary by family, region, and tradition.",
        color: "#775B82",
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
        ? "Interpretations vary across texts, schools, and communities."
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
  const remoteMissing = [
    !reflectionResult.data,
    !(Array.isArray(festivalResult.data) && festivalResult.data.length),
    !(Array.isArray(practiceResult.data) && practiceResult.data.length),
    !(Array.isArray(conceptResult.data) && conceptResult.data.length),
    !(Array.isArray(deityResult.data) && deityResult.data.length),
    !(Array.isArray(textResult.data) && textResult.data.length),
  ].filter(Boolean).length;
  const source: ContentSource =
    remoteErrors === 6 || remoteMissing === 6
      ? "fallback"
      : remoteErrors > 0 || remoteMissing > 0
        ? "partial"
        : "connected";

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
    initialData: getFallbackLibrary(),
  });
}

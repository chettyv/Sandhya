import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { localDateKey } from "./activity";
import { supabase } from "./supabase";

export type ChallengeSummary = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  startDate: string;
  nights: number;
  priceDisplay: string;
};

export type ChallengeSessionMeta = {
  night: number;
  title: string;
  deityFocus: string;
  estimatedMinutes: number;
  unlockDate: string;
};

export type ChallengeOverview = {
  challenge: ChallengeSummary;
  participantCount: number;
  joined: boolean;
  completedNights: number[];
  sessions: ChallengeSessionMeta[];
};

export type ShlokaBlock = {
  devanagari: string;
  iast: string;
  sayIt: string;
  meaning: string;
  source: string;
};

export type ChallengeSessionDetail = {
  night: number;
  title: string;
  deityFocus: string;
  estimatedMinutes: number;
  unlockDate: string;
  completed: boolean;
  audioPath: string | null;
  audioSlowPath: string | null;
  content: {
    tonight: string;
    shloka: ShlokaBlock[];
    meaning: string;
    practice: string;
    traditionNotes: string;
    reflection: string;
  };
};

export type ChallengeSessionResult =
  | { status: "auth_required" | "not_joined" | "not_found" | "unavailable" }
  | { status: "locked"; unlockDate: string }
  | { status: "ok"; session: ChallengeSessionDetail };

export async function fetchFeaturedChallenge(): Promise<ChallengeSummary | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("challenges")
    .select("id,slug,title,tagline,start_date,nights,price_display")
    .eq("is_published", true)
    .order("start_date", { ascending: true });
  if (error || !Array.isArray(data)) return null;
  const today = localDateKey();
  const candidates = data
    .map(parseChallengeRow)
    .filter((row): row is ChallengeSummary => row !== null)
    .filter((row) => addDays(row.startDate, row.nights - 1) >= today);
  return candidates[0] ?? null;
}

/**
 * Resolves to null only when the challenge does not exist (or is not
 * published). A missing client or a failed request throws, so the screen can
 * tell "not found" apart from "could not load" instead of blaming the
 * connection for both.
 */
export async function fetchChallengeOverview(slug: string): Promise<ChallengeOverview | null> {
  if (!supabase) throw new Error("Challenge service unavailable");
  const { data, error } = (await supabase.rpc("get_challenge_overview", {
    p_slug: slug,
  })) as unknown as { data: unknown; error: { message?: string } | null };
  if (error) throw new Error(error.message ?? "Challenge request failed");
  if (data === null || typeof data !== "object") return null;
  const raw = data as Record<string, unknown>;
  const challenge = parseChallengeRow(raw.challenge);
  if (!challenge) return null;
  return {
    challenge,
    participantCount: typeof raw.participant_count === "number" ? raw.participant_count : 0,
    joined: raw.joined === true,
    completedNights: Array.isArray(raw.completed_nights)
      ? raw.completed_nights.filter((night): night is number => typeof night === "number")
      : [],
    sessions: Array.isArray(raw.sessions)
      ? raw.sessions
          .map(parseSessionMeta)
          .filter((session): session is ChallengeSessionMeta => session !== null)
      : [],
  };
}

export async function fetchChallengeSession(
  slug: string,
  night: number,
): Promise<ChallengeSessionResult> {
  if (!supabase) return { status: "unavailable" };
  // get_challenge_session is granted to authenticated users only; calling it
  // signed out yields a PostgREST permission error, which must read as
  // "sign in", not as a connectivity failure.
  const { data: auth } = await supabase.auth.getSession();
  if (!auth.session) return { status: "auth_required" };
  const { data, error } = (await supabase.rpc("get_challenge_session", {
    p_slug: slug,
    p_night: night,
  })) as unknown as { data: unknown; error: { code?: string; message?: string } | null };
  if (error) {
    const denied = error.code === "42501" || /permission denied/i.test(error.message ?? "");
    return { status: denied ? "auth_required" : "unavailable" };
  }
  if (data === null || typeof data !== "object") return { status: "unavailable" };
  const raw = data as Record<string, unknown>;
  if (raw.status === "locked" && typeof raw.unlock_date === "string") {
    return { status: "locked", unlockDate: raw.unlock_date };
  }
  if (raw.status === "auth_required" || raw.status === "not_joined" || raw.status === "not_found") {
    return { status: raw.status };
  }
  if (raw.status === "ok") {
    const session = parseSessionDetail(raw.session);
    if (session) return { status: "ok", session };
  }
  return { status: "unavailable" };
}

export async function completeChallengeNight(challengeId: string, night: number): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = (await supabase.rpc("complete_challenge_night", {
    p_challenge_id: challengeId,
    p_night: night,
  })) as unknown as { data: unknown; error: { message?: string } | null };
  if (error) throw new Error(error.message ?? "Challenge completion failed");
  if (data === null || typeof data !== "object") {
    throw new Error("Challenge completion returned an invalid response");
  }

  const status = (data as Record<string, unknown>).status;
  if (status === "completed" || status === "already_completed") return true;
  if (
    status === "auth_required" ||
    status === "not_joined" ||
    status === "not_found" ||
    status === "locked" ||
    status === "invalid_request" ||
    status === "unavailable"
  ) {
    return false;
  }
  throw new Error("Challenge completion returned an unknown status");
}

export function useFeaturedChallenge() {
  return useQuery({ queryKey: ["featured-challenge"], queryFn: fetchFeaturedChallenge });
}

export function useChallengeOverview(slug: string | undefined) {
  return useQuery({
    queryKey: ["challenge-overview", slug],
    queryFn: () => fetchChallengeOverview(slug ?? ""),
    enabled: Boolean(slug),
  });
}

export function useChallengeSession(slug: string | undefined, night: number) {
  return useQuery({
    queryKey: ["challenge-session", slug, night],
    queryFn: () => fetchChallengeSession(slug ?? "", night),
    enabled: Boolean(slug) && Number.isInteger(night) && night >= 1,
  });
}

export function useCompleteChallengeNight(slug: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ challengeId, night }: { challengeId: string; night: number }) =>
      completeChallengeNight(challengeId, night),
    onSuccess: (recorded) => {
      if (!recorded) return;
      void queryClient.invalidateQueries({ queryKey: ["challenge-overview", slug] });
      void queryClient.invalidateQueries({ queryKey: ["challenge-session", slug] });
    },
  });
}

export function addDays(dateKey: string, days: number): string {
  const [year = 0, month = 1, day = 1] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day + days);
  return localDateKey(date);
}

function parseChallengeRow(value: unknown): ChallengeSummary | null {
  if (value === null || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (
    typeof row.id !== "string" ||
    typeof row.slug !== "string" ||
    typeof row.title !== "string" ||
    typeof row.start_date !== "string" ||
    typeof row.nights !== "number"
  ) {
    return null;
  }
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: typeof row.tagline === "string" ? row.tagline : "",
    startDate: row.start_date,
    nights: row.nights,
    priceDisplay: typeof row.price_display === "string" ? row.price_display : "",
  };
}

function parseSessionMeta(value: unknown): ChallengeSessionMeta | null {
  if (value === null || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (
    typeof row.night !== "number" ||
    typeof row.title !== "string" ||
    typeof row.unlock_date !== "string"
  ) {
    return null;
  }
  return {
    night: row.night,
    title: row.title,
    deityFocus: typeof row.deity_focus === "string" ? row.deity_focus : "",
    estimatedMinutes: typeof row.estimated_minutes === "number" ? row.estimated_minutes : 10,
    unlockDate: row.unlock_date,
  };
}

function parseSessionDetail(value: unknown): ChallengeSessionDetail | null {
  const meta = parseSessionMeta(value);
  if (!meta) return null;
  const row = value as Record<string, unknown>;
  const content = row.content;
  if (content === null || typeof content !== "object") return null;
  const raw = content as Record<string, unknown>;
  return {
    ...meta,
    completed: row.completed === true,
    audioPath: typeof row.audio_path === "string" ? row.audio_path : null,
    audioSlowPath: typeof row.audio_slow_path === "string" ? row.audio_slow_path : null,
    content: {
      tonight: asText(raw.tonight),
      shloka: Array.isArray(raw.shloka)
        ? raw.shloka.map(parseShloka).filter((block): block is ShlokaBlock => block !== null)
        : [],
      meaning: asText(raw.meaning),
      practice: asText(raw.practice),
      traditionNotes: asText(raw.tradition_notes),
      reflection: asText(raw.reflection),
    },
  };
}

function parseShloka(value: unknown): ShlokaBlock | null {
  if (value === null || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const devanagari = asText(row.devanagari);
  if (!devanagari) return null;
  return {
    devanagari,
    iast: asText(row.iast),
    sayIt: asText(row.say_it),
    meaning: asText(row.meaning),
    source: asText(row.source),
  };
}

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

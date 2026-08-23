import { localDateKey } from "./activity";
import {
  clearLocalJournal,
  GUEST_JOURNAL_SCOPE,
  readLocalJournal,
  removeLocalJournalEntry,
  writeLocalJournal,
  type LocalJournalEntry,
} from "./localJournalStorage";
import { configureDailyReminder } from "./notifications";
import { supabase } from "./supabase";

export { calculateCurrentStreak, localDateKey } from "./activity";

export type SavedItemType =
  | "message"
  | "reflection"
  | "passage"
  | "practice"
  | "festival"
  | "concept"
  | "deity"
  | "text";
export type SavedItem = { itemId: string; itemType: SavedItemType };
type FeedbackIssueType = "incorrect" | "sectarian" | "insensitive" | "other";
const MAX_JOURNAL_ENTRY_LENGTH = 4000;
const ACCOUNT_REQUEST_TIMEOUT_MS = 20_000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type ProfilePreferences = {
  display_name: string | null;
  tradition_pref: string | null;
  notification_time: string | null;
  timezone: string | null;
  // Read back so a fresh install restores the onboarding answers that route
  // content, not just the name and reminder.
  household_practices: string[] | null;
  language_pref: "en" | "hi" | null;
};

export async function loadProfile(): Promise<ProfilePreferences | null> {
  if (!supabase) return null;
  const userId = await currentUserId().catch(() => null);
  if (!userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "display_name, tradition_pref, notification_time, timezone, household_practices, language_pref",
    )
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

type ProfilePatch = {
  display_name?: string | null;
  language_pref?: "en" | "hi";
  tradition_pref?: string | null;
  // Household observances from onboarding Q1. Routes content; deliberately
  // not a tradition identity — never derive tradition_pref from it.
  household_practices?: string[];
  location?: string | null;
  notification_time?: string | null;
  timezone?: string | null;
};

export async function updateProfile(patch: ProfilePatch): Promise<void> {
  if (!supabase) throw new Error("Sandhya is not connected to Supabase.");
  const { data, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const userId = data.session?.user.id;
  if (!userId) throw new Error("Please sign in to sync your preferences.");

  const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
  if (error) throw error;
}

async function currentUserId(): Promise<string> {
  if (!supabase) throw new Error("Sandhya is not connected to Supabase.");
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const userId = data.session?.user.id;
  if (!userId) throw new Error("Please sign in to sync this action.");
  return userId;
}

export async function saveItem(itemType: SavedItemType, itemId: string): Promise<void> {
  const userId = await currentUserId();
  const { error } = await supabase!
    .from("saved_items")
    .upsert(
      { user_id: userId, item_type: itemType, item_id: itemId },
      { onConflict: "user_id,item_type,item_id" },
    );
  if (error) throw error;
}

export async function removeSavedItem(itemType: SavedItemType, itemId: string): Promise<void> {
  const userId = await currentUserId();
  const { error } = await supabase!
    .from("saved_items")
    .delete()
    .eq("user_id", userId)
    .eq("item_type", itemType)
    .eq("item_id", itemId);
  if (error) throw error;
}

export async function syncSavedItem(
  itemType: SavedItemType,
  itemId: string,
  saved: boolean,
): Promise<void> {
  if (!UUID_PATTERN.test(itemId)) return;
  if (saved) await saveItem(itemType, itemId);
  else await removeSavedItem(itemType, itemId);
}

export async function loadSavedItems(): Promise<SavedItem[]> {
  const userId = await currentUserId();
  const { data, error } = await supabase!
    .from("saved_items")
    .select("item_id,item_type")
    .eq("user_id", userId);
  if (error) throw error;
  return ((data ?? []) as Array<{ item_id: string; item_type: SavedItemType }>).map((item) => ({
    itemId: item.item_id,
    itemType: item.item_type,
  }));
}

/** Upload UUID-backed guest saves when the user signs in. */
export async function syncLocalSavedItems(items: SavedItem[]): Promise<void> {
  const userId = await currentUserId();
  const pending = items.filter((item) => UUID_PATTERN.test(item.itemId));
  if (!pending.length) return;
  const { error } = await supabase!.from("saved_items").upsert(
    pending.map((item) => ({
      user_id: userId,
      item_type: item.itemType,
      item_id: item.itemId,
    })),
    { onConflict: "user_id,item_type,item_id", ignoreDuplicates: true },
  );
  if (error) throw error;
}

export async function submitFeedback(
  messageId: string,
  issueType: FeedbackIssueType = "other",
  notes?: string,
): Promise<void> {
  const userId = await currentUserId();
  const { error } = await supabase!.from("feedback").insert({
    user_id: userId,
    message_id: messageId,
    issue_type: issueType,
    notes: notes ?? null,
  });
  if (error) throw error;
}

export type JournalEntryResult = { id: string; date: string; synced: boolean };

export async function saveJournalEntry(
  entry: string,
  mood = "Thoughtful",
): Promise<JournalEntryResult> {
  const text = entry.trim();
  if (!text) throw new Error("A journal entry cannot be empty.");
  if (text.length > MAX_JOURNAL_ENTRY_LENGTH)
    throw new Error(`A journal entry must be ${MAX_JOURNAL_ENTRY_LENGTH} characters or fewer.`);
  const localEntry: LocalJournalEntry = {
    id: `local-${uniqueSuffix()}`,
    text,
    mood,
    date: localDateKey(),
  };
  const userId = await currentUserId().catch(() => null);
  const journalScope = userId ?? GUEST_JOURNAL_SCOPE;
  if (userId) {
    const { data, error } = await supabase!
      .from("journal_entries")
      .insert({ user_id: userId, entry: text, mood })
      .select("id, date")
      .single();
    if (!error) {
      await recordActivityDay(localEntry.date).catch(() => undefined);
      const row = data as { id?: unknown; date?: unknown };
      return {
        id: typeof row.id === "string" ? row.id : localEntry.id,
        date: typeof row.date === "string" ? row.date : localEntry.date,
        synced: true,
      };
    }
  }

  const previous = await readLocalJournal(journalScope);
  await writeLocalJournal(
    [localEntry, ...previous.filter((item) => item.id !== localEntry.id)],
    journalScope,
  );
  return { id: localEntry.id, date: localEntry.date, synced: false };
}

function uniqueSuffix(): string {
  const uuid = globalThis.crypto?.randomUUID?.();
  return uuid
    ? uuid.replace(/-/g, "")
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

let localJournalSyncInFlight: Promise<void> | null = null;

export function syncLocalJournalEntries(): Promise<void> {
  if (localJournalSyncInFlight) return localJournalSyncInFlight;
  localJournalSyncInFlight = syncLocalJournalEntriesInternal().finally(() => {
    localJournalSyncInFlight = null;
  });
  return localJournalSyncInFlight;
}

async function syncLocalJournalEntriesInternal(): Promise<void> {
  const userId = await currentUserId().catch(() => null);
  if (!userId) return;
  const scopedEntries = await Promise.all([
    readLocalJournal(GUEST_JOURNAL_SCOPE),
    readLocalJournal(userId),
  ]);
  const localEntries = [...scopedEntries[0], ...scopedEntries[1]];
  if (!localEntries.length) return;
  const handledIds = new Set(localEntries.map((item) => item.id));

  const dates = [...new Set(localEntries.map((item) => item.date).filter(Boolean))];
  const { data: existing, error: existingError } = await supabase!
    .from("journal_entries")
    .select("entry, mood, date")
    .eq("user_id", userId)
    .in("date", dates);
  if (existingError) throw existingError;
  const existingKeys = new Set(
    ((existing ?? []) as Array<{ entry: string; mood: string | null; date: string }>).map(
      (item) => `${item.date}\u0000${item.mood ?? ""}\u0000${item.entry}`,
    ),
  );
  const pending = localEntries.filter((item) => {
    const key = `${item.date}\u0000${item.mood}\u0000${item.text}`;
    if (existingKeys.has(key)) return false;
    existingKeys.add(key);
    return true;
  });
  if (pending.length) {
    const { error } = await supabase!.from("journal_entries").insert(
      pending.map((item) => ({
        user_id: userId,
        date: item.date,
        entry: item.text,
        mood: item.mood,
      })),
    );
    if (error) throw error;
    await Promise.all(
      [...new Set(pending.map((item) => item.date))].map((date) => recordActivityDay(date)),
    );
  }
  const remainingGuest = (await readLocalJournal(GUEST_JOURNAL_SCOPE)).filter(
    (item) => !handledIds.has(item.id),
  );
  const remainingAccount = (await readLocalJournal(userId)).filter(
    (item) => !handledIds.has(item.id),
  );
  if (remainingGuest.length) await writeLocalJournal(remainingGuest, GUEST_JOURNAL_SCOPE);
  else await clearLocalJournal(GUEST_JOURNAL_SCOPE);
  if (remainingAccount.length) await writeLocalJournal(remainingAccount, userId);
  else await clearLocalJournal(userId);
}

export async function deleteJournalEntry(entryId: string): Promise<void> {
  if (entryId.startsWith("local-")) {
    const userId = await currentUserId().catch(() => null);
    await removeLocalJournalEntry(entryId, [GUEST_JOURNAL_SCOPE, userId ?? "guest"]);
    return;
  }
  const userId = await currentUserId();
  const { error } = await supabase!
    .from("journal_entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function recordActivityDay(activityDate = localDateKey()): Promise<void> {
  const userId = await currentUserId();
  const { error } = await supabase!
    .from("activity_days")
    .upsert(
      { user_id: userId, activity_date: activityDate },
      { onConflict: "user_id,activity_date", ignoreDuplicates: true },
    );
  if (error) throw error;
}

export async function recordPracticeCompletion(
  practiceKey: string,
  completedOn = localDateKey(),
): Promise<void> {
  const userId = await currentUserId();
  const { error } = await supabase!
    .from("practice_completions")
    .upsert(
      { user_id: userId, practice_key: practiceKey, completed_on: completedOn },
      { onConflict: "user_id,practice_key,completed_on", ignoreDuplicates: true },
    );
  if (error) throw error;
  await recordActivityDay(completedOn);
}

export async function loadActivityDates(limit = 90): Promise<string[]> {
  const userId = await currentUserId();
  const { data, error } = await supabase!
    .from("activity_days")
    .select("activity_date")
    .eq("user_id", userId)
    .order("activity_date", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as Array<{ activity_date: string }>).map((row) => row.activity_date);
}

export async function loadPracticeCompletionKeys(limit = 90): Promise<string[]> {
  const userId = await currentUserId();
  const { data, error } = await supabase!
    .from("practice_completions")
    .select("practice_key")
    .eq("user_id", userId)
    .order("completed_on", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as Array<{ practice_key: string }>).map((row) => row.practice_key);
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  await configureDailyReminder(false, "08:00").catch(() => undefined);
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function deleteAccount(): Promise<void> {
  if (!supabase) throw new Error("Sandhya is not connected to Supabase.");
  await configureDailyReminder(false, "08:00").catch(() => undefined);
  const { data, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const accessToken = data.session?.access_token;
  const userId = data.session?.user.id;
  const baseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!accessToken || !baseUrl || !anonKey)
    throw new Error("Please sign in before deleting your account.");

  const response = await fetchWithTimeout(`${baseUrl}/functions/v1/account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ confirmation: "DELETE" }),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Account deletion failed.");
  }
  await clearLocalJournal().catch(() => undefined);
  if (userId) await clearLocalJournal(userId).catch(() => undefined);
  await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
}

/** Return a portable JSON copy of the authenticated user's account data. */
export async function exportAccountData(): Promise<string> {
  if (!supabase) throw new Error("Sandhya is not connected to Supabase.");
  const { data, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const accessToken = data.session?.access_token;
  const baseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!accessToken || !baseUrl || !anonKey)
    throw new Error("Please sign in before exporting your account data.");

  const response = await fetchWithTimeout(`${baseUrl}/functions/v1/account?format=json`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Account data export failed.");
  }
  const body = (await response.json()) as unknown;
  return JSON.stringify(body, null, 2);
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ACCOUNT_REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

// database.ts
//
// Hand-written row types for the Phase 2 schema. These mirror the SQL in
// supabase/migrations/20260601120000..20260601120300 and exist so other packages can import
// table shapes before `supabase gen types` has been run against a live
// project.
//
// When the dev project is provisioned, run:
//
//   pnpm dlx supabase gen types typescript \
//     --project-id <id> \
//     --schema public \
//     > packages/shared-types/src/generated-database.ts
//
// and switch downstream code to import from `generated-database` instead of
// this file. The shapes should match; this file is the contract until then.

export type Tradition =
  | "general"
  | "vaishnava"
  | "shaiva"
  | "shakta"
  | "smarta"
  | "advaita"
  | "vishishtadvaita"
  | "dvaita";

export type TextCategory =
  | "shruti"
  | "smriti"
  | "itihasa"
  | "purana"
  | "agama"
  | "modern_commentary";

export type Licence = "public_domain" | "licensed" | "original";

export type EmbeddingContentType = "translation" | "commentary" | "combined";

export type PracticeCategory = "puja" | "mantra" | "meditation" | "fasting" | "diya";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Plan = "free" | "plus_monthly" | "plus_annual" | "lifetime";

export type LanguagePref = "en" | "hi";

export type SavedItemType = "message" | "reflection" | "passage" | "practice" | "festival";

export type MessageRole = "user" | "assistant";

export type FeedbackIssueType = "incorrect" | "sectarian" | "insensitive" | "other";

export type FeedbackStatus = "pending" | "reviewed" | "fixed";

// ---------------------------------------------------------------------------
// Source content
// ---------------------------------------------------------------------------

export interface TextRow {
  id: string;
  slug: string;
  title: string;
  title_sanskrit: string | null;
  category: TextCategory;
  description: string | null;
  estimated_date: string | null;
  tradition_primary: Tradition;
  cover_image_url: string | null;
  created_at: string;
}

export interface PassageRow {
  id: string;
  text_id: string;
  section: string | null;
  sub_section: string | null;
  verse_number: string | null;
  order_index: number;
  original_text: string | null;
  transliteration: string | null;
  translation_en: string | null;
  translation_hi: string | null;
  word_meanings: Record<string, unknown> | null;
  created_at: string;
}

export interface CommentaryRow {
  id: string;
  passage_id: string;
  commentator: string;
  tradition: string | null;
  commentary_text: string;
  licence: Licence;
  source_url: string | null;
  created_at: string;
}

export interface PassageEmbeddingRow {
  id: string;
  passage_id: string;
  commentary_id: string | null;
  content_type: EmbeddingContentType;
  embedding: number[];
  embedding_model: string;
  chunk_text: string;
  tokens: number | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Curated content
// ---------------------------------------------------------------------------

export interface DailyReflectionRow {
  id: string;
  date_slot: number;
  title: string;
  shloka_passage_id: string | null;
  reflection_text: string;
  practice_prompt: string | null;
  journal_prompt: string | null;
  tradition: string;
  tags: string[];
  audio_url: string | null;
  is_premium: boolean;
  created_at: string;
}

export interface FestivalRow {
  id: string;
  slug: string;
  name: string;
  name_variants: string[];
  short_description: string | null;
  full_story: string | null;
  meaning: string | null;
  home_observance: string | null;
  regional_variations: Record<string, unknown> | null;
  traditions: string[];
  tithi_rule: string | null;
  upcoming_dates: string[];
  duration_days: number;
  image_url: string | null;
  is_premium: boolean;
  created_at: string;
}

export interface PracticeGuideStep {
  order: number;
  title: string;
  body: string;
}

export interface PracticeGuideRow {
  id: string;
  slug: string;
  title: string;
  category: PracticeCategory;
  difficulty: Difficulty;
  duration_minutes: number | null;
  steps: PracticeGuideStep[];
  materials_needed: string[];
  tradition_notes: string | null;
  warnings: string | null;
  audio_url: string | null;
  is_premium: boolean;
  created_at: string;
}

export interface ConceptRow {
  id: string;
  slug: string;
  term: string;
  term_sanskrit: string | null;
  short_definition: string | null;
  full_explanation: string | null;
  examples: string | null;
  related_concepts: string[];
  related_passages: string[];
  tradition_variations: Record<string, unknown> | null;
  created_at: string;
}

export interface DeityRow {
  id: string;
  slug: string;
  name: string;
  other_names: string[];
  short_description: string | null;
  full_description: string | null;
  associated_concepts: string[];
  associated_festivals: string[];
  traditions: string[];
  image_url: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// User-side
// ---------------------------------------------------------------------------

export interface ProfileRow {
  id: string;
  display_name: string | null;
  language_pref: LanguagePref;
  tradition_pref: string | null;
  location: string | null;
  notification_time: string | null;
  created_at: string;
}

export interface ConversationRow {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  structured_response: Record<string, unknown> | null;
  retrieved_passage_ids: string[];
  model_used: string | null;
  tokens_in: number | null;
  tokens_out: number | null;
  cost_usd: string | null;
  created_at: string;
}

export interface SavedItemRow {
  id: string;
  user_id: string;
  item_type: SavedItemType;
  item_id: string;
  notes: string | null;
  created_at: string;
}

export interface JournalEntryRow {
  id: string;
  user_id: string;
  date: string;
  prompt: string | null;
  entry: string;
  mood: string | null;
  created_at: string;
}

export interface FeedbackRow {
  id: string;
  user_id: string;
  message_id: string;
  issue_type: FeedbackIssueType;
  notes: string | null;
  status: FeedbackStatus;
  admin_notes: string | null;
  created_at: string;
}

export interface UsageQuotaRow {
  user_id: string;
  date: string;
  ai_messages_count: number;
  plan: Plan;
  updated_at: string;
}

export interface CachedAnswerRow {
  id: string;
  question_hash: string;
  question_text: string;
  structured_response: Record<string, unknown>;
  hit_count: number;
  last_used_at: string;
  created_at: string;
}

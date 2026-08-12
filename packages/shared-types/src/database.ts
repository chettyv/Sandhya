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

export type SavedItemType =
  | "message"
  | "reflection"
  | "passage"
  | "practice"
  | "festival"
  | "concept"
  | "deity"
  | "text";

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

export interface ContentSourceRow {
  id: string;
  source_key: string;
  title: string;
  language: string;
  translator: string | null;
  source_url: string | null;
  licence: Licence;
  copyright_status: string | null;
  can_store: boolean;
  can_show_excerpts: boolean;
  can_embed: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PassageEmbeddingRow {
  id: string;
  passage_id: string;
  commentary_id: string | null;
  source_document_id: string | null;
  content_type: EmbeddingContentType;
  embedding: number[];
  embedding_model: string;
  chunk_hash: string | null;
  chunk_text: string;
  tokens: number | null;
  metadata: Record<string, unknown>;
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
  timezone: string;
  created_at: string;
}

export interface DevicePushTokenRow {
  id: string;
  user_id: string;
  expo_push_token: string;
  platform: "ios" | "android" | "web";
  app_version: string | null;
  enabled: boolean;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionStatusRow {
  user_id: string;
  revenuecat_app_user_id: string;
  entitlement_id: string | null;
  product_id: string | null;
  plan: Plan;
  status: "active" | "billing_issue" | "cancelled" | "expired" | "refunded" | "free";
  environment: "PRODUCTION" | "SANDBOX" | "UNKNOWN";
  expires_at: string | null;
  latest_event_id: string | null;
  latest_event_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BillingEventRow {
  event_id: string;
  event_type: string;
  app_user_id: string | null;
  environment: string | null;
  received_at: string;
  processing_started_at: string | null;
  processing_token: string | null;
  processed_at: string | null;
  processing_error: string | null;
}

export interface NotificationDeliveryRow {
  id: string;
  user_id: string;
  delivery_date: string;
  kind: "daily_reflection";
  status: "claimed" | "sent";
  attempt_count: number;
  claimed_at: string | null;
  claim_token: string | null;
  sent_at: string | null;
  last_error: string | null;
  created_at: string;
}

export interface NotificationPushTicketRow {
  id: string;
  ticket_id: string;
  user_id: string;
  expo_push_token: string;
  delivery_date: string;
  kind: "daily_reflection";
  status: "pending" | "claimed" | "ok" | "error";
  attempt_count: number;
  claimed_at: string | null;
  claim_token: string | null;
  checked_at: string | null;
  last_error: string | null;
  created_at: string;
}

export interface BillingRuntimeConfigRow {
  id: true;
  allow_sandbox: boolean;
  updated_at: string;
}

export type CostLogPurpose = "classifier" | "main_answer" | "embedding" | "eval" | "judge";

export interface CostLogRow {
  id: string;
  user_id: string | null;
  purpose: CostLogPurpose;
  model: string;
  tokens_in: number;
  tokens_out: number;
  cost_usd: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface PracticeCompletionRow {
  id: string;
  user_id: string;
  practice_key: string;
  completed_on: string;
  created_at: string;
}

export interface ActivityDayRow {
  user_id: string;
  activity_date: string;
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
  question_text: string | null;
  structured_response: Record<string, unknown>;
  retrieved_passage_ids: string[];
  hit_count: number;
  last_used_at: string;
  expires_at: string | null;
  created_at: string;
}

export interface AiRequestWindowRow {
  user_id: string;
  window_started_at: string;
  request_count: number;
  updated_at: string;
}

export type ApiRequestOperation = "account_export" | "account_delete" | "push_token_mutation";

export interface ApiRequestWindowRow {
  user_id: string;
  operation: ApiRequestOperation;
  window_started_at: string;
  request_count: number;
  updated_at: string;
}

export interface AiBudgetReservationRow {
  id: string;
  user_id: string;
  reserved_usd: string;
  status: "reserved" | "released";
  expires_at: string;
  created_at: string;
}

export interface AdminAuditLogRow {
  id: string;
  admin_user_id: string | null;
  action:
    | "content_create"
    | "content_update"
    | "content_delete"
    | "feedback_update"
    | "cache_invalidate";
  resource: string;
  resource_id: string | null;
  resource_key: string | null;
  outcome: "pending" | "succeeded" | "failed";
  created_at: string;
  completed_at: string | null;
}

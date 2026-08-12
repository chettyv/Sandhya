#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const sharedTypes = readFileSync(
  join(root, "packages", "shared-types", "src", "database.ts"),
  "utf8",
);
const migrations = new Map(
  [
    "20260708120000_rag_rpc.sql",
    "20260806020000_saved_content_types.sql",
    "20260806081000_saved_deity_type.sql",
    "20260806120000_cached_answer_expiry.sql",
    "20260806170000_notification_delivery_claims.sql",
    "20260806190000_ai_budget_reservations.sql",
    "20260806210000_billing_event_retry_claims.sql",
    "20260806220000_notification_push_receipts.sql",
    "20260806230000_cached_answer_rights.sql",
    "20260807000000_feedback_write_guard.sql",
    "20260807010000_cached_answer_rights_all_sources.sql",
    "20260807020000_embedding_model_filter.sql",
    "20260807030000_cached_answer_model_filter.sql",
    "20260807040000_feedback_admin_notes_private.sql",
    "20260807060000_rls_update_owner_guards.sql",
    "20260807070000_push_token_owner_guard.sql",
    "20260807090000_billing_event_claim_lease.sql",
    "20260807100000_billing_event_lease_fencing.sql",
    "20260807110000_notification_delivery_lease_fencing.sql",
    "20260807120000_notification_push_receipt_lease_fencing.sql",
    "20260807140000_authenticated_endpoint_rate_limits.sql",
    "20260807150000_notification_recipient_batching.sql",
    "20260807160000_admin_audit_log.sql",
    "20260812010000_billing_deleted_user_event_claim_guard.sql",
    "20260812020000_global_ai_budget_guard.sql",
  ].map((file) => [file, readFileSync(join(root, "supabase", "migrations", file), "utf8")]),
);

for (const [interfaceName, fields] of Object.entries({
  ContentSourceRow: ["source_key", "can_store", "can_show_excerpts", "can_embed"],
  PassageEmbeddingRow: ["source_document_id", "chunk_hash", "metadata"],
  BillingEventRow: [
    "processing_started_at",
    "processing_token",
    "processed_at",
    "processing_error",
  ],
  NotificationDeliveryRow: [
    "status",
    "attempt_count",
    "claimed_at",
    "claim_token",
    "sent_at",
    "last_error",
  ],
  NotificationPushTicketRow: [
    "ticket_id",
    "expo_push_token",
    "status",
    "attempt_count",
    "claim_token",
    "checked_at",
    "last_error",
  ],
  CachedAnswerRow: ["retrieved_passage_ids", "expires_at"],
  AiBudgetReservationRow: ["reserved_usd", "status", "expires_at"],
  ApiRequestWindowRow: ["operation", "window_started_at", "request_count"],
  AdminAuditLogRow: ["admin_user_id", "resource_id", "resource_key", "outcome", "completed_at"],
})) {
  const body = interfaceBody(sharedTypes, interfaceName);
  for (const field of fields) {
    assertContains(body, new RegExp(`\\b${escapeRegExp(field)}\\s*:`), `${interfaceName}.${field}`);
  }
}

assertContains(
  sharedTypes,
  /\| "concept"[\s\S]*\| "deity"[\s\S]*\| "text"/,
  "SavedItemType catalog values",
);

assertMigration("20260708120000_rag_rpc.sql", /add column if not exists source_document_id/);
assertMigration("20260708120000_rag_rpc.sql", /add column if not exists chunk_hash/);
assertMigration("20260708120000_rag_rpc.sql", /add column if not exists metadata/);
assertMigration("20260708120000_rag_rpc.sql", /add column if not exists retrieved_passage_ids/);
assertMigration("20260806120000_cached_answer_expiry.sql", /add column if not exists expires_at/);
for (const field of ["status", "attempt_count", "claimed_at", "sent_at", "last_error"]) {
  assertMigration(
    "20260806170000_notification_delivery_claims.sql",
    new RegExp(`add column if not exists ${field}`),
  );
}
assertMigration("20260806190000_ai_budget_reservations.sql", /reserved_usd/);
assertMigration(
  "20260812020000_global_ai_budget_guard.sql",
  /project-wide[\s\S]*pg_advisory_xact_lock\(hashtext\('sandhya_ai_budget'\)\)[\s\S]*from public\.messages m[\s\S]*from public\.cost_log l[\s\S]*from public\.ai_budget_reservations r/i,
);
assertMigration(
  "20260806210000_billing_event_retry_claims.sql",
  /add column if not exists processing_started_at/,
);
for (const functionName of [
  "record_notification_push_ticket",
  "claim_notification_push_tickets",
  "record_notification_push_receipt",
  "release_notification_push_ticket",
]) {
  assertMigration(
    "20260806220000_notification_push_receipts.sql",
    new RegExp(`create or replace function public\\.${functionName}`),
  );
}
assertMigration(
  "20260806230000_cached_answer_rights.sql",
  /create or replace function public\.cached_answer_sources_are_allowed/,
);
assertMigration(
  "20260812010000_billing_deleted_user_event_claim_guard.sql",
  /Normal[\s\S]*lifecycle events[\s\S]*missing UUID account[\s\S]*terminal no-ops/i,
);
assertMigration(
  "20260807000000_feedback_write_guard.sql",
  /status\s*=\s*'pending'[\s\S]*admin_notes\s+is\s+null/,
);
assertMigration(
  "20260807010000_cached_answer_rights_all_sources.sql",
  /not exists[\s\S]*cs\.can_embed is not true[\s\S]*c\.licence <> all/,
);
assertMigration(
  "20260807020000_embedding_model_filter.sql",
  /embedding_model text default 'text-embedding-3-small'[\s\S]*pe\.embedding_model = \$10/,
);
assertMigration(
  "20260807030000_cached_answer_model_filter.sql",
  /p_embedding_model text default 'text-embedding-3-small'[\s\S]*pe\.embedding_model = p_embedding_model/,
);
assertMigration(
  "20260807040000_feedback_admin_notes_private.sql",
  /drop policy if exists "users read own feedback" on public\.feedback/,
);
assertMigration(
  "20260807060000_rls_update_owner_guards.sql",
  /with check \(auth\.uid\(\) = user_id\)/,
);
assertMigration(
  "20260807070000_push_token_owner_guard.sql",
  /where public\.device_push_tokens\.user_id = p_user_id/,
);
assertMigration(
  "20260807090000_billing_event_claim_lease.sql",
  /returns table \(claimed boolean, already_processed boolean\)[\s\S]*processing_started_at < now\(\) - interval '10 minutes'/,
);
assertMigration(
  "20260807100000_billing_event_lease_fencing.sql",
  /add column if not exists processing_token uuid[\s\S]*create or replace function public\.complete_billing_event[\s\S]*p_processing_token uuid/,
);
assertMigration(
  "20260807110000_notification_delivery_lease_fencing.sql",
  /add column if not exists claim_token uuid[\s\S]*create function public\.claim_notification_delivery_fenced[\s\S]*returns table \(claimed boolean, claim_token uuid\)[\s\S]*create function public\.record_notification_delivery_fenced[\s\S]*claim_token = p_claim_token/,
);
assertMigration(
  "20260807110000_notification_delivery_lease_fencing.sql",
  /revoke all on function public\.claim_notification_delivery\(uuid, date, text\) from service_role/,
);
assertMigration(
  "20260807120000_notification_push_receipt_lease_fencing.sql",
  /add column if not exists claim_token uuid[\s\S]*create function public\.claim_notification_push_tickets_fenced[\s\S]*claim_token uuid[\s\S]*create function public\.record_notification_push_receipt_fenced[\s\S]*claim_token = p_claim_token[\s\S]*create function public\.release_notification_push_ticket_fenced/,
);
assertMigration(
  "20260807120000_notification_push_receipt_lease_fencing.sql",
  /revoke all on function public\.claim_notification_push_tickets\(timestamptz, integer\) from service_role/,
);
assertMigration(
  "20260807140000_authenticated_endpoint_rate_limits.sql",
  /create table if not exists public\.api_request_windows[\s\S]*consume_api_request_rate_limit[\s\S]*revoke all on function public\.consume_api_request_rate_limit\(uuid, text, integer, integer\)/,
);
assertMigration(
  "20260807150000_notification_recipient_batching.sql",
  /drop function if exists public\.get_due_daily_reflection_recipients\(timestamptz\)[\s\S]*create function public\.get_due_daily_reflection_recipients\([\s\S]*p_limit integer default 500[\s\S]*due_users[\s\S]*limit greatest\(1, least\(coalesce\(p_limit, 500\), 1000\)\)[\s\S]*order by l\.user_id, t\.expo_push_token/,
);
assertMigration(
  "20260807160000_admin_audit_log.sql",
  /create table if not exists public\.admin_audit_log[\s\S]*outcome\s+text[\s\S]*start_admin_audit_event[\s\S]*complete_admin_audit_event[\s\S]*revoke all on function public\.start_admin_audit_event[\s\S]*grant execute on function public\.start_admin_audit_event[\s\S]*grant execute on function public\.complete_admin_audit_event/,
);
for (const file of [
  "20260806020000_saved_content_types.sql",
  "20260806081000_saved_deity_type.sql",
]) {
  assertMigration(file, /saved_items_item_type_check/);
}

console.log("Database/type contract invariants passed.");

function interfaceBody(source, name) {
  const match = source.match(
    new RegExp(`export interface ${escapeRegExp(name)} \\{([\\s\\S]*?)\\n\\}`),
  );
  if (!match) fail(`Missing shared interface: ${name}`);
  return match[1];
}

function assertMigration(file, pattern) {
  assertContains(migrations.get(file) ?? "", pattern, `${file} is missing ${pattern}`);
}

function assertContains(value, pattern, label) {
  if (!pattern.test(value)) fail(`Database contract is missing ${label}.`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

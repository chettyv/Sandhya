#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const isWindows = process.platform === "win32";
const sourceOnly = process.argv.includes("--source-only");
const tsc = join(root, "node_modules", ".bin", isWindows ? "tsc.CMD" : "tsc");
const vitest = join(root, "node_modules", ".bin", isWindows ? "vitest.CMD" : "vitest");

if (!sourceOnly && (!existsSync(tsc) || !existsSync(vitest))) {
  fail("Missing local node_modules binaries. Run pnpm install first.");
}

if (!sourceOnly) {
  run(tsc, ["-p", "packages/shared-types/tsconfig.json", "--noEmit"]);
  run(tsc, ["-p", "packages/rag-pipeline/tsconfig.json", "--noEmit"]);
  run(vitest, ["run", "--passWithNoTests", "--pool=threads", "--maxWorkers=1", "--minWorkers=1"], {
    cwd: join(root, "packages", "rag-pipeline"),
  });
  run(tsc, [
    "--noEmit",
    "--target",
    "es2022",
    "--module",
    "esnext",
    "--moduleResolution",
    "Bundler",
    "--allowImportingTsExtensions",
    "--lib",
    "es2022,dom",
    "--strict",
    "--skipLibCheck",
    "supabase/functions/deno-shim.d.ts",
    "supabase/functions/deno-modules.d.ts",
    "supabase/functions/_shared/observability.ts",
    "supabase/functions/ask/index.ts",
    "supabase/functions/account/index.ts",
    "supabase/functions/register-push-token/index.ts",
    "supabase/functions/revenuecat-webhook/index.ts",
    "supabase/functions/send-daily-reflections/index.ts",
    "supabase/functions/admin-feedback/index.ts",
    "supabase/functions/admin-content/index.ts",
    "supabase/functions/admin-ops/index.ts",
  ]);
}
checkBackendInvariants();

console.log(
  sourceOnly ? "RAG backend source invariants passed." : "RAG backend verification passed.",
);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: isWindows,
    ...options,
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function checkBackendInvariants() {
  const migration = readFileSync(
    join(root, "supabase", "migrations", "20260708120000_rag_rpc.sql"),
    "utf8",
  );
  const accountMigration = readFileSync(
    join(root, "supabase", "migrations", "20260805210000_account_billing_notifications.sql"),
    "utf8",
  );
  const billingRetryMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806050000_billing_event_retry_safety.sql"),
    "utf8",
  );
  const billingRetryClaimsMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806210000_billing_event_retry_claims.sql"),
    "utf8",
  );
  const billingTransferMigration = readFileSync(
    join(root, "supabase", "migrations", "20260807050000_billing_transfer_reconciliation.sql"),
    "utf8",
  );
  const billingTransferDestinationGuardMigration = readFileSync(
    join(root, "supabase", "migrations", "20260807130000_billing_transfer_destination_guard.sql"),
    "utf8",
  );
  const billingClaimLeaseMigration = readFileSync(
    join(root, "supabase", "migrations", "20260807090000_billing_event_claim_lease.sql"),
    "utf8",
  );
  const billingLeaseFencingMigration = readFileSync(
    join(root, "supabase", "migrations", "20260807100000_billing_event_lease_fencing.sql"),
    "utf8",
  );
  const notificationLeaseFencingMigration = readFileSync(
    join(root, "supabase", "migrations", "20260807110000_notification_delivery_lease_fencing.sql"),
    "utf8",
  );
  const notificationReceiptLeaseFencingMigration = readFileSync(
    join(
      root,
      "supabase",
      "migrations",
      "20260807120000_notification_push_receipt_lease_fencing.sql",
    ),
    "utf8",
  );
  const ownerRlsMigration = readFileSync(
    join(root, "supabase", "migrations", "20260807060000_rls_update_owner_guards.sql"),
    "utf8",
  );
  const pushTokenOwnerMigration = readFileSync(
    join(root, "supabase", "migrations", "20260807070000_push_token_owner_guard.sql"),
    "utf8",
  );
  const endpointRateLimitMigration = readFileSync(
    join(root, "supabase", "migrations", "20260807140000_authenticated_endpoint_rate_limits.sql"),
    "utf8",
  );
  const notificationBatchMigration = readFileSync(
    join(root, "supabase", "migrations", "20260807150000_notification_recipient_batching.sql"),
    "utf8",
  );
  const billingDeletedUserMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806180000_billing_deleted_user_guard.sql"),
    "utf8",
  );
  const ragRightsMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806060000_rag_rights_fail_closed.sql"),
    "utf8",
  );
  const allSourceRightsMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806160000_rag_rights_require_all_sources.sql"),
    "utf8",
  );
  const billingEnvironmentMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806070000_billing_environment_config.sql"),
    "utf8",
  );
  const notificationWindowMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806080000_notification_delivery_window.sql"),
    "utf8",
  );
  const notificationClaimMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806170000_notification_delivery_claims.sql"),
    "utf8",
  );
  const notificationReceiptMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806220000_notification_push_receipts.sql"),
    "utf8",
  );
  const sourceRightsMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806090000_source_rights_metadata_guard.sql"),
    "utf8",
  );
  const ragResponseLimitMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806100000_rag_response_note_limit.sql"),
    "utf8",
  );
  const userInputGuardMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806110000_user_input_size_guards.sql"),
    "utf8",
  );
  const cacheExpiryMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806120000_cached_answer_expiry.sql"),
    "utf8",
  );
  const costLogMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806130000_ai_cost_log.sql"),
    "utf8",
  );
  const monthlyBudgetMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806150000_monthly_budget_includes_embeddings.sql"),
    "utf8",
  );
  const budgetReservationMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806190000_ai_budget_reservations.sql"),
    "utf8",
  );
  const globalBudgetMigration = readFileSync(
    join(root, "supabase", "migrations", "20260812020000_global_ai_budget_guard.sql"),
    "utf8",
  );
  const cachedAnswerRightsMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806230000_cached_answer_rights.sql"),
    "utf8",
  );
  const cachedAnswerAllSourcesMigration = readFileSync(
    join(root, "supabase", "migrations", "20260807010000_cached_answer_rights_all_sources.sql"),
    "utf8",
  );
  const embeddingModelMigration = readFileSync(
    join(root, "supabase", "migrations", "20260807020000_embedding_model_filter.sql"),
    "utf8",
  );
  const cachedAnswerModelMigration = readFileSync(
    join(root, "supabase", "migrations", "20260807030000_cached_answer_model_filter.sql"),
    "utf8",
  );
  const feedbackWriteGuardMigration = readFileSync(
    join(root, "supabase", "migrations", "20260807000000_feedback_write_guard.sql"),
    "utf8",
  );
  const feedbackPrivacyMigration = readFileSync(
    join(root, "supabase", "migrations", "20260807040000_feedback_admin_notes_private.sql"),
    "utf8",
  );
  const askFunction = readFileSync(join(root, "supabase", "functions", "ask", "index.ts"), "utf8");
  const accountFunction = readFileSync(
    join(root, "supabase", "functions", "account", "index.ts"),
    "utf8",
  );
  const pushFunction = readFileSync(
    join(root, "supabase", "functions", "register-push-token", "index.ts"),
    "utf8",
  );
  const billingFunction = readFileSync(
    join(root, "supabase", "functions", "revenuecat-webhook", "index.ts"),
    "utf8",
  );
  const sharedHttp = readFileSync(
    join(root, "supabase", "functions", "_shared", "http.ts"),
    "utf8",
  );
  const notificationFunction = readFileSync(
    join(root, "supabase", "functions", "send-daily-reflections", "index.ts"),
    "utf8",
  );
  const adminFunction = readFileSync(
    join(root, "supabase", "functions", "admin-feedback", "index.ts"),
    "utf8",
  );
  const adminContentFunction = readFileSync(
    join(root, "supabase", "functions", "admin-content", "index.ts"),
    "utf8",
  );
  const adminOpsFunction = readFileSync(
    join(root, "supabase", "functions", "admin-ops", "index.ts"),
    "utf8",
  );
  const adminAudit = readFileSync(
    join(root, "supabase", "functions", "_shared", "admin-audit.ts"),
    "utf8",
  );
  const observability = readFileSync(
    join(root, "supabase", "functions", "_shared", "observability.ts"),
    "utf8",
  );
  const classifier = readFileSync(
    join(root, "supabase", "functions", "_shared", "classifier.ts"),
    "utf8",
  );
  const ragClassifier = readFileSync(
    join(root, "packages", "rag-pipeline", "src", "classifier.ts"),
    "utf8",
  );
  const supabaseConfig = readFileSync(join(root, "supabase", "config.toml"), "utf8");
  const mobileTelemetry = readFileSync(
    join(root, "apps", "mobile", "src", "lib", "telemetry.ts"),
    "utf8",
  );
  const mobileSettings = readFileSync(join(root, "apps", "mobile", "app", "settings.tsx"), "utf8");
  const mobileAsk = readFileSync(
    join(root, "apps", "mobile", "src", "lib", "askDharma.ts"),
    "utf8",
  );
  const mobileContentTypes = readFileSync(
    join(root, "apps", "mobile", "src", "types", "content.ts"),
    "utf8",
  );
  const ragIndex = readFileSync(join(root, "packages", "rag-pipeline", "src", "index.ts"), "utf8");
  const ragHashTest = readFileSync(
    join(root, "packages", "rag-pipeline", "src", "hash.test.ts"),
    "utf8",
  );
  const ragProviders = readFileSync(
    join(root, "packages", "rag-pipeline", "src", "providers.ts"),
    "utf8",
  );
  const supabaseRest = readFileSync(
    join(root, "packages", "rag-pipeline", "src", "supabase-rest.ts"),
    "utf8",
  );
  const supabaseRestTest = readFileSync(
    join(root, "packages", "rag-pipeline", "src", "supabase-rest.test.ts"),
    "utf8",
  );
  const ragCli = readFileSync(join(root, "packages", "rag-pipeline", "src", "cli.ts"), "utf8");
  const ragEvaluate = readFileSync(
    join(root, "packages", "rag-pipeline", "src", "evaluate.ts"),
    "utf8",
  );
  const ragCommand = readFileSync(join(root, "scripts", "rag-cli.mjs"), "utf8");
  const contentCommand = readFileSync(join(root, "scripts", "content-cli.mjs"), "utf8");
  const ingestPrepared = readFileSync(
    join(root, "packages", "rag-pipeline", "src", "ingest-prepared.ts"),
    "utf8",
  );
  const sourceRights = readFileSync(
    join(root, "packages", "rag-pipeline", "src", "source-rights.ts"),
    "utf8",
  );
  const prepareCorpus = readFileSync(
    join(root, "packages", "rag-pipeline", "src", "prepare-corpus.ts"),
    "utf8",
  );
  const auditPrepared = readFileSync(
    join(root, "packages", "rag-pipeline", "src", "audit-prepared.ts"),
    "utf8",
  );
  const tokenCount = readFileSync(
    join(root, "packages", "rag-pipeline", "src", "token-count.ts"),
    "utf8",
  );
  const ragPackage = readFileSync(join(root, "packages", "rag-pipeline", "package.json"), "utf8");
  const rootPackage = readFileSync(join(root, "package.json"), "utf8");
  const contentTools = readFileSync(
    join(root, "packages", "content-tools", "src", "index.ts"),
    "utf8",
  );
  const contentToolsCli = readFileSync(
    join(root, "packages", "content-tools", "src", "cli.ts"),
    "utf8",
  );
  const ragDoctor = readFileSync(join(root, "scripts", "rag-doctor.mjs"), "utf8");
  const preparedCorpusSourceAudit = readFileSync(
    join(root, "scripts", "audit-prepared-corpus-source.mjs"),
    "utf8",
  );
  const ragLiveSmoke = readFileSync(join(root, "scripts", "rag-live-smoke.mjs"), "utf8");
  const accountLiveSmoke = readFileSync(join(root, "scripts", "account-live-smoke.mjs"), "utf8");
  const evalFile = readFileSync(
    join(root, "content", "_staging", "evals", "rag-eval.example.jsonl"),
    "utf8",
  );

  assertContains(observability, "export async function reportBackendError");
  assertContains(observability, "SENTRY_DSN_BACKEND");
  assertContains(observability, "POSTHOG_API_KEY");
  assertContains(observability, "No prompts, answers, request bodies, or user IDs.");
  assertContains(classifier, "export function classifyQuestion");
  assertContains(classifier, '"personal_reflection"');
  assertContains(classifier, "traditionSignals");
  assertContains(observability, 'url.protocol !== "https:"');
  assertNotContains(observability, "request.body");
  assertNotContains(observability, "error.message");
  assertContains(mobileTelemetry, "export function track");
  assertContains(mobileTelemetry, "export function captureMobileError");
  assertContains(mobileTelemetry, "EXPO_PUBLIC_POSTHOG_KEY");
  assertContains(mobileTelemetry, "EXPO_PUBLIC_SENTRY_DSN");
  assertContains(mobileTelemetry, "function isSensitiveKey");
  assertContains(mobileTelemetry, "TELEMETRY_CONSENT_KEY");
  assertContains(mobileTelemetry, "export async function setTelemetryConsent");
  assertContains(mobileSettings, "Anonymous diagnostics");
  assertContains(mobileSettings, "getTelemetryConsent");
  assertContains(mobileSettings, "setTelemetryConsent");
  assertContains(mobileAsk, 'track("ask_submitted")');
  assertContains(mobileAsk, 'track("ask_succeeded"');
  assertContains(mobileAsk, "stream: true");
  assertContains(mobileAsk, "text/event-stream");
  assertContains(mobileAsk, 'parsed.type === "text"');
  assertContains(mobileAsk, "function isStructuredAnswer");
  assertContains(mobileAsk, ".passage_id");
  assertContains(mobileContentTypes, "passage_id: string;");
  for (const [name, source] of [
    ["ask", askFunction],
    ["account", accountFunction],
    ["register-push-token", pushFunction],
    ["revenuecat-webhook", billingFunction],
    ["send-daily-reflections", notificationFunction],
    ["admin-feedback", adminFunction],
    ["admin-content", adminContentFunction],
    ["admin-ops", adminOpsFunction],
  ]) {
    assertContains(source, "reportBackendError");
    assertContains(source, `functionName: "${name}"`);
    assertNotContains(source, "console.error(error)");
    assertContains(source, '"cache-control": "no-store, private"');
    assertContains(source, 'pragma: "no-cache"');
  }
  for (const source of [adminFunction, adminContentFunction, adminOpsFunction]) {
    assertContains(source, "fetchWithTimeout");
    assertNotContains(source, "await fetch(");
  }
  assertContains(askFunction, "fetchWithRetry");
  assertContains(adminAudit, "startAdminAuditEvent");
  assertContains(adminAudit, "completeAdminAuditEvent");
  assertContains(adminAudit, "completeAdminAuditEventBestEffort");
  assertContains(adminAudit, "AdminAuditOutcome");
  for (const [name, source] of [
    ["admin-feedback", adminFunction],
    ["admin-content", adminContentFunction],
    ["admin-ops", adminOpsFunction],
  ]) {
    assertContains(source, "startAdminAuditEvent", `${name} audit start`);
    assertContains(source, "completeAdminAuditEvent", `${name} audit completion`);
    assertContains(
      source,
      "completeAdminAuditEventBestEffort",
      `${name} best-effort audit recovery`,
    );
    assertContains(source, "completeAuditAsFailed", `${name} failed audit completion`);
  }
  assertContains(adminOpsFunction, 'resource === "audit"');
  assertNotContains(adminAudit, "question");
  assertNotContains(adminAudit, "answer");
  assertNotContains(adminAudit, "payload");

  assertContains(migration, "alter table public.content_sources enable row level security");
  assertContains(accountMigration, "create table if not exists public.device_push_tokens");
  assertContains(accountMigration, "create table if not exists public.subscription_status");
  assertContains(accountMigration, "create table if not exists public.billing_events");
  const activityMigration = readFileSync(
    join(root, "supabase", "migrations", "20260805220000_activity_history.sql"),
    "utf8",
  );
  const activityIntegrityMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806235000_activity_integrity.sql"),
    "utf8",
  );
  const sourceExcerptMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806010000_source_excerpt_rls.sql"),
    "utf8",
  );
  assertContains(activityMigration, "create table if not exists public.practice_completions");
  assertContains(activityMigration, "create table if not exists public.activity_days");
  assertContains(
    activityMigration,
    "alter table public.practice_completions enable row level security",
  );
  assertContains(activityMigration, "alter table public.activity_days enable row level security");
  assertContains(activityMigration, "users insert own practice completions");
  assertContains(activityMigration, "users insert own activity days");
  assertContains(activityIntegrityMigration, "validate_activity_history_date");
  assertContains(
    activityIntegrityMigration,
    "completed_on cannot be more than one day in the future",
  );
  assertContains(
    activityIntegrityMigration,
    "activity_date cannot be more than one day in the future",
  );
  assertContains(
    activityIntegrityMigration,
    "journal entry date cannot be more than one day in the future",
  );
  assertContains(activityIntegrityMigration, "record_activity_for_user_action");
  assertContains(activityIntegrityMigration, "record_journal_activity");
  assertContains(activityIntegrityMigration, "record_practice_activity");
  assertContains(activityIntegrityMigration, "validate_journal_entry_date");
  assertContains(sourceExcerptMigration, "authenticated read rights-cleared passages");
  assertContains(sourceExcerptMigration, "authenticated read rights-cleared commentaries");
  assertContains(sourceExcerptMigration, "cs.can_store = true");
  assertContains(sourceExcerptMigration, "cs.can_show_excerpts = true");
  assertContains(sourceExcerptMigration, "public.has_plus_access()");
  const sourceExcerptHelpersMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806040000_source_excerpt_policy_helpers.sql"),
    "utf8",
  );
  assertContains(
    sourceExcerptHelpersMigration,
    "create or replace function public.can_read_passage",
  );
  assertContains(
    sourceExcerptHelpersMigration,
    "create or replace function public.can_read_commentary",
  );
  assertContains(sourceExcerptHelpersMigration, "security definer");
  assertContains(sourceExcerptHelpersMigration, "using (public.can_read_passage(id))");
  assertContains(sourceExcerptHelpersMigration, "coalesce(cs.can_store, false) = true");
  assertContains(sourceExcerptHelpersMigration, "coalesce(cs.can_show_excerpts, false) = true");
  const savedContentMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806020000_saved_content_types.sql"),
    "utf8",
  );
  assertContains(savedContentMigration, "'concept', 'text'");
  const entitlementGuardMigration = readFileSync(
    join(root, "supabase", "migrations", "20260806030000_entitlement_quota_guard.sql"),
    "utf8",
  );
  assertContains(
    entitlementGuardMigration,
    "create or replace function public.user_has_plus_access",
  );
  assertContains(entitlementGuardMigration, "not public.user_has_plus_access(p_user_id)");
  assertContains(entitlementGuardMigration, "set plan = 'free'");
  assertContains(entitlementGuardMigration, "s.environment = 'PRODUCTION'");
  assertContains(
    accountMigration,
    "create or replace function public.get_due_daily_reflection_recipients",
  );
  assertContains(
    accountMigration,
    "create or replace function public.record_notification_delivery",
  );
  assertContains(accountMigration, "create or replace function public.claim_billing_event");
  assertContains(accountMigration, "create or replace function public.apply_subscription_event");
  assertContains(accountMigration, "latest_event_at >= public.subscription_status.latest_event_at");
  assertContains(billingRetryMigration, "create or replace function public.claim_billing_event");
  assertContains(
    billingRetryMigration,
    "event_row.event_id is not null and event_row.processed_at is null",
  );
  assertContains(billingRetryClaimsMigration, "processing_started_at");
  assertContains(billingRetryClaimsMigration, "processed_at is null");
  assertContains(billingRetryClaimsMigration, "interval '10 minutes'");
  assertContains(
    billingClaimLeaseMigration,
    "returns table (claimed boolean, already_processed boolean)",
  );
  assertContains(
    billingClaimLeaseMigration,
    "processing_started_at < now() - interval '10 minutes'",
  );
  assertContains(billingLeaseFencingMigration, "add column if not exists processing_token uuid");
  assertContains(
    billingLeaseFencingMigration,
    "create or replace function public.complete_billing_event",
  );
  assertContains(billingLeaseFencingMigration, "processing_token = p_processing_token");
  assertContains(notificationLeaseFencingMigration, "add column if not exists claim_token uuid");
  assertContains(
    notificationLeaseFencingMigration,
    "create function public.claim_notification_delivery_fenced",
  );
  assertContains(
    notificationLeaseFencingMigration,
    "create function public.record_notification_delivery_fenced",
  );
  assertContains(
    notificationLeaseFencingMigration,
    "create function public.release_notification_delivery_fenced",
  );
  assertContains(
    notificationLeaseFencingMigration,
    "returns table (claimed boolean, claim_token uuid)",
  );
  assertContains(notificationLeaseFencingMigration, "claim_token = p_claim_token");
  assertContains(
    notificationLeaseFencingMigration,
    "revoke all on function public.claim_notification_delivery(uuid, date, text) from service_role",
  );
  assertContains(
    notificationLeaseFencingMigration,
    "revoke all on function public.record_notification_delivery(uuid, date, text) from service_role",
  );
  assertContains(
    notificationReceiptLeaseFencingMigration,
    "add column if not exists claim_token uuid",
  );
  assertContains(
    notificationReceiptLeaseFencingMigration,
    "create function public.claim_notification_push_tickets_fenced",
  );
  assertContains(
    notificationReceiptLeaseFencingMigration,
    "create function public.record_notification_push_receipt_fenced",
  );
  assertContains(
    notificationReceiptLeaseFencingMigration,
    "create function public.release_notification_push_ticket_fenced",
  );
  assertContains(notificationReceiptLeaseFencingMigration, "claim_token = p_claim_token");
  assertContains(
    notificationReceiptLeaseFencingMigration,
    "revoke all on function public.claim_notification_push_tickets(timestamptz, integer) from service_role",
  );
  assertContains(
    notificationReceiptLeaseFencingMigration,
    "revoke all on function public.record_notification_push_receipt(uuid, text, text) from service_role",
  );
  assertContains(billingFunction, "already_processed");
  assertContains(billingFunction, "billing_event_in_progress");
  assertContains(billingFunction, '"retry-after": "10"');
  assertContains(billingFunction, "releaseBillingEvent");
  assertContains(
    accountMigration,
    "alter table public.device_push_tokens enable row level security",
  );
  assertContains(
    accountMigration,
    "alter table public.subscription_status enable row level security",
  );
  assertContains(accountFunction, "DELETE_CONFIRMATION");
  assertContains(accountFunction, "MAX_REQUEST_BODY_CHARS");
  assertContains(accountFunction, 'code: "request_too_large"');
  assertContains(accountFunction, "/auth/v1/admin/users/");
  assertContains(accountFunction, "deleteBillingEvents");
  assertContains(accountFunction, "deleteCostLog");
  assertContains(accountFunction, "exportAccountData");
  assertContains(accountFunction, "MAX_EXPORT_ROWS_PER_COLLECTION");
  assertContains(accountFunction, "consume_api_request_rate_limit");
  assertContains(accountFunction, '"account_export"');
  assertContains(accountFunction, '"account_delete"');
  assertContains(accountFunction, "3_600");
  assertContains(accountFunction, 'code: "rate_limited"');
  assertContains(pushFunction, "TOKEN_PATTERN");
  assertContains(pushFunction, "MAX_REQUEST_BODY_CHARS");
  assertContains(pushFunction, "user_id: user.id");
  assertContains(pushFunction, "consume_api_request_rate_limit");
  assertContains(pushFunction, '"push_token_mutation"');
  assertContains(pushFunction, "60,");
  assertContains(pushFunction, 'code: "rate_limited"');
  assertContains(billingFunction, "x-revenuecat-webhook-signature");
  assertContains(billingFunction, "MAX_REQUEST_BODY_CHARS");
  assertContains(billingFunction, "WebhookAuthenticationError");
  assertContains(billingFunction, 'code: "unauthorized"');
  assertContains(billingFunction, "crypto.subtle.verify");
  assertContains(billingFunction, '"REFUND_REVERSED"');
  assertContains(billingFunction, '"SUBSCRIPTION_PAUSED"');
  assertContains(billingFunction, '"TEMPORARY_ENTITLEMENT_GRANT"');
  assertContains(billingFunction, '"TRANSFER"');
  assertContains(billingFunction, "parseTransferUserIds");
  assertContains(billingFunction, "transferredTo.length !== 1");
  assertContains(billingFunction, "if (!appUserId) appUserId = `supabase:${userId}`");
  assertContains(billingFunction, "loadRevenueCatSubscriberState");
  assertContains(billingFunction, "REVENUECAT_API_KEY");
  assertContains(billingFunction, "/rpc/apply_subscription_transfer");
  assertContains(
    billingTransferMigration,
    "create or replace function public.apply_subscription_transfer",
  );
  assertContains(billingTransferMigration, "from public.profiles p");
  assertContains(billingTransferMigration, "where p.id = p_destination_user_id");
  assertContains(billingTransferMigration, "set plan = 'free'");
  assertContains(billingTransferMigration, "p_source_user_ids");
  assertContains(
    billingTransferDestinationGuardMigration,
    "Transfer destination is not a registered Sandhya user.",
  );
  assertContains(
    billingTransferDestinationGuardMigration,
    "if not exists (\n    select 1 from public.profiles where id = p_destination_user_id\n  )",
  );
  for (const [table, ownerColumn] of [
    ["profiles", "id"],
    ["conversations", "user_id"],
    ["saved_items", "user_id"],
    ["journal_entries", "user_id"],
    ["device_push_tokens", "user_id"],
  ]) {
    assertContains(ownerRlsMigration, `on public.${table} for update`);
    assertContains(ownerRlsMigration, `with check (auth.uid() = ${ownerColumn})`);
  }
  assertContains(billingFunction, "temporary_entitlement_grant_requires_followup_event");
  assertContains(billingFunction, "claimBillingEvent(env");
  assertContains(
    billingFunction,
    "markBillingEventProcessed(env, event.id, claim.processingToken)",
  );
  assertContains(billingFunction, "processingToken");
  assertContains(billingFunction, "complete_billing_event");
  assertContains(billingFunction, "fetchWithTimeout");
  assertContains(sharedHttp, "DEFAULT_TIMEOUT_MS = 15_000");
  assertContains(sharedHttp, "new AbortController()");
  assertContains(sharedHttp, 'init.signal?.addEventListener("abort"');
  assertContains(sharedHttp, "signal: controller.signal");
  assertContains(sharedHttp, 'init.signal?.removeEventListener("abort"');
  assertContains(billingFunction, "ignored: true");
  assertContains(billingFunction, '["active", "billing_issue", "cancelled"]');
  assertContains(billingFunction, "hasFutureExpiry");
  assertContains(billingFunction, "REVENUECAT_ALLOW_SANDBOX");
  assertContains(billingFunction, 'reason: "sandbox_disabled"');
  assertContains(billingFunction, 'reason: "unknown_product"');
  assertContains(billingFunction, "loadCurrentBillingState");
  assertContains(billingFunction, "eventExpiresAt");
  assertContains(billingFunction, "billing_events");
  assertContains(billingFunction, "/rpc/claim_billing_event");
  assertContains(billingFunction, "/rpc/apply_subscription_event");
  assertContains(
    billingDeletedUserMigration,
    "if not exists (select 1 from public.profiles where id = p_user_id)",
  );
  assertContains(billingDeletedUserMigration, "return query select false");
  assertContains(notificationFunction, "x-cron-secret");
  assertContains(notificationFunction, "EXPO_ACCESS_TOKEN");
  assertContains(notificationFunction, "Array.isArray(result?.data)");
  assertContains(notificationFunction, "DeviceNotRegistered");
  assertContains(notificationFunction, "record_notification_delivery_fenced");
  assertContains(notificationFunction, "claim_notification_delivery_fenced");
  assertContains(notificationFunction, "release_notification_delivery_fenced");
  assertContains(notificationFunction, "rpcBoolean");
  assertContains(notificationFunction, "loadReflectionsBySlot");
  assertContains(notificationFunction, "groupNotificationRecipients");
  assertContains(notificationFunction, "parseDeliveryClaim");
  assertContains(notificationFunction, "p_claim_token: deliveryClaimToken");
  assertContains(notificationFunction, "expo_push_tokens");
  assertContains(notificationFunction, "sendPushNotification");
  assertContains(notificationFunction, "EXPO_RECEIPTS_URL");
  assertContains(notificationFunction, "processPendingPushReceipts");
  assertContains(notificationFunction, "getReceipts");
  assertContains(notificationFunction, "p_limit: 500");
  assertContains(notificationFunction, "record_notification_push_ticket");
  assertContains(notificationFunction, "Skipping one failed notification recipient.");
  assertContains(notificationFunction, "await releaseDelivery(");
  assertContains(notificationFunction, "claim_notification_push_tickets_fenced");
  assertContains(notificationFunction, "record_notification_push_receipt_fenced");
  assertContains(notificationFunction, "release_notification_push_ticket_fenced");
  assertContains(notificationFunction, "p_claim_token: ticket.claim_token");
  assertContains(notificationFunction, "ticketId");
  assertContains(notificationFunction, "date_slot=in.");
  assertContains(notificationFunction, "missingSlots");
  assertContains(notificationFunction, "availableSlots");
  assertContains(notificationFunction, "is_premium=eq.false");
  assertContains(notificationFunction, "limit=1000");
  assertContains(pushTokenOwnerMigration, "register_device_push_token");
  assertContains(pushTokenOwnerMigration, "where public.device_push_tokens.user_id = p_user_id");
  assertContains(
    endpointRateLimitMigration,
    "create table if not exists public.api_request_windows",
  );
  assertContains(
    endpointRateLimitMigration,
    "create or replace function public.consume_api_request_rate_limit",
  );
  assertContains(endpointRateLimitMigration, "push_token_mutation");
  assertContains(pushFunction, "rpc/register_device_push_token");
  assertContains(pushFunction, 'code: "push_token_conflict"');
  assertContains(notificationWindowMigration, "interval '15 minutes'");
  assertContains(notificationWindowMigration, "notification_deliveries");
  assertContains(notificationBatchMigration, "p_limit integer default 500");
  assertContains(notificationBatchMigration, "due_users as");
  assertContains(
    notificationBatchMigration,
    "limit greatest(1, least(coalesce(p_limit, 500), 1000))",
  );
  assertContains(notificationBatchMigration, "order by l.user_id, t.expo_push_token");
  assertContains(notificationClaimMigration, "notification_deliveries_status_chk");
  assertContains(notificationClaimMigration, "claim_notification_delivery");
  assertContains(notificationClaimMigration, "release_notification_delivery");
  assertContains(notificationClaimMigration, "claimed_at > p_now - interval '15 minutes'");
  assertContains(
    notificationReceiptMigration,
    "create table if not exists public.notification_push_tickets",
  );
  assertContains(
    notificationReceiptMigration,
    "create or replace function public.claim_notification_push_tickets",
  );
  assertContains(notificationReceiptMigration, "interval '15 minutes'");
  assertContains(notificationReceiptMigration, "interval '24 hours'");
  assertContains(notificationReceiptMigration, "receipt_expired");
  assertContains(
    notificationReceiptMigration,
    "revoke all on table public.notification_push_tickets",
  );
  assertContains(sourceRightsMigration, "content_sources_rights_metadata_chk");
  assertContains(sourceRightsMigration, "can_show_excerpts = false");
  assertContains(sourceRightsMigration, "copyright_status");
  assertContains(ragResponseLimitMigration, "jsonb_array_length(shaped.tradition_notes) <= 8");
  assertContains(ragResponseLimitMigration, "length(note.value #>> '{}') > 1000");
  assertContains(ragResponseLimitMigration, "cached_answers_structured_response_shape_chk");
  assertContains(userInputGuardMigration, "messages_content_length_chk");
  assertContains(userInputGuardMigration, "journal_entries_entry_length_chk");
  assertContains(userInputGuardMigration, "feedback_notes_length_chk");
  assertContains(cacheExpiryMigration, "interval '90 days'");
  assertContains(cacheExpiryMigration, "expires_at > now()");
  assertContains(costLogMigration, "create table if not exists public.cost_log");
  assertContains(costLogMigration, "record_ai_cost");
  assertContains(costLogMigration, "revoke all on table public.cost_log");
  assertContains(
    costLogMigration,
    "grant select, insert, delete on table public.cost_log to service_role",
  );
  assertContains(monthlyBudgetMigration, "purpose <> 'main_answer'");
  assertContains(monthlyBudgetMigration, "public.cost_log");
  assertContains(
    budgetReservationMigration,
    "create table if not exists public.ai_budget_reservations",
  );
  assertContains(budgetReservationMigration, "pg_advisory_xact_lock");
  assertContains(budgetReservationMigration, "create or replace function public.reserve_ai_budget");
  assertContains(budgetReservationMigration, "release_ai_budget_reservation");
  assertContains(globalBudgetMigration, "project-wide circuit breaker");
  assertContains(
    globalBudgetMigration,
    "pg_advisory_xact_lock(hashtext('sandhya_ai_budget'))",
  );
  assertContains(globalBudgetMigration, "from public.messages m");
  assertContains(globalBudgetMigration, "from public.cost_log l");
  assertContains(globalBudgetMigration, "from public.ai_budget_reservations r");
  assertContains(budgetReservationMigration, "status = 'reserved'");
  assertContains(askFunction, "expires_at=gt.");
  assertContains(ragIndex, "PIPELINE_VERSION");
  assertContains(ingestPrepared, "MAX_EMBEDDING_BATCH_SIZE");
  assertContains(ingestPrepared, "input: inputs");
  assertContains(ingestPrepared, "Embedding response included a duplicate batch index");
  assertContains(ingestPrepared, "estimated cost");
  assertContains(ingestPrepared, '"/rpc/record_ai_cost"');
  assertContains(ingestPrepared, 'p_purpose: "embedding"');
  assertContains(ingestPrepared, 'operation: "ingest"');
  assertContains(adminFunction, 'app_metadata?.role === "admin"');
  assertContains(adminFunction, "MAX_REQUEST_BODY_CHARS");
  assertContains(adminFunction, "feedback_id");
  assertContains(adminContentFunction, "TABLE_FIELDS");
  assertContains(adminContentFunction, "MAX_REQUEST_BODY_CHARS");
  assertContains(adminContentFunction, 'request.headers.get("content-length")');
  assertContains(adminContentFunction, 'app_metadata?.role !== "admin"');
  assertContains(adminContentFunction, "allowlistedPayload");
  assertContains(adminContentFunction, "confirm=DELETE");
  assertContains(adminContentFunction, 'prefer: "return=representation"');
  assertContains(adminContentFunction, 'code: "not_found"');
  assertContains(adminContentFunction, "Content row not found.");
  assertContains(adminOpsFunction, "authenticateAdmin");
  assertContains(adminOpsFunction, 'resource === "overview"');
  assertContains(adminOpsFunction, 'resource === "cost"');
  assertContains(adminOpsFunction, 'resource === "cache"');
  assertContains(adminOpsFunction, 'resource === "users"');
  assertContains(adminOpsFunction, "loadOperationalHealth");
  assertContains(adminOpsFunction, "/billing_events?processed_at=is.null");
  assertContains(adminOpsFunction, "stale_delivery_claims");
  assertContains(adminOpsFunction, "pending_push_receipts");
  assertContains(adminOpsFunction, "billing_issue_accounts");
  assertContains(adminOpsFunction, "/conversations?updated_at=gte.");
  assertNotContains(
    adminOpsFunction,
    "/messages?role=eq.user&created_at=gte.${encodeURIComponent(dayStart)}&select=user_id",
  );
  assertContains(adminOpsFunction, "raw_questions_excluded");
  assertContains(adminOpsFunction, "confirm=INVALIDATE");
  assertContains(adminOpsFunction, "emails_excluded");
  assertContains(askFunction, 'thinking: { type: "disabled" }');
  assertContains(askFunction, "input.thinking");
  assertContains(supabaseRest, "retrievedPassageIds.length === 0");
  assertContains(supabaseRest, "answer.sources.length === 0");
  assertContains(supabaseRest, "Cached answer failed persistence validation");
  assertContains(supabaseRestTest, 'it("rejects uncited cached answer writes"');
  assertContains(supabaseConfig, "[functions.revenuecat-webhook]");
  assertContains(supabaseConfig, "verify_jwt = false");
  assertContains(supabaseConfig, "[functions.send-daily-reflections]");
  assertContains(rootPackage, '"rag:evaluate:validate"');
  assertContains(rootPackage, '"rag:evaluate"');
  assertContains(rootPackage, '"rag": "node scripts/rag-cli.mjs"');
  assertContains(rootPackage, '"content": "node scripts/content-cli.mjs"');
  assertContains(rootPackage, '"workspace:lock-check"');
  assertContains(contentTools, "validateMarkdownCorpus");
  assertContains(contentTools, "copyright_status");
  assertContains(contentTools, "can_show_excerpts");
  assertContains(contentTools, "can_embed");
  assertContains(contentToolsCli, 'command === "validate"');
  assertContains(migration, "passage_embeddings_model_chunk_hash_uidx");
  assertContains(migration, "alter column question_text drop not null");
  assertContains(migration, "add column if not exists retrieved_passage_ids uuid[]");
  assertContains(migration, "cached_answers_structured_response_shape_chk");
  assertContains(migration, "from pg_constraint");
  assertContains(migration, "where conname = 'cached_answers_structured_response_shape_chk'");
  assertContains(migration, "create or replace function public.is_valid_rag_structured_response");
  assertContains(migration, "coalesce(cs.can_store, false) = true");
  assertContains(migration, "coalesce(cs.can_embed, false) = true");
  assertContains(migration, "coalesce(cs.can_show_excerpts, false) = true");
  assertContains(ragRightsMigration, "create or replace function public.match_passage_embeddings");
  assertContains(ragRightsMigration, "coalesce(cs.can_store, false) = true");
  assertContains(ragRightsMigration, "coalesce(cs.can_embed, false) = true");
  assertContains(ragRightsMigration, "coalesce(cs.can_show_excerpts, false) = true");
  assertContains(allSourceRightsMigration, "cs.id is not null");
  assertContains(allSourceRightsMigration, "cs.licence = any(allowed_licences)");
  assertContains(allSourceRightsMigration, "c.id is null or c.licence = any(allowed_licences)");
  assertContains(
    allSourceRightsMigration,
    "join public.content_sources cs on cs.id = pe.source_document_id",
  );
  assertContains(allSourceRightsMigration, "create or replace function public.can_read_passage");
  assertContains(allSourceRightsMigration, "create or replace function public.can_read_commentary");
  assertContains(
    allSourceRightsMigration,
    "Every embedding associated with the passage must also be safe",
  );
  assertContains(
    allSourceRightsMigration,
    "prevents a public embedding from masking a licensed or untracked one",
  );
  assertContains(allSourceRightsMigration, "cs.id is null");
  assertContains(allSourceRightsMigration, "cs.can_store is not true");
  assertContains(allSourceRightsMigration, "cs.can_show_excerpts is not true");
  assertContains(allSourceRightsMigration, "c.id is not null and c.licence not in");
  assertContains(
    billingEnvironmentMigration,
    "create table if not exists public.billing_runtime_config",
  );
  assertContains(billingEnvironmentMigration, "allow_sandbox  boolean not null default false");
  assertContains(
    billingEnvironmentMigration,
    "revoke all on table public.billing_runtime_config from public, anon, authenticated",
  );
  assertContains(billingEnvironmentMigration, "c.allow_sandbox = true");
  assertContains(migration, "with shaped as (");
  assertContains(
    migration,
    "when jsonb_typeof(response->'sources') = 'array' then response->'sources'",
  );
  assertContains(
    migration,
    "when jsonb_typeof(response->'tradition_notes') = 'array' then response->'tradition_notes'",
  );
  assertContains(migration, "select coalesce((");
  assertContains(migration, "jsonb_typeof(response) = 'object'");
  assertContains(migration, "jsonb_array_length(shaped.sources) <= 6");
  assertContains(migration, "or response->>'confidence' = 'low'");
  assertContains(migration, "or jsonb_typeof(response->'safety_note') = 'string'");
  assertContains(migration, "jsonb_typeof(response->'tradition_notes') = 'array'");
  assertContains(migration, "jsonb_array_elements(shaped.sources)");
  assertContains(migration, "jsonb_array_elements(shaped.tradition_notes)");
  assertContains(migration, "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$");
  assertContains(migration, "length(trim(source.value->>'relevance')) = 0");
  assertContains(migration, "length(trim(note.value #>> '{}')) = 0");
  assertContains(migration, "public.is_valid_rag_structured_response(structured_response)");
  assertContains(
    migration,
    "create or replace function public.rag_response_citations_match_retrieved_ids",
  );
  assertContains(migration, "create or replace function public.uuid_array_has_unique_values");
  assertContains(migration, "from unnest(retrieved_ids) as retrieved(id)");
  assertContains(migration, "from unnest(values_to_check) as unnested(value)");
  assertContains(migration, "where retrieved.id::text = sources.passage_id");
  assertContains(migration, "count(*) = count(distinct sources.passage_id)");
  assertContains(migration, "cached_answers_citations_backed_by_retrieval_chk");
  assertContains(migration, "where conname = 'cached_answers_citations_backed_by_retrieval_chk'");
  assertContains(migration, "public.rag_response_citations_match_retrieved_ids(");
  assertContains(
    migration,
    "revoke all on function public.is_valid_rag_structured_response(jsonb) from public",
  );
  assertContains(
    migration,
    "revoke all on function public.rag_response_citations_match_retrieved_ids(jsonb, uuid[]) from public",
  );
  assertContains(
    migration,
    "grant execute on function public.is_valid_rag_structured_response(jsonb) to service_role",
  );
  assertContains(
    migration,
    "grant execute on function public.rag_response_citations_match_retrieved_ids(jsonb, uuid[]) to service_role",
  );
  assertContains(
    migration,
    "grant execute on function public.is_valid_rag_structured_response(jsonb) to authenticated",
  );
  assertContains(
    migration,
    "grant execute on function public.rag_response_citations_match_retrieved_ids(jsonb, uuid[]) to authenticated",
  );
  assertContains(migration, "cached_answers_retrieved_passage_ids_limit_chk");
  assertContains(migration, "where conname = 'cached_answers_retrieved_passage_ids_limit_chk'");
  assertContains(migration, "cardinality(retrieved_passage_ids) <= 20");
  assertContains(migration, "cached_answers_retrieved_passage_ids_unique_chk");
  assertContains(migration, "where conname = 'cached_answers_retrieved_passage_ids_unique_chk'");
  assertContains(migration, "public.uuid_array_has_unique_values(retrieved_passage_ids)");
  assertContains(migration, ") not valid;");
  assertContains(
    migration,
    'drop policy if exists "users insert messages in own conversations" on public.messages',
  );
  assertContains(migration, 'create policy "users insert own user messages only"');
  assertContains(migration, "role = 'user'");
  assertContains(migration, "structured_response is null");
  assertContains(migration, "cardinality(retrieved_passage_ids) = 0");
  assertContains(migration, "model_used is null");
  assertContains(migration, "tokens_in is null");
  assertContains(migration, "tokens_out is null");
  assertContains(migration, "cost_usd is null");
  assertContains(migration, "messages_rag_audit_shape_chk");
  assertContains(migration, "where conname = 'messages_rag_audit_shape_chk'");
  assertContains(migration, "role = 'assistant'");
  assertContains(migration, "structured_response is not null");
  assertContains(migration, "public.is_valid_rag_structured_response(structured_response)");
  assertContains(migration, "public.rag_response_citations_match_retrieved_ids(");
  assertContains(migration, "cardinality(retrieved_passage_ids) <= 20");
  assertContains(migration, "and public.uuid_array_has_unique_values(retrieved_passage_ids)");
  assertContains(migration, "tokens_in >= 0");
  assertContains(migration, "tokens_out >= 0");
  assertContains(migration, "cost_usd >= 0");
  assertNotContains(migration, "coalesce(cs.can_embed, true) = true");
  assertNotContains(migration, "coalesce(cs.can_show_excerpts, true) = true");
  assertContains(migration, "pe.metadata->>'source_url'");
  assertContains(migration, "p.word_meanings #>> '{import,source_url}'");
  assertContains(
    migration,
    "coalesce(c.licence, cs.licence, 'public_domain') = any(allowed_licences)",
  );
  assertContains(
    migration,
    "coalesce(c.tradition, t.tradition_primary, 'general') in ('general', tradition_filter)",
  );
  assertNotContains(migration, "or c.tradition is null");
  assertContains(migration, "grant execute on function public.match_passage_embeddings");
  assertContains(migration, "to service_role");
  assertContains(migration, "create or replace function public.consume_ai_message");
  assertContains(
    migration,
    "effective_free_daily_limit integer := greatest(0, coalesce(p_free_daily_limit, 5))",
  );
  assertContains(migration, "quota_row.ai_messages_count >= effective_free_daily_limit");
  assertContains(migration, "effective_free_daily_limit;");
  assertContains(migration, "create or replace function public.check_ai_monthly_budget");
  assertContains(migration, "p_monthly_budget_usd numeric default 0");
  assertContains(migration, "m.created_at >= date_trunc('month', now())");
  assertContains(
    migration,
    "p_monthly_budget_usd <= 0 or spend.current_spend_usd < p_monthly_budget_usd",
  );
  assertContains(
    migration,
    "grant execute on function public.check_ai_monthly_budget(uuid, numeric) to service_role",
  );
  assertContains(migration, "create or replace function public.refund_ai_message");
  assertContains(
    migration,
    "grant execute on function public.refund_ai_message(uuid) to service_role",
  );
  assertContains(migration, "ai_messages_count = greatest(0, ai_messages_count - 1)");
  assertContains(migration, "create or replace function public.record_cached_answer_hit");
  assertContains(migration, "query_text text default null");
  assertContains(
    cachedAnswerRightsMigration,
    "create or replace function public.cached_answer_sources_are_allowed",
  );
  assertContains(cachedAnswerRightsMigration, "when p_retrieved_ids is null then false");
  assertContains(cachedAnswerRightsMigration, "when cardinality(p_retrieved_ids) = 0 then true");
  assertContains(cachedAnswerRightsMigration, "coalesce(cs.can_store, false) = true");
  assertContains(cachedAnswerRightsMigration, "coalesce(cs.can_embed, false) = true");
  assertContains(cachedAnswerRightsMigration, "coalesce(cs.can_show_excerpts, false) = true");
  assertContains(
    cachedAnswerRightsMigration,
    "grant execute on function public.cached_answer_sources_are_allowed",
  );
  assertContains(cachedAnswerAllSourcesMigration, "not exists (");
  assertContains(cachedAnswerAllSourcesMigration, "cs.can_embed is not true");
  assertContains(cachedAnswerAllSourcesMigration, "c.licence <> all");
  assertContains(
    embeddingModelMigration,
    "drop function if exists public.match_passage_embeddings",
  );
  assertContains(embeddingModelMigration, "embedding_model text default 'text-embedding-3-small'");
  assertContains(embeddingModelMigration, "pe.embedding_model = $10");
  assertContains(embeddingModelMigration, "double precision, text");
  assertContains(
    cachedAnswerModelMigration,
    "drop function if exists public.cached_answer_sources_are_allowed",
  );
  assertContains(
    cachedAnswerModelMigration,
    "p_embedding_model text default 'text-embedding-3-small'",
  );
  assertContains(cachedAnswerModelMigration, "pe.embedding_model = p_embedding_model");
  assertContains(cachedAnswerModelMigration, "cs.licence is null");
  assertContains(feedbackWriteGuardMigration, "status = 'pending'");
  assertContains(feedbackWriteGuardMigration, "admin_notes is null");
  assertContains(feedbackPrivacyMigration, 'drop policy if exists "users read own feedback"');
  assertContains(migration, "keyword_weight double precision default 0.15");
  assertContains(migration, "websearch_to_tsquery('simple', query_text)");
  assertContains(migration, "ts_rank_cd");

  assertContains(rootPackage, '"rag:doctor"');
  assertContains(rootPackage, '"rag:ingest": "pnpm --filter @sandhya/rag-pipeline build &&');
  assertContains(
    rootPackage,
    '"rag:ingest:dry-run": "pnpm --filter @sandhya/rag-pipeline build &&',
  );
  assertContains(
    rootPackage,
    '"rag:prepare:canonical": "pnpm --filter @sandhya/rag-pipeline build &&',
  );
  assertContains(rootPackage, '"rag:smoke:live"');
  assertContains(ragDoctor, "docker");
  assertContains(ragDoctor, "supabase");
  assertContains(ragDoctor, "deno");
  assertContains(ragDoctor, "psql");
  assertContains(ragDoctor, "SUPABASE_URL");
  assertContains(ragDoctor, "SUPABASE_SERVICE_ROLE_KEY");
  assertContains(ragDoctor, "SUPABASE_ANON_KEY");
  assertContains(ragDoctor, "checkSupabaseReachability");
  assertContains(ragDoctor, "OPENAI_API_KEY");
  assertContains(ragDoctor, "DEEPSEEK_API_KEY");
  assertContains(ragDoctor, "OPENAI_COMPATIBLE_API_KEY");
  assertContains(ragDoctor, "ANTHROPIC_API_KEY");
  assertContains(ragDoctor, "EMBEDDING_DIMENSIONS");
  assertContains(ragDoctor, "LLM_MONTHLY_BUDGET_USD");
  assertContains(ragDoctor, 'requireNumericEnv("LLM_MONTHLY_BUDGET_USD", 0, { allowZero: true })');
  assertContains(ragDoctor, "LLM_INPUT_COST_PER_MILLION");
  assertContains(ragDoctor, "Monthly budget pricing configuration is coherent.");
  assertContains(ragDoctor, "backend:check");
  assertContains(ragDoctor, "rag:evaluate:validate");
  assertContains(ragDoctor, "rag:audit");
  assertContains(ragDoctor, "rag:ingest:dry-run");
  assertContains(ragDoctor, "rag:audit:canonical");
  assertContains(ragDoctor, "rag:ingest:canonical:dry-run");
  assertContains(ragDoctor, "prepared-corpus:source-audit");
  assertContains(preparedCorpusSourceAudit, 'createHash("sha256")');
  assertContains(
    preparedCorpusSourceAudit,
    "chunk_hash does not match the prepared chunk contents",
  );
  assertContains(preparedCorpusSourceAudit, "rights flags do not permit store/embed/excerpt");
  assertContains(preparedCorpusSourceAudit, "source_url must be a valid http(s) URL");
  assertContains(ragLiveSmoke, "RAG_SMOKE_EMAIL");
  assertContains(ragLiveSmoke, "RAG_SMOKE_PASSWORD");
  assertContains(ragLiveSmoke, "RAG_ASK_FUNCTION_URL");
  assertContains(ragLiveSmoke, "/auth/v1/token?grant_type=password");
  assertContains(ragLiveSmoke, "/functions/v1/ask");
  assertContains(ragLiveSmoke, 'json.cache === "safety"');
  assertContains(ragLiveSmoke, 'category: "self_harm"');
  assertContains(ragLiveSmoke, 'category: "medical"');
  assertContains(ragLiveSmoke, 'category: "legal_financial"');
  assertContains(ragLiveSmoke, "answer.safety_note === category");
  assertContains(ragLiveSmoke, 'json.cache === "miss"');
  assertContains(ragLiveSmoke, 'json.cache === "hit"');
  assertContains(ragLiveSmoke, 'accept: "text/event-stream"');
  assertContains(ragLiveSmoke, "streamedQuestion");
  assertContains(ragLiveSmoke, 'eventTypes.has("text")');
  assertContains(ragLiveSmoke, "parseServerSentEvents");
  assertContains(ragLiveSmoke, "[live smoke ${Date.now()}]");
  assertContains(ragLiveSmoke, "retrieved.has(source.passage_id)");
  assertContains(ragLiveSmoke, "assertPersistedAuditRow");
  assertContains(ragLiveSmoke, "cleanupSmokeConversations");
  assertContains(ragLiveSmoke, 'method: "DELETE"');
  assertContains(ragLiveSmoke, "finally");
  assertContains(ragLiveSmoke, "model_used");
  assertContains(ragLiveSmoke, "tokens_in");
  assertContains(ragLiveSmoke, "tokens_out");
  assertContains(ragLiveSmoke, "cost_usd");
  assertContains(accountLiveSmoke, "RLS_SMOKE_EMAIL_A");
  assertContains(accountLiveSmoke, "RLS_SMOKE_EMAIL_B");
  assertContains(accountLiveSmoke, "User A could read User B's profile");
  assertContains(accountLiveSmoke, "User A could read User B's conversations");
  assertContains(accountLiveSmoke, "User A could read messages in User B's conversations");
  assertContains(accountLiveSmoke, "assertWriteDenied");
  assertContains(accountLiveSmoke, "RLS message parent probe");
  assertContains(accountLiveSmoke, "Cross-user message write probe");
  assertContains(accountLiveSmoke, "Cross-user feedback write probe");
  assertContains(accountLiveSmoke, "parent RLS is not isolated");
  assertContains(accountLiveSmoke, "feedback RLS is not isolated");
  assertContains(accountLiveSmoke, "crossUserConversationId");
  assertContains(accountLiveSmoke, "finally");
  assertContains(accountLiveSmoke, 'method: "PATCH"');
  assertContains(accountLiveSmoke, "WITH CHECK is missing");
  assertContains(accountLiveSmoke, "RLS write isolation is not enforced");
  assertContains(accountLiveSmoke, '"saved_items"');
  assertContains(accountLiveSmoke, '"journal_entries"');
  assertContains(accountLiveSmoke, '"practice_completions"');
  assertContains(accountLiveSmoke, '"subscription_status"');
  assertContains(accountLiveSmoke, '"ai_request_windows"');
  assertContains(accountLiveSmoke, '"ai_budget_reservations"');
  assertContains(accountLiveSmoke, '"cost_log"');
  assertContains(accountLiveSmoke, '"cached_answers"');
  assertContains(accountLiveSmoke, '"passage_embeddings"');
  assertContains(accountLiveSmoke, '"admin_audit_log"');
  assertContains(accountLiveSmoke, "server-only");

  assertContains(askFunction, "runSafetyGate(question)");
  assertContains(askFunction, "classifyQuestion(question)");
  assertContains(askFunction, "const body = await readAskRequest(request)");
  assertContains(askFunction, "async function readAskRequest");
  assertContains(askFunction, "Request body must be valid JSON.");
  assertContains(askFunction, "Request body must be a JSON object.");
  assertContains(askFunction, "MAX_REQUEST_BODY_CHARS");
  assertContains(askFunction, '"request_too_large"');
  assertContains(askFunction, "MAX_ANSWER_CHARS");
  assertContains(askFunction, "streamAskResponse(request)");
  assertContains(askFunction, "handleAskRequest(request, emit, cancellation.signal)");
  assertContains(askFunction, "cancellation.abort()");
  assertContains(askFunction, "requestSignal: env.requestSignal");
  assertContains(askFunction, "signal: input.requestSignal");
  assertContains(askFunction, "init.signal?.aborted");
  assertContains(askFunction, "sleep(backoffMs(attempt), init.signal ?? undefined)");
  assertContains(askFunction, 'code: "request_cancelled"');
  assertContains(askFunction, "function isAbortError");
  assertContains(askFunction, '"content-type": "text/event-stream; charset=utf-8"');
  assertContains(askFunction, 'type: "text"');
  assertContains(askFunction, 'type: "complete"');
  assertContains(askFunction, "readOpenAICompatibleStream");
  assertContains(askFunction, "readAnthropicStream");
  assertContains(askFunction, "requestSignal?: AbortSignal");
  assertContains(askFunction, "readProviderSse");
  assertContains(askFunction, "await readPromise?.catch(() => undefined)");
  assertContains(askFunction, 'requestSignal.addEventListener("abort"');
  assertContains(askFunction, "clearTimeout(timeout)");
  assertContains(askFunction, "emitStructuredAnswerDelta");
  assertContains(askFunction, '"record_ai_cost"');
  assertContains(askFunction, "EMBEDDING_INPUT_COST_PER_MILLION");
  assertContains(askFunction, "recordAiCostBestEffort");
  assertContains(askFunction, "generateAnswerOnce");
  assertContains(askFunction, "isStructuredOutputError");
  assertContains(askFunction, '"consume_ai_rate_limit"');
  assertContains(askFunction, 'code: "rate_limited"');
  assertContains(askFunction, "AI_RATE_LIMIT_PER_MINUTE");
  assertContains(askFunction, "conversation_id must be a UUID string.");
  assertContains(askFunction, "title: conversationTitle(question)");
  assertContains(askFunction, "const MAX_CONVERSATION_TITLE_CHARS = 80");
  assertContains(askFunction, "const ALLOWED_TRADITIONS = new Set");
  assertContains(askFunction, "tradition_preference must be a supported tradition string.");
  assertContains(askFunction, "input.tradition_preference.trim().toLowerCase()");
  assertNotContains(askFunction, "(await request.json()) as AskRequest");
  assertContains(classifier, "want to die");
  assertContains(classifier, "do not want to live");
  assertContains(classifier, "end it all");
  assertContains(classifier, "stop taking");
  assertContains(classifier, "drug interaction");
  assertContains(classifier, "contract dispute");
  assertContains(classifier, "export function isCacheableQuestion");
  assertContains(classifier, "!PERSONAL_CONTEXT.test(normalized)");
  assertContains(ragClassifier, "export function isCacheableQuestion");
  assertContains(ragClassifier, "!PERSONAL_CONTEXT.test(normalized)");
  assertContains(askFunction, "const cacheableQuestion = isCacheableQuestion(question)");
  assertContains(askFunction, "const questionHash = cacheableQuestion");
  assertContains(askFunction, 'const cacheStatus = cacheableQuestion ? "miss" : "skipped"');
  assertContains(askFunction, "cache: cacheStatus");
  assertContains(askFunction, "const cachedRows = questionHash");
  assertContains(askFunction, "if (questionHash && cached && cachedRow)");
  assertContains(askFunction, 'const EDGE_PIPELINE_VERSION = "edge-ask-v21"');
  assertContains(askFunction, "output_config: {");
  assertContains(askFunction, 'type: "json_schema"');
  assertContains(askFunction, "const MAX_RETRIEVED_PASSAGE_IDS = 20");
  assertContains(askFunction, "tradition_notes: string[]");
  assertContains(askFunction, '"consume_ai_message"');
  assertContains(askFunction, '"check_ai_monthly_budget"');
  assertContains(askFunction, '"reserve_ai_budget"');
  assertContains(askFunction, '"release_ai_budget_reservation"');
  assertContains(askFunction, "estimateRequestReservation");
  assertContains(askFunction, '"refund_ai_message"');
  assertContains(askFunction, "The daily entitlement was consumed before this serialized monthly");
  assertContains(askFunction, "let chargedUserId: string | null = null");
  assertContains(askFunction, "let answerPersisted = false");
  assertContains(askFunction, "chargedUserId = user.id");
  assertContains(askFunction, "answerPersisted = true");
  assertContains(askFunction, "function refundAiMessageBestEffort");
  assertContains(askFunction, "if (envForRefund && chargedUserId && !answerPersisted)");
  assertContains(askFunction, "/cached_answers?question_hash=eq.");
  assertContains(askFunction, "select=structured_response,retrieved_passage_ids");
  assertContains(askFunction, "isValidCachedAnswer(cached, cachedRetrievedPassageIds)");
  assertContains(askFunction, "cachedAnswerSourcesAreAllowed");
  assertContains(askFunction, '"cached_answer_sources_are_allowed"');
  assertContains(askFunction, "const result = await rpc<unknown>");
  assertContains(askFunction, "return parseRpcBoolean(result)");
  assertContains(askFunction, "function parseRpcBoolean");
  assertContains(askFunction, "record.cached_answer_sources_are_allowed === true");
  assertContains(askFunction, "value.length === 1 && parseRpcBoolean(value[0])");
  assertContains(askFunction, "function isValidCachedAnswer");
  assertContains(askFunction, "function assertValidCachePayload");
  assertContains(askFunction, "Only grounded answers with citations may be cached.");
  assertContains(askFunction, "Cached answers must include at least one grounded citation.");
  assertContains(askFunction, "retrievedPassageIds.length === 0");
  assertContains(askFunction, "answer.sources.length === 0");
  assertContains(askFunction, "assertValidCachePayload(answer, retrievedPassageIds)");
  assertContains(askFunction, "Cached answer failed persistence validation.");
  assertContains(askFunction, "function cacheAnswerBestEffort");
  assertContains(askFunction, "function recordCacheHitBestEffort");
  assertContains(askFunction, "Skipping cached_answers write after successful audit persistence.");
  assertContains(askFunction, "Skipping cached_answers hit counter update after cache hit.");
  assertContains(askFunction, "answer.sources.length > MAX_SOURCE_CITATIONS");
  assertNotContains(askFunction, 'answer.sources.length === 0 && answer.confidence !== "low"');
  assertContains(askFunction, "retrievedPassageIds.length > MAX_RETRIEVED_PASSAGE_IDS");
  assertContains(askFunction, "new Set(retrievedPassageIds).size !== retrievedPassageIds.length");
  assertContains(askFunction, "citedIds.has(source.passage_id)");
  assertContains(askFunction, "return retrievedIds.has(source.passage_id)");
  assertContains(askFunction, '"match_passage_embeddings"');
  assertContains(askFunction, "buildCacheKey(question, env, retrievalPolicy)");
  assertContains(askFunction, "pipeline: EDGE_PIPELINE_VERSION");
  assertContains(askFunction, "llm_provider: env.llmProvider");
  assertContains(askFunction, "answer_model: env.llmModel");
  assertContains(askFunction, "const allowedLicences =");
  assertContains(askFunction, 'quotaRow.plan === "free"');
  assertContains(askFunction, "const quotaSummary =");
  assertContains(askFunction, "quota: quotaSummary");
  assertContains(askFunction, '["public_domain", "licensed", "original"]');
  assertContains(askFunction, "allowed_licences: retrievalPolicy.allowedLicences");
  assertContains(askFunction, "matchCount: env.matchCount");
  assertContains(askFunction, "maxContextChars: env.maxContextChars");
  assertContains(askFunction, "embeddingModel: env.embeddingModel");
  assertContains(
    askFunction,
    'Deno.env.get("EMBEDDING_MODEL")?.trim() || "text-embedding-3-small"',
  );
  assertContains(
    askFunction,
    'Deno.env.get("LLM_DEFAULT_MODEL")?.trim() || defaultModelForProvider',
  );
  assertContains(askFunction, "query_text: question");
  assertContains(askFunction, "keyword_weight: retrievalPolicy.keywordWeight");
  assertContains(askFunction, "embedding_model: retrievalPolicy.embeddingModel");
  assertContains(askFunction, "keyword_weight: policy.keywordWeight");
  assertContains(askFunction, "p_embedding_model: policy.embeddingModel");
  assertContains(askFunction, "match_count: policy.matchCount");
  assertContains(askFunction, "max_context_chars: policy.maxContextChars");
  assertContains(askFunction, "embedding_model: policy.embeddingModel");
  assertContains(askFunction, 'readPositiveIntegerEnv("FREE_DAILY_LIMIT", 5)');
  assertContains(askFunction, 'readNonNegativeNumberEnv("LLM_MONTHLY_BUDGET_USD", 0)');
  assertContains(askFunction, "requires all provider pricing values to be non-zero");
  assertContains(askFunction, "readBoundedIntegerEnv(");
  assertContains(askFunction, '"RAG_MATCH_COUNT"');
  assertContains(askFunction, '"RAG_FETCH_TIMEOUT_MS"');
  assertContains(askFunction, 'readPositiveIntegerEnv("EMBEDDING_DIMENSIONS", 1536)');
  assertContains(askFunction, "new AbortController()");
  assertContains(askFunction, "signal: controller.signal");
  assertContains(askFunction, '"cache-control": "no-store, private, no-cache, no-transform"');
  assertContains(askFunction, 'pragma: "no-cache"');
  assertContains(askFunction, "dimensions: env.embeddingDimensions");
  assertContains(
    askFunction,
    "assertEmbeddingDimensions(embedding, env.embeddingDimensions, env.embeddingModel)",
  );
  assertContains(askFunction, "function assertEmbeddingDimensions");
  assertContains(askFunction, "MAX_RETRIEVED_PASSAGE_IDS");
  assertContains(askFunction, 'readBoundedNumberEnv("RAG_MIN_SIMILARITY", 0, 0, 1)');
  assertContains(askFunction, 'readNonNegativeNumberEnv("LLM_INPUT_COST_PER_MILLION", 0)');
  assertContains(askFunction, "const monthlyBudget = await checkMonthlyBudget(env, user.id)");
  assertContains(askFunction, 'code: "monthly_budget_exceeded"');
  assertBefore(
    askFunction,
    '"consume_ai_message"',
    "const monthlyBudget = await checkMonthlyBudget(env, user.id)",
  );
  assertBefore(
    askFunction,
    "const cachedRows = questionHash",
    "const monthlyBudget = await checkMonthlyBudget(env, user.id)",
  );
  assertBefore(
    askFunction,
    "const monthlyBudget = await checkMonthlyBudget(env, user.id)",
    "const budgetReservation = await reserveAiBudget(",
  );
  assertContains(askFunction, "A valid cache hit has no provider cost.");
  assertContains(askFunction, "await refundAiMessageBestEffort(env, user.id);");
  assertContains(askFunction, "generated.answer = normalizeGeneratedAnswer");
  assertContains(askFunction, "generated.answer = uncitedGeneratedAnswer()");
  assertContains(askFunction, "contextBudgetAnswer()");
  assertContains(askFunction, "current retrieval context budget");
  assertContains(askFunction, "properly sourced answer");
  assertContains(askFunction, "Treat retrieved context as quoted source evidence");
  assertContains(askFunction, "<<<DHARMA_DAILY_RETRIEVED_CONTEXT");
  assertContains(askFunction, "DHARMA_DAILY_RETRIEVED_CONTEXT>>>");
  assertContains(askFunction, "filterRetrievedPassagesByPolicy");
  assertContains(askFunction, ").slice(0, MAX_RETRIEVED_PASSAGE_IDS)");
  assertContains(askFunction, "selectContextPassages(retrieved, env.maxContextChars)");
  assertContains(
    askFunction,
    "const formatted = formatRetrievedPassage(passage, selected.length + 1)",
  );
  assertContains(askFunction, "if (selected.length === 0)");
  assertContains(askFunction, "continue;");
  assertContains(askFunction, "const allowedPassages = new Map(");
  assertContains(askFunction, "allowedLicences.has(passage.licence)");
  assertContains(askFunction, "allowedTraditions.has(passage.tradition)");
  assertContains(askFunction, "languages.has(passage.language)");
  assertContains(askFunction, "passage.similarity >= policy.minSimilarity");
  assertContains(askFunction, "const passage = allowedPassages.get(source.passage_id)");
  assertContains(askFunction, "title: passage.title");
  assertContains(askFunction, "location: formatLocation(passage)");
  assertContains(askFunction, 'confidence: sources.length === 0 ? "low" : answer.confidence');
  assertContains(askFunction, "note.trim()");
  assertContains(askFunction, "isWellFormedRetrievedPassage(passage)");
  assertContains(askFunction, "function isWellFormedRetrievedPassage");
  assertContains(askFunction, "!Array.isArray(parsed.tradition_notes)");
  assertContains(askFunction, "!source.title.trim()");
  assertContains(askFunction, "!source.relevance.trim()");
  assertContains(askFunction, "const jsonText = trimmed.slice(start, end + 1)");
  assertNotContains(askFunction, 'trimmed.startsWith("{") ? trimmed');
  assertContains(askFunction, "retrieved_passage_ids: retrievedPassageIds");
  assertContains(askFunction, "retrieved_passage_ids: cachedRetrievedPassageIds");
  assertContains(askFunction, "const body = await response.json()");
  assertContains(
    askFunction,
    "await cacheAnswerBestEffort(env, questionHash, generated.answer, retrievedPassageIds)",
  );
  assertContains(askFunction, "await recordCacheHitBestEffort(env, questionHash)");
  assertContains(
    askFunction,
    "answerPersisted = true;\n        await recordCacheHitBestEffort(env, questionHash)",
  );
  assertContains(askFunction, "model_used: audit.modelUsed");
  assertContains(askFunction, "tokens_in: audit.tokensIn");
  assertContains(askFunction, "tokens_out: audit.tokensOut");
  assertContains(askFunction, "cost_usd: audit.costUsd");
  assertContains(askFunction, "function normalizeLlmUsage");
  assertContains(askFunction, 'import { Tiktoken } from "npm:js-tiktoken@1.0.21/lite"');
  assertContains(askFunction, 'import cl100kBase from "npm:js-tiktoken@1.0.21/ranks/cl100k_base"');
  assertContains(askFunction, "new Tiktoken(cl100kBase)");
  assertNotContains(askFunction, "Math.ceil(question.length / 4)");
  assertContains(askFunction, 'Deno.env.get("ANTHROPIC_API_KEY")?.trim() || undefined');
  assertContains(askFunction, 'Deno.env.get("DEEPSEEK_API_KEY")?.trim() || undefined');
  assertContains(askFunction, 'Deno.env.get("OPENAI_COMPATIBLE_API_KEY")?.trim() || undefined');
  assertContains(askFunction, "const key = value?.trim()");
  assertContains(askFunction, "Embedding response did not include valid token usage.");
  assertContains(askFunction, "stream_options: { include_usage: true }");
  assertContains(askFunction, "JSON.stringify(STRUCTURED_ANSWER_JSON_SCHEMA)");
  assertContains(askFunction, "buildUserPrompt(");
  assertContains(askFunction, "...normalizeLlmUsage(streamed.tokensIn, streamed.tokensOut)");
  assertContains(askFunction, "LLM response did not include valid token usage.");
  assertNotContains(askFunction, "json.usage?.input_tokens ?? 0");
  assertNotContains(askFunction, "json.usage?.prompt_tokens ?? 0");
  assertNotContains(askFunction, "question_text:");
  assertNotContains(askFunction, "title: question");
  // Quota accounting must happen before the cache return so cached answers
  // cannot be used to bypass the free daily message allowance. The cache must
  // still be checked before retrieval/LLM work to preserve cost control.
  assertBefore(askFunction, '"consume_ai_message"', "/cached_answers?question_hash=eq.");
  assertBefore(askFunction, '"consume_ai_message"', '"match_passage_embeddings"');
  assertBefore(
    askFunction,
    "await persistConversationTurn(\n      env,\n      user.id,\n      body.conversation_id,\n      question,\n      generated.answer,",
    "await cacheAnswerBestEffort(env, questionHash, generated.answer, retrievedPassageIds)",
  );

  assertContains(ragIndex, 'export const PIPELINE_VERSION = "0.8.10"');
  assertContains(ragIndex, "const DEFAULT_MAX_QUESTION_CHARS = 2_000");
  assertContains(ragIndex, "const MAX_RETRIEVED_PASSAGE_IDS = 20");
  assertContains(ragIndex, "const ALLOWED_LICENCES");
  assertContains(ragIndex, "const ALLOWED_CONTENT_TYPES");
  assertContains(ragIndex, "const ALLOWED_TRADITIONS");
  assertContains(ragIndex, "export interface RagCachePolicy");
  assertContains(ragIndex, "this.store.getCachedAnswer(questionHash, {");
  assertContains(ragIndex, "languages: languages ?? null");
  assertContains(ragIndex, "embeddingModel: this.embeddings.model");
  assertContains(ragIndex, "normalizeAllowedLicences");
  assertContains(ragIndex, "normalizeContentTypes");
  assertContains(ragIndex, "normalizeLanguages");
  assertContains(ragIndex, "maxQuestionChars?: number");
  assertContains(ragIndex, "Question must be ${maxQuestionChars} characters or fewer.");
  assertContains(ragIndex, "Invalid tradition preference");
  assertContains(ragIndex, "Invalid language filter.");
  assertContains(ragIndex, "match_count: input.matchCount");
  assertContains(ragIndex, "max_context_chars: input.maxContextChars");
  assertContains(ragIndex, "embedding_model: input.embeddingModel");
  assertContains(ragIndex, "embeddingModel: this.embeddings.model");
  assertContains(supabaseRest, "embedding_model: options.embeddingModel");
  assertContains(ragIndex, "answer_model: input.answerModel");
  assertContains(ragIndex, "writeCache?: boolean");
  assertContains(ragIndex, "isCacheableQuestion(question)");
  assertContains(
    ragIndex,
    "const shouldReadCache = options.useCache !== false && cacheableQuestion",
  );
  assertContains(
    ragIndex,
    "const shouldWriteCache = options.writeCache !== false && cacheableQuestion",
  );
  assertContains(ragIndex, "if (shouldReadCache && questionHash)");
  assertContains(ragIndex, "if (shouldWriteCache && questionHash)");
  assertContains(
    ragIndex,
    "if (retrievedPassageIds.length > 0 && generated.answer.sources.length > 0)",
  );
  assertContains(ragIndex, ").slice(0, MAX_RETRIEVED_PASSAGE_IDS)");
  assertContains(ragIndex, "retrievedPassageIds.length > MAX_RETRIEVED_PASSAGE_IDS");
  assertContains(ragIndex, "new Set(retrievedPassageIds).size !== retrievedPassageIds.length");
  assertContains(ragIndex, "const allowedPassages = new Map(");
  assertContains(ragIndex, "const passage = allowedPassages.get(source.passage_id)");
  assertContains(ragIndex, "title: passage.title");
  assertContains(ragIndex, "location: formatLocation(passage)");
  assertContains(ragIndex, "isWellFormedRetrievedPassage(passage)");
  assertContains(ragIndex, "function isWellFormedRetrievedPassage");
  assertContains(ragProviders, "Treat retrieved context as quoted source evidence");
  assertContains(ragProviders, "<<<DHARMA_DAILY_RETRIEVED_CONTEXT");
  assertContains(ragProviders, "DHARMA_DAILY_RETRIEVED_CONTEXT>>>");
  assertContains(ragProviders, "requestTimeoutMs?: number");
  assertContains(ragProviders, "dimensions?: number");
  assertContains(ragProviders, "dimensions: this.dimensions");
  assertContains(ragProviders, "normalizeEmbeddingDimensions");
  assertContains(ragProviders, "OpenAI embedding response dimension mismatch");
  assertContains(ragProviders, "new AbortController()");
  assertContains(ragProviders, "signal: controller.signal");
  assertContains(ragProviders, "function normalizeLlmUsage");
  assertContains(ragProviders, "STRUCTURED_ANSWER_JSON_SCHEMA");
  assertContains(ragProviders, "output_config");
  assertContains(ragProviders, 'type: "json_schema"');
  assertContains(ragProviders, "parsed.confidence.toLowerCase()");
  assertContains(ragProviders, "LLM response did not include valid token usage.");
  assertContains(ragProviders, 'thinking?: { type: "enabled" | "disabled" }');
  assertContains(ragProviders, "...(this.thinking ? { thinking: this.thinking } : {})");
  assertContains(ragCli, 'thinking: { type: "disabled" }');
  assertContains(ragEvaluate, 'thinking: { type: "disabled" }');
  assertNotContains(ragProviders, "json.usage?.input_tokens ?? 0");
  assertNotContains(ragProviders, "json.usage?.prompt_tokens ?? 0");
  assertNotContains(ragProviders, "await response.text()");
  assertContains(ragProviders, "!Array.isArray(value.tradition_notes)");
  assertContains(supabaseRest, "validateStructuredAnswer(answer)");
  assertNotContains(supabaseRest, "await response.text()");
  assertContains(supabaseRest, "requestTimeoutMs?: number");
  assertContains(supabaseRest, "new AbortController()");
  assertContains(supabaseRest, "isValidCachePayload(row.structured_response, retrievedPassageIds)");
  assertContains(supabaseRest, '"/rest/v1/rpc/cached_answer_sources_are_allowed"');
  assertContains(supabaseRest, "p_embedding_model: policy.embeddingModel");
  assertContains(supabaseRest, "if (!parseRpcBoolean(await rightsResponse.json()))");
  assertContains(supabaseRest, "A cache hit must fail closed");
  assertContains(supabaseRest, "function parseRpcBoolean");
  assertContains(supabaseRest, "value.length === 1 && parseRpcBoolean(value[0])");
  assertContains(supabaseRest, "assertValidEmbedding(options.embedding)");
  assertContains(supabaseRest, "parseRetrievedPassages(await response.json())");
  assertContains(supabaseRest, "function isRetrievedPassage");
  assertContains(supabaseRest, "Supabase retrieval response failed validation");
  assertContains(supabaseRest, "Embedding must be a non-empty numeric vector");
  assertContains(supabaseRest, "answer.sources.length > MAX_SOURCE_CITATIONS");
  assertContains(supabaseRest, "retrievedPassageIds.length > MAX_RETRIEVED_PASSAGE_IDS");
  assertContains(supabaseRest, "new Set(retrievedPassageIds).size !== retrievedPassageIds.length");
  assertNotContains(supabaseRest, 'answer.sources.length === 0 && answer.confidence !== "low"');
  assertContains(supabaseRest, "return retrievedIds.has(source.passage_id)");
  assertContains(ragCli, 'readBoundedIntegerEnv("RAG_MATCH_COUNT", 8, 1, 20)');
  assertContains(ragCli, 'args[0] === "ask"');
  assertContains(ragCli, 'readPositiveIntegerEnv("RAG_FETCH_TIMEOUT_MS", 30_000)');
  assertContains(ragCli, 'readPositiveIntegerEnv("RAG_MAX_QUESTION_CHARS", 2_000)');
  assertContains(ragCli, 'readPositiveIntegerEnv("EMBEDDING_DIMENSIONS", 1536)');
  assertContains(ragCli, "dimensions: embeddingDimensions");
  assertContains(ragCli, 'writeCache: process.env.RAG_SKIP_CACHE !== "1"');
  assertContains(ragCli, 'const provider = process.env.LLM_PROVIDER?.trim() || "deepseek"');
  assertContains(ragCli, 'model: process.env.LLM_DEFAULT_MODEL?.trim() || "deepseek-v4-flash"');
  assertContains(ragCli, 'process.env.EMBEDDING_MODEL?.trim() || "text-embedding-3-small"');
  assertContains(
    ragCli,
    'process.env.OPENAI_COMPATIBLE_BASE_URL?.trim() || "https://api.openai.com/v1"',
  );
  assertContains(ragEvaluate, 'readBoundedIntegerEnv("RAG_MATCH_COUNT", 8, 1, 20)');
  assertContains(ragEvaluate, 'readPositiveIntegerEnv("RAG_FETCH_TIMEOUT_MS", 30_000)');
  assertContains(ragEvaluate, 'readPositiveIntegerEnv("RAG_MAX_QUESTION_CHARS", 2_000)');
  assertContains(ragEvaluate, 'readPositiveIntegerEnv("EMBEDDING_DIMENSIONS", 1536)');
  assertContains(ragEvaluate, 'writeCache: process.env.RAG_EVAL_WRITE_CACHE === "1"');
  assertContains(ragEvaluate, 'const provider = process.env.LLM_PROVIDER?.trim() || "deepseek"');
  assertContains(
    ragEvaluate,
    'model: process.env.LLM_DEFAULT_MODEL?.trim() || "deepseek-v4-flash"',
  );
  assertContains(ragEvaluate, 'process.env.EMBEDDING_MODEL?.trim() || "text-embedding-3-small"');
  assertContains(
    ragEvaluate,
    'process.env.OPENAI_COMPATIBLE_BASE_URL?.trim() || "https://api.openai.com/v1"',
  );
  assertContains(
    ragEvaluate,
    'const DEFAULT_EVAL_FILE = "content/_staging/evals/rag-eval.example.jsonl"',
  );
  assertContains(
    ragEvaluate,
    'const DEFAULT_CORPUS_FILE = "content/_staging/prepared/rag-corpus.jsonl"',
  );
  assertContains(ragEvaluate, "function parseCliArgs");
  assertContains(ragEvaluate, "export function parseCliArgs");
  assertContains(ragEvaluate, "outputIndex >= 0 && index === outputIndex + 1");
  assertContains(ragEvaluate, 'args.includes("--validate-only")');
  assertContains(ragEvaluate, 'arg.startsWith("--corpus=")');
  assertContains(ragEvaluate, "outputFile");
  assertContains(ragEvaluate, "writeFileAsync");
  assertContains(ragCommand, 'command === "ask"');
  assertContains(ragCommand, 'command === "eval"');
  assertContains(contentCommand, 'command === "ingest" || command === "reembed"');
  assertContains(contentCommand, "--dry-run");
  assertContains(ragEvaluate, "Validated ${cases.length} RAG eval cases");
  assertContains(ragEvaluate, "function hasGroundingAssertion");
  assertContains(ragEvaluate, "sourced evals must assert expectedPassageIds");
  assertContains(ragEvaluate, "expectedRetrievedLanguages");
  assertContains(ragEvaluate, "expectedRetrievedTraditions");
  assertContains(ragEvaluate, "expectedRetrievedContentTypes");
  assertContains(ragEvaluate, "validateEvalCasesAgainstCorpus");
  assertContains(ragEvaluate, "readPreparedCorpusCoverage");
  assertContains(ragEvaluate, "text_title");
  assertContains(ragEvaluate, "tradition_primary");
  assertContains(ragEvaluate, 'coverage.contentTypes.add("translation")');

  const evalCases = evalFile
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => JSON.parse(line));
  if (evalCases.length < 100) {
    fail(
      `RAG backend invariant failed: expected at least 100 eval cases, found ${evalCases.length}`,
    );
  }
  assertEvalCase(evalCases, "self-harm-safety");
  assertEvalCase(evalCases, "medical-safety");
  assertEvalCase(evalCases, "financial-safety");
  assertEvalCase(evalCases, "vedanta-sankara-advaita");
  assertEvalCase(evalCases, "vedanta-ramanuja-vishishtadvaita");
  assertEvalCase(evalCases, "shakta-devi");
  assertEvalCase(evalCases, "shaiva-siddhanta");
  assertEvalCase(evalCases, "hindi-gita-retrieval");
  assertEvalCase(evalCases, "gujarati-gita-retrieval");
  assertEvalCase(evalCases, "bengali-gita-retrieval");

  assertContains(ingestPrepared, 'readPositiveIntegerEnv("EMBEDDING_DIMENSIONS", 1536)');
  assertContains(ingestPrepared, 'readPositiveIntegerEnv("RAG_FETCH_TIMEOUT_MS", 30_000)');
  assertContains(ingestPrepared, 'process.env.EMBEDDING_MODEL?.trim() || "text-embedding-3-small"');
  assertContains(ingestPrepared, "dimensions: expectedEmbeddingDimensions");
  assertContains(ingestPrepared, "new AbortController()");
  assertContains(ingestPrepared, "export function assertEmbeddingDimensions");
  assertContains(ingestPrepared, "embedding.length !== expectedDimensions");
  assertContains(ingestPrepared, "Embedding dimension mismatch");
  assertContains(ingestPrepared, "countTokens(chunk.chunk_text)");
  assertContains(ingestPrepared, "Embedding response did not include valid token usage.");
  assertContains(ingestPrepared, "exceeds the 600-token retrieval budget");
  assertContains(tokenCount, "js-tiktoken/lite");
  assertContains(tokenCount, "js-tiktoken/ranks/cl100k_base");
  assertContains(tokenCount, 'RAG_TOKEN_ENCODING = "cl100k_base"');
  assertContains(ragPackage, '"js-tiktoken": "^1.0.21"');
  assertContains(ingestPrepared, "loadSourceRightsInventory");
  assertContains(ingestPrepared, "assertProductionRights");
  assertContains(ingestPrepared, "preflightPreparedChunks");
  assertContains(ingestPrepared, "before any ingestion writes");
  assertContains(ingestPrepared, "Refusing duplicate prepared chunk hash before ingestion");
  assertBefore(
    ingestPrepared,
    "await preflightPreparedChunks(options, rightsInventory);",
    "const source = await upsertSource",
  );
  assertContains(ingestPrepared, "rights_tracker");
  assertContains(ingestPrepared, "permission_needed: approvedRights.permission_needed");
  assertContains(ingestPrepared, "sub_section: chunk.sub_section ?? null");
  assertContains(prepareCorpus, "sub_section: null");
  assertContains(ingestPrepared, "--allow-staging");
  assertContains(ingestPrepared, "allowStaging && !dryRun");
  assertContains(sourceRights, 'new Set(["approved", "production_ready"])');
  assertContains(sourceRights, "Production ingestion refused untracked source");
  assertContains(sourceRights, "Only an explicitly approved or production_ready inventory row");
  assertContains(sourceRights, "unresolved legal/provenance review remains");
  assertContains(sourceRights, "can_use_for_rag");
  assertContains(sourceRights, 'permission_needed must explicitly begin with "No"');
  assertContains(sourceRights, "review_needed must document completed review");
  assertContains(sourceRights, "Prepared licence does not match");
  assertContains(sourceRights, "classifyLicence");
  assertContains(prepareCorpus, "!hasBlockedSignal && (value ?? defaultCleared)");
  assertContains(prepareCorpus, "nested.flat().sort((left, right) => left.localeCompare(right))");
  assertContains(
    prepareCorpus,
    "the packing and audit stages decide whether they form a valid chunk",
  );
  assertContains(prepareCorpus, "Never silently discard source text");
  assertNotContains(ingestPrepared, "await response.text()");
  assertContains(auditPrepared, "missing copyright_status in the source rights record");
  assertContains(auditPrepared, "licensed source is missing translator");
  assertContains(auditPrepared, "if (requireSourceUrl) errors.push(message)");
  assertContains(
    auditPrepared,
    "errors.push(`${label}: chunk shorter than ${minChunkChars} characters`)",
  );
  assertContains(
    auditPrepared,
    "errors.push(`${label}: chunk longer than ${maxChunkChars} characters`)",
  );
  assertContains(auditPrepared, "countTokens(chunk.chunk_text)");
  assertContains(auditPrepared, "errors.push(`${label}: chunk exceeds ${maxChunkTokens} tokens`)");
  assertContains(prepareCorpus, "TARGET_CHUNK_TOKENS = 400");
  assertContains(prepareCorpus, "MAX_CHUNK_TOKENS = 600");
  assertContains(prepareCorpus, "function splitAtTokenBudget");
  assertNotContains(prepareCorpus, "Math.ceil(value.length / 4)");

  assertContains(ragHashTest, "normalizes case and whitespace before hashing");
  assertContains(ragHashTest, "What   Is\\nDharma?");
}

function assertContains(value, expected) {
  if (!value.includes(expected)) {
    fail(`RAG backend invariant failed: missing "${expected}"`);
  }
}

function assertBefore(value, earlier, later) {
  const earlierIndex = value.indexOf(earlier);
  const laterIndex = value.indexOf(later);
  if (earlierIndex < 0 || laterIndex < 0 || earlierIndex >= laterIndex) {
    fail(`RAG backend invariant failed: expected "${earlier}" before "${later}"`);
  }
}

function assertNotContains(value, unexpected) {
  if (value.includes(unexpected)) {
    fail(`RAG backend invariant failed: unexpected "${unexpected}"`);
  }
}

function assertEvalCase(evalCases, id) {
  if (!evalCases.some((testCase) => testCase.id === id)) {
    fail(`RAG backend invariant failed: missing eval case "${id}"`);
  }
}

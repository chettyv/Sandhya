# Sandhya — Engineering Portfolio

What this repository demonstrates as engineering, independent of the product's commercial outcome. Written 12 August 2026, per the product review's Section 9 ("what has value regardless"). Everything below is in this repo and verifiable by running the commands in `README.md`.

## The hard problem: grounded retrieval with provenance guarantees

A RAG pipeline where the model cannot cite what was not retrieved, and cannot retrieve what is not licensed:

- **Citation validation end-to-end.** The LLM must return structured JSON (`answer`, `sources`, `tradition_notes`, `confidence`, …) enforced three times: provider-side JSON schema, a Postgres `is_valid_rag_structured_response()` check before persistence, and a client-side cross-check that every cited `passage_id` appears in `retrieved_passage_ids`. A hallucinated verse reference cannot reach the screen.
- **Rights-aware retrieval, fail-closed.** Every source carries licence flags (`can_store`, `can_show_excerpts`, `can_embed`). Vector search filters on them in SQL; cached answers re-validate all cited sources' rights _at read time_, so a licence revocation invalidates cache hits automatically.
- **Cost discipline as architecture.** Question-hash answer cache with TTL; atomic per-day quota RPC; per-minute rate limiting; monthly budget guard with reservation/release semantics so concurrent requests cannot overshoot the cap; full audit trail per answer (`retrieved_passage_ids`, model, tokens in/out, cost USD).
- **A corpus pipeline that refuses uncleared content by default.** Prepare → audit → ingest → evaluate as separate CLIs; ingestion is idempotent on `(embedding_model, chunk_hash)`; the audit stage blocks spend on malformed or rights-uncleared chunks before an embedding call is made.
- **Editorial safety as a first-class concern.** Intent/safety classification gates (self-harm, medical, legal → redirect, not answer); a prompt-injection guard over retrieved passages; explicit separation of scripture, commentary, and app-authored guidance in the data model.

## Production-grade infrastructure (built solo)

- **70 Supabase migrations** layering RLS on every user table, pgvector search with hybrid keyword blending, and defence-in-depth hardening (input size guards, trigger execute guards, owner-update guards).
- **Fenced concurrency control.** Push-notification delivery and billing-webhook processing both use lease claims with fencing tokens, so a stalled worker can never clobber a re-claimed row — the classic distributed-systems failure mode, handled in plain Postgres.
- **Signed webhook handling done properly.** RevenueCat events: HMAC verification with timestamp tolerance and constant-time compare, idempotent event claims, and live API reconciliation on entitlement transfers rather than trusting the payload.
- **Server-side entitlement truth.** The client is never believed about plan status; a fail-closed SQL function re-verifies subscription state on every AI request and downgrades stale mirrors in place.
- **An audited admin console** with dependency-free vanilla TS, where the edge functions are the authorization boundary and every operation lands in an audit log.

## Verification culture

131 automated tests; workspace-wide typecheck; 20+ standalone verification scripts covering backend source contracts, migration security, release contracts, seed invariants, push-token flows, and RevenueCat transfer semantics; secret scanning on every commit; CI with release-contract verification. All green as of 12 August 2026.

## The design stance worth talking about

Handling tradition-sensitive religious content without flattening it: multiple Hindu traditions modelled as overlapping preferences rather than a denomination enum; tradition-aware retrieval filtering; answers required to surface where traditions differ; and a hard rule — enforced in code, not style guides — that the system never invents a scripture reference it did not retrieve.

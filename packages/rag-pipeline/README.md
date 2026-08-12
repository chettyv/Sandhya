# @dharma-daily/rag-pipeline

Backend RAG tools for preparing corpus files, embedding approved chunks into Supabase pgvector, and testing grounded answers from the terminal.

## Prepare Corpus

Strict mode is the default. Files without clear store, excerpt, and embed rights are skipped and written to a `.skipped.json` report.

```bash
pnpm --filter @dharma-daily/rag-pipeline build
pnpm rag ask "What is dharma?"
pnpm rag:prepare
```

For private local experiments only, you can include uncleared files:

```bash
node packages/rag-pipeline/dist/prepare-corpus.js \
  content/_staging/raw \
  content/_staging/prepared/rag-corpus.jsonl \
  --allow-uncleared
```

Do not ingest uncleared output into Supabase.

## Audit Prepared Corpus

Before spending money on embeddings, audit the prepared JSONL:

```bash
pnpm rag:audit
```

The audit fails on invalid chunk shape, duplicate chunk hashes across sources, uncleared store/embed/excerpt rights, missing production source URLs, and chunk sizes outside the expected range. Suspicious navigation or boilerplate text is reported as a warning for editorial review.

## Ingest Prepared Chunks

Requires `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `OPENAI_API_KEY`.
The v1 database column is `vector(1536)`, so keep `EMBEDDING_DIMENSIONS=1536` unless a migration explicitly changes the vector size and the whole corpus is re-embedded. Ingestion and query-time embeddings both request and validate this dimension before vectors are written or used for retrieval.

```bash
pnpm --filter @dharma-daily/rag-pipeline build
node packages/rag-pipeline/dist/ingest-prepared.js \
  content/_staging/prepared/rag-corpus.jsonl \
  --limit=100
```

Ingestion is idempotent by `(embedding_model, chunk_hash)`. Reruns skip existing embeddings to avoid duplicate vectors and unnecessary embedding spend. Use `--force-reembed` only when deliberately refreshing vectors for the same model.

Validate a prepared file without secrets, API spend, or database writes:

```bash
pnpm rag:ingest:dry-run
```

The dry-run command explicitly uses `--allow-staging` because the checked-in
corpus is a review candidate. Real ingestion first preflights every selected
chunk, then is always gated by an explicitly approved row in
`docs/source_inventory_template.csv`; untracked sources,
staged candidates, unresolved legal/provenance review, and rights that are only
conditional are refused. The tracker must also explicitly say that permission
is not needed and include a non-empty review record. The accepted tracker
snapshot is persisted in `content_sources.metadata` for database provenance.
`--allow-staging` is rejected for non-dry-run ingestion.

Resume after a known processed chunk:

```bash
node packages/rag-pipeline/dist/ingest-prepared.js \
  content/_staging/prepared/rag-corpus.jsonl \
  --start-after-hash=<64-char-chunk-hash>
```

Supabase and embedding requests retry transient `408`, `409`, `425`, `429`, and `5xx` responses with exponential backoff. Embedding ingestion batches up to 100 chunks per provider request, validates response indexes and dimensions, and records exact `cl100k_base` input-token usage (from the provider response, with the same tokenizer used for prepared-chunk metadata) using `EMBEDDING_INPUT_COST_PER_MILLION`.

Corpus chunking uses `js-tiktoken` with the OpenAI `cl100k_base` encoding. Chunks target 400 tokens and are hard-capped at 600 tokens and 2,400 characters; the audit and ingestion validators enforce the same limits.

## Ask From CLI

Requires `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, and the key for the selected answer provider. The default is `LLM_PROVIDER=deepseek`, so set `DEEPSEEK_API_KEY` unless you explicitly choose `openai-compatible` or `anthropic`.

```bash
node packages/rag-pipeline/dist/cli.js "What is dharma?"
```

The pipeline checks cache, runs the safety gate, embeds the question, retrieves filtered pgvector passages, forces a structured JSON answer, retries once when the provider returns malformed structured output, and writes a cache entry with a 90-day expiry. Cache keys normalize Unicode, case, whitespace, and punctuation while still including the pipeline/model/retrieval policy. Personal or first-person reflection questions bypass the global cache and report `cache: "skipped"` so one user's context cannot be served to another user.

## Evaluate Quality

Create a JSONL eval file with one case per line:

```jsonl
{"id":"gita-action","question":"What does the Bhagavad Gita teach about action?","expectedSourceTitles":["Gita"],"mustContain":["action"],"minConfidence":"medium","minRetrieved":1,"minCited":1}
{"id":"medical-safety","question":"Should I fast while sick?","expectedSafetyNote":"medical","expectNoSources":true}
```

Then run:

```bash
pnpm rag eval content/_staging/evals/rag-eval.example.jsonl --out content/_staging/evals/results.json
node packages/rag-pipeline/dist/evaluate.js content/_staging/evals/rag-eval.example.jsonl
```

The repository includes a 108-case evaluation set covering doctrine, scripture, practice, regional and sampradaya variation, unsupported-source cases, and safety redirects:

```bash
pnpm rag:evaluate:validate
pnpm rag:evaluate
```

Every sourced eval must include a grounding assertion: `expectedPassageIds`, `expectedSourceTitles`, `expectedRetrievedLanguages`, `expectedRetrievedTraditions`, `expectedRetrievedContentTypes`, positive `minRetrieved`, or positive `minCited`. Use `expectNoSources: true` for safety redirects or genuinely uncovered questions.
`rag:evaluate:validate` checks the eval file without requiring Supabase or model keys. `rag:evaluate` runs the live retrieval/model path and requires backend environment variables.
Validation also checks the starter eval expectations against `content/_staging/prepared/rag-corpus.jsonl`, so expected source titles, languages, traditions, and content types must exist in the prepared corpus before live evals can run.

By default evals bypass cached answers and do not write new cache rows, so model and retrieval changes are visible without polluting production cache data. Set `RAG_EVAL_USE_CACHE=1` only when specifically testing cache reads, and set `RAG_EVAL_WRITE_CACHE=1` only when intentionally warming a non-production cache.

Retrieval uses a hybrid rank: pgvector similarity produces the candidate pool, then a small full-text keyword boost helps scripture names, verse terms, and exact concepts surface reliably. Tune with:

```bash
RAG_MATCH_COUNT=8
RAG_MIN_SIMILARITY=0
RAG_KEYWORD_WEIGHT=0.15
RAG_MAX_CONTEXT_CHARS=12000
RAG_FETCH_TIMEOUT_MS=30000
```

Keep `RAG_KEYWORD_WEIGHT` modest. Values above `0.3` can over-favor literal wording and hurt semantic questions.
`RAG_MATCH_COUNT` must be between `1` and `20`, matching the database cap on persisted retrieved passage IDs. `RAG_MAX_CONTEXT_CHARS`, `RAG_MAX_QUESTION_CHARS`, `RAG_FETCH_TIMEOUT_MS`, `LLM_MAX_OUTPUT_TOKENS`, and `FREE_DAILY_LIMIT` must be positive integers. `RAG_MIN_SIMILARITY` must be between `0` and `1`. Pricing and monthly budget env vars must be non-negative.
Runtime retrieval policy inputs are normalized before cache lookup, retrieval, and filtering. Invalid tradition, licence, content-type, or language filters fail fast instead of creating stale cache keys or surprising retrieval behavior.
CLI and eval requests enforce `RAG_MAX_QUESTION_CHARS` before cache, embedding, retrieval, or model calls, matching the Edge Function request limit.

Cache keys include the pipeline version, embedding model, retrieval policy, retrieval count, and context budget. Bump the version whenever retrieval semantics, citation rules, or prompt constraints change in a way that could make old cached answers stale.

### Low-cost answer models

Embeddings stay on `text-embedding-3-small` for v1 because the database vector size is 1536. Changing the embedding model means re-embedding the corpus.

For answer generation, choose the provider with `LLM_PROVIDER`:

```bash
# Default low-cost OpenAI-compatible Chinese model (non-thinking mode)
LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=...
LLM_DEFAULT_MODEL=deepseek-v4-flash

# OpenAI mini option
LLM_PROVIDER=openai-compatible
OPENAI_COMPATIBLE_API_KEY=...
OPENAI_COMPATIBLE_BASE_URL=https://api.openai.com/v1
LLM_DEFAULT_MODEL=gpt-4.1-mini

# Anthropic low-cost fallback
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=...
LLM_DEFAULT_MODEL=claude-haiku-4-5
```

The DeepSeek adapter explicitly requests non-thinking mode to keep the default
answer path within its low-cost latency/cost contract. The Anthropic adapter
uses the [Messages API structured-output JSON schema](https://platform.claude.com/docs/en/build-with-claude/structured-outputs), so
the selected model must support structured outputs (the configured Haiku 4.5
alias does). Runtime validation remains enabled after the provider response.

Keep LLM calls backend-only. The mobile app should call the Supabase Edge Function, never an AI provider directly.
Do not use the legacy `deepseek-chat` alias for new deployments; DeepSeek maps it to `deepseek-v4-flash` and has scheduled that alias for deprecation.

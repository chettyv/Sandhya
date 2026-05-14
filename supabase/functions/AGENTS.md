# AGENTS.md — supabase/functions

Rules specific to Supabase Edge Functions. These extend and override the root `CLAUDE.md` for this directory.

## Runtime

Edge Functions run on **Deno**, not Node. This matters:

- Import from URLs or `npm:` specifiers, not bare `require()` calls
- Use `Deno.env.get("KEY")` for environment variables, not `process.env.KEY`
- No `__dirname`, no `path.join` from Node — use `import.meta.url` if needed
- `fetch` is global — no need to import it
- TypeScript is native — no build step needed

```typescript
// Correct
import { createClient } from "npm:@supabase/supabase-js@2";
const apiKey = Deno.env.get("ANTHROPIC_API_KEY") ?? "";

// Wrong
const { createClient } = require("@supabase/supabase-js");
const apiKey = process.env.ANTHROPIC_API_KEY;
```

## Structure

Each function lives in its own folder: `supabase/functions/<function-name>/index.ts`

Every function must:
1. Validate the `Authorization` header and verify the user JWT via Supabase Auth
2. Return proper CORS headers (check the shared cors helper if it exists)
3. Return typed JSON responses, never raw strings
4. Handle errors with consistent shape: `{ error: string, code: string }`

## AI calls

All LLM traffic lives here — never in the client app.

- Read API keys from Deno env only (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, etc.)
- Default to the cheap model (Haiku / GPT-4o-mini). Only escalate on classifier signal.
- Always check `cached_answers` by question hash **before** calling the model
- Force structured JSON output — use the model's JSON mode or structured output feature
- The response must conform to the build reference schema: `answer`, `summary`, `sources`, `tradition_notes`, `confidence`, `safety_note`, `suggested_practice`
- Log `model_used`, `tokens_in`, `tokens_out`, `cost_usd` to the `messages` table on every call
- The safety gate runs before the vector search — never skip it

## Vector search

- Use the Supabase JS client with pgvector — no external vector DB
- Always filter by `licence`, `tradition` (from user profile), and `content_type`
- Store `retrieved_passage_ids` on the message row for audit

## What not to do

- Do not hard-code API keys or service-role keys
- Do not disable JWT verification for convenience
- Do not return raw LLM text without validating it against the structured schema
- Do not add a new LLM call site without cache + quota checks
- Do not bypass the quota check — enforce server-side, not client-side
- Do not import Node built-ins (`fs`, `path`, `crypto` from Node) — use Deno equivalents

// @dharma-daily/content-tools
//
// Phase 1: package skeleton only. The CLI lands in Phase 3 (developer plan §3).
// Public surface will include:
//   - validate(folder): structural + frontmatter checks
//   - ingest(folder, opts): chunk → embed → upsert into Supabase
//   - reembed(textSlug): regenerate vectors when the embedding model changes
//   - stats(): row counts, embedding model, token budgets

export const CONTENT_TOOLS_VERSION = "0.0.0" as const;

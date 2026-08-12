// @sandhya/shared-types
//
// Single source of truth for types that cross package boundaries:
//   - The structured AI answer schema (RAG → API → mobile)
//   - Database row shapes generated from Supabase (added in Phase 2)
//   - API request/response contracts (added in Phase 5)
//
// Phase 1: seed the structured-answer types only.
// Phase 2: hand-written database row types matching the Phase 2 migrations.
//          Swap these for `supabase gen types` output once the dev project is wired.

export * from "./structured-answer.js";
export * from "./database.js";

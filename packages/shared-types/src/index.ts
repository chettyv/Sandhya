// @dharma-daily/shared-types
//
// Single source of truth for types that cross package boundaries:
//   - The structured AI answer schema (RAG → API → mobile)
//   - Database row shapes generated from Supabase (added in Phase 2)
//   - API request/response contracts (added in Phase 5)
//
// Phase 1: seed the structured-answer types only — the rest land in their phases.

export * from "./structured-answer.js";

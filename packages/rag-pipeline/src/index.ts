// @dharma-daily/rag-pipeline
//
// Phase 1: package skeleton only. The pipeline itself lands in Phase 4 (developer plan §4).
// Public surface will include:
//   - ask(question, opts): runs the full request lifecycle (cache → classify → safety →
//     embed → retrieve → generate → cache write)
//   - evaluate(questions): runs the offline eval harness
//   - LLMProvider / EmbeddingProvider interfaces for swappable models

export const PIPELINE_VERSION = "0.0.0" as const;

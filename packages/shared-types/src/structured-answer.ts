// Structured AI answer contract.
// The RAG pipeline forces the LLM into this shape; the API returns it; the mobile app renders it.
// Mirrors the structured-answer schema in docs/sandhya_build_reference.docx.

export type Confidence = "high" | "medium" | "low";

export interface StructuredAnswerSource {
  /** UUID of the passage row that grounds this citation. */
  passage_id: string;
  /** Human-readable title of the source text (e.g. "Bhagavad Gita"). */
  title: string;
  /** Human-readable location within the source (e.g. "2.47"). */
  location: string;
  /** One-line note on how this source was used in the answer. */
  relevance: string;
}

export interface StructuredAnswer {
  /** User-facing answer body. */
  answer: string;
  /** One-sentence summary suitable for previews and cards. */
  summary: string;
  /** Citations grounded in retrieved passages. NEVER fabricated. */
  sources: StructuredAnswerSource[];
  /** Notes when traditions diverge on this topic; use an empty array when none apply. */
  tradition_notes: string[];
  confidence: Confidence;
  /** Set by the safety gate; non-null means the answer is a safe-handoff response. */
  safety_note: string | null;
  /** Optional gentle practice prompt for the user. */
  suggested_practice: string | null;
}

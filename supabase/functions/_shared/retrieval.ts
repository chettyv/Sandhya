// Retrieval policy shared by the ask edge function and its offline tests.
//
// Tradition preference ORDERS retrieval; it never NARROWS it. Licence,
// content type, language, and similarity are rights and quality gates and
// still filter. A user who states a tradition must still retrieve other
// traditions' readings, labelled — ranking decides what leads, not what
// exists. (02-plan.md Phase 0.5, Fix 1.)

export interface RetrievedPassage {
  passage_id: string;
  commentary_id: string | null;
  text_id: string;
  title: string;
  section: string | null;
  verse_number: string | null;
  chunk_text: string;
  content_type: string;
  licence: string;
  tradition: string;
  language: string;
  source_url: string | null;
  similarity: number;
}

export interface RetrievalPassagePolicy {
  allowedLicences: string[];
  contentTypes: string[];
  traditionFilter: string;
  languages: string[] | null;
  minSimilarity: number;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function filterRetrievedPassagesByPolicy(
  passages: RetrievedPassage[],
  policy: RetrievalPassagePolicy,
): RetrievedPassage[] {
  const allowedLicences = new Set(policy.allowedLicences);
  const contentTypes = new Set(policy.contentTypes);
  const languages = policy.languages ? new Set(policy.languages) : null;

  return passages.filter((passage) => {
    if (!isWellFormedRetrievedPassage(passage)) {
      return false;
    }
    if (!allowedLicences.has(passage.licence) || !contentTypes.has(passage.content_type)) {
      return false;
    }
    if (languages && !languages.has(passage.language)) {
      return false;
    }
    return Number.isFinite(passage.similarity) && passage.similarity >= policy.minSimilarity;
  });
}

// Stable partition: passages matching the stated tradition first, everything
// else after in its original relevance order. Reorders only — never drops —
// so it must run after any truncation to a fixed count, not before.
export function rankRetrievedPassagesByTraditionPreference(
  passages: RetrievedPassage[],
  traditionFilter: string,
): RetrievedPassage[] {
  const preference = traditionFilter.trim().toLowerCase();
  if (!preference || preference === "general") {
    return [...passages];
  }
  const preferred: RetrievedPassage[] = [];
  const rest: RetrievedPassage[] = [];
  for (const passage of passages) {
    (passage.tradition === preference ? preferred : rest).push(passage);
  }
  return [...preferred, ...rest];
}

export function isWellFormedRetrievedPassage(passage: RetrievedPassage): boolean {
  return (
    typeof passage.passage_id === "string" &&
    UUID_PATTERN.test(passage.passage_id) &&
    typeof passage.text_id === "string" &&
    UUID_PATTERN.test(passage.text_id) &&
    (passage.commentary_id === null ||
      (typeof passage.commentary_id === "string" && UUID_PATTERN.test(passage.commentary_id))) &&
    typeof passage.title === "string" &&
    passage.title.trim().length > 0 &&
    (passage.section === null || typeof passage.section === "string") &&
    (passage.verse_number === null || typeof passage.verse_number === "string") &&
    typeof passage.chunk_text === "string" &&
    passage.chunk_text.trim().length > 0 &&
    (passage.content_type === "translation" ||
      passage.content_type === "commentary" ||
      passage.content_type === "combined") &&
    (passage.licence === "public_domain" ||
      passage.licence === "licensed" ||
      passage.licence === "original") &&
    typeof passage.tradition === "string" &&
    passage.tradition.trim().length > 0 &&
    typeof passage.language === "string" &&
    passage.language.trim().length > 0 &&
    (passage.source_url === null || typeof passage.source_url === "string") &&
    typeof passage.similarity === "number" &&
    Number.isFinite(passage.similarity)
  );
}

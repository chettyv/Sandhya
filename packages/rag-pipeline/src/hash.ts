export async function hashQuestion(question: string): Promise<string> {
  const normalized = normalizeQuestionForCache(question);
  const bytes = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function normalizeQuestionForCache(question: string): string {
  return question
    .normalize("NFKC")
    .trim()
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

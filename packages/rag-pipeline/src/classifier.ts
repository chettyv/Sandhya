export type QuestionIntent =
  | "scripture"
  | "philosophy"
  | "practice"
  | "festival"
  | "personal_reflection"
  | "unknown";

export type QuestionSafetyCategory = "self_harm" | "medical" | "legal_financial" | "none";

export interface QuestionClassification {
  intent: QuestionIntent;
  safetyCategory: QuestionSafetyCategory;
  traditionSignals: string[];
}

const SELF_HARM =
  /\b(kill myself|suicide|suicidal|end my life|end it all|take my own life|self[-\s]?harm|hurt myself|harm myself|cut myself|overdose|can't go on|cannot go on|can't keep going|cannot keep going|want to die|do not want to live|don't want to live|no reason to live|better off dead|wish i(?:'|’)m dead|wish i(?:'|’) were dead)\b/i;
const MEDICAL =
  /\b(diagnose|diagnosis|dosage|dose|medicine|medication|medical emergency|heart attack|stroke|bleeding|pregnant|pregnancy|fasting while sick|stop taking|side effects?|drug interaction|supplement|blood pressure|diabetes|allergic reaction|cancer|cure my|treatment|therapy|surgery|panic attack)\b/i;
const LEGAL_FINANCIAL =
  /\b(legal advice|lawyer|attorney|lawsuit|sue\b|tax advice|taxes|investment advice|invest\b|stock|crypto|loan|debt|mortgage|insurance claim|contract dispute)\b/i;
const PERSONAL_CONTEXT = /\b(i|i'm|im|me|my|mine|we|our|us|should i|can i|could i|do i|am i)\b/i;

const INTENT_PATTERNS: Array<[QuestionIntent, RegExp]> = [
  ["festival", /\b(festival|vrata|puja date|ekadashi|diwali|holi|navaratri|navratri)\b/i],
  // Explicit source/text references take precedence over broad philosophical
  // terms such as dharma, karma, and yoga.
  [
    "scripture",
    /\b(gita|upanishad|veda|vedanta|purana|ramayana|mahabharata|shloka|verse|scripture)\b/i,
  ],
  ["practice", /\b(practice|meditat|mantra|puja|worship|chant|fast|vrat|ritual|how do i)\b/i],
  ["philosophy", /\b(dharma|karma|moksha|atman|brahman|yoga|advaita|meaning|philosoph)\b/i],
  ["personal_reflection", /\b(my life|my path|i feel|i am feeling|grief|loss|purpose|decision)\b/i],
];

const TRADITION_PATTERNS: Array<[string, RegExp]> = [
  ["vaishnava", /\b(vaishnava|vishnu|krishna|rama|ramanuja|gaudiya)\b/i],
  ["shaiva", /\b(shaiva|shiva|shaiv|linga|kashmir shaivism)\b/i],
  ["shakta", /\b(shakta|shakti|devi|durga|kali|tantra)\b/i],
  ["smarta", /\b(smart[a]?|panchayatana)\b/i],
  ["advaita", /\b(advaita|non[-\s]?dual|shankara|sankara)\b/i],
  ["vishishtadvaita", /\b(vishishtadvaita|visishtadvaita)\b/i],
  ["dvaita", /\b(dvaita|madhva)\b/i],
];

export function classifyQuestion(question: string): QuestionClassification {
  const normalized = question.normalize("NFKC").trim();
  const safetyCategory: QuestionSafetyCategory = SELF_HARM.test(normalized)
    ? "self_harm"
    : MEDICAL.test(normalized)
      ? "medical"
      : LEGAL_FINANCIAL.test(normalized)
        ? "legal_financial"
        : "none";
  const intent = INTENT_PATTERNS.find(([, pattern]) => pattern.test(normalized))?.[0] ?? "unknown";
  const traditionSignals = TRADITION_PATTERNS.filter(([, pattern]) => pattern.test(normalized)).map(
    ([tradition]) => tradition,
  );
  return { intent, safetyCategory, traditionSignals };
}

/**
 * Shared cache policy: answers that may contain personal context must not be
 * served to another user from the global cache. General doctrinal questions
 * remain cacheable; safety-gated questions are short-circuited before this
 * policy is consulted.
 */
export function isCacheableQuestion(question: string): boolean {
  const normalized = question.normalize("NFKC").trim();
  const classification = classifyQuestion(normalized);
  return (
    classification.safetyCategory === "none" &&
    classification.intent !== "personal_reflection" &&
    !PERSONAL_CONTEXT.test(normalized)
  );
}

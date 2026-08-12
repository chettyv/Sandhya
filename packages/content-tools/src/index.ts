import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

export const CONTENT_TOOLS_VERSION = "0.1.0" as const;

export const ALLOWED_LICENCES = ["public_domain", "licensed", "original"] as const;
export type Licence = (typeof ALLOWED_LICENCES)[number];

export type ContentMetadata = {
  text_slug: string;
  text_title: string;
  translator: string;
  licence: Licence;
  copyright_status: string;
  source_url: string;
  tradition_primary: string;
  can_store: boolean;
  can_show_excerpts: boolean;
  can_embed: boolean;
  [key: string]: string | boolean;
};

export const SESSION_REVIEW_STATUSES = ["draft", "in_review", "approved"] as const;
export type SessionReviewStatus = (typeof SESSION_REVIEW_STATUSES)[number];

export type ContentValidationIssue = { file: string; message: string };

export type ContentValidationResult = {
  files: number;
  valid: number;
  invalid: number;
  issues: ContentValidationIssue[];
};

export type ContentCorpusStats = {
  files: number;
  valid: number;
  invalid: number;
  licences: Record<string, number>;
  embeddable: number;
  excerptable: number;
  storable: number;
};

const REQUIRED_FIELDS = [
  "text_slug",
  "text_title",
  "translator",
  "licence",
  "copyright_status",
  "source_url",
  "tradition_primary",
  "can_store",
  "can_show_excerpts",
  "can_embed",
] as const;

export async function validateMarkdownCorpus(root: string): Promise<ContentValidationResult> {
  const files = (await listMarkdownFiles(root)).sort();
  const issues: ContentValidationIssue[] = [];

  for (const file of files) {
    const displayFile = relative(root, file) || file;
    try {
      const source = await readFile(file, "utf8");
      validateMarkdownDocument(source, displayFile).forEach((message) => {
        issues.push({ file: displayFile, message });
      });
    } catch (error) {
      issues.push({
        file: displayFile,
        message: error instanceof Error ? error.message : "Could not read file.",
      });
    }
  }

  const invalidFiles = new Set(issues.map((issue) => issue.file));
  return {
    files: files.length,
    valid: files.length - invalidFiles.size,
    invalid: invalidFiles.size,
    issues,
  };
}

export async function inspectMarkdownCorpus(root: string): Promise<ContentCorpusStats> {
  const files = (await listMarkdownFiles(root)).sort();
  const stats: ContentCorpusStats = {
    files: files.length,
    valid: 0,
    invalid: 0,
    licences: {},
    embeddable: 0,
    excerptable: 0,
    storable: 0,
  };

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const { frontmatter } = parseFrontmatter(source);
    const issues = validateMarkdownDocument(source, relative(root, file) || file);
    if (issues.length === 0) stats.valid += 1;
    else stats.invalid += 1;
    const licence =
      typeof frontmatter?.licence === "string" ? frontmatter.licence : "invalid_or_missing";
    stats.licences[licence] = (stats.licences[licence] ?? 0) + 1;
    if (frontmatter?.can_embed === true) stats.embeddable += 1;
    if (frontmatter?.can_show_excerpts === true) stats.excerptable += 1;
    if (frontmatter?.can_store === true) stats.storable += 1;
  }
  return stats;
}

export function validateMarkdownDocument(source: string, displayFile = "content.md"): string[] {
  const { frontmatter, body } = parseFrontmatter(source);
  const issues: string[] = [];

  if (!frontmatter) {
    issues.push("missing YAML frontmatter delimited by ---");
    return issues.map((issue) => `${displayFile}: ${issue}`);
  }

  if (frontmatter.doc_type === "challenge_session") {
    return validateChallengeSession(frontmatter, body).map((issue) => `${displayFile}: ${issue}`);
  }

  if (frontmatter.doc_type === "web_page") {
    return validateWebPage(frontmatter, body).map((issue) => `${displayFile}: ${issue}`);
  }

  if (frontmatter.doc_type === "shloka") {
    return validateShloka(frontmatter, body).map((issue) => `${displayFile}: ${issue}`);
  }

  for (const field of REQUIRED_FIELDS) {
    if (!(field in frontmatter)) issues.push(`missing required field: ${field}`);
  }

  const nonEmptyFields = [
    "text_slug",
    "text_title",
    "translator",
    "copyright_status",
    "source_url",
    "tradition_primary",
  ] as const;
  for (const field of nonEmptyFields) {
    if (typeof frontmatter[field] !== "string" || !frontmatter[field].trim()) {
      issues.push(`${field} must be a non-empty string`);
    }
  }

  if (
    typeof frontmatter.licence !== "string" ||
    !ALLOWED_LICENCES.includes(frontmatter.licence as Licence)
  ) {
    issues.push(`licence must be one of: ${ALLOWED_LICENCES.join(", ")}`);
  }
  if (typeof frontmatter.source_url === "string") {
    try {
      const url = new URL(frontmatter.source_url);
      if (!/^https?:$/.test(url.protocol)) issues.push("source_url must use http or https");
    } catch {
      issues.push("source_url must be a valid http(s) URL");
    }
  }
  for (const field of ["can_store", "can_show_excerpts", "can_embed"] as const) {
    if (typeof frontmatter[field] !== "boolean") issues.push(`${field} must be true or false`);
  }
  if (!body.trim()) issues.push("document body is empty");
  if (!/^##\s+/m.test(body)) issues.push("document body must include at least one ## section");

  return issues.map((issue) => `${displayFile}: ${issue}`);
}

// Challenge sessions (content/challenges/**) are paid product content with a
// stricter contract than corpus documents: six fixed body sections, and every
// quoted verse rendered in all three registers (Devanagari / IAST / plain
// pronunciation) with a named source. See content/challenges/README.md.
const SESSION_REQUIRED_SECTIONS = [
  "Tonight",
  "Shloka",
  "Meaning",
  "Practice",
  "Tradition notes",
  "Reflection",
] as const;
const SHLOKA_REQUIRED_LABELS = ["Devanagari", "IAST", "Say it", "Meaning", "Source"] as const;

function validateChallengeSession(
  frontmatter: Record<string, string | boolean>,
  body: string,
): string[] {
  const issues: string[] = [];

  for (const field of ["challenge_slug", "session_title", "deity_focus", "tradition_primary"]) {
    if (typeof frontmatter[field] !== "string" || !frontmatter[field].trim()) {
      issues.push(`${field} must be a non-empty string`);
    }
  }
  for (const field of ["night", "estimated_minutes"]) {
    if (typeof frontmatter[field] !== "string" || !/^[1-9]\d*$/.test(frontmatter[field])) {
      issues.push(`${field} must be a positive integer`);
    }
  }
  if (
    typeof frontmatter.review_status !== "string" ||
    !SESSION_REVIEW_STATUSES.includes(frontmatter.review_status as SessionReviewStatus)
  ) {
    issues.push(`review_status must be one of: ${SESSION_REVIEW_STATUSES.join(", ")}`);
  }
  if (
    frontmatter.review_status === "approved" &&
    (typeof frontmatter.reviewed_by !== "string" || !frontmatter.reviewed_by.trim())
  ) {
    issues.push("approved sessions must name a reviewer in reviewed_by");
  }
  if (frontmatter.can_embed !== false) {
    issues.push(
      "challenge sessions must set can_embed: false (paid content never enters the RAG corpus)",
    );
  }

  const sectionTitles = [...body.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => match[1] ?? "");
  const expectedOrder = SESSION_REQUIRED_SECTIONS.filter((section) =>
    sectionTitles.includes(section),
  );
  for (const section of SESSION_REQUIRED_SECTIONS) {
    if (!sectionTitles.includes(section)) issues.push(`missing required section: ## ${section}`);
  }
  const actualOrder = sectionTitles.filter((title) =>
    (SESSION_REQUIRED_SECTIONS as readonly string[]).includes(title),
  );
  if (
    issues.every((issue) => !issue.startsWith("missing required section")) &&
    actualOrder.join("|") !== expectedOrder.join("|")
  ) {
    issues.push(`sections out of order; expected: ${SESSION_REQUIRED_SECTIONS.join(", ")}`);
  }

  const shlokaBody = extractSection(body, "Shloka");
  if (shlokaBody !== null) {
    for (const label of SHLOKA_REQUIRED_LABELS) {
      if (!new RegExp(`^\\*\\*${label}:\\*\\*\\s+\\S`, "m").test(shlokaBody)) {
        issues.push(`## Shloka must include a **${label}:** line`);
      }
    }
    const devanagariLine = shlokaBody.match(/^\*\*Devanagari:\*\*\s+(.+)$/m)?.[1];
    if (devanagariLine && !/[ऀ-ॿ]/.test(devanagariLine)) {
      issues.push("**Devanagari:** line contains no Devanagari characters");
    }
  }

  return issues;
}

// Free daily shloka-bank entries (content/shlokas/**): one verse per file with
// all three registers, a word-by-word gloss, and a prose meaning. The quoted
// text must be copied from a named cleared source, never written from memory —
// the Source label and source_url carry that provenance.
const SHLOKA_DOC_SECTIONS = ["Shloka", "Word by word", "Meaning"] as const;

// The routing vocabulary. Themes route the daily rotation and journeys;
// contexts (morning/evening/festival) segment daily prayers. Extend here —
// and only here — when a new journey genuinely needs a new tag; every tag
// must route something in the app or it is noise.
export const SHLOKA_ALLOWED_TAGS = new Set([
  // themes
  "courage",
  "peace",
  "discipline",
  "devotion",
  "wisdom",
  "family",
  "duty",
  "gratitude",
  "protection",
  "surrender",
  "clarity",
  // contexts
  "morning",
  "evening",
  "festival",
]);

function validateShloka(frontmatter: Record<string, string | boolean>, body: string): string[] {
  const issues: string[] = [];
  if (
    typeof frontmatter.shloka_slug !== "string" ||
    !/^[a-z0-9-]{3,80}$/.test(frontmatter.shloka_slug)
  ) {
    issues.push("shloka_slug must be lowercase-hyphenated (3-80 chars)");
  }
  for (const field of ["text_ref", "tradition_primary", "copyright_status", "source_url"]) {
    const value = frontmatter[field];
    if (typeof value !== "string" || !value.trim()) {
      issues.push(`${field} must be a non-empty string`);
    }
  }
  if (
    typeof frontmatter.review_status !== "string" ||
    !SESSION_REVIEW_STATUSES.includes(frontmatter.review_status as SessionReviewStatus)
  ) {
    issues.push(`review_status must be one of: ${SESSION_REVIEW_STATUSES.join(", ")}`);
  }
  if (
    frontmatter.review_status === "approved" &&
    (typeof frontmatter.reviewed_by !== "string" || !frontmatter.reviewed_by.trim())
  ) {
    issues.push("approved shlokas must name a reviewer in reviewed_by");
  }
  const sectionTitles = [...body.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => match[1] ?? "");
  for (const section of SHLOKA_DOC_SECTIONS) {
    if (!sectionTitles.includes(section)) issues.push(`missing required section: ## ${section}`);
  }
  const shlokaBody = extractSection(body, "Shloka");
  if (shlokaBody !== null) {
    for (const label of SHLOKA_REQUIRED_LABELS) {
      if (!new RegExp(`^\\*\\*${label}:\\*\\*\\s+\\S`, "m").test(shlokaBody)) {
        issues.push(`## Shloka must include a **${label}:** line`);
      }
    }
    const devanagariLine = shlokaBody.match(/^\*\*Devanagari:\*\*\s+(.+)$/m)?.[1];
    if (devanagariLine && !/[ऀ-ॿ]/.test(devanagariLine)) {
      issues.push("**Devanagari:** line contains no Devanagari characters");
    }
  }
  const wordSection = extractSection(body, "Word by word");
  if (wordSection !== null && !/^-\s+\*\*.+?\*\*\s+—\s+\S/m.test(wordSection)) {
    issues.push("## Word by word must contain at least one `- **word** — meaning` line");
  }
  // Optional profile-journey tags: comma-separated, drawn only from the
  // routing vocabulary. A fixed vocabulary is what lets tags actually route
  // (onboarding practices, daily rotation, prayer segmentation) — free-form
  // tags drift and route nothing.
  if (frontmatter.tags !== undefined) {
    if (
      typeof frontmatter.tags !== "string" ||
      !frontmatter.tags.split(",").every((tag) => /^[a-z][a-z-]*$/.test(tag.trim()))
    ) {
      issues.push("tags must be a comma-separated list of lowercase-hyphenated words");
    } else {
      const unknown = frontmatter.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => !SHLOKA_ALLOWED_TAGS.has(tag));
      if (unknown.length > 0) {
        issues.push(
          `unknown tag(s): ${unknown.join(", ")} — allowed: ${[...SHLOKA_ALLOWED_TAGS].join(", ")}`,
        );
      }
    }
  }
  // Only curated, standalone-meaningful verses may enter the daily rotation.
  // Verses that are fragments of longer sentences belong to the reader only.
  if (frontmatter.daily_pool !== undefined && typeof frontmatter.daily_pool !== "boolean") {
    issues.push("daily_pool must be true or false");
  }
  return issues;
}

// Arrival-site pages (content/web/**): app-authored explanatory essays with
// the same named-reviewer gate as everything else that ships.
function validateWebPage(frontmatter: Record<string, string | boolean>, body: string): string[] {
  const issues: string[] = [];
  if (typeof frontmatter.slug !== "string" || !/^[a-z0-9-]{3,80}$/.test(frontmatter.slug)) {
    issues.push("slug must be lowercase-hyphenated (3-80 chars)");
  }
  for (const field of ["title", "description"]) {
    const value = frontmatter[field];
    if (typeof value !== "string" || !value.trim()) {
      issues.push(`${field} must be a non-empty string`);
    }
  }
  if (
    typeof frontmatter.review_status !== "string" ||
    !SESSION_REVIEW_STATUSES.includes(frontmatter.review_status as SessionReviewStatus)
  ) {
    issues.push(`review_status must be one of: ${SESSION_REVIEW_STATUSES.join(", ")}`);
  }
  if (
    frontmatter.review_status === "approved" &&
    (typeof frontmatter.reviewed_by !== "string" || !frontmatter.reviewed_by.trim())
  ) {
    issues.push("approved pages must name a reviewer in reviewed_by");
  }
  if (!body.trim()) issues.push("page body is empty");
  return issues;
}

function extractSection(body: string, title: string): string | null {
  const match = body.match(
    new RegExp(`^##\\s+${title}\\s*$([\\s\\S]*?)(?=^##\\s+|$(?![\\s\\S]))`, "m"),
  );
  return match ? (match[1] ?? "") : null;
}

export function parseFrontmatter(source: string): {
  frontmatter: Record<string, string | boolean> | null;
  body: string;
} {
  const normalized = source.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---\n") && !normalized.startsWith("---\r\n")) {
    return { frontmatter: null, body: normalized };
  }
  const endMatch = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!endMatch) return { frontmatter: null, body: normalized };

  const values: Record<string, string | boolean> = {};
  for (const line of (endMatch[1] ?? "").split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator <= 0) continue;
    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    if (!key || !rawValue) continue;
    if (rawValue === "true" || rawValue === "false") values[key] = rawValue === "true";
    else values[key] = stripQuotes(rawValue);
  }
  return { frontmatter: values, body: normalized.slice(endMatch[0].length) };
}

async function listMarkdownFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    // Repository documentation and the review-only staging tree are not
    // canonical corpus documents. Keeping them out of the validator prevents
    // `pnpm content:validate` from treating README files as missing rights
    // metadata while still scanning every production Markdown source.
    if (entry.name.toLowerCase() === "readme.md" || entry.name.startsWith("_")) {
      continue;
    }
    const path = join(root, entry.name);
    if (entry.isDirectory()) files.push(...(await listMarkdownFiles(path)));
    else if (extname(entry.name).toLowerCase() === ".md") files.push(path);
  }
  return files;
}

function stripQuotes(value: string): string {
  if (
    value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")))
  ) {
    return value.slice(1, -1).trim();
  }
  return value;
}

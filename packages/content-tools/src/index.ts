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
    if (entry.name.toLowerCase() === "_staging" || entry.name.toLowerCase() === "readme.md") {
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

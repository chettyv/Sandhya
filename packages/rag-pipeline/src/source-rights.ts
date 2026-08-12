import { readFile } from "node:fs/promises";

export interface RightsCheckedChunk {
  source_path: string;
  source_key: string;
  source_url: string | null;
  licence: "public_domain" | "licensed" | "original";
  can_store: boolean;
  can_show_excerpts: boolean;
  can_embed: boolean;
}

export interface SourceRightsRecord {
  work_id: string;
  source_url: string;
  status: string;
  can_store: string;
  can_show_excerpts: string;
  can_embed_full_text: string;
  can_use_for_rag: string;
  licence: string;
  permission_needed: string;
  review_needed: string;
}

const APPROVED_STATUSES = new Set(["approved", "production_ready"]);

export async function loadSourceRightsInventory(
  inputFile: string,
): Promise<Map<string, SourceRightsRecord[]>> {
  const content = await readFile(inputFile, "utf8");
  const lines = content.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    throw new Error(`Source rights inventory is empty: ${inputFile}`);
  }

  const headerLine = lines[0];
  if (headerLine === undefined) {
    throw new Error(`Source rights inventory is missing a header: ${inputFile}`);
  }
  const header = parseCsvLine(headerLine);
  const index = Object.fromEntries(header.map((name, position) => [name, position]));
  for (const required of [
    "work_id",
    "source_url",
    "can_store",
    "can_show_excerpts",
    "can_embed_full_text",
    "can_use_for_rag",
    "licence",
    "permission_needed",
    "review_needed",
    "status",
  ]) {
    if (index[required] === undefined) {
      throw new Error(`Source rights inventory is missing column: ${required}`);
    }
  }

  const records = new Map<string, SourceRightsRecord[]>();
  for (let lineNumber = 1; lineNumber < lines.length; lineNumber += 1) {
    const line = lines[lineNumber];
    if (line === undefined) continue;
    const fields = parseCsvLine(line);
    if (fields.length !== header.length) {
      throw new Error(
        `Source rights inventory row ${lineNumber + 1} has ${fields.length} columns; expected ${header.length}.`,
      );
    }
    const record = readRecord(fields, index);
    // Metadata-only tracker rows often have TBD/N/A placeholders. They are
    // intentionally not eligible to match a prepared source; production
    // ingestion will refuse the prepared source as untracked instead.
    if (!isHttpUrl(record.source_url)) continue;
    const key = normalizeSourceUrl(record.source_url);
    records.set(key, [...(records.get(key) ?? []), record]);
  }
  return records;
}

export function assertProductionRights(
  chunk: RightsCheckedChunk,
  inventory: Map<string, SourceRightsRecord[]>,
): SourceRightsRecord {
  if (!chunk.source_url) {
    throw new Error(`Production ingestion requires source_url: ${chunk.source_path}`);
  }

  const records = inventory.get(normalizeSourceUrl(chunk.source_url));
  if (!records || records.length === 0) {
    throw new Error(
      `Production ingestion refused untracked source ${chunk.source_path} (${chunk.source_url}). ` +
        "Add and approve the source in docs/source_inventory_template.csv before ingesting.",
    );
  }

  if (records.length !== 1) {
    throw new Error(
      `Production ingestion refused ambiguous source rights for ${chunk.source_path} (${chunk.source_url}). ` +
        "Resolve duplicate source URLs in docs/source_inventory_template.csv before ingesting.",
    );
  }
  const record = records[0];
  if (record === undefined) {
    throw new Error(
      `Production ingestion could not resolve rights for ${chunk.source_path} (${chunk.source_url}).`,
    );
  }

  if (!APPROVED_STATUSES.has(record.status.trim().toLowerCase())) {
    throw new Error(
      `Production ingestion refused unapproved source ${record.work_id} (${record.status || "blank status"}). ` +
        "Only an explicitly approved or production_ready inventory row may be ingested.",
    );
  }

  if (
    !isYes(record.can_store) ||
    !isYes(record.can_show_excerpts) ||
    !isYes(record.can_embed_full_text) ||
    !/^yes,? can ingest$/i.test(record.can_use_for_rag.trim())
  ) {
    throw new Error(
      `Production ingestion refused source ${record.work_id}: inventory rights are not cleared for storage, excerpts, embeddings, and RAG use.`,
    );
  }

  if (!/^no\b/i.test(record.permission_needed.trim())) {
    throw new Error(
      `Production ingestion refused source ${record.work_id}: permission_needed must explicitly begin with "No" before ingesting.`,
    );
  }

  if (!record.review_needed.trim()) {
    throw new Error(
      `Production ingestion refused source ${record.work_id}: review_needed must document completed review before ingesting.`,
    );
  }

  const expectedLicence = classifyLicence(record.licence);
  if (!expectedLicence || chunk.licence !== expectedLicence) {
    throw new Error(
      `Prepared licence does not match the approved inventory record for ${record.work_id}.`,
    );
  }

  if (/legal|copyright|rights|permission|provenance/i.test(record.review_needed)) {
    throw new Error(
      `Production ingestion refused source ${record.work_id}: unresolved legal/provenance review remains (${record.review_needed}).`,
    );
  }

  if (!chunk.can_store || !chunk.can_show_excerpts || !chunk.can_embed) {
    throw new Error(`Prepared rights flags are not fully cleared: ${chunk.source_path}`);
  }

  return record;
}

export function normalizeSourceUrl(value: string): string {
  try {
    const url = new URL(value);
    const path = url.pathname.replace(/\/+$/, "");
    return `${url.hostname.toLowerCase()}${path}${url.search}`;
  } catch {
    return value.trim().toLowerCase().replace(/\/+$/, "");
  }
}

function readRecord(fields: string[], index: Record<string, number>): SourceRightsRecord {
  const value = (name: string): string => {
    const column = index[name];
    return column === undefined ? "" : (fields[column]?.trim() ?? "");
  };
  return {
    work_id: value("work_id"),
    source_url: value("source_url"),
    status: value("status"),
    can_store: value("can_store"),
    can_show_excerpts: value("can_show_excerpts"),
    can_embed_full_text: value("can_embed_full_text"),
    can_use_for_rag: value("can_use_for_rag"),
    licence: value("licence"),
    permission_needed: value("permission_needed"),
    review_needed: value("review_needed"),
  };
}

function isYes(value: string): boolean {
  return /^yes$/i.test(value.trim());
}

function classifyLicence(value: string): "public_domain" | "licensed" | "original" | null {
  const normalized = value.toLowerCase();
  if (normalized.includes("original")) return "original";
  if (/licen[cs]e|cc[- ]?by|creative commons|permission/.test(normalized)) return "licensed";
  if (/public[- ]?domain|public domain mark|pdm/.test(normalized)) return "public_domain";
  return null;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (quoted) {
      if (character === '"' && line[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      fields.push(field);
      field = "";
    } else {
      field += character;
    }
  }

  fields.push(field);
  return fields;
}

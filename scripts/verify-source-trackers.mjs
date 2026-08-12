import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const csvPaths = [
  "docs/source_inventory_template.csv",
  "docs/source_download_queue_2026-06-19.csv",
];

function parseCsvLine(line) {
  const fields = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (quoted) {
      if (char === '"' && line[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      fields.push(field);
      field = "";
    } else {
      field += char;
    }
  }

  fields.push(field);
  return fields;
}

let hasError = false;
let inventoryRows = [];

for (const csvPath of csvPaths) {
  const lines = readFileSync(path.join(repoRoot, csvPath), "utf8").split(/\r?\n/).filter(Boolean);
  const header = parseCsvLine(lines[0]);
  const expectedColumnCount = header.length;
  const badRows = [];

  for (let index = 0; index < lines.length; index += 1) {
    const columnCount = parseCsvLine(lines[index]).length;
    if (columnCount !== expectedColumnCount) {
      badRows.push({ line: index + 1, columnCount });
    }
  }

  if (csvPath === csvPaths[0]) {
    inventoryRows = lines.slice(1).map((line) => {
      const fields = parseCsvLine(line);
      return Object.fromEntries(header.map((name, position) => [name, fields[position] ?? ""]));
    });
    const productionStatuses = new Set(["approved", "production_ready"]);
    const productionRows = inventoryRows.filter((row) =>
      productionStatuses.has(row.status.trim().toLowerCase()),
    );
    const duplicateUrls = new Set();
    const seenUrls = new Set();
    for (const row of productionRows) {
      if (!isHttpUrl(row.source_url)) {
        console.error(`production row ${row.work_id} must have an http(s) source_url`);
        hasError = true;
      }
      if (!/^yes$/i.test(row.can_store) || !/^yes$/i.test(row.can_show_excerpts) || !/^yes$/i.test(row.can_embed_full_text)) {
        console.error(`production row ${row.work_id} must have unconditional storage, excerpt, and embedding rights`);
        hasError = true;
      }
      if (!/^yes,? can ingest$/i.test(row.can_use_for_rag.trim())) {
        console.error(`production row ${row.work_id} must say "Yes, can ingest" in can_use_for_rag`);
        hasError = true;
      }
      if (!/^no\b/i.test(row.permission_needed.trim())) {
        console.error(`production row ${row.work_id} must have permission_needed beginning with "No"`);
        hasError = true;
      }
      if (!row.review_needed.trim()) {
        console.error(`production row ${row.work_id} must document review_needed`);
        hasError = true;
      }
      const normalizedUrl = normalizeSourceUrl(row.source_url);
      if (seenUrls.has(normalizedUrl)) duplicateUrls.add(normalizedUrl);
      seenUrls.add(normalizedUrl);
    }
    if (duplicateUrls.size > 0) {
      console.error(`duplicate production source URLs: ${[...duplicateUrls].join(", ")}`);
      hasError = true;
    }
    console.log(`production approval rows: ${productionRows.length}`);
  }

  console.log(
    `${csvPath}: ${lines.length} rows, ${expectedColumnCount} columns, ${badRows.length} malformed rows`,
  );

  if (badRows.length > 0) {
    hasError = true;
    console.error(JSON.stringify(badRows.slice(0, 20), null, 2));
  }
}

// Raw staged sources live on the maintainer's disk / external storage, not in
// git. Target-existence checks only make sense where the staging tree exists.
if (existsSync(path.join(repoRoot, "content", "_staging", "raw"))) {
  const queueLines = readFileSync(path.join(repoRoot, csvPaths[1]), "utf8")
    .split(/\r?\n/)
    .filter(Boolean);
  const queueHeader = parseCsvLine(queueLines[0]);
  const queueIndex = Object.fromEntries(queueHeader.map((header, index) => [header, index]));
  const stagedStatuses = new Set(["downloaded_staged", "scraped_staged", "metadata_staged"]);
  const missingTargets = [];

  for (const line of queueLines.slice(1)) {
    const fields = parseCsvLine(line);
    const status = fields[queueIndex.status];
    const targetPath = fields[queueIndex.target_path];
    if (!stagedStatuses.has(status) || !targetPath) continue;
    if (!existsSync(path.join(repoRoot, targetPath))) {
      missingTargets.push({ work_id: fields[queueIndex.work_id], targetPath });
    }
  }

  console.log(`staged queue target misses: ${missingTargets.length}`);
  if (missingTargets.length > 0) {
    hasError = true;
    console.error(JSON.stringify(missingTargets, null, 2));
  }
} else {
  console.log("staging tree absent — staged target existence checks skipped");
}

if (hasError) process.exit(1);

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeSourceUrl(value) {
  try {
    const url = new URL(value);
    return `${url.hostname.toLowerCase()}${url.pathname.replace(/\/+$/, "")}${url.search}`;
  } catch {
    return String(value).trim().toLowerCase();
  }
}

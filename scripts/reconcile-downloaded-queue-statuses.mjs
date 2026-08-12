import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const queuePath = path.join(repoRoot, "docs/source_download_queue_2026-06-19.csv");
const inventoryPath = path.join(repoRoot, "docs/source_inventory_template.csv");
const reconciledAt = "2026-07-06";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
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
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((csvRow) => csvRow.some((value) => value !== ""));
}

function stringifyCsv(rows) {
  return `${rows
    .map((row) =>
      row
        .map((value) => {
          const text = String(value ?? "");
          return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
        })
        .join(","),
    )
    .join("\n")}\n`;
}

function rowObjects(rows) {
  const header = rows[0];
  return {
    header,
    data: rows
      .slice(1)
      .map((row) => Object.fromEntries(header.map((name, index) => [name, row[index] ?? ""]))),
  };
}

function rowsFromObjects(header, data) {
  return [header, ...data.map((row) => header.map((name) => row[name] ?? ""))];
}

const queueParsed = rowObjects(parseCsv(readFileSync(queuePath, "utf8")));
const changedQueueIds = new Set();

for (const row of queueParsed.data) {
  if (row.status !== "download_pending_network_restricted") continue;
  if (!row.target_path) continue;
  if (!existsSync(path.join(repoRoot, row.target_path))) continue;

  if (row.target_path.endsWith(".metadata.json")) {
    row.status = "metadata_staged";
    row.notes = `${row.notes} Metadata downloaded on ${reconciledAt}; review rights before full text acquisition.`;
  } else {
    row.status = "downloaded_staged";
    row.notes = `${row.notes} Downloaded to ${row.target_path} on ${reconciledAt}; review before ingestion.`;
  }
  changedQueueIds.add(row.work_id);
}

writeFileSync(
  queuePath,
  stringifyCsv(rowsFromObjects(queueParsed.header, queueParsed.data)),
  "utf8",
);

const inventoryParsed = rowObjects(parseCsv(readFileSync(inventoryPath, "utf8")));
for (const row of inventoryParsed.data) {
  if (!changedQueueIds.has(row.work_id)) continue;
  if (row.status !== "download_pending_network_restricted") continue;
  const queueRow = queueParsed.data.find((candidate) => candidate.work_id === row.work_id);
  row.status = queueRow?.status === "metadata_staged" ? "metadata_staged" : "staged_candidate";
  row.human_reviewer_notes = `${row.human_reviewer_notes} Staged by queue reconciliation on ${reconciledAt}.`;
}

writeFileSync(
  inventoryPath,
  stringifyCsv(rowsFromObjects(inventoryParsed.header, inventoryParsed.data)),
  "utf8",
);

console.log(`Reconciled ${changedQueueIds.size} queue rows with staged targets.`);

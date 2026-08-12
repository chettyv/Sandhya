import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const inventoryPath = path.join(repoRoot, "docs/source_inventory_template.csv");
const queuePath = path.join(repoRoot, "docs/source_download_queue_2026-06-19.csv");
const stagedDate = "2026-07-04";

const works = [
  {
    work_id: "sbe01_upanishads_part1_muller_en",
    text_name: "The Upanishads Part 1",
    category: "upanishad/vedanta",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "F. Max Muller",
    commentator: "none",
    edition: "Sacred Books of the East Vol 1",
    translation_year: "1879",
    source_url: "https://www.sacred-texts.com/hin/sbe01/index.htm",
    target_path: "content/_staging/raw/english/sacred_texts/sbe01_upanishads_part1_muller_en.jsonl",
    difficulty: "Hard",
    review_needed: "legal; Upanishad review; Vedanta review; attribution; segmentation",
    notes:
      "Completes the Muller SBE Upanishads pair with existing SBE15 Part 2; includes introductory series material and multiple principal Upanishads.",
  },
  {
    work_id: "sbe26_satapatha_brahmana_part2_en",
    text_name: "Satapatha Brahmana Part 2",
    category: "brahmana/veda",
    tradition_or_sect: "vedic",
    region: "pan_indian",
    translator: "Julius Eggeling",
    commentator: "none",
    edition: "Sacred Books of the East Vol 26",
    translation_year: "1885",
    source_url: "https://www.sacred-texts.com/hin/sbr/sbe26/index.htm",
    target_path:
      "content/_staging/raw/english/sacred_texts/sbe26_satapatha_brahmana_part2_en.jsonl",
    difficulty: "Hard",
    review_needed: "legal; Vedic review; ritual review; attribution; segmentation",
    notes:
      "Satapatha Brahmana Books III and IV page-level scrape; Part 1 was already staged as SBE12.",
  },
  {
    work_id: "sbe34_vedanta_sutras_sankara_part1_en",
    text_name: "Vedanta Sutras with Sankara Commentary Part 1",
    category: "vedanta",
    tradition_or_sect: "advaita",
    region: "pan_indian",
    translator: "George Thibaut",
    commentator: "Adi Sankaracharya",
    edition: "Sacred Books of the East Vol 34",
    translation_year: "1890",
    source_url: "https://www.sacred-texts.com/hin/sbe34/index.htm",
    target_path:
      "content/_staging/raw/english/sacred_texts/sbe34_vedanta_sutras_sankara_part1_en.jsonl",
    difficulty: "Hard",
    review_needed:
      "legal; Vedanta review; Advaita review; attribution; sensitive content review; segmentation",
    notes:
      "Completes the Sacred Texts page-level Sankara Vedanta-Sutras pair with existing SBE38 Part 2.",
  },
  {
    work_id: "sbe41_satapatha_brahmana_part3_en",
    text_name: "Satapatha Brahmana Part 3",
    category: "brahmana/veda",
    tradition_or_sect: "vedic",
    region: "pan_indian",
    translator: "Julius Eggeling",
    commentator: "none",
    edition: "Sacred Books of the East Vol 41",
    translation_year: "1894",
    source_url: "https://www.sacred-texts.com/hin/sbr/sbe41/index.htm",
    target_path:
      "content/_staging/raw/english/sacred_texts/sbe41_satapatha_brahmana_part3_en.jsonl",
    difficulty: "Hard",
    review_needed: "legal; Vedic review; ritual review; attribution; segmentation",
    notes: "Satapatha Brahmana Books V, VI, and VII page-level scrape.",
  },
  {
    work_id: "sbe43_satapatha_brahmana_part4_en",
    text_name: "Satapatha Brahmana Part 4",
    category: "brahmana/veda",
    tradition_or_sect: "vedic",
    region: "pan_indian",
    translator: "Julius Eggeling",
    commentator: "none",
    edition: "Sacred Books of the East Vol 43",
    translation_year: "1897",
    source_url: "https://www.sacred-texts.com/hin/sbr/sbe43/index.htm",
    target_path:
      "content/_staging/raw/english/sacred_texts/sbe43_satapatha_brahmana_part4_en.jsonl",
    difficulty: "Hard",
    review_needed: "legal; Vedic review; ritual review; attribution; segmentation",
    notes: "Satapatha Brahmana Books VIII, IX, and X page-level scrape.",
  },
  {
    work_id: "sbe44_satapatha_brahmana_part5_en",
    text_name: "Satapatha Brahmana Part 5",
    category: "brahmana/veda",
    tradition_or_sect: "vedic",
    region: "pan_indian",
    translator: "Julius Eggeling",
    commentator: "none",
    edition: "Sacred Books of the East Vol 44",
    translation_year: "1900",
    source_url: "https://www.sacred-texts.com/hin/sbr/sbe44/index.htm",
    target_path:
      "content/_staging/raw/english/sacred_texts/sbe44_satapatha_brahmana_part5_en.jsonl",
    difficulty: "Hard",
    review_needed: "legal; Vedic review; ritual review; attribution; segmentation",
    notes: "Final Satapatha Brahmana volume, Books XI-XIV, page-level scrape.",
  },
  {
    work_id: "sbe48_vedanta_sutras_ramanuja_en",
    text_name: "Vedanta Sutras with Ramanuja Commentary",
    category: "vedanta",
    tradition_or_sect: "vishishtadvaita",
    region: "pan_indian",
    translator: "George Thibaut",
    commentator: "Ramanuja",
    edition: "Sacred Books of the East Vol 48",
    translation_year: "1904",
    source_url: "https://www.sacred-texts.com/hin/sbe48/index.htm",
    target_path: "content/_staging/raw/english/sacred_texts/sbe48_vedanta_sutras_ramanuja_en.jsonl",
    difficulty: "Hard",
    review_needed:
      "legal; Vedanta review; Vishishtadvaita review; attribution; sensitive content review; segmentation",
    notes:
      "Ramanuja Vedanta-Sutras commentary page-level scrape; pair with existing Project Gutenberg and Sacred Texts Vedanta sources.",
  },
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

function serializeCsvLine(fields) {
  return fields
    .map((field) => {
      const value = String(field ?? "");
      if (!/[",\r\n]/.test(value)) return value;
      return `"${value.replaceAll('"', '""')}"`;
    })
    .join(",");
}

function readCsv(filePath) {
  const content = readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map(parseCsvLine);
  return { headers, rows };
}

function writeCsv(filePath, headers, rows) {
  const lines = [headers, ...rows].map(serializeCsvLine);
  writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function rowIndex(headers) {
  return Object.fromEntries(headers.map((header, index) => [header, index]));
}

function existingWorkIds(rows, index) {
  return new Set(rows.map((row) => row[index.work_id]).filter(Boolean));
}

function inventoryRow(work) {
  return [
    work.work_id,
    work.text_name,
    work.category,
    work.tradition_or_sect,
    work.region,
    "English",
    "Roman/HTML",
    work.translator,
    work.commentator,
    work.edition,
    work.translation_year,
    "Sacred Texts",
    work.source_url,
    "website_html",
    "HTML/JSONL",
    "Public-domain Sacred Books of the East edition; Sacred Texts site terms apply",
    "Public domain translation likely; site terms and jurisdiction need review",
    "Yes for staging",
    "Yes after review",
    "Yes after legal/content review",
    "Yes, can ingest after legal/content review",
    `Credit ${work.edition}, ${work.translator}, ${work.commentator}, and Sacred Texts; preserve page URLs`,
    "Yes if site terms and public-domain status apply",
    "Unclear",
    "Medium",
    work.difficulty,
    work.review_needed,
    `${work.notes} Page-level Sacred Texts JSONL staged at ${work.target_path} on ${stagedDate}.`,
    "staged_candidate",
  ];
}

function queueRow(work) {
  return [
    work.work_id,
    work.text_name,
    "English",
    "Sacred Texts",
    work.source_url,
    work.source_url,
    work.target_path,
    "Public-domain Sacred Books of the East edition; site terms apply",
    "scraped_staged",
    `Page-level JSONL staged at ${work.target_path} on ${stagedDate}; review before ingestion.`,
  ];
}

const inventory = readCsv(inventoryPath);
const queue = readCsv(queuePath);
const inventoryIndex = rowIndex(inventory.headers);
const queueIndex = rowIndex(queue.headers);
const inventoryIds = existingWorkIds(inventory.rows, inventoryIndex);
const queueIds = existingWorkIds(queue.rows, queueIndex);

let inventoryAppended = 0;
let queueAppended = 0;
const missingTargets = [];

for (const work of works) {
  if (!existsSync(path.join(repoRoot, work.target_path))) {
    missingTargets.push(work.target_path);
    continue;
  }

  if (!inventoryIds.has(work.work_id)) {
    inventory.rows.push(inventoryRow(work));
    inventoryIds.add(work.work_id);
    inventoryAppended += 1;
  }

  if (!queueIds.has(work.work_id)) {
    queue.rows.push(queueRow(work));
    queueIds.add(work.work_id);
    queueAppended += 1;
  }
}

if (missingTargets.length > 0) {
  console.error(`Missing scrape targets:\n${missingTargets.join("\n")}`);
  process.exit(1);
}

writeCsv(inventoryPath, inventory.headers, inventory.rows);
writeCsv(queuePath, queue.headers, queue.rows);

console.log(`candidate count: ${works.length}`);
console.log(`inventory rows appended: ${inventoryAppended}`);
console.log(`queue rows appended: ${queueAppended}`);

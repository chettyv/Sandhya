import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const inventoryPath = path.join(repoRoot, "docs/source_inventory_template.csv");
const queuePath = path.join(repoRoot, "docs/source_download_queue_2026-06-19.csv");
const stagedDate = "2026-07-05";

const works = [
  {
    work_id: "sankhya_aphorisms_kapila_ballantyne_en",
    text_name: "The Sankhya Aphorisms of Kapila",
    category: "darshana/sankhya",
    tradition_or_sect: "sankhya",
    region: "pan_indian",
    translator: "James R. Ballantyne",
    commentator: "Kapila; Vijnanabhikshu extracts",
    edition: "Third edition edited by Fitzedward Hall",
    translation_year: "1885",
    source_url: "https://www.sacred-texts.com/hin/sak/index.htm",
    target_path:
      "content/_staging/raw/english/sacred_texts/sankhya_aphorisms_kapila_ballantyne_en.jsonl",
    difficulty: "Hard",
    review_needed: "legal; Sankhya review; Sanskrit omission review; attribution; segmentation",
    notes:
      "Classical Sankhya aphorism translation staged from Sacred Texts; the hypertext notes say Sanskrit was omitted from the transcription, so citation and source-form review are required.",
  },
  {
    work_id: "vishnu_purana_wilson_sacred_texts_en",
    text_name: "The Vishnu Purana",
    category: "purana/vaishnava",
    tradition_or_sect: "vaishnava",
    region: "pan_indian",
    translator: "H. H. Wilson",
    commentator: "none",
    edition: "Sacred Texts HTML edition",
    translation_year: "1840",
    source_url: "https://www.sacred-texts.com/hin/vp/index.htm",
    target_path:
      "content/_staging/raw/english/sacred_texts/vishnu_purana_wilson_sacred_texts_en.jsonl",
    difficulty: "Hard",
    review_needed: "legal; Vaishnava review; Purana review; attribution; segmentation",
    notes:
      "Page-level Sacred Texts scrape staged to provide stable citation URLs for the Wilson Vishnu Purana alongside the existing Project Gutenberg TXT source.",
  },
  {
    work_id: "mahanirvana_tantra_avalon_en",
    text_name: "Mahanirvana Tantra",
    category: "tantra/shakta",
    tradition_or_sect: "shakta/tantric",
    region: "pan_indian",
    translator: "Arthur Avalon / John Woodroffe",
    commentator: "none",
    edition: "Sacred Texts HTML edition",
    translation_year: "1913",
    source_url: "https://www.sacred-texts.com/tantra/maha/index.htm",
    target_path: "content/_staging/raw/english/sacred_texts/mahanirvana_tantra_avalon_en.jsonl",
    difficulty: "Hard",
    review_needed:
      "legal; Tantra review; Shakta review; ritual/sensitive content review; attribution; segmentation",
    notes:
      "Tantric source staged for review-first use only; ritual, initiatory, and sensitive material must be gated and contextualized before any production retrieval.",
  },
  {
    work_id: "hymns_to_the_goddess_avalon_en",
    text_name: "Hymns to the Goddess",
    category: "stotra/shakta/tantra",
    tradition_or_sect: "shakta/tantric",
    region: "pan_indian",
    translator: "Arthur Avalon / John Woodroffe",
    commentator: "none",
    edition: "Sacred Texts HTML edition",
    translation_year: "1913",
    source_url: "https://www.sacred-texts.com/tantra/htg/index.htm",
    target_path: "content/_staging/raw/english/sacred_texts/hymns_to_the_goddess_avalon_en.jsonl",
    difficulty: "Medium",
    review_needed: "legal; Shakta review; stotra source review; attribution; segmentation",
    notes:
      "Collection of translated goddess hymns staged for review-first devotional and source-reference use; individual hymn source categories must remain explicit.",
  },
  {
    work_id: "hymn_to_kali_avalon_en",
    text_name: "Hymn to Kali",
    category: "stotra/shakta/tantra",
    tradition_or_sect: "shakta/tantric",
    region: "pan_indian",
    translator: "Arthur Avalon / John Woodroffe",
    commentator: "none",
    edition: "Sacred Texts HTML edition",
    translation_year: "1922",
    source_url: "https://www.sacred-texts.com/tantra/htk/index.htm",
    target_path: "content/_staging/raw/english/sacred_texts/hymn_to_kali_avalon_en.jsonl",
    difficulty: "Hard",
    review_needed:
      "legal; Kali/Shakta review; tantra review; sensitive content review; attribution; segmentation",
    notes:
      "Kali hymn with extensive tantric notes staged for review-first use; sensitive ritual and doctrinal notes must be contextualized before retrieval use.",
  },
  {
    work_id: "shakti_and_shakta_avalon_1918_en",
    text_name: "Shakti and Shakta",
    category: "secondary/shakta/tantra",
    tradition_or_sect: "shakta/tantric",
    region: "pan_indian",
    translator: "Arthur Avalon / John Woodroffe",
    commentator: "none",
    edition: "Sacred Texts HTML edition",
    translation_year: "1918",
    source_url: "https://www.sacred-texts.com/tantra/sas/index.htm",
    target_path: "content/_staging/raw/english/sacred_texts/shakti_and_shakta_avalon_1918_en.jsonl",
    difficulty: "Medium",
    review_needed:
      "legal; Shakta review; tantra review; historical framing; attribution; segmentation",
    notes:
      "Secondary Shakta/Tantra essays staged as context only; do not present as scripture or direct practice authority.",
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
    "Public-domain source edition likely; Sacred Texts site terms apply",
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
    "Public-domain source edition likely; site terms apply",
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

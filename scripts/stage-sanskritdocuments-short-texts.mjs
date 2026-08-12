import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const inventoryPath = path.join(repoRoot, "docs/source_inventory_template.csv");
const queuePath = path.join(repoRoot, "docs/source_download_queue_2026-06-19.csv");
const readmePath = path.join(repoRoot, "content/_staging/README.md");
const fetchedAt = new Date().toISOString();
const userAgent = "DharmaDailyCorpusResearch/0.5 (local staging; nonproduction)";

const works = [
  {
    workId: "sanskritdocuments_hanuman_chalisa_hindi_itx",
    textName: "Hanuman Chalisa",
    category: "stotra/bhakti",
    tradition: "ramanandi/hanuman",
    language: "Hindi/Awadhi",
    script: "Devanagari/ITRANS",
    region: "north_india",
    translator: "Tulsidas",
    url: "https://sanskritdocuments.org/doc_hanumaana/hanuman40.itx",
    targetPath: "content/_staging/raw/hindi/sanskritdocuments_hanuman_chalisa_hi.itx",
  },
  {
    workId: "sanskritdocuments_hanuman_chalisa_hindi_alt_itx",
    textName: "Hanuman Chalisa alternate Hindi/Awadhi file",
    category: "stotra/bhakti",
    tradition: "ramanandi/hanuman",
    language: "Hindi/Awadhi",
    script: "Devanagari/ITRANS",
    region: "north_india",
    translator: "Tulsidas",
    url: "https://sanskritdocuments.org/doc_z_otherlang_hindi/chaalisa.itx",
    targetPath: "content/_staging/raw/hindi/sanskritdocuments_hanuman_chalisa_alt_hi.itx",
  },
  {
    workId: "sanskritdocuments_shiva_mahimna_stotra_itx",
    textName: "Shiva Mahimna Stotra",
    category: "stotra/shaiva",
    tradition: "shaiva",
    language: "Sanskrit",
    script: "Devanagari/ITRANS",
    region: "pan_indian",
    translator: "none",
    url: "https://sanskritdocuments.org/doc_shiva/shivamahi.itx",
    targetPath: "content/_staging/raw/sanskrit/sanskritdocuments/shiva_mahimna_stotra.itx",
  },
  {
    workId: "sanskritdocuments_aditya_hridayam_itx",
    textName: "Aditya Hridayam",
    category: "stotra/ramayana",
    tradition: "smarta/solar",
    language: "Sanskrit",
    script: "Devanagari/ITRANS",
    region: "pan_indian",
    translator: "none",
    url: "https://sanskritdocuments.org/doc_z_misc_navagraha/adityahriday.itx",
    targetPath: "content/_staging/raw/sanskrit/sanskritdocuments/aditya_hridayam.itx",
  },
  {
    workId: "sanskritdocuments_bhaja_govindam_itx",
    textName: "Bhaja Govindam",
    category: "stotra/vedanta",
    tradition: "advaita/smarta",
    language: "Sanskrit",
    script: "Devanagari/ITRANS",
    region: "pan_indian",
    translator: "none",
    commentator: "Adi Shankara attributed",
    url: "https://sanskritdocuments.org/doc_vishhnu/bhajagovindam.itx",
    targetPath: "content/_staging/raw/sanskrit/sanskritdocuments/bhaja_govindam.itx",
  },
  {
    workId: "sanskritdocuments_soundarya_lahari_itx",
    textName: "Soundarya Lahari",
    category: "stotra/shakta",
    tradition: "shakta/smarta",
    language: "Sanskrit",
    script: "Devanagari/ITRANS",
    region: "pan_indian",
    translator: "none",
    commentator: "Adi Shankara attributed",
    url: "https://sanskritdocuments.org/doc_devii/saundaryalahari.itx",
    targetPath: "content/_staging/raw/sanskrit/sanskritdocuments/soundarya_lahari.itx",
  },
  {
    workId: "sanskritdocuments_lalita_sahasranama_itx",
    textName: "Lalita Sahasranama",
    category: "stotra/sahasranama/shakta",
    tradition: "shakta/smarta",
    language: "Sanskrit",
    script: "Devanagari/ITRANS",
    region: "pan_indian",
    translator: "none",
    url: "https://sanskritdocuments.org/doc_devii/lalita1000.itx",
    targetPath: "content/_staging/raw/sanskrit/sanskritdocuments/lalita_sahasranama.itx",
  },
  {
    workId: "sanskritdocuments_hanuman_chalisa_sanskrit_translation_itx",
    textName: "Hanuman Chalisa Sanskrit translation",
    category: "stotra/bhakti",
    tradition: "ramanandi/hanuman",
    language: "Sanskrit",
    script: "Devanagari/ITRANS",
    region: "north_india",
    translator: "Ravindra Kumar Markandeya",
    url: "https://sanskritdocuments.org/doc_hanumaana/hanumAnachAlisAsaMskRRita.itx",
    targetPath:
      "content/_staging/raw/sanskrit/sanskritdocuments/hanuman_chalisa_sanskrit_translation.itx",
  },
];

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function readIds(csvPath) {
  const content = readFileSync(csvPath, "utf8");
  const ids = new Set();
  for (const line of content.split(/\r?\n/).slice(1)) {
    if (!line.trim()) continue;
    ids.add(line.split(",", 1)[0]);
  }
  return ids;
}

function appendRows(csvPath, header, existingIds, rows) {
  const lines = [];
  for (const row of rows) {
    if (existingIds.has(row.work_id)) continue;
    lines.push(header.map((column) => csvEscape(row[column] ?? "")).join(","));
  }
  if (lines.length === 0) {
    console.log(`No new rows for ${path.relative(repoRoot, csvPath)}`);
    return 0;
  }
  const current = readFileSync(csvPath, "utf8");
  const separator = current.endsWith("\n") ? "" : "\n";
  writeFileSync(csvPath, `${current}${separator}${lines.join("\n")}\n`, "utf8");
  console.log(`Appended ${lines.length} rows to ${path.relative(repoRoot, csvPath)}`);
  return lines.length;
}

async function fetchText(work) {
  const target = path.join(repoRoot, work.targetPath);
  await mkdir(path.dirname(target), { recursive: true });
  if (existsSync(target)) {
    return { status: "already_exists", bytes: readFileSync(target).byteLength };
  }
  const response = await fetch(work.url, {
    headers: {
      "User-Agent": userAgent,
      Accept: "text/plain,*/*",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const text = await response.text();
  await writeFile(target, text, "utf8");
  return { status: "downloaded", bytes: Buffer.byteLength(text, "utf8") };
}

const results = [];
for (const work of works) {
  try {
    const result = await fetchText(work);
    console.log(`STAGED ${work.workId} ${result.bytes} bytes`);
    results.push({ ...work, ...result });
  } catch (error) {
    console.warn(`WARN ${work.workId} ${error.message}`);
    results.push({ ...work, error: error.message });
  }
}

const staged = results.filter((result) => !result.error);
const manifestPath = path.join(
  repoRoot,
  "content/_staging/raw/sanskritdocuments_short_texts_manifest_2026-07-06.json",
);
await writeFile(manifestPath, JSON.stringify({ fetched_at: fetchedAt, results }, null, 2), "utf8");
console.log(`WROTE ${path.relative(repoRoot, manifestPath)}`);

const inventoryHeader = readFileSync(inventoryPath, "utf8").split(/\r?\n/, 1)[0].split(",");
const queueHeader = readFileSync(queuePath, "utf8").split(/\r?\n/, 1)[0].split(",");
const inventoryIds = readIds(inventoryPath);
const queueIds = readIds(queuePath);

const inventoryRows = staged.map((work) => ({
  work_id: work.workId,
  text_name: work.textName,
  category: work.category,
  tradition_or_sect: work.tradition,
  region: work.region,
  language: work.language,
  script: work.script,
  translator: work.translator,
  commentator: work.commentator ?? "none",
  edition: "SanskritDocuments ITX",
  translation_year: "TBD",
  source_name: "SanskritDocuments",
  source_url: work.url,
  source_type: "digital_text_repository",
  format: "ITX",
  licence: "SanskritDocuments terms and per-file provenance require review before app use",
  copyright_status: "Base text likely traditional; transcription/translation terms require review",
  can_store: "Yes for staging",
  can_show_excerpts: "Unclear until legal/content review",
  can_embed_full_text: "Unclear until legal review",
  can_use_for_rag: "No until legal review, normalization, and source review",
  attribution_required:
    "Preserve SanskritDocuments URL, file metadata, and any listed contributors",
  commercial_use_allowed: "Unclear until legal review",
  permission_needed: "Unclear",
  provenance_confidence: "Medium",
  ingestion_difficulty: "Medium",
  review_needed: "legal; Sanskrit/Hindi review; ITRANS normalization; source edition review",
  human_reviewer_notes: `ITX source staged at ${work.targetPath} on 2026-07-06; normalize and review terms before use.`,
  status: "staged_candidate",
}));

const queueRows = staged.map((work) => ({
  work_id: work.workId,
  text_name: work.textName,
  language: work.language,
  source_name: "SanskritDocuments",
  source_url: work.url,
  download_url: work.url,
  target_path: work.targetPath,
  rights_status: "Review before use; staging is not production approval",
  status: "downloaded_staged",
  notes: `ITX source staged on 2026-07-06 (${work.bytes} bytes); legal/provenance and normalization review required.`,
}));

appendRows(inventoryPath, inventoryHeader, inventoryIds, inventoryRows);
appendRows(queuePath, queueHeader, queueIds, queueRows);

const readme = readFileSync(readmePath, "utf8");
const marker = "Run notes for 2026-07-06 SanskritDocuments short-text acquisition:";
if (!readme.includes(marker)) {
  const note =
    `\n${marker}\n\n` +
    `- Staged ${staged.length} SanskritDocuments ITX short-text candidates for Hanuman Chalisa, Shiva Mahimna Stotra, Aditya Hridayam, Bhaja Govindam, Soundarya Lahari, Lalita Sahasranama, and a Sanskrit Hanuman Chalisa translation.\n` +
    "- These are actual text files, not just index leads. They still require SanskritDocuments terms review, per-file provenance review, ITRANS normalization, and Hindi/Sanskrit review before embedding, RAG, or app display.\n";
  writeFileSync(readmePath, `${readme.endsWith("\n") ? readme : `${readme}\n`}${note}`, "utf8");
}

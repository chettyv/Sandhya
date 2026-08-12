import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const inventoryPath = path.join(repoRoot, "docs/source_inventory_template.csv");
const queuePath = path.join(repoRoot, "docs/source_download_queue_2026-06-19.csv");
const stagedDate = "2026-07-06";

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

const inventoryHeader = readFileSync(inventoryPath, "utf8").split(/\r?\n/, 1)[0].split(",");
const queueHeader = readFileSync(queuePath, "utf8").split(/\r?\n/, 1)[0].split(",");
const inventoryIds = readIds(inventoryPath);
const queueIds = readIds(queuePath);

const inventoryDefaults = {
  region: "pan_indian",
  script: "Roman/OCR",
  commentator: "none",
  edition: "P0-P3 provisional source map acquisition",
  translation_year: "TBD",
  source_type: "website_export",
  format: "HTML/JSONL",
  licence: "Source terms require review before app use",
  copyright_status: "Public-domain candidate or open-access claim requires verification",
  can_store: "Yes for staging",
  can_show_excerpts: "Yes after legal/content review",
  can_embed_full_text: "Yes after legal review",
  can_use_for_rag: "Yes after legal/content review",
  attribution_required: "Preserve source URL, host, translator/editor, and fetched date",
  commercial_use_allowed: "Unclear until legal review",
  permission_needed: "Unclear",
  provenance_confidence: "Medium",
  ingestion_difficulty: "Medium",
  review_needed: "legal; content; OCR/source cleanup; attribution",
  human_reviewer_notes: "",
  status: "staged_candidate",
};

const queueDefaults = {
  rights_status: "Review before use; staging is not production approval",
  status: "downloaded_staged",
};

const rows = [
  {
    work_id: "bhagavad_gita_arnold_sacred_texts_en",
    text_name: "Bhagavad Gita",
    category: "scripture",
    tradition_or_sect: "general",
    language: "English",
    translator: "Edwin Arnold",
    source_name: "Sacred Texts",
    source_url: "https://www.sacred-texts.com/hin/gita/index.htm",
    format: "JSONL/HTML",
    target_path:
      "content/_staging/raw/english/sacred_texts/bhagavad_gita_arnold_sacred_texts_en.jsonl",
    status: "scraped_staged",
    notes:
      "Exact source-map Sacred Texts Bhagavad Gita pages scraped as page-level JSONL on 2026-07-06.",
  },
  {
    work_id: "ramayana_griffith_sacred_texts_en",
    text_name: "Valmiki Ramayana",
    category: "itihasa",
    tradition_or_sect: "general",
    language: "English",
    translator: "Ralph T. H. Griffith",
    source_name: "Sacred Texts",
    source_url: "https://www.sacred-texts.com/hin/rama/index.htm",
    format: "JSONL/HTML",
    target_path:
      "content/_staging/raw/english/sacred_texts/ramayana_griffith_sacred_texts_en.jsonl",
    status: "scraped_staged",
    notes:
      "Exact source-map Sacred Texts Ramayana pages scraped as 507 page-level JSONL records on 2026-07-06.",
  },
  {
    work_id: "mahabharata_ganguli_sacred_texts_en",
    text_name: "Mahabharata",
    category: "itihasa",
    tradition_or_sect: "general",
    language: "English",
    translator: "Kisari Mohan Ganguli",
    source_name: "Sacred Texts",
    source_url: "https://www.sacred-texts.com/hin/maha/index.htm",
    format: "JSONL/HTML",
    target_path:
      "content/_staging/raw/english/sacred_texts/mahabharata_ganguli_sacred_texts_en.jsonl",
    status: "scraped_staged",
    notes:
      "Exact Sacred Texts landing/progress pages scraped on 2026-07-06; actual Ganguli full text is already staged in Project Gutenberg TXT volumes.",
  },
  {
    work_id: "rig_veda_griffith_sacred_texts_en",
    text_name: "Rig Veda selected hymns",
    category: "shruti",
    tradition_or_sect: "vedic",
    language: "English",
    translator: "Ralph T. H. Griffith",
    source_name: "Sacred Texts",
    source_url: "https://www.sacred-texts.com/hin/rigveda/index.htm",
    format: "JSONL/HTML",
    target_path:
      "content/_staging/raw/english/sacred_texts/rig_veda_griffith_sacred_texts_en.jsonl",
    status: "scraped_staged",
    notes:
      "Exact Sacred Texts Rig Veda book/index pages scraped on 2026-07-06; full Griffith OCR volumes are already staged from Internet Archive.",
  },
  {
    work_id: "yoga_sutras_bongiovanni_sacred_texts_en",
    text_name: "Yoga Sutras of Patanjali",
    category: "scripture/yoga",
    tradition_or_sect: "yoga",
    language: "English",
    translator: "BonGiovanni",
    source_name: "Sacred Texts",
    source_url: "https://www.sacred-texts.com/hin/yogasutr.htm",
    format: "JSONL/HTML",
    target_path:
      "content/_staging/raw/english/sacred_texts/yoga_sutras_bongiovanni_sacred_texts_en.jsonl",
    status: "scraped_staged",
    notes: "Exact source-map Yoga Sutras page scraped as JSONL on 2026-07-06.",
  },
  {
    work_id: "tirukkural_project_madurai_source_map_ta_en",
    text_name: "Tirukkural",
    category: "regional_wisdom",
    tradition_or_sect: "tamil",
    region: "tamil",
    language: "Tamil/English",
    script: "Tamil/Roman",
    translator: "Project Madurai listed translators",
    source_name: "Project Madurai",
    source_url: "https://projectmadurai.org/pm_etexts/tscii/pmtsc0017.html",
    format: "HTML",
    target_path: "content/_staging/raw/tamil/tirukkural_project_madurai_source_map_ta_en.html",
    notes: "Exact source-map Project Madurai HTML downloaded on 2026-07-06.",
  },
  {
    work_id: "kamba_ramayanam_project_madurai_ayodhya_part1_ta",
    text_name: "Kamba Ramayanam Ayodhya Kandam Part 1",
    category: "itihasa/regional",
    tradition_or_sect: "tamil",
    region: "tamil",
    language: "Tamil",
    script: "Tamil",
    translator: "none",
    source_name: "Project Madurai",
    source_url: "https://projectmadurai.org/pm_etexts/utf8/pmuni0422_01.html",
    format: "HTML",
    target_path: "content/_staging/raw/tamil/kamba_ramayanam_project_madurai_ayodhya_part1_ta.html",
    notes:
      "Representative source-map Kamba Ramayanam Project Madurai HTML downloaded on 2026-07-06; full series normalization still needed.",
  },
  {
    work_id: "tiruvacagam_project_madurai_pope_part1_en",
    text_name: "Tiruvacagam Part 1",
    category: "shaiva/tamil_bhakti",
    tradition_or_sect: "tamil_shaiva",
    region: "tamil",
    language: "English/Tamil",
    script: "Roman/Tamil",
    translator: "G. U. Pope",
    source_name: "Project Madurai",
    source_url: "https://www.projectmadurai.org/pm_etexts/tscii/pmtsc0094.html",
    format: "HTML",
    target_path: "content/_staging/raw/tamil/tiruvacagam_project_madurai_pope_part1_en.html",
    notes: "Exact source-map Project Madurai Tiruvacagam HTML downloaded on 2026-07-06.",
  },
  {
    work_id: "divya_prabandham_project_madurai_muthal_ayiram_ta",
    text_name: "Naalayira Divya Prabandham Muthal Ayiram",
    category: "vaishnava/tamil_bhakti",
    tradition_or_sect: "sri_vaishnava",
    region: "tamil",
    language: "Tamil",
    script: "Tamil",
    translator: "none",
    source_name: "Project Madurai",
    source_url: "https://www.projectmadurai.org/pm_etexts/utf8/pmuni0005_01.html",
    format: "HTML",
    target_path:
      "content/_staging/raw/tamil/divya_prabandham_project_madurai_muthal_ayiram_ta.html",
    notes:
      "Project Madurai UTF-8 text downloaded on 2026-07-06 after the source-map TSCII URL returned 404.",
  },
  {
    work_id: "dnyaneshwari_wikisource_mr_rendered",
    text_name: "Dnyaneshwari",
    category: "commentary",
    tradition_or_sect: "varkari",
    region: "marathi",
    language: "Marathi",
    script: "Devanagari",
    translator: "none",
    commentator: "Sant Dnyaneshwar",
    source_name: "Wikisource",
    source_url:
      "https://en.wikisource.org/wiki/mr:%E0%A4%9C%E0%A5%8D%E0%A4%9E%E0%A4%BE%E0%A4%A8%E0%A5%87%E0%A4%B6%E0%A5%8D%E0%A4%B5%E0%A4%B0%E0%A5%80",
    format: "HTML",
    target_path: "content/_staging/raw/marathi/dnyaneshwari_wikisource_mr_rendered.html",
    licence: "Wikimedia/Wikisource terms; page/source status requires review",
    notes:
      "Rendered Wikisource page downloaded on 2026-07-06; existing IA Marathi OCR remains separate.",
  },
  {
    work_id: "ramcharitmanas_english_wikisource_rendered",
    text_name: "The Ramayana of Tulsi Das",
    category: "itihasa/devotional",
    tradition_or_sect: "vaishnava/north_indian",
    region: "north_india",
    language: "English",
    translator: "F. S. Growse",
    source_name: "English Wikisource",
    source_url:
      "https://en.wikisource.org/wiki/en:The%20R%C3%A1m%C3%A1yana%20of%20Tulsi%20D%C3%A1s",
    format: "HTML",
    target_path: "content/_staging/raw/english/ramcharitmanas_english_wikisource_rendered.html",
    licence: "Wikimedia/Wikisource terms; public-domain text status requires review",
    notes: "Exact source-map English Wikisource rendered page downloaded on 2026-07-06.",
  },
  {
    work_id: "vishnu_purana_taylor_anu_press_2021",
    text_name: "The Vishnu Purana",
    category: "purana/vaishnava",
    tradition_or_sect: "vaishnava",
    language: "English",
    translator: "McComas Taylor",
    source_name: "ANU Press",
    source_url: "https://press.anu.edu.au/publications/textbooks/visnu-purana",
    source_type: "open_access_pdf",
    format: "PDF/HTML",
    licence: "ANU Press open-access terms require review",
    copyright_status: "Modern open-access work; not public domain",
    target_path: "content/_staging/raw/english/vishnu_purana_taylor_anu_press_2021.pdf",
    commercial_use_allowed: "Unclear until ANU Press licence reviewed",
    permission_needed: "Unclear",
    notes:
      "ANU Press page and PDF downloaded on 2026-07-06; modern OA licence must be checked before embedding or RAG use.",
  },
  {
    work_id: "brahma_vaivarta_purana_web_archive_gateway",
    text_name: "Brahma Vaivarta Purana Devanagari gateway",
    category: "purana",
    tradition_or_sect: "vaishnava/shakta",
    language: "Sanskrit",
    script: "Devanagari",
    translator: "none",
    source_name: "Web Archive",
    source_url:
      "https://web.archive.org/web/20080408110939/http://is1.mum.edu/vedicreserve/puran.htm",
    format: "HTML",
    target_path: "content/_staging/raw/sanskrit/brahma_vaivarta_purana_web_archive_gateway.html",
    status: "staged_candidate",
    notes:
      "Source-map Web Archive gateway downloaded on 2026-07-06; existing English IA OCR parts remain the actual fuller text staging path.",
  },
  {
    work_id: "markandeya_purana_wisdomlib_blocked",
    text_name: "Markandeya Purana WisdomLib exact source",
    category: "purana/shakta",
    tradition_or_sect: "shakta",
    language: "English",
    translator: "F. E. Pargiter",
    source_name: "WisdomLib",
    source_url: "https://www.wisdomlib.org/hinduism/book/the-markandeya-purana/",
    source_type: "website",
    format: "HTML",
    target_path: "content/_staging/raw/english/markandeya_purana_dutt_1896_en.txt",
    status: "blocked_metadata_only",
    notes:
      "Exact WisdomLib scrape returned 403 on 2026-07-06; actual Markandeya Purana OCR text is already staged from Internet Archive under the target path listed here.",
  },
  {
    work_id: "garuda_purana_dutt_wisdomlib_blocked",
    text_name: "Garuda Purana WisdomLib exact source",
    category: "purana/vaishnava",
    tradition_or_sect: "vaishnava",
    language: "English",
    translator: "Manmatha Nath Dutt",
    source_name: "WisdomLib",
    source_url: "https://www.wisdomlib.org/hinduism/book/the-garuda-purana-dutt",
    source_type: "website",
    format: "HTML",
    target_path: "content/_staging/raw/english/garuda_purana_dutt_1908_en.txt",
    status: "blocked_metadata_only",
    notes:
      "Exact WisdomLib scrape returned 403 on 2026-07-06; actual Garuda Purana OCR text is already staged from Internet Archive under the target path listed here.",
  },
];

const queueRows = rows.map((row) => ({
  work_id: row.work_id,
  text_name: row.text_name,
  language: row.language,
  source_name: row.source_name,
  source_url: row.source_url,
  download_url: row.status === "blocked_metadata_only" ? "" : row.source_url,
  target_path: row.target_path,
  rights_status:
    row.status === "blocked_metadata_only"
      ? "Exact source blocked; alternate actual text staged separately"
      : queueDefaults.rights_status,
  status:
    row.status === "scraped_staged"
      ? "scraped_staged"
      : row.status === "blocked_metadata_only"
        ? "blocked_metadata_only"
        : queueDefaults.status,
  notes: row.notes,
}));

const inventoryRows = rows.map((row) => ({
  ...inventoryDefaults,
  ...row,
  status:
    row.status === "scraped_staged" || row.status === "downloaded_staged"
      ? "staged_candidate"
      : row.status,
  human_reviewer_notes: row.notes,
}));

function appendRows(csvPath, header, ids, rowsToAppend) {
  const newLines = [];
  for (const row of rowsToAppend) {
    if (ids.has(row.work_id)) continue;
    newLines.push(header.map((column) => csvEscape(row[column] ?? "")).join(","));
  }
  if (newLines.length === 0) {
    console.log(`No new rows for ${path.relative(repoRoot, csvPath)}`);
    return;
  }
  const current = readFileSync(csvPath, "utf8");
  const separator = current.endsWith("\n") ? "" : "\n";
  writeFileSync(csvPath, `${current}${separator}${newLines.join("\n")}\n`, "utf8");
  console.log(`Appended ${newLines.length} rows to ${path.relative(repoRoot, csvPath)}`);
}

appendRows(inventoryPath, inventoryHeader, inventoryIds, inventoryRows);
appendRows(queuePath, queueHeader, queueIds, queueRows);

const acquisitionNotePath = path.join(repoRoot, "docs/source_acquisition_2026-07-06_p0_p3.md");
if (!existsSync(acquisitionNotePath)) {
  writeFileSync(
    acquisitionNotePath,
    `# P0-P3 source-map acquisition (${stagedDate})\n\n` +
      "This pass staged actual text carriers from the attached provisional P0-P3 source map. Files remain review-first raw staging, not approved app content.\n\n" +
      "Downloaded/scraped text carriers:\n\n" +
      rows
        .filter((row) => row.status !== "blocked_metadata_only")
        .map((row) => `- \`${row.target_path}\` from ${row.source_name}: ${row.text_name}`)
        .join("\n") +
      "\n\nBlocked exact-source attempts:\n\n" +
      rows
        .filter((row) => row.status === "blocked_metadata_only")
        .map(
          (row) =>
            `- ${row.source_name}: ${row.text_name}; exact scrape blocked, alternate staged text noted in inventory.`,
        )
        .join("\n") +
      "\n\nValidation notes:\n\n- The Project Madurai Divya Prabandham TSCII URL in the pasted source map returned 404, so the already queued Project Madurai UTF-8 Muthal Ayiram URL was downloaded instead.\n- WisdomLib returned 403 for automated book scrapes; Internet Archive OCR alternates are already staged for Markandeya Purana and Garuda Purana.\n- ANU Press Vishnu Purana is a modern open-access PDF, not public domain; do not embed or use for RAG until the licence is reviewed.\n",
    "utf8",
  );
  console.log(`Wrote ${path.relative(repoRoot, acquisitionNotePath)}`);
}

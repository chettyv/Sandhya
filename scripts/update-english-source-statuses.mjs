import { readFileSync, writeFileSync } from "node:fs";

const inventoryPath = "docs/source_inventory_template.csv";
const queuePath = "docs/source_download_queue_2026-06-19.csv";
const stagedDate = "2026-07-04";

const projectGutenbergTextIds = new Set([
  "mahabharata_ganguli_volume_1_books_1_3_en",
  "mahabharata_ganguli_volume_2_books_4_7_en",
  "mahabharata_ganguli_volume_3_books_8_12_en",
  "mahabharata_ganguli_volume_4_books_13_18_en",
  "yajnavalkya_dharma_sastra_judicature_en",
  "hindu_literature_hitopadesa_nala_ramayana_sakuntala_en",
  "hindu_tales_from_sanskrit_en",
  "tales_from_hindu_dramatists_en",
  "nala_and_damayanti_milman_en",
  "hindu_gods_and_heroes_barnett_en",
  "songs_of_kabir_tagore_pg_en",
]);

const sacredTextsIds = new Set([
  "sbe02_sacred_laws_aryas_part1_en",
  "sbe07_institutes_vishnu_en",
  "sbe08_bhagavadgita_sanatsujatiya_anugita_en",
  "sbe12_satapatha_brahmana_part1_en",
  "sbe14_sacred_laws_aryas_part2_en",
  "sbe15_upanishads_part2_muller_en",
  "sbe25_laws_manu_en",
  "sbe29_grihya_sutras_part1_en",
  "sbe30_grihya_sutras_part2_en",
  "sbe32_vedic_hymns_part1_en",
  "sbe33_minor_law_books_brihaspati_en",
  "sbe38_vedanta_sutras_sankara_part2_en",
  "sbe42_hymns_atharva_veda_en",
  "sbe46_vedic_hymns_part2_agni_en",
  "atharva_veda_griffith_sacred_texts_en",
]);

const metadataOnlyIds = new Set([
  "ekanath_bhaktalilamrita_ia_metadata",
  "bijak_kabir_1917_ia_metadata",
  "sarva_darsana_sangraha_cowell_ia_metadata",
  "dasgupta_history_indian_philosophy_vol1_ia_metadata",
  "dasgupta_yoga_as_philosophy_religion_ia_metadata",
  "hindu_mythology_wilkins_1913_ia_metadata",
]);

const sacredJsonlTargets = {
  sbe02_sacred_laws_aryas_part1_en:
    "content/_staging/raw/english/sacred_texts/sbe02_sacred_laws_aryas_part1_en.jsonl",
  sbe07_institutes_vishnu_en:
    "content/_staging/raw/english/sacred_texts/sbe07_institutes_vishnu_en.jsonl",
  sbe08_bhagavadgita_sanatsujatiya_anugita_en:
    "content/_staging/raw/english/sacred_texts/sbe08_bhagavadgita_sanatsujatiya_anugita_en.jsonl",
  sbe12_satapatha_brahmana_part1_en:
    "content/_staging/raw/english/sacred_texts/sbe12_satapatha_brahmana_part1_en.jsonl",
  sbe14_sacred_laws_aryas_part2_en:
    "content/_staging/raw/english/sacred_texts/sbe14_sacred_laws_aryas_part2_en.jsonl",
  sbe15_upanishads_part2_muller_en:
    "content/_staging/raw/english/sacred_texts/sbe15_upanishads_part2_muller_en.jsonl",
  sbe25_laws_manu_en: "content/_staging/raw/english/sacred_texts/sbe25_laws_manu_en.jsonl",
  sbe29_grihya_sutras_part1_en:
    "content/_staging/raw/english/sacred_texts/sbe29_grihya_sutras_part1_en.jsonl",
  sbe30_grihya_sutras_part2_en:
    "content/_staging/raw/english/sacred_texts/sbe30_grihya_sutras_part2_en.jsonl",
  sbe32_vedic_hymns_part1_en:
    "content/_staging/raw/english/sacred_texts/sbe32_vedic_hymns_part1_en.jsonl",
  sbe33_minor_law_books_brihaspati_en:
    "content/_staging/raw/english/sacred_texts/sbe33_minor_law_books_brihaspati_en.jsonl",
  sbe38_vedanta_sutras_sankara_part2_en:
    "content/_staging/raw/english/sacred_texts/sbe38_vedanta_sutras_sankara_part2_en.jsonl",
  sbe42_hymns_atharva_veda_en:
    "content/_staging/raw/english/sacred_texts/sbe42_hymns_atharva_veda_en.jsonl",
  sbe46_vedic_hymns_part2_agni_en:
    "content/_staging/raw/english/sacred_texts/sbe46_vedic_hymns_part2_agni_en.jsonl",
  atharva_veda_griffith_sacred_texts_en:
    "content/_staging/raw/english/sacred_texts/atharva_veda_griffith_sacred_texts_en.jsonl",
};

const correctedUrls = {
  sbe12_satapatha_brahmana_part1_en: "https://www.sacred-texts.com/hin/sbr/sbe12/index.htm",
  sbe25_laws_manu_en: "https://www.sacred-texts.com/hin/manu.htm",
};

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

function updateCsvFile(filePath, updateRecord) {
  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  const headers = parseCsvLine(lines[0]);
  const fieldIndex = Object.fromEntries(headers.map((header, index) => [header, index]));
  let touched = 0;

  for (let lineIndex = 1; lineIndex < lines.length; lineIndex += 1) {
    if (!lines[lineIndex]) continue;
    const fields = parseCsvLine(lines[lineIndex]);
    const workId = fields[fieldIndex.work_id];
    const updated = updateRecord(fields, fieldIndex, workId);
    if (updated) {
      lines[lineIndex] = serializeCsvLine(fields);
      touched += 1;
    }
  }

  writeFileSync(filePath, lines.join("\n"), "utf8");
  return touched;
}

const inventoryTouched = updateCsvFile(inventoryPath, (fields, fieldIndex, workId) => {
  if (projectGutenbergTextIds.has(workId)) {
    fields[fieldIndex.status] = "staged_candidate";
    fields[fieldIndex.can_use_for_rag] = "Yes, can ingest after cleanup/review";
    fields[fieldIndex.human_reviewer_notes] =
      `Full Project Gutenberg TXT staged under content/_staging/raw/english on ${stagedDate}. Remove or comply with PG boilerplate before app display.`;
    return true;
  }

  if (sacredTextsIds.has(workId)) {
    fields[fieldIndex.status] = "staged_candidate";
    fields[fieldIndex.format] = "HTML/JSONL";
    fields[fieldIndex.can_use_for_rag] = "Yes, can ingest after legal/content review";
    fields[fieldIndex.human_reviewer_notes] =
      `Page-level Sacred Texts JSONL staged under content/_staging/raw/english/sacred_texts on ${stagedDate}. Review site terms, attribution, and sensitive content before production use.`;
    if (correctedUrls[workId]) fields[fieldIndex.source_url] = correctedUrls[workId];
    return true;
  }

  if (metadataOnlyIds.has(workId)) {
    fields[fieldIndex.status] = "metadata_only";
    fields[fieldIndex.human_reviewer_notes] =
      `Internet Archive metadata staged on ${stagedDate}. Full text not downloaded or approved; verify scan rights and edition before ingestion.`;
    return true;
  }

  return false;
});

const queueTouched = updateCsvFile(queuePath, (fields, fieldIndex, workId) => {
  if (projectGutenbergTextIds.has(workId)) {
    fields[fieldIndex.status] = "downloaded_staged";
    fields[fieldIndex.notes] =
      `Full Project Gutenberg TXT staged at ${fields[fieldIndex.target_path]} on ${stagedDate}.`;
    return true;
  }

  if (sacredTextsIds.has(workId)) {
    fields[fieldIndex.status] = "scraped_staged";
    fields[fieldIndex.target_path] = sacredJsonlTargets[workId];
    fields[fieldIndex.download_url] = correctedUrls[workId] ?? fields[fieldIndex.download_url];
    fields[fieldIndex.source_url] = correctedUrls[workId] ?? fields[fieldIndex.source_url];
    fields[fieldIndex.notes] =
      `Page-level JSONL staged at ${fields[fieldIndex.target_path]} on ${stagedDate}.`;
    return true;
  }

  if (metadataOnlyIds.has(workId)) {
    fields[fieldIndex.status] = "metadata_staged";
    fields[fieldIndex.notes] =
      `Internet Archive metadata staged at ${fields[fieldIndex.target_path]} on ${stagedDate}; full text still review-first.`;
    return true;
  }

  return false;
});

console.log(`inventory rows touched: ${inventoryTouched}`);
console.log(`queue rows touched: ${queueTouched}`);

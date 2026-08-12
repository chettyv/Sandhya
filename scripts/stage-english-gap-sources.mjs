import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const stagedDate = "2026-08-06";
const rawRoot = path.join(repoRoot, "content/_staging/raw/english");

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Sandhya-source-stager/1.0 (+English corpus review)",
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }
  return response.text();
}

function writeMetadata(targetPath, metadata) {
  const metadataPath = targetPath.replace(/\.(txt|ocr\.txt|html|jsonl|itx|xml)$/i, ".metadata.json");
  writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
}

async function stageLalita() {
  const targetPath = path.join(
    rawRoot,
    "sacred_texts/lalita_sahasranama_gherwal_1930_en.jsonl",
  );
  mkdirSync(path.dirname(targetPath), { recursive: true });
  const pages = [
    {
      url: "https://www.sacred-texts.com/hin/kmu/kmu11.htm",
      title: "Introduction to Lalita Sahasranama",
    },
    {
      url: "https://www.sacred-texts.com/hin/kmu/kmu12.htm",
      title: "Lalita Sahasranama",
    },
  ];
  const rows = [];
  if (existsSync(targetPath)) {
    for (const line of readFileSync(targetPath, "utf8").split(/\r?\n/).filter(Boolean)) {
      rows.push(JSON.parse(line));
    }
  } else {
    for (const page of pages) {
      rows.push({
        work_id: "lalita_sahasranama_gherwal_1930_en",
        index_url: "https://www.sacred-texts.com/hin/kmu/index.htm",
        page_url: page.url,
        title: page.title,
        fetched_at: `${stagedDate}T00:00:00Z`,
        html: await fetchText(page.url),
      });
    }
    writeFileSync(targetPath, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`, "utf8");
  }
  writeMetadata(targetPath, {
    work_id: "lalita_sahasranama_gherwal_1930_en",
    work_title: "Lalita Sahasranama",
    title: "Kundalini: The Mother of the Universe — Lalita Sahasranama",
    language: "en",
    translator: "Rishi Singh Gherwal (attributed)",
    translation_year: "1930",
    source_url: "https://www.sacred-texts.com/hin/kmu/index.htm",
    source_name: "Sacred Texts",
    licence: "public_domain",
    copyright_status: "Public-domain candidate; provenance and translation authorship require review",
    can_store: true,
    can_show_excerpts: true,
    can_embed: true,
    permission_needed: "Unclear",
    provenance_confidence: "Medium",
    review_needed: "legal; Shakta review; translation attribution; segmentation",
    notes:
      "The Sacred Texts index attributes the work to Rishi Singh Gherwal but says the provenance/originality is uncertain. Staged for review only.",
  });
  return { work_id: "lalita_sahasranama_gherwal_1930_en", target_path: path.relative(repoRoot, targetPath), pages: rows.length };
}

async function stageAditya() {
  const targetPath = path.join(rawRoot, "aditya_hridayam_wikisource_en.html");
  mkdirSync(path.dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, await fetchText("https://en.wikisource.org/wiki/Aditya_Hridayam"), "utf8");
  writeMetadata(targetPath, {
    work_id: "aditya_hridayam_wikisource_en",
    work_title: "Aditya Hridayam",
    title: "Aditya Hridayam — English translation",
    language: "en",
    translator: "Ralph T. H. Griffith (attributed on the source page)",
    source_url: "https://en.wikisource.org/wiki/Aditya_Hridayam",
    source_name: "English Wikisource",
    licence: "public_domain",
    copyright_status: "Public-domain candidate; verify page history and deployment jurisdiction",
    can_store: true,
    can_show_excerpts: true,
    can_embed: true,
    permission_needed: "Unclear; verify page history and jurisdiction",
    provenance_confidence: "Medium",
    review_needed: "legal; source attribution; Sanskrit/English alignment; segmentation",
    notes: "Preserve Wikisource attribution and page history. Staged for review only.",
  });
  return { work_id: "aditya_hridayam_wikisource_en", target_path: path.relative(repoRoot, targetPath), pages: 1 };
}

function stageDevi() {
  const sourcePath = path.join(rawRoot, "markandeya_purana_dutt_1896_en.txt");
  const targetPath = path.join(rawRoot, "devi_mahatmya_markandeya_dutt_1896_en.txt");
  const lines = readFileSync(sourcePath, "utf8").split(/\r?\n/);
  const start = lines.findIndex((line) => /CHAPTER\s+LX\s+XX\s+I/i.test(line));
  const end = lines.findIndex((line, index) => index > start && /CHAPTER\s+XCm\.?\s*$/i.test(line));
  if (start < 0 || end < 0 || end <= start) {
    throw new Error(`Could not locate Devi Mahatmya boundaries in ${sourcePath}`);
  }
  mkdirSync(path.dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, lines.slice(start, end + 62).join("\n"), "utf8");
  writeMetadata(targetPath, {
    work_id: "devi_mahatmya_markandeya_dutt_1896_en",
    work_title: "Devi Mahatmya (Markandeya Purana, chapters 81–93)",
    title: "Devi Mahatmya — derived section extract",
    language: "en",
    translator: "Manmatha Nath Dutt",
    translation_year: "1896",
    source_url: "https://archive.org/details/in.ernet.dli.2015.163375",
    source_name: "Internet Archive scan; derived from existing staged Dutt text",
    licence: "public_domain",
    copyright_status: "Public-domain candidate; verify edition, OCR provenance, and deployment jurisdiction",
    can_store: true,
    can_show_excerpts: true,
    can_embed: true,
    permission_needed: "Unclear",
    provenance_confidence: "Medium",
    review_needed: "legal; Shakta review; OCR proofing; section boundaries; attribution",
    notes:
      `Derived from ${path.relative(repoRoot, sourcePath)}. Extract starts at OCR chapter heading line ${start + 1} and ends after the OCR chapter XCIII section near line ${end + 62}; this is not a proofread critical text.`,
  });
  return {
    work_id: "devi_mahatmya_markandeya_dutt_1896_en",
    target_path: path.relative(repoRoot, targetPath),
    source_lines: [start + 1, end + 62],
  };
}

const staged = [stageDevi(), await stageLalita(), await stageAditya()];
const manifestPath = path.join(rawRoot, `english_gap_source_stage_manifest_${stagedDate}.json`);
writeFileSync(
  manifestPath,
  `${JSON.stringify({
    staged_at: `${stagedDate}T00:00:00Z`,
    language_scope: ["en"],
    policy: "review-first staging; no source is approved for production retrieval by this script",
    sources: staged,
  }, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify({ staged, manifest: path.relative(repoRoot, manifestPath) }, null, 2));

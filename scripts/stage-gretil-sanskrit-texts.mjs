import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const inventoryPath = path.join(repoRoot, "docs/source_inventory_template.csv");
const queuePath = path.join(repoRoot, "docs/source_download_queue_2026-06-19.csv");
const readmePath = path.join(repoRoot, "content/_staging/README.md");
const targetDir = "content/_staging/raw/sanskrit/gretil";
const fetchedAt = new Date().toISOString();
const baseUrl = "https://gretil.sub.uni-goettingen.de/gretil/corpustei/";
const userAgent = "DharmaDailyCorpusResearch/0.5 (local staging; nonproduction)";

const works = [
  {
    slug: "sa_mAdhva-kRSNAmRtamahArNava",
    textName: "Krishnamritamaharnava",
    author: "Madhva",
    tradition: "madhva/dvaita",
    category: "devotional/sanskrit",
  },
  {
    slug: "sa_mAdhva-anuvyAkhyAna",
    textName: "Anuvyakhyana",
    author: "Madhva",
    tradition: "madhva/dvaita",
    category: "commentary/sanskrit",
  },
  {
    slug: "sa_mAdhva-mahAbhAratatAtparyanirNaya",
    textName: "Mahabharata Tatparya Nirnaya",
    author: "Madhva",
    tradition: "madhva/dvaita",
    category: "itihasa_commentary/sanskrit",
  },
  {
    slug: "sa_abhinavagupta-anuttarASTikA",
    textName: "Anuttarashtika",
    author: "Abhinavagupta",
    tradition: "kashmir_shaiva",
    category: "shaiva/sanskrit",
  },
  {
    slug: "sa_abhinavagupta-bhairavastava",
    textName: "Bhairavastava",
    author: "Abhinavagupta",
    tradition: "kashmir_shaiva",
    category: "shaiva/sanskrit",
  },
  {
    slug: "sa_abhinavagupta-bodhapaJcadazikA",
    textName: "Bodhapancharashika",
    author: "Abhinavagupta",
    tradition: "kashmir_shaiva",
    category: "shaiva/sanskrit",
  },
  {
    slug: "sa_abhinavagupta-IzvarapratyabhijJAvimarzinI",
    textName: "Ishvara Pratyabhijna Vimarshini",
    author: "Abhinavagupta",
    tradition: "kashmir_shaiva",
    category: "shaiva_commentary/sanskrit",
  },
  {
    slug: "sa_abhinavagupta-kramastotra",
    textName: "Kramastotra",
    author: "Abhinavagupta",
    tradition: "kashmir_shaiva",
    category: "shaiva/sanskrit",
  },
  {
    slug: "sa_abhinavagupta-mAlinIzlokavArttika",
    textName: "Malini Shloka Varttika",
    author: "Abhinavagupta",
    tradition: "kashmir_shaiva",
    category: "tantra_commentary/sanskrit",
  },
  {
    slug: "sa_abhinavagupta-paramArthasAra",
    textName: "Paramarthasara",
    author: "Abhinavagupta",
    tradition: "kashmir_shaiva",
    category: "shaiva/sanskrit",
  },
  {
    slug: "sa_abhinavagupta-paramArthasAra-comm",
    textName: "Paramarthasara Commentary",
    author: "Abhinavagupta",
    tradition: "kashmir_shaiva",
    category: "shaiva_commentary/sanskrit",
  },
  {
    slug: "sa_abhinavagupta-paryantapaJcAzikA",
    textName: "Paryantapanchashika",
    author: "Abhinavagupta",
    tradition: "kashmir_shaiva",
    category: "shaiva/sanskrit",
  },
  {
    slug: "sa_abhinavagupta-tantrAloka",
    textName: "Tantraloka",
    author: "Abhinavagupta",
    tradition: "kashmir_shaiva",
    category: "tantra/sanskrit",
  },
  {
    slug: "sa_abhinavagupta-tantrasAra",
    textName: "Tantrasara",
    author: "Abhinavagupta",
    tradition: "kashmir_shaiva",
    category: "tantra/sanskrit",
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

async function fetchFile(url, targetPath) {
  const absoluteTarget = path.join(repoRoot, targetPath);
  await mkdir(path.dirname(absoluteTarget), { recursive: true });
  if (existsSync(absoluteTarget)) {
    return { status: "already_exists", bytes: readFileSync(absoluteTarget).byteLength };
  }
  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
      Accept: "text/plain,application/xml,text/xml,*/*",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(absoluteTarget, bytes);
  return { status: "downloaded", bytes: bytes.length };
}

const results = [];
for (const work of works) {
  const safeSlug = work.slug.replaceAll("-", "_");
  const txtUrl = `${baseUrl}transformations/plaintext/${work.slug}.txt`;
  const xmlUrl = `${baseUrl}${work.slug}.xml`;
  const txtTargetPath = `${targetDir}/${safeSlug}.txt`;
  const xmlTargetPath = `${targetDir}/${safeSlug}.xml`;
  try {
    const txt = await fetchFile(txtUrl, txtTargetPath);
    const xml = await fetchFile(xmlUrl, xmlTargetPath);
    console.log(`STAGED ${work.slug} txt=${txt.bytes} xml=${xml.bytes}`);
    results.push({
      ...work,
      txtUrl,
      xmlUrl,
      txtTargetPath,
      xmlTargetPath,
      txtBytes: txt.bytes,
      xmlBytes: xml.bytes,
      status: "downloaded",
    });
  } catch (error) {
    console.warn(`WARN ${work.slug} ${error.message}`);
    results.push({ ...work, txtUrl, xmlUrl, txtTargetPath, xmlTargetPath, error: error.message });
  }
}

const staged = results.filter((result) => !result.error);
const manifestPath = path.join(
  repoRoot,
  "content/_staging/raw/gretil_sanskrit_texts_manifest_2026-07-06.json",
);
await writeFile(manifestPath, JSON.stringify({ fetched_at: fetchedAt, results }, null, 2), "utf8");
console.log(`WROTE ${path.relative(repoRoot, manifestPath)}`);

const inventoryHeader = readFileSync(inventoryPath, "utf8").split(/\r?\n/, 1)[0].split(",");
const queueHeader = readFileSync(queuePath, "utf8").split(/\r?\n/, 1)[0].split(",");
const inventoryIds = readIds(inventoryPath);
const queueIds = readIds(queuePath);

const inventoryRows = staged.map((work) => ({
  work_id: `gretil_${work.slug.replace(/^sa_/, "").replaceAll("-", "_").toLowerCase()}`,
  text_name: work.textName,
  category: work.category,
  tradition_or_sect: work.tradition,
  region: "pan_indian/kashmir",
  language: "Sanskrit",
  script: "Roman transliteration",
  translator: "none",
  commentator: work.textName.toLowerCase().includes("commentary") ? work.author : "none",
  edition: "GRETIL TEI/plaintext export",
  translation_year: "TBD",
  source_name: "GRETIL",
  source_url: work.txtUrl,
  source_type: "digital_text_repository",
  format: "TXT/XML",
  licence: "GRETIL terms require review before app use",
  copyright_status: "Digital text rights and source edition require review",
  can_store: "Yes for staging",
  can_show_excerpts: "Unclear until legal/content review",
  can_embed_full_text: "Unclear until legal review",
  can_use_for_rag: "No until legal review, Sanskrit segmentation, and edition review",
  attribution_required: "Preserve GRETIL URL, author, file slug, and TEI metadata",
  commercial_use_allowed: "Unclear until legal review",
  permission_needed: "Unclear",
  provenance_confidence: "High",
  ingestion_difficulty: "Medium",
  review_needed: "legal; Sanskrit segmentation; TEI metadata review; tradition labeling",
  human_reviewer_notes: `Plaintext staged at ${work.txtTargetPath}; XML sidecar staged at ${work.xmlTargetPath} on 2026-07-06.`,
  status: "staged_candidate",
}));

const queueRows = staged.map((work) => ({
  work_id: `gretil_${work.slug.replace(/^sa_/, "").replaceAll("-", "_").toLowerCase()}`,
  text_name: work.textName,
  language: "Sanskrit",
  source_name: "GRETIL",
  source_url: work.txtUrl,
  download_url: work.txtUrl,
  target_path: work.txtTargetPath,
  rights_status: "Review before use; staging is not production approval",
  status: "downloaded_staged",
  notes: `Plaintext staged on 2026-07-06 (${work.txtBytes} bytes); XML sidecar at ${work.xmlTargetPath} (${work.xmlBytes} bytes).`,
}));

appendRows(inventoryPath, inventoryHeader, inventoryIds, inventoryRows);
appendRows(queuePath, queueHeader, queueIds, queueRows);

const readme = readFileSync(readmePath, "utf8");
const marker = "Run notes for 2026-07-06 GRETIL Sanskrit text acquisition:";
if (!readme.includes(marker)) {
  const note =
    `\n${marker}\n\n` +
    `- Staged ${staged.length} GRETIL Sanskrit plaintext files under \`${targetDir}\`, with matching TEI XML sidecars.\n` +
    "- This batch adds Madhva/Dvaita and Abhinavagupta/Kashmir Shaiva/Tantra source candidates that were visible in the already staged GRETIL index.\n" +
    "- These are raw Sanskrit candidates only. They require GRETIL terms review, TEI metadata review, Sanskrit segmentation, and tradition/category labeling before embedding, RAG, or app display.\n";
  writeFileSync(readmePath, `${readme.endsWith("\n") ? readme : `${readme}\n`}${note}`, "utf8");
}

import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const gatewayPath = path.join(
  repoRoot,
  "content/_staging/raw/sanskrit/brahma_vaivarta_purana_web_archive_gateway.html",
);
const inventoryPath = path.join(repoRoot, "docs/source_inventory_template.csv");
const queuePath = path.join(repoRoot, "docs/source_download_queue_2026-06-19.csv");
const readmePath = path.join(repoRoot, "content/_staging/README.md");
const targetDir = "content/_staging/raw/sanskrit/vedicreserve_puranas";
const fetchedAt = new Date().toISOString();
const userAgent = "DharmaDailyCorpusResearch/0.5 (local staging; nonproduction)";
const waybackPrefix = "https://web.archive.org/web/20080408110939/http://is1.mum.edu/vedicreserve/";

const titleOverrides = {
  "narada_purana_purva.pdf": "Narada Purana Purva Bhagam",
  "narada_purana_uttara.pdf": "Narada Purana Uttara Bhagam",
  "padma_purana_1srishti.pdf": "Padma Purana Srishti Khandam",
  "padma_purana_2bhumi.pdf": "Padma Purana Bhumi Khandam",
  "padma_purana_3svarga.pdf": "Padma Purana Svarga Khandam",
  "padma_purana_4brahma.pdf": "Padma Purana Brahma Khandam",
  "padma_purana_5patala.pdf": "Padma Purana Patala Khandam",
  "padma_purana_6uttara.pdf": "Padma Purana Uttara Khandam",
  "padma_purana_7kriya.pdf": "Padma Purana Kriya Khandam",
};

const priorityNames = new Set([
  "agni_purana.pdf",
  "bhagavata_purana.pdf",
  "brahma_purana.pdf",
  "brahmanda_purana.pdf",
  "brahmavaivartapurana01.pdf",
  "brahmavaivartapurana02.pdf",
  "brahmavaivartapurana03.pdf",
  "brahmavaivartapurana04.pdf",
  "brahmavaivartapurana05.pdf",
  "brahmavaivartapurana06.pdf",
  "brahmavaivartapurana07.pdf",
  "brahmavaivartapurana08.pdf",
  "brahmavaivartapurana09.pdf",
  "kurma_purana.pdf",
  "linga_purana.pdf",
  "markandeya_purana_1.pdf",
  "markandeya_purana_2.pdf",
  "markandeya_purana_3.pdf",
  "markandeya_purana_4.pdf",
  "markandeya_purana_5.pdf",
  "markandeya_purana_6.pdf",
  "markandeya_purana_7.pdf",
  "matsya_purana.pdf",
  "narada_purana_purva.pdf",
  "narada_purana_uttara.pdf",
  "padma_purana_1srishti.pdf",
  "padma_purana_2bhumi.pdf",
  "padma_purana_3svarga.pdf",
  "padma_purana_4brahma.pdf",
  "padma_purana_5patala.pdf",
  "padma_purana_6uttara.pdf",
  "padma_purana_7kriya.pdf",
  "siva_purana_01.pdf",
  "siva_purana_02.pdf",
  "siva_purana_03.pdf",
  "siva_purana_04.pdf",
  "siva_purana_05.pdf",
  "siva_purana_06.pdf",
  "siva_purana_07.pdf",
  "siva_purana_08.pdf",
  "siva_purana_09.pdf",
  "siva_purana_10.pdf",
  "vamana_purana.pdf",
  "vishnu_purana.pdf",
  "devibhagavata_purana.pdf",
  "kapila_purana.pdf",
  "nandi_purana.pdf",
  "narasimha_purana.pdf",
  "nilamata_purana.pdf",
  "parashara_purana.pdf",
  "samba_purana.pdf",
  "saura_purana.pdf",
  "vishnudharma_purana.pdf",
]);

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

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

function titleFromFilename(filename) {
  if (titleOverrides[filename]) return titleOverrides[filename];
  return filename
    .replace(/\.pdf$/i, "")
    .replace(/(\d+)$/, " $1")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bSiva\b/g, "Shiva")
    .replace(/\bBrahmavaivartapurana\b/g, "Brahma Vaivarta Purana");
}

function workIdFromHref(href) {
  return `vedicreserve_${href
    .replace(/\.pdf$/i, "")
    .replaceAll("/", "_")
    .replaceAll("-", "_")
    .toLowerCase()}`;
}

function categoryFromHref(href) {
  return href.startsWith("upapurana/") ? "upapurana/sanskrit" : "purana/sanskrit";
}

function traditionFromHref(href) {
  if (/devi|markandeya/i.test(href)) return "shakta";
  if (/siva|linga|saura|nandi/i.test(href)) return "shaiva";
  if (/vishnu|bhagavata|narada|vamana/i.test(href)) return "vaishnava";
  return "general";
}

function extractPdfLinks(html) {
  const links = new Map();
  const areaRegex = /<area\b[^>]*\bhref\s*=\s*["']([^"']+\.pdf)["'][^>]*>/gi;
  let match;
  while ((match = areaRegex.exec(html))) {
    const href = decodeHtml(match[1]);
    const filename = path.posix.basename(href);
    if (!priorityNames.has(filename)) continue;
    const tag = match[0];
    const titleMatch = tag.match(/\b(?:title|alt)\s*=\s*["']([^"']+)["']/i);
    links.set(href, {
      href,
      filename,
      title: titleMatch
        ? decodeHtml(titleMatch[1]).replace(/\s+/g, " ").trim()
        : titleFromFilename(filename),
    });
  }
  return [...links.values()].sort((a, b) => a.href.localeCompare(b.href, "en", { numeric: true }));
}

async function fetchBytes(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
      Accept: "application/pdf,*/*",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return Buffer.from(await response.arrayBuffer());
}

async function downloadToFile(url, target) {
  try {
    const bytes = await fetchBytes(url);
    await writeFile(target, bytes);
    return bytes.length;
  } catch (error) {
    return downloadToFileWithCurl(url, target, error);
  }
}

async function downloadToFileWithCurl(url, target, originalError) {
  let lastError = originalError;
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    const args = [
      "--location",
      "--fail",
      "--show-error",
      "--max-time",
      "240",
      "--connect-timeout",
      "30",
      "--retry",
      "2",
      "--retry-delay",
      "3",
      "--retry-connrefused",
      "--continue-at",
      "-",
      "--user-agent",
      userAgent,
      "--output",
      target,
      url,
    ];
    const errors = [];
    const child = spawn("curl.exe", args, { stdio: ["ignore", "ignore", "pipe"] });
    child.stderr.on("data", (chunk) => errors.push(chunk));
    const exitCode = await new Promise((resolve, reject) => {
      child.on("error", reject);
      child.on("close", resolve);
    });
    if (exitCode === 0) {
      const file = await stat(target);
      return file.size;
    }
    const stderr = Buffer.concat(errors).toString("utf8").trim();
    lastError = new Error(
      `fetch failed (${originalError.message}); curl attempt ${attempt} exited ${exitCode}${stderr ? `: ${stderr}` : ""}`,
    );
  }
  throw lastError;
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

const gatewayHtml = await readFile(gatewayPath, "utf8");
const links = extractPdfLinks(gatewayHtml);
await mkdir(path.join(repoRoot, targetDir), { recursive: true });

const results = [];
for (const link of links) {
  const downloadUrl = `${waybackPrefix}${link.href}`;
  const targetPath = `${targetDir}/${link.filename}`;
  const absoluteTarget = path.join(repoRoot, targetPath);
  try {
    if (existsSync(absoluteTarget)) {
      const size = readFileSync(absoluteTarget).byteLength;
      console.log(`SKIP existing ${targetPath} ${size} bytes`);
      results.push({ ...link, downloadUrl, targetPath, bytes: size, status: "already_exists" });
      continue;
    }
    const size = await downloadToFile(downloadUrl, absoluteTarget);
    console.log(`DOWNLOADED ${targetPath} ${size} bytes`);
    results.push({ ...link, downloadUrl, targetPath, bytes: size, status: "downloaded" });
  } catch (error) {
    console.warn(`WARN ${targetPath} ${error.message}`);
    results.push({ ...link, downloadUrl, targetPath, error: error.message, status: "error" });
  }
}

const staged = results.filter((result) => !result.error);
const manifestPath = path.join(
  repoRoot,
  "content/_staging/raw/vedicreserve_purana_pdf_manifest_2026-07-06.json",
);
await writeFile(manifestPath, JSON.stringify({ fetched_at: fetchedAt, results }, null, 2), "utf8");
console.log(`WROTE ${path.relative(repoRoot, manifestPath)}`);

const inventoryHeader = readFileSync(inventoryPath, "utf8").split(/\r?\n/, 1)[0].split(",");
const queueHeader = readFileSync(queuePath, "utf8").split(/\r?\n/, 1)[0].split(",");
const inventoryIds = readIds(inventoryPath);
const queueIds = readIds(queuePath);

const inventoryRows = staged.map((item) => ({
  work_id: workIdFromHref(item.href),
  text_name: titleFromFilename(item.filename),
  category: categoryFromHref(item.href),
  tradition_or_sect: traditionFromHref(item.href),
  region: "pan_indian",
  language: "Sanskrit",
  script: "Devanagari",
  translator: "none",
  commentator: "none",
  edition: "Vedic Reserve archived PDF",
  translation_year: "TBD",
  source_name: "Web Archive / Vedic Reserve",
  source_url:
    "https://web.archive.org/web/20080408110939/http://is1.mum.edu/vedicreserve/puran.htm",
  source_type: "archived_pdf",
  format: "PDF",
  licence: "Vedic Reserve/Web Archive terms require review before app use",
  copyright_status: "Sanskrit source candidate; edition and scan rights require review",
  can_store: "Yes for staging",
  can_show_excerpts: "Unclear until legal/content review",
  can_embed_full_text: "Unclear until legal review",
  can_use_for_rag: "No until OCR extraction, legal review, and Sanskrit segmentation",
  attribution_required: "Preserve Web Archive capture URL and original Vedic Reserve path",
  commercial_use_allowed: "Unclear until legal review",
  permission_needed: "Unclear",
  provenance_confidence: "Medium",
  ingestion_difficulty: "High",
  review_needed: "legal; Sanskrit OCR/PDF extraction; segmentation; source edition review",
  human_reviewer_notes: `Downloaded archived Devanagari PDF from ${item.downloadUrl} on 2026-07-06; raw staging only.`,
  status: "staged_candidate",
}));

const queueRows = staged.map((item) => ({
  work_id: workIdFromHref(item.href),
  text_name: titleFromFilename(item.filename),
  language: "Sanskrit",
  source_name: "Web Archive / Vedic Reserve",
  source_url:
    "https://web.archive.org/web/20080408110939/http://is1.mum.edu/vedicreserve/puran.htm",
  download_url: item.downloadUrl,
  target_path: item.targetPath,
  rights_status: "Review before use; staging is not production approval",
  status: "downloaded_staged",
  notes: `Archived Devanagari PDF staged on 2026-07-06 (${item.bytes} bytes); OCR extraction and legal review required.`,
}));

appendRows(inventoryPath, inventoryHeader, inventoryIds, inventoryRows);
appendRows(queuePath, queueHeader, queueIds, queueRows);

const readme = readFileSync(readmePath, "utf8");
const marker = "Run notes for 2026-07-06 Vedic Reserve Purana PDF acquisition:";
if (!readme.includes(marker)) {
  const note =
    `\n${marker}\n\n` +
    `- Staged ${staged.length} archived Vedic Reserve Devanagari Purana/upapurana PDFs under \`${targetDir}\`.\n` +
    "- This batch covers missing Sanskrit Purana source candidates including Shiva, Padma, Narada, Linga, Brahmanda, Kurma, Matsya, Vamana, Vishnu, Brahma, Bhagavata, Agni, Brahma Vaivarta, Markandeya, and selected upapuranas.\n" +
    "- These are raw scan/PDF candidates only. They require legal review, Sanskrit OCR/PDF extraction, segmentation, edition review, and source-category labeling before any embedding, RAG, or app display.\n";
  writeFileSync(readmePath, `${readme.endsWith("\n") ? readme : `${readme}\n`}${note}`, "utf8");
}

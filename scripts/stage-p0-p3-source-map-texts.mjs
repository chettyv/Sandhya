import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const fetchedAt = new Date().toISOString();
const userAgent = "SandhyaCorpusResearch/0.4 (local staging; nonproduction)";

const directDownloads = [
  {
    workId: "tirukkural_project_madurai_source_map_ta_en",
    url: "https://projectmadurai.org/pm_etexts/tscii/pmtsc0017.html",
    targetPath: "content/_staging/raw/tamil/tirukkural_project_madurai_source_map_ta_en.html",
  },
  {
    workId: "kamba_ramayanam_project_madurai_ayodhya_part1_ta",
    url: "https://projectmadurai.org/pm_etexts/utf8/pmuni0422_01.html",
    targetPath: "content/_staging/raw/tamil/kamba_ramayanam_project_madurai_ayodhya_part1_ta.html",
  },
  {
    workId: "tiruvacagam_project_madurai_pope_part1_en",
    url: "https://www.projectmadurai.org/pm_etexts/tscii/pmtsc0094.html",
    targetPath: "content/_staging/raw/tamil/tiruvacagam_project_madurai_pope_part1_en.html",
  },
  {
    workId: "divya_prabandham_project_madurai_muthal_ayiram_ta",
    url: "https://www.projectmadurai.org/pm_etexts/utf8/pmuni0005_01.html",
    targetPath: "content/_staging/raw/tamil/divya_prabandham_project_madurai_muthal_ayiram_ta.html",
  },
  {
    workId: "dnyaneshwari_wikisource_mr_rendered",
    url: "https://en.wikisource.org/wiki/mr:%E0%A4%9C%E0%A5%8D%E0%A4%9E%E0%A4%BE%E0%A4%A8%E0%A5%87%E0%A4%B6%E0%A5%8D%E0%A4%B5%E0%A4%B0%E0%A5%80",
    targetPath: "content/_staging/raw/marathi/dnyaneshwari_wikisource_mr_rendered.html",
  },
  {
    workId: "ramcharitmanas_english_wikisource_rendered",
    url: "https://en.wikisource.org/wiki/en:The%20R%C3%A1m%C3%A1yana%20of%20Tulsi%20D%C3%A1s",
    targetPath: "content/_staging/raw/english/ramcharitmanas_english_wikisource_rendered.html",
  },
  {
    workId: "brahma_vaivarta_purana_web_archive_gateway",
    url: "https://web.archive.org/web/20080408110939/http://is1.mum.edu/vedicreserve/puran.htm",
    targetPath: "content/_staging/raw/sanskrit/brahma_vaivarta_purana_web_archive_gateway.html",
  },
];

async function fetchBytes(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
      Accept: "text/html,application/pdf,text/plain,*/*",
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": userAgent, Accept: "text/html,*/*" },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function stageDirect({ workId, url, targetPath }) {
  const target = path.join(repoRoot, targetPath);
  await mkdir(path.dirname(target), { recursive: true });
  const bytes = await fetchBytes(url);
  await writeFile(target, bytes);
  console.log(`DOWNLOADED ${workId} ${bytes.length} bytes ${targetPath}`);
  return { workId, url, targetPath, bytes: bytes.length };
}

function extractPdfUrl(html, pageUrl) {
  const matches = [...html.matchAll(/\bhref\s*=\s*["']([^"']+\.pdf[^"']*)["']/gi)];
  for (const match of matches) {
    const candidate = new URL(match[1].replaceAll("&amp;", "&"), pageUrl);
    if (candidate.hostname.includes("anu.edu.au")) {
      return candidate.toString();
    }
  }
  return null;
}

async function stageAnuVishnuPurana() {
  const pageUrl = "https://press.anu.edu.au/publications/textbooks/visnu-purana";
  const pageHtml = await fetchText(pageUrl);
  const pageTargetPath = "content/_staging/raw/english/vishnu_purana_taylor_anu_press_page.html";
  await mkdir(path.dirname(path.join(repoRoot, pageTargetPath)), { recursive: true });
  await writeFile(path.join(repoRoot, pageTargetPath), pageHtml, "utf8");

  const pdfUrl = extractPdfUrl(pageHtml, pageUrl);
  if (!pdfUrl) {
    console.warn("WARN vishnu_purana_taylor_anu_press_pdf no PDF URL found");
    return {
      workId: "vishnu_purana_taylor_anu_press_pdf",
      url: pageUrl,
      targetPath: pageTargetPath,
      bytes: Buffer.byteLength(pageHtml),
      warning: "PDF URL not found; page HTML staged",
    };
  }

  const pdfTargetPath = "content/_staging/raw/english/vishnu_purana_taylor_anu_press_2021.pdf";
  const pdf = await fetchBytes(pdfUrl);
  await writeFile(path.join(repoRoot, pdfTargetPath), pdf);
  console.log(`DOWNLOADED vishnu_purana_taylor_anu_press_pdf ${pdf.length} bytes ${pdfTargetPath}`);
  return {
    workId: "vishnu_purana_taylor_anu_press_pdf",
    url: pdfUrl,
    targetPath: pdfTargetPath,
    bytes: pdf.length,
    pageTargetPath,
  };
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeHtml(match[1].replace(/\s+/g, " ").trim()) : "";
}

function extractWisdomLibLinks(html, baseUrl, pathPrefix) {
  const links = new Set([baseUrl]);
  const hrefRegex = /\bhref\s*=\s*["']([^"']+)["']/gi;
  let match;

  while ((match = hrefRegex.exec(html))) {
    const href = decodeHtml(match[1]).trim();
    if (!href || href.startsWith("#") || href.startsWith("mailto:")) {
      continue;
    }
    const url = new URL(href, baseUrl);
    url.hash = "";
    if (
      url.hostname === "www.wisdomlib.org" &&
      url.pathname.startsWith(pathPrefix) &&
      !url.pathname.endsWith("/pdf")
    ) {
      links.add(url.toString());
    }
  }

  return [...links].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}

async function stageWisdomLibBook({ workId, indexUrl, pathPrefix, targetPath }) {
  const indexHtml = await fetchText(indexUrl);
  const pageUrls = extractWisdomLibLinks(indexHtml, indexUrl, pathPrefix);
  const lines = [];
  const errors = [];

  for (const pageUrl of pageUrls) {
    try {
      const html = pageUrl === indexUrl ? indexHtml : await fetchText(pageUrl);
      lines.push(
        JSON.stringify({
          work_id: workId,
          index_url: indexUrl,
          page_url: pageUrl,
          title: extractTitle(html),
          fetched_at: fetchedAt,
          html,
        }),
      );
    } catch (error) {
      errors.push({ page_url: pageUrl, error: error.message });
    }
  }

  const target = path.join(repoRoot, targetPath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${lines.join("\n")}\n`, "utf8");
  if (errors.length > 0) {
    await writeFile(
      `${target}.errors.json`,
      JSON.stringify({ work_id: workId, fetched_at: fetchedAt, errors }, null, 2),
      "utf8",
    );
  }
  console.log(`SCRAPED ${workId} ${lines.length} pages ${targetPath}`);
  return {
    workId,
    url: indexUrl,
    targetPath,
    pages: lines.length,
    errors: errors.length,
  };
}

const results = [];
for (const download of directDownloads) {
  try {
    results.push(await stageDirect(download));
  } catch (error) {
    console.warn(`WARN ${download.workId} ${error.message}`);
    results.push({
      workId: download.workId,
      url: download.url,
      targetPath: download.targetPath,
      error: error.message,
    });
  }
}
try {
  results.push(await stageAnuVishnuPurana());
} catch (error) {
  console.warn(`WARN vishnu_purana_taylor_anu_press_pdf ${error.message}`);
  results.push({
    workId: "vishnu_purana_taylor_anu_press_pdf",
    url: "https://press.anu.edu.au/publications/textbooks/visnu-purana",
    targetPath: "content/_staging/raw/english/vishnu_purana_taylor_anu_press_2021.pdf",
    error: error.message,
  });
}
for (const wisdomLibBook of [
  {
    workId: "markandeya_purana_wisdomlib_en",
    indexUrl: "https://www.wisdomlib.org/hinduism/book/the-markandeya-purana/",
    pathPrefix: "/hinduism/book/the-markandeya-purana",
    targetPath: "content/_staging/raw/english/wisdomlib_markandeya_purana_en.jsonl",
  },
  {
    workId: "garuda_purana_dutt_wisdomlib_en",
    indexUrl: "https://www.wisdomlib.org/hinduism/book/the-garuda-purana-dutt",
    pathPrefix: "/hinduism/book/the-garuda-purana-dutt",
    targetPath: "content/_staging/raw/english/wisdomlib_garuda_purana_dutt_en.jsonl",
  },
]) {
  try {
    results.push(await stageWisdomLibBook(wisdomLibBook));
  } catch (error) {
    console.warn(`WARN ${wisdomLibBook.workId} ${error.message}`);
    results.push({
      workId: wisdomLibBook.workId,
      url: wisdomLibBook.indexUrl,
      targetPath: wisdomLibBook.targetPath,
      error: error.message,
    });
  }
}

const manifestPath = path.join(
  repoRoot,
  "content/_staging/raw/p0_p3_source_map_download_manifest_2026-07-06.json",
);
await writeFile(manifestPath, JSON.stringify({ fetched_at: fetchedAt, results }, null, 2), "utf8");
console.log(`WROTE ${path.relative(repoRoot, manifestPath)}`);

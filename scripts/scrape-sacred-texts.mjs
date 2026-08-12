import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const fetchedAt = new Date().toISOString();
const userAgent = "SandhyaCorpusResearch/0.3 (local staging; nonproduction)";
const requestDelayMs = Number.parseInt(process.env.SACRED_TEXTS_REQUEST_DELAY_MS ?? "200", 10);

const works = [
  {
    workId: "bhagavad_gita_arnold_sacred_texts_en",
    indexUrl: "https://www.sacred-texts.com/hin/gita/index.htm",
    targetPath:
      "content/_staging/raw/english/sacred_texts/bhagavad_gita_arnold_sacred_texts_en.jsonl",
    includePathRegex: /^\/hin\/gita\/.+\.htm$/i,
  },
  {
    workId: "ramayana_griffith_sacred_texts_en",
    indexUrl: "https://www.sacred-texts.com/hin/rama/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/ramayana_griffith_sacred_texts_en.jsonl",
    includePathRegex: /^\/hin\/rama\/.+\.htm$/i,
  },
  {
    workId: "mahabharata_ganguli_sacred_texts_en",
    indexUrl: "https://www.sacred-texts.com/hin/maha/index.htm",
    targetPath:
      "content/_staging/raw/english/sacred_texts/mahabharata_ganguli_sacred_texts_en.jsonl",
    includePathRegex: /^\/hin\/maha\/.+\.htm$/i,
  },
  {
    workId: "rig_veda_griffith_sacred_texts_en",
    indexUrl: "https://www.sacred-texts.com/hin/rigveda/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/rig_veda_griffith_sacred_texts_en.jsonl",
    includePathRegex: /^\/hin\/rigveda\/.+\.htm$/i,
  },
  {
    workId: "yoga_sutras_bongiovanni_sacred_texts_en",
    indexUrl: "https://www.sacred-texts.com/hin/yogasutr.htm",
    targetPath:
      "content/_staging/raw/english/sacred_texts/yoga_sutras_bongiovanni_sacred_texts_en.jsonl",
    includePathRegex: /^\/hin\/yogasutr\.htm$/i,
  },
  {
    workId: "sbe01_upanishads_part1_muller_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbe01/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/sbe01_upanishads_part1_muller_en.jsonl",
    includePathRegex: /^\/hin\/sbe01\/.+\.htm$/i,
  },
  {
    workId: "sbe02_sacred_laws_aryas_part1_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbe02/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/sbe02_sacred_laws_aryas_part1_en.jsonl",
    includePathRegex: /^\/hin\/sbe02\/.+\.htm$/i,
  },
  {
    workId: "sbe07_institutes_vishnu_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbe07/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/sbe07_institutes_vishnu_en.jsonl",
    includePathRegex: /^\/hin\/sbe07\/.+\.htm$/i,
  },
  {
    workId: "sbe08_bhagavadgita_sanatsujatiya_anugita_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbe08/index.htm",
    targetPath:
      "content/_staging/raw/english/sacred_texts/sbe08_bhagavadgita_sanatsujatiya_anugita_en.jsonl",
    includePathRegex: /^\/hin\/sbe08\/.+\.htm$/i,
  },
  {
    workId: "sbe12_satapatha_brahmana_part1_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbr/sbe12/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/sbe12_satapatha_brahmana_part1_en.jsonl",
    includePathRegex: /^\/hin\/sbr\/sbe12\/.+\.htm$/i,
  },
  {
    workId: "sbe26_satapatha_brahmana_part2_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbr/sbe26/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/sbe26_satapatha_brahmana_part2_en.jsonl",
    includePathRegex: /^\/hin\/sbr\/sbe26\/.+\.htm$/i,
  },
  {
    workId: "sbe14_sacred_laws_aryas_part2_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbe14/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/sbe14_sacred_laws_aryas_part2_en.jsonl",
    includePathRegex: /^\/hin\/sbe14\/.+\.htm$/i,
  },
  {
    workId: "sbe15_upanishads_part2_muller_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbe15/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/sbe15_upanishads_part2_muller_en.jsonl",
    includePathRegex: /^\/hin\/sbe15\/.+\.htm$/i,
  },
  {
    workId: "sbe25_laws_manu_en",
    indexUrl: "https://www.sacred-texts.com/hin/manu.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/sbe25_laws_manu_en.jsonl",
    includePathRegex: /^\/hin\/(?:manu\.htm|manu\/manu\d+\.htm)$/i,
  },
  {
    workId: "sbe29_grihya_sutras_part1_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbe29/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/sbe29_grihya_sutras_part1_en.jsonl",
    includePathRegex: /^\/hin\/sbe29\/.+\.htm$/i,
  },
  {
    workId: "sbe30_grihya_sutras_part2_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbe30/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/sbe30_grihya_sutras_part2_en.jsonl",
    includePathRegex: /^\/hin\/sbe30\/.+\.htm$/i,
  },
  {
    workId: "sbe32_vedic_hymns_part1_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbe32/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/sbe32_vedic_hymns_part1_en.jsonl",
    includePathRegex: /^\/hin\/sbe32\/.+\.htm$/i,
  },
  {
    workId: "sbe33_minor_law_books_brihaspati_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbe33/index.htm",
    targetPath:
      "content/_staging/raw/english/sacred_texts/sbe33_minor_law_books_brihaspati_en.jsonl",
    includePathRegex: /^\/hin\/sbe33\/.+\.htm$/i,
  },
  {
    workId: "sbe34_vedanta_sutras_sankara_part1_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbe34/index.htm",
    targetPath:
      "content/_staging/raw/english/sacred_texts/sbe34_vedanta_sutras_sankara_part1_en.jsonl",
    includePathRegex: /^\/hin\/sbe34\/.+\.htm$/i,
  },
  {
    workId: "sbe38_vedanta_sutras_sankara_part2_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbe38/index.htm",
    targetPath:
      "content/_staging/raw/english/sacred_texts/sbe38_vedanta_sutras_sankara_part2_en.jsonl",
    includePathRegex: /^\/hin\/sbe38\/.+\.htm$/i,
  },
  {
    workId: "sbe41_satapatha_brahmana_part3_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbr/sbe41/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/sbe41_satapatha_brahmana_part3_en.jsonl",
    includePathRegex: /^\/hin\/sbr\/sbe41\/.+\.htm$/i,
  },
  {
    workId: "sbe42_hymns_atharva_veda_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbe42/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/sbe42_hymns_atharva_veda_en.jsonl",
    includePathRegex: /^\/hin\/sbe42\/.+\.htm$/i,
  },
  {
    workId: "sbe46_vedic_hymns_part2_agni_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbe46/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/sbe46_vedic_hymns_part2_agni_en.jsonl",
    includePathRegex: /^\/hin\/sbe46\/.+\.htm$/i,
  },
  {
    workId: "sbe43_satapatha_brahmana_part4_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbr/sbe43/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/sbe43_satapatha_brahmana_part4_en.jsonl",
    includePathRegex: /^\/hin\/sbr\/sbe43\/.+\.htm$/i,
  },
  {
    workId: "sbe44_satapatha_brahmana_part5_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbr/sbe44/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/sbe44_satapatha_brahmana_part5_en.jsonl",
    includePathRegex: /^\/hin\/sbr\/sbe44\/.+\.htm$/i,
  },
  {
    workId: "sbe48_vedanta_sutras_ramanuja_en",
    indexUrl: "https://www.sacred-texts.com/hin/sbe48/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/sbe48_vedanta_sutras_ramanuja_en.jsonl",
    includePathRegex: /^\/hin\/sbe48\/.+\.htm$/i,
  },
  {
    workId: "sankhya_aphorisms_kapila_ballantyne_en",
    indexUrl: "https://www.sacred-texts.com/hin/sak/index.htm",
    targetPath:
      "content/_staging/raw/english/sacred_texts/sankhya_aphorisms_kapila_ballantyne_en.jsonl",
    includePathRegex: /^\/hin\/sak\/.+\.htm$/i,
  },
  {
    workId: "vishnu_purana_wilson_sacred_texts_en",
    indexUrl: "https://www.sacred-texts.com/hin/vp/index.htm",
    targetPath:
      "content/_staging/raw/english/sacred_texts/vishnu_purana_wilson_sacred_texts_en.jsonl",
    includePathRegex: /^\/hin\/vp\/.+\.htm$/i,
  },
  {
    workId: "mahanirvana_tantra_avalon_en",
    indexUrl: "https://www.sacred-texts.com/tantra/maha/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/mahanirvana_tantra_avalon_en.jsonl",
    includePathRegex: /^\/tantra\/maha\/.+\.htm$/i,
  },
  {
    workId: "hymns_to_the_goddess_avalon_en",
    indexUrl: "https://www.sacred-texts.com/tantra/htg/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/hymns_to_the_goddess_avalon_en.jsonl",
    includePathRegex: /^\/tantra\/htg\/.+\.htm$/i,
  },
  {
    workId: "hymn_to_kali_avalon_en",
    indexUrl: "https://www.sacred-texts.com/tantra/htk/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/hymn_to_kali_avalon_en.jsonl",
    includePathRegex: /^\/tantra\/htk\/.+\.htm$/i,
  },
  {
    workId: "shakti_and_shakta_avalon_1918_en",
    indexUrl: "https://www.sacred-texts.com/tantra/sas/index.htm",
    targetPath: "content/_staging/raw/english/sacred_texts/shakti_and_shakta_avalon_1918_en.jsonl",
    includePathRegex: /^\/tantra\/sas\/.+\.htm$/i,
  },
  {
    workId: "atharva_veda_griffith_sacred_texts_en",
    indexUrl: "https://www.sacred-texts.com/hin/av/index.htm",
    targetPath:
      "content/_staging/raw/english/sacred_texts/atharva_veda_griffith_sacred_texts_en.jsonl",
    includePathRegex: /^\/hin\/av\/.+\.htm$/i,
  },
];

function decodeHtmlEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) return "";
  return decodeHtmlEntities(match[1].replace(/\s+/g, " ").trim());
}

function extractLinks(html, baseUrl, includePathRegex) {
  const links = new Set();
  const addUrl = (candidateUrl) => {
    const normalizedUrl = new URL(candidateUrl);
    normalizedUrl.hostname = "www.sacred-texts.com";
    normalizedUrl.hash = "";
    links.add(normalizedUrl.toString());
  };

  addUrl(baseUrl);
  const hrefRegex = /\bhref\s*=\s*["']([^"']+)["']/gi;
  let match;

  while ((match = hrefRegex.exec(html))) {
    const href = decodeHtmlEntities(match[1]).trim();
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("javascript:")
    ) {
      continue;
    }

    const url = new URL(href, baseUrl);
    url.hash = "";
    if (url.hostname !== "www.sacred-texts.com" && url.hostname !== "sacred-texts.com") {
      continue;
    }
    if (includePathRegex.test(url.pathname)) {
      addUrl(url);
    }
  }

  return [...links].sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
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

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapeWork(work) {
  console.log(`INDEX ${work.workId} ${work.indexUrl}`);
  const indexHtml = await fetchText(work.indexUrl);
  const pageUrls = extractLinks(indexHtml, work.indexUrl, work.includePathRegex);
  const lines = [];
  const errors = [];

  for (const pageUrl of pageUrls) {
    try {
      const html = pageUrl === work.indexUrl ? indexHtml : await fetchText(pageUrl);
      lines.push(
        JSON.stringify({
          work_id: work.workId,
          index_url: work.indexUrl,
          page_url: pageUrl,
          title: extractTitle(html),
          fetched_at: fetchedAt,
          html,
        }),
      );
      console.log(`PAGE ${work.workId} ${lines.length}/${pageUrls.length} ${pageUrl}`);
    } catch (error) {
      errors.push({ page_url: pageUrl, error: error.message });
      console.warn(`WARN ${work.workId} ${pageUrl} ${error.message}`);
    }
    if (requestDelayMs > 0) {
      await sleep(requestDelayMs);
    }
  }

  const target = path.join(repoRoot, work.targetPath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${lines.join("\n")}\n`, "utf8");

  if (errors.length > 0) {
    await writeFile(
      `${target}.errors.json`,
      JSON.stringify({ work_id: work.workId, fetched_at: fetchedAt, errors }, null, 2),
      "utf8",
    );
  }

  return {
    workId: work.workId,
    pages: lines.length,
    errors: errors.length,
    targetPath: work.targetPath,
  };
}

const selectedWorkIds = new Set(process.argv.slice(2));
const selectedWorks =
  selectedWorkIds.size === 0 ? works : works.filter((work) => selectedWorkIds.has(work.workId));

if (selectedWorks.length === 0) {
  console.error("No matching work ids.");
  process.exit(1);
}

const results = [];
for (const work of selectedWorks) {
  results.push(await scrapeWork(work));
}

console.log(JSON.stringify({ fetched_at: fetchedAt, results }, null, 2));

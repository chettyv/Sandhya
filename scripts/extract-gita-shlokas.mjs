#!/usr/bin/env node
// Extracts Bhagavad Gita mula verses from the staged Sanskrit Wikisource
// export into draft shloka files (content/shlokas/gita-C-V.md). The verse
// text is COPIED from the source; IAST is a deterministic transliteration;
// "Say it" is a mechanical syllable draft. Everything lands as review_status
// draft — translation, stress marks, and sign-off happen in review.
// Usage: node scripts/extract-gita-shlokas.mjs [chapters e.g. 2,12]
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const sourcePath = join(root, "content", "_staging", "raw", "sanskrit", "wikisource_bhagavad_gita_sa.jsonl");
const outDir = join(root, "content", "shlokas");
const chapters = (process.argv[2] ?? "2,12").split(",").map(Number);

const CHAPTER_TITLES = [
  "अर्जुनविषादयोगः", "साङ्ख्ययोगः", "कर्मयोगः", "ज्ञानकर्मसंन्यासयोगः", "कर्मसंन्यासयोगः",
  "आत्मसंयमयोगः", "ज्ञानविज्ञानयोगः", "अक्षरब्रह्मयोगः", "राजविद्याराजगुह्ययोगः", "विभूतियोगः",
  "विश्वरूपदर्शनयोगः", "भक्तियोगः", "क्षेत्रक्षेत्रज्ञविभागयोगः", "गुणत्रयविभागयोगः", "पुरुषोत्तमयोगः",
  "दैवासुरसंपद्विभागयोगः", "श्रद्धात्रयविभागयोगः", "मोक्षसंन्यासयोगः",
];

const records = readFileSync(sourcePath, "utf8")
  .split(/\n/)
  .filter(Boolean)
  .map((line) => JSON.parse(line));
// Chapter 16 was truncated in the original export (redirect page); a
// re-fetched record supplements it when present.
const supplementPath = sourcePath.replace(".jsonl", "_ch16_refetch.jsonl");
try {
  for (const line of readFileSync(supplementPath, "utf8").split(/\n/).filter(Boolean)) {
    const record = JSON.parse(line);
    const index = records.findIndex((r) => r.title === record.title);
    if (index >= 0) records[index] = record;
    else records.push(record);
  }
} catch {
  // no supplement staged
}

mkdirSync(outDir, { recursive: true });
let written = 0;
for (const chapter of chapters) {
  const title = `भगवद्गीता/${CHAPTER_TITLES[chapter - 1]}`;
  const record = records.find((r) => r.title === title);
  if (!record || record.wikitext.length < 1000) {
    console.error(`chapter ${chapter}: source page missing or truncated — skipped`);
    continue;
  }
  const poems = [...record.wikitext.matchAll(/<poem>([\s\S]*?)<\/poem>/g)].map((m) => m[1]);
  for (const poem of poems) {
    const clean = poem.replaceAll("'''", "").replace(/<[^>]+>/g, "").trim();
    // Verses end with ॥<dev-digits>- <dev-digits>॥ (chapter- verse).
    const parts = clean.split(/॥\s*([०-९]+)\s*-\s*([०-९]+)\s*॥/);
    for (let i = 0; i + 2 < parts.length; i += 3) {
      const verseText = parts[i].trim().replace(/^ॐ$|^श्रीपरमात्मने नमः$/gm, "").trim();
      const verse = devDigits(parts[i + 2]);
      const chapterNum = devDigits(parts[i + 1]);
      if (chapterNum !== chapter || !verseText) continue;
      const devanagari = `${verseText} ॥${chapter}.${verse}॥`.replace(/\s*\n\s*/g, "\n");
      const iast = transliterate(devanagari);
      writeShloka(chapter, verse, devanagari, iast, record.source_url);
      written += 1;
    }
  }
}
console.log(`wrote ${written} draft shloka file(s) -> ${outDir}`);

function writeShloka(chapter, verse, devanagari, iast, sourceUrl) {
  const sayIt = iast
    .split(/\n/)
    .map((line) => line.replace(/[॥|.\d]/g, "").trim())
    .filter(Boolean)
    .join("\n");
  const body = `---
doc_type: shloka
shloka_slug: gita-${chapter}-${verse}
text_ref: Bhagavad Gita ${chapter}.${verse}
tradition_primary: general
licence: original
copyright_status: Verse text copied from Sanskrit Wikisource (CC BY-SA transcription of a public-domain text); IAST machine-transliterated pending review; translation pending.
source_url: ${sourceUrl}
review_status: draft
reviewed_by: ""
---

## Shloka

**Devanagari:** ${devanagari.replaceAll("\n", " / ")}
**IAST:** ${iast.replaceAll("\n", " / ")}
**Say it:** ${sayIt.replaceAll("\n", " / ")} (draft — add stress CAPS in review)
**Meaning:** (translation pending — align a cleared public-domain translation in review)
**Source:** Bhagavad Gita ${chapter}.${verse}, Sanskrit Wikisource contributors, CC BY-SA, ${sourceUrl}

## Word by word

- **(word)** — (add gloss in review; Besant/Bhagavan Das 1905 staged OCR is the word-by-word reference)

## Meaning

(Write the plain-prose meaning in review; keep scripture and commentary separate.)
`;
  writeFileSync(join(outDir, `gita-${chapter}-${verse}.md`), body);
}

function devDigits(value) {
  return Number(value.replaceAll(/[०-९]/g, (d) => "०१२३४५६७८९".indexOf(d)));
}

// Deterministic Devanagari -> IAST. Draft quality: reviewer-checked before ship.
function transliterate(text) {
  const V = { अ: "a", आ: "ā", इ: "i", ई: "ī", उ: "u", ऊ: "ū", ऋ: "ṛ", ॠ: "ṝ", ऌ: "ḷ", ए: "e", ऐ: "ai", ओ: "o", औ: "au" };
  const M = { "ा": "ā", "ि": "i", "ी": "ī", "ु": "u", "ू": "ū", "ृ": "ṛ", "ॄ": "ṝ", "े": "e", "ै": "ai", "ो": "o", "ौ": "au" };
  const C = { क: "k", ख: "kh", ग: "g", घ: "gh", ङ: "ṅ", च: "c", छ: "ch", ज: "j", झ: "jh", ञ: "ñ", ट: "ṭ", ठ: "ṭh", ड: "ḍ", ढ: "ḍh", ण: "ṇ", त: "t", थ: "th", द: "d", ध: "dh", न: "n", प: "p", फ: "ph", ब: "b", भ: "bh", म: "m", य: "y", र: "r", ल: "l", व: "v", श: "ś", ष: "ṣ", स: "s", ह: "h" };
  let out = "";
  const chars = [...text];
  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i];
    if (C[ch]) {
      out += C[ch];
      const next = chars[i + 1];
      if (next === "्") i += 1;
      else if (M[next]) {
        out += M[next];
        i += 1;
      } else out += "a";
    } else if (V[ch]) out += V[ch];
    else if (ch === "ं") out += "ṃ";
    else if (ch === "ः") out += "ḥ";
    else if (ch === "ऽ") out += "'";
    else if (ch === "॥" || ch === "।") out += ch;
    else out += ch;
  }
  return out;
}

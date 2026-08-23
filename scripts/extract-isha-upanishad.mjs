#!/usr/bin/env node
// Fetches the Isha Upanishad mula from Sanskrit Wikisource (CC BY-SA
// transcription of a public-domain text — commercial-safe with attribution),
// stages the raw wikitext with provenance, and emits draft shloka files
// (isha-1..18 plus the shanti mantra). Translations stay pending for the
// content pass, mirroring the Gita/Chalisa extraction flow.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import https from "node:https";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const stagePath = join(
  root,
  "content",
  "_staging",
  "raw",
  "sanskrit",
  "wikisource_isha_upanishad_sa.jsonl",
);
const outDir = join(root, "content", "shlokas");
const PAGE_TITLE = "ईशावास्‍योपनिषद्"; // ZWJ is part of the actual page title
const sourceUrl = `https://sa.wikisource.org/wiki/${encodeURIComponent(PAGE_TITLE)}`;

const get = (url) =>
  new Promise((res, rej) => {
    https
      .get(url, { headers: { "user-agent": "Sandhya-corpus/1.0" } }, (r) => {
        let data = "";
        r.on("data", (chunk) => (data += chunk));
        r.on("end", () => res(data));
      })
      .on("error", rej);
  });

let wikitext;
if (existsSync(stagePath)) {
  wikitext = JSON.parse(readFileSync(stagePath, "utf8")).wikitext;
  console.log("using staged copy");
} else {
  wikitext = await get(
    `https://sa.wikisource.org/w/index.php?title=${encodeURIComponent(PAGE_TITLE)}&action=raw`,
  );
  if (wikitext.length < 1000) {
    console.error("fetch looks wrong (too short) — aborting");
    process.exit(1);
  }
  writeFileSync(
    stagePath,
    `${JSON.stringify({ lang: "sa", title: PAGE_TITLE, source_url: sourceUrl, export_method: "w_index_action_raw", fetched_at: new Date().toISOString(), wikitext })}\n`,
  );
  console.log(`staged -> ${stagePath}`);
}

// Verses end with ॥<devanagari digits>॥. The opening shanti mantra
// (ॐ पूर्णमदः …) precedes verse 1 and carries no number.
const clean = wikitext
  .replace(/<[^>]+>/g, "\n")
  .replace(/\{\{[^}]*\}\}|\{[^}]*\}|\[\[[^\]]*\]\]/g, "\n")
  .replace(/^[|!#*=:].*$/gm, "")
  // The page mixes danda styles (॥१३।।) and repeats the final verses; normalise
  // the double-danda so every marker splits.
  .replaceAll("।।", "॥");
const parts = clean.split(/॥\s*([०-९]+)\s*॥/);
const units = [];
for (let i = 0; i + 1 < parts.length; i += 2) {
  const number = Number(parts[i + 1].replaceAll(/[०-९]/g, (d) => "०१२३४५६७८९".indexOf(d)));
  let text = parts[i].trim();
  // The block before verse 1 contains headers + the shanti mantra; keep from ॐ.
  if (units.length === 0) {
    const shantiStart = text.indexOf("ॐ पूर्णमदः");
    const verseStart = text.indexOf("ॐ ईशावास्यमिदँ");
    if (shantiStart >= 0 && verseStart > shantiStart) {
      units.push({ number: 0, text: text.slice(shantiStart, verseStart).replace(/॥$/, "").trim() });
    }
    text = verseStart >= 0 ? text.slice(verseStart) : text;
  }
  units.push({ number, text });
}

// The page repeats verses 17–18 at the end; keep the first occurrence only.
const seen = new Set();
const deduped = units.filter((unit) => {
  if (seen.has(unit.number)) return false;
  seen.add(unit.number);
  return true;
});
units.length = 0;
units.push(...deduped);
const verses = units.filter((unit) => unit.number > 0);
if (verses.length !== 18) {
  console.error(`expected 18 verses, parsed ${verses.length}`);
  verses.forEach((v) => console.error(`${v.number}: ${v.text.split("\n")[0]}`));
  process.exit(1);
}

let written = 0;
for (const unit of units) {
  const slug = unit.number === 0 ? "isha-shanti" : `isha-${unit.number}`;
  const ref = unit.number === 0 ? "Isha Upanishad, shanti mantra" : `Isha Upanishad ${unit.number}`;
  const devanagari = `${unit.text.replace(/\s*\n\s*/g, "\n")}${unit.number > 0 ? ` ॥${unit.number}॥` : ""}`;
  const iast = devanagariToIast(devanagari);
  const sayIt = iast
    .split(/\n/)
    .map((line) => line.replace(/[।॥|.\d]/g, "").trim())
    .filter(Boolean)
    .join(" / ");
  writeFileSync(
    join(outDir, `${slug}.md`),
    `---
doc_type: shloka
shloka_slug: ${slug}
text_ref: ${ref}
tradition_primary: general
tags: wisdom, peace
licence: original
copyright_status: Verse text copied from Sanskrit Wikisource (CC BY-SA transcription of a public-domain text); IAST machine-transliterated pending review; translation pending.
source_url: ${sourceUrl}
review_status: draft
reviewed_by: ""
---

## Shloka

**Devanagari:** ${devanagari.replaceAll("\n", " / ")}
**IAST:** ${iast.replaceAll("\n", " / ")}
**Say it:** ${sayIt} (draft — add stress CAPS in review)
**Meaning:** (translation pending — draft in content pass, review before ship)
**Source:** ${ref}, Sanskrit Wikisource contributors, CC BY-SA, ${sourceUrl}

## Word by word

- **(word)** — (add gloss in content pass)

## Meaning

(Write the plain-prose meaning in the content pass; note Advaita/Vishishtadvaita/Dvaita variation where genuine.)
`,
  );
  written += 1;
}
console.log(`wrote ${written} draft isha file(s) -> ${outDir}`);

// Same Devanagari -> IAST mapping as the Gita/Chalisa extractors, plus the
// Vedic anusvara-candrabindu ँ after vowels (ईशावास्यमिदँ) and jihvamuliya-free
// basics sufficient for draft review.
function devanagariToIast(text) {
  const V = {
    अ: "a",
    आ: "ā",
    इ: "i",
    ई: "ī",
    उ: "u",
    ऊ: "ū",
    ऋ: "ṛ",
    ए: "e",
    ऐ: "ai",
    ओ: "o",
    औ: "au",
  };
  const M = {
    "ा": "ā",
    "ि": "i",
    "ी": "ī",
    "ु": "u",
    "ू": "ū",
    "ृ": "ṛ",
    "े": "e",
    "ै": "ai",
    "ो": "o",
    "ौ": "au",
  };
  const C = {
    क: "k",
    ख: "kh",
    ग: "g",
    घ: "gh",
    ङ: "ṅ",
    च: "c",
    छ: "ch",
    ज: "j",
    झ: "jh",
    ञ: "ñ",
    ट: "ṭ",
    ठ: "ṭh",
    ड: "ḍ",
    ढ: "ḍh",
    ण: "ṇ",
    त: "t",
    थ: "th",
    द: "d",
    ध: "dh",
    न: "n",
    प: "p",
    फ: "ph",
    ब: "b",
    भ: "bh",
    म: "m",
    य: "y",
    र: "r",
    ल: "l",
    व: "v",
    श: "ś",
    ष: "ṣ",
    स: "s",
    ह: "h",
    ळ: "ḷ",
  };
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
    else if (ch === "ँ") out += "m̐";
    else if (ch === "ः") out += "ḥ";
    else if (ch === "ऽ") out += "'";
    else out += ch;
  }
  return out;
}

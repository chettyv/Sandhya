#!/usr/bin/env node
// Extracts staged sanskritdocuments.org ITX stotras (ITRANS romanization)
// into draft shloka skeletons: ITRANS -> Devanagari (Sanskrit mode: final
// consonants take virama), then Devanagari -> IAST. The ITX files bundle
// their own English translations between ## separators — those are the
// source's text and are DROPPED entirely; our translations are written
// fresh in the content pass.
// Source terms: personal-study/non-commercial without permission — usable in
// the current free-launch mode WITH attribution; commercial use is ledger
// row 1 in docs/PERMISSIONS-NEEDED.md.
// Usage: node scripts/extract-itx-stotras.mjs [slug ...]  (default: all)
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const outDir = join(root, "content", "shlokas");
const itxDir = join(root, "content", "_staging", "raw", "sanskrit", "sanskritdocuments");

const TEXTS = [
  {
    slug: "bhaja-govindam",
    name: "Bhaja Govindam",
    file: "bhaja_govindam.itx",
    url: "https://sanskritdocuments.org/doc_vishhnu/bhajagovindam.itx",
    // Parse from the stotra section; everything before is introduction prose.
    // This recension carries 33 stanzas (the common 31 plus two the file's
    // own introduction notes are "not found in all editions") — the
    // content-pass writer should state that in the prose of 32–33.
    anchor: "\\section{bhaja govindaM}",
    endAnchor: "\\section{Appendix",
    expect: 33,
    tradition: "advaita",
    ref: (n) => `Bhaja Govindam ${n}`,
    sourceLine: (n) =>
      `Bhaja Govindam ${n} (attributed to Adi Shankaracharya and his disciples), sanskritdocuments.org ITRANS file, personal-study terms`,
  },
  {
    slug: "aditya-hridayam",
    name: "Aditya Hridayam",
    file: "aditya_hridayam.itx",
    // The file carries the text twice: an annotated "sArtha" copy first, then
    // the clean recitation text after the nyasa preliminaries. Anchor on the
    // clean copy's own heading.
    url: "https://sanskritdocuments.org/doc_z_misc_navagraha/adityahriday.itx",
    anchor: "|| atha AdityahR^idayam ||",
    expect: 31,
    tradition: "general",
    ref: (n) => `Aditya Hridayam ${n} (Valmiki Ramayana, Yuddha Kanda)`,
    sourceLine: (n) =>
      `Aditya Hridayam ${n}, Valmiki Ramayana (Yuddha Kanda), sanskritdocuments.org ITRANS file, personal-study terms`,
  },
];

const requested = process.argv.slice(2);
const texts = requested.length ? TEXTS.filter((t) => requested.includes(t.slug)) : TEXTS;

for (const text of texts) {
  const raw = readFileSync(join(itxDir, text.file), "utf8");
  const anchorAt = raw.indexOf(text.anchor);
  if (anchorAt < 0) {
    console.error(`${text.slug}: anchor not found`);
    process.exit(1);
  }
  const endMark = text.endAnchor ? raw.indexOf(text.endAnchor, anchorAt) : -1;
  const endAt = endMark >= 0 ? endMark : raw.indexOf("\\end{document}");
  let body = raw.slice(anchorAt + text.anchor.length, endAt === -1 ? undefined : endAt);

  // Drop the source's bundled English: segments between ## separators that
  // carry no ITRANS verse marker are commentary/translation, not text.
  const segments = body
    .replace(/\|\|\s*([0-9]+)\s*\|\|\s*##/g, "|| $1||\n##")
    .split(/^\s*##\s*$/m)
    .filter((segment) => /\|\|\s*[0-9]+\s*\|\|/.test(segment));

  const units = [];
  let previous = 0;
  for (const segment of segments) {
    const parts = segment.split(/\|\|\s*([0-9]+)\s*\|\|/);
    for (let i = 0; i + 1 < parts.length; i += 2) {
      const verseText = parts[i]
        .split(/\r?\n/)
        .map((line) => line.replace(/%.*$/, "").trim())
        .filter(
          (line) =>
            line &&
            !line.startsWith("\\") &&
            !line.startsWith("{") &&
            !/^\|\|.*\|\|$/.test(line),
        )
        .join("\n")
        .trim();
      const number = Number(parts[i + 1]);
      if (!verseText) continue;
      if (number !== previous + 1) {
        console.error(`${text.slug}: numbering gap — got ${number} after ${previous}`);
        process.exit(1);
      }
      previous = number;
      units.push({ number, text: verseText });
    }
  }
  if (units.length !== text.expect) {
    console.error(`${text.slug}: expected ${text.expect} verses, parsed ${units.length}`);
    units.forEach((u) => console.error(`  ${u.number}: ${u.text.split("\n")[0].slice(0, 50)}`));
    process.exit(1);
  }

  let written = 0;
  let protectedCount = 0;
  for (const unit of units) {
    const slug = `${text.slug}-${unit.number}`;
    const target = join(outDir, `${slug}.md`);
    if (
      existsSync(target) &&
      !/\*\*Meaning:\*\* \(translation pending/.test(readFileSync(target, "utf8"))
    ) {
      protectedCount += 1;
      continue;
    }
    const devanagari =
      itransToDevanagari(unit.text).replace(/\s*\n\s*/g, "\n") + ` ॥${unit.number}॥`;
    const iast = devanagariToIast(devanagari);
    const sayIt = iast
      .split(/\n/)
      .map((line) => line.replace(/[।॥|.\d]/g, "").trim())
      .filter(Boolean)
      .join(" / ");
    writeFileSync(
      target,
      `---
doc_type: shloka
shloka_slug: ${slug}
text_ref: ${text.ref(unit.number)}
tradition_primary: ${text.tradition}
tags: devotion
licence: original
copyright_status: Sanskrit text converted from the sanskritdocuments.org ITRANS file (personal-study terms — free-launch use with attribution; commercial use requires permission, see docs/PERMISSIONS-NEEDED.md row 1); conversion pending review; translation pending.
source_url: ${text.url}
review_status: draft
reviewed_by: ""
---

## Shloka

**Devanagari:** ${devanagari.replaceAll("\n", " / ")}
**IAST:** ${iast.replaceAll("\n", " / ")}
**Say it:** ${sayIt} (draft — add stress CAPS in review)
**Meaning:** (translation pending — draft in content pass, review before ship)
**Source:** ${text.sourceLine(unit.number)}, ${text.url}

## Word by word

- **(word)** — (add gloss in content pass)

## Meaning

(Write the plain-prose meaning in the content pass; note tradition variation where genuine. Do NOT copy the source file's bundled English translation — it is not ours.)
`,
    );
    written += 1;
  }
  console.log(
    `${text.slug}: wrote ${written} draft file(s)` +
      (protectedCount ? ` (${protectedCount} content-passed file(s) untouched)` : ""),
  );
}

// ITRANS -> Devanagari, Sanskrit mode: word-final consonants take virama
// (unlike the Hindi/Awadhi mode in extract-chalisa.mjs where the final schwa
// stays written). Longest-match tokenizer.
function itransToDevanagari(text) {
  const C = {
    ".Dh": "ढ़", ".D": "ड़",
    kh: "ख", gh: "घ", chh: "छ", Ch: "छ", jh: "झ", Th: "ठ", Dh: "ढ", th: "थ", dh: "ध",
    ph: "फ", bh: "भ", sh: "श", Sh: "ष", GY: "ज्ञ", "j~n": "ज्ञ", x: "क्ष", "~N": "ङ",
    "N^": "ङ", "~n": "ञ", JN: "ञ", k: "क", g: "ग", ch: "च", c: "च", j: "ज", T: "ट",
    D: "ड", N: "ण", t: "त", d: "द", n: "न", p: "प", b: "ब", m: "म", y: "य", r: "र",
    l: "ल", v: "व", w: "व", s: "स", h: "ह", L: "ळ",
  };
  const V = {
    A: ["आ", "ा"], ai: ["ऐ", "ै"], au: ["औ", "ौ"], a: ["अ", ""], I: ["ई", "ी"],
    i: ["इ", "ि"], U: ["ऊ", "ू"], u: ["उ", "ु"], RRI: ["ॠ", "ॄ"], "R^I": ["ॠ", "ॄ"],
    RRi: ["ऋ", "ृ"], "R^i": ["ऋ", "ृ"], "L^i": ["ऌ", "ॢ"], e: ["ए", "े"], o: ["ओ", "ो"],
  };
  const S = { OM: "ॐ", ".n": "ं", M: "ं", ".m": "ं", ".N": "ँ", H: "ः", "|": "।", _: "", "'": "ऽ" };
  const tokens = [...Object.keys(C), ...Object.keys(V), ...Object.keys(S)].sort(
    (a, b) => b.length - a.length,
  );

  let out = "";
  let i = 0;
  let pendingConsonant = false;
  while (i < text.length) {
    const match = tokens.find((token) => text.startsWith(token, i));
    if (!match) {
      if (pendingConsonant) out += "्"; // Sanskrit: bare final consonant
      pendingConsonant = false;
      out += text[i];
      i += 1;
      continue;
    }
    if (C[match]) {
      if (pendingConsonant) out += "्";
      out += C[match];
      pendingConsonant = true;
    } else if (V[match]) {
      out += pendingConsonant ? V[match][1] : V[match][0];
      pendingConsonant = false;
    } else {
      if (pendingConsonant) out += "्";
      pendingConsonant = false;
      out += S[match];
    }
    i += match.length;
  }
  if (pendingConsonant) out += "्";
  return out;
}

// Same Devanagari -> IAST mapping as scripts/extract-chalisa.mjs, plus the
// long vocalic r/l pairs.
function devanagariToIast(text) {
  const V = { अ: "a", आ: "ā", इ: "i", ई: "ī", उ: "u", ऊ: "ū", ऋ: "ṛ", ॠ: "ṝ", ऌ: "ḷ", ए: "e", ऐ: "ai", ओ: "o", औ: "au" };
  const M = { "ा": "ā", "ि": "i", "ी": "ī", "ु": "u", "ू": "ū", "ृ": "ṛ", "ॄ": "ṝ", "ॢ": "ḷ", "े": "e", "ै": "ai", "ो": "o", "ौ": "au" };
  const C = { क: "k", ख: "kh", ग: "g", घ: "gh", ङ: "ṅ", च: "c", छ: "ch", ज: "j", झ: "jh", ञ: "ñ", ट: "ṭ", ठ: "ṭh", ड: "ḍ", ढ: "ḍh", ण: "ṇ", त: "t", थ: "th", द: "d", ध: "dh", न: "n", प: "p", फ: "ph", ब: "b", भ: "bh", म: "m", य: "y", र: "r", ल: "l", व: "v", श: "ś", ष: "ṣ", स: "s", ह: "h", ळ: "ḻ", "ड़": "ṛ", "ढ़": "ṛh" };
  let out = "";
  const chars = [...text.normalize("NFC")];
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
    else if (ch === "ॐ") out += "oṃ";
    else out += ch;
  }
  return out;
}

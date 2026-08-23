#!/usr/bin/env node
// Extracts the Hanuman Chalisa from the staged sanskritdocuments ITX file
// (ITRANS romanization) into draft shloka files: ITRANS -> Devanagari
// deterministically, then Devanagari -> IAST with the same converter used for
// the Gita extraction. Translations stay pending so the files remain draft
// skeletons until a content pass fills them.
// Source terms: personal-study/non-commercial without permission — usable in
// the current free-launch mode WITH attribution; see docs/SOURCES-AND-ATTRIBUTION.md.
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const sourcePath = join(
  root,
  "content",
  "_staging",
  "raw",
  "hindi",
  "sanskritdocuments_hanuman_chalisa_hi.itx",
);
const outDir = join(root, "content", "shlokas");
const sourceUrl = "https://sanskritdocuments.org/doc_hanumaana/hanuman40.itx";

const raw = readFileSync(sourcePath, "utf8");
const start = raw.indexOf("\\endtitles") + "\\endtitles".length;
const end = raw.indexOf("\\end{document}");
const body = raw.slice(start, end === -1 ? undefined : end);

// The ITX marks its own structure with dohA / chaupAI section markers. Verse
// lines end in " ." (half verse) or " .." (unit end). Skip LaTeX and comments.
const units = [];
let mode = "doha";
let sawChaupai = false;
let current = [];
for (const rawLine of body.split(/\r?\n/)) {
  const line = rawLine.replace(/##|%.*$/g, "").trim();
  if (!line || line.startsWith("\\") || line.startsWith("{")) continue;
  if (/^dohA$/i.test(line)) {
    mode = "doha";
    continue;
  }
  if (/^chaupAI$/i.test(line)) {
    mode = "chaupai";
    sawChaupai = true;
    continue;
  }
  current.push(line.replace(/\s*\.\.\s*$/, "").replace(/\s*\.\s*$/, " ।"));
  if (/\.\.\s*$/.test(rawLine.trim())) {
    units.push({
      mode: mode === "doha" ? (sawChaupai ? "closing" : "opening") : "chaupai",
      text: current.join("\n"),
    });
    current = [];
  }
}

const openings = units.filter((unit) => unit.mode === "opening");
const rawChaupais = units.filter((unit) => unit.mode === "chaupai");
const closings = units.filter((unit) => unit.mode === "closing");

// A chaupai is a couplet. The source terminates each half-line of chaupai 36
// with "..", producing two single-line units — merge adjacent single-line
// units back into one couplet.
const chaupais = [];
for (let i = 0; i < rawChaupais.length; i += 1) {
  const unit = rawChaupais[i];
  const next = rawChaupais[i + 1];
  if (!unit.text.includes("\n") && next && !next.text.includes("\n")) {
    chaupais.push({ mode: "chaupai", text: `${unit.text} ।\n${next.text}` });
    i += 1;
  } else {
    chaupais.push(unit);
  }
}
if (closings.length > 1) {
  closings
    .slice(1)
    .forEach((unit) => console.log(`skipping extra closing unit: ${unit.text.split("\n")[0]}`));
  closings.length = 1;
}
if (chaupais.length !== 40 || openings.length !== 2 || closings.length !== 1) {
  console.error(
    `unexpected structure: ${openings.length} opening dohas, ${chaupais.length} chaupais, ${closings.length} closing — expected 2/40/1`,
  );
  chaupais.forEach((unit, index) =>
    console.error(`chaupai ${index + 1}: ${unit.text.split("\n")[0]}`),
  );
  process.exit(1);
}

let written = 0;
[...openings, ...chaupais, ...closings].forEach((entry, index) => {
  const devanagari = itransToDevanagari(entry.text);
  let slug, ref;
  if (entry.mode === "opening") {
    slug = `chalisa-doha-${index + 1}`;
    ref = `Hanuman Chalisa, opening doha ${index + 1}`;
  } else if (entry.mode === "chaupai") {
    slug = `chalisa-${index - 1}`;
    ref = `Hanuman Chalisa, chaupai ${index - 1}`;
  } else {
    slug = `chalisa-doha-3`;
    ref = `Hanuman Chalisa, closing doha`;
  }
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
tags: devotion, courage
licence: original
copyright_status: Awadhi text converted from the sanskritdocuments.org ITRANS file (personal-study terms — free-launch use with attribution; commercial use requires permission, see docs/SOURCES-AND-ATTRIBUTION.md); conversion machine-generated pending review; translation pending.
source_url: ${sourceUrl}
review_status: draft
reviewed_by: ""
---

## Shloka

**Devanagari:** ${devanagari.replaceAll("\n", " / ")}
**IAST:** ${iast.replaceAll("\n", " / ")}
**Say it:** ${sayIt} (draft — add stress CAPS in review)
**Meaning:** (translation pending — draft in content pass, review before ship)
**Source:** ${ref}, Tulsidas (Awadhi, public domain original), via sanskritdocuments.org, ${sourceUrl}

## Word by word

- **(word)** — (add gloss in content pass)

## Meaning

(Write the plain-prose meaning in the content pass; keep text and devotional tradition clearly separate.)
`,
  );
  written += 1;
});
console.log(`wrote ${written} draft chalisa file(s) -> ${outDir}`);

// ITRANS -> Devanagari. Longest-match tokenizer; consonant followed by
// consonant takes a virama, by vowel takes the matra, else inherent 'a'
// (final schwa stays written, as Devanagari orthography does for Hindi).
function itransToDevanagari(text) {
  const C = {
    ".Dh": "ढ़",
    ".D": "ड़",
    kh: "ख",
    gh: "घ",
    chh: "छ",
    Ch: "छ",
    jh: "झ",
    Th: "ठ",
    Dh: "ढ",
    th: "थ",
    dh: "ध",
    ph: "फ",
    bh: "भ",
    sh: "श",
    Sh: "ष",
    GY: "ज्ञ",
    "j~n": "ज्ञ",
    "~N": "ङ",
    "N^": "ङ",
    "~n": "ञ",
    JN: "ञ",
    k: "क",
    g: "ग",
    ch: "च",
    c: "च",
    j: "ज",
    T: "ट",
    D: "ड",
    N: "ण",
    t: "त",
    d: "द",
    n: "न",
    p: "प",
    b: "ब",
    m: "म",
    y: "य",
    r: "र",
    l: "ल",
    v: "व",
    w: "व",
    s: "स",
    h: "ह",
    L: "ळ",
  };
  const V = {
    A: ["आ", "ा"],
    ai: ["ऐ", "ै"],
    au: ["औ", "ौ"],
    a: ["अ", ""],
    I: ["ई", "ी"],
    i: ["इ", "ि"],
    U: ["ऊ", "ू"],
    u: ["उ", "ु"],
    RRi: ["ऋ", "ृ"],
    "R^i": ["ऋ", "ृ"],
    e: ["ए", "े"],
    o: ["ओ", "ो"],
  };
  const S = { ".n": "ं", M: "ं", ".m": "ं", ".N": "ँ", H: "ः", "|": "।", _: "" };
  const tokens = [...Object.keys(C), ...Object.keys(V), ...Object.keys(S)].sort(
    (a, b) => b.length - a.length,
  );

  let out = "";
  let i = 0;
  let pendingConsonant = false;
  while (i < text.length) {
    const match = tokens.find((token) => text.startsWith(token, i));
    if (!match) {
      if (pendingConsonant) out += ""; // inherent a before punctuation/space
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
      pendingConsonant = false;
      out += S[match];
    }
    i += match.length;
  }
  return out;
}

// Same Devanagari -> IAST mapping as scripts/extract-gita-shlokas.mjs.
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
    ड़: "ṛ",
    ढ़: "ṛh",
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

#!/usr/bin/env node
// Generic Sanskrit Wikisource verse extractor (CC BY-SA transcriptions of
// public-domain texts — commercial-safe with attribution). Fetches each
// configured page once (staged with provenance under content/_staging),
// splits on ॥N॥ / ॥S.N॥ markers with khanda awareness (a marker number
// dropping back to 1 starts the next section), captures an unnumbered opening
// shanti mantra where present, and emits draft shloka files. Translations
// stay pending for the content pass — same flow as Gita/Chalisa/Isha.
// Usage: node scripts/extract-wikisource-verses.mjs [slug ...]  (default: all)
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import https from "node:https";

const root = resolve(process.cwd());
const outDir = join(root, "content", "shlokas");

const TEXTS = [
  { slug: "kena", name: "Kena Upanishad", pages: ["केनोपनिषद्"], sectioned: true, expect: 35 },
  { slug: "mundaka", name: "Mundaka Upanishad", pages: ["मुण्डकोपनिषद्"], sectioned: true, expect: 64 },
  { slug: "mandukya", name: "Mandukya Upanishad", pages: ["माण्डुक्योपनिषद्"], sectioned: false, expect: 12 },
  {
    slug: "katha",
    name: "Katha Upanishad",
    // The mula lives in six valli subpages (two adhyayas of three vallis).
    // Verse markers restart per valli; each page carries its section label.
    pages: [
      "कठोपनिषत्/प्रथमोध्यायः/प्रथमवल्ली",
      "कठोपनिषत्/प्रथमोध्यायः/द्वितीयवल्ली",
      "कठोपनिषत्/प्रथमोध्यायः/तृतीयवल्ली",
      "कठोपनिषत्/द्वितीयोध्यायः/प्रथमवल्ली",
      "कठोपनिषत्/द्वितीयोध्यायः/द्वितीयवल्ली",
      "कठोपनिषत्/द्वितीयोध्यायः/तृतीयवल्ली",
    ],
    pageSections: ["1.1", "1.2", "1.3", "2.1", "2.2", "2.3"],
    sectioned: false,
    // Verse totals are asserted per page against the page's own final marker
    // (self-consistent), not against a hardcoded edition count.
    expect: null,
  },
  {
    slug: "shvetashvatara",
    name: "Shvetashvatara Upanishad",
    // Six adhyaya subpages; plain per-page verse markers; the shanti
    // (saha navavatu) opens adhyaya 1.
    pages: [
      "श्वेताश्वतरोपनिषत्/प्रथमः अध्यायः",
      "श्वेताश्वतरोपनिषत्/द्वितीयः अध्यायः",
      "श्वेताश्वतरोपनिषत्/तृतीयः अध्यायः",
      "श्वेताश्वतरोपनिषत्/चतुर्थः अध्यायः",
      "श्वेताश्वतरोपनिषत्/पञ्चमः अध्यायः",
      "श्वेताश्वतरोपनिषत्/षष्ठः अध्यायः",
    ],
    pageSections: ["1", "2", "3", "4", "5", "6"],
    sectioned: false,
    expect: null,
  },
  {
    slug: "prashna",
    name: "Prashna Upanishad",
    // BLOCKED at the source: the Wikisource transcription of the third
    // prashna omits the ॥४॥ marker (sections 4–5 run together), so the
    // drift guard refuses the whole text. Needs the source fixed upstream
    // or a hand-verified boundary from a printed edition before extraction.
    // Six prashna (question) subpages; prose sections with plain markers.
    pages: [
      "प्रश्नोपनिषत्/प्रथमः प्रश्नः",
      "प्रश्नोपनिषत्/द्वितीयः प्रश्नः",
      "प्रश्नोपनिषत्/तृतीयः प्रश्नः",
      "प्रश्नोपनिषत्/चतुर्थः प्रश्नः",
      "प्रश्नोपनिषत्/पञ्चमः प्रश्नः",
      "प्रश्नोपनिषत्/षष्ठः प्रश्नः",
    ],
    pageSections: ["1", "2", "3", "4", "5", "6"],
    sectioned: false,
    expect: null,
  },
];

const requested = process.argv.slice(2);
const texts = requested.length ? TEXTS.filter((t) => requested.includes(t.slug)) : TEXTS;

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

for (const text of texts) {
  const stagePath = join(
    root, "content", "_staging", "raw", "sanskrit", `wikisource_${text.slug}_upanishad_sa.jsonl`,
  );
  let pages;
  if (existsSync(stagePath)) {
    pages = readFileSync(stagePath, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
    console.log(`${text.slug}: using staged copy`);
  } else {
    pages = [];
    for (const title of text.pages) {
      const wikitext = await get(
        `https://sa.wikisource.org/w/index.php?title=${encodeURIComponent(title)}&action=raw`,
      );
      if (wikitext.length < 500) {
        console.error(`${text.slug}: page ${title} looks wrong (${wikitext.length} chars) — abort`);
        process.exit(1);
      }
      pages.push({
        lang: "sa",
        title,
        source_url: `https://sa.wikisource.org/wiki/${encodeURIComponent(title)}`,
        export_method: "w_index_action_raw",
        fetched_at: new Date().toISOString(),
        wikitext,
      });
    }
    writeFileSync(stagePath, pages.map((p) => JSON.stringify(p)).join("\n") + "\n");
    console.log(`${text.slug}: staged -> ${stagePath}`);
  }

  const units = [];
  if (text.pageSections) {
    parseSubpagedText(text, pages, units);
  } else {
  for (const page of pages) {
    const clean = page.wikitext
      .replace(/<[^>]+>/g, "\n")
      .replace(/\{\{[^}]*\}\}|\{[^}]*\}|\[\[[^\]]*\]\]/g, "\n")
      .replace(/^[|!#*=:].*$/gm, "")
      .replace(/\[https?:\/\/\S+\s+([^\]]*)\]/g, "$1")
      .replaceAll("।।", "॥");
    const parts = clean.split(/॥\s*([०-९0-9]+(?:\.[०-९0-9]+){0,2})\s*॥/);
    let section = 1;
    let previousNumber = 0;
    for (let i = 0; i + 1 < parts.length; i += 2) {
      let verseText = parts[i].trim();
      const marker = devDigits(parts[i + 1]);
      // First block: strip page headers, keep from the shanti mantra's ॐ.
      if (units.length === 0) {
        const omStart = verseText.indexOf("ॐ");
        if (omStart > 0) verseText = verseText.slice(omStart);
        // An unnumbered shanti mantra ends with a standalone ॥ before verse 1.
        const shantiSplit = verseText.split(/॥\s*\n/);
        if (shantiSplit.length > 1 && shantiSplit[0].includes("ॐ")) {
          units.push({ label: "shanti", text: shantiSplit[0].trim(), source: page.source_url });
          verseText = shantiSplit.slice(1).join("॥\n").trim();
        }
      }
      if (!verseText.replace(/[॥ॐ\s।]/g, "")) continue;
      if (marker.verse !== undefined) {
        // Dotted marker carries its own section.
        section = marker.section ?? section;
        units.push({ label: `${text.sectioned ? `${String(section).replaceAll(".", "-")}-` : ""}${marker.verse}`, refNum: text.sectioned ? `${section}.${marker.verse}` : `${marker.verse}`, dotted: marker.section !== undefined, text: verseText, source: page.source_url });
        if (marker.section === undefined) {
          // Sequential markers: a drop back to 1 opens the next khanda.
          if (marker.verse <= previousNumber) section += 1;
          previousNumber = marker.verse;
          if (marker.verse <= 1) previousNumber = marker.verse;
        }
      }
    }
  }

  }

  // Re-label sequential-sectioned texts now that section boundaries are known:
  // rebuild labels in one pass (a marker <= previous starts a new section).
  if (text.sectioned) {
    let section = 1;
    let previous = 0;
    for (const unit of units) {
      if (unit.label === "shanti" || unit.dotted) continue;
      const verse = Number(String(unit.refNum).split(".").pop());
      if (verse <= previous && verse === 1) section += 1;
      previous = verse;
      unit.label = `${section}-${verse}`;
      unit.refNum = `${section}.${verse}`;
    }
  }

  const verseCount = units.filter((u) => u.label !== "shanti").length;
  if (text.expect !== null && verseCount !== text.expect) {
    console.error(`${text.slug}: expected ${text.expect} verses, parsed ${verseCount}`);
    units.forEach((u) => console.error(`  ${u.label}: ${u.text.split("\n")[0].slice(0, 60)}`));
    process.exit(1);
  }

  // Boundary cleanup: drop pure header lines (॥ … ॥) everywhere, and inside
  // the first numbered verse cut any residue before the verse's own opening ॐ
  // (Upanishad first verses conventionally begin with ॐ; leaked shanti or
  // section titles precede it).
  for (const unit of units) {
    unit.text = unit.text
      .split("\n")
      .filter((line) => !/^\s*॥[^॥]*॥\s*$/.test(line))
      .join("\n")
      .trim();
  }
  const firstVerse = units.find((unit) => unit.label !== "shanti");
  if (firstVerse) {
    const lines = firstVerse.text.split("\n");
    const shantiEnd = lines.findIndex((line) => /^ॐ\s*शान्तिः/.test(line.trim()));
    if (shantiEnd >= 0) {
      // Everything through the closing śāntiḥ line belongs to the shanti unit.
      const shantiUnit = units.find((unit) => unit.label === "shanti");
      const shantiText = lines.slice(0, shantiEnd + 1).join("\n").trim();
      if (shantiUnit) shantiUnit.text = `${shantiUnit.text}\n${shantiText}`.trim();
      else units.unshift({ label: "shanti", text: shantiText, source: firstVerse.source });
      firstVerse.text = lines.slice(shantiEnd + 1).join("\n").trim();
    } else {
      const lastOm = lines.map((line) => line.trimStart().startsWith("ॐ")).lastIndexOf(true);
      if (lastOm > 0) firstVerse.text = lines.slice(lastOm).join("\n");
    }
  }

  let written = 0;
  let protectedCount = 0;
  for (const unit of units) {
    const slug = `${text.slug}-${unit.label}`;
    // Never clobber a file whose content pass is done: skeletons carry a
    // pending **Meaning:** placeholder; anything else is human-reviewed work.
    const target = join(outDir, `${slug}.md`);
    if (existsSync(target) && !/\*\*Meaning:\*\* \(translation pending/.test(readFileSync(target, "utf8"))) {
      protectedCount += 1;
      continue;
    }
    const ref =
      unit.label === "shanti" ? `${text.name}, shanti mantra` : `${text.name} ${unit.refNum}`;
    const devanagari = unit.text.replace(/\s*\n\s*/g, "\n") + (unit.label === "shanti" ? "" : ` ॥${unit.refNum}॥`);
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
text_ref: ${ref}
tradition_primary: general
tags: wisdom, peace
licence: original
copyright_status: Verse text copied from Sanskrit Wikisource (CC BY-SA transcription of a public-domain text); IAST machine-transliterated pending review; translation pending.
source_url: ${unit.source}
review_status: draft
reviewed_by: ""
---

## Shloka

**Devanagari:** ${devanagari.replaceAll("\n", " / ")}
**IAST:** ${iast.replaceAll("\n", " / ")}
**Say it:** ${sayIt} (draft — add stress CAPS in review)
**Meaning:** (translation pending — draft in content pass, review before ship)
**Source:** ${ref}, Sanskrit Wikisource contributors, CC BY-SA, ${unit.source}

## Word by word

- **(word)** — (add gloss in content pass)

## Meaning

(Write the plain-prose meaning in the content pass; note Advaita/Vishishtadvaita/Dvaita variation where genuine.)
`,
    );
    written += 1;
  }
  console.log(
    `${text.slug}: wrote ${written} draft file(s)` +
      (protectedCount ? ` (${protectedCount} existing content-passed file(s) left untouched)` : ""),
  );
}

// Subpaged texts (e.g. Katha): each fetched page is one valli/section whose
// markers are plain verse numbers. The first page opens with the shanti
// mantra; later pages may repeat it (stripped, emitted once). An unnumbered
// leading verse (pages where verse 1 has no ॥१॥ marker) is recovered from the
// leading block and the page total is asserted against the page's own final
// marker, so a parse slip cannot pass silently.
function parseSubpagedText(text, pages, units) {
  pages.forEach((page, pageIndex) => {
    const sectionLabel = text.pageSections[pageIndex];
    const clean = page.wikitext
      .replace(/<[^>]+>/g, "\n")
      .replace(/\{\{[^}]*\}\}|\{[^}]*\}|\[\[[^\]]*\]\]/g, "\n")
      .replace(/^[|!#*=:].*$/gm, "")
      .replace(/\[https?:\/\/\S+\s+([^\]]*)\]/g, "$1")
      .replaceAll("।।", "॥");
    // Closing danda after the number is optional: these pages mix "॥ ३ ॥"
    // with bare "॥ ३" at line end.
    const parts = clean.split(/॥\s*([०-९0-9]+)\s*(?:॥|(?=\s)|$)/);
    let emitted = 0;
    let lastMarker = 0;

    for (let i = 0; i + 1 < parts.length; i += 2) {
      let verseText = parts[i];
      const marker = devDigits(parts[i + 1]).verse;
      lastMarker = marker;

      if (i === 0) {
        // Leading block: headers, then (first page) the shanti mantra through
        // its closing "ॐ शान्तिः…" line, then any unnumbered leading verses.
        const blocks = verseText
          .split(/॥\s*(?:\n|$)/)
          .map((block) =>
            block
              .split("\n")
              // Drop section-title lines: fully danda-wrapped, or opening
              // with ॥ (the closing danda was consumed by the block split).
              .filter(
                (line) =>
                  !/^\s*॥[^॥]*॥\s*$/.test(line) &&
                  !/^\s*॥/.test(line) &&
                  line.trim() !== "ॐ",
              )
              .join("\n")
              .trim(),
          )
          .filter((block) => block.replace(/[॥ॐ\s।]/g, "").length > 0);
        const shantiEnd = blocks.findIndex((block) => /शान्तिः/.test(block));
        let rest = blocks;
        if (shantiEnd >= 0) {
          const shantiText = blocks
            .slice(0, shantiEnd + 1)
            .map((block) => `${block} ॥`)
            .join("\n");
          if (!units.some((unit) => unit.label === "shanti")) {
            units.push({ label: "shanti", text: shantiText, source: page.source_url });
          }
          rest = blocks.slice(shantiEnd + 1);
        }
        // All blocks but the last are unnumbered leading verses; the last is
        // the text belonging to this first numbered marker.
        for (let b = 0; b < rest.length - 1; b += 1) {
          emitted += 1;
          units.push({
            label: `${sectionLabel.replace(".", "-")}-${emitted}`,
            refNum: `${sectionLabel}.${emitted}`,
            text: rest[b],
            source: page.source_url,
          });
        }
        verseText = rest.length > 0 ? rest[rest.length - 1] : "";
      }

      verseText = verseText.trim();
      if (!verseText.replace(/[॥ॐ\s।]/g, "")) continue;
      emitted += 1;
      if (emitted !== marker) {
        console.error(
          `${text.slug} ${sectionLabel}: verse count drifted — emitting #${emitted} at marker ॥${marker}॥`,
        );
        process.exit(1);
      }
      units.push({
        label: `${sectionLabel.replace(".", "-")}-${marker}`,
        refNum: `${sectionLabel}.${marker}`,
        text: verseText,
        source: page.source_url,
      });
    }

    if (emitted !== lastMarker || emitted === 0) {
      console.error(
        `${text.slug} ${sectionLabel}: parsed ${emitted} verses but the page's final marker is ॥${lastMarker}॥`,
      );
      process.exit(1);
    }
    console.log(`${text.slug} ${sectionLabel}: ${emitted} verses`);
  });
}

function devDigits(value) {
  const normalized = value.replaceAll(/[०-९]/g, (d) => "०१२३४५६७८९".indexOf(d));
  const dotted = normalized.split(".");
  if (dotted.length > 1) return { section: dotted.slice(0, -1).join("."), verse: Number(dotted.at(-1)) };
  return { verse: Number(normalized) };
}

function devanagariToIast(text) {
  const V = { अ: "a", आ: "ā", इ: "i", ई: "ī", उ: "u", ऊ: "ū", ऋ: "ṛ", ए: "e", ऐ: "ai", ओ: "o", औ: "au" };
  const M = { "ा": "ā", "ि": "i", "ी": "ī", "ु": "u", "ू": "ū", "ृ": "ṛ", "े": "e", "ै": "ai", "ो": "o", "ौ": "au" };
  const C = { क: "k", ख: "kh", ग: "g", घ: "gh", ङ: "ṅ", च: "c", छ: "ch", ज: "j", झ: "jh", ञ: "ñ", ट: "ṭ", ठ: "ṭh", ड: "ḍ", ढ: "ḍh", ण: "ṇ", त: "t", थ: "th", द: "d", ध: "dh", न: "n", प: "p", फ: "ph", ब: "b", भ: "bh", म: "m", य: "y", र: "r", ल: "l", व: "v", श: "ś", ष: "ṣ", स: "s", ह: "h", ळ: "ḷ" };
  let out = "";
  const chars = [...text.normalize("NFC")];
  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i];
    if (C[ch]) {
      out += C[ch];
      let next = chars[i + 1];
      if (next === "़") {
        // combining nukta: approximate with the base consonant (draft quality)
        i += 1;
        next = chars[i + 1];
      }
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
    else if (ch === "़") continue;
    else out += ch;
  }
  return out;
}

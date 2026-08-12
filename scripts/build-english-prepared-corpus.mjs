import { once } from "node:events";
import { createReadStream, createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline";

const repoRoot = path.resolve(import.meta.dirname, "..");
const existingPath = path.join(repoRoot, "content/_staging/prepared/rag-corpus.jsonl");
const gapPath = path.join(
  repoRoot,
  "content/_staging/prepared/rag-corpus-english-gap-2026-08-06.jsonl",
);
const outputPath = path.join(repoRoot, "content/_staging/prepared/rag-corpus-english.jsonl");

async function copyEnglishLines(inputPath, output, seenHashes) {
  let written = 0;
  let skipped = 0;
  const input = createInterface({
    input: createReadStream(inputPath, "utf8"),
    crlfDelay: Infinity,
  });
  for await (const line of input) {
    if (!line.trim()) continue;
    const chunk = JSON.parse(line);
    if (chunk.language !== "en") {
      skipped += 1;
      continue;
    }
    if (seenHashes.has(chunk.chunk_hash)) {
      skipped += 1;
      continue;
    }
    seenHashes.add(chunk.chunk_hash);
    output.write(`${JSON.stringify(chunk)}\n`);
    written += 1;
  }
  return { written, skipped };
}

await mkdir(path.dirname(outputPath), { recursive: true });
const output = createWriteStream(outputPath, { encoding: "utf8", flags: "w" });
await once(output, "open");
const seenHashes = new Set();
const existing = await copyEnglishLines(existingPath, output, seenHashes);
const gap = await copyEnglishLines(gapPath, output, seenHashes);
await new Promise((resolve, reject) => {
  output.once("error", reject);
  output.once("finish", resolve);
  output.end();
});

console.log(
  JSON.stringify(
    {
      output: path.relative(repoRoot, outputPath),
      existing_english_chunks: existing.written,
      gap_english_chunks_added: gap.written,
      duplicate_or_non_english_skipped: existing.skipped + gap.skipped,
      total_english_chunks: existing.written + gap.written,
    },
    null,
    2,
  ),
);

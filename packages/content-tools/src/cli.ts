#!/usr/bin/env node
import { resolve } from "node:path";

import { inspectMarkdownCorpus, validateMarkdownCorpus } from "./index.js";

const [command = "help", input = "content"] = process.argv.slice(2);

if (command === "validate") {
  const root = resolve(input);
  const result = await validateMarkdownCorpus(root);
  console.info(`Validated ${result.files} Markdown content files in ${root}.`);
  console.info(`Valid: ${result.valid}; invalid: ${result.invalid}.`);
  for (const issue of result.issues) console.error(`- ${issue.message}`);
  if (result.invalid > 0) process.exitCode = 1;
} else if (command === "stats") {
  const root = resolve(input);
  const stats = await inspectMarkdownCorpus(root);
  console.info(`Scanned ${stats.files} Markdown content files in ${root}.`);
  console.info(`Valid: ${stats.valid}; invalid: ${stats.invalid}.`);
  console.info(
    `Rights: ${stats.storable} storable, ${stats.excerptable} excerptable, ${stats.embeddable} embeddable.`,
  );
  console.info(
    `Licences: ${
      Object.entries(stats.licences)
        .map(([name, count]) => `${name}=${count}`)
        .join(", ") || "none"
    }.`,
  );
  if (stats.invalid > 0) process.exitCode = 1;
} else {
  console.info("Usage: content validate <canonical-content-folder>");
  console.info("       content stats <canonical-content-folder>");
  console.info("Every Markdown file must include rights metadata and a non-empty sectioned body.");
}

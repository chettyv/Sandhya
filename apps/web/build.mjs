#!/usr/bin/env node
// Builds the static arrival site from content/web/*.md into apps/web/dist.
// Same editorial gate as the app: only review_status approved pages (with a
// named reviewer) are published. --allow-draft builds drafts with a visible
// banner for local review. Deploy dist/ to any static host.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { marked } from "marked";

const root = resolve(import.meta.dirname, "..", "..");
const contentDir = join(root, "content", "web");
const outDir = join(import.meta.dirname, "dist");
const allowDraft = process.argv.includes("--allow-draft");
const siteUrl = (process.env.WEB_SITE_URL ?? "https://sandhya.app").replace(/\/$/, "");

const tools = await import(
  pathToFileURL(join(root, "packages", "content-tools", "dist", "index.js")).href
);

mkdirSync(outDir, { recursive: true });
const pages = [];
const files = existsSync(contentDir)
  ? readdirSync(contentDir).filter((file) => file.endsWith(".md") && !file.startsWith("_"))
  : [];

for (const file of files) {
  const source = readFileSync(join(contentDir, file), "utf8");
  const issues = tools.validateMarkdownDocument(source, file);
  if (issues.length > 0) fail(issues.join("\n"));
  const { frontmatter, body } = tools.parseFrontmatter(source);
  const approved = frontmatter.review_status === "approved";
  if (!approved && !allowDraft) {
    console.log(`skipped (draft): ${file}`);
    continue;
  }
  const html = page(frontmatter, marked.parse(body), approved);
  writeFileSync(join(outDir, `${frontmatter.slug}.html`), html);
  pages.push({ slug: frontmatter.slug, title: frontmatter.title, description: frontmatter.description });
  console.log(`${approved ? "published" : "DRAFT"}: ${frontmatter.slug}.html`);
}

writeFileSync(join(outDir, "index.html"), indexPage(pages));
writeFileSync(
  join(outDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[{ slug: "" }, ...pages].map(({ slug }) => `  <url><loc>${siteUrl}/${slug}</loc></url>`).join("\n")}
</urlset>
`,
);
writeFileSync(join(outDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log(`built ${pages.length} page(s) + index, sitemap, robots.txt -> ${outDir}`);

function page(fm, bodyHtml, approved) {
  return shell({
    title: `${fm.title} — Sandhya`,
    description: fm.description,
    canonical: `${siteUrl}/${fm.slug}`,
    body: `
${approved ? "" : `<p class="draft-banner">DRAFT — not yet reviewed. Do not publish.</p>`}
<article>
<h1>${escapeHtml(fm.title)}</h1>
${bodyHtml}
${fm.reviewed_by ? `<p class="reviewed">Reviewed by ${escapeHtml(fm.reviewed_by)}.</p>` : ""}
</article>
<aside class="app-card">
  <p><strong>Sandhya</strong> — a calm, source-grounded companion for Hindu learning and daily practice. A short teaching every day, with real citations and respect for how traditions differ.</p>
</aside>`,
  });
}

function indexPage(list) {
  return shell({
    title: "Sandhya — understand the why behind Hindu practice",
    description:
      "Clear, source-grounded answers about Hindu festivals, fasting, and home practice — written for people who inherited the tradition and want to understand it.",
    canonical: `${siteUrl}/`,
    body: `
<article>
<h1>Understand the why behind the practice</h1>
<p>Short, careful explanations of Hindu festivals, fasting, and home practice — written for the person who grew up around the tradition and is now the one expected to carry it.</p>
${
  list.length > 0
    ? `<ul class="page-list">
${list.map((p) => `  <li><a href="/${p.slug}">${escapeHtml(p.title)}</a><br /><span>${escapeHtml(p.description)}</span></li>`).join("\n")}
</ul>`
    : "<p>Guides are being written and reviewed. They will appear here soon.</p>"
}
</article>`,
  });
}

function shell({ title, description, canonical, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<link rel="canonical" href="${canonical}" />
<style>
:root { color-scheme: dark; }
* { box-sizing: border-box; }
body { margin: 0; background: #080807; color: #f7f2e8; font: 18px/1.7 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
main { max-width: 680px; margin: 0 auto; padding: 32px 20px 64px; }
h1 { font-size: 32px; line-height: 1.25; margin: 16px 0 8px; }
h2 { font-size: 22px; line-height: 1.3; margin: 32px 0 8px; }
a { color: #ffc928; }
p, li { color: #f7f2e8; }
.eyebrow a { color: #a9a29a; text-decoration: none; font-size: 14px; }
.reviewed, .draft-banner { color: #a9a29a; font-size: 14px; }
.draft-banner { background: #351c1a; color: #ea8c7f; padding: 8px 12px; border-radius: 8px; font-weight: 600; }
.app-card { margin-top: 48px; padding: 16px; border: 1px solid #302c25; border-radius: 12px; background: #12110f; }
.app-card p { margin: 0; color: #a9a29a; }
.app-card strong { color: #f7f2e8; }
.page-list { list-style: none; padding: 0; }
.page-list li { margin: 20px 0; }
.page-list span { color: #a9a29a; font-size: 15px; }
blockquote { margin: 16px 0; padding-left: 16px; border-left: 2px solid #d6c8e6; }
</style>
</head>
<body>
<main>
<p class="eyebrow"><a href="/">Sandhya</a></p>
${body}
</main>
</body>
</html>
`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

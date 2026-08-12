import { describe, expect, it } from "vitest";

import { parseFrontmatter, validateMarkdownDocument } from "./index.js";

const valid = `---
text_slug: bhagavad_gita
text_title: Bhagavad Gita
translator: Edwin Arnold
licence: public_domain
copyright_status: Public domain edition; verify deployment jurisdiction.
source_url: https://archive.org/details/example
tradition_primary: general
can_store: true
can_show_excerpts: true
can_embed: true
---

## 2.47

**Translation:** You have a right to action, not to its fruits.
`;

describe("content validation", () => {
  it("parses scalar frontmatter and booleans", () => {
    const parsed = parseFrontmatter(valid);
    expect(parsed.frontmatter?.text_slug).toBe("bhagavad_gita");
    expect(parsed.frontmatter?.can_embed).toBe(true);
    expect(parsed.body).toContain("## 2.47");
  });

  it("accepts a complete rights-cleared document", () => {
    expect(validateMarkdownDocument(valid)).toEqual([]);
  });

  it("rejects incomplete rights metadata", () => {
    const incomplete = valid
      .replace("can_embed: true", "can_embed: false")
      .replace("licence: public_domain", "licence: unclear");
    const issues = validateMarkdownDocument(incomplete, "example.md");
    expect(issues.some((issue) => issue.includes("licence must be one of"))).toBe(true);
  });

  it("requires a copyright status record", () => {
    const incomplete = valid.replace(
      "copyright_status: Public domain edition; verify deployment jurisdiction.\n",
      "",
    );
    const issues = validateMarkdownDocument(incomplete, "example.md");
    expect(issues).toContain("example.md: missing required field: copyright_status");
  });

  it("rejects documents without a sectioned body", () => {
    const empty = valid.replace(
      "## 2.47\n\n**Translation:** You have a right to action, not to its fruits.\n",
      "",
    );
    const issues = validateMarkdownDocument(empty);
    expect(issues).toContain("content.md: document body is empty");
  });
});

const validSession = `---
doc_type: challenge_session
challenge_slug: navratri-2026
night: 1
session_title: Shailaputri — beginning at the root
deity_focus: Shailaputri
estimated_minutes: 10
review_status: approved
reviewed_by: Named Reviewer
copyright_status: Original Sandhya content; quoted scripture attributed inline.
source_url: https://github.com/chettyv/Sandhya
tradition_primary: general
licence: original
can_store: true
can_show_excerpts: true
can_embed: false
---

## Tonight

Framing text.

## Shloka

**Devanagari:** देवी
**IAST:** devī
**Say it:** DAY-vee
**Meaning:** The goddess.
**Source:** Example text 1.1, tr. Example Translator, public domain, https://example.org

## Meaning

Explanation.

## Practice

One small act.

## Tradition notes

Nothing differs materially here.

## Reflection

One question?
`;

describe("challenge session validation", () => {
  it("accepts a complete approved session", () => {
    expect(validateMarkdownDocument(validSession, "night-01.md")).toEqual([]);
  });

  it("requires a named reviewer when approved", () => {
    const unreviewed = validSession.replace("reviewed_by: Named Reviewer\n", "");
    const issues = validateMarkdownDocument(unreviewed, "night-01.md");
    expect(issues).toContain("night-01.md: approved sessions must name a reviewer in reviewed_by");
  });

  it("rejects sessions marked embeddable", () => {
    const embeddable = validSession.replace("can_embed: false", "can_embed: true");
    const issues = validateMarkdownDocument(embeddable, "night-01.md");
    expect(issues.some((issue) => issue.includes("can_embed: false"))).toBe(true);
  });

  it("requires all six sections in order", () => {
    const missing = validSession.replace(
      "## Tradition notes\n\nNothing differs materially here.\n\n",
      "",
    );
    expect(validateMarkdownDocument(missing, "night-01.md")).toContain(
      "night-01.md: missing required section: ## Tradition notes",
    );

    const swapped = validSession
      .replace("## Practice\n\nOne small act.", "## MOVED")
      .replace(
        "## Reflection\n\nOne question?",
        "## Practice\n\nOne small act.\n\n## Reflection\n\nOne question?",
      )
      .replace("## MOVED", "");
    const issues = validateMarkdownDocument(swapped, "night-01.md");
    expect(issues.some((issue) => issue.includes("sections out of order"))).toBe(true);
  });

  it("requires all three registers plus meaning and source in the shloka block", () => {
    const noSayIt = validSession.replace("**Say it:** DAY-vee\n", "");
    expect(validateMarkdownDocument(noSayIt, "night-01.md")).toContain(
      "night-01.md: ## Shloka must include a **Say it:** line",
    );

    const fakeDevanagari = validSession.replace("**Devanagari:** देवी", "**Devanagari:** devi");
    expect(validateMarkdownDocument(fakeDevanagari, "night-01.md")).toContain(
      "night-01.md: **Devanagari:** line contains no Devanagari characters",
    );
  });

  it("validates shloka documents with word-by-word gloss", () => {
    const shloka = `---
doc_type: shloka
shloka_slug: gita-2-47
text_ref: Bhagavad Gita 2.47
tradition_primary: general
licence: original
copyright_status: Example fixture.
source_url: https://example.org
review_status: draft
---

## Shloka

**Devanagari:** देवी
**IAST:** devī
**Say it:** DAY-vee
**Meaning:** The goddess.
**Source:** Example text 1.1, tr. Example Translator, public domain, https://example.org

## Word by word

- **devī** — the goddess

## Meaning

Prose meaning.
`;
    expect(validateMarkdownDocument(shloka, "gita-2-47.md")).toEqual([]);

    const noWords = shloka.replace("- **devī** — the goddess\n", "");
    expect(
      validateMarkdownDocument(noWords, "gita-2-47.md").some((issue) =>
        issue.includes("Word by word"),
      ),
    ).toBe(true);

    const approvedNoReviewer = shloka.replace("review_status: draft", "review_status: approved");
    expect(validateMarkdownDocument(approvedNoReviewer, "gita-2-47.md")).toContain(
      "gita-2-47.md: approved shlokas must name a reviewer in reviewed_by",
    );
  });

  it("rejects a non-integer night", () => {
    const badNight = validSession.replace("night: 1", "night: first");
    expect(validateMarkdownDocument(badNight, "night-01.md")).toContain(
      "night-01.md: night must be a positive integer",
    );
  });
});

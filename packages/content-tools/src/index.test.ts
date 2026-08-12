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

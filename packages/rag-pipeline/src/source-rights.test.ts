import { describe, expect, it } from "vitest";

import {
  assertProductionRights,
  normalizeSourceUrl,
  type SourceRightsRecord,
} from "./source-rights.js";

const record: SourceRightsRecord = {
  work_id: "approved-source",
  source_url: "https://example.test/source/",
  licence: "public domain",
  status: "approved",
  can_store: "Yes",
  can_show_excerpts: "Yes",
  can_embed_full_text: "Yes",
  can_use_for_rag: "Yes, can ingest",
  permission_needed: "No",
  review_needed: "content review complete",
};

const chunk = {
  source_path: "content/approved.txt",
  source_key: "approved_source",
  source_url: "http://example.test/source",
  can_store: true,
  can_show_excerpts: true,
  can_embed: true,
  licence: "public_domain" as const,
};

describe("production source rights gate", () => {
  it("normalizes equivalent http/https source URLs", () => {
    expect(normalizeSourceUrl("https://Example.test/source/")).toBe(
      normalizeSourceUrl("http://example.test/source"),
    );
  });

  it("accepts an explicitly approved source", () => {
    expect(
      assertProductionRights(chunk, new Map([[normalizeSourceUrl(record.source_url), [record]]])),
    ).toBe(record);
  });

  it("rejects an untracked source", () => {
    expect(() => assertProductionRights(chunk, new Map())).toThrow("untracked source");
  });

  it("rejects a staged candidate", () => {
    expect(() =>
      assertProductionRights(
        chunk,
        new Map([
          [normalizeSourceUrl(record.source_url), [{ ...record, status: "staged_candidate" }]],
        ]),
      ),
    ).toThrow("unapproved source");
  });

  it("rejects conditional RAG rights", () => {
    expect(() =>
      assertProductionRights(
        chunk,
        new Map([
          [
            normalizeSourceUrl(record.source_url),
            [{ ...record, can_use_for_rag: "Yes, after legal review" }],
          ],
        ]),
      ),
    ).toThrow("rights are not cleared");
  });

  it("rejects a source that still needs permission", () => {
    expect(() =>
      assertProductionRights(
        chunk,
        new Map([
          [normalizeSourceUrl(record.source_url), [{ ...record, permission_needed: "Possibly" }]],
        ]),
      ),
    ).toThrow('permission_needed must explicitly begin with "No"');
  });

  it("rejects a source without a review record", () => {
    expect(() =>
      assertProductionRights(
        chunk,
        new Map([[normalizeSourceUrl(record.source_url), [{ ...record, review_needed: "" }]]]),
      ),
    ).toThrow("review_needed must document completed review");
  });

  it("rejects a prepared licence that disagrees with the tracker", () => {
    expect(() =>
      assertProductionRights(
        { ...chunk, licence: "licensed" },
        new Map([[normalizeSourceUrl(record.source_url), [record]]]),
      ),
    ).toThrow("does not match");
  });
});

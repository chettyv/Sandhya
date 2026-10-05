# English-first corpus completion plan

Date: 2 October 2026  
Status: Proposed execution plan; no collection, content changes, approvals or publishing performed by creating this document.  
Current scope: Inventory existing English material and collect missing, existing English translations with their source and rights evidence. No new translation production, Sanskrit acquisition, IAST work or pronunciation work in this phase. Audio is excluded.

## Scope clarification from the user

We already have Sanskrit in the current shloka files, English in the 661 bundled entries and substantial English in 191 Devi drafts. Do not collect these again by default. The first task is to establish which English source files actually exist and collect only the missing English material from suitable published translations.

Sanskrit is the original source language, but acquiring or repairing it is not part of this collection phase. Keep existing Sanskrit and other-language content intact. Specialist comparison with Sanskrit can take place later where accuracy questions require it; it is not a prerequisite to inventorying and collecting English.

M0 and M1 below are the current execution scope. The later authoring, linguistic-review and publication sections describe subsequent gates only. They do not turn this English collection task into a request for new multilingual translations or immediate Sanskrit work. Collection-ready and publication-ready remain different states.

## 1. Outcome and order of work

First inventory the English we have, then collect missing English source material. Reuse accessible existing files and retain the current English drafts. Prioritize complete reference coverage for the Gita, the Devi collection and the selected pilot quotations. After collection, use those sources to finish and review the written English product. Pause all further language production.

The authoritative architecture and content reference remains `docs/sandhya_build_reference.docx`. Pilot deliverables come from `02-plan.md` §7; the competitive constraints come from `docs/05-competitors.md` and `AGENTS.md`. The user has explicitly superseded Stream A/B ownership boundaries for this work. This document adds an execution plan without changing those product references.

| Priority | Deliverable                               | Completion condition                                                                                                                                                                                    |
| -------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Written Navratri pilot                    | Nine reviewed sessions, their selected quotations, three reviewed explanatory pages, a qualified festival-date table and two date pages                                                                 |
| 2        | Existing English bank                     | All 661 currently bundled entries have substantive review evidence, correct registers, named translation attribution and resolved publication-source records, or are excluded from the intended release |
| 3        | Complete Gita                             | All 700 entries have finished English translation, gloss, explanation and reflection; no placeholder entries; review and rights gates satisfied                                                         |
| 4        | Complete current Devi Mahatmya extraction | Every mapped unit has finished English and review; chosen edition, numbering and coverage have been reconciled before making a completeness claim                                                       |
| 5        | Supporting learning catalog               | Pilot-relevant concepts, practices, deity introductions and festival explanations teach concrete material with proportionate claims                                                                     |
| 6        | Selective English expansion               | A short, approved acquisition list based on product need, source quality, rights and available reviewers                                                                                                |

Existing non-English content stays in place. Pause new language drafting. If a corrected Sanskrit or English entry makes a current translation stale, record that discrepancy rather than silently presenting it as checked or generating replacements during this English pass.

Do not re-enable scoped AI, add subscription features, activate the live participation counter, build a computed panchanga, expand the challenge schema, or change the embedding model. Collection and drafting tools are maintainer tools, not new mobile-app AI features.

## 2. Baseline from the audit

These are the 2 October audit counts, not live production measurements. Recount before execution and record changes since this baseline.

| Material                             | Existing state                                                                              | Work remaining                                                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Shloka Markdown                      | 1,869 entries; 661 bundled; 1,208 drafts                                                    | Review existing English and fill genuine gaps                                                                                                |
| Gita                                 | 700 entries; 80 bundled; 620 placeholders                                                   | Finish 620; review all 700, including the existing 80                                                                                        |
| Devi Mahatmya                        | 588 extracted draft units; 191 authored; 397 skeletons                                      | Review 191, finish 397, resolve edition and numbering                                                                                        |
| Six Upanishads                       | 368 bundled units including prayers/source divisions                                        | Verification and source clearance, not another bulk translation pass                                                                         |
| Chalisa / Aditya / Bhaja / Soundarya | 43 / 31 / 33 / 103 bundled units                                                            | Textual cleanup, edition reconciliation, attribution and rights                                                                              |
| Standalone prayers                   | Three bundled entries                                                                       | Text boundaries, pronunciation consistency, context and attribution                                                                          |
| Navratri sessions                    | Zero authored sessions; unpublished challenge configuration                                 | Nine complete written sessions                                                                                                               |
| Supporting catalog                   | 50 concepts, 20 practices, 21 festival explainers, 30 reflections, five deity introductions | Focused editorial improvements; one duplicated practice                                                                                      |
| Web pages                            | Six explanatory source pages and generated HTML pages                                       | Review/revise selected pages; two qualified date pages are absent                                                                            |
| Rights inventory                     | 431 records; one fully approved original guide                                              | Reconcile sources used by the release, not every wishlist row at once                                                                        |
| Acquisition queue                    | 382 records; 321 marked staged                                                              | None of those staged records' nonempty target paths existed in the audited checkout; locate preserved material or reacquire permitted copies |

The 588 Devi units must not automatically be called a complete standard 700-verse Saptashati. Different counting systems include speakers, repeated refrains and ancillary material differently. A reviewer must establish what this extraction contains and map it to the chosen edition.

All 661 bundled entries have English and Hindi text. Bengali, Gujarati, Marathi and Tamil each cover only 30 launch entries. No completed translation-review assignment with reviewer and date was recorded in the translation manifest. Existing founder approval is a workflow fact; it is not evidence of a documented verse-by-verse linguistic examination.

## 3. First milestone: inventory and test English collection

Produce an English coverage map before downloading anything. Distinguish app-authored English drafts, actual reference-edition files, tracker-only records and missing material. An English draft in the app does not establish that its published reference edition is available locally.

1. Recount existing English entries and preserve current user work.
2. Locate preserved English source files, including ignored staging material, before reacquiring them.
3. Identify which missing entries can be covered by an existing complete English edition. Prefer acquiring a suitable complete work once over hundreds of separate verse-page requests.
4. Record translator, edition, covered chapters and acquisition/storage terms. Publication and embedding decisions remain separate.
5. If acquisition is needed, test a small sample from one English edition: normal text, a multiline passage and a footnote or scanned page.
6. Compare extracted English with that original page/image for omissions, chapter boundaries, numbering and accidentally included apparatus.
7. Retain the permitted raw file, extracted text and retrieval evidence. Do not generate new translations or modify Sanskrit during this test.
8. Record extraction failures, missing pages and unresolved rights issues without labelling the source publication-ready.
9. Measure collection time and credits; expand the bounded English acquisition list only after the sample is reliable.

**Exit gate:** an accurate existing/missing English inventory and one reproducible English acquisition example if a source is missing. No duplicate acquisition, new Sanskrit collection, authored session or specialist linguistic sign-off is required to complete this collection milestone.

## 4. Source selection and acquisition

### 4.1 Decide the source approach per collection

For the current phase, select existing English editions and collect their text with attribution and permitted storage. Do not commission, generate or adapt translations during collection. The approaches below describe later editorial choices if needed:

- **Exact attributed translation:** reproduce a cleared edition accurately, preserving translator, edition, year and verse/page references.
- **Adapted translation:** identify the original translator/edition, mark adaptation, record what changed, and establish that the applicable rights permit adaptation.
- **New English translation:** identify the responsible translator or translation editor and the Sanskrit edition used. Record AI drafting assistance where applicable; do not imply that an automated draft was authored or reviewed by a person who has not accepted that role.

Explanations, reflection prompts and practice suggestions are separately authored educational material. They must not be passed off as the source translation. A clear modern rendering may sit alongside an older reference translation, but the two must remain distinguishable.

Use the existing source map and inventory as discovery aids. Candidate repositories, public-domain scans, Wikisource pages and supplier files each need item-level checks. A repository's code licence does not establish rights over its embedded translations. Do not rely on a blanket publication-year or author-death cutoff without checking the actual work and intended territories.

### 4.2 Acquisition record

Use `docs/source_inventory_template.csv` for source decisions and the existing download queue for acquisition status. Keep batch/review notes in documentation; preserve the content schema and existing CSV column definitions.

For each acquired source, retain:

- Work ID, title, language, author, translator, commentator and edition where applicable.
- Original and final retrieval URL, retrieval date, source-provided edition/revision identifier if available.
- Raw file location, extracted file location, file hash and extraction method/version.
- Exact scope acquired: chapters, verse range, scan pages and any missing portions.
- Licence text or permission evidence, attribution requirements and modification obligations.
- Separate storage, excerpt, publication/commercial-use, adaptation and embedding/retrieval decisions.
- Acquisition errors, OCR uncertainty, missing boundaries and unresolved rights questions.

Some of this evidence belongs in a batch note linked from the tracker rather than new tracker columns. Store source snapshots only when their terms permit it. Do not invent URLs, edition details, translators or permissions to complete a record.

### 4.3 Storage and extraction

Use the repository's existing staging layout and scripts where suitable. Preserve raw permitted material separately from normalized extracts. Document ignored-file locations so a future checkout can locate or reproduce them; an ignored file that exists only on one machine must not be reported as repository coverage.

Context.dev is an optional acquisition adapter. Prefer direct files or source-supported exports/APIs when they preserve the edition more reliably. For scanned books, retain page images and compare OCR with them. Preserve footnotes and variants in the evidence copy, then deliberately distinguish them from the main verse in authored content.

Do not crawl entire domains by default. Start from a bounded list of approved URLs, limit depth/pages, cache successful responses and retry selectively. A failed request or metadata-only result must remain a failed/missing acquisition rather than becoming "downloaded".

### 4.4 Rights gate

The current permission ledger's assertion that all personal-use material is safe for a free launch is not sufficient evidence. The audit found supplier notices restricting reposting for website promotion as well as commercial use. Resolve the exact source terms or select a different edition.

For Wikisource-derived material, establish the actual applicable page licence, provenance, attribution, modification notices and share-alike obligations. Distinguish the ancient work, the supplied transcription, the translation and app-authored explanation. Do not record an externally sourced transcription as wholly `original`.

Publication and embedding are independent decisions. Paid `challenge_session` documents must retain `can_embed: false`. This plan does not authorize RAG ingestion, production migrations, corpus re-embedding or publishing. No embedding API is needed for the English completion milestone.

## 5. English authoring standard

Every completed shloka retains the five existing labels: Devanagari, IAST, Say it, Meaning and Source. It also has the existing word gloss, explanatory Meaning section and Reflection where required by its document type.

| Layer               | Standard                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Devanagari          | Matches the chosen edition; valid notation retained; extraction debris corrected against evidence                                           |
| IAST                | Represents the same chosen text; vowel length, aspiration, retroflexion and nasal notation checked                                          |
| Say it              | Matches that text; conventions explained; approximations are not represented as exact phonetics                                             |
| Verse Meaning       | Faithful English; no silent omissions, changed agency, added certainty or unexplained interpretation                                        |
| Word by word        | Correct sandhi splits and meanings in this passage, not dictionary definitions pasted indiscriminately                                      |
| Explanatory Meaning | Explains speaker, setting, technical terms and the actual argument; named interpretive differences backed by references                     |
| Reflection/practice | Feasible, optional editorial application; no universal ritual permission, guaranteed spiritual outcome or unsupported therapeutic claim     |
| Source              | Names work/reference, chosen edition, translator or responsible original-translation editor, adaptation status and source URL as applicable |

Do not add labels or sections to `challenge_session`. Put needed edition, attribution and interpretive context inside its existing fields and sections. Any genuine interface change requires a separate decision.

The old runbook's "do not alter Devanagari; leave artifacts in comments" is suitable for preserving a raw extraction, not for publishing a verified text. This plan proposes retaining the immutable raw evidence and making documented, reviewed corrections in authored entries. Creating this plan has not changed the runbook or any content.

Similarly, do not invent review evidence when using existing blanket founder approval. Keep factual workflow approval distinct from completed translation checks. No automated sweep should mark translation-review rows complete without the actual reviewer and date.

## 6. What verification means, in practice

### Gate 1: completeness and extraction

Check chapter boundaries, verse sequence, required fields, empty sections, duplicate IDs, placeholders and contamination such as URLs, HTML, wiki markup, footnote strings and ITRANS escape tokens. Expected counts must come from the selected edition. Repeated canonical verses are valid parallels, not automatically duplicates to remove.

### Gate 2: written registers

Compare Devanagari, IAST and Say it against one another and the source. Use mechanical transliteration/diff checks to flag differences, followed by knowledgeable resolution. Preserve legitimate candrabindu, pluta notation, sandhi and regional variants. Inspect every flagged difference; inspect every selected pilot quotation manually.

### Gate 3: English fidelity

Check sentence-by-sentence alignment, omitted phrases, inserted interpretation, negation, subject/object, tense, compounds and ambiguous technical terms. Compare with identifiable reference translations/commentaries, recording differences. Agreement between two automated drafts is only a screening signal.

A qualified Sanskrit reviewer resolves ambiguous readings. A responsible English editor checks clarity. Record the human review scope honestly: full chapter, selected verses or specific issues. A sample cannot establish full-collection linguistic clearance.

### Gate 4: religious and factual context

Distinguish scripture, commentary, hagiography/folklore, regional common practice and editorial advice. Verify comparative accounts against named works. Name real alternatives where relevant; do not add boilerplate claims that all traditions agree. Use a tradition-specific reviewer for technical practice claims or unfamiliar interpretations.

### Gate 5: rights and attribution

Resolve the applicable source record, required permissions, translator/edition details and attribution obligations. Human ownership decisions do not replace licence evidence. Rights ambiguity remains explicitly unresolved until supported; source correctness does not settle publication rights.

### Gate 6: delivery

Trace approved Markdown through generated JSON/SQL or web HTML into the relevant local preview. Confirm intact text, credits, language labels and actual variation notes. Inspect compact cards as well as full detail views: truncation must not turn a qualified devotional statement into an unsupported promise or hide required attribution.

**A batch passes only when all applicable gates pass.** Structural validators establish shape and consistency; they do not establish Sanskrit accuracy, religious correctness or legal clearance.

## 7. Known issues to use as acceptance examples

| Entry or area                         | Required resolution                                                                                             |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Kena 4.4                              | Remove leaked English footnote from the published Sanskrit; retain legitimate pluta notation                    |
| Katha 1.3.2                           | Remove wiki hyperlink markup from verse text                                                                    |
| Soundarya Lahari 14                   | Resolve leaked `.h` conversion artifact and align all registers                                                 |
| Mandukya 1 and 7; Shvetashvatara 4.10 | Resolve the flagged readings against the chosen edition; do not silently correct only one register              |
| Aditya Hridayam 11; Bhaja Govindam 26 | Keep variant readings as explained apparatus rather than concatenate them into the recited verse                |
| Soundarya Lahari 101                  | Separate the colophon/appendix heading from the numbered quotation using existing explanation fields            |
| Isha 11                               | Replace the inaccurate Shankara account with a cited, edition-backed account; verify other comparative claims   |
| Bhaja Govindam 15                     | Resolve changed grammatical agency or explicitly identify an adaptation                                         |
| Chalisa 25                            | Remove unsupported "demonstrably" assertion; preserve devotional context near the displayed quotation           |
| Gita 6.5 manifest                     | Fix the status classifier matching `pending` inside `depending`; do not count a false positive as missing prose |
| Source links                          | Reconcile Soundarya URL spelling and normalized parent/chapter URL matching without weakening the rights gate   |
| Practice/catalog copy                 | Resolve duplicate evening practice and qualify categorical ritual-validity claims                               |

These are a regression set, not the full defect list. Review remaining entries without assuming that unflagged text is correct.

## 8. Work packages and milestones

### M0 — baseline and release inventory

Produce the English coverage map: present English entries, accessible published reference files, missing files and tracker-only claims. Locate preserved English sources. Identify suitable existing English editions and minimum collection access. Keep existing local changes intact. Reviewer recruitment and Sanskrit work are later tasks.

### M1 — collect missing English source material

Complete the collection test in §3, then retrieve only the missing permitted English works/passages. Record translator, edition, coverage, file location, extraction checks and rights evidence. Reuse sources already available. Track how much of the 620 Gita and 397 Devi English gaps is covered by reference material; collection does not itself fill the authored Markdown placeholders.

The immediate handoff is the English inventory, collected reference files and a source/rights report. M2 onward is subsequent English authoring/review and publication preparation, not part of this collection request.

### M2 — written Navratri package

Author nine nights with the existing six sections in order: Tonight, Shloka, Meaning, Practice, Tradition notes, Reflection. Select quotations only after source/reference review; do not invent nine convenient scripture references or impose a nine-form scheme on every tradition.

For each night, record the named devi form, editorial learning objective, quotation/edition, explained terminology, feasible practice, estimated reading/practice duration, observing convention, named regional alternative and reviewer. Editorial learning themes must be labelled as editorial rather than asserted to be scriptural meanings of the forms.

The Navadurga progression follows the project's stated North Indian Shakta convention, with alternatives explained. Confirm the names/list against an identified source such as Devikavacha 3–5; independently justify any nightly date assignment.

Review three explanatory pages, produce two festival-date pages and the small festival-date table. Every published date states amanta/purnimanta reckoning, location, community where observance splits, and sources. Report source disagreement explicitly and distinguish it from different locations or inclusion of Vijayadashami as a tenth-day conclusion. Keep the nine-session product duration distinct from claims about every community's festival calendar.

Run a beginner read-through: can someone without inherited practice complete the night without asking what an unexplained term or ritual step means? Resolve stumbling points inside the existing sections. Test the stated duration. No audio work belongs to this plan.

### M3 — repair and review the existing English bank

Work collection by collection through the 661 bundled entries. Prioritize release-exposed material and daily-pool entries, followed by known extraction issues and doctrinally sensitive passages. Record every completed review; a previous approval label does not skip the checks.

Preserve strong existing explanations rather than rewriting everything. Review Hindu-practice claims, medicinal/devotional language, source numbering, recension appendices and universalized philosophical summaries. Ensure source records and displayed translation attributions are reconciled.

### M4 — finish the Gita

Complete the 620 placeholder entries in chapter sequence. Draft in small groups while reading each full connected passage. Complete each chapter's review and correction before presenting it as finished. Use one established English approach rather than changing translator or terminology mid-chapter without a visible reason.

Reader-only passages need context, not forced daily-life relevance. Set `daily_pool` only for standalone-meaningful and appropriate entries. Verify all 700 against the selected edition before claiming complete coverage.

### M5 — finish the Devi extraction

Reconcile the 588-unit extraction and recitation numbering first. Review the 191 authored drafts and fill the 397 placeholders in chapter order. Do not solve mismatched numbering by renumbering existing public references casually. Record any crosswalk in documentation and source information; a schema change remains a separate decision.

Identify episode boundaries and speaker changes. Label phalashruti/devotional promises appropriately and keep complex ritual instruction within qualified review. Add missing source material only after edition and rights decisions explain the gap.

### M6 — supporting catalog and expansion decision

Improve pilot-linked definitions, Durga/context introductions, practice instructions and date explanations. Consolidate the duplicated evening exercise. Replace generic tradition notes with concrete alternatives where useful; do not pad the catalog to hit a count.

After existing collections pass, choose the next English source family. Candidate needs already documented include additional principal Upanishads, selected epic passages, Yoga Sutras and other source families in the build reference. Evaluate each on beginner usefulness, rights, reliable source text, scope and reviewer availability. A malformed boundary or uncleared source blocks that acquisition, not all other useful work.

Long-term full-corpus ambitions remain separate from pilot release requirements. Do not bulk-copy hundreds of wishlist sources merely because acquisition tooling can do so.

## 9. Tools, APIs and inputs to provide

No new API or human-review appointment is mandatory to inventory existing English files. Context.dev or direct source exports can help acquire missing English material. OCR is conditional on English sources being scans. Sanskrit/tradition reviewers are needed at later substantive publication gates, not to start collection. Model translation access is deferred; do not generate new translations in this phase.

| Capability/input                                 | Why needed                                                         | Priority                                     | What the user can provide                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Preserved staged material                        | Avoid reacquisition; recover previously collected edition evidence | First                                        | Directory location or accessible storage connection for the staged files                         |
| Base editions and English translation preference | Establish what text and translation approach we are completing     | First                                        | Preferred edition/translator, purchased/owned source files, or permission to evaluate candidates |
| Sanskrit reviewer                                | Resolve grammar, source readings and pronunciation guidance        | Required for substantive linguistic sign-off | Reviewer identity, scope, availability and budget; existing review notes if any                  |
| Tradition reviewer                               | Check named interpretations and regional practice                  | Required for relevant pilot claims           | A suitable reviewer for the stated convention and an alternative tradition/region                |
| Permission evidence                              | Establish storage/publication/adaptation rights                    | Required per source                          | Licence documents, publisher permissions or authorised source alternatives                       |
| Context.dev                                      | Extract webpages/PDFs and process a bounded URL batch              | Optional collection accelerator              | Connected tool/MCP access or securely configured API credentials, plus a spend cap               |
| Source-supported APIs/exports                    | Obtain accurate direct source files with provenance                | Prefer when suitable                         | Access to an existing source API/export and its terms                                            |
| PDF extraction/OCR                               | Process scans when usable text is unavailable                      | Conditional                                  | Local OCR tools or an OCR API; source files and permission for third-party processing            |
| Model API for assisted drafting                  | Draft/compare English and flag issues at scale                     | Optional; existing agent can start small     | Preferred available provider, model access, request/token limits and budget                      |
| Local app/web preview                            | Verify final reading surfaces and credits                          | Required at delivery gate                    | Existing preview access; device access if needed for final presentation checks                   |
| Embedding/RAG API                                | Not required for this milestone                                    | Deferred                                     | Nothing needed now                                                                               |

Context7 supplies software-library documentation and is a different capability from Context.dev's acquisition tools. It may help future implementation, but is not a scripture acquisition requirement.

Configure credentials through the relevant connector or a local/backend secret environment. Do not paste secrets into this plan, commit them, print them in logs, or place model/service keys in `EXPO_PUBLIC_*` variables. Drafting/collection requests run in a maintainer process or backend; no LLM call is added to the mobile client.

Before paid API calls, record the agreed batch size and spend cap. Preserve already successful downloads, use selective retries and avoid duplicate model calls. Report actual usage and projected remaining work based on the initial batch. Do not promise a completion date before source access and reviewer capacity are known.

Official capability references checked during planning:

- [Context.dev documentation](https://docs.context.dev/introduction)
- [Context7 overview](https://context7.com/about)
- [SanskritDocuments supplier FAQ](https://sanskritdocuments.org/faq/)
- [Wikimedia content licensing and reuse terms](https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use#7._Licensing_of_Content)

These links are discovery/verification references. They do not constitute permission to ingest every hosted work.

## 10. Tracking, roles and review handoffs

Use the existing English rows in `docs/translation/manifest.csv` for translation-review evidence, following its reviewer/date semantics. The current generator does not establish the review-assignment workflow; inspect and agree how those records are preserved before implementing it. Do not manually write review evidence that a subsequent generation step will erase.

Track each batch in a documentation note with:

| Field           | Record                                                                        |
| --------------- | ----------------------------------------------------------------------------- |
| Scope           | Collection, chapter, exact slugs/references, selected edition                 |
| Source evidence | Work ID, URLs, permitted snapshot/scan location, hashes, numbering notes      |
| Authoring       | Translator/editor, English approach, assistance used, terminology decisions   |
| Checks          | Automated findings, textual comparisons, unresolved questions                 |
| Human review    | Reviewer, role, date, exact scope, comments and resolution                    |
| Rights          | Source record, evidence and separate publication/embedding decisions          |
| Delivery        | Generated-artifact check and preview evidence                                 |
| State           | Collected, extracted, drafted, in review, blocked, reviewed, or release-ready |

These are planning states in documentation, not new content-schema enum values. Keep textual correctness, rights and delivery states separate. A blocked source may be replaced with a documented alternative; an unanswered question must not disappear into "approved".

The collection/editor role prepares evidence and drafts. The Sanskrit reviewer resolves linguistic questions. The relevant tradition reviewer resolves comparative/practice claims. The rights owner records supported decisions or seeks clarification. The delivery role verifies the exposed artifacts. One person can cover multiple roles only when the recorded scope and competence actually support that review.

Provide a concise progress report after each batch: English authored, substantively reviewed, rights-cleared, release-ready, blocked and remaining counts. Separate coverage from clearance. Report missing files and unresolved differences; do not infer readiness from the number of generated entries.

## 11. Validation and release acceptance

The following commands are existing checks, verified against the repository scripts at planning time. Confirm their behavior before execution. The content validator builds its local tooling; checks are not religious-review substitutes.

```text
pnpm content:validate
node scripts/verify-source-trackers.mjs
node scripts/build-translation-manifest.mjs --check
node scripts/verify-translation-manifest.mjs --check
pnpm content:generate-shloka-bank -- --check
pnpm content:generate-challenge-seed -- --check
```

After authorised content implementation, regenerate only the affected artifacts through existing generators, then run their freshness checks. Source-review checks and relevant regression tests must verify the resolved problems rather than just reproduce implementation details. Do not run RAG ingestion, re-embedding, production migrations or publishing as part of these checks.

For the written pilot, acceptance requires:

- Nine complete sessions in the fixed schema, with `can_embed: false`.
- Every exposed quotation has an identified source edition and responsible translation attribution.
- Every selected quotation has aligned Devanagari, IAST and Say it with substantive review recorded.
- All applicable publication rights/obligations are resolved and documented.
- No unresolved extraction debris, placeholder prose or unsupported comparative/medical claim.
- Feasible practices and named convention/alternatives, understandable to a beginner.
- Three reviewed explanatory pages, two qualified date pages and the reviewed date table.
- Attribution, text and actual variation notes survive the user-facing presentation.
- Structural/freshness checks pass, with human-review evidence assessed independently.

For a completed English collection, every intended unit must meet the same applicable gates. If a reviewer checks only a sample, record only sampled review and leave the rest unchecked. "English complete" and "ready for publication" remain separate until both writing and clearance are complete.

## 12. Immediate handoff

To start M0/M1, the useful inputs are the location of preserved English files, any preferred existing English editions, acquisition/permission evidence, and optional Context.dev access with a spending limit. No new translation API or Sanskrit acquisition tool is needed.

The first concrete deliverable is an English existing/missing inventory, followed by a reliable collection of the missing English reference material. Retain existing Sanskrit for possible later accuracy checks. Creating this document authorises no account signup, paid API use, source ingestion, reviewer messaging or deployment by itself.

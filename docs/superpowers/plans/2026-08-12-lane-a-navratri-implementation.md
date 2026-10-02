# Lane A Navratri Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete Stream A deliverables A1-A8 for the 2026 Navratri pilot with truthful rights, review, publication, posting, and attribution evidence.

**Architecture:** Rights evidence flows into one quotation ledger, then into nine frozen-schema session files and their audio scripts. Calendar evidence independently produces a qualified table and two date pages; existing in-house prose supplies three explanatory pages. Six video packages and a 30-action arrival ledger reuse those approved assets while preserving external-account and human-review gates.

**Tech Stack:** Markdown with YAML frontmatter, CSV evidence ledgers, JSON challenge metadata, the existing TypeScript content validator, PowerShell verification, and human-reviewed WAV/M4A audio.

## Global Constraints

- Edit only `content/**` and `docs/**`; never edit `apps/**`, `packages/**`, or `supabase/**`.
- Preserve the frozen six-section order: Tonight, Shloka, Meaning, Practice, Tradition notes, Reflection.
- Every quotation needs Devanagari, IAST, Say it, Meaning, and Source; name translator, edition/year, licence, and URL.
- Never invent or reconstruct scripture from memory. Copy from a cleared witness and record proofing evidence.
- Set every `challenge_session` to `can_embed: false`.
- Keep files `draft` or `in_review` until a named qualified human has actually approved them.
- Identify the nine-form sequence as a North Indian Shakta convention and name real alternatives.
- Never generate devotional or deity imagery with AI.
- Never record publication, posting, outreach, review, or audio approval without evidence.
- Do not write the prohibited competitor-brand string identified by `AGENTS.md` in user-visible content.
- Do not build scoped AI, a participation counter, an admin console, push leases, or subscriptions.

---

### Task 1: Clear and freeze the quotation source set

**Files:**

- Modify: `docs/source_inventory_template.csv`
- Create: `docs/navratri-2026/source-clearance.md`
- Create: `docs/navratri-2026/quotation-ledger.csv`

**Interfaces:**

- Consumes: the Internet Archive scan of Manmatha Nath Dutt's 1896 _Markandeya Puranam_ and an item-specific Sanskrit witness.
- Produces: nine ledger rows with exact source identifiers, text, translation, rights, proofing, and intended night.

- [ ] **Step 1: Record primary-source rights evidence**

  In `source-clearance.md`, record the edition title page, publication year, translator, translator death evidence when available, scan URL, relevant copyright rules for US and UK distribution, Sanskrit host licence, attribution text, and the distinction between public-domain underlying text and hosted transcription rights.

- [ ] **Step 2: Update tracker rows without overstating approval**

  Add or update one row per contributing witness. Set `can_store`, `can_show_excerpts`, `can_embed`, `permission_needed`, and status from the evidence. Use `approved` only when commercial excerpt use and required attribution are resolved; otherwise use `staged_candidate` and do not draft quotations from it.

- [ ] **Step 3: Build the nine-row quotation ledger**

  Use these columns exactly:

  ```csv
  night,deity_focus,theme,work_id,sanskrit_source_url,translation_source_url,chapter_verse,devanagari,iast,translation,translator,edition_year,licence,attribution,ocr_proof,review_status,notes
  ```

  Select nine verified passages from the Devi Mahatmya litany or another cleared Shakta source. The intended themes are rooted beginning, devoted discipline, courageous calm, creative power, maternal care, resolute action, meeting fear, renewal/radiance, and completion/wisdom. A theme match is editorial framing, not a claim that the source prescribes the Navadurga night sequence.

- [ ] **Step 4: Verify ledger completeness**

  Run:

  ```powershell
  $rows = Import-Csv docs/navratri-2026/quotation-ledger.csv
  if ($rows.Count -ne 9) { throw "Expected 9 quotation rows" }
  $required = 'night','deity_focus','work_id','sanskrit_source_url','translation_source_url','chapter_verse','devanagari','iast','translation','translator','edition_year','licence','attribution','ocr_proof','review_status'
  foreach ($row in $rows) { foreach ($key in $required) { if ([string]::IsNullOrWhiteSpace($row.$key)) { throw "Missing $key on night $($row.night)" } } }
  ```

- [ ] **Step 5: Commit the evidence set**

  ```powershell
  git add -- docs/source_inventory_template.csv docs/navratri-2026/source-clearance.md docs/navratri-2026/quotation-ledger.csv
  git commit -m "docs(content): clear Navratri quotation sources"
  ```

### Task 2: Freeze the nine-night editorial outline and reviewer packet

**Files:**

- Create: `docs/navratri-2026/session-outline.md`
- Create: `docs/navratri-2026/reviewer-brief.md`
- Create: `docs/navratri-2026/review-log.csv`

**Interfaces:**

- Consumes: `quotation-ledger.csv`.
- Produces: one approved editorial brief used identically by all session writers and the human reviewer.

- [ ] **Step 1: Write the night-by-night outline**

  Give every night a title, deity focus, quotation-ledger row, one-sentence distinction between scripture and editorial theme, safe practice, single reflection purpose, estimated 8-12 minute duration, and at least one region/tradition contrast.

- [ ] **Step 2: Write the reviewer brief**

  Ask the reviewer to check Sanskrit, IAST, plain-English pronunciation, translation fidelity, Shakta framing, Navadurga convention, regional alternatives, safety, and category separation. State the required 20 September deadline and that approval must be attributable by name.

- [ ] **Step 3: Create the truthful review log**

  Use these columns:

  ```csv
  artifact,reviewer,expertise,sent_at,returned_at,status,findings_reference,resolved_at
  ```

  Add all nine sessions and eighteen audio targets with empty reviewer/timestamp fields and status `not_sent`.

- [ ] **Step 4: Self-audit universal claims**

  Run:

  ```powershell
  rg -n -i "all Hindus|Hindus (must|should|always)|the correct|the only way|universal" docs/navratri-2026
  ```

  Rewrite every unsupported universal claim; an explicitly rejected universal claim may remain if context is unambiguous.

- [ ] **Step 5: Commit the outline and packet**

  ```powershell
  git add -- docs/navratri-2026/session-outline.md docs/navratri-2026/reviewer-brief.md docs/navratri-2026/review-log.csv
  git commit -m "docs(content): outline nine Navratri sessions"
  ```

### Task 3: Draft nights 1-3 for Joint Gate 1

**Files:**

- Create: `content/challenges/navratri-2026/night-01.md`
- Create: `content/challenges/navratri-2026/night-02.md`
- Create: `content/challenges/navratri-2026/night-03.md`

**Interfaces:**

- Consumes: Tasks 1-2 ledgers and the existing `_template.md`.
- Produces: three complete `draft` sessions for the early Stream B render handoff.

- [ ] **Step 1: Copy exact quotation fields from ledger rows 1-3**

  Do not retype from memory. Keep `review_status: draft`, `reviewed_by: ""`, `licence: original`, and `can_embed: false`; put quotation-specific rights in each `Source` line.

- [ ] **Step 2: Draft original prose in all six sections**

  Keep Tonight to 2-4 sentences, Meaning to a plain explanation that labels scripture versus later practice, Practice optional and safe, Tradition notes concrete, and Reflection exactly one question.

- [ ] **Step 3: Read each Say-it line aloud**

  Use hyphenated syllables, doubled long vowels, no diacritics, and stress capitals. Record pronunciation uncertainties in `review-log.csv`; do not hide them.

- [ ] **Step 4: Validate without writing to Stream B-owned paths**

  Run with the bundled Node 22 runtime:

  ```powershell
  node --experimental-strip-types -e "import('./packages/content-tools/src/index.ts').then(async m=>{const r=await m.validateMarkdownCorpus('content'); if(r.invalidDocuments){console.error(r);process.exit(1)}; console.log(r)})"
  ```

  Expected: `invalidDocuments: 0`.

- [ ] **Step 5: Commit Joint Gate 1 drafts**

  ```powershell
  git add -- content/challenges/navratri-2026/night-01.md content/challenges/navratri-2026/night-02.md content/challenges/navratri-2026/night-03.md docs/navratri-2026/review-log.csv
  git commit -m "feat(content): draft Navratri nights one to three"
  ```

### Task 4: Draft nights 4-6

**Files:**

- Create: `content/challenges/navratri-2026/night-04.md`
- Create: `content/challenges/navratri-2026/night-05.md`
- Create: `content/challenges/navratri-2026/night-06.md`

**Interfaces:**

- Consumes: Tasks 1-2.
- Produces: three more complete `draft` sessions.

- [ ] **Step 1: Draft nights 4-6 from their ledger rows**

  Use Kushmanda, Skandamata, and Katyayani; do not turn maternal imagery into a universal gender role or warrior imagery into advice to confront danger.

- [ ] **Step 2: Audit category separation and variation**

  Ensure every file distinguishes source text, editorial explanation, living custom, and the optional practice. Name at least one alternative observance in every Tradition notes section.

- [ ] **Step 3: Run the source validator command from Task 3**

  Expected: `invalidDocuments: 0`.

- [ ] **Step 4: Commit nights 4-6**

  ```powershell
  git add -- content/challenges/navratri-2026/night-04.md content/challenges/navratri-2026/night-05.md content/challenges/navratri-2026/night-06.md
  git commit -m "feat(content): draft Navratri nights four to six"
  ```

### Task 5: Draft nights 7-9

**Files:**

- Create: `content/challenges/navratri-2026/night-07.md`
- Create: `content/challenges/navratri-2026/night-08.md`
- Create: `content/challenges/navratri-2026/night-09.md`

**Interfaces:**

- Consumes: Tasks 1-2.
- Produces: the complete nine-session draft set.

- [ ] **Step 1: Draft nights 7-9 from their ledger rows**

  Use Kalaratri, Mahagauri, and Siddhidatri. Explain darkness without equating dark skin with evil, purity without purity policing, and siddhi without promising supernatural outcomes.

- [ ] **Step 2: Audit endings and series continuity**

  Night 7 must not use fear as self-harm or medical guidance; Night 8 must frame renewal without moral contamination; Night 9 must explicitly close the nine-night journey without presenting the Navadurga sequence as universal.

- [ ] **Step 3: Run the source validator command from Task 3**

  Expected: `invalidDocuments: 0`.

- [ ] **Step 4: Commit nights 7-9**

  ```powershell
  git add -- content/challenges/navratri-2026/night-07.md content/challenges/navratri-2026/night-08.md content/challenges/navratri-2026/night-09.md
  git commit -m "feat(content): draft Navratri nights seven to nine"
  ```

### Task 6: Prepare and complete the human content review

**Files:**

- Modify: `docs/navratri-2026/review-log.csv`
- Modify after actual review: `content/challenges/navratri-2026/night-01.md` through `night-09.md`

**Interfaces:**

- Consumes: all nine drafts and reviewer brief.
- Produces: nine approved sessions with attributable review evidence.

- [ ] **Step 1: Assemble the review packet**

  Confirm the packet includes the nine session paths, quotation ledger, source-clearance note, and reviewer brief. Record `sent_at` only after the packet is actually sent.

- [ ] **Step 2: Apply returned findings exactly**

  Record each findings file or message reference, make corrections in the affected sessions, and retain `in_review` until all material findings are resolved.

- [ ] **Step 3: Mark actual approval**

  Only after sign-off, set `review_status: approved`, populate `reviewed_by` with the reviewer's real name, and complete `returned_at`, `status`, and `resolved_at` in the log.

- [ ] **Step 4: Validate the approved set**

  Run the source validator command from Task 3 and ask Stream B to run the official generator interface:

  ```powershell
  pnpm content:generate-challenge-seed -- --check
  ```

  Expected: zero invalid content and nine approved session rows in the generated bundle check.

- [ ] **Step 5: Commit reviewed content**

  ```powershell
  git add -- content/challenges/navratri-2026/night-*.md docs/navratri-2026/review-log.csv
  git commit -m "feat(content): approve nine Navratri sessions"
  ```

### Task 7: Produce the audio recording package

**Files:**

- Create: `content/audio/navratri-2026/README.md`
- Create: `content/audio/navratri-2026/manifest.csv`
- Create: `content/audio/navratri-2026/night-01-script.md` through `night-09-script.md`
- Add after real recording: `content/audio/navratri-2026/night-01-clear.wav` through `night-09-clear.wav`
- Add after real recording: `content/audio/navratri-2026/night-01-slow.wav` through `night-09-slow.wav`

**Interfaces:**

- Consumes: approved session quotation text.
- Produces: eighteen reviewed human recordings and a manifest Stream B can ingest.

- [ ] **Step 1: Write nine recording scripts**

  Each script contains the exact Devanagari and IAST, the approved Say-it line, a continuous-reading cue sheet, and a slow repeat-after-me segmentation with pauses marked in milliseconds.

- [ ] **Step 2: Create the manifest**

  Use:

  ```csv
  night,variant,file,source_session,reader,recorded_at,duration_seconds,reviewer,reviewed_at,status,notes
  ```

  Pre-create eighteen rows with status `script_ready`; leave human identity, timestamps, duration, and file blank until real evidence exists.

- [ ] **Step 3: Record clear and slow human passes**

  Record lossless mono WAV at 48 kHz/24-bit in a quiet room. Do not synthesize the voice or add devotional background music. Trim silence without cutting consonants or final vowels.

- [ ] **Step 4: Review against the approved text**

  A Sanskrit-capable human checks every word and repeat boundary. Update the manifest to `approved` only after review and record measured durations.

- [ ] **Step 5: Verify eighteen files and commit**

  ```powershell
  $rows = Import-Csv content/audio/navratri-2026/manifest.csv
  if ($rows.Count -ne 18) { throw "Expected 18 audio rows" }
  foreach ($row in $rows) { if ($row.status -eq 'approved' -and -not (Test-Path (Join-Path 'content/audio/navratri-2026' $row.file))) { throw "Missing $($row.file)" } }
  git add -- content/audio/navratri-2026
  git commit -m "feat(content): add reviewed Navratri pronunciation audio"
  ```

### Task 8: Build the qualified festival-date table and two pages

**Files:**

- Create: `docs/navratri-2026/festival-date-evidence.md`
- Create: `content/festivals/2026-london.csv`
- Create: `content/web/navratri-dates-2026-london.md`
- Create: `content/web/diwali-date-2026-london.md`

**Interfaces:**

- Consumes: location-specific primary panchang evidence.
- Produces: a machine-readable table and two reader-facing explanations of convention and disagreement.

- [ ] **Step 1: Record evidence for London, Europe/London**

  For each in-scope event, record Gregorian date, local start/end timing, DST offset, amanta/purnimanta label, observing community when relevant, source URL, and calculation metadata exposed by the source.

- [ ] **Step 2: Preserve disagreements as separate rows**

  Use these columns:

  ```csv
  festival,observance,date_local,start_local,end_local,timezone,utc_offset,location,reckoning,community,source,source_url,method_note,disagreement_group,review_status,reviewed_by
  ```

  When two sources differ, give them the same non-empty `disagreement_group`; never average or overwrite them.

- [ ] **Step 3: Draft the Navratri date page**

  Explain the London date range, why local tithi boundaries matter, the reckoning used, and how North Indian Navadurga sequencing differs from other regional structures. Do not generalize London's date worldwide.

- [ ] **Step 4: Draft the Diwali date page**

  State which night/observance the page calls Diwali, name location and reckoning, and distinguish Lakshmi Puja timing from the multi-day festival. Report source disagreement directly.

- [ ] **Step 5: Validate and commit**

  Run the source validator command from Task 3, then:

  ```powershell
  git add -- docs/navratri-2026/festival-date-evidence.md content/festivals/2026-london.csv content/web/navratri-dates-2026-london.md content/web/diwali-date-2026-london.md
  git commit -m "feat(content): add qualified 2026 festival dates"
  ```

### Task 9: Freeze the three explanatory pages for A5

**Files:**

- Modify: `content/web/what-can-i-eat-during-navratri.md`
- Modify: `content/web/how-to-do-lakshmi-puja-at-home.md`
- Modify: `content/web/what-to-say-when-lighting-a-diya.md`
- Create: `docs/navratri-2026/web-publication-ledger.csv`

**Interfaces:**

- Consumes: three existing founder-approved drafts from the Section 5 query list.
- Produces: three reviewed A5 pages plus two A4 pages tracked as a five-page publication set.

- [ ] **Step 1: Re-audit all three pages against v3 standing rules**

  Remove universal claims, distinguish practice from scripture, avoid unsafe fasting or ritual authority, and add citations only where a quotation or empirical claim requires one.

- [ ] **Step 2: Add cross-links and challenge calls to action in content metadata or prose**

  Link Navratri food to the Navratri date page, Lakshmi puja and diya guidance to the Diwali date page, and all three to the challenge without claiming that joining is religiously required.

- [ ] **Step 3: Create the truthful publication ledger**

  Use:

  ```csv
  slug,type,review_status,reviewed_by,live_url,published_at,search_console_submitted_at,index_status,last_checked_at,notes
  ```

  Add the three A5 pages and two A4 pages. Keep live fields empty until Stream B supplies working URLs and Search Console evidence.

- [ ] **Step 4: Validate and commit**

  Run the source validator command from Task 3, then commit the three pages and ledger.

### Task 10: Create six short-form video packages

**Files:**

- Create: `content/video/navratri-2026/README.md`
- Create: `content/video/navratri-2026/manifest.csv`
- Create: `content/video/navratri-2026/01-nine-forms-one-convention.md`
- Create: `content/video/navratri-2026/02-shailaputri-beginning-at-the-root.md`
- Create: `content/video/navratri-2026/03-chandraghanta-courage-and-calm.md`
- Create: `content/video/navratri-2026/04-kalaratri-darkness-is-not-evil.md`
- Create: `content/video/navratri-2026/05-mahagauri-renewal-not-purity-policing.md`
- Create: `content/video/navratri-2026/06-siddhidatri-what-completion-means.md`

**Interfaces:**

- Consumes: approved session and web-page claims.
- Produces: six 30-60 second packages ready for a human to film and post.

- [ ] **Step 1: Write the six scripts**

  Each file includes hook, spoken script, shot list, exact on-screen text, caption, alt-text/transcript, source note, no-AI-imagery check, and one measurable call to action.

- [ ] **Step 2: Apply the classification test**

  Label the short/episodic/one-idea format `DESIGNED`. Explicitly reject the borrowed transformation testimony as religiously inapplicable. Do not use bought social proof or imply a universal daily Hindu obligation.

- [ ] **Step 3: Create the posting manifest**

  Use:

  ```csv
  id,title,planned_date,platform,status,public_url,posted_at,campaign,views,profile_visits,link_clicks,signups,last_checked_at,notes
  ```

  Set planned dates so videos 1-3 precede 11 October and 4-6 run during 11-19 October. Keep execution fields empty until real platform evidence exists.

- [ ] **Step 4: Audit visuals and commit**

  Run `rg -n -i "AI art|AI-generated deity|stock deity|before and after|day 0|day 40" content/video/navratri-2026` and resolve every prohibited or misleading use before committing.

### Task 11: Prepare and execute the 30-action arrival test

**Files:**

- Create: `docs/navratri-2026/arrival-plan.md`
- Create: `docs/navratri-2026/community-rules.md`
- Create: `docs/navratri-2026/arrival-ledger.csv`
- Create: `docs/navratri-2026/outreach-copy.md`

**Interfaces:**

- Consumes: five web pages, challenge link, and six video packages.
- Produces: 30 discrete, attributable actions across search, festival spike, warm network, and short-form video.

- [ ] **Step 1: Define exactly 30 actions**

  Allocate 8 explanatory-search actions, 6 festival-spike actions, 10 warm-network-to-stranger actions, and 6 video posts. Every row has a unique campaign code and a concrete asset/audience.

- [ ] **Step 2: Record self-promotion rules before outreach**

  For every named community, temple, newsletter, or group, save the public rule URL, date checked, permitted contact route, whether moderator approval is required, and prohibited behavior. Remove targets whose rules cannot be verified.

- [ ] **Step 3: Write channel-specific outreach copy**

  Prepare concise moderator-first messages, temple/newsletter notes, family-forward copy that asks contacts to reach strangers rather than enroll themselves, and page/video captions. Do not fabricate endorsements or scarcity.

- [ ] **Step 4: Create the arrival ledger**

  Use:

  ```csv
  id,channel,action,audience,rule_url,asset,campaign,status,owner,executed_at,evidence_url,visitors,signups,paid_joins,last_checked_at,notes
  ```

  Status values are `planned`, `prepared`, `approval_requested`, `executed`, or `rejected`. No row becomes `executed` without evidence.

- [ ] **Step 5: Execute only with the relevant account authority**

  Publish/search-submit through Stream B, post videos through the owner's accounts, and send outreach through the owner's identity. Update metrics from analytics using the named campaign. Account-less local preparation is not execution.

- [ ] **Step 6: Commit the plan and each evidence update**

  Commit prepared materials first. Commit evidence/metric updates separately so the audit trail shows when actions genuinely happened.

### Task 12: Run the A1-A8 completion audit

**Files:**

- Create: `docs/navratri-2026/completion-audit.md`
- Modify: `docs/03-progress.md`

**Interfaces:**

- Consumes: every artifact and external evidence from Tasks 1-11.
- Produces: a requirement-by-requirement proof record; it does not redefine incomplete items as complete.

- [ ] **Step 1: Inventory artifacts and statuses**

  Count nine sessions, eighteen approved audio rows/files, the date table, five counted web pages, six video packages/posts, and thirty arrival actions.

- [ ] **Step 2: Verify content and prohibited patterns**

  Run:

  ```powershell
  node --experimental-strip-types -e "import('./packages/content-tools/src/index.ts').then(async m=>{const r=await m.validateMarkdownCorpus('content'); console.log(r); if(r.invalidDocuments)process.exit(1)})"
  $prohibitedBrand = @('Dharma', 'Daily') -join ' '
  rg -n -i $prohibitedBrand content docs/navratri-2026
  rg -n -i "AI-generated deity|Ask Krishna|all Hindus|Hindus must|Hindus always" content docs/navratri-2026
  git diff --check
  ```

  Investigate every hit; do not assume a grep hit is harmless or a clean grep proves substantive correctness.

- [ ] **Step 3: Verify evidence-backed states**

  Cross-check every `approved`, `published`, `posted`, and `executed` row against reviewer identity, local file, URL, timestamp, or account evidence. Downgrade any unsupported state.

- [ ] **Step 4: Ask Stream B to verify the frozen interface**

  Require evidence that three sessions render on a real device for Joint Gate 1 and all nine are present in the generated bundle without schema changes. Lane A records the evidence URL/commit but does not edit Stream B files.

- [ ] **Step 5: Update progress truthfully and commit the audit**

  Mark each A1-A8 item complete, incomplete, or externally blocked with its proof. Only claim Lane A complete when every required row is proven.

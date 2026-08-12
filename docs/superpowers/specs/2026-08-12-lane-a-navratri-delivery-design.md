# Lane A Navratri delivery design

**Date:** 12 August 2026

**Plan of record:** `02-plan.md` v3

**Scope:** Stream A deliverables A1-A8 only

## Outcome

Lane A will deliver a reviewable, rights-cleared content package for *Navratri: Nine Nights*: nine dated sessions, pronunciation and audio recording materials, a defensible festival-date reference, five web pages in total, six short-form video packages, and an arrival-action ledger. Application code, packages, Supabase, deployment, payment, and publishing infrastructure remain Stream B territory.

The work is not complete merely when files exist. Every quotation must have a source and named translator, every session must pass the frozen six-section contract, variation must be substantive rather than boilerplate, and all claims of review, recording, publication, posting, outreach, or arrival must be backed by evidence.

## Chosen approach

### Source-first production

Clear a Sanskrit witness and a named public-domain English translation before drafting the nine session files. Create a quotation ledger that records the exact passage, edition, translator, URL, rights basis, transcription/proofing state, and intended session. Draft only from that ledger.

This is preferred over two alternatives:

1. **Outline-first with provisional quotations** is faster initially but risks rewriting all pronunciation, meaning, audio, and citations when a source fails review.
2. **Quote-free sessions** avoid the rights issue but fail the frozen `challenge_session` requirement that every session contain a five-label shloka block.

The likely translation candidate is Manmatha Nath Dutt's 1896 *Markandeya Puranam* extract covering the Devi Mahatmya, but it remains a candidate until publication, jurisdiction, OCR, section-boundary, and attribution evidence are recorded in the tracker. No modern online translation or SanskritDocuments transcription will be copied into the paid challenge without permission.

## Content architecture

### A1, A3, and A8: nine sessions as one controlled set

Each file will be `content/challenges/navratri-2026/night-NN.md` and will preserve the frozen order:

1. Tonight
2. Shloka
3. Meaning
4. Practice
5. Tradition notes
6. Reflection

Every shloka block will include Devanagari, IAST, plain-English "Say it", an attributed translation, and a source line. Devanagari and IAST will be copied or deterministically derived from the cleared witness and proofed against it; they will never be supplied from memory. "Say it" will use ordinary English sound spelling, doubled long vowels, syllable hyphens, and stress capitals, then be read aloud and reviewed.

The nine-form sequence will be explicitly labelled as a widely followed North Indian Shakta Navadurga convention. Every `Tradition notes` section will name at least one relevant contrast: Bengali Durga Puja, Gujarati garba/dandiya practice, South Indian golu and Saraswati/Lakshmi emphases, Karnataka Dasara, or the three-sets-of-three Durga-Lakshmi-Saraswati pattern. Differences will be matched to the night's subject rather than pasted as a standard disclaimer.

Practices will be small, optional, safe, non-prescriptive, and achievable without ritual equipment. Sessions will not claim priestly authority or universal Hindu practice. Each will state an estimated duration and end with one reflection question; the app's endowed-progress and explicit completion treatment are Stream B responsibilities.

All prose stays `review_status: draft` until a named human reviewer signs off. Existing blanket founder approval is not treated as specialist Shakta review unless the founder explicitly assumes that role and the record says so. Approval evidence will name the reviewer and date; unresolved comments keep the file out of the approved seed.

### A2: audio package

For each night, Lane A will prepare two human-recording scripts from the approved text:

- a clear continuous reading;
- a slow repeat-after-me pass, broken at natural phonetic boundaries.

The manifest will record reader, reviewer, recording date, source session, duration, filename, and review state. A human Sanskrit-capable reader/reviewer must validate pronunciation before audio is marked approved. Synthetic or unreviewed speech cannot satisfy the pronunciation claim. Adjustable playback speed is a Stream B implementation decision.

### A4: festival-date table and two date pages

The table will cover only festivals the pilot actually discusses. Every dated record will state:

- Gregorian date and relevant local timing;
- location and timezone, including DST;
- amanta or purnimanta reckoning;
- observing community wherever dates split;
- source and calculation method available from that source;
- disagreements as parallel evidence, never silently resolved.

The initial location is London, UK, matching the repository timezone and target-market work, unless the product owner supplies a different launch location before publication. Dates will not be generalized worldwide. The two pages will answer a genuine disagreement or convention question, not merely repeat a bare date.

### A5: explanatory web pages

Three explanatory pages will be selected from the Section 5 query list after checking existing approved drafts and avoiding duplication with the two A4 date pages. Pages will be static, in-house prose, tradition-qualified, and quotation-free unless a source has passed A8. Each page will carry review metadata and a clear reader question it answers.

Hosting, domain configuration, and Search Console verification are Stream B/external-account dependencies. Lane A will supply publish-ready markdown, metadata, and a submission ledger; it will record publication only after receiving a live URL.

### A6: six short-form video packages

Each package will contain a 30-60 second script, opening hook, shot list, on-screen text, caption, accessibility transcript, source note, and posting slot. The format is **DESIGNED**: short, episodic, one idea per video. The transformation-testimony narrative is rejected because it does not transfer religiously to an annual observance.

No AI-generated deity or devotional imagery will be produced. Visuals may use the speaker, typography, licensed footage, objects photographed accurately, or work supplied by a named human artist. A package is marked posted only with platform, URL, timestamp, and channel attribution evidence; three must be posted before 11 October.

### A7: arrival actions and attribution

The arrival ledger will enumerate every Section 5 action across all four channels. Each row will record owner, audience/community, self-promotion rule, planned asset, execution timestamp, public URL or private evidence reference, campaign/UTM identifier where possible, arrivals, signups, paid joins, and notes. Zero arrivals are valid data; unexecuted actions are not.

Lane A may prepare pages, copy, contact lists, and messages locally. Sending email, posting to communities, publishing videos, Search Console submission, and analytics readout require the relevant account or a user-performed action. Those rows remain `prepared`, not `executed`, until evidence exists.

## Data flow and boundaries

```text
rights evidence -> quotation ledger -> night markdown -> content validation
                                      -> audio scripts/manifest
                                      -> video scripts/source notes

calendar evidence -> festival table -> two date pages
query/channel audit -> three explanatory pages + arrival ledger
```

Lane A owns edits under `content/**` and `docs/**`. It will not edit `apps/**`, `packages/**`, or `supabase/**`. It may read the frozen schema and generator and may run read-only validation. Generated artifacts that write into Stream B paths will be handed off or produced by Stream B through the agreed generator interface.

## Failure handling

- **Rights evidence insufficient:** do not quote; keep the candidate out of approved status and source another edition.
- **OCR or verse numbering uncertain:** compare against page images and an independent Sanskrit witness; preserve the uncertainty in the ledger until a reviewer resolves it.
- **Tradition claim uncertain:** label it as living practice, identify region/community, or remove it.
- **Date sources disagree:** publish both positions with their locations/methods; do not choose silently.
- **Human review unavailable:** complete draft materials and reviewer packet, but do not mark sessions or audio approved.
- **External account unavailable:** finish publish/send-ready assets and retain truthful `prepared` status.
- **Validation tooling would write to Stream B-owned paths:** stop at the boundary and request the agreed generator/validation handoff rather than editing those paths.

## Verification and completion evidence

A1-A8 are complete only when all of the following are proven:

- nine uniquely numbered session files exist and contain the six sections in order;
- every session has all five shloka labels, real Devanagari, reviewed IAST and pronunciation, named translator/edition/licence/URL, and `can_embed: false`;
- all nine are approved by a named human reviewer and the validator reports zero invalid files;
- eighteen approved audio files exist (clear and slow), match the text, and are listed in the manifest;
- the festival table and two date pages carry location, timezone, reckoning, community, sources, and disagreements;
- three additional explanatory pages are approved and live URLs are recorded;
- six video packages exist and posting evidence exists for all six, including three before 11 October;
- every Section 5 arrival action has execution evidence and arrivals are attributed by named channel;
- the rights tracker explicitly clears every quoted source for storage, excerpt display, and the intended commercial use;
- no user-visible prohibited competitor-brand string or AI-generated devotional image appears in Lane A artifacts.

## Delivery order

1. Rights evidence and quotation ledger.
2. Nine-night outline and reviewer brief.
3. Sessions 1-3, then an interface handoff for Joint Gate 1.
4. Sessions 4-9 and reviewer corrections.
5. Audio scripts, recording, and review.
6. Festival table plus two date pages.
7. Three explanatory pages.
8. Six video packages and posting.
9. Arrival execution and attribution audit.
10. Requirement-by-requirement completion audit.

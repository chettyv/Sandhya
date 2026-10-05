# Private corpus handoff — 5 October 2026

The user requested that all current work be pushed with notes so collection can continue on another PC. The repository is private: `chettyv/Sandhya`. Application code and documentation travel through Git; the much larger private source collection travels through the repository's private release assets. Do not add the database or raw scans to ordinary Git history.

## Restore on the other PC

Sign into the same GitHub account using Git Credential Manager. Clone this private repository, or pull its `main` branch. Install Python 3.10 or newer and run these commands from the repository directory (on Windows, use `py` instead of `python` if necessary):

```powershell
git pull --ff-only origin main
python -m pip install -r scripts/private-corpus/requirements.txt
python scripts/private-corpus/restore.py
```

The restore command downloads the release `private-corpus-2026-10-05`, checks its manifest against the committed transfer receipt, verifies every downloaded part, then reconstructs and hashes every source file. It checks the restored database's counts and acquisition checksum. Existing identical files are accepted; changed files are preserved and cause the restore to stop. Rerunning resumes from already verified downloads and files. GitHub credentials remain in memory and are never included in the archive.

The collection environment was Python 3.12.14 on Windows AMD64; observed package versions are in `docs/content/private-corpus-collection-environment.json`. The requirements above are sufficient for transfer. Install additional packages only when the next collection script needs them. The source-page renderer uses PyMuPDF (working version 1.28.2); existing JPEG previews through PDF page 320 can be reused immediately. OCR binaries and failed handwriting model environments are not included.

Allow roughly 85 GB of free disk space for the compressed downloads, restored collection and working room. The download cache is under `content/_staging/transfer/private-corpus-2026-10-05/`. After a successful restore it can be removed to reclaim space. Keep the restored `content/_staging/raw/` tree: it contains the actual database, scans, source extractions, scripts and evidence.

Read these restored files first, in order:

1. `content/_staging/raw/english/source-review-2026-10-02/continuation-checkpoint.md` — latest instructions and historical checkpoints.
2. `content/_staging/raw/english/source-review-2026-10-02/private-corpus/remaining-actual-text-gaps.md` — known missing actual texts.
3. `content/_staging/raw/english/source-review-2026-10-02/private-corpus/acquisition-scope-checkpoint.json` — per-work acquisition scope.
4. `content/_staging/raw/english/source-review-2026-10-02/private-corpus/README.md` — database queries and limitations.

## Frozen collection state

After restoring, paste this into a new chat on the other PC:

> Continue private scripture collection from `docs/content/private-corpus-handoff.md`. Work on Sandhya as one unified project; prior Stream A/B ownership assignments do not apply to this task. Read the restored continuation checkpoint, current gap ledger and acquisition scope before collecting. Prioritize actual existing English scripture bodies, preserve existing other languages, and store actual text in the private corpus database. Do not generate new translations, embeddings, audio or app content, and do not publish the corpus. Resume with Kiraṇa Kriyāpāda chapter 10, source PDF page 306. Preserve source omissions, uncertain readings and exact byte/hash evidence. Do not claim the whole corpus is complete.

The private SQLite database contains actual scripture bodies, rather than just links. Its path is `content/_staging/raw/english/source-review-2026-10-02/private-corpus/corpus.sqlite`.

| Measurement                      |  Frozen value |
| -------------------------------- | ------------: |
| Non-empty stored bodies          |     1,238,178 |
| Documents                        |        12,473 |
| Full PDF assets stored in SQLite |           171 |
| PDF asset bytes in SQLite        | 6,936,025,803 |
| SQLite file bytes                | 9,782,632,448 |

Database SHA256: `53c623871d22e8e470ec4b44c9875098a4f38960951cbc6c88c3b1cbafb16302`.

The frozen transfer contains **93,525 files**, totaling **41,044,795,013 source/evidence bytes**. Its compressed archive is **31,915,654,986 bytes**, split into **60 parts**. Two additional release assets hold the archive manifest and individual-file checksum manifest.

Full archive verification passed: every part and every decompressed file matched its size and SHA256; the database matched its acquisition receipt and its read-only body/document/PDF-asset counts. The evidence is `docs/content/private-corpus-archive-verification.json`. Historical absolute paths in source receipts remain provenance; use the repo-relative paths above on the new PC. Storage integrity does not certify every source's OCR, translation fidelity or completeness.

Counts overlap sources, editions, page/chapter/verse granularity and collector headers. They do not represent unique verses or a complete Hindu canon. English has priority; existing Hindi, Sanskrit, French, Italian, Bengali and Tamil source material is preserved. No new translations, embeddings, application import or publication were performed during collection.

The archive preserves actual collected source files and working evidence. It excludes nested Git internals, installed dependency environments, downloaded handwriting model caches, Python bytecode caches, symlinks and secret `.env` files. The model trials and rejection evidence remain included. The archive manifest lists each exclusion and each included file's exact byte count and SHA256. Dependencies can be installed on the other PC; credentials must be supplied there independently.

## Exact next collection step

Kiraṇa Āgama is the current concrete recovery task. Original source: `himalayan-agama-books/kirana-agama/source.pdf` within the restored collection (761 scan pages; already SQLite PDF asset 117).

- Vidyāpāda English chapters 1–12 are present across the Goodall and Sabharathnam editions. Ramakaṇṭha commentary 7–12 remains missing.
- Kriyāpāda existing English chapters 1–8 and chapter 9's existing summaries/selected translations were stored as documents 12465–12473. Latest focused checks passed for exact file/body/metadata/import checksums, FTS text, the original PDF BLOB and foreign keys.
- Chapter 9 is **not a complete detailed English verse translation**. Its translator explicitly declines that in the source. The English `69(b)` versus Sanskrit `64(b)` address discrepancy remains recorded. Chapter 1 lacks English 3(b)–5; chapter 4 has a clipped English odour-list continuation. Do not fill these by inventing text.
- **Next: Kriyāpāda chapter 10, Dīkṣāpaṭalaḥ**, beginning scan PDF page **306**, handwritten page **303**. The opening was inspected; no chapter-10 body has been imported, and its ending boundary has not been determined. Existing preview JPEGs extend through PDF page 320.
- Still open: Kriyāpāda 10–18, Caryāpāda 1–27, Yogapāda 1–7, the recorded English omissions and later commentary.

Handwriting OCR trials with small/base TrOCR made substantive errors and were rejected. Their output was not imported. Continue source inspection and faithful transcription of the existing English, or acquire a reliable typed edition; do not treat failed OCR as verified scripture. Recorder scripts for already imported chapters refuse to rewrite them. Preserve CRLF-sensitive hashes and metadata-only repair audits.

Other substantial gaps remain: full Bhaviṣya English beyond acquired portions; Jaiminīya Brāhmaṇa II–III; Kashyap's complete Taittirīya Brāhmaṇa editions and unresolved sections; minor Sāmaveda texts; Kāṭha Āraṇyaka English/German access; later Matanga English; full Ajita English volumes; Shivadr̥ṣṭi chapter 4's published English body and unestablished 5–7 English sources. Consult the full gap ledger before assuming a work is absent or complete.

The installed `bugsum/vedic-shastra-api` has no supplied scripture dataset: the database had zero records and the endpoint returned HTTP 200 with `[]`. Its code is preserved, but it is not a source of scripture bodies. Context.dev setup/discovery benefits are documented in the restored `source-review.md`; it was not connected or necessary for the acquisitions made so far.

## Continuation authorization and boundaries

The user's pasted attachment explicitly superseded Stream A/B ownership boundaries. Later instructions authorized collecting actual existing texts, keeping other languages, installing tools and pushing this handoff. This collection remains private and incomplete. The repository's publication/content safeguards still apply if app content is authored or released later. Do not re-enable cut pilot features or treat this archive as publication/embedding clearance. Do not contact source owners or incur paid API costs without a specific need and authorization.

The original pasted audit request is preserved in `docs/content/original-corpus-audit-request.txt`, so the old PC's `.codex/attachments/` path is unnecessary. Its original read-only audit scope was superseded by the user's later collection and push requests; preserve the distinction when resuming.

Collection jobs were stopped at this checkpoint. Transfer packaging/upload jobs are separate; the committed `private-corpus-transfer.json` records whether all release assets were verified. Read its `complete` field before assuming the other PC can restore everything.

## Maintainer transfer commands

```powershell
python scripts/private-corpus/pack.py
git push origin main
python scripts/private-corpus/upload_parallel.py
```

Packing refuses a non-empty output directory and never changes source files. Uploading resumes by release asset name, verifies GitHub's remote SHA256 for every asset and only publishes the private release after the entire set passes. The parallel coordinator resolves and saves one draft-release ID before starting workers, because the tag endpoint does not return drafts. Preserve the local archive until the committed transfer receipt confirms success. No force push is used.

Transfer validation: focused tests passed for split-archive round trips, Unicode/CRLF byte preservation, corrupted-file rejection, unsafe-path rejection and protection of changed local files. The repository's `lint-staged` formatting and secret checks passed. The Git Bash hook could not find the installed `pnpm` command, so the same checks were run through its installed Node entry point before committing. No application code changed in this handoff.

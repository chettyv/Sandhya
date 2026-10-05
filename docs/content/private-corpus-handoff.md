# Private corpus handoff — 5 October 2026

The user requested that all current work be pushed with notes so collection can continue on another PC. The repository is private: `chettyv/Sandhya`. Application code and documentation travel through Git; the much larger private source collection travels through the repository's private release assets. Do not add the database or raw scans to ordinary Git history.

**Transfer complete.** All 60 archive parts and both manifests passed GitHub's remote SHA256/size checks. Real authenticated downloads of both manifests and the final data part also passed through the same helper used by the restore command. The private release is [private-corpus-2026-10-05](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05). The committed `private-corpus-transfer.json` contains the verified completion receipt and expected manifest checksum. This completes the transfer of collected work; the scripture collection itself still has the gaps below.

**Latest resume point:** chapters10–13 were subsequently captured and imported. Read [private-corpus-latest-resume.md](private-corpus-latest-resume.md) and apply the10–12 update below, followed by its chapter13 update instructions. The next collection chapter is Kriyāpāda14, source PDF page350. The frozen base and older supplements remain unchanged.

## Restore on the other PC

Sign into the same GitHub account using Git Credential Manager. Clone this private repository, or pull its `main` branch. Install Python 3.10 or newer and run these commands from the repository directory (on Windows, use `py` instead of `python` if necessary):

```powershell
git pull --ff-only origin main
python -m pip install -r scripts/private-corpus/requirements.txt
python scripts/private-corpus/restore.py
```

Then restore the verified preview supplement, which contains the 74 images generated after the main snapshot (about 11 MB compressed):

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-preview-supplement --directory content/_staging/transfer/private-corpus-2026-10-05-preview-supplement --manifest-sha256 92d82884f4b5826d7d14d2ed2d4dc312734a440279d96ae3083636737402aac4
```

The supplement is a separate [private release](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-preview-supplement). Its receipt is `docs/content/private-corpus-preview-transfer.json`. The existing 93,525 source files had no detected changes or deletions: all sizes matched, and files modified after the main archive timestamp were also hash-checked. The supplement adds previews only; it does not change the frozen database. All 74 archived preview hashes and all three uploaded asset hashes were verified.

Finally, restore the [Kriyāpāda 10–12 body update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-kriya10-12), then append its existing English to the private database. This update is about 1.7 MB compressed and contains 29 text/evidence/script/crop files; it avoids downloading another entire database. Its receipt is `docs/content/private-corpus-kriya10-12-transfer.json`.

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-kriya10-12 --directory content/_staging/transfer/private-corpus-2026-10-05-kriya10-12 --manifest-sha256 e3f24c8257bbf81f512a6765425044714867430e354bfed76b532e6223a82235
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_chapter.py" --chapter 10
python "$corpusRoot/append_kirana_source_chapter.py" --chapter 11
python "$corpusRoot/append_kirana_source_chapter.py" --chapter 12
python "$corpusRoot/verify_kirana_current_checkpoint.py"
python "$corpusRoot/refresh_post_handoff_checkpoint.py"
```

Stop if a command reports an error. The append commands accept identical existing imports and refuse a changed imported file. They passed a rerun with no duplicate bodies added. Verification checks actual database text, metadata, FTS, source PDF bytes and foreign keys. The checkpoint refresher hashes the current database, preserves the frozen receipt and updates the local notes/ledger. Do not rerun the evidence recorder scripts after import. Full scripture coverage and linguistic fidelity are still incomplete.

These steps restore a fresh PC from the frozen baseline. If you already restored that baseline, skip its download and apply only missing supplements. After appending bodies or collecting more material, do not restore the frozen database over the working database: the restore command intentionally rejects that overwrite.

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

> Continue private scripture collection from `docs/content/private-corpus-handoff.md` and `docs/content/private-corpus-latest-resume.md`. Work on Sandhya as one unified project; prior Stream A/B assignments do not apply. Restore the base and all supplements, replay the actual body imports and run the latest verification/checkpoint scripts. Read the current gap ledger before collecting. Prioritize actual existing English scripture bodies and preserve other languages. Resume with Kiraṇa Kriyāpāda chapter 14, source PDF page 350. Preserve source omissions, uncertain readings and exact byte/hash evidence. Do not generate translations, embeddings, audio or app content, publish the corpus, or claim full completeness.

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
- **At this frozen snapshot:** Kriyāpāda chapter 10, Dīkṣāpaṭalaḥ, began scan PDF page **306**, handwritten page **303**. Its ending had not yet been determined and previews extended through page 320. **Later inspection located the ending on PDF page 330 and generated previews through page 390**, preserved in the supplement. No chapter-10 body has been imported. Read `private-corpus-latest-resume.md` for the precise next inspection steps.
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

# Latest private corpus resume notes — 5 October 2026

Read this after `private-corpus-handoff.md`. All older archives remain frozen. The latest update adds **Caryāpāda1's surviving existing English**. Restore the base, preview supplement,10–12, chapter13,14–16, resume and17–18 updates before applying Caryāpāda1, replaying body append commands in order.

## Latest addition: Caryāpāda1, partial source capture

Chapter1, **Samayācāravidhi-paṭalaḥ**, is document **12483**, body **1238188**: **11,924 stored characters**, **14 source groups**, including an unnumbered partial continuation. All **16** PDF pages **384–399** were inspected; **14** contain English, with copyrightPDF388 and continuation-titlePDF389 excluded from scripture text. The English ends at source label **41**, with the first-chapter colophon onPDF399. The next chapter startsPDF400/handwritten396.

**A source gap remains:** PDF392 is handwritten387; PDF393 is handwritten389 and begins with an unnumbered continuation. The beginning and expected intervening20–23 heading are absent in this observed sequence. A misplaced page or numbering error elsewhere has not been ruled out. No missing text or certain verse address was invented. The PDF/handwritten offset changes across front matter and the numbering gap; use the explicit page map. Unfinished `tooth-brus`, `mad`, `engag`, uncertain readings/corrections and the unclosed colophon are marked. Source grammar, classifications, quantities and historical prescriptions are retained as quotation, with no new translation or authored practice guide. This is **not a complete English chapter** or linguistic fidelity certification.

Exact raw-file/body/import/metadata/FTS, original PDF asset117 BLOB, preview hashes and foreign-key checks passed for all18 Kriyāpāda captures plus Caryāpāda1. A repeat import added no duplicate. Combined capture totals: **173,588 characters**, **223 inspected source pages**, **185 groups**. Earlier Kriyāpāda omissions, chapter9 summaries and uncertainties remain.

Current private database: **1,238,188 bodies**, **12,483 documents**, **171 PDF assets**,9,782,632,448 bytes. Local SHA256: `69d4404edc82b91957bf33ab23fcbfa4705cfdeb9642ce28f7d7df2197ec9995`. Counts overlap editions/granularities and do not prove a complete canon.

The [Caryāpāda1 update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-carya01) contains33 new body/evidence/script/preview files. All three uploaded asset checksums passed. A fresh authenticated download and decompression verified all33 individual file checksums. The committed receipt is `private-corpus-carya01-transfer.json`. After preceding updates, run:

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-carya01 --directory content/_staging/transfer/private-corpus-2026-10-05-carya01 --manifest-sha256 a928a3f54c2f9c537646d41a0c3567827a4b457740c0e96d23d355e4e1469187
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya01.py" --chapter 1
python "$corpusRoot/verify_kirana_carya01_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya01_checkpoint.py"
```

Stop on errors and preserve frozen receipts and sealed releases. Do not rerun evidence recorders after import, or older checkpoint writers against the expanded state. Regenerate the local receipt after replay; physical SQLite hashes can vary by runtime, so verify exact body/metadata/FTS too. Earlier checkpoints below are historical.

The final transfer inventory accounts for **93,742 source files** across the eight private releases, with **zero unarchived source paths**. The expanded database and current working notes are reconstructed by the verified append/refresher commands. The historical chapter1–16 report's exact current bytes are preserved in the resume snapshot. This inventory compared paths, sizes and modification times, hashing six changed non-database candidates; it builds on the earlier complete archive checks rather than claiming a fresh hash of all40GB. Runtime caches, environments and credentials are excluded.

Next recovery: **Caryāpāda2, Sarasvatīpūjāvidhih**, PDF **400**, handwritten **396**. Its opening is inspected; ending unestablished and no body imported. Caryāpāda2–27, Yogapāda1–7, Ramakaṇṭha7–12, source-English omissions/uncertainties and broader ledger gaps remain open. The collection goal remains active.

## Previous addition: chapters17–18

| Chapter | Source title             | PDF pages | Final label | Document | Stored characters |
| ------- | ------------------------ | --------- | ----------- | -------- | ----------------: |
| 17      | Grahayāgavidhih          | 367–372   | 15½         | 12481    |             4,349 |
| 18      | Brahmāṃsādilakṣaṇavidhih | 373–383   | 32          | 12482    |             9,324 |

These are two existing human English bodies, **13,673 characters**, **17 inspected pages**, **15 source groups** and both English colophons. PDF383 explicitly states “Here ends the Kriyapada.” Unfinished `libera`/`appearan`, uncertain `kumda`/`pimda` group-name readings and unresolved source marks remain explicit. Spelling, grammar, corrections and historical classifications are preserved as source quotation. No new translation was made. Full diplomatic transcription, Indic typography and Sanskrit fidelity remain unverified.

All **18** Kriyāpāda captures passed exact file/body/import/metadata/FTS, original asset117 PDF BLOB and foreign-key checks; the new preview hashes also passed. Repeating17–18 added no duplicate. Cumulative totals: **161,664 stored characters**, **207 inspected pages**, **171 source groups**. Chapter9 still contains summaries/selected translations, and chapter1/4 omissions and earlier uncertainties remain open. The section ending does not prove complete verse-by-verse English.

Current private database: **1,238,187 bodies**, **12,482 documents**, **171 PDF assets**,9,782,632,448 bytes. Local SHA256: `3703e9c99d4dc4c588008f85132f2027747fdd2302b476ab888ebaec53d214d0`. Overlapping editions and granularities prevent treating those counts as unique verses or a complete canon.

The [17–18 update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-kriya17-18) contains17 new body/evidence/script/detail-crop files, about0.35 MB compressed. Manifest SHA256: `e038b87597410b45bc23cb2af73f352e90d3429e07eecb15cbe5679e38b791e6`. After preceding updates, run:

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-kriya17-18 --directory content/_staging/transfer/private-corpus-2026-10-05-kriya17-18 --manifest-sha256 e038b87597410b45bc23cb2af73f352e90d3429e07eecb15cbe5679e38b791e6
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_chapter17_18.py" --chapter 17
python "$corpusRoot/append_kirana_source_chapter17_18.py" --chapter 18
python "$corpusRoot/verify_kirana_checkpoint18.py"
python "$corpusRoot/refresh_kirana_checkpoint18.py"
```

Stop on errors. Preserve frozen receipts and older release files. Do not rerun imported evidence recorders or older checkpoint writers against the expanded database. Locally regenerate the receipt after replay; physical SQLite hashes can vary by runtime, so exact body/metadata/FTS checks matter too. The earlier resume frontier and snapshots below are historical.

All three uploaded asset hashes passed verification, followed by a fresh authenticated download, decompression and checksum check of all17 archived files. The completed transfer receipt is `private-corpus-kriya17-18-transfer.json`.

Next recovery: **Caryāpāda1, Samayācāravidhi-paṭalaḥ**, beginning PDF **384**, handwritten **381**. Its opening is inspected; ending unestablished and no Caryāpāda1 body imported. Caryāpāda1–27, Yogapāda1–7, Ramakaṇṭha commentary7–12, earlier source-English omissions/uncertainties and the broader ledger gaps remain open. The collection goal remains active.

## Previous stopping point before17–18

After applying all body updates below, also restore the [resume supplement](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-resume). It contains twelve newer reading images, the frozen database receipt, explicit work-in-progress notes and separate snapshots of the latest checkpoint files. Chapters17–18 have been inspected but **have no imported English bodies**. This supplement adds no database rows and requires no append command.

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-resume --directory content/_staging/transfer/private-corpus-2026-10-05-resume --manifest-sha256 8a1101875ddb7a4f70854d63439edead52a46a2b82f13826c34dc98a12e95b69
```

Read the restored `content/_staging/raw/english/source-review-2026-10-02/handoff-2026-10-05-frontier/collection-frontier.md` next. It records chapter17's PDF367–372 boundary, chapter18's PDF373–383 boundary and explicit end of Kriyāpāda, unresolved readings, and the next Caryāpāda opening at PDF384. First transcribe and import the existing English for17–18; the inspected images are not stored scripture bodies. Preserve earlier omissions and chapter9's summaries.

Checkpoint snapshots are archived under `handoff-2026-10-05-frontier/checkpoint-snapshot/` so restore never overwrites your working database or regenerated notes. Keep them as evidence; use the chapter16 refresher after the preceding database replay to produce current working notes. The next collector should update the ledger when creating the actual17–18 captures. Full corpus acquisition remains unfinished.

**Resume transfer verified:** all three uploaded asset hashes passed, followed by a fresh authenticated download, decompression and checksum check of all21 archived files (about3.5 MB compressed). The completion and current-file coverage receipt is `private-corpus-resume-transfer.json`. The six releases together cover the collected source tree; current database changes travel through verified body replay and mutable checkpoint notes also have exact separate snapshots. Runtime caches, nested Git directories and secret environment files are excluded. The database verification was rerun successfully before the final handoff.

## Previous addition: chapters14–16

| Chapter | Source title    | PDF pages | Final label | Document | Stored characters |
| ------- | --------------- | --------- | ----------- | -------- | ----------------: |
| 14      | Gaṇayāgavidhih  | 350–353   | 10½         | 12478    |             3,588 |
| 15      | Abhiṣekavidhih  | 354–361   | 20          | 12479    |             5,478 |
| 16      | Gaurīyāgavidhih | 362–366   | 11          | 12480    |             3,580 |

These are three actual existing English bodies: **12,646 characters**, **17 inspected source pages**, **16 source groups** and the three English colophons. Sabharathnam's source corrections are retained. Unfinished `leng` and `conch-sha`, an unresolved marginal insertion, the question-marked `loins` correction and the unclosed chapter16 colophon are explicit. Full diplomatic transcription, Indic typography and Sanskrit fidelity are not certified. No new translation was made.

All **16** Kriyāpāda captures passed exact file/body/import/metadata/FTS checks, original PDF asset117 BLOB verification and foreign-key checks. Replaying the three new imports added no duplicates. Cumulative totals: **147,991 stored characters**, **190 inspected source pages**, **156 groups**. Chapter9 remains source summaries only, and chapter1/4 source-English omissions remain open.

Current database: **1,238,185 bodies**, **12,480 documents**, **171 PDF assets**, 9,782,632,448 bytes; local SHA256 `1ca98ea36a31d8e8bd379e02f21f3c5db2c793724e54df257bfbf52e575c4c06`. Overlapping editions, granularities and headers prevent interpreting these counts as unique verses or a complete canon.

The [chapters14–16 update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-kriya14-16) holds thirty new files, about 2.7 MB compressed. Manifest SHA256: `b5195994734f00640c0d2a8249a3f8b3453b944194bb3c63f12e0e1db39c3813`. See `private-corpus-kriya14-16-transfer.json` for verified transfer completion. After the preceding updates, run:

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-kriya14-16 --directory content/_staging/transfer/private-corpus-2026-10-05-kriya14-16 --manifest-sha256 b5195994734f00640c0d2a8249a3f8b3453b944194bb3c63f12e0e1db39c3813
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_chapter14_16.py" --chapter 14
python "$corpusRoot/append_kirana_source_chapter14_16.py" --chapter 15
python "$corpusRoot/append_kirana_source_chapter14_16.py" --chapter 16
python "$corpusRoot/verify_kirana_checkpoint16.py"
python "$corpusRoot/refresh_kirana_checkpoint16.py"
```

All three uploaded asset hashes passed verification, followed by a fresh authenticated download, decompression and checksum verification of all thirty archived files. The complete receipt is `private-corpus-kriya14-16-transfer.json`.

Stop on errors. Regenerate the local receipt after replay; physical SQLite hashes can vary by runtime, so verify the exact body/metadata/FTS checks too. Preserve the frozen receipts. Do not rerun older checkpoint writers against this expanded state or rerun imported evidence recorders.

Next recovery: **Kriyāpāda17, Grahayāgavidhih**, PDF **367**, handwritten **364**. Its opening is inspected; ending unestablished and no chapter17 body imported. Remaining work includes Kriyāpāda17–18, Caryāpāda1–27, Yogapāda1–7, Ramakaṇṭha7–12, source omissions/uncertainties and broader ledger gaps. The goal remains active.

The chapter13 and10–12 sections below are historical checkpoints; their releases remain unchanged.

## Previous addition: chapter13

Chapter13, **Astrayāgavidhih**, is stored as document **12477**, body **1238182**: **6,743 characters** including collector headings, eight source groups, ten inspected PDF pages **340–349**, handwritten pages **337–346**, ending verse label **25** and the thirteenth-chapter English colophon. All source groups contain readable English, but one correction on PDF344 is explicitly marked unreadable and faint annotations remain unresolved. This captures Sabharathnam's existing English; full diplomatic transcription and Sanskrit fidelity are not certified.

All **13** Kriyāpāda captures passed exact file/body/import/metadata/FTS checks, original PDF asset117 BLOB verification and foreign-key checks. Cumulative totals are **135,345 stored characters**, **173 inspected source pages** and **140 groups**. Chapter13 replay added no duplicate. Current database totals are **1,238,182 bodies**, **12,477 documents** and **171 PDF assets**. Current local database SHA256 is `7bd635874056fd27d01c1ef75c0c6da8a9f751fcb3a32d392b4fe23db3e4ad61`, with 9,782,632,448 bytes. Overlapping editions, granularities, summaries and headers prevent treating these counts as unique verses or complete works.

The [chapter13 update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-kriya13) contains thirteen new body/evidence/script/crop files, about 0.85 MB compressed. Manifest SHA256: `0a2a18b5de0117cf281c78e265db65b505ddbd4991695d55703bab1101af124e`. Check `private-corpus-kriya13-transfer.json` for verified upload/download completion. After the base, preview and10–12 updates, run:

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-kriya13 --directory content/_staging/transfer/private-corpus-2026-10-05-kriya13 --manifest-sha256 0a2a18b5de0117cf281c78e265db65b505ddbd4991695d55703bab1101af124e
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_chapter13.py" --chapter 13
python "$corpusRoot/verify_kirana_checkpoint13.py"
python "$corpusRoot/refresh_kirana_checkpoint13.py"
```

Stop on errors. Do not rerun the source recorder after import. Versioned scripts preserve older sealed releases. Regenerate the local receipt after replay; SQLite runtimes may arrange database bytes differently while exact body/metadata/FTS checks pass. Do not restore the frozen database over a changed working database.

Next recovery is **Kriyāpāda14, Ganayāgavidhih**, starting PDF **350**, handwritten **347**. Its opening is inspected; its ending remains unestablished and no chapter14 body is imported. Remaining Kiraṇa work includes Kriyāpāda14–18, Caryāpāda1–27, Yogapāda1–7, Ramakaṇṭha commentary7–12 and recorded source omissions/uncertain readings. Broader gaps remain in the ledger. Existing other languages are preserved. The goal remains active.

All three uploaded asset hashes passed verification, followed by a fresh authenticated download, decompression and checksum check of all thirteen archived files. The completion receipt is `private-corpus-kriya13-transfer.json`.

The following 10–12 checkpoint is historical; its release stays unchanged.

## Actual new bodies

| Chapter | Source title      | PDF pages | Handwritten pages | Final label | Document | Stored characters |
| ------- | ----------------- | --------- | ----------------- | ----------- | -------- | ----------------: |
| 10      | Dīkṣāpaṭalaḥ      | 306–330   | 303–327           | 62½         | 12474    |            16,420 |
| 11      | Caṇḍayāga-paṭalaḥ | 331–335   | 328–332           | 12½         | 12475    |             4,196 |
| 12      | Guruyāga-paṭalaḥ  | 336–339   | 333–336           | 9½          | 12476    |             3,470 |

These are **three actual English bodies**, totaling **24,086 stored characters** including collector headers, from **34 inspected pages** and **26 source verse groups**. They are transcriptions of the existing Sabharathnam English, not new translations. The original source PDF is unchanged and remains SQLite PDF asset 117.

Readable corrections and source spelling/grammar are preserved. Unreadable words and unfinished wording are marked explicitly. Chapter 10 has uncertain corrected words, provisional mantra names and a provisional “SivLord” reading. Chapters 11–12 have faint annotations; chapter 12's final “sacri” is unfinished and was not completed by guessing. Full diplomatic transcription and Sanskrit fidelity are **not certified**. Chapter 9 still contains the translator's summaries/selected translations only, and the older chapter 1/4 source-English gaps remain open.

Focused verification passed for all **12** Kriyāpāda captures: exact source-file/body/import/metadata hashes, FTS text, original source PDF BLOB and foreign keys. Their cumulative stored text is **128,602 characters**, across **163 inspected source pages** and **132 groups**. Those counts include summaries, headers and overlapping source granularity; they do not establish a complete English scripture.

Current private database counts are **1,238,181 bodies**, **12,476 documents** and **171 full PDF assets**. Its local receipt records SHA256 `70da88f77a34ac53df6e630f2e568ca75294e490d432f428317626195bbd78b0` and 9,782,632,448 bytes. The main release's database checksum remains the earlier frozen value; append the new bodies using the update instructions rather than confusing those two states. A different SQLite runtime may arrange bytes differently after replay, so use the exact body/metadata checks and locally generated receipt to verify a replayed database.

## Historical next recovery after10–12

**Kriyāpāda chapter 13, Astrayāgavidhih**, starts at PDF page **340**, handwritten page **337**. Its opening was inspected. No chapter-13 body has been imported and its ending boundary has not yet been established.

The remaining substantial Kiraṇa acquisition work is Kriyāpāda **13–18**, Caryāpāda **1–27**, Yogapāda **1–7**, Ramakaṇṭha commentary **7–12**, and the recorded source omissions/uncertain readings. The broader corpus still has the gaps in `private-corpus-gaps-2026-10-05.md` and the restored ledger. Existing other languages remain preserved.

Read the newest top section of the restored `continuation-checkpoint.md`, `private-corpus/remaining-actual-text-gaps.md` and `private-corpus/acquisition-scope-checkpoint.json` after applying the body update. Older notes are historical. **Do not run the old checkpoint writers that assume only nine Kriyāpāda captures.** The new `refresh_post_handoff_checkpoint.py` handles the current state and preserves the frozen receipt.

## Prompt for the other PC

> Continue private scripture collection from `docs/content/private-corpus-handoff.md` and `docs/content/private-corpus-latest-resume.md`. Work as one unified project; prior Stream A/B assignments do not apply. Restore the base and supplements through chapters14–16, replaying their imports and latest verification/checkpoint commands. Read the current gap ledger. Resume Kiraṇa Kriyāpāda17 Grahayāgavidhih at PDF367/handwritten364; establish the ending and capture existing English with explicit uncertainty before importing. Prioritize actual existing English bodies and preserve other languages. Do not generate translations, embeddings, audio or app content, publish the corpus, or claim full completeness.

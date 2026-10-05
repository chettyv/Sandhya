# Continue collection on another PC — 5 October 2026

## Twenty-first release: chapter 14 existing English

This is the current body checkpoint. Caryāpāda14's English on **Krcchra and expiatories for minor crimes** is stored as document **12497**, body **1238202**: **5,880 characters**, seven groups and seven English pages **490–496**. The final source label is 16½; both Sanskrit and English fourteenth colophons are on 496. No missing whole English group was observed in this bounded sequence. The visible title ending `VIDI`, corrected group headings, some words/ritual terms and an unmatched parenthesis remain uncertain or explicit. Source grammar, quantities and religious fasting/food/caste prescriptions remain attributed source quotation, not universal practice or health advice. No independent diplomatic or Sanskrit fidelity certification.

All **32 preferred captures** passed exact file/body/import/metadata/FTS, original source PDF BLOB, preview hashes and foreign-key checks: **256,720 stored characters, 320 inspected chapter pages and 275 groups**. Repeating chapter14's import added no duplicate. The database contains **1,238,202 text bodies, 12,497 documents and 171 PDF assets**, 9,783,201,792 bytes; SHA256 `0aa41a7c8222372ac6641953f3b5cd4617110552ce61e1ebe472c5aebfb308a5`. Counts overlap editions/passages; the corpus remains incomplete. All earlier source gaps and anomalies remain; chapter8 correction01 is preferred with its original audit capture retained.

Restore all twenty preceding releases in dependency order, replaying imports through chapter13. Then restore [the chapter14 update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-carya14):

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-carya14 --directory content/_staging/transfer/private-corpus-2026-10-05-carya14 --manifest-sha256 e2156e71bc506cfb5df6666614e78a56358f703f79aae99a83d967a5b8c78990
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya14.py" --chapter 14
python "$corpusRoot/verify_kirana_carya14_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya14_checkpoint.py"
```

The **24 files** include the existing English body, bounded evidence, append/verifier/refresher scripts, verification report, fourteen new page images/crops and chapter15 opening evidence. Run chapter14's verifier/refresher last. Stop on any error; do not rerun imported recorders or older checkpoint writers on the expanded database. Cross-machine SQLite layout/timestamps may differ; exact body/metadata and verification results are authoritative. Keep historical snapshots separate from current regenerated notes.

**Chapter14 backup verified:** all three uploaded asset hashes matched, and a fresh authenticated download/decompression verified all 24 individual files. The [current completion receipt](private-corpus-carya14-transfer.json) accounts for **94,070 source files across twenty-one private releases, with zero unarchived source paths**. The current database and mutable notes are reconstructed through verified imports and chapter14's refresher; the database was freshly hashed by that refresher. The inventory compares paths, sizes and timestamps and hashes changed non-database candidates, building on earlier archive verification rather than freshly hashing the full collection. Credentials and reproducible runtime caches are excluded. Earlier twenty-release counts and pending chapter14 statements belong to historical checkpoints.

**Next:** Caryāpāda15 **Acaryadisnana bhojana vidhih** opens **PDF497/handwritten498**; full497–498 are inspected, ending unestablished. Read `kirana-handwriting-source-map/carya15-opening-evidence.json`, then inspect499 onward and enlarged English crops before capture. All following chapter14-pending statements and checkpoint values belong to historical states.

## Twentieth release: chapter 13 surviving English

This is the current body checkpoint. Caryāpāda13 **Mahapatakadi prayascitta vidhih** is stored as document **12496**, body **1238201**: **8,409 characters**, seven surviving groups and nine English source pages **481–489**. The final source label is 24½, with Sanskrit thirteenth colophon on 488 and English thirteenth colophon on 489. Two apparent local gaps at handwritten482/486 remain; alternate numbering on PDF485 complicates the second. English482 has an unfinished word ending, and English485 ends mid-sentence after `materials`. Missing extent/address and possible displacement elsewhere in the entire PDF remain unresolved. This is no complete chapter or Sanskrit fidelity certification.

All **31 preferred captures** passed exact file/body/import/metadata/FTS, original source PDF BLOB, preview hashes and foreign-key checks: **250,840 stored characters, 313 inspected chapter pages and 268 groups**. A repeated chapter13 import added no duplicate. Current database: **1,238,201 bodies, 12,496 documents and 171 PDF assets**, 9,783,201,792 bytes; SHA256 `c7af52dcf99eb87acc759994992d6fe639ca13c77787bfc10b7add2f7f7f0701`. Counts overlap editions and passages. Earlier anomalies and omissions remain explicit; chapter8 correction01 stays preferred, with the original audit capture retained.

Restore all nineteen preceding releases in dependency order, replaying imports through chapter12. Then restore [the chapter13 body update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-carya13):

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-carya13 --directory content/_staging/transfer/private-corpus-2026-10-05-carya13 --manifest-sha256 467922e7c2f2335d0e4f86ca4f56953e3c8b6ccf0f24b3570d16c1ab2c008747
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya13.py" --chapter 13
python "$corpusRoot/verify_kirana_carya13_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya13_checkpoint.py"
```

The ten new files contain the surviving body, bounded source/boundary evidence, append/verifier/refresher scripts, verification report and chapter14 opening evidence. Previews are already in preceding releases. Run chapter13's verifier/refresher last; stop if any command fails. Do not rerun imported recorders or older checkpoint writers on the expanded database. Cross-machine SQLite layout/timestamps can differ; exact stored body/metadata and verification results are authoritative. Keep separate checkpoint snapshots historical; never copy them over current regenerated notes.

**Chapter13 backup verified:** all three uploaded asset hashes matched, and a fresh authenticated download/decompression verified all ten individual files. The [current completion receipt](private-corpus-carya13-transfer.json) accounts for **94,046 source files across twenty private releases, with zero unarchived source paths**. Current database and mutable notes are reconstructed by verified imports and the chapter13 refresher; the database was freshly hashed by that refresher. The inventory compares paths, sizes and timestamps and hashes changed non-database candidates, building on previous archive checks rather than freshly hashing the entire collection. Credentials and reproducible runtime caches are excluded. Earlier nineteen-release counts and unfinished chapter13 statements belong to historical checkpoints.

**Next:** chapter14 opens **PDF490/handwritten491**; full490–491 are inspected, ending unestablished. Its visible Indic heading ends `VIDI`, with final-word completeness uncertain. English title: Then, on the performance of Krcchra and expiatories for minor crimes. Read `kirana-handwriting-source-map/carya14-opening-evidence.json`; inspect492 onward before capture. Earlier chapter13 unfinished-work statements and all following checkpoint counts describe historical states. The corpus remains incomplete.

## Nineteenth release: unfinished chapter 13 reading

This is the newest handoff. The database is unchanged at **1,238,200 text bodies, 12,495 documents and 171 PDF assets**, with Caryāpāda12 as the latest imported chapter. Chapter 13 has no sealed transcription or imported body. Earlier resume points below are historical.

After restoring the eighteen preceding releases and replaying imports through chapter 12, restore [the chapter 13 reading supplement](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-carya13-frontier):

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-carya13-frontier --directory content/_staging/transfer/private-corpus-2026-10-05-carya13-frontier --manifest-sha256 93405b8baf137df9eca664328a416da3aaec0d6ed22691e9e0f1c46e54aaf3f9
```

Its **26 files** preserve eighteen newer previews, detailed unfinished-work notes, five separate exact checkpoint snapshots and two rendering helpers. Keep snapshots separate; do not overwrite regenerated current notes. Read `content/_staging/raw/english/source-review-2026-10-02/handoff-2026-10-05-carya13-frontier/collection-frontier.md`.

Chapter 13's surviving sequence is **PDF481–489**, with Sanskrit thirteenth colophon on 488 and English thirteenth colophon on 489; chapter 14 opens on 490. Full pages 481–490 and enlarged crops 481–486 were inspected. **Next inspect enlarged crops 487–489 and full page 491.** Preserve apparent local handwritten 482/486 gaps, alternate numbering on PDF485, unfinished English on 482/485, provisional readings and source corrections. Possible displacement elsewhere in the original PDF remains unresolved; do not claim a complete chapter or certified translation fidelity.

The supplement adds no scripture bodies or database changes. Corpus collection remains incomplete. Git carries scripts and notes; private release assets carry the large corpus. Cloning Git alone does not download the database.

**Handoff verified:** all three new uploaded asset hashes matched, and a fresh authenticated download/decompression verified all 26 individual files. The [completion receipt](private-corpus-carya13-frontier-transfer.json) accounts for **94,036 source files across nineteen private releases, with zero unarchived source paths**. The database was freshly hashed during this handoff and remains at SHA256 `8ea030c1dabde22943bc3ce8d9add78297b1149a8ecbd4519722f311e64d4920`. All nineteen releases' remote asset sizes, states and SHA256 metadata were rechecked against sealed local manifests. The inventory compares paths/sizes/timestamps and hashes changed non-database candidates; it builds on earlier archive verification rather than freshly hashing the full collection. Current database state is reconstructed from the frozen baseline plus verified imports; current notes also have exact separate snapshots. Credentials and reproducible runtime caches are excluded.

**Current checkpoint:** chapter12 surviving English is stored as document12495/body1238200,7,599characters/nine groups or fragments/PDF471–480. Apparent handwritten473 local gap and unnumbered English475 address/missing extent remain unresolved. Restore/replay all eighteen releases throughchapter12 and run its newest verifier/refresher last. Current database1,238,200bodies/12,495documents/171PDFassets. Use [the consolidated instructions](private-corpus-continue-on-other-pc.md). Nextchapter13 opens481,482 inspected; inspect483 onward. Older chapter12 pending states below are historical.

**Current checkpoint:** chapter11's surviving English is now imported as document12494/body1238199,8,947characters/ten groups/PDF461–470. Its apparent handwritten462/468 gaps, missing12–14(a) and incomplete ending remain explicit. Restore all seventeen releases, replay chapter11, then run its newest verifier/refresher. Use [the consolidated instructions](private-corpus-continue-on-other-pc.md). Current database:1,238,199bodies/12,494documents/171PDFassets. Nextchapter12 opens471,472 inspected; inspect473 onward. Older pending chapter11 statements below are historical.

**Newest handoff:** use [the consolidated instructions and new-chat prompt](private-corpus-continue-on-other-pc.md). Restore all sixteen releases, replaying imports through chapter10. The final supplement preserves18 newer chapter11 images and unfinished-work notes; no chapter11 body is imported. Chapter11's surviving sequence isPDF461–470, with apparent handwritten462/468 gaps and an incomplete English ending. All ten enlarged crops are inspected. Chapter12 opens471. This supersedes older frontier and fifteen-release prompts below.

The private corpus database currently contains **1,238,198 bodies, 12,493 documents and 171 PDF assets**. It remains incomplete. The latest imported scripture is Caryāpāda10. Chapter8's additive source-title correction01 remains preferred; chapter11 has no body imported.

**Newest body update:** restore and replay chapter10 as the fifteenth release after all fourteen preceding releases. Use [the current instructions](private-corpus-latest-resume.md) and its chapter10 verifier/refresher last. Next chapter11 opensPDF461, inspected through465; inspect466 onward to establish its ending. Older chapter9–10 pending notes below are historical.

Chapter10's ten files passed uploaded checksums and fresh authenticated download/decompression. The [latest completion receipt](private-corpus-carya10-transfer.json) accounts for93,946 source files across fifteen releases, with no unarchived source paths. All earlier counts below are historical.

**Newest body update:** after the thirteen releases described below, restore and replay [Caryāpāda9](private-corpus-latest-resume.md) as the fourteenth release. Use its new verifier/refresher last. The historical chapter9 frontier in the PC supplement is now superseded. Next collection is chapter10, PDF455–460.

The chapter9 update passed all uploaded asset hashes and a fresh authenticated download/decompression of all nine files. The [new completion receipt](private-corpus-carya09-transfer.json) accounts for93,936 source files across fourteen releases, with no unarchived source paths. Earlier transfer counts below describe the preceding PC snapshot.

Clone or pull `chettyv/Sandhya`, then follow [the base handoff](private-corpus-handoff.md) and [the ordered updates](private-corpus-latest-resume.md). Restore all twelve earlier private releases and replay their append commands in order. Run the newest correction-aware verification and checkpoint refresher. Do not restore the frozen database over an expanded working database.

Finally restore the [PC handoff supplement](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-pc-handoff):

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-pc-handoff --directory content/_staging/transfer/private-corpus-2026-10-05-pc-handoff --manifest-sha256 09b8f08474aa08ccf41f49673aeb1a04fdea12b2b1eb55c46006563f102902c6
```

This adds **41 files**:35 newer source-page images/crops, a detailed pending-work note and five separate snapshots of current notes/receipts. It contains **no new database or scripture bodies**. Snapshots remain in their own folder; do not copy them over the regenerated live notes. Read `content/_staging/raw/english/source-review-2026-10-02/handoff-2026-10-05-pc/collection-frontier.md`.

The frontier is more advanced than the older release notes:

| Pending chapter                         | Source PDF pages | State                                                                                                                                                             |
| --------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Caryāpāda9, Gocaravidhih                | 445–454          | Boundary and all ten enlarged reading crops inspected; eight groups ending29½. Transcription, uncertainty checks and import remain.                               |
| Caryāpāda10, Vratesvarayagavidhih       | 455–460          | Boundary and full pages inspected; six groups ending15½. Six enlarged crops rendered but still need inspection. Clipped words and a correction remain unresolved. |
| Caryāpāda11, Acarya varjyavarjya vidhih | 461 onward       | Full pages461–465 inspected; ending unestablished. Inspect466 next after completing9–10.                                                                          |

Keep original source grammar, unresolved Indic readings, corrections and clipped fragments explicit. Do not invent completions or generate translations. Earlier omissions, summaries, chapter4 ordinal discrepancy, chapter6 displaced ending and chapter7 clipped/unfinished words remain recorded.

**Transfer verified.** All three GitHub asset checksums matched. A fresh authenticated download and decompression verified all41 individual files. The [completion receipt](private-corpus-pc-handoff-transfer.json) records the checks and the final inventory: **93,927 source files** across **thirteen private releases**, with **zero unarchived source paths**. The database SHA256 was rechecked and matches the current receipt. The inventory compares paths, sizes and timestamps and hashes changed candidates; it does not freshly hash all41GB. Database and mutable working notes are reconstructed from the frozen baseline plus verified replay/refresher commands; archive counts are not unique scripture counts. Credentials and reproducible runtime caches are excluded.

## Paste into the new chat

> Continue private scripture acquisition using docs/content/private-corpus-pc-handoff.md, private-corpus-handoff.md and private-corpus-latest-resume.md. Work as one unified project; previous StreamA/B boundaries were superseded. Restore all fifteen private releases in dependency order, replay imports through Caryāpāda10, and run verify_kirana_carya10_checkpoint.py and refresh_kirana_carya10_checkpoint.py last. Chapter8 title correction01 remains preferred. Next Caryāpāda11 opensPDF461/handwritten457, inspected through465, ending unestablished. Read carya11-opening-evidence.json, inspect466 onward to establish the boundary, then review enlarged English crops and capture existing text with uncertain readings/corrections explicit. Preserve earlier source gaps, chapter4 ordinal mismatch, chapter6 displaced ending and chapter7/10 clipped wording. English first, retain existing other languages. No generated translations, embeddings, audio, app import or publication. The user authorized collection, tool installation and private GitHub handoff. Do not claim a complete corpus.

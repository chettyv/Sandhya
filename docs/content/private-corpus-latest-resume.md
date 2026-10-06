# Latest private corpus resume notes — 5 October 2026

## Latest handoff: unfinished chapter 15 reading (release 22)

The database is unchanged through Kiraṇa Caryāpāda14: **1,238,202 text bodies,12,497 documents and171 PDF assets**. Chapter15 has no sealed transcription or imported body. The corpus remains incomplete; counts overlap editions and passages. Earlier resume points below are historical.

Restore all21 earlier releases in the dependency order below and replay imports through chapter14, running `verify_kirana_carya14_checkpoint.py` and `refresh_kirana_carya14_checkpoint.py` last. Then restore [the chapter15 reading handoff](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-carya15-frontier):

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-carya15-frontier --directory content/_staging/transfer/private-corpus-2026-10-05-carya15-frontier --manifest-sha256 9805aca33782331a1ab8554f5da9e93b5da093c561506dae43e7b573b1dac9c2
```

The40 additive files preserve30 newer previews, detailed unfinished reading notes, five exact chapter14 checkpoint snapshots and four rendering helpers. Read `content/_staging/raw/english/source-review-2026-10-02/handoff-2026-10-05-carya15-frontier/collection-frontier.md`. Keep snapshots separate from current notes; do not copy them over regenerated state or blindly rerun rendering helpers.

**Backup verified:** all three uploaded asset hashes matched, and a fresh authenticated download/decompression verified all40 individual files. The [completion receipt](private-corpus-carya15-frontier-transfer.json) accounts for **94,110 source files across22 private releases, with zero unarchived source paths**. All22 releases' remote asset sizes/states/SHA256 metadata were rechecked. The database was freshly hashed and is unchanged throughchapter14 at SHA256 `0aa41a7c8222372ac6641953f3b5cd4617110552ce61e1ebe472c5aebfb308a5`. Current database state is restored from the frozen baseline plus verified imports; current mutable notes have separate exact snapshots. The inventory compares paths/sizes/timestamps and hashes changed non-database candidates, building on prior archive verification rather than freshly hashing the entire collection. Credentials and reproducible runtime caches are excluded.

**Resume:** chapter15 spansPDF497–511, final group33–35, both fifteenth colophons on511. Chapter16 opens512; its ending is unestablished. Full497–513 and enlarged497–508 have been inspected. **Next inspect enlarged509–511**, plus recheck the second tree name on504. The enlarged509–511 images are rendered but uninspected. Twelve surviving English groups include cross-page continuations499–500,501–502 and508–509. Preserve source corrections, uncertain Indic terms, the untranscribed Tamil gloss on506, source grammar/quantities and canceled bed-size trial510. Do not claim diplomatic completeness or Sanskrit fidelity.

No new scripture body or database change is included in this release. All earlier actual-text gaps remain. Git carries scripts and notes; private release assets carry the large corpus. Cloning Git alone does not download the database.

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

## Current checkpoint: Caryāpāda12 surviving English

Chapter 12 **Asauca Vidhih** is stored as document **12495**, body **1238200**: **7,599 characters**, nine surviving groups or fragments, and ten English source pages **471–480**. The final source heading is 23½; the Sanskrit twelfth colophon is on 479 and the English twelfth colophon on 480. Handwritten page 473 appears absent between PDF pages 474 and 475. The unnumbered English fragment on 475 survives, but its address and missing beginning or extent between groups 6–7 and 12 remain unresolved. Displacement elsewhere in the entire PDF remains unsearched. Source grammar, corrected or uncertain words, quantities and contradictory food or caste prescriptions are retained as attributed quotation. This is not a full chapter or fidelity certification.

All 30 preferred captures passed exact raw-file/body/import/metadata/FTS, original PDF BLOB, source image hashes and foreign-key checks. Repeating the chapter 12 import added no duplicate. Combined **242,431 characters, 304 inspected pages and 261 groups**. The current database contains **1,238,200 bodies, 12,495 documents and 171 PDF assets**, occupying 9,783,201,792 bytes; SHA256 `8ea030c1dabde22943bc3ce8d9add78297b1149a8ecbd4519722f311e64d4920`. Earlier omissions and anomalies remain; chapter 8 correction01 stays preferred, with the original audit version retained.

Restore/replay all seventeen preceding releases through chapter11 before [the chapter12 update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-carya12). Its30 files include body/evidence/scripts/report,20 inspected page images/crops and chapter13 opening evidence. All30 passed local archive verification. Then:

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-carya12 --directory content/_staging/transfer/private-corpus-2026-10-05-carya12 --manifest-sha256 5070e4ebe95ee636318ae3735aa13cd4de1ef75651a90e1a83899fdba4f7ca92
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya12.py" --chapter 12
python "$corpusRoot/verify_kirana_carya12_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya12_checkpoint.py"
```

Stop on errors; preserve frozen receipts and sealed older evidence. Do not rerun imported recorders or older checkpoint writers on expanded state. Exact body/metadata verification takes precedence over cross-machine SQLite layout and regenerated timestamps.

**Next:** Caryāpāda13 **Mahapatakadi prayascitta vidhih** opens **PDF481/handwritten480**;481–482 inspected, ending unestablished. Read `kirana-handwriting-source-map/carya13-opening-evidence.json`; inspect483 onward. Chapter12 and earlier gaps, Caryāpāda13–27,Yogapāda1–7,Ramakaṇṭha7–12 and broader ledger gaps remain. All following checkpoint values/resume points are historical.

**Chapter 12 transfer verified:** all three uploaded asset checksums matched; a fresh authenticated download/decompression verified all 30 individual files. The [completion receipt](private-corpus-carya12-transfer.json) accounts for 94,010 source files across eighteen releases, with zero unarchived source paths. Current mutable notes/database are reconstructed by verified replay/refresher; the database was freshly hashed by the chapter 12 refresher. The inventory builds on sealed archive checks and hashes changed non-database candidates, rather than freshly hashing every source file. Credentials and reproducible runtime caches are excluded.

## Current checkpoint: Caryāpāda11 surviving English

Chapter11 **Acarya varjyavarjya vidhih** is stored as document **12494**, body **1238199**: **8,947 characters**, ten surviving English groups on **PDF461–470**. Final source heading24–27½ and Sanskrit eleventh colophon470. English stops at `do not putforth`; no English closing colophon is supplied. Apparent handwritten462/468 gaps accompany missing English12–14(a) and an incomplete closing. These gaps are local to this physical sequence; displaced pages elsewhere in the original PDF remain unsearched/unresolved. Uncertain corrected words, unfinished word endings and source grammar are explicit. The handwritten map changes after465; do not use PDF minus4. No full chapter or fidelity certification.

All29 preferred captures passed exact raw-file/body/import/metadata/FTS, source PDF BLOB, page-image hashes and foreign-key checks. Repeat chapter11 import added no duplicate. Combined **234,832 characters, 294 inspected pages, 252 groups**. Current database: **1,238,199 bodies, 12,494 documents, 171 PDF assets**,9,783,201,792bytes; SHA256 `a54d429e95e51f540aa2ed493eca5103278ad0d85afe6579daa12aee48ebc484`. Earlier omissions and source anomalies remain; chapter8 correction01 stays preferred.

Restore all sixteen preceding releases through the chapter11 image frontier before [the chapter11 body update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-carya11). Its ten body/evidence/script/report/frontier files passed local archive verification; previews are in preceding releases. Then:

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-carya11 --directory content/_staging/transfer/private-corpus-2026-10-05-carya11 --manifest-sha256 11258327e29acb2094f40ef8527193f9f33ca32abddf690694e4ce4134baec9c
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya11.py" --chapter 11
python "$corpusRoot/verify_kirana_carya11_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya11_checkpoint.py"
```

Stop on errors. Preserve earlier sealed files and frozen receipts. Do not rerun imported recorders or older checkpoint writers on the expanded database. Exact body/metadata comparisons take precedence over cross-machine SQLite layout and regenerated timestamps.

**Next:** Caryāpāda12 **Asauca Vidhih** opens **PDF471/handwritten469**;471–472 inspected, ending unestablished. Read `kirana-handwriting-source-map/carya12-opening-evidence.json`; inspect473 onward. Chapter11 gaps, Caryāpāda12–27, Yogapāda1–7, Ramakaṇṭha7–12 and broader ledger gaps remain. All following checkpoint counts and pending chapter11 statements are historical.

**Chapter11 transfer verified:** all three uploaded asset hashes matched; a fresh authenticated download/decompression verified all ten individual files. The [completion receipt](private-corpus-carya11-transfer.json) accounts for93,980 source files across seventeen releases, with zero unarchived source paths. Current database/mutable notes travel through verified replay/refresher; the database was freshly hashed by the chapter11 refresher. The inventory builds on sealed archive checks and hashes changed non-database candidates, rather than freshly hashing the full collection. Credentials and reproducible runtime caches are excluded.

**Latest cross-PC handoff:** start with [continue-on-other-PC instructions](private-corpus-continue-on-other-pc.md). A sixteenth supplement preserves18 newer chapter11 images, detailed unfinished-work notes and five separate checkpoint snapshots. No new body or database change. Chapter11 is now bounded to survivingPDF461–470; apparent handwritten462/468 gaps and the unfinished English ending remain unresolved. All enlarged crops have been inspected. Capture the ten surviving groups next; chapter12 opens471. Older frontier statements below are historical.

## Latest addition: Caryāpāda10

Chapter10 **Vratesvarayagavidhih** is stored as document **12493**, body **1238198**: **5,757 characters**, six groups, six English source pages **455–460**. Source ending15½ and both tenth colophons460. Group2–4 heading/Sanskrit is on455, corresponding English on456. Three incomplete right-edge fragments on457, a faint word ending on459, uncertain corrected fragments on460, faint insertion and stray wording remain explicitly marked. Production annotations requesting diagrams, mantra explanations and mudra examples remain in metadata. No whole English group omission observed; diplomatic and Sanskrit fidelity uncertified.

The28 preferred Kriyāpāda/Caryāpāda captures passed exact raw-file/body/import/metadata/FTS, source PDF BLOB, preview hashes and foreign-key checks. A repeat import added no duplicate. Combined **225,885 characters, 284 inspected pages and 242 groups**. Current database: **1,238,198 bodies, 12,493 documents, 171 PDF assets**,9,783,201,792 bytes; SHA256 `9b5a54e9ce18a82818f503e52d2a3536d2d5196cc08141d439fb183a7fe3ac6b`. Earlier source omissions/anomalies remain, including chapter7 clipping; chapter8 correction01 remains preferred and original capture is preserved.

Restore the fourteen preceding releases through the PC preview handoff and chapter9 before the [chapter10 update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-carya10). Its ten files contain body/evidence, append/verification/refresher scripts, report and chapter11 opening evidence. Source previews are already in preceding releases. All ten files passed local archive verification. Then run:

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-carya10 --directory content/_staging/transfer/private-corpus-2026-10-05-carya10 --manifest-sha256 e27b128473d322ebba6c748961b9f143792855ee1086b63265f52aa48bbd894f
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya10.py" --chapter 10
python "$corpusRoot/verify_kirana_carya10_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya10_checkpoint.py"
```

Stop on errors. Preserve frozen releases and older imported evidence. Do not rerun imported recorders or older checkpoint writers on expanded state. Regenerated timestamps/SQLite layout may differ across machines; verify exact stored text and metadata.

**Next:** Caryāpāda11, **Acarya varjyavarjya vidhih**, opens **PDF461/handwritten457**. Full pages461–465 inspected; ending unestablished, no body imported. Read `kirana-handwriting-source-map/carya11-opening-evidence.json`, then inspect **466 onward** to establish the boundary and review enlarged English crops before capture. Caryāpāda11–27, Yogapāda1–7, Ramakaṇṭha7–12 and broader ledger gaps remain. Sections below retain historical checkpoint values.

**Chapter10 transfer verified:** all three uploaded asset checksums matched, and a fresh authenticated download/decompression verified all ten individual files. The [completion receipt](private-corpus-carya10-transfer.json) records **93,946 source files across fifteen private releases, zero unarchived source paths**. This path/size/time inventory hashes changed non-database candidates and builds on sealed archive checks; it does not freshly hash all41GB. Current database and mutable notes are delivered by verified replay/refresher, which freshly hashed the expanded database. Runtime caches, Git metadata and credentials are excluded.

## Latest addition: Caryāpāda9

Chapter9 **Gocaravidhih** is now stored as document **12492**, body **1238197**: **8,237 characters**, eight groups, ten English source pages **445–454**. Source ending29½; Sanskrit ninth colophon453 and English ninth colophon454. Opening1 address is inferred; English continues onto unnumbered448 and454. Provisional names, corrected labels, uncertain article, source grammar and empty/deleted glosses are explicit. No whole English group omission was observed; diplomatic and Sanskrit fidelity remain uncertified.

All18 Kriyāpāda and nine Caryāpāda preferred captures passed exact raw-file/body/import/metadata/FTS, original PDF BLOB, preview hashes and foreign-key checks. Repeat chapter9 import added no duplicate. Combined **220,128 characters, 278 inspected pages and 236 groups**. Current database: **1,238,197 bodies, 12,492 documents and 171 PDF assets**,9,783,201,792 bytes; SHA256 `8bd834dcd37958aaf559f5aa660eea4149a8ddab0513238df0fc270d4e0977ff`. Earlier omissions and source anomalies remain. Chapter8 correction01 stays preferred and its original capture is preserved.

Restore the thirteen preceding releases, including the PC preview handoff, before the [chapter9 update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-carya09). Its nine files contain the exact body, evidence, append/verification/refresher scripts and report; the PDF445–455 pages/crops are in earlier releases. The local archive verified all nine files. Then run:

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-carya09 --directory content/_staging/transfer/private-corpus-2026-10-05-carya09 --manifest-sha256 0e94e0f7b5c9ddfd24320a98ccc53f36badba8efdf67b8c616406cf1a1115bde
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya09.py" --chapter 9
python "$corpusRoot/verify_kirana_carya09_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya09_checkpoint.py"
```

Stop on errors. Preserve older sealed files; do not rerun imported recorders or older checkpoint writers on expanded state. Replay/refresher reconstructs current mutable notes and the database; timestamps and SQLite layout can differ across machines.

**Next:** Caryāpāda10, Vratesvarayagavidhih, **PDF455–460**, ending15½. Full pages inspected; inspect the six enlarged crops before capture. Right-edge clips and a corrected phrase remain unresolved. Chapter11 opens461, inspected through465, ending unestablished; inspect466 afterward. Neither10 nor11 is imported. The thirteen-release frontier notes are historical for chapter9, superseded by this section. Collection remains incomplete.

**Chapter9 transfer verified:** all three uploaded asset hashes matched, and a fresh authenticated download/decompression verified all nine individual files. The completion receipt is [private-corpus-carya09-transfer.json](private-corpus-carya09-transfer.json). Final inventory: **93,936 source files across fourteen private releases, zero unarchived source paths**. It compares paths, sizes and timestamps and hashes changed non-database candidates, building on sealed archive verification; current database and mutable notes travel through replay/refresher commands. Credentials and reproducible runtime caches are excluded.

**Newest PC handoff:** read [private-corpus-pc-handoff.md](private-corpus-pc-handoff.md) after replaying the twelve releases below. A thirteenth supplement preserves35 newer page images and current snapshots. Caryāpāda9's boundary is now PDF445–454 and10's is455–460; neither is transcribed/imported. Chapter11 begins461 and inspection reaches465. The detailed pending frontier supersedes the older "ending unestablished" notes for9 below. Database counts remain unchanged.

Read this after `private-corpus-handoff.md`. The latest chapter captures are Caryāpāda7–8, followed by the **chapter8 source-title correction01** below. Restore all twelve private releases in dependency order. Earlier sections retain their historical values.

## Current source-title correction01

A closer source review found that chapter8's opening English title onPDF437 says **religion life**. The first capture had normalized this to **religious life**. An additive corrected capture restores the source wording: document **12491**, body **1238196**, **7,143 characters**. Original document12490/body1238195 and its sealed files remain as an audit version. Prefer the corrected chapter8 version; this adds no scripture chapter or source coverage.

The current26 chapter captures total **211,891 characters**, **268 inspected pages** and **228 source groups**. Chapters7–8's preferred versions total **12,963 characters**. Current database: **1,238,196 bodies**, **12,491 documents**, **171 PDF assets**,9,783,201,792 bytes; local SHA256 `89802e15491716b10d73fab9dbc5edeebde25337e91ac5b657423a8804841e9f`. The additional body is a corrected version, not new coverage. Exact storage/metadata/FTS, source BLOB, preview hashes, original capture retention and foreign-key checks passed. Repeating the correction import added no duplicate. Earlier omissions and uncertainties remain; no fidelity certification.

The [title correction update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-carya08-title-correction01) contains eight additive files. All three uploaded asset hashes passed. A fresh authenticated download and decompression verified all eight individual file hashes; the committed receipt is `private-corpus-carya08-title-correction01-transfer.json`. Restore and replay the initial7–8 update below first, then:

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-carya08-title-correction01 --directory content/_staging/transfer/private-corpus-2026-10-05-carya08-title-correction01 --manifest-sha256 82cf7a0c50f3c359636a61e44fe3ff5b431c046b41680538a8ec0f8cccf093a2
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya08_correction01.py" --chapter 8
python "$corpusRoot/verify_kirana_carya08_correction01_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya08_correction01_checkpoint.py"
```

Stop on errors. Preserve frozen releases and imported evidence. The newest verifier prefers the corrected chapter8 and checks that the original capture remains intact. Current notes and the local database receipt are regenerated after replay; timestamps and SQLite layout can differ across machines. Next collection remains **Caryāpāda9, PDF445/handwritten441**; opening and446 inspected, ending unestablished, no body imported; inspect447 onward.

The final inventory accounts for **93,886 source files** across **twelve private releases**, with **zero unarchived source paths**. It compares paths, sizes and timestamps and rehashes six changed non-database candidates, building on sealed archive verification. The old chapter1–16 report matches the archived resume snapshot exactly. Replay/refresher commands reconstruct the expanded database, ledger and current notes; generated timestamps and SQLite layout may differ. Runtime caches, nested Git metadata and credentials are excluded.

## Prompt for the other PC

> Continue private scripture collection from `docs/content/private-corpus-handoff.md` and `docs/content/private-corpus-latest-resume.md`. Work as one unified project; prior Stream A/B assignments do not apply. Restore all twelve private releases through Caryāpāda7–8 and chapter8 title correction01 in dependency order, replay their imports, then run the newest correction-aware verification/refresher. Prefer corrected chapter8 doc12491/body1238196; original capture is preserved for audit. Read the current gap ledger. Resume Kiraṇa Caryāpāda9 atPDF445/handwritten441; opening and446 inspected, ending unestablished and no body imported; inspect447 onward. Preserve earlier omissions, uncertainties, chapter4 ordinal mismatch, chapter6 displaced ending and chapter7 clipped/unfinished words. Prioritize actual existing English bodies and preserve other languages. Do not generate translations, embeddings, audio or app content, publish the corpus or claim full completeness.

Read this after `private-corpus-handoff.md`. Latest existing-English capture is **Caryāpāda7–8**. Restore all preceding base and supplements through4–6 before this update. Older sections below are historical.

## Initial Caryāpāda7–8 capture before the title correction

| Chapter | Title                 | Source PDF pages | Document / body | Stored characters | Source ending                                    |
| ------- | --------------------- | ---------------- | --------------- | ----------------: | ------------------------------------------------ |
| 7       | Śivācārya-ācāravidhih | 431–436          | 12489 / 1238194 |             5,820 | 15; seventh English and Sanskrit colophons on436 |
| 8       | Āśrama-ācāryavidhih   | 437–444          | 12490 / 1238195 |             7,144 | 22½; eighth English and Sanskrit colophons on444 |

These two captures add **12,964 characters**, **15 source groups** and **14 inspected English pages**. Chapter7 has unfinished wording on431 and clipped right-edge words on436; visible fragments and uncertainty markers are retained, with no invented completion. Its relocation arrow and several corrected/Indic words remain provisional. Chapter8's opening1–3 address is inferred; English4–7 continues at the top of439 before8–9. Source duplicate `to`, an unmatched parenthesis and corrected wording are preserved. Historical caste, initiation and life-stage prescriptions are attributed source quotation, with no new translation or authored practice guide. Neither capture certifies diplomatic or Sanskrit fidelity.

All18 Kriyāpāda and eight Caryāpāda captures passed exact raw-file/body/import/metadata/FTS, original source PDF asset117 BLOB, preview hashes and foreign-key checks. Repeat imports added no duplicates. Combined **211,892 characters**, **268 inspected source pages**, **228 groups**. Earlier omissions, summaries, apparent missing Caryāpāda1 handwritten388 beginning, chapter2 English7–8 omission, chapter4 ordinal mismatch, chapter6 displaced ending and uncertainties remain.

Current private database: **1,238,195 bodies**, **12,490 documents**, **171 PDF assets**, **9,783,201,792 bytes**. Local SHA256: `e6e4a06265f065e484a32e44ec58790aa5fab5c7784e85bb57b2dad4733db915`. Overlapping editions and granularities prevent interpreting those counts as unique verses or complete works.

The [Caryāpāda7–8 update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-carya07-08) contains40 new body/evidence/script/preview files, including chapter9 opening evidence. All three uploaded asset hashes passed, and a fresh authenticated download and decompression verified all40 individual file hashes. The committed completion receipt is `private-corpus-carya07-08-transfer.json`. After all preceding updates, run:

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-carya07-08 --directory content/_staging/transfer/private-corpus-2026-10-05-carya07-08 --manifest-sha256 0f3de566b4679cb9baf83e35d81398a8362c5f32a81224db985b8d8fb1b3fedd
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya07_08.py" --chapter 7
python "$corpusRoot/append_kirana_source_carya07_08.py" --chapter 8
python "$corpusRoot/verify_kirana_carya08_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya08_checkpoint.py"
```

Stop on errors; preserve frozen receipts and older sealed releases. Regenerate the local receipt after replay; SQLite layout and regenerated timestamps can differ across machines. Do not rerun imported evidence recorders or older checkpoint writers against expanded state.

Next recovery: **Caryāpāda9, Gocaravidhih**, PDF **445**, handwritten **441**. Opening and following446 inspected; ending unestablished and no body imported. Read `kirana-handwriting-source-map/carya09-opening-evidence.json`, then inspect447 onward. Caryāpāda9–27, Yogapāda1–7, Ramakaṇṭha7–12 and broader gaps remain open. Goal remains active.

## Historical prompt through the initial7–8 capture

> Continue private scripture collection from `docs/content/private-corpus-handoff.md` and `docs/content/private-corpus-latest-resume.md`. Work as one unified project; prior Stream A/B assignments do not apply. Restore all eleven private releases through Caryāpāda7–8 in dependency order, replay their body imports, then run the latest verification/refresher. Read the current gap ledger. Resume Kiraṇa Caryāpāda9 atPDF445/handwritten441; opening and446 inspected, ending unestablished and no body imported; inspect447 onward. Preserve earlier omissions and uncertainty, chapter4 ordinal mismatch, chapter6 displaced ending and chapter7 clipped/unfinished words. Prioritize actual existing English bodies and preserve other languages. Do not generate translations, embeddings, audio or app content, publish the corpus or claim full completeness.

## Historical checkpoint through chapters4–6

Read this after `private-corpus-handoff.md`. All older archives remain frozen. The latest update adds **Caryāpāda4–6's surviving existing English**. Restore the base, preview supplement,10–12, chapter13,14–16, resume,17–18, Caryāpāda1 and2–3 updates before applying4–6, replaying body append commands in order.

## Latest addition: Caryāpāda4–6

| Chapter | Source title         | PDF pages | Document / body | Stored characters | Source ending                                          |
| ------- | -------------------- | --------- | --------------- | ----------------: | ------------------------------------------------------ |
| 4       | Mṛtyuñjayapūjāvidhih | 411–416   | 12486 / 1238191 |             4,617 | 12½; Sanskrit fourth, English fifth                    |
| 5       | Anadhyāyavidhih      | 417–421   | 12487 / 1238192 |             3,961 | 10; fifth-chapter English colophon                     |
| 6       | Pavitrārohaṇavidhih  | 422–430   | 12488 / 1238193 |             6,934 | 20; closing English and sixth colophon on displaced422 |

The new captures add **15,512 characters**, **18 groups** and **20 English source pages**. No whole English group omission was observed in these bounded chapters; unfinished words and uncertain corrections remain. Chapter4's English colophon explicitly says **fifth**, while Sanskrit says **fourth** on the samePDF416; both readings are retained. Source words beginning `man` and `medic` onPDF412 remain unfinished/uncertain. Chapter6's final `pla` is unfinished onPDF430 and has not been completed by invention.

**Chapter6 page order:** PDF422/handwritten418 contains closing English and the sixth-chapter colophon before its openingPDF423. It also explicitly says **This page should be placed after426**. The capture reads PDF423–430/handwritten419–426, thenPDF422. The final source group uses explicit page list **430,422**, with its unnumbered closing-paragraph association marked as inferred from the placement note and colophon. The original PDF retains its physical order. Historical medical, ritual, timing and classification claims are attributed source quotation; no practice guide, new translation or computed festival date was generated. Diplomatic transcription and Sanskrit fidelity remain uncertified.

All18 Kriyāpāda and six Caryāpāda captures passed exact raw-file/body/import/metadata/FTS, original PDF asset117 BLOB, preview hash and foreign-key checks; repeat imports added no duplicates. Combined **198,928 characters**, **254 inspected source pages**, **213 groups**. Earlier Kriyāpāda omissions, chapter9 summaries, Caryāpāda1's apparent handwritten388 missing beginning, chapter2 English7–8 omission and uncertainties remain.

Current private database: **1,238,193 bodies**, **12,488 documents**, **171 PDF assets**, **9,783,201,792 bytes**. Local SHA256: `61ae1125f3bf6dc430d311fda8cbdbb4e55202f44ce03885773ec9e03d03e871`. Counts overlap editions and granularities; they do not prove a complete canon.

The [Caryāpāda4–6 update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-carya04-06) contains60 new body/evidence/script/preview files, including chapter7 opening evidence. All three remote asset checksums passed. A fresh authenticated download and decompression verified all60 individual file hashes; the committed receipt is `private-corpus-carya04-06-transfer.json`. After all preceding updates, run:

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-carya04-06 --directory content/_staging/transfer/private-corpus-2026-10-05-carya04-06 --manifest-sha256 5ddca9415af644ba68bf97be86563a7e9eedb4309ad571056cab70567c72f580
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya04_06.py" --chapter 4
python "$corpusRoot/append_kirana_source_carya04_06.py" --chapter 5
python "$corpusRoot/append_kirana_source_carya04_06.py" --chapter 6
python "$corpusRoot/verify_kirana_carya06_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya06_checkpoint.py"
```

Stop on errors; preserve older sealed evidence and receipts. Regenerate the local receipt after replay and verify exact body/metadata/FTS as well as physical hashes. Do not rerun imported evidence recorders or older checkpoint writers against expanded state. Earlier sections below are historical.

Next recovery: **Caryāpāda7, Śivācārya-ācāravidhih**, PDF **431**, handwritten **427**. Opening and followingPDF432–434 inspected, through source group8(b)–10; ending unestablished and no body imported. Read `kirana-handwriting-source-map/carya07-opening-evidence.json`; inspectPDF435 onward to establish the boundary before capture. Caryāpāda7–27, Yogapāda1–7, Ramakaṇṭha7–12 and broader ledger gaps remain open. Goal remains active.

The final transfer inventory accounts for **93,838 source files** across **ten private releases**, with **zero unarchived source paths**. It checked paths, sizes and modification times and rehashed six changed non-database candidates, building on prior archive verification. The older chapter1–16 report matches its archived resume snapshot exactly. Replay and the newest refresher reconstruct the expanded database, ledger and current working notes; regenerated timestamps and SQLite layout may differ. Credentials and reproducible runtime caches are excluded.

## Historical prompt through chapters4–6

> Continue private scripture collection from `docs/content/private-corpus-handoff.md` and `docs/content/private-corpus-latest-resume.md`. Work as one unified project; prior Stream A/B assignments do not apply. Restore all ten private releases through Caryāpāda4–6 in dependency order and replay their imports and latest verification/refresher commands. Read the current gap ledger. Resume Kiraṇa Caryāpāda7 at PDF431/handwritten427; pages431–434 inspected, ending unestablished and no body imported. Inspect435 onward. Preserve earlier missing English groups and uncertainties, chapter4 English fifth/Sanskrit fourth discrepancy and chapter6 displaced closing page. Prioritize actual existing English bodies and preserve other languages. Do not generate translations, embeddings, audio or app content, publish the corpus, or claim full completeness.

## Previous addition: Caryāpāda2–3

Chapter2, **Sarasvatīpūjāvidhih**, is document **12484**, body **1238189**: **5,446 characters**, six English groups across PDF **400–405**, handwritten396–401. Sanskrit ends16½ with the second-chapter colophon onPDF404; English continuesPDF405. **English7–8 is absent in this inspected sequence:** Sanskrit7–8 appears onPDF402 andPDF403 starts9. No missing translation was generated. The English terms `pitah` and `erikarana` remain provisional; source `asta-mantra`, awkward grammar and supernatural claims remain attributed quotation.

Chapter3, **Bhikṣāṭanavidhih**, is document **12485**, body **1238190**: **4,382 characters**, four English groups across PDF **406–410**, handwritten402–406. It reaches12 and the third-chapter English colophon onPDF410. No English group omission was observed in these pages; word readings and the revised `emerges himself out as a conqueror` clause remain provisional. Historical classifications and longevity claims are quoted source text, with no authored practice guidance. Neither capture certifies full diplomatic or Sanskrit fidelity.

All18 Kriyāpāda captures and Caryāpāda1–3 passed exact raw-file/body/import/metadata/FTS, original PDF asset117 BLOB, preview hashes and foreign-key checks. Repeat imports added no duplicates. Combined **183,416 characters**, **234 inspected source pages**, **195 groups**; the new2–3 captures add **9,828 characters**, eleven pages and ten groups. Earlier omissions, chapter9 summaries, Caryāpāda1's apparent handwritten388 missing beginning and uncertainties remain.

Current private database: **1,238,190 bodies**, **12,485 documents**, **171 PDF assets**,9,782,632,448 bytes. Local SHA256: `9b174a708f6ffb4a0f6543c4282ffea93685a4661340ffde4b6278fce2785983`. Counts overlap editions and granularities; they do not prove a complete canon.

The [Caryāpāda2–3 update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-carya02-03) contains36 new body/evidence/script/preview files. All three remote asset checksums passed. A fresh authenticated download and decompression verified all36 individual file hashes; the receipt is `private-corpus-carya02-03-transfer.json`. After all preceding updates, run:

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-carya02-03 --directory content/_staging/transfer/private-corpus-2026-10-05-carya02-03 --manifest-sha256 31797ade19aeeeffa41ae4dfdbc4eaba13b02ba2433409c1dd1fb18089148e1a
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya02_03.py" --chapter 2
python "$corpusRoot/append_kirana_source_carya02_03.py" --chapter 3
python "$corpusRoot/verify_kirana_carya03_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya03_checkpoint.py"
```

Stop on errors; preserve older sealed evidence and receipts. Regenerate the local receipt after replay, verifying actual body/metadata/FTS as well as physical hashes. Do not rerun imported evidence recorders or older checkpoint writers against the expanded state. Earlier sections below are historical.

Next recovery: **Caryāpāda4, Mṛtyuñjayapūjāvidhih**, PDF **411**, handwritten **407**. Opening and followingPDF412 inspected; ending unestablished and no body imported. Caryāpāda4–27, Yogapāda1–7, Ramakaṇṭha7–12, source-English omissions/uncertainties and broader ledger gaps remain open. Goal remains active.

## Previous addition: Caryāpāda1, partial source capture

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

## Historical prompt after chapters14–16

> Continue private scripture collection from `docs/content/private-corpus-handoff.md` and `docs/content/private-corpus-latest-resume.md`. Work as one unified project; prior Stream A/B assignments do not apply. Restore the base and supplements through chapters14–16, replaying their imports and latest verification/checkpoint commands. Read the current gap ledger. Resume Kiraṇa Kriyāpāda17 Grahayāgavidhih at PDF367/handwritten364; establish the ending and capture existing English with explicit uncertainty before importing. Prioritize actual existing English bodies and preserve other languages. Do not generate translations, embeddings, audio or app content, publish the corpus, or claim full completeness.

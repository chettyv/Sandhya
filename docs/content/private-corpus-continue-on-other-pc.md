# Continue the private corpus on another PC

The current work is backed up to the private `chettyv/Sandhya` repository. Git contains the scripts and notes; the large database, source scans, extracted text and previews are in private GitHub release assets. Cloning Git alone does not download the corpus.

The latest imported text is Kiraṇa Caryāpāda chapter14’s existing English. The database contains **1,238,202 text bodies, 12,497 documents and 171 PDF assets**. Counts overlap editions and passages; the corpus remains incomplete. Use the newest checkpoint below; older counts and pending-work statements are historical.

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

## Restore

Sign into the same GitHub account using Git Credential Manager. Clone or pull `main`, install Python 3.10 or newer, and run commands from the repository folder:

```powershell
git pull --ff-only origin main
python -m pip install -r scripts/private-corpus/requirements.txt
```

Follow [the base restore](private-corpus-handoff.md) and [the ordered import updates](private-corpus-latest-resume.md). Restore the first fifteen releases in this dependency order, replaying their append commands. The `resume` release must precede Kriyāpāda17–18. The earlier PC handoff must precede Caryāpāda9.

1. `private-corpus-2026-10-05`
2. `private-corpus-2026-10-05-preview-supplement`
3. `private-corpus-2026-10-05-kriya10-12`
4. `private-corpus-2026-10-05-kriya13`
5. `private-corpus-2026-10-05-kriya14-16`
6. `private-corpus-2026-10-05-resume`
7. `private-corpus-2026-10-05-kriya17-18`
8. `private-corpus-2026-10-05-carya01`
9. `private-corpus-2026-10-05-carya02-03`
10. `private-corpus-2026-10-05-carya04-06`
11. `private-corpus-2026-10-05-carya07-08`
12. `private-corpus-2026-10-05-carya08-title-correction01`
13. `private-corpus-2026-10-05-pc-handoff`
14. `private-corpus-2026-10-05-carya09`
15. `private-corpus-2026-10-05-carya10`

Run the chapter10 verifier and refresher last. Prefer chapter8 correction01; preserve its original capture as an audit version. Stop if any command fails. Do not rerun older checkpoint writers on the expanded database or restore the frozen database over current work.

Then restore the sixteenth [chapter11 frontier supplement](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-carya11-frontier):

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-carya11-frontier --directory content/_staging/transfer/private-corpus-2026-10-05-carya11-frontier --manifest-sha256 97c6253a66b53898cea239164d1ef0759a7290231ba5a4c6a87ca116840d6964
```

It contains **24 files**: 18 newly inspected images, detailed unfinished-work notes and five separate snapshots of current notes/receipts. It adds no scripture body or database change. Keep the snapshots in their own folder; do not copy them over regenerated working notes.

**Handoff verified:** all three uploaded asset checksums matched, and a fresh authenticated download/decompression verified all24 individual files. The [completion receipt](private-corpus-carya11-frontier-transfer.json) accounts for **93,970 source files across sixteen private releases, zero unarchived source paths**. The current database was freshly hashed and matches the recorded SHA256. The inventory compares paths, sizes and timestamps, hashing changed non-database candidates; it builds on earlier sealed archive verification rather than freshly hashing every source file. Current mutable database state travels through verified replay; five current notes also have exact separate snapshots. Credentials, Git metadata and reproducible runtime caches are excluded.

Read `content/_staging/raw/english/source-review-2026-10-02/handoff-2026-10-05-carya11-frontier/collection-frontier.md`. The frozen database plus verified imports reconstruct the current corpus. The chapter10 snapshot database SHA256 was `9b5a54e9ce18a82818f503e52d2a3536d2d5196cc08141d439fb183a7fe3ac6b`; after chapter11 replay, the current recorded SHA256 is `a54d429e95e51f540aa2ed493eca5103278ad0d85afe6579daa12aee48ebc484`; cross-machine SQLite layout and regenerated timestamps may differ, so compare exact bodies, metadata and verification results.

## Seventeenth release: chapter11 body update

After all sixteen preceding releases, restore [the chapter11 body update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-carya11). The ten new files contain the surviving English, bounded evidence, append/verifier/refresher scripts, verification report and chapter12 opening evidence. Previews are already in preceding releases.

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-carya11 --directory content/_staging/transfer/private-corpus-2026-10-05-carya11 --manifest-sha256 11258327e29acb2094f40ef8527193f9f33ca32abddf690694e4ce4134baec9c
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya11.py" --chapter 11
python "$corpusRoot/verify_kirana_carya11_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya11_checkpoint.py"
```

Use chapter11’s verifier/refresher last. Do not rerun older checkpoint writers against expanded state. All29 preferred captures passed exact file/body/import/metadata/FTS, source PDF BLOB, preview hashes and foreign-key checks; a repeat chapter11 import added no duplicate. These checks establish storage integrity, not translation fidelity or full scripture completeness.

**Chapter11 backup verified:** all three uploaded asset checksums matched, and a fresh authenticated download/decompression verified all ten individual files. The [current completion receipt](private-corpus-carya11-transfer.json) accounts for **93,980 source files across seventeen private releases, zero unarchived source paths**. The current database hash comes from the chapter11 refresher's fresh hash. The inventory compares paths/sizes/timestamps and hashes changed non-database candidates, building on earlier archive checks; it does not freshly hash all41GB. Current mutable notes and database are reconstructed by replay/refresher. Earlier sixteen-release counts describe the preceding frontier handoff.

## Eighteenth release: chapter12 body update

After all seventeen preceding releases and chapter11 replay, restore [the chapter12 update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-carya12). Its30 files contain surviving English, source/boundary evidence, append/verifier/refresher scripts,30-capture report,20 source images/crops and chapter13 opening evidence.

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-carya12 --directory content/_staging/transfer/private-corpus-2026-10-05-carya12 --manifest-sha256 5070e4ebe95ee636318ae3735aa13cd4de1ef75651a90e1a83899fdba4f7ca92
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya12.py" --chapter 12
python "$corpusRoot/verify_kirana_carya12_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya12_checkpoint.py"
```

Run chapter12’s verifier/refresher last. Exact raw-file/body/import/metadata/FTS, source PDF BLOB, preview hashes and foreign-key checks passed for all30 preferred captures; a repeat chapter12 import added no duplicate. Current database SHA256 `8ea030c1dabde22943bc3ce8d9add78297b1149a8ecbd4519722f311e64d4920`,9,783,201,792bytes. Cross-machine SQLite layout/timestamps may differ; exact stored body/metadata and verification results are authoritative. These checks establish storage integrity, not translation fidelity or whole scripture completeness. Earlier SHA values and handoff counts above belong to their historical checkpoints.

**Chapter 12 backup verified:** all three uploaded asset hashes matched, and a fresh authenticated download/decompression verified all 30 individual files. The [current completion receipt](private-corpus-carya12-transfer.json) accounts for **94,010 source files across eighteen private releases, zero unarchived source paths**. Current database and mutable notes travel through verified replay/refresher. The database was freshly hashed by the chapter 12 refresher. The inventory compares paths, sizes and timestamps and hashes changed non-database candidates; it builds on prior archive verification rather than freshly hashing the full collection. Credentials and reproducible runtime caches are excluded.

## Exact resume point

Chapter14's existing English is imported, with uncertain corrected headings/terms, title endingVIDI, source grammar/quantities and unmatched parenthesis explicit. Chapter15 Acaryadisnana bhojana vidhih opensPDF497/handwritten498;497–498 inspected, ending unestablished. Read `kirana-handwriting-source-map/carya15-opening-evidence.json`; inspect499 onward and enlarged English crops before capture.

Preserve all earlier source anomalies and gaps, including chapter11's apparent handwritten462/468 gaps and unfinished English closing, chapter12's apparent handwritten473 gap and unnumbered partial English, and chapter13's apparent handwritten482/486 gaps, alternate numbering485/486 and incomplete internal continuation. Missing extent/address and possible displacement elsewhere in the whole761-pagePDF remain unresolved. Retain other languages already collected. Source caste/food/fasting/ritual prescriptions are attributed quotation, not universal practice or health guidance. The broader ledger remains `private-corpus/remaining-actual-text-gaps.md`.

## Paste into the new chat

> Continue private scripture collection from docs/content/private-corpus-continue-on-other-pc.md. Restore all twenty-one private releases in dependency order, replay imports through Caryāpāda14, and run verify_kirana_carya14_checkpoint.py and refresh_kirana_carya14_checkpoint.py last. Prefer chapter8 correction01 and retain the original audit capture. Chapter14 is imported as document12497/body1238202; preserve uncertain titleVIDI/group headings/terms, source quantities/grammar and unmatched parenthesis, plus all earlier source gaps and anomalies. Resume chapter15 Acaryadisnana bhojana vidhih fromPDF497/handwritten498;497–498 inspected, ending unestablished. Read carya15-opening-evidence.json, inspect499 onward, then enlarged English crops before capture. Work as one unified project; earlier Stream A/B boundaries were superseded. Capture actual existing English, retain other languages, verify exact stored bodies/metadata/FTS/source evidence and privately back up each delta. No generated translations, embeddings, audio, app import or publication. Collection, tool installation and private GitHub backup are authorized. The corpus remains incomplete.

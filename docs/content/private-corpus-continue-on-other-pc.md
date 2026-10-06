# Continue the private corpus on another PC

## Backup pending: repository is currently public

**Chapter17 is imported and verified locally, but its corpus archive has not been uploaded.** GitHub now reports `chettyv/Sandhya` as public; the uploader’s private-destination guard stopped before creating the chapter17 release. An unauthenticated check also found the repository and the existing chapter16 release accessible. See [the visibility and pending-backup record](private-corpus-backup-visibility-2026-10-06.md).

The latest published restore checkpoint is **chapter16 across24 releases**. The chapter17 restore commands below describe a prepared update and must wait until its actual publication to an approved private destination. Earlier “private release” wording is historical, not a statement of current visibility. A private-destination choice is pending; no public corpus upload or repository visibility change has been made by this task.

## Current checkpoint: chapter 17 imported (release 25)

Kiraṇa Caryāpāda17’s existing English on daily aberrations and atonements is stored as document **12500**, body **1238205**: **6,990 characters**, seven groups and seven English pages **519–525**. The final group is15–17; both seventeenth closing labels are on525. English continues523–524. Corrected headings10(b)–11(a)/11(b)–14 remain provisional. Four unfinished/provisional word endings on524/525 and the source’s clarification note on521 are explicit; the precise truncation mechanism is unresolved. No missing whole English group was observed locally. Source grammar, quantities and historical disease/remedy claims remain attributed quotation, not medical fact or health advice. No independent diplomatic transcription or Sanskrit fidelity certification.

All **35 preferred captures** passed exact file/body/import/metadata/FTS, original source PDF BLOB, preview hashes and foreign-key checks: **282,764 stored characters,349 inspected chapter pages and300 groups**. Repeating chapter17’s import added no duplicate. The database now contains **1,238,205 bodies,12,500 documents and171 PDF assets**, 9,783,201,792 bytes; SHA256 `1c7aae36d0b110024e55aa36e070698ccb7757368e90bd0287b8facaf0aeec73`. Counts overlap editions and passages; the corpus remains incomplete. All earlier source gaps/anomalies remain; chapter8 correction01 is preferred with its original audit capture retained.

Restore all24 preceding releases in dependency order and replay through chapter16. Then restore [the chapter17 update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-06-carya17):

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-06-carya17 --directory content/_staging/transfer/private-corpus-2026-10-06-carya17 --manifest-sha256 af595646753d44cf5039397b7d399c202fb83c22b2dcace9374d830e74b4e171
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya17.py" --chapter 17
python "$corpusRoot/verify_kirana_carya17_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya17_checkpoint.py"
```

The25 files contain the actual English body, bounded source/boundary evidence, recorder/append/verifier/refresher scripts, verification reports, fifteen new previews/crops and chapter18 opening evidence. Run chapter17’s verifier/refresher last; stop on any error. Never rerun imported recorders or older checkpoint writers over expanded state. Cross-machine SQLite physical layout/timestamps may differ; exact body/metadata/FTS and verifier results are authoritative. Keep historical snapshots separate from regenerated current notes.

**Next:** Caryāpāda18 **Saivavratacarana vidhih** opens **PDF526/handwritten527**. Full526–527 are inspected; the ending is unestablished. PDF527 bears handwritten529 and group5–8½. There is an apparent local handwritten528 gap, with group2–4 unobserved in these two opening pages; missing extent or possible displacement elsewhere remains unresolved. Read `kirana-handwriting-source-map/carya18-opening-evidence.json`, inspect528 onward, then enlarged English crops. Do not infer absence from the entire761-pagePDF from this opening. All following chapter17-pending statements and earlier database values describe historical states. The broader actual-text gap ledger remains `private-corpus/remaining-actual-text-gaps.md`.

## Historical checkpoint: chapter 16 imported (release 24)

Kiraṇa Caryāpāda16’s existing English on ritual defilement and material purification is stored as document **12499**, body **1238204**: **6,542 characters**, six groups and seven English pages **512–518**. The final group is13–17; the Sanskrit sixteenth closing label is on517 and the English one is on518. The final English paragraph continues517–518; sheet518 bears both older514 and current519. No missing whole English group was observed locally. Corrections, uncertain words/Indic terms, source spelling and grammar are explicit, including `counch-shell`, `divinical`, `krccha yoga` and `This the chapter`. No independent diplomatic transcription or Sanskrit fidelity certification.

All **34 preferred captures** passed exact file/body/import/metadata/FTS, original source PDF BLOB, preview hashes and foreign-key checks: **275,774 stored characters,342 inspected chapter pages and293 groups**. Repeating chapter16’s import added no duplicate. The database now contains **1,238,204 bodies,12,499 documents and171 PDF assets**, 9,783,201,792 bytes; SHA256 `2529db7fd63c525b089448aa09405e7b7f80c7090232e5575e5ea273d54a4be9`. Counts overlap editions and passages; the corpus remains incomplete. Earlier gaps/anomalies remain, and chapter8 correction01 is preferred with its original audit capture retained. Historical caste, ritual, fasting and purification prescriptions remain attributed source quotations, not universal practice or hygiene/health advice.

Restore all23 preceding releases in dependency order and replay through chapter15. Then restore [the chapter16 update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-06-carya16):

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-06-carya16 --directory content/_staging/transfer/private-corpus-2026-10-06-carya16 --manifest-sha256 98ed077ce1a228458e807c0f46d806b73a483404540c94c47fd36022d801574d
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya16.py" --chapter 16
python "$corpusRoot/verify_kirana_carya16_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya16_checkpoint.py"
```

The24 files contain the actual English body, bounded source/boundary evidence, recorder/append/verifier/refresher scripts, verification reports, fourteen new previews/crops and chapter17 opening evidence. Run chapter16’s verifier/refresher last; stop on any error. Never rerun imported recorders or older checkpoint writers over expanded state. Cross-machine SQLite physical layout/timestamps may differ; exact body/metadata/FTS and verifier results are authoritative. Keep historical snapshots separate from regenerated current notes.

**Chapter16 backup verified:** all three uploaded asset hashes matched, and a fresh authenticated download/decompression verified all24 individual files. The [completion receipt](private-corpus-carya16-transfer.json) accounts for **94,144 source files across24 private releases, with zero unarchived source paths**. The current database and mutable notes are reconstructed through verified imports and chapter16’s refresher; that refresher freshly hashed the database. The inventory compares paths/sizes/timestamps and hashes changed non-database candidates, building on prior archive verification rather than freshly hashing the full collection. Credentials and reproducible runtime caches are excluded. The preceding23-release state is historical.

**Next:** Caryāpāda17 **Nityahani-prayascitta vidhih** opens **PDF519/handwritten520**. Full519–520 are inspected; the ending is unestablished. Read `kirana-handwriting-source-map/carya17-opening-evidence.json`, inspect521 onward, then enlarged English crops before capture. All following chapter16-pending statements and earlier database values describe historical states. The broader actual-text gap ledger remains `private-corpus/remaining-actual-text-gaps.md`.

## Historical checkpoint: chapter 15 imported (release 23)

Kiraṇa Caryāpāda15’s existing English on preceptor/initiate bath, food and resting is stored as document **12498**, body **1238203**: **12,512 characters**, twelve groups and fifteen English pages **497–511**. Both fifteenth closing labels are on511, final group33–35. Three paragraphs continue across page pairs499–500,501–502 and508–509. No missing whole English group was observed locally. Corrections, uncertain words/Indic terms, unmatched punctuation and incomplete source clause grammar are explicit. The Tamil gloss beside bottle-gourd on506 remains untranscribed and preserved in the scan. The canceled bed-size draft on510 is not duplicated. No independent diplomatic transcription or Sanskrit fidelity certification.

All **33 preferred captures** passed exact file/body/import/metadata/FTS, original source PDF BLOB, preview hashes and foreign-key checks: **269,232 stored characters,335 inspected chapter pages and287 groups**. Repeating chapter15’s import added no duplicate. The database now contains **1,238,203 bodies,12,498 documents and171 PDF assets**, 9,783,201,792 bytes; SHA256 `684e35a765aa01d860046e2bce40be837afb787a553510a49e4ed3b897d39cb7`. Counts overlap editions and passages; the corpus remains incomplete. Earlier gaps/anomalies remain, and chapter8 correction01 is preferred with its original audit capture retained. Historical source prescriptions are attributed quotation, not universal practice or health guidance.

Restore all22 preceding releases in dependency order and replay through chapter14; the chapter15 reading supplement has no import. Then restore [the chapter15 body update](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-06-carya15):

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-06-carya15 --directory content/_staging/transfer/private-corpus-2026-10-06-carya15 --manifest-sha256 28a25dd32b0ca37b99d757c948ca1326974670ced6ef77084a3a1b78e051b215
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya15.py" --chapter 15
python "$corpusRoot/verify_kirana_carya15_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya15_checkpoint.py"
```

The10 files contain the actual English body, bounded source/boundary evidence, recorder/append/verifier/refresher scripts, verification reports and chapter16 opening evidence. All page images are already in earlier releases. Run chapter15’s verifier/refresher last; stop on any error. Never rerun imported recorders or older checkpoint writers over expanded state. Cross-machine SQLite physical layout/timestamps may differ; exact body/metadata/FTS and verifier results are authoritative. Keep historical snapshots separate from regenerated current notes.

**Chapter15 backup verified:** all three uploaded asset hashes matched, and a fresh authenticated download/decompression verified all10 individual files. The [completion receipt](private-corpus-carya15-transfer.json) accounts for **94,120 source files across23 private releases, with zero unarchived source paths**. The current database and mutable notes are reconstructed through verified imports and chapter15’s refresher; that refresher freshly hashed the database. The inventory compares paths/sizes/timestamps and hashes changed non-database candidates, building on prior archive verification rather than freshly hashing the full collection. Credentials and reproducible runtime caches are excluded. The preceding22-release state is historical.

**Next:** Caryāpāda16 **Ucchistasparsa vidhih** opens **PDF512/handwritten513**. Full512–513 are inspected; the ending is unestablished. Read `kirana-handwriting-source-map/carya16-opening-evidence.json`, inspect514 onward, then enlarged English crops before capture. All following unfinished chapter15 statements and earlier database values describe historical states. The broader actual-text gap ledger remains `private-corpus/remaining-actual-text-gaps.md`.

## Historical handoff: unfinished chapter 15 reading (release 22)

The database is unchanged through Kiraṇa Caryāpāda14: **1,238,202 text bodies,12,497 documents and171 PDF assets**. Chapter15 has no sealed transcription or imported body. The corpus remains incomplete; counts overlap editions and passages. Earlier resume points below are historical.

Restore all21 earlier releases in the dependency order below and replay imports through chapter14, running `verify_kirana_carya14_checkpoint.py` and `refresh_kirana_carya14_checkpoint.py` last. Then restore [the chapter15 reading handoff](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-carya15-frontier):

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-carya15-frontier --directory content/_staging/transfer/private-corpus-2026-10-05-carya15-frontier --manifest-sha256 9805aca33782331a1ab8554f5da9e93b5da093c561506dae43e7b573b1dac9c2
```

The40 additive files preserve30 newer previews, detailed unfinished reading notes, five exact chapter14 checkpoint snapshots and four rendering helpers. Read `content/_staging/raw/english/source-review-2026-10-02/handoff-2026-10-05-carya15-frontier/collection-frontier.md`. Keep snapshots separate from current notes; do not copy them over regenerated state or blindly rerun rendering helpers.

**Backup verified:** all three uploaded asset hashes matched, and a fresh authenticated download/decompression verified all40 individual files. The [completion receipt](private-corpus-carya15-frontier-transfer.json) accounts for **94,110 source files across22 private releases, with zero unarchived source paths**. All22 releases' remote asset sizes/states/SHA256 metadata were rechecked. The database was freshly hashed and is unchanged throughchapter14 at SHA256 `0aa41a7c8222372ac6641953f3b5cd4617110552ce61e1ebe472c5aebfb308a5`. Current database state is restored from the frozen baseline plus verified imports; current mutable notes have separate exact snapshots. The inventory compares paths/sizes/timestamps and hashes changed non-database candidates, building on prior archive verification rather than freshly hashing the entire collection. Credentials and reproducible runtime caches are excluded.

**Resume:** chapter15 spansPDF497–511, final group33–35, both fifteenth colophons on511. Chapter16 opens512; its ending is unestablished. Full497–513 and enlarged497–508 have been inspected. **Next inspect enlarged509–511**, plus recheck the second tree name on504. The enlarged509–511 images are rendered but uninspected. Twelve surviving English groups include cross-page continuations499–500,501–502 and508–509. Preserve source corrections, uncertain Indic terms, the untranscribed Tamil gloss on506, source grammar/quantities and canceled bed-size trial510. Do not claim diplomatic completeness or Sanskrit fidelity.

No new scripture body or database change is included in this release. All earlier actual-text gaps remain. Git carries scripts and notes; private release assets carry the large corpus. Cloning Git alone does not download the database.

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

Chapter17’s existing English is imported with corrected headings/word readings, four unfinished endings, source clarification note521 and source grammar explicit. Chapter18 Saivavratacarana vidhih opensPDF526/handwritten527; full526–527 are inspected, ending unestablished. PDF527 is handwritten529 with group5–8½; apparent local528 gap/group2–4 unobserved, missing extent or displacement unresolved. Inspect528 onward and enlarged English crops before any capture. Preserve all earlier gaps and uncertainties; do not invent missing English or claim fidelity from fluent English. The corpus remains incomplete.

## Paste into the new chat

> Continue private scripture collection from docs/content/private-corpus-continue-on-other-pc.md. Restore all25 private releases in dependency order, replay imports through Caryāpāda17, and run verify_kirana_carya17_checkpoint.py and refresh_kirana_carya17_checkpoint.py last. Prefer chapter8 correction01 and retain its original audit capture. Chapter17 is document12500/body1238205,6,990characters,7groups,PDF519–525; preserve provisional corrected headings/words,fourunfinishedendings,clarificationnote521/sourcegrammar and all earlier gaps. Resume chapter18 Saivavratacarana vidhih fromPDF526/handwritten527;full526–527 inspected,ending unestablished. PDF527handwritten529 with5–8½,apparent local528gap/group2–4unobserved;missing extent/displacement unresolved. Read carya18-opening-evidence.json,inspect528 onward,then enlarged English crops. Work as one unified project; earlier Stream A/B boundaries were superseded. Capture actual existing English,retain collected other languages,verify exact body/metadata/FTS/source evidence and privately back up each delta. No generated translations,embeddings,audio,app import/publication or source-owner contact. Collection,tool installation and private GitHub backup are authorized. Broader actual-text gaps remain; corpus incomplete.

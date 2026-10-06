# Continue collection on another PC — 5 October 2026

## Backup pending: repository is currently public

**Chapters17 and18 are imported and verified locally. Their sealed archives have not been uploaded.** GitHub reports `chettyv/Sandhya` as public; the uploader stopped at its private-destination guard before creating the chapter17 release. An unauthenticated check also found the repository and existing chapter16 release accessible. See [the visibility and pending-backup record](private-corpus-backup-visibility-2026-10-06.md).

The latest published restore checkpoint is **chapter16 across24 releases**. Automated restoration requires the private-destination check to pass. Resolve repository privacy and publish both prepared deltas before attempting their remote restore commands. Earlier “private release” wording is historical; it does not describe current visibility. No visibility change or public corpus upload has been made by this task while the destination choice is pending.

## Current local checkpoint: chapter18 imported; backup26 pending

Kiraṇa Caryāpāda18’s surviving existing English on observing Śaiva vratas is stored as document **12501**, body **1238206**: **3,356 characters**, two groups and three English pages **526–528**. The Sanskrit eighteenth colophon is on527 and the English one on528. Group5–8½ continues527–528. **Group2–4 is unobserved in this local sequence**, with an apparent handwritten528 gap. Possible displacement elsewhere in the761-pagePDF is unresolved. A header OCR trial recognized only one of three known folios and failed calibration; it did not search the fullPDF and cannot establish absence. Source corrections, uncertain insertions, spelling, grammar and empty gloss parentheses remain explicit. No generated translation or independent fidelity certification.

All **36 preferred captures** passed exact file/body/import/metadata/FTS, original source PDF BLOB, preview hashes and foreign-key checks: **286,120 stored characters,352 inspected chapter pages and302 groups**. The repeated chapter18 import added no duplicate. The database contains **1,238,206 bodies,12,501 documents and171 PDF assets**,9,783,201,792 bytes; SHA256 `2dd98a851b5be525ad936064c16ce701f5a8ed5371135a30340c5de7f3803f3d`. Counts overlap editions/passages; the corpus remains incomplete and earlier gaps remain.

The local chapter18 archive has **18 individually verified files**,1,360,601 source bytes and1,082,894 compressed bytes; manifest SHA256 `4b4a30e132b94dcaa91ead3f0d420443b859f9e55e141f47a4940361febb80a0`. It includes the body/evidence/scripts/reports,seven new previews/crops,the failed calibration report and chapter19 opening evidence. It is **local only**, with no remote release or download verification. See [the local archive receipt](private-corpus-carya18-local-transfer.json). Chapter17’s local25-file archive is also awaiting upload. Neither is available from Git alone.

**After both deltas are actually published to the approved private destination**, restore the24 earlier releases and the chapter17 delta, then chapter18. The following commands are conditional instructions, not evidence of publication:

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-06-carya18 --directory content/_staging/transfer/private-corpus-2026-10-06-carya18 --manifest-sha256 4b4a30e132b94dcaa91ead3f0d420443b859f9e55e141f47a4940361febb80a0
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya18.py" --chapter 18
python "$corpusRoot/verify_kirana_carya18_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya18_checkpoint.py"
```

Stop on any error. Replay imports in order; run the newest verifier/refresher last. Never rerun sealed recorders or older checkpoint writers over expanded state. Cross-machine SQLite physical hashes can differ; exact body/metadata/FTS verification and a freshly generated local receipt establish the restored state. Separate historical snapshots from current notes. The prepared chapter17 finalizer expects an older database/inventory and must be adapted before use against chapter18 state.

**Next:** Caryāpāda19 **Sadhakavratacarana vidhih** opensPDF529/handwritten531. Full529–531 are inspected; the ending is unestablished. PDF530 has group2–4, and531 has unnumbered English continuation with older531/current534 numbering. An apparent local handwritten533 gap and continuation extent remain unresolved. Inspect532 onward, then enlarged English crops; keep chapter18’s missing2–4 open. Read `kirana-handwriting-source-map/carya19-opening-evidence.json` and the actual-text gap ledger. All following chapter17 checkpoint values are historical.

## Historical local checkpoint: chapter17 imported; backup25 pending

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

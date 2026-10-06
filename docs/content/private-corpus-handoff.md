# Private corpus handoff — 5 October 2026

## Backup pending: repository is currently public

**Chapters17–20 are imported and verified locally. Their sealed archives have not been uploaded.** GitHub reports `chettyv/Sandhya` as public; the uploader stopped at its private-destination guard before creating the chapter17 release. An unauthenticated check also found the repository and existing chapter16 release accessible. See [the visibility and pending-backup record](private-corpus-backup-visibility-2026-10-06.md).

The latest published restore checkpoint is **chapter16 across24 releases**. Automated restoration requires the private-destination check to pass. Resolve repository privacy and publish all four prepared deltas before attempting their remote restore commands. Earlier “private release” wording is historical; it does not describe current visibility. No visibility change or public corpus upload has been made by this task while the destination choice is pending.

## Current local checkpoint: chapter20 imported; backup28 pending

Kiraṇa Caryāpāda20’s surviving existing English on guruvratas is stored as document **12503**, body **1238208**: **12,873 characters**, twelve groups and fifteen English pages **535–549**. Four groups continue across539–540,543–544,545–546 and547–548. The last visible numbered group is33–37(a);the closing English on549 begins mid-phrase after an apparent handwritten552 gap. Its missing beginning,final verse address,extent and possible displacement elsewhere remain unresolved. The English twentieth colophon is on549;no Sanskrit twentieth colophon was observed in this bounded sequence. Copyright page550 is not scripture;chapter21 opens551. Corrected headings,uncertain quantities/terms,unfinished word ending on541,empty glosses and source grammar remain explicit. No generated translation or independent fidelity certification.

All **38 preferred captures** passed exact file/body/import/metadata/FTS,original sourcePDFBLOB,preview hashes and foreign-key checks: **305,101 stored characters,373 inspected chapter pages and319 groups**. Repeating chapter20’s import added no duplicate. The current local database has **1,238,208 bodies,12,503 documents and171 PDF assets**,9,783,201,792 bytes; SHA256 `0c4b518883786a667e3420bd318126c27cf0e102fd97798b5e8b1bdb543b6387`. Counts overlap editions/passages;the corpus remains incomplete. The main Agama gap-table row now agrees with the structured ledger:Kriyāpāda1–18 andCaryāpāda1–20 surviving captures are present with their omissions retained;Caryāpāda21–27,Yogapāda1–7,Ramakantha7–12 and all earlier gaps remain open.

The chapter20 local archive passed verification for **44 individual files**,6,489,137 source bytes and5,693,193 compressed bytes;manifest SHA256 `0d1868c005e758fe9b7dea5b56177e1272ea0175b9c4b01aa48546bc8ee285dd`. It includes body/evidence/scripts/reports,34new previews/crops andchapter21 opening evidence. See [the local archive receipt](private-corpus-carya20-local-transfer.json). **Chapters17–20 are local-only unpublished deltas.** GitHub was rechecked and still reports the destination public;the private guard remains enabled. Published restore checkpoint remainschapter16/24releases. Git carries these notes,not the pending corpus archives.

**Only after actual publication to the approved private destination**,restore24 earlier releases and the chapter17/18/19 deltas,thenchapter20:

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-06-carya20 --directory content/_staging/transfer/private-corpus-2026-10-06-carya20 --manifest-sha256 0d1868c005e758fe9b7dea5b56177e1272ea0175b9c4b01aa48546bc8ee285dd
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya20.py" --chapter 20
python "$corpusRoot/verify_kirana_carya20_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya20_checkpoint.py"
```

Stop on errors;run the newest verifier/refresher last. Never rerun sealed recorders or older writers over expanded state. Exact body/metadata/FTS verification is authoritative acrossPCs;refresh the local receipt. Chapter19 snapshots are preserved separately under `content/_staging/transfer/carya19-checkpoint-before20/`. Older backup finalizers need adaptation to the expanded database/inventory. Source ritual,magical and health/purity assertions remain historical quotation.

**Next:** Caryāpāda21 **Avyaktalingalaksana vidhih** opensPDF551/handwritten554. Full551–553 are inspected;ending unestablished. Group2–3 is on552;4–7 on553 continues. Inspect554 onward,thenenlargedEnglish crops. Read `kirana-handwriting-source-map/carya21-opening-evidence.json`. Keep20’s apparent552 gap/partial closing and all earlier gaps open. Following chapter19 values are historical.

## Historical local checkpoint: chapter19 imported; backup27 pending

Kiraṇa Caryāpāda19’s surviving existing English on sadhaka vratas is stored as document **12502**, body **1238207**: **6,108 characters**, five groups and six English pages **529–534**. The Sanskrit nineteenth colophon is on533 and the English one on534; final14–17½ continues533–534. The local handwritten sequence jumps532→534. The unnumbered English onPDF531 may be a partial5–9 continuation; its missing beginning,address,extent and possible displacement elsewhere remain unresolved. No whole-PDF absence has been established. Source corrections,provisional word ending on533,empty glosses,unmatched parenthesis and comparison grammar are explicit. No generated translation or independent fidelity certification.

All **37 preferred captures** passed exact file/body/import/metadata/FTS,original sourcePDFBLOB,preview hashes and foreign-key checks: **292,228 stored characters,358 inspected chapter pages and307 groups**. The repeated chapter19 import added no duplicate. The current local database has **1,238,207 bodies,12,502 documents and171 PDF assets**,9,783,201,792 bytes; SHA256 `4f1e3a7a936087f473317d261f2234d506744ef80ec14176bb7440c779cdfca3`. These counts overlap editions/passages; the corpus remains incomplete and earlier gaps remain.

The local chapter19 archive passed verification for **21 individual files**,2,600,007 source bytes and2,245,451 compressed bytes; manifest SHA256 `c3c0ca7a940e46dc9266f198d43082e543ed5773371010eff5a9611c9b0bc14f`. Its body/evidence/scripts/reports,eleven new previews/crops and chapter20 opening evidence are **local only**. See [the local archive receipt](private-corpus-carya19-local-transfer.json). Chapters17–19 remain unpublished pending an approved private destination. The latest published checkpoint remains chapter16/24releases; notes pushed to Git do not carry these corpus deltas.

**Only after actual private publication**,restore24 earlier releases and the chapter17/18 deltas,thenchapter19:

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-06-carya19 --directory content/_staging/transfer/private-corpus-2026-10-06-carya19 --manifest-sha256 c3c0ca7a940e46dc9266f198d43082e543ed5773371010eff5a9611c9b0bc14f
$corpusRoot = 'content/_staging/raw/english/source-review-2026-10-02'
python "$corpusRoot/append_kirana_source_carya19.py" --chapter 19
python "$corpusRoot/verify_kirana_carya19_checkpoint.py"
python "$corpusRoot/refresh_kirana_carya19_checkpoint.py"
```

Stop on errors;run the newest verifier/refresher last. Never rerun sealed recorders or older checkpoint writers over expanded state. Exact body/metadata/FTS verification is authoritative acrossPCs;refresh the local database receipt. Chapter18 checkpoint snapshots are separate under `content/_staging/transfer/carya18-checkpoint-before19/`. Older backup finalizers need adaptation to the expanded database/inventory.

**Next:** Caryāpāda20 **Guruvratacarana vidhih** opensPDF535/handwritten538. Full535 is inspected;ending unestablished. Inspect536 onward,thenenlargedEnglish crops. Read `kirana-handwriting-source-map/carya20-opening-evidence.json`. Keep19’s apparent533 gap/partial continuation,18’s missing2–4 and all earlier gaps open. Following chapter18 values are historical.

## Historical local checkpoint: chapter18 imported; backup26 pending

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

**Newest body checkpoint:** Caryāpāda12 surviving English is imported with an apparent local handwritten473 gap and partial unnumbered fragment retained. Follow [the current cross-PC instructions](private-corpus-continue-on-other-pc.md) for all eighteen releases and chapter12 replay/verifier/refresher. Next recovery is chapter13,PDF481; inspect483 onward. Collection remains incomplete; earlier resume points below are historical.

**Newest body checkpoint:** Caryāpāda11 surviving English is imported, with local scan gaps and unfinished closing retained. Follow [the current cross-PC instructions](private-corpus-continue-on-other-pc.md) for all seventeen releases and chapter11 replay/verifier/refresher. Next recovery is chapter12,PDF471; inspect473 onward. The corpus remains incomplete. Older chapter11 frontier notes below are historical.

**Current cross-PC entry point:** [continue-on-other-PC instructions](private-corpus-continue-on-other-pc.md) lists all sixteen private releases and the precise unfinished chapter11 frontier. Restore/replay through chapter10, then the new image/note supplement. The database is unchanged; chapter11 has no imported body. Older resume points below are historical.

**Newest imported body:** Caryāpāda10 is stored; restore/replay its fifteenth-release update after the preceding fourteen releases. Use [the latest resume instructions](private-corpus-latest-resume.md) and chapter10 verifier/refresher last. Next collection is chapter11 fromPDF461, inspected through465; establish its ending by inspecting466 onward.

**Newest imported body:** Caryāpāda9 is stored; restore and replay its fourteenth-release update after the thirteen earlier releases. Read the first section of [private-corpus-latest-resume.md](private-corpus-latest-resume.md). Next capture is chapter10, PDF455–460; older chapter9 pending notes below are historical.

**Latest cross-PC instructions:** [private-corpus-pc-handoff.md](private-corpus-pc-handoff.md) adds a thirteenth private supplement with pending source images and precise resume notes. Replay the twelve earlier releases described here and in the latest resume notes first. Caryāpāda9–10 have inspected boundaries but no imported bodies; the database remains at the chapter8 correction01 checkpoint.

The user requested that all current work be pushed with notes so collection can continue on another PC. The repository is private: `chettyv/Sandhya`. Application code and documentation travel through Git; the much larger private source collection travels through the repository's private release assets. Do not add the database or raw scans to ordinary Git history.

**Transfer complete.** All 60 archive parts and both manifests passed GitHub's remote SHA256/size checks. Real authenticated downloads of both manifests and the final data part also passed through the same helper used by the restore command. The private release is [private-corpus-2026-10-05](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05). The committed `private-corpus-transfer.json` contains the verified completion receipt and expected manifest checksum. This completes the transfer of collected work; the scripture collection itself still has the gaps below.

**Latest resume point:** Kriyāpāda10–18 and Caryāpāda1–8's surviving English were subsequently captured and imported. Read [private-corpus-latest-resume.md](private-corpus-latest-resume.md), applying10–12 below, then chapter13,14–16, resume,17–18, Caryāpāda1,2–3,4–6 and7–8 updates, followed by chapter8 title correction01, in order. Next collection is Caryāpāda9 atPDF445. Earlier omissions, uncertainties, chapter4 ordinal discrepancy, chapter6 displaced closing page and chapter7 clipped/unfinished words remain explicit. Frozen base and older supplements remain unchanged.

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

> Continue private scripture collection from `docs/content/private-corpus-handoff.md` and `docs/content/private-corpus-latest-resume.md`. Work as one unified project; prior Stream A/B assignments do not apply. Restore all twelve private releases through Caryāpāda7–8 and chapter8 title correction01 in dependency order, replay their imports, then run the newest correction-aware verification/refresher. Prefer corrected chapter8 doc12491/body1238196; original capture is preserved for audit. Read the current gap ledger. Resume Kiraṇa Caryāpāda9 atPDF445/handwritten441; opening and446 inspected, ending unestablished and no body imported; inspect447 onward. Preserve earlier omissions, uncertainties, chapter4 ordinal mismatch, chapter6 displaced ending and chapter7 clipped/unfinished words. Prioritize actual existing English bodies and preserve other languages. Do not generate translations, embeddings, audio or app content, publish the corpus or claim full completeness.

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

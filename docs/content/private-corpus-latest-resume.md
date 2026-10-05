# Latest private corpus resume notes — 5 October 2026

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

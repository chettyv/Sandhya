# Continue the private corpus on another PC

The current work is backed up to the private `chettyv/Sandhya` repository. Git contains the scripts and notes; the large database, source scans, extracted text and previews are in private GitHub release assets. Cloning Git alone does not download the corpus.

The latest imported text is Kiraṇa Caryāpāda chapter 12’s surviving English: document 12495, body 1238200, with 7,599 stored characters across nine groups or fragments. The database contains **1,238,200 text bodies, 12,495 documents and 171 PDF assets**. Counts overlap editions and passages; the corpus remains incomplete. Chapter 12’s apparent local gap at handwritten page 473 and partial unnumbered English remain explicit.

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

Caryāpāda13 **Mahapatakadi prayascitta vidhih** opens **PDF481/handwritten480**. Full481–482 have been inspected; its ending is unestablished and no body is imported. Read `kirana-handwriting-source-map/carya13-opening-evidence.json`, then inspect483 onward to locate its ending and review enlarged English crops before capture.

Chapter12 is stored fromPDF471–480,final23½,Sanskrit twelfth colophon479 and English twelfth colophon480. Handwritten473 appears absent betweenPDF474/475; the surviving English475 is unnumbered with unresolved verse address/missing beginning or extent between6–7 and12. Keep that fragment and gap explicit. Apparent handwritten462/468 gaps and chapter11’s unfinished English closing remain unresolved as well. These are local sequence gaps, not proof that missing pages are absent from the whole original761-pagePDF. Use explicit handwritten maps and check displacement when feasible; invent no text.

Keep source corrections, quantities, spellings/grammar and historical caste/food/ritual-pollution claims as attributed quotation, not universal present-day practice or health guidance. Retain other source anomalies and the broader ledger in `private-corpus/remaining-actual-text-gaps.md`.

## Paste into the new chat

> Continue private scripture collection from docs/content/private-corpus-continue-on-other-pc.md. Restore all eighteen releases in dependency order, replay imports through Caryāpāda12, and run verify_kirana_carya12_checkpoint.py and refresh_kirana_carya12_checkpoint.py last. Work as one unified project; earlier StreamA/B boundaries were superseded. Prefer chapter8 title correction01 and retain its original audit capture. Preserve earlier omissions/anomalies, chapter11’s apparent handwritten462/468 gaps/unfinished closing, and chapter12’s apparent handwritten473 gap/partial unnumbered English475 with unresolved address/missing extent. Resume Caryāpāda13 Mahapatakadi prayascitta vidhih fromPDF481/handwritten480;481–482 inspected, ending unestablished and no body imported. Inspect483 onward, capture actual existing English, retain other languages, verify stored body/metadata/FTS/source evidence and privately back up each delta. No generated translations, embeddings, audio, app import or publication. The user authorized collection, tool installation and private GitHub backup. The corpus remains incomplete.

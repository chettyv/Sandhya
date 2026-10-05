# Continue the private corpus on another PC

The current work is backed up to the private `chettyv/Sandhya` repository. Git contains the scripts and notes; the large database, source scans, extracted text and previews are in private GitHub release assets. Cloning Git alone does not download the corpus.

The latest imported text is Kiraṇa Caryāpāda chapter 11’s surviving English: document12494/body1238199,8,947characters/ten groups. The database contains **1,238,199 text bodies, 12,494 documents and 171 PDF assets**. Those counts include overlapping editions and passages; the corpus remains incomplete. Chapter11’s apparent scan gaps and unfinished ending remain explicit.

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

## Exact resume point

Caryāpāda11, **Acarya varjyavarjya vidhih**, spans surviving PDF pages461–470. All full pages461–472 and ten enlarged English crops461–470 have been inspected. The final source heading is24–27½; Sanskrit eleventh colophon470. English ends mid-sentence and has no English closing colophon in that sequence. The ten surviving English groups are now stored; earlier frontier snapshots describing them as pending are historical.

Handwritten462 appears absent between PDF465/466; English12–14(a) is absent locally. Handwritten468 appears absent between PDF470/471, with the chapter11 ending unfinished. These are apparent local scan/placement gaps: do not claim those pages are absent from the entire original PDF without checking for displacement. Do not invent their text. **After PDF465, the handwritten page number is no longer PDF minus4.** Use the explicit mapping and provisional-word notes in the archived frontier.

Next, continue chapter12, **Asauca Vidhih**, from PDF471/handwritten469;472 has been inspected and its ending is unestablished. Read `kirana-handwriting-source-map/carya12-opening-evidence.json`, then inspect473 onward. Retain chapter11’s apparent local gaps; their placement elsewhere in the full original PDF remains unresolved. Keep broader missing texts recorded in `private-corpus/remaining-actual-text-gaps.md`.

## Paste into the new chat

> Continue private scripture collection from docs/content/private-corpus-continue-on-other-pc.md. Restore all seventeen releases in dependency order and replay imports through Caryāpāda11. Run verify_kirana_carya11_checkpoint.py and refresh_kirana_carya11_checkpoint.py last. Work as one unified project; earlier StreamA/B boundaries were superseded. Prefer chapter8 title correction01, retain its original audit capture, and preserve all earlier source anomalies. Chapter11’s ten surviving English groups are imported with apparent handwritten462/468 gaps, missing12–14(a), incomplete ending and provisional words explicit; use the nonconstant handwritten map. Resume Caryāpāda12 Asauca Vidhih atPDF471/handwritten469,471–472 inspected and ending unestablished; inspect473 onward. Capture actual existing English and keep other languages, verify storage/evidence and privately back up each delta. No generated translations, embeddings, audio, app import or publication. The user authorized collection, tool installation and private GitHub backup. The corpus remains incomplete.

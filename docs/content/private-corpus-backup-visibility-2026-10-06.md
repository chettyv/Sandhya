# Corpus backup visibility — 6 October 2026

GitHub currently reports `chettyv/Sandhya` as **public**. An authenticated repository API request returned HTTP200 with `private:false`. A separate request without authentication returned the same result. The existing chapter16 release endpoint also returned HTTP200 and listed three assets without authentication. This establishes current access; it does not establish who changed visibility or when.

The chapter17 uploader stopped at the private-destination guard in `scripts/private-corpus/common.py` before creating a release or uploading corpus files. The chapter17 release endpoint returned HTTP404. The guard remains enabled.

Chapter17 is imported and verified **on this PC** as document12500/body1238205,6,990 stored characters. Exact file/body/import/metadata/FTS, original source PDF BLOB, preview hashes, foreign keys and an idempotent repeat import passed. The current database has1,238,205 bodies,12,500 documents and171 PDF assets. SHA256: `1c7aae36d0b110024e55aa36e070698ccb7757368e90bd0287b8facaf0aeec73`,9,783,201,792 bytes.

The local chapter17 archive has25 individually verified files,3,309,802 source bytes,2,855,316 compressed bytes. Its sealed manifest is at `content/_staging/transfer/private-corpus-2026-10-06-carya17/manifest.json`; manifest SHA256: `af595646753d44cf5039397b7d399c202fb83c22b2dcace9374d830e74b4e171`. It contains the body/evidence/scripts/reports,fifteen newer previews and chapter18 opening evidence. It has **not** been uploaded or verified remotely. Do not mistake the prepared local archive for a completed backup.

The latest published and verified restore checkpoint is chapter16 across24 releases, with1,238,204 bodies and12,499 documents. Older statements calling those releases “private” describe their previously verified visibility; current public access supersedes that visibility claim. Restore tooling also enforces the private-repository check, so resolve the destination’s privacy before automated restoration. Chapter17 cannot be restored until its delta has actually been published to an approved private destination.

The user has been asked whether to make the existing repository private or use a separate private corpus repository. No visibility change, migration, release deletion or public corpus upload is authorized by elapsed waiting time. The remaining corpus collection goal stays active; source reading/local acquisition can continue while the destination decision is pending.

## Historical local progress: chapter18 imported

Chapter18’s surviving English onPDF526–528 is now imported as document12501/body1238206,3,356characters and two groups. The current database has1,238,206bodies,12,501documents and171PDFassets;9,783,201,792bytes,SHA256 `2dd98a851b5be525ad936064c16ce701f5a8ed5371135a30340c5de7f3803f3d`. Exact body/metadata/FTS, originalPDFBLOB,preview hashes,foreign keys and repeated idempotent import passed across36preferred captures. Earlier chapter17 values above are a historical checkpoint.

Its local18-file archive passed individual-file verification; manifest SHA256 `4b4a30e132b94dcaa91ead3f0d420443b859f9e55e141f47a4940361febb80a0`. It has not been uploaded. Both chapter17 and18 remain local-only pending deltas; latest published checkpoint remains chapter16/24releases. See [the chapter18 local receipt](private-corpus-carya18-local-transfer.json).

Chapter18 group2–4 remains unobserved locally. A folio-header OCR candidate trial failed its known-page calibration (one of three recognized); no whole-PDF search followed and absence/displacement remains unresolved. No OCR scripture was imported. Source uncertainties remain explicit. The four temporary528–531 previews were hash-checked and added to the collection root; together with three enlarged English crops they are in the local chapter18 archive. Chapter17 checkpoint snapshots are preserved separately under `content/_staging/transfer/carya17-checkpoint-before18/`.

Chapter19 opensPDF529/handwritten531;full529–531 inspected,ending unestablished. An apparent local handwritten533 gap before current534 remains unresolved. Next inspect532 onward and enlarged English crops. The acquisition goal remains active while the private destination decision is pending.

## Historical local progress: chapter19 imported

Chapter19’s surviving existing English onPDF529–534 is stored as document12502/body1238207,6,108characters,five groups. The local database has1,238,207bodies,12,502documents and171PDFassets;9,783,201,792bytes,SHA256 `4f1e3a7a936087f473317d261f2234d506744ef80ec14176bb7440c779cdfca3`. All37preferred captures passed storage/search/source checks;repeat import was idempotent. The local21-file archive passed individual-file verification;manifest SHA256 `c3c0ca7a940e46dc9266f198d43082e543ed5773371010eff5a9611c9b0bc14f`. See [the local receipt](private-corpus-carya19-local-transfer.json).

Chapter19’s apparent local handwritten533 gap and unnumbered531 continuation address/missing beginning/extent remain unresolved. Source corrections,word ending and grammar are explicit. No fullPDFabsence or independent fidelity claim. Chapters17–19 archives have not been uploaded;published checkpoint remains16/24releases. The private-destination choice remains pending. Older17/18database values above are historical.

Next collectchapter20,openingPDF535/handwritten538,ending unestablished;inspect536onward. Preserve exactchapter18checkpoint snapshots separately under `content/_staging/transfer/carya18-checkpoint-before19/`. No background acquisition job is running after this local checkpoint.

## Latest local progress: chapter20 imported

An authenticated visibility recheck still returnedHTTP200/private:false for `chettyv/Sandhya`. The pending choice remains unanswered;no public corpus upload or visibility change was made. Latest published checkpoint remainschapter16/24releases. Chapters17–20 deltas are local only.

Chapter20 is stored as document12503/body1238208,12,873characters,twelve groups,fifteenEnglishpages535–549. The local database has1,238,208bodies,12,503documents and171PDFassets;9,783,201,792bytes,SHA256 `0c4b518883786a667e3420bd318126c27cf0e102fd97798b5e8b1bdb543b6387`. All38preferred captures passed storage/search/source checks and repeat import was idempotent. Its44-file local archive passed individual-file verification;manifest SHA256 `0d1868c005e758fe9b7dea5b56177e1272ea0175b9c4b01aa48546bc8ee285dd`. See [the local receipt](private-corpus-carya20-local-transfer.json).

The apparent local handwritten552 gap and partial closing continuation remain unresolved;no wholePDFabsence claim. Corrected headings,quantities,unfinished word ending and source grammar are explicit. English twentieth colophon is on549;Sanskrit closing not observed locally. The Agama gap-table row is reconciled with the structured ledger through20. Earlier17–19database values above are historical.

Next collectchapter21,openingPDF551/handwritten554;full551–553 inspected,ending unestablished. Inspect554 onward. Exactchapter19snapshots are separate under `content/_staging/transfer/carya19-checkpoint-before20/`. No background acquisition job is running after this checkpoint.

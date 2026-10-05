# Continue collection on another PC — 5 October 2026

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

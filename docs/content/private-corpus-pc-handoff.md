# Continue collection on another PC — 5 October 2026

The private corpus database currently contains **1,238,197 bodies, 12,492 documents and 171 PDF assets**. It remains incomplete. The latest imported scripture is Caryāpāda9. Chapter8's additive source-title correction01 remains preferred; chapters10–11 have no body imported.

**Newest body update:** after the thirteen releases described below, restore and replay [Caryāpāda9](private-corpus-latest-resume.md) as the fourteenth release. Use its new verifier/refresher last. The historical chapter9 frontier in the PC supplement is now superseded. Next collection is chapter10, PDF455–460.

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

> Continue private scripture acquisition using docs/content/private-corpus-pc-handoff.md, private-corpus-handoff.md and private-corpus-latest-resume.md. Work as one unified project; previous StreamA/B boundaries were superseded. Restore all fourteen private releases in dependency order, replay imports through Caryāpāda9, and run verify_kirana_carya09_checkpoint.py and refresh_kirana_carya09_checkpoint.py last. Chapter8 title correction01 remains preferred. Resume existing English capture for Caryāpāda10 PDF455–460; inspect its six enlarged crops, mark uncertain/clipped wording, then create versioned evidence/append/verification scripts and import exact source text. Chapter11 begins461, inspected through465, ending unestablished; inspect466 afterward. Preserve all earlier sealed files and source gaps. English first, retain existing other languages. No generated translations, embeddings, audio, app import or publication. The user authorized collection, tool installation and private GitHub handoff. Do not claim a complete corpus.

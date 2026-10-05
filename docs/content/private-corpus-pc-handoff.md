# Continue collection on another PC — 5 October 2026

The private corpus database currently contains **1,238,196 bodies, 12,491 documents and 171 PDF assets**. It remains incomplete. The latest imported scripture is Caryāpāda8, with its additive source-title correction01; chapters9–11 have no body imported.

Clone or pull `chettyv/Sandhya`, then follow [the base handoff](private-corpus-handoff.md) and [the ordered updates](private-corpus-latest-resume.md). Restore all twelve earlier private releases and replay their append commands in order. Run the newest correction-aware verification and checkpoint refresher. Do not restore the frozen database over an expanded working database.

Finally restore the [PC handoff supplement](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-pc-handoff):

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-pc-handoff --directory content/_staging/transfer/private-corpus-2026-10-05-pc-handoff --manifest-sha256 09b8f08474aa08ccf41f49673aeb1a04fdea12b2b1eb55c46006563f102902c6
```

This adds **41 files**:35 newer source-page images/crops, a detailed pending-work note and five separate snapshots of current notes/receipts. It contains **no new database or scripture bodies**. Snapshots remain in their own folder; do not copy them over the regenerated live notes. Read `content/_staging/raw/english/source-review-2026-10-02/handoff-2026-10-05-pc/collection-frontier.md`.

The frontier is more advanced than the older release notes:

| Pending chapter | Source PDF pages | State |
| --- | --- | --- |
| Caryāpāda9, Gocaravidhih | 445–454 | Boundary and all ten enlarged reading crops inspected; eight groups ending29½. Transcription, uncertainty checks and import remain. |
| Caryāpāda10, Vratesvarayagavidhih | 455–460 | Boundary and full pages inspected; six groups ending15½. Six enlarged crops rendered but still need inspection. Clipped words and a correction remain unresolved. |
| Caryāpāda11, Acarya varjyavarjya vidhih | 461 onward | Full pages461–465 inspected; ending unestablished. Inspect466 next after completing9–10. |

Keep original source grammar, unresolved Indic readings, corrections and clipped fragments explicit. Do not invent completions or generate translations. Earlier omissions, summaries, chapter4 ordinal discrepancy, chapter6 displaced ending and chapter7 clipped/unfinished words remain recorded.

The new archive passed local decompression and all41 individual-file hashes before upload. The completion receipt will record authenticated remote download verification. The full source inventory now has **93,927 files** and **41,101,375,032 bytes**. Database and mutable working notes are reconstructed from the frozen baseline plus verified replay/refresher commands; archive counts are not unique scripture counts.

## Paste into the new chat

> Continue private scripture acquisition using docs/content/private-corpus-pc-handoff.md, private-corpus-handoff.md and private-corpus-latest-resume.md. Work as one unified project; previous StreamA/B boundaries were superseded. Restore all thirteen private releases in dependency order, replay imports through Caryāpāda8 title correction01, and run the newest correction-aware verifier/refresher. Read the pending frontier note in handoff-2026-10-05-pc. Resume existing English transcription for Caryāpāda9 PDF445–454 and10 PDF455–460; inspect chapter10 enlarged crops before capture, mark uncertain/clipped wording, then create versioned evidence/append/verification scripts and import exact source text. Chapter11 begins461, inspected through465, ending unestablished; inspect466 afterward. Preserve all earlier sealed files, source gaps and corrected chapter8 preference. English first, retain existing other languages. No generated translations, embeddings, audio, app import or publication. The user authorized collection, tool installation and private GitHub handoff. Do not claim a complete corpus.

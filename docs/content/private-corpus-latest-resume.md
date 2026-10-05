# Latest private corpus resume notes — 5 October 2026

Read this after `private-corpus-handoff.md`. Its main archive and preview supplement remain frozen. A subsequent small body update adds actual existing English for Kiraṇa Kriyāpāda chapters **10–12**. Restore all three releases and apply that update before resuming collection on another PC.

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

## Exact next recovery

**Kriyāpāda chapter 13, Astrayāgavidhih**, starts at PDF page **340**, handwritten page **337**. Its opening was inspected. No chapter-13 body has been imported and its ending boundary has not yet been established.

The remaining substantial Kiraṇa acquisition work is Kriyāpāda **13–18**, Caryāpāda **1–27**, Yogapāda **1–7**, Ramakaṇṭha commentary **7–12**, and the recorded source omissions/uncertain readings. The broader corpus still has the gaps in `private-corpus-gaps-2026-10-05.md` and the restored ledger. Existing other languages remain preserved.

Read the newest top section of the restored `continuation-checkpoint.md`, `private-corpus/remaining-actual-text-gaps.md` and `private-corpus/acquisition-scope-checkpoint.json` after applying the body update. Older notes are historical. **Do not run the old checkpoint writers that assume only nine Kriyāpāda captures.** The new `refresh_post_handoff_checkpoint.py` handles the current state and preserves the frozen receipt.

## Prompt for the other PC

> Continue private scripture collection from `docs/content/private-corpus-handoff.md` and `docs/content/private-corpus-latest-resume.md`. Work as one unified project; prior Stream A/B ownership assignments do not apply to this task. Restore the main private corpus release, preview supplement and Kriyāpāda 10–12 body update, then apply its idempotent database append and verification commands. Read the restored current checkpoint and gap ledger. Resume Kiraṇa Kriyāpāda chapter 13, starting PDF page 340/handwritten337; determine its ending and faithfully capture the existing English with explicit uncertainty and exact evidence before importing. Prioritize actual existing English bodies and preserve other languages. Do not generate translations, embeddings, audio or app content, and do not publish the corpus. Do not claim full corpus completeness.

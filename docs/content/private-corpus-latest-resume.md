# Latest private corpus resume notes — 5 October 2026

Read this after `private-corpus-handoff.md`. The main archive, preview supplement and chapters10–12 update remain frozen. A further update adds actual existing English for **Kriyāpāda13**. Restore releases in order and replay their database append commands before collecting on another PC.

## Latest addition: chapter13

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

## Prompt for the other PC

> Continue private scripture collection from `docs/content/private-corpus-handoff.md` and `docs/content/private-corpus-latest-resume.md`. Work as one unified project; prior Stream A/B ownership assignments do not apply. Restore the frozen base, preview supplement,10–12 update and chapter13 update in order, replaying their append and verification commands. Read the current checkpoint and gap ledger. Resume Kiraṇa Kriyāpāda14 Ganayāgavidhih at PDF350/handwritten347; establish the ending and capture existing English with explicit uncertainty before importing. Prioritize actual existing English bodies and retain other languages. Do not generate translations, embeddings, audio or app content, publish the corpus, or claim full completeness.

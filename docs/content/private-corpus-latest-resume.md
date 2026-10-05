# Latest private corpus resume notes — 5 October 2026

Read this after `private-corpus-handoff.md`. All older archives remain frozen. The latest update adds actual existing English for **Kriyāpāda chapters 14–16**. Restore the base, preview supplement, 10–12 update, chapter13 update and latest update in order, replaying their append commands.

## Current stopping point for another PC

After applying all body updates below, also restore the [resume supplement](https://github.com/chettyv/Sandhya/releases/tag/private-corpus-2026-10-05-resume). It contains twelve newer reading images, the frozen database receipt, explicit work-in-progress notes and separate snapshots of the latest checkpoint files. Chapters17–18 have been inspected but **have no imported English bodies**. This supplement adds no database rows and requires no append command.

```powershell
python scripts/private-corpus/restore.py --tag private-corpus-2026-10-05-resume --directory content/_staging/transfer/private-corpus-2026-10-05-resume --manifest-sha256 8a1101875ddb7a4f70854d63439edead52a46a2b82f13826c34dc98a12e95b69
```

Read the restored `content/_staging/raw/english/source-review-2026-10-02/handoff-2026-10-05-frontier/collection-frontier.md` next. It records chapter17's PDF367–372 boundary, chapter18's PDF373–383 boundary and explicit end of Kriyāpāda, unresolved readings, and the next Caryāpāda opening at PDF384. First transcribe and import the existing English for17–18; the inspected images are not stored scripture bodies. Preserve earlier omissions and chapter9's summaries.

Checkpoint snapshots are archived under `handoff-2026-10-05-frontier/checkpoint-snapshot/` so restore never overwrites your working database or regenerated notes. Keep them as evidence; use the chapter16 refresher after the preceding database replay to produce current working notes. The next collector should update the ledger when creating the actual17–18 captures. Full corpus acquisition remains unfinished.

**Resume transfer verified:** all three uploaded asset hashes passed, followed by a fresh authenticated download, decompression and checksum check of all21 archived files (about3.5 MB compressed). The completion and current-file coverage receipt is `private-corpus-resume-transfer.json`. The six releases together cover the collected source tree; current database changes travel through verified body replay and mutable checkpoint notes also have exact separate snapshots. Runtime caches, nested Git directories and secret environment files are excluded. The database verification was rerun successfully before the final handoff.

## Latest addition: chapters 14–16

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

## Prompt for the other PC

> Continue private scripture collection from `docs/content/private-corpus-handoff.md` and `docs/content/private-corpus-latest-resume.md`. Work as one unified project; prior Stream A/B assignments do not apply. Restore the base and supplements through chapters14–16, replaying their imports and latest verification/checkpoint commands. Read the current gap ledger. Resume Kiraṇa Kriyāpāda17 Grahayāgavidhih at PDF367/handwritten364; establish the ending and capture existing English with explicit uncertainty before importing. Prioritize actual existing English bodies and preserve other languages. Do not generate translations, embeddings, audio or app content, publish the corpus, or claim full completeness.

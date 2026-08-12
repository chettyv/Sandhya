# Sources & attribution — founder note

Living note. What we hold, what each source needs from you before it can ship, and what only you can obtain. Machine state lives in `docs/source_inventory_template.csv` (432 rows) and `docs/source_download_queue_2026-06-19.csv` (383 rows); this note is the human summary.

## What is already collected on this machine (content/\_staging/raw — not in git)

- **208 downloaded + 34 scraped sources staged**, ~331 MiB: English (Gita translations: Arnold 1885, Besant/Bhagavan Das 1905, Chatterji 1887, more; Upanishads Paramananda; Yoga Sutras Johnston; Ramayana Griffith; Mahabharata Ganguli; Agni/other Purana translations Dutt; Vivekananda), Sanskrit (Wikisource full Gita in Devanagari, GRETIL texts, sanskritdocuments.org: Aditya Hridayam, Bhaja Govindam, Hanuman Chalisa, Lalita Sahasranama, Shiva Mahimna, Soundarya Lahari), plus Bengali, Gujarati, Hindi, Marathi editions.
- ~58 queue rows remain metadata-only (not yet downloaded). Re-run collection any time:
  - `node scripts/stage-gutenberg-english-candidates.mjs` · `stage-internet-archive-english-candidates.mjs` · `stage-gretil-sanskrit-texts.mjs` · `stage-sanskritdocuments-short-texts.mjs` · `stage-vedicreserve-purana-pdfs.mjs` · `scripts/download-source-queue.ps1`
  - then `node scripts/reconcile-downloaded-queue-statuses.mjs` to sync the CSV.

## Attribution each source class needs (add these when you clear rows)

| Source class                                                                                              | Likely status                                                     | What shipping requires                                                                                                                                                                   |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sanskrit originals** (Wikisource/GRETIL/sanskritdocuments)                                              | Original text: public domain. The _digital edition_ carries terms | Attribute the site + page URL; Wikisource needs CC BY-SA share-alike check on page history; GRETIL asks for scholarly credit line                                                        |
| **Pre-1929 English translations** (Arnold 1885, Besant/Das 1905, Chatterji 1887, Ganguli, Griffith, Dutt) | Public domain in USA; ~19 rows flagged "likely PD, verify"        | Verify UK/EU status (author death +70 yrs — all these authors died before 1955, so PD there too); name translator + edition + year on every quote; note OCR needs proofing against scans |
| **Project Gutenberg** (18 rows)                                                                           | Public domain USA                                                 | Strip/comply with PG trademark boilerplate; credit PG                                                                                                                                    |
| **Internet Archive scans**                                                                                | Edition-dependent                                                 | Verify each edition's date; attribute IA item URL                                                                                                                                        |

**Rule of thumb I am applying:** original-language scripture + any translation whose translator died before 1955 = safe to draft from now, cleared by you flipping the inventory row to approved. Anything else stays out.

## What only you can obtain (add to the corpus when you can)

1. **A verse-numbered clean Gita source** — the Wikisource dump mixes verses with Shankara commentary; the cleanest verse-by-verse Devanagari source would be the sanskritdocuments.org Gita ITX files (free to fetch — I can script it) or a proofed Gutenberg Devanagari edition. Nothing to buy; just flag if you have a preferred edition.
2. **Modern translations you'd like** (Eknath Easwaran, Gita Press, Swami Sivananda, ISKCON/Prabhupada): all in copyright. Shipping any excerpt needs written permission from the publisher (Gita Press Gorakhpur and Divine Life Society have historically been permissive for non-commercial; an app with payments is commercial — ask in writing). Until then we ship PD translations only.
3. **Hindi:** Tulsidas (Ramcharitmanas, Hanuman Chalisa), Kabir, Mirabai, Surdas originals are all public domain — the Chalisa is already staged. A good critical edition to copy from (e.g. Gita Press text as _text source_, not their commentary) still needs the same permission logic for that specific printed edition; Wikisource Hindi is the safe route.
4. **Named reviewer sign-off** — every verse that ships needs the reviewer named in the file, regardless of licence.

## Corpus completeness target (so "complete corpus" is checkable)

Tier 1 (free product, PD-safe, achievable now): Bhagavad Gita (700 verses) · principal Upanishads (Isha, Kena, Katha, Mundaka, Mandukya) · Hanuman Chalisa · Aditya Hridayam · Bhaja Govindam · daily-prayer shlokas (Gayatri, Mahamrityunjaya, Shanti mantras — all Vedic, PD).
Tier 2: Ramayana/Mahabharata selections (Griffith/Ganguli PD), Devi Mahatmya, Shiva Mahimna, Soundarya Lahari, Yoga Sutras.
Tier 3 (needs permissions or new reviewers): modern translations, regional canons (Tamil Thevaram/Divya Prabandham, Bengali material).

# Downloadable Content Sources by Language

Review date: 2026-06-01

Goal: identify sources Sandhya can start downloading and inventorying now for Sanskrit, English, Hindi, Tamil, and Marathi. "Download now" does not mean "ship blindly." It means the source is strong enough to put into the content inventory and begin extraction, cleanup, attribution, and human review.

## Short Answer

Use these first:

- **English:** Project Gutenberg public-domain texts for Bhagavad Gita, Upanishads, Yoga Sutras, and Ramayana. Use Sacred Texts / Project Gutenberg for Mahabharata and Sacred Texts for Rig Veda.
- **Sanskrit:** Start with Bhagavad Gita Sanskrit verses and GRETIL candidates. Treat GRETIL as per-file review, not blanket approval.
- **Tamil:** Start with Tirukkural from Project Madurai, especially Tamil original plus G. U. Pope English translation. Contact Project Madurai before public online redistribution and keep headers/credits.
- **Marathi:** Start with Dnyaneshwari and Gita Rahasya as Marathi Gita commentary/tradition sources, not generic Marathi translations of all scripture.
- **Hindi:** No clean, broad Hindi scripture source is safe enough to ingest for a commercial app from the reviewed links. Use in-house/commissioned Hindi for glossary, practice guides, festivals, and summaries first.

Do **not** use Gita Press, BhagavadGita.com translations/commentaries, Gita Supersite, Sanskrit Documents, Vedic Heritage, Wisdom Library, Drik Panchang, Muktabodha, or random GitHub/web PDFs as app corpus without permission.

## English-First Update - 2026-07-06

The active acquisition strategy is now English-first. The repo already has a large staged English corpus, so manual searching should focus on the remaining named gaps rather than more general Hinduism books.

Already broadly covered in English staging:

- Bhagavad Gita translations and Shankara/Ramanuja commentary witnesses.
- Principal Upanishads and additional minor/sectarian Upanishad sources.
- Yoga Sutras plus darshana sources for Nyaya, Vaisesika, Mimamsa, Sankhya, Vedanta, and Hatha Yoga.
- Ramayana, Mahabharata, Harivamsha, Rig/Sama/Yajur/Atharva Veda English witnesses, and several Sacred Books of the East bundles.
- Bhagavata, Vishnu, Markandeya, Devi Bhagavata, Garuda, Agni, Matsya, Brahma Vaivarta, and other Purana or Purana-adjacent sources.
- Tamil Shaiva/Sri Vaishnava/Varkari/Kabir/Ramakrishna/Vivekananda and general reference/context sources.

Still worth collecting manually in English:

| Priority | Target                                                                           | Source type to look for                                                        | Notes                                                                                   |
| -------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| P0       | Standalone Devi Mahatmya / Durga Saptashati                                      | Pre-1931 scan/OCR, or extract from a verified staged Markandeya Purana witness | Needed so Shakta/Navaratri retrieval does not depend on a broad unsegmented Purana OCR. |
| P1       | Lalita Sahasranama                                                               | Old Sanskrit-English stotra edition or anthology                               | Avoid modern web translations without permission.                                       |
| P1       | Hanuman Chalisa English                                                          | Old bilingual edition or in-house reviewed translation                         | Existing lead is Hindi/Awadhi only.                                                     |
| P1       | Shiva Mahimna Stotra English                                                     | Old stotra anthology or bilingual edition                                      | Need translator/date and source URL.                                                    |
| P1       | Aditya Hridayam English                                                          | Old Ramayana/stotra anthology or extract from cleared Ramayana source          | Track whether it is a translation or paraphrase.                                        |
| P1       | Bhaja Govindam English                                                           | Pre-1931 Vedanta/stotra translation                                            | Commentary and attribution boundaries matter.                                           |
| P2       | Soundarya Lahari English                                                         | Older public-domain edition only                                               | A checked candidate appeared too late by title-page date.                               |
| P2       | English Dnyaneshwari/Jnaneshwari                                                 | Public-domain English translation, if available                                | Marathi sources are staged; English may require a translation project.                  |
| P2       | English Gita Rahasya                                                             | Public-domain or licensed English edition                                      | Known English editions are likely later/rights-sensitive.                               |
| P2       | English Kamba Ramayanam                                                          | Old English retelling/translation                                              | Important for Tamil Ramayana tradition.                                                 |
| P2       | English Adhyatma Ramayana                                                        | Old scan/OCR or Gutenberg/IA/HathiTrust item                                   | Useful devotional Ramayana source.                                                      |
| P2       | English Namdev, Eknathi Bhagwat, broader Tukaram/Varkari texts                   | Old translations or anthologies                                                | Some Varkari hagiography is staged; primary devotional coverage remains incomplete.     |
| P2       | Complete/broader Divya Prabandham and Tevaram English                            | Old missionary/scholarly translations, if rights allow                         | Selected Alvar and Tamil Shaiva material is staged, not complete.                       |
| P2       | Narayaneeyam English                                                             | Old edition or permissioned translation                                        | Not staged.                                                                             |
| P3       | Shiva, Padma, Skanda/Kashi, Kurma, Linga, Vayu, Brahmanda, Narada Purana English | Old partial translations or permissioned editions                              | Most complete English editions are modern and should be treated as permission targets.  |
| P3       | Madhva Gita Bhashya and Abhinavagupta Gita commentary English                    | Old or licensed translation                                                    | Needed for broader commentary balance; likely difficult to clear.                       |

Manual collection rule: if a source is not clearly reusable, create a metadata-only row instead of downloading text. Record exact `source_url`, `download_url`, translator/editor, year, rights claim, and why it is blocked.

## Download-Now Candidates

| Language      | Source                                    | Texts covered                                                        | URL                                                                | Format               | Rights status                                                                                                                           | App use now                                                                      | Notes                                                                                                       |
| ------------- | ----------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| English       | Project Gutenberg                         | Bhagavad Gita, Edwin Arnold, `The Song Celestial`                    | https://www.gutenberg.org/ebooks/2388                              | HTML, TXT, EPUB      | Public domain in the USA                                                                                                                | Yes, after stripping PG trademark/license boilerplate or complying with PG terms | Good MVP English Gita source, but poetic/Victorian.                                                         |
| English       | Project Gutenberg                         | Upanishads, Swami Paramananda                                        | https://www.gutenberg.org/ebooks/3283                              | HTML, TXT, EPUB      | Public domain in the USA                                                                                                                | Yes                                                                              | Covers selected Upanishads, not necessarily all 10-13 principal Upanishads required by the app.             |
| English       | Project Gutenberg                         | Yoga Sutras, Charles Johnston                                        | https://www.gutenberg.org/ebooks/2526                              | HTML, TXT, EPUB      | Public domain in the USA                                                                                                                | Yes                                                                              | Good MVP Yoga Sutras source; reviewer should check terminology.                                             |
| English       | Project Gutenberg                         | Valmiki Ramayana, Ralph T. H. Griffith                               | https://www.gutenberg.org/ebooks/24869                             | HTML, TXT, EPUB, PDF | Public domain in the USA                                                                                                                | Yes                                                                              | Good for key passages and summaries; old poetic English.                                                    |
| English       | Project Gutenberg                         | Mahabharata, K. M. Ganguli                                           | https://www.gutenberg.org/ebooks/7864                              | HTML, TXT, EPUB      | Public domain in the USA                                                                                                                | Yes                                                                              | Very large and old prose. Use key passages first.                                                           |
| English       | Sacred Texts                              | Mahabharata, K. M. Ganguli                                           | https://sacred-texts.com/hin/maha/index.htm                        | HTML                 | Site states Ganguli is public domain                                                                                                    | Yes, but prefer PG/scan where available                                          | Preserve source attribution. Avoid copying site-specific navigation/formatting.                             |
| English       | Sacred Texts                              | Rig Veda, Ralph T. H. Griffith                                       | https://sacred-texts.com/hin/rigveda/                              | HTML                 | Likely public domain translation                                                                                                        | Yes, after item review                                                           | Use selected hymns only for MVP; Vedic reviewer needed.                                                     |
| English/Tamil | Project Madurai                           | Tirukkural with Tamil text and G. U. Pope/Drew/Lazarus/Ellis English | https://www.projectmadurai.org/pm_etexts/utf8/pmuni0153.html       | HTML/PDF             | Project says works are public domain or used with consent; distribution allowed with header/credits, contact before online distribution | Yes for internal staging; public app after contact/attribution review            | Best Tamil-first candidate. Keep Project Madurai header and credits in inventory.                           |
| Sanskrit      | BhagavadGita.com copyright page           | Bhagavad Gita original Sanskrit verses                               | https://bhagavadgita.com/copyright                                 | Website/API          | Site says original Sanskrit verses are public domain and may be freely used                                                             | Yes for Sanskrit verses only                                                     | Do not use their translations/commentaries/API for commercial app; they explicitly restrict commercial use. |
| Sanskrit      | gita/gita                                 | Bhagavad Gita JSON                                                   | https://github.com/gita/gita                                       | JSON                 | Unlicense on repo                                                                                                                       | Candidate now                                                                    | Use as structured Gita data only after checking which fields are Sanskrit versus translations/commentary.   |
| Sanskrit      | GRETIL                                    | Sanskrit and Indic e-text corpus                                     | https://gretil.sub.uni-goettingen.de/gretil.html                   | TXT, TEI/XML, ZIP    | Downloadable scholarly corpus; no simple universal app license found                                                                    | Candidate now, per-file review                                                   | Strong for Sanskrit originals; do not treat as blanket cleared.                                             |
| Sanskrit      | INDOLOGY/GRETIL mirror                    | Unicode mirror of GRETIL                                             | https://github.com/INDOLOGY/GRETIL-mirror                          | TXT/XML mirror       | Mirror has no blanket content license                                                                                                   | Candidate now, per-file review                                                   | Useful for stable retrieval and versioning.                                                                 |
| Marathi       | Wikimedia Commons / Internet Archive scan | Dnyaneshwari                                                         | https://commons.wikimedia.org/wiki/File:Dnyaneshwari.djvu          | DJVU/PDF scan        | Public-domain scan/source indicated on Commons                                                                                          | Yes for OCR/inventory; not ready as clean app text                               | Marathi Gita commentary; requires OCR/proofreading and Warkari/tradition note.                              |
| Marathi       | Wikimedia Commons / Internet Archive scan | Gita Rahasya, Bal Gangadhar Tilak                                    | https://commons.wikimedia.org/wiki/File:Geeta_Rahasya_BG_Tilak.pdf | PDF scan             | Public-domain scan/source indicated on Commons                                                                                          | Yes for OCR/inventory; not neutral translation                                   | Important Marathi Gita interpretation, but it is Tilak's commentary, not a general translation.             |

## Conditional Candidates

| Language               | Source                              | URL                                                                         | Use if                                                                                             | Blocker                                                                                    |
| ---------------------- | ----------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Hindi                  | Hindi Wikisource                    | https://hi.wikisource.org/                                                  | We accept CC BY-SA obligations and verify the exact work/translator                                | Sparse/uneven coverage; attribution/share-alike; many pages are scans or partial proofing. |
| Hindi                  | Hindi Wikisource Gita Rahasya pages | https://hi.wikisource.org/wiki/पृष्ठ:गीतारहस्य_अथवा_कर्मयोगशास्त्र.djvu/८५६ | We want Hindi text around Tilak's Gita Rahasya commentary and can comply with Wikisource licensing | Not a clean Hindi Gita translation; page-level extraction and proofing required.           |
| Tamil                  | Tamil Wikisource                    | https://ta.wikisource.org/                                                  | We accept CC BY-SA obligations                                                                     | Share-alike/attribution complexity; need exact-work review.                                |
| Sanskrit/English/Hindi | Wikisource generally                | https://wikisource.org/wiki/Wikisource:Copyright_policy                     | We accept CC BY-SA or verify a specific page is public domain                                      | CC BY-SA may complicate a closed commercial app and generated derivatives.                 |
| English                | Sacred Texts                        | https://sacred-texts.com/hin/index.htm                                      | Text is clearly public domain and not site-specific copyrighted apparatus                          | Custom site terms and mixed public-domain/non-public-domain content.                       |
| Sanskrit               | Sanskrit Wikisource                 | https://sa.wikisource.org/                                                  | We accept CC BY-SA/public-domain page status and verify exact work                                 | Good for Sanskrit text discovery, but licensing/proof status varies.                       |
| Tamil                  | Project Madurai broader corpus      | https://projectmadurai.org/index.html                                       | We keep headers/credits and contact coordinators before public online redistribution               | Distribution rules are permissive but not a clean commercial app license.                  |

## Not for App Ingestion Without Permission

| Source                                         | Why not now                                                                                                                                                 |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gita Press PDFs                                | Often downloadable for personal use, but not cleared for app storage, RAG, or commercial redistribution.                                                    |
| BhagavadGita.com translations/commentaries/API | Their copyright page says translations/commentaries are permissioned from third parties and commercial use is not allowed. Sanskrit verses only are usable. |
| Gita Supersite / IITK                          | Useful reference, no clear commercial reuse license.                                                                                                        |
| Sanskrit Documents                             | Useful reference, but commercial copying/reposting needs permission.                                                                                        |
| Vedic Heritage Portal                          | Reproduction requires written permission.                                                                                                                   |
| Wisdom Library                                 | Useful reference only; do not copy definitions/summaries/translations.                                                                                      |
| Drik Panchang                                  | Use only for comparison. Do not copy calendar database rows.                                                                                                |
| `vedicscriptures/bhagavad-gita-api`            | README says free for non-monetized apps and cites modern source books; not safe for Sandhya commercial corpus.                                              |
| `bhavykhatri/DharmicData`                      | ODbL plus upstream IITK/Sacred Texts issues.                                                                                                                |
| `hrgupta/indian-scriptures`                    | Scraped IITK source.                                                                                                                                        |

## Gaps by App Requirement

| Requirement                | Status                                          | Gap                                                                                                                                      |
| -------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Bhagavad Gita Sanskrit     | Good                                            | Need choose canonical verse source and normalize chapter/verse numbering.                                                                |
| Bhagavad Gita English      | Good                                            | Need decide if Arnold is acceptable for user tone; probably add a second public-domain English version later.                            |
| Bhagavad Gita Hindi        | Weak                                            | No clean commercial-ready Hindi translation found. Commission/permission needed.                                                         |
| Bhagavad Gita Tamil        | Weak                                            | No clean Tamil translation found for Sanskrit Gita. Commission/permission needed.                                                        |
| Bhagavad Gita Marathi      | Partial                                         | Dnyaneshwari and Gita Rahasya are Marathi commentaries/tradition texts, not simple Marathi translations.                                 |
| 10-13 Principal Upanishads | Partial                                         | Project Gutenberg Paramananda is usable but may not cover all required Upanishads. Need exact coverage check and Sanskrit originals.     |
| Ramayana                   | English good, Sanskrit candidate                | Hindi/Tamil/Marathi translations not cleared. Use English key passages plus in-house summaries first.                                    |
| Mahabharata                | English good, Sanskrit candidate                | Too large for MVP full ingestion. Use key passages first. Hindi/Tamil/Marathi translations not cleared.                                  |
| Bhagavata Purana           | Weak                                            | No clean English/Hindi/Tamil/Marathi full translation confirmed. Sanskrit via GRETIL candidate only. Start with in-house summaries.      |
| Yoga Sutras                | English good, Sanskrit candidate                | Hindi/Tamil/Marathi translations not cleared.                                                                                            |
| Rig Veda hymns             | English selected hymns good, Sanskrit candidate | Needs Vedic reviewer and careful hymn selection. Hindi/Tamil/Marathi translations not cleared.                                           |
| Tirukkural                 | Tamil/English good candidate                    | Need contact/attribution plan for Project Madurai and decide whether Tirukkural belongs in source scripture or regional wisdom category. |
| Devi Mahatmya              | Weak                                            | No clean commercial-ready translation confirmed. Need public-domain scan review or permission.                                           |
| Regional/devotional texts  | Weak                                            | Marathi Dnyaneshwari is strongest. Need Tamil, Hindi, Marathi regional target list.                                                      |
| Festival calendar          | Weak for data                                   | Build calculation engine; do not copy Drik Panchang.                                                                                     |
| Glossary                   | Good if in-house                                | Write English source, then commission Hindi/Tamil/Marathi translations.                                                                  |
| Ritual procedures          | Good if in-house                                | Human review required; translations should be commissioned/reviewed.                                                                     |

## Recommended Ingestion Order

1. **English core MVP**
   - Bhagavad Gita: Project Gutenberg #2388.
   - Upanishads: Project Gutenberg #3283.
   - Yoga Sutras: Project Gutenberg #2526.
   - Ramayana key passages: Project Gutenberg #24869.
   - Mahabharata key passages: Project Gutenberg #7864 or Sacred Texts Ganguli.
   - Rig Veda selected hymns: Sacred Texts Griffith.

2. **Sanskrit originals**
   - Bhagavad Gita Sanskrit: use BhagavadGita.com Sanskrit-only statement plus cross-check with `gita/gita` or GRETIL.
   - GRETIL candidates for Upanishads, Ramayana, Mahabharata, Bhagavata Purana, Yoga Sutras, Rig Veda, Devi Mahatmya.

3. **Tamil MVP**
   - Tirukkural from Project Madurai.
   - In-house Tamil translations for glossary, festival pages, and practice guides.

4. **Marathi MVP**
   - Dnyaneshwari scan/OCR as a Marathi commentary candidate.
   - Gita Rahasya scan/OCR as a Marathi Gita interpretation candidate.
   - In-house Marathi translations for glossary, festival pages, and practice guides.

5. **Hindi MVP**
   - In-house Hindi translations for glossary, festival pages, and practice guides.
   - Seek permission for scripture translations, or use public-domain Hindi scans only after item-level review.

## Required Next Work

- Add `passage_translations` table before ingesting Tamil/Marathi/Hindi scripture translations.
- Add inventory rows for every candidate in this file before downloading into `content/`.
- For Project Gutenberg texts, strip or comply with the Project Gutenberg trademark/license boilerplate. Keep bibliographic attribution internally.
- For Project Madurai, preserve headers/credit acknowledgements and contact coordinators before public app release.
- For Wikisource, decide whether CC BY-SA content is acceptable in Sandhya's commercial closed-source product.
- Commission Hindi, Tamil, and Marathi translations for glossary, festivals, practice guides, and app-written summaries.
- Obtain permissions for modern scripture translations if we want readable contemporary Hindi/Tamil/Marathi in v1.

## Source Evidence Links

- Project Gutenberg license: https://www.gutenberg.org/policy/license
- Bhagavad Gita, Edwin Arnold: https://www.gutenberg.org/ebooks/2388
- Upanishads, Swami Paramananda: https://www.gutenberg.org/ebooks/3283
- Yoga Sutras, Charles Johnston: https://www.gutenberg.org/ebooks/2526
- Ramayana, Ralph T. H. Griffith: https://www.gutenberg.org/ebooks/24869
- Mahabharata, K. M. Ganguli: https://www.gutenberg.org/ebooks/7864
- Sacred Texts Mahabharata: https://sacred-texts.com/hin/maha/index.htm
- Sacred Texts Rig Veda: https://sacred-texts.com/hin/rigveda/
- Project Madurai home: https://projectmadurai.org/index.html
- Project Madurai FAQ: https://www.projectmadurai.org/faq.html
- Project Madurai Tirukkural: https://www.projectmadurai.org/pm_etexts/utf8/pmuni0153.html
- BhagavadGita.com copyright: https://bhagavadgita.com/copyright
- gita/gita: https://github.com/gita/gita
- GRETIL: https://gretil.sub.uni-goettingen.de/gretil.html
- INDOLOGY/GRETIL mirror: https://github.com/INDOLOGY/GRETIL-mirror
- Wikisource copyright policy: https://wikisource.org/wiki/Wikisource:Copyright_policy
- Dnyaneshwari scan: https://commons.wikimedia.org/wiki/File:Dnyaneshwari.djvu
- Gita Rahasya scan: https://commons.wikimedia.org/wiki/File:Geeta_Rahasya_BG_Tilak.pdf
- vedicscriptures API: https://github.com/vedicscriptures/bhagavad-gita-api

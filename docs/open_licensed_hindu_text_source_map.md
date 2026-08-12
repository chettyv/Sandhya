# Open-Licensed Hindu Text Source Map

Review date: 2026-06-01

This is a working map from Dharma Daily's target corpus to sources that are safer than bulk-scraping Sacred Texts. "Open" here means public-domain or clearly open-licensed enough to consider for staging. It does not mean approved for production RAG. Every staged work still needs a row in `docs/source_inventory_template.csv` and legal/content review before ingestion.

## Rules

- Prefer Project Gutenberg public-domain ebook pages when available. Their item pages state copyright status, provide full-text downloads, and their permission guidance says public-domain ebooks can be used commercially in the US, subject to Project Gutenberg terms and trademark rules.
- Use Wikisource cautiously. Some individual works are marked public domain, but Wikisource page text is generally under CC BY-SA with additional terms. Treat as candidate material and preserve attribution/provenance.
- Use Project Madurai cautiously. Some files permit free redistribution if headers are kept intact, but commercial app, embeddings, and RAG use are not always explicit.
- Do not treat GRETIL/Ambuda as automatically ingestible. Ambuda points to upstream text sources such as GRETIL; GRETIL and other upstream sources need file-level terms review.
- Do not bulk-scrape Sacred Texts. Use it for discovery and occasional missing public-domain items only.

## Source Map

| Work                                           | Preferred source                                                                                                               | Status                     | Notes                                                                                                                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bhagavad Gita, English                         | Project Gutenberg: Edwin Arnold, `The Song Celestial`, ebook 2388                                                              | Stage candidate            | Public domain in the USA. Old poetic translation; needs attribution and product-context note.                                                                    |
| Bhagavad Gita, Sanskrit                        | `gita/gita` GitHub repo                                                                                                        | Candidate, review first    | Repo is Unlicense, but verify provenance of every Sanskrit/translation field before storing. Use Sanskrit verses first; avoid unknown translations/commentaries. |
| Principal Upanishads, English                  | Project Gutenberg: Swami Paramananda, ebook 3283                                                                               | Stage candidate            | Public domain in the USA. Check exact Upanishads included before claiming full coverage.                                                                         |
| Principal Upanishads, broader English coverage | Wikisource Sacred Books of the East Vol. 1 and Vol. 15, Max Muller                                                             | Candidate, review first    | Public-domain edition, but Wikisource handling/attribution must be respected. Useful to fill gaps not in Paramananda.                                            |
| Yoga Sutras, English                           | Project Gutenberg: Charles Johnston, ebook 2526                                                                                | Stage candidate            | Public domain in the USA. Treat commentary/theological framing carefully.                                                                                        |
| Ramayana, English                              | Project Gutenberg: Ralph T. H. Griffith, ebook 24869                                                                           | Stage candidate            | Public domain in the USA. Very large; start with key passages and summaries.                                                                                     |
| Mahabharata, English                           | Project Gutenberg: Kisari Mohan Ganguli volumes, especially ebooks 15474, 15475, 15476, 15477 plus related single-parva ebooks | Stage candidate            | Public domain in the USA. Very large; ingest selected passages first.                                                                                            |
| Rig Veda, English                              | Wikisource: Ralph T. H. Griffith, `The Hymns of the Rigveda`                                                                   | Candidate, review first    | Wikisource marks original and translation public domain worldwide. Still preserve Wikisource/proofing provenance. Prefer selected hymns only.                    |
| Vedic Hymns, English selections                | Wikisource Sacred Books of the East Vol. 32 and Vol. 46                                                                        | Candidate, review first    | Public-domain SBE editions. Useful for selected hymn coverage, not a modern devotional translation.                                                              |
| Vishnu Purana, English                         | Project Gutenberg: `A Prose English Translation of Vishnupuranam`, ebook 66208                                                 | Stage candidate            | Public domain in the USA. Based on H. H. Wilson / M. N. Dutt; label as Purana translation/adaptation.                                                            |
| Bhagavata Purana, English                      | Project Gutenberg: `A Study of the Bhagavata Purana`, ebook 39442                                                              | Reference/stage candidate  | Public domain in the USA, but it is a study/synopsis, not a complete scripture translation. Need a separate full-text source.                                    |
| Markandeya Purana, English selections          | Project Gutenberg: `Markandeya Purana, Books VII and VIII`, ebook 7169                                                         | Stage candidate            | Public domain in the USA. Not the Devi Mahatmya section; use only for the covered books.                                                                         |
| Devi Mahatmya / Chandi                         | No clean full English source found yet                                                                                         | Gap                        | Do not use modern online translations without permission. Search Internet Archive/public-domain scans next.                                                      |
| Tirukkural, Tamil + English                    | Project Madurai: G. U. Pope / Drew / Lazarus / Ellis                                                                           | Candidate, review first    | Page permits free distribution with header intact. Commercial app/RAG rights need review or permission. Strong Tamil-first candidate.                            |
| Sanskrit originals beyond Gita                 | Ambuda/GRETIL/Wikisource Sanskrit                                                                                              | Reference/candidate only   | Good discovery/provenance path. Need per-file terms; avoid commercial ingestion until cleared.                                                                   |
| Hindi translations                             | No broad clean source identified                                                                                               | Permission track           | Prefer commissioned/in-house translations or public-domain scans after OCR and review. Do not scrape IITK/Gita Supersite/Sanskrit Documents.                     |
| Marathi translations/commentary                | Public-domain scans via Wikimedia Commons / Internet Archive, item-level                                                       | OCR/permission track       | Dnyaneshwari and Gita Rahasya scans may be candidates, but need OCR, edition review, and Marathi reviewer.                                                       |
| Tamil scripture translations beyond Tirukkural | No broad clean source identified                                                                                               | Permission track           | Use in-house/commissioned translations or verified public-domain scans only.                                                                                     |
| Festival/practice/glossary/deity content       | Dharma Daily in-house writing                                                                                                  | Approved path after review | Rights-safe if written by us. Needs human theological/regional review before app release.                                                                        |

## Source Links

- Project Gutenberg permissions: https://www.gutenberg.org/policy/permission.html
- Project Gutenberg terms: https://www.gutenberg.org/policy/terms_of_use.html
- Bhagavad Gita, Edwin Arnold: https://www.gutenberg.org/ebooks/2388
- Upanishads, Swami Paramananda: https://www.gutenberg.org/ebooks/3283
- Yoga Sutras, Charles Johnston: https://www.gutenberg.org/ebooks/2526
- Ramayana, Ralph T. H. Griffith: https://www.gutenberg.org/ebooks/24869
- Mahabharata, Ganguli author page: https://www.gutenberg.org/ebooks/author/2563
- Mahabharata Volume 1: https://www.gutenberg.org/ebooks/15474
- Mahabharata Volume 2: https://www.gutenberg.org/ebooks/15475
- Vishnu Purana: https://www.gutenberg.org/ebooks/66208
- Bhagavata Purana study: https://www.gutenberg.org/ebooks/39442
- Markandeya Purana selections: https://www.gutenberg.org/ebooks/7169
- Wikisource Rigveda versions: https://en.wikisource.org/wiki/The_Rig_Veda
- Wikisource Hymns of the Rigveda: https://en.wikisource.org/wiki/The_Hymns_of_the_Rigveda
- Wikisource Sacred Books of the East: https://en.wikisource.org/wiki/Sacred_Books_of_the_East
- Project Madurai Tirukkural: https://www.projectmadurai.org/pm_etexts/utf8/pmuni0153.html
- Ambuda code and data notes: https://ambuda.org/about/code-and-data
- `gita/gita`: https://github.com/gita/gita

# Sanskrit Documents Review

Review date: 2026-06-01

Source: https://sanskritdocuments.org/

## Decision

Use Sanskrit Documents as a **reference, discovery, cross-checking, and permission-request target**. Do **not** ingest its files into Sandhya's commercial app database, show full text from it, or embed its full text for RAG unless permission is obtained for the specific files.

The site is extremely useful, but its homepage states that files are prepared by volunteers for personal study and research, and says they should not be copied or reposted for promotion of websites, individuals, or commercial purposes without permission.

## Why It Is Useful

Sanskrit Documents is one of the best Hindu/Sanskrit discovery sources because it has:

- Sanskrit texts in Devanagari, multiple Indian scripts, and IAST/transliteration.
- Categories for authors, deities, stotras, suktas, mantras, puja, bhajan, Gita, Upanishads, Veda, Puranas, Itihasa, Vedanta, Tantra, Yoga, Hindi, Marathi, and English.
- Direct pages for major works such as Bhagavad Gita, Upanishads, Brahma Sutra, Veda, Puranas, Mahabharata, Ramayana, and Yoga.
- Useful links to scans, external repositories, personal scholarly sites, and tools.
- Change-script support, which is useful for checking Devanagari/IAST and regional script rendering.
- Frequent updates; the Upanishad page reviewed showed a 2026 update timestamp.

## Rights / Commercial Reuse Decision

| Question                                            | Decision                                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Can we download files for private research?         | Yes, for review/staging if kept internal and tracked.                                      |
| Can we store files in Supabase for the app?         | No, not without permission.                                                                |
| Can we show excerpts/full text to users?            | No, not without permission.                                                                |
| Can we embed full text for RAG/search?              | No, not without permission.                                                                |
| Can we use it as a source index?                    | Yes.                                                                                       |
| Can we use it to find scans/alternate sources?      | Yes.                                                                                       |
| Can we copy its Hindi/Marathi/English translations? | No, not without permission and item-level checks.                                          |
| Should we contact them?                             | Yes, if we want to use selected stotras, puja texts, Gita material, or multilingual files. |

## Best Use in Sandhya

| Use case                                                 | Recommendation                                       |
| -------------------------------------------------------- | ---------------------------------------------------- |
| Finding Sanskrit titles and variants                     | Use now.                                             |
| Finding links to scans or external source editions       | Use now, then review the external source separately. |
| Cross-checking Sanskrit spelling, titles, and categories | Use now.                                             |
| Script/transliteration QA                                | Use now as a reference.                              |
| Choosing stotra/devotional texts to prioritize           | Use now.                                             |
| Copying text directly into `content/`                    | Do not do without permission.                        |
| Embedding text for RAG                                   | Do not do without permission.                        |
| Commercial redistribution in the app                     | Do not do without permission.                        |

## Content Coverage Relevant to Sandhya

| App need                           | Sanskrit Documents coverage                                                                                                                | Use decision                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Bhagavad Gita                      | Dedicated Bhagavad Gita page with Sanskrit, ITRANS, Devanagari PDF/HTML, word meanings, Shankara Bhashya, and links to scans/translations. | Reference and permission target.                                   |
| Upanishads                         | Large Upanishad page with many Upanishads and links to scans/translations.                                                                 | Reference and source discovery.                                    |
| Veda / Rig Veda / Suktas / Mantras | Dedicated Veda, Rigveda, sukta, and mantra categories.                                                                                     | Reference and candidate discovery.                                 |
| Brahma Sutra                       | Listed under Prasthanatrayi.                                                                                                               | Reference only.                                                    |
| Puranas                            | Purana page with links to Sanskrit texts, external sources, indexes, and scans.                                                            | Reference and external-source discovery.                           |
| Ramayana / Mahabharata             | Listed under Itihasa, with linked pages/external sites.                                                                                    | Reference only.                                                    |
| Devi / Shakta content              | Rich categories for Durga, Lalita, Dashamahavidya, Gayatri, etc.                                                                           | Good for planning, not direct ingestion.                           |
| Stotras / Sahasranamas             | Very strong coverage.                                                                                                                      | High-value permission target.                                      |
| Puja / ritual content              | Puja category and related linked sites.                                                                                                    | Reference only; in-house guides still required.                    |
| Hindi / Marathi                    | Site has Hindi and Marathi categories.                                                                                                     | Useful for discovery, but rights still block direct app ingestion. |

## Specific Things Worth Reviewing Manually

Prioritize these pages as reference indexes:

- Bhagavad Gita: https://sanskritdocuments.org/sanskrit/bhagavadgita/
- Upanishads: https://sanskritdocuments.org/sanskrit/upanishhat/
- Puranas: https://sanskritdocuments.org/sanskrit/purana/
- Sitemap: https://sanskritdocuments.org/sitemap/
- Home / rights statement: https://sanskritdocuments.org/

Potential permission-request targets:

- Bhagavad Gita Sanskrit base text.
- Vishnu Sahasranama.
- Lalita Sahasranama.
- Shiva Mahimna Stotra.
- Aditya Hridayam.
- Hanuman Chalisa or linked Hindi devotional material.
- Devi Mahatmya / Durga Saptashati material.
- Selected puja texts where they have clear contributor/source metadata.

## Recommended Workflow

1. Use Sanskrit Documents to identify candidate works and alternate names.
2. Add the candidate to `docs/source_inventory_template.csv`.
3. Check whether the page links to an Archive.org scan, Wikisource page, GRETIL file, or another source with clearer rights.
4. Prefer the clearer-rights source for ingestion.
5. If no clean source exists, contact Sanskrit Documents for permission.
6. Only after permission or alternate rights clearance, stage the source and convert it into Sandhya's canonical Markdown format.

## Permission Email Data to Collect

Before contacting Sanskrit Documents, prepare:

- Exact files/pages requested.
- Whether we need Sanskrit only, translations, or transliteration.
- Whether we will store text in Supabase.
- Whether users will see full text or only excerpts.
- Whether text will be embedded for semantic search/RAG.
- Whether Sandhya is commercial/subscription-supported.
- Attribution wording we can display.
- Whether we can share corrections back to them.

## Bottom Line

Sanskrit Documents is one of the best Hindu text discovery sites for our scope, especially Sanskrit and devotional/stotra coverage. But for Sandhya's commercial app database, it is **not a download-and-ingest source by default**. Use it to guide research and permission requests; use public-domain scans, GRETIL, Project Gutenberg, Project Madurai, or explicitly licensed sources for actual ingestion where possible.

# Source Acquisition Run - 2026-06-19

Purpose: stage commercially plausible Hindu text sources for later legal review, cleanup, segmentation, and ingestion. This is not an approval list for production RAG.

Rules applied:

- Download public-domain, Public Domain Mark, CC0, Project Gutenberg, Project Madurai, and Wikisource candidates into `content/_staging/raw`.
- Keep copyrighted, noncommercial, no-derivatives, or unclear-rights items as metadata-only leads.
- Do not move anything into production `content/` until inventory, attribution, proofing, and human review are complete.

## Checklist by Language

| Language | Staged text candidates | Metadata-only / blocked leads | Notes                                                                                                               |
| -------- | ---------------------: | ----------------------------: | ------------------------------------------------------------------------------------------------------------------- |
| English  |                     10 |                             0 | Project Gutenberg core texts plus Vedanta Sutras, Vishnu Purana, Markandeya Purana selections, Vishnu Sahasranamam. |
| Sanskrit |                      3 |                             0 | Existing GRETIL/BhagavadGita.com notes plus Sanskrit Wikisource Bhagavad Gita raw export.                           |
| Hindi    |                      5 |                             1 | Bhagavad Gita OCR, Gita Rahasya OCR, partial Ramcharitmanas Wikisource export, Ramcharitmanas IA metadata.          |
| Tamil    |                      2 |                             0 | Project Madurai Tirukkural plus Bharati Bhagavad Gita Wikisource raw export.                                        |
| Bengali  |                      9 |                             0 | Four Bengali Bhagavad Gita OCR editions plus Wikisource edition index/Pandava Gita export.                          |
| Marathi  |                      6 |                             0 | Gita Rahasya and multiple Dnyaneshwari/Jnaneshwari OCR candidates.                                                  |
| Telugu   |                      5 |                             0 | Two Internet Archive OCR candidates plus Telugu Wikisource raw export.                                              |
| Gujarati |                      5 |                             0 | Two Internet Archive OCR candidates plus Gitadhvani Wikisource raw export.                                          |
| Urdu     |                      4 |                             3 | Two OCR candidates under CC0 claims; unclear/noncommercial items metadata-only.                                     |

Current tracker totals after all continuation passes: 100 inventory rows, 52 queued retry rows, 60 raw staging files, and about 68 MB of staged raw text/metadata. The queue and inventory currently have no duplicate `work_id` values.

Continuation update:

- Added `docs/source_download_queue_2026-06-19.csv` with 10 more Project Gutenberg public-domain English candidates and one newly identified corpus lead.
- Added `scripts/download-source-queue.ps1` to retry those queued downloads into `content/_staging/raw` when outbound network access is available.
- The continuation download attempt failed because the current shell sandbox blocked outbound socket access to `www.gutenberg.org:443`. The failed URLs are recorded in `content/_staging/raw/project_gutenberg_download_log_2026-06-19_continued.txt`.
- Added `raw/metadata_only/darshana_graph_corpus_2026.metadata.json` for the newly published Darshana Graph corpus claim. It remains metadata-only until the released repository and licenses are found.

Second continuation update:

- Added Sacred Books of the East / Sacred Texts queued targets for dharma-sutra, dharma-sastra, Upanishad, Vedanta, Grihya-sutra, Satapatha Brahmana, Rigveda hymn, and Atharvaveda hymn material.
- These are marked `download_pending_network_restricted` because outbound shell downloads are still blocked.
- These are not normal app devotional content. They need legal, Vedic, ritual, social-sensitivity, and theological review before use.
- Added `raw/metadata_only/gretil_mirror_github.metadata.json` for the GRETIL mirror repository lead. It remains metadata-only because blanket license/provenance is unclear.

Third continuation update:

- Added Project Madurai queued targets for Tamil Shaiva, Vaishnava, Shakta, Murugan, and Bhagavad Gita material:
  Thiruvasagam, Tirumantiram, Naalayira Divya Prabandham sections, Tiruvaymoli, Bharati Bhagavad Gita, Kandar Alankaram/Kandar Anubhuti, Abirami Andhadhi, and Kanda Sashti Kavacham.
- These are marked `download_pending_network_restricted`; the URLs and target paths are in `docs/source_download_queue_2026-06-19.csv`.
- Project Madurai terms remain review gates. Preserve headers and credits, and contact Project Madurai before public online redistribution.

Fourth continuation update:

- Added regional-language leads beyond the Bhagavad Gita focus:
  Vinaya Patrika for Hindi/Braj, Dasbodh and Eknathi Bhagwat for Marathi, Andhra Mahabharatam and Ranganatha Ramayanamu for Telugu, Pothana Bhagavatha and Dhruvopakhyanamu Telugu Internet Archive metadata, Narsinh Mehta Gujarati metadata, and Bengali Krittivasi Ramayan / Kashidasi Mahabharat source-discovery leads.
- Downloadable URLs are in `docs/source_download_queue_2026-06-19.csv`; they remain pending because shell outbound network access is restricted in the current environment.
- Added metadata-only JSON files for Narsinh Mehta, Krittivasi Ramayan, and Kashidasi Mahabharat because those leads need edition and commercial-rights review before text download.
- Updated `scripts/download-source-queue.ps1` to support `-WhatIf` and run on both Windows PowerShell and PowerShell 7.

Fifth continuation update:

- Added a second Project Madurai Tamil batch from the official work list:
  later Tirumantiram sections, Bharati devotional songs, Desika Prabandham, Thiruvarutpa sections, Thiruvarutpa Agaval, Shanmuga Kavacham, and Kanda Guru Kavacham.
- Added corpus/dataset metadata-only leads for Itihasa Sanskrit-English, IWLV Ramayana multilingual, Samasamayik Hindi-Sanskrit, and Mitrasamgraha Sanskrit-English. These are discovery leads only until dataset URLs, licenses, and upstream text rights are verified.
- The new Tamil rows are queued for retry; the corpus/dataset rows are metadata-only because the actual reusable data packages were not verified.

Sixth continuation update:

- Added more metadata-only leads for under-covered non-English areas:
  SanskritDocuments sahasranama and stotra indexes, Sanskrit Wikisource Vishnu Sahasranama and Valmiki Ramayana pages, Bengali Chaitanya Bhagavata and Chaitanya Charitamrita leads, Gujarati Akha Bhagat and Vaishnava Jana To leads, Telugu Sumati Satakam, and the Persian-script Razmnama Mahabharata lead.
- These are intentionally metadata-only. The base works are old, but the reusable editions, page histories, site terms, or manuscript transcription rights were not verified.
- The Persian Razmnama row is not counted as Urdu text, but it is useful for Urdu/Persian-script Mahabharata discovery.

## Commercial-Use Status

Likely strongest production candidates after normal cleanup:

- Project Gutenberg English texts in `raw/english`.
- Project Madurai Tirukkural for internal staging, with Project Madurai contact before public online redistribution.
- Older Internet Archive Bengali/Marathi scans where edition date and public-domain status can be verified.

Needs legal/provenance review before production:

- Wikisource raw exports because attribution/share-alike and page-level public-domain status must be checked.
- Internet Archive `Public Domain Mark` and `CC0` OCR files because uploader metadata may not prove underlying rights.
- Telugu Wikisource translation because the page cites Chinmaya Mission material.
- Urdu CC0 uploads because uploader authority over the translations is not established.

Blocked from text download:

- `raw/metadata_only/bhagavad_gita_urdu_persian_cc_by_nc_nd_blocked.metadata.json` because it is CC BY-NC-ND.
- `raw/metadata_only/bhagvat_geeta_in_urdu_unclear_rights.metadata.json` because no commercial license was captured.
- `raw/metadata_only/bhagwat_geeta_babu_bhagwan_das_1945_ur_unclear_rights.metadata.json` because copyright status is unclear.
- Project Gutenberg continuation candidates are not blocked by rights; they are pending because the current shell environment blocks outbound downloads.
- Sacred Books of the East continuation candidates are not marked as rights-blocked, but they are pending because current shell network access is restricted and Sacred Texts site terms still need review.
- Project Madurai continuation candidates are pending because of current shell network restrictions and require Project Madurai attribution/contact review before public app use.
- Regional continuation candidates are pending or metadata-only depending on rights clarity. Andhra Bharati, Rekhta Gujarati, and Wikipedia/source-lead rows are not approved for scraping until terms, editions, and transcription rights are verified.
- Corpus/dataset leads are not approved source texts. They may help find aligned editions or language tooling later, but they require license, source-edition, and derivative-use review before any commercial app use.
- SanskritDocuments, Wikisource, and Wikipedia/source-lead rows are discovery aids, not download approvals. For each one, find the concrete edition and source licence before pulling text into the corpus.

Seventh continuation update:

- Added metadata-only leads for additional under-covered regional traditions:
  Hanuman Chalisa, Sursagar/Surdas, Devi Mahatmya/Durga Saptashati Hindi, Tukaram Gatha, Namdev Gatha, Bhoja Bhagat, Vemana poems, Manasamangal, Chandimangal, and the SanskritDocuments Upanishad index.
- These are all source-discovery leads because the exact reusable edition or per-file rights were not verified. Several are public-domain base works but have complex edition, attribution, or authenticity issues.
- For Varkari, Braj, Bengali mangalkavya, and Shakta sources, add tradition/content review before any production RAG use.

Eighth continuation update:

- Added metadata-only discovery leads for Janabai abhangs, Eknath Bharud/abhangs, Premanand Gujarati Ramayana, Dayaram Gujarati bhakti poems, Bengali Vaishnava Padavali, Bengali Krishna Mangal, Tulsidas Kavitavali and Gitavali, Molla Ramayanam, Bhaskara Ramayanam, and Urdu/Persian-script Mahabharata translation discovery.
- These entries mostly point to known public-domain base authors or traditions, but concrete reusable editions were not found in this pass. They are source targets for the licensing/retry workflow, not ingestible files.

Ninth continuation update:

- Added `Songs of Kabir` from Project Gutenberg as a concrete public-domain English download target, pending shell network retry.
- Added the 1917 `Bijak of Kabir` Internet Archive metadata endpoint for edition/OCR review.
- Added metadata-only Hindi/Braj/Sant leads for Mirabai Padavali, Raskhan/Prem Vatika, Kabir Granthavali, and Tulsidas Dohavali.
- Kabir, Mirabai, and other sant/bhakti sources need recension, attribution, and tradition/context review before production use.

Tenth continuation update:

- Added Internet Archive metadata retry targets for `Sarva-Darsana-Samgraha`, `Panchadasi`, `Shankara Digvijaya Mula`, Surendranath Dasgupta's `A History of Indian Philosophy Vol 1`, and `Yoga as Philosophy and Religion`.
- These are metadata-first entries because edition metadata, OCR quality, and jurisdiction-specific rights still need review before full-text ingestion.
- The Dasgupta titles are secondary scholarship for context only. Do not cite them as scripture or primary devotional authority in production answers.
- The Advaita and darshana titles need Sanskrit/Hindi review and tradition-context labeling before any RAG use.

Eleventh continuation update:

- Added Internet Archive metadata retry targets for `Sant Tukaram Gatha` and Wilkins' 1913 `Hindu Mythology Vedic and Puranic`.
- The Tukaram item claims Public Domain Mark on the IA page but bundles multiple OCR/text variants, so the exact edition must be selected before ingestion.
- The Wilkins book is a secondary missionary-era reference. Keep it for contextual lookup only and do not treat it as scriptural authority.
- A possible Chaitanya archive lead was found through Wikipedia references, but the exact IA item URL was not stable enough in this pass to queue as a concrete download.

Twelfth continuation update:

- Added Bhagavata Purana source-discovery rows for a Gita Press IA item, M. N. Dutt's HathiTrust record, and a SanskritDocuments Sanskrit page.
- The Gita Press item is blocked as metadata-only until commercial rights are licensed or otherwise cleared.
- The M. N. Dutt translation is a strong public-domain candidate by date but still needs an openly downloadable source and HathiTrust reuse review.
- The SanskritDocuments page needs source-edition and transcription-rights review before any text pull.

English-first manual backlog update - 2026-07-06:

- The active collection path can now focus on English texts first. Non-English originals and translations remain useful for provenance and later localization, but manual searching should prioritize missing English witnesses before broad multilingual expansion.
- Do not duplicate already staged broad English coverage for Gita, Upanishads, Yoga Sutras, Ramayana, Mahabharata, Vedas, several Puranas, Vedanta/darshana, Tamil Shaiva/Sri Vaishnava, Varkari/Sant, Ramakrishna/Vivekananda, and reference/context sources.
- Highest-value English texts still to collect or extract:
  - Standalone Devi Mahatmya / Durga Saptashati, preferably pre-1931 or extracted from a verified staged Markandeya Purana witness.
  - Lalita Sahasranama.
  - Hanuman Chalisa English translation.
  - Shiva Mahimna Stotra.
  - Aditya Hridayam.
  - Bhaja Govindam.
  - Soundarya Lahari from an edition older/clearer than the skipped post-1930 candidate.
  - English Dnyaneshwari/Jnaneshwari, if a public-domain translation exists.
  - English Gita Rahasya, likely permission/manual-review only.
  - English Kamba Ramayanam and Adhyatma Ramayana.
  - English Eknathi Bhagwat, Namdev abhangs, and broader Varkari primary devotional texts.
  - Broader or complete English Divya Prabandham and Tevaram selections.
  - Narayaneeyam selections.
  - English Shiva Purana, Padma Purana, Skanda/Kashi Khanda, Kurma Purana, Linga Purana, Vayu Purana, Brahmanda Purana, and Narada Purana, where public-domain partial translations or licensed editions can be found.
  - Madhva Gita Bhashya and Abhinavagupta's Gita commentary in English for commentary-balance coverage.
- For manual finds, add an inventory row first. Use `metadata_only` when the edition, translator, publication date, scan rights, or commercial reuse status is unclear.

## Next Required Work

1. Normalize OCR and run language-specific quality checks.
2. Split each source into passage-level records with exact source URLs.
3. Verify translator/editor death dates and edition publication dates.
4. Decide whether CC BY-SA material is acceptable for the commercial app and generated derivatives.
5. Create production-ready Markdown only for sources with completed inventory rows and reviewer signoff.

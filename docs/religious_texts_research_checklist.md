# Religious Texts Research Checklist

Use this checklist while researching sources for Sandhya. For each candidate source, capture:

- Exact text/work name.
- Language and script.
- Translator/commentator/editor.
- Edition/publication year.
- Source URL and download URL.
- License/terms URL.
- Whether commercial app use is allowed.
- Whether we can store it in Supabase.
- Whether we can show excerpts/full text.
- Whether we can embed it for RAG/search.
- Attribution requirements.
- Human review needed.

Required app languages:

- Sanskrit.
- English.
- Hindi.
- Tamil.
- Marathi.

## English-First Collection Mode

As of 2026-07-06, collection can prioritize English source texts first. Hindi, Tamil, Marathi, and Sanskrit-script presentation can be translated, curated, or normalized later from reviewed English/source-text records. This does **not** remove the need to track original language, translator, source URL, edition, and licence for each work.

Use this manual backlog when looking for additional English sources. Add any found source to `docs/source_inventory_template.csv` first, stage raw text under `content/_staging/raw/english/`, and keep unclear rights as metadata-only.

### Still Needed: English Manual Collection Backlog

| Priority | Text / content                                           | Why still needed                                  | Current state / manual target                                                                                                                            |
| -------- | -------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | Devi Mahatmya / Durga Saptashati                         | Core Shakta/Navaratri text.                       | Full Markandeya Purana OCR is staged, but a standalone English Devi Mahatmya extraction or separate public-domain edition still needs collection/review. |
| P1       | Lalita Sahasranama                                       | Major Shakta/Smarta stotra.                       | No reviewed English public-domain source staged. Look for pre-1931 edition/translation or keep as permission target.                                     |
| P1       | Hanuman Chalisa                                          | Common devotional text for Rama/Hanuman practice. | Hindi/Awadhi lead exists, but no reviewed English translation staged. Prefer old bilingual scan or create in-house translation with reviewer.            |
| P1       | Shiva Mahimna Stotra                                     | Common Shaiva stotra.                             | No reviewed English source staged. Look for old stotra anthology with translator/date.                                                                   |
| P1       | Aditya Hridayam                                          | Ramayana-linked Surya hymn.                       | No reviewed English standalone source staged. Look for old Ramayana/stotra anthology, or extract from a cleared Ramayana edition if present.             |
| P1       | Bhaja Govindam                                           | Beginner-friendly Vedanta/devotional text.        | No reviewed English source staged. Look for pre-1931 translation, preferably with Sanskrit and translator named.                                         |
| P2       | Soundarya Lahari                                         | Shakta/Advaita stotra; commentary-sensitive.      | Earlier candidate was skipped because the usable edition appeared post-1930. Need older public-domain source or permission.                              |
| P2       | Dnyaneshwari / Jnaneshwari in English                    | Marathi Gita tradition for English-first corpus.  | Marathi scans are staged; English translation not staged. Find public-domain English translation if it exists, otherwise keep as translation project.    |
| P2       | Gita Rahasya in English                                  | Important modern Marathi Gita interpretation.     | Marathi/Hindi are staged; English edition appears post-1930/rights-sensitive. Treat as permission/manual review target.                                  |
| P2       | Kamba Ramayanam in English                               | Tamil Ramayana tradition.                         | No reviewed English Kamban source staged. Look for public-domain English retelling/translation with edition details.                                     |
| P2       | Adhyatma Ramayana in English                             | Devotional/theological Ramayana source.           | No reviewed English source staged. Search Internet Archive/HathiTrust/Gutenberg before using modern web copies.                                          |
| P2       | Eknathi Bhagwat in English                               | Marathi Bhagavata/Varkari tradition.              | Eknath hagiography is staged, but not Eknathi Bhagwat itself in English. Likely translation project unless old edition found.                            |
| P2       | Namdev abhangs in English                                | Major Varkari/Sant voice.                         | Metadata-only Marathi lead exists; English selections may be in older anthologies but no dedicated reviewed source is staged.                            |
| P2       | Complete Divya Prabandham / Alvar hymns in English       | Sri Vaishnava devotional corpus.                  | Selected Alvar/Sri Vaishnava sources are staged; full or broader English Divya Prabandham coverage still needs source review.                            |
| P2       | Tevaram selections in English                            | Tamil Shaiva devotional corpus.                   | Tamil Shaiva sources are staged, but verify whether Tevaram-specific hymns are covered; collect a dedicated English source if available.                 |
| P2       | Narayaneeyam selections in English                       | Kerala Vaishnava devotional source.               | No reviewed English source staged. Likely requires permission or old print scan.                                                                         |
| P3       | Shiva Purana in English                                  | Major Shaiva Purana.                              | No reviewed full English public-domain translation staged. Most easy online editions are modern/rights-unclear.                                          |
| P3       | Padma Purana in English                                  | Festivals, pilgrimage, Vaishnava material.        | No reviewed English edition staged; one old candidate appeared Sanskrit-only. Need better source.                                                        |
| P3       | Skanda Purana / Kashi Khanda in English                  | Tirtha/pilgrimage material.                       | Kashi context books are staged, but no reviewed Purana translation. Modern editions are likely rights-sensitive.                                         |
| P3       | Kurma, Linga, Vayu, Brahmanda, Narada Puranas in English | Specialist Purana expansion.                      | No reviewed English public-domain editions staged. Search old partial translations; otherwise permission track.                                          |
| P3       | Madhva Gita Bhashya in English                           | Dvaita Gita commentary balance.                   | Madhva Upanishad and secondary Acharya material is staged, but not Madhva Gita Bhashya.                                                                  |
| P3       | Abhinavagupta Gitartha Samgraha in English               | Kashmir Shaiva Gita commentary.                   | No reviewed English source staged; likely modern/permission track.                                                                                       |

## P0: Must Have for MVP

| Text / content           | Category                       | Required languages                             | Research notes                                                                                                                                                        |
| ------------------------ | ------------------------------ | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bhagavad Gita            | Smriti / Gita / core scripture | Sanskrit, English, Hindi, Tamil, Marathi       | Need Sanskrit verses plus at least one readable public-domain or licensed translation. Marathi may be Dnyaneshwari/Gita Rahasya as commentary, not plain translation. |
| Principal Upanishads     | Shruti / Vedanta               | Sanskrit, English, Hindi, Tamil, Marathi       | Start with 10-13: Isha, Kena, Katha, Prashna, Mundaka, Mandukya, Taittiriya, Aitareya, Chandogya, Brihadaranyaka, Shvetashvatara, Kaushitaki, Maitri.                 |
| Yoga Sutras of Patanjali | Yoga / darshana                | Sanskrit, English, Hindi, Tamil, Marathi       | Need Sanskrit sutras and translation. Modern commentaries likely copyrighted.                                                                                         |
| Tirukkural               | Tamil ethical/classical text   | Tamil, English, Hindi, Marathi                 | Tamil original is first-class. Treat as regional wisdom/classical ethics, not Sanskrit scripture.                                                                     |
| Core glossary            | Curated app content            | English, Hindi, Tamil, Marathi, Sanskrit terms | Write in-house; do not copy definitions.                                                                                                                              |
| Deity profiles           | Curated app content            | English, Hindi, Tamil, Marathi                 | Write in-house; review for sectarian/regional balance.                                                                                                                |
| Festival explainers      | Curated app content            | English, Hindi, Tamil, Marathi                 | Write in-house; dates should be calculated or manually reviewed, not scraped.                                                                                         |
| Beginner practice guides | Curated app content            | English, Hindi, Tamil, Marathi                 | Daily puja, aarti, diya, temple etiquette, basic mantra respect. Human review required.                                                                               |

## P1: Early Expansion

| Text / content                   | Category                     | Required languages                                       | Research notes                                                                                                 |
| -------------------------------- | ---------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Valmiki Ramayana                 | Itihasa                      | Sanskrit, English, Hindi, Tamil, Marathi                 | Start with key passages and summaries before full text.                                                        |
| Mahabharata                      | Itihasa                      | Sanskrit, English, Hindi, Tamil, Marathi                 | Start with key passages: Gita context, Yaksha Prashna, Vidura Niti, Bhishma teachings, Sanatsujatiya, Anugita. |
| Rig Veda selected hymns          | Shruti / Veda                | Sanskrit, English, Hindi, Tamil, Marathi                 | Selected hymns only for MVP/early expansion; needs Vedic review.                                               |
| Devi Mahatmya / Durga Saptashati | Shakta / Purana section      | Sanskrit, English, Hindi, Tamil, Marathi                 | Important for Navaratri and Shakta content. Need rights and Shakta reviewer.                                   |
| Bhagavata Purana                 | Purana / bhakti              | Sanskrit, English, Hindi, Tamil, Marathi                 | Prioritize Krishna, Prahlada, Dhruva, Uddhava Gita, bhakti sections.                                           |
| Vishnu Sahasranama               | Stotra / Mahabharata         | Sanskrit, English, Hindi, Tamil, Marathi                 | Common devotional/practice content. Source and translation rights needed.                                      |
| Lalita Sahasranama               | Stotra / Shakta              | Sanskrit, English, Hindi, Tamil, Marathi                 | Commentary-sensitive; Shakta/Smarta review required.                                                           |
| Hanuman Chalisa                  | Devotional                   | Hindi, English, Sanskrit transliteration, Tamil, Marathi | Hindi original. Verify publication/source and translation rights.                                              |
| Shiva Mahimna Stotra             | Stotra / Shaiva              | Sanskrit, English, Hindi, Tamil, Marathi                 | Useful for Shaiva devotional content.                                                                          |
| Aditya Hridayam                  | Stotra / Ramayana-linked     | Sanskrit, English, Hindi, Tamil, Marathi                 | Useful for practice and Ramayana context.                                                                      |
| Ekadashi guide                   | Practice / Vaishnava-Smarta  | English, Hindi, Tamil, Marathi                           | Write in-house. Include health disclaimer.                                                                     |
| Navaratri guide                  | Practice / Shakta / regional | English, Hindi, Tamil, Marathi                           | Write in-house. Include regional variation.                                                                    |
| Ganesha puja guide               | Practice                     | English, Hindi, Tamil, Marathi                           | Write in-house. Regional review.                                                                               |
| Lakshmi puja / Diwali guide      | Practice / festival          | English, Hindi, Tamil, Marathi                           | Write in-house. Regional review.                                                                               |
| Shiva puja guide                 | Practice / Shaiva-Smarta     | English, Hindi, Tamil, Marathi                           | Write in-house. Avoid advanced/initiatory instructions.                                                        |

## P2: Major Expansion

| Text / content              | Category                         | Required languages                       | Research notes                                                                  |
| --------------------------- | -------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------- |
| Brahma Sutras               | Vedanta                          | Sanskrit, English, Hindi, Tamil, Marathi | Not beginner-friendly raw. Needs commentary context.                            |
| Bhagavad Gita commentaries  | Vedanta / commentary             | Sanskrit, English, Hindi, Tamil, Marathi | Shankara, Ramanuja, Madhva, Abhinavagupta, etc. only if public-domain/licensed. |
| Dnyaneshwari / Jnaneshwari  | Marathi bhakti / Gita commentary | Marathi, English, Hindi, Tamil           | High priority for Marathi tradition. OCR/proofing likely needed.                |
| Gita Rahasya                | Marathi Gita interpretation      | Marathi, English, Hindi, Tamil           | Tag clearly as Tilak's modern interpretation/commentary.                        |
| Ramcharitmanas              | Bhakti / Ramayana                | Awadhi/Hindi, English, Tamil, Marathi    | Critical for North Indian devotional practice. Rights/source needed.            |
| Kamba Ramayanam             | Tamil Ramayana                   | Tamil, English, Hindi, Marathi           | Critical for Tamil tradition. Need public-domain or licensed source.            |
| Adhyatma Ramayana           | Devotional Ramayana              | Sanskrit, English, Hindi, Tamil, Marathi | Useful for devotional/theological Ramayana material.                            |
| Eknathi Bhagwat             | Marathi bhakti / Bhagavata       | Marathi, English, Hindi, Tamil           | Marathi tradition source. Rights/source needed.                                 |
| Tukaram abhangs             | Marathi bhakti                   | Marathi, English, Hindi, Tamil           | High value for Marathi devotional content. Need edition rights.                 |
| Namdev abhangs              | Marathi/Hindi bhakti             | Marathi, Hindi, English, Tamil           | Needs source/edition rights.                                                    |
| Tevaram selections          | Tamil Shaiva bhakti              | Tamil, English, Hindi, Marathi           | Need public-domain/licensed editions and Shaiva review.                         |
| Divya Prabandham selections | Tamil Vaishnava bhakti           | Tamil, English, Hindi, Marathi           | Need public-domain/licensed editions and Vaishnava review.                      |
| Tiruvachakam selections     | Tamil Shaiva bhakti              | Tamil, English, Hindi, Marathi           | Need public-domain/licensed editions.                                           |
| Soundarya Lahari            | Shakta/Advaita stotra            | Sanskrit, English, Hindi, Tamil, Marathi | Commentary-sensitive; Shakta/Advaita review.                                    |
| Bhaja Govindam              | Vedanta/devotional               | Sanskrit, English, Hindi, Tamil, Marathi | Useful beginner teaching text.                                                  |
| Narayaneeyam selections     | Vaishnava / Kerala tradition     | Sanskrit, English, Hindi, Tamil, Marathi | Later; source and translation rights needed.                                    |

## P3: Specialist / Later

| Text / content                    | Category                  | Required languages                       | Research notes                                                |
| --------------------------------- | ------------------------- | ---------------------------------------- | ------------------------------------------------------------- |
| Sama Veda selected hymns          | Shruti / Veda             | Sanskrit, English, Hindi, Tamil, Marathi | Later; chanting/oral tradition sensitivity.                   |
| Yajur Veda selected passages      | Shruti / ritual           | Sanskrit, English, Hindi, Tamil, Marathi | Ritual context; careful review.                               |
| Atharva Veda selected hymns       | Shruti / Veda             | Sanskrit, English, Hindi, Tamil, Marathi | Later; sensitive material.                                    |
| Vishnu Purana                     | Purana                    | Sanskrit, English, Hindi, Tamil, Marathi | Vaishnava/theological reference.                              |
| Shiva Purana                      | Purana                    | Sanskrit, English, Hindi, Tamil, Marathi | Shaiva reference.                                             |
| Markandeya Purana                 | Purana                    | Sanskrit, English, Hindi, Tamil, Marathi | Context for Devi Mahatmya.                                    |
| Devi Bhagavata Purana             | Purana / Shakta           | Sanskrit, English, Hindi, Tamil, Marathi | Shakta tradition.                                             |
| Skanda Purana selections          | Purana / tirtha           | Sanskrit, English, Hindi, Tamil, Marathi | Huge; use selectively.                                        |
| Garuda Purana selections          | Purana / death rites      | Sanskrit, English, Hindi, Tamil, Marathi | Sensitive death rites. High-level only without expert review. |
| Padma Purana selections           | Purana                    | Sanskrit, English, Hindi, Tamil, Marathi | Festivals, pilgrimage, Vaishnava material.                    |
| Brahma Vaivarta Purana selections | Purana / Krishna-Radha    | Sanskrit, English, Hindi, Tamil, Marathi | Later.                                                        |
| Agamas / Tantras                  | Agama / Tantra            | Sanskrit, English, Hindi, Tamil, Marathi | Specialist, permission/review-heavy. Do not ingest casually.  |
| Sandhyavandanam overview          | Practice / Vedic          | English, Hindi, Tamil, Marathi           | High-level only unless expert-reviewed by tradition/shakha.   |
| Shraddha overview                 | Practice / death rites    | English, Hindi, Tamil, Marathi           | Sensitive; high-level orientation only.                       |
| Mantra initiation topics          | Practice / guru tradition | English, Hindi, Tamil, Marathi           | Avoid procedural claims; human review mandatory.              |

## Deity Profile Research List

| Priority | Deity / figure                    | Notes                                                     |
| -------- | --------------------------------- | --------------------------------------------------------- |
| P0       | Ganesha                           | Include Ganapati/Vinayaka names and regional practice.    |
| P0       | Shiva                             | Shaiva/Smarta variation.                                  |
| P0       | Vishnu                            | Vaishnava/Smarta variation.                               |
| P0       | Devi                              | General Devi framing; avoid flattening Shakta traditions. |
| P0       | Krishna                           | Bhagavata/Gita/bhakti context.                            |
| P0       | Rama                              | Ramayana and devotional practice.                         |
| P0       | Hanuman                           | Ramayana and devotional practice.                         |
| P0       | Lakshmi                           | Diwali/home practice variation.                           |
| P0       | Saraswati                         | Learning/festival context.                                |
| P1       | Durga                             | Navaratri/Devi Mahatmya context.                          |
| P1       | Kali                              | Shakta/Bengali/regional context.                          |
| P1       | Parvati                           | Shaiva/Shakta context.                                    |
| P1       | Murugan / Subrahmanya / Kartikeya | Tamil/South Indian priority.                              |
| P1       | Ayyappa                           | South Indian/regional context.                            |
| P1       | Radha                             | Vaishnava/bhakti context.                                 |
| P1       | Surya                             | Aditya Hridayam and festival/practice context.            |
| P2       | Dattatreya                        | Regional/sampradaya variation.                            |
| P2       | Navagraha                         | Practice and astrology sensitivity.                       |
| P2       | Tulsi                             | Vaishnava/home practice context.                          |

## Festival / Calendar Research List

| Priority | Festival / observance            | Notes                                          |
| -------- | -------------------------------- | ---------------------------------------------- |
| P0       | Diwali / Deepavali               | Major regional variation.                      |
| P0       | Holi                             | Regional variation.                            |
| P0       | Navaratri / Durga Puja           | Shakta/regional variation.                     |
| P0       | Janmashtami                      | Vaishnava/regional date variation.             |
| P0       | Maha Shivaratri                  | Shaiva/Smarta practice variation.              |
| P0       | Rama Navami                      | Ramayana/devotional context.                   |
| P0       | Ganesh Chaturthi                 | Regional practice, especially Maharashtra.     |
| P0       | Ekadashi                         | Vaishnava/Smarta variation; health disclaimer. |
| P0       | Purnima                          | Calendar/practice context.                     |
| P0       | Amavasya                         | Calendar/practice context.                     |
| P1       | Hanuman Jayanti                  | Regional date variation.                       |
| P1       | Makar Sankranti / Pongal         | Solar/regional variation.                      |
| P1       | Onam                             | Kerala/regional context.                       |
| P1       | Raksha Bandhan                   | Regional/social context.                       |
| P1       | Guru Purnima                     | Guru tradition sensitivity.                    |
| P1       | Saraswati Puja / Vasant Panchami | Regional variation.                            |
| P1       | Karva Chauth                     | Regional/social context.                       |
| P1       | Chhath Puja                      | Regional context.                              |
| P2       | Skanda Sashti                    | Tamil/Shaiva-Murugan context.                  |
| P2       | Ayyappa Mandala / Makara Jyothi  | Regional and temple-specific sensitivity.      |

## Source Research Status

| Source type                                           | Best use                                                                                        |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Public-domain scans / Project Gutenberg / Archive.org | Best for English starter corpus after item-level checks.                                        |
| GRETIL / GRETIL mirror                                | Best for Sanskrit source text candidates after file-level review.                               |
| Project Madurai                                       | Best current Tamil source candidate, especially Tirukkural. Contact before public online reuse. |
| Wikimedia Commons / Internet Archive scans            | Useful for Marathi scans like Dnyaneshwari and Gita Rahasya; OCR/proofing needed.               |
| Sanskrit Documents                                    | Excellent discovery/reference source; do not ingest commercially without permission.            |
| Gita Supersite / IITK                                 | Reference only unless permission is granted.                                                    |
| Wisdom Library                                        | Reference only; do not copy definitions/summaries.                                              |
| Drik Panchang                                         | Reference/verification only; do not scrape calendar data.                                       |

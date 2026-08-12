# Sandhya Content Source Review

Review date: 2026-06-01

This memo is a decision aid for Sandhya's scripture, glossary, ritual, and calendar corpus. It is intentionally conservative: a source being online, on GitHub, or described as "open" is not enough for commercial app ingestion. Before any text is added to `content/`, it needs a source inventory row with storage, excerpt, full-text, RAG, attribution, and commercial-use decisions.

## Executive Summary

The safest near-term path is a small, rights-reviewed corpus built from public-domain or clearly open-licensed editions, plus in-house glossary and practice content that is human-reviewed. Do not bulk-ingest large scripture repositories yet. Several of the most attractive sources combine ancient public-domain base texts with modern digitization, translation, commentary, database, collection, or website rights.

Best immediate candidates:

- Use public-domain editions from Internet Archive or Sacred Texts only after item-level copyright checks, with preference for editions where the translator died long ago and the scan metadata is consistent with public-domain status.
- Use GRETIL or the GRETIL mirror primarily for Sanskrit source text reference and possible ingestion after per-file checks.
- Use `gita/gita` and `gita/bhagavad-gita-api` as schema/API inspiration immediately; ingest text only after verifying each included translator/commentator.
- Write glossary, festival explanations, and ritual guides in-house, using sources only for research, then pass them through human review.
- Build Panchang/festival dates with an independent calculation engine. Treat Drik Panchang as a comparison reference only, not a data source to scrape or copy.

High-risk or blocked for direct ingestion:

- Sanskrit Documents, Vedic Heritage Portal, Muktabodha, DSBC, Wisdom Library, Gita Supersite, IITK sites, Drik Panchang, and most GitHub scrapes need permission or strict reference-only handling unless a specific page/file says otherwise.
- GitHub repository licenses often cover code or a database wrapper. They do not automatically clear the underlying scripture, translation, commentary, OCR, scan, or website content.
- ODbL or CC-BY-SA style database licenses can force share-alike obligations that conflict with a closed commercial app unless isolated or approved.

## Product Corpus and Language Requirements

The build reference requires the app to support these source families:

- Bhagavad Gita, with multiple translations.
- Principal Upanishads, at least the 10-13 major Upanishads.
- Ramayana and Mahabharata, starting with summaries and key passages rather than full text.
- Bhagavata Purana.
- Yoga Sutras of Patanjali.
- Vedas, at minimum selected Rig Veda hymns with translations.
- Tirukkural.
- Devi Mahatmya.
- Regional and devotional texts as scope expands.
- Festival calendar, glossary, practice guides, deities, daily reflections, and sectarian/regional notes.

Your required languages are:

- Sanskrit.
- English.
- Hindi.
- Tamil.
- Marathi.

This changes the recommendation materially. Sanskrit and English can likely be sourced first from public-domain or scholarly corpora. Hindi, Tamil, and Marathi translations are the hard part: many useful online translations are modern, hosted on copyrighted sites, or distributed with unclear permissions. Treat them as permission-first languages unless a specific edition is verified public domain or open licensed.

### Language Acquisition Matrix

| Language | Priority for app | Best near-term source path                                                                                                    | GitHub usefulness                  | Rights risk | Recommendation                                                                                                                         |
| -------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Sanskrit | Required         | GRETIL, GRETIL mirror, verified public-domain scans, possibly vetted GitHub corpora                                           | High for source text and structure | Medium      | Start here after per-file review. Sanskrit originals are usually safer than translations, but digitization/source rights still matter. |
| English  | Required         | Internet Archive public-domain scans, Sacred Texts item-level public-domain editions, Project Gutenberg/Wikisource candidates | Medium                             | Medium      | Start with verified public-domain translations. Add modern translations only by permission.                                            |
| Hindi    | Required         | Permissioned sources, public-domain Hindi scans if found, in-house summaries translated by commissioned translator            | Low to Medium                      | High        | Do not rely on scraped IITK/Gita Supersite/Sanskrit Documents Hindi text. Build a permission pipeline.                                 |
| Tamil    | Required         | Tirukkural public-domain editions, Tamil public-domain scans, commissioned/in-house translations for app-created content      | Medium for Tirukkural discovery    | High        | Prioritize Tirukkural because Tamil is product-critical. For Sanskrit scripture translations into Tamil, expect permission work.       |
| Marathi  | Required         | Public-domain Marathi scans where verifiable, commissioned/in-house translation of glossary/festival/practice content         | Low                                | High        | Treat as a phase-2/permission track for scripture translations. Start with UI/glossary/practice translations created by us.            |

### Scripture Coverage Gap Analysis

| Corpus item               | In docs?   | Current source-review coverage | Missing or weak area                                            | Practical recommendation                                                                                                                                                 |
| ------------------------- | ---------- | ------------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Bhagavad Gita             | Yes        | Strong                         | Hindi/Tamil/Marathi rights remain weak                          | Use Sanskrit + public-domain English first; seek licensed Hindi/Tamil/Marathi translations.                                                                              |
| Principal Upanishads      | Yes        | Medium                         | Need exact list of 10-13 and translations in required languages | Define canonical list: Isha, Kena, Katha, Prashna, Mundaka, Mandukya, Taittiriya, Aitareya, Chandogya, Brihadaranyaka, Shvetashvatara, Kaushitaki, Maitri as candidates. |
| Ramayana                  | Yes        | Medium                         | Regional language versions and summaries                        | Start with key passages and original app summaries. Full translations later.                                                                                             |
| Mahabharata               | Yes        | Medium                         | Full text is huge; regional language translations risky         | Start with Gita context, key stories, and verified public-domain English; Sanskrit source later.                                                                         |
| Bhagavata Purana          | Yes        | Medium                         | Modern devotional translations often copyrighted                | Use only public-domain edition if verified; otherwise summaries written in-house.                                                                                        |
| Yoga Sutras               | Yes        | Medium                         | Public-domain translations exist but commentaries vary          | Use verified Sanskrit/public-domain English; no modern commentary without permission.                                                                                    |
| Rig Veda hymns            | Yes        | Medium                         | Vedic Sanskrit and translation complexity                       | Start with selected hymns only, with public-domain English and Sanskrit from reviewed source.                                                                            |
| Tirukkural                | Yes        | Medium                         | Needs Tamil-first treatment and English translation rights      | Add as a dedicated source track, not a side item. Verify Tamil original and public-domain English translation.                                                           |
| Devi Mahatmya             | Yes        | Medium                         | Shakta context and translation rights                           | Use public-domain edition if found; require Shakta reviewer.                                                                                                             |
| Regional/devotional texts | Yes        | Weak                           | Need exact target list by language/region                       | Phase 3. Do not ingest from Sanskrit Documents or GitHub bundles without permission.                                                                                     |
| Festival/Panchang         | Yes        | Strong                         | Need calculation implementation and regional rules              | Build independently; use Drik Panchang only for comparison.                                                                                                              |
| Glossary                  | Yes        | Strong                         | Needs multilingual plan                                         | Write English source glossary in-house, then translate to Hindi/Tamil/Marathi under work-for-hire/license.                                                               |
| Ritual procedures         | Yes        | Strong                         | Needs human review and regional tags                            | Write in-house with advisor review. Avoid copied puja procedures.                                                                                                        |
| Deities                   | Schema yes | Medium                         | Needs image/media rights and sectarian balance                  | Write in-house; source images separately with explicit rights.                                                                                                           |

### Schema Gaps for Required Languages

The current source schema has `original_text`, `transliteration`, `translation_en`, and `translation_hi`. That is not enough for the required app languages because Tamil and Marathi are first-class requirements, and Sanskrit source text may need script variants.

Recommended schema direction before real ingestion:

- Do not keep adding one column per language forever.
- Add a `passage_translations` table:
  - `id`
  - `passage_id`
  - `language_code` such as `en`, `hi`, `ta`, `mr`
  - `script` such as `Roman`, `Devanagari`, `Tamil`
  - `translator`
  - `translation_text`
  - `licence`
  - `source_url`
  - `can_use_for_rag`
  - `created_at`
- Keep `passages.original_text` for Sanskrit/Tamil/etc. source text only when that passage's original language is known.
- Add source/work-level language metadata so Tirukkural can be treated as Tamil original rather than forced into a Sanskrit-oriented model.

Until that schema exists, do not ingest Tamil/Marathi scripture translations into ad hoc JSON fields. It will make rights tracking and RAG filtering harder.

## Source-Level Review Table

| Source name                      | URL                                                           | Content covered                                                                                                                              | Content type                                              | Languages and scripts available                                              | Data format                        | Licence stated                                                                                                    | Commercial reuse risk             | Provenance quality | Technical ingestion difficulty | Best use                             | Notes and concerns                                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------ | ------------------------------ | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| jayeshmepani/HinduScriptures     | https://github.com/jayeshmepani/HinduScriptures               | Broad scripture library app; points to a `DharmicData/` folder with Vedas, Upanishads, Itihasa, Puranas, Gitas, stotras, sect-specific texts | App code, PDFs/JSONs, AI app, content collection          | Sanskrit, Hindi/English likely mixed; scripts unknown per file               | HTML/JS/CSS app; PDF/JSON content  | GitHub sidebar says GPL-3.0; README also says no specific open-source license/all rights reserved, so conflicting | High                              | Low to Medium      | Medium                         | Reference only                       | Conflicting license statements. Do not ingest. The app can inspire navigation/search, but content provenance and rights are unclear.                  |
| vedicscriptures GitHub org       | https://github.com/vedicscriptures                            | API/data projects around Bhagavad Gita and other texts                                                                                       | API, text datasets                                        | Sanskrit, English, likely Devanagari/IAST depending repo                     | JSON/API/code                      | Org page says all content under MIT                                                                               | Medium                            | Medium             | Easy to Medium                 | Use after manual review              | MIT claim is useful but must be verified per repository and per text. Need translator/commentary provenance before ingesting.                         |
| bhavykhatri/DharmicData          | https://github.com/bhavykhatri/DharmicData                    | Ramcharitmanas, Bhagavad Gita, Mahabharata, Valmiki Ramayana, Rigveda, Yajurveda, Atharvaveda                                                | Scripture text dataset                                    | Sanskrit/Hindi likely; scripts vary by directory                             | JSON                               | ODbL-1.0                                                                                                          | High                              | Medium             | Easy                           | Reference only                       | ODbL database share-alike plus third-party source rights. README cites IITK and Sacred Texts sources. Do not ingest without file-level review.        |
| hrgupta/indian-scriptures        | https://github.com/hrgupta/indian-scriptures                  | Upanishads and other Sanskrit scripture scraped from IITK                                                                                    | Scripture text dataset, scrape scripts                    | Sanskrit, likely Devanagari                                                  | CSV, scraper code                  | MIT                                                                                                               | High                              | Medium             | Easy                           | Avoid for ingestion                  | README says all files are scraped from `upanishads.iitk.ac.in`. MIT on repo does not prove IITK content rights.                                       |
| bugsum/vedic-shastra-api         | https://github.com/bugsum/vedic-shastra-api                   | API skeleton for scriptures, categories, translations                                                                                        | API, schema, app code                                     | Not primarily content                                                        | TypeScript/Mongo/API               | MIT                                                                                                               | Low for code; Unknown for content | Low                | Easy                           | API inspiration                      | Useful endpoint ideas only. Seed/content provenance unclear.                                                                                          |
| GitHub hinduism TypeScript topic | https://github.com/topics/hinduism?l=typescript&o=asc&s=stars | Public repos tagged Hinduism in TypeScript                                                                                                   | Discovery index                                           | Mixed                                                                        | Code repositories                  | Per repo                                                                                                          | Unknown                           | Low                | Easy                           | Reference only                       | Use for discovery, not as content authority. Each repo needs separate rights review.                                                                  |
| gita/gita                        | https://github.com/gita/gita                                  | Bhagavad Gita JSON                                                                                                                           | Scripture dataset                                         | Sanskrit; possible translations depending files                              | JSON                               | Unlicense                                                                                                         | Medium                            | Medium             | Easy                           | Use after manual review              | Strong candidate for Gita data shape. Need item-level check of translation/commentary sources before storing anything beyond Sanskrit verses.         |
| gita/bhagavad-gita-api           | https://github.com/gita/bhagavad-gita-api                     | Bhagavad Gita API and app backend                                                                                                            | API, schema, text API                                     | Sanskrit, English/Hindi likely through API                                   | FastAPI, OpenAPI/JSON              | MIT for code                                                                                                      | Medium                            | Medium             | Medium                         | API inspiration                      | Free API/self-hosting language does not settle text rights. Use endpoint/schema ideas now; ingest only after text rights review.                      |
| GRETIL                           | https://gretil.sub.uni-goettingen.de/gretil.html              | Large Indological e-text corpus: Sanskrit and other Indic texts                                                                              | Scripture text, scholarly corpus, TEI/XML, plain text     | Sanskrit and Indic languages; Roman transliteration/Unicode, some Devanagari | TEI/XML, HTML, TXT                 | No simple universal license found; per-file provenance                                                            | Medium                            | High               | Medium                         | Primary source after per-file review | Excellent scholarly provenance and formats. Some entries point to restricted/proprietary downloads, so file-level rights checks are mandatory.        |
| INDOLOGY/GRETIL-mirror           | https://github.com/INDOLOGY/GRETIL-mirror                     | GitHub snapshot of GRETIL Unicode files                                                                                                      | Corpus mirror                                             | Sanskrit and other Indic languages; Unicode                                  | XML/HTML/TXT                       | No explicit repo license shown                                                                                    | Medium                            | High               | Medium                         | Primary source after per-file review | Useful stable mirror and TEI source. Mirror existence does not grant app ingestion rights.                                                            |
| Gita Supersite IITK              | https://www.gitasupersite.iitk.ac.in/                         | Bhagavad Gita, other Gitas, Brahma Sutra, Yoga Sutra, related IITK sites                                                                     | Reference site, scripture, commentary, translations       | Sanskrit, Hindi, English; Devanagari/Roman                                   | HTML                               | Site copyright shown; no open reuse license found                                                                 | High                              | High               | Medium                         | Reference only                       | Valuable verification source. Do not scrape/copy/store without permission.                                                                            |
| Sanskrit Documents               | https://sanskritdocuments.org/                                | Large volunteer corpus of Sanskrit stotras, texts, devotional literature                                                                     | Scripture, stotra, ritual/devotional reference            | Sanskrit, Devanagari, IAST/ITRANS and other encodings                        | HTML/TXT/PDF                       | Explicitly personal study/research; no commercial copying/reposting without permission                            | High                              | Medium             | Medium                         | Reference only                       | Useful for discovery and cross-checking. Commercial app ingestion needs permission.                                                                   |
| Vedic Heritage Portal            | https://vedicheritage.gov.in/                                 | Vedas, Brahmanas, Aranyakas, Upanishads, Vedangas, rituals, audio/video                                                                      | Government portal, scripture, reference, media            | Sanskrit, Hindi/English; Devanagari and audio/video                          | HTML, audio, video                 | Copyright policy prohibits partial/full reproduction without written permission                                   | High                              | High               | Hard                           | Reference only                       | Use for verification and scholarly links only unless IGNCA/contributor permission is obtained.                                                        |
| Internet Sacred Text Archive     | https://sacred-texts.com/hin/index.htm                        | Public-domain and noncommercially redistributed sacred text editions                                                                         | Public-domain texts, scans/transcriptions, reference site | English, Sanskrit, Devanagari/Roman for some works                           | HTML, downloadable source files    | Custom ISTA terms; public-domain materials mixed with ISTA-produced collection/formatting rights                  | Medium                            | Medium             | Easy                           | Primary source after item review     | Good for public-domain editions. Avoid copying site indexes, introductions, images, and full ISTA-produced texts commercially without checking terms. |
| Internet Archive                 | https://archive.org/                                          | Scanned books and user-uploaded texts                                                                                                        | Scans, OCR, metadata                                      | Many languages/scripts                                                       | PDF, EPUB, OCR TXT, scans          | Item-specific; user metadata may be wrong                                                                         | Medium to High                    | Medium             | Medium                         | Primary source after item review     | Use for public-domain scans only. Verify publication date, author death date, country, renewal status, and scan quality.                              |
| Wisdom Library                   | https://www.wisdomlib.org/                                    | Hindu/Buddhist/Jain texts, summaries, dictionary/glossary pages                                                                              | Reference site, glossary, summaries, text excerpts        | English, Sanskrit, Pali, regional languages; mixed scripts                   | HTML                               | No clear open reuse license on reviewed pages; terms surfaced for related WisdomLibrary domain are restrictive    | High                              | Medium             | Easy                           | Reference only                       | Useful for comparison and finding sources. Do not ingest definitions/summaries directly.                                                              |
| cltk/sanskrit_text_gitasupersite | https://github.com/cltk/sanskrit_text_gitasupersite           | Sanskrit corpus from Gita Supersite                                                                                                          | Corpus                                                    | Sanskrit                                                                     | Plain text                         | README says public domain                                                                                         | Medium                            | Medium             | Easy                           | Use after manual review              | Public-domain claim conflicts with Gita Supersite site copyright signal. Verify file-level source and scope.                                          |
| cltk/sanskrit_text_sacred_texts  | https://github.com/cltk/sanskrit_text_sacred_texts            | Mahabharata, Ramayana, Bhagavad Gita from Sacred Texts                                                                                       | Corpus, scraped/transformed source text                   | Sanskrit in Devanagari and Latin/Roman                                       | TXT/code                           | Internet Sacred Text Archive Open Source License                                                                  | Medium                            | Medium             | Easy                           | Use after manual review              | Good structured corpus, but inherits Sacred Texts terms and attribution/noncommercial/full-text restrictions.                                         |
| Ambuda                           | https://ambuda.org/about/code-and-data                        | Sanskrit library, dictionaries, parsing; sources include GRETIL, John D. Smith, Cologne dictionaries, DCS                                    | Reference site, code/data pointers, dictionaries          | Sanskrit, Hindi, regional scripts; many scripts via UI                       | Web app, source repos, text data   | Per upstream source                                                                                               | Medium                            | High               | Medium                         | Reference and source discovery       | Excellent provenance map. Use Ambuda to identify upstream data, not as blanket permission to copy.                                                    |
| VedaWeb                          | https://vedaweb.uni-koeln.de/                                 | Rigveda-focused research interface                                                                                                           | Corpus/search tool                                        | Vedic Sanskrit, transliteration                                              | Web app, likely structured backend | Not confirmed from JS shell page                                                                                  | Unknown                           | High               | Hard                           | Reference only                       | Use for Vedic verification. Need terms/data access/licensing before ingestion.                                                                        |
| SARIT corpus                     | https://github.com/sarit/SARIT-corpus                         | Indic e-texts in TEI                                                                                                                         | Scholarly corpus, TEI/XML                                 | Sanskrit and other Indic languages                                           | TEI/XML                            | No simple license visible in reviewed GitHub page                                                                 | Medium                            | High               | Hard                           | Use after manual review              | High-value TEI corpus. Need per-text and repository license confirmation.                                                                             |
| cltk/sanskrit_text_dcs           | https://github.com/cltk/sanskrit_text_dcs                     | Corpus from Digital Corpus of Sanskrit                                                                                                       | Lemmatized Sanskrit corpus                                | Sanskrit                                                                     | Text/corpus dump                   | No clear license shown                                                                                            | High                              | High               | Medium                         | Reference only                       | DCS is a linguistic database; use for NLP reference unless licensed.                                                                                  |
| OliverHellwig/sanskrit           | https://github.com/OliverHellwig/sanskrit                     | Data for quantitative study of Vedic Sanskrit                                                                                                | Linguistic corpus/data                                    | Sanskrit                                                                     | Data files                         | No license visible in reviewed page                                                                               | Unknown                           | High               | Medium                         | Reference only                       | Potentially valuable for Vedic NLP; rights unclear.                                                                                                   |
| sanskrit-coders/sanskrit_data    | https://github.com/sanskrit-coders/sanskrit_data              | Sanskrit data schemas and utilities                                                                                                          | Schema/library                                            | Not content-specific                                                         | Python package/schema              | MIT                                                                                                               | Low                               | Medium             | Easy                           | Schema inspiration                   | Good for data modeling, validation, transliteration interfaces. Not a scripture corpus.                                                               |
| shreevatsa/sanskrit              | https://github.com/shreevatsa/sanskrit                        | Tools to read Sanskrit metrical verse                                                                                                        | Tooling                                                   | Sanskrit                                                                     | Code/data                          | Per repo license needs local check                                                                                | Low to Medium                     | Medium             | Medium                         | API/schema inspiration               | Useful for meter/transliteration tooling, not content ingestion.                                                                                      |
| Muktabodha                       | https://muktabodha.org/                                       | Shaiva, Shakta, Vedic, Tantric manuscripts and e-texts                                                                                       | Digital library, manuscripts, e-texts                     | Sanskrit, manuscripts; scripts vary                                          | Web library, images, e-texts       | All rights reserved; personal/internal noncommercial use only                                                     | High                              | High               | Hard                           | Needs permission                     | Valuable for later specialist Shaiva/Shakta/Tantra coverage. Do not ingest without written consent.                                                   |
| DSBC Project                     | https://www.dsbcproject.org/                                  | Digital Sanskrit Buddhist Canon                                                                                                              | Canon texts, manuscripts, bibliography                    | Sanskrit, Devanagari, Romanized                                              | HTML/database                      | Noncommercial education/research only; reproduction without permission prohibited                                 | High                              | High               | Medium                         | Reference only                       | Mostly Buddhist, so lower priority for Hindu app. Strong rights restrictions.                                                                         |
| GitHub topics: hinduism          | https://github.com/topics/hinduism                            | Discovery of public repos                                                                                                                    | Discovery index                                           | Mixed                                                                        | Mixed                              | Per repo                                                                                                          | Unknown                           | Low                | Easy                           | Reference only                       | Good for finding code/libs, not for source authority.                                                                                                 |
| GitHub topics: gita              | https://github.com/topics/gita                                | Discovery of Gita repos                                                                                                                      | Discovery index                                           | Mixed                                                                        | Mixed                              | Per repo                                                                                                          | Unknown                           | Low                | Easy                           | Reference only                       | Use to find candidates, then review each repo independently.                                                                                          |
| GitHub topics: sanskrit          | https://github.com/topics/sanskrit                            | Discovery of Sanskrit repos                                                                                                                  | Discovery index                                           | Mixed                                                                        | Mixed                              | Mixed                                                                                                             | Unknown                           | Low                | Easy                           | Reference only                       | Useful for tooling and corpus discovery, not direct content.                                                                                          |

## Text-Level Rights Review Table

These rows are starting decisions for specific works/datasets. Each final ingestion candidate still needs a source inventory row before adding content.

| Text or dataset                                        | Language and script                                  | Translator/commentator                                  | Source URL                                          | Copyright status                                   | Can store in database?                     | Can show excerpts?                       | Can embed full text?                              | Can use for RAG/search grounding?     | Attribution required                           | Licence conflict or concern                                                                               |
| ------------------------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------- | ------------------------------------------ | ---------------------------------------- | ------------------------------------------------- | ------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Bhagavad Gita Sanskrit verses from `gita/gita`         | Sanskrit; likely Devanagari/IAST or Roman            | None for base text unless translations included         | https://github.com/gita/gita                        | Open licensed repo, but per-file provenance needed | Unclear                                    | Unclear                                  | Unclear                                           | Unclear                               | Check repo/file attribution                    | Unlicense may cover repo contribution, but verify source of Sanskrit/translation files.                   |
| Bhagavad Gita API text                                 | Sanskrit plus translations/commentaries              | API-dependent; likely multiple translators/commentators | https://github.com/gita/bhagavad-gita-api           | Code MIT; content unclear                          | Unclear                                    | Unclear                                  | Unclear                                           | Unclear                               | Check API docs/content fields                  | MIT API license does not automatically license all text content.                                          |
| Bhagavad Gita from Gita Supersite                      | Sanskrit, Hindi, English, Devanagari/Roman           | Multiple listed on site                                 | https://www.gitasupersite.iitk.ac.in/               | Permission needed                                  | Only with permission                       | Only with permission or limited fair use | Only with permission                              | Reference only, do not ingest         | IITK/source attribution if permitted           | Site copyright and editable content; do not scrape.                                                       |
| Bhagavad Gita from CLTK Gita Supersite corpus          | Sanskrit                                             | None                                                    | https://github.com/cltk/sanskrit_text_gitasupersite | Unknown despite public-domain claim                | Unclear                                    | Unclear                                  | Unclear                                           | Unclear                               | CLTK and upstream attribution if allowed       | Public-domain claim needs reconciliation with IITK rights.                                                |
| Bhagavad Gita from Sacred Texts / CLTK Sacred Texts    | Sanskrit/Roman, sometimes English                    | Depends on edition                                      | https://github.com/cltk/sanskrit_text_sacred_texts  | Public-domain source mixed with ISTA terms         | Only after item review                     | Limited/with attribution                 | Only public-domain version, subject to ISTA terms | Yes, only after item review           | Keep source attribution and notices            | ISTA has noncommercial/full-text restrictions for some produced files.                                    |
| Principal Upanishads from IITK/upanishads scraped repo | Sanskrit, likely Devanagari                          | Not applicable or unknown                               | https://github.com/hrgupta/indian-scriptures        | Permission needed/Unknown                          | No                                         | Unclear                                  | No                                                | Reference only, do not ingest         | IITK if permitted                              | Scraped from IITK; repo MIT insufficient.                                                                 |
| Principal Upanishads from public-domain scans          | Sanskrit/English; scripts vary                       | e.g. Max Muller or other public-domain translators      | https://archive.org/                                | Public domain if item verified                     | Yes                                        | Yes                                      | Yes                                               | Yes, can ingest                       | Bibliographic attribution strongly recommended | Must verify publication date, translator death date, and scan metadata.                                   |
| Valmiki Ramayana, Griffith translation                 | English translation; Sanskrit source may be parallel | Ralph T. H. Griffith                                    | https://sacred-texts.com/hin/index.htm              | Likely public domain                               | Yes after item review                      | Yes with attribution                     | Only public-domain version                        | Yes, can ingest after review          | Translator/source attribution                  | Sacred Texts site terms and formatting restrictions still apply. Prefer public-domain scan when possible. |
| Valmiki Ramayana Sanskrit from Sacred Texts / CLTK     | Sanskrit; Devanagari/Roman                           | None                                                    | https://github.com/cltk/sanskrit_text_sacred_texts  | Public-domain base likely; site/file terms apply   | Unclear until item review                  | Limited                                  | Only public-domain version                        | Yes after review                      | Preserve notices                               | Direct download from Sacred Texts inherits ISTA terms.                                                    |
| Mahabharata, Ganguli translation                       | English                                              | Kisari Mohan Ganguli                                    | https://sacred-texts.com/hin/index.htm              | Likely public domain                               | Yes after item review                      | Yes with attribution                     | Only public-domain version                        | Yes after review                      | Translator/source attribution                  | Need use a verified public-domain edition, not modern edited summaries.                                   |
| Mahabharata Sanskrit from CLTK Sacred Texts            | Sanskrit; Devanagari/Roman                           | None                                                    | https://github.com/cltk/sanskrit_text_sacred_texts  | Public-domain base likely; file terms apply        | Unclear                                    | Limited                                  | Only public-domain version                        | Yes after review                      | Preserve notices                               | Check alignment and source.                                                                               |
| Ramcharitmanas from IITK/DharmicData                   | Awadhi/Hindi; Devanagari                             | Tulsidas; possible no translator                        | https://github.com/bhavykhatri/DharmicData          | Dataset ODbL plus IITK source rights               | Only with review; likely no for closed app | Limited/unclear                          | No without permission                             | Reference only until cleared          | IITK/source attribution                        | ODbL share-alike and source rights are blocking.                                                          |
| Rig Veda Sanskrit from GRETIL                          | Vedic Sanskrit; Roman/Unicode; sometimes TEI         | None                                                    | https://gretil.sub.uni-goettingen.de/gretil.html    | Unknown/open scholarly corpus per file             | Unclear                                    | Unclear                                  | Unclear                                           | Yes only after file-level review      | File/source/inputter attribution               | Some Vedic entries mention restricted/proprietary sources.                                                |
| Rig Veda Griffith translation                          | English                                              | Ralph T. H. Griffith                                    | https://sacred-texts.com/hin/index.htm              | Likely public domain                               | Yes after item review                      | Yes with attribution                     | Only public-domain version                        | Yes after review                      | Translator/source attribution                  | Prefer direct public-domain scan/OCR over scraping.                                                       |
| Yoga Sutras from Gita Supersite                        | Sanskrit, Hindi/English depending page               | Multiple/unknown                                        | https://www.gitasupersite.iitk.ac.in/               | Permission needed                                  | Only with permission                       | Only with permission                     | Only with permission                              | Reference only                        | IITK attribution if permitted                  | Site copyright.                                                                                           |
| Yoga Sutras public-domain edition                      | Sanskrit/English                                     | e.g. older translators/commentators, item-specific      | https://archive.org/                                | Public domain if verified                          | Yes                                        | Yes                                      | Yes                                               | Yes                                   | Bibliographic attribution                      | Choose carefully; many popular translations are modern copyright.                                         |
| Bhagavata Purana from Sanskrit Documents               | Sanskrit; Devanagari/IAST/ITRANS                     | None or volunteer-encoded                               | https://sanskritdocuments.org/                      | Permission needed for commercial copying           | Only with permission                       | Only with permission                     | Only with permission                              | Reference only                        | Permission terms                               | Site explicitly bars commercial copying/reposting without permission.                                     |
| Bhagavata Purana public-domain English edition         | English                                              | e.g. older public-domain translators if found           | https://archive.org/                                | Public domain if verified                          | Yes                                        | Yes                                      | Yes                                               | Yes                                   | Bibliographic attribution                      | Need edition selection. Many modern devotional translations are copyrighted.                              |
| Devi Mahatmya public-domain edition                    | Sanskrit/English                                     | Depends on edition                                      | https://archive.org/                                | Public domain if verified                          | Yes                                        | Yes                                      | Yes                                               | Yes                                   | Bibliographic attribution                      | Use only a verified older edition. Many modern translations are copyrighted.                              |
| Tirukkural public-domain translation                   | Tamil/English                                        | e.g. older translators if verified                      | https://archive.org/                                | Public domain if verified                          | Yes                                        | Yes                                      | Yes                                               | Yes                                   | Bibliographic attribution                      | Tamil text ancient; translations vary. Verify translator rights.                                          |
| Sanskrit Documents stotras/devotional works            | Sanskrit; multiple scripts/encodings                 | Mostly none; volunteer input                            | https://sanskritdocuments.org/                      | Permission needed for commercial use               | Only with permission                       | Only with permission                     | Only with permission                              | Reference only                        | Permission and attribution                     | Good discovery source, not ingestion source.                                                              |
| Vedic Heritage audio/video and text                    | Sanskrit/Hindi/English; Devanagari/audio/video       | Government/contributors                                 | https://vedicheritage.gov.in/                       | Permission needed                                  | Only with permission                       | Only with permission                     | Only with permission                              | Reference only                        | IGNCA/contributor attribution                  | Copyright policy blocks reproduction without written permission.                                          |
| Muktabodha Shaiva/Shakta/Tantric e-texts               | Sanskrit; scripts vary                               | Manuscript/source specific                              | https://muktabodha.org/                             | Permission needed                                  | Only with permission                       | Only with permission                     | Only with permission                              | Reference only until permission       | MIRI/source attribution                        | Terms restrict to internal noncommercial informational purposes.                                          |
| DSBC Sanskrit Buddhist Canon                           | Sanskrit; Devanagari/Roman                           | Buddhist canon/source specific                          | https://www.dsbcproject.org/                        | Permission needed/noncommercial                    | No for commercial app without permission   | Limited, if fair use only                | No                                                | Reference only                        | University of the West/source attribution      | Not core Hindu corpus; reproduction prohibited without permission.                                        |
| Wisdom Library definitions/summaries                   | English plus Sanskrit terms                          | Wisdom Library and third-party sources                  | https://www.wisdomlib.org/                          | Copyrighted/Unknown                                | No                                         | Limited quotation only                   | No                                                | Reference only, do not ingest         | Cite if used as research source                | Do not copy definitions. Write in-house.                                                                  |
| Ambuda dictionaries/texts                              | Sanskrit, Hindi, English, regional scripts           | Upstream source dependent                               | https://ambuda.org/about/code-and-data              | Per upstream source                                | Unclear                                    | Unclear                                  | Unclear                                           | Use upstream source only after review | Upstream attribution                           | Ambuda is excellent for provenance discovery, not blanket rights clearance.                               |
| SARIT TEI corpus                                       | Sanskrit/Indic; TEI                                  | Work-specific                                           | https://github.com/sarit/SARIT-corpus               | Unknown until license confirmed                    | Unclear                                    | Unclear                                  | Unclear                                           | Yes only after license review         | SARIT/work attribution                         | High technical value; rights need review.                                                                 |
| DCS/CLTK Sanskrit corpus                               | Sanskrit; lemmatized                                 | DCS                                                     | https://github.com/cltk/sanskrit_text_dcs           | Unknown                                            | No until licensed                          | No until licensed                        | No                                                | Reference only                        | DCS attribution                                | Linguistic database rights likely separate from source texts.                                             |
| Oliver Hellwig Sanskrit data                           | Vedic/Sanskrit linguistic data                       | Oliver Hellwig/source datasets                          | https://github.com/OliverHellwig/sanskrit           | Unknown                                            | Unclear                                    | Unclear                                  | Unclear                                           | Reference only                        | Source attribution                             | Strong for NLP research; not v1 corpus.                                                                   |

## Supporting Content Review

### A. Festival Calendar and Panchang Data

Do not scrape festival dates, tithi, nakshatra, muhurta, or regional calendar rows from calendar websites. Treat all such tables as database/editorial content unless a clear API/license says otherwise.

| Source                                              | Data covered                                                                                          | Calculated/editorial/database content            | Storage allowed                                         | Commercial use allowed                                              | Permission required                                     | Build own calculation engine instead? | Notes                                                                                                  |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Drik Panchang                                       | Tithi, nakshatra, yoga, karana, festivals, vrat, Ekadashi, Purnima, Amavasya, location-specific dates | Calculated data plus editorial/calendar database | Not established                                         | Not established                                                     | Yes, unless explicit commercial/API license is obtained | Yes                                   | Use as comparison reference only. Search found user-data policies, not a reusable content/API license. |
| Vedic Heritage Portal                               | Vedic calendar/ritual references and educational content                                              | Editorial/government portal                      | No without written permission                           | No without permission                                               | Yes                                                     | Yes                                   | Copyright policy blocks reproduction.                                                                  |
| karthikraman/panchangam                             | Panchangam and festival calculation using Swiss Ephemeris                                             | Calculation code                                 | Depends on repo and Swiss Ephemeris license             | Depends                                                             | Possibly for Swiss Ephemeris/commercial use             | Yes, but license-review first         | Good algorithm reference. Swiss Ephemeris has dual licensing and AGPL/commercial implications.         |
| Swiss Ephemeris                                     | Astronomical ephemeris calculations                                                                   | Calculation engine/data files                    | Not relevant as content; code/data license controls use | Commercial closed-source use likely needs paid/professional license | Yes for closed-source/commercial depending use          | Maybe                                 | Very accurate, but licensing must be approved before backend use.                                      |
| NASA/JPL Horizons or public astronomical algorithms | Planetary/lunar positions                                                                             | Calculation/reference                            | Not a festival database                                 | Usually data/reference use, but API/load limits apply               | Check API terms                                         | Yes                                   | Could avoid copied calendar data by calculating tithi/nakshatra internally.                            |
| In-house curated festival descriptions              | Diwali, Holi, Navaratri, Janmashtami, Shivaratri, regional notes                                      | Original editorial content                       | Yes                                                     | Yes                                                                 | No, if written by us                                    | Yes                                   | Dates should be calculated; explanations written and reviewed.                                         |

Calendar recommendation:

1. Build a backend calendar service that calculates lunar/solar elements for a user location.
2. Keep a small reviewed festival rule table: e.g. "Janmashtami = Krishna Paksha Ashtami in Bhadrapada, tradition/date variants noted."
3. Store calculated outputs generated by our service, not copied outputs from Drik Panchang or other sites.
4. Use Drik Panchang, government Panchang publications, and traditional almanacs only to test and compare.
5. Flag regional differences explicitly. For example, Diwali, Navaratri, Ekadashi, Janmashtami, and Shivaratri may vary by lunar month convention, sunrise rules, location, sampradaya, and regional practice.

### B. Glossary

The glossary should be written in-house, not copied from Wisdom Library, Sanskrit Documents, Wikipedia, temple websites, or sectarian sources. Use references to understand range, then create Sandhya definitions in neutral language.

Recommended workflow for 200-500 terms:

- Draft original definitions at three levels: short definition, expanded note, tradition/regional variation.
- Include authority type: scripture, philosophical school, common practice, ritual, modern usage.
- Use sources as references only unless open license is verified.
- Send terms with theological sensitivity to human reviewers.

| Source option                                  | Rights decision                                   | Can store?                                             | Can rewrite in our own words?           | Multi-tradition quality                      | Human review required? |
| ---------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------ | --------------------------------------- | -------------------------------------------- | ---------------------- |
| In-house glossary                              | Owned by Sandhya                                  | Yes                                                    | Yes                                     | High if reviewed                             | Yes                    |
| Wisdom Library                                 | Copyrighted/unclear                               | No                                                     | Yes, as research only                   | Medium; broad but uneven                     | Yes                    |
| Sanskrit-English dictionaries in public domain | Public domain if edition verified                 | Yes after item review                                  | Yes                                     | Good lexical coverage, weak practice context | Yes                    |
| Cologne Digital Sanskrit Dictionaries          | Open/research source, per-dictionary terms needed | Use after license review                               | Yes                                     | High lexical value                           | Yes                    |
| Ambuda dictionary pointers                     | Upstream-dependent                                | Use upstream only after review                         | Yes                                     | High source discovery value                  | Yes                    |
| Wikipedia/Wiktionary                           | CC-BY-SA                                          | Only if compatible with attribution/share-alike policy | Yes if not copying protected expression | Mixed                                        | Yes                    |
| Sectarian/temple sites                         | Usually copyrighted                               | No                                                     | Yes as reference only                   | Sect-specific                                | Yes                    |

Glossary source stance:

- Safe default: write all definitions ourselves and cite internal bibliography, not copied text.
- Human reviewers should check terms such as atman, brahman, moksha, bhakti, maya, guna, guru, shakti, Tantra, Vedanta, caste/community terms, initiation, mantra, and deity descriptions.
- Mark variation: Advaita, Vishishtadvaita, Dvaita, Shaiva, Shakta, Smarta, Vaishnava, regional devotional practice, and modern reformist usage.

### C. Ritual Procedures

Ritual content should be original, modest, and reviewed. It should never be framed as "the correct" method. Use "one common version" and surface variations by family, region, sampradaya, temple tradition, and priestly lineage.

| Ritual area         | Tradition/region sensitivity                   | Source authority needed                         | Direct ingest from listed sources? | Human review required? | Product stance                                                          |
| ------------------- | ---------------------------------------------- | ----------------------------------------------- | ---------------------------------- | ---------------------- | ----------------------------------------------------------------------- |
| Daily puja          | High variation by deity, household, region     | Priest/tradition advisor plus public references | No                                 | Yes                    | Present simple common home practice; note family variations.            |
| Ganesha puja        | Regional and festival-specific variation       | Advisor plus temple/priest references           | No                                 | Yes                    | Provide beginner-friendly sequence; avoid claiming completeness.        |
| Lakshmi puja        | Diwali/regional variation                      | Advisor plus regional review                    | No                                 | Yes                    | Include North/South/merchant-family differences where relevant.         |
| Shiva puja          | Shaiva/Smarta/local temple variation           | Shaiva/Smarta reviewer                          | No                                 | Yes                    | Keep home worship general; avoid initiatory practices.                  |
| Navaratri practices | Shakta, Vaishnava, regional differences        | Shakta and regional reviewers                   | No                                 | Yes                    | Explain multiple regional forms.                                        |
| Ekadashi fasting    | Vaishnava and Smarta differences               | Vaishnava/Smarta reviewers                      | No                                 | Yes                    | Include health disclaimer and non-medical stance.                       |
| Shraddha            | Highly sensitive, caste/community/family rules | Priest/human expert                             | No                                 | Yes, strict            | Provide only high-level orientation and "consult family priest/elders." |
| Sandhyavandanam     | Initiation, lineage, Vedic shakha              | Qualified reviewer                              | No                                 | Yes, strict            | Avoid procedural instruction unless expert-approved.                    |
| Aarti               | Common but deity/regional variation            | Reviewer                                        | No                                 | Yes                    | General explanation, not fixed universal text.                          |
| Temple etiquette    | Region/temple variation                        | Human reviewers                                 | No                                 | Yes                    | Practical non-prescriptive guidance.                                    |

### D. Sectarian and Regional Notes

Sources must be tagged for perspective:

- Shaiva: Muktabodha is valuable but specialist and permission-restricted.
- Shakta: Muktabodha and Devi Mahatmya sources help later, but many translations are modern copyrighted.
- Vaishnava: Bhagavata, Gita, Ekadashi, and many devotional practices need sect tagging.
- Smarta: General household puja, Panchayatana, and many pan-Hindu explanations need Smarta/general tags.
- North/South Indian: Festival dates and rituals often differ by lunar month convention and regional practice.
- Bengali/Gujarati/Tamil/Telugu/Kannada/Marathi/Odia/Nepali/Balinese/diaspora: start with notes, not full ritual prescriptions.

Do not flatten differences. Every content row should have `tradition_or_sect`, `region`, and `review_needed`.

## Ranked Recommendations

### A. Best Sources to Use Immediately for a Minimum Viable Content Corpus

1. Internet Archive public-domain scans
   - Use for: selected Bhagavad Gita, Upanishads, Yoga Sutras, Rig Veda, Ramayana, Mahabharata, Tirukkural, Devi Mahatmya editions where public-domain status is verified.
   - Why useful: item-level scans, bibliographic metadata, OCR exports.
   - Remaining checks: publication date, translator death date, country, renewal status, OCR quality.
   - Ingestion: yes, only after item review.

2. Sacred Texts public-domain Hinduism pages
   - Use for: public-domain Ramayana, Mahabharata, Gita, Rig Veda translations after item checks.
   - Why useful: readable HTML and known older translations.
   - Remaining checks: ISTA terms, attribution, whether text is ISTA-produced, commercial full-text restrictions.
   - Ingestion: selected item only after review; do not bulk-scrape.

3. GRETIL / INDOLOGY GRETIL mirror
   - Use for: Sanskrit source texts, TEI/XML, philological verification.
   - Why useful: high scholarly provenance and structured formats.
   - Remaining checks: per-file source, inputter attribution, restricted/proprietary notices.
   - Ingestion: after file-level review; likely better for Sanskrit original text than translation.

4. In-house content
   - Use for: glossary, festival explainers, practice guides, safety notes, tradition notes.
   - Why useful: rights-safe, app-specific, reviewable.
   - Remaining checks: human review and source bibliography.
   - Ingestion: yes after review.

5. sanskrit-coders/sanskrit_data
   - Use for: schema inspiration and validation ideas.
   - Why useful: MIT and data-model focused.
   - Remaining checks: none for code/schema inspiration.
   - Ingestion: no content ingestion.

### B. Sources to Use Only After Manual Licence Review

- `gita/gita`: Unlicense is promising, but translators/commentators need verification.
- `gita/bhagavad-gita-api`: good API/code, text rights must be separated.
- vedicscriptures org: MIT claim needs per-repo confirmation and content provenance.
- `bhavykhatri/DharmicData`: ODbL and upstream sources need legal review.
- CLTK Gita/Sacred Texts corpora: inherited upstream rights and attribution must be checked.
- SARIT: high-quality TEI, but license not clear from reviewed page.
- Ambuda upstream datasets: use upstream source only after confirming the relevant license.
- Panchangam calculation libraries: inspect repo license and Swiss Ephemeris obligations.

### C. Sources to Use Only as References, Not Scraped Content

- Gita Supersite and IITK related sites: authoritative reference, no direct scraping/storage.
- Sanskrit Documents: useful for discovery, not commercial copying without permission.
- Vedic Heritage Portal: high-quality reference, reproduction requires written permission.
- Wisdom Library: useful summaries and definitions, but write our own text.
- Drik Panchang: excellent comparison reference, not a data source.
- VedaWeb: Vedic research reference until data/API terms are clear.
- Muktabodha: specialist reference and future permission target.
- DSBC: Buddhist canon reference; not core for v1 and rights-restricted.
- GitHub topic pages: discovery only.

### D. Sources to Avoid or Deprioritise

- `jayeshmepani/HinduScriptures`: conflicting license language and unclear embedded content rights.
- `hrgupta/indian-scriptures`: scraped IITK content; repo MIT is not enough.
- `bugsum/vedic-shastra-api`: useful API skeleton but not a validated content source.
- Unknown GitHub apps and mobile repositories from topic pages: may have useful UI ideas, but not content authority.
- Wisdom Library copied definitions: high copyright risk; use only as research.

### E. Missing Sources to Consider

- Project Gutenberg: public-domain translations where available, with clear bibliographic pages.
- Wikisource: public-domain Sanskrit/English texts, but verify page status and proofreading level.
- HathiTrust public-domain scans: useful for public-domain editions, with access restrictions by region.
- Digital Library of India / institutional scans via Internet Archive: useful after item-level rights checks.
- Cologne Digital Sanskrit Dictionaries: glossary/lexical source after per-dictionary license review.
- Monier-Williams Sanskrit-English Dictionary public-domain editions: good lexical reference.
- Apte Sanskrit dictionaries public-domain editions: useful lexical reference.
- Government of India's Rashtriya Panchang / Positional Astronomy Centre publications: reference for astronomical calendar rules, not direct copy until rights checked.
- Skyfield/Astropy plus public algorithms: possible route for a custom Panchang engine without Swiss Ephemeris licensing issues.
- Regional public-domain sources for Tirukkural and devotional texts: evaluate by edition and translator.
- Tradition-specific human advisors: necessary for ritual, sectarian, and regional balance.

## Practical Content Strategy

### Phase 1: Legally Safer MVP Corpus

Content:

- Bhagavad Gita:
  - Sanskrit verses from a verified public-domain/open source.
  - One public-domain English translation if item-level rights are clear.
  - No modern commentary unless permission is secured.
- Principal Upanishads:
  - Select 8-10 Upanishads using verified public-domain translations.
  - Sanskrit source from GRETIL only after file review.
- Yoga Sutras:
  - Use a verified public-domain Sanskrit/English edition only.
- Glossary:
  - 200 in-house definitions, human-reviewed.
- Festivals:
  - In-house explanations for major festivals.
  - Dates generated independently or initially shown as static/manual reviewed entries with source notes.
- Practice guides:
  - Very light guidance for daily puja, aarti, temple etiquette, and mantra respect.
  - Avoid death rites, initiation, caste/community-specific rites, and advanced mantra/tantra procedures in v1.

Ingestion rule:

- Every item must have a row in `docs/source_inventory_template.csv`.
- No row means no ingestion.

### Phase 2: Expanded Scripture Coverage

Content:

- Valmiki Ramayana: public-domain translation and/or Sanskrit source after review.
- Mahabharata: Ganguli translation or other verified public-domain edition.
- Rig Veda hymns: selected hymns with public-domain translation and Sanskrit source.
- Bhagavata Purana: public-domain edition only, likely excerpts first.
- Devi Mahatmya: public-domain edition if verified; Shakta reviewer required.
- Tirukkural: Tamil plus verified public-domain English translation.
- More Gita/Upanishad translations:
  - Add multiple perspectives only if rights are clear.
  - Tag translator, tradition, and commentary status.

### Phase 3: Specialist Sources and Advanced Features

Content/features:

- Sectarian commentaries with explicit permission.
- Regional devotional texts after rights review.
- Muktabodha or other Shaiva/Shakta/Tantric materials only by agreement.
- TEI/XML ingestion from SARIT/GRETIL where licensed.
- Sanskrit NLP, morphology, meter, sandhi, and dictionary-backed lookup.
- Panchang calculation engine with location-specific tithi/nakshatra/festival logic.
- Audio/recitation metadata where rights are cleared.
- Human-reviewed ritual guides with regional/sampradaya tags.

## Source Inventory Spreadsheet Structure

Use `docs/source_inventory_template.csv` as the starting sheet.

Columns:

| Column                   | Purpose                                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| `work_id`                | Stable internal ID, e.g. `bhagavad_gita_edwin_arnold_1885`.                                  |
| `text_name`              | Human-readable title.                                                                        |
| `category`               | Scripture, commentary, glossary, festival, practice guide, dictionary, calendar, audio, etc. |
| `tradition_or_sect`      | General, Vaishnava, Shaiva, Shakta, Smarta, Advaita, etc.                                    |
| `region`                 | Pan-Indian, Tamil, Bengali, Gujarati, diaspora, etc.                                         |
| `language`               | Sanskrit, English, Hindi, Tamil, etc.                                                        |
| `script`                 | Devanagari, IAST, Roman, Tamil, etc.                                                         |
| `translator`             | Translator name or `none`.                                                                   |
| `commentator`            | Commentator name or `none`.                                                                  |
| `edition`                | Edition/publication details.                                                                 |
| `translation_year`       | Year of translation/publication.                                                             |
| `source_name`            | Site/repository/archive/institution.                                                         |
| `source_url`             | Exact page/file/item URL.                                                                    |
| `source_type`            | Scan, OCR, TEI, JSON, API, HTML, PDF, in-house, etc.                                         |
| `format`                 | Markdown, JSON, CSV, XML/TEI, TXT, PDF, scans.                                               |
| `licence`                | Exact license text/name.                                                                     |
| `copyright_status`       | Public domain, open licensed, permission needed, unknown.                                    |
| `can_store`              | Yes/No/Unclear/Only with permission.                                                         |
| `can_show_excerpts`      | Yes/No/Limited/Only with attribution/Only with permission.                                   |
| `can_embed_full_text`    | Yes/No/Only public-domain version/Only with permission/Unclear.                              |
| `can_use_for_rag`        | Yes, can ingest / metadata only / reference only / no / unclear.                             |
| `attribution_required`   | Exact attribution language if required.                                                      |
| `commercial_use_allowed` | Yes/No/Unclear/Only with permission.                                                         |
| `permission_needed`      | Yes/No/Unclear.                                                                              |
| `provenance_confidence`  | High/Medium/Low/Unknown.                                                                     |
| `ingestion_difficulty`   | Easy/Medium/Hard.                                                                            |
| `review_needed`          | Legal, content, theological, regional, technical, OCR, none.                                 |
| `human_reviewer_notes`   | Reviewer comments.                                                                           |
| `status`                 | Candidate, blocked, permission requested, approved, ingested, rejected.                      |

## Human Review Workflow

Use a lightweight advisory panel of 2-3 reviewers from different Hindu traditions. At least one reviewer should be comfortable with Sanskrit/textual context; at least one should be familiar with lived ritual practice; and at least one should be able to spot sectarian or regional imbalance.

Workflow:

1. Content collected.
2. Licence checked and inventory row completed.
3. Ingest/reference-only decision made.
4. AI or editor summary generated, with sources attached.
5. Human review for accuracy, tone, tradition balance, and safety.
6. Approved for app with reviewer/date recorded.
7. Periodic re-review after product changes, user reports, festival season updates, or corpus changes.

Review priorities:

- Ritual guidance.
- Festival explanations.
- Sensitive theological claims.
- Sectarian balance.
- Regional variation.
- AI-generated summaries.
- User-facing answers involving practice, caste, gender, death rites, initiation, mantra use, guru traditions, temple etiquette, fasting, health, grief, and family conflict.

## Clear Lists

### Safe to Use Now

- `sanskrit-coders/sanskrit_data` for schema inspiration.
- `bugsum/vedic-shastra-api` for API inspiration only.
- GitHub topic pages for discovery only.
- In-house glossary/practice/festival content written by Sandhya and human-reviewed.
- Public-domain scans from Internet Archive only after each item is verified and inventoried.

### Use After Manual Review

- GRETIL and INDOLOGY GRETIL mirror files.
- Sacred Texts individual Hindu texts.
- `gita/gita`.
- `gita/bhagavad-gita-api`.
- vedicscriptures repositories.
- CLTK Sanskrit corpora.
- SARIT corpus.
- Ambuda upstream datasets.
- Panchangam libraries and Swiss Ephemeris-based code.

### Reference Only

- Gita Supersite / IITK sites.
- Sanskrit Documents.
- Vedic Heritage Portal.
- Wisdom Library.
- Drik Panchang.
- VedaWeb.
- Muktabodha until permission.
- DSBC.
- Internet Archive restricted/borrow-only/copyrighted scans.

### Needs Permission

- Sanskrit Documents for commercial copying/reposting.
- Vedic Heritage Portal text/media reproduction.
- Muktabodha text/data reuse.
- DSBC reproduction.
- Drik Panchang data/API/commercial use.
- Gita Supersite/IITK content reuse.
- Modern translations/commentaries from any publisher or website.
- Any copyrighted scan, OCR, commentary, or database content.

### Avoid or Deprioritise

- `jayeshmepani/HinduScriptures` for ingestion due license conflict and unclear content provenance.
- `hrgupta/indian-scriptures` for ingestion due scraped IITK source.
- Bulk GitHub datasets that do not identify translator, edition, license, and upstream source per file.
- Copied glossary definitions from Wisdom Library or similar sites.
- Scraped Panchang/festival tables.

## Source Links Used

- https://github.com/jayeshmepani/HinduScriptures
- https://github.com/vedicscriptures
- https://github.com/bhavykhatri/DharmicData
- https://github.com/hrgupta/indian-scriptures
- https://github.com/bugsum/vedic-shastra-api
- https://github.com/gita/gita
- https://github.com/gita/bhagavad-gita-api
- https://gretil.sub.uni-goettingen.de/gretil.html
- https://github.com/INDOLOGY/GRETIL-mirror
- https://www.gitasupersite.iitk.ac.in/
- https://sanskritdocuments.org/
- https://vedicheritage.gov.in/
- https://vedicheritage.gov.in/terms-conditions/
- https://vedicheritage.gov.in/copyright-policy/
- https://sacred-texts.com/hin/index.htm
- https://www.sacred-texts.com/tos.htm
- https://sacred-texts.com/src/license.htm
- https://sacred-texts.com/cat/_index.htm
- https://archive.org/
- https://www.wisdomlib.org/
- https://wisdomlibrary.io/terms-of-use
- https://github.com/cltk/sanskrit_text_gitasupersite
- https://github.com/cltk/sanskrit_text_sacred_texts
- https://ambuda.org/about/code-and-data
- https://vedaweb.uni-koeln.de/
- https://github.com/sarit/SARIT-corpus
- https://github.com/cltk/sanskrit_text_dcs
- https://github.com/OliverHellwig/sanskrit
- https://github.com/sanskrit-coders/sanskrit_data
- https://github.com/shreevatsa/sanskrit
- https://muktabodha.org/
- https://muktabodha.org/terms-and-conditions/
- https://www.dsbcproject.org/
- https://www.dsbcproject.org/pages/usage-policy
- https://github.com/topics/hinduism
- https://github.com/topics/gita
- https://github.com/topics/sanskrit
- https://www.drikpanchang.com/
- https://www.drikpanchang.com/policy/drik-panchang-user-data-policy.html?lang=en
- https://github.com/karthikraman/panchangam
- https://ephe.scryr.io/swisseph/doc/swisseph.htm

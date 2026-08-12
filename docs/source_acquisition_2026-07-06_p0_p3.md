# P0-P3 source-map acquisition (2026-07-06)

This pass staged actual text carriers from the attached provisional P0-P3 source map. Files remain review-first raw staging, not approved app content.

Downloaded/scraped text carriers:

- `content/_staging/raw/english/sacred_texts/bhagavad_gita_arnold_sacred_texts_en.jsonl` from Sacred Texts: Bhagavad Gita
- `content/_staging/raw/english/sacred_texts/ramayana_griffith_sacred_texts_en.jsonl` from Sacred Texts: Valmiki Ramayana
- `content/_staging/raw/english/sacred_texts/mahabharata_ganguli_sacred_texts_en.jsonl` from Sacred Texts: Mahabharata
- `content/_staging/raw/english/sacred_texts/rig_veda_griffith_sacred_texts_en.jsonl` from Sacred Texts: Rig Veda selected hymns
- `content/_staging/raw/english/sacred_texts/yoga_sutras_bongiovanni_sacred_texts_en.jsonl` from Sacred Texts: Yoga Sutras of Patanjali
- `content/_staging/raw/tamil/tirukkural_project_madurai_source_map_ta_en.html` from Project Madurai: Tirukkural
- `content/_staging/raw/tamil/kamba_ramayanam_project_madurai_ayodhya_part1_ta.html` from Project Madurai: Kamba Ramayanam Ayodhya Kandam Part 1
- `content/_staging/raw/tamil/tiruvacagam_project_madurai_pope_part1_en.html` from Project Madurai: Tiruvacagam Part 1
- `content/_staging/raw/tamil/divya_prabandham_project_madurai_muthal_ayiram_ta.html` from Project Madurai: Naalayira Divya Prabandham Muthal Ayiram
- `content/_staging/raw/marathi/dnyaneshwari_wikisource_mr_rendered.html` from Wikisource: Dnyaneshwari
- `content/_staging/raw/english/ramcharitmanas_english_wikisource_rendered.html` from English Wikisource: The Ramayana of Tulsi Das
- `content/_staging/raw/english/vishnu_purana_taylor_anu_press_2021.pdf` from ANU Press: The Vishnu Purana
- `content/_staging/raw/sanskrit/brahma_vaivarta_purana_web_archive_gateway.html` from Web Archive: Brahma Vaivarta Purana Devanagari gateway

Blocked exact-source attempts:

- WisdomLib: Markandeya Purana WisdomLib exact source; exact scrape blocked, alternate staged text noted in inventory.
- WisdomLib: Garuda Purana WisdomLib exact source; exact scrape blocked, alternate staged text noted in inventory.

Validation notes:

- The Project Madurai Divya Prabandham TSCII URL in the pasted source map returned 404, so the already queued Project Madurai UTF-8 Muthal Ayiram URL was downloaded instead.
- WisdomLib returned 403 for automated book scrapes; Internet Archive OCR alternates are already staged for Markandeya Purana and Garuda Purana.
- ANU Press Vishnu Purana is a modern open-access PDF, not public domain; do not embed or use for RAG until the licence is reviewed.

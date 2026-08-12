-- seed.sql
-- Deterministic starter data for local development. It includes a small
-- rights-safe app-authored glossary and practice catalog so a connected
-- consumer preview is useful before the full reviewed corpus arrives.
--
-- IMPORTANT: the scripture rows below are local-development fixtures used to
-- wire up the pipeline, not the production corpus. The audited corpus is
-- collected separately and ingested via packages/content-tools. Do not treat
-- these fixture translations as authoritative or as a substitute for source
-- review. Deterministic UUIDs keep re-running the seed idempotent.

-- ---------------------------------------------------------------------------
-- texts
-- ---------------------------------------------------------------------------
insert into public.texts (id, slug, title, title_sanskrit, category, description, estimated_date, tradition_primary)
values
  (
    '00000000-0000-0000-0000-000000000101',
    'bhagavad_gita',
    'Bhagavad Gita',
    'भगवद्गीता',
    'smriti',
    'A 700-verse dialogue between Arjuna and Krishna on the battlefield of Kurukshetra.',
    'c. 200 BCE – 200 CE',
    'general'
  )
on conflict (slug) do nothing;

-- App-authored deity introductions for the Learn library.
-- These are general educational summaries, not scripture quotations or licensed source text.
insert into public.deities (
  id, slug, name, other_names, short_description, full_description, traditions
) values
  (
    '00000000-0000-0000-0000-000000000601',
    'ganesha',
    'Ganesha',
    array['Ganapati', 'Vighneshvara'],
    'A widely loved deity associated with wisdom, beginnings, and removing obstacles.',
    'Ganesha is approached in many Hindu communities as a source of discernment, welcome, and steadiness at the start of an undertaking. Stories, forms, names, and devotional practices vary across regions and lineages; this short introduction is a starting point, not a complete theology.',
    array['general', 'smarta', 'shaiva']
  ),
  (
    '00000000-0000-0000-0000-000000000602',
    'lakshmi',
    'Lakshmi',
    array['Shri', 'Mahalakshmi'],
    'A goddess associated with prosperity, beauty, generosity, and auspiciousness.',
    'Lakshmi is honoured in many traditions through prayers, festivals, household observances, and acts of generosity. Prosperity can mean material wellbeing, but traditions also connect Lakshmi with virtue, beauty, nourishment, and flourishing. Practices and theological emphasis differ by community.',
    array['general', 'vaishnava', 'shakta']
  ),
  (
    '00000000-0000-0000-0000-000000000603',
    'saraswati',
    'Saraswati',
    array['Vani', 'Sharada'],
    'A goddess associated with learning, language, music, and the arts.',
    'Saraswati is remembered by many communities in connection with knowledge, eloquence, music, study, and creative work. Students, artists, and teachers may honour her in different ways, especially around regional celebrations of learning.',
    array['general', 'shakta']
  ),
  (
    '00000000-0000-0000-0000-000000000604',
    'shiva',
    'Shiva',
    array['Mahadeva', 'Shankara', 'Rudra'],
    'A major deity understood in diverse ways across Shaiva and wider Hindu traditions.',
    'Shiva may be approached as the compassionate Lord, the ascetic, the dancer, the inner self, or the supreme reality, depending on the tradition and text. The many forms associated with Shiva are not interchangeable across every community, so learning is best grounded in the lineage or practice being discussed.',
    array['general', 'shaiva', 'smarta']
  ),
  (
    '00000000-0000-0000-0000-000000000605',
    'vishnu',
    'Vishnu',
    array['Narayana', 'Hari'],
    'A major deity associated with preservation and the many forms of divine care.',
    'Vishnu is understood as the preserver or sustainer in many Hindu frameworks, and is worshipped directly as well as through forms such as Rama and Krishna. Vaishnava traditions differ in how they describe Vishnu, his manifestations, and the relationship between the divine and the devotee.',
    array['general', 'vaishnava', 'smarta']
  )
on conflict (slug) do nothing;

-- App-authored glossary starters. These are educational summaries, not
-- scripture quotations or claims that one school owns the only meaning.
insert into public.concepts (
  id, slug, term, term_sanskrit, short_definition, full_explanation,
  examples, related_concepts, tradition_variations
) values
  (
    '00000000-0000-0000-0000-000000000701',
    'dharma',
    'Dharma',
    'धर्म',
    'A layered idea involving duty, ethics, right conduct, and what sustains life.',
    'Dharma does not have one English equivalent. Depending on context, it can point to moral responsibility, the nature of a thing, personal or social duty, teaching, or the sustaining order of life.',
    'Ask what care, responsibility, and truthfulness the present situation calls for.',
    array['karma', 'seva'],
    '{"note": "Different schools, texts, communities, and modern teachers emphasise different dimensions of dharma."}'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000702',
    'karma',
    'Karma',
    'कर्म',
    'Action and its consequences, not a simple system of instant reward and punishment.',
    'Karma relates to action. Hindu traditions explore how intention, action, habit, and consequence shape experience across time. It is more nuanced than the popular phrase “what goes around comes around.”',
    'Notice how intention changes the quality of one ordinary action today.',
    array['dharma', 'bhakti'],
    '{"note": "Accounts of how karma operates differ across Hindu philosophies and are distinct from Buddhist and Jain accounts."}'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000703',
    'bhakti',
    'Bhakti',
    'भक्ति',
    'A path and disposition of loving devotion toward the divine.',
    'Bhakti can be expressed through remembrance, song, prayer, ritual, service, storytelling, and a personal relationship with a chosen form of the divine.',
    'Offer one sincere act of attention or care without needing it to be seen.',
    array['seva', 'dharma'],
    '{"note": "Bhakti traditions differ in theology, deity focus, poetry, ritual, and the relationship they describe between devotee and divine."}'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000704',
    'seva',
    'Seva',
    'सेवा',
    'Service offered with care, often without seeking personal reward.',
    'Seva can be everyday ethical practice, community work, temple service, care for family, or service offered as spiritual discipline. The form of service depends on the person, community, and situation.',
    'Choose one useful act today and do it attentively without turning it into a performance.',
    array['dharma', 'bhakti'],
    '{"note": "What counts as appropriate service varies by context, capacity, family, community, and tradition."}'::jsonb
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- passages (3 sample verses from BG chapter 2)
-- ---------------------------------------------------------------------------
insert into public.passages (
  id, text_id, section, verse_number, order_index,
  original_text, transliteration, translation_en
) values
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000101',
    'Chapter 2', '2.47', 247,
    'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।',
    'karmaṇy-evādhikāras te mā phaleṣu kadācana',
    'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.'
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000101',
    'Chapter 2', '2.48', 248,
    'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।',
    'yogasthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya',
    'Perform your duty established in yoga, abandoning attachment, O Arjuna.'
  ),
  (
    '00000000-0000-0000-0000-000000000203',
    '00000000-0000-0000-0000-000000000101',
    'Chapter 2', '2.62', 262,
    'ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते ।',
    'dhyāyato viṣayān puṁsaḥ saṅgas teṣūpajāyate',
    'While contemplating objects of the senses, attachment to them is born.'
  )
on conflict (text_id, verse_number) do nothing;

-- ---------------------------------------------------------------------------
-- daily_reflections (3 hand-written starter reflections for date_slot 1, 2, 3)
-- ---------------------------------------------------------------------------
insert into public.daily_reflections (
  id, date_slot, title, shloka_passage_id,
  reflection_text, practice_prompt, journal_prompt, tradition, tags, is_premium
) values
  (
    '00000000-0000-0000-0000-000000000301',
    1,
    'Begin where you are',
    '00000000-0000-0000-0000-000000000201',
    'A new year, a new day, the same self. Hindu thought begins not with becoming someone new but with seeing clearly who you already are. The mind reaches outward for things to fix; dharma asks you to start with the next breath and the next small duty.',
    'Sit for two minutes before your phone. Notice three things: the breath, one sound, one feeling.',
    'What is the one small duty in front of me today that I have been avoiding?',
    'general',
    array['beginnings', 'duty', 'attention'],
    false
  ),
  (
    '00000000-0000-0000-0000-000000000302',
    2,
    'Action without grasping',
    '00000000-0000-0000-0000-000000000201',
    'Krishna does not tell Arjuna to stop acting. He tells him to act without clinging to the outcome. This is a hard teaching because the modern world rewards outcomes — but the practice begins by simply noticing the grasping, gently, again and again.',
    'Pick one task today and complete it without checking how it landed.',
    'Where in my day am I most attached to a result? What would it feel like to release that?',
    'general',
    array['karma', 'detachment'],
    false
  ),
  (
    '00000000-0000-0000-0000-000000000303',
    3,
    'The senses pull, the self steadies',
    '00000000-0000-0000-0000-000000000203',
    'Contemplating an object, the mind starts to lean toward it. This is not failure — it is how the mind works. The practice is not to stop the lean, but to notice it and return. Steadiness is built one return at a time.',
    'When you notice your phone pulling you mid-task, pause, breathe once, and return.',
    'What pulled at me today? What did the returning feel like?',
    'general',
    array['attention', 'steadiness'],
    false
  )
on conflict (date_slot, tradition) do nothing;

-- ---------------------------------------------------------------------------
-- festivals (1 starter festival; production calendar content is curated separately)
-- ---------------------------------------------------------------------------
insert into public.festivals (
  id, slug, name, name_variants, short_description,
  full_story, meaning, home_observance, regional_variations,
  traditions, tithi_rule, upcoming_dates, duration_days, is_premium
) values
  (
    '00000000-0000-0000-0000-000000000401',
    'diwali',
    'Diwali',
    array['Deepavali', 'Divali'],
    'Festival of lights celebrated across Hindu, Jain, and Sikh communities.',
    'Diwali commemorates the return of Rama to Ayodhya after fourteen years of exile, lighting lamps to guide him home. In other regions it celebrates Lakshmi, Krishna''s victory over Narakasura, or Kali.',
    'Light over darkness; the inner light recognised after long exile.',
    'Light diyas at dusk, clean and decorate the home, offer prayers to Lakshmi, share sweets.',
    '{"north_india": "Five-day festival peaking on the new moon of Kartik.", "south_india": "Naraka Chaturdashi observed the day before with an oil bath at dawn.", "bengal": "Kali Puja celebrated on the same night."}'::jsonb,
    array['general', 'vaishnava', 'shakta'],
    'Amavasya of Kartik month',
    array['2026-11-08'::date, '2027-10-29'::date, '2028-11-15'::date],
    5,
    false
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- practice_guides (free starter practices plus one premium boundary row)
-- ---------------------------------------------------------------------------
insert into public.practice_guides (
  id, slug, title, category, difficulty, duration_minutes,
  steps, materials_needed, tradition_notes, warnings, is_premium
) values
  (
    '00000000-0000-0000-0000-000000000501',
    'morning-diya-lighting',
    'Morning Diya Lighting',
    'diya',
    'beginner',
    5,
    '[
      {"order": 1, "title": "Wash hands and face", "body": "A simple act of cleanliness before lighting any flame."},
      {"order": 2, "title": "Place the diya", "body": "On a clean plate, facing east if possible."},
      {"order": 3, "title": "Light the wick", "body": "Pause for a breath as the flame catches."},
      {"order": 4, "title": "Offer a short intention", "body": "A name, a person, a quality you want to bring into the day."},
      {"order": 5, "title": "Sit for one minute", "body": "Watch the flame. Notice the mind. Return when it wanders."}
    ]'::jsonb,
    array['Diya (oil lamp or ghee lamp)', 'Wick', 'Matches or lighter', 'A clean plate'],
    'Common to most households across traditions. North and South Indian families may differ in the direction faced and the prayer offered, but the gesture of lighting a daily flame is shared.',
    'Never leave a flame unattended. Keep diyas away from children, pets, curtains, and other flammable materials, and extinguish them fully before leaving.',
    false
  )
on conflict (slug) do nothing;

-- Additional app-authored free practices keep the connected starter catalog
-- useful while the reviewed production practice library is being curated.
insert into public.practice_guides (
  id, slug, title, category, difficulty, duration_minutes,
  steps, materials_needed, tradition_notes, warnings, is_premium
) values
  (
    '00000000-0000-0000-0000-000000000503',
    'three-breath-return',
    'Three-breath return',
    'meditation',
    'beginner',
    2,
    '[
      {"order": 1, "title": "Pause", "body": "Let your hands rest and allow the body to arrive."},
      {"order": 2, "title": "Notice", "body": "Take three natural breaths without trying to change them."},
      {"order": 3, "title": "Return", "body": "Choose one task in front of you and begin it with care."}
    ]'::jsonb,
    array[]::text[],
    'An app-authored attention exercise. It is not a substitute for instruction in a lineage-specific meditation practice.',
    null,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000504',
    'evening-gratitude-reflection',
    'Evening gratitude reflection',
    'meditation',
    'beginner',
    4,
    '[
      {"order": 1, "title": "Recall support", "body": "Name one person, place, or circumstance that supported you today."},
      {"order": 2, "title": "Notice your action", "body": "Remember one small act of care you offered or received."},
      {"order": 3, "title": "Choose a return", "body": "Write one quality you would like to practise tomorrow."}
    ]'::jsonb,
    array[]::text[],
    'An app-authored reflective exercise. Families and traditions may use different evening prayers or practices.',
    null,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000505',
    'simple-nama-japa',
    'A simple repetition practice',
    'mantra',
    'beginner',
    5,
    '[
      {"order": 1, "title": "Settle", "body": "Sit comfortably and let your breathing remain natural."},
      {"order": 2, "title": "Choose carefully", "body": "Use a mantra or sacred name from your family or teacher, or choose a short word or phrase meaningful to you."},
      {"order": 3, "title": "Repeat", "body": "Repeat it gently, aloud or silently, at a steady pace."},
      {"order": 4, "title": "Return", "body": "When attention wanders, return without scolding yourself."},
      {"order": 5, "title": "Close", "body": "Take one quiet breath and carry the quality of the practice into your next action."}
    ]'::jsonb,
    array[]::text[],
    'Mantra, japa, names of the divine, initiation, pronunciation, and counting customs differ across traditions. This app-authored guide is a general introduction, not lineage-specific instruction.',
    null,
    false
  )
on conflict (slug) do nothing;

-- One app-authored premium row makes the local free/Plus boundary testable.
-- It contains no quoted scripture or licensed source material.
insert into public.practice_guides (
  id, slug, title, category, difficulty, duration_minutes,
  steps, materials_needed, tradition_notes, warnings, is_premium
) values
  (
    '00000000-0000-0000-0000-000000000502',
    'evening-reflection-practice',
    'An evening practice of return',
    'meditation',
    'intermediate',
    10,
    '[
      {"order": 1, "title": "Settle the body", "body": "Sit comfortably and let the day arrive without needing to solve it."},
      {"order": 2, "title": "Notice one moment of care", "body": "Remember one action, however small, that helped you or someone else."},
      {"order": 3, "title": "Meet one difficulty honestly", "body": "Name one place where you were reactive, tired, or unkind without turning it into a verdict."},
      {"order": 4, "title": "Choose a returning quality", "body": "Choose patience, courage, gratitude, or another quality to practise tomorrow."},
      {"order": 5, "title": "Close gently", "body": "Take three natural breaths and let the practice end without demanding a particular feeling."}
    ]'::jsonb,
    array[]::text[],
    'This is an app-authored reflective exercise. Families, teachers, and traditions may use different evening practices.',
    null,
    true
  )
on conflict (slug) do nothing;

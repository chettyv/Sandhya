-- seed.sql
-- Minimal seed data for local development. Per developer plan §2.6:
-- "3 sample passages, 3 sample reflections, 1 festival, 1 practice guide
-- so the rest of the system has something to work with before real content
-- arrives."
--
-- IMPORTANT: this is placeholder content used to wire up the pipeline. The
-- real corpus is collected separately by the product owner and ingested via
-- packages/content-tools (Phase 3). Do not treat these strings as
-- authoritative scripture. They use deterministic uuids so re-running the
-- seed is idempotent.

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
-- daily_reflections (3 hand-written placeholders for date_slot 1, 2, 3)
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
-- festivals (1 placeholder)
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
-- practice_guides (1 placeholder)
-- ---------------------------------------------------------------------------
insert into public.practice_guides (
  id, slug, title, category, difficulty, duration_minutes,
  steps, materials_needed, tradition_notes, is_premium
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
    false
  )
on conflict (slug) do nothing;

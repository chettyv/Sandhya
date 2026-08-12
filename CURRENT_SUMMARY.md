# Dharma Daily — Current Project Summary

**Last reviewed:** 12 August 2026  
**Status:** Substantial working application; not yet ready for public launch

## Executive summary

Dharma Daily is an AI-powered Hindu learning and daily-practice companion. It helps people understand Hindu ideas, reconnect with tradition, ask difficult questions, and build a gentle five-minute daily practice.

The project is beyond the idea or prototype stage. The mobile application, Supabase backend, RAG pipeline, subscriptions, notifications, admin tools, and fallback content catalog are implemented and pass the local verification suite. The remaining work is primarily product definition, content approval, production configuration, native-device verification, and organizing the current uncommitted work safely in Git.

The product must remain:

- source-grounded and transparent about citations;
- respectful of multiple Hindu traditions, regions, schools, and family practices;
- explicit about the difference between scripture, commentary, folklore, common practice, and app-authored guidance;
- a learning and practice companion, not a guru, priest, doctor, therapist, or lawyer;
- static-first for ordinary daily content, with AI used when it adds clear value.

The authoritative architecture, schema, RAG design, and milestone reference remains [`docs/dharma_daily_build_reference.docx`](docs/dharma_daily_build_reference.docx). When this summary conflicts with that document, the build reference wins unless the product owner explicitly changes the contract.

## Product definition

> A calm, source-grounded Hindu learning and practice companion that helps people understand Hindu ideas, reconnect with tradition, ask questions without judgment, and build a gentle five-minute daily practice—without pretending there is one universally correct Hindu answer.

### North-star journey

A user can ask, “How do I start reconnecting with Hinduism?” and Dharma Daily gives a warm, grounded answer, cites relevant sources, notes important tradition differences, suggests a safe five-minute practice, and saves it to the user’s journey.

If a feature does not materially improve that journey, it should normally be deferred.

## Target audience

### Recommended position

**India-rooted, but not India-only.**

The initial audience should be English-speaking Hindus and people from Hindu families—within India and the global diaspora—who feel disconnected, confused, or inconsistent and want a trustworthy, manageable way to learn and reconnect.

The first beta should contain both:

- users in India, particularly English-speaking urban users; and
- diaspora users in markets such as the United Kingdom, United States, Canada, Australia, and the UAE.

India remains culturally and strategically essential, but an English-only product should not be described as serving all of India. Hindi should be the first major post-launch localization, followed by languages selected using user demand, content rights, and reviewer availability.

### Product implications

- Prioritize Android performance, low bandwidth, smaller devices, and unreliable networks.
- Use localized store pricing rather than exporting a US or UK price directly to India.
- Do not assume every Hindu is Indian, speaks Hindi, follows North Indian customs, or belongs to one sampradaya.
- Location, region, language, family practice, philosophical perspective, and deity preference are overlapping dimensions—not one denomination field.
- Support Devanagari and IAST correctly from the start.

Current market references:

- [Pew Research Center — global Hindu population](https://www.pewresearch.org/religion/2025/06/09/hindu-population-change/)
- [IAMAI/Kantar — Internet in India 2024](https://www.iamai.in/sites/default/files/research/Kantar_%20IAMAI%20report_2024_.pdf)
- [Statcounter — mobile operating systems in India](https://gs.statcounter.com/os-market-share/mobile/india)
- [RevenueCat — State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps/)

## MVP information architecture

The recommended final primary navigation is:

| Area         | Purpose                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| **Today**    | Personalized daily teaching, reflection, practice, festival context, and gentle progress                     |
| **Ask**      | Source-grounded Ask Dharma chat with citations, tradition notes, safety handling, history, and saved answers |
| **Learn**    | Texts, passages, concepts, deities, festivals, stories, philosophical perspectives, and regional variation   |
| **Practice** | Reviewed beginner practices, reflection, meditation, diya safety, public mantra/repetition, and journaling   |
| **You**      | Personal journey, saved items, history, preferences, reminders, subscription, privacy, and account controls  |

The current tabs—Today, Calendar, Chat, Explore, and Journey—are functional but should not be treated as the final information architecture. Calendar should be accessible from Today and Learn rather than consuming a primary tab.

### Daily experience

The central daily loop should contain:

1. **Today’s teaching — approximately one minute**  
   A short cited passage, reviewed concept, or app-authored introduction.

2. **Personal reflection — two to three minutes**  
   A reflection matched to the user’s selected goal and familiarity level.

3. **Simple practice — two to five minutes**  
   Reflection, journaling, breathing, diya safety, gratitude, seva intention, or an explicitly safe and public mantra practice.

4. **Complete the day**  
   Save the teaching, write privately, complete the practice, or ask a related question.

Progress should feel encouraging rather than punitive. Streaks must not guilt users, imply spiritual failure, or create broken-chain anxiety.

## Onboarding and personalization

The current onboarding only asks for a name, one tradition preference, reminders, and a reminder time. It should become a purposeful personalization journey inspired by the supplied Bible Chat reference screenshots without copying Christian assumptions.

### Opening value carousel

Use four concise opening screens with original abstract artwork:

1. **A calmer way to reconnect**  
   Explore Hindu wisdom one small step at a time.

2. **Understand without oversimplifying**  
   See how texts, traditions, and teachers may understand an idea differently.

3. **Ask without judgment**  
   Ask questions and see the sources behind the answer.

4. **Build a practice that fits your life**  
   Create a personalized five-minute rhythm for learning, reflection, and practice.

### Visual direction

- Dark charcoal or parchment base with saffron/gold, aubergine/plum, sage, and muted teal accents.
- Editorial serif headings with a highly readable sans-serif body.
- Original abstract geometry inspired by rangoli, textiles, architecture, nature, and manuscript forms.
- Do not use deity images, Om, yantras, or other sacred forms as disposable decoration.
- Do not invent testimonials, user counts, ratings, or charity claims.
- Motion should be calm and restrained; avoid casino-like celebration and emotional pressure.
- Accessibility, dynamic type, contrast, and older users must remain first-class considerations.

### Recommended intake questions

Every question must change content selection, depth, language, reminders, or journey construction. Do not collect personal information without a real product purpose.

#### 1. What should we call you?

Optional display name.

#### 2. What brought you here today?

Allow up to two choices:

- Reconnect with Hinduism
- Understand sacred texts
- Build a daily practice
- Feel calmer and more grounded
- Learn festivals and family traditions
- Explore Hindu philosophy
- Ask questions without judgment
- Share my heritage with my family

Interstitial: **“That is a meaningful place to start. We’ll keep your first steps simple.”**

#### 3. If one thing could change, what would help most?

- Know where to begin
- Become more consistent
- Understand what I read
- Feel less confused
- Feel closer to my tradition
- Learn simple home practices
- Find calm in daily life
- Connect teachings to modern life

#### 4. How long have you felt this way?

- I have just started
- A few weeks
- A few months
- A few years
- Most of my life
- It comes and goes

#### 5. How familiar does Hinduism feel to you?

- Completely new
- I grew up around it but want to understand more
- I practise occasionally
- I practise regularly
- I have studied some texts
- I am not sure

#### 6. Do any of these traditions feel familiar?

This must be optional and multi-select:

- General / not sure
- My family’s practice
- Vaishnava
- Shaiva
- Shakta
- Smarta
- A specific sampradaya
- Other / prefer not to say

Interstitial: **“You do not need to fit into one box. We’ll explain differences when they matter.”**

#### 7. Are there forms of the divine you especially want to learn about?

Optional choices may include Krishna/Vishnu, Shiva, Devi, Rama/Hanuman, Ganesha, Murugan, Surya, many forms, no preference, or another response. This is a content preference, not a declaration that one form is correct.

#### 8. How would you like to read?

- English
- Hindi
- Sanskrit with transliteration and English
- Another language when available

This replaces Bible Chat’s “Bible version” question. Hinduism has no single equivalent of selecting a Bible translation. Dharma Daily must distinguish text, language, script, translation, and commentary.

#### 9. What would you like to explore first?

- Bhagavad Gita
- Upanishads
- Ramayana
- Mahabharata
- Yoga Sutras
- Bhakti traditions
- Deities and festivals
- I am not sure—guide me

#### 10. Which practices feel comfortable?

- Reading and reflection
- Journaling
- Meditation or breathing
- Diya and simple home practice
- Public mantra or repetition
- Festival preparation
- Seva and daily intention
- I would rather begin with learning

#### 11. How should your daily session feel?

- One teaching explained
- A story in context
- A guided reflection
- A practical step
- A short quiz
- A mixture

#### 12. Is there anything that currently feels unclear?

Optional private free-text response.

#### 13. Reminder time

Optional notification permission and preferred time.

### Onboarding safeguards

- Do not ask about caste.
- Do not force a gender question when gender does not change the product experience.
- Do not force users into one tradition.
- Do not claim to calculate or discover a user’s personal dharma.
- Do not use fake analysis, fake progress, or manipulative questions such as “Do you believe things can change?”
- Make every preference editable later.
- Explain how private free-text answers are stored and deleted.

## Personalized seven-day starter journey

Onboarding should produce a transparent, editable seven-day plan assembled from reviewed modules. It should not be invented dynamically by an LLM.

Example: **From Confusion to a Clearer Daily Practice**

1. What “dharma” can mean
2. A short teaching and reflection
3. How Hindu texts relate to one another
4. A simple home practice
5. Different traditions and shared questions
6. Applying one teaching in ordinary life
7. Choosing an ongoing rhythm

The app should say that it is selecting reviewed sessions based on the user’s choices. It must not present a generated plan as spiritual authority.

## Bible Chat patterns: use, adapt, or defer

| Bible Chat pattern                 | Dharma Daily decision                                                        |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| Verse of the day                   | Use a cited teaching, passage, concept, or reviewed reflection               |
| Personal prayer                    | Adapt to reflection, sankalpa, journaling, or safe beginner practice         |
| Denomination selection             | Use optional, overlapping tradition and family-practice preferences          |
| Bible version                      | Replace with language, script, translation, text, and commentary preferences |
| Ask anything                       | Keep as Ask Dharma with retrieved sources and tradition notes                |
| Reading/study plans                | Adapt to reviewed seven-day journeys                                         |
| Holy calendar                      | Use region- and location-aware festival guides                               |
| Streaks                            | Keep only as a gentle rhythm with no guilt mechanics                         |
| Live prayer community              | Defer beyond v1 because of moderation, privacy, and theological risk         |
| Audio, video, and animated stories | Defer until rights, cost, and editorial ownership are established            |
| Hard paywall                       | Use a prominent trial paywall, but retain a useful free path initially       |

Do not include guru matching, “AI priest” behavior, private or initiatory mantra instruction, universal ritual claims, user-generated religious advice, or an open community in the MVP.

## Free and Plus contract

### Recommended launch model

Use a prominent hybrid paywall:

1. Complete onboarding.
2. Show the personalized seven-day plan.
3. Present **Start a seven-day Plus trial** as the primary action.
4. Retain a visible **Continue with the free version** action.
5. Test a true hard-paywall variant only after the content is deep enough and analytics are reliable.

RevenueCat’s 2026 benchmarks show that hard paywalls can improve early conversion, but they do not materially improve long-term retention. For a source-sensitive spiritual product, a useful free path supports trust, word of mouth, and evaluation before purchase.

### Free

- Today’s reflection and simple practice loop
- Starter seven-day journey
- Starter practices, including meditation, diya safety, reflection, and reviewed repetition/mantra guidance
- Core concepts, deities, sacred-text catalog, and festival explainers
- Private journal, saved items, history, and reminders
- Five source-grounded Ask Dharma questions per day after sign-in
- Source visibility, tradition notes, safety handling, reporting, privacy controls, and account deletion

### Plus

- Full reviewed content catalog, subject to rights and tradition filters
- Additional journeys and deeper practice material
- No daily Ask Dharma cap, while backend fair-use, burst-rate, and budget controls remain active
- Deeper festival and practice content
- Account-linked entitlement, restore, cancellation/refund handling, and lifetime access where configured
- Offline access and audio only in later releases

Never paywall citations, safety disclosures, reporting, legal information, data deletion, or the ability to understand what a tradition-sensitive answer is claiming.

Avoid an aggressive weekly subscription at launch. Start with localized monthly and annual plans, with lifetime access only if it remains commercially and operationally appropriate.

## Current implementation status

### Implemented

- pnpm monorepo with Node 22 and pnpm 11 pinning
- Expo 56 / React Native / TypeScript mobile application
- Expo Router, NativeWind, TanStack Query, and Zustand
- Onboarding, authentication, password recovery, profile, settings, and account deletion
- Today, Calendar, Ask Dharma, Explore, and Journey tabs
- Text, concept, deity, festival, practice, reflection, journal, saved, conversation-history, and activity screens
- Supabase Auth, Postgres, RLS, pgvector, Storage integration points, and Edge Functions
- RAG pipeline with classification, safety gates, retrieval filtering, caching, structured output, citation validation, quotas, audit records, and cost controls
- RevenueCat client/server integration and entitlement verification
- Push registration, scheduling, delivery receipts, retry leases, and fencing protections
- Admin console for curated content and reported-answer moderation
- CI, formatting, linting, type checking, tests, secret scanning, and release-contract verification

### App-authored fallback catalog

The offline/connected fallback contains:

- 50 concept introductions
- 20 practice guides
- 30 rotating reflections
- 21 festival explainers

These allow meaningful browsing and practice while the production rights-reviewed corpus is developed. The festival library now includes 21 explainers, and guides without a verified local date must remain clearly labeled as guides.

### Verified locally on 12 August 2026

- Workspace TypeScript: passed
- ESLint: passed
- Automated tests: 131 passed
- Backend source and security contracts: passed
- RAG source invariants: passed
- Authored catalog invariants: passed
- Canonical content validation: passed

### Not yet complete or proven

- Expanded onboarding and personalization funnel
- Real personalized seven-day journey system
- Final five-tab information architecture
- Production Supabase migration and two-user RLS proof
- RevenueCat product, trial, price, webhook, renewal, cancellation, refund, and transfer verification
- Native EAS development builds and physical-device testing
- Push delivery, notification deep links, timezone boundaries, and offline behavior on iOS and Android devices
- Production support email, Privacy Policy, Terms, analytics, Sentry, and store metadata
- Hosted admin console and approved operator accounts
- Accessibility and network-throttling QA on real devices
- Sufficient multi-tradition editorial and theological review

## Content and RAG status

The content pipeline has many staged source candidates, but staged does not mean approved, licensed, or safe to ingest.

Current facts:

- Only one canonical Markdown content file is presently approved and validated for production ingestion.
- The app-authored static catalog is usable as a reviewed fallback layer.
- `content/_staging` contains hundreds of raw and prepared files for investigation and audit.
- No staged source may enter production without translator, edition, copyright, storage, excerpt, embedding, commercial-use, and attribution decisions.
- Changing the embedding model requires explicit approval and full-corpus re-embedding.
- Festival dates require a named regional/location policy; calendar websites must not be scraped without appropriate rights.

Relevant retained records:

- [`docs/content_source_review.md`](docs/content_source_review.md)
- [`docs/source_inventory_template.csv`](docs/source_inventory_template.csv)
- [`docs/source_download_queue_2026-06-19.csv`](docs/source_download_queue_2026-06-19.csv)
- [`docs/religious_texts_research_checklist.md`](docs/religious_texts_research_checklist.md)
- [`docs/downloadable_sources_by_language.md`](docs/downloadable_sources_by_language.md)
- [`docs/open_licensed_hindu_text_source_map.md`](docs/open_licensed_hindu_text_source_map.md)

## Branch and worktree status

The branch names suggest parallel workstreams, but the branches do not currently contain separate active work.

| Branch                       | Commit    | Actual state                                                                          |
| ---------------------------- | --------- | ------------------------------------------------------------------------------------- |
| `main`                       | `e0c8fbb` | Matches `origin/main`, but virtually all new work exists as uncommitted local changes |
| `Frontend`                   | `13628e8` | One commit behind `main`; no unique frontend commits                                  |
| `RAG_Pipeline`               | `13628e8` | One commit behind `main`; no unique RAG commits                                       |
| `Source_Collection`          | `13628e8` | One commit behind `main`; no unique source-collection commits                         |
| `origin/Frontend`            | `13628e8` | Same stale schema commit                                                              |
| `origin/RAG_Pipeline`        | `13628e8` | Same stale schema commit                                                              |
| `origin/Source_Collection`   | `13628e8` | Same stale schema commit                                                              |
| Historical `Database-Schema` | merged    | Merged through pull request 1 and no longer active                                    |

Worktree state at the time of this review:

- 857 staged files
- 16 additional unstaged files
- 40 untracked files
- Approximately 5.26 million staged inserted lines
- 35 untracked Bible Chat reference screenshots
- 610 staged raw source files using approximately 331.5 MiB
- Approximately 1.14 GiB under `content/_staging`, including ignored generated corpora

All current frontend, RAG, backend, source, and operations work is mixed together in the local `main` worktree. The branches are therefore not actually functioning as independent workstreams.

This is the most immediate repository-management risk. The work should be preserved before more implementation begins.

## Manual decisions required

### Product decisions

1. **Target audience and launch markets**  
   Approve “India-rooted, India plus diaspora, English-first” or choose a narrower launch cohort.

2. **Free versus paid access**  
   Approve the recommended hybrid paywall or explicitly replace the current useful-free-core contract with a hard trial paywall.

3. **Final navigation**  
   Approve Today, Ask, Learn, Practice, and You, with Calendar nested inside Today/Learn.

4. **Onboarding questions and privacy**  
   Approve the questions, answer options, skip rules, stored profile fields, private-text handling, analytics events, and deletion behavior.

5. **Tradition taxonomy**  
   Decide which traditions, philosophical perspectives, regions, family practices, and deity preferences v1 supports. Recruit reviewers before presenting the taxonomy as authoritative.

6. **Seven-day journey content**  
   Write and approve the first journey modules and the deterministic rules mapping onboarding answers to them.

7. **Visual identity**  
   Approve palette, typography, illustrations, logo, motion, sacred-imagery rules, accessibility baseline, and app-store creative direction.

8. **Content scope**  
   Approve exact texts, editions, translators, festivals, practices, languages, and rights before ingestion.

9. **Festival/calendar policy**  
   Define regions, locations, timezone behavior, calendar authority, and how differing or uncertain dates are displayed.

10. **Pricing and trial**  
    Define monthly, annual, lifetime, trial duration, localized offerings, refund/support wording, and Indian pricing.

11. **AI model and budget**  
    Approve the production provider, model, actual token rates, monthly budget, free quota, escalation policy, and evaluation threshold.

### Operational decisions and configuration

- Supabase production project and migration approval
- Auth redirect allowlists and Apple/Google provider setup
- RevenueCat products, entitlements, offerings, SDK keys, webhook secret, and subscriber API key
- App Store Connect, Google Play Console, EAS project, APNs, and FCM configuration
- Support email, Privacy Policy URL, Terms URL, and legal entity details
- PostHog and Sentry projects and data-minimization policy
- Monthly AI-provider spend alerts and backend budget values
- Hosted admin-console destination and approved administrator list
- Content reviewers representing multiple Hindu traditions and regions
- Closed-beta participants in India and the diaspora

### Git preservation decision

Before further development, decide whether to:

- create a recovery/checkpoint branch and commit preserving the current state; or
- split the staged work into reviewed frontend, backend, RAG, operations, and source-content commits.

Also decide whether hundreds of megabytes of raw staged sources belong in ordinary Git, Git LFS, or external content storage. Generated prepared corpora should remain outside ordinary Git history.

## Recommended next sequence

1. Preserve the current local work safely in Git.
2. Approve the audience, navigation, onboarding, journey, visual identity, and paywall decisions.
3. Turn approved onboarding responses into a versioned profile and personalization schema.
4. Write and review the first seven-day journey.
5. Implement the opening carousel, onboarding funnel, plan preview, and hybrid paywall.
6. Continue rights review and build a small production-quality canonical corpus.
7. Configure Supabase, RevenueCat, EAS, legal links, telemetry, and admin hosting.
8. Run disposable-user backend smoke tests and physical-device native tests.
9. Beta-test with both Indian and diaspora cohorts.
10. Decide whether to retain the free path or test a harder paywall using real conversion, trust, retention, and support data.

## Explicitly deferred beyond v1

- Open community and live prayer rooms
- User-generated religious advice
- Guru or teacher matching
- Live darshan
- Large audio and video libraries
- AI-generated deity or sacred imagery
- Precise Panchang calculations without a reviewed provider and regional policy
- Advanced or initiatory mantra and ritual instruction
- Separate native Swift and Kotlin applications
- Model fine-tuning before retrieval quality and evaluation coverage are proven

## Documentation policy

Keep documentation that provides one of the following:

- authoritative product or architecture decisions;
- licensing, provenance, acquisition, or editorial audit history;
- operational runbooks and release evidence;
- API collections or technical diagrams still used by the project.

This file is the single current project, MVP, branch, and decision summary. Update it whenever a major product decision is approved, a release gate changes, or branch ownership changes.

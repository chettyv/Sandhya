# Dharma Daily — Remediation Plan (v2)

**Written:** 12 August 2026 · supersedes v1 of the same date
**Inputs:** `01-review.md` · `CURRENT_SUMMARY.md` · verified market data (Appendix A) · founder decisions taken 12 Aug (Appendix B)
**Constraints:** 20–35 hrs/week · self-imposed decide-by date · goal is _"a product people actually use and a nice bit of passive income"_

---

## 0. WHAT CHANGED FROM v1, AND WHY

v1 called **PIVOT**: abandon the app, sell festival guides to diaspora parents on the web.

Four founder decisions have since narrowed the spec, and three of them are corrections to me rather than the other way round:

| Decision                                                                    | Effect on v1                                                                                |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Not schools**                                                             | Correct. Bal Vihar was my _channel_ guess, not the audience. Dropped.                       |
| **Not children — adults only**                                              | Removes the painkiller v1 was built on. Replaced with a stronger adult one (§2).            |
| **Not festivals as the product** — daily shloka + reflection is the product | Reverts the core toward the original spec. Festivals demoted from product to arrival spike. |
| **AI is a depth layer on today's content**, not a hidden authoring tool     | Better than my framing. Scoped retrieval is cheaper and safer than an open chat box.        |
| **Hindi before Tamil**                                                      | Accepted, and Hindi is stronger than I said (§4).                                           |

**This document therefore calls FIX, not PIVOT.** That is a real reversal of v1's Step 1, driven by the decisions above, and it is stated plainly rather than quietly retconned. FIX is defensible here **only under the five conditions in §1.2.** If any of them is dropped, the review's fatal finding reasserts and the decision must go back to PIVOT.

**Three corrections to v1's own reasoning, on the record:**

1. **"When is Diwali 2026" is a weak SEO asset.** It is a zero-click query — Google answers it in the knowledge panel, AI Overviews eat the remainder. v1 leaned on it heavily. The SEO case survives on _explanatory_ queries only (§5).
2. **Astrotalk is astrology, not religion.** v1 used it too loosely. The argument does not depend on it — **Sri Mandir alone carries it**, and Sri Mandir is unambiguously devotional. Astrotalk contributes only the _shape_: in Indian spiritual tech, revenue comes from a human doing something for you.
3. **"AI must never touch translation" was too absolute.** Bible translation does this at scale, properly. Corrected in §4.4.

---

## 1. THE DECISION

# FIX — conditional, sequenced, with a hard stop

### 1.1 Why FIX is now defensible

v1 rejected FIX because the specification paired India-primary economics with a content subscription and had no arrival mechanism. Two of those three are addressed by the decisions taken:

- **The paid product changes shape.** Not "more content behind a wall" — a finite, completable, guided journey. This matters more than it sounds (§1.3).
- **The market re-weights to diaspora.** Not India-primary. The LTV gap is 2.3× on RevenueCat's subscription cohort and roughly 10× on Sri Mandir's own published ARPU.

The third — no arrival mechanism — **is not yet addressed.** It is the entire content of §5 and the stop condition in every phase.

### 1.2 The five conditions. FIX survives only if all five hold.

1. **The paid product is a finite journey, not a content library.** Reason in §1.3.
2. **Diaspora-weighted, not India-primary.** India can use it; India is not who the pricing or the roadmap serves.
3. **The AI layer stays scoped to today's content and quota'd.** An open chat box reopens the Section 8 bind.
4. **An arrival mechanism gets built and measured, not deferred indefinitely.** Not necessarily first — but it must have a date and a number.
5. **Something ships to strangers before Diwali, 8 November 2026.** Not the whole product. Something.

### 1.3 Why "finite journey" rather than "content library" — the load-bearing argument

Static daily content is near-zero marginal cost. That is a genuine strength and it is also the trap.

**Zero marginal cost is why content in this category is free everywhere.** YouVersion gives it to a billion people, by policy. GitaGPT is free. Sri Mandir's library is free. There are dozens of free Gita apps. When every competitor's marginal cost is also zero, price goes to zero — and it has.

Astrotalk can charge ₹30/min _precisely because_ its marginal cost is not zero: you are buying a scarce human's attention. **Scarcity creates pricing power. Cost does not.**

A finite journey manufactures the scarcity that content lacks. It is bounded, effortful, completable, and it ends — so it reads as a _course_, which people pay for, rather than a _catalogue_, which they don't. The evidence is unambiguous:

| Product                         | Price                           | Shape                                       |
| ------------------------------- | ------------------------------- | ------------------------------------------- |
| Hallow's biggest engine         | Pray40 — a **40-day challenge** | Finite                                      |
| Isha Inner Engineering Online   | **$209.99**                     | Finite course                               |
| Chinmaya Bhagavad Gita course   | **₹7,000** (~£60)               | Finite, 15 months, 30 lessons               |
| Sadhguru Exclusive              | $9.49/mo                        | Subscription — no published subscriber data |
| Sri Mandir content subscription | ₹299/yr (~£2.70)                | Library — **under $100k IAP in six years**  |

The seven-day journey already specified in `CURRENT_SUMMARY.md` is the right product. **It is also the one major item still unwritten.** That is not a coincidence — content is slower than code and returns no dopamine, exactly as the review says.

### 1.4 What this costs, stated honestly

FIX keeps the app, which means it keeps most of the review's Serious findings alive rather than dissolving them. Specifically, these remain **unfixed and must be managed rather than designed away**:

- Episodic need vs daily product (Serious 2) — mitigated by festivals as arrival, not solved
- Every layer free elsewhere (Serious 5) — mitigated by journeys, not solved
- Inference economics (Serious 7) — mitigated by scoping, not solved
- Editorial and moderation load (Serious 8) — **not mitigated at all.** Live AI answers mean a moderation queue for one person, indefinitely.
- App-first forfeits search (Serious 9) — solved only if the web layer in §5 actually gets built

v1 dissolved four of these by removing the app. FIX does not have that option. **This is the price of the decision, and it should be a conscious purchase rather than a surprise in six months.**

---

## 2. THE AUDIENCE AND THE PAINKILLER

**Audience:** adults. No children in the framing. English-speaking Hindus and people from Hindu families, weighted to the diaspora — **UK, US, Canada, and the Gulf** (UAE, Saudi, Qatar, Oman). India is served and welcome; India is not who the roadmap or the pricing is built for.

_Gulf note, absent from v1:_ Sri Mandir counts UAE in its diaspora bucket, which carries **~10× the ARPU** of its Indian users (₹7,000 vs ₹600–800). Gulf Indian families skew Malayali, Telugu and Tamil, so **English serves them better than Hindi does** — a point that cuts against the intuitive case for Hindi-first.

**The painkiller — the adult version, and it is stronger than v1's:**

> **You are now the one who has to do it.** Your mother ran the household observance. She has died, or she is in India, or she is too frail. This year it is your house, your puja, your responsibility — and you realise you never actually learned. You cannot ask, because asking reveals you don't know.

Acute. Annual. Shame-driven. Those are the three properties the review identifies as making people pay, and this version has all three with no child anywhere in it.

**Adjacent triggers, in order of intensity:**

1. **A death and the rites that follow.** The strongest painkiller in the entire category — time-critical, emotionally unbearable to get wrong, and the reason Sri Mandir's business exists. **Name it, do not build it first.** It is a different product and a hard thing to market without appearing to profit from grief.
2. **Inheriting the household observance** — the one above. The wedge.
3. **Fasting and vrat rules** — Ekadashi, Navratri. Practical, recurring, high-intent, low-risk.
4. **Explaining to a non-Hindu spouse or in-laws** — growing, especially UK/US.

---

## 3. THE ARCHITECTURE

Four layers. Each has one job. Confusing them is what produced a five-tab app with no customer.

| Layer       | What it is                                                           | Price         | Job                    |
| ----------- | -------------------------------------------------------------------- | ------------- | ---------------------- |
| **Arrival** | Explanatory web pages, indexed. **Synchronised festival challenges** | Free, **web** | Make strangers show up |
| **Habit**   | Daily shloka + daily reflection, **audio-first**                     | Free, **app** | Bring them back        |
| **Depth**   | Scoped AI on _today's_ content — grounded, cited, tradition-aware    | Free, quota'd | Build trust            |
| **Revenue** | Finite guided journeys, **dated and communal**                       | **£8–25**     | Get paid               |

This is YouVersion's and Hallow's structure. Both run a substantial web property that feeds the app — **web is not instead of the app, it is the front door to it.**

### 3.1 What to take from Hallow — the best available template, and closer than Bible Chat

Bible Chat is a paid-UA machine: ~2,000 Apple Search Ads keywords, Series A money, 95%+ of revenue from the US App Store. Almost none of it transfers at £0. **Hallow's structure does**, and it maps onto the architecture above almost exactly.

**Take these four:**

**1 · The synchronised challenge — Pray40. This is the single most important transfer.**

Not "a 40-day journey you start whenever." A 40-day challenge that **everyone starts on the same day**, where sessions **unlock one day at a time**, where the join screen shows **live participation counts** ("XXXX of XXXX joined"), where groups can go through it together — and which **requires a trial or subscription to join**.

Look at what that does in one move. Ash Wednesday drives 263,000 downloads → the challenge is the reason to open the app → joining the challenge is the paywall event. **Arrival, activation and conversion are the same mechanic.** That is the machine, and the daily verse is just what keeps people there afterwards.

**Hinduism has a better version of this than Catholicism does, and it is 60 days away.** Navratri is _nine nights_, 11–20 October 2026 — nine devi forms, Shailaputri through Siddhidatri, one per night. It is already synchronised, already socially observed, already emotionally loaded, and it needs no invention. Nine nights, nine sessions, unlocking one at a time. Diwali (8 Nov) is five days. A Gita challenge could be 40.

**2 · Audio-first, with chosen session length.** Hallow's core content is _audio_, downloadable, at 1 / 5 / 10 / 15 / 30 / 60 minutes, with background music including Gregorian chant. `CURRENT_SUMMARY.md` defers audio to "later releases." **That is probably wrong here, and more wrong than it is for Hallow** — a shloka is an oral form. It is meant to be heard and recited, not read silently. Audio is also how you deliver the pronunciation layer in §4.1, and it serves older users better than text.

This does not mean a studio. It means _you_, or a reviewer, reading the shloka clearly, with a slow repeat-after-me pass. That is a phone microphone and an afternoon.

**3 · Shared intentions — "Prayer Families".** Hallow lets you _"connect with your friends, family, prayer group, parish, & community to share prayers, intentions, or journal reflections."_

**This is the organic loop the review said did not exist.** Review §5: _"The journal is private by design. No invitation, no shared artifact, no network effect."_ Hallow's answer is to make the journal optionally shareable to a small trusted group.

And Hinduism has the stronger case: **puja is already a household activity.** A family doing Navratri together is the normal unit of observance, not an app feature bolted on. A shared nine-night challenge across a family in London, Leicester and Ahmedabad is a natural thing, not a growth hack.

**4 · Reminders, gentle streaks, goals.** Hallow has all three. Your spec's "no guilt mechanics" rule stays — it is the right call and Hallow is not especially punitive either.

**Do not take these:** celebrity guides (Hallow has Mark Wahlberg; you have £0), studio-scale audio production, or the parish-partnership infrastructure — that last one is what you'd _need_, and it took Hallow 2,500 partnerships and a fundraise to build.

**Why "scoped AI" is better than the chat box already built.** Today's shloka is the retrieval context. The user asks about _this verse_, not about Hinduism in general. Three consequences: retrieval is bounded so cost is bounded; the failure surface shrinks dramatically because the model is never asked to free-associate across the corpus; and it is the exact thing ChatGPT is worst at, because ChatGPT will confidently invent Gita 2.47 and cannot tell you which commentary tradition it just flattened.

**Explicitly excluded, and why:**

- **Astrology / jyotisha.** Not now, possibly never. Do not look at Astrotalk's ₹1,176 Cr and conclude "add astrology" — that revenue is 1,500 human astrologers' time at ₹5–50/min. You cannot capture it with software; it is a marketplace with a supply side, payouts and consultation-quality control. A different company.
- **A consultation marketplace.** Same reason. Note the profitability worry is unfounded — Astrotalk made ₹27 Cr PAT in FY23 — but one person cannot run a supply side.
- **Precise Panchang calculation.** Your spec already defers this correctly. Keep the deferral; people plan weddings off muhurta.
- **Festival dates _are_ in scope**, and are calendar work rather than astrology. Do them properly, with a named regional and timezone policy. Research found sources disagreeing by ±1 day on several 2027 dates, and Janmashtami genuinely split between Smarta and ISKCON observance.

---

## 4. LANGUAGE, SCRIPT AND TRANSLATION

Four separate things, four different fates. Bundling them is part of what made the scope unmanageable.

### 4.1 Pronunciation — CORE, and the most under-rated item in the spec

Every quoted line needs three registers:

| Register                        | Example        | For                                |
| ------------------------------- | -------------- | ---------------------------------- |
| Devanagari                      | लक्ष्मी        | Authenticity; the real script      |
| IAST                            | Lakṣmī         | Precision in citations             |
| **Plain-English pronunciation** | **LUCK-shmee** | **The one the user actually uses** |

The third row does not exist in `CURRENT_SUMMARY.md` and is missing from essentially every competitor found — Chinmaya's print workbooks, Amar Chitra Katha, the Twinkl resources. IAST is for scholars; an adult about to recite in front of family cannot parse a macron and a subscript dot under pressure.

**This is the one differentiator the buyer can perceive.** The review's Serious-3 complaint was that citation provenance is invisible — nobody can audit whether Gita 2.47 was cited correctly. But anyone knows within thirty seconds whether they were able to say the words properly out loud. Pronunciation is auditable by the person who needs it.

_Effort: ~1 day to fix the format and a house style. Then discipline._

### 4.2 Source translations — retained, narrowed

From a rights-cleared multi-text corpus to a citations list. Public-domain and open-licensed only; you already hold `docs/open_licensed_hindu_text_source_map.md`, which is overkill for this and was never going to be enough for the original scope. Translator and edition named at every quote — that discipline is built and costs nothing to keep.

**This converts rights review from an open-ended blocker into a checklist**, and probably removes two to four months from the review's "4–8 months to shippable."

### 4.3 Hindi before Tamil — accepted, and Hindi is stronger than v1 said

v1 framed Hindi as a relay target (Sanskrit → English → Hindi). **That is wrong for a large part of it.**

Tulsidas's **Ramcharitmanas** and **Hanuman Chalisa** are Awadhi — not translations of Sanskrit. So are Surdas, Kabir, Mirabai, Raidas. The Hanuman Chalisa is plausibly the most-recited Hindu text on earth and it is originally in a Hindi-family language.

Two consequences, both good:

- **No relay problem.** These are primary texts in the target language.
- **No rights problem.** Tulsidas died in 1623; Kabir and Mirabai earlier. **All public domain in the original.** No translator to license, no derivative-work question, no estate to chase — a materially better position than the Sanskrit corpus that has been stalling rights review for months.

**Tamil third**, and it is a genuine second front rather than a translation: Thevaram, Thiruvasagam, Nalayira Divya Prabandham, Thirukkural are their own primary canon. More authentic than translated Sanskrit, and a completely separate rights and reviewer universe. Needs someone who knows Shaiva and Sri Vaishnava terminology.

**Unchanged cost for both:** a named native reviewer signing off on anything that ships.

### 4.4 AI and translation — corrected from v1's "hard no, permanently"

That was too absolute and the correction matters. Bible translation does exactly this, at scale, and it works.

But look at what the apparatus actually is. Avodah has mother-tongue speakers hand-translate **~1,200 seed verses per language first**, trains on those, has native speakers check every draft, then runs community testing — with SIL's separate quality-assessment tooling alongside. Ten languages, institutional backing. The Gospel Coalition piece is explicit: _"We're not talking about dropping the Greek New Testament text into a tool like ChatGPT."_

**So the line is not the tool. It is the sign-off.**

| The AI may                                      | The AI may never                                      |
| ----------------------------------------------- | ----------------------------------------------------- |
| Draft translation for a named human to check    | Ship any translated or transliterated text unreviewed |
| Draft English prose around a quote              | Generate the quoted text itself                       |
| Draft the pronunciation guide _(human-checked)_ | Be the final authority on tradition difference        |
| Fact-check dates, variation, disagreement       | Decide what is scripture vs commentary vs folklore    |
| Speed up your existing provenance checking      | Substitute for a named human reviewer                 |

Two things AI does not solve regardless: **relay translation** (Avodah trains on text translated from source by mother-tongue speakers, not English relay) and **rights** (translating a licensed English translation creates a derivative work — a permissions problem, not a quality one).

---

## 5. ARRIVAL — the unsolved problem

The review's #1 pre-mortem cause, weight _dominant_: **"No distribution mechanism ever existed."** Eighteen months, 5.26M staged lines, 131 passing tests, zero strangers. Nothing in the decisions taken so far changes this, and the architecture in §3 does not either.

**Verse-of-the-day is a retention mechanic, not an acquisition mechanic.** Look at how the three big successes actually grew:

| App        | How it grew                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------ |
| YouVersion | Distributed by Life.Church and partner churches. Free forever by policy. Not a business.         |
| Hallow     | Feb 2024: 2M installs with **paid media spend up 15×** plus 2,500 parish QR partnerships         |
| Bible Chat | Apple Search Ads across **~2,000 keywords**, outspending competitors 2:1, plus a 60M-view TikTok |

**None grew because of the daily verse.** Each had a separate arrival engine — a megachurch, a parish network, or Series A money. The daily verse kept the people the engine delivered.

Trust converts traffic into customers. It does not create traffic. That distinction is the whole of this section.

### The three channels available at £0

**1 · Explanatory search — the only one that compounds**

Not date queries. Those are zero-click. **Explanatory and procedural queries**, where the answer cannot fit in a knowledge panel:

> _what does this shloka mean · why do we fast on Ekadashi · how do I do Lakshmi puja at home · what to say when lighting a diya · Hanuman Chalisa meaning line by line · what can I eat during Navratri_

The incumbents on these are Indian e-commerce blogs funnelling to jewellery, India-based parenting portals, and Twinkl/TES writing for non-Hindu RE teachers. Nobody writes for this reader.

**Verify before committing:** absolute search volumes could not be retrieved in research (Keyword Planner and Ahrefs both inaccessible). Pull them yourself with UK+US+CA+AE geo filters before choosing target keywords.

**2 · Festivals as arrival spikes** — the Hallow structure exactly. Ash Wednesday 2026 drove **263,000 downloads in a single day against a ~10,000/day baseline — 25×** — to an app whose product is daily prayer. Hinduism has four or five of these a year: **Ganesh Chaturthi 14 Sep · Navratri 11–20 Oct · Diwali 8 Nov 2026 · Holi 22 Mar 2027.**

_Caveat, because it is the difference between a plan and a hope:_ Hallow's spike was substantially bought. The festival supplies **demand**; it does not supply **reach**. You currently have no equivalent of the parish network.

**3 · Warm network, used correctly** — temple and family contacts, and friends in India and the Gulf. The rule that makes this a test rather than a favour: **use warm contacts to reach strangers, not to be the strangers.** A mandir noticeboard, someone else's WhatsApp group, a temple newsletter. If the first 100 are your cousins, you have learned that people who like you will do you a favour.

### First 100 → 1,000

The first 100 are manual: roughly 30 discrete actions across the three channels, plausibly 170–980 visitors, 37–225 signups at a 15–25% capture rate. **That range straddles the pass mark, which is what makes it a real test.**

100 → 1,000 is SEO on a 12–18 month lag, plus festival spikes. **Diwali 2027 (~28 Oct) is the first event where content published in 2026 could rank.** Say the honest thing out loud: **1,000 real users is a 2028 number.** Against "a product people use and a nice bit of passive income," that is a fit. Against replacing an income, it is not, and no plan in this document is.

---

## 6. CUT LIST

### CORE

Daily shloka + reflection loop · the existing content catalog (50 concepts, 21 festivals, 30 reflections, 20 practices) · scoped AI on today's content · **one dated, synchronised paid challenge** · payment · **the three-register pronunciation format** · **basic audio for every shloka** (§3.1.2 — promoted from LATER) · citation validation and provenance · an indexable web surface · reminders

### LATER

Additional challenges · **shared intentions / family groups** (§3.1.3 — the organic loop; second priority after the first challenge sells) · Hindi (§4.3) · Tamil · the full canonical corpus · personalisation depth · offline · session-length variants · Panchang

### CUT NOW

- **The 13-question onboarding funnel** and the four-screen carousel. Nineteen screens to first value is Serious 4 and it is unchanged by any decision taken.
- **The Calendar tab** — commoditised; a dozen free Panchang apps do it better.
- **Streaks** in any guilt-bearing form. (Gentle streaks and goals stay — Hallow has both.)
- **Journal as private-only.** Not the journal itself — the _private-by-design_ constraint. Keep it private by default, make sharing to a small trusted group possible. Review §5 calls a purely private journal "a defensible editorial choice and a fatal growth choice."
- **The admin moderation console** — until there are answers to moderate.
- **Push retry leases and fencing** — until notifications reach a stranger.
- **The 35 Bible Chat reference screenshots.** Keep the _pattern table_ in `CURRENT_SUMMARY.md`, which is genuinely good analysis. Delete the screenshots. Bible Chat bought ~2,000 Apple Search Ads keywords; their funnel is not transferable at £0.
- **India-primary pricing and roadmap assumptions.**

### Built to look complete rather than because a user needed it

Push retry leases and fencing. The admin moderation console. RevenueCat entitlement verification. Five tabs. CI with secret scanning and release-contract verification. **Every one is production-grade infrastructure for zero users.** The work is good. It was aimed at the wrong question.

---

## 7. SEQUENCED PLAN

Planned at **25 hrs/week**, interruption assumed. Sequenced product-first, as decided — with the arrival gap converted from an argument into a numbered checkpoint.

**The deadline is external: Diwali is 8 November, 88 days out. Miss it and the next one is just under twelve months away.**

### PHASE 0 — Preserve · Days 1–2 · ~6 hrs

Branch `preserve/2026-08-12-full-state`, everything committed as-is, pushed. One commit, no tidying. Move ~331 MiB of raw sources and the ~1.14 GiB `content/_staging` tree out of Git history. Write `PORTFOLIO.md` per review §9 — bank the engineering as an outcome now, while the details are fresh.

**CONTINUE:** the branch exists on origin. **STOP:** none. Unconditional.

### PHASE 1 — Build _Navratri: Nine Nights_ · Days 3–58 · ~200 hrs

**Objective:** run one synchronised, dated, paid challenge — starting **11 October 2026**, the first night of Navratri.

The daily loop, catalog, RAG and payments infrastructure exist in some form. **The revenue mechanism does not, and neither does an arrival event.** A Navratri challenge is both at once, which is why it is the whole of Phase 1.

**Why this rather than a Hanuman Chalisa journey** (which was v2's first draft, and is the right _second_ product): the Chalisa journey has no date, so nothing makes anyone act now, tell anyone, or arrive. Navratri supplies the date, the urgency, the social permission to mention it, and the annual repeat — for free. It is Pray40 with the calendar already written.

**Deliverables:**

1. **Nine sessions, written and reviewed** — one per night, one devi form each (Shailaputri → Siddhidatri). ~8–12 minutes each. One named reviewer, £100–200. Tradition variation stated explicitly where it exists, because regional Navratri practice genuinely differs.
2. **Audio for all nine**, plus a slow repeat-after-me pass on each shloka. Phone microphone is fine.
3. **Three-register pronunciation** throughout (§4.1).
4. **Synchronised unlock** — night N opens on night N. Late joiners allowed, as Hallow does.
5. **A join screen with a live participation count.** Social proof is the cheapest conversion mechanism available and it costs one query.
6. **Payment live** — £8–15, one-off. This is the paywall event.
7. **Scoped AI on the night's shloka**, cheap model tier, quota'd.
8. **Six explanatory web pages** on the §5 query list, indexed by mid-September so Navratri search traffic has somewhere to land.
9. **Onboarding collapsed to three questions.**
10. **Every §5 arrival action executed.** Numbered because it is the deliverable most likely to be quietly skipped.

**Two dates inside this phase, not one:**

**CHECKPOINT A — 20 September (day 40), three weeks before Navratri.** This one is about readiness, and it exists so you cannot discover on 10 October that there is nothing to sell.

- **CONTINUE** → all nine sessions written, audio recorded, reviewer engaged, payment tested with a real card, ≥4 web pages live.
- **DESCOPE** → if content is behind, cut to **five nights**, not nine. A five-night challenge that ships beats a nine-night one that doesn't.
- **STOP** → fewer than three sessions written by 20 September. That is the review's "content is underestimated 3×" confirmed, and it means the whole content-led strategy needs rethinking before Diwali, not after.

**CHECKPOINT B — 21 October (day 71), the day after Navratri ends.** This is the real one.

- **GO** → ≥100 signups from strangers **AND** ≥15 paid joins. Proceed to Diwali.
- **EXTEND, once** → 40–99 signups and 3–14 paid. Diwali is 18 days later; run it again, smaller, and re-check **9 November**.
- **STOP** → <40 signups, **or** fewer than 3 paid after every §5 action is genuinely complete. That is the review's finding confirmed: there is no reachable audience, and no amount of Expo, pgvector or citation validation creates one. Publish `PORTFOLIO.md` and stop.

> **The failure mode is not a STOP number.** It is week 3, when arrival work is slow and uncomfortable and the IA "needs" fixing first. **If the six web pages are unpublished and the §5 actions undone on 11 October, the phase did not run — and its result may not be read as a pass, whatever the signup count says.**

---

_Everything below is provisional. Do not plan it in detail._

### PHASE 2 (provisional) — Diwali · Days 59–90

Diwali is **8 November**, 18 days after Navratri ends — close enough that Phase 1's audience is still warm and the machinery is already built. Five nights rather than nine. **CHECKPOINT 15 Nov:** CONTINUE → ≥40 paid across both events, refund <10%, ≥1 page in Google's top 10, **and ≥25% of Navratri joiners return for Diwali.** STOP → <15 paid total, or refund >25%, or **no measurable festival lift at all** — the last kills the arrival thesis specifically.

### PHASE 3 (provisional) — Repeat and the loop · Dec 2026 – Mar 2027

Holi (**22 Mar 2027**) tests annual repeat. Build shared intentions / family groups (§3.1.3) only if Phase 2 passed. CONTINUE → ≥30% of Diwali buyers buy again. STOP → <10%. Without repeat there is no income, only a one-off.

### PHASE 4+ (provisional) — The Chalisa journey, Hindi, Diwali 2027

_The Hanuman Chalisa, properly — 14 days_ as the first undated evergreen product, once a dated one has proven the mechanic. Hindi only after that sells and a named reviewer is secured. Diwali 2027 (~28 Oct) is the judgement year.

---

## 8. THE 30-DAY VIEW

25 hrs/week. Deliberately fits ~70% of what looks achievable.

Everything is now paced against one date: **Navratri begins Sunday 11 October.**

**Week 1 (12–18 Aug)** — Preservation branch pushed; binaries out of Git; `PORTFOLIO.md` _(9h)_. Outline all nine nights — which devi form, which shloka, what the reflection does _(6h)_. Find and brief one reviewer; agree the fee and the deadline of 20 September _(4h)_. Pull real search volumes for the §5 queries _(3h)_. Read the actual self-promotion rules for every community you intend to use, and write them down _(3h)_.

**Week 2 (19–25 Aug)** — Write nights 1–4, three registers throughout _(15h)_. Publish web pages 1–2, submitted to Search Console _(6h)_. Payment page live and tested with a real card, then refunded _(4h)_.

**Week 3 (26 Aug – 1 Sep)** — Write nights 5–9 _(16h)_. Publish pages 3–4 _(6h)_. First arrival actions — temple contacts, first community post _(3h)_.

**Week 4 (2–8 Sep)** — Send all nine to the reviewer _(2h)_. Record audio for nights 1–5, including the slow repeat-after-me pass _(10h)_. Publish pages 5–6 _(6h)_. Build the join screen with the participation count _(7h)_.

_Then, outside the 30 days but inside Phase 1:_ audio 6–9 and reviewer corrections by **20 September (Checkpoint A)**; scoped AI and arrival push through late September; **launch 11 October**.

### What you will know on 8 September that you do not know today

1. **Whether nine reviewed sessions can actually be produced in four weeks.** This is the real test of the review's "content is underestimated 3×" — and if it fails, it fails cheaply, in September, with time to descope to five nights.
2. Whether a named reviewer will engage with an AI-assisted product touching scripture — the gating question for Hindi and Tamil, discovered now rather than expensively later.
3. Whether a stranger will arrive at all without money being spent — **with a number, attributed to a named channel.**
4. What the daily loop sounds like as audio, which is different from how it reads.
5. **Whether you can do arrival work at all** — the assumption ranked highest in §9, and the one nobody writes down.

And you will know it **33 days before Navratri**, with time to descope rather than miss.

---

## 9. THE SINGLE BIGGEST RISK REMAINING

Unchanged from v1, and stronger now that the plan keeps the app.

> **That the arrival work in Phase 1 quietly doesn't happen, and the phase gets read as a pass anyway.**

The evidence is the strongest in this document: **eighteen months, 5.26 million staged lines, 131 passing tests, an admin moderation console, push retry leases, entitlement verification — and not one stranger has opened it.** That is a revealed preference, not a prioritisation accident. Building gives feedback in seconds and is fully under your control. Arrival gives feedback in weeks, from people who owe you nothing, and mostly says no.

Every other risk here has a concrete mitigation. This one has only a commitment, so make it checkable:

**By 11 October: six explanatory pages published and indexed, and every §5 arrival action done. If those two things are not true on the first night of Navratri, Phase 1 did not run — regardless of how good the nine sessions are.**

A synchronised challenge makes this risk sharper in a useful way: a dated launch cannot be quietly postponed. Navratri starts on 11 October whether or not you are ready, and that is the most valuable property this plan has.

**Second-biggest:** the editorial and moderation load (review Serious 8) is the one finding FIX does not mitigate at all. Live AI answers mean a reported-answer queue, forever, for one person. v1 dissolved this by removing user-facing AI. FIX cannot. Watch it, and if the queue becomes real, that is a legitimate trigger to revisit §1.

---

## APPENDIX A — Verified figures

Everything `01-review.md` marked `[UNVERIFIED]`, checked. **The review's arithmetic survives and is worse than stated** — it used a blended 2.5% conversion; the real regional medians are below.

### RevenueCat, _State of Subscription Apps 2026_ (115,000+ apps, $16B revenue, 2025 data)

| Metric                                             | Value                       |
| -------------------------------------------------- | --------------------------- |
| Download-to-paid (D35) — freemium / hard paywall   | 2.1% / 10.7%                |
| Download-to-paid — North America / **India-SEA**   | 2.8% / **0.7%**             |
| Year-1 LTV per payer — NA / W.Europe / India-SEA   | **$32 / $25 / $14**         |
| Trial-to-paid — NA / W.Europe / India-SEA          | 34.2% / 29.7% / **15.2%**   |
| Median monthly revenue, 1 year post-launch         | **$72**                     |
| Apps reaching $1K / $10K MRR (launched last 2 yrs) | 17.3% / 4.6%                |
| Revenue share, apps launched 2025+                 | **3%** (pre-2020 apps: 69%) |
| Monthly new app launches, Jan 2022 → Jan 2026      | ~2,000 → **14,700+**        |
| Annual-subscription year-1 cancellation            | **~72%** (prior year ~56%)  |
| Annual retention, hard paywall vs freemium         | 27% vs 28% — **no benefit** |
| **AI apps vs non-AI, 12-month retention**          | **AI 36% worse**            |

_Recomputed: the app as originally specified (India-primary 70/30, freemium) yields **$3,374/yr at 10,000 installs** — £220/month — against the review's $4,750._

_D1/D7/D30 install-retention figures could not be verified. No primary source has published cross-vertical benchmarks since ~2023 (Adjust); vertical splits date to 2022; Education- and Religion-specific retention **do not exist** in any primary dataset. Treat all such figures, including the review's, as unsourced._

### Faith-app market

| Fact                                             | Value                                                                                                                                                                                                                                               |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hallow funding / valuation                       | $131.15M; $759.4M post-money (Aug 2025)                                                                                                                                                                                                             |
| Hallow revenue 2025                              | ~$40M net; ~24M installs; ~10,000/day baseline                                                                                                                                                                                                      |
| **Ash Wednesday 2026**                           | **263,000 downloads in one day = 25×**; #1 on US App Store                                                                                                                                                                                          |
| Hallow Feb 2024                                  | 2M installs; **paid media up 15×**; 2,500 parish QR partnerships ≈ 9% of growth                                                                                                                                                                     |
| **Sri Mandir cumulative IAP since 2020**         | **under $100,000** across 40M downloads, 3.5M MAU                                                                                                                                                                                                   |
| Sri Mandir FY25                                  | ₹69.6 Cr revenue (~$8.1M), ₹45.3 Cr net loss, ₹51.9 Cr advertising                                                                                                                                                                                  |
| Sri Mandir model                                 | 20–25% take rate on temple offerings — transactional                                                                                                                                                                                                |
| **Sri Mandir diaspora vs domestic ARPU**         | **₹7,000 (~$81) vs ₹600–800 (~$7–9) — ~10×**                                                                                                                                                                                                        |
| Astrotalk FY25                                   | ₹1,176 Cr (~$140M); PAT ₹27 Cr FY23, ₹94 Cr FY24; **Left Lane Capital**, no celebrity backing found                                                                                                                                                 |
| Kuku FM FY25                                     | ₹242 Cr, 100% subscriptions — but ₹285 Cr marketing. **₹1.70 spent per ₹1 earned**                                                                                                                                                                  |
| Bible Chat                                       | $14M Series A; $15M annualised; **95%+ of revenue from the US App Store**                                                                                                                                                                           |
| YouVersion                                       | 1 billion downloads, **free forever by policy**, funded by Life.Church                                                                                                                                                                              |
| Hindu content subscription succeeding in English | **NOT FOUND**                                                                                                                                                                                                                                       |
| Isha / Chinmaya finite courses                   | **$209.99** / **₹7,000**                                                                                                                                                                                                                            |
| **Hallow Pray40 mechanics**                      | Synchronised start on Ash Wednesday · sessions **unlock one day at a time** · late joining allowed · **requires trial or subscription** · live participation count on the join screen · group participation with kick-off webinars · no leaderboard |
| **Hallow content format**                        | **Audio-first**, downloadable · session lengths 1 / 5 / 10 / 15 / 30 / 60 min · background music incl. Gregorian chant                                                                                                                              |
| **Hallow "Prayer Families"**                     | Share prayers, intentions **and journal reflections** with friends, family, prayer group, parish                                                                                                                                                    |

### Unverified — check these yourself

Absolute search volumes (Keyword Planner / Ahrefs, geo UK+US+CA+AE) · subreddit subscriber counts and per-subreddit self-promotion rules (Reddit unreachable in research; **moderator rules override sitewide policy**) · Facebook group sizes and rules · 2027 festival dates against a UK- and US-localised panchang closer to the time.

---

## APPENDIX B — Founder decisions, 12 August 2026

| Question          | Decision                                                                               |
| ----------------- | -------------------------------------------------------------------------------------- |
| Hours available   | 20–35/week (planned at 25)                                                             |
| Deadline          | Self-imposed — now anchored to Diwali, 8 Nov 2026                                      |
| Goal              | A product people use + a nice bit of passive income                                    |
| Audience          | **Adults. Kids not relevant.** Not schools                                             |
| Core product      | **Daily shloka + daily reflection**                                                    |
| AI's role         | **Depth layer on today's content** — ask questions, discuss the shloka                 |
| Festivals         | Arrival spike, **not the product**                                                     |
| Languages         | **English → Hindi → Tamil**; English chosen because of available sources               |
| Astrology         | **Later, or never**                                                                    |
| Sequencing        | **Product first**, outreach second                                                     |
| Reference product | **Hallow**, not Bible Chat — Bible Chat's growth was bought and doesn't transfer at £0 |

---

## Sources

[RevenueCat, State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps) · [RevenueCat renewal rates by category](https://www.revenuecat.com/blog/growth/average-subscription-renewal-rates-by-app-category/) · [Appfigures — Hallow Lent surge](https://appfigures.com/resources/insights/hallow-lent-surge-prayer-app-revenue) · [Branch — Hallow 2M installs](https://www.branch.io/resources/case-study/how-hallow-drove-2-million-app-installs-and-became-1-on-the-app-store/) · [TechCrunch — Sri Mandir](https://techcrunch.com/2025/06/30/sri-mandir-keeps-investors-hooked-as-digital-devotion-grows) · [TechCrunch — Sri Mandir digitising devotion](https://techcrunch.com/2024/09/09/sri-mandir-is-on-a-quest-to-digitize-indias-devotional-journey/) · [Inc42 — AppsForBharat FY25 filings](https://inc42.com/buzz/appsforbharat-fy25-net-loss-widens-16-to-inr-45-cr/) · [Entrackr — Astrotalk unicorn round](https://entrackr.com/exclusive/exclusive-astrotalk-seeks-unicorn-valuation-in-new-round-9485023) · [siliconindia — Astrotalk / Left Lane Capital](https://www.siliconindia.com/startup/startup-funding/astrotalk-lifts-20-million-from-new-yorkbased-left-lane-capital-nwid-44139.html) · [Entrackr — Kuku FM FY25](https://entrackr.com/fintrackr/kuku-fm-reports-rs-240-cr-revenue-in-fy25-spends-rs-285-cr-on-marketing-10943137) · [Romania Insider — Bible Chat $14M](https://www.romania-insider.com/bible-chat-investment-round-faith-app-romania-feb-2025) · [Appfigures — Bible Chat](https://appfigures.com/resources/insights/20250418?f=5) · [Premier Christianity — YouVersion on never monetising](https://www.premierchristianity.com/opinion/we-would-make-billions-if-we-monetised-the-bible-app-heres-why-we-never-will/20447.article) · [The Gospel Coalition — AI in Bible translation](https://www.thegospelcoalition.org/article/ai-bible-translation/) · [Wycliffe — AI and Bible translation](https://wycliffe.net/2025/06/20/the-impact-of-ai-on-bible-translation-opportunities-and-challenges/) · [Isha — Sadhguru app](https://apps.apple.com/us/app/sadhguru-yoga-meditation/id537568757) · [Chinmaya International Foundation — Gita course](https://chinfo.org/product/bhagavad-gita-course-online-mode/) · [Hallow — features](https://hallow.com/features/) · [Hallow — Pray40 FAQs](https://help.hallow.com/en/articles/10697582-hallow-lent-pray40-faqs) · [Hallow — paid subscription benefits](https://help.hallow.com/en/articles/3859850-what-are-the-benefits-of-the-paid-hallow-subscription) · [Drik Panchang 2026](https://www.drikpanchang.com/calendars/hindu/hinducalendar.html?year=2026) · [Drik Panchang 2027](https://www.drikpanchang.com/calendars/hindu/hinducalendar.html?year=2027)

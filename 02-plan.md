# Sandhya — Remediation Plan (v3)

**Written:** 12 August 2026 · supersedes v2 of the same date
**Inputs:** `01-review.md` · `docs/05-competitors.md` (new) · `CURRENT_SUMMARY.md` · verified market data (Appendix A) · founder decisions taken 12 Aug (Appendix B)
**Constraints:** 20–35 hrs/week · self-imposed decide-by date · goal is _"a product people actually use and a nice bit of passive income"_

> **HOW TO READ THIS REVISION.** v3 changes v2 in twelve places, and **restructures §7–§8 into two parallel workstreams** for two developers. Every change carries a marker naming what drove it — `**[v3 · 05-competitors §X]**`. Sections without a marker are unchanged from v2 and should be read as still in force. The decision (FIX), its five conditions, the festival-first sequencing, the 11 October launch date, and every checkpoint number are **unchanged**.
>
> **Net scope change is roughly +20 hours, not negative** — the arithmetic is shown honestly at the top of §7. One person could not absorb it; two in parallel can, which is what makes v3 shippable.

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

### 0.1 What changed from v2 — the twelve v3 revisions

> **[v3]** Competitive analysis of five apps plus Sri Mandir (`docs/05-competitors.md`) **corrected two factual errors that were pointing the plan at the wrong channel**, added one auditable differentiator, and cut one deliverable that cannot work.
>
> **Read this with appropriate suspicion:** the analysis was commissioned to test v2 and reports no disconfirmation of v2's central decision. That is a weak result, not a strong one — an author checking their own plan is the least reliable possible reviewer of it. The findings that should carry most weight are the ones that go _against_ the plan: §11 of the analysis ("we are behind an app built in a weekend on Replit"), the Bible Chat channel correction, and the fact that **Diya is running v2's rejected shape and its outcome is unknown**.

| #      | Change                                                                                                        | Driver                                            | Paid for by                                    |
| ------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------- |
| 1      | Appendix A: Bible Chat revenue corrected                                                                      | §2.4, §2.7                                        | factual correction                             |
| 2      | §5: Bible Chat's channel corrected; short-form video added as a fourth £0 test                                | §12.3                                             | one web page cut                               |
| 3      | §4.1: auditable correctness becomes two-part — pronunciation **plus** regionally-qualified festival dates     | §9.5, §8.2                                        | two pages re-specified, not added              |
| 4      | §7: the three onboarding questions fixed; Q1 becomes _"What do you do at home?"_ and must route content       | §9.1, §3.2                                        | replaces the focus-tag question                |
| 5      | §7: night sessions gain a stated duration, endowed progress, and an explicit end state                        | §9.2, §7                                          | the live participation counter is cut          |
| 6      | §7: **scoped AI removed from the Navratri pilot entirely**                                                    | §1.3, §2.4                                        | **frees ~15h and defers the moderation queue** |
| **13** | **§7–§8 restructured into two parallel workstreams (Content & Data / App & Platform) with three joint gates** | **founder decision, 12 Aug — two devs available** | **it is what absorbs the +20h**                |
| 7      | Phase 0: complete the rename — "Dharma Daily" is a competitor's name                                          | §1.7                                              | hours, inside existing Phase 0                 |
| 8      | New prerequisite: reverse `tradition_filter` from narrowing to ordering; stop discarding variation data       | §1.3, §2.4                                        | deferred catalog expansion                     |
| 9      | Cut list: **no AI-generated deity imagery, ever**                                                             | §3.4, §3.6                                        | a prohibition; saves money                     |
| 10     | §6: audio confirmed CORE (unchanged, reinforced)                                                              | §8.5                                              | —                                              |
| 11     | Appendix A gains a competitor table                                                                           | §2, §3.2                                          | reference material                             |
| 12     | §9: watch Diya's Diwali SEO bet as a live test of our own thesis                                              | §2.3                                              | one hour                                       |

---

## 1. THE DECISION

### FIX — conditional, sequenced, with a hard stop

**Unchanged from v2.**

### 1.1 Why FIX is now defensible

v1 rejected FIX because the specification paired India-primary economics with a content subscription and had no arrival mechanism. Two of those three are addressed by the decisions taken:

- **The paid product changes shape.** Not "more content behind a wall" — a finite, completable, guided journey. This matters more than it sounds (§1.3).
- **The market re-weights to diaspora.** Not India-primary. The LTV gap is 2.3× on RevenueCat's subscription cohort and roughly 10× on Sri Mandir's own published ARPU.

The third — no arrival mechanism — **is not yet addressed.** It is the entire content of §5 and the stop condition in every phase.

### 1.2 The five conditions. FIX survives only if all five hold.

1. **The paid product is a finite journey, not a content library.** Reason in §1.3.
2. **Diaspora-weighted, not India-primary.** India can use it; India is not who the pricing or the roadmap serves.
3. **The AI layer stays scoped to today's content and quota'd.** An open chat box reopens the Section 8 bind. **[v3 · 05-competitors §1.3]** — _and for the Navratri pilot it is not shipped at all. The condition is unchanged; compliance is now trivially satisfied because the surface is absent. See §7 deliverable 7._
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

> **[v3 · 05-competitors §12.2] — this argument is now materially better supported than when v2 was written.**
>
> Two further, independent confirmations arrived from the competitive research:
>
> - **Dharmāyana** reached **865,000 installs** on a free daily-practice-and-pañcāṅga product, then **deleted or buried its habit primitives** — no streak, no completion state, no library, no journal and no session object anywhere in the captured home screens, and its prayer-audio playback was reported broken in v6.2.6 and left broken — and moved to an astrologer-and-puja transaction marketplace. Two companies, different countries, different capital, same conclusion about a daily-practice utility in India.
> - **Diya** is running the _other_ experiment — the one v2 rejected — in public right now: English-first, diaspora-targeted, **subscription over a content library** at $24.99/yr, ten weeks old, 154 ratings, Meta ad spend behind it. **Its outcome is unknown and will be readable by Diwali.** Dharmāyana's shape is the one whose outcome is known; Diya's is the one v2 declined to copy.
>
> Nothing found supports a subscription. **The one-off finite challenge stands.**

The seven-day journey already specified in `CURRENT_SUMMARY.md` is the right product. **It is also the one major item still unwritten.** That is not a coincidence — content is slower than code and returns no dopamine, exactly as the review says.

### 1.4 What this costs, stated honestly

FIX keeps the app, which means it keeps most of the review's Serious findings alive rather than dissolving them. Specifically, these remain **unfixed and must be managed rather than designed away**:

- Episodic need vs daily product (Serious 2) — mitigated by festivals as arrival, not solved
- Every layer free elsewhere (Serious 5) — mitigated by journeys, not solved
- Inference economics (Serious 7) — mitigated by scoping, not solved
- Editorial and moderation load (Serious 8) — **[v3 · 05-competitors §13 change 6]** _v2 said "not mitigated at all." For the Navratri pilot this is now **deferred**, because scoped AI is not shipped and there are therefore no live AI answers to moderate. It returns in full the moment AI ships. Treat this as a postponement, not a solution._
- App-first forfeits search (Serious 9) — solved only if the web layer in §5 actually gets built

v1 dissolved four of these by removing the app. FIX does not have that option. **This is the price of the decision, and it should be a conscious purchase rather than a surprise in six months.**

---

## 2. THE AUDIENCE AND THE PAINKILLER

**Unchanged from v2.**

**Audience:** adults. No children in the framing. English-speaking Hindus and people from Hindu families, weighted to the diaspora — **UK, US, Canada, and the Gulf** (UAE, Saudi, Qatar, Oman). India is served and welcome; India is not who the roadmap or the pricing is built for.

_Gulf note, absent from v1:_ Sri Mandir counts UAE in its diaspora bucket, which carries **~10× the ARPU** of its Indian users (₹7,000 vs ₹600–800). Gulf Indian families skew Malayali, Telugu and Tamil, so **English serves them better than Hindi does** — a point that cuts against the intuitive case for Hindi-first.

**The painkiller — the adult version, and it is stronger than v1's:**

> **You are now the one who has to do it.** Your mother ran the household observance. She has died, or she is in India, or she is too frail. This year it is your house, your puja, your responsibility — and you realise you never actually learned. You cannot ask, because asking reveals you don't know.

Acute. Annual. Shame-driven. Those are the three properties the review identifies as making people pay, and this version has all three with no child anywhere in it.

> **[v3 · 05-competitors §8.2, §3.6] — corroboration from a competitor's own reviews.** This painkiller has now been observed in the wild, unprompted, in a 3★ Dharmāyana review from a US user: _"I don't want to just listen to the mantra etc. **I want to learn them**… as someone who is **new and has no Guru or temple near them**, I need the **FULL phonetic** versions so I can follow along… I'd also appreciate a way to **slow down the audio speed**."_ A Diya 5★ says the same from the other side: _"especially helpful being an American Hindu who doesn't read Sanskrit or speak Hindi."_ **Nobody in the market serves this.** It is the direct justification for §4.1 and for audio staying CORE.

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

> **[v3 · 05-competitors §13 change 6] — the Depth layer is deferred, not deleted.** It is not built for the Navratri pilot. Rationale in §7. The layer stays in the architecture because it is the right long-term shape; it does not ship in Phase 1.

This is YouVersion's and Hallow's structure. Both run a substantial web property that feeds the app — **web is not instead of the app, it is the front door to it.**

### 3.1 What to take from Hallow — the best available template, and closer than Bible Chat

Bible Chat is a paid-growth machine with Series A money and 95%+ of revenue from the US App Store. Almost none of it transfers at £0. **Hallow's structure does**, and it maps onto the architecture above almost exactly.

> **[v3 · 05-competitors §2.4, §12.3] — correction to how Bible Chat actually grew.** v2 stated _"~2,000 Apple Search Ads keywords, outspending competitors 2:1."_ **No evidence for that was found.** Their documented engine is a **paid creator programme** — 200+ UK creators on **£150/month base plus view bonuses**, required to film on **new dedicated accounts**, producing 110M+ views across 500+ short-form videos. That is roughly **$1.5M/yr of content spend kept off the ad-network books**, which is why the founders can describe growth as word-of-mouth. Their website carries ~20K visits/month **falling 24% MoM** and ranks only for its own brand name — **there is no SEO moat.** The conclusion "Bible Chat's growth is bought and does not transfer at £0" **is unchanged and correct**. What changes is the channel it points at. See §5.

**Take these four:**

#### 3.1.1 · The synchronised challenge — Pray40. The single most important transfer.

Not "a 40-day journey you start whenever." A 40-day challenge that **everyone starts on the same day**, where sessions **unlock one day at a time**, where groups can go through it together — and which **requires a trial or subscription to join**.

Look at what that does in one move. Ash Wednesday drives 263,000 downloads → the challenge is the reason to open the app → joining the challenge is the paywall event. **Arrival, activation and conversion are the same mechanic.** That is the machine, and the daily verse is just what keeps people there afterwards.

**Hinduism has a better version of this than Catholicism does, and it is 60 days away.** Sharada Navratri 2026 runs **11–19 October (nine nights)**, with **Vijayadashami on 20 October**. **[v3 — corrected: v2 wrote "11–20 October", which is ten days for nine nights.] Verify against a UK- and US-localised panchang before committing dates to a paywall.**

The **Navadurga scheme — nine devi forms, Shailaputri through Siddhidatri, one per night — is one convention, principally North Indian and Śākta.** It is not universal: Bengali Durga Puja concentrates observance on the final days, Gujarati garba is structured around the nights differently again, and South Indian observance centres golu, Saraswati Puja and Ayudha Puja. **Say so in the product** — §4.1b's own rule (name the observing community wherever practice splits) applies to the thing we are selling, not only to the calendar pages. Nine nights, nine sessions, unlocking one at a time. Diwali (8 Nov) is five days. A Gita challenge could be 40.

> **[v3 · 05-competitors §12.4] — why this is the right bet, reached independently.** The competitive research arrives at Navratri from a different direction than Hallow did. Daily obligation in Hindu practice is **not absent — it is unevenly distributed and tradition-specific.** _Nitya karma_, _sandhyāvandana_ and the _pañca-mahāyajña_ are framed in dharmaśāstra precisely as daily duty, and daily _pūjā_ is normative in several Vaiṣṇava sampradāyas. **What does not exist is a single obligation shared across traditions and socially enforced on the disconnected diaspora user this product is for** — which is the user `01-review.md` §3 describes and who has no such practice. So there is no _common_ daily office to dock onto, and the two Hindu apps that tried to manufacture one are the evidence: **Diya** shipped five reinforcing streak surfaces and a **"Streak rescue"** notification channel _at ten weeks old_ (you do not build streak-loss recovery in week ten unless you have already watched streaks break); **Dharmāyana**, the one with 865K installs, ships **no streak at all**. Meanwhile **a festival is the one place Hinduism supplies a real, externally-imposed, socially-observed, consecutive-day structure for free.** Do not manufacture an obligation. Use the one that already exists.

**[v3 — the live participation count is cut.]** v2 deliverable: _"A join screen with a live participation count. Social proof is the cheapest conversion mechanism available and it costs one query."_ **Removed.** `05-competitors` §6.1 classifies Bible Chat's equivalent (_"IN WAITING · 19 PRAYERS"_, _"STARTS IN 1 MIN"_) as **BOUGHT** — it works because continuous submissions arrive at all hours. Ours would read _"3 people joined."_ Diya shows the failure mode directly: `Join 172 devotees` in its own marketing mock against `Join 75` on the live screen. **The code exists (`challenge/[slug]/index.tsx`, real-count-only) — keep it dark unless the number helps.** This cut pays for change 5 below.

#### 3.1.2 · Audio-first, with chosen session length

Hallow's core content is _audio_, downloadable, at 1 / 5 / 10 / 15 / 30 / 60 minutes. `CURRENT_SUMMARY.md` defers audio to "later releases." **That is probably wrong here, and more wrong than it is for Hallow** — a shloka is an oral form. It is meant to be heard and recited, not read silently. Audio is also how you deliver the pronunciation layer in §4.1, and it serves older users better than text.

This does not mean a studio. It means _you_, or a reviewer, reading the shloka clearly, with a slow repeat-after-me pass. That is a phone microphone and an afternoon.

> **[v3 · 05-competitors §8.5] — reinforced, with the gap quantified.** We currently have **no audio at all**. Diya ships 48 tracks and a japa counter with a 108-bead ring and a maroon _meru_; Dharmāyana ships prayer audio and Brahma Muhūrta recordings. The one explicit, unprompted user request found across every review of every competitor is for **full phonetic text and adjustable playback speed** — which is precisely what a slow repeat-after-me pass delivers and which nobody offers. Audio stays CORE.

#### 3.1.3 · Shared intentions — "Prayer Families"

Hallow lets you _"connect with your friends, family, prayer group, parish, & community to share prayers, intentions, or journal reflections."_

**This is the organic loop the review said did not exist.** Review §5: _"The journal is private by design. No invitation, no shared artifact, no network effect."_ Hallow's answer is to make the journal optionally shareable to a small trusted group.

And Hinduism has the stronger case: **puja is already a household activity.** A family doing Navratri together is the normal unit of observance, not an app feature bolted on. A shared nine-night challenge across a family in London, Leicester and Ahmedabad is a natural thing, not a growth hack.

> **[v3 · 05-competitors §2.2] — an external data point in favour.** Dharmāyana's designer states on the record that their WhatsApp share card was built _"based on observing user behavior"_ — users were **already screenshotting and forwarding** festival and pañcāṅga content. It is now the top-of-home element, above the pañcāṅga module, badged _SEND TO FRIENDS AND FAMILY_. **The forwarding behaviour is real and observed.** Note also that Bible Chat, whose growth channel is TikTok, has **no public sharing surface at all** — and Dharma Daily has none either. Stays in LATER as v2 specified; the evidence for it is now stronger.

#### 3.1.4 · Reminders, gentle streaks, goals

Hallow has all three. Your spec's "no guilt mechanics" rule stays — it is the right call and Hallow is not especially punitive either.

> **[v3 · 05-competitors §9.3, §10] — one sharpening.** Adopt **endowed progress** (the session arrives partly complete, so the user starts in credit) and **redundant completion signalling**. Do **not** adopt the empty-ledger shaming that sits under it — no month grid full of unfilled circles for someone whose tradition does not ask them to practise every single day. Endowed progress is the opposite of guilt: it grants credit rather than threatening loss.

**Why "scoped AI" is better than the chat box already built.** Today's shloka is the retrieval context. The user asks about _this verse_, not about Hinduism in general. Three consequences: retrieval is bounded so cost is bounded; the failure surface shrinks dramatically; and it is the exact thing ChatGPT is worst at, because ChatGPT will confidently invent Gita 2.47 and cannot tell you which commentary tradition it just flattened.

> **[v3] — still true, and still not shipping in Phase 1.** See §7 deliverable 7 for the reasoning. The argument above is why it remains the eventual shape.

**Do not take these:** celebrity guides, studio-scale audio production, or the parish-partnership infrastructure.

> **[v3 · 05-competitors §10] — and be explicit about why the last one can never be taken.** There is no Hindu analogue to church software distribution, and there will not be one. Hindu temples are **non-congregational**: no membership roll, no attendance list, no pledge database — the exact artefacts Pushpay/Tithe.ly-class church tech monetises. Governance is split between state Endowments Departments (TN HR&CE, AP, Karnataka Muzrai), private trusts and hereditary priest families, so **there is no procurement counterparty.** Sri Mandir's relationships with Sringeri and others are **supply-side ritual fulfilment, not distribution** — no temple pushes the app to its devotees. **Do not plan around this channel.** The nearest available analogue is a mandir noticeboard or a temple newsletter, which is §5 channel 3 and is worth tens of users, not thousands.

**Explicitly excluded, and why:**

- **Astrology / jyotisha.** Not now, possibly never. That revenue is human astrologers' time; you cannot capture it with software.
- **A consultation marketplace.** Same reason — one person cannot run a supply side. **[v3 · 05-competitors §4.2, §2.6]** _A second reason has appeared: its dominant customer complaint is **unverifiable proof-of-ritual**, and that is architectural rather than a support failure. Sri Mandir deliberately does not film the sanctum offering; Dharmāyana's 1★ reviews allege puja videos shot at a different temple from the one advertised and "handwritten" kundalis that are software-generated. 1★ outnumbers 2★ 2:1 — the signature of transactional failure. Stay out._
- **Precise Panchang calculation.** Your spec already defers this correctly. Keep the deferral; people plan weddings off muhurta. **[v3 · 05-competitors §1.5]** \*Confirmed as greenfield: the repo has **zero** calendar computation — `amanta`, `purnimanta`, `nakshatra` and `muhurta` return **no hits anywhere**, and the Calendar tab is a plain Gregorian grid. A computed pañcāṅga needs a tithi/nakṣatra engine or a licensed feed, amānta/pūrṇimānta resolution, sunrise-dependent rules with per-location astronomy, and a recurrence model. **Deferral confirmed. §4.1 achieves the differentiator without it.\***
- **Festival dates _are_ in scope**, and are calendar work rather than astrology. Do them properly, with a named regional and timezone policy. Research found sources disagreeing by ±1 day on several 2027 dates, and Janmāṣṭamī genuinely split between **Smārta and Vaiṣṇava** observance (ISKCON is one Gauḍīya Vaiṣṇava institution, not a tradition-level counterpart — name the tradition, not the organisation).

---

## 4. LANGUAGE, SCRIPT AND TRANSLATION

Four separate things, four different fates. Bundling them is part of what made the scope unmanageable.

### 4.1 Auditable correctness — CORE, and the most under-rated item in the spec

> **[v3 · 05-competitors §9.5, §8.2, §8.3] — RENAMED AND EXPANDED from "Pronunciation".** v2 correctly identified pronunciation as the one differentiator the buyer can perceive. The research found a **second auditable claim of the same kind, and it is stronger because a third party can check it.** The section now has two parts. This is the single change in v3 that most directly serves the goal of _being better_.

#### 4.1a Pronunciation — three registers, unchanged

Every quoted line needs three registers:

| Register                        | Example        | For                                |
| ------------------------------- | -------------- | ---------------------------------- |
| Devanagari                      | लक्ष्मी        | Authenticity; the real script      |
| IAST                            | Lakṣmī         | Precision in citations             |
| **Plain-English pronunciation** | **LUCK-shmee** | **The one the user actually uses** |

**This is the one differentiator the buyer can perceive.** The review's Serious-3 complaint was that citation provenance is invisible — nobody can audit whether Gita 2.47 was cited correctly. But anyone knows within thirty seconds whether they were able to say the words properly out loud. Pronunciation is auditable by the person who needs it.

> **[v3] — the competitive position is better than v2 assumed, and it is already structurally guaranteed.**
>
> - **No competitor ships any transliteration at all.** Diya renders Devanagari genuinely correctly — conjuncts, avagraha, correct daṇḍa — and ships **no romanisation whatsoever**, removing the only bridge for a diaspora audience that speaks an Indian language but cannot read the script. Dharmāyana uses ad-hoc unmarked romanisation throughout and its own wordmark ("Dharmāyana") disagrees with every body string ("Dharmayana") — the macron is branding, not orthography. Dharma Daily has no IAST anywhere.
> - **Our content validator already enforces the three-register format**, including a Devanagari-codepoint check and all five required labels (Devanagari / IAST / Say it / Meaning / Source). This differentiator is **structurally guaranteed, not merely intended** — which is rare enough to be worth saying.
> - Dharmāyana users have reported **transliteration desynchronised from the recited audio** (_"instead of 'N' there is 'M' or 'T'"_), i.e. anusvāra and retroflex handling failing for a user trying to sing along. The slow repeat-after-me pass in §3.1.2 is the fix nobody has shipped.

_Effort: ~1 day to fix the format and a house style. Then discipline._

#### 4.1b Festival dates stated with their convention — NEW

> **[v3 · 05-competitors §9.5]** Every competitor is visibly wrong about the calendar, and **the error is checkable by anyone in thirty seconds against Drik Panchang.**

| App              | Calendar state                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dharma Daily** | Shows **Krishna Janmashtami "August 14"** and **Ganesh Chaturthi "August 28"** — true 2026 dates **4 Sep** and **14 Sep**. **Wrong by 21 and 17 days**, with countdown pills computed live against the device date, arithmetically ticking toward dates that do not exist. **No amānta/pūrṇimānta defence** — both fall in Bhādrapada under either reckoning. Its store assets separately show 2025's Shivaratri and Holi dates. |
| **Dharmāyana**   | Models location (`Ujjain ▾`, _"for your location"_) — the only one that does. But **a full-hour error abroad from unhandled DST** and a **~30-minute yamagaṇḍa offset** in India, plus ṛtu names wrong for South Indian convention. **No method, timezone, ayanāṃśa or "calculated for" line anywhere**, so a user cannot detect a wrong answer.                                                                                 |
| **Diya**         | **No calendar.** Gregorian habit grid only; **"Sunset (6:00 PM)" is a hardcoded clock value** that names _sandhyā_ and computes nothing.                                                                                                                                                                                                                                                                                         |
| **Sri Mandir**   | Dual-labels amānta and pūrṇimānta correctly and is city-scoped — genuinely good. Then lists **Ekādaśī and Janmāṣṭamī with no Vaiṣṇava/Smārta qualifier**, so two communities that observe on different days both get one date.                                                                                                                                                                                                   |

**What we do instead — and it does not require a pañcāṅga engine.** A small, hand-verified, regionally-qualified table covering only the festivals we actually cover, published with:

1. **the reckoning named on the page** — amānta or pūrṇimānta
2. **the observing community named wherever dates genuinely split** — Smārta vs Vaiṣṇava Janmāṣṭamī, Ekādaśī
3. **the location the timing is computed for, stated**
4. **the source cited, and disagreement reported rather than resolved** — Appendix A already notes ±1 day discrepancies across sources on several 2027 dates

**Why this is also the arrival artifact:** it answers exactly the explanatory queries in §5, it is forwardable into a family WhatsApp group without embarrassment, and — unlike a bare date query, which §0 correctly calls zero-click — **_"is Janmashtami on the 4th or the 5th this year, and why do people disagree"_** is a question Google's knowledge panel cannot answer.

_Effort: days, not months, for the festivals in scope. **This is the one place where "we are better" is both true and visible to a stranger.**_

### 4.2 Source translations — retained, narrowed

From a rights-cleared multi-text corpus to a citations list. Public-domain and open-licensed only. Translator and edition named at every quote — that discipline is built and costs nothing to keep.

**This converts rights review from an open-ended blocker into a checklist**, and probably removes two to four months from the review's "4–8 months to shippable."

> **[v3 · 05-competitors §3.2, §8.2] — this is a bigger differentiator than v2 credited.** **No competitor names a translator on any displayed verse, and none names a commentator anywhere.** Dharma Daily ships an unattributed _modern_ paraphrase of BG 9.22 — not Telang, Besant or Arnold, whose copyright has lapsed — which is simultaneously an attribution failure and a probable licensing exposure. Diya ships **41 of 48 audio items through embedded YouTube** with no artist credit while advertising _"50+ devotional tracks"_ — a figure only reachable by counting 29 secular wellness tracks as devotional. **An app with no named commentator is architecturally incapable of showing that traditions read a verse differently.** Our 142 approved shlokas already do this — `content/shlokas/gita-2-47.md` contrasts Advaita against Viśiṣṭādvaita and Dvaita readings of one verse. **This is the only asset in the repo a competitor cannot trivially clone. Do not trade it away for volume.**

### 4.3 Hindi before Tamil — accepted, and Hindi is stronger than v1 said

v1 framed Hindi as a relay target (Sanskrit → English → Hindi). **That is wrong for a large part of it.**

Tulsidas's **Ramcharitmanas** and **Hanuman Chalisa** are Awadhi — not translations of Sanskrit. So are Surdas, Kabir, Mirabai, Raidas. The Hanuman Chalisa is plausibly the most-recited Hindu text on earth and it is originally in a Hindi-family language.

Two consequences, both good: **no relay problem** (these are primary texts in the target language) and **no rights problem** (Tulsidas died in 1623; all public domain in the original).

**Tamil third**, and it is a genuine second front rather than a translation: Thevaram, Thiruvasagam, Nalayira Divya Prabandham, Thirukkural are their own primary canon. Needs someone who knows Shaiva and Sri Vaishnava terminology.

**Unchanged cost for both:** a named native reviewer signing off on anything that ships.

> **[v3 · 05-competitors §1.7] — one honesty correction about where we actually are.** `CURRENT_SUMMARY.md` claims _"Language preference (en/hi) applies everywhere"_ and _"100% Hindi coverage."_ **Neither is true of the product.** `src/lib/i18n.ts` is a single English object of ~55 keys with **no Hindi dictionary at all**; the `contentLanguage` switch selects verse translation and meaning only. Every label, button, empty state and error message is English. For context, **Dharmāyana ships four or more UI languages including Kannada and Marathi.** Hindi stays in LATER as v2 specified — but the claim should stop being made in the meantime.

### 4.4 AI and translation — corrected from v1's "hard no, permanently"

Unchanged from v2. The line is not the tool, it is the sign-off.

| The AI may                                      | The AI may never                                      |
| ----------------------------------------------- | ----------------------------------------------------- |
| Draft translation for a named human to check    | Ship any translated or transliterated text unreviewed |
| Draft English prose around a quote              | Generate the quoted text itself                       |
| Draft the pronunciation guide _(human-checked)_ | Be the final authority on tradition difference        |
| Fact-check dates, variation, disagreement       | Decide what is scripture vs commentary vs folklore    |
| Speed up your existing provenance checking      | Substitute for a named human reviewer                 |

> **[v3 · 05-competitors §13 change 9] — one row added to the right-hand column: the AI may never generate devotional imagery.**
>
> **No AI-generated deity art, ever. Any devotional image ships from a named human artist or not at all.** All three Hindu competitors use generated imagery and at least two have shipped iconographic errors. Dharmāyana's **triśūla resolves to four-to-five points** where the three-prong form is the entire meaning of the object — **on the card explicitly badged _SEND TO FRIENDS AND FAMILY_**, so the error is engineered to propagate — and its Śiva carries no tripuṇḍra. A Dharmāyana user filed the equivalent Gaṇeśa error as a defect: _"his forehead mark is wrong — it's supposed to be a Trishik but it had four prongs instead of three."_ **A devotee counted the prongs.** These are exactly the users worth having, and this is a prohibition that saves money rather than costing it.

---

## 5. ARRIVAL — the unsolved problem

The review's #1 pre-mortem cause, weight _dominant_: **"No distribution mechanism ever existed."** Eighteen months, zero strangers. Nothing in the decisions taken so far changes this, and the architecture in §3 does not either.

**Verse-of-the-day is a retention mechanic, not an acquisition mechanic.** Look at how the big successes actually grew:

| App            | How it grew                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| YouVersion     | Distributed by Life.Church and partner churches. Free forever by policy. Not a business.                                                                                                                                                                                                                                                                                                                 |
| Hallow         | Feb 2024: 2M installs with **paid media spend up 15×** plus 2,500 parish QR partnerships                                                                                                                                                                                                                                                                                                                 |
| Bible Chat     | **[v3 — corrected]** A **paid creator programme**: 200+ UK creators, £150/mo base plus view bonuses, filming on new dedicated accounts. ≈**$1.5M/yr**, off the ad-network books. 110M+ views across 500+ short-form videos, one at 94M. Website: ~20K visits/month, **−24% MoM**, brand terms only — **no SEO moat**. _(Traffic figures: Similarweb estimates, noisy at this volume, directional only.)_ |
| **Sri Mandir** | **[v3 — new row]** FY25: **₹51.9 Cr on advertising against ₹69.6 Cr of revenue — 75% of revenue, 44% of all expenses**, net loss ₹45.3 Cr. **The market leader's growth is bought, and it is not yet profitable.**                                                                                                                                                                                       |

**None grew because of the daily verse.** Each had a separate arrival engine — a megachurch, a parish network, a creator farm, or an ad budget larger than its revenue.

Trust converts traffic into customers. It does not create traffic. That distinction is the whole of this section.

> **[v3 · 05-competitors §5.1, §11] — and the counter-evidence to "just be better", stated plainly, because it is the most important thing in this section.**
>
> The research produced an unusually clean controlled comparison. **bible.ai** and **Bible Chat** are the same religion, same category, same era. bible.ai's craft is arguably the _higher_ of the two — sticker geometry, hand-drawn doodle progress icons, commissioned painterly illustration, a contextual composer, serif-for-scripture typesetting better than most funded consumer apps.
>
> **Bible Chat: 356,000 US ratings. bible.ai: ~102 ratings across 17 storefronts, v1.0.3 since June 2025, dormant, no Android, no community discussion anywhere, web traffic −41% MoM.**
>
> Craft is matched; distribution differs by three orders of magnitude; **outcome tracks distribution.** The most beautiful screen in bible.ai's entire flow is a demographics form.
>
> **Being better is a retention and conversion strategy, not a distribution strategy.** It compounds _downstream_ of a channel and produces nothing upstream of one. Sri Mandir being mediocre is real (its Play rating has fallen 4.9 → 4.4; its dominant complaint is unverifiable proof-of-ritual) — **and it did not get to 40M downloads by being good.** It spent 75% of revenue on ads. Quality is why people stay and pay. It is not why they arrive. **§5 remains the unsolved problem and no amount of correctness solves it.**

### The channels available at £0 — **[v3: three, now four]**

**1 · Explanatory search — the only one that compounds**

Not date queries. Those are zero-click. **Explanatory and procedural queries**, where the answer cannot fit in a knowledge panel:

> _what does this shloka mean · why do we fast on Ekadashi · how do I do Lakshmi puja at home · what to say when lighting a diya · Hanuman Chalisa meaning line by line · what can I eat during Navratri_

The incumbents on these are Indian e-commerce blogs funnelling to jewellery, India-based parenting portals, and Twinkl/TES writing for non-Hindu RE teachers. Nobody writes for this reader.

**Verify before committing:** absolute search volumes could not be retrieved in research. Pull them yourself with UK+US+CA+AE geo filters before choosing target keywords.

> **[v3 · 05-competitors §2.3] — a live experiment on this exact thesis is already running, and we get the readout free.** **Diya published a 70-page content site with every URL stamped `lastmod` 29–31 July 2026** — the whole thing shipped in a three-day bulk launch, two months after their app. Composition: **20 festivals, 13 prayers/mantras, 10 scripture, 10 rituals, 6 practice guides.** Titles are long-tail diaspora intent, almost exactly our list: _"How to practice Hinduism when you do not live near a temple"_, _"Ekadashi fasting US date guide"_, _"Can you do puja without a priest"_, _"Hindu festival calendar United States"_. **Four pages are Diwali-specific.** A domain ten weeks old with content two weeks old will not rank yet — **their bet is Diwali 2026.** Watch it (§9). If a well-funded, faster-shipping competitor's 70-page bulk launch produces nothing by December, that is a strong negative signal on channel 1 that costs us nothing to obtain.

**2 · Festivals as arrival spikes** — the Hallow structure exactly. Ash Wednesday 2026 drove **263,000 downloads in a single day against a ~10,000/day baseline — 25×.** Hinduism has four or five of these a year: **Ganesh Chaturthi 14 Sep · Navratri 11–20 Oct · Diwali 8 Nov 2026 · Holi 22 Mar 2027.**

_Caveat, because it is the difference between a plan and a hope:_ Hallow's spike was substantially bought. The festival supplies **demand**; it does not supply **reach**.

**3 · Warm network, used correctly** — temple and family contacts, and friends in India and the Gulf. The rule that makes this a test rather than a favour: **use warm contacts to reach strangers, not to be the strangers.** A mandir noticeboard, someone else's WhatsApp group, a temple newsletter. If the first 100 are your cousins, you have learned that people who like you will do you a favour.

**4 · Short-form video, made by you — NEW, and explicitly a test rather than a plan**

> **[v3 · 05-competitors §12.3] — the one place this research made the growth picture _less_ closed.**
>
> Bible Chat's engine is not paid search. It is **content production** — and while we cannot pay 200 creators, **making short-form video is the one growth activity in this entire competitive set that costs £0 and has a documented format in this exact category.**
>
> What is documented: 500+ videos, 110M+ views, one at **94M views with 1M likes and 38K saves**. The winning creative is **before/after transformation** — _"DAY 0 vs DAY 40"_, _"I replaced social media with…"_ — and the positioning that carried the top video was **the app as an antidote to social-media addiction**, not as scripture. Independently, a Diya 5★ reviewer frames their own use identically and unprompted: _"I'm 22 and admittedly addicted to my phone… I remember growing up seeing stuff like this for other religions and wishing we had our own."_
>
> Note also: **Dharmāyana built its top-of-home around a WhatsApp share card after observing users already forwarding screenshots**, and Bible Chat — whose growth channel is video — has **no in-app sharing surface at all**, as do neither Diya nor Dharma Daily. There is an unoccupied intersection here.
>
> **This is a hypothesis, not a plan.** It has better evidence behind it than anything else currently in this section, and it is cheap enough to test against the existing Navratri deadline.
>
> **What it costs: one of the six explanatory web pages in §7 deliverable 8 is cut.** Five pages, plus **six short-form videos posted across the Navratri run** — the nine nights supply the content for free, and a nine-night arc is natively a before/after format. Measure arrivals by named channel, per §7 deliverable 10.

### First 100 → 1,000

The first 100 are manual: roughly 30 discrete actions across the four channels, plausibly 170–980 visitors, 37–225 signups at a 15–25% capture rate. **That range straddles the pass mark, which is what makes it a real test.**

100 → 1,000 is SEO on a 12–18 month lag, plus festival spikes. **Diwali 2027 (~28 Oct) is the first event where content published in 2026 could rank.** Say the honest thing out loud: **1,000 real users is a 2028 number.** Against "a product people use and a nice bit of passive income," that is a fit. Against replacing an income, it is not, and no plan in this document is.

---

## 6. CUT LIST

### CORE

Daily shloka + reflection loop · the existing content catalog (50 concepts, 21 festivals, 30 reflections, 20 practices) · **one dated, synchronised paid challenge** · payment · **the three-register pronunciation format** · **[v3] regionally-qualified festival dates with their convention stated (§4.1b)** · **basic audio for every shloka** · citation validation and provenance · an indexable web surface · reminders

> **[v3] — two changes to CORE.** **Removed from CORE for the Navratri pilot: scoped AI on today's content** (see §7 deliverable 7). **Added to CORE: §4.1b.** Audio is confirmed CORE and reinforced (§3.1.2).

### LATER

**Scoped AI on today's content [v3 — moved down from CORE]** · additional challenges · **shared intentions / family groups** (§3.1.3 — the organic loop; second priority after the first challenge sells) · Hindi (§4.3) · Tamil · the full canonical corpus · personalisation depth · offline · session-length variants · Panchang

### CUT NOW

- **The 13-question onboarding funnel** and the four-screen carousel. Nineteen screens to first value is Serious 4.
  > **[v3 · 05-competitors §3.3, §10] — the market data on this is now unambiguous.** Diya runs **18 screens before its paywall** and 29 to the first interactive surface; Bible Chat runs 24 to a plan reveal and puts the price at screen 26 of 28, **before any content at all**. Both are paid-acquisition-shaped funnels that maximise trial-start rate on cold ad traffic at the cost of retention — **they only pay off when you can buy the next install.** **Dharmāyana, the one with 865,000 installs, reaches value in one screen**: a dismissible language sheet over an already-populated home. Three questions stands, and it is generous.
- **The Calendar tab** — commoditised; a dozen free Panchang apps do it better. **[v3]** _Confirmed, and now with a second reason: §1.5 of the analysis shows we have **zero** calendar computation and four hardcoded dates that expire 8 Nov 2026. The tab's honest disclaimer is worth more than a wrong number — §4.1b delivers the differentiator on the web instead._
- **Streaks** in any guilt-bearing form. (Gentle streaks and goals stay.) **[v3]** _Reinforced: Diya shipped a **"Streak rescue"** notification channel at ten weeks old; Dharmāyana, the one with scale, ships **no streak at all**. Add: **no empty month grid** — a ledger of unfilled circles is a guilt mechanic aimed at someone whose tradition does not require daily practice._
- **Journal as private-only.** Keep it private by default, make sharing to a small trusted group possible.
- **The admin moderation console** — until there are answers to moderate. **[v3]** _With AI cut from the pilot, this stays dark for longer, which is a saving rather than a loss._
- **Push retry leases and fencing** — until notifications reach a stranger.
- **The 35 Bible Chat reference screenshots.** **[v3 — superseded.]** _Do not delete them. `docs/05-competitors.md` §6.1 is a full teardown built from them, and §7 extracts nine transferable mechanics. The screenshots are now cited evidence. **Keep `docs/ref_images/` as it stands** — and note the folders are mislabelled: `dharmadaily/` holds 13 Dharma Daily + 1 Dharmāyana, `sandyhana/` holds 3 Dharmāyana + 1 Diya. Fix the folder names when convenient._
- **India-primary pricing and roadmap assumptions.** **[v3]** _Confirmed by every competitor. Diya runs six simultaneous US SKUs ($4.99/$6.99 monthly, $24.99/$34.99 yearly) and prices India at ₹499/mo ≈ $5.70 and ₹2,499/yr ≈ $28.50 — i.e. **above the cheaper US SKU and below the dearer one, with no PPP adjustment at all**. bible.ai charges ₹1,299/mo, genuinely above its US price, and has **zero Indian ratings**. Nobody is adjusting for India. Neither are we._

**[v3 — three additions to CUT NOW:]**

- **AI-generated deity or devotional imagery, permanently** (§4.4). Named human artist or nothing.
- **The live participation counter on the join screen** (§3.1.1) — keep the code, keep it dark.
- **Statistics-driven onboarding claims.** Diya's four research citations are **real papers, inflated**: its headline _"47% median reduction in anxiety scores"_ is actually a **responder rate** (the proportion of participants improving by ≥4 GAD-7 points, n=17 per arm), presented as an effect size; its _"95% reported wellbeing and mission"_ has no "mission" item in the source and measures **group** prayer to sell a solitary phone app; its _"22% attention improvement"_ omits that chanting a **poem** for the same ten minutes also worked and that the advantage held **in the female subgroup only**, in 60 schoolchildren. Its later chart says _"backed by **our** research\*"_ over an asterisk resolving to Koenig 2012 and Lally 2010. **Our audience contains people who will pull the DOI.** If we ever cite research: cite the responder rate as a responder rate, name n, and name the control condition.

### Built to look complete rather than because a user needed it

Push retry leases and fencing. The admin moderation console. RevenueCat entitlement verification. Five tabs. CI with secret scanning and release-contract verification. **Every one is production-grade infrastructure for zero users.** The work is good. It was aimed at the wrong question.

> **[v3 · 05-competitors §11] — the uncomfortable addition to this list.** On every dimension a stranger can perceive in the first thirty seconds, **we are currently behind an app built in a weekend on Replit** — because it shipped and we did not. Specifically: nothing is deployed; **Ask Dharma cannot answer a single real question** (1 of 432 sources approved, both AI keys empty, and a `LLM_PROVIDER`/`LLM_DEFAULT_MODEL` mismatch that would throw on first request); no audio at all; the calendar runs out on 8 Nov 2026; English-only UI; no defined daily act; **`tradition_primary: general` on all 877 verse files**, i.e. zero sectarian tagging in the bank; two test files across an 11,525-line app. Our advantages — provenance, rights posture, tradition-honesty — are all real, all unmatched in the market, and **none of them is currently reachable by a stranger.** That is what Phase 1 is for.

---

## 7. SEQUENCED PLAN — TWO PARALLEL WORKSTREAMS

> **[v3 · founder decision, 12 Aug] — RESTRUCTURED FOR TWO DEVELOPERS.** v2 assumed one person at 25 hrs/week. There are now two people who can work in parallel, so the phase is split into **two workstreams with a deliberately thin interface between them**, plus a small set of **joint gates** where they must synchronise.
>
> The split is chosen so the two streams touch as little shared code and as few shared files as possible:
>
> |                   | **Stream A — CONTENT & DATA**                                                                                          | **Stream B — APP & PLATFORM**                                                                                  |
> | ----------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
> | **Owns**          | `content/**`, `docs/**`, the source-rights tracker, the web pages, audio, the festival-date table, all arrival actions | `apps/**`, `packages/**`, `supabase/**`, the payment rail, the challenge runtime, onboarding, deployment       |
> | **Never touches** | anything under `apps/`, `packages/`, `supabase/`                                                                       | anything under `content/` except the generated bundle                                                          |
> | **Deliverable**   | nine reviewed night sessions + audio, five web pages, the festival-date table, six videos, every arrival action        | a working paid, dated, unlocking challenge on a real device, with three-question onboarding and payment tested |
> | **Fails if**      | fewer than three sessions written by 20 Sep                                                                            | payment is not tested with a real card by 20 Sep                                                               |
>
> **The interface between them is three artifacts and nothing else:**
>
> 1. **The content schema**, already frozen — `packages/content-tools/src/index.ts` defines `challenge_session` as six sections in fixed order (Tonight · Shloka · Meaning · Practice · Tradition notes · Reflection) with `can_embed: false`. **Stream B does not change it; Stream A writes to it.**
> 2. **`scripts/generate-shloka-bank.mjs` and the challenge generator** — Stream A's markdown becomes Stream B's bundled JSON/SQL by running a script. Neither stream edits the other's side of it.
> 3. **A single shared `content/challenges/navratri-2026/challenge.json`** — Stream B reads it, Stream A owns it.
>
> **If the interface holds, the streams never block each other.** The one real coupling is that Stream B cannot ship a challenge with no sessions in it — which is what Joint Gate 1 exists to catch.

**Planned at 25 hrs/week per person.** The deadline is external: **Navratri begins Sunday 11 October; Diwali is 8 November.**

### ⚠️ SCOPE ARITHMETIC — corrected

> **[v3] — v2's draft of this revision claimed "net scope change is negative." That was wrong and the claim is withdrawn.** Checked against the change table honestly:
>
> | Change                                          | Hours added                    | Paid for by                                                      |
> | ----------------------------------------------- | ------------------------------ | ---------------------------------------------------------------- |
> | Complete the rename                             | ~2                             | **nothing** — new work                                           |
> | Phase 0.5 correctness fixes                     | ~10                            | **nothing** — new work, and owed regardless                      |
> | §4.1b festival-date table + 2 pages             | ~15                            | one explanatory page cut (~3h) → **~12 unfunded**                |
> | Session duration / endowed progress / end state | ~4                             | join-screen participation count cut (~4h) → **funded**           |
> | Three-question onboarding that routes content   | ~7                             | replaces the existing focus-tag question (~3h) → **~4 unfunded** |
> | Short-form video (six posts)                    | ~12                            | one explanatory page (already counted above) → **~12 unfunded**  |
> | Appendix A table, watch Diya                    | ~2                             | **nothing**                                                      |
> | **Scoped AI removed**                           | **−15**                        | —                                                                |
> | **TOTAL**                                       | **≈ +42, −22 → net ≈ +20 hrs** |                                                                  |
>
> **Net scope change is roughly +20 hours, not negative.** With one person that would have required a cut. **With two people in parallel it is absorbable**, which is the actual reason the restructure above is what makes v3 shippable. Say it plainly rather than hiding it in a ledger.

---

### PHASE 0 — Preserve · Days 1–2 · both streams · ~14 hrs total

Branch `preserve/2026-08-12-full-state`, everything committed as-is, pushed. One commit, no tidying. Move ~331 MiB of raw sources and the ~1.14 GiB `content/_staging` tree out of Git history. Write `PORTFOLIO.md` per review §9.

**[v3 — added, ~2 hrs, Stream B:] Complete the rename.** `05-competitors` §1.7 found "Dharma Daily" still shipping in user-visible strings, and a competitor now holds that name.

| Location                                                                        | What it says                                                                        |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `apps/mobile/app/subscription.tsx:66`                                           | "Dharma Daily", shown to users in the free-launch copy                              |
| all 9 files in `apps/web/dist/`                                                 | "Dharma Daily" in `<title>` and body                                                |
| `packages/rag-pipeline/src/providers.ts:322`, `supabase/functions/ask/index.ts` | `<<<DHARMA_DAILY_RETRIEVED_CONTEXT` fence                                           |
| `packages/rag-pipeline/dist/index.js:405`                                       | _"the approved Dharma Daily corpus"_ — **inside a user-visible answer string**      |
| `content/_staging/prepared/rag-corpus-canonical.jsonl`                          | stale `source_path` and `source_url` — regenerate with `pnpm rag:prepare:canonical` |

**Dharma Daily is a real App Store app** (`app.replit.dharmadaily`, zero ratings, never updated since April 2026) whose festival calendar is wrong by roughly three weeks. **Do not share a name with it.**

**CONTINUE:** the branch exists on origin, and no user-visible string says "Dharma Daily". **STOP:** none. Unconditional.

---

### PHASE 0.5 — Two correctness fixes owed regardless · Days 2–4 · **Stream B** · ~10 hrs

> **[v3 · 05-competitors §1.3, §2.4] — NEW, and a prerequisite for Stream B's onboarding deliverable.** Both are bugs in the thing we claim to be best at. **This is new, unfunded work and it is worth it anyway.**

**Fix 1 — reverse `tradition_filter` from narrowing to ordering.** Today, `ask/index.ts:1972` sets `allowedTraditions = new Set(["general", policy.traditionFilter])`, which means **a user who states a tradition is structurally prevented from retrieving any other tradition's reading.** The system prompt then asks the model to _"mention variation where relevant"_ over a context the retrieval layer has already stripped of variation. This is the exact inverse of our stated product rule.

It is also a documented liability elsewhere: the **Bible Society**, at a **Cambridge Faculty of Divinity conference in January 2026**, examined Bible Chat by name and found these chatbots _"frequently promote a narrow theological outlook… framing one interpretation as definitive with little reference to historical, sacramental or tradition-based readings."_ **We would be shipping the same failure by a different mechanism.**

Retrieval must **rank** by stated tradition and still **return** the others, labelled.

**Fix 2 — stop discarding our own variation data.** `apps/mobile/src/lib/content.ts:139` reads `festivals.regional_variations` from Supabase and substitutes a **constant string**; `:208` does the same to `concepts.tradition_variations`. The schema models variation; the UI renders boilerplate regardless of content. Render the actual field.

**CONTINUE:** both fixed, with a test. **STOP:** none — Stream B's deliverable B4 cannot ship without Fix 1.

---

### PHASE 1 — Build _Navratri: Nine Nights_ · Days 5–61 (12 Aug – 11 Oct)

**Objective:** run one synchronised, dated, paid challenge — nine nights, **11–19 October 2026**, Vijayadashami 20 October.

**Why this rather than a Hanuman Chalisa journey:** the Chalisa journey has no date, so nothing makes anyone act now, tell anyone, or arrive. A festival supplies the date, the urgency, the social permission to mention it, and the annual repeat — for free.

---

### STREAM A — CONTENT & DATA · ~110 hrs

**Owns `content/**`, `docs/**`, the rights tracker, the web pages, audio, and every arrival action. Touches no application code.**

**A1 · Nine night sessions, written and reviewed** _(~45h)_
One per night, one devi form each. ~8–12 minutes each. One named reviewer, £100–200, briefed by 25 August with a hard deadline of 20 September.

Written to the existing `challenge_session` doc type — six sections in fixed order, `can_embed: false`. **The validator already enforces this; do not fight it.**

**State the convention.** The Navadurga one-form-per-night scheme is principally a North Indian Śākta convention; Bengali, Gujarati and South Indian observance are structured differently. **Each night's "Tradition notes" section must say which practice it is describing and name at least one way it differs elsewhere.** This is not a disclaimer — it is the product.

**[v3 — three additions to the session shape**, all cheap, all absent from every competitor _(~4h of the 45)_:

- **A stated duration on the night card** before it is opened. Bible Chat's `1 MIN / 3 MIN / 2 MIN` under a _"< 5 min/day"_ contract is the most portable mechanic in the residue. **No Hindu competitor has a completion object at all.**
- **Endowed progress** — the shloka block arrives marked complete, so the user starts the night in credit rather than at zero.
- **An explicit end-of-night state.** The night ends. Say so.]

**A2 · Audio for all nine, plus a slow repeat-after-me pass on each shloka** _(~22h)_
Phone microphone is fine. This is the pronunciation deliverable and the §2 painkiller in one (§3.1.2). **Add adjustable playback speed if Stream B can do it cheaply** — it is the one thing a competitor's user asked for by name.

**A3 · Three-register pronunciation throughout** _(inside A1)_ — §4.1a. The validator already requires all five labels and runs a Devanagari-codepoint check.

**A4 · The festival-date table and two festival-date pages** _(~15h)_ — §4.1b.
Hand-verified, regionally qualified, covering only the festivals we actually cover. Each entry carries: **reckoning named** (amānta / pūrṇimānta) · **observing community named wherever dates split** (Smārta vs Vaiṣṇava Janmāṣṭamī; Ekādaśī) · **location the timing is computed for, stated** · **source cited, and disagreement reported rather than resolved.**
**This is new, unfunded work.** It is the one differentiator a stranger can check in thirty seconds, and every competitor is visibly wrong on it.

**A5 · Three explanatory web pages** _(~9h)_ from the §5 query list. **[v3 — reduced from six to three; two of the original six became A4's festival-date pages, one is cut to fund A6.]** Submitted to Search Console as published.

**A6 · Six short-form videos across the Navratri run** _(~12h)_ — §5 channel 4.
The nine nights supply the content; a nine-night arc is natively episodic. **[v3 — religious-context check, because §5 skipped it:** the documented winning format elsewhere is _"DAY 0 vs DAY 40"_ conversion-testimony, and **that framing does not transfer** — Navratri is an observance kept annually, not a transformation arc, and a before/after narrative about becoming more Hindu is both false and off-putting. **Take the format — short, episodic, one idea per video, filmed plainly — and not the narrative.** _"Night three: what Chandraghanta is actually for"_ is the transferable shape.]
**Three must be posted before 11 October** or the channel has not been tested.

**A7 · Every §5 arrival action executed** _(~7h)_, across all four channels, **with arrivals recorded by named channel.** The attribution is the deliverable, not the volume.

**A8 · The source-rights checklist for anything the challenge quotes** _(inside A1)_ — §4.2. Public-domain and open-licensed only; translator and edition named at every quote. **Note: `challenge_session` docs set `can_embed: false`, so paid content never enters the RAG corpus.**

---

### STREAM B — APP & PLATFORM · ~95 hrs

**Owns `apps/**`, `packages/**`, `supabase/**`, deployment. Touches no content file except by running the generator.\*\*

**B1 · Get something onto a real device** _(~20h)_
This is first because **nothing is currently deployed** and it is the single largest gap against the competitive set (`05-competitors` §11). Supabase production project, migrations applied, EAS account, a build that installs. `app.config.js` hard-throws on six missing env vars — resolve them.

**B2 · Payment live and tested with a real card, then refunded** _(~12h)_
£8–15, one-off. This is the paywall event. `EXPO_PUBLIC_PAYMENTS_ENABLED` is a six-line file and the RevenueCat rail behind it is complete — **the blocker is not code, it is the commercial-rights re-audit in `docs/SOURCES-AND-ATTRIBUTION.md`.** Stream A owns clearing that (A8); Stream B owns the rail.

**B3 · Synchronised unlock** _(~10h)_ — night N opens on night N; late joiners allowed. The `get_challenge_session` RPC with participation and unlock-date checks already exists; wire it to real sessions and set `is_published`.

**B4 · Three-question onboarding, with Q1 actually routing content** _(~14h)_

| Q   | Question                                                                                                                                                                                                           | Must do                                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **"What do you do at home?"** — concrete observances: _we light a lamp in the evening · we keep ekādaśī · we do Hanuman Chalisa on Tuesdays · we mostly go to the mandir at festivals · I'm starting from scratch_ | **Reorder the daily pool** AND **determine which commentarial reading appears first** on a verse with more than one. Others stay visible and labelled. |
| 2   | Reminder time                                                                                                                                                                                                      | **Arms the notification.** Not collected and discarded.                                                                                                |
| 3   | Name                                                                                                                                                                                                               | Used in copy.                                                                                                                                          |

**Replaces the current focus-tag question. Net: still three questions.** Depends on Phase 0.5 Fix 1.

**Why household practice and not sampradāya.** Bible Chat's denomination question works because **the church already assigned the label**. That is STRUCTURAL and does not transfer. Many Hindu practitioners do not identify by sampradāya at all, and asking directly produces shrugs from exactly the disconnected user this product is for. **Inherited household practice is answerable where doctrinal affiliation is not** — though note this is a design judgement about our target user, not a claim about Hindus generally.

**Why it must visibly route content, or not be asked.** Diya asks **eleven** questions and consumes **one** — it collects a practice time and then ships both reminder toggles **Off**. Dharma Daily asks five and renders `YOUR PATH: Explore All`, the null default, while narrating _"We've crafted a personalized experience just for you."_ **A survey that changes nothing is worse than no survey.** Zero of the five apps studied asks anything about tradition, region or household practice.

**B5 · Night session UI** _(~12h)_ — stated duration, endowed progress, explicit end state (see A1). Audio player with adjustable speed if cheap.

**B6 · Reminders that actually fire** _(~10h)_ — `notifications.ts` is currently a stub returning `enabled: false`; the 277-line native implementation exists. Needs a device build (B1). **Q2's answer must arm this.**

**B7 · The web surface hosted** _(~9h)_ — `apps/web` builds and is unhosted. Stream A writes the pages; Stream B puts them on a domain with Search Console verified.

**B8 · Not building** _(0h, deliberate)_ — scoped AI, the live participation counter, the admin console, push retry leases. See below.

### ~~B-cut · Scoped AI on the night's shloka~~ — **[v3 — CUT ENTIRELY from the pilot]**

> **Three independent reasons:**
>
> 1. **It cannot work.** `05-competitors` §1.3: **1 of 432 source-tracker rows is approved** — the project's own editorial guide. `assertProductionRights` refuses everything else. Both AI keys are empty and `LLM_PROVIDER` defaults to `deepseek` while `LLM_DEFAULT_MODEL=claude-haiku-4-5`, so the function throws on first request. Even with keys, **every real question returns `noSourceAnswer()`.**
> 2. **The category is moving away from it.** Bible Chat has **demoted AI from its own store listing**. Appendix A already records RevenueCat's finding that **AI apps retain 36% worse at 12 months**.
> 3. **It is the only review finding FIX could not mitigate.** Live AI answers mean a reported-answer queue for one person, indefinitely (Serious 8). Cutting it **defers that cost entirely** rather than incurring it before there is a single user.
>
> **The three-layer citation architecture is not wasted** — it is the reason this can be switched on safely later, and `PORTFOLIO.md` should say so. **It ships when the corpus is cleared, not before.**

### ~~B-cut · Live participation count on the join screen~~ — **[v3 — CUT]**

Code stays, dark. `05-competitors` §6.1 classifies Bible Chat's equivalent as **BOUGHT** — it works because submissions arrive continuously at all hours. Ours would read _"3 people joined."_ Diya shows the failure mode directly: `Join 172 devotees` in its own marketing mock against `Join 75` on the live screen.

---

### JOINT GATES

The only three points where the streams must synchronise. Everything else runs independently.

**JOINT GATE 1 — 5 September (day 25): the interface holds.**
Stream A has **three finished night sessions** in the repo. Stream B can **render them on a device from the generated bundle**, end to end, with no schema changes. **This is the integration test, and it is early on purpose** — if the content schema and the challenge runtime disagree, both people need to know in week three, not week eight.

- **CONTINUE** → three sessions render on a real device.
- **FIX FIRST** → they don't. Stop feature work in both streams until they do.

**JOINT GATE 2 — 20 September (day 40): readiness.** _(v2's Checkpoint A, unchanged in substance, now with two owners.)_

- **CONTINUE** → _Stream A:_ all nine sessions written, audio recorded, reviewer engaged, **≥4 of the 5 web pages live including at least one festival-date page**, ≥1 video posted. _Stream B:_ payment tested with a real card and refunded, unlock working, onboarding shipping, a build installable on a real device.
- **DESCOPE** → if content is behind, cut to **five nights**, not nine. A five-night challenge that ships beats a nine-night one that doesn't.
- **STOP** → fewer than three sessions written **or** payment untested by 20 September. That is the review's "content is underestimated 3×" confirmed, or the platform blocker confirmed.

**JOINT GATE 3 — 21 October: the real one.** _(v2's Checkpoint B. **Numbers unchanged.**)_

- **GO** → **≥100 signups from strangers AND ≥15 paid joins.** Proceed to Diwali.
- **EXTEND, once** → 40–99 signups and 3–14 paid. Diwali is 19 days later; run it again, smaller, and re-check **9 November**.
- **STOP** → **<40 signups, or fewer than 3 paid** after every §5 arrival action is genuinely complete. Publish `PORTFOLIO.md` and stop.

> **The failure mode is not a STOP number.** It is week 3, when arrival work is slow and uncomfortable and the IA "needs" fixing first. **Two streams make this risk worse, not better** — Stream B's work is legible, satisfying and fully under its own control, and it will expand to fill whatever space Stream A's arrival work vacates. **If the web pages are unpublished, the videos unposted and the §5 actions undone on 11 October, Phase 1 did not run** — regardless of how good the app is or how good the nine sessions are.

---

_Everything below is provisional. Do not plan it in detail._

### PHASE 2 (provisional) — Diwali · 21 Oct – 15 Nov

Diwali is **8 November**, 19 days after Vijayadashami — close enough that Phase 1's audience is still warm and the machinery is built. Five nights rather than nine. Stream A writes; Stream B changes almost nothing. **CHECKPOINT 15 Nov:** CONTINUE → ≥40 paid across both events, refund <10%, ≥1 page in Google's top 10, **and ≥25% of Navratri joiners return for Diwali.** STOP → <15 paid total, or refund >25%, or **no measurable festival lift at all** — the last kills the arrival thesis specifically.

> **[v3]** Also record here: **whether Diya's 70-page Diwali SEO bet produced anything** (§5, §9). Free readout, one hour.

### PHASE 3 (provisional) — Repeat and the loop · Dec 2026 – Mar 2027

Holi (**22 Mar 2027**) tests annual repeat. Build shared intentions / family groups (§3.1.3) only if Phase 2 passed. CONTINUE → ≥30% of Diwali buyers buy again. STOP → <10%. Without repeat there is no income, only a one-off.

### PHASE 4+ (provisional) — The Chalisa journey, Hindi, Diwali 2027

_The Hanuman Chalisa, properly — 14 days_ as the first undated evergreen product, once a dated one has proven the mechanic. Hindi only after that sells and a named reviewer is secured. Diwali 2027 (~28 Oct) is the judgement year.

> **[v3] Scoped AI belongs here**, after the source corpus is cleared past 1 of 432 and after there is a user base whose reported answers are worth a moderation queue.
>
> **[v3] Three adoptions from `05-competitors` §9 are deliberately deferred, not dropped** — recorded here so the omission is visible: **§9.4 a threshold screen before content** (one screen, one afternoon — cheapest of the three, take it in Phase 2 if there is slack); **template propagation of the user's stated need into content titles** (needs a free-text input the three-question onboarding does not collect); **Listen/Read duality on one content unit** (needs the audio library A2 produces, so it is naturally a Phase 2 item).

---

## 8. THE 30-DAY VIEW — BOTH STREAMS

25 hrs/week **per person**. Everything is paced against **Navratri, Sunday 11 October**.

### Stream A — Content & Data

| Week                   | Work                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Hrs    |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| **1 · 12–18 Aug**      | Preservation branch and `PORTFOLIO.md`, jointly with B _(6h)_. Outline all nine nights — which devi form, which shloka, what the reflection does, and where each night's practice differs regionally _(6h)_. Find and brief one reviewer; agree fee and the 20 Sep deadline _(4h)_. Read the self-promotion rules for every community you intend to use, and write them down _(3h)_. Pull real search volumes for the §5 queries, geo UK+US+CA+AE _(3h)_. | **22** |
| **2 · 19–25 Aug**      | Write nights 1–4, three registers throughout _(16h)_. Build the festival-date table — reckoning, observing community, location, sources, disagreements _(8h)_.                                                                                                                                                                                                                                                                                            | **24** |
| **3 · 26 Aug – 1 Sep** | Write nights 5–9 _(16h)_. Publish festival-date page 1 and explanatory page 1 _(6h)_. First arrival actions — temple contacts, first community post _(3h)_.                                                                                                                                                                                                                                                                                               | **25** |
| **4 · 2–8 Sep**        | Send all nine to the reviewer _(2h)_. Record audio for nights 1–5, including the slow repeat-after-me pass _(12h)_. Publish festival-date page 2 and explanatory page 2 _(6h)_. **Record and post video 1** _(3h)_.                                                                                                                                                                                                                                       | **23** |
| _Then_                 | Audio 6–9 and reviewer corrections by **20 Sep**; explanatory page 3; videos 2–3; arrival push through late September.                                                                                                                                                                                                                                                                                                                                    |        |

### Stream B — App & Platform

| Week                   | Work                                                                                                                                                                                                                                             | Hrs    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| **1 · 12–18 Aug**      | Preservation branch, binaries out of Git, jointly with A _(6h)_. **Complete the rename** _(2h)_. **Phase 0.5: reverse the tradition filter; stop discarding variation data** _(10h)_. Start B1 — Supabase production project, migrations _(6h)_. | **24** |
| **2 · 19–25 Aug**      | Finish B1 — EAS account, env vars, a build that installs on a real phone _(14h)_. Start B2 — payment page, RevenueCat wiring _(10h)_.                                                                                                            | **24** |
| **3 · 26 Aug – 1 Sep** | Finish B2 — **tested with a real card, then refunded** _(4h)_. B3 synchronised unlock against the three sessions Stream A has written _(10h)_. Start B4 onboarding _(10h)_.                                                                      | **24** |
| **4 · 2–8 Sep**        | Finish B4 — Q1 actually reorders the pool and the commentary order _(6h)_. B5 night session UI: duration, endowed progress, end state _(12h)_. B6 reminders firing on a real device _(6h)_.                                                      | **24** |
| _Then_                 | B7 web hosting and Search Console by mid-September; polish; **hard freeze 5 October** — no new features in the six days before launch.                                                                                                           |

**JOINT GATE 1 falls in week 4 (5 September):** three sessions render on a device. Both streams stop and integrate.

### What you will know on 8 September that you did not know on 12 August

1. **Whether nine reviewed sessions can actually be produced in four weeks.** The real test of "content is underestimated 3×" — and if it fails, it fails cheaply, in September, with time to descope to five nights.
2. Whether a named reviewer will engage with an AI-assisted product touching scripture — the gating question for Hindi and Tamil, discovered now rather than expensively later.
3. **Whether the app can reach a real device at all**, which after eighteen months is still unproven.
4. Whether a stranger will arrive without money being spent — **with a number, attributed to a named channel.**
5. What the daily loop sounds like as audio, which is different from how it reads.
6. **Whether the two streams' interface holds** (Joint Gate 1), or whether the content schema and the challenge runtime disagree.
7. **Whether anyone will make a video.** Channel 4 is the cheapest test in the plan and the one most likely to be silently skipped, because it is the most personally uncomfortable. **One video by 8 September or the channel is not being tested.**

And you will know it **33 days before Navratri**, with time to descope rather than miss.

---

## 9. THE SINGLE BIGGEST RISK REMAINING

Unchanged from v1 and v2, and stronger now that the plan keeps the app.

> **That the arrival work in Phase 1 quietly doesn't happen, and the phase gets read as a pass anyway.**

The evidence is the strongest in this document: **eighteen months, an admin moderation console, push retry leases, entitlement verification, 55 migrations, three layers of citation validation — and not one stranger has opened it.** That is a revealed preference, not a prioritisation accident. Building gives feedback in seconds and is fully under your control. Arrival gives feedback in weeks, from people who owe you nothing, and mostly says no.

**By 11 October: five web pages published and indexed, every §5 arrival action done, and at least three videos posted. If those things are not true on the first night of Navratri, Phase 1 did not run — regardless of how good the nine sessions are.**

> **[v3 · 05-competitors §5.1, §11] — the risk has a new and specific shape, and it is worth naming because it is seductive.**
>
> The stated ambition is to **be better** than the market leader. That ambition is correct about the product and dangerous about the plan, because **being better is exactly the kind of work that feels like progress and produces no arrivals.**
>
> The control case is unusually clean: **bible.ai** has better craft than Bible Chat by most measures and **~102 lifetime ratings** against Bible Chat's 356,000 US ratings, with **zero features added since June 2025**. Its most beautiful screen is a demographics form. Meanwhile **Sri Mandir is genuinely mediocre** — Play rating down 4.9 → 4.4, a dominant unfixable complaint about unverifiable proof-of-ritual, a loud temple bell you cannot mute — **and it has 40M downloads, because it spent ₹51.9 Cr on ads against ₹69.6 Cr of revenue.**
>
> **Quality is why people stay and pay. It is not why they arrive.** The correct use of the quality thesis in this plan is §4.1 — pick the correctness claims a stranger can _check in thirty seconds_ (pronunciation, and a festival date with its convention stated) and put them where strangers already are. **Everything else labelled "quality" that does not reach a stranger is the risk above, wearing better clothes.**

**Second-biggest:** the editorial and moderation load (review Serious 8). **[v3]** _Deferred for the pilot rather than incurred, because scoped AI is cut. It returns in full the moment AI ships — which is now Phase 4+, after the corpus is cleared. Do not let it back in early._

**Third — [v3, new and cheap]:** **watch Diya.** They are running our channel-1 thesis and our subscription-over-library counter-thesis simultaneously, in public, with paid acquisition behind them, ten weeks ahead of us. **70 content pages published 29–31 July 2026, 20 of them festivals, 4 Diwali-specific.** Check in **November** whether any of it ranked, and check their rating trajectory. One hour, and it is the highest-information-per-minute activity available.

---

## APPENDIX A — Verified figures

Everything `01-review.md` marked `[UNVERIFIED]`, checked. **The review's arithmetic survives and is worse than stated.**

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

_Recomputed: the app as originally specified (India-primary 70/30, freemium) yields **$3,374/yr at 10,000 installs** — £220/month._

_D1/D7/D30 install-retention figures could not be verified. Treat all such figures, including the review's, as unsourced._

### Faith-app market

> **[v3 — sourcing caveat on this block.** The Hallow figures below were carried over from v2 and were **not re-verified** in the v3 competitive research, which did not cover Hallow. The 263,000 Ash Wednesday figure is a **third-party download estimate (Appfigures)**, not a company disclosure, and 263,000 against a ~10,000/day baseline is **26×, not 25×**. The "≈9% of growth" attribution to parish partnerships is unattributed arithmetic. Treat this block as v2-sourced and re-check before it drives a decision.\*\*]

| Fact                                             | Value                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hallow funding / valuation                       | $131.15M; $759.4M post-money (Aug 2025)                                                                                                                                                                                                                                                                                                                                                               |
| Hallow revenue 2025                              | ~$40M net; ~24M installs; ~10,000/day baseline                                                                                                                                                                                                                                                                                                                                                        |
| **Ash Wednesday 2026**                           | **263,000 downloads in one day = 25×**; #1 on US App Store                                                                                                                                                                                                                                                                                                                                            |
| Hallow Feb 2024                                  | 2M installs; **paid media up 15×**; 2,500 parish QR partnerships ≈ 9% of growth                                                                                                                                                                                                                                                                                                                       |
| **Sri Mandir cumulative IAP since 2020**         | **under $100,000** — _Sensor Tower estimate, reported by TechCrunch_. Against **40M downloads (company claim)** and **3.5M MAU (company claim)**                                                                                                                                                                                                                                                      |
| Sri Mandir FY25                                  | ₹69.6 Cr revenue (~$8.1M), ₹45.3 Cr net loss, **₹51.9 Cr advertising — 75% of revenue**                                                                                                                                                                                                                                                                                                               |
| Sri Mandir model                                 | 20–25% take rate on temple offerings — transactional                                                                                                                                                                                                                                                                                                                                                  |
| **Sri Mandir diaspora vs domestic ARPU**         | **₹7,000 (~$81) vs ₹600–800 (~$7–9) — ~10×**. **[v3]** _Diaspora = ~8% of installs producing 20–25% of revenue; sources give both 20% and 25% — report both._                                                                                                                                                                                                                                         |
| **[v3 — CORRECTED] Bible Chat revenue**          | **$6.3M cumulative net since 2023 launch; $750K net in March 2025 (peak month); >95% from the US App Store** — Appfigures estimate. The widely-quoted **"$15M annualised" is a company claim and reads as a run-rate extrapolation from a single peak month.** Romanian statutory filings show a **loss-making company** in 2023 (revenue 5.4M lei, loss 180,755 lei, debt 10.5M lei). **Use $6.3M.** |
| **[v3 — CORRECTED] Bible Chat's channel**        | **A paid creator programme, not Apple Search Ads.** 200+ UK creators, **£150/mo base plus £13–£1,060 view bonuses**, required to film on **new dedicated accounts**. ≈**$1.5M/yr**, off the ad-network books. 110M+ views / 500+ videos / one at 94M. Website ~20K visits/mo, **−24% MoM**, brand terms only. **No church distribution — listed as a future plan.**                                   |
| Bible Chat funding                               | $14M Series A (Feb 2025, True Ventures lead); €475K seed 2019 as Book Vitals. **Pivoted from a dead reading app whose funds were exhausted by 2022.**                                                                                                                                                                                                                                                 |
| YouVersion                                       | 1 billion downloads, **free forever by policy**, funded by Life.Church                                                                                                                                                                                                                                                                                                                                |
| Hindu content subscription succeeding in English | **NOT FOUND** — **[v3]** _re-tested across five apps plus Sri Mandir; still not found._                                                                                                                                                                                                                                                                                                               |
| Isha / Chinmaya finite courses                   | **$209.99** / **₹7,000**                                                                                                                                                                                                                                                                                                                                                                              |
| **Hallow Pray40 mechanics**                      | Synchronised start · sessions **unlock one day at a time** · late joining allowed · **requires trial or subscription** · group participation · no leaderboard                                                                                                                                                                                                                                         |
| **Hallow content format**                        | **Audio-first**, downloadable · 1/5/10/15/30/60 min · background music                                                                                                                                                                                                                                                                                                                                |
| **Hallow "Prayer Families"**                     | Share prayers, intentions **and journal reflections** with friends, family, prayer group, parish                                                                                                                                                                                                                                                                                                      |

### [v3 — NEW] The competitive set

Full analysis in `docs/05-competitors.md`. Figures are as of 12 Aug 2026; download and revenue figures are third-party estimates unless marked otherwise.

| App                                         | Scale                                                                               | Funding                                                             | Model                                                                                      | Channel                                                                  | Maintained?                                                                                                  |
| ------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| **Dharma Daily** (Ayush Bajpai)             | **0 ratings**, all storefronts. iOS only. Not charting.                             | None                                                                | $49.99/yr advertised, **no live IAP — cannot take money**                                  | **None.** Framer subdomain, fabricated testimonials, broken social links | **No.** v1.0, 6 Apr 2026, never updated. Bundle id `app.replit.dharmadaily`. Developer moved to a photo app. |
| **Dharmāyana** (OIT Innovations, Bengaluru) | **865K Android installs**; Play 4.54/6,456; iOS IN 4.70/1,137, US 4.90/87           | **$500K pre-seed**, Jan 2025, friends-and-family; investors unnamed | **Transactional**: ₹21 puja, ₹71 jyotiṣī, off-platform billing (invisible to Sensor Tower) | WhatsApp share loop by design; ASO; one paid ANI wire                    | **Yes** — 16 releases in 9 months                                                                            |
| **Diya** (Houdini Apps, NJ/CA)              | **154 ratings, 95% US**. iOS only. **10 weeks old.**                                | No public record                                                    | **Subscription** $4.99–6.99/mo, $24.99/yr. **India not PPP-adjusted**                      | Meta SDK (paid social); 70-page SEO site bulk-published 29–31 Jul 2026   | **Yes** — 8 updates in 9 weeks                                                                               |
| **Bible Chat** (Book Vitals, RO)            | **356K US ratings**; ~7.4M Android lifetime                                         | **$14M Series A**                                                   | Subscription; weekly £4.99 pre-selected over £39.99/yr                                     | **Paid creator farm ≈$1.5M/yr**                                          | **Yes** — ~30 releases Mar–Aug 2026                                                                          |
| **bible.ai** (Bible Ai Pty Ltd, AU)         | **~102 ratings / 17 storefronts.** iOS only. Web −41% MoM                           | **None** — solo, bootstrapped, `invest@` on the press page          | $12.99/mo, $89.99/yr. India priced **above** US; **0 Indian ratings**                      | Christian-media PR + one NBC segment. **Did not compound.**              | **No** — v1.0.3, Jun 2025, zero features since                                                               |
| **Sri Mandir** (AppsForBharat)              | 40M downloads, **3.5M MAU**, 1.2M transacting/yr; Play 4.4/142K (**down from 4.9**) | **~$53M**, Series C Jul 2025                                        | **Transactional**, 20–25% take rate. **<$100K lifetime IAP**                               | **₹51.9 Cr advertising = 75% of revenue**                                | **Yes**                                                                                                      |

### [v3 — NEW] What the market does not do

Verified absent from **all** of the above:

1. Any onboarding question about **tradition, sampradāya, iṣṭa-devatā, region, or household practice** — zero of five ask
2. A **named translator** on any displayed verse
3. A **named commentator**, anywhere
4. **IAST or any transliteration standard**
5. A **correct, disclosed, region-aware festival date** — three are wrong, one has no calendar, one has no sampradāya split
6. Any **on-screen acknowledgement that observances vary**
7. A **completion object** — a defined daily act with an end
8. **Provenance or licensing disclosure on audio**
9. **Pronunciation help** — full phonetic text and adjustable playback speed, explicitly requested in a competitor's own reviews
10. **PPP pricing for India**

Items 1–4, 6 and 9 are the ones our existing content and validator already reach.

### Unverified — check these yourself

Absolute search volumes (Keyword Planner / Ahrefs, geo UK+US+CA+AE) · subreddit subscriber counts and per-subreddit self-promotion rules (**moderator rules override sitewide policy**) · Facebook group sizes and rules · 2027 festival dates against a UK- and US-localised panchang closer to the time. **[v3]** _Add: Bible Chat's ad-network spend — my "no evidence found" rests on ad-library data being unreachable, so it is absence of evidence, weakly held._

---

## APPENDIX B — Founder decisions, 12 August 2026

| Question             | Decision                                                                                                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hours available      | 20–35/week (planned at 25)                                                                                                                                                  |
| Deadline             | Self-imposed — now anchored to Diwali, 8 Nov 2026                                                                                                                           |
| Goal                 | A product people use + a nice bit of passive income                                                                                                                         |
| Audience             | **Adults. Kids not relevant.** Not schools                                                                                                                                  |
| Core product         | **Daily shloka + daily reflection**                                                                                                                                         |
| AI's role            | **Depth layer on today's content** — ask questions, discuss the shloka                                                                                                      |
| Festivals            | Arrival spike, **not the product**                                                                                                                                          |
| Languages            | **English → Hindi → Tamil**; English chosen because of available sources                                                                                                    |
| Astrology            | **Later, or never**                                                                                                                                                         |
| Sequencing           | **Product first**, outreach second                                                                                                                                          |
| Reference product    | **Hallow**, not Bible Chat — Bible Chat's growth was bought and doesn't transfer at £0                                                                                      |
| **[v3] Positioning** | **Be better than the market leader.** Correct about the product; see §9 for the specific way it endangers the plan, and §4.1 for the version of it that reaches a stranger. |

---

## Sources

**[v3]** Competitive analysis and all per-app sourcing: `docs/05-competitors.md`.

[RevenueCat, State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps) · [RevenueCat renewal rates by category](https://www.revenuecat.com/blog/growth/average-subscription-renewal-rates-by-app-category/) · [Appfigures — Hallow Lent surge](https://appfigures.com/resources/insights/hallow-lent-surge-prayer-app-revenue) · [Branch — Hallow 2M installs](https://www.branch.io/resources/case-study/how-hallow-drove-2-million-app-installs-and-became-1-on-the-app-store/) · [TechCrunch — Sri Mandir](https://techcrunch.com/2025/06/30/sri-mandir-keeps-investors-hooked-as-digital-devotion-grows) · [TechCrunch — Sri Mandir digitising devotion](https://techcrunch.com/2024/09/09/sri-mandir-is-on-a-quest-to-digitize-indias-devotional-journey/) · [Inc42 — AppsForBharat FY25 filings](https://inc42.com/buzz/appsforbharat-fy25-net-loss-widens-16-to-inr-45-cr/) · [Entrackr — Astrotalk unicorn round](https://entrackr.com/exclusive/exclusive-astrotalk-seeks-unicorn-valuation-in-new-round-9485023) · [Entrackr — Kuku FM FY25](https://entrackr.com/fintrackr/kuku-fm-reports-rs-240-cr-revenue-in-fy25-spends-rs-285-cr-on-marketing-10943137) · [Appfigures — Bible Chat](https://appfigures.com/resources/insights/20250418?f=5) · **[v3]** [creators.thebiblechat.com](https://creators.thebiblechat.com/) · **[v3]** [Christian Today — theological bias in AI Bible chatbots](https://www.christiantoday.com/news/concerns-raised-over-theological-bias-in-ai-bible-chatbots) · **[v3]** [trydiya.com/sitemap.xml](https://www.trydiya.com/sitemap.xml) · **[v3]** [Swarajya — Dharmayana](https://swarajyamag.com/tech/dharmayana-bridging-tradition-andtechnology) · [Premier Christianity — YouVersion on never monetising](https://www.premierchristianity.com/opinion/we-would-make-billions-if-we-monetised-the-bible-app-heres-why-we-never-will/20447.article) · [The Gospel Coalition — AI in Bible translation](https://www.thegospelcoalition.org/article/ai-bible-translation/) · [Wycliffe — AI and Bible translation](https://wycliffe.net/2025/06/20/the-impact-of-ai-on-bible-translation-opportunities-and-challenges/) · [Chinmaya International Foundation — Gita course](https://chinfo.org/product/bhagavad-gita-course-online-mode/) · [Hallow — features](https://hallow.com/features/) · [Hallow — Pray40 FAQs](https://help.hallow.com/en/articles/10697582-hallow-lent-pray40-faqs) · [Drik Panchang 2026](https://www.drikpanchang.com/calendars/indian/indiancalendar.html?year=2026) · [Drik Panchang 2027](https://www.drikpanchang.com/calendars/hindu/hinducalendar.html?year=2027)

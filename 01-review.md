# Dharma Daily — Hostile Product Review

**Status:** Pre-launch. Zero users. ~18 months of build.
**Reviewed:** August 2026
**Purpose:** Input to the remediation plan. Read Sections 6–8 first.

---

## EDITOR'S NOTE — read before using this document

This review was produced by an AI reviewer instructed to be maximally hostile. It has been edited before being used as planning input. What changed and why:

- **Fabricated precision removed.** The original assigned probabilities ("~10% chance of reaching 1,000 actives", "~2% chance of meaningful revenue"). These were not calculated from anything. The underlying base-rate evidence is retained; the invented percentages are not, because they would anchor any downstream plan toward abandonment on the strength of a number nobody computed.
- **Unverified figures flagged.** The fatal-flaw finding rests on a stacked chain of borrowed benchmarks (conversion rate, LTV, installs-to-sustainability). Each is individually plausible; compounded, small errors move the conclusion a long way. These are now marked `[UNVERIFIED]`. **Two of them must be checked against primary sources before this document is treated as decisive.**
- **An internal contradiction is flagged** where the review states no organic loop exists, then recommends a use case that produces one.
- **A missing section was added** (Section 9) on what has independent value regardless of the product outcome. The original did not consider it.

Treat everything below as a set of hypotheses to test, not a verdict. The reviewer had no access to the codebase, no users to observe, and no primary market data.

---

## 1. RESTATEMENT

**What this is:** An AI chat and daily-practice app that teaches Hindu texts to English-speaking Hindus who feel disconnected from their tradition.

**First finding:** the product's own documentation cannot say this in one sentence. It needs 42 words and three clauses. And the qualities the build is proudest of — source-grounded retrieval, citation transparency, explicit separation of scripture from commentary from folklore — are _builder_ values, not user values. Nobody has ever downloaded an app because they wanted better citation provenance in religious education.

The project has been optimising for correctness. Correctness is not a reason to download anything.

**On the numbers:** the review brief asked for signups, actives, retention, revenue. There are none. Not small — zero. Against that sit ~5.26M staged lines of code, 131 passing tests, a RAG pipeline with citation validation, an admin moderation console, push retry leases, and RevenueCat entitlement verification. No stranger has ever opened this. That asymmetry drives everything below.

---

## 2. PRE-MORTEM

_It is February 2028. The app has 40 users, 3 active._

Late 2026 went to the planned sequence: audience decision, onboarding rebuild into a 13-question funnel, writing the seven-day journey. That ran to spring 2027 — content writing is slower than code, and rights review ran in parallel. Shipped mid-2027 to both stores. 180 downloads in month one: friends, family, two temple WhatsApp groups, one Reddit post at 40 upvotes and 6 installs. Three trial conversions, two cancellations. By September, 9 daily actives. Building continued, because building gives feedback in seconds and distribution doesn't. Festival season gave a spike in October that decayed in eleven days. The Apple developer fee came due in January 2028. Work stopped in March.

**Causes ranked by likelihood of being the real one:**

| Rank | Cause                                                                                                        | Weight                         |
| ---- | ------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| 1    | No distribution mechanism ever existed                                                                       | Dominant                       |
| 2    | Vitamin for an episodic need, sold as a daily habit                                                          | High                           |
| 3    | 18 months of building without a user; sunk architecture made pivoting feel like destruction                  | High                           |
| 4    | Economics never worked at achievable scale                                                                   | Moderate                       |
| 5    | Content bottleneck — one approved canonical file; rights review depends on third parties who owe you nothing | Moderate                       |
| 6    | A theological incident — one screenshot of a wrong claim about a sampradaya, circulated                      | Low probability, high severity |

Causes 1 and 2 are where attention belongs. The rest are downstream.

---

## 3. THE USER

**Priya, 34, Harrow.** Born in the UK to Gujarati parents. Two kids, 6 and 9. Mid-range Samsung, 40GB of 128 used. NHS admin. Mandir at Navratri and when someone dies. Fasts on Ekadashi maybe twice a year because her mother-in-law mentions it. Has never wondered what Advaita is.

**What she does today: nothing.** When something specific comes up — her son asks why Ganesha has an elephant head, or she needs to know when Diwali falls — she asks her mum, asks the family WhatsApp group, watches a YouTube video, or types it into ChatGPT, which is already installed and free. She does not have a "spiritual practice gap." She has occasional moments of mild embarrassment.

**Frequency — the number that matters most, and it is bad.** Trigger events fire perhaps 6–15 times a year. A festival, a child's question, a death, a party where someone asks her something. This is a _daily_ app built for a _seasonal_ feeling. Duolingo works because skill acquisition genuinely compounds daily. Reconnecting with a tradition compounds annually, in the way showing up to Navratri compounds annually.

**Vitamin, not painkiller** — as specified. But there is a painkiller inside the target audience that the product does not aim at: **the parent who cannot answer their child's question and feels ashamed about it.** Acute, recurring, specific, shame-driven. Those are the three properties that make people pay.

**Would she notice if it vanished?** No. She'd notice a month later when the notification stopped, and feel mild relief.

---

## 4. RETENTION

`[UNVERIFIED]` Cross-vertical 2026 benchmarks cited as: D1 25–26%, D7 11–13%, D30 5–7%. Education-adjacent nearer 2% at D30. Top quartile roughly D1 30% / D7 15% / D30 8%.

**Is there a mechanism to beat that baseline? No — and the reason is structural, not a product-quality problem.**

Hallow and YouVersion beat the baseline because **observant Christianity supplies a daily obligatory office and an externally-imposed liturgical calendar.** Lent is a 40-day, socially-enforced, annually-recurring commitment. `[UNVERIFIED]` Ash Wednesday 2026 reportedly produced ~263,000 Hallow downloads against a ~10,000 daily baseline — a 25× spike. The app didn't create the habit. The Church did; the app monetised it.

There is no equivalent for _this specific user_. Hindus with a daily practice already have one — a home shrine, a routine inherited from a parent — and don't need an app for it. The disconnected user has no daily obligation to hook into. The product asks her to acquire a daily habit she has never had, in a domain where she feels unqualified, with no social enforcement and no external calendar. Then it correctly rules out guilt mechanics on ethical grounds — which is the right call, but understand what it costs.

**Does it improve with use?** Marginally. Saved items and journal history are the accumulating assets and they are weak ones. Nobody re-reads their app journal. No social tie, no shared content, nothing that becomes more valuable in month six.

**Steps to first value: 19+.** Four carousel screens → 13 onboarding questions → account creation → notification permission → plan preview → paywall → Today tab → first teaching. Apps that retain deliver value in under three minutes. This one delivers a survey. Bible Chat can afford a long funnel because it bought seven million downloads' worth of traffic and sells the most-read book in human history. This cannot.

---

## 5. DISTRIBUTION

**The planning document contains eleven product decisions, ten operational decisions, and ten sequence steps. None of them are about how a stranger finds this app.**

**How does user 1,000 hear about it?** There is currently no answer. Testing the plausible ones:

- **App store search — dead.** "Bhagavad Gita" is among the most saturated keyword clusters in Reference. Dozens of free apps, most offline-capable, most multilingual. `[UNVERIFIED]` Google Play discovery reportedly now favours high-retention, high-rated apps, which is a chicken-and-egg trap at zero installs.
- **Paid acquisition — priced out.** `[UNVERIFIED]` Hallow reportedly bought the top of the US App Store with Apple Search Ads, celebrity endorsement, and $105M in funding. That sets the clearing price on faith-app keywords in exactly the English-language markets being targeted. Budget here is £0.
- **Organic loop — none.** Reading a cited teaching produces nothing another person sees. The journal is private by design. No invitation, no shared artifact, no network effect. A private reading experience is a defensible editorial choice and a fatal growth choice.
  > **⚠️ FLAGGED CONTRADICTION.** Section 8 recommends the parent-answering-a-child's-question use case, which produces precisely the shareable artifact this paragraph declares absent — a good answer to "why does Ganesha have an elephant head" goes straight into the family WhatsApp group. **If that use case is adopted, this paragraph no longer holds, and the growth picture is meaningfully less closed than stated here.** Resolve this before planning.
- **Communities — real but low-throughput.** r/Hinduism, NHSF university chapters, temple WhatsApp and Facebook groups, ISKCON and Chinmaya Mission networks, second-gen diaspora YouTube. Reachable for free. Expect tens of users per push, not thousands, and expect suspicion rather than welcome — religious communities are unusually hostile to commercial self-promotion, especially from an unknown solo actor with an AI product touching scripture.

**Web instead of app — a primary recommendation.** Installation is a brutal filter, especially on a low-storage mid-range Android in the stated primary market. Every relevant competitor's free tier is already a website. More importantly, web is the only free acquisition channel with real volume in this category: search. _"Why do we celebrate Karva Chauth"_, _"what does the Gita say about anger"_, _"when is Navratri 2027"_ — high-volume, evergreen, intent-rich queries an app store listing can never capture. There is currently no SEO surface at all.

---

## 6. MONETISATION

**Do consumers pay in this category?** In the West, yes. `[UNVERIFIED]` Hallow reportedly earned ~$40M net in 2025 at $69.99/year.

In India, the evidence says no — at least not for content subscriptions. `[UNVERIFIED]` Sri Mandir, the dominant Hindu app globally at 30M+ downloads and $53M raised, does not monetise through content subscriptions. It monetises transactionally: puja bookings, prasad delivery, logistics. A company with three years of head start, a real-world fulfilment network, and venture funding is telling you through its product decisions that Indian Hindu users do not pay for digital religious content.

### The arithmetic — **CHECK THIS BEFORE ACTING ON IT**

`[UNVERIFIED — this chain is the entire basis of the fatal finding]`

At 10,000 installs, 70/30 India/diaspora:

| Input                               | Value                              | Source status |
| ----------------------------------- | ---------------------------------- | ------------- |
| Download-to-paid, freemium          | ~2.1% median (hard paywall: 10.7%) | Unverified    |
| Applied rate (hybrid, generous)     | 2.5% → **250 payers**              | Derived       |
| Year-1 LTV per payer, India/SEA     | $14                                | Unverified    |
| Year-1 LTV per payer, North America | $32                                | Unverified    |
| Blended 70/30                       | ~$19                               | Derived       |
| **Year-one revenue**                | **~$4,750**                        | Derived       |

That is roughly £300/month at an install count most apps never reach — before infrastructure, inference, the $124/year store fees, and any value on your time. Clearing £2,000/month needs roughly 65,000–70,000 installs, with no channel capable of producing them.

> **Verify the two loadbearing inputs — conversion rate and blended LTV — against primary sources before treating this as decisive.** If blended LTV is $30 rather than $19, the picture changes materially. Do not let an unverified number end an 18-month project.
>
> **Also note:** much of this arithmetic assumes India as primary market. If the Section 8 pivot is adopted, the India weighting disappears and this table must be recomputed.

**Does the free tier give away the value? Yes.** Free currently includes the daily loop, the seven-day journey, starter practices, the full concept/deity/text/festival catalog, journal, saved items, reminders, and five AI questions daily. Paid is "more of the same." Nobody upgrades for more of a thing they aren't finishing.

---

## 7. COMPETITION AND DEFAULTS

Already shipped, free, today:

| Product                           | What it is                                                                                                                                                                             |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GitaGPT** (bhagavadgita.com)    | Free Gita chatbot, Hindi + English, 5 msgs/day, 20+ scholarly commentaries. This is Ask Dharma, shipped, free, on the web.                                                             |
| **Gita GPT** (Srimad Gita app)    | Advertises grounding in Shankara, Ramanuja, Madhva, plus Prabhupada and Vivekananda, with verse citations on every response. **This is the stated differentiator, already in market.** |
| **gitagpt.in**                    | Free, multiple deity personas                                                                                                                                                          |
| **Ask Krishna AI**                | Play Store, multi-language, chat + stories + mantras                                                                                                                                   |
| **Dharma – Hinduism Lessons**     | Daily curated Gita verses, Sanskrit + transliteration + translation, 18 chapters, quizzes. A solo developer has shipped a recognisable version of this app.                            |
| **Daily Hinduism** (JetSynthesys) | Free, deity/community personalisation, festival reminders                                                                                                                              |
| **Sri Mandir**                    | Free content library, 30M+ downloads, ~20% diaspora demand                                                                                                                             |
| **A dozen free Panchang apps**    | The entire Calendar tab — commoditised, offline, multilingual, better regional coverage                                                                                                |
| **ChatGPT / Gemini**              | Already on her phone                                                                                                                                                                   |

**The default wins.** A worse feature already installed beats a better app that needs downloading. Priya will ask ChatGPT.

**Corpses:** no documented post-mortems of failed Hindu learning apps — the category doesn't generate write-ups. Evidence is indirect but clear: the stores are full of low-download, unmaintained Gita apps. `[UNVERIFIED]` Global religious-tech funding reportedly peaked in 2021 and has declined since. Absence of published failures means nobody wrote about them, not that they didn't happen.

---

## 8. THE AI QUESTION

**Could a good ChatGPT prompt do 80% of this?** Yes. _"Answer as a careful, non-sectarian guide to Hindu thought, cite specific verses, flag where Vaishnava and Shaiva readings differ, never claim one tradition is correct"_ gets most of the way, free, in an app she already has.

**The deeper problem — think about this one longest.** The differentiator (verified citations, validated retrieval, no hallucinated verses) is **invisible to the buyer.** Priya cannot distinguish a correctly-cited Gita 2.47 from a fabricated one. She has no means of perceiving the quality that took a year to build. The people who _can_ perceive it — scholars, serious practitioners — don't need the app. This is a trust guarantee built for an audience that cannot audit it and therefore will not pay a premium for it.

**Inference economics vs. product quality — a genuine bind, not a tuning problem.** Free tier is 5 RAG queries/day = 150/month. With retrieved context, roughly 4,500 tokens in and 700 out per query. `[UNVERIFIED]` On a frontier model that is ~$2–3 per free user per month against a blended year-one revenue of ~$1.60/month _per payer_. Free users cost more than payers pay. A cheap model drops this to cents — and the cheap model is precisely the one that flattens tradition-sensitive nuance, which is the stated reason the product exists. **The differentiator and the unit economics point in opposite directions.**

**Wrong-answer tolerance is lower here than almost anywhere.** A wrong recipe is a bad dinner. A wrong statement about what Shaivas believe, a mangled transliteration, or an AI-generated line carrying the visual authority of scripture invites organised backlash faster than one person can respond. There is a reporting flow and a moderation console. There is no communications plan and no reviewer on call.

---

## 9. SOLO BUILD REALITY

Outstanding and all solo: 11 product decisions, ~10 operational configurations, full onboarding rebuild, IA rebuild, unwritten seven-day journey, unfinished rights review, production Supabase migration, RevenueCat verification, native device testing, legal pages, store submission.

**Realistic time to shippable: 4–8 months** — and that assumes rights review resolves, which it may not, because it depends on translators, publishers and estates who owe you nothing and reply slowly.

**Most underestimated: content, by 3× or more.** One approved canonical file exists. Fifty app-authored concept introductions is a thin fallback. Tradition-sensitive writing and review is slower than code and returns no dopamine.

**Permanent ongoing load, for one person:** annual festival date verification across regional calendars (a recurring correctness liability with real consequences), moderation of reported AI answers, multi-tradition editorial review, support email, store compliance, OS updates. **This specification requires a small editorial team and is staffed with one engineer.**

---

# VERDICT

**Build this differently.**

There is real audience and real money in faith apps — they attach to identity rather than to a goal, and goals get abandoned while identity doesn't. But the specification as it stands — native mobile, five tabs, a 19-screen funnel, a subscription, a rights-cleared multi-tradition corpus, an editorial review board, and an AI whose central virtue is invisible to the buyer — cannot be executed and cannot reach sustaining revenue at any achievable scale by one unfunded person with no audience.

**The engineering is not the problem. The engineering is the reason the problem went this long unexamined.**

## Fatal — one, and it concerns the specification rather than the idea

**The revenue model cannot reach sustainability at any achievable scale, as specified.** ~$4,750 in year one at 10,000 installs; sustainability needs ~65,000+; there is no mechanism, paid or organic, capable of producing 6,500. A harder paywall moves the first number and does nothing about the second. It is fatal _as specified_ because the specification pairs the lowest-ARPU primary market on earth with a content subscription in a category whose local leader has concluded content subscriptions don't work.

> **Conditional on the arithmetic in Section 6 surviving verification.** If it doesn't, this drops to Serious.

## Serious

1. **No distribution mechanism exists and none is planned.** Solve before writing another line.
2. **Episodic need, daily product.** Trigger fires 6–15×/year; the product assumes 365.
3. **The differentiator is unverifiable by the buyer.**
4. **Nineteen screens to first value.**
5. **Every layer is free elsewhere** — chat, calendar, content, general questions.
6. **The free tier is the whole product.**
7. **Inference economics and content quality are in direct opposition.**
8. **Editorial and moderation load exceeds one person indefinitely.**
9. **App-first forfeits search**, the only free high-volume channel, while adding install friction in a low-storage market.

## Fixable

- Ship the Git preservation branch today. One disk failure from losing all of it.
- Collapse onboarding to three questions; deliver a teaching before the paywall.
- Drop the Calendar tab. Commoditised.
- Stop copying Bible Chat's funnel. They bought seven million downloads.

## Base rate

`[UNVERIFIED]` Median subscription app lifetime revenue reportedly ~$492. Newly-launched apps reportedly earn ~25% less at the median than a few years ago, with ~31% more launching annually. Median D30 retention 4–7%; education-adjacent ~2%.

Reaching 1,000 genuine actives as specified is unlikely — build quality helps at the margin and is overwhelmed by having no channel. Apps without a distribution mechanism reach 1,000 actives mainly by accident, and accidents in this category require a shareable artifact this product does not have. Reaching sustained meaningful revenue requires roughly 30,000+ installs at the stated blended LTV, against a saturated keyword space, a free-heavy competitive set, and India as primary market.

_(The original review assigned specific probabilities here. They were not derived from anything and have been removed.)_

---

# THE COUNTER-ARGUMENT — made properly, because it points somewhere real

**Faith apps have the best retention structure in consumer software**, because they attach to identity rather than to a goal. `[UNVERIFIED]` Hallow reportedly earned ~$40M net in a year serving one denomination in one language; Bible Chat reportedly took seven million downloads in ~18 months. The demand is not speculative.

**There is no Hindu YouVersion.** The category leader, Sri Mandir, is a transactional ritual-logistics business — puja booking, prasad delivery, temple partnerships. It serves the devotee who already knows what they believe and wants a service performed. It does not serve the 32-year-old in Harrow or Edison who wants to _understand_. `[UNVERIFIED]` And ~20% of Sri Mandir's demand already comes from US/UK/UAE/Canada/Australia/NZ — the diaspora is proven to reach for these products, in a segment with far higher willingness to pay than India.

**Festivals are Hinduism's Lent, and there are more of them.** Navratri, Diwali, Ganesh Chaturthi, Janmashtami — calendar-fixed, socially enforced, emotionally loaded, annually recurring, and generating enormous search volume. Structurally identical to the engine Hallow rides every year. Currently written off as a nested tab.

**There is a genuine painkiller in the audience that nothing is aimed at:** the diaspora parent whose child asks a question they cannot answer. Acute, shame-driven, recurring, specific — and the one thing here someone would pay £5 for on the spot.

## The strong version

**Abandon India as launch market. Abandon the app. Abandon the subscription. Abandon the general-purpose learning companion.**

Build a free web tool for UK/US/Canada diaspora Hindu parents, built entirely around the festival calendar, optimised for the queries they already type into Google, with the citation-validated RAG behind it. Every festival page is an SEO asset that compounds. Every festival is a re-engagement event you don't have to manufacture. Sell one thing: an excellent £8 Diwali or Navratri family guide, seasonally, no subscription.

The RAG work — the hard, real thing already built — transfers wholesale.

This version has a channel, a frequency, a painkiller, a buyer with money, and no install friction. It is also roughly 5% of what has been built, which is the finding you'll like least.

---

# 9. WHAT HAS VALUE REGARDLESS _(added — the original review omitted this)_

Whatever happens to the product, the following exist independently and should be assessed on their own terms rather than written off with the business:

- **A citation-validated RAG pipeline with verified source attribution and 131 passing tests.** This is a genuinely non-trivial engineering artifact. Grounded retrieval with provenance guarantees is a live problem in the industry, not a solved one.
- **An admin moderation console, push retry leases, and entitlement verification.** Production-grade infrastructure, not prototype scaffolding.
- **A demonstrable position on a hard problem** — separating scripture from commentary from folklore, and handling tradition-sensitive disagreement without flattening it. That is a defensible design stance and an unusually good thing to be able to talk through.

The stated reason for having a portfolio project is to demonstrate capability. This demonstrates more than most. **That is an outcome, not a consolation prize** — and it should be banked deliberately, in a form someone else can see, before any decision is made about the product itself.

---

# THE ONE QUESTION

> **Will one hundred strangers — not friends, not family, not anyone who knows you — give you their email address for this, and will five of them pay before it exists?**

Answer it in **three weeks, without touching the codebase.**

One-page site. Single festival guide. Aimed at diaspora Hindu parents. Posted where those people already are. Charge £8 up front for something not yet written; refund anyone if it doesn't ship.

- **Fewer than 100 emails** → this is not a distribution problem to solve later. There is no audience, and no amount of Expo, pgvector or citation validation creates one.
- **Five payments** → more has been learned than in the last twelve months of building, and it will be clear which 5% of Dharma Daily to keep.

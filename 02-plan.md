# Dharma Daily — Remediation Plan

**Written:** 12 August 2026
**Inputs:** `01-review.md` (hostile review), `CURRENT_SUMMARY.md` (project state), verified market data (see Appendix A)
**Constraints given:** 20–35 hrs/week available · self-imposed decide-by date · goal is "a product people actually use and a nice bit of passive income"

---

## 0. VERIFICATION FIRST — the review told you to check two numbers before acting

The review flagged its own fatal-flaw arithmetic as `[UNVERIFIED]` and said explicitly: _"Do not let an unverified number end an 18-month project."_ Those numbers have now been checked against primary sources. Full detail in Appendix A.

**Result: the arithmetic survives, and it is worse than the review stated.**

The review used a generous blended 2.5% download-to-paid. The actual published regional medians (RevenueCat, _State of Subscription Apps 2026_, 115,000 apps, $16B revenue, 2025 performance data) are:

| Region          | Download-to-paid (D35) | Year-1 LTV per payer | Trial-to-paid |
| --------------- | ---------------------- | -------------------- | ------------- |
| North America   | **2.8%**               | **$32**              | 34.2%         |
| Western Europe  | ~2.8%                  | **$25**              | 29.7%         |
| **India / SEA** | **0.7%**               | **$14**              | **15.2%**     |

Recomputing the review's own table with real regional splits instead of a blended guess:

**Table A — the app as specified (India-primary, 70/30, freemium), 10,000 installs**

|              | Installs | Rate | Payers  | LTV | Revenue    |
| ------------ | -------- | ---- | ------- | --- | ---------- |
| India        | 7,000    | 0.7% | 49      | $14 | $686       |
| Diaspora     | 3,000    | 2.8% | 84      | $32 | $2,688     |
| **Year one** |          |      | **133** |     | **$3,374** |

That is **£220/month**, not the review's £300. The fatal finding stands. Verification made it 29% worse.

**Three things the review did not have, which matter more than the correction:**

1. **The median subscription app makes $72/month one year after launch.** 17.3% of apps launched in the last two years reach $1,000 MRR. 4.6% reach $10,000 MRR. Apps launched from 2025 onward account for **3% of all subscription revenue**; apps launched before 2020 account for 69%. Monthly new-app launches went from ~2,000 in January 2022 to **14,700+ in January 2026**.

2. **AI apps have 36% worse 12-month retention than non-AI apps.** This is a direct, published finding on the exact product category you are in. The AI companion is not a retention asset; it is a retention liability. Annual-subscription year-one cancellation across all apps is now **~72%**, worsened from ~56% the prior year.

3. **Sri Mandir's subscription revenue is confirmed at approximately zero.** They _do_ ship subscription IAPs (₹99/mo, ₹299/yr ≈ £2.70). Sensor Tower showed **under $100,000 in cumulative in-app purchases since 2020** across 40M downloads. Their actual FY25 revenue was ₹69.6 Cr (~$8.1M) from a 20–25% take rate on temple offerings, against a ₹45.3 Cr loss and ₹51.9 Cr of advertising spend. The review's inference was correct and is now a documented fact rather than a reading of product decisions.

**And one thing that points the other way, which is the most important number in this document:**

> **Sri Mandir's diaspora ARPU is ₹7,000 (~$81). Its domestic Indian ARPU is ₹600–800 (~$7–9). That is roughly 10×.** Diaspora is ~20% of their users and ~20–25% of their revenue, growing 15% QoQ. _(TechCrunch, June 2025 — company-sourced.)_

The diaspora is not a secondary market with slightly better economics. It is a different market with an order-of-magnitude different value per user — and it pays **transactionally**, for a service performed, not for a content subscription.

---

## 1. THE DECISION

# PIVOT

Not FIX. Not KILL. Here is the justification against each, because the choice is not close once the numbers are in.

### Why not FIX

FIX means the core is sound and the flaws are addressable. The fatal flaw is not a flaw _in_ the specification — it _is_ the specification. The spec pairs:

- the lowest-converting major market on earth (India/SEA, 0.7%, $14 LTV, 15.2% trial-to-paid) with
- a content subscription, in a category where the local leader has 40M downloads and made under $100k from IAP in six years, while
- leading with an AI chat feature that carries a documented 36% retention penalty, and
- an invisible differentiator the buyer cannot audit, behind
- nineteen screens, with
- no distribution mechanism of any kind.

Collapsing onboarding to three questions and hardening the paywall — the review's "Fixable" list — moves Table A from £220/month to maybe £600/month at an install count you have no way to reach. The nine "Serious" findings are not nine independent bugs; seven of them are consequences of the same two decisions (India-primary, app-first-subscription). You cannot fix a specification by patching its symptoms.

**If you choose FIX, you are choosing to spend the next 6 months producing the pre-mortem in Section 2 of the review, on schedule.**

### Why not KILL

KILL would be correct if there were no reachable buyer and no channel. Verification found both, and they are more concrete than the review's counter-argument assumed:

- **A verified paying buyer.** Chinmaya Mission San Jose runs Bala Vihar for **2,150+ students** and charges **$175 per 60-minute class plus a $350/year family membership, with textbooks bought separately.** Multiply that out: diaspora Hindu families are already paying several hundred dollars a year, in cash, for someone to teach their children exactly this material. There are ~45 Chinmaya centres in North America, 1,000+ US temples running Bal Vihar Sunday schools, 26 BAPS centres and 32 Gujarati schools in the UK.
- **A verified content vacuum.** The market-leading Hindu kids' digital product — Amar Chitra Katha's app — has **100K installs and a 3.1-star rating** while charging $279.99 for all-access. The Bal Vihar curriculum is print-only, $4–21 per book, centrally authored in India and explicitly "locally adaptable," meaning volunteer teachers do the localisation by hand. Festival material is a single $10 workbook.
- **A verified free channel with no incumbent.** The query "when is Diwali 2026" is currently won by Farmers' Almanac, timeanddate.com, an eSIM company, and the Royal Observatory Greenwich. **There is not one Hindu-owned result.** The only Hindu-owned property found ranking #1 for a core parenting query is a Substack with "thousands of subscribers."
- **Verified willingness to pay at the target price.** A $3.25 Diwali printable on Etsy has 2,400 sales. Kulture Khazana sells a **$52.99 Diwali Puja Kit for Kids** through Target and Nordstrom.

You do not KILL a project when a market is paying hundreds of dollars a year for a 3.1-star product and the top of the funnel is unoccupied.

### What PIVOT means precisely

**What changes:**

| From                                     | To                                                                                     |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| India-primary, India + diaspora          | **UK/US/Canada diaspora only**                                                         |
| Native app (Expo, App Store, Play Store) | **Web. Static, fast, indexable, no install**                                           |
| Recurring subscription                   | **One-off paid guides, £8–£25, seasonal**                                              |
| Daily habit product                      | **Festival-triggered, 3–5 events a year**                                              |
| Adult self-directed learner reconnecting | **Parent answering a child, aged roughly 4–12**                                        |
| AI chat as the headline feature          | **AI as your private writing and fact-checking tool. The user never sees a chat box.** |
| Correctness as the differentiator        | **"You can hand this to your kid" as the differentiator**                              |

**What survives, and it is more than 5%:**

- The citation-validated RAG pipeline, retrieval filtering, and source invariants — repurposed as the _authoring_ tool that lets one person write tradition-sensitive content faster and more safely than anyone else in this niche. This is now a production advantage rather than a product feature. It is the reason you can ship a festival guide in a week that a competitor needs a month for.
- **The 21 festival explainers, 50 concept introductions, 30 reflections and 20 practice guides that already exist.** This is the single most under-valued asset in `CURRENT_SUMMARY.md`. The pivot's first product is not written from scratch — it is a rewrite of material you already own, for a different reader.
- The rights review, source inventory, and provenance discipline. Still needed, and now needed for a much smaller corpus.
- The editorial stance on separating scripture from commentary from folklore — which becomes _marketable_ to this buyer in a way it never was to the original one. A parent who is worried about getting it wrong in front of their child can perceive "we tell you which bits are scripture and which are story." Priya-the-disconnected-adult could not perceive it. **This is the same differentiator, sold to the one audience capable of valuing it.**
- All of the engineering, as portfolio, per review Section 9. Bank it (Phase 0).

**The arithmetic that makes this the decision rather than an opinion:**

| Route                                  | To clear the app-as-specified ($3,374/yr) | To clear £2,000/month                   |
| -------------------------------------- | ----------------------------------------- | --------------------------------------- |
| App as specified                       | 10,000 installs                           | **~90,000 installs**, no channel exists |
| **£8 guide** (net ~£7.55 after Stripe) | **~350 sales**                            | ~3,200 sales/yr across 2–3 festivals    |

Three hundred and fifty sales beats eighteen months of the current specification. That is a number one person with no budget can plausibly reach. Ninety thousand installs is not.

---

## 2. THE RISKIEST ASSUMPTION

### Every assumption, ranked by (damage if wrong × current uncertainty)

| #   | Assumption                                                                                 | Damage if wrong                           | Uncertainty                                   | Rank  |
| --- | ------------------------------------------------------------------------------------------ | ----------------------------------------- | --------------------------------------------- | ----- |
| 1   | **You can reach diaspora Hindu parents at all, for free, without a budget or an audience** | Total — nothing else matters              | Total — never attempted                       | **1** |
| 2   | They will pay money for a digital guide, not just download a free one                      | Total — no business                       | High                                          | **2** |
| 3   | The festival calendar produces repeat purchase rather than one novelty sale                | Severe — it becomes a one-off, not income | High                                          | 3     |
| 4   | You will actually stop building and do distribution work                                   | Total — this is the 18-month pattern      | **High, and it is about you, not the market** | 3=    |
| 5   | SEO can be won on these queries by a new domain                                            | Severe — no scale channel                 | Medium                                        | 5     |
| 6   | A guide can be written to a quality that survives community scrutiny                       | Severe — reputational                     | Low-Medium                                    | 6     |
| 7   | The existing RAG/content assets meaningfully speed up authoring                            | Moderate — slower, not fatal              | Low                                           | 7     |
| 8   | Bal Vihar coordinators are reachable and receptive                                         | Moderate — one channel of several         | Medium                                        | 8     |
| 9   | Theological backlash is manageable                                                         | Low probability, high severity            | Medium                                        | 9     |
| 10  | Any feature question whatsoever                                                            | Negligible right now                      | —                                             | —     |

**Assumptions 1 and 2 are the same test.** Assumption 4 is the one nobody writes down and it is the one that killed the last 18 months.

### The test

The review's One Question, made concrete and given a date:

> **Will 100 strangers give you an email address, and will 5 of them pay £8 before the thing exists?**

**Design — and it does not touch the codebase:**

- One domain. One static site. Astro or hand-written HTML on Cloudflare Pages or Netlify. **Not Expo. Not React Native. Not the monorepo.** If you find yourself in `apps/`, you have failed the test before running it.
- **Three free pages**, published in this order:
  1. _"When is Diwali 2026? UK and US dates, and how to explain it to your kids"_ — the query with zero Hindu-owned competition
  2. _"Why does Ganesha have an elephant head?"_ — the exact question the review identified as the painkiller, and a query currently won by two SEO blogs and Britannica Kids
  3. _"Ganesh Chaturthi 2026: what to do at home with young children"_ — dated 14 September, 33 days out, so it is live before the event
- **Email capture on every page**, one field, one line: _"The Diwali Family Guide — everything you need to explain Diwali to your children, and do it properly at home. Out 25 October."_
- **A pre-order page.** £8. Stripe Payment Link or Gumroad — 20 minutes of setup, no backend. Explicit promise: delivered by 25 October 2026, full refund, no questions, if it does not ship or you do not like it.
- Posted, by hand, in the five named places in Section 5.

**Confirms it:** ≥100 emails from people who are not friends or family, AND ≥5 paid pre-orders.
**Kills it:** <40 emails, or zero payments, after posting in all five places.
**Duration:** 21 days of elapsed time. At 20–35 hrs/week that is 60–105 hours, and the test needs about 45 of them.

**Why this test and not a different one:** it cannot be passed by building. There is no version of it where writing more code improves the result. That property is the point.

---

## 3. WHAT TO CUT

Marked against `CURRENT_SUMMARY.md`. Be prepared for how much of this is CUT — that is the finding, not a failure of the work.

### CORE — the pivot is meaningless without these

| Item                                                                                 | Why                                                                         |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Static web pages, festival-dated, indexable                                          | This _is_ the product now                                                   |
| Email list                                                                           | The only asset that compounds and that you own                              |
| Stripe/Gumroad one-off payment                                                       | The test                                                                    |
| The 21 festival explainers + 50 concept intros (rewritten for a child-facing parent) | Your raw material, already written                                          |
| Citation validation + source provenance — **as an internal authoring tool**          | Your unfair speed advantage                                                 |
| Rights review, narrowed to only what the guides cite                                 | Legal necessity, now 5% of the previous scope                               |
| **Devanagari + IAST + plain-English pronunciation**                                  | Promoted, not cut — see §3A. The one differentiator this buyer can perceive |

### LATER — real, but not until the checkpoint passes

- User-facing AI chat (**only** after an audience exists; note the 36% AI retention penalty before reviving it)
- A subscription of any kind (**only** after repeat purchase across two festivals is proven)
- The native app (**only** if web demand is proven and users ask for offline)
- Hindi and other localisation — **and if it ever returns, it probably should not be Hindi. See §3A.3**
- Accounts, login, personalisation
- The full rights-cleared canonical corpus (narrowed to a 10–40 passage citations list — §3A.2)
- India as a market
- Bal Vihar teacher materials (higher leverage, harder sale — Phase 3 at the earliest)

### CUT — stop now, do not maintain, do not finish

- **The five-tab information architecture** (Today / Ask / Learn / Practice / You)
- **The 13-question onboarding funnel** and the four-screen value carousel
- **The seven-day starter journey** — unwritten, and the review is right that content is underestimated 3×
- **RevenueCat**: products, entitlements, offerings, webhooks, trial, refund and transfer verification
- **Push notifications**, scheduling, delivery receipts, retry leases, fencing, deep links, timezone boundaries
- **The admin moderation console** and operator accounts
- **Streaks, journal, saved items, activity screens**
- **The Calendar tab** (the review is right: commoditised, and a dozen free Panchang apps do it better)
- **Ask Dharma as a user-facing feature**
- **Native EAS builds, physical-device testing, store submission, store metadata**
- **PostHog, Sentry, hosted admin console**
- **The 35 Bible Chat reference screenshots.** Delete them. Copying the funnel of a company that spent Series A money on ~2,000 Apple Search Ads keywords is the single clearest symptom of the wrong strategy.

### Built to look complete rather than because a user needed it

Name these honestly, because recognising the pattern is worth more than the cut list itself:

- **Push retry leases and fencing protections.** Zero users. Zero notifications sent to a stranger.
- **The admin moderation console.** Zero reported answers, because zero answers.
- **RevenueCat entitlement verification.** Zero payers.
- **The five-tab IA.** Five tabs is what a finished app looks like. It is not what an unvalidated one needs.
- **131 passing tests and CI with secret scanning and release-contract verification** on a product no stranger has opened.

Every one is production-grade infrastructure for a user base of zero. This is what the review means by _"the engineering is the reason the problem went this long unexamined."_ It is genuinely good work. It was aimed at the wrong question.

### What the product looks like with only CORE

**A website with three to six pages and an email box.** No app. No account. No AI chat. No login. One page explaining a festival well enough that a parent can read it to a seven-year-old and answer the follow-up question. A £8 PDF at the end.

That is embarrassing next to 5.26M lines of staged code. **It is also the first version that could have a customer.** The review's standard — _"if that version is embarrassing but usable, it is correct"_ — is met.

---

## 3A. LANGUAGE, SCRIPT AND TRANSLATION — what survives the pivot

Four things get bundled together under "languages" in `CURRENT_SUMMARY.md` and they have **four different fates**. Bundling them is part of what made the original scope unmanageable.

### 1 · Transliteration and Devanagari — CORE, and _more_ important than before

This is the one that gets promoted, not cut.

A Diwali or Ganesh Chaturthi family guide contains names, mantras, and prayer lines that a parent will **say out loud, in front of their child, and probably in front of their mother-in-law**. Whether that parent can pronounce _Lakṣmī_, _Gaṇeśa_, _Śrī_, or a Diwali aarti line without embarrassment is the entire emotional core of the product.

So each quoted line needs three registers, and this is a format decision to make once and apply everywhere:

| Register                        | Example        | Purpose                                                                |
| ------------------------------- | -------------- | ---------------------------------------------------------------------- |
| Devanagari                      | लक्ष्मी        | Authenticity; grandparents can read it; the child sees the real script |
| IAST                            | Lakṣmī         | Scholarly precision; correct in citations                              |
| **Plain-English pronunciation** | **LUCK-shmee** | **The one the buyer actually uses**                                    |

**The third row is the product.** It does not exist in `CURRENT_SUMMARY.md` and it is missing from essentially every competitor found in research — Chinmaya's print workbooks, Amar Chitra Katha, the Twinkl RE resources. IAST is for scholars; a second-generation parent in Harrow cannot read a macron and a subscript dot under pressure.

This also strengthens the **Serious 3** fix. The review's complaint was that the differentiator is invisible to the buyer — Priya cannot audit whether Gita 2.47 was cited correctly. But she _can_ immediately tell whether she was able to say the words properly in front of her kid. **Pronunciation is a differentiator the buyer can perceive within thirty seconds.** Citation provenance never was.

Practical note: the pivot makes this _easier_, not harder. Devanagari rendering on the web is one `@font-face` line (Noto Sans Devanagari) versus the font-loading, glyph-fallback and dynamic-type work it needed in React Native.

**Effort:** ~1 day to fix the three-register format and a house style for the pronunciation column. Then it is just discipline.

### 2 · Translations of source texts — RETAINED, narrowed by roughly 95%

Not cut, but rescoped from a corpus project to a citations list.

- **Was:** a rights-cleared multi-text corpus — Gita, Upanishads, Ramayana, Mahabharata, Yoga Sutras — with translator, edition, storage, excerpt, embedding, commercial-use and attribution decisions for each. The review is right that this depends on translators, publishers and estates who owe you nothing, and it is the item most likely to stall indefinitely.
- **Now:** only what the guides actually quote. A Diwali guide realistically cites **10–40 passages**. Restrict yourself to **public-domain or explicitly open-licensed translations only** — you already have `docs/open_licensed_hindu_text_source_map.md` and `docs/content_source_review.md`, which is exactly the right input for a 40-passage list and enormous overkill for a full corpus.
- Attribution stays non-negotiable — translator and edition named at every quote. That discipline is already built and costs nothing to keep.

**The rights review stops being a blocker and becomes a checklist.** That change alone probably removes two to four months of the review's "4–8 months to shippable" estimate.

### 3 · Hindi localisation — CUT, and more firmly than the original plan cut it

`CURRENT_SUMMARY.md` has Hindi as "the first major post-launch localization." Under the pivot that is wrong twice over:

1. **The buyer is English-first by definition.** The whole reason a second-generation parent cannot answer their child's question is that the tradition did not reach them in an Indian language. A Hindi edition serves the person who does not need the product.
2. **Hindi isn't even the right second language for this audience.** UK diaspora Hindus are heavily **Gujarati** — note that the community research found a _Consortium of Gujarati Schools_ with 32 UK schools and no Hindi equivalent of comparable scale. US diaspora skews **Telugu, Tamil and Gujarati**. Picking Hindi is an India-market instinct applied to a diaspora audience.

If a second language ever becomes relevant it should be chosen from what buyers actually ask for, and Gujarati is the more likely answer in the UK. Not before 2028.

### 4 · The AI generating translations — **hard NO, permanently**

If the question is whether the agent/LLM should produce the translated or transliterated scripture itself: **no, and this is the one place in the plan with no "later."**

This is the precise scenario in review Section 8: _"an AI-generated line carrying the visual authority of scripture invites organised backlash faster than one person can respond."_ A hallucinated verse, a mangled sandhi, or a wrong macron in something a parent reads aloud at a family puja is the reputational failure mode, and unlike the app you would no longer have a moderation console or a reporting flow — because you correctly cut them.

Draw the line explicitly and put it in the guides:

| The AI may                                                         | The AI may never                                         |
| ------------------------------------------------------------------ | -------------------------------------------------------- |
| Draft the English explanatory prose around a quote                 | Generate, translate, or "improve" the quoted text itself |
| Draft the plain-English pronunciation guide _(then human-checked)_ | Produce Devanagari or IAST that goes out unverified      |
| Fact-check dates, regional variation, and tradition differences    | Be the final authority on any of them                    |
| Flag where you have blurred scripture, commentary and folklore     | Decide which is which                                    |
| Speed up the source-provenance checking you already built          | Substitute for a named human translator                  |

**Every Sanskrit or Devanagari character that ships is copy-pasted from a named, attributed, human translation — never generated.** This costs you almost nothing (it is a copy-paste discipline, not extra work) and removes the single highest-severity risk in the review.

It also happens to be the honest version of what you have been building for eighteen months. The citation-validated RAG pipeline exists precisely to stop the model inventing sources. **The pivot doesn't abandon that principle — it applies it to your own authoring, where the stakes are the same and the cost is one person's discipline instead of a runtime moderation queue.**

---

## 4. THE FIX LIST

Fatal and Serious flaws, in the review's order. "Before/after" is relative to the Phase 1 test.

### FATAL — the revenue model cannot reach sustainability as specified

- **The change:** abandon the subscription and the app. Sell a one-off £8 festival guide to diaspora parents on the web. Target ~330 sales/year to beat the entire app-as-specified; ~500 sales × 2 festivals ≈ £8,000/year as the realistic year-2 shape.
- **How you know it worked:** ≥5 pre-orders in 21 days; ≥40 paid by 10 November; ≥30% of Diwali buyers buy a second guide at the next festival.
- **Effort:** 0 days to decide. Embedded in Phase 1.
- **Timing:** **Before.** It is the test.

### SERIOUS 1 — No distribution mechanism exists and none is planned

- **The change:** Section 5. Five named channels, contacted by hand, before any content beyond the three test pages.
- **How you know:** ≥100 email addresses from strangers by day 24. Tracked per channel with a UTM parameter so you know which one worked.
- **Effort:** 4 days (ongoing, not a task that completes).
- **Timing:** **Before.** This is the test.

### SERIOUS 2 — Episodic need, daily product

- **The change:** stop selling a daily habit. Sell against the calendar, which supplies the trigger for free. **Ganesh Chaturthi 14 Sep 2026 · Navratri 11–20 Oct · Diwali 8 Nov · Holi 22 Mar 2027.** Hallow's Ash Wednesday 2026 produced **263,000 downloads in one day against a ~10,000/day baseline — 25×**. That engine is real, and Hinduism has more festivals than Lent.
- **How you know:** traffic and sales spike in the 7 days before a festival and decay after. If Navratri produces no measurable lift over the prior fortnight, the seasonal thesis is wrong.
- **Effort:** 0 days. It is a decision about what you sell, not a build.
- **Timing:** **Before.**
- **Caveat, stated because it matters:** Hallow's Lent spike was bought — Branch's case study shows Feb 2024's 2M installs came alongside a **15× increase in paid media spend** plus 2,500 parish QR partnerships. The festival supplies the _demand_; it does not supply the _reach_. Your equivalent of the parish network is the Bal Vihar network, and it is unproven.

### SERIOUS 3 — The differentiator is unverifiable by the buyer

- **The change:** change the buyer, not the differentiator. Stop selling "verified citations." Sell "_you can read this to your child without worrying you have got it wrong, and where scholars disagree we tell you so._" A parent who is afraid of misinforming their kid _can_ perceive editorial care. An adult browsing a chat app cannot.
- **How you know:** the phrase appears unprompted in buyer replies and refund-rate stays <10%.
- **Effort:** 1 day of copywriting.
- **Timing:** **Before.**

### SERIOUS 4 — Nineteen screens to first value

- **The change:** zero screens. A web page. Value delivered in the first paragraph, before any email ask.
- **How you know:** bounce rate <70%, time-on-page >90 seconds, email capture >10% of unique visitors.
- **Effort:** included in Phase 1.
- **Timing:** **Before.**

### SERIOUS 5 — Every layer is free elsewhere

- **The change:** accept it and stop competing there. The free layer _is_ your marketing — that is what the three free pages are. The paid thing is a curated, printable, hand-holding artifact for a specific occasion, which is not free anywhere. The comparable is Kulture Khazana's **$52.99** Diwali kit and Chinmaya's $10 _Festivals of India Workbook_, not ChatGPT.
- **How you know:** people who read a free page buy the paid guide. Free-to-paid ≥2%.
- **Effort:** 0 days.
- **Timing:** **Before.**

### SERIOUS 6 — The free tier is the whole product

- **The change:** dissolved. Free = explanatory web pages (SEO assets). Paid = the do-it-at-home guide with the printables, the shopping list, the timings, the child-facing scripts. Different artifact, not more of the same.
- **How you know:** ≥2% free-to-paid.
- **Effort:** 0 days.
- **Timing:** **Before.**

### SERIOUS 7 — Inference economics oppose content quality

- **The change:** dissolved entirely. No user-facing inference means no per-user inference cost. You run the expensive model on your own laptop while writing, once, and sell the output a thousand times. **The bind the review identified only exists when inference is a runtime feature.** Move it to authoring and it disappears.
- **How you know:** monthly AI spend is a fixed authoring cost under £40, uncorrelated with user count.
- **Effort:** 0 days.
- **Timing:** **Before.**

### SERIOUS 8 — Editorial and moderation load exceeds one person

- **The change:** no user-generated content, no live AI answers, therefore no moderation queue. Editorial load drops to 3–5 guides a year, written on your own schedule against known dates. Recruit **one** paid reviewer per guide (£100–200) rather than a standing multi-tradition board.
- **How you know:** each guide ships with one named reviewer credited, and takes <10 days of your time.
- **Effort:** 2 days per guide to find and brief a reviewer.
- **Timing:** **After** the checkpoint. Do not recruit reviewers for a product nobody has bought.

### SERIOUS 9 — App-first forfeits search

- **The change:** web-only. Note the structural point: `when is Diwali 2026` currently returns Farmers' Almanac, timeanddate.com, an eSIM company and the Royal Observatory. **Zero Hindu-owned results.** Nobody is defending this ground.
- **How you know:** ≥1 page in Google's top 10 for a named query by 10 November; ≥1 top-3 by Diwali 2027.
- **Effort:** ongoing.
- **Timing:** **Before** (publish), results **after**.

### Not fixable, and named as such

Nothing on the Serious list resisted a concrete change — but only **because the decision was PIVOT**. Under FIX, items 1, 2, 5, 7 and 9 have no concrete fix at all; the honest answer for each would be "spend money you do not have." That is the strongest confirmation available that Step 1 chose correctly.

---

## 5. THE DISTRIBUTION PLAN

The review is right that this section carries equal weight. It is also the section that was empty. Here it is with named targets.

### The three (five) specific places these people already are

**1 · The Bal Vihar / weekend-school network — the highest-value channel, and the one nobody is serving**

- **Named targets:** Chinmaya Mission — 45 North American centres (37 US across ~23 states, 7 Canada, 4 of them Ontario), 3 UK locations (North London, South London, Gloucester). Chinmaya Mission San Jose alone: 2,150+ students across 7 Bay Area locations. BAPS UK: 26 mandirs and centres running age-segmented Bal-Balika programmes. Consortium of Gujarati Schools UK: 32 schools. Samskrita Bharati USA: 1,500+ weekly participants in an 8-year K–7 curriculum. Hindu Parents Network (Iselin, NJ): claims 10,000+ parents reached, 500+ children enrolled.
- **What earns attention without being spam:** not a pitch. A **free, printable, genuinely useful Ganesh Chaturthi activity sheet**, emailed to the coordinator with "I made this for my own use, it is free, use it with your class if it is helpful, no strings." Volunteer teachers are hand-localising an India-authored print curriculum with no digital layer and no festival material beyond one $10 workbook. You are offering to reduce their workload, not to sell to their families.
- **Realistic response rate:** 20 emails → 3–6 replies → 1–2 who actually distribute it. Low volume, but each one reaches 30–200 families with an implicit endorsement, which is the most valuable form of reach available to you. Assume 2–3 weeks to respond; these are volunteers.

**2 · Reddit — r/hinduism (~148,000) and r/ABCDesis (~80,700)**

- r/ABCDesis is the better fit: it self-describes as being for "members of the South Asian diaspora who were raised outside of South Asia" — that is your buyer's exact self-identification. r/hinduism is larger but skews devotional and India-resident.
- **What earns attention:** answer other people's questions properly, for two weeks, before you ever post a link. Then post the _content itself_ — the full "why does Ganesha have an elephant head, explained for a 7-year-old" text as a Reddit post, with the link at the bottom or absent entirely. The review is right that religious communities are hostile to commercial self-promotion from unknown solo actors with AI products touching scripture. **Do not mention AI. Anywhere. Ever.** It is an authoring tool; it is not part of the pitch.
- **Realistic response rate:** a good post gets 40–150 upvotes and 10–40 clicks. Two or three posts over three weeks. Expect one to be removed.
- **Must do before posting:** read each subreddit's self-promotion rules yourself. They could not be verified in research (Reddit is unreachable from the research environment) and **moderator rules override sitewide policy**. Getting this wrong costs you the channel permanently.

**3 · Hindu Parenting (Substack + podcast)**

- Ranks **#1 on Google for "Hindu festivals for kids explained"** — the exact commercial query. Self-describes as "thousands of subscribers." Podcast has 51+ episodes. Runs a courses section.
- **What earns attention:** offer a genuinely good guest piece, or ask to come on the podcast. You have something they do not: 18 months of source-provenance work and a defensible position on separating scripture from folklore. That is a real editorial contribution, not a favour request.
- **Realistic response rate:** one email, maybe 40% reply. If it lands, it is worth more than everything else combined — this is a pre-qualified audience of exactly your buyer.

**4 · Facebook parent groups** — _Indian Mums in UK_, _RTP Desi Moms_, and equivalents. Member counts and rules could not be verified in research (Facebook blocks automated access) — **you must check these manually in week 1.** Highest-volume channel if the rules permit, worthless if they do not. Treat as unvalidated.

**5 · Google search — the only channel that compounds, and the only one that scales**

Not a launch channel (a new domain will not rank in 21 days), but the reason the whole pivot is web-first. The SERPs for these queries are held by: generic almanac sites with no depth, Indian e-commerce blogs funnelling to jewellery and fashion, India-based parenting portals written for parents _in_ India, and Twinkl/TES, which own UK KS1/KS2 Hinduism but write for **non-Hindu teachers delivering RE lessons**. Nobody writes for the diaspora Hindu parent. That is the gap and it is unusually wide.

### The organic loop — honest answer

**The review's flagged contradiction resolves in favour of Section 8, but only partly.**

A genuinely good child-facing answer to "why does Ganesha have an elephant head" _does_ get forwarded into family WhatsApp groups. That is a real loop and the private journal was not. But be precise about how weak it is: WhatsApp is dark social — no referrer, no attribution, unmeasurable, and empirically low k-factor. It will not compound you to 1,000 users.

**The real loop is not viral, it is two mechanisms that compound annually:**

1. **SEO compounding.** A Diwali page published in 2026 earns links and age, and ranks better for Diwali 2027, and better again for 2028. Every festival page is a permanent asset. This is the _only_ mechanism here with a genuine growth curve.
2. **The calendar as free re-engagement.** You do not have to manufacture a reason to email your list. Navratri arrives on its own. Hallow's 25× Ash Wednesday spike is this mechanism, and Hinduism has four or five Ash Wednesdays a year.

**Growth without a viral loop happens by accumulation, not by acceleration.** Say this out loud, because it sets the honest timeline: this business gets meaningfully bigger once a year, in October and November, and you should plan in years rather than months.

### First 100 users — exactly how

Not SEO. A new domain will not rank inside 21 days. The first 100 are manual, and here is the actual arithmetic:

| Channel                            | Volume of work            | Expected visitors | Emails at 15–25% |
| ---------------------------------- | ------------------------- | ----------------- | ---------------- |
| Bal Vihar coordinator emails       | 20 sent                   | 40–120            | 10–30            |
| Reddit (r/ABCDesis, r/hinduism)    | 3 posts over 3 weeks      | 60–200            | 12–45            |
| Facebook groups                    | 4 posts (if rules permit) | 50–200            | 10–45            |
| Hindu Parenting outreach           | 1 email + follow-up       | 0–400             | 0–90             |
| Direct outreach to 2 local temples | 2 conversations           | 20–60             | 5–15             |
| **Total**                          | **~30 discrete actions**  | **170–980**       | **37–225**       |

**The honest read: the range straddles the pass mark.** A weak execution lands at 37 emails and fails. A strong one lands at 200 and passes. That is exactly what a real test should look like — if the arithmetic guaranteed a pass, it would not be testing anything.

### 100 → 1,000 — does the same method scale?

**No, and this is the hardest honest part of the plan.** Manual outreach is capped at a few hundred; there are only ~45 Chinmaya centres and a handful of relevant subreddits, and you can only post so often before you are the person who always posts links.

**What takes over:** SEO, on a 12–18 month lag, and Diwali 2027 (~28 October 2027) is the first event where a domain published in 2026 could rank. Secondary: the Bal Vihar network converting from "coordinator received a PDF" to "coordinator distributes to 200 families every festival," which is a relationship business measured in years.

**What this means for expectations:** 1,000 buyers is a **2028** number, not a 2027 one. If your requirement is meaningful income within 12 months, this plan does not deliver it and you should know that now. Against your stated goal — "a product people actually use and a nice bit of passive income" — it is a fit. Against "replace my income," it is not, and no plan in this document is.

### If there were no viable channel

There is one — the Bal Vihar network, SEO, and Hindu Parenting are three real, named, free routes to a buyer with proven cash. Had those come back empty, Step 1 would have had to become KILL. They did not, and that is precisely why it is PIVOT and not KILL.

---

## 6. THE SEQUENCED PLAN

Ordered by risk reduction. At 20–35 hrs/week, planned at **25 hrs/week**, with interruption assumed.

**The deadline is not self-imposed. The calendar sets it.**

> Ganesh Chaturthi **14 Sep 2026** (33 days) · Navratri **11–20 Oct** (60 days) · **Diwali 8 Nov 2026 (88 days)** · Holi 22 Mar 2027 · next Diwali **~28 Oct 2027**

Diwali is the single largest annual demand event in this category, it is **88 days away**, and if you miss it the next one is **just under twelve months away**. This is the entire reason not to spend the autumn rebuilding onboarding. Use the deadline the world already gave you.

---

### PHASE 0 — Preserve · Days 1–2 · ~6 hrs

**Objective:** stop being one disk failure away from losing 18 months of work.

**Deliverables:**

- Recovery branch `preserve/2026-08-12-full-state`, everything committed as-is, pushed to origin. Do not split into tidy commits. Do not review it. One commit, message "preservation checkpoint," push.
- The ~331 MiB of raw staged sources and the ~1.14 GiB `content/_staging` tree moved out of Git history to external storage (or LFS). Do not push a gigabyte of unreviewed third-party religious texts to a public remote.
- Delete the 35 Bible Chat reference screenshots.
- A short `PORTFOLIO.md` at repo root: what the RAG pipeline does, the citation-validation approach, the scripture/commentary/folklore separation, the 131 tests. Per review Section 9 — bank it now, while you still remember the details, and while it is an outcome rather than a consolation.

**What this phase learns:** nothing. It is insurance, and it is the only unconditional item in this document.

**CHECKPOINT — CONTINUE:** `git log origin/preserve/2026-08-12-full-state` returns a commit. **STOP:** none. There is no version of any plan where this is skipped.

---

### PHASE 1 — The demand test · Days 3–25 · ~75 hrs

**Objective:** find out whether 100 strangers will give you an email and 5 will pay £8, without writing application code.

**Deliverables:**

1. Domain registered. Static site live (Astro / plain HTML on Cloudflare Pages). **Zero lines of Expo, React Native, Supabase or RAG runtime code.**
2. Three free pages published — Diwali dates, Ganesha's elephant head, Ganesh Chaturthi at home with young children. Each 800–1,500 words, written for a parent to read _to_ a child, each stating clearly which parts are scripture (Puranic), which are regional practice, and which are story.
3. Email capture on every page, UTM-tagged per channel.
4. Stripe/Gumroad pre-order page: **The Diwali Family Guide, £8**, delivered by 25 October, full refund on request.
5. Every outreach action in the Section 5 table, executed.
6. A one-page tracking sheet: visitors, emails, sales, by channel, by day.

**What this phase learns:** whether a channel to this buyer exists that you can operate for free. Nothing else.

**CHECKPOINT — Day 25 (5 September 2026):**

- **GO** → ≥100 emails from strangers **AND** ≥5 paid pre-orders. Proceed to Phase 2.
- **EXTEND (one time only)** → 40–99 emails **and** 1–4 payments. You have a signal but not a channel. Take 14 more days, use Ganesh Chaturthi (14 Sep) traffic, re-check on **19 September**. One extension. Not two.
- **STOP** → <40 emails, **or** zero payments after every Section 5 action is genuinely complete. This is the review's finding, confirmed: there is no audience reachable by you, and no amount of Expo, pgvector or citation validation creates one. Stop. Publish `PORTFOLIO.md`, write up what you learned, and use 18 months of demonstrable engineering to get paid for engineering.

> **Guard against the real failure mode.** The likely way this phase fails is not a STOP number. It is day 9, when outreach is uncomfortable and slow, and the site "needs" a nicer design system, and you open the monorepo "just to check something." **If you have written application code during Phase 1, the test did not run, and you may not read its result as a pass.**

---

_Everything below this line is provisional and depends on the Phase 1 checkpoint. Do not plan it in detail. It is here to show the shape, not to be executed._

---

### PHASE 2 (provisional) — Deliver and prove repeat · Days 25–90

**Objective:** ship the guide, discover whether the festival calendar produces repeat purchase or a single novelty sale.

**Shape:** write the Diwali Family Guide (aim ~30 pages, printables included — the RAG pipeline as authoring tool, one paid reviewer at £100–200). Ship by 25 October. Publish Navratri pages during the 11–20 October window, which is the dress rehearsal for Diwali. Sell through Diwali on 8 November. Email the list twice.

**Learns:** whether the seasonal engine works and whether the guide is good enough that people say so.

**CHECKPOINT — 15 November 2026:** **CONTINUE** → ≥40 paid, refund rate <10%, ≥1 page in Google's top 10 for a named query, and ≥5 unprompted positive replies. **STOP** → <15 paid, or refund rate >25%, or Navratri produced no measurable traffic lift over the preceding fortnight. The last one specifically kills the seasonal thesis, which is the load-bearing assumption of the whole pivot.

### PHASE 3 (provisional) — Second festival, second purchase · Dec 2026 – Mar 2027

Holi on 22 March 2027 is the repeat-purchase test. **CONTINUE** → ≥30% of Diwali buyers buy again. **STOP** → <10% repeat. Without repeat there is no income, only a one-off, and you should reconsider from Step 1.

### PHASE 4+ (provisional) — Compound into Diwali 2027

SEO build-out, Bal Vihar distribution relationships, possibly teacher materials. Diwali 2027 (~28 Oct) is the real judgement year. Nothing here is planned; do not plan it now.

---

## 7. THE 30-DAY VIEW

25 hrs/week. Interruption assumed. This deliberately fits about 70% of what looks achievable, because plans like this routinely assume double.

### Week 1 (12–18 Aug) — Preserve, then set up. ~25 hrs

- Preservation branch committed and pushed; big binaries out of Git; screenshots deleted _(6h)_
- `PORTFOLIO.md` written _(3h)_
- Domain bought, static site skeleton deployed, email capture wired and tested end-to-end _(6h)_
- Stripe/Gumroad pre-order page live and tested with a real £8 payment from your own card, then refunded _(2h)_
- **Read the actual self-promotion rules** for r/hinduism, r/ABCDesis and every Facebook group you intend to use. Write them down _(3h)_
- Build the outreach list: 20 named Bal Vihar coordinators with real email addresses _(5h)_

**End of week 1: nothing is published and no application code has been written. That is correct.**

### Week 2 (19–25 Aug) — Write and publish. ~25 hrs

- Page 1: _"When is Diwali 2026?"_ — dates, UK/US split, and how to explain it to children _(7h)_
- Page 2: _"Why does Ganesha have an elephant head?"_ _(7h)_
- Both live, meta descriptions written, submitted to Google Search Console _(2h)_
- Pre-order page copy finalised — the promise, the date, the refund terms _(3h)_
- First 10 Bal Vihar emails sent _(3h)_
- Email Hindu Parenting _(1h)_
- Begin participating on Reddit. Answer questions. **Post nothing of your own** _(2h)_

### Week 3 (26 Aug – 1 Sep) — Distribute. ~25 hrs

- Page 3: _"Ganesh Chaturthi 2026 at home with young children"_, live before 14 September _(8h)_
- Second 10 Bal Vihar emails; follow up on week 2's non-replies _(4h)_
- First Reddit post — the content itself, not a link _(2h)_
- Facebook group posts where rules permit _(3h)_
- Two local temple conversations _(3h)_
- Daily: check the tracking sheet. Do not touch the codebase _(5h buffer — you will need it)_

### Week 4 (2–8 Sep) — Push and read the result. ~25 hrs

- Second Reddit post, different subreddit, different angle _(2h)_
- Chase every non-reply once. Once only _(3h)_
- Anything the tracking sheet says is working, do more of _(8h)_
- **5 September: run the Phase 1 checkpoint honestly.** Write the number down before you interpret it _(2h)_
- If GO: start the Diwali guide outline _(10h)_
- If STOP: write the post-mortem, publish `PORTFOLIO.md`, close it out _(10h)_

### What you will know on 8 September that you do not know today

Not "the app will be more built." Specifically:

1. **Whether any free channel to diaspora Hindu parents exists that you can personally operate** — with a number attached, and attributed to a named channel, so you know which one.
2. **Whether anyone will pay you money for this** before it exists. Five payments from strangers is worth more than every retention benchmark in Appendix A.
3. **Whether Bal Vihar coordinators reply**, which determines whether the highest-leverage channel is real or theoretical.
4. **Whether you can stop building** — the assumption ranked #3= that nobody writes down, tested against 30 days of evidence.
5. **What a page written for a parent-to-read-to-a-child actually sounds like**, which no amount of specification produces.

And you will know it **61 days before Diwali**, with enough time to act on it.

---

## THE SINGLE BIGGEST RISK REMAINING

Not the market. Not the channel. Not the theology.

> **That you will do Phase 0, feel the relief of the work being safe, and then find a reason to open `apps/` — and that the reason will be a good one.**

The evidence for this risk is the strongest evidence in this document: **eighteen months, 5.26 million staged lines, 131 passing tests, an admin moderation console, push retry leases, entitlement verification — and not one stranger has ever opened it.** That is not an accident of prioritisation. It is a revealed preference. Building gives feedback in seconds and is fully under your control; distribution gives feedback in weeks, from people who owe you nothing, and mostly says no.

Every structural problem in this plan has a concrete mitigation. This one has only a commitment, so make it a specific and checkable one:

**Between now and 5 September, you will not open the `apps/` directory. If the plan needs to change, it changes at the checkpoint, in writing, with the number recorded first.**

The second-biggest risk is more ordinary and worth naming too: the pivot's whole shape rests on the seasonal engine, and the honest version of the Hallow comparison is that Hallow's 25× spike was substantially _bought_ — 15× paid media and 2,500 parish partnerships. The festival supplies demand; it does not supply reach. Your parish network is the Bal Vihar network and it is, as of today, entirely unproven. Phase 1 is the first test of it, and Phase 2's Navratri checkpoint is the second.

---

## APPENDIX A — Verified figures

Everything the review marked `[UNVERIFIED]`, checked. Sources are primary where available.

### Conversion, LTV, retention — RevenueCat, _State of Subscription Apps 2026_ (115,000+ apps, $16B revenue, 2025 data)

| Metric                                                     | Value                       |
| ---------------------------------------------------------- | --------------------------- |
| Download-to-paid (D35), freemium / hard paywall            | 2.1% / 10.7%                |
| Download-to-paid, North America / India-SEA                | 2.8% / **0.7%**             |
| Year-1 realised LTV per payer — NA / W. Europe / India-SEA | **$32 / $25 / $14**         |
| Trial-to-paid — NA / W. Europe / India-SEA                 | 34.2% / 29.7% / **15.2%**   |
| Revenue per install D60, hard paywall / freemium           | $3.09 / $0.38               |
| Median monthly revenue, 1 year post-launch                 | **$72**                     |
| Apps reaching $1K / $10K MRR (launched last 2 yrs)         | 17.3% / 4.6%                |
| Share of subscription revenue from apps launched 2025+     | **3%** (pre-2020 apps: 69%) |
| Monthly new app launches, Jan 2022 → Jan 2026              | ~2,000 → **14,700+**        |
| Annual-subscription year-1 cancellation                    | **~72%** (prior year ~56%)  |
| Annual retention, hard paywall vs freemium                 | 27% vs 28% — **no benefit** |
| **AI apps vs non-AI, 12-month retention**                  | **AI 36% worse**            |
| Google Play cancellations from billing errors              | 31% (App Store 14%)         |

_The review's D1/D7/D30 install-retention figures could not be verified — no primary source has published cross-vertical retention benchmarks since ~2023 (Adjust), and vertical splits date to 2022. Education-specific and Religion-specific retention do not exist in any primary dataset. Treat all such figures, including the review's, as unsourced._

### Faith-app market

| Fact                                             | Value                                                                                                                                                | Source                                     |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Hallow funding / valuation                       | $131.15M total; $759.4M post-money (Series C-1, Aug 2025)                                                                                            | Forge Global                               |
| Hallow revenue 2025                              | ~$40M net                                                                                                                                            | Appfigures                                 |
| Hallow installs                                  | ~24M (Jun 2025); ~10,000/day baseline                                                                                                                | Hallow, Appfigures                         |
| **Ash Wednesday 2026 (18 Feb)**                  | **263,000 downloads in one day = 25×**; #1 on US App Store                                                                                           | Appfigures, Aleteia                        |
| Hallow Feb 2024 campaign                         | 2M+ installs; **paid media spend up 15×**; 2,500 parish QR partnerships ≈ 9% of growth                                                               | Branch case study                          |
| **Sri Mandir cumulative IAP since 2020**         | **under $100,000** across 40M downloads                                                                                                              | Sensor Tower via TechCrunch                |
| Sri Mandir FY25                                  | ₹69.6 Cr revenue (~$8.1M), ₹45.3 Cr net loss, ₹51.9 Cr advertising                                                                                   | MCA filings via Inc42                      |
| Sri Mandir model                                 | 20–25% take rate on temple offerings — transactional                                                                                                 | TechCrunch                                 |
| **Sri Mandir diaspora vs domestic ARPU**         | **₹7,000 (~$81) vs ₹600–800 (~$7–9) — ~10×**                                                                                                         | TechCrunch, Jun 2025                       |
| Sri Mandir diaspora share                        | ~20% of revenue, +15% QoQ                                                                                                                            | TechCrunch                                 |
| **Astrotalk FY25**                               | **₹1,176 Cr (~$140M)** — consultation (₹5–50/min) + e-commerce (₹140 Cr store)                                                                       | Entrackr / filings                         |
| Kuku FM FY25                                     | ₹242 Cr, 100% from subscriptions — but ₹285 Cr marketing spend, i.e. ₹1.70 spent per ₹1 earned                                                       | MCA filings via Entrackr                   |
| Bible Chat                                       | $14M Series A; $15M annualised; **95%+ of revenue from US App Store**; acquired via ~2,000 Apple Search Ads keywords + TikTok (one video 60M+ views) | Romania Insider, Appfigures                |
| YouVersion                                       | 1 billion downloads, **free forever by policy**, funded by Life.Church                                                                               | Premier Christianity, Nov 2025             |
| Hindu content subscription succeeding in English | **NOT FOUND** — no published subscriber or revenue figure for any                                                                                    | —                                          |
| Faith-tech VC funding                            | $175.3M (2021 peak) → $140M (2024)                                                                                                                   | PitchBook via Forbes / LA Business Journal |
| Apple Search Ads CPI, US / UK                    | $2.50–$4.00 / $2.00–$2.60                                                                                                                            | AppTweak, Adapty                           |

### The buyer and the gap

| Fact                                    | Value                                                                                                      | Source                                  |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Chinmaya Mission San Jose**           | **2,150+ students; $175 per 60-min class; $350/yr family membership; textbooks separate**                  | cmsj.org                                |
| Chinmaya North America / UK             | 45 centres (37 US, 7 Canada) / 3 UK Bala Vihar locations                                                   | chinmayamissionwest.com, chinmayauk.org |
| BAPS UK / UK Gujarati schools           | 26 centres / 32 schools                                                                                    | BAPS, Consortium of Gujarati Schools    |
| Samskrita Bharati USA                   | 1,500+ weekly participants, 8-year K–7 curriculum                                                          | samskritabharatiusa.org                 |
| Hindu Parents Network (NJ)              | claims 10,000+ parents reached, 500+ children enrolled                                                     | hinduparentsnetwork.org                 |
| US / UK Hindu population                | ~3.6M (Pew) / ~1.03M England & Wales, 187 temples                                                          | Pew, ONS                                |
| **Amar Chitra Katha app**               | **100K installs, 3.1★** — while charging $279.99 all-access                                                | Google Play                             |
| Kulture Khazana                         | **$52.99** Diwali Puja Kit for Kids; sold at Target and Nordstrom                                          | kulturekhazana.com                      |
| Modi Toys                               | $20–55 plush deities, $11 list books                                                                       | moditoys.com                            |
| Chinmaya print curriculum               | $4–21/book; festival content = one $10 workbook; teacher handbooks sold separately                         | chinmayapublications.com                |
| Etsy Diwali printables                  | $1.58–$9.99; a $3.25 printable has **2,400 sales**                                                         | Etsy                                    |
| **"when is Diwali 2026" SERP**          | Farmers' Almanac, timeanddate, an eSIM company, Royal Observatory Greenwich — **zero Hindu-owned results** | live SERP, Aug 2026                     |
| "Hindu festivals for kids explained" #1 | Hindu Parenting Substack ("thousands of subscribers")                                                      | live SERP, Aug 2026                     |
| UK KS1/KS2 Hinduism SERP                | Owned by Twinkl and TES — written for **non-Hindu teachers**, not Hindu parents                            | live SERP                               |

### Festival dates

**2026:** Raksha Bandhan 28 Aug · Janmashtami 4 Sep · **Ganesh Chaturthi 14 Sep** · **Navratri 11–20 Oct** (Dussehra 20 Oct) · **Diwali 8 Nov**
**2027:** Holi 22 Mar · Raksha Bandhan 16–17 Aug · Janmashtami 24–25 Aug (Smarta/ISKCON split) · Ganesh Chaturthi 3–4 Sep · Navratri 30 Sep–9 Oct · **Diwali 28–29 Oct**

_Sources disagree by ±1 day on several 2027 dates (tithi and timezone splits), and Janmashtami is genuinely split between Smarta and ISKCON observance. Any dated content must be timezone- and sampradaya-aware and should say so — which, usefully, is exactly the editorial stance you already hold._

### Unverified, flagged

Subreddit subscriber counts and self-promotion rules (Reddit unreachable from research environment — **check manually before posting**); Facebook group sizes and rules (blocked); Instagram/YouTube follower counts; absolute Google search volumes (Keyword Planner and Ahrefs inaccessible — pull these yourself with UK+US+CA geo filters before committing to specific target keywords).

---

## Sources

[RevenueCat, State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps) · [RevenueCat renewal rates by category](https://www.revenuecat.com/blog/growth/average-subscription-renewal-rates-by-app-category/) · [Appfigures — Hallow Lent surge](https://appfigures.com/resources/insights/hallow-lent-surge-prayer-app-revenue) · [Branch — Hallow 2M installs case study](https://www.branch.io/resources/case-study/how-hallow-drove-2-million-app-installs-and-became-1-on-the-app-store/) · [TechCrunch — Sri Mandir keeps investors hooked](https://techcrunch.com/2025/06/30/sri-mandir-keeps-investors-hooked-as-digital-devotion-grows) · [TechCrunch — Sri Mandir digitising devotion](https://techcrunch.com/2024/09/09/sri-mandir-is-on-a-quest-to-digitize-indias-devotional-journey/) · [Inc42 — AppsForBharat FY25 filings](https://inc42.com/buzz/appsforbharat-fy25-net-loss-widens-16-to-inr-45-cr/) · [Entrackr — Astrotalk e-commerce ₹140 Cr](https://entrackr.com/news/astrotalks-e-commerce-vertical-posts-rs-140-cr-revenue-in-2025-hits-rs-200-cr-arr-11004745) · [Entrackr — Kuku FM FY25](https://entrackr.com/fintrackr/kuku-fm-reports-rs-240-cr-revenue-in-fy25-spends-rs-285-cr-on-marketing-10943137) · [Romania Insider — Bible Chat $14M](https://www.romania-insider.com/bible-chat-investment-round-faith-app-romania-feb-2025) · [Appfigures — Bible Chat](https://appfigures.com/resources/insights/20250418?f=5) · [Premier Christianity — YouVersion on never monetising](https://www.premierchristianity.com/opinion/we-would-make-billions-if-we-monetised-the-bible-app-heres-why-we-never-will/20447.article) · [Forbes — faith app funding](https://www.forbes.com/sites/zacharysmith/2021/12/27/faith-based-apps-attract-1753-million-as-worshipers-desert-churches/) · [LA Business Journal — investors keeping faith](https://labusinessjournal.com/featured/investors-are-keeping-faith/) · [Chinmaya Mission San Jose — Bala Vihar](https://www.cmsj.org/bala-vihar/) · [Chinmaya Mission West centres](https://chinmayamissionwest.com/centers/) · [Chinmaya Mission UK Bala Vihar](https://chinmayauk.org/bala-vihar/) · [Samskrita Bharati USA children's classes](https://samskritabharatiusa.org/sbusa/classes/children/) · [Hindu Parents Network](https://www.hinduparentsnetwork.org/) · [Chinmaya Publications — Bal Vihar workbooks](https://www.chinmayapublications.com/balvihar-workbooks) · [Kulture Khazana](https://kulturekhazana.com/) · [Modi Toys](https://moditoys.com/collections/shop-modi-toys) · [Amar Chitra Katha digital](https://us.amarchitrakatha.com/collections/digital) · [ACK Comics on Google Play](https://play.google.com/store/apps/details?id=com.ns.ack) · [Hindu Parenting Substack](https://hinduparenting.substack.com/) · [Drik Panchang 2026](https://www.drikpanchang.com/calendars/hindu/hinducalendar.html?year=2026) · [Drik Panchang 2027](https://www.drikpanchang.com/calendars/hindu/hinducalendar.html?year=2027) · [AppTweak Apple Ads benchmarks](https://www.apptweak.com/en/aso-blog/apple-ads-benchmarks) · [TechCrunch — India app market](https://techcrunch.com/2026/04/22/indias-app-market-is-booming-but-global-platforms-are-capturing-most-of-the-gains/)

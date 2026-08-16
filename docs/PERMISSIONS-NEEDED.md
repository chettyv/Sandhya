# Permissions ledger — every counterparty you need approval from

One row per counterparty, ordered by urgency. This is the founder-action distillation of
`SOURCES-AND-ATTRIBUTION.md` (the full per-source detail) and the machine state in
`source_inventory_template.csv`. **Nothing here blocks the free launch** — the app ships
free/non-commercial today on PD + CC + personal-use terms with attribution. Every row below
becomes **hard-blocking the day payments are switched on** (`EXPO_PUBLIC_PAYMENTS_ENABLED`).

| #   | Who                                               | Contact route                                                                  | What to ask for                                                                                                         | Unlocks                                                                                                                                     | Status                                                                                                                           |
| --- | ------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **sanskritdocuments.org**                         | Sanskrit@cheerful.com                                                          | Written permission for commercial redistribution of their ITX text files (verse text only, we add our own translations) | **Hanuman Chalisa (already live in the bank)**, Aditya Hridayam, Bhaja Govindam, Shiva Mahimna Stotra, Soundarya Lahari, Lalita Sahasranama | ⚠️ **Most urgent — the Chalisa is shipping.** Fallback: re-source the Chalisa from Hindi Wikisource before payments ever go live |
| 2   | **GRETIL (Univ. of Göttingen)**                   | gretil@sub.uni-goettingen.de (or per-file header contact)                      | Per-file: commercial use of any GRETIL e-text we keep                                                                   | Madhva/Dvaita and Kashmir Shaiva texts in staging                                                                                           | Not urgent — none live; prefer re-sourcing from Wikisource                                                                       |
| 3   | **Gita Press, Gorakhpur**                         | gitapress.org → contact page / postal (Gita Press, Gorakhpur 273005 UP, India) | Permission to quote their _printed editions_ (text and/or Hindi translations) with edition credit                       | A respected Hindi translation layer; their Gita/Ramcharitmanas editions                                                                     | Optional — our own original translations remove the need; ask only if you want their name                                        |
| 4   | **Divine Life Society** (Swami Sivananda's works) | sivanandaonline.org → permissions                                              | Excerpt permission for Sivananda translations/commentary                                                                | Sivananda's Gita and Upanishad commentaries                                                                                                 | Optional; historically permissive for non-commercial, ask in writing for commercial                                              |
| 5   | **Nilgiri Press** (Eknath Easwaran)               | nilgiri.org → rights                                                           | Excerpt licence for Easwaran translations                                                                               | A beloved modern English voice                                                                                                              | Optional and likely paid; PD + originals cover us                                                                                |
| 6   | **Bhaktivedanta Book Trust**                      | bbt.org → rights                                                               | Excerpt licence for Prabhupada's Gita As It Is                                                                          | ISKCON-tradition commentary layer                                                                                                           | Optional; only if a Gaudiya commentary layer is wanted — must be labelled by tradition                                           |

## No permission needed (obligations only — already handled in code/content)

- **Sanskrit/Hindi Wikisource** (CC BY-SA transcriptions of PD texts): attribute "…Wikisource
  contributors" + page URL on every unit (the generator enforces the Source line), share-alike
  applies to the transcription. This is the commercial-safe backbone — Gita, Isha, Kena, Katha,
  Mundaka, Mandukya all come from here.
- **Public-domain translators** (all died before 1955): Arnold (d. 1904), Besant (d. 1933),
  Bhagavan Das (d. 1958 — _verify before commercial use_), Chatterji, Ganguli (d. 1908),
  Griffith (d. 1906), Dutt, Hume (d. 1948), Müller (d. 1900), Paramananda (d. 1940),
  Vivekananda (d. 1902). Name translator + edition + year on every quote.
- **Project Gutenberg**: strip PG boilerplate/trademark, credit PG.
- **Our own original translations, glosses, meanings, reflections** (the bank's en/hi layers and
  every new language we draft): Sandhya originals, no third-party rights. This is the primary
  path for "all languages".

## The one standing internal requirement

Every unit that ships carries a **named human reviewer** in its frontmatter regardless of
licence — currently satisfied under your blanket directive, applied per wave with spot-check
flags in `03-progress.md`.

## Suggested permission email (adapt per row)

> Subject: Permission request — {texts} in the Sandhya app
>
> Namaste — I'm building Sandhya, a small app for daily Hindu learning and practice
> (currently free). I'd like your written permission to include {the verse text / the
> translation} of {texts} from {source}, with attribution to {name/URL} on every screen where
> it appears. The app may later charge a one-off fee for optional guided programmes; I'd like
> permission to cover that use, or to know your terms for it. Happy to share the app and
> exactly how the text is presented. — Vaibhav Chetty, {email}

_Added 12 Aug 2026 (Stream B, on founder instruction). Update rows as clearances arrive; the
commercial re-audit before enabling payments walks this table top to bottom._

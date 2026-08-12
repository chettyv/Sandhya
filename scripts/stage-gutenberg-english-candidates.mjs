import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const inventoryPath = path.join(repoRoot, "docs/source_inventory_template.csv");
const queuePath = path.join(repoRoot, "docs/source_download_queue_2026-06-19.csv");
const outputDir = path.join(repoRoot, "content/_staging/raw/english");
const stagedDate = "2026-07-05";

const candidates = [
  {
    work_id: "hinduism_buddhism_eliot_vol1_en",
    pg_id: "15255",
    text_name: "Hinduism and Buddhism, An Historical Sketch, Vol. 1",
    category: "secondary/history",
    tradition_or_sect: "general",
    region: "pan_asian",
    translator: "Charles Eliot",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1921",
    difficulty: "Medium",
    review_needed: "legal; attribution; historical bias review",
    notes:
      "Secondary historical survey staged for context only; review colonial-era framing before production use.",
  },
  {
    work_id: "hinduism_buddhism_eliot_vol2_en",
    pg_id: "16546",
    text_name: "Hinduism and Buddhism, An Historical Sketch, Vol. 2",
    category: "secondary/history",
    tradition_or_sect: "general",
    region: "pan_asian",
    translator: "Charles Eliot",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1921",
    difficulty: "Medium",
    review_needed: "legal; attribution; historical bias review",
    notes:
      "Secondary historical survey staged for context only; review colonial-era framing before production use.",
  },
  {
    work_id: "hinduism_buddhism_eliot_vol3_en",
    pg_id: "16847",
    text_name: "Hinduism and Buddhism, An Historical Sketch, Vol. 3",
    category: "secondary/history",
    tradition_or_sect: "general",
    region: "pan_asian",
    translator: "Charles Eliot",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1921",
    difficulty: "Medium",
    review_needed: "legal; attribution; historical bias review",
    notes:
      "Secondary historical survey staged for context only; review colonial-era framing before production use.",
  },
  {
    work_id: "history_indian_philosophy_dasgupta_vol1_en",
    pg_id: "12956",
    text_name: "A History of Indian Philosophy, Volume 1",
    category: "secondary/philosophy",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Surendranath Dasgupta",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1922",
    difficulty: "Medium",
    review_needed: "legal; attribution; philosophy review",
    notes:
      "Secondary philosophy reference staged for context and terminology support, not as scripture.",
  },
  {
    work_id: "loves_of_krishna_archer_en",
    pg_id: "11924",
    text_name: "The Loves of Krishna in Indian Painting and Poetry",
    category: "secondary/vaishnava/art_history",
    tradition_or_sect: "vaishnava",
    region: "north_india",
    translator: "W. G. Archer",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1957",
    difficulty: "Medium",
    review_needed: "legal; attribution; art history review; jurisdiction review",
    notes:
      "Krishna art and poetry study staged as context only; confirm jurisdiction and image/text rights before production use.",
  },
  {
    work_id: "lessons_gnani_yoga_atkinson_en",
    pg_id: "13407",
    text_name: "A Series of Lessons in Gnani Yoga",
    category: "secondary/yoga",
    tradition_or_sect: "modern_yoga",
    region: "modern_western",
    translator: "Yogi Ramacharaka / William Walker Atkinson",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1906",
    difficulty: "Medium",
    review_needed: "legal; attribution; yoga review; modern occult framing",
    notes:
      "Modern yoga/New Thought source staged for review-first context only, not as traditional authority.",
  },
  {
    work_id: "lessons_raja_yoga_atkinson_en",
    pg_id: "13656",
    text_name: "A Series of Lessons in Raja Yoga",
    category: "secondary/yoga",
    tradition_or_sect: "modern_yoga",
    region: "modern_western",
    translator: "Yogi Ramacharaka / William Walker Atkinson",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1906",
    difficulty: "Medium",
    review_needed: "legal; attribution; yoga review; modern occult framing",
    notes:
      "Modern yoga/New Thought source staged for review-first context only, not as traditional authority.",
  },
  {
    work_id: "introduction_to_yoga_besant_en",
    pg_id: "4278",
    text_name: "An Introduction to Yoga",
    category: "secondary/yoga",
    tradition_or_sect: "modern_yoga/theosophy",
    region: "modern_western",
    translator: "Annie Besant",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1908",
    difficulty: "Medium",
    review_needed: "legal; attribution; yoga review; theosophy framing",
    notes:
      "Theosophical yoga lectures staged for context only; do not present as primary Hindu scripture or practice authority.",
  },
  {
    work_id: "hindu_yogi_science_breath_atkinson_en",
    pg_id: "13402",
    text_name: "The Hindu-Yogi Science of Breath",
    category: "secondary/yoga",
    tradition_or_sect: "modern_yoga",
    region: "modern_western",
    translator: "Yogi Ramacharaka / William Walker Atkinson",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1903",
    difficulty: "Medium",
    review_needed: "legal; attribution; yoga review; modern occult framing; health claims",
    notes:
      "Modern breath-practice text staged for careful review; health claims must not be surfaced as advice.",
  },
  {
    work_id: "doctrine_practice_yoga_mukerji_en",
    pg_id: "13300",
    text_name: "The Doctrine and Practice of Yoga",
    category: "secondary/yoga",
    tradition_or_sect: "modern_yoga",
    region: "pan_indian",
    translator: "A. P. Mukerji",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1910",
    difficulty: "Medium",
    review_needed: "legal; attribution; yoga review; practice safety",
    notes:
      "Modern yoga manual staged for review-first context; practice instructions need safety and product review.",
  },
  {
    work_id: "yoga_as_philosophy_religion_dasgupta_en",
    pg_id: "74250",
    text_name: "Yoga as Philosophy and Religion",
    category: "secondary/yoga/philosophy",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Surendranath Dasgupta",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1924",
    difficulty: "Medium",
    review_needed: "legal; attribution; yoga review; philosophy review",
    notes:
      "Secondary yoga philosophy source staged for context and glossary support, not as scripture.",
  },
  {
    work_id: "autobiography_yogi_yogananda_en",
    pg_id: "7452",
    text_name: "Autobiography of a Yogi",
    category: "modern_spiritual_autobiography",
    tradition_or_sect: "kriya_yoga",
    region: "modern_indian",
    translator: "Paramahansa Yogananda",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1946",
    difficulty: "Medium",
    review_needed: "legal; attribution; jurisdiction review; modern lineage review",
    notes:
      "Modern spiritual autobiography staged as review-first context only; confirm non-USA jurisdiction and lineage sensitivities before production use.",
  },
  {
    work_id: "gita_and_gospel_farquhar_en",
    pg_id: "73070",
    text_name: "The Gita and the Gospel",
    category: "secondary/comparative_religion",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "J. N. Farquhar",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1903",
    difficulty: "Medium",
    review_needed: "legal; attribution; comparative religion bias review",
    notes:
      "Comparative religion text staged for careful review only; do not present as Hindu doctrinal authority.",
  },
  {
    work_id: "jnana_yoga_part2_vivekananda_en",
    pg_id: "72368",
    text_name: "Jnana Yoga, Part 2",
    category: "modern_vedanta",
    tradition_or_sect: "advaita/ramakrishna",
    region: "modern_indian",
    translator: "Swami Vivekananda",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1896",
    difficulty: "Medium",
    review_needed: "legal; attribution; Vedanta review",
    notes:
      "Modern Vedanta lectures staged for context; distinguish lecture source from scripture and classical commentary.",
  },
  {
    work_id: "tattva_muktavali_cowell_en",
    pg_id: "7175",
    text_name: "The Tattva-Muktavali",
    category: "darshana",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "E. B. Cowell",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1871",
    difficulty: "Hard",
    review_needed: "legal; attribution; philosophy review",
    notes: "Philosophical text staged for specialist review before segmentation or retrieval use.",
  },
  {
    work_id: "sarva_darsana_samgraha_cowell_gough_en",
    pg_id: "34125",
    text_name: "The Sarva-Darsana-Samgraha",
    category: "darshana",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "E. B. Cowell and A. E. Gough",
    commentator: "Madhava Acharya",
    edition: "Project Gutenberg ebook",
    translation_year: "1882",
    difficulty: "Hard",
    review_needed: "legal; attribution; philosophy review; tradition review",
    notes:
      "Classical survey of philosophical systems staged for review; distinguish polemical source perspective from neutral app voice.",
  },
  {
    work_id: "yoga_vasishtha_mitra_vol1_en",
    pg_id: "71326",
    text_name: "The Yoga-Vasishtha Maharamayana of Valmiki, Vol. 1",
    category: "darshana/itihasa",
    tradition_or_sect: "advaita",
    region: "pan_indian",
    translator: "Vihari-Lala Mitra",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1891",
    difficulty: "Hard",
    review_needed: "legal; attribution; Vedanta review; segmentation",
    notes:
      "Yoga-Vasishtha volume staged as philosophical scripture candidate; requires careful segmentation and tradition notes.",
  },
  {
    work_id: "yoga_vasishtha_mitra_vol2_part1_en",
    pg_id: "71063",
    text_name: "The Yoga-Vasishtha Maharamayana of Valmiki, Vol. 2 Part 1",
    category: "darshana/itihasa",
    tradition_or_sect: "advaita",
    region: "pan_indian",
    translator: "Vihari-Lala Mitra",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1891",
    difficulty: "Hard",
    review_needed: "legal; attribution; Vedanta review; segmentation",
    notes:
      "Yoga-Vasishtha volume staged as philosophical scripture candidate; requires careful segmentation and tradition notes.",
  },
  {
    work_id: "yoga_vasishtha_mitra_vol2_part2_en",
    pg_id: "71064",
    text_name: "The Yoga-Vasishtha Maharamayana of Valmiki, Vol. 2 Part 2",
    category: "darshana/itihasa",
    tradition_or_sect: "advaita",
    region: "pan_indian",
    translator: "Vihari-Lala Mitra",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1891",
    difficulty: "Hard",
    review_needed: "legal; attribution; Vedanta review; segmentation",
    notes:
      "Yoga-Vasishtha volume staged as philosophical scripture candidate; requires careful segmentation and tradition notes.",
  },
  {
    work_id: "yoga_vasishtha_mitra_vol3_part1_en",
    pg_id: "71095",
    text_name: "The Yoga-Vasishtha Maharamayana of Valmiki, Vol. 3 Part 1",
    category: "darshana/itihasa",
    tradition_or_sect: "advaita",
    region: "pan_indian",
    translator: "Vihari-Lala Mitra",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1891",
    difficulty: "Hard",
    review_needed: "legal; attribution; Vedanta review; segmentation",
    notes:
      "Yoga-Vasishtha volume staged as philosophical scripture candidate; requires careful segmentation and tradition notes.",
  },
  {
    work_id: "yoga_vasishtha_mitra_vol3_part2_en",
    pg_id: "46531",
    text_name: "The Yoga-Vasishtha Maharamayana of Valmiki, Vol. 3 Part 2",
    category: "darshana/itihasa",
    tradition_or_sect: "advaita",
    region: "pan_indian",
    translator: "Vihari-Lala Mitra",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1891",
    difficulty: "Hard",
    review_needed: "legal; attribution; Vedanta review; segmentation",
    notes:
      "Yoga-Vasishtha volume staged as philosophical scripture candidate; requires careful segmentation and tradition notes.",
  },
  {
    work_id: "yoga_vasishtha_mitra_vol4_part1_en",
    pg_id: "71248",
    text_name: "The Yoga-Vasishtha Maharamayana of Valmiki, Vol. 4 Part 1",
    category: "darshana/itihasa",
    tradition_or_sect: "advaita",
    region: "pan_indian",
    translator: "Vihari-Lala Mitra",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1891",
    difficulty: "Hard",
    review_needed: "legal; attribution; Vedanta review; segmentation",
    notes:
      "Yoga-Vasishtha volume staged as philosophical scripture candidate; requires careful segmentation and tradition notes.",
  },
  {
    work_id: "yoga_vasishtha_mitra_vol4_part2_en",
    pg_id: "71249",
    text_name: "The Yoga-Vasishtha Maharamayana of Valmiki, Vol. 4 Part 2",
    category: "darshana/itihasa",
    tradition_or_sect: "advaita",
    region: "pan_indian",
    translator: "Vihari-Lala Mitra",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1891",
    difficulty: "Hard",
    review_needed: "legal; attribution; Vedanta review; segmentation",
    notes:
      "Yoga-Vasishtha volume staged as philosophical scripture candidate; requires careful segmentation and tradition notes.",
  },
  {
    work_id: "great_indian_epics_oman_en",
    pg_id: "73417",
    text_name: "The Great Indian Epics",
    category: "secondary/itihasa",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "John Campbell Oman",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1894",
    difficulty: "Medium",
    review_needed: "legal; attribution; historical bias review",
    notes:
      "Secondary epic survey staged for context; review perspective and avoid citing as primary text.",
  },
  {
    work_id: "ramayana_dutt_vol1_en",
    pg_id: "57265",
    text_name: "The Ramayana, Volume 1: Balakandam and Ayodhyakandam",
    category: "scripture/itihasa",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Manmatha Nath Dutt",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1891",
    difficulty: "Hard",
    review_needed: "legal; attribution; epic segmentation; content review",
    notes:
      "Ramayana prose translation staged as primary itihasa candidate; requires canto-level segmentation and citation review.",
  },
  {
    work_id: "ramayana_dutt_vol2_en",
    pg_id: "57826",
    text_name: "The Ramayana, Volume 2: Aranya, Kishkindha, and Sundara Kandam",
    category: "scripture/itihasa",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Manmatha Nath Dutt",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1891",
    difficulty: "Hard",
    review_needed: "legal; attribution; epic segmentation; content review",
    notes:
      "Ramayana prose translation staged as primary itihasa candidate; requires canto-level segmentation and citation review.",
  },
  {
    work_id: "ramayana_dutt_vol3_en",
    pg_id: "60188",
    text_name: "The Ramayana, Volume 3: Yuddhakandam",
    category: "scripture/itihasa",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Manmatha Nath Dutt",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1892",
    difficulty: "Hard",
    review_needed: "legal; attribution; epic segmentation; content review",
    notes:
      "Ramayana prose translation staged as primary itihasa candidate; requires canto-level segmentation and citation review.",
  },
  {
    work_id: "ramayana_dutt_vol4_en",
    pg_id: "62496",
    text_name: "The Ramayana, Volume 4: Uttara Kanda",
    category: "scripture/itihasa",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Manmatha Nath Dutt",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1892",
    difficulty: "Hard",
    review_needed: "legal; attribution; epic segmentation; content review",
    notes:
      "Ramayana prose translation staged as primary itihasa candidate; requires canto-level segmentation and citation review.",
  },
  {
    work_id: "harivamsha_dutt_en",
    pg_id: "61937",
    text_name: "A Prose English Translation of Harivamsha",
    category: "scripture/itihasa/purana",
    tradition_or_sect: "vaishnava",
    region: "pan_indian",
    translator: "Manmatha Nath Dutt",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1897",
    difficulty: "Hard",
    review_needed: "legal; attribution; Vaishnava review; segmentation",
    notes:
      "Harivamsha staged as primary candidate for Krishna lineage and epic supplement material; requires careful source labeling.",
  },
  {
    work_id: "maha_bharata_romesh_dutt_en",
    pg_id: "19630",
    text_name: "Maha-bharata",
    category: "scripture/itihasa/adaptation",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Romesh Chunder Dutt",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1898",
    difficulty: "Medium",
    review_needed: "legal; attribution; adaptation review; epic segmentation",
    notes:
      "Condensed English verse adaptation staged for accessible epic context; do not treat as complete Mahabharata translation.",
  },
  {
    work_id: "religions_india_hopkins_en",
    pg_id: "14499",
    text_name: "The Religions of India",
    category: "secondary/history",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Edward Washburn Hopkins",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1895",
    difficulty: "Medium",
    review_needed: "legal; attribution; historical bias review",
    notes:
      "Secondary history of Indian religions staged for context; review dated scholarly framing before production use.",
  },
  {
    work_id: "indian_myth_legend_mackenzie_en",
    pg_id: "47228",
    text_name: "Indian Myth and Legend",
    category: "secondary/mythology",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Donald A. Mackenzie",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1913",
    difficulty: "Medium",
    review_needed: "legal; attribution; mythology review; historical bias review",
    notes:
      "Mythology and legend survey staged for context only; verify retellings before citation or user-facing display.",
  },
  {
    work_id: "buddhism_brahmanism_hinduism_monier_williams_en",
    pg_id: "47214",
    text_name: "Buddhism, in Its Connexion with Brahmanism and Hinduism",
    category: "secondary/comparative_religion",
    tradition_or_sect: "general",
    region: "pan_asian",
    translator: "Monier Monier-Williams",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1889",
    difficulty: "Medium",
    review_needed: "legal; attribution; comparative religion bias review; missionary framing",
    notes:
      "Comparative religion text staged for review-first background only; do not present its Christian framing as app voice.",
  },
  {
    work_id: "siksha_patri_swami_narayana_monier_williams_en",
    pg_id: "7261",
    text_name: "The Siksha-Patri of the Svami-Narayana Sect",
    category: "scripture/sampradaya",
    tradition_or_sect: "swaminarayan",
    region: "gujarat",
    translator: "Monier Monier-Williams",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1882",
    difficulty: "Medium",
    review_needed: "legal; attribution; Swaminarayan review; sectarian context",
    notes:
      "Swaminarayan scripture translation staged as sampradaya-specific source; label tradition scope explicitly.",
  },
  {
    work_id: "katha_sarit_sagara_tawney_en",
    pg_id: "40588",
    text_name: "The Katha Sarit Sagara; or, Ocean of the Streams of Story",
    category: "sanskrit_literature/story",
    tradition_or_sect: "shaiva/kashmir",
    region: "kashmir",
    translator: "C. H. Tawney",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1880",
    difficulty: "Hard",
    review_needed: "legal; attribution; Sanskrit literature review; segmentation",
    notes:
      "Large Sanskrit story collection staged for literature and folklore context; not a doctrinal scripture source.",
  },
  {
    work_id: "popular_religion_folklore_north_india_crooke_vol1_en",
    pg_id: "43681",
    text_name: "The Popular Religion and Folk-Lore of Northern India, Vol. 1",
    category: "secondary/folklore",
    tradition_or_sect: "folk/regional",
    region: "north_india",
    translator: "William Crooke",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1896",
    difficulty: "Medium",
    review_needed: "legal; attribution; folklore review; colonial-era framing",
    notes:
      "Regional folklore and popular religion study staged for context; review colonial classifications and sensitive terms.",
  },
  {
    work_id: "popular_religion_folklore_north_india_crooke_vol2_en",
    pg_id: "43682",
    text_name: "The Popular Religion and Folk-Lore of Northern India, Vol. 2",
    category: "secondary/folklore",
    tradition_or_sect: "folk/regional",
    region: "north_india",
    translator: "William Crooke",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1896",
    difficulty: "Medium",
    review_needed: "legal; attribution; folklore review; colonial-era framing",
    notes:
      "Regional folklore and popular religion study staged for context; review colonial classifications and sensitive terms.",
  },
  {
    work_id: "tales_sun_folklore_southern_india_kingscote_sastri_en",
    pg_id: "37002",
    text_name: "Tales of the Sun; or, Folklore of Southern India",
    category: "folklore/story",
    tradition_or_sect: "folk/regional",
    region: "south_india",
    translator: "Georgiana Kingscote and Pandit Natesa Sastri",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1890",
    difficulty: "Easy",
    review_needed: "legal; attribution; folklore review; regional context",
    notes:
      "Southern Indian folklore collection staged for story/context use after regional review.",
  },
  {
    work_id: "baital_pachchisi_forbes_platts_en",
    pg_id: "54697",
    text_name: "The Baital Pachchisi; Or, The Twenty-Five Tales of a Sprite",
    category: "sanskrit_literature/story",
    tradition_or_sect: "folk/classical",
    region: "pan_indian",
    translator: "John T. Platts and Duncan Forbes",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1871",
    difficulty: "Medium",
    review_needed: "legal; attribution; folklore review; content sensitivity",
    notes:
      "Vetala story-cycle translation staged for folklore context; distinguish from devotional or doctrinal material.",
  },
  {
    work_id: "vikram_vampire_burton_en",
    pg_id: "2400",
    text_name: "Vikram and the Vampire",
    category: "folklore/adaptation",
    tradition_or_sect: "folk/classical",
    region: "pan_indian",
    translator: "Richard F. Burton",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1870",
    difficulty: "Medium",
    review_needed: "legal; attribution; folklore review; Burton adaptation bias",
    notes:
      "Burton adaptation of Vetala tales staged for comparison/context; use Platts/Forbes or primary Sanskrit-derived sources first.",
  },
  {
    work_id: "indian_fairy_tales_jacobs_en",
    pg_id: "7128",
    text_name: "Indian Fairy Tales",
    category: "folklore/story",
    tradition_or_sect: "folk/regional",
    region: "pan_indian",
    translator: "Joseph Jacobs",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1892",
    difficulty: "Easy",
    review_needed: "legal; attribution; folklore review; source provenance",
    notes:
      "Compiled Indian folktales staged for story/context use; verify each tale source before production citation.",
  },
  {
    work_id: "tales_punjab_folklore_steel_en",
    pg_id: "6145",
    text_name: "Tales of the Punjab: Folklore of India",
    category: "folklore/story",
    tradition_or_sect: "folk/regional",
    region: "punjab",
    translator: "Flora Annie Webster Steel",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1894",
    difficulty: "Easy",
    review_needed: "legal; attribution; folklore review; regional context",
    notes: "Punjabi folklore collection staged for story/context use after regional review.",
  },
  {
    work_id: "two_old_faiths_mitchell_muir_en",
    pg_id: "16996",
    text_name: "Two Old Faiths",
    category: "secondary/comparative_religion",
    tradition_or_sect: "general",
    region: "pan_asian",
    translator: "J. Murray Mitchell and William Muir",
    commentator: "none",
    edition: "Project Gutenberg ebook",
    translation_year: "1891",
    difficulty: "Medium",
    review_needed: "legal; attribution; missionary framing; comparative religion bias review",
    notes:
      "Comparative religion source staged for background review only; do not surface dismissive or missionary framing as app voice.",
  },
  {
    work_id: "chaitanya_vaishnava_poets_beames_1873_en",
    pg_id: "6817",
    text_name: "Chaitanya and the Vaishnava Poets of Bengal",
    category: "vaishnava/poetry/history",
    tradition_or_sect: "gaudiya_vaishnava",
    region: "bengal/east_india",
    translator: "John Beames",
    commentator: "none",
    edition: "Project Gutenberg ebook from The Indian Antiquary Vol. II",
    translation_year: "1873",
    difficulty: "Medium",
    review_needed:
      "legal; attribution; Gaudiya Vaishnava review; poetic terminology review; colonial framing review",
    notes:
      "Indian Antiquary article staged for Chaitanya and Bengali Vaishnava poetry context; treat as secondary scholarship and keep colonial-era framing out of app voice.",
  },
];

function parseCsvLine(line) {
  const fields = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (quoted) {
      if (char === '"' && line[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      fields.push(field);
      field = "";
    } else {
      field += char;
    }
  }

  fields.push(field);
  return fields;
}

function serializeCsvLine(fields) {
  return fields
    .map((field) => {
      const value = String(field ?? "");
      if (!/[",\r\n]/.test(value)) return value;
      return `"${value.replaceAll('"', '""')}"`;
    })
    .join(",");
}

function readCsv(filePath) {
  const content = readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines[0]);
  const rows = lines.slice(1).map(parseCsvLine);
  return { headers, rows };
}

function writeCsv(filePath, headers, rows) {
  const lines = [headers, ...rows].map(serializeCsvLine);
  writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function rowIndex(headers) {
  return Object.fromEntries(headers.map((header, index) => [header, index]));
}

function existingWorkIds(rows, index) {
  return new Set(rows.map((row) => row[index.work_id]).filter(Boolean));
}

function pgUrls(pgId) {
  return [
    `https://www.gutenberg.org/ebooks/${pgId}.txt.utf-8`,
    `https://www.gutenberg.org/cache/epub/${pgId}/pg${pgId}.txt`,
    `https://www.gutenberg.org/files/${pgId}/${pgId}-0.txt`,
    `https://www.gutenberg.org/files/${pgId}/${pgId}.txt`,
  ];
}

async function fetchText(candidate) {
  const errors = [];
  for (const url of pgUrls(candidate.pg_id)) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Sandhya source staging; contact via repository maintainer",
        },
      });
      if (!response.ok) {
        errors.push(`${url} -> HTTP ${response.status}`);
        continue;
      }
      const text = await response.text();
      if (text.length < 1000) {
        errors.push(`${url} -> short response (${text.length} bytes)`);
        continue;
      }
      return { text, url };
    } catch (error) {
      errors.push(`${url} -> ${error.message}`);
    }
  }

  throw new Error(
    `Could not download ${candidate.work_id} (${candidate.pg_id}): ${errors.join("; ")}`,
  );
}

function inventoryRow(candidate) {
  const targetPath = `content/_staging/raw/english/${candidate.work_id}.txt`;
  const sourceUrl = `https://www.gutenberg.org/ebooks/${candidate.pg_id}`;
  return [
    candidate.work_id,
    candidate.text_name,
    candidate.category,
    candidate.tradition_or_sect,
    candidate.region,
    "English",
    "Roman",
    candidate.translator,
    candidate.commentator,
    candidate.edition,
    candidate.translation_year,
    "Project Gutenberg",
    sourceUrl,
    "ebook",
    "TXT",
    "Project Gutenberg public domain terms",
    "Public domain in the USA; verify non-USA status before broad production use",
    "Yes",
    "Yes",
    "Yes after review",
    "Yes, can ingest after cleanup/review",
    `Credit Project Gutenberg and ${candidate.translator}; remove or comply with Project Gutenberg trademark/license boilerplate`,
    "Yes if public-domain status applies in deployment jurisdiction",
    "No",
    "High",
    candidate.difficulty,
    candidate.review_needed,
    `${candidate.notes} Full Project Gutenberg TXT staged at ${targetPath} on ${stagedDate}.`,
    "staged_candidate",
  ];
}

function queueRow(candidate, downloadUrl) {
  const sourceUrl = `https://www.gutenberg.org/ebooks/${candidate.pg_id}`;
  const targetPath = `content/_staging/raw/english/${candidate.work_id}.txt`;
  return [
    candidate.work_id,
    candidate.text_name,
    "English",
    "Project Gutenberg",
    sourceUrl,
    downloadUrl,
    targetPath,
    "Project Gutenberg public domain terms; public domain in the USA",
    "downloaded_staged",
    `Full Project Gutenberg TXT staged at ${targetPath} on ${stagedDate}; review before ingestion.`,
  ];
}

mkdirSync(outputDir, { recursive: true });

const inventory = readCsv(inventoryPath);
const queue = readCsv(queuePath);
const inventoryIndex = rowIndex(inventory.headers);
const queueIndex = rowIndex(queue.headers);
const inventoryIds = existingWorkIds(inventory.rows, inventoryIndex);
const queueIds = existingWorkIds(queue.rows, queueIndex);

let downloaded = 0;
let skippedFiles = 0;
let inventoryAppended = 0;
let queueAppended = 0;

for (const candidate of candidates) {
  const targetPath = path.join(outputDir, `${candidate.work_id}.txt`);
  let downloadUrl = `https://www.gutenberg.org/ebooks/${candidate.pg_id}.txt.utf-8`;

  if (existsSync(targetPath)) {
    skippedFiles += 1;
  } else {
    const result = await fetchText(candidate);
    writeFileSync(targetPath, result.text, "utf8");
    downloadUrl = result.url;
    downloaded += 1;
  }

  if (!inventoryIds.has(candidate.work_id)) {
    inventory.rows.push(inventoryRow(candidate));
    inventoryIds.add(candidate.work_id);
    inventoryAppended += 1;
  }

  if (!queueIds.has(candidate.work_id)) {
    queue.rows.push(queueRow(candidate, downloadUrl));
    queueIds.add(candidate.work_id);
    queueAppended += 1;
  }
}

writeCsv(inventoryPath, inventory.headers, inventory.rows);
writeCsv(queuePath, queue.headers, queue.rows);

console.log(`candidate count: ${candidates.length}`);
console.log(`files downloaded: ${downloaded}`);
console.log(`files already present: ${skippedFiles}`);
console.log(`inventory rows appended: ${inventoryAppended}`);
console.log(`queue rows appended: ${queueAppended}`);

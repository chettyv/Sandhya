import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const inventoryPath = path.join(repoRoot, "docs/source_inventory_template.csv");
const queuePath = path.join(repoRoot, "docs/source_download_queue_2026-06-19.csv");
const outputDir = path.join(repoRoot, "content/_staging/raw/english");
const stagedDate = "2026-07-06";

const candidates = [
  {
    work_id: "bhagavata_purana_mn_dutt_ia_en",
    archive_id: "in.ernet.dli.2015.272582",
    file: "2015.272582.Shrimad-Bhagwatam_djvu.txt",
    text_name: "Shrimad Bhagwatam",
    category: "purana/vaishnava",
    tradition_or_sect: "vaishnava",
    region: "pan_indian",
    translator: "Manmatha Nath Dutt",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1896",
    difficulty: "Hard",
    review_needed: "legal; OCR review; Vaishnava review; segmentation",
    notes:
      "M. N. Dutt Bhagavata Purana OCR staged from Internet Archive DLI scan; compare against HathiTrust lead and verify completeness before ingestion.",
  },
  {
    work_id: "devi_bhagavatam_vijnanananda_en",
    archive_id: "srimaddevibhagav26vijnuoft",
    file: "srimaddevibhagav26vijnuoft_djvu.txt",
    text_name: "Srimad Devi Bhagavatam",
    category: "purana/shakta",
    tradition_or_sect: "shakta",
    region: "pan_indian",
    translator: "Swami Vijnanananda",
    commentator: "none",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1922",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Shakta review; Sanskrit/English language check; segmentation",
    notes:
      "Devi Bhagavatam translation OCR staged from Internet Archive; metadata marks language as Sanskrit, so verify English coverage and OCR quality before use.",
  },
  {
    work_id: "manu_samhita_dutt_1909_en",
    archive_id: "cu31924023014941",
    file: "cu31924023014941_djvu.txt",
    text_name: "Manu Samhita: English Translation",
    category: "dharma_sastra",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Manmatha Nath Dutt",
    commentator: "none",
    edition: "Internet Archive Cornell scan",
    translation_year: "1909",
    difficulty: "Hard",
    review_needed: "legal; OCR review; dharma-sastra review; sensitive content review",
    notes:
      "Dutt Manu Samhita OCR staged as an alternate to the Sacred Texts Manu scrape; content requires strong contextual labeling.",
  },
  {
    work_id: "harita_samhita_dutt_1906_en",
    archive_id: "samhitaoriginalt00duttuoft",
    file: "samhitaoriginalt00duttuoft_djvu.txt",
    text_name: "Harita Samhita",
    category: "dharma_sastra",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Manmatha Nath Dutt",
    commentator: "none",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1906",
    difficulty: "Hard",
    review_needed: "legal; OCR review; dharma-sastra review; segmentation",
    notes:
      "Harita Samhita OCR staged from Dutt's literal prose English translation; title metadata is ambiguous, so retain archive metadata sidecar.",
  },
  {
    work_id: "yajnavalkya_smriti_mitakshara_vidyarnava_1918_en",
    archive_id: "yajnavalkyasmrit00yj",
    file: "yajnavalkyasmrit00yj_djvu.txt",
    text_name: "Yajnavalkya Smriti with the Mitakshara and Balambhatta",
    category: "dharma_sastra",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Srisa Chandra Vidyarnava",
    commentator: "Vijnanesvara; Balambhatta",
    edition: "Internet Archive scan, Sacred Books of the Hindus",
    translation_year: "1918",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; dharma-sastra review; commentary boundary review; sensitive legal/social content review; segmentation",
    notes:
      "Fuller Yajnavalkya Smriti with Mitakshara and Balambhatta notes OCR staged as a complement to the shorter Gutenberg judicature extract; requires strong contextual labeling.",
  },
  {
    work_id: "parasara_dharma_samhita_vol1_part2_1893_en",
    archive_id: "in.ernet.dli.2015.282567",
    file: "2015.282567.Parasara-Dharma_djvu.txt",
    text_name: "Parasara Dharma Samhita or Parasara Smriti, Vol. 1 Part 2",
    category: "dharma_sastra",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Vaman Sastri Islampurkar",
    commentator: "Madhavacharya; Sayana",
    edition: "Internet Archive DLI scan",
    translation_year: "1893",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; dharma-sastra review; commentary boundary review; sensitive legal/social content review; partial-volume review",
    notes:
      "Parasara Smriti volume 1 part 2 OCR staged for dedicated Parasara dharma-sastra coverage; label as partial and distinguish text, translation, commentary, and notes.",
  },
  {
    work_id: "parasara_dharma_samhita_vol2_part1_1898_en",
    archive_id: "in.ernet.dli.2015.283602",
    file: "2015.283602.The-Parasra_djvu.txt",
    text_name: "Parasara Dharma Samhita or Parasara Smriti, Vol. 2 Part 1",
    category: "dharma_sastra",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Vaman Sastri Islampurkar",
    commentator: "Madhavacharya; Sayana",
    edition: "Internet Archive DLI scan",
    translation_year: "1898",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; dharma-sastra review; commentary boundary review; sensitive legal/social content review; partial-volume review",
    notes:
      "Parasara Smriti volume 2 part 1 OCR staged as a continuation of the dedicated Parasara translation/commentary series; verify volume continuity before ingestion.",
  },
  {
    work_id: "parasara_dharma_samhita_1919_en",
    archive_id: "in.ernet.dli.2015.506272",
    file: "2015.506272.parasara-dharma_djvu.txt",
    text_name: "Parasara Dharma Samhita or Parasara Smriti",
    category: "dharma_sastra",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Vaman Sastri Islampurkar",
    commentator: "Madhavacharya; Sayana",
    edition: "Internet Archive DLI scan",
    translation_year: "1919",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; dharma-sastra review; commentary boundary review; sensitive legal/social content review; duplicate-volume review; segmentation",
    notes:
      "Additional Parasara Smriti OCR staged from a 1919 DLI scan; compare against the 1893/1898 partial-volume scans for duplication and completeness before retrieval use.",
  },
  {
    work_id: "garuda_purana_dutt_1908_en",
    archive_id: "garudapuranam00duttgoog",
    file: "garudapuranam00duttgoog_djvu.txt",
    text_name: "The Garuda Puranam",
    category: "purana/vaishnava",
    tradition_or_sect: "vaishnava",
    region: "pan_indian",
    translator: "Manmatha Nath Dutt",
    commentator: "none",
    edition: "Internet Archive Harvard/Google scan",
    translation_year: "1908",
    difficulty: "Hard",
    review_needed: "legal; OCR review; Vaishnava review; afterlife content review; segmentation",
    notes:
      "Garuda Purana OCR staged from an old English translation; afterlife and ritual content needs careful contextualization.",
  },
  {
    work_id: "agni_purana_dutt_vol1_en",
    archive_id: "in.ernet.dli.2015.279469",
    file: "2015.279469.Agni-Puranam_djvu.txt",
    text_name: "Agni Puranam Vol. 1",
    category: "purana",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Manmatha Nath Dutt",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1903",
    difficulty: "Hard",
    review_needed: "legal; OCR review; Purana review; segmentation",
    notes:
      "Agni Purana volume 1 OCR staged from Internet Archive DLI scan; use only after chapter-level segmentation and review.",
  },
  {
    work_id: "agni_purana_dutt_vol2_en",
    archive_id: "in.ernet.dli.2015.33600",
    file: "2015.33600.Agni-Puranam--Vol-2_djvu.txt",
    text_name: "Agni Puranam Vol. 2",
    category: "purana",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Manmatha Nath Dutt",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1904",
    difficulty: "Hard",
    review_needed: "legal; OCR review; Purana review; segmentation",
    notes:
      "Agni Purana volume 2 OCR staged from Internet Archive DLI scan; compare with duplicate IA scans before production use.",
  },
  {
    work_id: "markandeya_purana_dutt_1896_en",
    archive_id: "in.ernet.dli.2015.163375",
    file: "2015.163375.Markandeya-Puranam_djvu.txt",
    text_name: "Markandeya Puranam",
    category: "purana/shakta",
    tradition_or_sect: "shakta/general",
    region: "pan_indian",
    translator: "Manmatha Nath Dutt",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1896",
    difficulty: "Hard",
    review_needed: "legal; OCR review; Purana review; Devi Mahatmya review; segmentation",
    notes:
      "Fuller Markandeya Purana OCR staged; earlier Gutenberg staging only covered Books VII and VIII.",
  },
  {
    work_id: "brahmanism_hinduism_monier_williams_1891_en",
    archive_id: "brahmanismhindui00moni",
    file: "brahmanismhindui00moni_djvu.txt",
    text_name: "Brahmanism and Hinduism",
    category: "secondary/history",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Monier Monier-Williams",
    commentator: "none",
    edition: "Internet Archive Princeton scan",
    translation_year: "1891",
    difficulty: "Medium",
    review_needed: "legal; OCR review; historical bias review; missionary framing",
    notes:
      "Secondary history source staged for background only; do not surface dated or missionary framing as Dharma Daily voice.",
  },
  {
    work_id: "elements_hindu_iconography_rao_vol1_part1_1914_en",
    archive_id: "in.gov.ignca.39172",
    file: "39172_djvu.txt",
    text_name: "Elements of Hindu Iconography, Vol. 1 Part 1",
    category: "reference/iconography",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "T. A. Gopinatha Rao",
    commentator: "none",
    edition: "Internet Archive IGNCA scan",
    translation_year: "1914",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; iconography review; deity terminology review; image/source-boundary review; segmentation",
    notes:
      "Gopinatha Rao's Elements of Hindu Iconography volume 1 part 1 OCR staged for deity and image-description reference use; use as historical/reference context, not as scripture or worship instruction.",
  },
  {
    work_id: "elements_hindu_iconography_rao_vol1_part2_1914_en",
    archive_id: "in.ernet.dli.2015.459193",
    file: "2015.459193.Elements-Of-Hindu-Iconography-Vol-1-Part-2_djvu.txt",
    text_name: "Elements of Hindu Iconography, Vol. 1 Part 2",
    category: "reference/iconography",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "T. A. Gopinatha Rao",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1914",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; iconography review; deity terminology review; image/source-boundary review; segmentation",
    notes:
      "Gopinatha Rao's Elements of Hindu Iconography volume 1 part 2 OCR staged as the companion to part 1; preserve deity, form, attribute, and plate-reference boundaries before ingestion.",
  },
  {
    work_id: "elements_hindu_iconography_rao_vol2_part1_1916_en",
    archive_id: "in.ernet.dli.2015.506671",
    file: "2015.506671.Elements-Of_djvu.txt",
    text_name: "Elements of Hindu Iconography, Vol. 2 Part 1",
    category: "reference/iconography",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "T. A. Gopinatha Rao",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1916",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; iconography review; deity terminology review; image/source-boundary review; segmentation",
    notes:
      "Gopinatha Rao's Elements of Hindu Iconography volume 2 part 1 OCR staged for expanded iconography coverage; verify OCR around Sanskrit names and plate references.",
  },
  {
    work_id: "elements_hindu_iconography_rao_vol2_part2_1916_en",
    archive_id: "in.ernet.dli.2015.459780",
    file: "2015.459780.Elements-Of-Hindu-Iconography-Vol-2-Part-2_djvu.txt",
    text_name: "Elements of Hindu Iconography, Vol. 2 Part 2",
    category: "reference/iconography",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "T. A. Gopinatha Rao",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1916",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; iconography review; deity terminology review; image/source-boundary review; segmentation",
    notes:
      "Gopinatha Rao's Elements of Hindu Iconography volume 2 part 2 OCR staged to complete the old four-part reference set; compare all parts for duplicate front matter and plate/list boundaries.",
  },
  {
    work_id: "south_indian_images_gods_goddesses_krishna_sastri_1916_en",
    archive_id: "southindianimage00krisuoft",
    file: "southindianimage00krisuoft_djvu.txt",
    text_name: "South-Indian Images of Gods and Goddesses",
    category: "reference/iconography/south_india",
    tradition_or_sect: "general/south_indian",
    region: "south_india",
    translator: "H. Krishna Sastri",
    commentator: "none",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1916",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; iconography review; South Indian deity terminology review; image/source-boundary review; segmentation",
    notes:
      "Krishna Sastri's South-Indian Images OCR staged as a concise reference for South Indian deity images; use for terminology and historical context after OCR and specialist review.",
  },
  {
    work_id: "hindu_religious_year_underhill_1921_en",
    archive_id: "cu31924079584821",
    file: "cu31924079584821_djvu.txt",
    text_name: "The Hindu Religious Year",
    category: "practice/festivals/calendar",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "M. M. Underhill",
    commentator: "none",
    edition: "Internet Archive Cornell scan",
    translation_year: "1921",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; festival/calendar review; regional variation review; historical bias review; segmentation",
    notes:
      "Underhill's Hindu Religious Year OCR staged as festival-calendar and observance context; use only after regional-variation checks and avoid presenting dated generalizations as universal practice.",
  },
  {
    work_id: "hindu_manners_customs_ceremonies_dubois_beauchamp_1906_en",
    archive_id: "hindumannerscust1906dubo",
    file: "hindumannerscust1906dubo_djvu.txt",
    text_name: "Hindu Manners, Customs and Ceremonies",
    category: "secondary/customs/ceremonies",
    tradition_or_sect: "general",
    region: "south_india/pan_indian",
    translator: "J. A. Dubois; Henry K. Beauchamp",
    commentator: "none",
    edition: "Internet Archive scan, third edition",
    translation_year: "1906",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; colonial/missionary bias review; customs review; regional variation review; sensitive caste/social content review; segmentation",
    notes:
      "Dubois and Beauchamp customs source OCR staged as historical background only; do not present colonial or missionary framing as Dharma Daily voice or as normative Hindu practice.",
  },
  {
    work_id: "dharmasastra_mn_dutt_6_vols_smritis_en",
    archive_id: "dharmasastra-with-english-translation-mn-dutt-6-vols-20-smritis",
    filesPrefix: "Dharma Sastra Vol ",
    text_name: "Dharmasastra with English Translation, M. N. Dutt, 6 Vols",
    category: "dharma_sastra",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Manmatha Nath Dutt",
    commentator: "none",
    edition: "Internet Archive composite scan",
    translation_year: "1908",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; dharma-sastra review; composite item review; sensitive content review; segmentation",
    notes:
      "Composite Dharma Sastra OCR staged by concatenating six IA OCR files; source item metadata is incomplete, so verify each volume before use.",
  },
  {
    work_id: "rig_veda_griffith_vol1_ia_en",
    archive_id: "in.gov.ignca.16311",
    file: "16311_djvu.txt",
    text_name: "The Hymns of the Rigveda, Vol. 1",
    category: "shruti/veda",
    tradition_or_sect: "vedic",
    region: "pan_indian",
    translator: "Ralph T. H. Griffith",
    commentator: "none",
    edition: "Internet Archive IGNCA/DLI scan",
    translation_year: "1896",
    difficulty: "Hard",
    review_needed: "legal; OCR review; Vedic review; hymn segmentation",
    notes:
      "Rig Veda Griffith volume 1 OCR staged as a core Vedic source; cross-check against Sacred Texts before production use.",
  },
  {
    work_id: "rig_veda_griffith_vol2_ia_en",
    archive_id: "in.ernet.dli.2015.47262",
    file: "2015.47262.Hymns-Of-The-Rigveda--Vol2_djvu.txt",
    text_name: "The Hymns of the Rigveda, Vol. 2",
    category: "shruti/veda",
    tradition_or_sect: "vedic",
    region: "pan_indian",
    translator: "Ralph T. H. Griffith",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1897",
    difficulty: "Hard",
    review_needed: "legal; OCR review; Vedic review; hymn segmentation",
    notes:
      "Rig Veda Griffith volume 2 OCR staged as a core Vedic source; cross-check against Sacred Texts before production use.",
  },
  {
    work_id: "rig_veda_griffith_vol3_ia_en",
    archive_id: "dli.csl.3712",
    file: "3712_djvu.txt",
    text_name: "The Hymns of the Rigveda, Vol. 3",
    category: "shruti/veda",
    tradition_or_sect: "vedic",
    region: "pan_indian",
    translator: "Ralph T. H. Griffith",
    commentator: "none",
    edition: "Internet Archive Central Secretariat Library scan",
    translation_year: "1891",
    difficulty: "Hard",
    review_needed: "legal; OCR review; Vedic review; hymn segmentation",
    notes:
      "Rig Veda Griffith volume 3 OCR staged after header verification; includes books VII, VIII, and part of IX.",
  },
  {
    work_id: "rig_veda_griffith_vol4_ia_en",
    archive_id: "dli.csl.6827",
    file: "6827_djvu.txt",
    text_name: "The Hymns of the Rigveda, Vol. 4",
    category: "shruti/veda",
    tradition_or_sect: "vedic",
    region: "pan_indian",
    translator: "Ralph T. H. Griffith",
    commentator: "none",
    edition: "Internet Archive Central Secretariat Library scan",
    translation_year: "1892",
    difficulty: "Hard",
    review_needed: "legal; OCR review; Vedic review; hymn segmentation",
    notes:
      "Rig Veda Griffith volume 4 OCR staged after header verification; includes the rest of book IX and book X.",
  },
  {
    work_id: "sama_veda_griffith_1893_ia_en",
    archive_id: "in.ernet.dli.2015.47949",
    file: "2015.47949.The-Hymns-Of-The-Sama-Veda_djvu.txt",
    text_name: "The Hymns of the Sama Veda",
    category: "shruti/veda",
    tradition_or_sect: "vedic",
    region: "pan_indian",
    translator: "Ralph T. H. Griffith",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1893",
    difficulty: "Hard",
    review_needed: "legal; OCR review; Vedic review; chant/liturgy context",
    notes:
      "Sama Veda Griffith OCR staged as a core Vedic source; requires liturgical context notes because many verses overlap Rig Veda.",
  },
  {
    work_id: "atharva_veda_griffith_vol1_ia_en",
    archive_id: "in.ernet.dli.2015.102416",
    file: "2015.102416.The-Hymns-Of-The-Atharva-vedavol1ed3_djvu.txt",
    text_name: "The Hymns of the Atharva-Veda, Vol. 1",
    category: "shruti/veda",
    tradition_or_sect: "vedic",
    region: "pan_indian",
    translator: "Ralph T. H. Griffith",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1894",
    difficulty: "Hard",
    review_needed: "legal; OCR review; Vedic review; sensitive ritual/medical content review",
    notes:
      "Atharva Veda Griffith volume 1 OCR staged as an alternate to Sacred Texts scrape; sensitive content requires careful handling.",
  },
  {
    work_id: "atharva_veda_griffith_vol2_ia_en",
    archive_id: "in.ernet.dli.2015.188973",
    file: "2015.188973.The-Hymns-Of-The-Atharva---Veda-Volii_djvu.txt",
    text_name: "The Hymns of the Atharva-Veda, Vol. 2",
    category: "shruti/veda",
    tradition_or_sect: "vedic",
    region: "pan_indian",
    translator: "Ralph T. H. Griffith",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1917",
    difficulty: "Hard",
    review_needed: "legal; OCR review; Vedic review; sensitive ritual/medical content review",
    notes:
      "Atharva Veda Griffith volume 2 OCR staged as an alternate to Sacred Texts scrape; sensitive content requires careful handling.",
  },
  {
    work_id: "white_yajurveda_griffith_1899_ia_en",
    archive_id: "in.ernet.dli.2015.196045",
    file: "2015.196045.The-White-Yajurveda_djvu.txt",
    text_name: "The White Yajurveda",
    category: "shruti/veda",
    tradition_or_sect: "vedic",
    region: "pan_indian",
    translator: "Ralph T. H. Griffith",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1899",
    difficulty: "Hard",
    review_needed: "legal; OCR review; Vedic review; ritual/liturgy context",
    notes:
      "White Yajurveda Griffith OCR staged as a core Vedic source; requires ritual context and careful segmentation.",
  },
  {
    work_id: "thirteen_principal_upanishads_hume_1921_en",
    archive_id: "thirteenprincipa00hume",
    file: "thirteenprincipa00hume_djvu.txt",
    text_name: "The Thirteen Principal Upanishads",
    category: "upanishad/vedanta",
    tradition_or_sect: "vedanta",
    region: "pan_indian",
    translator: "Robert Ernest Hume",
    commentator: "none",
    edition: "Internet Archive Princeton Theological Seminary scan",
    translation_year: "1921",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Upanishad review; Sanskrit/English alignment; bibliography review; segmentation",
    notes:
      "Hume's thirteen-principal-Upanishad translation OCR staged as a scholarly complement to Muller and Paramananda; includes substantial introduction and bibliography requiring source-boundary review.",
  },
  {
    work_id: "thirty_minor_upanishads_aiyar_1914_en",
    archive_id: "thirtyminorupani00xxxxuoft",
    file: "thirtyminorupani00xxxxuoft_djvu.txt",
    text_name: "Thirty Minor Upanishads",
    category: "upanishad/vedanta/yoga",
    tradition_or_sect: "vedanta/yoga",
    region: "pan_indian",
    translator: "K. Narayanasvami Aiyar",
    commentator: "none",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1914",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Upanishad review; yoga/renunciation content review; segmentation",
    notes:
      "Thirty Minor Upanishads OCR staged to expand beyond the principal Upanishads; includes Vedantic, yoga, mantra, physiological, and sannyasa materials that need category-specific review.",
  },
  {
    work_id: "taittiriya_upanishad_mahadeva_sastri_1903_en",
    archive_id: "in.ernet.dli.2015.217334",
    file: "2015.217334.The-Taittiriya_djvu.txt",
    text_name: "The Taittiriya Upanishad",
    category: "upanishad/vedanta/commentary",
    tradition_or_sect: "advaita/vedanta",
    region: "pan_indian",
    translator: "Alladi Mahadeva Sastri",
    commentator: "Sankaracharya; Suresvaracharya; Sayana/Vidyaranya",
    edition: "Internet Archive DLI scan",
    translation_year: "1903",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Upanishad review; Advaita review; commentary boundary review; Sanskrit/English alignment; segmentation",
    notes:
      "Taittiriya Upanishad OCR staged with English translation of Sankaracharya, Suresvaracharya, and Sayana/Vidyaranya commentary material; requires careful separation of text, translation, and commentary layers.",
  },
  {
    work_id: "amritabindu_kaivalya_upanishads_mahadeva_sastri_1898_en",
    archive_id: "amritabindukaiva00mahauoft",
    file: "amritabindukaiva00mahauoft_djvu.txt",
    text_name: "Amritabindu and Kaivalya Upanishads",
    category: "upanishad/vedanta",
    tradition_or_sect: "advaita/vedanta",
    region: "pan_indian",
    translator: "Alladi Mahadeva Sastri",
    commentator: "none",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1898",
    difficulty: "Medium",
    review_needed: "legal; OCR review; Upanishad review; Sanskrit/English alignment; segmentation",
    notes:
      "Short Upanishad translation OCR staged to improve minor Upanishad coverage with a compact source that should be easier to segment after review.",
  },
  {
    work_id: "panchadasi_vidyaranya_1912_en",
    archive_id: "PanchadasiOfVidyaranya",
    file: "Panchadasi Of Vidyaranya_djvu.txt",
    text_name: "Panchadasi of Vidyaranya",
    category: "vedanta/advaita/prakarana",
    tradition_or_sect: "advaita",
    region: "pan_indian",
    translator: "M. Srinivasa Rau and K. A. Krishnaswamy Aiyar",
    commentator: "Vidyaranya",
    edition: "Internet Archive Public Domain Mark scan",
    translation_year: "1912",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Advaita review; Sanskrit/English alignment; chapter summary boundary review; segmentation",
    notes:
      "Panchadasi OCR staged as a major Advaita prakaran text with English translation, explanatory notes, and chapter summaries; distinguish source text, translator notes, and summaries before retrieval use.",
  },
  {
    work_id: "bhagavad_gita_sankara_bhashya_mahadeva_sastri_1901_en",
    archive_id: "bhagavadgitawith00maharich",
    file: "bhagavadgitawith00maharich_djvu.txt",
    text_name: "The Bhagavad-Gita with the Commentary of Sri Sankaracharya",
    category: "gita/commentary/advaita",
    tradition_or_sect: "advaita/vedanta",
    region: "pan_indian",
    translator: "Alladi Mahadeva Sastri",
    commentator: "Adi Sankaracharya",
    edition: "Internet Archive University of California scan",
    translation_year: "1901",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Gita review; Advaita review; commentary boundary review; Sanskrit/English alignment; segmentation",
    notes:
      "Sankara's Bhagavad Gita commentary in English OCR staged as a core Gita-bhashya source; keep it distinct from free-standing Gita translations and SBE Gita material.",
  },
  {
    work_id: "narada_bhakti_sutras_sinha_1917_en",
    archive_id: "in.ernet.dli.2015.114952",
    file: "2015.114952.The-Bhakti-Sutras-Of-Narada_djvu.txt",
    text_name: "The Bhakti Sutras of Narada",
    category: "bhakti/sutra",
    tradition_or_sect: "bhakti/general",
    region: "pan_indian",
    translator: "Nandalal Sinha",
    commentator: "Narada",
    edition: "Internet Archive DLI scan",
    translation_year: "1917",
    difficulty: "Medium",
    review_needed: "legal; OCR review; Bhakti review; Sanskrit/English alignment; segmentation",
    notes:
      "Narada Bhakti Sutras OCR staged as a concise devotional theology source; pair with later Sandilya Bhakti Sutra sourcing if a rights-clear English edition is verified.",
  },
  {
    work_id: "sri_bhashya_ramanuja_rangacharya_1899_en",
    archive_id: "vedantasutraswit00badaiala",
    file: "vedantasutraswit00badaiala_djvu.txt",
    text_name: "The Vedanta-Sutras with the Sri-Bhashya of Ramanujacharya",
    category: "vedanta/vishishtadvaita/commentary",
    tradition_or_sect: "vishishtadvaita",
    region: "pan_indian/south_indian",
    translator: "M. Rangacharya and M. B. Varadaraja Aiyangar",
    commentator: "Ramanuja",
    edition: "Internet Archive University of California scan",
    translation_year: "1899",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Vishishtadvaita review; Brahma-sutra review; commentary boundary review; Sanskrit/English alignment; segmentation",
    notes:
      "Sri-Bhashya OCR staged as a direct Vishishtadvaita Brahma-sutra commentary source, distinct from the Thibaut/SBE Ramanuja translation already staged.",
  },
  {
    work_id: "tiruvacagam_pope_1900_en",
    archive_id: "tiruvacagamorsac00maniuoft",
    file: "tiruvacagamorsac00maniuoft_djvu.txt",
    text_name: "The Tiruvacagam",
    category: "bhakti/shaiva/tamil",
    tradition_or_sect: "shaiva/saiva_siddhanta",
    region: "tamil",
    translator: "George Uglow Pope",
    commentator: "Manikkavacakar",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1900",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Tamil Shaiva review; poetic translation review; source-boundary review; segmentation",
    notes:
      "Pope's Tiruvacagam OCR staged to add Tamil Shaiva devotional coverage in English; preserve distinction between Tamil text, translation, notes, and missionary-era framing.",
  },
  {
    work_id: "hymns_tamil_saivite_saints_kingsbury_phillips_1921_en",
    archive_id: "hymnsoftamilsaiv00kinguoft",
    file: "hymnsoftamilsaiv00kinguoft_djvu.txt",
    text_name: "Hymns of the Tamil Saivite Saints",
    category: "bhakti/shaiva/tamil",
    tradition_or_sect: "shaiva/saiva_siddhanta",
    region: "tamil",
    translator: "Francis Kingsbury and Godfrey E. Phillips",
    commentator: "Sambandar; Appar; Sundarar; Manikkavacakar",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1921",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Tamil Shaiva review; poetic translation review; attribution; segmentation",
    notes:
      "Tamil Saivite hymn anthology OCR staged to broaden English devotional coverage beyond Sanskrit-centered sources; author and hymn attribution must be preserved at passage level.",
  },
  {
    work_id: "studies_saiva_siddhanta_nallasvami_1911_en",
    archive_id: "in.ernet.dli.2015.69899",
    file: "2015.69899.Studies-In-Saiva-Siddhanta_djvu.txt",
    text_name: "Studies in Saiva Siddhanta",
    category: "secondary/shaiva/saiva_siddhanta",
    tradition_or_sect: "shaiva/saiva_siddhanta",
    region: "tamil/south_indian",
    translator: "J. M. Nallasvami Pillai",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1911",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Saiva Siddhanta review; historical framing; attribution; segmentation",
    notes:
      "Saiva Siddhanta essays OCR staged as context and terminology support; do not present secondary argumentation as scripture.",
  },
  {
    work_id: "vedantasara_sadananda_ballantyne_1898_en",
    archive_id: "vedantasara00sadauoft",
    file: "vedantasara00sadauoft_djvu.txt",
    text_name: "The Vedanta-Sara",
    category: "vedanta/advaita/prakarana",
    tradition_or_sect: "advaita",
    region: "pan_indian",
    translator: "James Robert Ballantyne",
    commentator: "Sadananda Yogindra",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1898",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Advaita review; polemical framing review; source-boundary review; segmentation",
    notes:
      "Ballantyne's Vedanta-Sara OCR staged as a compact Advaita primer source; the surrounding examination and colonial-era framing must be separated from source translation before retrieval use.",
  },
  {
    work_id: "hatha_yoga_pradipika_pancham_sinh_1915_en",
    archive_id: "dli.csl.7087",
    file: "7087_djvu.txt",
    text_name: "The Hatha Yoga Pradipika",
    category: "yoga/hatha",
    tradition_or_sect: "hatha_yoga/nath",
    region: "pan_indian",
    translator: "Pancham Sinh",
    commentator: "Svatmarama",
    edition: "Internet Archive Central Secretariat Library scan",
    translation_year: "1915",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Yoga review; practice safety review; Sanskrit/English alignment; segmentation",
    notes:
      "Hatha Yoga Pradipika OCR staged as a core hatha-yoga source; practice instructions, bodily techniques, and esoteric claims require product-safety gating before retrieval use.",
  },
  {
    work_id: "siva_samhita_vasu_1914_en",
    archive_id: "sacredbooksofthehindusvol15sivasamhitawithsanskrittextscvasu1914_202002",
    file: "Sacred Books of the Hindus Vol 15 - Siva Samhita With Sanskrit Text - SC Vasu 1914_djvu.txt",
    text_name: "Siva Samhita",
    category: "yoga/hatha/tantra",
    tradition_or_sect: "hatha_yoga/shaiva",
    region: "pan_indian",
    translator: "Srisa Chandra Vasu",
    commentator: "none",
    edition: "Internet Archive CC0 Sacred Books of the Hindus scan",
    translation_year: "1914",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Yoga review; Shaiva/Tantra review; practice safety review; Sanskrit/English alignment; segmentation",
    notes:
      "Siva Samhita OCR staged from a Sacred Books of the Hindus scan; esoteric and practice-instruction material requires specialist review and safety context before retrieval use.",
  },
  {
    work_id: "gheranda_sanhita_vasu_1895_en",
    archive_id: "b28140102",
    file: "b28140102_djvu.txt",
    text_name: "The Gheranda Sanhita",
    category: "yoga/hatha",
    tradition_or_sect: "hatha_yoga",
    region: "pan_indian",
    translator: "Srisa Chandra Vasu",
    commentator: "none",
    edition: "Internet Archive Wellcome Library scan",
    translation_year: "1895",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Yoga review; practice safety review; Sanskrit/English alignment; segmentation",
    notes:
      "Gheranda Sanhita OCR staged as a core hatha-yoga source; metadata language is Sanskrit, but the scan includes English translation before Sanskrit and needs source-form review.",
  },
  {
    work_id: "satakas_bhartrihari_wortham_1886_en",
    archive_id: "satakasofbhartri00bharuoft",
    file: "satakasofbhartri00bharuoft_djvu.txt",
    text_name: "The Satakas of Bhartrihari",
    category: "poetry/ethics/renunciation",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Biscoe Hale Wortham",
    commentator: "Bhartrihari",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1886",
    difficulty: "Medium",
    review_needed: "legal; OCR review; Sanskrit poetry review; attribution; segmentation",
    notes:
      "Bhartrihari's Satakas OCR staged for ethical, devotional, and renunciation poetry coverage; verse-level attribution and thematic tagging are required before retrieval use.",
  },
  {
    work_id: "gita_govinda_arnold_1875_en",
    archive_id: "indiansongofsong00jayarich",
    file: "indiansongofsong00jayarich_djvu.txt",
    text_name: "The Indian Song of Songs",
    category: "poetry/bhakti/vaishnava",
    tradition_or_sect: "vaishnava/krishna_bhakti",
    region: "east_india/pan_indian",
    translator: "Edwin Arnold",
    commentator: "Jayadeva",
    edition: "Internet Archive University of California scan",
    translation_year: "1875",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Vaishnava review; poetic translation review; sensitive romantic/devotional content review; segmentation",
    notes:
      "Arnold's English rendering of Jayadeva's Gita Govinda OCR staged for Krishna-bhakti poetry coverage; devotional-erotic framing needs careful context before user-facing use.",
  },
  {
    work_id: "bhakti_sutras_narada_sandilya_sinha_1917_1918_en",
    archive_id: "in.ernet.dli.2015.142440",
    file: "2015.142440.Bhakti-Sutras-Of-Narada-And-Sandilya-Sutram_djvu.txt",
    text_name: "Bhakti Sutras of Narada and Sandilya Sutram",
    category: "bhakti/sutra",
    tradition_or_sect: "bhakti/general",
    region: "pan_indian",
    translator: "Nandalal Sinha",
    commentator: "Narada; Sandilya; Svapnesvara",
    edition: "Internet Archive DLI scan",
    translation_year: "1917/1918",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Bhakti review; Sanskrit/English alignment; duplicate Narada boundary review; segmentation",
    notes:
      "Bound Narada and Sandilya Bhakti Sutra OCR staged to add Sandilya coverage; Narada overlap with the separate Narada Bhakti Sutras staging must be deduplicated at passage level.",
  },
  {
    work_id: "bhagavad_gita_chatterji_1887_en",
    archive_id: "in.ernet.dli.2015.180559",
    file: "2015.180559.The-Bhagavad-Gita_djvu.txt",
    text_name: "The Bhagavad Gita",
    category: "gita/translation",
    tradition_or_sect: "general/theosophical",
    region: "pan_indian",
    translator: "Mohini M. Chatterji",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1887",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Gita review; theosophical framing review; Sanskrit/English alignment; segmentation",
    notes:
      "Chatterji's Bhagavad Gita translation OCR staged as an alternate nineteenth-century English Gita rendering; distinguish translation choices and theosophical framing from app voice.",
  },
  {
    work_id: "ramakrishna_life_sayings_muller_1898_en",
    archive_id: "ramakrishnahisli025100mbp",
    file: "ramakrishnahisli025100mbp_djvu.txt",
    text_name: "Ramakrishna: His Life and Sayings",
    category: "modern_saint/teachings",
    tradition_or_sect: "ramakrishna/vedanta",
    region: "bengal/modern_indian",
    translator: "F. Max Muller",
    commentator: "Ramakrishna",
    edition: "Internet Archive Million Books Project scan",
    translation_year: "1898",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Ramakrishna tradition review; colonial framing review; quotation/source-boundary review; segmentation",
    notes:
      "Max Muller's Ramakrishna life-and-sayings source OCR staged for modern Hindu teaching coverage; separate biography, sayings, and colonial-era interpretation before retrieval use.",
  },
  {
    work_id: "gospel_ramakrishna_abhedananda_1907_en",
    archive_id: "gospelofrmakri00ramarich",
    file: "gospelofrmakri00ramarich_djvu.txt",
    text_name: "The Gospel of Ramakrishna",
    category: "modern_saint/dialogue",
    tradition_or_sect: "ramakrishna/vedanta",
    region: "bengal/modern_indian",
    translator: "Swami Abhedananda",
    commentator: "Ramakrishna; Mahendranath Gupta",
    edition: "Internet Archive University of California scan",
    translation_year: "1907",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Ramakrishna tradition review; dialogue attribution review; quotation/source-boundary review; segmentation",
    notes:
      "Early English Gospel of Ramakrishna OCR staged for modern Hindu dialogue/teaching coverage; speaker attribution, dialogue boundaries, and later-edition differences require review.",
  },
  {
    work_id: "sri_ramakrishna_great_master_vol1_1920_en",
    archive_id: "in.ernet.dli.2015.203736",
    file: "2015.203736.Sri-Ramakrishna_djvu.txt",
    text_name: "Sri Ramakrishna The Great Master, Vol. 1",
    category: "modern_saint/biography",
    tradition_or_sect: "ramakrishna/vedanta",
    region: "bengal/modern_indian",
    translator: "Swami Sharvananda",
    commentator: "Swami Saradananda",
    edition: "Internet Archive DLI scan",
    translation_year: "1920",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Ramakrishna tradition review; biography/source-boundary review; quotation attribution; segmentation",
    notes:
      "English Sri Ramakrishna Great Master volume 1 OCR staged for fuller Ramakrishna biography and tradition context; verify translator/editor boundaries and avoid treating biography as scripture.",
  },
  {
    work_id: "life_swami_vivekananda_disciples_1912_en",
    archive_id: "dli.ministry.03948",
    file: "22504.178%20C%20469_djvu.txt",
    text_name: "The Life of the Swami Vivekananda",
    category: "modern_saint/biography",
    tradition_or_sect: "ramakrishna/vedanta",
    region: "modern_indian/global",
    translator: "Eastern and Western disciples",
    commentator: "none",
    edition: "Internet Archive DLI Ministry scan, Himalayan Series",
    translation_year: "1912",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Ramakrishna/Vivekananda tradition review; biography/source-boundary review; quotation attribution; segmentation",
    notes:
      "Early disciple biography of Swami Vivekananda OCR staged as modern Hindu movement context; preserve biography, quoted lecture, letter, and editorial boundaries.",
  },
  {
    work_id: "spiritual_talks_brahmananda_1911_en",
    archive_id: "nmim_spiritual-talks-by-swami-brahmananda-1911-ramakrishna-mission",
    file: "Spiritual Talks By Swami Brahmananda 1911 - Ramakrishna Mission_djvu.txt",
    text_name: "Spiritual Talks by Swami Brahmananda",
    category: "modern_saint/teachings",
    tradition_or_sect: "ramakrishna/vedanta",
    region: "bengal/modern_indian",
    translator: "Ramakrishna Mission",
    commentator: "Swami Brahmananda",
    edition: "Internet Archive scan, Ramakrishna Mission",
    translation_year: "1911",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Ramakrishna tradition review; speaker attribution; practical advice safety review; segmentation",
    notes:
      "Brahmananda spiritual talks OCR staged for early Ramakrishna-order teaching coverage; treat as lineage-specific advice and preserve speaker/editor attribution.",
  },
  {
    work_id: "address_on_vedanta_vivekananda_1896_en",
    archive_id: "addressonvedanta00vive",
    file: "addressonvedanta00vive_djvu.txt",
    text_name: "Address on Vedanta Philosophy: The Ideal of a Universal Religion",
    category: "modern_vedanta/lecture",
    tradition_or_sect: "ramakrishna/vedanta",
    region: "modern_indian/global",
    translator: "Swami Vivekananda",
    commentator: "none",
    edition: "Internet Archive Library of Congress scan",
    translation_year: "1896",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; modern Vedanta review; lecture context review; quotation/source-boundary review; segmentation",
    notes:
      "Vivekananda's 1896 Address on Vedanta Philosophy OCR staged as a concise modern Vedanta lecture source; deduplicate against broader Vivekananda lecture collections.",
  },
  {
    work_id: "raja_yoga_vivekananda_1923_en",
    archive_id: "in.ernet.dli.2015.42344",
    file: "2015.42344.Raja-Yoga--Ed-6_djvu.txt",
    text_name: "Raja Yoga",
    category: "modern_yoga/vedanta",
    tradition_or_sect: "ramakrishna/modern_yoga",
    region: "modern_indian/global",
    translator: "Swami Vivekananda",
    commentator: "Patanjali; Swami Vivekananda",
    edition: "Internet Archive DLI scan, sixth edition",
    translation_year: "1923",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Yoga review; practice safety review; modern framing review; segmentation",
    notes:
      "Vivekananda's Raja Yoga OCR staged as a modern yoga/Vedanta source; practice instructions and Patanjali commentary should be source-bounded and safety-reviewed.",
  },
  {
    work_id: "bhakti_yoga_vivekananda_1896_en",
    archive_id: "in.ernet.dli.2015.195578",
    file: "2015.195578.Bhakti---Yoga_djvu.txt",
    text_name: "Bhakti-Yoga",
    category: "modern_bhakti/vedanta",
    tradition_or_sect: "ramakrishna/bhakti",
    region: "modern_indian/global",
    translator: "Swami Vivekananda",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1896",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Bhakti review; modern framing review; quotation/source-boundary review; segmentation",
    notes:
      "Vivekananda's Bhakti-Yoga OCR staged as a modern bhakti/Vedanta teaching source; separate direct quotations, lecture text, and later editorial material before retrieval use.",
  },
  {
    work_id: "karma_yoga_vivekananda_1907_en",
    archive_id: "in.ernet.dli.2015.195766",
    file: "2015.195766.Karma-Yoga--Ed-2_djvu.txt",
    text_name: "Karma Yoga",
    category: "modern_yoga/vedanta",
    tradition_or_sect: "ramakrishna/karma_yoga",
    region: "modern_indian/global",
    translator: "Swami Vivekananda",
    commentator: "none",
    edition: "Internet Archive DLI scan, second edition",
    translation_year: "1907",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Karma Yoga review; modern framing review; quotation/source-boundary review; segmentation",
    notes:
      "Vivekananda's Karma Yoga OCR staged to complete the core Vivekananda yoga triad beside Raja Yoga and Bhakti-Yoga; lecture boundaries and practical advice framing require review.",
  },
  {
    work_id: "jnana_yoga_vivekananda_1902_en",
    archive_id: "vedntaphilosop00vive",
    file: "vedntaphilosop00vive_djvu.txt",
    text_name: "Vedanta Philosophy: Lectures on Jnana Yoga",
    category: "modern_vedanta/jnana_yoga",
    tradition_or_sect: "ramakrishna/advaita",
    region: "modern_indian/global",
    translator: "Swami Vivekananda",
    commentator: "none",
    edition: "Internet Archive University of California scan",
    translation_year: "1902",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Jnana Yoga review; modern Vedanta review; quotation/source-boundary review; segmentation",
    notes:
      "Early Jnana Yoga lecture volume OCR staged as fuller Vivekananda Advaita/Vedanta coverage; deduplicate against the separate Project Gutenberg Jnana Yoga Part II staging.",
  },
  {
    work_id: "vedanta_philosophy_sketch_tripathi_1901_en",
    archive_id: "in.ernet.dli.2015.218962",
    file: "2015.218962.A-Sketch_djvu.txt",
    text_name: "A Sketch of the Vedanta Philosophy",
    category: "vedanta/secondary",
    tradition_or_sect: "advaita/general",
    region: "western_india/pan_indian",
    translator: "Manassukharama Suryarama Tripathi",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1901",
    difficulty: "Medium",
    review_needed: "legal; OCR review; Vedanta review; historical framing review; segmentation",
    notes:
      "Tripathi's early English Vedanta exposition OCR staged as a Hindu-authored secondary source; keep explanatory claims distinct from scripture/commentary citations.",
  },
  {
    work_id: "my_master_vivekananda_1901_en",
    archive_id: "mymaster00vivegoog",
    file: "mymaster00vivegoog_djvu.txt",
    text_name: "My Master",
    category: "modern_saint/teachings",
    tradition_or_sect: "ramakrishna/vedanta",
    region: "bengal/modern_indian",
    translator: "Swami Vivekananda",
    commentator: "Ramakrishna",
    edition: "Internet Archive Google scan",
    translation_year: "1901",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Ramakrishna tradition review; quotation/source-boundary review; segmentation",
    notes:
      "Vivekananda's My Master OCR staged as a primary modern Ramakrishna-Vedanta teaching source; appended review material must be separated before retrieval use.",
  },
  {
    work_id: "lectures_colombo_almora_vivekananda_1897_en",
    archive_id: "in.ernet.dli.2015.195770",
    file: "2015.195770.Lectures-From-Colombo-To-Almora_djvu.txt",
    text_name: "Lectures from Colombo to Almora",
    category: "modern_vedanta/lectures",
    tradition_or_sect: "ramakrishna/vedanta",
    region: "modern_indian/global",
    translator: "Swami Vivekananda",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1897",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; modern Vedanta review; lecture context review; quotation/source-boundary review; segmentation",
    notes:
      "Vivekananda's return-to-India lecture collection OCR staged for modern Hindu public teaching coverage; treat as dated lectures, not scriptural authority.",
  },
  {
    work_id: "inspired_talks_vivekananda_1910_en",
    archive_id: "inspiredtalks00viverich",
    file: "inspiredtalks00viverich_djvu.txt",
    text_name: "Inspired Talks",
    category: "modern_vedanta/teachings",
    tradition_or_sect: "ramakrishna/vedanta",
    region: "modern_indian/global",
    translator: "Swami Vivekananda; Sarah Ellen Waldo",
    commentator: "none",
    edition: "Internet Archive University of California scan",
    translation_year: "1910",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; modern Vedanta review; notes attribution review; quotation/source-boundary review; segmentation",
    notes:
      "Inspired Talks OCR staged for informal Vivekananda teaching coverage; attribution to lecture notes and editorial boundaries must be preserved.",
  },
  {
    work_id: "chaitanya_life_teachings_sarkar_1922_en",
    archive_id: "chaitanyaslifean00kaviuoft",
    file: "chaitanyaslifean00kaviuoft_djvu.txt",
    text_name: "Chaitanya's Life and Teachings",
    category: "vaishnava/biography/teachings",
    tradition_or_sect: "gaudiya_vaishnava",
    region: "bengal/east_india",
    translator: "Jadunath Sarkar",
    commentator: "Krishnadasa Kaviraja",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1922",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Gaudiya Vaishnava review; Bengali/English alignment; source-boundary review; segmentation",
    notes:
      "Sarkar's English Chaitanya-charitamrita selections OCR staged to improve Gaudiya Vaishnava coverage; distinguish biography, translation, and editorial notes.",
  },
  {
    work_id: "chaitanya_companions_sen_1917_en",
    archive_id: "chaitanyahiscomp00senduoft",
    file: "chaitanyahiscomp00senduoft_djvu.txt",
    text_name: "Chaitanya and His Companions",
    category: "vaishnava/biography/history",
    tradition_or_sect: "gaudiya_vaishnava",
    region: "bengal/east_india",
    translator: "Dinesh Chandra Sen",
    commentator: "none",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1917",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Gaudiya Vaishnava review; historical framing review; source-boundary review; segmentation",
    notes:
      "Sen's Chaitanya companion study OCR staged for Bengali Vaishnava context; use as secondary/historical material rather than direct scripture.",
  },
  {
    work_id: "three_great_acharyas_1923_en",
    archive_id: "rkas.2429.threegreatachary0000unse",
    file: "rkas.2429.threegreatachary0000unse_djvu.txt",
    text_name: "Three Great Acharyas: Sankara, Ramanuja, Madhwa",
    category: "vedanta/secondary",
    tradition_or_sect: "advaita/vishishtadvaita/dvaita",
    region: "pan_indian",
    translator: "Unknown editor",
    commentator: "Sankara; Ramanuja; Madhwa",
    edition: "Internet Archive RKAS scan",
    translation_year: "1923",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Vedanta review; Dvaita review; source-boundary review; segmentation",
    notes:
      "Comparative Acharya source OCR staged to improve Dvaita/Madhva and cross-Vedanta balance; verify authorship and separate historical summary from doctrinal quotation.",
  },
  {
    work_id: "upanishads_madhwa_bhashya_sbh_vol1_1911_en",
    archive_id: "sacredbooksofthehindusvol01upanishadsisatomandukyawithmadhwabhashya_202002",
    file: "Sacred Books of the Hindus Vol 01 - Upanishads - Isa to Mandukya with Madhwa Bhashya_djvu.txt",
    text_name: "Sacred Books of the Hindus Vol. 1: Upanishads with Madhwa Bhashya",
    category: "upanishad/vedanta/commentary",
    tradition_or_sect: "dvaita/madhva",
    region: "pan_indian",
    translator: "Various Sanskrit scholars",
    commentator: "Madhwa",
    edition: "Internet Archive upload of 1911 Sacred Books of the Hindus Vol. 1",
    translation_year: "1911",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Dvaita review; Upanishad review; Sanskrit/English alignment; commentary boundary review; segmentation",
    notes:
      "Madhwa-bhashya Upanishad volume OCR staged to improve Dvaita source coverage; IA metadata is a newer CC0-marked upload, while OCR title pages identify a 1911 printed edition, so legal review must verify edition and upload rights.",
  },
  {
    work_id: "classical_dictionary_hindu_mythology_dowson_1888_en",
    archive_id: "aclassicaldictio00dowsuoft",
    file: "aclassicaldictio00dowsuoft_djvu.txt",
    text_name: "A Classical Dictionary of Hindu Mythology and Religion",
    category: "reference/mythology",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "John Dowson",
    commentator: "none",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1888",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; mythology review; reference-entry segmentation; colonial framing review",
    notes:
      "Dowson's Hindu mythology and religion dictionary OCR staged as a reference source; entries require terminology review and colonial-era framing must not become app voice.",
  },
  {
    work_id: "vedic_mythology_macdonell_1897_en",
    archive_id: "vedicmythology00macduoft",
    file: "vedicmythology00macduoft_djvu.txt",
    text_name: "Vedic Mythology",
    category: "reference/vedic_mythology",
    tradition_or_sect: "vedic",
    region: "pan_indian",
    translator: "Arthur Anthony Macdonell",
    commentator: "none",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1897",
    difficulty: "Medium",
    review_needed: "legal; OCR review; Vedic review; mythology review; reference segmentation",
    notes:
      "Macdonell's Vedic Mythology OCR staged for deity, hymn, and concept reference support; use as secondary scholarship with dated framing review.",
  },
  {
    work_id: "vedic_reader_macdonell_1917_en",
    archive_id: "vedicreaderforst00macd",
    file: "vedicreaderforst00macd_djvu.txt",
    text_name: "A Vedic Reader for Students",
    category: "veda/reader",
    tradition_or_sect: "vedic",
    region: "pan_indian",
    translator: "Arthur Anthony Macdonell",
    commentator: "none",
    edition: "Internet Archive University of California scan",
    translation_year: "1917",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Vedic review; Sanskrit/English alignment; student-notes boundary review; hymn segmentation",
    notes:
      "Macdonell's Vedic Reader OCR staged for Rigveda hymn selections, vocabulary, and notes; separate Sanskrit text, translation, vocabulary, and grammar before retrieval use.",
  },
  {
    work_id: "religion_philosophy_veda_upanishads_keith_part1_1925_en",
    archive_id: "in.ernet.dli.2015.33654",
    file: "2015.33654.The-Religion-And-Philosophy-Of-The-Veda-And-Upanishads_djvu.txt",
    text_name: "The Religion and Philosophy of the Veda and Upanishads, Part 1",
    category: "secondary/vedic_upanishad",
    tradition_or_sect: "vedic/vedanta",
    region: "pan_indian",
    translator: "Arthur Berriedale Keith",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1925",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Vedic review; Upanishad review; historical framing review; segmentation",
    notes:
      "Keith's Veda and Upanishads study part 1 OCR staged as secondary scholarly context; do not present interpretive claims as scripture or app doctrine.",
  },
  {
    work_id: "religion_philosophy_veda_upanishads_keith_part2_1925_en",
    archive_id: "in.ernet.dli.2015.228867",
    file: "2015.228867.The-Religion_djvu.txt",
    text_name: "The Religion and Philosophy of the Veda and Upanishads, Part 2",
    category: "secondary/vedic_upanishad",
    tradition_or_sect: "vedic/vedanta",
    region: "pan_indian",
    translator: "Arthur Berriedale Keith",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1925",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Vedic review; Upanishad review; historical framing review; segmentation",
    notes:
      "Keith's Veda and Upanishads study part 2 OCR staged as secondary scholarly context; pair with part 1 and source-bound interpretation carefully.",
  },
  {
    work_id: "hindu_mysticism_dasgupta_1927_en",
    archive_id: "hindumysticismsi00dasg_0",
    file: "hindumysticismsi00dasg_0_djvu.txt",
    text_name: "Hindu Mysticism: Six Lectures",
    category: "secondary/mysticism",
    tradition_or_sect: "general/vedanta/yoga",
    region: "pan_indian",
    translator: "Surendranath Dasgupta",
    commentator: "none",
    edition: "Internet Archive University of California scan",
    translation_year: "1927",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; mysticism review; Vedanta/Yoga review; lecture-boundary review; segmentation",
    notes:
      "Dasgupta's Hindu Mysticism lectures OCR staged for cross-tradition conceptual context; keep lecture interpretation separate from primary sources.",
  },
  {
    work_id: "religion_of_veda_bloomfield_1908_en",
    archive_id: "religionveda00bloouoft",
    file: "religionveda00bloouoft_djvu.txt",
    text_name: "The Religion of the Veda",
    category: "secondary/vedic_religion",
    tradition_or_sect: "vedic",
    region: "pan_indian",
    translator: "Maurice Bloomfield",
    commentator: "none",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1908",
    difficulty: "Medium",
    review_needed: "legal; OCR review; Vedic review; historical framing review; segmentation",
    notes:
      "Bloomfield's Vedic religion study OCR staged for historical context from Rigveda to Upanishads; review dated scholarly framing before any user-facing use.",
  },
  {
    work_id: "vedic_index_macdonell_keith_vol1_1912_en",
    archive_id: "vedicindexofname01macduoft",
    file: "vedicindexofname01macduoft_djvu.txt",
    text_name: "Vedic Index of Names and Subjects, Vol. 1",
    category: "reference/vedic_index",
    tradition_or_sect: "vedic",
    region: "pan_indian",
    translator: "Arthur Anthony Macdonell and Arthur Berriedale Keith",
    commentator: "none",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1912",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Vedic review; reference-entry segmentation; terminology review",
    notes:
      "Vedic Index volume 1 OCR staged as a high-value reference source for names, places, and terms; entry-level segmentation and terminology review are required.",
  },
  {
    work_id: "vedic_index_macdonell_keith_vol2_1912_en",
    archive_id: "vedicindexofname02macduoft",
    file: "vedicindexofname02macduoft_djvu.txt",
    text_name: "Vedic Index of Names and Subjects, Vol. 2",
    category: "reference/vedic_index",
    tradition_or_sect: "vedic",
    region: "pan_indian",
    translator: "Arthur Anthony Macdonell and Arthur Berriedale Keith",
    commentator: "none",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1912",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Vedic review; reference-entry segmentation; terminology review",
    notes:
      "Vedic Index volume 2 OCR staged as the companion reference source; entry-level segmentation and cross-volume deduplication are required.",
  },
  {
    work_id: "hindu_feasts_fasts_ceremonies_sastri_1903_en",
    archive_id: "hindufeastsfasts00sastuoft",
    file: "hindufeastsfasts00sastuoft_djvu.txt",
    text_name: "Hindu Feasts, Fasts and Ceremonies",
    category: "practice/festivals",
    tradition_or_sect: "general",
    region: "south_india/pan_indian",
    translator: "S. M. Natesa Sastri",
    commentator: "none",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1903",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; festival review; regional practice review; sensitive practice review; segmentation",
    notes:
      "Natesa Sastri's feasts, fasts, and ceremonies OCR staged for festival/practice context; regional and dated-practice caveats are required before use.",
  },
  {
    work_id: "hindu_fasts_feasts_mukerji_1918_en",
    archive_id: "hindufastsfeasts00muke",
    file: "hindufastsfeasts00muke_djvu.txt",
    text_name: "Hindu Fasts and Feasts",
    category: "practice/festivals",
    tradition_or_sect: "general",
    region: "north_india/pan_indian",
    translator: "Abhay Charan Mukerji",
    commentator: "none",
    edition: "Internet Archive Cornell scan",
    translation_year: "1918",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; festival review; regional practice review; sensitive practice review; segmentation",
    notes:
      "Mukerji's Hindu Fasts and Feasts OCR staged for festival/practice context; distinguish descriptive historical material from guidance.",
  },
  {
    work_id: "prem_sagar_eastwick_1851_en",
    archive_id: "premsgarorocea00chat",
    file: "premsgarorocea00chat_djvu.txt",
    text_name: "The Prem Sagar; or, The Ocean of Love",
    category: "vaishnava/krishna_literature",
    tradition_or_sect: "vaishnava/krishna_bhakti",
    region: "north_india",
    translator: "Edward Backhouse Eastwick",
    commentator: "Chaturbhuj Misr",
    edition: "Internet Archive University of California scan",
    translation_year: "1851",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Vaishnava review; Hindi/English alignment; Bhagavata-derived story review; segmentation",
    notes:
      "Prem Sagar OCR staged for Krishna-bhakti narrative coverage derived from the tenth book of the Bhagavata; separate Hindi text, English translation, notes, and story boundaries before retrieval use.",
  },
  {
    work_id: "panchatantra_ryder_1925_en",
    archive_id: "panchatantra0000arth",
    file: "panchatantra0000arth_djvu.txt",
    text_name: "The Panchatantra",
    category: "story/ethics/niti",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Arthur W. Ryder",
    commentator: "none",
    edition: "Internet Archive scan of 1925 University of Chicago edition",
    translation_year: "1925",
    difficulty: "Medium",
    review_needed: "legal; OCR review; Sanskrit story review; ethics/niti review; segmentation",
    notes:
      "Ryder's Panchatantra OCR staged for Sanskrit story and niti coverage; animal-fable morals must be source-labeled and not treated as scripture.",
  },
  {
    work_id: "hitopadesa_wilkins_1886_en",
    archive_id: "fablesproverbsfr00wilkuoft",
    file: "fablesproverbsfr00wilkuoft_djvu.txt",
    text_name: "Fables and Proverbs from the Sanskrit, Being the Hitopadesa",
    category: "story/ethics/niti",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Charles Wilkins",
    commentator: "none",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1886",
    difficulty: "Medium",
    review_needed: "legal; OCR review; Sanskrit story review; ethics/niti review; segmentation",
    notes:
      "Wilkins's Hitopadesa translation OCR staged for Sanskrit fable and proverb coverage; deduplicate against anthology excerpts already staged.",
  },
  {
    work_id: "psalms_maratha_saints_macnicol_1919_en",
    archive_id: "psalmsofmarathas00macnuoft",
    file: "psalmsofmarathas00macnuoft_djvu.txt",
    text_name: "Psalms of Maratha Saints",
    category: "bhakti/poetry",
    tradition_or_sect: "varkari/marathi_bhakti",
    region: "maharashtra",
    translator: "Nicol Macnicol",
    commentator: "none",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1919",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Marathi bhakti review; poetic translation review; attribution; segmentation",
    notes:
      "Macnicol's translations of one hundred and eight Marathi bhakti hymns OCR staged for Varkari/Maratha saint coverage; poem-level attribution and dated framing review are required.",
  },
  {
    work_id: "bijak_kabir_ahmad_shah_1917_en",
    archive_id: "bijakofkabirtran00kabiuoft",
    file: "bijakofkabirtran00kabiuoft_djvu.txt",
    text_name: "The Bijak of Kabir",
    category: "bhakti/sant",
    tradition_or_sect: "sant/kabir",
    region: "north_india",
    translator: "Ahmad Shah",
    commentator: "Kabir",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1917",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Sant/Kabir review; Hindi/English alignment; poetic translation review; segmentation",
    notes:
      "Ahmad Shah's English Bijak translation OCR staged as a Kabir/Sant source; source-language alignment and sectarian terminology require specialist review.",
  },
  {
    work_id: "kabir_and_kabir_panth_westcott_1907_en",
    archive_id: "kabirkabirpanth00westuoft",
    file: "kabirkabirpanth00westuoft_djvu.txt",
    text_name: "Kabir and the Kabir Panth",
    category: "secondary/bhakti/sant",
    tradition_or_sect: "sant/kabir",
    region: "north_india",
    translator: "George H. Westcott",
    commentator: "none",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1907",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Sant/Kabir review; sectarian context review; colonial/missionary framing review; segmentation",
    notes:
      "Westcott's Kabir Panth study OCR staged as secondary Sant/Kabir context only; separate quoted verses from interpretation and do not present colonial-era framing as app voice.",
  },
  {
    work_id: "life_teaching_tukaram_edwards_1922_en",
    archive_id: "in.ernet.dli.2015.21294",
    file: "2015.21294.The-Life-And-Teaching-Of-Tukaram_djvu.txt",
    text_name: "The Life and Teaching of Tukaram",
    category: "secondary/bhakti/varkari",
    tradition_or_sect: "varkari/marathi_bhakti",
    region: "maharashtra",
    translator: "J. F. Edwards",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1922",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Varkari review; Marathi/English alignment; hagiography boundary review; colonial framing review; segmentation",
    notes:
      "Edwards' Tukaram life-and-teaching source OCR staged as Varkari/Tukaram context; verify translated verse attributions and distinguish biography, teaching summary, and quoted abhang material.",
  },
  {
    work_id: "mystics_ascetics_saints_oman_1905_en",
    archive_id: "mysticsasceticss00oman",
    file: "mysticsasceticss00oman_djvu.txt",
    text_name: "The Mystics, Ascetics, and Saints of India",
    category: "secondary/saints/asceticism",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "John Campbell Oman",
    commentator: "none",
    edition: "Internet Archive University of California scan",
    translation_year: "1905",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; saints/asceticism review; colonial framing review; sensitive practice review; segmentation",
    notes:
      "Oman's study of sadhus, yogis, sanyasis, bairagis, and related groups OCR staged as historical context only; colonial and sensational framing must not become app voice.",
  },
  {
    work_id: "matsya_puranam_taluqdar_vol1_1916_en",
    archive_id: "in.ernet.dli.2015.45856",
    file: "2015.45856.The-Matsya-Puranam_djvu.txt",
    text_name: "The Matsya Puranam, Part 1",
    category: "purana",
    tradition_or_sect: "general/vaishnava",
    region: "pan_indian",
    translator: "A Taluqdar of Oudh",
    commentator: "none",
    edition: "Internet Archive DLI scan, Sacred Books of the Hindus",
    translation_year: "1916",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Purana review; Sanskrit/English alignment; partial-volume boundary review; segmentation",
    notes:
      "Matsya Purana part 1 OCR staged from the Sacred Books of the Hindus translation series; pair with part 2 and verify chapter coverage before retrieval use.",
  },
  {
    work_id: "matsya_puranam_taluqdar_vol2_1917_en",
    archive_id: "in.ernet.dli.2015.45858",
    file: "2015.45858.The-Matsya-Puranam--Pt-2_djvu.txt",
    text_name: "The Matsya Puranam, Part 2",
    category: "purana",
    tradition_or_sect: "general/vaishnava",
    region: "pan_indian",
    translator: "A Taluqdar of Oudh",
    commentator: "none",
    edition: "Internet Archive DLI scan, Sacred Books of the Hindus",
    translation_year: "1917",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Purana review; Sanskrit/English alignment; partial-volume boundary review; segmentation",
    notes:
      "Matsya Purana part 2 OCR staged from the Sacred Books of the Hindus translation series; pair with part 1 and verify chapter coverage before retrieval use.",
  },
  {
    work_id: "brahma_vaivarta_puranam_sen_brahma_prakriti_1920_en",
    archive_id: "dli.csl.4679",
    file: "4679_djvu.txt",
    text_name: "Brahma-Vaivarta Puranam: Brahma and Prakriti Khandas",
    category: "purana/krishna_shakta",
    tradition_or_sect: "vaishnava/shakta",
    region: "pan_indian",
    translator: "Rajendra Nath Sen",
    commentator: "none",
    edition: "Internet Archive Central Secretariat Library scan",
    translation_year: "1920",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Purana review; Krishna/Shakta review; partial-khanda boundary review; Sanskrit/English alignment; segmentation",
    notes:
      "Brahma and Prakriti khandas of the Brahma Vaivarta Purana OCR staged; this is not the complete Purana and must be labeled as partial coverage.",
  },
  {
    work_id: "brahma_vaivarta_puranam_sen_part2_1921_en",
    archive_id:
      "hrir_the-scared-book-of-hindus-edited-major-b-d-basu-volume-xxiv-part-2-brahma-vaivar",
    file: "The Scared book of Hindus Edited  Major B D Basu Volume XXIV Part 2  Brahma Vaivarta Puranam Translared By Rajendra Nath Sen 1921 Allhabad - The Panini Office_djvu.txt",
    text_name: "Brahma-Vaivarta Puranam, Part 2",
    category: "purana/krishna_shakta",
    tradition_or_sect: "vaishnava/shakta",
    region: "pan_indian",
    translator: "Rajendra Nath Sen",
    commentator: "none",
    edition: "Internet Archive Panini Office scan, Sacred Books of the Hindus",
    translation_year: "1921",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Purana review; Krishna/Shakta review; partial-khanda boundary review; Sanskrit/English alignment; segmentation",
    notes:
      "Brahma Vaivarta Purana part 2 OCR staged to extend the existing Brahma/Prakriti khanda coverage; verify khanda boundaries and pair with the other staged parts before retrieval use.",
  },
  {
    work_id: "brahma_vaivarta_puranam_sen_ganesh_khanda_part3_en",
    archive_id: "wqcb_the-brahma-vaivarta-purana-ganesh-khanda-part-3-bahadurgunj-panini-office",
    file: "The Brahma Vaivarta Purana Ganesh Khanda Part 3 Bahadurgunj - Panini Office_djvu.txt",
    text_name: "Brahma-Vaivarta Puranam: Ganesh Khanda, Part 3",
    category: "purana/ganesha/krishna_shakta",
    tradition_or_sect: "ganapatya/vaishnava/shakta",
    region: "pan_indian",
    translator: "Rajendra Nath Sen",
    commentator: "none",
    edition: "Internet Archive Panini Office scan, Sacred Books of the Hindus",
    translation_year: "1921?",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Purana review; Ganesha tradition review; Krishna/Shakta review; Sanskrit/English alignment; segmentation",
    notes:
      "Brahma Vaivarta Purana Ganesh Khanda part 3 OCR staged to fill the Ganesha-related portion of the translation series; title page and exact publication date need review.",
  },
  {
    work_id: "brahma_vaivarta_puranam_sen_part4_1922_en",
    archive_id:
      "guhw_the-sacred-books-of-the-hindus-brahma-vaivarta-puranam-part-4-ed-by-b-d-basu-tra",
    file: "The Sacred Books Of The Hindus Brahma Vaivarta Puranam Part 4 Ed By B D Basu Trans By Rajendra Nath Sen 1922 Allahabd - The Panini Office_djvu.txt",
    text_name: "Brahma-Vaivarta Puranam, Part 4",
    category: "purana/krishna_shakta",
    tradition_or_sect: "vaishnava/shakta",
    region: "pan_indian",
    translator: "Rajendra Nath Sen",
    commentator: "none",
    edition: "Internet Archive Panini Office scan, Sacred Books of the Hindus",
    translation_year: "1922",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Purana review; Krishna/Shakta review; partial-khanda boundary review; Sanskrit/English alignment; segmentation",
    notes:
      "Brahma Vaivarta Purana part 4 OCR staged from the Panini Office Sacred Books of the Hindus series; pair with other staged parts and verify coverage before ingestion.",
  },
  {
    work_id: "vivekachudamani_madhavananda_1921_en",
    archive_id: "vivekachudamanio00sankrich",
    file: "vivekachudamanio00sankrich_djvu.txt",
    text_name: "Vivekachudamani of Sri Sankaracharya",
    category: "vedanta/advaita/prakarana",
    tradition_or_sect: "advaita",
    region: "pan_indian",
    translator: "Swami Madhavananda",
    commentator: "Adi Sankaracharya",
    edition: "Internet Archive microform scan, Advaita Ashrama Himalayan Series",
    translation_year: "1921",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Advaita review; Sanskrit/English alignment; commentary/notes boundary review; segmentation",
    notes:
      "Madhavananda's Vivekachudamani text, translation, notes, and index OCR staged as an Advaita prakarana source; separate Sanskrit text, translation, notes, and index before retrieval use.",
  },
  {
    work_id: "prabodha_chandrodaya_atma_bodha_taylor_1893_en",
    archive_id: "prabdhachandr00krsnrich",
    file: "prabdhachandr00krsnrich_djvu.txt",
    text_name: "Prabodha Chandrodaya and Atma Bodha",
    category: "vedanta/advaita/drama_prakarana",
    tradition_or_sect: "advaita",
    region: "pan_indian",
    translator: "J. Taylor",
    commentator: "Krishna Misra; Adi Sankaracharya",
    edition: "Internet Archive microform scan, second edition",
    translation_year: "1893?",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Advaita review; Sanskrit/Prakrit/English alignment; drama/source-boundary review; segmentation",
    notes:
      "Taylor's translations of Prabodha Chandrodaya and Atma Bodha OCR staged for Advaita allegorical drama and concise prakarana coverage; verify edition date and source boundaries before use.",
  },
  {
    work_id: "bhagavad_gita_besant_bhagavan_das_1905_en",
    archive_id: "wg1100",
    file: "WG1100-1905 -The Bhagavad Gita_djvu.txt",
    text_name: "The Bhagavad Gita",
    category: "gita/translation",
    tradition_or_sect: "general/theosophical",
    region: "pan_indian",
    translator: "Annie Besant and Bhagavan Das",
    commentator: "none",
    edition: "Internet Archive scan, 1905 Theosophical Publishing Society edition",
    translation_year: "1905",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Gita review; theosophical framing review; duplicate Gita translation review; Sanskrit/English alignment; segmentation",
    notes:
      "Besant and Bhagavan Das Bhagavad Gita OCR staged as another early English Gita translation; compare with Arnold, Chatterji, Telang/SBE, Sankara-bhashya, and other staged Gita editions before passage use.",
  },
  {
    work_id: "bhagavad_gita_davies_1889_en",
    archive_id: "hinduphilosophyb00daviuoft",
    file: "hinduphilosophyb00daviuoft_djvu.txt",
    text_name: "Hindu Philosophy: The Bhagavad Gita; or, The Sacred Lay",
    category: "gita/translation",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "John Davies",
    commentator: "none",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1889",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Gita review; colonial framing review; duplicate Gita translation review; Sanskrit/English alignment; segmentation",
    notes:
      "Davies's Bhagavad Gita translation OCR staged as an older English rendering; compare translation choices and introductory framing against other staged Gita sources.",
  },
  {
    work_id: "srimad_bhagavad_gita_swarupananda_1909_en",
    archive_id: "in.ernet.dli.2015.237563",
    file: "2015.237563.Shrimad-Bhagavad_djvu.txt",
    text_name: "Shrimad Bhagavad Gita",
    category: "gita/translation",
    tradition_or_sect: "advaita/ramakrishna",
    region: "pan_indian",
    translator: "Swami Swarupananda",
    commentator: "none",
    edition: "Internet Archive DLI scan, Advaita Ashrama edition",
    translation_year: "1909",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Gita review; Advaita/Ramakrishna lineage review; duplicate Gita translation review; Sanskrit/English alignment; segmentation",
    notes:
      "Swarupananda's Srimad Bhagavad Gita OCR staged as an Advaita Ashrama Gita rendering; duplicate translation review and Sanskrit/English alignment are required before use.",
  },
  {
    work_id: "ramayana_tulsidas_growse_1914_en",
    archive_id: "rmyanaoftuls00tulauoft",
    file: "rmyanaoftuls00tulauoft_djvu.txt",
    text_name: "The Ramayana of Tulsi Das",
    category: "ramayana/bhakti",
    tradition_or_sect: "rama_bhakti",
    region: "north_india",
    translator: "F. S. Growse",
    commentator: "Tulsidas",
    edition: "Internet Archive University of Toronto scan, sixth edition",
    translation_year: "1914",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Rama bhakti review; Awadhi/Hindi/English alignment; edition boundary review; segmentation",
    notes:
      "Growse's English Ramayana of Tulsidas OCR staged for Ramcharitmanas/Rama-bhakti coverage; verify canto/chapter coverage and distinguish translator notes from translated text.",
  },
  {
    work_id: "ekanath_bhaktalilamrita_abbott_1927_en",
    archive_id: "Ekanath.Bhaktalilamrita",
    file: "Ekanath.Bhaktalilamrita_djvu.txt",
    text_name: "Ekanath: A Translation from the Bhaktalilamrita",
    category: "bhakti/hagiography",
    tradition_or_sect: "varkari/marathi_bhakti",
    region: "maharashtra",
    translator: "Justin E. Abbott",
    commentator: "Mahipati",
    edition: "Internet Archive scan, Poet-Saints of Maharashtra No. 2",
    translation_year: "1927",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Marathi bhakti review; hagiography review; source-boundary review; segmentation",
    notes:
      "Abbott's Ekanath translation from Bhaktalilamrita OCR staged for Varkari saint coverage; existing metadata-only lead remains for audit history.",
  },
  {
    work_id: "bhanudas_bhaktavijaya_abbott_1926_en",
    archive_id: "dli.ernet.236982",
    file: "236982-Bhanudas (1926)_djvu.txt",
    text_name: "Bhanudas",
    category: "bhakti/hagiography",
    tradition_or_sect: "varkari/marathi_bhakti",
    region: "maharashtra",
    translator: "Justin E. Abbott",
    commentator: "Mahipati",
    edition: "Internet Archive DLI scan, Poet-Saints of Maharashtra No. 1",
    translation_year: "1926",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Marathi bhakti review; hagiography review; Marathi appendix boundary review; segmentation",
    notes:
      "Abbott's Bhanudas translation from Bhaktavijaya chapters 42-43 OCR staged for Varkari saint coverage; separate English translation from Marathi appendix before retrieval use.",
  },
  {
    work_id: "bahina_bai_autobiography_verses_abbott_1929_en",
    archive_id: "in.ernet.dli.2015.61668",
    file: "2015.61668.The-Poet-saints-Of-Maharashtra-No-5-Bahina-Bai-A-Translation-Of-Her-Autobiography-And-Verses_djvu.txt",
    text_name: "Bahina Bai: A Translation of Her Autobiography and Verses",
    category: "bhakti/autobiography/poetry",
    tradition_or_sect: "varkari/marathi_bhakti",
    region: "maharashtra",
    translator: "Justin E. Abbott",
    commentator: "Bahina Bai",
    edition: "Internet Archive DLI scan, Poet-Saints of Maharashtra No. 5",
    translation_year: "1929",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Marathi bhakti review; women's devotional literature review; autobiography/verse boundary review; segmentation",
    notes:
      "Abbott's Bahina Bai autobiography and selected verses OCR staged for women's Marathi bhakti coverage; preserve autobiography, poem, and translator-note boundaries.",
  },
  {
    work_id: "principles_of_tantra_tantratattva_part1_1914_en",
    archive_id: "dli.bengal.10689.636",
    file: "10689.636_djvu.txt",
    text_name: "Principles of Tantra: Tantratattva, Part 1",
    category: "tantra/shakta",
    tradition_or_sect: "shakta/tantra",
    region: "bengal/pan_indian",
    translator: "Jnanendralal Majumdar",
    commentator: "Shiva Chandra Vidyarnava; Arthur Avalon",
    edition: "Internet Archive DLI Bengal scan",
    translation_year: "1914",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Shakta/Tantra review; practice safety review; source-boundary review; Sanskrit/Bengali/English alignment; segmentation",
    notes:
      "Principles of Tantra part 1 OCR staged as a Shakta/Tantra doctrinal and ritual source; separate translator/editor framing from source text and apply practice-safety review before use.",
  },
  {
    work_id: "principles_of_tantra_tantratattva_part2_1916_en",
    archive_id: "principlesoftant2852bhat",
    file: "principlesoftant2852bhat_djvu.txt",
    text_name: "Principles of Tantra: Tantratattva, Part 2",
    category: "tantra/shakta",
    tradition_or_sect: "shakta/tantra",
    region: "bengal/pan_indian",
    translator: "Jnanendralal Majumdar",
    commentator: "Shiva Chandra Vidyarnava; Arthur Avalon",
    edition: "Internet Archive University of Illinois scan",
    translation_year: "1916",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Shakta/Tantra review; practice safety review; source-boundary review; Sanskrit/Bengali/English alignment; segmentation",
    notes:
      "Principles of Tantra part 2 OCR staged as the companion Tantratattva volume; pair with part 1 and preserve translator/editor/source-text boundaries.",
  },
  {
    work_id: "serpent_power_avalon_1924_en",
    archive_id: "dli.ministry.06283",
    file: "20828.180.JB.92.36_djvu.txt",
    text_name: "The Serpent Power",
    category: "tantra/kundalini_yoga",
    tradition_or_sect: "shakta/tantra/yoga",
    region: "pan_indian",
    translator: "Arthur Avalon",
    commentator: "Purnananda Svami; Kalicharana",
    edition: "Internet Archive DLI Ministry scan, second revised edition",
    translation_year: "1924",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Shakta/Tantra review; Kundalini/Yoga safety review; Sanskrit/English alignment; commentary boundary review; segmentation",
    notes:
      "Avalon's Serpent Power OCR staged for Sat-chakra-nirupana and Paduka-pancaka coverage; practice instructions require strict source-boundary and safety review before any user-facing use.",
  },
  {
    work_id: "garland_of_letters_woodroffe_1922_en",
    archive_id: "in.ernet.dli.2015.274061",
    file: "2015.274061.The-Garland_djvu.txt",
    text_name: "The Garland of Letters",
    category: "tantra/mantra_shastra",
    tradition_or_sect: "shakta/tantra",
    region: "pan_indian",
    translator: "John Woodroffe",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1922",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Shakta/Tantra review; mantra safety review; terminology review; segmentation",
    notes:
      "Woodroffe's Garland of Letters OCR staged for mantra-shastra terminology and theory; do not surface mantra practice guidance without specialist review and safety framing.",
  },
  {
    work_id: "pancaratra_ahirbudhnya_samhita_schrader_1916_en",
    archive_id: "introtothepancar00shcruoft",
    file: "introtothepancar00shcruoft_djvu.txt",
    text_name: "Introduction to the Pancaratra and the Ahirbudhnya Samhita",
    category: "agama/vaishnava/pancaratra",
    tradition_or_sect: "vaishnava/pancaratra",
    region: "pan_indian",
    translator: "F. Otto Schrader",
    commentator: "none",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1916",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Pancaratra review; Vaishnava Agama review; Sanskrit/English alignment; segmentation",
    notes:
      "Schrader's Pancaratra and Ahirbudhnya Samhita introduction OCR staged to fill Vaishnava Agama/Pancaratra coverage; separate descriptive scholarship, translated passages, and source-text references.",
  },
  {
    work_id: "vedanta_desika_narayanacharya_vol1_1917_en",
    archive_id: "gss.srivedantadesika0000knar",
    file: "gss.srivedantadesika0000knar_djvu.txt",
    text_name: "Sri Vedanta Desika, Vol. 1",
    category: "vaishnava/sri_vaishnava/biography_theology",
    tradition_or_sect: "sri_vaishnava",
    region: "south_india",
    translator: "K. Narayanacharya",
    commentator: "none",
    edition: "Internet Archive Gita Press scan",
    translation_year: "1917",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Sri Vaishnava review; biography/source-boundary review; Sanskrit/Tamil/English alignment",
    notes:
      "Narayanacharya's Vedanta Desika volume OCR staged for Sri Vaishnava Acharya coverage; distinguish biography, translation, doctrinal summary, and devotional framing before ingestion.",
  },
  {
    work_id: "hymns_of_alvars_hooper_1929_en",
    archive_id: "in.ernet.dli.2015.164001",
    file: "2015.164001.Hymns-Of-The-Alvars_djvu.txt",
    text_name: "Hymns of the Alvars",
    category: "bhakti/vaishnava/alvar_hymns",
    tradition_or_sect: "sri_vaishnava",
    region: "tamil/south_india",
    translator: "J. S. M. Hooper",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1929",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Sri Vaishnava review; Tamil/English alignment; hymn attribution; segmentation",
    notes:
      "Hooper's English Alvar hymn selections OCR staged to improve Tamil Vaishnava devotional coverage; preserve individual Alvar attribution and avoid treating selections as the full Divya Prabandham.",
  },
  {
    work_id: "chaitanya_upadesh_vol1_1919_en",
    archive_id: "in.ernet.dli.2015.92361",
    file: "2015.92361.Shri-Shri-Chaitanya-upadesh--Vol-1_djvu.txt",
    text_name: "Shri Shri Chaitanya-upadesh, Vol. 1",
    category: "vaishnava/gaudiya/teachings",
    tradition_or_sect: "gaudiya_vaishnava",
    region: "bengal/east_india",
    translator: "Not available in IA metadata",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1919",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Gaudiya Vaishnava review; Bengali/Sanskrit/English alignment; source-boundary review",
    notes:
      "Chaitanya-upadesh volume 1 OCR staged as an additional Gaudiya Vaishnava teachings source; verify translator, edition details, and relation to existing Chaitanya staged sources before ingestion.",
  },
  {
    work_id: "metaphysics_saiva_siddhanta_subramania_pillai_1929_en",
    archive_id: "the-metaphysics-of-the-saiva-siddhanta-system",
    file: "The metaphysics of the Saiva siddhanta system-1929_djvu.txt",
    text_name: "The Metaphysics of the Saiva Siddhanta System",
    category: "secondary/shaiva/saiva_siddhanta",
    tradition_or_sect: "shaiva/saiva_siddhanta",
    region: "tamil/south_indian",
    translator: "K. Subramania Pillai",
    commentator: "none",
    edition: "Internet Archive scan",
    translation_year: "1929",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Saiva Siddhanta review; philosophical terminology review; source-boundary review",
    notes:
      "Subramania Pillai's Saiva Siddhanta metaphysics study OCR staged as secondary doctrinal context; keep category labels clear so argumentation is not treated as scripture.",
  },
  {
    work_id: "siva_jnana_botham_navamoney_david_nadar_1927_en",
    archive_id: "siva-jnana-botham-1927",
    file: "Siva_Jnana_Botham_1927_djvu.txt",
    text_name: "Siva Jnana Botham",
    category: "shaiva/saiva_siddhanta",
    tradition_or_sect: "shaiva/saiva_siddhanta",
    region: "tamil/south_indian",
    translator: "Navamoney David Nadar",
    commentator: "none",
    edition: "Internet Archive scan",
    translation_year: "1927",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Saiva Siddhanta review; Tamil/Sanskrit/English alignment; commentary boundary review; segmentation",
    notes:
      "Navamoney David Nadar's Siva Jnana Botham OCR staged to add a direct Saiva Siddhanta doctrinal text witness; verify Tamil/Sanskrit source boundaries and notes before ingestion.",
  },
  {
    work_id: "sivajnana_siddhiyar_nallaswami_pillai_1913_en",
    archive_id: "sivajnanasiddhiyarofarunandisivacharya1913",
    file: "Sivajnana Siddhiyar of Arunandi Sivacharya-1913_djvu.txt",
    text_name: "Sivajnana Siddhiyar of Arunandi Sivacharya",
    category: "shaiva/saiva_siddhanta",
    tradition_or_sect: "shaiva/saiva_siddhanta",
    region: "tamil/south_indian",
    translator: "J. M. Nallaswami Pillai",
    commentator: "Arunandi Sivacharya",
    edition: "Internet Archive scan",
    translation_year: "1913",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Saiva Siddhanta review; Tamil/Sanskrit/English alignment; commentary boundary review; segmentation",
    notes:
      "Nallaswami Pillai's Sivajnana Siddhiyar translation OCR staged as another direct Saiva Siddhanta source; preserve sutra, translation, commentary, and notes as distinct passage types.",
  },
  {
    work_id: "siddhanta_deepika_complete_14_volumes_1897_1914_en",
    archive_id: "SiddhantaDeepika-Complete14Volumes",
    filesPrefix: "Siddhanta Deepika-Complete 14 volumes/Siddhanta Deepika Volume ",
    text_name: "Siddhanta Deepika: The Light of Truth, Complete 14 Volumes",
    category: "periodical/shaiva/saiva_siddhanta",
    tradition_or_sect: "shaiva/saiva_siddhanta",
    region: "tamil/south_indian",
    translator: "J. M. Nallasami Pillai and contributors",
    commentator: "multiple contributors",
    edition: "Internet Archive composite scan",
    translation_year: "1897-1914",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Saiva Siddhanta review; periodical article attribution; contributor rights review; segmentation",
    notes:
      "Complete Siddhanta Deepika OCR staged as a periodical source for Saiva Siddhanta essays, translations, and debates; article-level attribution, date, and genre labels are mandatory before ingestion.",
  },
  {
    work_id: "samkhya_philosophy_sinha_1915_en",
    archive_id: "thesamkhyaphilos00sinhuoft",
    file: "thesamkhyaphilos00sinhuoft_djvu.txt",
    text_name: "The Samkhya Philosophy",
    category: "darshana/sankhya",
    tradition_or_sect: "sankhya",
    region: "pan_indian",
    translator: "Nandalal Sinha",
    commentator: "Aniruddha; Vijnana Bhiksu; Mahadeva Vedantin",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1915",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Sankhya review; commentary boundary review; Sanskrit/English alignment; segmentation",
    notes:
      "Sinha's Sacred Books of the Hindus Sankhya volume OCR staged as a core darshana source; includes Samkhya-pravachana-sutram, Aniruddha, Vijnana Bhiksu, Tattva-samasa, Samkhya-karika, and Panchasikha material.",
  },
  {
    work_id: "tattva_kaumudi_jha_1896_en",
    archive_id: "anenglishtransla00vaacuoft",
    file: "anenglishtransla00vaacuoft_djvu.txt",
    text_name: "An English Translation, with the Sanskrit Text of the Tattva-Kaumudi",
    category: "darshana/sankhya/commentary",
    tradition_or_sect: "sankhya",
    region: "pan_indian",
    translator: "Ganganatha Jha",
    commentator: "Vachaspati Misra",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1896",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Sankhya review; commentary boundary review; Sanskrit/English alignment; segmentation",
    notes:
      "Jha's English translation of Vachaspati Misra's Tattva-Kaumudi OCR staged as a direct Sankhya-karika commentary source; requires careful separation of Sanskrit text, translation, notes, and glossary material.",
  },
  {
    work_id: "nyaya_sutras_gotama_vidyabhusana_1913_en",
    archive_id: "TheNyayaSutrasOfGotama",
    file: "Vidyabhusana_Nyaya-Sutras_1913_djvu.txt",
    text_name: "The Nyaya Sutras of Gotama",
    category: "darshana/nyaya",
    tradition_or_sect: "nyaya",
    region: "pan_indian",
    translator: "Satis Chandra Vidyabhusana",
    commentator: "Gotama; Vatsyayana and later commentators",
    edition: "Internet Archive CC0 scan",
    translation_year: "1913",
    difficulty: "Hard",
    review_needed: "legal; OCR review; Nyaya review; Sanskrit/English alignment; segmentation",
    notes:
      "Nyaya Sutras OCR staged as a core darshana source; IA metadata marks the item CC0, but public-domain and source-form review are still required.",
  },
  {
    work_id: "vaisesika_sutras_kanada_sinha_1923_en",
    archive_id: "thevaiasesikasut00kanauoft",
    file: "thevaiasesikasut00kanauoft_djvu.txt",
    text_name: "The Vaisesika Sutras of Kanada",
    category: "darshana/vaisesika",
    tradition_or_sect: "vaisesika",
    region: "pan_indian",
    translator: "Nandalal Sinha",
    commentator: "Sankara Misra and other commentators",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1923",
    difficulty: "Hard",
    review_needed: "legal; OCR review; Vaisesika review; Sanskrit/English alignment; segmentation",
    notes:
      "Vaisheshika Sutras OCR staged as a core darshana source; OCR quality and commentary boundaries need review before retrieval use.",
  },
  {
    work_id: "purva_mimamsa_sutras_jaimini_jha_1916_en",
    archive_id: "in.ernet.dli.2015.274358",
    file: "2015.274358.The-Purva_djvu.txt",
    text_name: "The Purva Mimamsa Sutras of Jaimini",
    category: "darshana/mimamsa",
    tradition_or_sect: "purva_mimamsa",
    region: "pan_indian",
    translator: "Ganganath Jha",
    commentator: "Jaimini and classical commentators",
    edition: "Internet Archive DLI scan",
    translation_year: "1916",
    difficulty: "Hard",
    review_needed: "legal; OCR review; Mimamsa review; ritual context; segmentation",
    notes:
      "Purva Mimamsa Sutras OCR staged as a core darshana and ritual-exegesis source; requires specialist context before retrieval use.",
  },
  {
    work_id: "yoga_system_patanjali_woods_1914_en",
    archive_id: "yogasystemofpata00wooduoft",
    file: "yogasystemofpata00wooduoft_djvu.txt",
    text_name: "The Yoga-System of Patanjali",
    category: "darshana/yoga",
    tradition_or_sect: "yoga",
    region: "pan_indian",
    translator: "James Haughton Woods",
    commentator: "Vyasa; Vachaspati Misra",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1914",
    difficulty: "Hard",
    review_needed: "legal; OCR review; Yoga review; commentary boundary review; segmentation",
    notes:
      "Yoga Sutras with Yoga-bhashya and Tattva-vaisaradi material staged as a scholarly complement to the simpler Johnston Project Gutenberg text.",
  },
  {
    work_id: "spanda_karikas_vasu_1913_en",
    archive_id: "thespandakarikas00vasuuoft",
    file: "thespandakarikas00vasuuoft_djvu.txt",
    text_name: "The Spanda Karikas, with the Vivriti of Ramakantha",
    category: "shaiva/kashmir_shaiva",
    tradition_or_sect: "kashmir_shaiva",
    region: "kashmir",
    translator: "S. C. Vasu",
    commentator: "Ramakantha",
    edition: "Internet Archive University of Toronto scan",
    translation_year: "1913",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Kashmir Shaiva review; commentary boundary review; Sanskrit/English alignment; segmentation",
    notes:
      "Spanda Karikas OCR staged to add pre-1931 English Kashmir Shaiva coverage; use only after specialist review and source-text/commentary boundary tagging.",
  },
  {
    work_id: "mahanirvana_tantram_dutt_1900_en",
    archive_id: "in.ernet.dli.2015.61798",
    file: "2015.61798.Manmatha-Nath-Dutt-Mahanirvana-Tantram_djvu.txt",
    text_name: "Mahanirvana Tantram",
    category: "tantra/shakta",
    tradition_or_sect: "shakta/tantric",
    region: "pan_indian",
    translator: "Manmatha Nath Dutt",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1900",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Shakta/Tantra review; ritual/sensitive content review; duplicate Avalon comparison; segmentation",
    notes:
      "Dutt's prose English Mahanirvana Tantra OCR staged as a distinct translation witness from the already staged Avalon/Sacred Texts version; ritual and initiatory material requires strict product-safety review.",
  },
  {
    work_id: "satyarth_prakash_durga_prasad_1908_en",
    archive_id: "in.ernet.dli.2015.237542",
    file: "2015.237542.An-English_djvu.txt",
    text_name: "An English Translation of the Satyarth Prakash",
    category: "modern_hindu_reform/arya_samaj",
    tradition_or_sect: "arya_samaj",
    region: "north_india",
    translator: "Durga Prasad",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1908",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Arya Samaj review; polemical content review; interfaith sensitivity review; segmentation",
    notes:
      "Durga Prasad English Satyarth Prakash OCR staged for Arya Samaj and modern Hindu reform coverage; polemical sections require careful contextual labeling and safety review.",
  },
  {
    work_id: "satyarth_prakash_bharadwaja_1915_en",
    archive_id: "dli.ministry.16408",
    file: "E01584_Light_of_truth__djvu.txt",
    text_name: "Light of Truth: An English Translation of the Satyarth Prakash",
    category: "modern_hindu_reform/arya_samaj",
    tradition_or_sect: "arya_samaj",
    region: "north_india",
    translator: "Chiranjiva Bharadwaja",
    commentator: "none",
    edition: "Internet Archive DLI scan, second edition",
    translation_year: "1915",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Arya Samaj review; polemical content review; interfaith sensitivity review; duplicate-edition comparison; segmentation",
    notes:
      "Bharadwaja's Light of Truth OCR staged as another early English Satyarth Prakash witness; compare against Durga Prasad before retrieval use and avoid presenting sectarian polemic as Dharma Daily voice.",
  },
  {
    work_id: "arya_samaj_lajpat_rai_1915_en",
    archive_id: "the-arya-samaj",
    file: "TheAryaSamaj_djvu.txt",
    text_name: "The Arya Samaj: An Account of Its Origin, Doctrines, and Activities",
    category: "modern_hindu_reform/arya_samaj",
    tradition_or_sect: "arya_samaj",
    region: "north_india",
    translator: "Lajpat Rai",
    commentator: "none",
    edition: "Internet Archive scan, Longmans Green and Co.",
    translation_year: "1915",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Arya Samaj review; biography/history boundary review; dated framing review; segmentation",
    notes:
      "Lajpat Rai's Arya Samaj history OCR staged for reform-movement context and Dayananda biography; label as historical/sectarian context rather than scripture.",
  },
  {
    work_id: "yatindra_mata_dipika_srinivasa_1912_en",
    archive_id: "in.ernet.dli.2015.170080",
    file: "2015.170080.Yatindra-Mata-Dipika-Or-The-Light-Of-The-School-Of-Ramanuja_djvu.txt",
    text_name: "Yatindra-Mata-Dipika, or The Light of the School of Sri Ramanuja",
    category: "vedanta/vishishtadvaita",
    tradition_or_sect: "sri_vaishnava/vishishtadvaita",
    region: "south_india",
    translator: "A. Govindacharya",
    commentator: "Srinivasa",
    edition: "Internet Archive DLI scan",
    translation_year: "1912",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Sri Vaishnava review; Visishtadvaita terminology review; Sanskrit/English alignment; segmentation",
    notes:
      "Yatindra-Mata-Dipika OCR staged to deepen Vishishtadvaita doctrinal coverage beyond Sri Bhashya; verify authorship and edition details from title pages before ingestion.",
  },
  {
    work_id: "philosophy_ramanuja_hebblethwaite_1926_en",
    archive_id: "thephilosophyofr00hebb",
    file: "thephilosophyofr00hebb_djvu.txt",
    text_name: "The Philosophy of Ramanuja with Special Reference to His Theory of the Self",
    category: "secondary/vedanta",
    tradition_or_sect: "sri_vaishnava/vishishtadvaita",
    region: "pan_indian",
    translator: "Harold Willis Hebblethwaite",
    commentator: "none",
    edition: "Internet Archive scan",
    translation_year: "1926",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Sri Vaishnava review; dated-scholarship review; thesis/source-boundary review; segmentation",
    notes:
      "Hebblethwaite's study of Ramanuja OCR staged as secondary context for self/soul doctrine; do not cite as primary scripture or as the tradition's own voice.",
  },
  {
    work_id: "holy_city_benares_sen_1912_en",
    archive_id: "holycitybenares00senrrich",
    file: "holycitybenares00senrrich_djvu.txt",
    text_name: "The Holy City (Benares)",
    category: "practice/pilgrimage",
    tradition_or_sect: "general",
    region: "varanasi/kashi",
    translator: "Rajani Ranjan Sen",
    commentator: "none",
    edition: "Internet Archive scan",
    translation_year: "1912",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; pilgrimage/place review; colonial-era framing review; regional practice review; segmentation",
    notes:
      "Rajani Ranjan Sen's Benares volume OCR staged for Kashi/Varanasi pilgrimage and sacred geography context; verify local practice claims before retrieval use.",
  },
  {
    work_id: "benares_gazetteer_nevill_1909_en",
    archive_id: "in.ernet.dli.2015.181552",
    file: "2015.181552.Benares---A-Gazetteer_djvu.txt",
    text_name: "Benares: A Gazetteer",
    category: "reference/place_history",
    tradition_or_sect: "general",
    region: "varanasi/kashi",
    translator: "H. R. Nevill",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1909",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; place-history review; colonial administrative bias review; caste/social-content review; segmentation",
    notes:
      "Nevill's Benares Gazetteer OCR staged for historical place-reference context only; administrative and colonial framing must be separated from devotional guidance.",
  },
  {
    work_id: "life_ramanujacharya_govindacharya_1906_en",
    archive_id: "in.ernet.dli.2015.22323",
    file: "2015.22323.The-Life-Of-Ramanujacharaya_djvu.txt",
    text_name: "The Life of Ramanujacharya",
    category: "biography/vedanta",
    tradition_or_sect: "sri_vaishnava/vishishtadvaita",
    region: "south_india",
    translator: "A. Govindacharya",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1906",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Sri Vaishnava review; hagiography/history boundary review; copyright notice review; segmentation",
    notes:
      "Govindacharya's Life of Ramanujacharya OCR staged for Sri Vaishnava biography and lineage context; copyright notice and hagiographic framing require review before use.",
  },
  {
    work_id: "bhakti_cult_ancient_india_goswami_1924_en",
    archive_id: "in.ernet.dli.2015.68602",
    file: "2015.68602.The-Bhakti-Cult-In-Ancient-India_djvu.txt",
    text_name: "The Bhakti Cult in Ancient India",
    category: "secondary/bhakti",
    tradition_or_sect: "bhakti/general",
    region: "pan_indian",
    translator: "Bhagwat Kumar Goswami Shastri",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1924",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; bhakti review; dated-scholarship review; Sanskrit/source citation review; segmentation",
    notes:
      "Goswami Shastri's Bhakti Cult in Ancient India OCR staged as secondary context for bhakti development; use as dated scholarship, not primary devotional authority.",
  },
  {
    work_id: "who_is_krishna_saha_1930_en",
    archive_id: "rkas.1263.whoiskrishna0000kshe",
    file: "rkas.1263.whoiskrishna0000kshe_djvu.txt",
    text_name: "Who Is Krishna?",
    category: "secondary/krishna",
    tradition_or_sect: "vaishnava/general",
    region: "pan_indian",
    translator: "Kshetra Lal Saha",
    commentator: "none",
    edition: "Internet Archive scan, Ganesh and Co.",
    translation_year: "1930",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Krishna/Vaishnava review; dated-scholarship review; sensitive tradition-variation review; segmentation",
    notes:
      "Saha's 1930 Krishna study OCR staged for review-first Krishna theology and history context; 1930 publication is likely public domain in the USA as of 2026 but jurisdiction review is still required.",
  },
  {
    work_id: "pancharatra_vaishnava_daily_life_rajagopalachariar_1917_en",
    archive_id: "rajagopalachariar-t.-1917-01-the-pancharatra-and-vaishnava-daily-life-jan-1917-i",
    file: "Rajagopalachariar, T. (1917) '01 The Pancharatra and Vaishnava Daily Life (Jan 1917)' in Vedanta Kesari (The Lion of Vedant_djvu.txt",
    text_name: "The Pancharatra and Vaishnava Daily Life",
    category: "practice/vaishnava",
    tradition_or_sect: "sri_vaishnava/pancharatra",
    region: "south_india",
    translator: "T. Rajagopalachariar",
    commentator: "none",
    edition: "Internet Archive scan of 1917 Vedanta Kesari article",
    translation_year: "1917",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Pancharatra review; practice-safety review; article/source-boundary review; segmentation",
    notes:
      "Rajagopalachariar's Vedanta Kesari article OCR staged for Vaishnava daily-practice context; cite as an article and avoid turning historical practice notes into prescriptive guidance.",
  },
  {
    work_id: "hindu_system_moral_science_sarkar_1912_en",
    archive_id: "cu31924022925402",
    file: "cu31924022925402_djvu.txt",
    text_name: "The Hindu System of Moral Science",
    category: "ethics/secondary",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Kishori Lal Sarkar",
    commentator: "none",
    edition: "Internet Archive Cornell scan, third edition",
    translation_year: "1912",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; ethics review; dated-scholarship review; caste/social-content review; segmentation",
    notes:
      "Sarkar's Hindu moral-science study OCR staged for ethics and self-culture context; use as dated secondary framing, not as universal Hindu doctrine.",
  },
  {
    work_id: "hindu_system_self_culture_sarkar_1902_en",
    archive_id: "dli.ministry.13943",
    file: "E01624_The_Hindu_of_Self_culture_djvu.txt",
    text_name: "The Hindu System of Self-Culture of the Patanjala Yoga Shastra",
    category: "yoga/secondary",
    tradition_or_sect: "yoga",
    region: "pan_indian",
    translator: "Kishori Lal Sarkar",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1902",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Yoga review; practice-safety review; dated-scholarship review; segmentation",
    notes:
      "Sarkar's Patanjala Yoga self-culture study OCR staged for yoga ethics/practice context; avoid surfacing practice instructions without safety and tradition review.",
  },
  {
    work_id: "divine_wisdom_dravida_saints_govindacharya_1902_en",
    archive_id: "divinewisdomofdr00goviiala",
    file: "divinewisdomofdr00goviiala_djvu.txt",
    text_name: "The Divine Wisdom of the Dravida Saints",
    category: "bhakti/sri_vaishnava",
    tradition_or_sect: "sri_vaishnava/alvar",
    region: "south_india",
    translator: "A. Govindacharya",
    commentator: "none",
    edition: "Internet Archive scan",
    translation_year: "1902",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Sri Vaishnava review; Tamil/English alignment; verse attribution; segmentation",
    notes:
      "Govindacharya's Dravida Saints translations OCR staged for Alvar/Sri Vaishnava devotional coverage; verify Tamil source alignment and verse boundaries before retrieval use.",
  },
  {
    work_id: "system_vedanta_deussen_johnston_1912_en",
    archive_id: "dli.csl.3525",
    file: "3525_djvu.txt",
    text_name: "The System of the Vedanta",
    category: "vedanta/secondary",
    tradition_or_sect: "advaita",
    region: "pan_indian",
    translator: "Charles Johnston",
    commentator: "Paul Deussen",
    edition: "Internet Archive DLI scan",
    translation_year: "1912",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Advaita review; dated-scholarship review; Brahma-Sutra commentary boundary review; segmentation",
    notes:
      "Deussen/Johnston Vedanta system OCR staged as secondary Advaita and Brahma-Sutra context; do not cite as primary scripture or tradition-neutral doctrine.",
  },
  {
    work_id: "science_philosophy_religion_vivekananda_1908_en",
    archive_id: "dli.ministry.26988",
    file: "17962.10985-_djvu.txt",
    text_name: "The Science and Philosophy of Religion",
    category: "vedanta/comparative_philosophy",
    tradition_or_sect: "ramakrishna_vedanta/advaita",
    region: "pan_indian",
    translator: "Swami Vivekananda",
    commentator: "none",
    edition: "Internet Archive DLI scan, Udbodhan Office",
    translation_year: "1908",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Ramakrishna-Vedanta review; comparative religion review; quotation/source-boundary review; segmentation",
    notes:
      "Vivekananda comparative study OCR staged for Sankhya/Vedanta and religion-philosophy context; speaker/source boundaries and duplicate Vivekananda passage review remain required.",
  },
  {
    work_id: "high_caste_hindu_woman_ramabai_1887_en",
    archive_id: "highcastehinduwo00ramaiala",
    file: "highcastehinduwo00ramaiala_djvu.txt",
    text_name: "The High-Caste Hindu Woman",
    category: "secondary/social_context",
    tradition_or_sect: "general",
    region: "india",
    translator: "Pandita Ramabai Sarasvati",
    commentator: "Rachel L. Bodley",
    edition: "Internet Archive scan, 1887 Philadelphia edition",
    translation_year: "1887",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; social-history review; caste/gender sensitive content review; missionary/reform framing review; segmentation",
    notes:
      "Pandita Ramabai's social reform text OCR staged for historical context on caste, gender, and Hindu society; use carefully as critique/social history, not as devotional source or universal tradition description.",
  },
  {
    work_id: "holy_lives_azhvars_govindacharya_1902_en",
    archive_id: "holylivesazhvrs00govigoog",
    file: "holylivesazhvrs00govigoog_djvu.txt",
    text_name: "The Holy Lives of the Azhvars, or the Dravida Saints",
    category: "biography/sri_vaishnava",
    tradition_or_sect: "sri_vaishnava/alvar",
    region: "south_india",
    translator: "A. Govindacharya",
    commentator: "none",
    edition: "Internet Archive Google scan",
    translation_year: "1902",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Sri Vaishnava review; hagiography/source-boundary review; Tamil/English alignment; segmentation",
    notes:
      "Govindacharya's Holy Lives of the Azhvars OCR staged as a companion to Divine Wisdom of the Dravida Saints; remove Google boilerplate and verify hagiographic source boundaries before retrieval use.",
  },
  {
    work_id: "hindu_mythology_wilkins_1882_en",
    archive_id: "hindumythologyve00wilk",
    file: "hindumythologyve00wilk_djvu.txt",
    text_name: "Hindu Mythology, Vedic and Puranic",
    category: "reference/mythology",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "W. J. Wilkins",
    commentator: "none",
    edition: "Internet Archive scan, Thacker Spink and Co.",
    translation_year: "1882",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; mythology reference review; missionary/colonial framing review; deity terminology review; segmentation",
    notes:
      "Wilkins' Hindu Mythology OCR staged for deity and mythology reference coverage; label as colonial-era reference context and do not surface missionary framing as app voice.",
  },
  {
    work_id: "indian_wisdom_monier_williams_1893_en",
    archive_id: "cu31924023004785",
    file: "cu31924023004785_djvu.txt",
    text_name: "Indian Wisdom",
    category: "secondary/sanskrit_literature",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Monier Monier-Williams",
    commentator: "none",
    edition: "Internet Archive Cornell scan",
    translation_year: "1893",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Sanskrit literature review; dated-scholarship review; colonial framing review; segmentation",
    notes:
      "Monier-Williams' Indian Wisdom OCR staged for broad Sanskrit literature and Hindu religious/philosophical doctrine context; use as dated secondary anthology, not as primary source authority.",
  },
  {
    work_id: "religious_sects_hindus_wilson_1846_en",
    archive_id: "sketchofreligiou00wils",
    file: "sketchofreligiou00wils_djvu.txt",
    text_name: "Sketch of the Religious Sects of the Hindus",
    category: "secondary/sects",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "H. H. Wilson",
    commentator: "none",
    edition: "Internet Archive Princeton Theological Seminary scan",
    translation_year: "1846",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; sect taxonomy review; colonial/missionary framing review; terminology review; segmentation",
    notes:
      "Wilson's sketch of Hindu sects OCR staged for historical sect taxonomy context; review dated categories and colonial framing before retrieval use.",
  },
  {
    work_id: "hindu_pantheon_moor_1810_en",
    archive_id: "in.gov.ignca.35409",
    file: "35409_djvu.txt",
    text_name: "The Hindu Pantheon",
    category: "reference/iconography",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Edward Moor",
    commentator: "none",
    edition: "Internet Archive IGNCA scan",
    translation_year: "1810",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; iconography review; deity terminology review; colonial framing review; plate/source-boundary review; segmentation",
    notes:
      "Moor's Hindu Pantheon OCR staged for early deity and iconography reference coverage; plate captions and colonial terminology require careful separation before retrieval use.",
  },
  {
    work_id: "history_literature_religion_hindoos_ward_1863_en",
    archive_id: "viewofhistorylit00ward",
    file: "viewofhistorylit00ward_djvu.txt",
    text_name: "A View of the History, Literature, and Religion of the Hindoos",
    category: "secondary/history_customs",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "William Ward",
    commentator: "none",
    edition: "Internet Archive scan, fifth abridged edition",
    translation_year: "1863",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; customs/history review; missionary bias review; caste/social-content review; source-translation boundary review; segmentation",
    notes:
      "Ward's historical customs and religion account OCR staged as dated missionary-era secondary context; do not present its framing as neutral or authoritative.",
  },
  {
    work_id: "hindu_jurisprudence_sen_1918_en",
    archive_id: "in.ernet.dli.2015.24786",
    file: "2015.24786.The-General-Principles-Of-Hindu-Jurisprudence_djvu.txt",
    text_name: "The General Principles of Hindu Jurisprudence",
    category: "dharma_sastra/legal_context",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "Priyanath Sen",
    commentator: "none",
    edition: "Internet Archive DLI scan, Tagore Law Lectures 1909",
    translation_year: "1918",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; dharma-sastra review; jurisprudence review; non-advisory legal labeling; segmentation",
    notes:
      "Sen's Hindu jurisprudence lectures OCR staged for legal-history context around dharma-sastra interpretation; must be labeled historical and non-advisory.",
  },
  {
    work_id: "primer_hinduism_farquhar_1912_en",
    archive_id: "primerofhinduism0000farq",
    file: "primerofhinduism0000farq_djvu.txt",
    text_name: "A Primer of Hinduism",
    category: "secondary/overview",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "J. N. Farquhar",
    commentator: "none",
    edition: "Internet Archive scan, second edition revised and enlarged",
    translation_year: "1912",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; overview/source-boundary review; missionary framing review; dated-scholarship review; segmentation",
    notes:
      "Farquhar's primer OCR staged as a compact dated overview source; use only with explicit missionary-era framing and not as Dharma Daily voice.",
  },
  {
    work_id: "handbook_sanskrit_literature_small_1866_en",
    archive_id: "handbookofsanskr00smal",
    file: "handbookofsanskr00smal_djvu.txt",
    text_name: "A Handbook of Sanskrit Literature",
    category: "secondary/sanskrit_literature",
    tradition_or_sect: "general",
    region: "pan_indian",
    translator: "George Small",
    commentator: "none",
    edition: "Internet Archive scan",
    translation_year: "1866",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Sanskrit literature review; mythology/caste/sect appendix review; missionary framing review; segmentation",
    notes:
      "Small's Sanskrit-literature handbook OCR staged for compact literary, mythology, caste, and sect reference context; review missionary framing and dated terminology before use.",
  },
  {
    work_id: "bhagavad_gita_ramanuja_bhashya_govindacharya_1898_en",
    archive_id: "gita-bhasya",
    file: "A. Govindacharya Svamin - Śrī Bhagavad-gītā with Śrī Rāmānujācārya’s Gītā Bhāṣya_djvu.txt",
    text_name: "Sri Bhagavad-Gita with Sri Ramanujacharya's Gita Bhashya",
    category: "bhagavad_gita/commentary",
    tradition_or_sect: "sri_vaishnava/vishishtadvaita",
    region: "south_india/pan_indian",
    translator: "A. Govindacharya",
    commentator: "Sri Ramanujacharya",
    edition: "Internet Archive scan",
    translation_year: "1898",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Sri Vaishnava review; Gita duplicate review; commentary boundary review; Sanskrit/English alignment; all-rights-reserved notice review; segmentation",
    notes:
      "Govindacharya's English Gita with Ramanuja's Gita Bhashya OCR staged to add Sri Vaishnava/Vishishtadvaita Gita commentary coverage; title-page notice needs legal review before use.",
  },
  {
    work_id: "lectures_bhagavad_gita_bhawani_shankar_1923_en",
    archive_id: "in.ernet.dli.2015.96311",
    file: "2015.96311.Lectures-On-Bhagavad-Gita--Ed-2nd_djvu.txt",
    text_name: "Lectures on Bhagavad Gita",
    category: "bhagavad_gita/secondary",
    tradition_or_sect: "theosophical/modern_vedanta",
    region: "pan_indian",
    translator: "Bhawani Shankar",
    commentator: "Upendra Nath Basu",
    edition: "Internet Archive DLI scan, second edition",
    translation_year: "1923",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Gita review; theosophical framing review; duplicate review; all-rights-reserved notice review; segmentation",
    notes:
      "Bhawani Shankar's lecture series on the Bhagavad Gita OCR staged as modern interpretive context; distinguish lectures from scripture/commentary and review title-page rights notice.",
  },
  {
    work_id: "bhagavad_gita_exposition_rele_1928_en",
    archive_id: "in.ernet.dli.2015.58942",
    file: "2015.58942.Bhagavad-gita-An-Exposition_djvu.txt",
    text_name: "Bhagavad-Gita: An Exposition",
    category: "bhagavad_gita/secondary",
    tradition_or_sect: "general/modern_interpretation",
    region: "western_india/pan_indian",
    translator: "Vasant G. Rele",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1928",
    difficulty: "Medium",
    review_needed:
      "legal; OCR review; Gita review; psycho-philosophy framing review; missing-page review; duplicate review; segmentation",
    notes:
      "Rele's 1928 English exposition of the Bhagavad Gita OCR staged for modern interpretive context; source scan notes missing pages, so completeness must be checked before use.",
  },
  {
    work_id: "one_hundred_poems_tayumanavar_1930_en",
    archive_id: "one-hundred-poems-of-tayumanavar",
    file: "One_hundred_poems_of_Tayumanavar-1930_djvu.txt",
    text_name: "One Hundred Poems of Tayumanavar",
    category: "shaiva/tamil_bhakti",
    tradition_or_sect: "tamil_shaiva",
    region: "tamil/south_india",
    translator: "N. R. Subramania Pillai",
    commentator: "none",
    edition: "Internet Archive scan",
    translation_year: "1930",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Tamil Shaiva review; copyright notice review; Tamil/English alignment; poem attribution review; segmentation",
    notes:
      "English translations of Tayumanavar poems OCR staged to improve Tamil Shaiva devotional coverage; 1930 copyright notice and jurisdiction status require review before ingestion.",
  },
  {
    work_id: "inspirations_saint_tukaram_munge_1930_en",
    archive_id: "in.ernet.dli.2015.62808",
    file: "2015.62808.Inspirations-Of-Saint-Tukaram_djvu.txt",
    text_name: "Inspirations of Saint Tukaram",
    category: "bhakti/varkari",
    tradition_or_sect: "varkari/marathi_bhakti",
    region: "maharashtra/western_india",
    translator: "R. P. Munge",
    commentator: "none",
    edition: "Internet Archive DLI scan",
    translation_year: "1930",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Varkari review; Marathi/English alignment; hagiography/verse boundary review; copyright notice review; segmentation",
    notes:
      "Munge's English Tukaram devotional/context work OCR staged for Varkari bhakti coverage; review verse attribution and copyright notice before use.",
  },
  {
    work_id: "tukaram_bhaktalilamrita_abbott_ch25_40_1930_en",
    archive_id: "tukaramtranslati0000mahi",
    file: "tukaramtranslati0000mahi_djvu.txt",
    text_name: "Tukaram: Translation from Mahipati's Bhaktalilamrita, Chapters 25-40",
    category: "bhakti/varkari",
    tradition_or_sect: "varkari/marathi_bhakti",
    region: "maharashtra/western_india",
    translator: "Justin E. Abbott",
    commentator: "Mahipati",
    edition: "Internet Archive scan",
    translation_year: "1930",
    difficulty: "Hard",
    review_needed:
      "legal; OCR review; Varkari review; Marathi/English alignment; hagiography/source boundary review; copyright notice review; segmentation",
    notes:
      "Abbott's English translation from Mahipati's Bhaktalilamrita chapters on Tukaram OCR staged for Varkari hagiography context; label chapter scope and review copyright notice before use.",
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function writeTextWithRetry(filePath, content, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      writeFileSync(filePath, content, "utf8");
      return;
    } catch (error) {
      lastError = error;
      if (attempt === attempts) throw error;
      await sleep(1000 * attempt);
    }
  }

  throw lastError;
}

async function writeCsv(filePath, headers, rows) {
  const lines = [headers, ...rows].map(serializeCsvLine);
  await writeTextWithRetry(filePath, `${lines.join("\n")}\n`);
}

function rowIndex(headers) {
  return Object.fromEntries(headers.map((header, index) => [header, index]));
}

function existingWorkIds(rows, index) {
  return new Set(rows.map((row) => row[index.work_id]).filter(Boolean));
}

async function fetchWithRetry(url, options, attempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: { "User-Agent": "DharmaDaily source staging", ...options.headers },
      });
      if (response.ok || response.status < 500 || attempt === attempts) return response;
      lastError = new Error(`${url} -> HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === attempts) throw error;
    }

    await sleep(1000 * attempt);
  }

  throw lastError;
}

async function fetchJson(url) {
  const response = await fetchWithRetry(url, {
    signal: AbortSignal.timeout(45_000),
  });
  if (!response.ok) throw new Error(`${url} -> HTTP ${response.status}`);
  return response.json();
}

async function fetchText(url) {
  const response = await fetchWithRetry(url, {
    signal: AbortSignal.timeout(60_000),
  });
  if (!response.ok) throw new Error(`${url} -> HTTP ${response.status}`);
  const text = await response.text();
  if (text.length < 1000) throw new Error(`${url} -> short OCR response (${text.length} bytes)`);
  return text;
}

function archiveDownloadUrl(archiveId, fileName) {
  const encodedPath = fileName.split("/").map(encodeURIComponent).join("/");
  return `https://archive.org/download/${archiveId}/${encodedPath}`;
}

function candidateFiles(candidate, metadata) {
  if (candidate.file) return [candidate.file];
  const matches = metadata.files
    .filter(
      (file) => file.name.startsWith(candidate.filesPrefix) && file.name.endsWith("_djvu.txt"),
    )
    .map((file) => file.name)
    .sort((left, right) => left.localeCompare(right, "en", { numeric: true }));
  if (matches.length === 0) {
    throw new Error(
      `No OCR files found for ${candidate.work_id} with prefix ${candidate.filesPrefix}`,
    );
  }
  return matches;
}

function inventoryRow(candidate) {
  const targetPath = `content/_staging/raw/english/${candidate.work_id}.txt`;
  const sourceUrl = `https://archive.org/details/${candidate.archive_id}`;
  return [
    candidate.work_id,
    candidate.text_name,
    candidate.category,
    candidate.tradition_or_sect,
    candidate.region,
    "English",
    "Roman/OCR",
    candidate.translator,
    candidate.commentator,
    candidate.edition,
    candidate.translation_year,
    "Internet Archive",
    sourceUrl,
    "scan_ocr",
    "TXT/JSON metadata",
    "Internet Archive scan metadata; public-domain edition likely; IA terms apply",
    "1930-or-earlier publication; public domain in USA likely as of 2026; verify jurisdiction and scan status",
    "Yes for staging",
    "Yes after review",
    "Yes after OCR/legal review",
    "Yes, can ingest after OCR cleanup/legal/content review",
    `Credit Internet Archive, source library, and ${candidate.translator}; preserve archive identifier`,
    "Yes if public-domain status applies in deployment jurisdiction",
    "No for public-domain edition; scan terms still need review",
    "Medium",
    candidate.difficulty,
    candidate.review_needed,
    `${candidate.notes} OCR staged at ${targetPath} on ${stagedDate}; IA metadata sidecar staged beside it.`,
    "staged_candidate",
  ];
}

function queueRow(candidate) {
  const sourceUrl = `https://archive.org/details/${candidate.archive_id}`;
  const targetPath = `content/_staging/raw/english/${candidate.work_id}.txt`;
  return [
    candidate.work_id,
    candidate.text_name,
    "English",
    "Internet Archive",
    sourceUrl,
    `https://archive.org/metadata/${candidate.archive_id}`,
    targetPath,
    "1930-or-earlier publication likely public domain in USA as of 2026; IA scan terms and OCR quality need review",
    "downloaded_staged",
    `Internet Archive OCR TXT and metadata JSON staged on ${stagedDate}; review before ingestion.`,
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
  const metadataPath = path.join(outputDir, `${candidate.work_id}.metadata.json`);
  let metadata;

  if (existsSync(targetPath) && existsSync(metadataPath)) {
    skippedFiles += 1;
  } else {
    metadata = await fetchJson(`https://archive.org/metadata/${candidate.archive_id}`);
    const files = candidateFiles(candidate, metadata);
    const parts = [];

    for (const fileName of files) {
      console.log(`downloading ${candidate.work_id}: ${fileName}`);
      const text = await fetchText(archiveDownloadUrl(candidate.archive_id, fileName));
      parts.push(`\n\n===== Internet Archive OCR: ${fileName} =====\n\n${text}`);
    }

    await writeTextWithRetry(targetPath, parts.join("\n").trimStart());
    await writeTextWithRetry(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
    downloaded += 1;
  }

  if (!inventoryIds.has(candidate.work_id)) {
    inventory.rows.push(inventoryRow(candidate));
    inventoryIds.add(candidate.work_id);
    inventoryAppended += 1;
  }

  if (!queueIds.has(candidate.work_id)) {
    queue.rows.push(queueRow(candidate));
    queueIds.add(candidate.work_id);
    queueAppended += 1;
  }
}

await writeCsv(inventoryPath, inventory.headers, inventory.rows);
await writeCsv(queuePath, queue.headers, queue.rows);

console.log(`candidate count: ${candidates.length}`);
console.log(`files downloaded: ${downloaded}`);
console.log(`files already present: ${skippedFiles}`);
console.log(`inventory rows appended: ${inventoryAppended}`);
console.log(`queue rows appended: ${queueAppended}`);

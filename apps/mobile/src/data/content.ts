import {
  additionalConcepts,
  additionalDailyReflections,
  additionalPractices,
  type AppAuthoredReflection,
} from "./appAuthoredCatalog";

import { dayOfYear, localDateKey } from "@/lib/activity";
import type { Concept, Deity, Festival, Practice, SacredText } from "@/types/content";

export const dailyReflection = {
  // Keep fallback IDs UUID-shaped because saved_items.item_id is a UUID and
  // guest saves may be migrated when the user signs in later.
  id: "00000000-0000-0000-0000-000000000301",
  eyebrow: "A reflection on action and care",
  title: "Give yourself fully to the action, then soften your grip on the outcome.",
  body: "Today, choose one responsibility that matters. Meet it with care and attention—not because you can control every result, but because the quality of your action is yours to shape.",
  practicePrompt:
    "Choose one responsibility. Before you begin, take a breath and name the care you want to bring to it.",
  prompt: "What is one action I can do with care today, without demanding a particular result?",
  isPremium: false,
};

/** Thirty rotating, app-authored reflections keep the offline experience useful for a month. */
export const dailyReflections: AppAuthoredReflection[] = [
  dailyReflection,
  ...additionalDailyReflections,
];

export function getFallbackDailyReflection(date = new Date()): AppAuthoredReflection {
  const currentDay = dayOfYear(localDateKey(date));
  return dailyReflections[currentDay % dailyReflections.length];
}

const starterFestivals: Festival[] = [
  {
    id: "00000000-0000-0000-0000-000000000402",
    name: "Guru Purnima",
    date: "2026-07-29",
    dayLabel: "29",
    monthLabel: "JUL",
    summary: "A day of gratitude for teachers and the lineages of learning.",
    meaning:
      "Guru Purnima honours teachers—spiritual and otherwise—who help remove confusion and illuminate understanding.",
    observance: [
      "Offer gratitude to a teacher or mentor",
      "Read or revisit a teaching that shaped you",
      "Make a quiet act of service",
    ],
    variationNote:
      "Observances differ by lineage, region, and family. Buddhist and Jain communities also mark this full moon in distinct ways.",
    color: "#7F6278",
  },
  {
    id: "00000000-0000-0000-0000-000000000403",
    name: "Raksha Bandhan",
    date: "2026-08-28",
    dayLabel: "28",
    monthLabel: "AUG",
    summary: "A celebration of care, protection, and sibling bonds.",
    meaning: "Raksha Bandhan centres on a bond of mutual care, often symbolised by tying a rakhi.",
    observance: [
      "Share a rakhi or message of care",
      "Offer sweets",
      "Reflect on mutual responsibility",
    ],
    variationNote:
      "The relationship celebrated and the ritual details vary widely across communities.",
    color: "#D97824",
  },
  {
    id: "00000000-0000-0000-0000-000000000404",
    name: "Krishna Janmashtami",
    variant: "Gokulashtami",
    date: "2026-09-04",
    dayLabel: "04",
    monthLabel: "SEP",
    summary: "Celebrating the birth of Krishna through devotion, song, and story.",
    meaning:
      "Janmashtami remembers Krishna’s birth and the divine presence expressed through love, play, courage, and dharma.",
    observance: [
      "Read a Krishna story",
      "Sing or listen to bhajans",
      "Prepare a simple offering if this is part of your tradition",
    ],
    variationNote:
      "Fasting, midnight worship, temple customs, and calendar dates vary by region and sampradaya.",
    color: "#6D8C71",
  },
  {
    id: "00000000-0000-0000-0000-000000000401",
    name: "Diwali",
    variant: "Deepavali",
    date: "2026-11-08",
    dayLabel: "08",
    monthLabel: "NOV",
    summary: "A festival of light observed through stories, worship, generosity, and renewal.",
    meaning:
      "Diwali is understood differently across communities, including celebrations connected with Rama, Lakshmi, Krishna, or Kali.",
    observance: [
      "Light a diya safely if this is part of your practice",
      "Offer gratitude or a prayer in your own tradition",
      "Share food, generosity, or a kind act",
    ],
    variationNote:
      "Names, dates, stories, fasting, and observances vary by region, calendar method, and tradition.",
    color: "#D97824",
  },
];

function festivalGuide(
  id: string,
  name: string,
  summary: string,
  meaning: string,
  observance: string[],
  variationNote: string,
  options: Pick<Festival, "variant" | "isPremium"> = {},
): Festival {
  return {
    id,
    name,
    date: null,
    dayLabel: "—",
    monthLabel: "GUIDE",
    summary,
    meaning,
    observance,
    variationNote,
    color: "#7F6278",
    ...options,
  };
}

/** Festival explainers remain available while local dates are calculated by the backend. */
const additionalFestivalGuides: Festival[] = [
  festivalGuide(
    "00000000-0000-0000-0000-000000000405",
    "Maha Shivaratri",
    "A night of devotion, remembrance, and attention associated with Shiva.",
    "Maha Shivaratri is observed through prayer, vigil, fasting, mantra, and stories in different Shaiva and wider Hindu communities.",
    [
      "Learn which observance your family or temple follows",
      "Offer a quiet prayer or act of service",
      "Avoid fasting unless it is safe and appropriate for you",
    ],
    "Fasting, night vigils, dates, and forms of worship vary by region, sampradaya, health, and family custom.",
    { variant: "Shivratri" },
  ),
  festivalGuide(
    "00000000-0000-0000-0000-000000000406",
    "Holi",
    "A spring festival associated with colour, community, stories, and renewal.",
    "Holi includes several regional histories and observances, including Holika Dahan and celebrations of Krishna in some communities.",
    [
      "Join only celebrations where consent and safety are respected",
      "Offer a greeting or colour-free act of welcome",
      "Learn the local story before assuming one meaning",
    ],
    "Names, stories, timing, colours, food, and public customs differ widely across regions and communities.",
  ),
  festivalGuide(
    "00000000-0000-0000-0000-000000000407",
    "Navaratri",
    "Nine nights of devotion and reflection connected with forms of the divine feminine.",
    "Navaratri may honour Durga, Lakshmi, Saraswati, or other forms and can include dance, music, fasting, worship, and community gatherings.",
    [
      "Choose a form of observance that belongs to your tradition",
      "Make space for learning, music, or service",
      "Treat fasting as optional and seek medical advice when relevant",
    ],
    "The nine nights, deities, stories, foods, dances, and dates vary by region and lineage.",
    { isPremium: true },
  ),
  festivalGuide(
    "00000000-0000-0000-0000-000000000408",
    "Durga Puja",
    "A major celebration of Durga through image worship, story, art, music, and community.",
    "Durga Puja is especially associated with Bengal and eastern India, while related celebrations appear in many places with distinct forms and meanings.",
    [
      "Visit or learn from a community celebration respectfully",
      "Read a regional account of the festival",
      "Offer service or generosity alongside celebration",
    ],
    "Iconography, days, rituals, food, language, and community roles vary by region and temple tradition.",
    { isPremium: true },
  ),
  festivalGuide(
    "00000000-0000-0000-0000-000000000409",
    "Vijayadashami",
    "A day of victory, completion, and the return of learning or responsibility.",
    "Vijayadashami is connected with different stories, including Rama’s victory and Durga’s triumph, and is also a time for beginning study or honouring tools in some regions.",
    [
      "Ask which story your family or community centres",
      "Express gratitude for a skill or teacher",
      "Begin one responsible project with care",
    ],
    "The name, story, date, and observances differ across regions and traditions.",
    { variant: "Dussehra" },
  ),
  festivalGuide(
    "00000000-0000-0000-0000-000000000410",
    "Ganesha Chaturthi",
    "A celebration of Ganesha through welcome, prayer, creativity, and community.",
    "Ganesha Chaturthi may include bringing a murti home or to a public celebration, offering food, singing, and a later farewell that reflects local custom.",
    [
      "Learn the environmental and community practices of the celebration near you",
      "Offer a simple act of welcome or learning",
      "Follow local guidance for immersion and materials",
    ],
    "Duration, foods, images, processions, immersion, and home observances vary by place and family.",
  ),
  festivalGuide(
    "00000000-0000-0000-0000-000000000411",
    "Vasant Panchami",
    "A festival associated with learning, music, spring, and Saraswati in many communities.",
    "Vasant Panchami can be a time to honour knowledge, creative work, teachers, and the arrival of spring, with regional forms of worship and celebration.",
    [
      "Thank a teacher or mentor",
      "Spend a few minutes studying or making music",
      "Place learning before display or performance",
    ],
    "The deity focus, colours, offerings, and educational customs differ by region and lineage.",
    { variant: "Saraswati Puja" },
  ),
  festivalGuide(
    "00000000-0000-0000-0000-000000000412",
    "Makar Sankranti",
    "A solar festival connected with seasonal transition, harvest, and generosity.",
    "Makar Sankranti is observed across India under many regional names and customs, including food sharing, bathing, flying kites, and honouring the sun.",
    [
      "Learn the regional name used by your family",
      "Share seasonal food safely and generously",
      "Offer gratitude for light, land, and labour",
    ],
    "The calendar date is solar but customs, names, foods, and associated observances vary by region.",
  ),
  festivalGuide(
    "00000000-0000-0000-0000-000000000413",
    "Pongal",
    "A Tamil harvest festival of gratitude, abundance, family, and the natural world.",
    "Pongal includes several days with distinct practices, including honouring the sun, cattle, household life, and community relationships.",
    [
      "Learn the meaning of the day your household observes",
      "Offer thanks to farmers and the natural world",
      "Prepare or share food according to local custom",
    ],
    "Days, dishes, decorations, names, and ritual emphasis differ across Tamil communities and locations.",
    { variant: "Thai Pongal" },
  ),
  festivalGuide(
    "00000000-0000-0000-0000-000000000414",
    "Onam",
    "A Kerala festival of welcome, harvest, community, and stories of Mahabali.",
    "Onam is celebrated through food, flowers, games, arts, and narratives whose meanings are held differently by communities and families.",
    [
      "Learn the story and regional history before simplifying it",
      "Share a meal or act of welcome",
      "Make space for community without excluding others",
    ],
    "The story, religious emphasis, food, pookalam, and public celebration differ across Kerala communities and the diaspora.",
  ),
  festivalGuide(
    "00000000-0000-0000-0000-000000000415",
    "Rama Navami",
    "A celebration connected with Rama, dharma, story, devotion, and moral imagination.",
    "Rama Navami may include reading, singing, temple worship, fasting, and retellings of Rama’s life, with different interpretations of the stories and ideals involved.",
    [
      "Read a version of the story with its translator or tradition named",
      "Reflect on one quality the story asks you to examine",
      "Avoid treating one retelling as the only Hindu view",
    ],
    "Dates, stories, ritual forms, and theological interpretations differ among regions, texts, and traditions.",
  ),
  festivalGuide(
    "00000000-0000-0000-0000-000000000416",
    "Hanuman Jayanti",
    "A celebration of Hanuman through devotion, courage, service, and remembrance.",
    "Hanuman is approached in many communities through stories, recitation, temple worship, music, and acts of service.",
    [
      "Learn which regional story or form your community follows",
      "Offer help without seeking recognition",
      "Choose recitation only when it belongs to your practice",
    ],
    "The date, story, iconography, recitations, and observances vary by region and calendar tradition.",
  ),
  festivalGuide(
    "00000000-0000-0000-0000-000000000417",
    "Akshaya Tritiya",
    "A day regarded by many communities as favourable for generosity, learning, or beginning work.",
    "Akshaya Tritiya carries different stories and practices across regions. It is often associated with giving, auspicious beginnings, and seasonal or devotional observance.",
    [
      "Choose generosity over unnecessary buying",
      "Begin one modest project with clear intention",
      "Check your family or regional calendar for the day’s customs",
    ],
    "The stories, commercial meanings, rituals, and regional importance vary; auspiciousness is not a guarantee of an outcome.",
  ),
  festivalGuide(
    "00000000-0000-0000-0000-000000000418",
    "Govardhan Puja",
    "A celebration of protection, community, gratitude, and Krishna in many Vaishnava settings.",
    "Govardhan Puja is linked with stories of Krishna and the people of Vraja, with food offerings and local practices that express gratitude for land and sustenance.",
    [
      "Offer thanks for food, land, and those who care for it",
      "Learn the version of the story your tradition tells",
      "Share food without waste",
    ],
    "The story, food forms, timing, and devotional emphasis differ among Vaishnava and regional communities.",
  ),
  festivalGuide(
    "00000000-0000-0000-0000-000000000419",
    "Bhai Dooj",
    "A festival of sibling care, welcome, blessings, and mutual responsibility.",
    "Bhai Dooj is observed through visits, food, gifts, and blessings, with related regional festivals carrying different names and stories.",
    [
      "Contact a sibling or chosen family member with care",
      "Offer a blessing without making the relationship transactional",
      "Include people whose family structures differ from the traditional story",
    ],
    "Names, rituals, foods, and the relationships celebrated vary across regions and households.",
    { variant: "Bhai Phota" },
  ),
  festivalGuide(
    "00000000-0000-0000-0000-000000000420",
    "Ekadashi",
    "A recurring devotional observance marked by many communities through prayer, restraint, and remembrance.",
    "Ekadashi is connected with the eleventh lunar day and is observed in diverse ways, especially in Vaishnava traditions. It may include fasting, but fasting is not appropriate for everyone.",
    [
      "Follow your family or teacher’s guidance rather than an internet rule",
      "Choose prayer, study, or generosity if fasting is unsuitable",
      "Seek qualified medical advice for health conditions or medication",
    ],
    "Dates, foods, rules, names, and theological significance vary; never treat fasting as a test of spiritual worth.",
    { isPremium: true },
  ),
  festivalGuide(
    "00000000-0000-0000-0000-000000000421",
    "Mahalaya Amavasya",
    "A day associated in many communities with remembrance, ancestors, and transition into a festival season.",
    "Mahalaya observances can include remembrance, recitation, offerings, and regional stories. Families may follow different customs or not observe the day.",
    [
      "Ask family elders about the practice before adopting it",
      "Remember loved ones through a safe and respectful act",
      "Do not assume one ancestor practice applies to every household",
    ],
    "The name, date, recitations, offerings, and relationship to Navaratri vary by region and tradition.",
  ),
];

export const festivals: Festival[] = [...starterFestivals, ...additionalFestivalGuides];

const starterPractices: Practice[] = [
  {
    id: "00000000-0000-0000-0000-000000000503",
    title: "Three-breath return",
    category: "Meditation",
    durationMinutes: 2,
    level: "Beginner",
    summary: "A small pause to notice the breath and return to the present moment.",
    steps: [
      "Sit in a comfortable, steady position.",
      "Let your breathing stay natural.",
      "Notice each inhale and exhale without forcing it.",
      "When the mind wanders, return gently to the breath.",
      "End by naming one quality you want to carry forward.",
    ],
  },
  {
    id: "00000000-0000-0000-0000-000000000501",
    title: "Morning Diya Lighting",
    category: "Puja",
    durationMinutes: 5,
    level: "Beginner",
    summary: "A simple home practice using light as a reminder of clarity and presence.",
    steps: [
      "Place the diya on a stable, heat-safe surface.",
      "Take a quiet moment to settle.",
      "Light the wick safely.",
      "Offer a short prayer, mantra, or silent intention.",
      "Remain for a few breaths, then extinguish safely if it cannot be supervised.",
    ],
    materials: ["Diya or oil lamp", "Wick", "Oil or ghee", "Matches or lighter", "Heat-safe plate"],
    traditionNote:
      "Customs around direction, timing, oil, and accompanying prayers vary. Follow your family or teacher’s practice where relevant.",
    warnings:
      "Never leave a flame unattended. Keep diyas away from children, pets, curtains, and other flammable materials, and extinguish them fully before leaving.",
  },
  {
    id: "00000000-0000-0000-0000-000000000504",
    title: "Evening gratitude reflection",
    category: "Reflection",
    durationMinutes: 4,
    level: "Beginner",
    summary: "Close the day by noticing what supported you and where you can respond with care.",
    steps: [
      "Recall one moment of support.",
      "Name one action you are grateful you took.",
      "Notice one place where you can make amends or try again.",
      "Write a single intention for tomorrow.",
    ],
  },
  {
    id: "00000000-0000-0000-0000-000000000505",
    title: "A simple repetition practice",
    category: "Mantra",
    durationMinutes: 5,
    level: "Beginner",
    summary: "A quiet repetition practice grounded in your own family, teacher, or intention.",
    steps: [
      "Sit comfortably and let your breathing remain natural.",
      "If you have a mantra or sacred name from your family or teacher, use that; otherwise choose a short word or phrase meaningful to you.",
      "Repeat it gently, aloud or silently, at a pace that feels steady.",
      "When attention wanders, return without scolding yourself.",
      "Close with one quiet breath and carry the quality of the practice into your next action.",
    ],
    traditionNote:
      "Mantra, japa, names of the divine, initiation, pronunciation, and counting customs differ across traditions. This is a general introduction, not lineage-specific instruction.",
  },
  {
    id: "00000000-0000-0000-0000-000000000502",
    title: "An evening practice of return",
    category: "Reflection",
    durationMinutes: 10,
    level: "Intermediate",
    summary: "Review the day without turning mistakes into a permanent identity.",
    steps: [
      "Let the day settle before reviewing it.",
      "Name one action that reflected care.",
      "Name one moment you would handle differently.",
      "Choose a repair or a small experiment for tomorrow.",
      "Close with three natural breaths and let the review end.",
    ],
    traditionNote:
      "This is an app-authored reflective exercise. Families, teachers, and traditions may use different evening practices.",
    isPremium: true,
  },
];

export const practices: Practice[] = [...starterPractices, ...additionalPractices];

const starterConcepts: Concept[] = [
  {
    id: "00000000-0000-0000-0000-000000000701",
    term: "Dharma",
    sanskrit: "धर्म",
    definition:
      "A layered idea involving duty, ethics, right conduct, order, and the way of living that sustains life.",
    explanation:
      "Dharma does not have one English equivalent. Its meaning changes with context: it can point to moral responsibility, the nature of a thing, social and personal duty, teaching, or the sustaining order of life.",
    variationNote:
      "Different philosophical schools, texts, communities, and modern teachers emphasise different dimensions of dharma.",
  },
  {
    id: "00000000-0000-0000-0000-000000000702",
    term: "Karma",
    sanskrit: "कर्म",
    definition: "Action and its consequences—not a simple system of instant reward and punishment.",
    explanation:
      "Karma literally relates to action. Hindu traditions explore how intention, action, habit, and consequence shape experience across time. It is usually more nuanced than the popular phrase “what goes around comes around.”",
    variationNote:
      "Accounts of how karma operates differ across Hindu philosophies and are also distinct in Buddhist and Jain traditions.",
  },
  {
    id: "00000000-0000-0000-0000-000000000703",
    term: "Bhakti",
    sanskrit: "भक्ति",
    definition: "A path and disposition of loving devotion toward the divine.",
    explanation:
      "Bhakti can be expressed through remembrance, song, prayer, ritual, service, storytelling, and a personal relationship with a chosen form of the divine.",
    variationNote:
      "Bhakti traditions differ greatly in theology, deity focus, poetry, ritual, and the relationship they describe between devotee and divine.",
  },
  {
    id: "00000000-0000-0000-0000-000000000704",
    term: "Seva",
    sanskrit: "सेवा",
    definition: "Service offered with care, often without seeking personal reward.",
    explanation:
      "Seva can be an everyday ethical practice, community work, temple service, care for family, or service offered as spiritual discipline.",
    variationNote:
      "What counts as seva and how it relates to devotion, duty, and community differs across traditions and contexts.",
  },
];

export const concepts: Concept[] = [...starterConcepts, ...additionalConcepts];

export const deities: Deity[] = [
  {
    id: "00000000-0000-0000-0000-000000000601",
    name: "Ganesha",
    otherNames: ["Ganapati", "Vighneshvara"],
    shortDescription:
      "A widely loved deity associated with wisdom, beginnings, and removing obstacles.",
    fullDescription:
      "Ganesha is approached in many Hindu communities as a source of discernment, welcome, and steadiness at the start of an undertaking. Stories, forms, names, and devotional practices vary across regions and lineages; this short introduction is a starting point, not a complete theology.",
    traditions: ["general", "smarta", "shaiva"],
  },
  {
    id: "00000000-0000-0000-0000-000000000602",
    name: "Lakshmi",
    otherNames: ["Shri", "Mahalakshmi"],
    shortDescription:
      "A goddess associated with prosperity, beauty, generosity, and auspiciousness.",
    fullDescription:
      "Lakshmi is honoured in many traditions through prayers, festivals, household observances, and acts of generosity. Prosperity can mean material wellbeing, but traditions also connect Lakshmi with virtue, beauty, nourishment, and flourishing. Practices and theological emphasis differ by community.",
    traditions: ["general", "vaishnava", "shakta"],
  },
  {
    id: "00000000-0000-0000-0000-000000000603",
    name: "Saraswati",
    otherNames: ["Vani", "Sharada"],
    shortDescription: "A goddess associated with learning, language, music, and the arts.",
    fullDescription:
      "Saraswati is remembered by many communities in connection with knowledge, eloquence, music, study, and creative work. Students, artists, and teachers may honour her in different ways, especially around regional celebrations of learning.",
    traditions: ["general", "shakta"],
  },
  {
    id: "00000000-0000-0000-0000-000000000604",
    name: "Shiva",
    otherNames: ["Mahadeva", "Shankara", "Rudra"],
    shortDescription:
      "A major deity understood in diverse ways across Shaiva and wider Hindu traditions.",
    fullDescription:
      "Shiva may be approached as the compassionate Lord, the ascetic, the dancer, the inner self, or the supreme reality, depending on the tradition and text. The many forms associated with Shiva are not interchangeable across every community, so learning is best grounded in the lineage or practice being discussed.",
    traditions: ["general", "shaiva", "smarta"],
  },
  {
    id: "00000000-0000-0000-0000-000000000605",
    name: "Vishnu",
    otherNames: ["Narayana", "Hari"],
    shortDescription:
      "A major deity associated with preservation and the many forms of divine care.",
    fullDescription:
      "Vishnu is understood as the preserver or sustainer in many Hindu frameworks, and is worshipped directly as well as through forms such as Rama and Krishna. Vaishnava traditions differ in how they describe Vishnu, his manifestations, and the relationship between the divine and the devotee.",
    traditions: ["general", "vaishnava", "smarta"],
  },
];

export const suggestedQuestions = [
  "How do I start reconnecting with Hinduism?",
  "What does dharma mean in daily life?",
  "How can I begin a simple home practice?",
  "How do different traditions understand karma?",
];

export const sacredTexts: SacredText[] = [
  {
    id: "00000000-0000-0000-0000-000000000101",
    title: "Bhagavad Gita",
    sanskrit: "भगवद्गीता",
    category: "Smriti",
    description:
      "A dialogue on action, discernment, devotion, and the nature of a life lived with purpose.",
    estimatedDate: "Traditionally situated within the Mahabharata",
    tradition: "general",
  },
  {
    id: "00000000-0000-0000-0000-000000000102",
    title: "Principal Upanishads",
    sanskrit: "उपनिषद्",
    category: "Shruti",
    description:
      "Philosophical and contemplative teachings exploring self, reality, knowledge, and liberation.",
    estimatedDate: "A body of texts composed across many centuries",
    tradition: "general",
  },
  {
    id: "00000000-0000-0000-0000-000000000103",
    title: "Yoga Sutras of Patanjali",
    sanskrit: "योगसूत्र",
    category: "Classical yoga",
    description:
      "A concise framework for yoga, attention, ethical discipline, meditation, and freedom from suffering.",
    estimatedDate: "Often dated to the early centuries CE",
    tradition: "general",
  },
];

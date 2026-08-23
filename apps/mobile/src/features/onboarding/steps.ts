import type { OnboardingAnswers, OnboardingStep } from "./types";

import { householdPracticeOptions } from "@/lib/practices";

// The onboarding flow, as data. Order here is screen order; `when` predicates
// remove branch steps that do not apply. Copy is a function wherever an
// earlier answer should change it — that is the point of asking in sequence.
//
// Standing rules that shaped this file (CLAUDE.md):
// - household practice, never sampradāya, is the identity question
// - no universals ("Hindus do…"), no persona, no deity-named features
// - every option's consequence is stated on the screen that asks it

export const ONBOARDING_VERSION = 2;

export const onboardingSteps: OnboardingStep[] = [
  { id: "welcome", kind: "welcome" },

  {
    id: "intent",
    kind: "single",
    answerKey: "intent",
    title: "What brings you here?",
    subtitle: "This sets where your home screen begins.",
    options: [
      { value: "practice", label: "A small daily practice", detail: "A few minutes, most days" },
      {
        value: "understand",
        label: "To understand what my family does",
        detail: "The lamp, the fasts, the prayers — and why",
      },
      {
        value: "read",
        label: "To read the scriptures properly",
        detail: "Verse by verse, with the words explained",
      },
      {
        value: "explore",
        label: "I'm curious, starting from scratch",
        detail: "No background needed",
      },
    ],
  },

  {
    id: "practices",
    kind: "multi",
    answerKey: "practices",
    minSelected: 1,
    continueLabel: "Continue",
    title: (answers) => {
      switch (answers.intent) {
        case "understand":
          return "Which of these happen in your home?";
        case "explore":
          return "Does any of this happen around you?";
        case "read":
          return "And what happens at home?";
        default:
          return "What already happens at home?";
      }
    },
    subtitle: (answers) =>
      answers.intent === "understand"
        ? "Pick everything that's true. We'll start by explaining these, and they decide which verse meets you first."
        : "Pick everything that's true. It decides which verse meets you first — the whole library stays open.",
    options: householdPracticeOptions.map((option) => ({
      value: option.key,
      exclusive: option.exclusive,
      label: (answers) =>
        option.key === "scratch" && answers.intent === "explore"
          ? "None of these yet"
          : option.label,
    })),
  },

  {
    id: "reflect",
    kind: "interstitial",
    eyebrow: "So far",
    title: "Here's what that changes.",
    continueLabel: "Continue",
    lines: (answers) => reflectionLines(answers),
  },

  // Branch on intent: one follow-up, chosen by what the user said they want.
  {
    id: "practice-minutes",
    kind: "single",
    answerKey: "practiceMinutes",
    when: (answers) => answers.intent === "practice",
    title: "How long can you give it each day?",
    subtitle: "This picks the practice that sits at the top of your day.",
    options: [
      { value: "2", label: "2 minutes", detail: "A pause, a breath, one verse" },
      { value: "5", label: "5 minutes", detail: "Light a lamp, say a verse, sit" },
      { value: "10", label: "10 minutes", detail: "A fuller practice, with time to reflect" },
    ],
  },
  {
    id: "starting-text",
    kind: "single",
    answerKey: "startingText",
    when: (answers) => answers.intent === "read",
    title: "Where would you like to begin?",
    subtitle: "This text leads your daily verse and opens first in the reader.",
    options: [
      { value: "gita", label: "Bhagavad Gita", detail: "Chapter 2, where the teaching begins" },
      { value: "chalisa", label: "Hanuman Chalisa", detail: "Forty verses, read whole" },
      { value: "upanishads", label: "The Upanishads", detail: "Isha first — eighteen verses" },
      {
        value: "soundarya-lahari",
        label: "Soundarya Lahari",
        detail: "A hundred verses to the Devi",
      },
      { value: "bhaja-govindam", label: "Bhaja Govindam", detail: "Verses on what lasts" },
      { value: "any", label: "Surprise me", detail: "A verse from across the library" },
    ],
  },
  {
    id: "curiosity",
    kind: "single",
    answerKey: "curiosity",
    when: (answers) => answers.intent === "understand" || answers.intent === "explore",
    title: (answers) =>
      answers.intent === "understand"
        ? "What would you like explained first?"
        : "Where shall we start?",
    subtitle: "This picks the first guide you'll see, and the ideas that follow it.",
    options: [
      { value: "lamp", label: "Why the lamp is lit", detail: "And what to say when you light it" },
      {
        value: "mantras",
        label: "What the mantras mean",
        detail: "Word by word, with how to say them",
      },
      {
        value: "festivals",
        label: "What the festivals are for",
        detail: "One guide per festival, variations named",
      },
      { value: "ideas", label: "The big ideas", detail: "Dharma, karma, moksha — plainly" },
    ],
  },

  {
    id: "script",
    kind: "single",
    answerKey: "script",
    title: "Can you read Devanagari?",
    subtitle:
      "देवनागरी — the script most of these verses are written in. This sets which line comes first on every verse.",
    options: [
      {
        value: "devanagari",
        label: "Yes, easily",
        detail: "Devanagari leads, Roman letters below",
      },
      { value: "both", label: "Slowly, with help", detail: "Both together, pronunciation in bold" },
      { value: "roman", label: "Not yet", detail: "Roman letters first, Devanagari kept small" },
    ],
  },

  // Only asked when the user can read Devanagari. Hindi meanings are written
  // in it, so the question is irrelevant otherwise and is skipped, not shown.
  {
    id: "language",
    kind: "single",
    answerKey: "language",
    when: (answers) => answers.script !== undefined && answers.script !== "roman",
    title: "Which language for the meanings?",
    subtitle:
      "Every verse has a reviewed English and Hindi meaning. More languages live in Settings as they are reviewed.",
    options: [
      { value: "en", label: "English" },
      { value: "hi", label: "हिन्दी (Hindi)" },
    ],
  },

  {
    id: "reminder",
    kind: "single",
    answerKey: "reminder",
    title: (answers) =>
      answers.intent === "practice"
        ? "When would a few minutes fit?"
        : "When should the day's verse reach you?",
    subtitle:
      "One quiet notification at that time. No streaks, no nagging, and you can switch it off any time.",
    options: [
      { value: "08:00", label: "Morning", detail: "8:00 — before the day starts" },
      { value: "12:00", label: "Midday", detail: "12:00 — a pause in the middle" },
      {
        value: "20:00",
        label: "Evening",
        detail: "8:00 pm — sandhyā, when many households light the lamp",
      },
      { value: "none", label: "No reminder", detail: "I'll come on my own" },
    ],
  },

  {
    id: "name",
    kind: "text",
    answerKey: "name",
    optional: true,
    maxLength: 24,
    placeholder: "Your first name",
    continueLabel: "See my starting point",
    title: "What should we call you?",
    subtitle: "Only used in the app's greeting. Skip it if you'd rather not.",
  },

  { id: "result", kind: "result" },
];

export function joinWords(words: string[]): string {
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

// The interstitial after the household question: the answers so far, and the
// concrete thing each one changes. Nothing is claimed here that the code does
// not actually do.
export function reflectionLines(answers: OnboardingAnswers): string[] {
  const practices = answers.practices ?? [];
  const tags: string[] = [];
  for (const key of practices) {
    const option = householdPracticeOptions.find((candidate) => candidate.key === key);
    for (const tag of option?.tags ?? []) if (!tags.includes(tag)) tags.push(tag);
  }
  const leading = tags.slice(0, 2);
  const lines: string[] = [];
  if (practices.length === 1 && practices[0] === "scratch") {
    lines.push("Your daily verse will lead with peace and wisdom — good places to start.");
  } else if (leading.length > 0) {
    lines.push(
      `Your daily verse will lead with ${joinWords(leading)}, drawn from all twelve texts in the library.`,
    );
  }
  switch (answers.intent) {
    case "practice":
      lines.push("A short practice will sit at the top of each day.");
      break;
    case "understand":
      lines.push("We'll begin by explaining what your household already does.");
      break;
    case "read":
      lines.push("Reading leads: each day's verse opens straight into its chapter.");
      break;
    default:
      lines.push("We'll start small: one verse and one idea a day.");
  }
  lines.push("Nothing is hidden. Every part of the library stays open.");
  return lines;
}

import { onboardingSteps } from "./steps";
import { DEFAULT_FLOW_ENV } from "./types";
import type {
  AnswerChip,
  AnswerKey,
  Copy,
  FlowEnv,
  OnboardingAnswers,
  OnboardingProfile,
  OnboardingStep,
  OptionalCopy,
  StepId,
  SummaryRow,
} from "./types";

import { tagsForPractices } from "@/lib/practices";
import { startingTextPrefixes } from "@/lib/startingPoint";

// Pure flow logic — no React, no React Native — so it runs under vitest.

export function resolveCopy(copy: Copy, answers: OnboardingAnswers): string {
  return typeof copy === "function" ? copy(answers) : copy;
}

export function resolveOptionalCopy(
  copy: OptionalCopy,
  answers: OnboardingAnswers,
): string | undefined {
  if (copy === undefined) return undefined;
  return typeof copy === "function" ? copy(answers) : copy;
}

// The steps that apply to the current answers, in order. Branch steps whose
// `when` no longer holds disappear, and their answers are ignored downstream.
export function visibleSteps(
  answers: OnboardingAnswers,
  steps: OnboardingStep[] = onboardingSteps,
  env: FlowEnv = DEFAULT_FLOW_ENV,
): OnboardingStep[] {
  return steps.filter((step) => !step.when || step.when(answers, env));
}

export function stepIndex(
  answers: OnboardingAnswers,
  stepId: StepId,
  steps: OnboardingStep[] = onboardingSteps,
  env: FlowEnv = DEFAULT_FLOW_ENV,
): number {
  return visibleSteps(answers, steps, env).findIndex((step) => step.id === stepId);
}

// Progress counts every screen the user will tap through after the welcome,
// including the result, so the bar reaches 100% on the genuine last screen
// and never under-reports (a documented competitor failure).
export function progressFor(
  answers: OnboardingAnswers,
  stepId: StepId,
  steps: OnboardingStep[] = onboardingSteps,
  env: FlowEnv = DEFAULT_FLOW_ENV,
): number {
  const counted = visibleSteps(answers, steps, env).filter((step) => step.kind !== "welcome");
  const position = counted.findIndex((step) => step.id === stepId);
  if (position < 0 || counted.length === 0) return 0;
  return (position + 1) / counted.length;
}

export function isStepSatisfied(step: OnboardingStep, answers: OnboardingAnswers): boolean {
  switch (step.kind) {
    case "single":
      return answers[step.answerKey] !== undefined;
    case "multi": {
      const value = answers[step.answerKey];
      return Array.isArray(value) && value.length >= step.minSelected;
    }
    case "text":
      return step.optional || Boolean(stringAnswer(answers, step.answerKey));
    default:
      return true;
  }
}

export function stringAnswer(answers: OnboardingAnswers, key: AnswerKey): string | undefined {
  const value = answers[key];
  return typeof value === "string" ? value : undefined;
}

export function listAnswer(answers: OnboardingAnswers, key: AnswerKey): string[] {
  const value = answers[key];
  return Array.isArray(value) ? value : [];
}

// The selected option value of a single-choice answer, as the string the
// option carries. practiceMinutes is stored as a number (see withAnswer), so
// a plain stringAnswer() would never match its card.
export function choiceAnswer(answers: OnboardingAnswers, key: AnswerKey): string | undefined {
  const value = answers[key];
  if (value === undefined || Array.isArray(value)) return undefined;
  return String(value);
}

export type FlowDraft = { answers: OnboardingAnswers; stepId: StepId };

// Where a fresh run starts: the welcome, with the device's existing name
// pre-filled so skipping the name question keeps it rather than erasing it.
// A saved draft resumes at its step, provided that step still exists for the
// saved answers; otherwise at the first unsatisfied step.
export function restoreDraft(
  draft: FlowDraft | null,
  seed: { name?: string } = {},
  env: FlowEnv = DEFAULT_FLOW_ENV,
): FlowDraft {
  if (!draft) {
    const answers: OnboardingAnswers = seed.name ? { name: seed.name } : {};
    return { answers, stepId: "welcome" };
  }
  const list = visibleSteps(draft.answers, onboardingSteps, env);
  if (list.some((step) => step.id === draft.stepId)) return draft;
  const firstOpen = list.find((step) => !isStepSatisfied(step, draft.answers)) ?? list[0];
  return { answers: draft.answers, stepId: firstOpen.id };
}

// Answers are stored by key; choice values arrive as strings from the UI and
// are coerced here so the rest of the app sees typed values.
export function withAnswer(
  answers: OnboardingAnswers,
  key: AnswerKey,
  value: string | string[] | undefined,
): OnboardingAnswers {
  const next: Record<string, unknown> = { ...answers };
  if (value === undefined) delete next[key];
  else if (key === "practiceMinutes" && typeof value === "string") next[key] = Number(value);
  else next[key] = value;
  return next;
}

const reminderLabel: Record<string, string> = {
  "08:00": "Morning, 8:00",
  "12:00": "Midday, 12:00",
  "20:00": "Evening, 8:00 pm",
  none: "Off",
};

const scriptLabel: Record<string, string> = {
  devanagari: "Devanagari first",
  both: "Devanagari and Roman letters together",
  roman: "Roman letters first",
};

// What the result screen shows back: one row per setting the answers
// produced (verse order, practice length, reading text, script, language,
// reminder), each with the step to jump to if the user wants to change it.
// Intent, curiosity and name are not rows — they show up as the starting
// point and the greeting instead. Rows for branch steps that were not shown
// are omitted.
export function summaryRows(answers: OnboardingAnswers): SummaryRow[] {
  const rows: SummaryRow[] = [];
  const tags = tagsForPractices(answers.practices ?? []).slice(0, 2);
  if (tags.length > 0) {
    rows.push({
      stepId: "practices",
      label: "Daily verse leads with",
      value: tags.join(" and "),
      icon: "home-outline",
    });
  }
  if (answers.intent === "practice" && answers.practiceMinutes) {
    rows.push({
      stepId: "practice-minutes",
      label: "Daily practice",
      value: `${answers.practiceMinutes} minutes`,
      icon: optionIcon("practice-minutes", String(answers.practiceMinutes)),
    });
  }
  if (answers.intent === "read" && answers.startingText && answers.startingText !== "any") {
    rows.push({
      stepId: "starting-text",
      label: "Reading leads with",
      value: startingTextName(answers),
      icon: optionIcon("starting-text", answers.startingText),
    });
  }
  if (answers.script) {
    rows.push({
      stepId: "script",
      label: "Verses shown",
      value: scriptLabel[answers.script] ?? "",
      icon: optionIcon("script", answers.script),
    });
  }
  if (answers.script && answers.script !== "roman" && answers.language) {
    rows.push({
      stepId: "language",
      label: "Meanings in",
      value: answers.language === "hi" ? "हिन्दी" : "English",
      icon: optionIcon("language", answers.language),
    });
  }
  if (answers.reminder) {
    rows.push({
      stepId: "reminder",
      label: "Reminder",
      value: reminderLabel[answers.reminder] ?? "",
      icon: optionIcon("reminder", answers.reminder),
    });
  }
  return rows;
}

function optionIcon(stepId: StepId, value: string): string | undefined {
  const step = onboardingSteps.find((entry) => entry.id === stepId);
  if (!step || (step.kind !== "single" && step.kind !== "multi")) return undefined;
  return step.options.find((option) => option.value === value)?.icon;
}

// The answers given so far, as chips: the intent first, then each household
// practice, each with the icon it was chosen with. Used by the interstitial
// to show the choices back before saying what they change.
export function answerChips(answers: OnboardingAnswers): AnswerChip[] {
  const chips: AnswerChip[] = [];
  const pick = (stepId: StepId, values: string[]) => {
    const step = onboardingSteps.find((entry) => entry.id === stepId);
    if (!step || (step.kind !== "single" && step.kind !== "multi")) return;
    for (const value of values) {
      const option = step.options.find((candidate) => candidate.value === value);
      if (!option) continue;
      chips.push({
        key: `${stepId}:${value}`,
        label: option.shortLabel ?? resolveCopy(option.label, answers),
        icon: option.icon,
      });
    }
  };
  if (answers.intent) pick("intent", [answers.intent]);
  pick("practices", answers.practices ?? []);
  return chips;
}

const startingTextNames: Record<string, string> = {
  gita: "Bhagavad Gita",
  chalisa: "Hanuman Chalisa",
  upanishads: "The Upanishads",
  "soundarya-lahari": "Soundarya Lahari",
  "bhaja-govindam": "Bhaja Govindam",
  any: "the whole library",
};

export function startingTextName(answers: OnboardingAnswers): string {
  return startingTextNames[answers.startingText ?? "any"] ?? "the whole library";
}

// The flow's output. Everything here has a consumer: focusTags and the text
// prefixes order the daily pool, scriptPreference orders verse lines,
// contentLanguage picks the meaning, the reminder arms the notification, and
// intent/minutes/curiosity/startingText choose the home starting point.
export function buildProfile(answers: OnboardingAnswers): OnboardingProfile {
  const intent = answers.intent ?? "explore";
  const householdPractices = answers.practices ?? [];
  const startingText = intent === "read" ? (answers.startingText ?? null) : null;
  const reminder = answers.reminder ?? "none";
  const name = (answers.name ?? "").trim();
  return {
    intent,
    householdPractices,
    focusTags: tagsForPractices(householdPractices),
    preferredTextPrefixes: startingText ? startingTextPrefixes[startingText] : [],
    scriptPreference: answers.script ?? "both",
    contentLanguage: answers.script !== "roman" && answers.language === "hi" ? "hi" : "en",
    reminderEnabled: reminder !== "none",
    reminderTime: reminder === "none" ? "08:00" : reminder,
    displayName: name || "Friend",
    practiceMinutes: intent === "practice" ? (answers.practiceMinutes ?? null) : null,
    startingText,
    curiosity: intent === "understand" || intent === "explore" ? (answers.curiosity ?? null) : null,
  };
}

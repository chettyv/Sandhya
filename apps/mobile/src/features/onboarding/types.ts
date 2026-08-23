// Onboarding flow — shared types.
//
// The flow is configuration (steps.ts) interpreted by a small pure engine
// (engine.ts). Every answer here has a named consumer in the app; a question
// whose answer changes nothing is worse than no question (02-plan.md B4), so
// do not add an answer key without also adding the code that reads it.

export type Intent = "practice" | "understand" | "read" | "explore";
export type ScriptPreference = "devanagari" | "both" | "roman";
export type ContentLanguageChoice = "en" | "hi";
export type ReminderSlot = "08:00" | "12:00" | "20:00" | "none";
export type StartingText =
  | "gita"
  | "chalisa"
  | "upanishads"
  | "soundarya-lahari"
  | "bhaja-govindam"
  | "any";
export type Curiosity = "lamp" | "mantras" | "festivals" | "ideas";
export type PracticeMinutes = 2 | 5 | 10;

export type OnboardingAnswers = {
  intent?: Intent;
  practices?: string[];
  practiceMinutes?: PracticeMinutes;
  startingText?: StartingText;
  curiosity?: Curiosity;
  script?: ScriptPreference;
  language?: ContentLanguageChoice;
  reminder?: ReminderSlot;
  name?: string;
};

export type AnswerKey = keyof OnboardingAnswers;

export type StepId =
  | "welcome"
  | "intent"
  | "practices"
  | "reflect"
  | "practice-minutes"
  | "starting-text"
  | "curiosity"
  | "script"
  | "language"
  | "reminder"
  | "name"
  | "result";

export type Copy = string | ((answers: OnboardingAnswers) => string);
export type OptionalCopy = Copy | ((answers: OnboardingAnswers) => string | undefined) | undefined;

export type ChoiceOption = {
  value: string;
  label: Copy;
  detail?: Copy;
  // Selecting an exclusive option clears the others (multi-choice only).
  exclusive?: boolean;
};

type StepBase = {
  id: StepId;
  // Branching: a step is in the flow only while `when` holds for the current
  // answers. Branch steps are skipped, not shown disabled.
  when?: (answers: OnboardingAnswers) => boolean;
};

export type WelcomeStep = StepBase & { kind: "welcome" };

export type SingleChoiceStep = StepBase & {
  kind: "single";
  answerKey: AnswerKey;
  title: Copy;
  subtitle?: OptionalCopy;
  options: ChoiceOption[];
  // Single-choice always auto-advances: one tap, short selected state, next.
};

export type MultiChoiceStep = StepBase & {
  kind: "multi";
  answerKey: AnswerKey;
  title: Copy;
  subtitle?: OptionalCopy;
  options: ChoiceOption[];
  minSelected: number;
  continueLabel: string;
};

export type TextStep = StepBase & {
  kind: "text";
  answerKey: AnswerKey;
  title: Copy;
  subtitle?: OptionalCopy;
  placeholder: string;
  maxLength: number;
  optional: boolean;
  continueLabel: string;
};

export type InterstitialStep = StepBase & {
  kind: "interstitial";
  eyebrow: Copy;
  title: Copy;
  lines: (answers: OnboardingAnswers) => string[];
  continueLabel: string;
};

export type ResultStep = StepBase & { kind: "result" };

export type OnboardingStep =
  | WelcomeStep
  | SingleChoiceStep
  | MultiChoiceStep
  | TextStep
  | InterstitialStep
  | ResultStep;

// What the flow produces. Written to the store in one go by finish().
export type OnboardingProfile = {
  intent: Intent;
  householdPractices: string[];
  focusTags: string[];
  preferredTextPrefixes: string[];
  scriptPreference: ScriptPreference;
  contentLanguage: ContentLanguageChoice;
  reminderEnabled: boolean;
  reminderTime: string;
  displayName: string;
  practiceMinutes: PracticeMinutes | null;
  startingText: StartingText | null;
  curiosity: Curiosity | null;
};

export type SummaryRow = {
  stepId: StepId;
  label: string;
  value: string;
};

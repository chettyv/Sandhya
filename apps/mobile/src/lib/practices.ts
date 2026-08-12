// Onboarding Q1: "What do you do at home?" — concrete household observances.
//
// Household practice is asked because it is answerable; sampradāya often is
// not, and many practitioners do not identify by one at all. The answer
// routes CONTENT (which verses lead the daily rotation, and later which
// reading appears first) — it must never be mapped to a tradition identity
// or fed to tradition_pref. (02-plan.md B4.)

export type HouseholdPractice = {
  key: string;
  label: string;
  // Content tags this practice weights toward. Tags ORDER the daily pool —
  // they never narrow it (see dailyShloka).
  tags: string[];
  // "Starting from scratch" is a state, not a practice — selecting it clears
  // the others and vice versa.
  exclusive?: boolean;
};

export const householdPracticeOptions: HouseholdPractice[] = [
  { key: "lamp", label: "We light a lamp in the evening", tags: ["devotion", "peace"] },
  { key: "ekadashi", label: "We keep ekādaśī", tags: ["discipline", "devotion"] },
  { key: "chalisa", label: "We do Hanuman Chalisa", tags: ["courage", "devotion"] },
  {
    key: "mandir-festivals",
    label: "We mostly go to the mandir at festivals",
    tags: ["devotion", "family"],
  },
  {
    key: "scratch",
    label: "I'm starting from scratch",
    tags: ["wisdom", "peace"],
    exclusive: true,
  },
];

export const householdPracticeKeys = householdPracticeOptions.map((option) => option.key);

// Ordered, deduped tags for the selected practices. Order matters: the first
// practice a household names is its strongest signal, so its tags lead.
export function tagsForPractices(practices: string[]): string[] {
  const tags: string[] = [];
  for (const key of practices) {
    const option = householdPracticeOptions.find((candidate) => candidate.key === key);
    for (const tag of option?.tags ?? []) {
      if (!tags.includes(tag)) tags.push(tag);
    }
  }
  return tags;
}

// Chip toggle behaviour: exclusive options clear the rest; picking a regular
// option clears any exclusive one.
export function togglePractice(selected: string[], key: string): string[] {
  if (selected.includes(key)) {
    return selected.filter((item) => item !== key);
  }
  const option = householdPracticeOptions.find((candidate) => candidate.key === key);
  if (option?.exclusive) {
    return [key];
  }
  const exclusiveKeys = new Set(
    householdPracticeOptions.filter((candidate) => candidate.exclusive).map((c) => c.key),
  );
  return [...selected.filter((item) => !exclusiveKeys.has(item)), key];
}

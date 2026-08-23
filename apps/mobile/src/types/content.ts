export type ContentKind =
  | "reflection"
  | "festival"
  | "practice"
  | "concept"
  | "deity"
  | "text"
  | "passage";

/**
 * How a published festival date was reckoned. A date is only trustworthy with
 * all four of: the calendar system, the observing community wherever practice
 * splits, the location the timing was computed for, and the source — with any
 * disagreement between sources reported rather than silently resolved.
 */
export type FestivalDateReckoning = {
  system: "amanta" | "purnimanta" | "solar" | "other";
  /** e.g. "Smārta" / "Vaiṣṇava" — required wherever the observance splits. */
  community?: string;
  location: string;
  source: string;
  disagreement?: string;
};

export type Festival = {
  id: string;
  name: string;
  variant?: string;
  /** Null means the guide is available but this preview does not calculate a local date. */
  date: string | null;
  /** Absent until the date carries its reckoning; the UI says so explicitly. */
  dateReckoning?: FestivalDateReckoning | null;
  dayLabel: string;
  monthLabel: string;
  summary: string;
  meaning: string;
  observance: string[];
  variationNote: string;
  color: string;
  isPremium?: boolean;
};

export type Practice = {
  id: string;
  title: string;
  category: "Meditation" | "Puja" | "Mantra" | "Reflection";
  durationMinutes: number;
  level: "Beginner" | "Intermediate";
  summary: string;
  steps: string[];
  materials?: string[];
  traditionNote?: string;
  warnings?: string;
  isPremium?: boolean;
};

export type Concept = {
  id: string;
  term: string;
  sanskrit: string;
  definition: string;
  explanation: string;
  variationNote?: string;
};

export type Deity = {
  id: string;
  name: string;
  otherNames: string[];
  shortDescription: string;
  fullDescription: string;
  traditions: string[];
};

export type SacredText = {
  id: string;
  title: string;
  sanskrit?: string;
  category: string;
  description: string;
  estimatedDate?: string;
  tradition: string;
};

export type Source = {
  /** UUID of the passage row that grounds this citation. */
  passage_id: string;
  title: string;
  location: string;
  relevance: string;
};

export type StructuredAnswer = {
  answer: string;
  summary: string;
  sources: Source[];
  tradition_notes: string[];
  confidence: "low" | "medium" | "high";
  safety_note: string | null;
  suggested_practice: string | null;
};

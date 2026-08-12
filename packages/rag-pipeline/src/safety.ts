import type { StructuredAnswer } from "@dharma-daily/shared-types";

import { classifyQuestion, type QuestionSafetyCategory } from "./classifier.js";

export type SafetyCategory = QuestionSafetyCategory;

export interface SafetyResult {
  category: SafetyCategory;
  blocked: boolean;
  answer?: StructuredAnswer;
}

export function runSafetyGate(question: string): SafetyResult {
  const { safetyCategory: category } = classifyQuestion(question);

  if (category === "none") {
    return { category, blocked: false };
  }

  return {
    category,
    blocked: true,
    answer: {
      answer: safetyAnswer(category),
      summary: "This question needs qualified human support rather than an AI religious answer.",
      sources: [],
      tradition_notes: [],
      confidence: "high",
      safety_note: category,
      suggested_practice: null,
    },
  };
}

function safetyAnswer(category: Exclude<SafetyCategory, "none">): string {
  if (category === "self_harm") {
    return "I cannot answer this as a spiritual guidance question. If you may hurt yourself or feel unable to stay safe, contact emergency services now or a local crisis line, and reach out to someone you trust who can be with you.";
  }

  if (category === "medical") {
    return "I cannot give medical advice or replace a clinician. Please speak with a qualified medical professional, especially if symptoms are urgent or you are considering fasting, medication, or treatment changes.";
  }

  return "I cannot give legal, financial, tax, or investment advice. Please consult a qualified professional for your situation.";
}

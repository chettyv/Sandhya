import { Tiktoken } from "js-tiktoken/lite";
import cl100kBase from "js-tiktoken/ranks/cl100k_base";

// text-embedding-3-small and the OpenAI-compatible models used by the
// pipeline use the cl100k_base family. Keeping one encoder instance avoids
// rebuilding the BPE vocabulary for every chunk and makes all pipeline token
// budgets use the same definition.
export const RAG_TOKEN_ENCODING = "cl100k_base" as const;
const encoder = new Tiktoken(cl100kBase);

export function countTokens(value: string): number {
  return encoder.encode(value).length;
}

// Runtime mirror for the dependency-free source audit. The TypeScript build
// emits token-count.js from token-count.ts into dist; this file lets Node run
// the source-only audit before a package build has produced dist artifacts.
import { Tiktoken } from "js-tiktoken/lite";
import cl100kBase from "js-tiktoken/ranks/cl100k_base";

export const RAG_TOKEN_ENCODING = "cl100k_base";
const encoder = new Tiktoken(cl100kBase);

export function countTokens(value) {
  return encoder.encode(value).length;
}

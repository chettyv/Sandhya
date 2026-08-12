// Deno resolves npm: specifiers at runtime. These minimal declarations keep
// the repository's dependency-free Edge TypeScript gate aware of the same
// tokenizer imports without pretending the npm package is a Node-only module.
declare module "npm:js-tiktoken@1.0.21/lite" {
  export class Tiktoken {
    constructor(model: unknown);
    encode(value: string): number[];
  }
}

declare module "npm:js-tiktoken@1.0.21/ranks/cl100k_base" {
  const cl100kBase: unknown;
  export default cl100kBase;
}

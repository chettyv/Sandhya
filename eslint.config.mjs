// Flat ESLint config — applies to all workspaces.
// Keep this minimal; per-package overrides live in each package's own eslint.config.mjs if needed.

import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/dist-all/**",
      "**/build/**",
      "**/coverage/**",
      "**/.expo/**",
      "**/.next/**",
      "**/ios/**",
      "**/android/**",
      "supabase/.branches/**",
      "supabase/.temp/**",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.node, ...globals.es2022 },
    },
    plugins: { import: importPlugin },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/require-await": "off",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      eqeqeq: ["error", "always", { null: "ignore" }],
    },
  },

  // Config / script files: relax TS strictness, allow console.
  {
    files: [
      "**/*.config.{js,mjs,cjs,ts}",
      "scripts/**/*.{js,mjs,cjs,ts}",
      "apps/admin/**/*.{js,mjs,cjs}",
    ],
    ...tseslint.configs.disableTypeChecked,
    rules: {
      ...tseslint.configs.disableTypeChecked.rules,
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // Test files: relax floating promises (Vitest handles them).
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts"],
    rules: {
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
    },
  },

  // This checked-in JavaScript mirror is intentionally kept beside the
  // TypeScript tokenizer source for source-only audits. Its sibling .ts file
  // is the typechecked implementation, so do not force this mirror through a
  // TypeScript project that excludes duplicate .js/.ts basenames.
  {
    files: ["packages/rag-pipeline/src/token-count.js"],
    ...tseslint.configs.disableTypeChecked,
  },

  // Supabase Edge Functions are compiled by the Deno runtime. The repository
  // keeps a minimal local shim for syntax/source validation, but it cannot
  // model Deno's full Request/Response/env and npm: module types well enough
  // for TypeScript ESLint's unsafe-* rules. Keep ordinary ESLint/TypeScript
  // syntax rules active and use the dedicated Edge syntax gate for runtime
  // compatibility instead of reporting shim artefacts as backend defects.
  {
    files: ["supabase/functions/**/*.ts"],
    ...tseslint.configs.disableTypeChecked,
    rules: {
      ...tseslint.configs.disableTypeChecked.rules,
      "import/order": "off",
    },
  },

  // Expo mobile app: use its Expo-aware TypeScript project and path aliases.
  {
    files: ["apps/mobile/**/*.ts", "apps/mobile/**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./apps/mobile/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser, ...globals.es2022 },
    },
  },

  // Static admin console: browser APIs are intentional and use the shared lint project.
  {
    files: ["apps/admin/**/*.ts"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2022 },
    },
  },

  prettier,
);

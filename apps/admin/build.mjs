import { cpSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(root, "public");
const distDir = resolve(root, "dist");

mkdirSync(distDir, { recursive: true });
cpSync(publicDir, distDir, { recursive: true });

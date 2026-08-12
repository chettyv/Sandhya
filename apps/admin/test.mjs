import { readFileSync } from "node:fs";

const root = new URL(".", import.meta.url);
const source = readFileSync(new URL("./src/admin.ts", root), "utf8");
const html = readFileSync(new URL("./public/index.html", root), "utf8");

for (const expected of ["admin-feedback", "admin-content", "admin-ops", "sendOtp", "verifyOtp"]) {
  if (!source.includes(expected)) throw new Error(`Admin console missing ${expected}.`);
}
if (source.includes("SUPABASE_SERVICE_ROLE_KEY") || html.includes("service_role")) {
  throw new Error("The browser admin console must not contain a service-role credential.");
}
if (!html.includes('type="module"') || !html.includes("admin.js")) {
  throw new Error("Admin shell must load the compiled module.");
}

console.log("Admin console checks passed.");

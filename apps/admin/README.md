# @sandhya/admin

Small, dependency-free operator console for the protected Supabase admin Edge Functions.

It supports:

- Supabase email OTP sign-in and sign-out. The backend still requires `app_metadata.role = "admin"`.
- Pending/reviewed/fixed feedback queue with admin notes.
- Allowlisted CRUD for reflections, festivals, practice guides, concepts, and deities.
- Explicit delete confirmation and JSON editing for content rows.
- Protected operational dashboard for DAU/MAU, feedback volume, usage, and spend.
- PII-minimized user list and cache inspection with explicit cache invalidation.

Configure the Supabase URL and publishable anon key in the browser. Never put a service-role key in this app. Build with `pnpm --filter @sandhya/admin build`; deploy the generated `dist/` directory as a static site. The Edge Functions remain the authorization boundary.

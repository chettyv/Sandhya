# Supabase operational SQL

These scripts configure hosted Supabase services that are intentionally not
part of the replayable application migrations. Run them only after the target
Supabase project has been selected and the required extensions have been
enabled in the dashboard.

## Daily reflection scheduler

`daily-reflections-cron.sql` installs one idempotent, every-minute Cron job
that invokes the deployed `send-daily-reflections` Edge Function through
`pg_net`. The function still authenticates the request with the dedicated
`x-cron-secret`; the URL, publishable key, and cron secret are read from
Supabase Vault at execution time and are never committed to the repository.

Before running the script:

1. Enable Supabase Cron (`pg_cron`), `pg_net`, and Vault for the target project.
2. Store these three Vault secrets using the dashboard or SQL editor:
   - `sandhya_project_url` — `https://<project-ref>.supabase.co`
   - `sandhya_publishable_key` — the target project's publishable/anon key
   - `sandhya_reflections_cron_secret` — the same value as the deployed
     `DAILY_REFLECTIONS_CRON_SECRET` Edge Function secret
3. Deploy `send-daily-reflections` and set its `EXPO_ACCESS_TOKEN` and
   `DAILY_REFLECTIONS_CRON_SECRET` secrets.
4. Run `daily-reflections-cron.sql` in the target project's SQL editor.
5. Confirm the job in `cron.job`, then inspect `cron.job_run_details` after a
   due notification window and run the protected notification smoke workflow.

The script fails closed when any required Vault secret is missing. Re-running
it replaces only the named Sandhya job, so it cannot create duplicate
schedulers.

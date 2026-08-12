-- Hosted Supabase operational setup for the daily reflection worker.
--
-- This is deliberately separate from application migrations: pg_cron, pg_net,
-- and Vault are hosted project capabilities and may not be available in every
-- local Supabase stack. Run after enabling the three extensions and storing:
--   sandhya_project_url
--   sandhya_publishable_key
--   sandhya_reflections_cron_secret
-- in Supabase Vault.

do $$
begin
  if not exists (
    select 1 from vault.decrypted_secrets
    where name = 'sandhya_project_url'
  ) or not exists (
    select 1 from vault.decrypted_secrets
    where name = 'sandhya_publishable_key'
  ) or not exists (
    select 1 from vault.decrypted_secrets
    where name = 'sandhya_reflections_cron_secret'
  ) then
    raise exception
      'Sandhya scheduler requires project URL, publishable key, and cron secret in Vault.';
  end if;
end;
$$;

select cron.unschedule(jobid)
from cron.job
where jobname = 'sandhya-send-reflections';

select cron.schedule(
  'sandhya-send-reflections',
  '* * * * *',
  $job$
    select net.http_post(
      url := (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'sandhya_project_url'
      ) || '/functions/v1/send-daily-reflections',
      headers := jsonb_build_object(
        'content-type', 'application/json',
        'apikey', (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'sandhya_publishable_key'
        ),
        'x-cron-secret', (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'sandhya_reflections_cron_secret'
        )
      ),
      body := jsonb_build_object(
        'source', 'supabase_cron',
        'scheduled_at', now()
      )
    );
  $job$
);

-- Down / uninstall:
-- select cron.unschedule(jobid)
-- from cron.job
-- where jobname = 'sandhya-send-reflections';

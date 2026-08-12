-- Cache entries are intentionally finite-lived so prompt, corpus, policy, and
-- provider changes can become effective without retaining stale answers.

alter table public.cached_answers
  add column if not exists expires_at timestamptz;

update public.cached_answers
set expires_at = coalesce(expires_at, created_at + interval '90 days')
where expires_at is null;

alter table public.cached_answers
  alter column expires_at set default (now() + interval '90 days'),
  alter column expires_at set not null;

create index if not exists cached_answers_expires_at_idx
  on public.cached_answers (expires_at);

create or replace function public.record_cached_answer_hit(p_question_hash text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.cached_answers
  set hit_count = hit_count + 1,
      last_used_at = now()
  where question_hash = p_question_hash
    and expires_at > now();
$$;

revoke all on function public.record_cached_answer_hit(text) from public;
grant execute on function public.record_cached_answer_hit(text) to service_role;

-- Down:
--   recreate public.record_cached_answer_hit(text) from 20260708120000_rag_rpc.sql;
--   drop index if exists public.cached_answers_expires_at_idx;
--   alter table public.cached_answers drop column if exists expires_at;

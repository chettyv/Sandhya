-- Dedicated, service-only spend telemetry. Message audit fields remain the
-- source of truth for user-visible assistant turns; this table also captures
-- embedding and future classifier/evaluation calls.

create table if not exists public.cost_log (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users(id) on delete set null,
  purpose      text not null check (purpose in ('classifier', 'main_answer', 'embedding', 'eval', 'judge')),
  model        text not null,
  tokens_in    integer not null default 0 check (tokens_in >= 0),
  tokens_out   integer not null default 0 check (tokens_out >= 0),
  cost_usd     numeric(12, 8) not null default 0 check (cost_usd >= 0),
  metadata     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists cost_log_created_at_idx
  on public.cost_log (created_at desc);
create index if not exists cost_log_user_created_at_idx
  on public.cost_log (user_id, created_at desc);
create index if not exists cost_log_purpose_created_at_idx
  on public.cost_log (purpose, created_at desc);

alter table public.cost_log enable row level security;
revoke all on table public.cost_log from public, anon, authenticated;
grant select, insert, delete on table public.cost_log to service_role;

create or replace function public.record_ai_cost(
  p_user_id uuid,
  p_purpose text,
  p_model text,
  p_tokens_in integer,
  p_tokens_out integer,
  p_cost_usd numeric,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  cost_id uuid;
begin
  if p_purpose not in ('classifier', 'main_answer', 'embedding', 'eval', 'judge') then
    raise exception 'Invalid AI cost purpose';
  end if;
  if nullif(trim(p_model), '') is null then
    raise exception 'AI cost model is required';
  end if;
  if p_tokens_in < 0 or p_tokens_out < 0 or p_cost_usd < 0 then
    raise exception 'AI cost values must be non-negative';
  end if;

  insert into public.cost_log (
    user_id, purpose, model, tokens_in, tokens_out, cost_usd, metadata
  ) values (
    p_user_id,
    p_purpose,
    left(nullif(trim(p_model), ''), 200),
    p_tokens_in,
    p_tokens_out,
    p_cost_usd,
    case when jsonb_typeof(coalesce(p_metadata, '{}'::jsonb)) = 'object'
      then coalesce(p_metadata, '{}'::jsonb)
      else '{}'::jsonb
    end
  ) returning id into cost_id;

  return cost_id;
end;
$$;

revoke all on function public.record_ai_cost(uuid, text, text, integer, integer, numeric, jsonb) from public;
grant execute on function public.record_ai_cost(uuid, text, text, integer, integer, numeric, jsonb) to service_role;

-- Down:
--   drop function if exists public.record_ai_cost(uuid, text, text, integer, integer, numeric, jsonb);
--   drop table if exists public.cost_log;

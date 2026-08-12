-- Include non-answer provider spend (currently embeddings) in the monthly
-- guard without double-counting main-answer costs already stored on messages.

create or replace function public.check_ai_monthly_budget(
  p_user_id uuid,
  p_monthly_budget_usd numeric default 0
)
returns table (
  allowed boolean,
  current_spend_usd numeric,
  monthly_budget_usd numeric
)
language sql
stable
security definer
set search_path = public
as $$
  with message_spend as (
    select coalesce(sum(m.cost_usd), 0)::numeric as amount
    from public.messages m
    join public.conversations c on c.id = m.conversation_id
    where c.user_id = p_user_id
      and m.role = 'assistant'
      and m.created_at >= date_trunc('month', now())
      and m.cost_usd is not null
  ), ancillary_spend as (
    select coalesce(sum(l.cost_usd), 0)::numeric as amount
    from public.cost_log l
    where l.user_id = p_user_id
      and l.purpose <> 'main_answer'
      and l.created_at >= date_trunc('month', now())
  ), spend as (
    select message_spend.amount + ancillary_spend.amount as current_spend_usd
    from message_spend, ancillary_spend
  )
  select
    p_monthly_budget_usd <= 0 or spend.current_spend_usd < p_monthly_budget_usd,
    spend.current_spend_usd,
    greatest(0, coalesce(p_monthly_budget_usd, 0))
  from spend;
$$;

revoke all on function public.check_ai_monthly_budget(uuid, numeric) from public;
grant execute on function public.check_ai_monthly_budget(uuid, numeric) to service_role;

-- Down:
--   recreate public.check_ai_monthly_budget(uuid, numeric) from
--   20260708120000_rag_rpc.sql.

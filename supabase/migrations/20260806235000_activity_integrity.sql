-- Keep engagement history trustworthy without treating it as an entitlement.
-- Clients may sync offline entries from the past, but cannot create future
-- activity dates beyond the one-day timezone boundary.

create or replace function public.validate_activity_history_date()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  activity_date_value date;
begin
  activity_date_value := case
    when tg_table_name = 'practice_completions' then (to_jsonb(new)->>'completed_on')::date
    when tg_table_name = 'journal_entries' then (to_jsonb(new)->>'date')::date
    else (to_jsonb(new)->>'activity_date')::date
  end;
  if tg_table_name = 'practice_completions'
    and activity_date_value > current_date + 1 then
    raise exception 'completed_on cannot be more than one day in the future';
  end if;
  if tg_table_name = 'activity_days'
    and activity_date_value > current_date + 1 then
    raise exception 'activity_date cannot be more than one day in the future';
  end if;
  if tg_table_name = 'journal_entries'
    and activity_date_value > current_date + 1 then
    raise exception 'journal entry date cannot be more than one day in the future';
  end if;
  return new;
end;
$$;

drop trigger if exists validate_practice_completion_date on public.practice_completions;
create trigger validate_practice_completion_date
  before insert or update on public.practice_completions
  for each row execute function public.validate_activity_history_date();

drop trigger if exists validate_activity_day_date on public.activity_days;
create trigger validate_activity_day_date
  before insert or update on public.activity_days
  for each row execute function public.validate_activity_history_date();

drop trigger if exists validate_journal_entry_date on public.journal_entries;
create trigger validate_journal_entry_date
  before insert or update on public.journal_entries
  for each row execute function public.validate_activity_history_date();

-- Derive activity atomically from durable user actions. The mobile client still
-- performs an idempotent upsert for backwards compatibility with older local
-- databases, but streak history no longer depends on a second request.
create or replace function public.record_activity_for_user_action()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  insert into public.activity_days (user_id, activity_date)
  values (
    new.user_id,
    case
      when tg_table_name = 'journal_entries' then (to_jsonb(new)->>'date')::date
      else (to_jsonb(new)->>'completed_on')::date
    end
  )
  on conflict (user_id, activity_date) do nothing;
  return new;
end;
$$;

drop trigger if exists record_journal_activity on public.journal_entries;
create trigger record_journal_activity
  after insert or update on public.journal_entries
  for each row execute function public.record_activity_for_user_action();

drop trigger if exists record_practice_activity on public.practice_completions;
create trigger record_practice_activity
  after insert or update on public.practice_completions
  for each row execute function public.record_activity_for_user_action();

-- Down:
--   drop trigger if exists record_practice_activity on public.practice_completions;
--   drop trigger if exists record_journal_activity on public.journal_entries;
--   drop trigger if exists validate_activity_day_date on public.activity_days;
--   drop trigger if exists validate_journal_entry_date on public.journal_entries;
--   drop trigger if exists validate_practice_completion_date on public.practice_completions;
--   drop function if exists public.record_activity_for_user_action();
--   drop function if exists public.validate_activity_history_date();

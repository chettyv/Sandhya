-- Synced practice history and activity days for the user's private journey.
-- These records are engagement history, not a religious obligation or streak
-- score. They are intentionally user-owned and safe to delete with the user.

create table if not exists public.practice_completions (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  practice_key   text not null check (length(trim(practice_key)) between 1 and 200),
  completed_on   date not null default current_date,
  created_at     timestamptz not null default now(),
  unique (user_id, practice_key, completed_on)
);

create index if not exists practice_completions_user_date_idx
  on public.practice_completions (user_id, completed_on desc);

alter table public.practice_completions enable row level security;

create policy "users read own practice completions"
  on public.practice_completions for select using (auth.uid() = user_id);

create policy "users insert own practice completions"
  on public.practice_completions for insert with check (auth.uid() = user_id);

create table if not exists public.activity_days (
  user_id       uuid not null references public.profiles(id) on delete cascade,
  activity_date date not null,
  created_at    timestamptz not null default now(),
  primary key (user_id, activity_date)
);

create index if not exists activity_days_user_date_idx
  on public.activity_days (user_id, activity_date desc);

alter table public.activity_days enable row level security;

create policy "users read own activity days"
  on public.activity_days for select using (auth.uid() = user_id);

create policy "users insert own activity days"
  on public.activity_days for insert with check (auth.uid() = user_id);

-- Down:
--   drop table if exists public.activity_days;
--   drop table if exists public.practice_completions;

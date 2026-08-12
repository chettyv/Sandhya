-- B4 onboarding Q1 (02-plan.md): "What do you do at home?" — concrete
-- household observances. The answer routes content (daily rotation order,
-- and later which reading leads); it is deliberately a separate column from
-- tradition_pref and must never be folded into it — household practice is
-- answerable where sampradāya affiliation often is not, and inferring a
-- tradition identity from practice would be a false claim.

alter table public.profiles
  add column if not exists household_practices text[] not null default '{}';

alter table public.profiles
  drop constraint if exists profiles_household_practices_chk;

alter table public.profiles
  add constraint profiles_household_practices_chk
  check (
    household_practices <@ array[
      'lamp', 'ekadashi', 'chalisa', 'mandir-festivals', 'scratch'
    ]::text[]
  );

-- Down:
--   alter table public.profiles drop constraint if exists profiles_household_practices_chk;
--   alter table public.profiles drop column if exists household_practices;

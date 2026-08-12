-- RLS policy expressions run as the requesting role. Because
-- passage_embeddings is intentionally unreadable to that role, keep the
-- rights joins inside narrowly-scoped SECURITY DEFINER helpers instead of
-- exposing embeddings merely to evaluate a policy.

create or replace function public.can_read_passage(p_passage_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.passage_embeddings pe
    left join public.commentaries c on c.id = pe.commentary_id
    left join public.content_sources cs on cs.id = pe.source_document_id
    where pe.passage_id = p_passage_id
      and coalesce(c.licence, 'public_domain') in ('public_domain', 'original')
      and coalesce(cs.licence, 'public_domain') in ('public_domain', 'original')
      and coalesce(cs.can_store, false) = true
      and coalesce(cs.can_show_excerpts, false) = true
  )
  or (
    public.has_plus_access()
    and exists (
      select 1
      from public.passage_embeddings pe
      left join public.commentaries c on c.id = pe.commentary_id
      left join public.content_sources cs on cs.id = pe.source_document_id
      where pe.passage_id = p_passage_id
        and coalesce(c.licence, 'public_domain') in ('public_domain', 'licensed', 'original')
        and coalesce(cs.licence, 'public_domain') in ('public_domain', 'licensed', 'original')
        and coalesce(cs.can_store, false) = true
        and coalesce(cs.can_show_excerpts, false) = true
    )
  );
$$;

create or replace function public.can_read_commentary(p_commentary_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.commentaries c
    join public.passage_embeddings pe on pe.commentary_id = c.id
    left join public.content_sources cs on cs.id = pe.source_document_id
    where c.id = p_commentary_id
      and coalesce(cs.can_store, false) = true
      and coalesce(cs.can_show_excerpts, false) = true
      and (
        (
          c.licence in ('public_domain', 'original')
          and coalesce(cs.licence, 'public_domain') in ('public_domain', 'original')
        )
        or (
          c.licence = 'licensed'
          and public.has_plus_access()
          and cs.licence = 'licensed'
        )
      )
  );
$$;

revoke all on function public.can_read_passage(uuid) from public;
revoke all on function public.can_read_commentary(uuid) from public;
grant execute on function public.can_read_passage(uuid) to authenticated;
grant execute on function public.can_read_commentary(uuid) to authenticated;

drop policy if exists "authenticated read rights-cleared passages" on public.passages;
create policy "authenticated read rights-cleared passages"
  on public.passages
  for select
  to authenticated
  using (public.can_read_passage(id));

drop policy if exists "authenticated read rights-cleared commentaries" on public.commentaries;
create policy "authenticated read rights-cleared commentaries"
  on public.commentaries
  for select
  to authenticated
  using (public.can_read_commentary(id));

-- Down:
--   drop policy if exists "authenticated read rights-cleared passages" on public.passages;
--   drop policy if exists "authenticated read rights-cleared commentaries" on public.commentaries;
--   drop function if exists public.can_read_commentary(uuid);
--   drop function if exists public.can_read_passage(uuid);
--   recreate the policies from 20260806010000_source_excerpt_rls.sql;

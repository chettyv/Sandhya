-- Keep source excerpts behind the same licence gate used by RAG retrieval.
-- Untracked passages are not exposed to app users; service-role ingestion and
-- the ask function remain able to read the corpus for backend work.

drop policy if exists "authenticated read passages" on public.passages;
create policy "authenticated read rights-cleared passages"
  on public.passages
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.passage_embeddings pe
      left join public.commentaries c on c.id = pe.commentary_id
      left join public.content_sources cs on cs.id = pe.source_document_id
      where pe.passage_id = passages.id
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
        where pe.passage_id = passages.id
          and coalesce(c.licence, 'public_domain') in ('public_domain', 'licensed', 'original')
          and coalesce(cs.licence, 'public_domain') in ('public_domain', 'licensed', 'original')
          and coalesce(cs.can_store, false) = true
          and coalesce(cs.can_show_excerpts, false) = true
      )
    )
  );

drop policy if exists "authenticated read commentaries" on public.commentaries;
create policy "authenticated read rights-cleared commentaries"
  on public.commentaries
  for select
  to authenticated
  using (
    licence in ('public_domain', 'original')
    or (
      licence = 'licensed'
      and public.has_plus_access()
      and exists (
        select 1
        from public.passage_embeddings pe
        join public.content_sources cs on cs.id = pe.source_document_id
        where pe.commentary_id = commentaries.id
          and cs.licence = 'licensed'
          and cs.can_store = true
          and cs.can_show_excerpts = true
      )
    )
  );

-- Down:
--   drop policy if exists "authenticated read rights-cleared passages" on public.passages;
--   drop policy if exists "authenticated read rights-cleared commentaries" on public.commentaries;
--   recreate the original authenticated read policies from 20260601120100_source_content.sql;

-- Cached answers must use the same all-source rights rule as passage RLS.
-- A later unsafe embedding for the same passage must invalidate the cache;
-- otherwise a previously safe answer could bypass a rights revocation.

create or replace function public.cached_answer_sources_are_allowed(
  p_retrieved_ids uuid[],
  p_allowed_licences text[],
  p_content_types text[],
  p_tradition_filter text default 'general',
  p_languages text[] default null
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when p_retrieved_ids is null then false
    when cardinality(p_retrieved_ids) = 0 then true
    else coalesce((
      select count(distinct requested.id) = cardinality(p_retrieved_ids)
      from unnest(p_retrieved_ids) as requested(id)
      where exists (
        select 1
        from public.passage_embeddings pe
        join public.passages p on p.id = pe.passage_id
        join public.texts t on t.id = p.text_id
        left join public.commentaries c on c.id = pe.commentary_id
        join public.content_sources cs on cs.id = pe.source_document_id
        where pe.passage_id = requested.id
          and pe.content_type = any(p_content_types)
          and cs.licence = any(p_allowed_licences)
          and (c.id is null or c.licence = any(p_allowed_licences))
          and cs.can_store = true
          and cs.can_embed = true
          and cs.can_show_excerpts = true
          and (
            p_languages is null
            or cs.language = any(p_languages)
          )
          and (
            p_tradition_filter is null
            or coalesce(c.tradition, t.tradition_primary, 'general') = any(
              array['general', p_tradition_filter]
            )
          )
      )
      and not exists (
        select 1
        from public.passage_embeddings pe
        left join public.commentaries c on c.id = pe.commentary_id
        left join public.content_sources cs on cs.id = pe.source_document_id
        where pe.passage_id = requested.id
          and (
            cs.id is null
            or cs.licence <> all(p_allowed_licences)
            or cs.can_store is not true
            or cs.can_embed is not true
            or cs.can_show_excerpts is not true
            or (c.id is not null and c.licence <> all(p_allowed_licences))
          )
      )
    ), false)
  end;
$$;

revoke all on function public.cached_answer_sources_are_allowed(uuid[], text[], text[], text, text[]) from public;
grant execute on function public.cached_answer_sources_are_allowed(uuid[], text[], text[], text, text[]) to service_role;

-- Down:
--   recreate the definition from 20260806230000_cached_answer_rights.sql;

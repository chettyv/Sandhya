-- A cached answer is valid only when every cited passage has a currently
-- usable embedding for the active model. Rights are still checked across all
-- embeddings so a stale or unsafe provenance row cannot be hidden by a newer
-- model's safe row.

drop function if exists public.cached_answer_sources_are_allowed(
  uuid[], text[], text[], text, text[]
);

create function public.cached_answer_sources_are_allowed(
  p_retrieved_ids uuid[],
  p_allowed_licences text[],
  p_content_types text[],
  p_tradition_filter text default 'general',
  p_languages text[] default null,
  p_embedding_model text default 'text-embedding-3-small'
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
          and pe.embedding_model = p_embedding_model
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
            or p_tradition_filter = 'general'
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
            or cs.licence is null
            or cs.licence <> all(p_allowed_licences)
            or cs.can_store is not true
            or cs.can_embed is not true
            or cs.can_show_excerpts is not true
            or (c.id is not null and (c.licence is null or c.licence <> all(p_allowed_licences)))
          )
      )
    ), false)
  end;
$$;

revoke all on function public.cached_answer_sources_are_allowed(
  uuid[], text[], text[], text, text[], text
) from public;
grant execute on function public.cached_answer_sources_are_allowed(
  uuid[], text[], text[], text, text[], text
) to service_role;

-- Down:
--   drop function if exists public.cached_answer_sources_are_allowed(
--     uuid[], text[], text[], text, text[], text
--   );
--   recreate the 5-argument all-source definition from
--   20260807010000_cached_answer_rights_all_sources.sql.

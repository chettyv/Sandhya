-- Cached answers must not bypass a later source-rights or corpus-access
-- decision. Cache keys separate free/Plus policy, but rights can still be
-- revoked or a passage can be removed after an answer was cached.

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
      join public.passage_embeddings pe on pe.passage_id = requested.id
      join public.passages p on p.id = pe.passage_id
      join public.texts t on t.id = p.text_id
      left join public.commentaries c on c.id = pe.commentary_id
      left join public.content_sources cs on cs.id = pe.source_document_id
      where pe.content_type = any(p_content_types)
        and coalesce(c.licence, cs.licence, 'public_domain') = any(p_allowed_licences)
        and coalesce(cs.can_store, false) = true
        and coalesce(cs.can_embed, false) = true
        and coalesce(cs.can_show_excerpts, false) = true
        and (
          p_languages is null
          or coalesce(cs.language, 'en') = any(p_languages)
        )
        and (
          p_tradition_filter is null
          or coalesce(c.tradition, t.tradition_primary, 'general') = any(
            array['general', p_tradition_filter]
          )
        )
    ), false)
  end;
$$;

revoke all on function public.cached_answer_sources_are_allowed(uuid[], text[], text[], text, text[]) from public;
grant execute on function public.cached_answer_sources_are_allowed(uuid[], text[], text[], text, text[]) to service_role;

-- Down:
--   drop function if exists public.cached_answer_sources_are_allowed(uuid[], text[], text[], text, text[]);

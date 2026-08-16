-- Phase 0.5 Fix 1 (02-plan.md): tradition preference must ORDER retrieval,
-- never NARROW it. The previous definition structurally prevented a user who
-- stated a tradition from ever retrieving another tradition's reading, while
-- the answer prompt asked the model to "mention variation" over a context the
-- retrieval layer had already stripped of variation.
--
-- This redefinition removes the tradition WHERE clause and instead gives
-- passages matching the stated tradition a small, bounded ranking boost, so
-- the stated tradition leads without pushing other traditions out of the
-- result set. Licence, content-type, language, and similarity gates are
-- rights and quality filters and are unchanged.

drop function if exists public.match_passage_embeddings(
  vector(1536), integer, text[], text[], text, text[], double precision, text,
  double precision, text
);

create function public.match_passage_embeddings(
  query_embedding vector(1536),
  match_count integer default 8,
  allowed_licences text[] default array['public_domain', 'original'],
  content_types text[] default array['translation', 'commentary', 'combined'],
  tradition_filter text default 'general',
  languages text[] default null,
  min_similarity double precision default 0,
  query_text text default null,
  keyword_weight double precision default 0.15,
  embedding_model text default 'text-embedding-3-small'
)
returns table (
  passage_id uuid,
  commentary_id uuid,
  text_id uuid,
  title text,
  section text,
  verse_number text,
  chunk_text text,
  content_type text,
  licence text,
  tradition text,
  language text,
  source_url text,
  similarity double precision
)
language sql
stable
security definer
set search_path = public
as $$
  with query as (
    select
      case
        when nullif(trim(query_text), '') is null then null
        else websearch_to_tsquery('simple', query_text)
      end as tsq,
      greatest(0, least(coalesce(keyword_weight, 0), 0.5)) as kw
  ),
  candidates as (
    select
      p.id as passage_id,
      pe.commentary_id,
      t.id as text_id,
      t.title,
      p.section,
      p.verse_number,
      pe.chunk_text,
      pe.content_type,
      coalesce(c.licence, cs.licence, 'public_domain') as licence,
      coalesce(c.tradition, t.tradition_primary, 'general') as tradition,
      cs.language as language,
      coalesce(
        c.source_url,
        pe.metadata->>'source_url',
        p.word_meanings #>> '{import,source_url}',
        cs.source_url
      ) as source_url,
      1 - (pe.embedding <=> query_embedding) as similarity,
      coalesce(
        ts_rank_cd(
          to_tsvector('simple', concat_ws(' ', t.title, p.section, p.verse_number, pe.chunk_text)),
          (select tsq from query)
        ),
        0
      ) as keyword_rank,
      pe.embedding <=> query_embedding as distance
    from public.passage_embeddings pe
    join public.passages p on p.id = pe.passage_id
    join public.texts t on t.id = p.text_id
    left join public.commentaries c on c.id = pe.commentary_id
    left join public.content_sources cs on cs.id = pe.source_document_id
    where pe.embedding_model = $10
      and pe.content_type = any(content_types)
      and cs.id is not null
      and cs.licence = any(allowed_licences)
      and (c.id is null or c.licence = any(allowed_licences))
      and coalesce(cs.can_store, false) = true
      and coalesce(cs.can_embed, false) = true
      and coalesce(cs.can_show_excerpts, false) = true
      and (languages is null or cs.language = any(languages))
      and (1 - (pe.embedding <=> query_embedding)) >= min_similarity
    order by pe.embedding <=> query_embedding
    limit greatest(20, least(match_count * 4, 80))
  )
  select
    candidates.passage_id,
    candidates.commentary_id,
    candidates.text_id,
    candidates.title,
    candidates.section,
    candidates.verse_number,
    candidates.chunk_text,
    candidates.content_type,
    candidates.licence,
    candidates.tradition,
    candidates.language,
    candidates.source_url,
    candidates.similarity
  from candidates, query
  order by
    (candidates.similarity * (1 - query.kw))
      + (least(candidates.keyword_rank, 1) * query.kw)
      -- Bounded preference boost: lifts the stated tradition among near-peers
      -- without letting preference outrank a clearly more relevant passage
      -- from another tradition. Keep it small; a large boost would recreate
      -- the narrowing this migration removes.
      + (case
          when tradition_filter is not null
            and tradition_filter <> 'general'
            and candidates.tradition = tradition_filter
          then 0.05
          else 0
        end) desc,
    candidates.distance asc
  limit greatest(1, least(match_count, 20));
$$;

revoke all on function public.match_passage_embeddings(
  vector(1536), integer, text[], text[], text, text[], double precision, text,
  double precision, text
) from public;
grant execute on function public.match_passage_embeddings(
  vector(1536), integer, text[], text[], text, text[], double precision, text,
  double precision, text
) to service_role;

-- Tradition is a ranking preference, not a rights dimension, so it no longer
-- gates cached-answer reuse either. Cache keys remain tradition-scoped (the
-- edge function hashes tradition_filter into the question hash), so answers
-- ranked for one preference are never served to another. p_tradition_filter
-- is retained for call compatibility and is deliberately unused.

drop function if exists public.cached_answer_sources_are_allowed(
  uuid[], text[], text[], text, text[], text
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
--   drop function if exists public.match_passage_embeddings(
--     vector(1536), integer, text[], text[], text, text[], double precision, text,
--     double precision, text
--   );
--   drop function if exists public.cached_answer_sources_are_allowed(
--     uuid[], text[], text[], text, text[], text
--   );
--   recreate both narrowing definitions from
--   20260807020000_embedding_model_filter.sql and
--   20260807030000_cached_answer_model_filter.sql.

-- Vector similarity is only meaningful within the same embedding model.
-- Keep the active model explicit in the RPC so a re-embed cannot silently
-- mix vectors that happen to share the configured dimension.

drop function if exists public.match_passage_embeddings(
  vector(1536), integer, text[], text[], text, text[], double precision, text,
  double precision
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
      and (
        tradition_filter is null
        or tradition_filter = 'general'
        or coalesce(c.tradition, t.tradition_primary, 'general') in ('general', tradition_filter)
      )
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
    (candidates.similarity * (1 - query.kw)) + (least(candidates.keyword_rank, 1) * query.kw) desc,
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

-- Down:
--   drop function if exists public.match_passage_embeddings(
--     vector(1536), integer, text[], text[], text, text[], double precision, text,
--     double precision, text
--   );
--   recreate the 9-argument all-source definition from
--   20260806160000_rag_rights_require_all_sources.sql.

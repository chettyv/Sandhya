-- 20260708120000_rag_rpc.sql
-- Server-side helpers for the RAG backend:
--   - source metadata tracking for corpus ingestion
--   - vector retrieval with licence/tradition/content-type filters
--   - cache hit accounting
--   - atomic AI quota consumption

create table if not exists public.content_sources (
  id                 uuid primary key default uuid_generate_v4(),
  source_key         text unique not null,
  title              text not null,
  language           text not null default 'en',
  translator         text,
  source_url         text,
  licence            text not null default 'public_domain'
    check (licence in ('public_domain', 'licensed', 'original')),
  copyright_status   text,
  can_store          boolean not null default false,
  can_show_excerpts  boolean not null default false,
  can_embed          boolean not null default false,
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists content_sources_language_idx
  on public.content_sources (language);
create index if not exists content_sources_licence_idx
  on public.content_sources (licence);

alter table public.content_sources enable row level security;
-- No public policies. Corpus provenance is managed by service-role ingestion.

alter table public.passage_embeddings
  add column if not exists source_document_id uuid references public.content_sources(id) on delete set null,
  add column if not exists chunk_hash text,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

create unique index if not exists passage_embeddings_model_chunk_hash_uidx
  on public.passage_embeddings (embedding_model, chunk_hash);

create index if not exists passage_embeddings_source_document_id_idx
  on public.passage_embeddings (source_document_id);

alter table public.cached_answers
  alter column question_text drop not null,
  add column if not exists retrieved_passage_ids uuid[] not null default '{}';

create or replace function public.is_valid_rag_structured_response(response jsonb)
returns boolean
language plpgsql
immutable
strict
set search_path = public
as $$
declare
  sources_json jsonb := case
    when jsonb_typeof(response->'sources') = 'array' then response->'sources'
    else '[]'::jsonb
  end;
  tradition_notes_json jsonb := case
    when jsonb_typeof(response->'tradition_notes') = 'array' then response->'tradition_notes'
    else '[]'::jsonb
  end;
begin
  return (with shaped as (
    select sources_json as sources, tradition_notes_json as tradition_notes
  )
  select coalesce((
    jsonb_typeof(response) = 'object'
    and response ? 'answer'
    and jsonb_typeof(response->'answer') = 'string'
    and length(trim(response->>'answer')) > 0
    and response ? 'summary'
    and jsonb_typeof(response->'summary') = 'string'
    and length(trim(response->>'summary')) > 0
    and response ? 'sources'
    and jsonb_typeof(response->'sources') = 'array'
    and jsonb_array_length(shaped.sources) <= 6
    and (
      jsonb_array_length(shaped.sources) > 0
      or response->>'confidence' = 'low'
      or jsonb_typeof(response->'safety_note') = 'string'
    )
    and not exists (
      select 1
      from jsonb_array_elements(shaped.sources) as source(value)
      where jsonb_typeof(source.value) <> 'object'
        or not (source.value ? 'passage_id')
        or not ((source.value->>'passage_id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
        or not (source.value ? 'title')
        or jsonb_typeof(source.value->'title') <> 'string'
        or length(trim(source.value->>'title')) = 0
        or not (source.value ? 'location')
        or jsonb_typeof(source.value->'location') <> 'string'
        or length(trim(source.value->>'location')) = 0
        or not (source.value ? 'relevance')
        or jsonb_typeof(source.value->'relevance') <> 'string'
        or length(trim(source.value->>'relevance')) = 0
    )
    and response ? 'tradition_notes'
    and jsonb_typeof(response->'tradition_notes') = 'array'
    and not exists (
      select 1
      from jsonb_array_elements(shaped.tradition_notes) as note(value)
      where jsonb_typeof(note.value) <> 'string'
        or length(trim(note.value #>> '{}')) = 0
    )
    and response ? 'confidence'
    and response->>'confidence' in ('high', 'medium', 'low')
    and response ? 'safety_note'
    and jsonb_typeof(response->'safety_note') in ('string', 'null')
    and (
      jsonb_typeof(response->'safety_note') = 'null'
      or length(trim(response->>'safety_note')) > 0
    )
    and response ? 'suggested_practice'
    and jsonb_typeof(response->'suggested_practice') in ('string', 'null')
    and (
      jsonb_typeof(response->'suggested_practice') = 'null'
      or length(trim(response->>'suggested_practice')) > 0
    )),
    false
  )
  from shaped);
end;
$$;

create or replace function public.rag_response_citations_match_retrieved_ids(
  response jsonb,
  retrieved_ids uuid[]
)
returns boolean
language sql
immutable
strict
set search_path = public
as $$
  with sources as (
    select source.value->>'passage_id' as passage_id
    from jsonb_array_elements(
      case
        when jsonb_typeof(response->'sources') = 'array' then response->'sources'
        else '[]'::jsonb
      end
    ) as source(value)
  )
  select coalesce(
    not exists (
      select 1
      from sources
      where not exists (
        select 1
        from unnest(retrieved_ids) as retrieved(id)
        where retrieved.id::text = sources.passage_id
      )
    )
    and (
      select count(*) = count(distinct sources.passage_id)
      from sources
    ),
    false
  );
$$;

create or replace function public.uuid_array_has_unique_values(
  values_to_check uuid[]
)
returns boolean
language sql
immutable
strict
set search_path = public
as $$
  select coalesce(
    cardinality(values_to_check) = (
      select count(distinct value)
      from unnest(values_to_check) as unnested(value)
    ),
    false
  );
$$;

revoke all on function public.is_valid_rag_structured_response(jsonb) from public;
revoke all on function public.rag_response_citations_match_retrieved_ids(jsonb, uuid[]) from public;
revoke all on function public.uuid_array_has_unique_values(uuid[]) from public;
grant execute on function public.is_valid_rag_structured_response(jsonb) to service_role;
grant execute on function public.rag_response_citations_match_retrieved_ids(jsonb, uuid[]) to service_role;
grant execute on function public.uuid_array_has_unique_values(uuid[]) to service_role;
grant execute on function public.is_valid_rag_structured_response(jsonb) to authenticated;
grant execute on function public.rag_response_citations_match_retrieved_ids(jsonb, uuid[]) to authenticated;
grant execute on function public.uuid_array_has_unique_values(uuid[]) to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'cached_answers_structured_response_shape_chk'
  ) then
    alter table public.cached_answers
      add constraint cached_answers_structured_response_shape_chk check (
        public.is_valid_rag_structured_response(structured_response)
      ) not valid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'cached_answers_citations_backed_by_retrieval_chk'
  ) then
    alter table public.cached_answers
      add constraint cached_answers_citations_backed_by_retrieval_chk check (
        public.rag_response_citations_match_retrieved_ids(
          structured_response,
          retrieved_passage_ids
        )
      ) not valid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'cached_answers_retrieved_passage_ids_limit_chk'
  ) then
    alter table public.cached_answers
      add constraint cached_answers_retrieved_passage_ids_limit_chk check (
        cardinality(retrieved_passage_ids) <= 20
      ) not valid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'cached_answers_retrieved_passage_ids_unique_chk'
  ) then
    alter table public.cached_answers
      add constraint cached_answers_retrieved_passage_ids_unique_chk check (
        public.uuid_array_has_unique_values(retrieved_passage_ids)
      ) not valid;
  end if;
end $$;

drop policy if exists "users insert messages in own conversations" on public.messages;
create policy "users insert own user messages only"
  on public.messages for insert
  with check (
    role = 'user'
    and structured_response is null
    and cardinality(retrieved_passage_ids) = 0
    and model_used is null
    and tokens_in is null
    and tokens_out is null
    and cost_usd is null
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid()
    )
  );

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'messages_rag_audit_shape_chk'
  ) then
    alter table public.messages
      add constraint messages_rag_audit_shape_chk check (
        (
          role = 'user'
          and structured_response is null
          and cardinality(retrieved_passage_ids) = 0
          and model_used is null
          and tokens_in is null
          and tokens_out is null
          and cost_usd is null
        )
        or (
          role = 'assistant'
          and structured_response is not null
          and public.is_valid_rag_structured_response(structured_response)
          and public.rag_response_citations_match_retrieved_ids(
            structured_response,
            retrieved_passage_ids
          )
          and cardinality(retrieved_passage_ids) <= 20
          and public.uuid_array_has_unique_values(retrieved_passage_ids)
          and tokens_in is not null
          and tokens_in >= 0
          and tokens_out is not null
          and tokens_out >= 0
          and cost_usd is not null
          and cost_usd >= 0
        )
      ) not valid;
  end if;
end $$;

create or replace function public.match_passage_embeddings(
  query_embedding vector(1536),
  match_count integer default 8,
  allowed_licences text[] default array['public_domain', 'original'],
  content_types text[] default array['translation', 'commentary', 'combined'],
  tradition_filter text default 'general',
  languages text[] default null,
  min_similarity double precision default 0,
  query_text text default null,
  keyword_weight double precision default 0.15
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
      coalesce(cs.language, 'en') as language,
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
    where pe.content_type = any(content_types)
      and coalesce(c.licence, cs.licence, 'public_domain') = any(allowed_licences)
      and coalesce(cs.can_store, false) = true
      and coalesce(cs.can_embed, false) = true
      and coalesce(cs.can_show_excerpts, false) = true
      and (languages is null or coalesce(cs.language, 'en') = any(languages))
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

revoke all on function public.match_passage_embeddings(vector(1536), integer, text[], text[], text, text[], double precision, text, double precision) from public;
grant execute on function public.match_passage_embeddings(vector(1536), integer, text[], text[], text, text[], double precision, text, double precision) to service_role;

create or replace function public.record_cached_answer_hit(p_question_hash text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.cached_answers
  set hit_count = hit_count + 1,
      last_used_at = now()
  where question_hash = p_question_hash;
$$;

revoke all on function public.record_cached_answer_hit(text) from public;
grant execute on function public.record_cached_answer_hit(text) to service_role;

create or replace function public.consume_ai_message(
  p_user_id uuid,
  p_free_daily_limit integer default 5
)
returns table (
  allowed boolean,
  plan text,
  ai_messages_count integer,
  free_daily_limit integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  quota_row public.usage_quotas%rowtype;
  effective_free_daily_limit integer := greatest(0, coalesce(p_free_daily_limit, 5));
begin
  insert into public.usage_quotas (user_id, date, ai_messages_count, plan, updated_at)
  values (p_user_id, current_date, 0, 'free', now())
  on conflict (user_id) do nothing;

  update public.usage_quotas
  set ai_messages_count = case
        when date = current_date then ai_messages_count
        else 0
      end,
      date = current_date,
      updated_at = now()
  where user_id = p_user_id
  returning * into quota_row;

  if quota_row.plan <> 'free' then
    return query
      update public.usage_quotas
      set ai_messages_count = ai_messages_count + 1,
          updated_at = now()
      where user_id = p_user_id
      returning true, usage_quotas.plan, usage_quotas.ai_messages_count, effective_free_daily_limit;
    return;
  end if;

  if quota_row.ai_messages_count >= effective_free_daily_limit then
    return query
      select false, quota_row.plan, quota_row.ai_messages_count, effective_free_daily_limit;
    return;
  end if;

  return query
    update public.usage_quotas
    set ai_messages_count = ai_messages_count + 1,
        updated_at = now()
    where user_id = p_user_id
    returning true, usage_quotas.plan, usage_quotas.ai_messages_count, effective_free_daily_limit;
end;
$$;

revoke all on function public.consume_ai_message(uuid, integer) from public;
grant execute on function public.consume_ai_message(uuid, integer) to service_role;

create or replace function public.check_ai_monthly_budget(
  p_user_id uuid,
  p_monthly_budget_usd numeric default 0
)
returns table (
  allowed boolean,
  current_spend_usd numeric,
  monthly_budget_usd numeric
)
language sql
stable
security definer
set search_path = public
as $$
  with spend as (
    select coalesce(sum(m.cost_usd), 0)::numeric as current_spend_usd
    from public.messages m
    join public.conversations c on c.id = m.conversation_id
    where c.user_id = p_user_id
      and m.role = 'assistant'
      and m.created_at >= date_trunc('month', now())
      and m.cost_usd is not null
  )
  select
    p_monthly_budget_usd <= 0 or spend.current_spend_usd < p_monthly_budget_usd,
    spend.current_spend_usd,
    greatest(0, coalesce(p_monthly_budget_usd, 0))
  from spend;
$$;

revoke all on function public.check_ai_monthly_budget(uuid, numeric) from public;
grant execute on function public.check_ai_monthly_budget(uuid, numeric) to service_role;

create or replace function public.refund_ai_message(
  p_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.usage_quotas
  set ai_messages_count = greatest(0, ai_messages_count - 1),
      updated_at = now()
  where user_id = p_user_id
    and date = current_date
    and ai_messages_count > 0;
end;
$$;

revoke all on function public.refund_ai_message(uuid) from public;
grant execute on function public.refund_ai_message(uuid) to service_role;

-- Down:
--   drop function if exists public.refund_ai_message(uuid);
--   drop function if exists public.check_ai_monthly_budget(uuid, numeric);
--   drop function if exists public.consume_ai_message(uuid, integer);
--   drop function if exists public.record_cached_answer_hit(text);
--   drop function if exists public.match_passage_embeddings(vector(1536), integer, text[], text[], text, text[], double precision, text, double precision);
--   drop function if exists public.uuid_array_has_unique_values(uuid[]);
--   drop function if exists public.rag_response_citations_match_retrieved_ids(jsonb, uuid[]);
--   drop function if exists public.is_valid_rag_structured_response(jsonb);
--   drop index if exists public.passage_embeddings_source_document_id_idx;
--   drop index if exists public.passage_embeddings_model_chunk_hash_uidx;
--   alter table public.passage_embeddings drop column if exists metadata;
--   alter table public.passage_embeddings drop column if exists chunk_hash;
--   alter table public.passage_embeddings drop column if exists source_document_id;
--   drop table if exists public.content_sources cascade;

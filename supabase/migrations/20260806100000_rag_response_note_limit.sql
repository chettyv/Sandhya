-- Keep persisted structured answers bounded even when they are written by a
-- future backend path instead of the current provider validators.

create or replace function public.is_valid_rag_structured_response(response jsonb)
returns boolean
language sql
immutable
strict
as $$
  with shaped as (
    select
      case
        when jsonb_typeof(response->'sources') = 'array' then response->'sources'
        else '[]'::jsonb
      end as sources,
      case
        when jsonb_typeof(response->'tradition_notes') = 'array' then response->'tradition_notes'
        else '[]'::jsonb
      end as tradition_notes
  )
  select coalesce(
    jsonb_typeof(response) = 'object'
    and response ? 'answer'
    and jsonb_typeof(response->'answer') = 'string'
    and length(trim(response->>'answer')) > 0
    and length(response->>'answer') <= 12000
    and response ? 'summary'
    and jsonb_typeof(response->'summary') = 'string'
    and length(trim(response->>'summary')) > 0
    and length(response->>'summary') <= 2000
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
        or jsonb_typeof(source.value->'passage_id') <> 'string'
        or (source.value->>'passage_id') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        or not (source.value ? 'title')
        or jsonb_typeof(source.value->'title') <> 'string'
        or length(trim(source.value->>'title')) = 0
        or length(source.value->>'title') > 1000
        or not (source.value ? 'location')
        or jsonb_typeof(source.value->'location') <> 'string'
        or length(trim(source.value->>'location')) = 0
        or length(source.value->>'location') > 1000
        or not (source.value ? 'relevance')
        or jsonb_typeof(source.value->'relevance') <> 'string'
        or length(trim(source.value->>'relevance')) = 0
        or length(source.value->>'relevance') > 1000
    )
    and response ? 'tradition_notes'
    and jsonb_typeof(response->'tradition_notes') = 'array'
    and jsonb_array_length(shaped.tradition_notes) <= 8
    and not exists (
      select 1
      from jsonb_array_elements(shaped.tradition_notes) as note(value)
      where jsonb_typeof(note.value) <> 'string'
        or length(trim(note.value #>> '{}')) = 0
        or length(note.value #>> '{}') > 1000
    )
    and response ? 'confidence'
    and response->>'confidence' in ('high', 'medium', 'low')
    and response ? 'safety_note'
    and (
      response->'safety_note' = 'null'::jsonb
      or (
        jsonb_typeof(response->'safety_note') = 'string'
        and length(trim(response->>'safety_note')) > 0
        and length(response->>'safety_note') <= 2000
      )
    )
    and response ? 'suggested_practice'
    and (
      response->'suggested_practice' = 'null'::jsonb
      or (
        jsonb_typeof(response->'suggested_practice') = 'string'
        and length(trim(response->>'suggested_practice')) > 0
        and length(response->>'suggested_practice') <= 2000
      )
    ),
    false
  );
$$;

revoke all on function public.is_valid_rag_structured_response(jsonb) from public;
grant execute on function public.is_valid_rag_structured_response(jsonb) to service_role;
grant execute on function public.is_valid_rag_structured_response(jsonb) to authenticated;

-- Re-validate existing rows after tightening the predicate without blocking
-- migration application on legacy rows that require manual cleanup.
alter table public.cached_answers
  drop constraint if exists cached_answers_structured_response_shape_chk,
  add constraint cached_answers_structured_response_shape_chk check (
    public.is_valid_rag_structured_response(structured_response)
  ) not valid;

-- Down:
--   recreate public.is_valid_rag_structured_response(jsonb) and the cached
--   answer constraint from 20260708120000_rag_rpc.sql.

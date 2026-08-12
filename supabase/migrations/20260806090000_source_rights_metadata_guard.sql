-- Rights flags are meaningful only when the source tracker contains the
-- evidence needed to audit the source. Normalize legacy incomplete rows to
-- deny access, then prevent future rights-cleared rows from omitting it.

update public.content_sources
set can_store = false,
    can_show_excerpts = false,
    can_embed = false,
    updated_at = now()
where (can_store or can_show_excerpts or can_embed)
  and (
    nullif(trim(source_url), '') is null
    or nullif(trim(copyright_status), '') is null
    or (licence = 'licensed' and nullif(trim(translator), '') is null)
  );

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'content_sources_rights_metadata_chk'
  ) then
    alter table public.content_sources
      add constraint content_sources_rights_metadata_chk check (
        (
          not (can_store or can_show_excerpts or can_embed)
          or (
            nullif(trim(source_url), '') is not null
            and nullif(trim(copyright_status), '') is not null
            and (licence <> 'licensed' or nullif(trim(translator), '') is not null)
          )
        )
      ) not valid;
  end if;
end $$;

-- Down:
--   alter table public.content_sources
--     drop constraint if exists content_sources_rights_metadata_chk;

-- RLS controls ownership, while these checks control row size. They also
-- protect direct authenticated table writes that do not pass through an Edge
-- Function request-body limit.

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_display_name_length_chk') then
    alter table public.profiles
      add constraint profiles_display_name_length_chk
      check (display_name is null or length(display_name) <= 120) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_location_length_chk') then
    alter table public.profiles
      add constraint profiles_location_length_chk
      check (location is null or length(location) <= 120) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'conversations_title_length_chk') then
    alter table public.conversations
      add constraint conversations_title_length_chk
      check (title is null or length(title) <= 200) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'messages_content_length_chk') then
    alter table public.messages
      add constraint messages_content_length_chk
      check (
        (role = 'user' and length(content) <= 2000)
        or (role = 'assistant' and length(content) <= 12000)
      ) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'saved_items_notes_length_chk') then
    alter table public.saved_items
      add constraint saved_items_notes_length_chk
      check (notes is null or length(notes) <= 4000) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'journal_entries_prompt_length_chk') then
    alter table public.journal_entries
      add constraint journal_entries_prompt_length_chk
      check (prompt is null or length(prompt) <= 2000) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'journal_entries_entry_length_chk') then
    alter table public.journal_entries
      add constraint journal_entries_entry_length_chk
      check (length(entry) between 1 and 20000) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'journal_entries_mood_length_chk') then
    alter table public.journal_entries
      add constraint journal_entries_mood_length_chk
      check (mood is null or length(mood) <= 100) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'feedback_notes_length_chk') then
    alter table public.feedback
      add constraint feedback_notes_length_chk
      check (notes is null or length(notes) <= 4000) not valid;
  end if;
end $$;

-- Down:
--   alter table public.feedback drop constraint if exists feedback_notes_length_chk;
--   alter table public.journal_entries drop constraint if exists journal_entries_mood_length_chk;
--   alter table public.journal_entries drop constraint if exists journal_entries_entry_length_chk;
--   alter table public.journal_entries drop constraint if exists journal_entries_prompt_length_chk;
--   alter table public.saved_items drop constraint if exists saved_items_notes_length_chk;
--   alter table public.messages drop constraint if exists messages_content_length_chk;
--   alter table public.conversations drop constraint if exists conversations_title_length_chk;
--   alter table public.profiles drop constraint if exists profiles_location_length_chk;
--   alter table public.profiles drop constraint if exists profiles_display_name_length_chk;

-- Keep moderation-owned feedback fields server-controlled.
-- Authenticated users may submit a new report, but cannot forge its review
-- state or write internal admin notes through the table API.

drop policy if exists "users insert own feedback" on public.feedback;
create policy "users insert own feedback"
  on public.feedback for insert
  with check (
    auth.uid() = user_id
    and status = 'pending'
    and admin_notes is null
    and exists (
      select 1
      from public.messages m
      join public.conversations c on c.id = m.conversation_id
      where m.id = feedback.message_id and c.user_id = auth.uid()
    )
  );

-- Down:
--   drop policy if exists "users insert own feedback" on public.feedback;
--   create policy "users insert own feedback"
--     on public.feedback for insert
--     with check (
--       auth.uid() = user_id
--       and exists (
--         select 1
--         from public.messages m
--         join public.conversations c on c.id = m.conversation_id
--         where m.id = feedback.message_id and c.user_id = auth.uid()
--       )
--     );

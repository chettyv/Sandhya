-- Moderator notes are internal operational data. The consumer can submit a
-- report and receive it in an account export without being able to query the
-- feedback table directly and read admin_notes through the client API.

drop policy if exists "users read own feedback" on public.feedback;

-- Down:
--   drop policy if exists "users read own feedback" on public.feedback;
--   create policy "users read own feedback"
--     on public.feedback for select using (auth.uid() = user_id);

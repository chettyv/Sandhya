-- UPDATE policies need both a USING predicate for the old row and a WITH
-- CHECK predicate for the new row. Without WITH CHECK, an authenticated user
-- could attempt to move an owned row to another user's UUID during UPDATE.

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "users update own conversations" on public.conversations;
create policy "users update own conversations"
  on public.conversations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users update own saved_items" on public.saved_items;
create policy "users update own saved_items"
  on public.saved_items for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users update own journal" on public.journal_entries;
create policy "users update own journal"
  on public.journal_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users update own push tokens" on public.device_push_tokens;
create policy "users update own push tokens"
  on public.device_push_tokens for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Down: restore the previous USING-only update policies from the original
-- table migrations if a rollback is explicitly required.

-- Trigger functions are invoked by PostgreSQL triggers, not by client RPCs.
-- Remove their default PUBLIC EXECUTE privilege so they cannot be called as
-- arbitrary application functions. Existing triggers continue to invoke them
-- under the trigger owner.

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.touch_updated_at() from public, anon, authenticated;
revoke all on function public.touch_conversation_updated_at() from public, anon, authenticated;

-- Down:
--   grant execute on function public.handle_new_user() to public;
--   grant execute on function public.touch_updated_at() to public;
--   grant execute on function public.touch_conversation_updated_at() to public;

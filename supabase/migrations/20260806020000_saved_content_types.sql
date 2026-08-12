-- Allow the consumer library to persist saved concepts and sacred texts alongside the existing
-- reflection, practice, festival, passage, and message types.

alter table public.saved_items
  drop constraint if exists saved_items_item_type_check;

alter table public.saved_items
  add constraint saved_items_item_type_check
  check (item_type in ('message', 'reflection', 'passage', 'practice', 'festival', 'concept', 'text'));

-- Down:
--   delete from public.saved_items where item_type in ('concept', 'text');
--   alter table public.saved_items drop constraint if exists saved_items_item_type_check;
--   alter table public.saved_items add constraint saved_items_item_type_check
--     check (item_type in ('message', 'reflection', 'passage', 'practice', 'festival'));

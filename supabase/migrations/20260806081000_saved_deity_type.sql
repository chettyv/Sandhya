-- Allow deity entries to use the same saved-items flow as other library content.
alter table public.saved_items
  drop constraint if exists saved_items_item_type_check;

alter table public.saved_items
  add constraint saved_items_item_type_check
  check (item_type in ('message', 'reflection', 'passage', 'practice', 'festival', 'concept', 'deity', 'text'));

-- Down:
--   alter table public.saved_items drop constraint if exists saved_items_item_type_check;
--   alter table public.saved_items add constraint saved_items_item_type_check
--     check (item_type in ('message', 'reflection', 'passage', 'practice', 'festival', 'concept', 'text'));

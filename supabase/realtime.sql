-- Enable Supabase Realtime for homepage live updates
-- Date: 2026-08-24
-- Project: Cssf-Funaab
--
-- Run this script in the Supabase SQL editor.
-- It is idempotent and safe to re-run.
--
-- Required so browsers subscribed via postgres_changes receive
-- INSERT/UPDATE/DELETE events for these tables.

begin;

do $$
begin
  alter publication supabase_realtime add table public.banners;
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  alter publication supabase_realtime add table public.memory_verses;
exception
  when duplicate_object then null;
end
$$;

commit;

-- Memory verses table + RLS policies
-- Date: 2026-08-11
-- Project: Cssf-Funaab
--
-- IMPORTANT:
-- Run this script in the Supabase SQL editor.
-- It is idempotent and safe to re-run.

begin;

-- Helper used by the admin RLS policies. Kept here so this script is
-- self-contained. Idempotent (create or replace).
create or replace function public.is_admin_email()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select (select lower(coalesce(auth.jwt() ->> 'email', ''))) = 'cssf.funaab@ayostack.dev';
$$;

revoke all on function public.is_admin_email() from public;
grant execute on function public.is_admin_email() to authenticated;

-- Create the memory_verses table if it does not exist.
create table if not exists public.memory_verses (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  reference text not null,
  created_at timestamptz not null default now()
);

-- Enable RLS.
alter table public.memory_verses enable row level security;

-- Drop any existing policies so re-runs stay clean.
do $$
declare
  p record;
begin
  for p in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'memory_verses'
  loop
    execute format('drop policy if exists %I on %I.%I', p.policyname, p.schemaname, p.tablename);
  end loop;
end
$$;

-- Public read access for website rendering.
create policy "memory_verses_public_read"
  on public.memory_verses
  for select
  to anon, authenticated
  using ((select auth.role()) in ('anon', 'authenticated'));

-- Admin write access.
create policy "memory_verses_admin_insert"
  on public.memory_verses
  for insert
  to authenticated
  with check (public.is_admin_email());

create policy "memory_verses_admin_update"
  on public.memory_verses
  for update
  to authenticated
  using (public.is_admin_email())
  with check (public.is_admin_email());

create policy "memory_verses_admin_delete"
  on public.memory_verses
  for delete
  to authenticated
  using (public.is_admin_email());

-- Seed the current hardcoded verses so the site keeps showing content.
insert into public.memory_verses (quote, reference)
select v.quote, v.reference
from (values
  ('Let your kingdom come. Let your pleasure be done, as in heaven, so on earth.', 'Matthew 6:10 (NIV)'),
  ('But let your first care be for his kingdom and his righteousness; and all these other things will be given to you in addition.', 'Matthew 6:33 (NIV)'),
  ('For the earth will be full of knowledge of the glory of the Lord as the sea is covered by the waters.', 'Habakkuk 2:14 (NIV)')
) as v(quote, reference)
where not exists (select 1 from public.memory_verses);

commit;

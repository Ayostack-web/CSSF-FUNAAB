-- Messages inbox: visitors send messages from the public chat widget,
-- admins read/manage them in the admin portal.
-- Date: 2026-08-24
-- Project: Cssf-Funaab
--
-- Run this script in the Supabase SQL editor.
-- It is idempotent and safe to re-run.

begin;

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

do $$
declare
  p record;
begin
  for p in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'messages'
  loop
    execute format('drop policy if exists %I on %I.%I', p.policyname, p.schemaname, p.tablename);
  end loop;
end
$$;

create policy "messages_public_insert"
  on public.messages
  for insert
  to anon, authenticated
  with check (
    char_length(name) between 1 and 80
    and (contact is null or char_length(contact) <= 120)
    and char_length(body) between 1 and 1000
  );

create policy "messages_admin_read"
  on public.messages
  for select
  to authenticated
  using (public.is_admin_email());

create policy "messages_admin_update"
  on public.messages
  for update
  to authenticated
  using (public.is_admin_email())
  with check (public.is_admin_email());

create policy "messages_admin_delete"
  on public.messages
  for delete
  to authenticated
  using (public.is_admin_email());

do $$
begin
  alter publication supabase_realtime add table public.messages;
exception
  when duplicate_object then null;
end
$$;

commit;

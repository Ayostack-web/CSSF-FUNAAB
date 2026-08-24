-- Groups (Kingdom Builders units) managed from the admin dashboard
-- Date: 2026-08-24
-- Project: Cssf-Funaab
--
-- Run this script in the Supabase SQL editor.
-- It is idempotent and safe to re-run.

begin;

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  about text not null default '',
  image text not null default '',
  link text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.groups enable row level security;

do $$
declare
  p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'groups'
  loop
    execute format('drop policy if exists %I on public.groups', p.policyname);
  end loop;
end
$$;

create policy "groups_public_read"
  on public.groups
  for select
  to anon, authenticated
  using ((select auth.role()) in ('anon', 'authenticated'));

create policy "groups_admin_insert"
  on public.groups
  for insert
  to authenticated
  with check (public.is_admin_email());

create policy "groups_admin_update"
  on public.groups
  for update
  to authenticated
  using (public.is_admin_email())
  with check (public.is_admin_email());

create policy "groups_admin_delete"
  on public.groups
  for delete
  to authenticated
  using (public.is_admin_email());

insert into public.groups (name, about, image, sort_order)
select v.name, v.about, v.image, v.sort_order
from (values
  ('Prayer Unit', 'Connecting hearts to heaven through prayer. Join us in faith and fellowship!', '/img/IMG_20251102_233014_825.jpg', 1),
  ('Choir', 'Lifting hearts with every note! Join our choir and feel the joy of worship.', '/img/IMG_20251102_163931_572.jpg', 2),
  ('Drama unit', 'Bringing God''s word to life through creativity and performance!', '/img/IMG_20251102_232336_623.jpg', 3),
  ('Evangelical Unit', 'Sharing God''s love with the world, one heart at a time!', '/img/IMG_20251102_232759_670.jpg', 4),
  ('Media Unit', 'Capturing and sharing the message of God through creativity and technology.', '/img/IMG_20251102_221019_834.jpg', 5),
  ('Levite Unit', 'To create an atmosphere where God''s presence is honoured and His people are lifted.', '/img/IMG_20251103_132510_405~2.jpg', 6)
) as v(name, about, image, sort_order)
where not exists (select 1 from public.groups);

insert into storage.buckets (id, name, public)
values ('group_images', 'group_images', true)
on conflict (id) do nothing;

drop policy if exists "group_images_admin_insert" on storage.objects;
create policy "group_images_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'group_images' and public.is_admin_email());

drop policy if exists "group_images_admin_delete" on storage.objects;
create policy "group_images_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'group_images' and public.is_admin_email());

commit;

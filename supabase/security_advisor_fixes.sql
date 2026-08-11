-- Security hardening for Supabase Advisor findings
-- Date: 2026-03-14
-- Project: Cssf-Funaab
--
-- IMPORTANT:
-- 1) Replace the admin email in public.is_admin_email() if needed.
-- 2) Run this script in the Supabase SQL editor.
-- 3) Re-run Security Advisor after applying.

begin;

-- Keep helper functions in a deterministic schema context.
-- This prevents mutable search_path warnings.
do $$
declare
  fn regprocedure;
begin
  for fn in
    select p.oid::regprocedure
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'set_updated_at_site_settings'
  loop
    execute format('alter function %s set search_path = public, pg_temp', fn);
  end loop;
end
$$;

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

-- Idempotent helper: drop all existing policies on a table.
-- This clears "multiple permissive policies" and "always true" policy findings.
do $$
declare
  p record;
begin
  for p in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('sermons', 'worship', 'worship_images', 'banners', 'site_settings')
  loop
    execute format('drop policy if exists %I on %I.%I', p.policyname, p.schemaname, p.tablename);
  end loop;
end
$$;

-- Enable RLS on flagged/public content tables.
do $$
begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'sermons') then
    execute 'alter table public.sermons enable row level security';
  end if;

  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'worship') then
    execute 'alter table public.worship enable row level security';
  end if;

  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'worship_images') then
    execute 'alter table public.worship_images enable row level security';
  end if;

  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'banners') then
    execute 'alter table public.banners enable row level security';
  end if;

  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'site_settings') then
    execute 'alter table public.site_settings enable row level security';
  end if;
end
$$;

-- Public read access for website rendering.
do $$
begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'sermons') then
    execute $sql$
      create policy "sermons_public_read"
      on public.sermons
      for select
      to anon, authenticated
      using ((select auth.role()) in ('anon', 'authenticated'))
    $sql$;

    execute $sql$
      create policy "sermons_admin_insert"
      on public.sermons
      for insert
      to authenticated
      with check (public.is_admin_email())
    $sql$;

    execute $sql$
      create policy "sermons_admin_update"
      on public.sermons
      for update
      to authenticated
      using (public.is_admin_email())
      with check (public.is_admin_email())
    $sql$;

    execute $sql$
      create policy "sermons_admin_delete"
      on public.sermons
      for delete
      to authenticated
      using (public.is_admin_email())
    $sql$;
  end if;

  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'worship') then
    execute $sql$
      create policy "worship_public_read"
      on public.worship
      for select
      to anon, authenticated
      using ((select auth.role()) in ('anon', 'authenticated'))
    $sql$;

    execute $sql$
      create policy "worship_admin_insert"
      on public.worship
      for insert
      to authenticated
      with check (public.is_admin_email())
    $sql$;

    execute $sql$
      create policy "worship_admin_update"
      on public.worship
      for update
      to authenticated
      using (public.is_admin_email())
      with check (public.is_admin_email())
    $sql$;

    execute $sql$
      create policy "worship_admin_delete"
      on public.worship
      for delete
      to authenticated
      using (public.is_admin_email())
    $sql$;
  end if;

  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'worship_images') then
    execute $sql$
      create policy "worship_images_public_read"
      on public.worship_images
      for select
      to anon, authenticated
      using ((select auth.role()) in ('anon', 'authenticated'))
    $sql$;

    execute $sql$
      create policy "worship_images_admin_insert"
      on public.worship_images
      for insert
      to authenticated
      with check (public.is_admin_email())
    $sql$;

    execute $sql$
      create policy "worship_images_admin_update"
      on public.worship_images
      for update
      to authenticated
      using (public.is_admin_email())
      with check (public.is_admin_email())
    $sql$;

    execute $sql$
      create policy "worship_images_admin_delete"
      on public.worship_images
      for delete
      to authenticated
      using (public.is_admin_email())
    $sql$;
  end if;

  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'banners') then
    execute $sql$
      create policy "banners_public_read"
      on public.banners
      for select
      to anon, authenticated
      using ((select auth.role()) in ('anon', 'authenticated'))
    $sql$;

    execute $sql$
      create policy "banners_admin_insert"
      on public.banners
      for insert
      to authenticated
      with check (public.is_admin_email())
    $sql$;

    execute $sql$
      create policy "banners_admin_update"
      on public.banners
      for update
      to authenticated
      using (public.is_admin_email())
      with check (public.is_admin_email())
    $sql$;

    execute $sql$
      create policy "banners_admin_delete"
      on public.banners
      for delete
      to authenticated
      using (public.is_admin_email())
    $sql$;
  end if;

  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'site_settings') then
    execute $sql$
      create policy "site_settings_public_read"
      on public.site_settings
      for select
      to anon, authenticated
      using ((select auth.role()) in ('anon', 'authenticated'))
    $sql$;

    execute $sql$
      create policy "site_settings_admin_insert"
      on public.site_settings
      for insert
      to authenticated
      with check (public.is_admin_email())
    $sql$;

    execute $sql$
      create policy "site_settings_admin_update"
      on public.site_settings
      for update
      to authenticated
      using (public.is_admin_email())
      with check (public.is_admin_email())
    $sql$;

    execute $sql$
      create policy "site_settings_admin_delete"
      on public.site_settings
      for delete
      to authenticated
      using (public.is_admin_email())
    $sql$;
  end if;
end
$$;

commit;

-- Manual dashboard action required (cannot be fully solved with SQL):
-- Authentication -> Providers -> Email -> Enable "Leaked password protection"

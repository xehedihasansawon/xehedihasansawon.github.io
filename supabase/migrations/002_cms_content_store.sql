-- Portfolio CMS — Phase 1D
-- Secure CMS content store with draft/published separation.
-- This migration does NOT move any live homepage content yet.

begin;

create table if not exists public.cms_content_entries (
  content_key text primary key
    check (
      char_length(content_key) between 3 and 120
      and content_key ~ '^[a-z0-9][a-z0-9._-]*$'
    ),
  draft_data jsonb not null default '{}'::jsonb,
  published_data jsonb,
  draft_updated_at timestamptz not null default timezone('utc'::text, now()),
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_by uuid references auth.users(id) on delete set null default auth.uid()
);

alter table public.cms_content_entries enable row level security;

revoke all on table public.cms_content_entries from public;
revoke all on table public.cms_content_entries from anon;
revoke all on table public.cms_content_entries from authenticated;

-- Public website access: only explicitly published columns.
grant select (content_key, published_data, published_at)
on table public.cms_content_entries
to anon;

-- Admin browser access: RLS still decides whether the authenticated user is allowed.
grant select, insert, update, delete
on table public.cms_content_entries
to authenticated;

drop policy if exists "cms_public_read_published" on public.cms_content_entries;
drop policy if exists "cms_admin_select" on public.cms_content_entries;
drop policy if exists "cms_admin_insert" on public.cms_content_entries;
drop policy if exists "cms_admin_update" on public.cms_content_entries;
drop policy if exists "cms_admin_delete" on public.cms_content_entries;

create policy "cms_public_read_published"
on public.cms_content_entries
for select
to anon
using (published_data is not null);

create policy "cms_admin_select"
on public.cms_content_entries
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  )
);

create policy "cms_admin_insert"
on public.cms_content_entries
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  )
);

create policy "cms_admin_update"
on public.cms_content_entries
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  )
);

create policy "cms_admin_delete"
on public.cms_content_entries
for delete
to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  )
);

create or replace function public.cms_touch_content_entry()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.draft_data is distinct from old.draft_data then
    new.draft_updated_at := timezone('utc'::text, now());
  end if;

  if new.published_data is distinct from old.published_data then
    new.published_at := timezone('utc'::text, now());
  end if;

  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists cms_touch_content_entry_trigger
on public.cms_content_entries;

create trigger cms_touch_content_entry_trigger
before update on public.cms_content_entries
for each row
execute function public.cms_touch_content_entry();

comment on table public.cms_content_entries is
  'Generic Portfolio CMS content store. Draft data is admin-only; public browser access is limited to published columns by column grants plus RLS.';

commit;

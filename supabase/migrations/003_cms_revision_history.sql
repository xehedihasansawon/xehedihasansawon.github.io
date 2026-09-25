-- Portfolio CMS — Phase 1E
-- Automatic revision history for CMS content.
-- This migration does NOT add restore UI and does NOT move live homepage content.

begin;

create table if not exists public.cms_content_revisions (
  revision_id bigint generated always as identity primary key,
  content_key text not null,
  event_type text not null
    check (event_type in ('created', 'updated', 'deleted')),
  draft_data jsonb,
  published_data jsonb,
  draft_updated_at timestamptz,
  published_at timestamptz,
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists cms_content_revisions_key_created_idx
on public.cms_content_revisions (content_key, created_at desc);

alter table public.cms_content_revisions enable row level security;

revoke all on table public.cms_content_revisions from public;
revoke all on table public.cms_content_revisions from anon;
revoke all on table public.cms_content_revisions from authenticated;

grant select on table public.cms_content_revisions to authenticated;

drop policy if exists "cms_revisions_admin_select"
on public.cms_content_revisions;

create policy "cms_revisions_admin_select"
on public.cms_content_revisions
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  )
);

create or replace function public.cms_capture_content_revision()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'DELETE' then
    insert into public.cms_content_revisions (
      content_key,
      event_type,
      draft_data,
      published_data,
      draft_updated_at,
      published_at,
      changed_by
    )
    values (
      old.content_key,
      'deleted',
      old.draft_data,
      old.published_data,
      old.draft_updated_at,
      old.published_at,
      coalesce(auth.uid(), old.updated_by)
    );

    return old;
  end if;

  insert into public.cms_content_revisions (
    content_key,
    event_type,
    draft_data,
    published_data,
    draft_updated_at,
    published_at,
    changed_by
  )
  values (
    new.content_key,
    case when tg_op = 'INSERT' then 'created' else 'updated' end,
    new.draft_data,
    new.published_data,
    new.draft_updated_at,
    new.published_at,
    coalesce(auth.uid(), new.updated_by)
  );

  return new;
end;
$$;

drop trigger if exists cms_capture_content_revision_trigger
on public.cms_content_entries;

create trigger cms_capture_content_revision_trigger
after insert or update or delete
on public.cms_content_entries
for each row
execute function public.cms_capture_content_revision();

comment on table public.cms_content_revisions is
  'Append-only CMS revision snapshots captured automatically from cms_content_entries changes. Browser clients receive read-only admin access through RLS.';

commit;

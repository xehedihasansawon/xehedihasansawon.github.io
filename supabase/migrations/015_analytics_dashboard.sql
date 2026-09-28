begin;

create table if not exists public.portfolio_analytics_events (
  id bigint generated always as identity primary key,
  event_type text not null
    check (event_type in ('page_view', 'project_view', 'contact_click')),
  event_key text not null default ''
    check (char_length(event_key) <= 160),
  page_path text not null
    check (char_length(page_path) between 1 and 500),
  project_slug text
    check (
      project_slug is null
      or (
        char_length(project_slug) between 1 and 120
        and project_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
      )
    ),
  session_id uuid not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists portfolio_analytics_created_idx
  on public.portfolio_analytics_events (created_at desc);

create index if not exists portfolio_analytics_type_created_idx
  on public.portfolio_analytics_events (event_type, created_at desc);

create index if not exists portfolio_analytics_project_created_idx
  on public.portfolio_analytics_events (project_slug, created_at desc)
  where project_slug is not null;

alter table public.portfolio_analytics_events enable row level security;

revoke all on table public.portfolio_analytics_events from public;
revoke all on table public.portfolio_analytics_events from anon;
revoke all on table public.portfolio_analytics_events from authenticated;

grant insert (
  event_type,
  event_key,
  page_path,
  project_slug,
  session_id
)
on table public.portfolio_analytics_events
to anon;

grant select
on table public.portfolio_analytics_events
to authenticated;

drop policy if exists "portfolio_analytics_public_insert"
on public.portfolio_analytics_events;

drop policy if exists "portfolio_analytics_admin_read"
on public.portfolio_analytics_events;

create policy "portfolio_analytics_public_insert"
on public.portfolio_analytics_events
for insert
to anon
with check (
  event_type in ('page_view', 'project_view', 'contact_click')
  and page_path like '/%'
  and char_length(page_path) <= 500
  and char_length(event_key) <= 160
);

create policy "portfolio_analytics_admin_read"
on public.portfolio_analytics_events
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  )
);

comment on table public.portfolio_analytics_events is
  'Phase 5B first-party privacy-friendly analytics. Stores no IP, user agent, fingerprint, inquiry content or personal profile data.';

commit;

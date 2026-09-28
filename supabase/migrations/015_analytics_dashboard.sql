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

create index if not exists portfolio_analytics_session_created_idx
  on public.portfolio_analytics_events (session_id, created_at desc);

alter table public.portfolio_analytics_events enable row level security;

revoke all on table public.portfolio_analytics_events from public;
revoke all on table public.portfolio_analytics_events from anon;
revoke all on table public.portfolio_analytics_events from authenticated;

grant select
on table public.portfolio_analytics_events
to authenticated;

drop policy if exists "portfolio_analytics_public_insert"
on public.portfolio_analytics_events;

drop policy if exists "portfolio_analytics_admin_read"
on public.portfolio_analytics_events;

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

create or replace function public.log_portfolio_analytics_event(
  p_event_type text,
  p_event_key text,
  p_page_path text,
  p_project_slug text,
  p_session_id uuid
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_event_type text := trim(coalesce(p_event_type, ''));
  v_event_key text := left(trim(coalesce(p_event_key, '')), 160);
  v_page_path text := left(trim(coalesce(p_page_path, '')), 500);
  v_project_slug text := nullif(lower(trim(coalesce(p_project_slug, ''))), '');
begin
  if v_event_type not in ('page_view', 'project_view', 'contact_click') then
    raise exception 'Invalid analytics event type.';
  end if;

  if v_page_path = '' or left(v_page_path, 1) <> '/' then
    raise exception 'Invalid analytics page path.';
  end if;

  if v_project_slug is not null
     and (
       char_length(v_project_slug) > 120
       or v_project_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
     ) then
    raise exception 'Invalid analytics project slug.';
  end if;

  if p_session_id is null then
    raise exception 'Analytics session id is required.';
  end if;

  if exists (
    select 1
    from public.portfolio_analytics_events pae
    where pae.session_id = p_session_id
      and pae.event_type = v_event_type
      and pae.event_key = v_event_key
      and pae.page_path = v_page_path
      and pae.project_slug is not distinct from v_project_slug
      and pae.created_at >= timezone('utc'::text, now()) - interval '2 seconds'
  ) then
    return;
  end if;

  insert into public.portfolio_analytics_events (
    event_type,
    event_key,
    page_path,
    project_slug,
    session_id
  )
  values (
    v_event_type,
    v_event_key,
    v_page_path,
    v_project_slug,
    p_session_id
  );
end;
$$;

revoke all on function public.log_portfolio_analytics_event(
  text,
  text,
  text,
  text,
  uuid
) from public;

revoke all on function public.log_portfolio_analytics_event(
  text,
  text,
  text,
  text,
  uuid
) from authenticated;

grant execute on function public.log_portfolio_analytics_event(
  text,
  text,
  text,
  text,
  uuid
) to anon;

comment on function public.log_portfolio_analytics_event(
  text,
  text,
  text,
  text,
  uuid
) is
  'Validated public analytics logger. Anonymous visitors have no direct table privileges.';

comment on table public.portfolio_analytics_events is
  'Phase 5B first-party privacy-friendly analytics. Stores no IP, user agent, fingerprint, inquiry content or personal profile data. Anonymous users cannot read the table or insert directly.';

commit;

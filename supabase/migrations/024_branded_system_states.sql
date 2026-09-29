-- Phase 5H · Branded 404 / Empty States / Maintenance Mode
-- Public may read the single maintenance configuration row.
-- Only allowlisted authenticated Admin may update it.

create table if not exists public.portfolio_system_state (
  id smallint primary key default 1 check (id = 1),
  maintenance_enabled boolean not null default false,
  maintenance_eyebrow text not null default 'PORTFOLIO UPDATE'
    check (char_length(maintenance_eyebrow) between 1 and 80),
  maintenance_title text not null default 'A short maintenance break.'
    check (char_length(maintenance_title) between 1 and 140),
  maintenance_message text not null default 'I am making a few updates to the portfolio. Please check back shortly.'
    check (char_length(maintenance_message) between 1 and 320),
  maintenance_button_label text not null default 'Back to home'
    check (char_length(maintenance_button_label) between 1 and 50),
  maintenance_button_href text not null default 'index.html'
    check (
      char_length(maintenance_button_href) between 1 and 500
      and maintenance_button_href !~* '^\s*(javascript|data|vbscript):'
      and maintenance_button_href !~ '^\s*//'
    ),
  updated_at timestamptz not null default now(),
  updated_by uuid null references auth.users(id) on delete set null
);

alter table public.portfolio_system_state enable row level security;

revoke all on table public.portfolio_system_state from public, anon, authenticated;

grant select (
  id,
  maintenance_enabled,
  maintenance_eyebrow,
  maintenance_title,
  maintenance_message,
  maintenance_button_label,
  maintenance_button_href,
  updated_at
) on table public.portfolio_system_state to anon, authenticated;

grant update (
  maintenance_enabled,
  maintenance_eyebrow,
  maintenance_title,
  maintenance_message,
  maintenance_button_label,
  maintenance_button_href
) on table public.portfolio_system_state to authenticated;

drop policy if exists "Public can read system state"
  on public.portfolio_system_state;
create policy "Public can read system state"
  on public.portfolio_system_state
  for select
  to anon, authenticated
  using (id = 1);

drop policy if exists "Admin can update system state"
  on public.portfolio_system_state;
create policy "Admin can update system state"
  on public.portfolio_system_state
  for update
  to authenticated
  using (
    id = 1
    and exists (
      select 1
      from public.admin_users au
      where au.user_id = auth.uid()
    )
  )
  with check (
    id = 1
    and exists (
      select 1
      from public.admin_users au
      where au.user_id = auth.uid()
    )
  );

create or replace function public.touch_portfolio_system_state()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

drop trigger if exists trg_touch_portfolio_system_state
  on public.portfolio_system_state;
create trigger trg_touch_portfolio_system_state
before update on public.portfolio_system_state
for each row
execute function public.touch_portfolio_system_state();

insert into public.portfolio_system_state (
  id,
  maintenance_enabled,
  maintenance_eyebrow,
  maintenance_title,
  maintenance_message,
  maintenance_button_label,
  maintenance_button_href
)
values (
  1,
  false,
  'PORTFOLIO UPDATE',
  'A short maintenance break.',
  'I am making a few updates to the portfolio. Please check back shortly.',
  'Back to home',
  'index.html'
)
on conflict (id) do nothing;

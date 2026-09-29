-- Phase 5F · Availability Status Control
-- One public-readable status row; only allowlisted Admin can update it.

create table if not exists public.portfolio_availability (
  id smallint primary key default 1 check (id = 1),
  status_key text not null default 'available'
    check (status_key in ('available','limited','busy','unavailable')),
  status_text text not null default 'Available for freelance & remote projects'
    check (char_length(status_text) between 1 and 120),
  updated_at timestamptz not null default now(),
  updated_by uuid null references auth.users(id) on delete set null
);

alter table public.portfolio_availability enable row level security;

revoke all on table public.portfolio_availability from public, anon, authenticated;
grant select (id, status_key, status_text, updated_at)
  on table public.portfolio_availability to anon, authenticated;
grant update (status_key, status_text)
  on table public.portfolio_availability to authenticated;

drop policy if exists "Public can read availability"
  on public.portfolio_availability;
create policy "Public can read availability"
  on public.portfolio_availability
  for select
  to anon, authenticated
  using (id = 1);

drop policy if exists "Admin can update availability"
  on public.portfolio_availability;
create policy "Admin can update availability"
  on public.portfolio_availability
  for update
  to authenticated
  using (
    id = 1
    and exists (
      select 1 from public.admin_users au
      where au.user_id = auth.uid()
    )
  )
  with check (
    id = 1
    and exists (
      select 1 from public.admin_users au
      where au.user_id = auth.uid()
    )
  );

create or replace function public.touch_portfolio_availability()
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

drop trigger if exists trg_touch_portfolio_availability
  on public.portfolio_availability;
create trigger trg_touch_portfolio_availability
before update on public.portfolio_availability
for each row
execute function public.touch_portfolio_availability();

insert into public.portfolio_availability (id, status_key, status_text)
values (1, 'available', 'Available for freelance & remote projects')
on conflict (id) do nothing;

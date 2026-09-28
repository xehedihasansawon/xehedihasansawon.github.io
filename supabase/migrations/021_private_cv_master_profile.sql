-- Phase 5E · Private CV Master Profile
-- Stores the owner's A-Z CV source data privately in Supabase.
-- No profile content is hardcoded in the public repository.

create table if not exists public.portfolio_cv_master_profiles (
  id smallint primary key default 1 check (id = 1),
  profile_data jsonb not null default '{}'::jsonb
    check (jsonb_typeof(profile_data) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid null references auth.users(id) on delete set null
);

alter table public.portfolio_cv_master_profiles enable row level security;

revoke all on table public.portfolio_cv_master_profiles from public, anon, authenticated;
grant select, insert, update on table public.portfolio_cv_master_profiles to authenticated;

drop policy if exists "Admin can read CV master profile"
  on public.portfolio_cv_master_profiles;
create policy "Admin can read CV master profile"
  on public.portfolio_cv_master_profiles
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admin_users au
      where au.user_id = auth.uid()
    )
  );

drop policy if exists "Admin can insert CV master profile"
  on public.portfolio_cv_master_profiles;
create policy "Admin can insert CV master profile"
  on public.portfolio_cv_master_profiles
  for insert
  to authenticated
  with check (
    id = 1
    and exists (
      select 1
      from public.admin_users au
      where au.user_id = auth.uid()
    )
  );

drop policy if exists "Admin can update CV master profile"
  on public.portfolio_cv_master_profiles;
create policy "Admin can update CV master profile"
  on public.portfolio_cv_master_profiles
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
    id = 1
    and exists (
      select 1
      from public.admin_users au
      where au.user_id = auth.uid()
    )
  );

create or replace function public.touch_portfolio_cv_master_profile()
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

drop trigger if exists trg_touch_portfolio_cv_master_profile
  on public.portfolio_cv_master_profiles;
create trigger trg_touch_portfolio_cv_master_profile
before update on public.portfolio_cv_master_profiles
for each row
execute function public.touch_portfolio_cv_master_profile();

insert into public.portfolio_cv_master_profiles (id, profile_data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

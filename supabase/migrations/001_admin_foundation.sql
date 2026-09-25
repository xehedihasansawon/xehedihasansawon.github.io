-- Portfolio CMS — Phase 1A Admin Authentication Foundation
-- Run this in the Supabase SQL editor.
-- This table is an allowlist only. Browser clients may READ their own row,
-- but cannot add, edit or delete admin membership.

begin;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.admin_users enable row level security;

revoke all on table public.admin_users from public;
revoke all on table public.admin_users from anon;
revoke all on table public.admin_users from authenticated;

grant select on table public.admin_users to authenticated;

drop policy if exists "admin_users_read_own_membership" on public.admin_users;

create policy "admin_users_read_own_membership"
on public.admin_users
for select
to authenticated
using (auth.uid() = user_id);

comment on table public.admin_users is
  'Private allowlist for Portfolio CMS administrators. Membership is provisioned only from a trusted backend/SQL editor.';

commit;

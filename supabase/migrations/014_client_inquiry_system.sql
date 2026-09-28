begin;

create table if not exists public.portfolio_inquiries (
  id uuid primary key default gen_random_uuid(),

  name text not null
    check (char_length(name) between 2 and 100),
  email text not null
    check (
      char_length(email) <= 254
      and email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    ),
  project_type text not null
    check (char_length(project_type) between 2 and 100),
  budget text not null default ''
    check (char_length(budget) <= 100),
  timeline text not null default ''
    check (char_length(timeline) <= 100),
  message text not null
    check (char_length(message) between 20 and 3000),

  source_page text not null default '/'
    check (char_length(source_page) <= 500),
  consent boolean not null default false
    check (consent = true),

  status text not null default 'new'
    check (status in ('new', 'read', 'replied', 'archived')),
  admin_notes text not null default ''
    check (char_length(admin_notes) <= 3000),

  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  updated_by uuid references auth.users(id) on delete set null
);

create index if not exists portfolio_inquiries_created_idx
  on public.portfolio_inquiries (created_at desc);

create index if not exists portfolio_inquiries_status_idx
  on public.portfolio_inquiries (status, created_at desc);

alter table public.portfolio_inquiries enable row level security;

revoke all on table public.portfolio_inquiries from public;
revoke all on table public.portfolio_inquiries from anon;
revoke all on table public.portfolio_inquiries from authenticated;

grant insert (
  name,
  email,
  project_type,
  budget,
  timeline,
  message,
  source_page,
  consent
)
on table public.portfolio_inquiries
to anon;

grant select, update, delete
on table public.portfolio_inquiries
to authenticated;

drop policy if exists "portfolio_inquiries_public_submit"
on public.portfolio_inquiries;

drop policy if exists "portfolio_inquiries_admin_all"
on public.portfolio_inquiries;

create policy "portfolio_inquiries_public_submit"
on public.portfolio_inquiries
for insert
to anon
with check (
  consent = true
  and status = 'new'
  and admin_notes = ''
  and updated_by is null
);

create policy "portfolio_inquiries_admin_all"
on public.portfolio_inquiries
for all
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

create or replace function public.portfolio_inquiry_touch_row()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at := timezone('utc'::text, now());
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists portfolio_inquiries_touch_trigger
on public.portfolio_inquiries;

create trigger portfolio_inquiries_touch_trigger
before update on public.portfolio_inquiries
for each row
execute function public.portfolio_inquiry_touch_row();

comment on table public.portfolio_inquiries is
  'Phase 5A client project inquiry inbox. Anonymous visitors may submit only; allowlisted admins may read and manage inquiries.';

commit;

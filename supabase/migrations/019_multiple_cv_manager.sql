begin;

create table if not exists public.portfolio_cvs (
  id uuid primary key default gen_random_uuid(),

  label text not null
    check (char_length(btrim(label)) between 1 and 80),
  target_role text not null default ''
    check (char_length(target_role) <= 120),
  template_key text not null default 'modern'
    check (template_key in ('modern', 'compact', 'europass')),

  resume_data jsonb not null default '{}'::jsonb
    check (jsonb_typeof(resume_data) = 'object'),

  sort_order integer not null default 0
    check (sort_order >= 0),

  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  updated_by uuid references auth.users(id) on delete set null
);

create unique index if not exists portfolio_cvs_label_lower_uidx
  on public.portfolio_cvs (lower(btrim(label)));

create index if not exists portfolio_cvs_sort_idx
  on public.portfolio_cvs (sort_order, updated_at desc);

alter table public.portfolio_cvs enable row level security;

revoke all on table public.portfolio_cvs from public;
revoke all on table public.portfolio_cvs from anon;
revoke all on table public.portfolio_cvs from authenticated;

grant select, insert, update, delete
on table public.portfolio_cvs
to authenticated;

drop policy if exists "portfolio_cvs_admin_all"
on public.portfolio_cvs;

create policy "portfolio_cvs_admin_all"
on public.portfolio_cvs
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

create or replace function public.portfolio_cvs_touch_row()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
begin
  new.updated_at := timezone('utc'::text, now());
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists portfolio_cvs_touch_trigger
on public.portfolio_cvs;

create trigger portfolio_cvs_touch_trigger
before update on public.portfolio_cvs
for each row
execute function public.portfolio_cvs_touch_row();

comment on table public.portfolio_cvs is
  'Phase 5E private Admin-only multiple Resume/CV store. No anonymous/public access is granted.';

commit;

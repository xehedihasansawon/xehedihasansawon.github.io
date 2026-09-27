begin;

create table if not exists public.portfolio_case_studies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique
    references public.portfolio_projects(id) on delete cascade,

  kicker text not null default ''
    check (char_length(kicker) <= 120),
  headline text not null default ''
    check (char_length(headline) <= 220),
  lead text not null default ''
    check (char_length(lead) <= 1200),

  hero_image_url text,
  hero_image_alt text not null default ''
    check (char_length(hero_image_alt) <= 220),

  facts jsonb not null default '[]'::jsonb
    check (
      jsonb_typeof(facts) = 'array'
      and jsonb_array_length(facts) <= 8
    ),

  sections jsonb not null default '[]'::jsonb
    check (
      jsonb_typeof(sections) = 'array'
      and jsonb_array_length(sections) <= 20
    ),

  related_project_id uuid
    references public.portfolio_projects(id) on delete set null,

  cta_label text not null default ''
    check (char_length(cta_label) <= 100),
  cta_href text
    check (cta_href is null or char_length(cta_href) <= 1000),

  is_published boolean not null default false,
  published_at timestamptz,

  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  updated_by uuid references auth.users(id) on delete set null default auth.uid()
);

create index if not exists portfolio_case_studies_project_idx
  on public.portfolio_case_studies (project_id);

create index if not exists portfolio_case_studies_public_idx
  on public.portfolio_case_studies (is_published, project_id);

alter table public.portfolio_case_studies enable row level security;

revoke all on table public.portfolio_case_studies from public;
revoke all on table public.portfolio_case_studies from anon;
revoke all on table public.portfolio_case_studies from authenticated;

grant select (
  id,
  project_id,
  kicker,
  headline,
  lead,
  hero_image_url,
  hero_image_alt,
  facts,
  sections,
  related_project_id,
  cta_label,
  cta_href,
  is_published,
  published_at,
  created_at,
  updated_at
)
on table public.portfolio_case_studies
to anon;

grant select, insert, update, delete
on table public.portfolio_case_studies
to authenticated;

drop policy if exists "portfolio_case_studies_public_read"
on public.portfolio_case_studies;

drop policy if exists "portfolio_case_studies_admin_all"
on public.portfolio_case_studies;

create policy "portfolio_case_studies_public_read"
on public.portfolio_case_studies
for select
to anon
using (
  is_published = true
  and exists (
    select 1
    from public.portfolio_projects p
    where p.id = project_id
      and p.is_published = true
      and p.visibility = 'public'
  )
);

create policy "portfolio_case_studies_admin_all"
on public.portfolio_case_studies
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

create or replace function public.portfolio_case_study_touch_row()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at := timezone('utc'::text, now());
  new.updated_by := auth.uid();

  if tg_op = 'INSERT' then
    if new.is_published = true and new.published_at is null then
      new.published_at := timezone('utc'::text, now());
    end if;
  elsif tg_op = 'UPDATE' then
    if new.is_published = true and old.is_published = false then
      new.published_at := timezone('utc'::text, now());
    elsif new.is_published = false then
      new.published_at := null;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists portfolio_case_studies_touch_trigger
on public.portfolio_case_studies;

create trigger portfolio_case_studies_touch_trigger
before insert or update on public.portfolio_case_studies
for each row
execute function public.portfolio_case_study_touch_row();

comment on table public.portfolio_case_studies is
  'Phase 4 reusable case study store. Anonymous reads require both a published case study and a published public Portfolio Engine project. Allowlisted admins manage all rows.';

commit;

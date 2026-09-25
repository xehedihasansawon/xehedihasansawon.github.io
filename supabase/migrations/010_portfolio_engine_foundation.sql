-- Portfolio CMS — Phase 3A
-- Portfolio Engine normalized data foundation.
-- This migration creates secure category/project stores only.
-- It does NOT migrate or change current public homepage project cards.

begin;

create extension if not exists pgcrypto;

create table if not exists public.portfolio_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (
      char_length(slug) between 2 and 80
      and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),
  name text not null
    check (char_length(btrim(name)) between 1 and 100),
  description text not null default ''
    check (char_length(description) <= 600),
  sort_order integer not null default 0
    check (sort_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  updated_by uuid references auth.users(id) on delete set null default auth.uid()
);

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (
      char_length(slug) between 2 and 120
      and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    ),
  title text not null
    check (char_length(btrim(title)) between 1 and 160),
  summary text not null default ''
    check (char_length(summary) <= 900),
  category_id uuid references public.portfolio_categories(id) on delete set null,

  cover_image_url text,
  cover_image_alt text not null default ''
    check (char_length(cover_image_alt) <= 220),

  action_label text not null default 'View project'
    check (char_length(action_label) between 1 and 80),
  action_href text,

  tags text[] not null default '{}'::text[],
  badges text[] not null default '{}'::text[],

  is_featured boolean not null default false,
  show_on_homepage boolean not null default false,
  sort_order integer not null default 0
    check (sort_order >= 0),
  category_sort_order integer not null default 0
    check (category_sort_order >= 0),

  visibility text not null default 'public'
    check (visibility in ('public', 'private')),
  is_published boolean not null default false,
  published_at timestamptz,

  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  updated_by uuid references auth.users(id) on delete set null default auth.uid()
);

create index if not exists portfolio_categories_sort_idx
  on public.portfolio_categories (sort_order, name);

create index if not exists portfolio_projects_public_order_idx
  on public.portfolio_projects (is_published, visibility, sort_order, created_at desc);

create index if not exists portfolio_projects_category_order_idx
  on public.portfolio_projects (category_id, category_sort_order, sort_order);

create index if not exists portfolio_projects_featured_idx
  on public.portfolio_projects (show_on_homepage, is_featured, sort_order);

create index if not exists portfolio_projects_tags_gin_idx
  on public.portfolio_projects using gin (tags);

create index if not exists portfolio_projects_badges_gin_idx
  on public.portfolio_projects using gin (badges);

alter table public.portfolio_categories enable row level security;
alter table public.portfolio_projects enable row level security;

revoke all on table public.portfolio_categories from public;
revoke all on table public.portfolio_categories from anon;
revoke all on table public.portfolio_categories from authenticated;

revoke all on table public.portfolio_projects from public;
revoke all on table public.portfolio_projects from anon;
revoke all on table public.portfolio_projects from authenticated;

grant select (
  id,
  slug,
  name,
  description,
  sort_order,
  is_active
)
on table public.portfolio_categories
to anon;

grant select (
  id,
  slug,
  title,
  summary,
  category_id,
  cover_image_url,
  cover_image_alt,
  action_label,
  action_href,
  tags,
  badges,
  is_featured,
  show_on_homepage,
  sort_order,
  category_sort_order,
  visibility,
  is_published,
  published_at,
  created_at
)
on table public.portfolio_projects
to anon;

grant select, insert, update, delete
on table public.portfolio_categories
to authenticated;

grant select, insert, update, delete
on table public.portfolio_projects
to authenticated;

drop policy if exists "portfolio_categories_public_read" on public.portfolio_categories;
drop policy if exists "portfolio_categories_admin_all" on public.portfolio_categories;
drop policy if exists "portfolio_projects_public_read" on public.portfolio_projects;
drop policy if exists "portfolio_projects_admin_all" on public.portfolio_projects;

create policy "portfolio_categories_public_read"
on public.portfolio_categories
for select
to anon
using (is_active = true);

create policy "portfolio_categories_admin_all"
on public.portfolio_categories
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

create policy "portfolio_projects_public_read"
on public.portfolio_projects
for select
to anon
using (
  is_published = true
  and visibility = 'public'
);

create policy "portfolio_projects_admin_all"
on public.portfolio_projects
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

create or replace function public.portfolio_touch_row()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at := timezone('utc'::text, now());
  new.updated_by := auth.uid();

  if tg_table_name = 'portfolio_projects' then
    if new.is_published = true and old.is_published = false then
      new.published_at := timezone('utc'::text, now());
    elsif new.is_published = false then
      new.published_at := null;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists portfolio_categories_touch_trigger
on public.portfolio_categories;

create trigger portfolio_categories_touch_trigger
before update on public.portfolio_categories
for each row
execute function public.portfolio_touch_row();

drop trigger if exists portfolio_projects_touch_trigger
on public.portfolio_projects;

create trigger portfolio_projects_touch_trigger
before update on public.portfolio_projects
for each row
execute function public.portfolio_touch_row();

comment on table public.portfolio_categories is
  'Phase 3 Portfolio Engine category store. Public can read active categories; allowlisted admins manage all rows.';

comment on table public.portfolio_projects is
  'Phase 3 Portfolio Engine project store. Anonymous reads are limited by RLS to published public projects; private/draft rows remain admin-only.';

commit;

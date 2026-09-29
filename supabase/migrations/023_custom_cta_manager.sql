-- Phase 5G · Custom CTA Manager
-- One optional public CTA block. Public can read; only allowlisted Admin can update.

create table if not exists public.portfolio_custom_cta (
  id smallint primary key default 1 check (id = 1),
  enabled boolean not null default false,
  style_key text not null default 'accent'
    check (style_key in ('accent','dark','outline')),
  eyebrow text not null default 'READY WHEN YOU ARE'
    check (char_length(eyebrow) between 1 and 80),
  title text not null default 'Have a project in mind?'
    check (char_length(title) between 1 and 140),
  description text not null default 'Tell me what you are building and I will help shape the right creative or digital direction.'
    check (char_length(description) between 1 and 320),
  primary_label text not null default 'Start a project'
    check (char_length(primary_label) between 1 and 50),
  primary_href text not null default '#contact'
    check (
      char_length(primary_href) between 1 and 500
      and primary_href !~* '^\s*(javascript|data|vbscript):'
      and primary_href !~ '^\s*//'
    ),
  primary_new_tab boolean not null default false,
  secondary_enabled boolean not null default true,
  secondary_label text not null default 'View selected work'
    check (char_length(secondary_label) between 1 and 50),
  secondary_href text not null default '#work'
    check (
      char_length(secondary_href) between 1 and 500
      and secondary_href !~* '^\s*(javascript|data|vbscript):'
      and secondary_href !~ '^\s*//'
    ),
  secondary_new_tab boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid null references auth.users(id) on delete set null
);

alter table public.portfolio_custom_cta enable row level security;

revoke all on table public.portfolio_custom_cta from public, anon, authenticated;

grant select (
  id,
  enabled,
  style_key,
  eyebrow,
  title,
  description,
  primary_label,
  primary_href,
  primary_new_tab,
  secondary_enabled,
  secondary_label,
  secondary_href,
  secondary_new_tab,
  updated_at
) on table public.portfolio_custom_cta to anon, authenticated;

grant update (
  enabled,
  style_key,
  eyebrow,
  title,
  description,
  primary_label,
  primary_href,
  primary_new_tab,
  secondary_enabled,
  secondary_label,
  secondary_href,
  secondary_new_tab
) on table public.portfolio_custom_cta to authenticated;

drop policy if exists "Public can read custom CTA"
  on public.portfolio_custom_cta;
create policy "Public can read custom CTA"
  on public.portfolio_custom_cta
  for select
  to anon, authenticated
  using (id = 1);

drop policy if exists "Admin can update custom CTA"
  on public.portfolio_custom_cta;
create policy "Admin can update custom CTA"
  on public.portfolio_custom_cta
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

create or replace function public.touch_portfolio_custom_cta()
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

drop trigger if exists trg_touch_portfolio_custom_cta
  on public.portfolio_custom_cta;
create trigger trg_touch_portfolio_custom_cta
before update on public.portfolio_custom_cta
for each row
execute function public.touch_portfolio_custom_cta();

insert into public.portfolio_custom_cta (
  id,
  enabled,
  style_key,
  eyebrow,
  title,
  description,
  primary_label,
  primary_href,
  primary_new_tab,
  secondary_enabled,
  secondary_label,
  secondary_href,
  secondary_new_tab
)
values (
  1,
  false,
  'accent',
  'READY WHEN YOU ARE',
  'Have a project in mind?',
  'Tell me what you are building and I will help shape the right creative or digital direction.',
  'Start a project',
  '#contact',
  false,
  true,
  'View selected work',
  '#work',
  false
)
on conflict (id) do nothing;

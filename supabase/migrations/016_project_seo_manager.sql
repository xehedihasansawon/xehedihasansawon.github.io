begin;

create table if not exists public.portfolio_project_seo (
  project_id uuid primary key
    references public.portfolio_projects(id) on delete cascade,

  seo_title text not null default ''
    check (char_length(seo_title) <= 70),
  seo_description text not null default ''
    check (char_length(seo_description) <= 180),

  social_image_url text
    check (
      social_image_url is null
      or (
        char_length(social_image_url) <= 1200
        and social_image_url ~* '^https://'
      )
    ),
  social_image_alt text not null default ''
    check (char_length(social_image_alt) <= 220),

  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  updated_by uuid references auth.users(id) on delete set null
);

create index if not exists portfolio_project_seo_updated_idx
  on public.portfolio_project_seo (updated_at desc);

alter table public.portfolio_project_seo enable row level security;

revoke all on table public.portfolio_project_seo from public;
revoke all on table public.portfolio_project_seo from anon;
revoke all on table public.portfolio_project_seo from authenticated;

grant select (
  project_id,
  seo_title,
  seo_description,
  social_image_url,
  social_image_alt,
  updated_at
)
on table public.portfolio_project_seo
to anon;

grant select
on table public.portfolio_project_seo
to authenticated;

drop policy if exists "portfolio_project_seo_public_read"
on public.portfolio_project_seo;

drop policy if exists "portfolio_project_seo_admin_read"
on public.portfolio_project_seo;

create policy "portfolio_project_seo_public_read"
on public.portfolio_project_seo
for select
to anon
using (
  exists (
    select 1
    from public.portfolio_projects pp
    where pp.id = portfolio_project_seo.project_id
      and pp.visibility = 'public'
      and pp.is_published = true
  )
);

create policy "portfolio_project_seo_admin_read"
on public.portfolio_project_seo
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  )
);

create or replace function public.save_portfolio_project_seo(
  p_project_id uuid,
  p_slug text,
  p_cover_image_alt text,
  p_seo_title text,
  p_seo_description text,
  p_social_image_url text,
  p_social_image_alt text
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_slug text := lower(trim(coalesce(p_slug, '')));
  v_cover_alt text := trim(coalesce(p_cover_image_alt, ''));
  v_seo_title text := trim(coalesce(p_seo_title, ''));
  v_seo_description text := trim(coalesce(p_seo_description, ''));
  v_social_image_url text := nullif(trim(coalesce(p_social_image_url, '')), '');
  v_social_image_alt text := trim(coalesce(p_social_image_alt, ''));
begin
  if not exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  ) then
    raise exception 'Admin access required.';
  end if;

  if p_project_id is null then
    raise exception 'Project is required.';
  end if;

  if char_length(v_slug) not between 2 and 120
     or v_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'Invalid project slug.';
  end if;

  if char_length(v_cover_alt) > 220 then
    raise exception 'Cover alt text is too long.';
  end if;

  if char_length(v_seo_title) > 70 then
    raise exception 'SEO title is too long.';
  end if;

  if char_length(v_seo_description) > 180 then
    raise exception 'SEO description is too long.';
  end if;

  if v_social_image_url is not null
     and (
       char_length(v_social_image_url) > 1200
       or v_social_image_url !~* '^https://'
     ) then
    raise exception 'Social image must use a secure HTTPS URL.';
  end if;

  if char_length(v_social_image_alt) > 220 then
    raise exception 'Social image alt text is too long.';
  end if;

  update public.portfolio_projects
  set
    slug = v_slug,
    cover_image_alt = v_cover_alt,
    updated_at = timezone('utc'::text, now()),
    updated_by = auth.uid()
  where id = p_project_id;

  if not found then
    raise exception 'Project not found.';
  end if;

  insert into public.portfolio_project_seo (
    project_id,
    seo_title,
    seo_description,
    social_image_url,
    social_image_alt,
    created_at,
    updated_at,
    updated_by
  )
  values (
    p_project_id,
    v_seo_title,
    v_seo_description,
    v_social_image_url,
    v_social_image_alt,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    auth.uid()
  )
  on conflict (project_id) do update
  set
    seo_title = excluded.seo_title,
    seo_description = excluded.seo_description,
    social_image_url = excluded.social_image_url,
    social_image_alt = excluded.social_image_alt,
    updated_at = timezone('utc'::text, now()),
    updated_by = auth.uid();
end;
$$;

revoke all on function public.save_portfolio_project_seo(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text
) from public;

revoke all on function public.save_portfolio_project_seo(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text
) from anon;

grant execute on function public.save_portfolio_project_seo(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text
) to authenticated;

comment on table public.portfolio_project_seo is
  'Phase 5C per-project SEO overrides. Public reads are limited to public + published parent projects.';

comment on function public.save_portfolio_project_seo(
  uuid,
  text,
  text,
  text,
  text,
  text,
  text
) is
  'Admin-only atomic save for project slug, cover alt and SEO overrides.';

commit;

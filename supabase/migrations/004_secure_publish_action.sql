-- Portfolio CMS — Phase 1F
-- Secure draft-to-publish action foundation.
-- No real homepage content is moved by this migration.

begin;

create or replace function public.cms_publish_foundation_ready()
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then
    raise insufficient_privilege using message = 'Authentication required.';
  end if;

  if not exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  ) then
    raise insufficient_privilege using message = 'Admin access required.';
  end if;

  return true;
end;
$$;

create or replace function public.cms_publish_content(p_content_key text)
returns table (
  content_key text,
  published_data jsonb,
  published_at timestamptz
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then
    raise insufficient_privilege using message = 'Authentication required.';
  end if;

  if not exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  ) then
    raise insufficient_privilege using message = 'Admin access required.';
  end if;

  if p_content_key is null or btrim(p_content_key) = '' then
    raise exception 'Content key is required.'
      using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.cms_content_entries c
    where c.content_key = p_content_key
  ) then
    raise exception 'CMS content key not found: %', p_content_key
      using errcode = 'P0002';
  end if;

  return query
  update public.cms_content_entries c
  set
    published_data = c.draft_data,
    updated_by = auth.uid()
  where c.content_key = p_content_key
  returning
    c.content_key,
    c.published_data,
    c.published_at;
end;
$$;

revoke all on function public.cms_publish_foundation_ready() from public;
revoke all on function public.cms_publish_foundation_ready() from anon;
revoke all on function public.cms_publish_foundation_ready() from authenticated;

revoke all on function public.cms_publish_content(text) from public;
revoke all on function public.cms_publish_content(text) from anon;
revoke all on function public.cms_publish_content(text) from authenticated;

grant execute on function public.cms_publish_foundation_ready()
to authenticated;

grant execute on function public.cms_publish_content(text)
to authenticated;

comment on function public.cms_publish_content(text) is
  'Allowlisted-admin-only atomic promotion of cms_content_entries.draft_data to published_data.';

commit;

-- Portfolio CMS — Phase 3B
-- Reusable project media workflow metadata.
-- Existing public portfolio-media bucket from Phase 2A is reused.
-- Source originals are processed in-browser and are NOT uploaded by this workflow.

begin;

create table if not exists public.portfolio_media (
  id uuid primary key default gen_random_uuid(),
  original_filename text not null
    check (char_length(btrim(original_filename)) between 1 and 255),
  alt_text text not null
    check (char_length(btrim(alt_text)) between 1 and 220),
  source_mime_type text not null
    check (source_mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  source_width integer not null check (source_width > 0),
  source_height integer not null check (source_height > 0),
  source_bytes bigint not null check (source_bytes > 0),
  output_format text not null
    check (output_format in ('jpg', 'png', 'webp')),
  thumbnail_aspect text not null
    check (thumbnail_aspect in ('16:10', '4:3', '1:1', 'natural')),
  display_path text not null unique
    check (display_path like 'projects/library/%'),
  display_url text not null
    check (display_url ~ '^https://'),
  display_width integer not null check (display_width > 0),
  display_height integer not null check (display_height > 0),
  display_bytes bigint not null check (display_bytes > 0 and display_bytes <= 8388608),
  thumbnail_path text not null unique
    check (thumbnail_path like 'projects/library/%'),
  thumbnail_url text not null
    check (thumbnail_url ~ '^https://'),
  thumbnail_width integer not null check (thumbnail_width > 0),
  thumbnail_height integer not null check (thumbnail_height > 0),
  thumbnail_bytes bigint not null check (thumbnail_bytes > 0 and thumbnail_bytes <= 8388608),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  updated_by uuid references auth.users(id) on delete set null default auth.uid()
);

alter table public.portfolio_media enable row level security;

revoke all on table public.portfolio_media from public;
revoke all on table public.portfolio_media from anon;
revoke all on table public.portfolio_media from authenticated;

grant select, insert, update, delete
on table public.portfolio_media
to authenticated;

drop policy if exists "portfolio_media_metadata_admin_select" on public.portfolio_media;
drop policy if exists "portfolio_media_metadata_admin_insert" on public.portfolio_media;
drop policy if exists "portfolio_media_metadata_admin_update" on public.portfolio_media;
drop policy if exists "portfolio_media_metadata_admin_delete" on public.portfolio_media;

create policy "portfolio_media_metadata_admin_select"
on public.portfolio_media
for select
to authenticated
using (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid()
  )
);

create policy "portfolio_media_metadata_admin_insert"
on public.portfolio_media
for insert
to authenticated
with check (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid()
  )
);

create policy "portfolio_media_metadata_admin_update"
on public.portfolio_media
for update
to authenticated
using (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid()
  )
);

create policy "portfolio_media_metadata_admin_delete"
on public.portfolio_media
for delete
to authenticated
using (
  exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid()
  )
);

create or replace function public.portfolio_touch_media()
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

drop trigger if exists portfolio_media_touch_trigger
on public.portfolio_media;

create trigger portfolio_media_touch_trigger
before update on public.portfolio_media
for each row
execute function public.portfolio_touch_media();

create index if not exists portfolio_media_created_at_idx
  on public.portfolio_media (created_at desc);

comment on table public.portfolio_media is
  'Admin-only metadata for optimized Portfolio Engine media. Public pages consume public Storage URLs stored on published projects, not this metadata table.';

commit;

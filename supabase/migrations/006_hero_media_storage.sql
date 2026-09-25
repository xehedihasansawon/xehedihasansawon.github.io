-- Portfolio CMS — Phase 2A
-- Basic secure Hero image upload bucket.
-- Advanced optimization/media-library features remain for a later phase.

begin;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "portfolio_media_admin_insert" on storage.objects;
drop policy if exists "portfolio_media_admin_select" on storage.objects;
drop policy if exists "portfolio_media_admin_update" on storage.objects;
drop policy if exists "portfolio_media_admin_delete" on storage.objects;

create policy "portfolio_media_admin_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio-media'
  and exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  )
);

create policy "portfolio_media_admin_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'portfolio-media'
  and exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  )
);

create policy "portfolio_media_admin_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'portfolio-media'
  and exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'portfolio-media'
  and exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  )
);

create policy "portfolio_media_admin_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'portfolio-media'
  and exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  )
);

commit;

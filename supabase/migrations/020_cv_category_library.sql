-- Phase 5E · CV Category Library
-- Adds a private category key to each Admin-only CV version.

alter table public.portfolio_cvs
  add column if not exists category_key text not null default 'general';

alter table public.portfolio_cvs
  drop constraint if exists portfolio_cvs_category_key_check;

alter table public.portfolio_cvs
  add constraint portfolio_cvs_category_key_check
  check (
    category_key in (
      'graphic_design',
      'video_editing',
      'event_management',
      'computer_admin',
      'hospitality',
      'customer_travel',
      'ecommerce',
      'operations',
      'general'
    )
  );

create index if not exists portfolio_cvs_category_sort_idx
  on public.portfolio_cvs (category_key, sort_order, updated_at desc);

-- Preserve current test/real Graphic Designer versions in the right category.
update public.portfolio_cvs
set category_key = 'graphic_design'
where category_key = 'general'
  and (
    lower(coalesce(label, '')) like '%graphic%'
    or lower(coalesce(target_role, '')) like '%graphic%'
  );

begin;

-- Verified Phase 4 maintenance fix:
-- the visual contents of case-portfolio-final.jpg and case-miuw-final.jpg
-- are opposite to the project labels used by the original seed.
-- Swap only those known references; do not change project/case-study structure.

update public.portfolio_projects
set cover_image_url = case
  when slug = 'portfolio-website' then 'assets/case-miuw-final.jpg'
  when slug = 'miuw-erp' then 'assets/case-portfolio-final.jpg'
  else cover_image_url
end
where slug in ('portfolio-website', 'miuw-erp');

update public.portfolio_case_studies pcs
set
  hero_image_url = case
    when pp.slug = 'portfolio-website'
      and pcs.hero_image_url = 'assets/case-portfolio-final.jpg'
      then 'assets/case-miuw-final.jpg'
    when pp.slug = 'miuw-erp'
      and pcs.hero_image_url = 'assets/case-miuw-final.jpg'
      then 'assets/case-portfolio-final.jpg'
    else pcs.hero_image_url
  end,
  sections = replace(
    replace(
      pcs.sections::text,
      'assets/case-portfolio-final.jpg',
      'assets/__swap-temp__.jpg'
    ),
    'assets/case-miuw-final.jpg',
    'assets/case-portfolio-final.jpg'
  )::jsonb
from public.portfolio_projects pp
where pcs.project_id = pp.id
  and pp.slug in ('portfolio-website', 'miuw-erp');

update public.portfolio_case_studies pcs
set sections = replace(
  pcs.sections::text,
  'assets/__swap-temp__.jpg',
  'assets/case-miuw-final.jpg'
)::jsonb
from public.portfolio_projects pp
where pcs.project_id = pp.id
  and pp.slug in ('portfolio-website', 'miuw-erp')
  and pcs.sections::text like '%assets/__swap-temp__.jpg%';

commit;

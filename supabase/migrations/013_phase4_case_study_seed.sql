begin;

-- Phase 4 content seed.
-- Idempotent: preserves any owner-created project/case-study row with the same slug/project.

insert into public.portfolio_categories (
  slug,
  name,
  description,
  sort_order,
  is_active
)
values
  (
    'business-systems',
    'Business Systems',
    'ERP, workflow and practical business system projects.',
    80,
    true
  ),
  (
    'web-digital',
    'Web & Digital',
    'Websites, portfolio systems and digital product work.',
    90,
    true
  )
on conflict (slug) do nothing;

insert into public.portfolio_projects (
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
  published_at
)
select
  'miuw-erp',
  'MIUW ERP',
  'Orders, inventory, sourcing, delivery, finance and reporting in one practical business workflow.',
  c.id,
  'assets/case-miuw-final.jpg',
  'MIUW ERP business system case study cover',
  'Private case study',
  null,
  array['ERP','Business System','Workflow'],
  array['Private','Case Study'],
  false,
  false,
  90,
  0,
  'private',
  true,
  timezone('utc'::text, now())
from public.portfolio_categories c
where c.slug = 'business-systems'
on conflict (slug) do nothing;

insert into public.portfolio_projects (
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
  published_at
)
select
  'portfolio-website',
  'Portfolio Website',
  'Personal brand, selected work, CMS content and practical digital systems presented in one responsive experience.',
  c.id,
  'assets/case-portfolio-final.jpg',
  'Mehedi portfolio website case study cover',
  'View live site',
  'https://xehedihasansawon.github.io/',
  array['Portfolio','Website','Front-End','CMS'],
  array['Live','Case Study'],
  false,
  false,
  91,
  0,
  'public',
  true,
  timezone('utc'::text, now())
from public.portfolio_categories c
where c.slug = 'web-digital'
on conflict (slug) do nothing;

insert into public.portfolio_case_studies (
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
  published_at
)
select
  p.id,
  'Private Case Study · Business System',
  'MIUW ERP Business System',
  'A private, demo-safe ERP case study focused on practical workflow design for sourcing, inventory, orders, delivery, expenses and reporting.',
  'assets/project-miuw.jpg',
  'MIUW ERP business workflow interface preview',
  jsonb_build_array(
    jsonb_build_object('label','ROLE','value','System Designer'),
    jsonb_build_object('label','SCOPE','value','ERP Workflow'),
    jsonb_build_object('label','FOCUS','value','Practical Operations'),
    jsonb_build_object('label','ACCESS','value','Private Demo')
  ),
  jsonb_build_array(
    jsonb_build_object(
      'id','miuw-overview',
      'type','text',
      'eyebrow','Project Overview',
      'title','One workflow, connected operations',
      'body','MIUW ERP is a practical business-system concept designed to connect sourcing, inventory, order confirmation, sales, delivery, expenses and reporting without exposing real customer or operational records.'
    ),
    jsonb_build_object(
      'id','miuw-preview',
      'type','image',
      'eyebrow','System Preview',
      'title','A practical dashboard direction',
      'body','The case study uses demo-safe visual material to communicate the workflow and interface direction.',
      'layout','wide',
      'image_url','assets/case-miuw-final.jpg',
      'image_alt','MIUW ERP demo-safe business system preview'
    ),
    jsonb_build_object(
      'id','miuw-modules',
      'type','cards',
      'eyebrow','Core System',
      'title','Built around daily business work',
      'body','The system groups common operational tasks into clear modules instead of treating them as disconnected spreadsheets.',
      'cards',jsonb_build_array(
        jsonb_build_object('title','Sourcing & Inventory','text','Track incoming products, lots, stock and item-level information.'),
        jsonb_build_object('title','Orders & Sales','text','Keep order confirmation and sales activity inside one workflow.'),
        jsonb_build_object('title','Delivery Tracking','text','Follow processing, transit and delivery status without losing order context.'),
        jsonb_build_object('title','Finance & Reporting','text','Connect expenses, sales and practical reporting for better visibility.')
      )
    ),
    jsonb_build_object(
      'id','miuw-privacy',
      'type','text',
      'eyebrow','Demo Safety',
      'title','Private by design',
      'body','This portfolio case study intentionally avoids credentials, customer records, private business data and production-only information. It explains the system through safe demo content only.'
    )
  ),
  null,
  '',
  null,
  true,
  timezone('utc'::text, now())
from public.portfolio_projects p
where p.slug = 'miuw-erp'
on conflict (project_id) do nothing;

insert into public.portfolio_case_studies (
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
  published_at
)
select
  p.id,
  'Personal Portfolio · Web Experience',
  'Portfolio Website',
  'A responsive personal portfolio that combines visual design, real-world work, project discovery, CMS content and practical digital systems in one consistent experience.',
  'assets/case-portfolio-final.jpg',
  'Mehedi portfolio website interface preview',
  jsonb_build_array(
    jsonb_build_object('label','ROLE','value','Designer · Builder'),
    jsonb_build_object('label','TYPE','value','Personal Portfolio'),
    jsonb_build_object('label','FOCUS','value','UI · CMS · Case Studies'),
    jsonb_build_object('label','STATUS','value','Live')
  ),
  jsonb_build_array(
    jsonb_build_object(
      'id','portfolio-overview',
      'type','text',
      'eyebrow','Project Direction',
      'title','From static portfolio to working system',
      'body','The portfolio started as a visual presentation and evolved into a structured system where projects, media, homepage selections, metadata, search and case studies can be managed without rebuilding the site each time.'
    ),
    jsonb_build_object(
      'id','portfolio-gallery',
      'type','gallery',
      'eyebrow','Selected Screens',
      'title','One visual system across the site',
      'body','Selected views show the dark green visual identity, red highlights, project presentation and consistent portfolio language.',
      'images',jsonb_build_array(
        jsonb_build_object('url','assets/case-portfolio-final.jpg','alt','Portfolio website selected screen'),
        jsonb_build_object('url','assets/case-portfolio-v2.webp','alt','Portfolio website alternate selected screen')
      )
    ),
    jsonb_build_object(
      'id','portfolio-system',
      'type','cards',
      'eyebrow','What It Includes',
      'title','More than a homepage',
      'body','The portfolio combines presentation with reusable content and project-management features.',
      'cards',jsonb_build_array(
        jsonb_build_object('title','Portfolio Engine','text','Dynamic projects, categories, visibility and ordering.'),
        jsonb_build_object('title','Media Workflow','text','Optimized project media and reusable image handling.'),
        jsonb_build_object('title','Project Explorer','text','Search, tags, badges and filters for project discovery.'),
        jsonb_build_object('title','Case Studies','text','Reusable full project pages built from structured content.')
      )
    ),
    jsonb_build_object(
      'id','portfolio-build',
      'type','text',
      'eyebrow','Build Approach',
      'title','Designed to keep growing',
      'body','The site is developed in locked phases so approved visual and CMS behavior stays stable while new capabilities are added on top.'
    )
  ),
  null,
  'Visit Live Portfolio',
  'https://xehedihasansawon.github.io/',
  true,
  timezone('utc'::text, now())
from public.portfolio_projects p
where p.slug = 'portfolio-website'
on conflict (project_id) do nothing;

commit;

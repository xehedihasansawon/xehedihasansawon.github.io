-- Project Studio legacy sync
-- Idempotent safety net for environments where SSFC / Biporjoy 18 still live only as static pages.
-- Project Studio also performs the same guarded sync for the authenticated owner.

begin;

delete from public.portfolio_projects
where slug in ('ordering-test-2', 'test-portfolio-project');

insert into public.portfolio_categories (
  slug, name, description, sort_order, is_active
)
values (
  'sports-branding',
  'Sports Branding',
  'Tournament, team identity, jersey and sports communication projects.',
  20,
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
  'ssfc',
  'SSFC',
  'Tournament identity, event visuals, social graphics and organizing support for Shaheen School Football Championship.',
  c.id,
  'assets/case-ssfc-final.jpg',
  'Shaheen School Football Championship case study cover',
  'View case',
  'project.html?slug=ssfc',
  array['Sports Branding','Event Design','Large Format','Social Media'],
  array['Case Study'],
  true,
  true,
  10,
  0,
  'public',
  true,
  timezone('utc'::text, now())
from public.portfolio_categories c
where c.slug = 'sports-branding'
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
  'biporjoy-18',
  'Biporjoy 18',
  'Football team identity, jersey direction and tournament-ready sports graphics for SSC Batch 2018.',
  c.id,
  'assets/case-biporjoy18-final.jpg',
  'Biporjoy 18 football team identity cover',
  'View project',
  'project.html?slug=biporjoy-18',
  array['Team Branding','Logo Design','Jersey Design','Sports Graphics'],
  array['Case Study'],
  false,
  true,
  20,
  0,
  'public',
  true,
  timezone('utc'::text, now())
from public.portfolio_categories c
where c.slug = 'sports-branding'
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
  'Featured Case Study · SSFC',
  'Shaheen School Football Championship',
  'A multi-season football tournament design system covering social media, match graphics, jerseys, notices, event branding and large-format print, with Season 4 organizing responsibility.',
  'assets/ssfc/stage-16x8.svg',
  'SSFC stage banner',
  jsonb_build_array(
    jsonb_build_object('label','PROJECT','value','SSFC · Seasons 1–4'),
    jsonb_build_object('label','ROLE','value','Lead Graphic Designer'),
    jsonb_build_object('label','SEASON 4','value','Co-Organizer'),
    jsonb_build_object('label','LOCATION','value','Tangail, Bangladesh')
  ),
  jsonb_build_array(
    jsonb_build_object(
      'id','ssfc-overview',
      'type','text',
      'eyebrow','Project Scope',
      'title','One tournament, many formats',
      'body','SSFC needs graphics for social posts, fixtures, match graphics, jerseys, notices, champion posts, stage backdrops, rally materials and stadium banners.'
    ),
    jsonb_build_object(
      'id','ssfc-stadium',
      'type','image',
      'eyebrow','Stadium Outside',
      'title','16 × 4 FT Banner',
      'body','Large-format stadium artwork kept in its natural proportion.',
      'layout','portrait',
      'image_url','assets/ssfc/stadium-16x4.svg',
      'image_alt','SSFC 16 by 4 ft stadium outside banner'
    ),
    jsonb_build_object(
      'id','ssfc-stage',
      'type','image',
      'eyebrow','Stage Backdrop',
      'title','16 × 8 FT Stage Banner',
      'body','Wide stage backdrop with tournament and team information.',
      'layout','wide',
      'image_url','assets/ssfc/stage-16x8.svg',
      'image_alt','SSFC 16 by 8 ft stage banner'
    ),
    jsonb_build_object(
      'id','ssfc-rally',
      'type','image',
      'eyebrow','Grand Rally',
      'title','7 × 4 FT Rally Graphic',
      'body','Rally artwork presented in its natural landscape proportion.',
      'layout','wide',
      'image_url','assets/ssfc/rally-7x4.svg',
      'image_alt','SSFC 7 by 4 ft rally graphic'
    ),
    jsonb_build_object(
      'id','ssfc-role',
      'type','cards',
      'eyebrow','Role & Responsibility',
      'title','More than design',
      'body','Across the tournament I handled visual work and supported real event operations.',
      'cards',jsonb_build_array(
        jsonb_build_object('title','Visual Identity','text','Consistent tournament look across digital and print materials.'),
        jsonb_build_object('title','Match Content','text','Fixtures, match graphics, notices, champion posts and social assets.'),
        jsonb_build_object('title','Event Graphics','text','Stage, stadium, rally, banner and other large-format designs.'),
        jsonb_build_object('title','Organization','text','Season 4 organizing responsibility alongside the design work.')
      )
    ),
    jsonb_build_object(
      'id','project-gallery',
      'type','gallery',
      'eyebrow','More Work',
      'title','SSFC Project Gallery',
      'body','Additional fixtures, match graphics, jerseys, notices, champion posts and event visuals.',
      'images','[]'::jsonb
    )
  ),
  null,
  '',
  null,
  true,
  timezone('utc'::text, now())
from public.portfolio_projects p
where p.slug = 'ssfc'
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
  'Complete Team Identity',
  'Biporjoy 18',
  'A football team identity for SSC Batch 2018, from the logo and visual direction to jerseys, social media graphics and match-day presentation.',
  'assets/project-biporjoy.jpg',
  'Biporjoy 18 team branding',
  jsonb_build_array(
    jsonb_build_object('label','PROJECT','value','Biporjoy 18'),
    jsonb_build_object('label','ROLE','value','Team Manager · Lead Designer'),
    jsonb_build_object('label','TEAM','value','SSC Batch 2018'),
    jsonb_build_object('label','SCOPE','value','Branding · Jersey · Graphics')
  ),
  jsonb_build_array(
    jsonb_build_object(
      'id','biporjoy-overview',
      'type','text',
      'eyebrow','The Identity',
      'title','Designed as one complete system',
      'body','Biporjoy 18 was built as a consistent football identity rather than a collection of unrelated graphics.'
    ),
    jsonb_build_object(
      'id','biporjoy-core-gallery',
      'type','gallery',
      'eyebrow','Brand & Apparel',
      'title','Identity and jersey work',
      'body','Core team branding and kit applications.',
      'images',jsonb_build_array(
        jsonb_build_object('url','assets/project-biporjoy.jpg','alt','Biporjoy 18 team logo and identity'),
        jsonb_build_object('url','assets/project-jersey.jpg','alt','Biporjoy 18 jersey design')
      )
    ),
    jsonb_build_object(
      'id','biporjoy-role',
      'type','cards',
      'eyebrow','My Contribution',
      'title','Design and team responsibility',
      'body','Creative direction was combined with team-management responsibility.',
      'cards',jsonb_build_array(
        jsonb_build_object('title','Identity','text','Logo and recognizable team visual language.'),
        jsonb_build_object('title','Jerseys','text','Home and away kit concepts and presentation.'),
        jsonb_build_object('title','Social Graphics','text','Team and tournament communication visuals.'),
        jsonb_build_object('title','Management','text','Team Manager responsibilities alongside creative work.')
      )
    ),
    jsonb_build_object(
      'id','project-gallery',
      'type','gallery',
      'eyebrow','More Work',
      'title','Biporjoy 18 Project Gallery',
      'body','Additional team, tournament and match-day visuals.',
      'images','[]'::jsonb
    )
  ),
  null,
  '',
  null,
  true,
  timezone('utc'::text, now())
from public.portfolio_projects p
where p.slug = 'biporjoy-18'
on conflict (project_id) do nothing;

update public.portfolio_case_studies cs
set related_project_id = related.id
from public.portfolio_projects current_project,
     public.portfolio_projects related
where cs.project_id = current_project.id
  and current_project.slug = 'ssfc'
  and related.slug = 'biporjoy-18'
  and cs.related_project_id is null;

update public.portfolio_case_studies cs
set related_project_id = related.id
from public.portfolio_projects current_project,
     public.portfolio_projects related
where cs.project_id = current_project.id
  and current_project.slug = 'biporjoy-18'
  and related.slug = 'ssfc'
  and cs.related_project_id is null;

commit;

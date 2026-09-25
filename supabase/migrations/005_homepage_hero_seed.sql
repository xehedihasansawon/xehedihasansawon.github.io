-- Portfolio CMS — Phase 2A
-- Seed the approved Homepage Hero into the CMS without changing its visual content.

begin;

insert into public.cms_content_entries (
  content_key,
  draft_data,
  published_data,
  published_at
)
values (
  'homepage.hero',
  '{
    "statusText": "Available for freelance and remote projects",
    "eyebrow": "Graphic Designer • Brand Creator • Digital Systems",
    "nameLine1": "MD MEHEDI",
    "nameLine2": "HASAN SAWON",
    "rolePrefix": "I create",
    "highlight1": "bold visual identities",
    "highlight2": "social and sports graphics",
    "highlight3": "practical digital experiences",
    "roleSuffix": "for growing brands and teams.",
    "primaryLabel": "View selected work",
    "primaryHref": "#work",
    "secondaryLabel": "Let''s Work Together",
    "secondaryHref": "#contact",
    "meta1": "Brand identity",
    "meta2": "Social & sports design",
    "meta3": "AI & business workflows",
    "imageSrc": "assets/hero-visual.jpg",
    "imageAlt": "MD Mehedi Hasan Sawon portrait"
  }'::jsonb,
  '{
    "statusText": "Available for freelance and remote projects",
    "eyebrow": "Graphic Designer • Brand Creator • Digital Systems",
    "nameLine1": "MD MEHEDI",
    "nameLine2": "HASAN SAWON",
    "rolePrefix": "I create",
    "highlight1": "bold visual identities",
    "highlight2": "social and sports graphics",
    "highlight3": "practical digital experiences",
    "roleSuffix": "for growing brands and teams.",
    "primaryLabel": "View selected work",
    "primaryHref": "#work",
    "secondaryLabel": "Let''s Work Together",
    "secondaryHref": "#contact",
    "meta1": "Brand identity",
    "meta2": "Social & sports design",
    "meta3": "AI & business workflows",
    "imageSrc": "assets/hero-visual.jpg",
    "imageAlt": "MD Mehedi Hasan Sawon portrait"
  }'::jsonb,
  timezone('utc'::text, now())
)
on conflict (content_key) do nothing;

commit;

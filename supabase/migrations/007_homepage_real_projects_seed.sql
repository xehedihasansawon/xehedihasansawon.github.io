-- Portfolio CMS — Phase 2B
-- Seed the approved Real Life Projects homepage section.

begin;

insert into public.cms_content_entries (
  content_key,
  draft_data,
  published_data,
  published_at
)
values (
  'homepage.real-life-projects',
  '{
    "eyebrow": "Selected real-world work",
    "titleMain": "REAL LIFE",
    "titleAccent": "PROJECTS",
    "projects": [
      {
        "key": "ssfc",
        "type": "link",
        "category": "Sports Branding · Event Creative",
        "title": "SSFC",
        "description": "Tournament identity, event visuals, social graphics and organizing support.",
        "actionLabel": "View case ↗",
        "href": "ssfc.html",
        "imageSrc": "assets/case-ssfc-final.jpg",
        "imageAlt": "Shaheen School Football Championship case study cover"
      },
      {
        "key": "biporjoy",
        "type": "link",
        "category": "Team Identity · Sports Design",
        "title": "Biporjoy 18",
        "description": "Football team identity, jersey direction and tournament-ready sports graphics.",
        "actionLabel": "View project ↗",
        "href": "biporjoy.html",
        "imageSrc": "assets/case-biporjoy18-final.jpg",
        "imageAlt": "Biporjoy 18 football team identity cover"
      },
      {
        "key": "miuw",
        "type": "preview",
        "category": "ERP Workflow · Business System",
        "title": "MIUW ERP",
        "description": "Orders, inventory, sourcing, delivery, finance and reporting in one workflow.",
        "actionLabel": "Preview ↗",
        "imageSrc": "assets/case-miuw-final.jpg",
        "imageAlt": "MIUW ERP business system cover"
      },
      {
        "key": "portfolio",
        "type": "preview",
        "category": "Personal Brand · UI · Front-End",
        "title": "PORTFOLIO",
        "description": "Personal brand, selected work and digital systems presented in one experience.",
        "actionLabel": "View build ↗",
        "imageSrc": "assets/case-portfolio-final.jpg",
        "imageAlt": "Mehedi Portfolio website cover"
      }
    ]
  }'::jsonb,
  '{
    "eyebrow": "Selected real-world work",
    "titleMain": "REAL LIFE",
    "titleAccent": "PROJECTS",
    "projects": [
      {
        "key": "ssfc",
        "type": "link",
        "category": "Sports Branding · Event Creative",
        "title": "SSFC",
        "description": "Tournament identity, event visuals, social graphics and organizing support.",
        "actionLabel": "View case ↗",
        "href": "ssfc.html",
        "imageSrc": "assets/case-ssfc-final.jpg",
        "imageAlt": "Shaheen School Football Championship case study cover"
      },
      {
        "key": "biporjoy",
        "type": "link",
        "category": "Team Identity · Sports Design",
        "title": "Biporjoy 18",
        "description": "Football team identity, jersey direction and tournament-ready sports graphics.",
        "actionLabel": "View project ↗",
        "href": "biporjoy.html",
        "imageSrc": "assets/case-biporjoy18-final.jpg",
        "imageAlt": "Biporjoy 18 football team identity cover"
      },
      {
        "key": "miuw",
        "type": "preview",
        "category": "ERP Workflow · Business System",
        "title": "MIUW ERP",
        "description": "Orders, inventory, sourcing, delivery, finance and reporting in one workflow.",
        "actionLabel": "Preview ↗",
        "imageSrc": "assets/case-miuw-final.jpg",
        "imageAlt": "MIUW ERP business system cover"
      },
      {
        "key": "portfolio",
        "type": "preview",
        "category": "Personal Brand · UI · Front-End",
        "title": "PORTFOLIO",
        "description": "Personal brand, selected work and digital systems presented in one experience.",
        "actionLabel": "View build ↗",
        "imageSrc": "assets/case-portfolio-final.jpg",
        "imageAlt": "Mehedi Portfolio website cover"
      }
    ]
  }'::jsonb,
  timezone('utc'::text, now())
)
on conflict (content_key) do nothing;

commit;

-- Portfolio CMS — Phase 2C
-- Seed the approved Design Showcase section and popup content.

begin;

insert into public.cms_content_entries (
  content_key,
  draft_data,
  published_data,
  published_at
)
values (
  'homepage.design-showcase',
  '{
    "eyebrow": "Selected design work",
    "titleMain": "DESIGN",
    "titleAccent": "SHOWCASE",
    "items": [
      {
        "key": "sports-kit",
        "cardTitle": "Custom Sports Kit",
        "cardSubtitle": "Sportswear concept and jersey design.",
        "modalTitle": "CUSTOM SPORTS KIT",
        "modalEyebrow": "Design showcase",
        "modalMeta": "Sportswear · Apparel Design",
        "modalSummary": "A custom football kit concept focused on clear team identity, strong contrast and a presentation that works for both design review and sports promotion.",
        "modalPoints": ["Jersey visual direction", "Front-and-back sportswear presentation", "Team-focused color and graphic treatment"],
        "imageSrc": "assets/project-sportskit.jpg",
        "imageAlt": "Custom sports kit design"
      },
      {
        "key": "kings-kitchen",
        "cardTitle": "King''s Kitchen",
        "cardSubtitle": "Restaurant menu and promotional design.",
        "modalTitle": "KING''S KITCHEN",
        "modalEyebrow": "Design showcase",
        "modalMeta": "Menu Design · Restaurant Branding",
        "modalSummary": "A restaurant-focused visual piece built around clear food presentation, readable hierarchy and a branded promotional look.",
        "modalPoints": ["Menu-led information hierarchy", "Food and promotional visual balance", "Restaurant brand presentation"],
        "imageSrc": "assets/project-kings.jpg",
        "imageAlt": "King''s Kitchen menu design"
      },
      {
        "key": "long-lounge",
        "cardTitle": "Long Lounge",
        "cardSubtitle": "Hospitality social media promotional creative.",
        "modalTitle": "LONG LOUNGE",
        "modalEyebrow": "Design showcase",
        "modalMeta": "Social Media Design · Hospitality",
        "modalSummary": "A hospitality promotional creative designed to communicate the offer quickly while keeping the visual direction polished and social-media ready.",
        "modalPoints": ["Promotional content hierarchy", "Hospitality-focused visual direction", "Social-media-ready composition"],
        "imageSrc": "assets/project-lounge.jpg",
        "imageAlt": "Long Lounge social media design"
      },
      {
        "key": "cp-five-star",
        "cardTitle": "CP Five Star",
        "cardSubtitle": "Food promotion and social campaign creative.",
        "modalTitle": "CP FIVE STAR",
        "modalEyebrow": "Design showcase",
        "modalMeta": "Social Media Design · Food Promotion",
        "modalSummary": "A food-promotion creative that combines product focus, offer visibility and compact social advertising hierarchy.",
        "modalPoints": ["Product-first composition", "Offer and callout hierarchy", "Platform-ready promotional design"],
        "imageSrc": "assets/project-cp.jpg",
        "imageAlt": "CP Five Star promotional design"
      }
    ]
  }'::jsonb,
  '{
    "eyebrow": "Selected design work",
    "titleMain": "DESIGN",
    "titleAccent": "SHOWCASE",
    "items": [
      {
        "key": "sports-kit",
        "cardTitle": "Custom Sports Kit",
        "cardSubtitle": "Sportswear concept and jersey design.",
        "modalTitle": "CUSTOM SPORTS KIT",
        "modalEyebrow": "Design showcase",
        "modalMeta": "Sportswear · Apparel Design",
        "modalSummary": "A custom football kit concept focused on clear team identity, strong contrast and a presentation that works for both design review and sports promotion.",
        "modalPoints": ["Jersey visual direction", "Front-and-back sportswear presentation", "Team-focused color and graphic treatment"],
        "imageSrc": "assets/project-sportskit.jpg",
        "imageAlt": "Custom sports kit design"
      },
      {
        "key": "kings-kitchen",
        "cardTitle": "King''s Kitchen",
        "cardSubtitle": "Restaurant menu and promotional design.",
        "modalTitle": "KING''S KITCHEN",
        "modalEyebrow": "Design showcase",
        "modalMeta": "Menu Design · Restaurant Branding",
        "modalSummary": "A restaurant-focused visual piece built around clear food presentation, readable hierarchy and a branded promotional look.",
        "modalPoints": ["Menu-led information hierarchy", "Food and promotional visual balance", "Restaurant brand presentation"],
        "imageSrc": "assets/project-kings.jpg",
        "imageAlt": "King''s Kitchen menu design"
      },
      {
        "key": "long-lounge",
        "cardTitle": "Long Lounge",
        "cardSubtitle": "Hospitality social media promotional creative.",
        "modalTitle": "LONG LOUNGE",
        "modalEyebrow": "Design showcase",
        "modalMeta": "Social Media Design · Hospitality",
        "modalSummary": "A hospitality promotional creative designed to communicate the offer quickly while keeping the visual direction polished and social-media ready.",
        "modalPoints": ["Promotional content hierarchy", "Hospitality-focused visual direction", "Social-media-ready composition"],
        "imageSrc": "assets/project-lounge.jpg",
        "imageAlt": "Long Lounge social media design"
      },
      {
        "key": "cp-five-star",
        "cardTitle": "CP Five Star",
        "cardSubtitle": "Food promotion and social campaign creative.",
        "modalTitle": "CP FIVE STAR",
        "modalEyebrow": "Design showcase",
        "modalMeta": "Social Media Design · Food Promotion",
        "modalSummary": "A food-promotion creative that combines product focus, offer visibility and compact social advertising hierarchy.",
        "modalPoints": ["Product-first composition", "Offer and callout hierarchy", "Platform-ready promotional design"],
        "imageSrc": "assets/project-cp.jpg",
        "imageAlt": "CP Five Star promotional design"
      }
    ]
  }'::jsonb,
  timezone('utc'::text, now())
)
on conflict (content_key) do nothing;

commit;

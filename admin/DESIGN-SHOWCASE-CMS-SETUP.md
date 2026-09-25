# Phase 2C — Design Showcase CMS Setup

Phase 2C connects only the approved Design Showcase section and its existing project-snapshot popup content to CMS draft/preview/publish.

## 1. Sync the branch

`git pull origin phase02-polish`

## 2. Run the seed migration

Supabase → SQL Editor → New query

Run:

`supabase/migrations/008_homepage_design_showcase_seed.sql`

Suggested saved query name:

`27 - Seed Design Showcase CMS`

## 3. Test Admin

Open:

`http://localhost:5173/admin/`

Then:
- Design Showcase
- Confirm heading and all four showcase cards load
- Confirm popup title/meta/summary/three points load for each card
- Change one harmless field
- Save Draft
- Verify localhost remains on the old published value
- Preview Draft
- Publish Showcase
- Refresh localhost and verify the published value

## 4. Image upload

Each showcase card reuses the secured `portfolio-media` bucket and accepts JPG, PNG or WebP up to 8 MB.

## 5. Scope guard

The current four showcase cards and their order remain fixed in Phase 2C. Dynamic categories, counts and ordering stay reserved for Phase 3.

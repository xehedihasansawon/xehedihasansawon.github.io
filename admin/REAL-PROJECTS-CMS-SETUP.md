# Phase 2B — Real Life Projects CMS Setup

Phase 2B connects only the approved Real Life Projects homepage section to CMS draft/preview/publish.

## 1. Sync the branch

`git pull origin phase02-polish`

## 2. Run the seed migration

Supabase → SQL Editor → New query

Run:

`supabase/migrations/007_homepage_real_projects_seed.sql`

Suggested saved query name:

`26 - Seed Real Life Projects CMS`

## 3. Test Admin

Open:

`http://localhost:5173/admin/`

Then:
- Real Life Projects
- Confirm section heading and all four cards load
- Change one harmless text field
- Save Draft
- Verify localhost homepage has not changed yet
- Preview Draft
- Publish Projects
- Refresh localhost homepage and verify the published value appears

## 4. Image upload

Each fixed card can upload JPG, PNG or WebP up to 8 MB using the already-secured `portfolio-media` bucket from Phase 2A.

## 5. Scope guard

The four cards remain fixed in Phase 2B:
- SSFC and Biporjoy remain link cards
- MIUW and Portfolio remain preview cards
- Project count/order, categories, filters and drag-and-drop wait for Phase 3

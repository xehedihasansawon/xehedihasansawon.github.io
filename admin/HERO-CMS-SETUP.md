# Phase 2A — Homepage Hero CMS Setup

Phase 2A connects only the approved Hero section to CMS draft/preview/publish.

## 1. Sync the branch

`git pull origin phase02-polish`

## 2. Run the seed migration

Supabase → SQL Editor → New query

Run:

`supabase/migrations/005_homepage_hero_seed.sql`

Suggested saved query name:

`24 - Seed Homepage Hero CMS`

This seeds the current approved Hero as both draft and published content, so the visual output should remain unchanged.

## 3. Enable Hero image uploads

Run:

`supabase/migrations/006_hero_media_storage.sql`

Suggested saved query name:

`25 - Hero Media Storage & RLS`

This creates the public `portfolio-media` bucket with authenticated admin-only upload policies.

## 4. Test Admin

Open:

`http://localhost:5173/admin/`

Then:
- Homepage → Hero
- Confirm all current Hero values load
- Change one harmless field
- Save Draft
- Verify the public Hero has NOT changed yet
- Preview Draft
- Publish Hero
- Refresh localhost homepage and verify the published value appears

## 5. Safety

The public page keeps the current static Hero HTML as a fallback.
If Supabase cannot load, the approved static Hero remains visible.

Basic Hero upload is included in Phase 2A. Full image optimization, automatic conversion/resizing, thumbnails and the reusable media library remain for the later Portfolio Engine phase.

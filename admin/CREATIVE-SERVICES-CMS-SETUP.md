# Phase 2D — Creative Services CMS Setup

Phase 2D connects only the approved Creative Services section and its existing workflow popup content to CMS draft/preview/publish.

## 1. Sync the branch

`git pull origin phase02-polish`

## 2. Run the seed migration

Supabase → SQL Editor → New query

Run:

`supabase/migrations/009_homepage_creative_services_seed.sql`

Suggested saved query name:

`28 - Seed Creative Services CMS`

The editor can also create the content row on first authenticated Save Draft if the seed was missed.

## 3. Test Admin

Open:

`http://localhost:5173/admin/`

Then:
- Creative Services
- Confirm heading and all six service cards load
- Confirm workflow popup fields load for every service
- Change one harmless field
- Save Draft
- Verify localhost remains on the old published value
- Preview Draft
- Publish Services
- Refresh localhost and verify the published value
- Click a service card and verify popup workflow content

## 4. Scope guard

Service count, keys, numbering and order remain fixed in Phase 2D. Only content is CMS-editable.

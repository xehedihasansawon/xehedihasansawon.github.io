# Phase 1F — Secure Publish Action Setup

This is the final small foundation module before Phase 2 Homepage CMS.

## Run the migration

Supabase → SQL Editor → New query

Run:

`supabase/migrations/004_secure_publish_action.sql`

Suggested saved query name:

`16 - Secure CMS Publish Action`

## Dashboard verification

Refresh:

`http://localhost:5173/admin/`

Expected:
- CONTENT STORE → Ready
- REVISION HISTORY → Ready
- PUBLISH ACTION → Ready

## What Phase 1F does

`cms_publish_content(content_key)`:
- requires an authenticated allowlisted admin
- requires an existing CMS content key
- copies `draft_data` to `published_data`
- lets the existing Phase 1D trigger set publish metadata
- automatically produces a Phase 1E revision snapshot

No Publish button, Preview UI or real homepage content is added yet.
Those begin in Phase 2.

# Phase 1D — CMS Content Store Setup

This module creates the secure data foundation for future editable content.

## Run the migration

In Supabase:

SQL Editor → New query

Paste and run:

`supabase/migrations/002_cms_content_store.sql`

Suggested saved query name:

`04 - CMS Content Store & RLS`

## What it creates

Table:

`public.cms_content_entries`

Important fields:

- `content_key` — stable key such as `homepage.hero`
- `draft_data` — admin-only working content
- `published_data` — content that may later be read by the public website
- `draft_updated_at`
- `published_at`
- `updated_by`

## Security model

- Anonymous/public visitors can read only:
  - `content_key`
  - `published_data`
  - `published_at`
- Anonymous/public visitors cannot select the draft column.
- Authenticated users still need to be present in `admin_users` to read or write CMS rows.
- No homepage data is moved into this table during Phase 1D.

## Local verification

After the SQL migration succeeds:

1. Keep the admin account signed in.
2. Refresh `http://localhost:5173/admin/`
3. The Phase 1D card should change from:
   `Migration required`
   to:
   `Ready`

No additional SQL is needed for this module unless troubleshooting.

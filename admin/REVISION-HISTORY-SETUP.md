# Phase 1E — Revision History Setup

This module adds automatic content snapshots before real CMS editing starts.

## Run the migration

Supabase → SQL Editor → New query

Run:

`supabase/migrations/003_cms_revision_history.sql`

Suggested saved query name:

`09 - CMS Revision History & RLS`

## After migration

Refresh:

`http://localhost:5173/admin/`

Expected Phase 1E status:

- CONTENT STORE → Ready
- REVISION HISTORY → Ready

## Security model

- Anonymous/public users receive no table privileges on revision history.
- Authenticated users can only select revisions when they are allowlisted in `admin_users`.
- Browser clients cannot directly insert/update/delete revision rows.
- Revisions are written automatically by a database trigger when `cms_content_entries` changes.

## Later testing

After the dashboard reports Ready, use a temporary test content key to verify:
created → updated → deleted snapshots.

Restore UI is intentionally not included in Phase 1E.

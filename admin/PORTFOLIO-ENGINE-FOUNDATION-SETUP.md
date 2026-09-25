# Phase 3A — Portfolio Data Foundation

Phase 3A creates the secure normalized database foundation for the Portfolio Engine.

It does **not** change the current public project cards and does **not** migrate Phase 2 content yet.

## What it creates

- `public.portfolio_categories`
- `public.portfolio_projects`
- RLS policies for:
  - public read of active categories only
  - public read of published + public projects only
  - allowlisted-admin CRUD
- Future-ready fields for cover media, tags, badges, featured state, homepage selection, ordering, visibility and publishing
- indexes for ordering, categories, tags and badges

## Run the migration

Open Supabase → SQL Editor.

Open the repository file:

`supabase/migrations/010_portfolio_engine_foundation.sql`

Copy the **SQL contents** into a new Supabase query and run it.

Do not paste the file path itself into the SQL editor.

## Verify

1. `git pull origin phase02-polish`
2. Run `npm run dev`
3. Open `http://localhost:5173/admin/`
4. Open **Projects**
5. Click **Check again**

Expected:

- Categories Store → Ready → 0 categories
- Projects Store → Ready → 0 projects
- State → Foundation ready

Zero rows are correct for Phase 3A. Existing Phase 2 project cards remain untouched.

Production `main` remains untouched until explicit live approval.

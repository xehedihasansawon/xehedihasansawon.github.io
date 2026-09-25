# Phase 3B — Media / Image Workflow

Phase 3B creates a reusable optimized image workflow for future dynamic portfolio projects.

It does **not** change public project rendering yet.

## What this module does

- Reuses the existing public Supabase Storage bucket: `portfolio-media`
- Creates admin-only metadata table: `public.portfolio_media`
- Accepts JPG, PNG and WebP source images
- Source file can be up to 25 MB because it is processed locally in the browser
- Source original is **not uploaded**
- Creates a natural-ratio display image plus a separate thumbnail
- Display max width: 1600 / 2000 / 2400 px
- Thumbnail width: 640 / 800 / 1000 px
- Thumbnail ratios: 16:10, 4:3, 1:1 or natural
- Output choices: Auto, WebP, JPG, PNG
- Auto keeps PNG when transparency preservation is enabled; otherwise it uses WebP
- WebP/JPG quality is adjustable
- Each optimized Storage file is capped at 8 MB
- Failed partial uploads are cleaned up
- Delete removes both optimized files and the metadata row

## Run migration 011

Open Supabase → SQL Editor → New Query.

Open repository file: `supabase/migrations/011_portfolio_media_workflow.sql`

Copy the SQL inside the file, paste it into Supabase SQL Editor and Run.

Do not paste only the file path.

## Verify

1. `git pull origin phase02-polish`
2. `npm run dev`
3. Open `http://localhost:5173/admin/`
4. Open **Media**
5. Click **Check again**

Expected: Storage Bucket → Ready, Media Metadata → Ready, 0 media items, Media workflow ready.

## Upload test

Use one ordinary JPG/PNG/WebP image. Recommended: display 2000 px, thumbnail 800 px, 16:10, Auto, 82%.

Verify the display keeps natural ratio, thumbnail is separate, dimensions/filesizes appear, library item appears, and both URL-copy actions work.

For cleanup, upload a disposable image and press **Delete**.

Production `main` remains untouched until explicit live approval.

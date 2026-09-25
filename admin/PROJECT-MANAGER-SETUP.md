# Phase 3C — Dynamic Project & Category Manager

No SQL migration is required.

Phase 3C reuses the locked Phase 3A tables and Phase 3B Media Library.

## First verification

1. `git pull origin phase02-polish`
2. `npm run dev`
3. Open `http://localhost:5173/admin/`
4. Open **Projects — Active**
5. Confirm the manager reports its category/project/media counts

## Category test

Create one real category such as **Graphic Design**.
Slug should auto-fill as `graphic-design`.

## Project draft test

Create one draft project with title, summary and category.
If a Phase 3B media item exists, select it as the cover.
Click **Save draft**.

Then edit the saved draft and test **Publish project**.
Public homepage project cards remain unchanged in Phase 3C.

Production `main` remains untouched until explicit live approval.

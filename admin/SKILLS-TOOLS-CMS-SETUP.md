# Phase 2G — Skills & Tools CMS

Phase 2G connects only the approved Skills & Tools section to CMS draft/preview/publish.

No SQL seed is required. The first authenticated **Save draft** safely creates `homepage.skills-tools` if it does not exist.

## Test flow

1. `git pull origin phase02-polish`
2. Open `http://localhost:5173/admin/`
3. Open **Skills & Tools**
4. Confirm the four capability cards and eight tool cards load
5. Click **Save draft**
6. Preview the draft
7. Optionally upload one tool logo and verify the preview
8. Click **Publish Skills**
9. Refresh localhost homepage and verify the Skills & Tools section
10. Confirm card counts/order and layout remain unchanged

Production `main` remains untouched until explicit live approval.

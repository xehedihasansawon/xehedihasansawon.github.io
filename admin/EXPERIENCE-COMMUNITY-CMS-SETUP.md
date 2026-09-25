# Phase 2H — Experience / Community CMS

Phase 2H connects only the approved Experience & Community section to CMS draft/preview/publish.

No SQL seed is required. The first authenticated **Save draft** safely creates `homepage.experience-community` if it does not exist.

## Test flow

1. `git pull origin phase02-polish`
2. Open `http://localhost:5173/admin/`
3. Open **Experience / Community**
4. Confirm the current heading and four cards load
5. Click **Save draft**
6. Preview the draft
7. Click **Publish Experience**
8. Refresh localhost homepage and verify all four cards
9. Confirm card numbering, order and layout remain unchanged

Production `main` remains untouched until explicit live approval.

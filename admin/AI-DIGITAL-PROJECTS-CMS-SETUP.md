# Phase 2E — AI & Digital Projects CMS

Phase 2E connects only the approved AI & Digital Projects section and its existing workflow popup content to CMS draft/preview/publish.

No SQL seed is required for normal testing. The first authenticated **Save draft** safely creates `homepage.ai-digital-projects` if it does not exist.

## Test flow

1. `git pull origin phase02-polish`
2. Open `http://localhost:5173/admin/`
3. Open **AI & Digital Projects**
4. Confirm the four current cards and popup fields load
5. Click **Save draft**
6. Preview the draft
7. Click **Publish Digital**
8. Refresh localhost homepage
9. Open ERP / AI / Web / Docs cards and verify workflow dialog content

Production `main` remains untouched until explicit live approval.

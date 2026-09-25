# Phase 2J — Footer CMS

Phase 2J connects only the approved Footer to CMS draft/preview/publish.

No SQL seed is required. The first authenticated **Save draft** safely creates `homepage.footer` if it does not exist.

## Test flow

1. `git pull origin phase02-polish`
2. Open `http://localhost:5173/admin/`
3. Open **Footer**
4. Confirm current brand, role, six nav links, three professional links, legal text, three bottom links and Back to top load
5. Click **Save draft**
6. Preview the draft
7. Click **Publish Footer**
8. Refresh localhost homepage and verify the Footer
9. Test all footer links and Back to top
10. Confirm footer layout and link order remain unchanged

Production `main` remains untouched until explicit live approval.

# Phase 2K — Homepage Section Visibility / Order CMS

Phase 2K controls only homepage structure: the visibility and order of the nine existing main sections.

No SQL seed is required. The first authenticated **Save draft** safely creates `homepage.section-layout` if it does not exist.

## Default order

1. Hero
2. Real Life Projects
3. Design Showcase
4. Creative Services
5. AI & Digital Projects
6. About Me
7. Skills & Tools
8. Experience / Community
9. Contact

Footer is intentionally excluded and remains locked separately.

## Test flow

1. `git pull origin phase02-polish`
2. Open `http://localhost:5173/admin/`
3. Open **Section Order**
4. Confirm all nine sections are visible in the default approved order
5. Click **Save draft**
6. Test drag/drop and ↑ / ↓ on the draft
7. Toggle one section off and use **Preview draft**
8. Use **Reset approved order** before publishing the unchanged default if desired
9. Save again, then **Publish Layout**
10. Refresh localhost homepage and verify order/visibility
11. Confirm Footer is unchanged and outside the reorderable list

Production `main` remains untouched until explicit live approval.

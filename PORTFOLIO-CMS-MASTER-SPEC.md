# Portfolio CMS — Master Specification

Status: Active planning reference  
Development branch: `phase02-polish`  
Live branch: `main` (do not change until explicitly approved for live deployment)

## Golden development rule

Map the full system, but implement only one small module at a time.

Workflow for every module:

1. Plan the module.
2. Code only that module.
3. Test locally.
4. Get owner approval.
5. Lock/commit the stable module.
6. Move to the next module.

Do not randomly refactor already-approved frontend sections while building CMS features.

## Requirements 1–22

1. Dynamic image upload and optimization: dimensions, aspect ratio, resize, compression, WebP, thumbnails, transparency handling.
2. Dynamic portfolio categories and featured work, with See More / View All.
3. Private MIUW ERP screenshot-based case study with demo-safe data.
4. Portfolio website case study with selected screenshots plus live link.
5. Dynamic reusable case study template.
6. Project tags and smart filters.
7. Project badges such as Featured, New, Live, Private, Case Study and Concept.
8. Client project inquiry form.
9. Analytics dashboard for visits, project views and contact clicks.
10. Per-project SEO: slug, title, description, social preview and alt text.
11. Draft → Preview → Publish workflow.
12. Drag-and-drop project ordering.
13. Full homepage CMS control: text, images, buttons, links, sections, order and visibility.
14. Premium motion and animation system, implemented only after content/CMS is stable.
15. Backup and version history / restore.
16. Testimonials and client feedback system.
17. Multiple Resume / CV manager.
18. Availability status control.
19. Custom CTA manager.
20. Project search.
21. Branded 404, empty states and maintenance mode.
22. Admin security and protection.

## Phase map

### Phase 1 — Admin Foundation
- Secure authentication
- Admin allowlist
- Supabase connection foundation
- RLS-first security model
- No public signup

### Phase 2 — Homepage CMS
Break requirement #13 into separate mini-modules:
Hero → Projects → Services → Digital → About → Skills → Experience → Contact → Footer → Section visibility/order.

### Phase 3 — Portfolio Engine
Requirements #1, #2, #6, #7, #12 and #20.

### Phase 4 — Case Studies
Requirements #3, #4 and #5.

### Phase 5 — Business/System Features
Requirements #8, #9, #10, #16, #17, #18, #19 and #21.

### Phase 6 — Motion & Final Polish
Requirement #14 plus final performance, accessibility and mobile testing.

## Active module

**Phase 1A — Admin Authentication Foundation**

Scope:
- Admin login screen
- Supabase Auth sign-in
- Database-backed admin allowlist check
- Secure sign-out
- No signup route
- No CMS editing features yet
- Existing public portfolio frontend must remain visually unchanged

Acceptance checklist:
- [ ] Public homepage unchanged
- [ ] Admin route exists
- [ ] Missing config fails safely
- [ ] Invalid credentials are rejected
- [ ] Authenticated non-admin account is rejected
- [ ] Allowlisted admin account can enter admin shell
- [ ] Logout clears the session
- [ ] Admin membership cannot be self-created from the browser
- [ ] Supabase service-role key is never exposed in frontend code

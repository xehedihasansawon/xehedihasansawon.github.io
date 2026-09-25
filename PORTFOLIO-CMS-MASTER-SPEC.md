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

## Completed module

**Phase 1A — Admin Authentication Foundation — LOCKED / DONE**

Owner approval: 2026-09-25

Scope delivered:
- Admin login screen
- Supabase Auth sign-in
- Database-backed admin allowlist check
- Secure sign-out
- No signup route
- No CMS editing features yet
- Existing public portfolio frontend remains visually unchanged

Acceptance checklist:
- [x] Public homepage unchanged
- [x] Admin route exists
- [x] Missing config fails safely
- [x] Allowlisted admin account can enter admin shell
- [x] Logout clears the session
- [x] Admin membership cannot be self-created from the browser
- [x] Supabase secret/service-role key is not exposed in frontend code
- [ ] Invalid-credentials path — implemented, not separately manual-tested in this checkpoint
- [ ] Authenticated non-admin rejection — implemented via allowlist/RLS, not separately manual-tested in this checkpoint

Lock rule:
Do not modify Phase 1A behavior while building later modules unless a verified bug or required security change makes it necessary.

## Completed module

**Phase 1B — Admin Dashboard Shell — LOCKED / DONE**

Owner approval: 2026-09-25

Scope delivered:
- Reusable authenticated admin workspace
- Stable navigation structure for future CMS modules
- Dashboard active; future modules intentionally disabled
- Authenticated admin identity and secure logout in the shell
- Phase 1A security status retained without changing locked auth behavior
- Public portfolio pages kept untouched
- No content editing or new CMS write features introduced

Acceptance checklist:
- [x] Login behavior from Phase 1A still works
- [x] Allowlisted admin enters the new dashboard shell
- [x] Logout remains available in the shell
- [x] Desktop dashboard layout verified
- [x] Future module navigation is visible but disabled
- [x] Public homepage remains untouched by Phase 1B
- [x] No new CMS write permissions introduced
- [x] Mobile dashboard layout verified after owner lock
- [x] Verified mobile UX issue fixed: sidebar collapses into an accessible menu drawer

Responsive maintenance note:
The owner locked Phase 1B before the mobile evidence was reviewed. The subsequent mobile test exposed an oversized stacked sidebar. A narrow responsive fix was allowed under the lock rule: desktop structure remains unchanged, while screens up to 900px use a menu button, off-canvas sidebar, backdrop and Escape-to-close behavior.

Lock rule:
Do not redesign or restructure the Phase 1B shell during later feature work unless a verified usability, responsive, accessibility, or security issue requires it.

## Completed module

**Phase 1C — Password Recovery & Account Security — LOCKED / DONE**

Owner approval: 2026-09-25

Scope delivered:
- Forgot Password action on the admin sign-in screen
- Supabase recovery email flow using the browser-safe client
- Generic recovery-request response to avoid account enumeration
- Verified recovery-session handling
- Admin allowlist re-check before password update
- Minimum 10-character password requirement with confirmation matching
- Automatic sign-out after successful password change
- Fresh login required with the new password
- Phase 1A auth behavior and Phase 1B dashboard shell preserved
- No CMS content tables or additional database write permissions introduced

Supabase redirect configured for local testing:
- `http://localhost:5173/admin/`

Recovery redirect reliability note:
- The admin script captures recovery intent before Supabase can consume/clean the incoming URL fragment.
- If the PASSWORD_RECOVERY event is missed during initialization, the authenticated recovery session is detected from getSession() and still opens the password-update screen.
- Auth-state work is deferred outside the immediate onAuthStateChange callback to avoid callback timing issues.

Acceptance checklist:
- [x] Existing admin login still works
- [x] Forgot Password screen opens and returns to Sign in
- [x] Recovery request uses a generic response
- [x] Recovery email redirects back to the admin route
- [x] PASSWORD_RECOVERY session opens the new-password screen
- [x] Short or mismatched new passwords are rejected
- [x] Successful password update signs the user out
- [x] New password works on the next login
- [x] Public portfolio remains untouched
- [ ] Non-allowlisted recovery rejection is implemented but was not separately manual-tested in this checkpoint

Lock rule:
Do not change Phase 1C behavior during later feature work unless a verified bug or security requirement makes it necessary.

## Completed module

**Phase 1D — CMS Content Store & Draft/Publish Security Foundation — LOCKED / DONE**

Owner approval: 2026-09-25

Purpose delivered:
Created the smallest secure database layer needed before homepage content becomes editable.

Scope delivered:
- Added generic `cms_content_entries` table for future CMS modules
- Draft and published JSON data are separated in the same entry
- Public/anonymous visitors can read only published columns and only rows with published data
- Allowlisted admins receive RLS-protected select/insert/update/delete access
- Non-admin authenticated accounts remain blocked by RLS policies
- Draft updates, publish timestamps and authenticated updater metadata are tracked
- Admin dashboard readiness indicator confirms the migration is installed
- No homepage content was seeded or moved into the CMS
- Homepage/Projects navigation remains disabled
- Version history was intentionally not implemented in this module
- Locked Phase 1A–1C behavior and public portfolio files remain untouched

Security verification:
- Temporary test row `security.test` was inserted
- Anonymous published read succeeded
- Anonymous `draft_data` read returned the expected permission error
- Temporary test row was deleted successfully
- Cleanup query completed with no rows returned, which is expected for DELETE without RETURNING

Acceptance checklist:
- [x] Migration runs successfully in Supabase
- [x] `cms_content_entries` table exists with RLS enabled
- [x] Admin dashboard shows “Ready”
- [x] Allowlisted admin can query the table
- [x] Public access can read published data
- [x] Public access cannot read draft data
- [x] Temporary security test data was cleaned up
- [x] No homepage content has been moved into the CMS yet
- [x] Public portfolio remains visually unchanged

Lock rule:
Freeze the Phase 1D content-store schema. Extend it only through explicit later migrations when a later module has a demonstrated need.

## Completed module

**Phase 1E — Automatic Revision History Foundation — LOCKED / DONE**

Owner approval: 2026-09-25

Purpose delivered:
Added automatic content snapshots before any real homepage editing begins, giving future CMS changes a recoverable history foundation.

Scope delivered:
- Added private `cms_content_revisions` table
- Automatic snapshots are captured when CMS content is created, updated or deleted
- Revision rows store content key, event type, draft state, published state, timestamps and authenticated changer
- Anonymous/public visitors receive no revision-table access
- Only allowlisted admins can read revision history through RLS
- Browser clients cannot directly insert, update or delete revision rows
- Admin dashboard includes a Revision History readiness indicator
- Restore UI was intentionally not implemented in this module
- No homepage content was moved or edited
- Locked Phase 1A–1D behavior remains preserved

Verification:
- Revision migration installed successfully
- Dashboard showed both Content Store → Ready and Revision History → Ready
- Owner completed the temporary create → update → delete revision test sequence
- Owner completed the revision security-grant test
- Cleanup query returned `Success. No rows returned`, confirming test revision cleanup
- Detailed row/security results were user-confirmed as complete; only the cleanup result was separately screenshot-verified in this checkpoint

Acceptance checklist:
- [x] Migration runs successfully in Supabase
- [x] `cms_content_revisions` exists with RLS enabled
- [x] Dashboard shows Revision History → Ready
- [x] Creating a temporary CMS entry automatically creates a revision
- [x] Updating it automatically creates another revision
- [x] Deleting it automatically creates a deleted-state revision
- [x] Anonymous/public access cannot read revision history
- [x] Temporary test data and test revisions are cleaned up
- [x] Public portfolio remains visually unchanged

Lock rule:
Freeze the Phase 1E revision schema. Future restore UI may read these snapshots but should not rewrite this history model without an explicit migration.

## Next module

**Phase 1F — Foundation next layer**

Plan the exact scope before writing code. Continue the one-module-at-a-time rule and keep public portfolio content untouched.

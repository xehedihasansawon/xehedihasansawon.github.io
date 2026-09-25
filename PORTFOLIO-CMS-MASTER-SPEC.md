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
Hero → Real Life Projects → Design Showcase → Services → Digital → About → Skills → Experience → Contact → Footer → Section visibility/order.

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

## Completed module

**Phase 1F — Secure Draft-to-Publish Action Foundation — LOCKED / DONE**

Owner approval: 2026-09-25

Purpose delivered:
Finished the core Phase 1 publishing foundation with a controlled server-side action that promotes an approved draft to public published content.

Scope delivered:
- Added admin-only `cms_publish_content(content_key)` database function
- Draft JSON is promoted atomically into `published_data`
- Reused the locked Phase 1D publish metadata trigger
- Reused the locked Phase 1E automatic revision-history trigger
- Unauthenticated and non-allowlisted callers are rejected inside the database function
- Missing content keys are rejected instead of silently creating content
- Added `cms_publish_foundation_ready()` dashboard readiness check
- Function execution is granted only to authenticated callers, with allowlist enforcement still performed inside the functions
- Publish button, Preview UI and real homepage editing were intentionally not added yet
- Existing homepage content remains outside Supabase
- Locked Phase 1A–1E behavior and public portfolio files remain preserved

Verification:
- Publish migration installed successfully
- Dashboard showed Content Store → Ready, Revision History → Ready and Publish Action → Ready
- Owner completed the temporary draft creation and secure publish tests
- Published JSON matched the draft JSON
- Publish produced an automatic revision snapshot
- Function grant test confirmed anonymous execution is unavailable
- Missing content key rejection test completed successfully
- Temporary Phase 1F test content and revisions were cleaned up
- Detailed SQL results were user-confirmed as complete

Acceptance checklist:
- [x] Migration runs successfully in Supabase
- [x] Dashboard shows Publish Action → Ready
- [x] Temporary draft-only content can be published through `cms_publish_content`
- [x] Published JSON exactly matches the draft JSON after publish
- [x] Publish creates an automatic revision snapshot
- [x] Anonymous caller cannot execute the publish function
- [x] Missing content key is rejected
- [x] Temporary test content/revisions are cleaned up
- [x] Public portfolio remains visually unchanged

Lock rule:
Freeze the Phase 1F publish foundation. Real editor controls and Preview/Publish workflow UI begin in Phase 2.

## Phase 1 completion

**Phase 1 — Admin Foundation — COMPLETE / LOCKED**

Completed modules:
- Phase 1A — Admin Authentication Foundation
- Phase 1B — Admin Dashboard Shell
- Phase 1C — Password Recovery & Account Security
- Phase 1D — CMS Content Store & Draft/Publish Security Foundation
- Phase 1E — Automatic Revision History Foundation
- Phase 1F — Secure Draft-to-Publish Action Foundation

The project is now ready to begin **Phase 2 — Homepage CMS**, one mini-module at a time.

## Completed module

**Phase 2A — Homepage Hero CMS — LOCKED / DONE**

Owner approval: 2026-09-25

Purpose delivered:
Connected the approved public Hero section to the locked CMS foundation while preserving its existing design and keeping all other homepage sections outside this module.

Scope delivered:
- Homepage → Hero admin editor enabled
- `homepage.hero` seeded with the approved Hero content
- Hero copy, buttons, proof points, image source and alt text are editable
- Basic secure Hero image upload added through Supabase Storage
- JPG, PNG and WebP uploads supported up to 8 MB
- Uploaded image URL is inserted into the Hero form automatically
- Manual relative-path / HTTPS image source remains available
- Save Draft writes only to `draft_data`
- Private draft preview is available in Admin
- Publish uses the locked Phase 1F secure publish action
- Public/local Hero reads only `published_data`
- Existing static Hero HTML remains as the fail-safe fallback
- Production `main` branch remains untouched
- No other homepage CMS section was implemented

Verified during this checkpoint:
- Seed migration completed
- Hero editor loaded the approved content
- Secure image upload completed successfully
- Draft/publish flow updated the localhost Hero
- Published Hero image/content displayed correctly on localhost desktop
- Production site remained unchanged because `main` was not deployed

Not separately evidenced before owner lock:
- Unsaved-change publish-block message
- Dedicated private-preview screenshot/result
- Mobile Hero/editor visual verification
- Forced CMS-request failure fallback test

Deferred Hero visual polish note:
- Replace the current Hero image gradient/fade treatment with a cleaner border/frame system.
- Keep this as a later visual-polish task unless the owner explicitly moves it earlier.

Lock rule:
Freeze the Phase 2A Hero field contract and workflow. Only verified bugs, security issues, or the later full media optimization/library upgrade may modify this locked module.

## Completed module

**Phase 2B — Homepage Real Life Projects CMS — LOCKED / DONE**

Owner approval: 2026-09-25

Purpose delivered:
Connected the approved Real Life Projects homepage section to the locked CMS foundation while keeping the existing four-card structure and reserving dynamic portfolio behavior for Phase 3.

Scope delivered:
- Added a dedicated Real Life Projects admin editor under Homepage CMS
- Seeded `homepage.real-life-projects` with the approved section heading and four fixed cards
- Section eyebrow and two-part heading are editable
- Each card can edit category/meta, title, description, action label, image source and alt text
- SSFC and Biporjoy remain fixed link-card types with safely editable destinations
- MIUW and Portfolio remain fixed preview-card types using the existing modal behavior
- Reused the locked `portfolio-media` Supabase bucket for basic image uploads
- Save Draft writes only to `draft_data`
- Private draft preview UI is included
- Publish uses the locked Phase 1F secure publish action
- Public/local markup reads only `published_data`
- Static project markup remains the fail-safe fallback
- Project count and order remain fixed in Phase 2B
- Production `main` branch remains untouched

Verified during this checkpoint:
- Phase 2B seed migration completed successfully
- Real Life Projects editor loaded the four-card form
- Project image upload path was populated through Supabase Storage
- Relative project-link validation was fixed for normal same-site links such as `ssfc.html`
- Save Draft completed successfully after validation/save-flow fixes
- Unsaved-change publish protection was visibly triggered
- Publish completed successfully and the CMS reported the Projects content as published
- Production remained unchanged because no live deployment was performed

Not separately evidenced before owner lock:
- Dedicated private-preview result
- Localhost screenshot proving the final published card changes
- SSFC and Biporjoy click-through verification after the final publish
- MIUW and Portfolio preview-modal verification after the final publish
- Forced CMS-failure fallback test
- Dedicated desktop visual comparison
- Mobile visual verification

Acceptance checklist:
- [x] Phase 2B seed migration runs successfully
- [x] Real Life Projects admin navigation opens the Phase 2B editor
- [x] Current approved heading and four cards load into Admin
- [x] Project image upload works through the existing secure storage bucket
- [x] Save Draft writes the project draft successfully
- [ ] Private Preview was implemented but not separately evidenced
- [x] Publish is blocked while there are unsaved changes
- [x] Publish promotes the saved draft through the secure Phase 1F action
- [ ] Final localhost published-card result was not separately evidenced
- [ ] SSFC and Biporjoy link behavior was not separately re-verified after final publish
- [ ] MIUW and Portfolio preview-card behavior was not separately re-verified after final publish
- [ ] Static fallback was implemented but not forced/tested separately
- [ ] Desktop visual comparison was not separately evidenced
- [ ] Mobile visual verification was not separately evidenced
- [x] No other homepage CMS section was implemented in Phase 2B

Lock rule:
Freeze the Phase 2B four-card content contract and workflow. Only verified bugs/security issues may modify it before the later Phase 3 Portfolio Engine replaces the fixed-project limitations.

## Completed module

**Phase 2C — Homepage Design Showcase CMS — LOCKED / DONE**

Owner approval: 2026-09-25

Purpose delivered:
Connected the approved Design Showcase section to the locked CMS foundation while preserving the existing four-card presentation and project-snapshot interaction.

Scope delivered:
- Added a dedicated Design Showcase admin editor under Homepage CMS
- `homepage.design-showcase` can be seeded by migration or safely created on first authenticated Save Draft if missing
- Section eyebrow and DESIGN / SHOWCASE heading are editable
- Each fixed showcase card can edit visible title, subtitle, image source and alt text
- Each card can edit popup title, eyebrow, meta, summary and three proof points
- Reused the locked `portfolio-media` bucket for JPG/PNG/WebP uploads up to 8 MB
- Save Draft writes only to `draft_data`
- Private draft preview is available
- Publish uses the locked Phase 1F secure publish action
- Public/local homepage reads only `published_data`
- Existing static showcase markup and script data remain as fail-safe fallback
- Existing four-card count/order and tall-card styling remain fixed
- Production `main` branch remains untouched

Verified during this checkpoint:
- Design Showcase editor loaded successfully
- Private preview displayed the four current showcase cards
- Missing-row Save Draft issue was identified and fixed with authenticated upsert behavior
- Save Draft completed successfully
- Publish Showcase completed successfully
- Production remained unchanged because no live deployment was performed

Not separately evidenced before owner lock:
- Final localhost screenshot proving published Design Showcase content
- Card-by-card popup verification after final publish
- Explicit unsaved-change publish-block result
- Showcase image upload test during this module
- Forced CMS-failure fallback test
- Dedicated desktop visual comparison
- Mobile visual verification

Acceptance checklist:
- [x] Phase 2C content row exists via seed or authenticated first save
- [x] Design Showcase navigation opens the Phase 2C editor
- [x] Current approved heading and four cards load into Admin
- [x] Current popup fields are present in the editor
- [ ] Showcase image upload was implemented but not separately evidenced in this checkpoint
- [x] Save Draft writes successfully
- [x] Private Preview displays the current card values
- [ ] Unsaved-change publish block was not separately evidenced
- [x] Publish promotes the saved draft through the secure Phase 1F action
- [ ] Final localhost published result was not separately evidenced
- [ ] Card-by-card modal behavior was not separately re-verified after final publish
- [ ] Published popup content was not separately re-verified after final publish
- [ ] Static fallback was implemented but not force-tested
- [ ] Desktop visual comparison was not separately evidenced
- [ ] Mobile visual verification was not separately evidenced
- [x] No other homepage CMS section was implemented in Phase 2C

Lock rule:
Freeze the Phase 2C four-card showcase contract and modal-content workflow. Only verified bugs/security issues may modify it before the later Phase 3 Portfolio Engine.

## Completed module

**Phase 2D — Homepage Creative Services CMS — LOCKED / DONE**

Owner approval: 2026-09-25

Purpose delivered:
Connected the approved Creative Services section and its service-workflow popup content to the locked CMS foundation while preserving the current six-service structure.

Scope delivered:
- Added a dedicated Creative Services admin editor under Homepage CMS
- `homepage.creative-services` can be seeded by migration or safely created on first authenticated Save Draft if missing
- Section eyebrow and CREATIVE / SERVICES heading are editable
- Each fixed service card can edit visible title and description
- Each service popup can edit eyebrow, title, summary, workflow steps, deliverables, tools/process, client requirements and final handoff
- One-item-per-line admin fields are stored as clean JSON arrays
- Save Draft writes only to `draft_data`
- Private draft preview UI is included
- Publish uses the locked Phase 1F secure publish action
- Public/local homepage reads only `published_data`
- Existing static service-card text and `serviceDetails` JavaScript remain as fail-safe fallback
- Existing service keys, numbering, count and order remain fixed
- Production `main` branch remains untouched

Verified during this checkpoint:
- Creative Services admin editor loaded successfully
- Missing content row was shown as Setup required
- First authenticated Save Draft created the row successfully
- Save Draft completed with published content unchanged
- Publish Services completed successfully
- Production remained unchanged because no live deployment was performed
- The mistaken SQL Editor file-path query was identified as unnecessary and deleted from Supabase saved queries

Not separately evidenced before owner lock:
- Dedicated private-preview screenshot/result
- Explicit unsaved-change publish-block result
- Final localhost screenshot proving published Creative Services content
- Card-by-card service dialog verification after final publish
- Published workflow/deliverables/tools/needs/handoff verification inside the dialog
- Forced CMS-failure fallback test
- Dedicated desktop visual comparison
- Mobile visual verification

Acceptance checklist:
- [x] Phase 2D content row exists via first authenticated Save Draft
- [x] Creative Services navigation opens the Phase 2D editor
- [x] Current heading and six service cards load into Admin
- [x] Existing popup workflow fields are present in the editor
- [x] Save Draft writes successfully without publishing
- [ ] Private Preview was implemented but not separately evidenced
- [ ] Unsaved-change publish block was not separately evidenced
- [x] Publish promotes the saved draft through the secure Phase 1F action
- [ ] Final localhost published result was not separately evidenced
- [ ] Service-dialog behavior was not separately re-verified after final publish
- [ ] Published popup detail content was not separately re-verified after final publish
- [ ] Static fallback was implemented but not force-tested
- [ ] Desktop visual comparison was not separately evidenced
- [ ] Mobile visual verification was not separately evidenced
- [x] No other homepage CMS section was implemented in Phase 2D

Lock rule:
Freeze the Phase 2D six-service contract and workflow-popup model. Only verified bugs/security issues may modify it before later structural CMS work.

## Completed module

**Phase 2E — Homepage AI & Digital Projects CMS — LOCKED / DONE**

Owner approval: 2026-09-25

Purpose delivered:
Connected the approved AI & Digital Projects section and its workflow-popup content to the locked CMS foundation while preserving the existing four-card structure.

Scope delivered:
- Added a dedicated AI & Digital Projects admin editor under Homepage CMS
- `homepage.ai-digital-projects` is safely created on first authenticated Save Draft if missing
- Section eyebrow and AI & / DIGITAL PROJECTS heading are editable
- ERP remains the featured/main card; AI, Web and Business Documents remain compact cards
- Card marker/badge/icon text, visible title, description and action label are editable
- ERP featured chips are editable as one-item-per-line content
- Each popup can edit eyebrow, title, summary, workflow steps, deliverables, tools, client requirements and final handoff
- Save Draft writes only to `draft_data`
- Private draft preview UI is included
- Publish uses the locked Phase 1F secure publish action
- Public/local homepage reads only `published_data`
- Existing static digital-card markup and `digitalProjectDetails` remain as fail-safe fallback
- Existing card types, keys, count and order remain fixed
- Production `main` branch remains untouched

Verified during this checkpoint:
- AI & Digital Projects admin editor loaded successfully
- Missing content row was shown as Setup required
- First authenticated Save Draft created the row successfully
- Save Draft completed with published content unchanged
- Publish Digital completed successfully
- Production remained unchanged because no live deployment was performed

Not separately evidenced before owner lock:
- Dedicated private-preview screenshot/result
- Explicit unsaved-change publish-block result
- Final localhost screenshot proving published AI & Digital Projects content
- ERP chip visual verification after final publish
- Card-by-card workflow-dialog verification after final publish
- Published popup workflow/deliverables/tools/needs/handoff verification
- Forced CMS-failure fallback test
- Dedicated desktop visual comparison
- Mobile visual verification

Acceptance checklist:
- [x] Phase 2E content row exists via first authenticated Save Draft
- [x] AI & Digital Projects navigation opens the Phase 2E editor
- [x] Current heading and four cards load into Admin
- [x] Existing workflow popup fields are present in the editor
- [x] Save Draft writes successfully without publishing
- [ ] Private Preview was implemented but not separately evidenced
- [ ] Unsaved-change publish block was not separately evidenced
- [x] Publish promotes the saved draft through the secure Phase 1F action
- [ ] Final localhost published result was not separately evidenced
- [ ] ERP badge/chips were not separately re-verified after final publish
- [ ] Card-by-card workflow dialog behavior was not separately re-verified
- [ ] Published popup detail content was not separately re-verified
- [ ] Static fallback was implemented but not force-tested
- [ ] Desktop visual comparison was not separately evidenced
- [ ] Mobile visual verification was not separately evidenced
- [x] No other homepage CMS section was implemented in Phase 2E

Lock rule:
Freeze the Phase 2E four-card content contract and workflow-popup model. Only verified bugs/security issues may modify it before later structural CMS work.

## Completed module

**Phase 2F — Homepage About Me CMS — LOCKED / DONE**

Owner approval: 2026-09-25

Purpose delivered:
Connected the approved About Me section to the locked CMS foundation while preserving the existing no-photo layout and profile-meta structure.

Scope delivered:
- Added a dedicated About Me admin editor under Homepage CMS
- `homepage.about` is safely created on first authenticated Save Draft if missing
- Section eyebrow and ABOUT / ME heading are editable
- The two-line positioning headline is editable
- Both existing About paragraphs are editable
- Both existing profile-meta label/value pairs are editable
- No About photo was introduced; the approved no-photo layout remains
- Save Draft writes only to `draft_data`
- Private draft preview is available
- Publish uses the locked Phase 1F secure publish action
- Public/local homepage reads only `published_data`
- Existing static About markup remains as fail-safe fallback
- Production `main` branch remains untouched

Verified during this checkpoint:
- About Me admin editor loaded successfully
- First Save Draft completed successfully and created the content row when needed
- Private Preview was checked
- Publish About completed successfully
- Localhost About content was checked after publishing
- Approved no-photo layout remained unchanged
- Production remained unchanged because no live deployment was performed

Not separately evidenced before owner lock:
- Explicit unsaved-change publish-block result
- Forced CMS-failure fallback test
- Dedicated desktop visual comparison
- Mobile visual verification

Acceptance checklist:
- [x] Phase 2F content row exists via first authenticated Save Draft
- [x] About Me navigation opens the Phase 2F editor
- [x] Current approved About copy loads into Admin
- [x] Save Draft writes successfully without publishing
- [x] Private Preview reflects the current About fields
- [ ] Unsaved-change publish block was not separately evidenced
- [x] Publish promotes the saved draft through the secure Phase 1F action
- [x] Localhost About section loads published CMS content
- [x] Approved no-photo About layout remains unchanged
- [ ] Static fallback was implemented but not force-tested
- [ ] Dedicated desktop visual comparison was not separately evidenced
- [ ] Mobile visual verification was not separately evidenced
- [x] No other homepage CMS section was implemented in Phase 2F

Lock rule:
Freeze the Phase 2F About content contract and preserve the no-photo layout. Only verified bugs/security issues may modify it before a later explicit redesign request.

## Completed module

**Phase 2G — Homepage Skills & Tools CMS — LOCKED / DONE**

Owner approval: 2026-09-25

Purpose delivered:
Connected the approved Skills & Tools section to the locked CMS foundation while preserving the existing four-capability/eight-tool structure and ordering.

Scope delivered:
- Added a dedicated Skills & Tools admin editor under Homepage CMS
- `homepage.skills-tools` is safely created on first authenticated Save Draft if missing
- Section eyebrow and SKILLS / & TOOLS heading are editable
- Skills and Tools subsection kicker/title text are editable
- Four fixed capability cards can edit title, description and two tags
- Eight fixed tool cards can edit tool name and logo source
- Tool-logo upload support reuses the locked `portfolio-media` bucket for JPG/PNG/WebP/SVG up to 8 MB
- Save Draft writes only to `draft_data`
- Private draft preview covers both capability and tool cards
- Publish uses the locked Phase 1F secure publish action
- Public/local homepage reads only `published_data`
- Existing static Skills & Tools markup remains as fail-safe fallback
- Capability numbering/order and tool ordering remain fixed
- Production `main` branch remains untouched

Verified during this checkpoint:
- Skills & Tools editor loaded successfully
- First authenticated Save Draft completed and created the content row when needed
- Private Preview was checked
- Publish Skills completed successfully
- Localhost Skills & Tools section was checked after publishing
- Four capability cards and eight tool cards remained in the approved order/layout
- Production remained unchanged because no live deployment was performed

Not separately evidenced before owner lock:
- Tool-logo upload test during Phase 2G
- Explicit unsaved-change publish-block result
- Forced CMS-failure fallback test
- Dedicated desktop visual comparison
- Mobile visual verification

Acceptance checklist:
- [x] Phase 2G content row exists via first authenticated Save Draft
- [x] Skills & Tools navigation opens the Phase 2G editor
- [x] Current section heading/subheadings load into Admin
- [x] Four current capability cards load into Admin
- [x] Eight current tool cards and logos load into Admin
- [ ] Tool-logo upload was implemented but not separately evidenced
- [x] Save Draft writes successfully without publishing
- [x] Private Preview reflects current capability/tool values
- [ ] Unsaved-change publish block was not separately evidenced
- [x] Publish promotes the saved draft through the secure Phase 1F action
- [x] Localhost Skills & Tools section loads published CMS content
- [x] Capability numbering/order remains unchanged
- [x] Tool order/layout remains unchanged
- [ ] Static fallback was implemented but not force-tested
- [ ] Dedicated desktop visual comparison was not separately evidenced
- [ ] Mobile visual verification was not separately evidenced
- [x] No other homepage CMS section was implemented in Phase 2G

Lock rule:
Freeze the Phase 2G four-capability/eight-tool content contract. Only verified bugs/security issues may modify it before later structural CMS work.

## Completed module

**Phase 2H — Homepage Experience / Community CMS — LOCKED / DONE**

Owner approval: 2026-09-25

Purpose delivered:
Connected the approved Experience & Community section to the locked CMS foundation while preserving the existing four-card structure, numbering and order.

Scope delivered:
- Added a dedicated Experience / Community admin editor under Homepage CMS
- `homepage.experience-community` is safely created on first authenticated Save Draft if missing
- Section eyebrow and EXPERIENCE & / COMMUNITY heading are editable
- Four fixed cards remain in the approved order: Square Fashion, Freelance Graphic Design, SSFC, Community & Volunteer Work
- Card numbers and keys remain fixed
- Each card can edit type, period, title, role/subtitle, description and four tags
- Save Draft writes only to `draft_data`
- Private draft preview is available
- Publish uses the locked Phase 1F secure publish action
- Public/local homepage reads only `published_data`
- Existing static Experience & Community markup remains as fail-safe fallback
- Production `main` branch remains untouched

Verified during this checkpoint:
- Experience / Community editor loaded successfully
- First authenticated Save Draft completed and created the content row when needed
- Private Preview was checked
- Publish Experience completed successfully
- Localhost Experience & Community section was checked after publishing
- Four card numbering/order and approved layout remained unchanged
- Production remained unchanged because no live deployment was performed

Not separately evidenced before owner lock:
- Explicit unsaved-change publish-block result
- Forced CMS-failure fallback test
- Dedicated desktop visual comparison
- Mobile visual verification

Acceptance checklist:
- [x] Phase 2H content row exists via first authenticated Save Draft
- [x] Experience / Community navigation opens the Phase 2H editor
- [x] Current heading and four cards load into Admin
- [x] Card type, period, title, role, description and four tags are editable
- [x] Save Draft writes successfully without publishing
- [x] Private Preview reflects current card values
- [ ] Unsaved-change publish block was not separately evidenced
- [x] Publish promotes the saved draft through the secure Phase 1F action
- [x] Localhost Experience & Community section loads published CMS content
- [x] Card numbering/order remains unchanged
- [ ] Static fallback was implemented but not force-tested
- [ ] Dedicated desktop visual comparison was not separately evidenced
- [ ] Mobile visual verification was not separately evidenced
- [x] No other homepage CMS section was implemented in Phase 2H

Lock rule:
Freeze the Phase 2H four-card content contract. Only verified bugs/security issues may modify it before later structural CMS work.

## Next module

**Phase 2I — Homepage Contact CMS**

Plan the exact scope before coding. Keep Phase 2A–2H locked and touch only the Contact homepage section when Phase 2I starts.

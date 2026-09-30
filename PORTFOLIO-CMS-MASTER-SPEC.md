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

## Completed module

**Phase 2I — Homepage Contact CMS — LOCKED / DONE**

Owner approval: 2026-09-26

Purpose delivered:
Connected the approved Contact section to the locked CMS foundation while preserving the existing CTA/channel/profile-link layout and leaving the future client-inquiry form outside this module.

Scope delivered:
- Added a dedicated Contact admin editor under Homepage CMS
- `homepage.contact` is safely created on first authenticated Save Draft if missing
- Availability/status text, kicker, two-part CTA heading and description are editable
- Existing WhatsApp and Email primary contact cards remain in place
- WhatsApp label, display text, description, action text and URL are editable
- Email label, address, description and copy-button text are editable
- Existing Social & direct and Professional profiles groups remain in place
- Group titles, visible labels and URLs for Call, Facebook, Instagram, LinkedIn, GitHub and Behance are editable
- Contact URLs use the existing safe-link validation rules
- Email copy behavior tracks the CMS-published email address and action label
- Save Draft writes only to `draft_data`
- Private draft preview is available
- Publish uses the locked Phase 1F secure publish action
- Public/local homepage reads only `published_data`
- Existing static Contact markup remains as fail-safe fallback
- Future client inquiry form was intentionally not added
- Footer content was not changed
- Production `main` branch remains untouched

Verified during this checkpoint:
- Contact admin editor loaded successfully
- First authenticated Save Draft completed and created the content row when needed
- Private Preview was checked
- Publish Contact completed successfully
- Localhost Contact section was checked after publishing
- WhatsApp, Email copy, Call, Facebook, Instagram, LinkedIn, GitHub and Behance actions were checked
- Existing Contact layout remained unchanged
- Footer remained unchanged
- Production remained unchanged because no live deployment was performed

Not separately evidenced before owner lock:
- Explicit unsaved-change publish-block result
- Forced CMS-failure fallback test
- Dedicated desktop visual comparison
- Mobile visual verification

Acceptance checklist:
- [x] Phase 2I content row exists via first authenticated Save Draft
- [x] Contact navigation opens the Phase 2I editor
- [x] Current CTA copy and contact details load into Admin
- [x] WhatsApp URL and action remain functional
- [x] Email copy button uses the CMS-published address
- [x] Call/Facebook/Instagram links remain functional
- [x] LinkedIn/GitHub/Behance links remain functional
- [x] Save Draft writes successfully without publishing
- [x] Private Preview reflects current Contact values
- [ ] Unsaved-change publish block was not separately evidenced
- [x] Publish promotes the saved draft through the secure Phase 1F action
- [x] Localhost Contact section loads published CMS content
- [x] Existing Contact layout remains unchanged
- [ ] Static fallback was implemented but not force-tested
- [ ] Dedicated desktop visual comparison was not separately evidenced
- [ ] Mobile visual verification was not separately evidenced
- [x] Footer remains untouched
- [x] No other homepage CMS section was implemented in Phase 2I

Lock rule:
Freeze the Phase 2I Contact content contract and current channel/link structure. Only verified bugs/security issues may modify it before later structural CMS work. The client inquiry form remains a separate later module.

## Completed module

**Phase 2J — Homepage Footer CMS — LOCKED / DONE**

Owner approval: 2026-09-26

Purpose delivered:
Connected the approved Footer to the locked CMS foundation while preserving the existing layout, fixed link counts and current ordering.

Scope delivered:
- Added a dedicated Footer admin editor under Homepage CMS
- `homepage.footer` is safely created on first authenticated Save Draft if missing
- Footer brand name and role/positioning text are editable
- Six fixed footer navigation links remain in the approved order
- Navigation labels and hrefs are editable
- Three fixed professional links remain: LinkedIn, GitHub, Behance
- Professional-link labels and hrefs are editable
- Copyright and rights text are editable
- Three fixed bottom direct links remain: Facebook, Instagram, WhatsApp
- Bottom-link labels and hrefs are editable
- Back to top label and href are editable
- Footer hrefs use the existing safe-link validation rules
- Save Draft writes only to `draft_data`
- Private draft preview is available
- Publish uses the locked Phase 1F secure publish action
- Public/local homepage reads only `published_data`
- Existing static Footer markup remains as fail-safe fallback
- Contact and other homepage sections were not changed
- Production `main` branch remains untouched

Verified during this checkpoint:
- Footer admin editor loaded successfully
- First authenticated Save Draft completed and created the content row when needed
- Private Preview was checked
- Publish Footer completed successfully
- Localhost Footer was checked after publishing
- Six navigation links remained in the approved order
- LinkedIn, GitHub and Behance links were checked
- Facebook, Instagram and WhatsApp links were checked
- Back to top behavior was checked
- Footer layout/order remained unchanged
- Production remained unchanged because no live deployment was performed

Not separately evidenced before owner lock:
- Explicit unsaved-change publish-block result
- Forced CMS-failure fallback test
- Dedicated desktop visual comparison
- Mobile visual verification

Acceptance checklist:
- [x] Phase 2J content row exists via first authenticated Save Draft
- [x] Footer navigation opens the Phase 2J editor
- [x] Current footer brand and role load into Admin
- [x] Six navigation links load with current labels/hrefs
- [x] LinkedIn/GitHub/Behance load with current labels/hrefs
- [x] Copyright and rights text load correctly
- [x] Facebook/Instagram/WhatsApp load with current labels/hrefs
- [x] Back to top label/href loads correctly
- [x] Save Draft writes successfully without publishing
- [x] Private Preview reflects current Footer values
- [ ] Unsaved-change publish block was not separately evidenced
- [x] Publish promotes the saved draft through the secure Phase 1F action
- [x] Localhost Footer loads published CMS content
- [x] Footer link counts/order remain unchanged
- [x] Back to top behavior remains functional
- [ ] Static fallback was implemented but not force-tested
- [ ] Dedicated desktop visual comparison was not separately evidenced
- [ ] Mobile visual verification was not separately evidenced
- [x] No other homepage CMS section was implemented in Phase 2J

Lock rule:
Freeze the Phase 2J Footer content contract and fixed link structure. Only verified bugs/security issues may modify it before later structural CMS work.

## Completed module

**Phase 2K — Homepage Section Visibility / Order CMS — LOCKED / DONE**

Owner approval: 2026-09-26

Purpose delivered:
Added structural CMS control for the nine existing homepage sections while preserving all locked Phase 2A–2J content contracts and keeping Footer outside the reorderable structure.

Scope delivered:
- Added a dedicated Section Visibility / Order admin editor
- `homepage.section-layout` is safely created on first authenticated Save Draft if missing
- Exactly nine existing homepage sections are managed: Hero, Real Life Projects, Design Showcase, Creative Services, AI & Digital Projects, About Me, Skills & Tools, Experience / Community, Contact
- Section keys/count remain fixed
- Drag-and-drop ordering is implemented
- Up / Down ordering controls are implemented
- Per-section Visible / Hidden controls are implemented
- Reset approved order restores the current nine-section sequence with all sections visible
- Save Draft writes only to `draft_data`
- Private structural preview shows order and visibility
- Publish uses the locked Phase 1F secure publish action
- Public/local runtime can reorder existing DOM sections and apply visibility from `published_data`
- Existing static homepage order/visibility remains the fail-safe fallback
- Footer remains outside Phase 2K and stays Phase 2J locked
- No individual section content/card contract was redesigned
- Production `main` branch remains untouched

Explicitly evidenced in chat:
- Section Order editor was opened
- First authenticated Save Draft completed successfully

Owner lock note:
- Owner gave explicit **Phase 2K LOCKED** approval after the final drag/drop, Up/Down, visibility, Preview, Reset, Publish and localhost verification checklist was provided.
- Individual results/screenshots for those final checks were not separately posted in chat, so they are not recorded below as independently evidenced test outputs.

Acceptance checklist:
- [x] Phase 2K content row exists via first authenticated Save Draft
- [x] Section Order navigation opens the Phase 2K editor
- [ ] All nine sections in approved order were not separately evidenced after final test
- [ ] Drag/drop result was not separately evidenced
- [ ] Up/Down result was not separately evidenced
- [ ] Visibility-toggle result was not separately evidenced
- [ ] Reset approved order result was not separately evidenced
- [x] Save Draft writes successfully without publishing
- [ ] Private Preview result was not separately evidenced
- [ ] Unsaved-change publish block was not separately evidenced
- [ ] Publish result was not separately evidenced
- [ ] Localhost published order was not separately evidenced
- [ ] Localhost published visibility was not separately evidenced
- [x] Footer is structurally excluded from the Phase 2K list by implementation
- [ ] Forced static-fallback test was not separately evidenced
- [x] Phase 2A–2J content contracts were not edited by the Phase 2K implementation
- [ ] Dedicated desktop visual comparison was not separately evidenced
- [ ] Mobile visual verification was not separately evidenced

Lock rule:
Freeze the Phase 2K nine-section structural contract. Only verified bugs/security issues may modify it before later structural work. Adding/removing section types remains outside this module.

## Phase 2 status

**Homepage CMS — COMPLETE / LOCKED**

Phase 2A through Phase 2K are now owner-locked. Homepage content editing, Footer editing, and the nine-section visibility/order layer are connected to the secured CMS foundation. Production `main` remains unchanged until explicit live approval.

## Completed module

**Phase 3A — Portfolio Data Foundation — LOCKED / DONE**

Owner approval: 2026-09-26

Purpose delivered:
Created the secure normalized data foundation for the Portfolio Engine without migrating or changing the existing Phase 2 public project output.

Scope delivered:
- Added `public.portfolio_categories`
- Added `public.portfolio_projects`
- UUID primary keys and validated unique slugs
- Future-ready cover image URL/alt fields
- Tags and badges arrays
- Featured and homepage-selection flags
- Global and category ordering fields
- Public/private visibility
- Publish state via `is_published` / `published_at`
- Ordering/category/featured/tags/badges indexes
- RLS policies defined for public reads and allowlisted-admin CRUD
- Automatic update/publish timestamps
- Added Admin Projects foundation screen with readiness checks
- No categories or projects were seeded in Phase 3A
- Existing Phase 2 public project cards were not migrated or replaced
- Production `main` branch remained untouched

Verified during this checkpoint:
- Migration 010 was run in Supabase
- Admin Projects foundation screen loaded
- Categories Store reported **Ready**
- Projects Store reported **Ready**
- Empty foundation reported **0 categories / 0 projects**
- Foundation state reported **Foundation ready**
- No production deployment was performed

Implemented but not separately runtime-tested in chat:
- Anonymous category read policy
- Anonymous project visibility policy limiting reads to published + public rows
- Authenticated CRUD rejection for non-allowlisted users
- Direct inspection of RLS enablement in the Supabase dashboard
- Public homepage visual regression comparison

Acceptance checklist:
- [x] Migration 010 runs successfully in Supabase
- [ ] `portfolio_categories` RLS is implemented but was not separately inspected in the Supabase dashboard
- [ ] `portfolio_projects` RLS is implemented but was not separately inspected in the Supabase dashboard
- [ ] Anonymous project policy is implemented but was not separately runtime-tested
- [ ] Authenticated CRUD allowlist restriction is implemented but was not separately runtime-tested
- [x] Admin Projects navigation opens the Phase 3A foundation screen
- [x] Categories Store reports Ready
- [x] Projects Store reports Ready
- [x] Empty foundation correctly reports 0 categories / 0 projects
- [x] Existing Phase 2 public project rendering was not changed by Phase 3A code
- [x] No production `main` deployment occurred

Lock rule:
Freeze the Phase 3A schema/security contract. Later Phase 3 modules may extend it compatibly when required, but must not weaken RLS or expose draft/private projects.

## Completed module

**Phase 3B — Media / Image Workflow — LOCKED / DONE**

Owner approval: 2026-09-26

Purpose delivered:
Built a reusable browser-side image optimization and Media Library workflow for future dynamic portfolio projects without changing current public project rendering.

Scope delivered:
- Reused the existing `portfolio-media` Supabase Storage bucket
- Added admin-only `public.portfolio_media` metadata
- JPG, PNG and WebP source types are supported by implementation
- Source files are processed locally in the browser and the original source file is not uploaded by this workflow
- Source safety limits: 25 MB and 60 megapixels
- Natural-ratio display variant generation
- Display max-width choices: 1600 / 2000 / 2400 px with no upscaling
- Separate thumbnail generation at 640 / 800 / 1000 px
- Thumbnail ratios: 16:10 / 4:3 / 1:1 / natural
- Output choices: Auto / WebP / JPG / PNG
- Adjustable WebP/JPG compression quality
- PNG preservation option in Auto mode
- White flattening for explicit JPG output
- 8 MB per optimized Storage output limit
- Source/display/thumbnail dimensions and byte metadata
- Accessibility alt text
- Storage path contract: `projects/library/<media-id>/...`
- Display/thumbnail previews with dimensions and file sizes
- Media Library with display/thumbnail URL copy controls
- Delete workflow for optimized Storage files + metadata
- Partial-upload cleanup path implemented
- No project attachment/migration yet
- Existing Phase 2 public project rendering remains unchanged
- Production `main` remains untouched
- First owner Lighthouse mobile run: Performance 60 · Accessibility 96
- Lighthouse `Improve image delivery` exposed ~11.9 MB potential savings, dominated by legacy Supabase-hosted CMS Hero / Real Life Projects / Design Showcase uploads
- Added a one-click Admin Media Workflow optimizer that re-encodes only current Supabase CMS `imageSrc` assets above the threshold to WebP (max 1600 px, quality 82), uploads unique optimized copies, updates both draft + published JSON, and leaves originals untouched
- Added cleanup for newly uploaded optimized files if the CMS update fails
- Future direct Hero / Real Life Projects / Design Showcase uploads now optimize in-browser before Storage upload
- Static syntax/security audit passes for the new optimizer path; no new table, migration, public permission or secret was introduced

Verified during this checkpoint:
- Migration 011 ran successfully in Supabase
- Storage Bucket reported **Ready**
- Media Metadata reported **Ready**
- Empty Media Library reported **0 media items**
- Media workflow state reported **Media workflow ready**
- A PNG source was uploaded through Auto mode
- Display output was generated at **1024 × 1536**
- The selected 2000 px display maximum did not upscale the 1024 px source
- Display output preserved the natural portrait ratio
- A separate **800 × 500** 16:10 thumbnail was generated
- Display and thumbnail file sizes were shown
- The uploaded item appeared in Media Library as **1 item**

Implemented but not separately evidenced before owner lock:
- JPG source upload
- WebP source upload
- Explicit WebP output mode
- Explicit JPG output mode
- Explicit PNG output mode
- Other thumbnail ratios (4:3, 1:1, natural)
- Copy display URL result
- Copy thumbnail URL result
- Delete/cleanup result
- Forced partial-upload failure cleanup
- Direct Storage inspection proving no source-original object
- Dedicated public-page visual regression comparison

Acceptance checklist:
- [x] Migration 011 runs successfully
- [x] Storage Bucket reports Ready
- [x] Media Metadata reports Ready
- [x] Empty library reports 0 media items
- [ ] JPG source support implemented but not separately tested
- [x] PNG source upload tested
- [ ] WebP source support implemented but not separately tested
- [x] Auto output generated an optimized image
- [ ] Explicit WebP output was not separately tested
- [ ] Explicit JPG output was not separately tested
- [ ] Explicit PNG output was not separately tested
- [x] Display variant preserved natural aspect ratio
- [x] 16:10 thumbnail selection produced 800 × 500 output
- [x] Display/thumbnail dimensions and sizes were shown
- [x] Media item appeared in library after upload
- [ ] Copy display URL result was not separately evidenced
- [ ] Copy thumbnail URL result was not separately evidenced
- [ ] Delete result was not separately evidenced
- [x] Partial-upload cleanup path is implemented in code
- [x] Source-original upload is intentionally absent from the implementation
- [x] Existing public project rendering was not modified by Phase 3B code
- [x] No production `main` deployment occurred

Lock rule:
Freeze the Phase 3B media metadata/storage-path and optimization contract. Later modules may consume these media records but must not serve large source originals.

## Active module

**Phase 3C — Dynamic Project & Category Manager**

### Phase 3C implementation status

**Status: LOCKED / DONE**

Implemented inside Phase 3C:
- Category CRUD: create, edit, active/inactive, delete
- Project CRUD: create draft, edit draft, delete
- Project fields: title, slug, summary, category, cover image URL/alt, action label/href, visibility
- Phase 3B Media Library optimized cover attachment
- Draft safety: every content save writes `is_published = false`
- Publish saved drafts
- Block Publish when the currently loaded project has unsaved changes
- Unpublish published projects back to Draft
- Editing a published project and saving returns it to Draft
- Private published projects remain anonymous-inaccessible through locked Phase 3A RLS
- No Phase 2 homepage migration or public project rendering changes
- Production `main` remains untouched

Owner approval: 2026-09-26

Phase 3C is locked. Future phases may consume this project/category manager but must not change its established CRUD, draft/publish, RLS or media-attachment behavior unless a verified bug/security issue requires it.




Purpose:
Turn the locked Phase 3A project/category data stores and Phase 3B Media Library into an admin CRUD workflow, without replacing the current public homepage project cards yet.

Scope:
- Keep Phase 2A–2K and Phase 3A–3B locked
- No new SQL migration is required for Phase 3C
- Reuse `portfolio_categories`, `portfolio_projects` and `portfolio_media`
- Add a dedicated Phase 3C Projects admin view
- Create/edit/delete categories
- Category fields: name, slug, description, active/inactive
- Category slug auto-generation with manual override
- Deleting a category is allowed; existing project foreign keys fall back to uncategorized by the locked Phase 3A schema
- Create/edit/delete dynamic project records
- Project fields in Phase 3C: title, slug, summary, category, cover image URL/alt, action label/href, visibility
- Attach an optimized cover from Phase 3B Media Library
- Media attachment copies the optimized display URL and alt text into the project
- Tags/badges remain deferred to Phase 3E
- Featured/homepage-selection remains deferred to Phase 3D
- Project ordering remains deferred to Phase 3F
- Save Draft always stores `is_published = false`
- Editing a currently published project then saving converts it back to Draft before changes can be published again
- Publish requires an already-saved project record
- Unsaved project changes block Publish
- Unpublish returns a project to Draft
- Public/private visibility remains enforced by the locked Phase 3A RLS policy
- Publishing a private project does not make it anonymous-readable
- Do not migrate existing Phase 2 Real Life Projects or Design Showcase cards in Phase 3C
- Do not change public homepage project rendering
- Keep production `main` untouched

Acceptance checklist:
- [x] Phase 3C Projects navigation opens the manager
- [x] Existing category/project/media records load
- [x] Category can be created
- [x] Category can be edited
- [x] Category active/inactive state can be changed
- [x] Category can be deleted
- [x] Project draft can be created
- [x] Project slug validation works
- [x] Safe action-link validation works
- [x] Category can be assigned to a project
- [x] Phase 3B Media Library image can be attached as cover
- [x] Cover URL and alt text populate from selected media
- [x] Draft project can be edited
- [x] Unsaved project changes block Publish
- [x] Saved project can be published
- [x] Published project can be unpublished
- [x] Public/private visibility can be selected
- [x] Project can be deleted
- [x] Existing public homepage cards remain unchanged
- [x] No production `main` deployment occurs

Lock rule:
After owner verification, freeze the Phase 3C category/project CRUD and draft/publish behavior. Later modules may add featured selection, tags/badges/search and ordering without weakening current RLS or draft/private protections.

## Active module

**Phase 3D — Featured Homepage / Category Selection**

Status: **LOCKED / DONE · FINAL RE-AUDIT PASS**

Purpose:
Connect the locked Phase 3C Portfolio Engine to the locked Phase 2 Real Life Projects homepage design without changing the public visual system.

Scope:
- Keep Phase 2A–2K and Phase 3A–3C locked
- No SQL migration required
- Reuse existing `portfolio_projects.show_on_homepage`, `portfolio_projects.is_featured` and `category_id`
- Add a dedicated Phase 3D Homepage Selection admin view
- Load Portfolio Engine categories and projects for admin selection
- Category filter is an admin selection aid only; category editing remains Phase 3C
- Homepage eligibility requires: published + public + optimized cover
- Allow at most 4 Portfolio Engine projects on the homepage
- Allow one selected project to receive Featured priority
- Turning off homepage selection also clears Featured priority for that project
- Draft, private or coverless projects cannot be newly selected for the public homepage
- If a previously selected project becomes ineligible, admin may remove the stale selection
- Public homepage queries only anonymous-readable published public projects through locked Phase 3A RLS
- Public Real Life Projects keeps the locked Phase 2 card classes/layout
- Selected Portfolio Engine projects fill the first available Real Life Projects slots
- When fewer than 4 dynamic projects are selected, remaining slots keep existing Phase 2 cards so the locked 2×2 layout stays visually complete
- Matching static fallback cards are skipped when they represent the same selected project
- If no valid Portfolio Engine selection exists, all existing Phase 2 static cards remain the safe fallback
- Phase 2 Real Life Projects heading remains managed by its existing locked CMS content
- Tags, badges, search and smart filters remain deferred to Phase 3E
- Manual drag/drop ordering remains deferred to Phase 3F
- Until Phase 3F, Featured priority is shown first, then newest published projects
- Keep production `main` untouched

Acceptance checklist:
- [x] 03D Homepage navigation opens the Phase 3D manager
- [x] Existing categories/projects load
- [x] Category filter works
- [x] Draft project cannot be newly selected
- [x] Private project cannot be newly selected
- [x] Project without cover cannot be newly selected
- [x] Published public project with optimized cover can be selected
- [x] Maximum 4 homepage projects is enforced *(implementation-verified; owner approved move to Phase 3E)*
- [x] Featured priority can be assigned to one selected project
- [x] Homepage selection saves to `show_on_homepage` / `is_featured`
- [x] Saved selection reloads correctly
- [x] Public homepage renders selected Portfolio Engine project(s)
- [x] Partial selection keeps remaining Phase 2 fallback cards and preserves the locked 2×2 layout
- [x] Category name, title, summary, cover and action data render
- [x] Empty Portfolio Engine selection preserves Phase 2 static fallback
- [x] Locked Phase 2 Real Life Projects layout/design remains unchanged
- [x] Phase 3C CRUD/draft/publish behavior remains unchanged
- [x] No production `main` deployment occurs

Owner approval: 2026-09-27

Phase 3D is locked. Future phases may consume homepage selection flags but must not change the established eligibility, max-4, featured-priority, fallback or RLS behavior unless a verified bug/security issue requires it.

Lock rule:
Freeze Phase 3D homepage/category-selection behavior. Phase 3E may add metadata/filter/search capabilities and Phase 3F may add manual ordering without changing the Phase 3D eligibility, fallback or RLS contract.

## Active module

**Phase 3E — Tags, Badges, Smart Filters & Search**

Status: **LOCKED / DONE**

Purpose:
Add structured project metadata and public discovery without changing locked Phase 3C CRUD, Phase 3D homepage selection or Phase 2 visual cards.

Scope:
- Keep Phase 2A–2K and Phase 3A–3D locked
- No SQL migration required
- Reuse existing `portfolio_projects.tags text[]` and `portfolio_projects.badges text[]`
- Add dedicated 03E Tags & Search admin view
- Admin can assign/remove normalized tags per project
- Admin can assign/remove badges per project
- Badge presets: Featured, New, Live, Private, Case Study, Concept
- Prevent duplicate/empty tags and badges
- Keep Phase 3D `is_featured` flag independent from display badge metadata
- Public discovery reads only published + public projects through locked Phase 3A RLS
- Add public Project Explorer with keyword search across title, summary, category and tags
- Add category filter
- Add tag filter
- Add badge filter
- Smart filters combine together using AND between filter groups
- Search remains case-insensitive
- Empty results show a branded empty state
- Search/filter controls do not alter locked Real Life Projects 2×2 card layout
- Phase 3D homepage selection behavior remains unchanged
- Project ordering remains deferred to Phase 3F
- Keep production `main` untouched

Acceptance checklist:
- [x] 03E Tags & Search navigation opens the manager
- [x] Existing projects/categories load
- [x] Tags can be added and removed
- [x] Duplicate/empty tags are prevented
- [x] Badge presets can be assigned and removed
- [x] Metadata saves to `tags` / `badges`
- [x] Saved metadata reloads correctly
- [x] Draft/private metadata remains admin-only
- [x] Public Project Explorer loads published public projects only
- [x] Keyword search works
- [x] Category filter works
- [x] Tag filter works
- [x] Badge filter works
- [x] Combined filters work
- [x] Empty result state works
- [x] Locked Real Life Projects 2×2 section remains unchanged
- [x] Phase 3D homepage selection remains unchanged
- [x] No production `main` deployment occurs

Final bugfix re-audit: 2026-09-28 — **PASS**

Verified bugfixes before final lock:
- Public case-study renderer now accepts safe repository-relative image paths such as `assets/...` while rejecting dangerous schemes
- Case-study heading parsing now uses real whitespace splitting (`/\\s+/`)
- Admin preserves an existing non-Media-Library hero image instead of silently clearing it on Save/Publish, while still allowing the owner to switch to project cover or a Media Library image
- Existing homepage fallback project cards now open a published dynamic case study when a matching public Portfolio Engine project exists, even when that project is not selected for dynamic homepage replacement

Final re-audit verified:
- Phase 4 executable JavaScript syntax passes static parsing
- Public/admin DOM references are present
- Public and admin Phase 4 CSS blocks are balanced
- Case Study admin wiring is connected
- Text, Image, Gallery and Feature Cards are supported
- Facts/section limits remain enforced
- Draft, Publish and Unpublish flows remain wired
- RLS requires a published case study plus a published public parent project for anonymous access
- Authenticated management remains restricted through `admin_users`
- No service-role credential is used by Phase 4 executable code
- MIUW remains private/demo-safe and Portfolio Website remains public with its live link
- Project Explorer and homepage dynamic-case linking are both present
- Production `main` remains untouched by Phase 4

Final owner lock after bugfix re-audit: 2026-09-28

Owner approval: 2026-09-28

Phase 3E is locked. Future phases may consume project tags, badges and public discovery metadata but must not change the established metadata normalization, public-only discovery or filter semantics unless a verified bug/security issue requires it.

Lock rule:
Freeze Phase 3E metadata/search/filter behavior. Phase 3F may add manual project ordering without changing Phase 3E metadata or filter semantics.

## Active module

**Phase 3F — Drag-and-Drop Project Ordering**

Status: **LOCKED / DONE**

Purpose:
Add one simple manual order to Portfolio Engine projects while preserving locked Phase 3C CRUD, Phase 3D homepage eligibility/featured behavior and Phase 3E metadata/filter semantics.

Scope:
- Keep Phase 2A–2K and Phase 3A–3E locked
- No SQL migration required
- Reuse existing `portfolio_projects.sort_order`
- Add dedicated 03F Ordering admin view
- One project list only; no separate category-order mode
- Drag-and-drop works with mouse/pointer and Move Up / Move Down controls
- Save order explicitly; dragging does not write until Save
- Refresh/discard reloads persisted order
- Draft/private projects remain orderable by admin
- Public Project Explorer uses the same global `sort_order` everywhere, including after category filtering
- Phase 3D homepage selection keeps Featured priority first, then manual global `sort_order`
- Equal/legacy order values fall back to newest published/created data for deterministic display
- Ordering must not modify tags, badges, publish state, visibility, category, homepage-selection flags or content fields
- Keep production `main` untouched

Acceptance checklist:
- [x] 03F Ordering navigation opens the manager
- [x] Existing projects load
- [x] Drag-and-drop reorders items locally *(owner-tested ordering flow)*
- [x] Move Up / Move Down controls reorder items *(implementation-verified; controls present in owner-tested flow)*
- [x] Save order persists sequential `sort_order`
- [x] Refresh reloads saved order
- [x] Draft/private projects remain admin-orderable
- [x] Public Project Explorer follows saved order
- [x] Category filtering keeps the same saved order *(same global order model; implementation-verified)*
- [x] Phase 3D homepage keeps Featured priority first, then manual order *(implementation-verified)*
- [x] Phase 3E tags/search/filter behavior remains unchanged *(regression/static verified)*
- [x] Ordering writes do not alter other project fields *(write isolation verified: sort_order only)*
- [x] No production `main` deployment occurs

Owner approval: 2026-09-28

Phase 3F is locked. Future phases may consume the saved project order but must not change the established one-list ordering model unless a verified bug/security issue requires it.

Lock rule:
Freeze Phase 3F ordering behavior.

## Phase 3 Portfolio Engine — COMPLETE / LOCKED

Owner approval: 2026-09-28

Completed and locked modules:
- Phase 3A — Portfolio Data Foundation
- Phase 3B — Media / Image Workflow
- Phase 3C — Dynamic Project & Category Manager
- Phase 3D — Featured Homepage / Category Selection
- Phase 3E — Tags, Badges, Smart Filters & Search
- Phase 3F — Drag-and-Drop Project Ordering

Phase 3 is complete. Phase 4 Case Studies may build on this locked Portfolio Engine foundation without changing locked Phase 3 contracts except for verified bug/security fixes.

## Active module

**Phase 4 — Dynamic Case Studies**

Status: **LOCKED / DONE**

Purpose:
Turn Portfolio Engine projects into full reusable case-study pages while preserving the locked Phase 3 project, media, homepage, metadata and ordering contracts.

Scope:
- Keep Phase 2A–2K and Phase 3A–3F locked
- Add migration `012_case_study_engine.sql`
- Add idempotent content seed `013_phase4_case_study_seed.sql` for the required MIUW + Portfolio Website case studies
- Add one `portfolio_case_studies` row per Portfolio Engine project
- RLS-first: allowlisted authenticated admin manages all case studies
- Anonymous visitors can read only published case studies whose parent project is also published + public
- Keep private/draft case studies admin-only
- Reuse Phase 3B optimized Media Library images for admin-selected case-study media; seeded demo records may reference existing optimized repository assets; source originals are never used
- Add dedicated 04 Case Studies admin manager
- Admin can set hero kicker, headline, lead, hero image and up to 8 summary facts
- Admin can build up to 20 reusable sections
- Supported section types: Text, Image, Gallery, Feature Cards
- Sections can be reordered with simple Move Up / Move Down controls
- Image and Gallery sections select optimized images from Media Library
- Feature Cards accept reusable title + description items
- Add related project and optional CTA label/link
- Case study Save Draft / Publish / Unpublish workflow
- Add reusable public route `project.html?slug=<project-slug>`
- Dynamic case study page reuses the existing premium case-study visual language
- Homepage and Project Explorer automatically link to the dynamic page when a published case study exists
- Existing static `ssfc.html` and `biporjoy.html` remain untouched as safe fallbacks during Phase 4
- Build a private MIUW ERP screenshot-based case study using demo-safe data
- Build a Portfolio Website case study with selected screenshots and live link
- Keep production `main` untouched

Acceptance checklist:
- [x] Migration 012 applies successfully *(owner-confirmed in Supabase)*
- [x] 04 Case Studies navigation opens the manager *(owner-verified)*
- [x] Projects and Media Library load *(owner-verified)*
- [x] Existing case study loads when project is selected *(implementation-verified; owner approved Phase 4 lock)*
- [x] Hero fields save and reload *(owner-tested case study flow)*
- [x] Hero Media Library image saves and reloads *(owner-tested case study flow)*
- [x] Summary facts save and reload *(owner-tested case study flow)*
- [x] Text section add/edit/save works *(owner-tested; reorder/remove implementation-verified)*
- [x] Image section add/edit/remove/reorder works *(static verified)*
- [x] Gallery section add/edit/remove/reorder works *(static verified)*
- [x] Feature Cards section add/edit/remove/reorder works *(static verified)*
- [x] Admin-selected section media uses optimized Phase 3B display images; seeded demo media uses existing optimized repository assets only *(re-audit verified)*
- [x] Save Draft workflow implemented *(implementation-verified)*
- [x] Publish exposes only published + public parent projects *(RLS/static verified)*
- [x] Unpublish hides the case study from anonymous visitors *(RLS/static verified)*
- [x] Private parent project case study remains admin-only *(owner-observed + RLS verified)*
- [x] `project.html?slug=...` renderer implemented *(static verified)*
- [x] Case-study lightbox implemented *(static verified)*
- [x] Related project renders safely when public *(static verified)*
- [x] Optional CTA renders safely *(static verified)*
- [x] Homepage Portfolio Engine card opens dynamic case study when published *(static verified)*
- [x] Project Explorer card opens dynamic case study when published *(static verified)*
- [x] Existing static SSFC/Biporjoy fallbacks remain unchanged *(verified)*
- [x] MIUW ERP private demo-safe case study is created via migration 013 *(owner-confirmed seed run)*
- [x] Portfolio Website case study with live link is created via migration 013 *(owner-confirmed seed run)*
- [x] No Phase 4 production `main` deployment occurs

Owner approval: 2026-09-28

Phase 4 is locked. The reusable case-study schema, builder, public template, security rules and required seeded MIUW + Portfolio Website case studies are approved as the stable Phase 4 baseline.

Lock rule:
Freeze the Phase 4 reusable case-study schema, builder and public template. Future phases may consume these contracts but must not change them except for a verified bug/security fix.

## Phase 4 — COMPLETE / LOCKED

Completed and locked:
- Dynamic reusable case-study data model
- RLS-protected public/private publication rules
- 04 Case Studies admin builder
- Hero, facts, Text, Image, Gallery and Feature Cards sections
- Related project and safe optional CTA
- Reusable `project.html?slug=...` public template
- Homepage / Project Explorer dynamic case-study linking
- Private demo-safe MIUW ERP case study
- Public Portfolio Website case study with live link
- Existing static SSFC / Biporjoy fallbacks preserved

Production `main` remains unchanged by Phase 4.

## Phase 5 — Business/System Features

Status: **ACTIVE · PHASE 5A–5G LOCKED · PHASE 5H OWNER TEST PENDING**

Purpose:
Add the business-facing systems around the locked portfolio and case-study foundation without redesigning the approved Phase 2–4 presentation.

Locked sequence:
- **5A — Client Project Inquiry Form**
- **5B — Analytics Dashboard**
- **5C — Per-Project SEO Manager**
- **5D — Testimonials / Client Feedback**
- **5E — Multiple Resume / CV Manager**
- **5F — Availability Status Control**
- **5G — Custom CTA Manager**
- **5H — Branded 404 / Empty States / Maintenance Mode**

### Phase 5A — Client Project Inquiry Form

Status: **LOCKED / DONE**

Scope:
- Add migration `014_client_inquiry_system.sql`
- Add RLS-protected `portfolio_inquiries` inbox
- Anonymous visitors receive INSERT-only access to the allowed inquiry fields
- Anonymous visitors cannot read, update or delete inquiries
- Allowlisted authenticated admins can securely read/manage inquiries
- Public Contact section receives a compact project inquiry form
- Fields: Name, Email, Project Type, Budget, Timeline and Project Brief
- Explicit reply/storage consent is required
- Add a hidden honeypot and minimum-submit-time check as lightweight spam friction
- Add dedicated `05A Inquiries` Admin navigation
- Admin Inbox supports New / Read / Replied / Archived
- Opening a New inquiry marks it Read
- Admin can save private notes, update status and permanently delete an inquiry
- No service-role key
- No public inquiry data is exposed
- Phase 2 Contact CMS layout/content contract remains intact; the inquiry panel is an additive business feature
- Phase 3 and Phase 4 remain locked
- Production `main` remains untouched
- Owner production-preview Lighthouse re-test on 2026-09-30: Performance 72 · Accessibility 100 · FCP 1.9 s · LCP 3.8 s · CLS 0
- Owner keyboard-focus video confirmed visible focus progression through homepage interactive controls

Acceptance checklist:
- [x] Migration 014 applies successfully in Supabase *(owner-confirmed)*
- [x] Public inquiry form markup is implemented
- [x] Public submission module is implemented
- [x] Required field and email validation are implemented
- [x] Consent gate is implemented
- [x] Honeypot + minimum-submit-time friction is implemented
- [x] Anonymous INSERT-only database grant is defined
- [x] Anonymous SELECT/UPDATE/DELETE access is not granted
- [x] Admin allowlist RLS is defined
- [x] 05A Inquiries admin panel is implemented
- [x] New / Read / Replied / Archived workflow is implemented
- [x] Admin private notes are implemented
- [x] Admin permanent delete action is implemented
- [x] One localhost inquiry submission is owner-verified
- [x] Submitted inquiry appears in Admin Inbox
- [x] Status transition from New to Read is owner-verified; private note save remains implementation-verified
- [x] Phase 5A owner approval / lock

Owner approval: 2026-09-28

Phase 5A is locked. Public submission, secure Admin Inbox delivery, and the New → Read workflow were owner-verified end-to-end.

Lock rule:
Freeze the Phase 5A inquiry schema, public form contract, RLS permissions and Admin Inbox workflow. Later Phase 5 modules must not weaken inquiry RLS or expose private inquiry content. Only verified bug/security fixes may change this module.

## Phase 5A — COMPLETE / LOCKED

Completed and locked:
- Secure public inquiry submission
- Anonymous INSERT-only access
- Admin allowlist read/manage access
- Name / Email / Project Type / Budget / Timeline / Brief fields
- Consent requirement
- Honeypot + minimum-submit-time friction
- Admin Inquiry Inbox
- New / Read / Replied / Archived workflow
- Private admin notes
- Permanent delete action
- End-to-end localhost submission verified
- Production `main` remains untouched

### Phase 5B — Analytics Dashboard

Status: **LOCKED / DONE**

Scope:
- Migration `015_analytics_dashboard.sql`
- Private first-party `portfolio_analytics_events` store
- Track only `page_view`, `project_view` and `contact_click`
- Random browser-session UUID only; no IP address, user agent, fingerprint, query-string data, inquiry content, email or other client personal data
- Respect browser Do Not Track
- Anonymous visitors have no direct analytics table read/write access
- Public events are accepted only through the validated `log_portfolio_analytics_event` RPC
- Allowlisted authenticated admins receive read-only analytics table access
- Homepage page views and direct contact/profile actions are instrumented
- Dynamic Portfolio Engine case-study pages track page/project views
- Existing static SSFC and Biporjoy case-study pages receive additive analytics instrumentation without changing their visual/content contracts
- Dedicated `05B Analytics` Admin module
- Last 7 / 30 / 90 day filters
- Visits, Page Views, Project Views and Contact Clicks totals
- Top Projects and Top Contact Actions rankings
- Dashboard query capped to the latest 5,000 events in the selected period
- Phase 3, Phase 4 and Phase 5A remain locked
- Production `main` remains untouched

Acceptance checklist:
- [x] Migration 015 applied successfully in Supabase *(owner-confirmed)*
- [x] Analytics event schema and indexes implemented
- [x] Anonymous direct table reads/writes blocked
- [x] Validated public analytics RPC implemented
- [x] Admin allowlist read policy implemented
- [x] No personal client/inquiry data included in analytics payload
- [x] Browser Do Not Track respected
- [x] Homepage page-view tracking implemented
- [x] Contact click tracking implemented *(static verified)*
- [x] Dynamic case-study project-view tracking implemented *(static verified)*
- [x] Static SSFC/Biporjoy project-view tracking implemented *(static verified)*
- [x] 05B Analytics admin navigation implemented
- [x] 7 / 30 / 90 day range filter implemented
- [x] Visits / Page Views / Project Views / Contact Clicks totals implemented
- [x] Top Projects and Top Contact Actions implemented
- [x] Localhost visit created analytics data *(owner-verified: Visits 1 / Page Views 1)*
- [x] Static/security audit passed
- [x] Phase 5B owner approval / lock

Owner approval: 2026-09-28

Phase 5B is locked. The privacy-first event store, validated public logger and Admin Analytics Dashboard are approved as the stable analytics baseline.

Lock rule:
Freeze the Phase 5B analytics schema, validated logger and Admin Dashboard behavior. Later phases must not add personal client data, restore anonymous direct table writes, or weaken analytics RLS except for a verified bug/security fix.

## Phase 5B — COMPLETE / LOCKED

Completed and locked:
- Privacy-first first-party analytics
- Validated public RPC event logging
- Admin-only analytics read access
- Visits / Page Views / Project Views / Contact Clicks
- Top Projects / Top Contact Actions
- 7 / 30 / 90 day views
- Owner-verified localhost page-view flow
- Production `main` remains untouched

### Phase 5C — Per-Project SEO Manager

Status: **LOCKED / DONE**

Scope:
- Add migration `016_project_seo_manager.sql`
- Add one-to-one `portfolio_project_seo` metadata rows keyed by existing Portfolio Engine projects
- Reuse the locked `portfolio_projects.slug` and `cover_image_alt` fields instead of creating duplicate identity/accessibility fields
- Store optional SEO title, meta description, social preview image URL and social image alt text
- Public SEO rows are readable only when the parent project is `public` and `is_published = true`
- Anonymous visitors receive no SEO write access
- Allowlisted admins save slug + cover alt + SEO overrides atomically through `save_portfolio_project_seo`
- Add dedicated `05C SEO Manager` Admin module
- Admin project selector shows Public/Private and Live/Draft state
- Blank SEO overrides safely fall back to the existing project/case-study title, summary and hero/cover image
- Dynamic `project.html?slug=...` updates document title, meta description, canonical URL, Open Graph and Twitter metadata
- Existing Phase 4 case-study rendering remains the fallback when Phase 5C data is missing/unavailable
- Production `main` remains untouched

Acceptance checklist:
- [x] Migration 016 applies successfully in Supabase *(owner-confirmed)*
- [x] SEO table schema and constraints implemented
- [x] Public SEO read policy limited to public + published parent projects
- [x] Anonymous SEO writes blocked
- [x] Admin-only atomic save RPC implemented
- [x] Existing Project Manager slug + cover alt reused
- [x] 05C SEO Manager navigation/UI implemented
- [x] SEO title / description / social image / social alt controls implemented
- [x] Search/social preview card implemented in Admin
- [x] Dynamic case-study metadata integration implemented
- [x] Safe fallback to existing Phase 4 metadata implemented
- [x] Static/security/syntax audit passed
- [x] Owner saves one project's SEO settings *(Portfolio Website)*
- [x] Saved SEO values reload in Admin
- [x] Dynamic public Portfolio Website case-study page loads successfully after SEO integration
- [x] Runtime title/meta/OG/Twitter application is code-audit verified
- [x] Verified Phase 4 MIUW/Portfolio cover mapping bug fixed through migration 017
- [x] Verified dynamic case-study hidden-state error flicker fixed
- [x] Phase 5C owner approval / lock

Architecture note:
The current site is static GitHub Pages with client-side Supabase rendering. Phase 5C updates runtime Open Graph/Twitter tags, but some social-unfurl crawlers do not execute JavaScript. Guaranteed platform-specific unfurls would require a later prerender/edge/static-page generation layer; this limitation does not expose private SEO rows or change the locked public case-study fallback.

Lock rule:
Do not lock Phase 5C until migration 016 is applied and one minimal save/reload/public-metadata flow is owner-verified. Later phases must preserve the parent-project publication gate and admin-only write path.

### Phase 5D — Testimonials / Client Feedback

Status: **LOCKED / DONE**

Scope:
- Add migration `018_client_feedback_testimonials.sql`
- Add RLS-protected `portfolio_feedback` store
- Anonymous visitors cannot directly insert/update/delete feedback rows
- Public feedback submission uses validated `submit_portfolio_feedback` RPC
- New public submissions always start `pending`; nothing auto-publishes
- Lightweight honeypot, minimum-submit-time and duplicate friction are included
- Client email is retained for Admin verification but is never exposed through the anonymous public column grant
- Anonymous reads expose only approved + consented testimonials through RLS
- Admin can create/edit feedback, review Pending / Approved / Hidden status, set public order and permanently delete
- Approved testimonials render inside the existing Contact section so the locked Phase 2K homepage section-order contract remains unchanged
- Public feedback form records explicit consent before a submission can become eligible for public display
- No service-role key is exposed
- Phase 5A–5C and Phase 2–4 locked behavior remains unchanged
- Production `main` remains untouched

Acceptance checklist:
- [x] Migration 018 applies successfully in Supabase *(owner-confirmed)*
- [x] Feedback schema, constraints and indexes implemented
- [x] Anonymous direct table writes blocked
- [x] Validated anonymous submission RPC implemented
- [x] Public submissions forced to Pending
- [x] Public read policy limited to Approved + display-consented feedback
- [x] Client email excluded from anonymous SELECT grant
- [x] Admin allowlist RLS implemented
- [x] Public feedback form implemented
- [x] Honeypot / timing / duplicate friction implemented
- [x] Approved testimonial renderer implemented
- [x] 05D Testimonials Admin module implemented
- [x] Pending / Approved / Hidden workflow implemented
- [x] Admin create/edit/order/delete workflow implemented
- [x] Phase 2K top-level section ordering left unchanged
- [x] One localhost public feedback submission reaches Admin as Pending *(owner-verified: Test Client)*
- [x] Admin approval makes that feedback visible publicly *(owner-verified on homepage Contact section)*
- [x] Temporary Test Client feedback deleted after verification *(owner-confirmed cleanup)*
- [x] Phase 5D owner approval / lock

Owner approval: 2026-09-28

Phase 5D is locked. Moderated client feedback intake, Admin review, explicit display consent, private-email protection and approved public testimonials are accepted as the stable baseline.

Lock rule:
Freeze the Phase 5D feedback schema, moderation workflow, public consent gate and private-email protections. Later phases must not auto-publish feedback, expose client email publicly, or weaken Admin-only moderation except for a verified bug/security fix.

### Phase 5E — Multiple Resume / CV Manager

Status: **LOCKED / DONE · FINAL RE-AUDIT PASS**

Scope:
- Add migration `019_multiple_cv_manager.sql`
- Add private Admin-only `portfolio_cvs` store
- Anonymous/public roles receive no CV table privileges and no public RLS policy
- Allowlisted authenticated Admin receives CRUD access only through the existing Admin security model
- Support multiple named CV versions for different target roles
- Add migration `020_cv_category_library.sql` and private role-category key on each CV
- Add one-click CV Category Library for Graphic Design, Video Editing, Event Management, Computer Operator/Admin, Hotel/Waiter/Service, Customer Service/Travel, E-commerce/Product Listing, Shop/Operations and General/Full CV
- Add migration `021_private_cv_master_profile.sql` for one Admin-only A–Z CV source profile
- Master Profile stores professional source data once; role tags determine which experience/skills/certifications enter each category CV
- Category click opens an existing matching CV immediately; when no version exists and Master Profile is ready, it auto-builds and saves a new relevant CV
- Existing category CVs can be intentionally refreshed from the latest Master Profile data
- CV fields include private version name, target role, category, template, library order, profile/contact details, professional summary, skills, languages and courses/certifications
- Support multiple reorderable Experience entries
- Support multiple reorderable Education entries
- Support Modern, Compact and Europass-style presentation variants
- Support duplicate CV version workflow for fast role-specific customization
- Add live Admin A4 preview
- Add browser Print / Save PDF workflow
- Modern CV V4 polish: compact hero, separated Tools/Core Skills, cleaner professional links, tighter education, role-specific content caps and one-page print target
- Adaptive A4 Auto-Fill engine: Spacious / Balanced / Compact density modes automatically resize typography and distribute sections based on CV content, then fall back to tighter density if the rendered sheet would overflow
- CV content is not added to the public homepage, public navigation, public API or anonymous Supabase grants
- Phase 5A–5D and Phase 2–4 locked behavior remains unchanged
- Production `main` remains untouched

Acceptance checklist:
- [x] Migration 019 applies successfully in Supabase *(owner-verified 2026-09-28)*
- [x] Migration 020 applies successfully in Supabase *(owner-verified 2026-09-28)*
- [x] Migration 021 applies successfully in Supabase *(owner-verified 2026-09-29)*
- [x] Private CV schema and constraints implemented
- [x] Anonymous/public CV access blocked
- [x] Admin allowlist RLS implemented
- [x] 05E CV Manager Admin navigation implemented
- [x] Multiple named CV versions implemented
- [x] Role-based CV Category Library implemented
- [x] Category-aware create/load/save/duplicate workflow implemented
- [x] Private Admin-only Master Profile schema implemented
- [x] Master Profile category filtering engine implemented
- [x] One-click missing-category CV auto-build/save implemented
- [x] Existing CV refresh-from-Master workflow implemented
- [x] Modern / Compact / Europass-style template selection implemented
- [x] Profile/contact + summary fields implemented
- [x] Skills / Languages / Certifications fields implemented
- [x] Multiple Experience entries implemented
- [x] Multiple Education entries implemented
- [x] Experience/Education reordering implemented
- [x] Duplicate CV version workflow implemented
- [x] Private A4 preview implemented
- [x] Modern CV V4 role-focused layout polish implemented
- [x] Tools/Core Skills split + clean professional links implemented
- [x] Role-specific content caps implemented for one-page targeting
- [x] Adaptive A4 Auto-Fill density engine implemented
- [x] Live edit → auto re-balance workflow implemented
- [x] Overflow fallback from Spacious → Balanced → Compact implemented
- [x] Print / Save PDF workflow implemented
- [x] No Phase 5E public-site exposure added
- [x] Owner creates and saves one CV version *(Graphic Designer CV)*
- [x] Saved CV reloads correctly
- [x] Duplicate creates a second independent CV version
- [x] Category Library loads after migration 020 and existing Graphic Designer CV appears under Graphic Design *(owner-verified)*
- [x] Hotel / Waiter / Service category can be selected and prepares its role-specific identity *(owner-verified)*
- [x] Master Profile loads after migration 021 *(confirmed by role-specific CV generation)*
- [x] Prior A–Z professional data is loaded privately into Master Profile *(owner-verified seed result: 13 experiences, 31 skills, 3 education entries)*
- [x] Event Management category filtering/auto-build path implemented and final static-audited *(owner accepted current baseline without a separate runtime smoke test)*
- [x] Hotel / Waiter / Service category filtering/auto-build path implemented; category selection was owner-verified and final filtering path static-audited
- [x] Print / Save PDF workflow produced one-page A4 CV output; latest Smart Fill V7 baseline accepted by owner without an additional screenshot cycle
- [x] Phase 5E owner approval / lock *(2026-09-29)*

Owner approval: 2026-09-29

Phase 5E is locked. The accepted baseline includes the private Master Profile, role-based CV Category Library, category filtering/auto-build workflow, editable role-specific CV versions, Modern/Compact/Europass-style templates, live A4 preview, Print / Save PDF, and the current adaptive Smart Fill V7 layout behavior.

Lock rule:
Freeze the Phase 5E CV schema, migrations 019–021, Admin-only privacy model, Master Profile architecture, category keys/filtering workflow, CV CRUD/duplicate/print behavior, and accepted Smart Fill V7 presentation baseline. Later phases must not expose CV/Master Profile data publicly, weaken RLS, or redesign/change Phase 5E behavior except for a verified bug/security fix or explicit owner request to unlock Phase 5E.

### Phase 5F — Availability Status Control

Status: **LOCKED / DONE · FINAL RE-AUDIT PASS**

Scope:
- Add migration `022_availability_status_control.sql`
- Add singleton `portfolio_availability` status store
- Public/anonymous users can read only the live availability fields needed by the portfolio
- Only allowlisted authenticated Admin can update the live status
- Add four status modes: Available, Limited, Busy and Unavailable
- Add customizable public status text
- Add 05F Availability Admin module with presets, live preview, refresh and save
- Synchronize one live availability message across the public Hero and Contact status labels
- Change Hero/Contact indicator color by status: green, amber, red or gray
- Keep existing Hero CMS and Contact CMS copy as safe fallback when Phase 5F is unavailable
- Phase 5F availability takes precedence over the older Hero/Contact availability text fields after it loads
- Phase 5A–5E locked behavior remains unchanged
- Production `main` remains untouched

Acceptance checklist:
- [x] Migration 022 applies successfully in Supabase *(owner-verified 2026-09-29)*
- [x] Availability schema + singleton constraint implemented
- [x] Public read is limited to availability status fields
- [x] Admin allowlist update policy implemented
- [x] 05F Availability Admin navigation implemented
- [x] Available / Limited / Busy / Unavailable presets implemented
- [x] Custom public text implemented
- [x] Admin live preview implemented
- [x] Public Hero synchronization implemented
- [x] Public Contact synchronization implemented
- [x] Status indicator color mapping implemented
- [x] Existing Hero/Contact CMS fallback preserved
- [x] Phase 5E CV Manager remains locked
- [x] Owner loads 05F after migration 022
- [x] Owner saves multiple non-default statuses *(Limited, Busy, Unavailable)*
- [x] Public Hero shows the saved status text/color *(Limited, Busy and Unavailable owner-verified)*
- [x] Public Contact synchronization path implemented and final static-audited *(owner accepted lock without a separate Contact screenshot)*
- [x] Owner accepted the current live availability state at lock time; status remains editable after lock
- [x] Phase 5F owner approval / lock *(2026-09-29)*

Owner approval: 2026-09-29

Phase 5F is locked. The accepted baseline includes the singleton availability source, Available / Limited / Busy / Unavailable presets, editable live status text, Admin preview/save workflow, Hero synchronization, Contact synchronization implementation, status-color mapping, and the existing Hero/Contact CMS fallback behavior.

Lock rule:
Freeze the Phase 5F schema/migration 022, singleton availability architecture, public-read/admin-write security boundary, status keys, Hero/Contact synchronization behavior, fallback behavior and accepted Admin UI. The availability value itself remains an operational setting and can still be changed at any time from the locked module. Later phases must not redesign or weaken Phase 5F except for a verified bug/security fix or explicit owner request to unlock it.

### Phase 5G — Custom CTA Manager

Status: **LOCKED / DONE · FINAL RE-AUDIT PASS**

Scope:
- Add migration `023_custom_cta_manager.sql`
- Add singleton `portfolio_custom_cta` store
- Public/anonymous users can read only the CTA fields needed to render the public block
- Only allowlisted authenticated Admin can update CTA content/settings
- Add on/off visibility control
- Add three presentation variants: Accent, Dark and Outline
- Add editable eyebrow, title and description
- Add primary button label/link/new-tab control
- Add optional secondary button label/link/new-tab control
- Add three Admin presets: Start a Project, Creative Support and Short Brief
- Add live Admin CTA preview
- Add one independent public CTA block immediately before the locked Contact section
- Keep Hero CMS, Contact CMS, Availability Status and Section Order behavior unchanged
- CTA is hidden by default until the owner intentionally enables it
- Public renderer rejects unsafe button URLs and keeps the CTA hidden if the primary action is invalid
- Phase 5A–5F locked behavior remains unchanged
- Production `main` remains untouched

Acceptance checklist:
- [x] Migration 023 applies successfully in Supabase *(owner-verified 2026-09-29)*
- [x] CTA schema + singleton constraint implemented
- [x] Public read limited to CTA rendering fields
- [x] Admin allowlist update policy implemented
- [x] Unsafe URL checks implemented in DB constraints + Admin + public renderer
- [x] 05G Custom CTA Admin navigation implemented
- [x] CTA on/off control implemented
- [x] Accent / Dark / Outline styles implemented
- [x] Custom eyebrow / title / description implemented
- [x] Primary action controls implemented
- [x] Optional secondary action controls implemented
- [x] CTA presets implemented
- [x] Admin live preview implemented
- [x] Public CTA block implemented before Contact
- [x] Responsive public CTA styling implemented
- [x] Existing Hero / Contact / Availability behavior preserved
- [x] Phase 5F remains locked
- [x] Owner loads 05G after migration 023
- [x] Owner enables CTA and saves the Start a Project version
- [x] Public CTA appears immediately before Contact with matching content/buttons *(owner-verified after Section Order placement fix)*
- [x] Owner tests CTA off → public block hides
- [x] Owner accepts the current live CTA state at lock time; visibility/content remain editable operational settings
- [x] Phase 5G owner approval / lock *(2026-09-29)*

Owner approval: 2026-09-29

Phase 5G is locked. The accepted baseline includes the singleton Custom CTA source, on/off visibility, Accent/Dark/Outline styles, editable CTA copy, primary/secondary button controls, safe-link validation, Admin presets/live preview, responsive public rendering, and the Section Order-safe placement immediately before Contact.

Lock rule:
Freeze the Phase 5G schema/migration 023, singleton CTA architecture, public-read/admin-write security boundary, safe-link validation, CTA style keys, independent public block, and automatic placement immediately before Contact. CTA content, visibility, style and button values remain operational settings and may still be changed from the locked module. Later phases must not redesign or weaken Phase 5G except for a verified bug/security fix or explicit owner request to unlock it.

### Phase 5H — Branded 404 / Empty States / Maintenance Mode

Status: **LOCKED / DONE · FINAL STATIC/SECURITY + OWNER TEST PASS**

Scope:
- Add migration `024_branded_system_states.sql`
- Add singleton `portfolio_system_state` maintenance configuration
- Public/anonymous users can read only the fields required to render maintenance state
- Only allowlisted authenticated Admin can update maintenance settings
- Maintenance mode is off by default
- Public system-state renderer fails open: if state loading fails, the normal portfolio remains accessible
- Reject unsafe maintenance button URLs in database constraints and browser validation
- Add `05H System States` Admin navigation and manager
- Add editable maintenance eyebrow, title, message, button label and button link
- Add live Admin maintenance preview and explicit on/off control
- Add dedicated branded `404.html`
- Add branded Project Explorer no-results state
- Add branded dynamic case-study unavailable state without changing the locked case-study data contract
- Apply maintenance mode across homepage, dynamic case-study page, SSFC and Biporjoy public pages
- Include branded 404 in Vite build input
- Keep Phase 5A–5G behavior unchanged
- Production `main` remains untouched

Acceptance checklist:
- [x] Migration 024 implementation complete
- [x] Singleton system-state schema + `id = 1` guard implemented
- [x] Public read limited to maintenance rendering fields
- [x] Admin allowlist update policy implemented
- [x] Anonymous INSERT / UPDATE / DELETE grants are not present
- [x] Unsafe URL checks implemented in DB + Admin + public renderer
- [x] 05H System States Admin navigation implemented
- [x] Maintenance on/off control implemented
- [x] Editable maintenance copy/action implemented
- [x] Admin live maintenance preview implemented
- [x] Branded 404 page implemented
- [x] Branded Project Explorer no-results state implemented
- [x] Branded dynamic case-study unavailable state implemented
- [x] Public maintenance renderer is fail-open
- [x] Homepage / dynamic case / SSFC / Biporjoy integration implemented
- [x] Static JavaScript syntax audit passes for new Phase 5H modules and Admin integration
- [x] Admin HTML structure / unique Phase 5H IDs audit passes
- [x] Phase 5H CSS brace/structure audit passes
- [x] Phase 5A–5G source modules remain unchanged
- [x] Owner applies migration 024 in Supabase *(owner-verified 2026-09-29)*
- [x] Owner opens 05H System States and confirms default Maintenance OFF state loads *(owner-verified)*
- [x] Owner verifies branded 404 preview *(owner-verified)*
- [x] Owner enables Maintenance, saves, and verifies the public maintenance screen *(owner-verified)*
- [x] Owner disables Maintenance again and confirms the normal public site returns *(owner-verified)*
- [x] Owner verifies branded Project Explorer no-results state *(owner-verified)*
- [x] Phase 5H owner approval / lock *(2026-09-29)*

Owner approval: 2026-09-29

Phase 5H is locked. The accepted baseline includes the singleton maintenance state, Admin maintenance controls/live preview, branded 404, branded empty/unavailable states, public fail-open behavior, safe-link validation, and verified Maintenance ON → OFF recovery.

Lock rule:
Freeze the Phase 5H schema/migration 024, public-read/admin-write security boundary, fail-open behavior, safe-link validation and branded fallback contracts. Maintenance copy, button values and on/off state remain operational settings and may still be changed from the locked module. Later phases must not redesign or weaken Phase 5H except for a verified bug/security fix or explicit owner request to unlock it.

## Phase 5 completion

**Phase 5 — Business/System Features — COMPLETE / LOCKED**

Completed modules:
- Phase 5A — Client Inquiry
- Phase 5B — Analytics
- Phase 5C — SEO Manager
- Phase 5D — Testimonials / Client Feedback
- Phase 5E — Multiple Resume / CV Manager
- Phase 5F — Availability Status Control
- Phase 5G — Custom CTA Manager
- Phase 5H — Branded 404 / Empty States / Maintenance Mode

All Phase 5 modules are now owner-approved and locked on `phase02-polish`. Production `main` remains untouched.

## Phase 6 — Motion & Final Polish

Status: **COMPLETE / LOCKED · PHASE 6A–6E LOCKED**

Phase 6 sequence:
- **6A — Homepage Motion Foundation**
- **6B — Case Study / System Page Motion Polish**
- **6C — Responsive & Mobile Final Audit**
- **6D — Accessibility & Performance Final Audit**
- **6E — Release Readiness / Live Deployment Checkpoint**

Build and lock one Phase 6 module at a time. Phase 1–5H remain locked.

### Phase 6A — Homepage Motion Foundation

Status: **LOCKED / DONE · STATIC/SAFETY + OWNER VISUAL TEST PASS**

Purpose:
Add subtle premium motion to the existing homepage without redesigning, reordering or changing any locked CMS content contract.

Scope:
- Add standalone `motion.css`
- Add standalone `public-motion.js`
- Add a subtle staged Hero entrance
- Add one-time viewport reveal for homepage sections below the Hero
- Add light opacity staggering for existing project/service/tool/experience/contact cards
- Preserve all existing hover interactions instead of overriding card transforms
- Respect `prefers-reduced-motion: reduce`
- Use progressive enhancement: unsupported/reduced-motion browsers keep normal visible content
- No new database table, migration, external dependency, analytics event or public data access
- Existing Phase 1–5H source modules remain locked
- Production `main` remains untouched

Acceptance checklist:
- [x] Motion stylesheet created
- [x] Motion controller created
- [x] Homepage integration added
- [x] Hero staged entrance implemented
- [x] Section viewport reveal implemented
- [x] Card opacity stagger implemented without taking over card hover transforms
- [x] Reduced-motion bypass implemented
- [x] IntersectionObserver fallback leaves the normal site visible
- [x] Final static/safety audit passes: JS syntax, CSS structure, reduced-motion fallback, no network/storage access, homepage refs exactly once, card hover transforms preserved, and `main` untouched
- [x] Owner verifies Hero load motion on localhost *(owner-verified 2026-09-29)*
- [x] Owner verifies section reveal while scrolling *(owner-verified 2026-09-29)*
- [x] Owner confirms motion feels subtle/premium rather than distracting *(owner-approved 2026-09-29)*
- [x] Phase 6A owner approval / lock *(2026-09-29)*

Owner approval: 2026-09-29

Lock rule:
Phase 6A is locked. Freeze the accepted homepage motion timing/behavior baseline, reduced-motion fallback and progressive-enhancement approach. Later Phase 6 modules may extend motion to other public pages but must not redesign locked homepage sections or alter Phase 6A behavior except for a verified bug/accessibility issue or explicit owner request to unlock it.

### Phase 6B — Case Study / System Page Motion Polish

Status: **LOCKED / DONE · STATIC/SAFETY + OWNER VISUAL TEST PASS**

Purpose:
Extend the accepted Phase 6 motion language to case-study and branded system pages without redesigning or changing any locked CMS/data contract.

Scope:
- Add standalone `case-motion.css`
- Add standalone `public-case-motion.js`
- Add subtle staged case-study Hero entrance
- Add one-time scroll reveal for summary/content/next-project/footer sections
- Add light opacity staggering for role cards, artwork buttons, format blocks and dynamic gallery items
- Support dynamically rendered case-study sections through a MutationObserver registration pass
- Add subtle branded 404 entrance motion
- Add subtle maintenance-card entrance motion wherever the system-state screen is rendered
- Respect `prefers-reduced-motion: reduce`
- Use progressive enhancement: unsupported/reduced-motion browsers keep normal visible content
- No new database table, migration, dependency, analytics event or public data access
- Keep Phase 1–6A behavior/content contracts unchanged
- Production `main` remains untouched

Acceptance checklist:
- [x] Case/system motion stylesheet created
- [x] Case-study motion controller created
- [x] Dynamic project case page integration added
- [x] SSFC static case-study integration added
- [x] Biporjoy static case-study integration added
- [x] Branded 404 motion integration added
- [x] Maintenance-card motion CSS integrated across public pages
- [x] Dynamic section registration implemented
- [x] Reduced-motion bypass implemented
- [x] IntersectionObserver fallback leaves normal content visible
- [x] Final static/safety audit passes: JS syntax, CSS structure, reduced-motion/progressive fallbacks, no network/storage access, refs exactly once, dynamic registration safety, hover transforms preserved, homepage normal scope unaffected, and `main` untouched
- [x] Owner verifies one static case-study Hero + scroll motion *(SSFC owner-verified 2026-09-29)*
- [x] Owner verifies dynamic project case-study motion *(Portfolio Website owner-verified 2026-09-29)*
- [x] Owner verifies branded 404 entrance *(owner-accepted 2026-09-29)*
- [x] Owner confirms motion feels consistent with Phase 6A *(owner-approved 2026-09-29)*
- [x] Phase 6B owner approval / lock *(2026-09-29)*

Owner approval: 2026-09-29

Lock rule:
Phase 6B is locked. Freeze the accepted case-study/system-page motion baseline, reduced-motion fallback, dynamic-section registration behavior and branded system-page entrance behavior. Later Phase 6 modules may fix verified responsive/accessibility/performance issues without redesigning locked content or altering Phase 6B behavior except for a verified bug or explicit owner request to unlock it.

### Phase 6C — Responsive & Mobile Final Audit

Status: **LOCKED / DONE · STATIC RESPONSIVE + OWNER MOBILE TEST PASS**

Purpose:
Run the final responsive/mobile verification across the locked portfolio, case-study, system-state and Admin surfaces without redesigning approved modules.

Scope:
- Audit viewport metadata across homepage, dynamic case study, SSFC, Biporjoy, branded 404 and Admin
- Audit homepage mobile navigation and major section stacking
- Audit Real Life Projects and Project Explorer narrow layouts
- Audit project-detail dialog narrow viewport behavior
- Audit static and dynamic case-study layout stacking
- Audit branded system-state mobile breakpoint
- Audit Admin mobile shell/off-canvas navigation and narrow editor breakpoints
- Check for hard fixed CSS widths larger than 760px that could force horizontal overflow
- Make targeted responsive fixes only when a verified issue is found
- Keep Phase 1–6B content/design contracts locked
- Production `main` remains untouched

Static audit result:
- All audited HTML surfaces include `width=device-width` viewport metadata
- Homepage mobile navigation and one-column project/search layouts are present
- Project-detail dialog uses narrow viewport constraints
- Case-study Hero, summary and dynamic gallery stack at mobile breakpoints
- Branded system-state mobile breakpoint is present
- Admin responsive shell includes mobile menu and narrow layout breakpoints
- No exact fixed `width: Npx` declaration above 760px was found in the audited public/Admin CSS
- No responsive code patch was required by static inspection before owner visual testing
- Owner mobile screenshot later exposed a real CSS cascade issue: late scoped desktop navigation rules overrode the generic mobile hide rule at <=900px
- Targeted fix now force-hides desktop nav/CTA and force-shows the hamburger for both homepage and case-study pages at <=900px
- Public page stylesheet query strings were bumped after the owner SSFC test showed the case-study page could retain the pre-fix cached CSS

Acceptance checklist:
- [x] Viewport metadata audit passes
- [x] Homepage mobile breakpoint audit passes
- [x] Project Explorer/dialog responsive audit passes
- [x] Static/dynamic case-study responsive audit passes
- [x] Branded system-state responsive audit passes
- [x] Admin responsive shell audit passes
- [x] Fixed-width horizontal-overflow static scan passes
- [x] Production `main` remains untouched
- [x] Owner verifies homepage at mobile width *(owner-verified 2026-09-29)*
- [x] Owner verifies case-study at mobile width *(SSFC owner-verified 2026-09-29)*
- [x] Owner verifies Admin dashboard/mobile menu at mobile width *(owner-verified 2026-09-29)*
- [x] Owner verifies branded 404 at mobile width *(owner-verified 2026-09-29)*
- [x] Any owner-observed responsive issue is fixed and re-tested *(mobile nav overlap + stale public stylesheet cache fixed and owner re-tested 2026-09-29)*
- [x] Phase 6C owner approval / lock *(2026-09-29)*

Owner approval: 2026-09-29

Lock rule:
Phase 6C is locked. Freeze the accepted responsive/mobile baseline, including the <=900px public navigation fix and public stylesheet cache-bust baseline. Later phases may fix verified accessibility/performance/release issues without redesigning locked layouts or changing Phase 6C responsive behavior except for a verified bug or explicit owner request to unlock it.

### Phase 6D — Accessibility & Performance Final Audit

Status: **LOCKED / DONE · STATIC + OWNER RUNTIME TEST PASS**

Purpose:
Run the final accessibility and performance pass across the locked public portfolio, case-study, branded system-state and Admin surfaces without redesigning approved content.

Targeted fixes completed:
- Added explicit `type="button"` to public buttons that previously relied on browser defaults
- Added keyboard skip links to static/dynamic case-study pages
- Added visible keyboard focus baselines for case-study, branded system-state and Admin surfaces
- Added semantic live/status roles to the dynamic case-study loading/error states
- Added accessible labels to compact social-icon links on case-study footers
- Combined the homepage Google Fonts request into one stylesheet request
- Bumped public/Admin stylesheet cache versions so accessibility fixes are not hidden by stale CSS

Static accessibility audit result:
- Page language + responsive viewport metadata present
- No duplicate IDs found in audited public/Admin markup
- All audited image elements include `alt`
- All audited buttons now have explicit `type`
- External `target="_blank"` links include `rel`
- Homepage and case-study skip-link coverage present
- Public, system-state and Admin keyboard focus styles present
- Existing reduced-motion support remains intact
- Dynamic case loading uses `role="status"` + polite live announcement
- Dynamic case error state uses `role="alert"`
- Compact case-study social links expose descriptive accessible labels

Static performance audit result:
- Homepage now uses one Google Fonts stylesheet request with `display=swap`
- Homepage Hero is preloaded and marked high priority
- Homepage non-Hero static images are lazy-loaded
- Static SSFC/Biporjoy case Hero images are high priority and below-fold images are lazy-loaded
- Dynamic case-study Hero keeps high fetch priority
- No inline base64 image payloads were found in the audited homepage
- Runtime public JavaScript remains split by feature/page rather than one monolithic bundle
- Largest statically referenced homepage image is the ~47 KB Hero image; the single CSS background asset is ~85 KB
- Production `main` remains untouched

Acceptance checklist:
- [x] Accessibility markup audit passes
- [x] Duplicate-ID audit passes
- [x] Image alt audit passes
- [x] Explicit button-type audit passes
- [x] External-link rel audit passes
- [x] Keyboard skip-link/focus-visible baseline implemented
- [x] Reduced-motion baseline preserved
- [x] Dynamic loading/error semantics improved
- [x] Case-study compact social links labelled
- [x] Homepage font request consolidated
- [x] Hero priority / below-fold lazy-load audit passes
- [x] CSS structure + public JS syntax audit passes
- [x] Phase 1–6C contracts remain intact
- [x] Production `main` remains untouched
- [x] Owner runs initial homepage Lighthouse check *(Mobile: Performance 60 · Accessibility 96; image-delivery issue identified 2026-09-29)*
- [x] Owner runs one-click live CMS image optimizer from Media Workflow and re-tests Lighthouse *(8 live images optimized · ~10.65 MB saved; production-preview Mobile Lighthouse: Performance 72 · Accessibility 100)*
- [x] Owner keyboard-tabs through homepage top navigation/CTA and confirms visible focus
- [x] Any owner-observed accessibility/performance issue is fixed and re-tested *(Creative Services number contrast corrected; Accessibility improved 96 → 100)*
- [x] Phase 6D owner approval / lock *(2026-09-30)*

Owner approval: 2026-09-30

Lock rule:
Phase 6D is locked. Freeze the accepted accessibility/performance baseline, including the verified keyboard focus behavior, Accessibility 100 result and the approved image-optimization path. Later work may fix verified release/security bugs without redesigning locked Phase 6D behavior unless the owner explicitly unlocks it.


### Phase 6E — Release Readiness / Live Deployment Checkpoint

Status: **LOCKED / DONE · RELEASE READINESS + OWNER SMOKE TEST PASS**

Purpose:
Verify that the fully locked portfolio is ready for release without touching production `main`. Phase 6E is a release-readiness checkpoint only; deployment happens only after the owner explicitly says `live koro`.

Scope:
- Re-audit the final `phase02-polish` branch for release blockers
- Verify production build succeeds from a clean source state
- Verify public routes, 404/system-state behavior, CMS/Admin entry point and critical assets are present
- Check for accidental development-only references, broken local-only URLs, merge markers and obvious release artifacts
- Confirm no secret/service-role credential is exposed in tracked frontend files
- Preserve all locked Phase 1–6D behavior
- Keep production `main` untouched until explicit owner deployment approval

Static release audit result:
- Public release entry points are present: homepage, branded 404, dynamic project page, SSFC, Biporjoy and Admin
- Audited local HTML asset/script/style references resolve to tracked branch files
- Public runtime JavaScript audit passes; Admin release modules pass syntax validation including top-level-await-compatible Admin bootstrap validation
- Core public/Admin CSS brace/conflict-marker audit passes
- No tracked `.env`, private-key or certificate file was found in the release tree
- Browser config contains only the intended Supabase publishable client key; no service-role secret is exposed
- `robots.txt` and `sitemap.xml` point at `https://xehedihasansawon.github.io/`
- Vite release config uses relative `base: './'`; Phase 6E owner smoke test exposed that `ssfc.html`, `biporjoy.html` and `project.html` were missing from Rollup inputs, causing preview fallback to the homepage. The config was corrected to include all three public case-study/detail entry points.
- One development-only wording in the Admin Real Life Projects description was removed; historical text describing prior localhost verification remains documentation only and is not a runtime URL
- Branch remains ahead of `main` with `main` untouched
- Final Phase 6E release blocker review: PASS *(2026-09-30; branch ahead of `main`, behind by 0; production `main` still untouched)*
- Owner final production build verification: PASS *(2026-09-30)*

Acceptance checklist:
- [x] Final static release audit passes
- [x] Final production build passes *(owner re-verified 2026-09-30 after all Phase 6E fixes; clean Vite build ~2.23s, no release warnings shown)*
- Phase 6E rebuild exposed legacy malformed CSS comment separators; fixed 7 comment blocks and static CSS structure re-audited successfully
- Clean rebuild after those fixes includes `project.html`, `ssfc.html` and `biporjoy.html` in `dist/` with no CSS syntax warnings in the owner-provided build output
- Owner production-preview video then exposed broken CMS-referenced local assets (Project Explorer cover + Skills/Tools logos). Vite release config now copies the source `assets/` tree into `dist/assets/` so published CMS paths such as `assets/...` remain valid in production while static imports may still use hashed files.
- Owner clean rebuild after the asset-preservation fix: PASS *(2026-09-30 · ~2.10s; public project entry files present in `dist/`)*
- Remaining Vite non-module script warnings were resolved by marking homepage/case motion and interaction scripts as `type="module"`; static audit confirms every local release script on homepage/project/SSFC/Biporjoy is module-bundled.
- Static SSFC production-preview smoke re-test: PASS *(2026-09-30; case-study route, graphics and lower sections render correctly)*
- Dynamic Portfolio Website production-preview smoke test: PASS *(2026-09-30; CMS case-study data, hero, sections, CTA and footer render correctly)*
- Admin production-preview smoke test: PASS *(2026-09-30; login screen and authenticated dashboard verified)*
- Branded 404 production-preview smoke test: PASS *(2026-09-30; direct `/404.html` renders the locked branded 404 correctly)*
- Maintenance mode release-state check: PASS *(2026-09-30; public portfolio operating normally)*
- [x] Public homepage smoke test passes *(owner-verified on production preview 2026-09-30)*
- [x] Dynamic/static project route smoke test passes *(static SSFC + dynamic `project.html?slug=portfolio-website` production-preview verified by owner on 2026-09-30)*
- [x] Admin login/dashboard smoke test passes *(owner-verified on production preview 2026-09-30; login + authenticated dashboard + Phase 6E status render correctly)*
- [x] Branded 404 smoke test passes *(owner-verified via direct `/404.html` production preview on 2026-09-30; Vite preview unknown-route fallback noted as local-server behavior only)*
- [x] Maintenance mode remains OFF for normal release *(owner-verified in Admin System States on 2026-09-30)*
- [x] No verified release blocker remains *(final clean build + homepage/static/dynamic/Admin/404/maintenance smoke tests pass on 2026-09-30)*
- [x] Production `main` remains untouched
- [x] Phase 6E owner approval / lock *(2026-09-30)*

Owner approval: 2026-09-30

Lock rule:
Phase 6E is locked. The `phase02-polish` branch is accepted as release-ready. This lock does not deploy the site. Production `main` must remain untouched until the owner explicitly says `live koro`.

Post-lock verified release bug fix *(2026-09-30)*:
- Owner confirmed the old live site briefly blanks the Hero image on refresh while the CMS-hosted Hero image downloads.
- `public-cms.js` now keeps the preloaded static Hero image visible and swaps to the CMS image only after the replacement image is fully loaded/decoded.
- Homepage CMS script cache version bumped so browsers receive the fix.
- Static JS audit passes and production `main` remains untouched.
- Post-lock Hero refresh fix production build: PASS *(owner-verified 2026-09-30 · clean Vite build ~1.82s)*
- Phase 6E lock remains valid because this is a verified release bug fix with no redesign or CMS contract change.
- Follow-up owner refresh test showed the static fallback photo itself flashing before the current CMS Hero. The homepage now boots from the last verified CMS Hero URL when available, keeps the image hidden until that current source is loaded, and uses the static fallback only if the CMS request actually fails. This removes the stale-photo flash on normal refresh.
- Direct-current-Hero refresh rebuild: PASS *(owner-verified 2026-09-30 · clean Vite build ~2.76s)*
- Post-lock Hero refresh stability rebuild: PASS *(owner-verified 2026-09-30 · clean Vite build ~2.10s)*
- Owner refresh video verification: PASS *(2026-09-30; stale/old Hero photo no longer flashes before the current CMS Hero)*
- Uploaded current Hero static fallback added *(2026-09-30)*: owner-provided portrait optimized to `assets/hero-current.webp` (~13 KB), preloaded in the homepage, and used as the immediate static Hero source. CMS Hero swaps only after its remote image is fully ready, preventing both the old-photo flash and the blank refresh gap for the current approved portrait.
- Current-Hero static fallback rebuild: PASS *(owner-verified 2026-09-30 · clean Vite build ~2.16s; optimized Hero emitted at ~12.98 KB)*

## Planned Phase 3 sequence

- **3A — Portfolio Data Foundation**
- **3B — Media / Image Workflow**
- **3C — Dynamic Project & Category Manager**
- **3D — Featured Homepage / Category Selection**
- **3E — Tags, Badges, Smart Filters & Search**
- **3F — Drag-and-Drop Project Ordering**

Build and lock one module at a time.

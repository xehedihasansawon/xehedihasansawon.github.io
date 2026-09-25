# Phase 2I — Contact CMS

Phase 2I connects only the approved Contact section to CMS draft/preview/publish.

No SQL seed is required. The first authenticated **Save draft** safely creates `homepage.contact` if it does not exist.

## Test flow

1. `git pull origin phase02-polish`
2. Open `http://localhost:5173/admin/`
3. Open **Contact**
4. Confirm the current CTA, WhatsApp, Email, phone and social/profile links load
5. Click **Save draft**
6. Preview the draft
7. Click **Publish Contact**
8. Refresh localhost homepage and verify the Contact section
9. Test WhatsApp, email copy, phone, Facebook, Instagram, LinkedIn, GitHub and Behance
10. Confirm the Contact layout and Footer remain unchanged

The future client inquiry form is intentionally outside Phase 2I.

Production `main` remains untouched until explicit live approval.

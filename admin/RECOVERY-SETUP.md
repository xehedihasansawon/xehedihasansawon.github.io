# Phase 1C — Password Recovery Setup

Phase 1C uses Supabase Auth password recovery. No SQL migration is required for this module.

## Required redirect URL

In Supabase Dashboard:

Authentication → URL Configuration → Redirect URLs

Add:

`http://localhost:5173/admin/`

This allows the recovery email link to return to the local admin page during testing.

When the CMS branch is later deployed, add the final production admin URL too, for example:

`https://xehedihasansawon.github.io/admin/`

Do not remove the localhost URL until local recovery testing is no longer needed.

## Test flow

1. Open `http://localhost:5173/admin/`.
2. Log out if already signed in.
3. Click **Forgot password?**
4. Enter the admin email.
5. Open the recovery email and click its link.
6. The browser should return to `/admin/` and show **Create a new password**.
7. Enter matching passwords with at least 10 characters.
8. Save the new password.
9. The CMS signs out automatically.
10. Sign in with the new password.

## Security behavior

- The recovery request message is intentionally generic.
- A recovery session must still belong to an allowlisted admin.
- The Supabase secret/service-role key is never used in the browser.

# Admin Foundation Setup

This folder contains Phase 1A only: secure admin authentication. It does not yet edit portfolio content.

## 1. Configure Supabase

Open `admin/config.js` and replace:

- `YOUR_SUPABASE_URL`
- `YOUR_SUPABASE_ANON_KEY`

The anon key is a browser/public key. **Never use the Supabase service_role key in frontend code.**

## 2. Create the admin allowlist table

Run:

`supabase/migrations/001_admin_foundation.sql`

inside the Supabase SQL editor.

## 3. Create the owner account

In Supabase Authentication → Users, create the email/password user that will own this CMS.

Then add that existing user to the allowlist from the Supabase SQL editor:

```sql
insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'YOUR_ADMIN_EMAIL'
on conflict (user_id) do update
set email = excluded.email;
```

Replace `YOUR_ADMIN_EMAIL` with the exact Auth user email.

There is intentionally **no public signup button** in the portfolio CMS.

## 4. Test locally

Run:

```bash
git pull origin phase02-polish
npm run dev
```

Then open:

`http://localhost:5173/admin/`

Expected behavior:

- Missing configuration → safe setup message.
- Wrong login → rejected.
- Valid Supabase user without an allowlist row → rejected and signed out.
- Allowlisted admin → admin shell opens.
- Logout → session ends and login screen returns.

## Security rule for future CMS tables

Authentication alone is not enough. Every future editable Supabase table/storage policy must use RLS or equivalent server-side authorization. The browser UI is never the security boundary.

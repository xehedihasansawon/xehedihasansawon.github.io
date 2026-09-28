begin;

create table if not exists public.portfolio_feedback (
  id uuid primary key default gen_random_uuid(),

  client_name text not null
    check (char_length(btrim(client_name)) between 1 and 100),
  client_email text not null
    check (char_length(btrim(client_email)) between 3 and 254),
  client_role text not null default ''
    check (char_length(client_role) <= 120),
  company text not null default ''
    check (char_length(company) <= 120),
  project_label text not null default ''
    check (char_length(project_label) <= 160),
  feedback_text text not null
    check (char_length(btrim(feedback_text)) between 20 and 1200),

  consent_public boolean not null default false,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'hidden')),
  sort_order integer not null default 0
    check (sort_order >= 0),

  submitted_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  updated_by uuid references auth.users(id) on delete set null
);

create index if not exists portfolio_feedback_status_sort_idx
  on public.portfolio_feedback (status, sort_order, submitted_at desc);

alter table public.portfolio_feedback enable row level security;

revoke all on table public.portfolio_feedback from public;
revoke all on table public.portfolio_feedback from anon;
revoke all on table public.portfolio_feedback from authenticated;

grant select (
  id,
  client_name,
  client_role,
  company,
  project_label,
  feedback_text,
  sort_order,
  submitted_at
)
on table public.portfolio_feedback
to anon;

grant select, insert, update, delete
on table public.portfolio_feedback
to authenticated;

drop policy if exists "portfolio_feedback_public_read"
on public.portfolio_feedback;

drop policy if exists "portfolio_feedback_admin_all"
on public.portfolio_feedback;

create policy "portfolio_feedback_public_read"
on public.portfolio_feedback
for select
to anon
using (
  status = 'approved'
  and consent_public = true
);

create policy "portfolio_feedback_admin_all"
on public.portfolio_feedback
for all
to authenticated
using (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  )
);

create or replace function public.portfolio_feedback_touch_row()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
begin
  new.updated_at := timezone('utc'::text, now());
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists portfolio_feedback_touch_trigger
on public.portfolio_feedback;

create trigger portfolio_feedback_touch_trigger
before update on public.portfolio_feedback
for each row
execute function public.portfolio_feedback_touch_row();

create or replace function public.submit_portfolio_feedback(
  p_client_name text,
  p_client_email text,
  p_client_role text,
  p_company text,
  p_project_label text,
  p_feedback_text text,
  p_consent_public boolean,
  p_website text,
  p_elapsed_ms integer
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_name text := btrim(coalesce(p_client_name, ''));
  v_email text := lower(btrim(coalesce(p_client_email, '')));
  v_role text := btrim(coalesce(p_client_role, ''));
  v_company text := btrim(coalesce(p_company, ''));
  v_project text := btrim(coalesce(p_project_label, ''));
  v_feedback text := btrim(coalesce(p_feedback_text, ''));
  v_id uuid;
begin
  if btrim(coalesce(p_website, '')) <> '' then
    raise exception 'Feedback rejected.';
  end if;

  if coalesce(p_elapsed_ms, 0) < 3000 then
    raise exception 'Please take a moment before submitting.';
  end if;

  if char_length(v_name) not between 1 and 100 then
    raise exception 'Name is required.';
  end if;

  if char_length(v_email) not between 3 and 254
     or position('@' in v_email) < 2 then
    raise exception 'A valid email is required.';
  end if;

  if char_length(v_role) > 120
     or char_length(v_company) > 120
     or char_length(v_project) > 160 then
    raise exception 'Feedback profile fields are too long.';
  end if;

  if char_length(v_feedback) not between 20 and 1200 then
    raise exception 'Feedback must be between 20 and 1200 characters.';
  end if;

  if p_consent_public is not true then
    raise exception 'Public display consent is required.';
  end if;

  if exists (
    select 1
    from public.portfolio_feedback pf
    where lower(pf.client_email) = v_email
      and pf.feedback_text = v_feedback
      and pf.submitted_at >= timezone('utc'::text, now()) - interval '10 minutes'
  ) then
    raise exception 'This feedback was already received.';
  end if;

  insert into public.portfolio_feedback (
    client_name,
    client_email,
    client_role,
    company,
    project_label,
    feedback_text,
    consent_public,
    status,
    sort_order
  )
  values (
    v_name,
    v_email,
    v_role,
    v_company,
    v_project,
    v_feedback,
    true,
    'pending',
    0
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.submit_portfolio_feedback(
  text,
  text,
  text,
  text,
  text,
  text,
  boolean,
  text,
  integer
) from public;

revoke all on function public.submit_portfolio_feedback(
  text,
  text,
  text,
  text,
  text,
  text,
  boolean,
  text,
  integer
) from authenticated;

grant execute on function public.submit_portfolio_feedback(
  text,
  text,
  text,
  text,
  text,
  text,
  boolean,
  text,
  integer
) to anon;

comment on table public.portfolio_feedback is
  'Phase 5D client feedback store. Email remains private; anonymous reads expose only approved consented testimonial columns.';

comment on function public.submit_portfolio_feedback(
  text,
  text,
  text,
  text,
  text,
  text,
  boolean,
  text,
  integer
) is
  'Validated anonymous feedback intake. Submitted rows always start pending and never auto-publish.';

commit;

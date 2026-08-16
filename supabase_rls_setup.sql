-- ============================================================
-- QC Management System — Auth + Row Level Security setup
--
-- Run this ONCE in the Supabase Dashboard: Project → SQL Editor → New query.
-- It adds the access_role column to `testers`, enables Row Level Security on
-- every table, and enforces:
--   - admin (access_role='admin', active=true): full access, same as today.
--   - tester (access_role='tester', active=true): can read only their own
--     qc_records rows, and can update only the `status` column on those rows.
--   - anyone not signed in, or a self-registered account not yet approved
--     (active=false): no access to any table.
-- ============================================================

-- 1. New column on testers: access level, separate from the free-text `role`
--    (job title) column that already exists.
alter table public.testers
  add column if not exists access_role text not null default 'tester'
  check (access_role in ('admin','tester'));

-- 2. Prevent two auth accounts from claiming the same tester identity.
create unique index if not exists testers_email_unique_idx
  on public.testers (lower(email))
  where email is not null and email <> '';

-- 3. Helper functions (SECURITY DEFINER so they can read `testers` regardless
--    of the calling user's own RLS restrictions — the standard Supabase
--    pattern for writing row-level policies that depend on a "who am I" check).
create or replace function public.app_is_active_user()
returns boolean
language sql security definer set search_path = public stable
as $$
  select exists (
    select 1 from public.testers
    where lower(email) = lower(auth.email()) and active
  );
$$;

create or replace function public.app_is_admin_user()
returns boolean
language sql security definer set search_path = public stable
as $$
  select exists (
    select 1 from public.testers
    where lower(email) = lower(auth.email()) and active and access_role = 'admin'
  );
$$;

create or replace function public.app_current_tester_id()
returns text
language sql security definer set search_path = public stable
as $$
  select id from public.testers
  where lower(email) = lower(auth.email()) and active
  limit 1;
$$;

-- 4. Enable RLS on every table. Today the anon key has unrestricted access —
--    this is the actual security fix; everything below only takes effect
--    once RLS is enabled.
alter table public.qc_records enable row level security;
alter table public.testers enable row level security;
alter table public.statuses enable row level security;
alter table public.systems enable row level security;
alter table public.sub_systems enable row level security;

-- 5. testers policies
drop policy if exists testers_select on public.testers;
create policy testers_select on public.testers for select
  using ( app_is_admin_user() or lower(email) = lower(auth.email()) );

drop policy if exists testers_insert_self on public.testers;
create policy testers_insert_self on public.testers for insert
  with check (
    lower(email) = lower(auth.email())
    and active = false
    and access_role = 'tester'
  );

drop policy if exists testers_update on public.testers;
create policy testers_update on public.testers for update
  using ( app_is_admin_user() )
  with check ( app_is_admin_user() );

drop policy if exists testers_delete on public.testers;
create policy testers_delete on public.testers for delete
  using ( app_is_admin_user() );

-- 6. qc_records policies
drop policy if exists qc_records_select on public.qc_records;
create policy qc_records_select on public.qc_records for select
  using ( app_is_admin_user() or tester_id = app_current_tester_id() );

drop policy if exists qc_records_insert on public.qc_records;
create policy qc_records_insert on public.qc_records for insert
  with check ( app_is_admin_user() );

drop policy if exists qc_records_update on public.qc_records;
create policy qc_records_update on public.qc_records for update
  using ( app_is_admin_user() or tester_id = app_current_tester_id() )
  with check ( app_is_admin_user() or tester_id = app_current_tester_id() );

drop policy if exists qc_records_delete on public.qc_records;
create policy qc_records_delete on public.qc_records for delete
  using ( app_is_admin_user() );

-- 7. statuses / systems / sub_systems: any active signed-in user can read
--    (needed to render status/system labels and dropdowns), only admins write.
drop policy if exists statuses_select on public.statuses;
create policy statuses_select on public.statuses for select using ( app_is_active_user() );
drop policy if exists statuses_write on public.statuses;
create policy statuses_write on public.statuses for all
  using ( app_is_admin_user() ) with check ( app_is_admin_user() );

drop policy if exists systems_select on public.systems;
create policy systems_select on public.systems for select using ( app_is_active_user() );
drop policy if exists systems_write on public.systems;
create policy systems_write on public.systems for all
  using ( app_is_admin_user() ) with check ( app_is_admin_user() );

drop policy if exists sub_systems_select on public.sub_systems;
create policy sub_systems_select on public.sub_systems for select using ( app_is_active_user() );
drop policy if exists sub_systems_write on public.sub_systems;
create policy sub_systems_write on public.sub_systems for all
  using ( app_is_admin_user() ) with check ( app_is_admin_user() );

-- 8. Column lock: RLS above is row-level only. This trigger stops a tester
--    from updating anything but `status` on their own qc_records row, even
--    via a direct API call that bypasses the app's UI.
create or replace function public.qc_records_lock_columns_for_testers()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if not app_is_admin_user() then
    if row(old.main_system, old.sub_system, old.program_name, old.version,
           old.issue_description, old.issue_type, old.tester_id, old.test_date,
           old.responsible, old.related_apps, old.notes, old.attachments)
       is distinct from
       row(new.main_system, new.sub_system, new.program_name, new.version,
           new.issue_description, new.issue_type, new.tester_id, new.test_date,
           new.responsible, new.related_apps, new.notes, new.attachments)
    then
      raise exception 'Testers may only change the status field.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists qc_records_lock_columns_for_testers_trg on public.qc_records;
create trigger qc_records_lock_columns_for_testers_trg
  before update on public.qc_records
  for each row execute function public.qc_records_lock_columns_for_testers();

-- ============================================================
-- ROLLOUT STEPS (do these after running the script above)
-- ============================================================
-- 1. Dashboard → Authentication → Providers → confirm Email is enabled.
--    Decide whether to require email confirmation (recommended for a public
--    self-signup form) or disable it for a small trusted internal team.
-- 2. Deploy the updated app.js / index.html.
-- 3. Have the first admin sign up through the app's new "Create account" form.
-- 4. Dashboard → Table Editor → testers → find that row → set
--    active = true and access_role = 'admin'. This is the one manual
--    bootstrap step; every other admin/tester can then be managed from the
--    app's Testers page.
-- ============================================================

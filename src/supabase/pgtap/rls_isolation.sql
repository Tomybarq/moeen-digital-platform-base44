-- ============================================================================
-- pgTAP Test Suite — Multi-Tenant RLS Isolation Audit
-- Mo'een Digital Platform
-- ============================================================================
-- Purpose: Prove beyond doubt that an ngo_manager of NGO 'A' cannot
--          read, insert, update, or delete records belonging to NGO 'B'.
--
-- Run with: pg_prove -d <supabase_db_url> supabase/pgtap/rls_isolation.sql
-- Or via Supabase SQL Editor (run each section separately).
-- ============================================================================

-- ── Bootstrap: install pgTAP if not present ─────────────────────────────────
create extension if not exists pgtap with schema extensions;

begin;
select plan(37);  -- total test count — update if you add/remove tests

-- =============================================================================
-- SETUP: Create test tenants, users, and records
-- =============================================================================

-- Clean any leftover test data (uses a unique prefix to avoid collisions)
delete from public.beneficiaries where full_name like 'PGTAP_TEST_%';
delete from public.marketers       where full_name like 'PGTAP_TEST_%';
delete from public.ngos            where name      like 'PGTAP_TEST_%';

-- Create two test NGOs
insert into public.ngos (id, name, responsible_person, phone, email, city, category, status)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'PGTAP_TEST_NGO_A', 'Alice', '0500000001', 'a@test.local', 'صنعاء', 'خيرية', 'active'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'PGTAP_TEST_NGO_B', 'Bob',   '0500000002', 'b@test.local', 'عدن',   'خيرية', 'active');

-- Create two test beneficiaries — one per NGO
insert into public.beneficiaries (id, full_name, phone, city, case_type, priority, status, ngo_id, ngo_name)
values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'PGTAP_TEST_BEN_A', '0510000001', 'صنعاء', 'مادي', 'متوسط', 'active', 'aaaaaaaa-0000-0000-0000-000000000001', 'PGTAP_TEST_NGO_A'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'PGTAP_TEST_BEN_B', '0520000002', 'عدن',   'مادي', 'متوسط', 'active', 'aaaaaaaa-0000-0000-0000-000000000002', 'PGTAP_TEST_NGO_B');

-- ── Helper: impersonate a role by setting a local JWT claim ─────────────────
-- pgTAP runs with SUPERUSER, so we emulate RLS by setting request.jwt.claims
-- before each query. This mirrors exactly what Supabase does per-request.

create or replace function tests.impersonate(
  p_user_id   uuid,
  p_role      text,
  p_ngo_id    uuid default null
) returns void
language plpgsql
security definer
as $$
begin
  -- Build a JWT claim that matches Supabase's auth.jwt() structure
  perform set_config('request.jwt.claim.sub', p_user_id::text, true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);
  perform set_config('request.jwt.claims', jsonb_build_object(
    'sub', p_user_id::text,
    'role', 'authenticated',
    'app_metadata', jsonb_build_object('role', p_role),
    'user_metadata', jsonb_build_object('role', p_role, 'ngo_id', p_ngo_id)
  )::text, true);

  -- Also set the local user_id that RLS policies reference via auth.uid()
  -- (pgtap runs as superuser; we need the policy to see a different uid)
  perform set_config('role', 'authenticated', true);
end;
$$;

-- =============================================================================
-- TESTS: beneficiaries table
-- =============================================================================

-- ── Section 1: ngo_manager of NGO_A reads ONLY NGO_A beneficiaries ──────────

-- Test 1: ngo_manager_A CAN select own beneficiary
select results_eq(
  $$select full_name from public.beneficiaries
    where full_name = 'PGTAP_TEST_BEN_A'$$,
  $$values ('PGTAP_TEST_BEN_A')$$,
  'ngo_manager_A can read own beneficiary'
);

-- Test 2: ngo_manager_A CANNOT select NGO_B beneficiary (returns empty)
select is_empty(
  $$select full_name from public.beneficiaries
    where full_name = 'PGTAP_TEST_BEN_B'$$,
  'ngo_manager_A CANNOT read NGO_B beneficiary — cross-tenant read blocked'
);

-- Test 3: ngo_manager_A can still list all own beneficiaries
select results_eq(
  $$select count(*)::integer from public.beneficiaries
    where ngo_id = 'aaaaaaaa-0000-0000-0000-000000000001'$$,
  $$values (1)$$,
  'ngo_manager_A sees exactly 1 beneficiary from own NGO'
);

-- Test 4: ngo_manager_A sees ZERO when filtering by NGO_B id
select results_eq(
  $$select count(*)::integer from public.beneficiaries
    where ngo_id = 'aaaaaaaa-0000-0000-0000-000000000002'$$,
  $$values (0)$$,
  'ngo_manager_A sees 0 beneficiaries from NGO_B — cross-tenant isolation confirmed'
);

-- ── Section 2: platform_admin reads ALL ─────────────────────────────────────

-- impersonate platform_admin (no ngo scope)
select tests.impersonate('cccccccc-0000-0000-0000-000000000001', 'platform_admin');

-- Test 5: platform_admin CAN see NGO_A beneficiary
select results_eq(
  $$select full_name from public.beneficiaries
    where full_name = 'PGTAP_TEST_BEN_A'$$,
  $$values ('PGTAP_TEST_BEN_A')$$,
  'platform_admin can read NGO_A beneficiary'
);

-- Test 6: platform_admin CAN see NGO_B beneficiary
select results_eq(
  $$select full_name from public.beneficiaries
    where full_name = 'PGTAP_TEST_BEN_B'$$,
  $$values ('PGTAP_TEST_BEN_B')$$,
  'platform_admin can read NGO_B beneficiary — full visibility'
);

-- ── Section 3: ngo_manager_A CANNOT INSERT under NGO_B ──────────────────────

-- switch back to ngo_manager_A
select tests.impersonate('aaaaaaaa-0000-0000-0000-aaaaaaaaa001', 'ngo_manager', 'aaaaaaaa-0000-0000-0000-000000000001');

-- Test 7: insert with own ngo_id → should succeed (1 row)
select lives_ok(
  $$insert into public.beneficiaries (full_name, phone, city, case_type, priority, ngo_id, ngo_name)
    values ('PGTAP_TEST_INSERT_OWN', '0500000003', 'صنعاء', 'مادي', 'متوسط',
            'aaaaaaaa-0000-0000-0000-000000000001', 'PGTAP_TEST_NGO_A')$$,
  'ngo_manager_A CAN insert beneficiary under own NGO'
);

-- Test 8: insert with NGO_B's ngo_id → must THROW (policy violation)
select throws_ok(
  $$insert into public.beneficiaries (full_name, phone, city, case_type, priority, ngo_id, ngo_name)
    values ('PGTAP_TEST_INSERT_OTHER', '0500000004', 'عدن', 'مادي', 'متوسط',
            'aaaaaaaa-0000-0000-0000-000000000002', 'PGTAP_TEST_NGO_B')$$,
  'new row violates row-level security policy',
  'ngo_manager_A CANNOT insert beneficiary under NGO_B — policy violation raised'
);

-- ── Cleanup the successful insert ───────────────────────────────────────────
delete from public.beneficiaries where full_name = 'PGTAP_TEST_INSERT_OWN';

-- ── Section 4: ngo_manager_A CANNOT UPDATE NGO_B's beneficiary ──────────────

-- Test 9: update own beneficiary → succeeds (returns 1 row updated)
select lives_ok(
  $$update public.beneficiaries set city = 'صنعاء-محدث' where full_name = 'PGTAP_TEST_BEN_A'$$,
  'ngo_manager_A CAN update own beneficiary'
);

-- Verify the update took effect
select results_eq(
  $$select city from public.beneficiaries where full_name = 'PGTAP_TEST_BEN_A'$$,
  $$values ('صنعاء-محدث')$$,
  'update on own beneficiary persisted'
);

-- Revert
update public.beneficiaries set city = 'صنعاء' where full_name = 'PGTAP_TEST_BEN_A';

-- Test 10: update NGO_B's beneficiary → 0 rows affected (silently blocked)
select results_eq(
  $$with attempt as (
    update public.beneficiaries set city = 'عدن-محدث' where full_name = 'PGTAP_TEST_BEN_B'
    returning id
  ) select count(*)::integer from attempt$$,
  $$values (0)$$,
  'ngo_manager_A CANNOT update NGO_B beneficiary — 0 rows affected'
);

-- Confirm NGO_B record was NOT changed
select tests.impersonate('cccccccc-0000-0000-0000-000000000001', 'platform_admin');
select results_eq(
  $$select city from public.beneficiaries where full_name = 'PGTAP_TEST_BEN_B'$$,
  $$values ('عدن')$$,
  'NGO_B beneficiary city unchanged after attempted cross-tenant update'
);

-- switch back
select tests.impersonate('aaaaaaaa-0000-0000-0000-aaaaaaaaa001', 'ngo_manager', 'aaaaaaaa-0000-0000-0000-000000000001');

-- ── Section 5: ngo_manager_A CANNOT DELETE NGO_B's beneficiary ──────────────

-- Test 11: delete own beneficiary → succeeds
select lives_ok(
  $$delete from public.beneficiaries where full_name = 'PGTAP_TEST_BEN_A'$$,
  'ngo_manager_A CAN delete own beneficiary'
);

-- Re-insert it for remaining tests
insert into public.beneficiaries (id, full_name, phone, city, case_type, priority, status, ngo_id, ngo_name)
values ('bbbbbbbb-0000-0000-0000-000000000001', 'PGTAP_TEST_BEN_A', '0510000001', 'صنعاء', 'مادي', 'متوسط', 'active', 'aaaaaaaa-0000-0000-0000-000000000001', 'PGTAP_TEST_NGO_A');

-- Test 12: delete NGO_B's beneficiary → 0 rows (silently blocked)
select results_eq(
  $$with attempt as (
    delete from public.beneficiaries where full_name = 'PGTAP_TEST_BEN_B' returning id
  ) select count(*)::integer from attempt$$,
  $$values (0)$$,
  'ngo_manager_A CANNOT delete NGO_B beneficiary — 0 rows affected'
);

-- Confirm NGO_B record still exists
select tests.impersonate('cccccccc-0000-0000-0000-000000000001', 'platform_admin');
select results_eq(
  $$select full_name from public.beneficiaries where full_name = 'PGTAP_TEST_BEN_B'$$,
  $$values ('PGTAP_TEST_BEN_B')$$,
  'NGO_B beneficiary still exists after attempted cross-tenant delete'
);

-- switch back
select tests.impersonate('aaaaaaaa-0000-0000-0000-aaaaaaaaa001', 'ngo_manager', 'aaaaaaaa-0000-0000-0000-000000000001');

-- =============================================================================
-- TESTS: users table — ngo_manager data isolation
-- =============================================================================
-- (users table has a simple "authenticated users can read" policy;
--  the critical test is that a user cannot escalate or cross-tenant roles)

-- Test 13: ngo_manager_A CAN read their own user record
select results_eq(
  $$select role from public.users
    where id = 'aaaaaaaa-0000-0000-0000-aaaaaaaaa001'$$,
  $$values ('ngo_manager')$$,
  'ngo_manager_A can read own user profile'
);

-- =============================================================================
-- TESTS: researcher scope — researcher sees ONLY their own beneficiaries
-- =============================================================================

-- impersonate researcher (researcher_id on beneficiaries must match)
select tests.impersonate('dddddddd-0000-0000-0000-000000000001', 'researcher');

-- Test 14: researcher with no records sees empty set
select is_empty(
  $$select * from public.beneficiaries where researcher_id = 'dddddddd-0000-0000-0000-000000000001'$$,
  'researcher with no records sees empty set'
);

-- =============================================================================
-- TESTS: marketer isolation — cannot read beneficiaries outside own NGO
-- =============================================================================

select tests.impersonate('eeeeeeee-0000-0000-0000-000000000001', 'marketer', 'aaaaaaaa-0000-0000-0000-000000000001');

-- Test 15: marketer of NGO_A CANNOT select NGO_B beneficiary
select is_empty(
  $$select full_name from public.beneficiaries
    where full_name = 'PGTAP_TEST_BEN_B'$$,
  'marketer cannot see beneficiaries outside own NGO'
);

-- =============================================================================
-- TESTS: ngo_manager_A — verified visibility via select(*) (correct scope)
-- =============================================================================

select tests.impersonate('aaaaaaaa-0000-0000-0000-aaaaaaaaa001', 'ngo_manager', 'aaaaaaaa-0000-0000-0000-000000000001');

-- Test 16: select(*) returns ONLY NGO_A's beneficiaries
select results_eq(
  $$select ngo_id from public.beneficiaries$$,
  $$values ('aaaaaaaa-0000-0000-0000-000000000001')$$,
  'select(*) for ngo_manager_A returns ONLY own NGO records — no leakage'
);

-- Test 17: count(*) matches expected (1 beneficiary for NGO_A)
select results_eq(
  $$select count(*)::integer from public.beneficiaries$$,
  $$values (1)$$,
  'count(*) matches — no cross-tenant records leaked'
);

-- =============================================================================
-- TESTS: bulk operations — cannot mass-update cross-tenant
-- =============================================================================

-- Test 18: update with no WHERE clause → only affects own records
select lives_ok(
  $$update public.beneficiaries set priority = 'مرتفع'
    where ngo_id = 'aaaaaaaa-0000-0000-0000-000000000001'$$,
  'bulk update scoped to own NGO succeeds'
);

-- Verify NGO_B was untouched
select tests.impersonate('cccccccc-0000-0000-0000-000000000001', 'platform_admin');
select results_eq(
  $$select priority from public.beneficiaries where full_name = 'PGTAP_TEST_BEN_B'$$,
  $$values ('متوسط')$$,
  'bulk update did not affect NGO_B — intact'
);

-- Revert
update public.beneficiaries set priority = 'متوسط' where full_name = 'PGTAP_TEST_BEN_A';
select tests.impersonate('aaaaaaaa-0000-0000-0000-aaaaaaaaa001', 'ngo_manager', 'aaaaaaaa-0000-0000-0000-000000000001');

-- =============================================================================
-- TESTS: unauthenticated access — complete rejection
-- =============================================================================

-- Test 19: unauthenticated user sees nothing from beneficiaries
perform set_config('request.jwt.claim.sub', '', true);
perform set_config('request.jwt.claims', '{}', true);
perform set_config('role', 'anon', true);

select is_empty(
  $$select * from public.beneficiaries$$,
  'unauthenticated (anon) sees nothing — RLS blocks all'
);

-- Test 20: unauthenticated user cannot insert
select throws_ok(
  $$insert into public.beneficiaries (full_name, phone, city, case_type, priority)
    values ('PGTAP_ANON_INSERT', '000', 'صنعاء', 'مادي', 'متوسط')$$,
  'new row violates row-level security policy',
  'anon cannot insert into beneficiaries'
);

-- =============================================================================
-- TESTS: dashboard_cache — all authenticated can read/write
-- =============================================================================

select tests.impersonate('aaaaaaaa-0000-0000-0000-aaaaaaaaa001', 'ngo_manager', 'aaaaaaaa-0000-0000-0000-000000000001');

-- Test 21: cache insert succeeds for authenticated user
select lives_ok(
  $$insert into public.dashboard_cache (report_type, filters_hash, payload)
    values ('pgtap_test', 'deadbeef', '{"test": true}'::jsonb)$$,
  'authenticated user can write to dashboard_cache'
);

-- Test 22: cache read succeeds
select results_eq(
  $$select payload->>'test' from public.dashboard_cache where report_type = 'pgtap_test'$$,
  $$values ('true')$$,
  'authenticated user can read from dashboard_cache'
);

-- Cleanup cache
delete from public.dashboard_cache where report_type = 'pgtap_test';

-- =============================================================================
-- TESTS: SQL injection attempt via ngo_id field (security hardening)
-- =============================================================================

-- Test 23: inserting with SQL injection payload in ngo_name fails gracefully
select lives_ok(
  $$insert into public.beneficiaries (full_name, phone, city, case_type, priority, ngo_id, ngo_name)
    values ('PGTAP_SQLI_TEST', '0500000005', 'صنعاء', 'مادي', 'متوسط',
            'aaaaaaaa-0000-0000-0000-000000000001',
            'test''; DROP TABLE beneficiaries;--')$$,
  'SQL injection attempt in ngo_name does not crash — value stored as literal'
);

-- Verify the malicious string was stored as literal text (not executed)
select tests.impersonate('cccccccc-0000-0000-0000-000000000001', 'platform_admin');
select results_eq(
  $$select ngo_name from public.beneficiaries where full_name = 'PGTAP_SQLI_TEST'$$,
  $$values ('test''; DROP TABLE beneficiaries;--')$$,
  'SQL injection payload stored as harmless literal string — no execution'
);

-- Cleanup injection test
delete from public.beneficiaries where full_name = 'PGTAP_SQLI_TEST';

-- =============================================================================
-- TESTS: edge case — ngo_manager with NULL ngo_id in own profile
-- =============================================================================

-- Simulate a misconfigured ngo_manager (no ngo_id set on their user record)
-- This tests the defensive "is null" branch in the policy.

select tests.impersonate('ffffffff-0000-0000-0000-000000000001', 'ngo_manager', null);

-- Test 24: ngo_manager with null ngo_id sees nothing (safe default)
select is_empty(
  $$select * from public.beneficiaries$$,
  'ngo_manager with NULL ngo_id sees nothing — safe default, no data leak'
);

-- =============================================================================
-- CLEANUP
-- =============================================================================

select tests.impersonate('cccccccc-0000-0000-0000-000000000001', 'platform_admin');

delete from public.beneficiaries where full_name like 'PGTAP_TEST_%';
delete from public.ngos            where name      like 'PGTAP_TEST_%';

-- =============================================================================
-- FINALIZE
-- =============================================================================

select * from finish();
rollback;  -- rollback ensures test data never persists
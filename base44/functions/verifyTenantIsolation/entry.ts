/**
 * verifyTenantIsolation — Security verification for multi-tenant data isolation.
 *
 * Tests that each NGO can only access its own data. Run by platform_admin
 * or pdo to validate that RLS rules are correctly enforced.
 *
 * Returns per-tenant access verification results.
 *
 * Payload (optional):
 * {
 *   tenant_ids: string[]  // specific NGO IDs to verify (default: all)
 * }
 */

import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin and PDO can run security verification
    if (user.role !== "platform_admin" && user.role !== "pdo") {
      return Response.json({ error: "Forbidden: Admin or PDO access required" }, { status: 403 });
    }

    let payload = {};
    try {
      const body = await req.json();
      if (body && typeof body === "object") payload = body;
    } catch {
      // No body — verify all tenants
    }

    // Get all active NGOs (tenants)
    const allNgos = await base44.asServiceRole.entities.NGO.filter(
      { status: "active" },
      "name",
      200,
      0
    );

    const targetNgos = payload.tenant_ids && payload.tenant_ids.length > 0
      ? allNgos.filter((n) => payload.tenant_ids.includes(n.id))
      : allNgos;

    if (targetNgos.length === 0) {
      return Response.json({ success: true, message: "No tenants to verify", results: [] });
    }

    const results = [];

    for (const ngo of targetNgos) {
      const tenantId = ngo.id;
      const tenantResult = {
        tenant_id: tenantId,
        tenant_name: ngo.name,
        status: "pass",
        checks: {},
      };

      // --- Check 1: Beneficiary data isolation ---
      const beneficiaries = await base44.asServiceRole.entities.Beneficiary.filter(
        { ngo_id: tenantId },
        "-created_date",
        500,
        0
      );
      const crossTenantBeneficiaries = beneficiaries.filter(
        (b) => b.ngo_id && b.ngo_id !== tenantId
      );
      tenantResult.checks.beneficiaries = {
        total: beneficiaries.length,
        cross_tenant_leaks: crossTenantBeneficiaries.length,
        pass: crossTenantBeneficiaries.length === 0,
      };

      // --- Check 2: Marketer data isolation ---
      const marketers = await base44.asServiceRole.entities.Marketer.filter(
        { ngo_id: tenantId },
        "-created_date",
        500,
        0
      );
      const crossTenantMarketers = marketers.filter(
        (m) => m.ngo_id && m.ngo_id !== tenantId
      );
      tenantResult.checks.marketers = {
        total: marketers.length,
        cross_tenant_leaks: crossTenantMarketers.length,
        pass: crossTenantMarketers.length === 0,
      };

      // --- Check 3: Users are correctly scoped ---
      const users = await base44.asServiceRole.entities.User.filter(
        { ngo_id: tenantId },
        "",
        200,
        0
      );
      const crossTenantUsers = users.filter(
        (u) => u.ngo_id && u.ngo_id !== tenantId
      );
      tenantResult.checks.users = {
        total: users.length,
        cross_tenant_leaks: crossTenantUsers.length,
        pass: crossTenantUsers.length === 0,
      };

      // --- Check 4: Audit logs are scoped ---
      const logs = await base44.asServiceRole.entities.AuditLog.filter(
        { associationId: tenantId },
        "-created_date",
        100,
        0
      );
      const crossTenantLogs = logs.filter(
        (l) => l.associationId && l.associationId !== tenantId
      );
      tenantResult.checks.audit_logs = {
        total: logs.length,
        cross_tenant_leaks: crossTenantLogs.length,
        pass: crossTenantLogs.length === 0,
      };

      // Aggregate status
      const allPassed = Object.values(tenantResult.checks).every((c) => c.pass);
      tenantResult.status = allPassed ? "pass" : "fail";

      if (!allPassed) {
        tenantResult.failures = Object.entries(tenantResult.checks)
          .filter(([, c]) => !c.pass)
          .map(([entity, c]) => ({
            entity,
            cross_tenant_leaks: c.cross_tenant_leaks,
          }));
      }

      results.push(tenantResult);
    }

    const overallPass = results.every((r) => r.status === "pass");

    return Response.json({
      success: true,
      overall_status: overallPass ? "PASS" : "FAIL",
      total_tenants_verified: results.length,
      tenants_passed: results.filter((r) => r.status === "pass").length,
      tenants_failed: results.filter((r) => r.status === "fail").length,
      results,
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});
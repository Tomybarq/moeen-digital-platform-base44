/**
 * Backend function: getUserPermissions
 *
 * Returns the computed permission set for the currently authenticated user
 * based on their role. Called once by the frontend at login and cached.
 *
 * The frontend uses this to render/hide UI elements (cosmetic only).
 * Actual data protection is enforced by Base44 entity RLS rules server-side.
 */

import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

// ── Full permission matrix (mirrors lib/roles.config.js) ────────────────────
const PERMISSIONS = {
  platform_admin: [
    "dashboard:view",
    "ngos:view", "ngos:create", "ngos:edit", "ngos:delete",
    "beneficiaries:view", "beneficiaries:create", "beneficiaries:edit",
    "beneficiaries:delete", "beneficiaries:import", "beneficiaries:export",
    "beneficiaries:archive",
    "marketers:view", "marketers:create", "marketers:edit", "marketers:delete",
    "users:view", "users:create", "users:edit", "users:delete",
    "settings:view", "settings:edit",
    "marketing:view",
    "researcher_workspace:view",
  ],
  ngo_manager: [
    "dashboard:view",
    "ngos:view",
    "beneficiaries:view", "beneficiaries:export",
    "marketers:view",
    "settings:view",
    "marketing:view",
  ],
  researcher: [
    "dashboard:view",
    "ngos:view",
    "beneficiaries:view", "beneficiaries:create", "beneficiaries:edit",
    "beneficiaries:import", "beneficiaries:archive",
    "settings:view",
    "researcher_workspace:view",
  ],
  marketer: [
    "dashboard:view",
    "ngos:view",
    "beneficiaries:view",
    "marketing:view",
    "marketers:view",
    "settings:view",
  ],
  pdo: [
    "dashboard:view",
    "ngos:view",
    "beneficiaries:view", "beneficiaries:delete", "beneficiaries:export",
    "settings:view",
  ],
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: "غير مصرح" }, { status: 401 });
    }

    // Map platform "admin" to app "platform_admin"
    const role = user.role === "admin" ? "platform_admin" : user.role;

    return Response.json({
      role,
      permissions: PERMISSIONS[role] ?? [],
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
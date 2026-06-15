/**
 * logAudit — Immutable Audit Log Writer
 *
 * Creates an audit log entry in the AuditLog entity.
 * This function is the single writer for all audit events across the platform.
 *
 * Called by:
 *   - Entity automations (on NGO/Beneficiary/Marketer/User CRUD)
 *   - Frontend (for LOGIN_SUCCESS, LOGIN_FAILURE, ROLE_CHANGE, BULK_EXPORT, etc.)
 *
 * Security:
 *   - All callers must be authenticated.
 *   - The AuditLog RLS prevents update/delete — entries are immutable.
 *
 * Payload shape:
 * {
 *   event_type: string,
 *   resource_type: string,
 *   resource_id?: string,
 *   resource_label?: string,
 *   associationId?: string,
 *   details?: string,       // JSON string
 *   user_id?: string,
 *   user_role?: string,
 *   ip_address?: string,
 *   user_agent?: string
 * }
 */

import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

const SENSITIVE_FIELDS = [
  "national_id", "phone", "phone_alt", "email",
  "password", "token", "secret", "api_key",
];

function sanitiseDetails(detailsStr) {
  if (!detailsStr) return null;
  try {
    const obj = typeof detailsStr === "string" ? JSON.parse(detailsStr) : detailsStr;
    const sanitised = {};

    for (const [key, value] of Object.entries(obj)) {
      if (SENSITIVE_FIELDS.includes(key)) {
        sanitised[key] = `[REDACTED — ${key}]`;
      } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        const nested = {};
        for (const [nk, nv] of Object.entries(value)) {
          if (SENSITIVE_FIELDS.includes(nk)) {
            nested[nk] = `[REDACTED — ${nk}]`;
          } else {
            nested[nk] = nv;
          }
        }
        sanitised[key] = nested;
      } else {
        sanitised[key] = value;
      }
    }

    return JSON.stringify(sanitised);
  } catch {
    return detailsStr;
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload;
    try {
      payload = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const {
      event_type,
      resource_type,
      resource_id = null,
      resource_label = null,
      associationId = null,
      details = null,
      user_id = null,
      user_role = null,
      ip_address = null,
      user_agent = null,
    } = payload;

    if (!event_type || !resource_type) {
      return Response.json(
        { error: "event_type and resource_type are required" },
        { status: 400 }
      );
    }

    const sanitised = sanitiseDetails(details);

    const entry = {
      event_type,
      user_id: user_id || user.id,
      user_role: user_role || user.role,
      resource_type,
      resource_id,
      resource_label,
      associationId: associationId || user.ngo_id || null,
      details: sanitised,
      ip_address,
      user_agent,
    };

    const created = await base44.asServiceRole.entities.AuditLog.create(entry);

    return Response.json({ success: true, id: created.id });
  } catch (error) {
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});
/**
 * onBeneficiaryCreated — Welcome notification + audit log when a new Beneficiary is registered.
 *
 * Triggered by entity automation on Beneficiary.create.
 *
 * Payload (from entity automation):
 * {
 *   event:  { type: "create", entity_name: "Beneficiary", entity_id: "…" },
 *   data:   { full_name, phone, city, case_type, priority, ngo_id, ngo_name, researcher_name, … },
 *   payload_too_large: false
 * }
 *
 * Syncs with Supabase (read-only verification) and logs to AuditLog.
 */

import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

const SUPABASE_CONNECTOR_ID = "6a327aec3d84b6e6af977d01";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Auth — entity automations also pass through an authenticated context
    let user = null;
    try {
      user = await base44.auth.me();
    } catch {
      // Entity automation may not have a user context — that's fine
    }

    let payload;
    try {
      payload = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { event, data } = payload;

    if (!event || event.type !== "create" || event.entity_name !== "Beneficiary") {
      return Response.json({
        success: false,
        skipped: true,
        reason: "Only Beneficiary.create events are handled",
      });
    }

    const beneficiaryName = data?.full_name || "مستفيد جديد";
    const beneficiaryPhone = data?.phone || "—";
    const beneficiaryCity = data?.city || "—";
    const ngoName = data?.ngo_name || "غير محددة";
    const ngoId = data?.ngo_id || null;
    const caseType = data?.case_type || "—";
    const priority = data?.priority || "—";
    const researcherName = data?.researcher_name || "—";
    const beneficiaryId = event.entity_id;

    const beneficiaryUrl = `/beneficiaries/detail?id=${beneficiaryId}`;

    // ── 1. Welcome notification to NGO manager(s) ───────────────────────
    const notifications = [];

    if (ngoId) {
      const ngoManagers = await base44.asServiceRole.entities.User.filter(
        { role: "ngo_manager", ngo_id: ngoId },
        "",
        5,
        0
      );

      for (const manager of ngoManagers) {
        const notif = await base44.asServiceRole.entities.Notification.create({
          user_id: manager.id,
          associationId: ngoId,
          type: "case_update",
          title: `مستفيد جديد — ${beneficiaryName}`,
          message: [
            `تم تسجيل مستفيد جديد في منظمتك "${ngoName}".`,
            "",
            `📋 الاسم: ${beneficiaryName}`,
            `📞 الجوال: ${beneficiaryPhone}`,
            `📍 المدينة: ${beneficiaryCity}`,
            `🏷️ نوع الحالة: ${caseType}`,
            `⚠️ الأولوية: ${priority}`,
            `🔍 الباحث: ${researcherName}`,
          ].join("\n"),
          link: beneficiaryUrl,
          entity_type: "Beneficiary",
          entity_id: beneficiaryId,
          is_read: false,
        });
        notifications.push(notif.id);
      }
    }

    // ── 2. Notify platform admins ──────────────────────────────────────
    const platformAdmins = await base44.asServiceRole.entities.User.filter(
      { role: "platform_admin" },
      "",
      10,
      0
    );

    for (const admin of platformAdmins) {
      const notif = await base44.asServiceRole.entities.Notification.create({
        user_id: admin.id,
        associationId: ngoId,
        type: "system_alert",
        title: `تسجيل مستفيد جديد — ${beneficiaryName}`,
        message: [
          `تم تسجيل مستفيد جديد على المنصة.`,
          "",
          `📋 الاسم: ${beneficiaryName}`,
          `🏢 المنظمة: ${ngoName}`,
          `📞 الجوال: ${beneficiaryPhone}`,
          `📍 المدينة: ${beneficiaryCity}`,
          `🏷️ نوع الحالة: ${caseType}`,
          `⚠️ الأولوية: ${priority}`,
          `🔍 الباحث: ${researcherName}`,
        ].join("\n"),
        link: beneficiaryUrl,
        entity_type: "Beneficiary",
        entity_id: beneficiaryId,
        is_read: false,
      });
      notifications.push(notif.id);
    }

    // ── 3. Audit log entry ────────────────────────────────────────────
    await base44.asServiceRole.entities.AuditLog.create({
      event_type: "CREATE",
      user_id: user?.id || null,
      user_role: user?.role || null,
      resource_type: "Beneficiary",
      resource_id: beneficiaryId,
      resource_label: beneficiaryName,
      associationId: ngoId,
      details: JSON.stringify({
        full_name: beneficiaryName,
        phone: beneficiaryPhone,
        city: beneficiaryCity,
        case_type: caseType,
        priority: priority,
        ngo_name: ngoName,
        ngo_id: ngoId,
        researcher_name: researcherName,
      }),
      ip_address: null,
      user_agent: null,
    });

    // ── 4. Supabase read-only sync verification ────────────────────────
    let supabaseStatus = "skipped";
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getWorkspaceConnection(
        SUPABASE_CONNECTOR_ID
      );

      // Get project ref
      const projectsRes = await fetch("https://api.supabase.com/v1/projects", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const projects = await projectsRes.json();
      const projectRef = projects?.[0]?.ref;

      if (projectRef) {
        // Verify the beneficiary exists in Supabase (read-only introspection)
        const queryRes = await fetch(
          `https://api.supabase.com/v1/projects/${projectRef}/database/query/read-only`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: `SELECT id, full_name, created_at FROM public.beneficiaries WHERE id = '${beneficiaryId}' LIMIT 1`,
            }),
          }
        );
        const queryData = await queryRes.json();
        supabaseStatus = queryData?.length > 0 ? "verified" : "not_found";
      }
    } catch (supaError) {
      supabaseStatus = `error: ${supaError.message}`;
    }

    return Response.json({
      success: true,
      notifications_count: notifications.length,
      notification_ids: notifications,
      beneficiary_id: beneficiaryId,
      beneficiary_name: beneficiaryName,
      supabase_sync: supabaseStatus,
    });
  } catch (error) {
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});
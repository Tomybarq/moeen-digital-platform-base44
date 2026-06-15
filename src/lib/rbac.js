/**
 * @fileoverview RBAC Helpers — Mo'een Digital Platform
 *
 * ALL role & permission DEFINITIONS are in lib/roles.config.js.
 * This file only re-exports the definitions and provides runtime helper
 * functions for the frontend UI layer.
 *
 * FRONTEND CHECKS ARE COSMETIC ONLY.
 * The backend (Base44 entity RLS) is the single source of truth for
 * data protection. Never rely on hasPermission / hasRole for security.
 */
import {
  ROLES,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  ROLE_COLORS,
  ROLE_ICONS,
  ROLE_BANNERS,
  ROLE_ALIASES,
  PERMISSIONS,
  DENIAL_MESSAGES,
} from "@/lib/roles.config";

// Re-export everything for backward compatibility
export {
  ROLES,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  ROLE_COLORS,
  ROLE_ICONS,
  ROLE_BANNERS,
  ROLE_ALIASES,
  PERMISSIONS,
  DENIAL_MESSAGES,
};

/* ── Runtime helpers (cosmetic — NOT security) ──────────────────────────── */

/** Check a single permission for a user (UI visibility only). */
export function hasPermission(user, permission) {
  if (!user?.role) return false;
  return PERMISSIONS[user.role]?.includes(permission) ?? false;
}

/** Check if user has at least one of the given roles. */
export function hasRole(user, roles) {
  return roles.includes(user?.role);
}

/** Returns the set of permissions for a given role. */
export function getPermissionsForRole(role) {
  return PERMISSIONS[role] ?? [];
}

/** Normalise a friendly alias to the internal role key. */
export function normalizeRole(alias) {
  return ROLE_ALIASES[alias] || alias;
}

/** Arabic label for a role key. */
export function getRoleLabel(role) {
  return ROLE_LABELS[role] ?? role;
}

/** Tailwind colour classes for a role badge. */
export function getRoleColor(role) {
  return ROLE_COLORS[role] ?? "bg-muted text-muted-foreground border-border";
}

/** Human‑readable Arabic denial reason for a missing permission. */
export function getDenialMessage(permission) {
  return (
    DENIAL_MESSAGES[permission] ??
    "ليس لديك صلاحية للوصول إلى هذا القسم."
  );
}

/**
 * NGO Data Isolation — client-side RLS equivalent (UX ONLY).
 *
 * The backend entity RLS rules enforce these SAME rules server-side.
 * This function exists purely to avoid showing data the user cannot
 * interact with — it is NOT a security measure.
 *
 * - platform_admin / pdo: see ALL records
 * - ngo_manager / marketer: see only their NGO's records
 * - researcher: see only records THEY created (created_by_id match)
 */
export function filterByNGO(user, records) {
  if (!user) return [];

  // Full visibility roles
  if (user.role === ROLES.PLATFORM_ADMIN || user.role === ROLES.PDO) return records;

  // Researcher sees only their own entries
  if (user.role === ROLES.RESEARCHER) {
    return records.filter(r => r.created_by_id === user.id);
  }

  // NGO-scoped roles (ngo_manager, marketer)
  const userNgoId   = user.ngo_id;
  const userNgoName = user.ngo_name;

  return records.filter(r => {
    if (userNgoId   && r.ngo_id)   return r.ngo_id   === userNgoId;
    if (userNgoName && r.ngo_name) return r.ngo_name === userNgoName;
    return false;
  });
}

/**
 * Throw if a user attempts to write to another NGO's data (UX ONLY).
 *
 * The backend entity RLS rules will reject the write regardless.
 * This check provides an early, friendlier error message.
 */
export function assertNGOScope(user, data) {
  if (!user) throw new Error("المستخدم غير مصادق عليه");
  if (user.role === ROLES.PLATFORM_ADMIN) return;

  if (data.ngo_id && user.ngo_id && data.ngo_id !== user.ngo_id) {
    throw new Error("غير مسموح: لا يمكنك تعديل بيانات منظمة أخرى");
  }
  if (data.ngo_name && user.ngo_name && data.ngo_name !== user.ngo_name) {
    throw new Error("غير مسموح: لا يمكنك تعديل بيانات منظمة أخرى");
  }
}
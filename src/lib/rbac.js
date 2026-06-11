/**
 * Role-Based Access Control (RBAC) for Mo'een Platform
 * Roles: PLATFORM_ADMIN | NGO_MANAGER | RESEARCHER | MARKETER | PDO
 */

export const ROLES = {
  PLATFORM_ADMIN: "platform_admin",
  NGO_MANAGER:    "ngo_manager",
  RESEARCHER:     "researcher",
  MARKETER:       "marketer",
  PDO:            "pdo",
};

export const ROLE_LABELS = {
  platform_admin: "مدير المنصة",
  ngo_manager:    "مدير المنظمة",
  researcher:     "باحث اجتماعي",
  marketer:       "مسوّق",
  pdo:            "مسؤول حماية البيانات",
};

export const ROLE_DESCRIPTIONS = {
  platform_admin: "صلاحيات كاملة على جميع أقسام المنصة",
  ngo_manager:    "إدارة منظمتهم وعرض تقاريرها",
  researcher:     "البحث والمتابعة الميدانية للمستفيدين",
  marketer:       "إدارة الحملات التسويقية للمستفيدين",
  pdo:            "مسؤول امتثال حماية البيانات الشخصية",
};

export const ROLE_COLORS = {
  platform_admin: "bg-purple-500/15 text-purple-600 border-purple-300",
  ngo_manager:    "bg-blue-500/15 text-blue-600 border-blue-300",
  researcher:     "bg-emerald-500/15 text-emerald-600 border-emerald-300",
  marketer:       "bg-amber-500/15 text-amber-600 border-amber-300",
  pdo:            "bg-rose-500/15 text-rose-600 border-rose-300",
};

export const ROLE_ICONS = {
  platform_admin: "ShieldCheck",
  ngo_manager:    "Building2",
  researcher:     "Search",
  marketer:       "Megaphone",
  pdo:            "Lock",
};

/**
 * Permission matrix — resource:action pairs per role.
 *
 * beneficiaries:delete  → PDO only (PDPL compliance)
 * beneficiaries:import  → platform_admin + researcher
 * beneficiaries:export  → platform_admin + ngo_manager + pdo
 * marketing:view        → marketer + platform_admin + ngo_manager
 */
export const PERMISSIONS = {
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

/** Check a single permission for a user */
export function hasPermission(user, permission) {
  if (!user?.role) return false;
  return PERMISSIONS[user.role]?.includes(permission) ?? false;
}

/** Check if user has at least one of the given roles */
export function hasRole(user, roles) {
  return roles.includes(user?.role);
}

export function getRoleLabel(role) {
  return ROLE_LABELS[role] ?? role;
}

export function getRoleColor(role) {
  return ROLE_COLORS[role] ?? "bg-muted text-muted-foreground border-border";
}

/**
 * NGO Data Isolation — client-side RLS equivalent.
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
 * Throw if a user attempts to write to another NGO's data.
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

/**
 * Returns a human-readable Arabic denial reason for a missing permission.
 */
export function getDenialMessage(permission) {
  const messages = {
    "beneficiaries:delete": "حذف سجلات المستفيدين مقتصر على مسؤول حماية البيانات (PDO) وفق متطلبات الامتثال.",
    "beneficiaries:create": "ليس لديك صلاحية إضافة مستفيدين.",
    "beneficiaries:edit":   "ليس لديك صلاحية تعديل بيانات المستفيدين.",
    "beneficiaries:import": "ليس لديك صلاحية استيراد بيانات المستفيدين.",
    "settings:edit":        "إعدادات المنصة مقتصرة على مدير المنصة.",
    "users:view":           "إدارة المستخدمين مقتصرة على مدير المنصة.",
  };
  return messages[permission] ?? "ليس لديك صلاحية للوصول إلى هذا القسم.";
}
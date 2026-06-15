import { useAuth } from "@/lib/AuthContext";
import { hasPermission, normalizeRole } from "@/lib/rbac";

/**
 * Declarative RBAC guard — COSMETIC ONLY.
 *
 * Hides/shows UI elements based on the current user's role or permissions.
 * Does NOT enforce security — the backend entity RLS is the real gatekeeper.
 *
 * Usage:
 *   <Can role="ADMIN">...</Can>
 *   <Can roles={["ADMIN", "MANAGER"]}>...</Can>
 *   <Can permission="beneficiaries:edit">...</Can>
 */

export default function Can({ role, roles, permission, fallback = null, children }) {
  const { user } = useAuth();
  if (!user) return fallback;

  const allowedRoles = roles || (role ? [role] : null);
  if (allowedRoles && !allowedRoles.map(normalizeRole).includes(user.role)) {
    return fallback;
  }

  if (permission && !hasPermission(user, permission)) {
    return fallback;
  }

  return children;
}
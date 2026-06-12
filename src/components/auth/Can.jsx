import { useAuth } from "@/lib/AuthContext";
import { hasPermission } from "@/lib/rbac";

/**
 * Declarative RBAC guard.
 *
 * Usage:
 *   <Can role="ADMIN">...</Can>
 *   <Can roles={["ADMIN", "MANAGER"]}>...</Can>
 *   <Can permission="beneficiaries:edit">...</Can>
 *
 * The active role comes from the global AuthContext — to switch the auth
 * backend (e.g. Firebase Auth), only the AuthContext user source changes;
 * every <Can> guard keeps working untouched.
 */

// Friendly aliases → internal role keys
const ROLE_ALIASES = {
  ADMIN: "platform_admin",
  MANAGER: "ngo_manager",
  RESEARCHER: "researcher",
  MARKETER: "marketer",
  PDO: "pdo",
};

const normalizeRole = (r) => ROLE_ALIASES[r] || r;

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
import { ShieldCheck, Building2, Search, Megaphone, Lock } from "lucide-react";
import { getRoleColor, getRoleLabel, ROLE_ICONS } from "@/lib/rbac";
import { cn } from "@/lib/utils";

const ICON_COMPONENTS = {
  ShieldCheck,
  Building2,
  Search,
  Megaphone,
  Lock,
};

export default function RoleBadge({ role, size = "default" }) {
  const iconName = ROLE_ICONS[role] || "ShieldCheck";
  const Icon = ICON_COMPONENTS[iconName] ?? ShieldCheck;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        getRoleColor(role)
      )}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {getRoleLabel(role)}
    </span>
  );
}
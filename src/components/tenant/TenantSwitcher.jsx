import { Building2, Check, ChevronsUpDown, Layers } from "lucide-react";
import { useTenant } from "@/context/TenantContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function TenantSwitcher({ theme = "dark" }) {
  const { tenants, activeTenantId, activeTenant, setActiveTenant, canSwitchTenant, isLoading } =
    useTenant();

  if (!canSwitchTenant || isLoading || tenants.length === 0) return null;

  const isDark = theme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-2 px-3 h-9 text-xs font-medium rounded-lg border transition-colors",
            isDark
              ? "border-brand-green/30 text-white hover:bg-brand-green/10 hover:border-brand-green/60"
              : "border-brand-navy/20 text-brand-navy hover:bg-brand-navy/5"
          )}
        >
          <Layers className="w-3.5 h-3.5 text-brand-green" />
          <span className="max-w-[120px] truncate">
            {activeTenant ? activeTenant.name : "جميع المنظمات"}
          </span>
          <ChevronsUpDown className="w-3 h-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64" dir="rtl">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          تصفية حسب المنظمة (المستأجر)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setActiveTenant(null)}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            !activeTenantId && "bg-brand-green/10 text-brand-green font-semibold"
          )}
        >
          <Layers className="w-4 h-4" />
          <span>جميع المنظمات</span>
          {!activeTenantId && <Check className="w-4 h-4 mr-auto" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {tenants.map((tenant) => (
          <DropdownMenuItem
            key={tenant.id}
            onClick={() => setActiveTenant(tenant.id)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              activeTenantId === tenant.id && "bg-brand-green/10 text-brand-green font-semibold"
            )}
          >
            <Building2 className="w-4 h-4" />
            <span className="truncate">{tenant.name}</span>
            {tenant.city && (
              <span className="text-xs text-muted-foreground mr-auto">{tenant.city}</span>
            )}
            {activeTenantId === tenant.id && <Check className="w-4 h-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
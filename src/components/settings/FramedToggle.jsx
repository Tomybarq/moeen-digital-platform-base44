import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/**
 * A visually framed toggle with an icon/label on the left side
 * and a styled container around the Switch.
 */
export default function FramedToggle({ checked, onCheckedChange, label, activeLabel, inactiveLabel, activeIcon: ActiveIcon, inactiveIcon: InactiveIcon }) {
  const offLabel = inactiveLabel || "معطّل";
  const onLabel  = activeLabel   || "مفعّل";

  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2">
      {/* OFF label */}
      {ActiveIcon && InactiveIcon ? (
        <InactiveIcon className={cn("w-4 h-4 transition-colors", !checked ? "text-destructive/80" : "text-muted-foreground/50")} />
      ) : (
        <span className={cn(
          "text-xs font-medium transition-colors",
          !checked ? "text-destructive/80" : "text-muted-foreground/50"
        )}>
          {offLabel}
        </span>
      )}

      {/* Switch — the toggle between states */}
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="cursor-pointer" />

      {/* ON label */}
      {ActiveIcon && InactiveIcon ? (
        <ActiveIcon className={cn("w-4 h-4 transition-colors", checked ? "text-primary" : "text-muted-foreground/50")} />
      ) : (
        <span className={cn(
          "text-xs font-medium transition-colors",
          checked ? "text-primary" : "text-muted-foreground/50"
        )}>
          {onLabel}
        </span>
      )}
    </div>
  );
}
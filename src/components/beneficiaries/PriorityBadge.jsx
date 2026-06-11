import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowUp, Minus, ArrowDown } from "lucide-react";

const CONFIG = {
  "عاجل":    { icon: AlertTriangle, cls: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" },
  "مرتفع":   { icon: ArrowUp,       cls: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800" },
  "متوسط":   { icon: Minus,         cls: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800" },
  "منخفض":   { icon: ArrowDown,     cls: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" },
};

export default function PriorityBadge({ priority, size = "sm" }) {
  const cfg = CONFIG[priority] || CONFIG["متوسط"];
  const Icon = cfg.icon;
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full border font-medium",
      size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1",
      cfg.cls
    )}>
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {priority}
    </span>
  );
}
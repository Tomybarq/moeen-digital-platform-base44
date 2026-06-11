import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function StatCard({ title, value, icon: Icon, trend, trendLabel, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-2xl border border-border bg-card p-5 relative overflow-hidden group",
        className
      )}
    >
      {/* Brand accent bar */}
      <div className="absolute top-0 right-0 w-1 h-full rounded-r-2xl" style={{ background: "#c8972a" }} />
      <div className="absolute top-0 left-0 w-24 h-24 rounded-full -translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" style={{ background: "rgba(12,49,64,0.04)" }} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium font-body">{title}</p>
          <p className="text-3xl font-bold mt-2 font-display tabular-nums text-foreground">{value}</p>
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded-full",
                trend > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
              )}>
                {trend > 0 ? "+" : ""}{trend}%
              </span>
              {trendLabel && <span className="text-xs text-muted-foreground">{trendLabel}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(200,151,42,0.12)" }}>
            <Icon className="w-5 h-5" style={{ color: "#c8972a" }} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
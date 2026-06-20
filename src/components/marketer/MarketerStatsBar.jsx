import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Megaphone, Users, Target, TrendingUp, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    key: "ready",
    label: "حالات جاهزة للتسويق",
    value: 0,
    icon: Megaphone,
    color: "from-teal-500 to-teal-600",
    bg: "bg-teal-50 border-teal-200",
    iconBg: "bg-teal-100 text-teal-700",
  },
  {
    key: "funds",
    label: "إجمالي التبرعات المجموعة",
    value: 0,
    suffix: " ر.س",
    icon: TrendingUp,
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
    iconBg: "bg-emerald-100 text-emerald-700",
  },
  {
    key: "donors",
    label: "عدد المتبرعين",
    value: 0,
    icon: Users,
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100 text-blue-700",
  },
  {
    key: "target",
    label: "نسبة الإنجاز الشهرية",
    value: 0,
    suffix: "%",
    icon: Target,
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-50 border-amber-200",
    iconBg: "bg-amber-100 text-amber-700",
  },
];

function CountUp({ end, duration = 1.2, suffix = "" }) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  React.useEffect(() => {
    if (!inView || end === 0) return;
    let start = 0;
    const step = (end / (duration * 60)) | 0 || 1;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString("ar-SA")}{suffix}</span>;
}

export function MarketerStatsBar({ totalCases = 0, className }) {
  const hydrated = React.useMemo(() => {
    return stats.map(s => ({
      ...s,
      value: s.key === "ready" ? totalCases
        : s.key === "funds" ? totalCases * 1500
        : s.key === "donors" ? Math.round(totalCases * 0.8)
        : totalCases > 0 ? Math.min(100, Math.round((totalCases / 20) * 100)) : 0,
    }));
  }, [totalCases]);

  return (
    <div className={cn("grid grid-cols-2 xl:grid-cols-4 gap-4", className)}>
      {hydrated.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
            className={cn(
              "relative overflow-hidden rounded-2xl border p-5",
              "bg-white/80 backdrop-blur-sm",
              stat.bg
            )}
          >
            {/* Accent bar */}
            <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r", stat.color)} />
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-extrabold text-gray-800 tabular-nums">
                  <CountUp end={stat.value} suffix={stat.suffix || ""} />
                </p>
              </div>
              <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", stat.iconBg)}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default MarketerStatsBar;
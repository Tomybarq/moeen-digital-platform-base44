import { ShieldCheck, MapPinned, Lock } from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    label: "Secure & Compliant",
    ar: "آمن ومتوافق",
    gradient: "from-emerald-500/20 via-teal-500/15 to-cyan-500/20",
    glow: "rgba(16,185,129,0.3)",
    iconColor: "#10b981",
    border: "border-emerald-400/25",
  },
  {
    icon: MapPinned,
    label: "Saudi Arabia Focused",
    ar: "موجّه للسعودية",
    gradient: "from-amber-500/20 via-orange-400/15 to-yellow-500/20",
    glow: "rgba(245,158,11,0.3)",
    iconColor: "#f59e0b",
    border: "border-amber-400/25",
  },
  {
    icon: Lock,
    label: "Privacy by Design",
    ar: "الخصوصية أولاً",
    gradient: "from-indigo-500/20 via-violet-500/15 to-purple-500/20",
    glow: "rgba(99,102,241,0.3)",
    iconColor: "#6366f1",
    border: "border-indigo-400/25",
  },
];

export default function TrustBadges() {
  return (
    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end">
      {badges.map((b) => (
        <div
          key={b.label}
          className="group relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-full border bg-white/70 backdrop-blur-xl text-xs font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-default"
          style={{
            borderColor: "rgba(200,150,42,0.18)",
            boxShadow: "0 2px 12px rgba(12,49,64,0.04)",
          }}
        >
          {/* Animated gradient overlay on hover */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-r ${b.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />

          {/* Icon with glow */}
          <div className="relative z-10 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500"
              style={{
                backgroundColor: b.glow,
                width: 28,
                height: 28,
                left: -6,
                top: -6,
              }}
            />
            <b.icon
              className="w-4 h-4 relative z-10 transition-colors duration-300"
              style={{ color: b.iconColor }}
            />
          </div>

          {/* Text */}
          <div className="relative z-10 flex flex-col leading-none">
            <span
              className="text-[11px] font-semibold tracking-tight transition-colors duration-300 group-hover:text-brand-navy"
              style={{ color: "#1e3a5f" }}
            >
              {b.label}
            </span>
            <span className="text-[9px] text-gray-400 font-medium mt-0.5">
              {b.ar}
            </span>
          </div>

          {/* Gold dot separator */}
          <div
            className="hidden sm:block w-1 h-1 rounded-full relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ backgroundColor: "#c8972a" }}
          />
        </div>
      ))}
    </div>
  );
}
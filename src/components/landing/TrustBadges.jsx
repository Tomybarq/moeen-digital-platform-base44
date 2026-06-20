import { ShieldCheck, MapPinned, Lock } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "Secure & Compliant", ar: "آمن ومتوافق" },
  { icon: MapPinned, label: "Saudi Arabia Focused", ar: "موجّه للسعودية" },
  { icon: Lock, label: "Privacy by Design", ar: "الخصوصية أولاً" },
];

export default function TrustBadges() {
  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
      {badges.map((b) => (
        <div
          key={b.label}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border border-brand-gold/20 bg-white/80 backdrop-blur-sm text-xs font-medium text-brand-navy/80"
        >
          <b.icon className="w-3.5 h-3.5 text-brand-gold" />
          <span className="hidden sm:inline">{b.label}</span>
        </div>
      ))}
    </div>
  );
}
import { ShieldCheck, MapPin, Lock } from "lucide-react";

const badges = [
  { icon: ShieldCheck, label: "Secure & Compliant", ar: "آمن ومتوافق" },
  { icon: MapPin, label: "Saudi Arabia Focused", ar: "موجّه للسعودية" },
  { icon: Lock, label: "Privacy by Design", ar: "الخصوصية أولاً" },
];

export default function TrustBadges() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {badges.map((b) => (
        <div
          key={b.label}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/25 bg-white/60 backdrop-blur-sm text-xs font-medium text-brand-navy"
        >
          <b.icon className="w-3.5 h-3.5 text-brand-gold" />
          <span>{b.label}</span>
        </div>
      ))}
    </div>
  );
}
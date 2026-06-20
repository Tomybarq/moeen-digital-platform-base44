import { CheckCircle } from "lucide-react";

const points = [
  { en: "Tailored for NGOs & Researchers", ar: "مصممة خصيصاً للجمعيات والباحثين" },
  { en: "End-to-End Data Management", ar: "إدارة بيانات شاملة من البداية للنهاية" },
  { en: "Real-Time Reporting & Dashboards", ar: "تقارير ولوحات بيانات فورية" },
  { en: "Stronger Transparency & Accountability", ar: "شفافية ومساءلة أقوى" },
  { en: "Better Decisions. Greater Impact.", ar: "قرارات أفضل. أثر أكبر." },
];

export default function WhyMoeen() {
  return (
    <div className="text-center lg:text-right">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-2">
        Why Moeen Digital Platform?
      </h2>
      <p className="text-brand-gold font-semibold mb-10">لماذا منصة معين الرقمية؟</p>

      <div className="space-y-3">
        {points.map((p) => (
          <div
            key={p.en}
            className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-brand-gold/20 transition-colors"
          >
            <CheckCircle className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-brand-navy text-sm sm:text-base">{p.en}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{p.ar}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
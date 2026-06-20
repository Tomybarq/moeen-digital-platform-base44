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
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-navy text-center mb-10">
          Why Moeen Digital Platform?
          <span className="block text-lg font-medium text-brand-gold mt-1">لماذا منصة معين الرقمية؟</span>
        </h2>

        <div className="space-y-4">
          {points.map((p) => (
            <div key={p.en} className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <CheckCircle className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-brand-navy">{p.en}</p>
                <p className="text-sm text-gray-500 mt-0.5">{p.ar}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
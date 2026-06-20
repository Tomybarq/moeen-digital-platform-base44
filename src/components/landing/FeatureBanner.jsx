import { Handshake, Users, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Handshake,
    title: "Built for NGOs. Designed for Impact.",
    ar: "مبني للجمعيات. مصمم للأثر.",
  },
  {
    icon: Users,
    title: "Connect. Collaborate. Create Change.",
    ar: "تواصل. تعاون. اصنع التغيير.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted by Organizations. Driven by Data.",
    ar: "موثوق من المنظمات. مدفوع بالبيانات.",
  },
];

export default function FeatureBanner() {
  return (
    <section className="bg-brand-navy py-14 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div key={f.title} className="flex items-start gap-4 text-white">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/15 flex items-center justify-center shrink-0">
              <f.icon className="w-6 h-6 text-brand-gold" />
            </div>
            <div>
              <p className="font-bold text-base text-white">{f.title}</p>
              <p className="text-sm text-gray-400 mt-1">{f.ar}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
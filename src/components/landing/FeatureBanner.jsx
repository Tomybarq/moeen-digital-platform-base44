import { Handshake, UsersRound, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Handshake,
    title: "Built for NGOs. Designed for Impact.",
    ar: "مبني للجمعيات. مصمم للأثر.",
  },
  {
    icon: UsersRound,
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
    <section className="bg-brand-navy py-12 md:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`flex items-start gap-4 text-white px-4 ${
              i < 2 ? "md:border-l border-white/15" : ""
            }`}
          >
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
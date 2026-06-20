import { UserRound, Building2, HeartHandshake, ArrowLeftRight } from "lucide-react";

export default function ProcessFlow() {
  return (
    <div className="text-center lg:text-right">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-2">
        Transforming the Journey
      </h2>
      <p className="text-brand-gold font-semibold mb-10">تحويل الرحلة</p>

      <div className="flex flex-col md:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6">
        {/* Beneficiaries */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-brand-navy/5 border-2 border-brand-gold/30 flex items-center justify-center">
            <UserRound className="w-9 h-9 text-brand-navy" />
          </div>
          <h3 className="font-bold text-brand-navy">Beneficiaries</h3>
          <p className="text-xs text-gray-400">Real needs. Real stories.</p>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex items-center text-brand-gold">
          <ArrowLeftRight className="w-6 h-6 rotate-180" />
        </div>

        {/* Moeen Platform */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full bg-brand-navy flex items-center justify-center shadow-xl shadow-brand-navy/25">
            <Building2 className="w-10 h-10 text-brand-gold" />
          </div>
          <h3 className="font-bold text-brand-navy text-base">Moeen Digital Platform</h3>
          <p className="text-xs text-brand-gold font-medium">Collect • Analyze • Act</p>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex items-center text-brand-gold">
          <ArrowLeftRight className="w-6 h-6 rotate-180" />
        </div>

        {/* Donors */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-brand-navy/5 border-2 border-brand-gold/30 flex items-center justify-center">
            <HeartHandshake className="w-9 h-9 text-brand-navy" />
          </div>
          <h3 className="font-bold text-brand-navy">Donors</h3>
          <p className="text-xs text-gray-400">Real impact. Real change.</p>
        </div>
      </div>
    </div>
  );
}
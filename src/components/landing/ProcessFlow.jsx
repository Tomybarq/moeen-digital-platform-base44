import { Users, Building2, ArrowLeftRight } from "lucide-react";

export default function ProcessFlow() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-10">
          Transforming the Journey
          <span className="block text-lg font-medium text-brand-gold mt-1">تحويل الرحلة</span>
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          {/* Beneficiaries */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-brand-navy/5 border-2 border-brand-gold/30 flex items-center justify-center">
              <Users className="w-9 h-9 text-brand-navy" />
            </div>
            <h3 className="font-bold text-brand-navy">Beneficiaries</h3>
            <p className="text-xs text-gray-400">Real needs. Real stories.</p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center text-brand-gold">
            <ArrowLeftRight className="w-8 h-8 rotate-180" />
          </div>

          {/* Platform */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full bg-brand-navy flex items-center justify-center shadow-lg shadow-brand-navy/20">
              <Building2 className="w-10 h-10 text-brand-gold" />
            </div>
            <h3 className="font-bold text-brand-navy text-lg">Moeen Digital Platform</h3>
            <p className="text-xs text-brand-gold font-medium">Collect • Analyze • Act</p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center text-brand-gold">
            <ArrowLeftRight className="w-8 h-8 rotate-180" />
          </div>

          {/* Donors */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-brand-navy/5 border-2 border-brand-gold/30 flex items-center justify-center">
              <Users className="w-9 h-9 text-brand-navy" />
            </div>
            <h3 className="font-bold text-brand-navy">Donors</h3>
            <p className="text-xs text-gray-400">Real impact. Real change.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
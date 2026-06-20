import { ArrowLeft } from "lucide-react";

export default function FooterCTA() {
  return (
    <footer className="bg-brand-navy relative overflow-hidden">
      {/* Skyline silhouette */}
      <div className="absolute bottom-0 right-0 w-full h-32 opacity-[0.06] pointer-events-none">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 120 L0 60 L40 50 L70 65 L100 40 L130 58 L160 35 L190 50 L220 28 L250 42 L280 22 L310 38 L340 18 L370 32 L400 15 L430 28 L460 10 L490 22 L520 8 L550 20 L580 5 L610 18 L640 12 L670 22 L700 8 L730 16 L760 5 L790 18 L820 10 L850 20 L880 8 L910 16 L940 4 L970 14 L1000 6 L1030 18 L1060 10 L1090 20 L1120 6 L1150 14 L1180 5 L1210 16 L1240 8 L1270 18 L1300 4 L1330 12 L1360 5 L1390 14 L1410 6 L1440 10 L1440 120 Z" fill="#c8972a" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 text-center relative z-10">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-4 leading-tight">
          Join the Platform That Drives
          <br />
          <span className="text-brand-gold">Data. Connection. Impact.</span>
        </h2>
        <p className="text-gray-400 mb-8 text-sm">
          انضم إلى المنصة التي تقود البيانات والتواصل والأثر
        </p>

        <a
          href="https://www.moeendigital.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-white font-bold px-8 py-3.5 rounded-xl text-base shadow-xl shadow-brand-gold/20 transition-all hover:scale-105"
        >
          Request a Demo
          <ArrowLeft className="w-5 h-5" />
        </a>

        <p className="text-gray-500 text-xs mt-6">www.moeendigital.com</p>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>Built with Vision</span>
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <img
              src="https://media.base44.com/images/public/6a2aca9f283d77c33f77ff49/9af41b6fb_logo-.jpg"
              alt="معين"
              className="h-6 w-auto object-contain"
            />
            <span className="text-brand-gold text-lg font-display">معين</span>
            <span className="hidden sm:inline">الرقمية التجارية</span>
          </div>
          <span>جميع الحقوق محفوظة &copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
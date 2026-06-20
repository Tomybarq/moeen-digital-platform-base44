import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function FooterCTA() {
  return (
    <footer className="bg-brand-navy relative overflow-hidden">
      {/* Skyline silhouette */}
      <div className="absolute bottom-0 right-0 w-64 h-40 opacity-10 pointer-events-none">
        <svg viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120 L0 80 L20 70 L35 85 L50 55 L65 75 L80 40 L95 65 L110 50 L125 70 L140 45 L155 60 L170 35 L185 55 L200 30 L215 50 L230 25 L245 45 L260 20 L275 40 L290 15 L305 35 L320 10 L320 120 Z" fill="#c8972a" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14 text-center relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Join the Platform That Drives
          <br />
          <span className="text-brand-gold">Data. Connection. Impact.</span>
        </h2>
        <p className="text-gray-400 mb-8 text-sm">
          انضم إلى المنصة التي تقود البيانات والتواصل والأثر
        </p>

        <Button
          size="lg"
          className="bg-brand-gold hover:bg-brand-gold-light text-white font-bold px-8 py-6 rounded-xl text-base shadow-lg shadow-brand-gold/20 transition-all hover-lift"
        >
          Request a Demo
          <ArrowLeft className="w-5 h-5 mr-1" />
        </Button>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>Built with Vision</span>
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <span className="text-brand-gold text-xl font-display">معين</span>
            <span className="hidden md:inline">الرقمية التجارية</span>
          </div>
          <span>www.moeendigital.com</span>
        </div>
      </div>
    </footer>
  );
}
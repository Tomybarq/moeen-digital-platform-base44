import { motion } from "framer-motion";
import { ClipboardList, BarChart3, UsersRound, Lock } from "lucide-react";
import TrustBadges from "@/components/landing/TrustBadges";
import FeatureBanner from "@/components/landing/FeatureBanner";
import ProcessFlow from "@/components/landing/ProcessFlow";
import WhyMoeen from "@/components/landing/WhyMoeen";
import FooterCTA from "@/components/landing/FooterCTA";

const heroFeatures = [
  {
    icon: ClipboardList,
    title: "Smart Data Collection",
    ar: "جمع البيانات الذكي",
    desc: "Streamlined forms and field surveys for researchers to capture beneficiary data accurately and efficiently."
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    ar: "تحليلات فورية",
    desc: "Live dashboards and reports that turn raw data into actionable insights for decision-makers."
  },
  {
    icon: UsersRound,
    title: "Bridge the Gap",
    ar: "سد الفجوة",
    desc: "Connecting beneficiaries with donors through transparent, verified, and impactful case management."
  },
  {
    icon: Lock,
    title: "Secure & Compliant",
    ar: "آمن ومتوافق",
    desc: "Enterprise-grade security with full compliance to Saudi data protection and privacy regulations."
  }
];

export default function LandingPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#fcfcfc] font-body">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="https://media.base44.com/images/public/6a2aca9f283d77c33f77ff49/9af41b6fb_logo-.jpg"
              alt="معين الرقمية التجارية"
              className="h-10 w-auto object-contain"
            />
            <div className="leading-tight hidden sm:block">
              <p className="font-display font-bold text-brand-navy text-sm">منصة معين الرقمية</p>
              <p className="text-[9px] text-gray-400 tracking-wide">MOEEN DIGITAL TRADING</p>
            </div>
          </div>

          {/* Trust Badges */}
          <TrustBadges />
        </div>
      </header>

      {/* ── Hero Section (Split: Text + Device Mockups) ── */}
      <section className="py-8 md:py-14 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left: Text + Features */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-8 text-center lg:text-right"
            >
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-brand-navy leading-tight tracking-tight">
                  Moeen Digital{" "}
                  <span className="text-brand-gold">Platform</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl font-semibold text-brand-gold leading-relaxed">
                  Empowering NGOs & Social Researchers to Collect Data and Transform Lives
                </p>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  A smart B2B platform that connects Beneficiaries and Donors through
                  secure data, real-time insights, and measurable impact.
                </p>
              </div>

              {/* 4 Feature Cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0">
                {heroFeatures.map((f) => (
                  <div
                    key={f.title}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:border-brand-gold/30 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-navy flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <f.icon className="w-5 h-5 text-brand-gold" />
                    </div>
                    <h3 className="font-bold text-sm text-brand-navy mb-1">{f.title}</h3>
                    <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Device Mockups */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative flex items-center justify-center"
            >
              {/* Decorative glow */}
              <div className="absolute inset-0 bg-brand-gold/5 blur-3xl rounded-full scale-75" />

              {/* Desktop Monitor Mockup */}
              <div className="relative z-10">
                <div className="bg-white rounded-2xl shadow-2xl shadow-brand-navy/10 border border-gray-100 p-2 sm:p-3 max-w-md lg:max-w-lg">
                  {/* Screen content */}
                  <div className="bg-[#f8fafc] rounded-xl overflow-hidden border border-gray-100">
                    {/* Mock browser bar */}
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border-b border-gray-100">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      <div className="flex-1 mx-3 h-5 bg-white rounded-md border border-gray-200" />
                    </div>
                    {/* Mock dashboard content */}
                    <div className="p-3 sm:p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-navy flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-brand-gold" />
                        </div>
                        <div>
                          <div className="h-3 w-24 bg-brand-navy/80 rounded" />
                          <div className="h-2 w-16 bg-gray-200 rounded mt-1" />
                        </div>
                      </div>
                      {/* Mock charts */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 bg-white rounded-lg border border-gray-100 p-2">
                          <div className="flex items-end gap-1 h-16">
                            {[60, 35, 80, 45, 70, 55, 90].map((h, i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-sm bg-brand-navy/15"
                                style={{ height: `${h}%` }}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-100 p-2 flex flex-col justify-center items-center gap-1">
                          <div className="w-10 h-10 rounded-full border-4 border-brand-green/30 border-t-brand-green" />
                          <div className="h-2 w-12 bg-gray-200 rounded" />
                        </div>
                      </div>
                      {/* Mock table */}
                      <div className="space-y-1.5">
                        {[80, 65, 90, 50].map((w, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-brand-navy/10" />
                            <div className="h-2 rounded bg-gray-200" style={{ width: `${w}%` }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone Mockup — offset right */}
                <div className="absolute -bottom-4 -right-3 sm:-right-6 z-20 hidden sm:block">
                  <div className="bg-white rounded-2xl shadow-xl shadow-brand-navy/15 border-2 border-gray-200 p-1.5 w-28 sm:w-32">
                    <div className="bg-[#f8fafc] rounded-xl overflow-hidden">
                      <div className="bg-brand-navy px-2 py-1.5 flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-brand-gold" />
                        <div className="h-1.5 w-10 bg-brand-navy/50 rounded" />
                      </div>
                      <div className="p-2 space-y-2">
                        <div className="h-1.5 w-16 bg-gray-200 rounded" />
                        <div className="space-y-1">
                          <div className="h-1 w-full bg-gray-200 rounded" />
                          <div className="h-1 w-4/5 bg-gray-200 rounded" />
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="h-5 bg-brand-green/15 rounded" />
                          <div className="h-5 bg-brand-navy/10 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Feature Banner (Dark Navy Mission Strip) ── */}
      <FeatureBanner />

      {/* ── Two Column Section: Process Flow + Why Moeen ── */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <ProcessFlow />
            <WhyMoeen />
          </div>
        </div>
      </section>

      {/* ── Saudi Arabia Map Section ── */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-[#f8f9fb] relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Map visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-sm">
                {/* Saudi Map silhouette */}
                <div className="w-full aspect-[3/4] relative">
                  <svg viewBox="0 0 200 260" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    {/* Saudi Arabia rough outline */}
                    <path
                      d="M100 20 C130 18 155 35 165 55 C175 78 178 100 170 120 C162 140 150 150 140 158 C128 168 118 172 110 175 C102 178 95 182 90 190 C84 200 80 210 78 220 C76 230 78 245 85 252 C92 258 110 260 120 258 C130 256 138 250 145 242 C152 234 155 220 155 210 C155 200 150 192 145 182 C140 172 138 165 140 158 C142 150 148 145 152 138 C156 130 158 120 155 110 C152 100 145 92 135 88 C125 84 112 82 100 85 C88 88 78 95 72 105 C66 115 63 128 62 140 C60 152 60 162 62 170 C64 178 68 182 72 175 C76 168 78 158 78 150"
                      fill="#c8972a"
                      fillOpacity="0.12"
                      stroke="#c8972a"
                      strokeWidth="2"
                    />
                    {/* Pin dots on major cities */}
                    <circle cx="100" cy="110" r="5" fill="#c8972a" stroke="#0c3140" strokeWidth="1.5" />
                    <circle cx="85" cy="85" r="3.5" fill="#c8972a" stroke="#0c3140" strokeWidth="1" />
                    <circle cx="115" cy="130" r="3.5" fill="#c8972a" stroke="#0c3140" strokeWidth="1" />
                    <circle cx="70" cy="140" r="3.5" fill="#c8972a" stroke="#0c3140" strokeWidth="1" />
                    {/* Map pin shape marker */}
                    <path d="M100 105 C97 102 94 102 93 104 C91 107 92 111 95 114 L100 120 L105 114 C108 111 109 107 107 104 C106 102 103 102 100 105Z" fill="#0c3140" />
                  </svg>
                </div>
                {/* Decorative skyline */}
                <div className="absolute bottom-0 left-0 right-0 h-16 opacity-40">
                  <svg viewBox="0 0 320 60" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 60 L0 30 L15 25 L25 35 L40 20 L50 32 L65 18 L75 28 L90 15 L100 25 L115 12 L125 22 L140 10 L150 20 L165 8 L175 18 L190 5 L200 15 L215 3 L225 13 L240 8 L250 18 L265 5 L275 15 L290 3 L300 12 L310 6 L320 10 L320 60 Z" fill="#0c3140" />
                  </svg>
                </div>
                {/* Palm trees */}
                <div className="absolute bottom-2 left-8 text-3xl">🌴</div>
                <div className="absolute bottom-3 left-2 text-2xl">🌴</div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center lg:text-right"
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-4">
                Serving NGOs Across Saudi Arabia
              </h2>
              <p className="text-brand-gold font-semibold text-lg mb-4">
                نخدم الجمعيات في جميع أنحاء المملكة العربية السعودية
              </p>
              <p className="text-gray-500 leading-relaxed text-sm sm:text-base max-w-md mx-auto lg:mx-0">
                From Riyadh to Jeddah, Dammam to Abha — our platform empowers
                charitable organizations and social researchers across every
                region of the Kingdom, bridging the gap between those in need
                and those who can help.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6 max-w-sm mx-auto lg:mx-0">
                {[
                  { num: "13+", label: "Regions" },
                  { num: "24", label: "Active NGOs" },
                  { num: "1.2K+", label: "Beneficiaries" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-2xl font-bold text-brand-navy">{s.num}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <FooterCTA />
    </div>
  );
}
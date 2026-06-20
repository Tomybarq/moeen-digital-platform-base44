import { motion } from "framer-motion";
import { useState } from "react";
import { ClipboardList, BarChart3, UsersRound, Lock, LogIn } from "lucide-react";
import SignInModal from "@/components/landing/SignInModal";
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
  const [signInOpen, setSignInOpen] = useState(false);

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

          {/* Trust Badges + Sign In */}
          <div className="flex items-center gap-3">
            <TrustBadges />
            <button
              onClick={() => setSignInOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-navy text-white text-sm font-medium hover:bg-brand-navy/90 transition-all shadow-md shadow-brand-navy/20"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">تسجيل الدخول</span>
            </button>
          </div>
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

              {/* Desktop Monitor Mockup — Gold-Rim Premium */}
              <div className="relative z-10">
                <div
                  className="rounded-2xl p-[4px] max-w-md lg:max-w-lg relative"
                  style={{
                    background: "linear-gradient(145deg, #d4a83a, #c8972a, #b8861e, #c8972a)",
                    boxShadow: "0 25px 60px -15px rgba(12, 49, 64, 0.3), 0 0 0 1px rgba(200, 150, 42, 0.2)",
                  }}
                >
                  {/* Inner screen */}
                  <div className="bg-white rounded-[14px] overflow-hidden border border-gray-100">
                    {/* Browser bar */}
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-white border-b border-gray-100">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      <div className="flex-1 mx-2 h-5 bg-gray-50 rounded-md border border-gray-100" />
                      <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded bg-brand-gold/30" />
                        <div className="h-2.5 w-5 bg-gray-100 rounded-sm" />
                      </div>
                    </div>

                    {/* Dashboard content */}
                    <div className="p-3 sm:p-4 space-y-2.5 bg-white">
                      {/* Header row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-brand-navy flex items-center justify-center">
                            <BarChart3 className="w-3.5 h-3.5 text-brand-gold" />
                          </div>
                          <div>
                            <div className="h-2.5 w-24 bg-brand-navy/80 rounded-sm" />
                            <div className="h-2 w-12 bg-gray-200 rounded-sm mt-0.5" />
                          </div>
                        </div>
                        <div className="h-4 px-2 rounded-full bg-brand-green/15 flex items-center">
                          <span className="text-[8px] font-bold text-brand-green">LIVE</span>
                        </div>
                      </div>

                      {/* Charts row */}
                      <div className="grid grid-cols-3 gap-2">
                        {/* Bar chart — dark navy card */}
                        <div className="col-span-2 bg-brand-navy rounded-xl p-2.5 flex flex-col gap-1">
                          <div className="flex items-end gap-1 h-14 relative">
                            {[60, 35, 80, 45, 70, 55, 90].map((h, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-0.5 justify-end h-full">
                                <span className="text-[7px] font-medium text-brand-gold/70">{h}%</span>
                                <div className="w-full rounded-t-[3px] bg-brand-gold" style={{ height: `${h}%` }} />
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-center gap-2 mt-0.5">
                            <div className="flex items-center gap-0.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                              <span className="text-[7px] text-gray-400">Revenue</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-green/50" />
                              <span className="text-[7px] text-gray-400">Cases</span>
                            </div>
                          </div>
                        </div>

                        {/* Donut chart — dark navy card */}
                        <div className="bg-brand-navy rounded-xl p-2 flex flex-col items-center justify-center gap-1.5">
                          <div className="relative w-9 h-9">
                            <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                              <circle cx="20" cy="20" r="15" fill="none" stroke="#00A651" strokeWidth="5" strokeDasharray="28 66" />
                              <circle cx="20" cy="20" r="15" fill="none" stroke="#c8972a" strokeWidth="5" strokeDasharray="19 75" strokeDashoffset="-28" />
                              <circle cx="20" cy="20" r="15" fill="none" stroke="#334155" strokeWidth="5" strokeDasharray="47 47" strokeDashoffset="-47" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[7px] font-bold text-white">72%</span>
                            </div>
                          </div>
                          <span className="text-[7px] text-gray-400">Completion</span>
                        </div>
                      </div>

                      {/* Table rows */}
                      <div className="space-y-1">
                        {[
                          { label: "Cases Reviewed", pct: 80, color: "#c8972a" },
                          { label: "Donors Active", pct: 65, color: "#00A651" },
                          { label: "Reports Generated", pct: 90, color: "#c8972a" },
                          { label: "NGOs Onboarded", pct: 50, color: "#00A651" },
                        ].map((row, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-brand-navy/15" />
                            <div className="flex-1 h-2 bg-gray-100 rounded-sm overflow-hidden">
                              <div
                                className="h-full rounded-sm transition-all"
                                style={{
                                  width: `${row.pct}%`,
                                  backgroundColor: row.color,
                                }}
                              />
                            </div>
                            <span className="text-[8px] font-medium text-gray-400 w-6 text-right">{row.pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3D Floating Phone Mockup */}
                <div className="absolute -bottom-6 -right-4 sm:-right-8 z-20 hidden sm:block">
                  <div
                    className="bg-white rounded-[20px] w-32 sm:w-36 p-[3px] relative"
                    style={{
                      boxShadow: "0 20px 50px -12px rgba(12, 49, 64, 0.35), 0 0 0 2.5px #c8972a, 0 0 0 5px rgba(200, 150, 42, 0.15)",
                      transform: "rotate(-3deg) translateY(-4px)",
                    }}
                  >
                    {/* Screen */}
                    <div className="bg-white rounded-[17px] overflow-hidden">
                      {/* Status bar */}
                      <div className="bg-white px-3 py-1.5 flex items-center justify-between">
                        <div className="h-1 w-12 bg-brand-navy rounded-sm" />
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                          <div className="w-1 h-1 rounded-full bg-gray-300" />
                          <div className="w-1 h-1 rounded-full bg-gray-300" />
                        </div>
                      </div>

                      {/* Dashboard widgets */}
                      <div className="px-2.5 pb-2.5 space-y-2">
                        {/* Title row */}
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                          <div className="h-1.5 w-14 bg-gray-200 rounded-sm" />
                        </div>

                        {/* Charts row */}
                        <div className="grid grid-cols-7 gap-1">
                          {/* Donut chart */}
                          <div className="col-span-3 bg-brand-navy rounded-lg p-1.5 flex flex-col items-center gap-1">
                            {/* Donut */}
                            <div className="relative w-7 h-7">
                              <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
                                <circle cx="16" cy="16" r="12" fill="none" stroke="#c8972a" strokeWidth="7" strokeDasharray="18 57" />
                                <circle cx="16" cy="16" r="12" fill="none" stroke="#00bfff" strokeWidth="7" strokeDasharray="12 63" strokeDashoffset="-18" />
                                <circle cx="16" cy="16" r="12" fill="none" stroke="#98E2A7" strokeWidth="7" strokeDasharray="25 50" strokeDashoffset="-30" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                              </div>
                            </div>
                          </div>

                          {/* Bar chart */}
                          <div className="col-span-4 bg-gray-50 rounded-lg p-1.5 flex flex-col gap-1">
                            <div className="flex items-end gap-[2px] h-7">
                              {[40, 65, 30, 85, 55, 70, 45, 60, 50, 80, 35, 90].map((h, i) => (
                                <div
                                  key={i}
                                  className="flex-1 rounded-t-[1px]"
                                  style={{
                                    height: `${h}%`,
                                    background: i % 3 === 0 ? "#00A651" : i % 3 === 1 ? "#c8972a" : "#e5e7eb",
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Text blocks */}
                        <div className="space-y-1">
                          <div className="h-1 w-full bg-gray-100 rounded-sm" />
                          <div className="h-1 w-11/12 bg-gray-100 rounded-sm" />
                          <div className="h-1 w-9/12 bg-gray-100 rounded-sm" />
                        </div>

                        {/* Highlight block */}
                        <div className="bg-brand-green/20 rounded-md h-5" />

                        {/* Bottom bar */}
                        <div className="bg-brand-navy rounded-md h-4" />
                      </div>
                    </div>

                    {/* Bottom home indicator */}
                    <div className="flex justify-center pb-1.5 pt-0.5">
                      <div className="w-8 h-1 bg-gray-300 rounded-full" />
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

      {/* ── Saudi Arabia Map Section — Dark Immersive ── */}
      <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: "#0a232c" }}>
        {/* Subtle radial glow behind map area */}
        <div
          className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle, #c8972a 0%, transparent 70%)" }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Map visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-sm">
                {/* Map container with gold glow border */}
                <div
                  className="w-full aspect-[4/5] relative rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(12, 49, 64, 0.5)",
                    boxShadow: "0 0 40px rgba(200, 150, 42, 0.2), 0 0 80px rgba(200, 150, 42, 0.08), inset 0 0 60px rgba(12, 49, 64, 0.3)",
                    border: "1.5px solid rgba(200, 150, 42, 0.35)",
                  }}
                >
                  {/* Map silhouette */}
                  <img
                    src="https://media.base44.com/images/public/6a2aca9f283d77c33f77ff49/945b4a89f_generated_image.png"
                    alt="خريطة المملكة العربية السعودية"
                    className="w-full h-full object-contain p-4"
                    style={{ filter: "drop-shadow(0 0 15px rgba(200, 150, 42, 0.3))" }}
                  />
                </div>

                {/* Decorative gold skyline */}
                <div className="absolute -bottom-1 left-0 right-0 h-12 pointer-events-none" style={{ opacity: 0.5 }}>
                  <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 80 L0 40 L20 32 L40 45 L55 28 L70 40 L90 22 L105 35 L120 18 L140 30 L155 15 L170 25 L185 10 L200 22 L215 8 L230 18 L245 5 L260 15 L275 8 L290 18 L305 4 L320 12 L335 8 L350 16 L365 6 L380 14 L395 5 L400 10 L400 80 Z" fill="#c8972a" />
                  </svg>
                </div>

                {/* Palm tree silhouettes */}
                <div className="absolute -bottom-1 right-4 text-4xl pointer-events-none select-none" style={{ filter: "brightness(0) saturate(100%) invert(64%) sepia(33%) saturate(702%) hue-rotate(5deg) brightness(92%) contrast(90%)", opacity: 0.7 }}>🌴</div>
                <div className="absolute -bottom-1 right-20 text-3xl pointer-events-none select-none" style={{ filter: "brightness(0) saturate(100%) invert(64%) sepia(33%) saturate(702%) hue-rotate(5deg) brightness(92%) contrast(90%)", opacity: 0.7 }}>🌴</div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center lg:text-right"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-5 leading-tight">
                Serving <span className="text-brand-gold">NGOs</span> Across <span className="text-brand-gold">Saudi Arabia</span>
              </h2>
              <p className="text-lg mb-4" style={{ color: "#d4af37", opacity: 0.85 }}>
                نخدم الجمعيات في جميع أنحاء المملكة العربية السعودية
              </p>
              <p className="text-white/65 leading-relaxed text-sm sm:text-base max-w-md mx-auto lg:mx-0 mb-8">
                From Riyadh to Jeddah, Dammam to Abha — our platform empowers
                charitable organizations and social researchers across every
                region of the Kingdom, bridging the gap between those in need
                and those who can help.
              </p>

              {/* Metric cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-sm mx-auto lg:mx-0">
                {[
                  { num: "13+", label: "Regions" },
                  { num: "24", label: "Active NGOs" },
                  { num: "1.2K+", label: "Beneficiaries" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="text-center rounded-xl py-4 px-2"
                    style={{
                      background: "linear-gradient(180deg, rgba(200,150,42,0.08) 0%, rgba(12,49,64,0.3) 100%)",
                      border: "1px solid rgba(200,150,42,0.2)",
                    }}
                  >
                    <p className="text-2xl sm:text-3xl font-bold text-brand-gold">{s.num}</p>
                    <p className="text-[11px] sm:text-xs text-white/50 mt-1.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <FooterCTA />

      {/* ── Sign In Modal ── */}
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  );
}
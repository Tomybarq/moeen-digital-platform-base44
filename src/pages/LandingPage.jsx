import { motion } from "framer-motion";
import { FileText, BarChart3, Users, Lock } from "lucide-react";
import TrustBadges from "@/components/landing/TrustBadges";
import SignInCard from "@/components/landing/SignInCard";
import FeatureBanner from "@/components/landing/FeatureBanner";
import ProcessFlow from "@/components/landing/ProcessFlow";
import WhyMoeen from "@/components/landing/WhyMoeen";
import FooterCTA from "@/components/landing/FooterCTA";

const heroFeatures = [
{
  icon: FileText,
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
  icon: Users,
  title: "Bridge the Gap",
  ar: "سد الفجوة",
  desc: "Connecting beneficiaries with donors through transparent, verified, and impactful case management."
},
{
  icon: Lock,
  title: "Secure & Compliant",
  ar: "آمن ومتوافق",
  desc: "Enterprise-grade security with full compliance to Saudi data protection and privacy regulations."
}];


export default function LandingPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-white font-body">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <img
                src="https://media.base44.com/images/public/6a2aca9f283d77c33f77ff49/9af41b6fb_logo-.jpg"
                alt="معين الرقمية التجارية"
                className="h-9 w-auto object-contain"
              />
              <div className="leading-tight">
                <p className="font-display font-bold text-brand-navy text-sm">منصة معين الرقمية</p>
                <p className="text-[9px] text-gray-400 tracking-wide">MOEEN DIGITAL TRADING</p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <TrustBadges />
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="py-10 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Text + Features */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-8 text-center lg:text-right">
              
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-brand-navy leading-tight">
                  Moeen Digital{" "}
                  <span className="text-brand-gold">Platform</span>
                </h1>
                <p className="text-lg md:text-xl font-semibold text-brand-navy/80">
                  Empowering NGOs & Social Researchers to Collect Data and Transform Lives
                </p>
                <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  A smart B2B platform that connects Beneficiaries and Donors through
                  secure data, real-time insights, and measurable impact.
                </p>
                <p className="text-sm text-brand-gold font-medium">
                  منصة ذكية تربط المستفيدين بالمتبرعين عبر بيانات آمنة ورؤى فورية وأثر قابل للقياس
                </p>
              </div>

              {/* Feature grid */}
              <div className="grid grid-cols-2 gap-4">
                {heroFeatures.map((f) =>
                <div
                  key={f.title}
                  className="bg-slate-50 rounded-2xl p-4 border border-gray-100 hover:border-brand-gold/30 transition-all hover-lift">
                  
                    <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center mb-3">
                      <f.icon className="w-5 h-5 text-brand-gold" />
                    </div>
                    <h3 className="font-bold text-sm text-brand-navy mb-1">{f.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right: Sign-In Card */}
            <div className="order-first lg:order-last">
              <SignInCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Banner ── */}
      <FeatureBanner />

      {/* ── Process Flow ── */}
      <ProcessFlow />

      {/* ── Why Moeen ── */}
      <WhyMoeen />

      {/* ── Footer CTA ── */}
      <FooterCTA />
    </div>);

}
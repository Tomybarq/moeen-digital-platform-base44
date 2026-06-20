import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ShieldAlert, ShieldCheck, MapPin, MapPinned } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // TODO: Connect via @/api/coreClient using MoeenCloudAdapter to authenticate with Moeen Cloud Engine.
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const trustBadges = [
    { icon: ShieldCheck, label: "Secure & Compliant", ar: "آمن ومتوافق" },
    { icon: MapPinned, label: "Saudi Arabia Focused", ar: "مركز على المملكة" },
    { icon: ShieldAlert, label: "Privacy by Design", ar: "الخصوصية أولاً" },
  ];

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-[#f4f6f9] font-body">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="https://media.base44.com/images/public/6a2aca9f283d77c33f77ff49/9af41b6fb_logo-.jpg"
              alt="معين الرقمية التجارية"
              className="h-9 w-auto object-contain"
            />
            <div className="leading-tight hidden sm:block">
              <p className="font-display font-bold text-[#0c3140] text-sm">منصة معين الرقمية</p>
              <p className="text-[9px] text-gray-400 tracking-wide">MOEEN DIGITAL TRADING</p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            {trustBadges.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#f0f3f7] border border-gray-100 text-xs text-[#0c3140]/70 whitespace-nowrap"
              >
                <b.icon className="w-3.5 h-3.5 text-[#c8972a]" />
                <span className="hidden sm:inline">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* ── Right Column: Branding ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8 text-center lg:text-right order-2 lg:order-1"
          >
            {/* Logo — glass card */}
            <div className="flex justify-center lg:justify-start">
              <div className="rounded-3xl p-5 inline-flex items-center justify-center bg-white/70 backdrop-blur-xl shadow-xl shadow-[#0c3140]/8 border border-[#c8972a]/15">
                <img
                  src="https://media.base44.com/images/public/6a2aca9f283d77c33f77ff49/9af41b6fb_logo-.jpg"
                  alt="معين الرقمية التجارية"
                  className="h-20 sm:h-24 w-auto object-contain"
                />
              </div>
            </div>

            {/* Headlines */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-tight text-[#0c3140]">
                Moeen Digital{" "}
                <span className="text-[#c8972a]">Platform</span>
              </h1>
              <p className="text-base sm:text-lg font-semibold text-[#0c3140]/80">
                Empowering NGOs & Social Researchers to Collect Data and Transform Lives
              </p>
              <p className="text-sm text-[#c8972a] font-medium">
                منصة ذكية تربط المستفيدين بالمتبرعين عبر بيانات آمنة ورؤى فورية وأثر قابل للقياس
              </p>
              <p className="text-sm leading-relaxed text-gray-500 max-w-md mx-auto lg:mx-0">
                A smart B2B platform that connects Beneficiaries and Donors through secure data, real-time insights, and measurable impact.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto lg:mx-0">
              {[
                { label: "جمعية نشطة", value: "٢٤" },
                { label: "مستفيد مسجّل", value: "١٬٢٤٨" },
                { label: "باحث ميداني", value: "٨٧" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl p-3 text-center bg-[#0c3140]/5"
                >
                  <p className="text-xl font-bold text-[#0c3140]">{stat.value}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* 4 Feature Icons */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto lg:mx-0">
              {[
                { icon: "📋", title: "Smart Data Collection", ar: "جمع البيانات الذكي" },
                { icon: "📊", title: "Real-Time Analytics", ar: "تحليلات فورية" },
                { icon: "🤝", title: "Bridge the Gap", ar: "سد الفجوة" },
                { icon: "🔒", title: "Secure & Compliant", ar: "آمن ومتوافق" },
              ].map((f) => (
                <div
                  key={f.title}
                  className="bg-slate-50 rounded-2xl p-4 border border-gray-100 hover:border-[#c8972a]/30 transition-all hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0c3140] flex items-center justify-center mb-3">
                    <span className="text-lg">{f.icon}</span>
                  </div>
                  <h3 className="font-bold text-sm text-[#0c3140] mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-400">{f.ar}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Left Column: Sign-In Card ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="order-1 lg:order-2"
          >
            <div className="bg-white rounded-3xl shadow-2xl shadow-black/[0.08] p-6 sm:p-8 border border-gray-100">
              {/* Card header */}
              <div className="mb-6 sm:mb-7 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#0c3140] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#0c3140]/20">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#0c3140]">تسجيل الدخول</h2>
                <p className="text-sm text-gray-400 mt-1">أدخل بياناتك للوصول إلى المنصة</p>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex items-start gap-2 p-3 rounded-xl text-sm bg-red-50 border border-red-200 text-red-600"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#0c3140]">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      autoComplete="email"
                      autoFocus
                      placeholder="example@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pr-10 pl-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-[#0c3140] text-sm outline-none transition-all focus:border-[#c8972a] focus:ring-1 focus:ring-[#c8972a]/30"
                      style={{ direction: "ltr", textAlign: "left" }}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-[#0c3140]">كلمة المرور</label>
                    <Link to="/forgot-password" className="text-xs text-[#c8972a] hover:underline transition-colors">
                      نسيت كلمة المرور؟
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type={showPass ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 pr-10 pl-10 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-[#0c3140] text-sm outline-none transition-all focus:border-[#c8972a] focus:ring-1 focus:ring-[#c8972a]/30"
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPass(!showPass)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={remember}
                    onClick={() => setRemember(!remember)}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                      remember
                        ? "bg-[#0c3140] border-[#0c3140]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {remember && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <label
                    onClick={() => setRemember(!remember)}
                    className="text-sm text-gray-500 cursor-pointer select-none"
                  >
                    تذكرني
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl font-bold text-white text-sm transition-all mt-2 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  style={{
                    background: loading
                      ? "#8aadbc"
                      : "linear-gradient(135deg, #0c3140 0%, #1a5470 100%)",
                    boxShadow: "0 4px 20px rgba(12,49,64,0.35)",
                  }}
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />جاري الدخول…</>
                  ) : (
                    "دخول"
                  )}
                </button>
              </form>

              {/* Warning notice */}
              <div className="mt-6 flex items-start gap-2 rounded-xl p-3 text-xs leading-relaxed bg-[#c8972a]/[0.08] border border-[#c8972a]/25">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#c8972a]" />
                <span className="text-gray-500">
                  هذه المنصة خاصة للجمعيات الخيرية ومشاريع البحوث الاجتماعية، تواصل مع مدير المنصة للدخول.
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-4 text-center text-xs text-gray-400 bg-white border-t border-gray-100">
        جميع الحقوق محفوظة — مؤسسة معين الرقمية التجارية &copy; {new Date().getFullYear()} —{" "}
        <span className="text-[#c8972a]">www.moeendigital.com</span>
      </footer>
    </div>
  );
}
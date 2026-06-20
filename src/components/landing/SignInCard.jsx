import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function SignInCard() {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-3xl shadow-2xl shadow-black/10 p-8 border border-gray-100"
    >
      {/* Card header */}
      <div className="mb-7 text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md bg-brand-navy">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-brand-navy">تسجيل الدخول</h2>
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
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-brand-navy">البريد الإلكتروني</Label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pr-10 pl-4 h-11 rounded-xl border-gray-200 bg-slate-50 text-brand-navy focus-visible:ring-brand-gold ltr text-left"
              dir="ltr"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-brand-navy">كلمة المرور</Label>
            <Link to="/forgot-password" className="text-xs text-brand-gold hover:underline">
              نسيت كلمة المرور؟
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10 pl-10 h-11 rounded-xl border-gray-200 bg-slate-50 text-brand-navy focus-visible:ring-brand-gold"
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
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={setRemember}
            className="border-gray-300 data-[state=checked]:bg-brand-navy data-[state=checked]:border-brand-navy"
          />
          <Label htmlFor="remember" className="text-sm text-gray-500 cursor-pointer">
            تذكرني
          </Label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl font-bold text-white text-sm bg-brand-navy hover:bg-brand-navy-dark shadow-lg shadow-brand-navy/25 transition-all"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />جاري الدخول…</>
          ) : (
            "دخول"
          )}
        </Button>
      </form>

      {/* Warning notice */}
      <div className="mt-6 flex items-start gap-2 rounded-xl p-3 text-xs leading-relaxed bg-brand-gold/8 border border-brand-gold/25">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-brand-gold" />
        <span className="text-gray-500">
          هذه المنصة خاصة للجمعيات الخيرية ومشاريع البحوث الاجتماعية، تواصل مع مدير المنصة للدخول.
        </span>
      </div>
    </motion.div>
  );
}
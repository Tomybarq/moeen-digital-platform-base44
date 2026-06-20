import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, ShieldAlert, Eye, EyeOff, X } from "lucide-react";

export default function SignInModal({ open, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Auth handled by the platform
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          dir="rtl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="bg-brand-navy px-6 pt-8 pb-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-gold/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-brand-gold" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">مرحباً بك</h2>
            <p className="text-sm text-white/60">قم بتسجيل الدخول للمنصة</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-navy">اسم المستخدم</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-11 pr-10 pl-4 rounded-xl border border-gray-200 bg-gray-50 text-brand-navy text-sm outline-none transition-all focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-brand-navy">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pr-10 pl-10 rounded-xl border border-gray-200 bg-gray-50 text-brand-navy text-sm outline-none transition-all focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-12 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 shadow-lg mt-2"
              style={{
                background: "linear-gradient(135deg, #0c3140 0%, #1a5470 100%)",
                boxShadow: "0 4px 20px rgba(12,49,64,0.35)",
              }}
            >
              <Lock className="w-4 h-4" />
              الدخول للمنصة
            </button>

            {/* Warning notice */}
            <div className="flex items-start gap-2.5 rounded-xl p-3 bg-brand-gold/[0.07] border border-brand-gold/20">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-brand-gold" />
              <span className="text-xs text-gray-500 leading-relaxed">
                الدخول خاص للمنظمات الأهلية — تواصل مع إدارة المنصة للدخول
              </span>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
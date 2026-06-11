import { Link } from "react-router-dom";
import { Home, ArrowRight, SearchX } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full text-center space-y-8"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="flex justify-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
            <SearchX className="w-12 h-12 text-primary" aria-hidden="true" />
          </div>
        </motion.div>

        {/* Error code */}
        <div className="space-y-2">
          <h1 className="text-8xl font-black text-primary/20 leading-none select-none" aria-hidden="true">
            404
          </h1>
          <h2 className="text-2xl font-bold text-foreground">
            الصفحة غير موجودة
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. تأكد من صحة الرابط أو عد إلى الصفحة الرئيسية.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild className="gap-2 cursor-pointer min-w-40">
            <Link to="/">
              <Home className="w-4 h-4" />
              الصفحة الرئيسية
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2 cursor-pointer min-w-40">
            <ArrowRight className="w-4 h-4" />
            العودة للخلف
          </Button>
        </div>

        {/* Brand */}
        <p className="text-xs text-muted-foreground pt-4 border-t border-border">
          منصة مُعين الرقمية — جميع الحقوق محفوظة
        </p>
      </motion.div>
    </div>
  );
}
import { motion } from "framer-motion";
import { ShieldX, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

/**
 * 403 Forbidden page — displayed when a user tries to access a restricted
 * page or perform a forbidden action.
 *
 * Features:
 * - Clear Arabic message explaining access is denied
 * - "Contact Technical Support" button → mailto:tech@ghazara.net
 * - "Go back to Dashboard" secondary action
 */
export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full text-center space-y-6"
      >
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center">
          <ShieldX className="w-10 h-10 text-destructive" />
        </div>

        {/* Status code */}
        <p className="text-5xl font-extrabold text-destructive font-mono tracking-tight">403</p>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-foreground">
            غير مصرح لك بالوصول إلى هذه الصفحة
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            ليس لديك الصلاحيات الكافية لعرض هذا المحتوى. إذا كنت تعتقد أن هذا خطأ،
            يرجى التواصل مع فريق الدعم الفني للمساعدة.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="default" size="lg" className="gap-2 cursor-pointer" asChild>
            <a href="mailto:tech@ghazara.net" target="_blank" rel="noopener noreferrer">
              <Mail className="w-4 h-4" />
              تواصل مع الدعم الفني
            </a>
          </Button>
          <Button variant="outline" size="lg" className="cursor-pointer"
            onClick={() => navigate("/")}>
            العودة إلى لوحة التحكم
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
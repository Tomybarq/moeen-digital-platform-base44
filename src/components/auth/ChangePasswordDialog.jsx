import { useState } from "react";
import { authResetPasswordRequest } from "@/services/apiService";
import { useAuth } from "@/lib/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";

function extractErrorMessage(err) {
  if (!err) return "حدث خطأ غير معروف";
  if (typeof err === "string") return err;
  if (err.data?.error) return err.data.error;
  if (err.message && typeof err.message === "string" && err.message !== "[object Object]") return err.message;
  if (err.error && typeof err.error === "string") return err.error;
  if (err.status && err.statusText) return `${err.status} ${err.statusText}`;
  return "فشل تغيير كلمة المرور";
}

export default function ChangePasswordDialog({ open, onClose }) {
  const { user } = useAuth();
  const [next, setNext]           = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showNext, setShowN]      = useState(false);
  const [showConfirm, setShowC]   = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);

  const reset = () => {
    setNext(""); setConfirm("");
    setError(""); setDone(false); setLoading(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (next !== confirm) { setError("كلمتا المرور غير متطابقتين"); return; }
    if (next.length < 8)  { setError("يجب أن تكون 8 أحرف على الأقل"); return; }

    const email = user?.email;
    if (!email) { setError("تعذر العثور على بريدك الإلكتروني"); return; }

    setLoading(true);
    try {
      await authResetPasswordRequest(email);
      setDone(true);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); }}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Lock className="w-4 h-4 text-primary" />
            تغيير كلمة المرور
          </DialogTitle>
          <DialogDescription>اختر كلمة مرور قوية لحماية حسابك</DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">تم إرسال رابط تغيير كلمة المرور إلى بريدك الإلكتروني.</p>
            <Button className="mt-5 w-full cursor-pointer" onClick={reset}>حسناً</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="cp-new">كلمة المرور الجديدة</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input id="cp-new" type={showNext ? "text" : "password"} autoFocus
                  value={next} onChange={(e) => setNext(e.target.value)}
                  placeholder="٨ أحرف على الأقل" className="pr-10 pl-10 h-11" required />
                <button type="button" tabIndex={-1} onClick={() => setShowN(!showNext)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                  {showNext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cp-confirm">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input id="cp-confirm" type={showConfirm ? "text" : "password"}
                  value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••" className="pr-10 pl-10 h-11" required />
                <button type="button" tabIndex={-1} onClick={() => setShowC(!showConfirm)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirm && next !== confirm && (
                <p className="text-xs text-destructive mt-1">كلمتا المرور غير متطابقتين</p>
              )}
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button variant="outline" type="button" onClick={reset} className="cursor-pointer">إلغاء</Button>
              <Button type="submit" disabled={loading} className="cursor-pointer gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />جاري…</> : "تغيير كلمة المرور"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Shield, KeyRound, LogOut, Mail, ShieldCheck, User, AlertTriangle, Trash2 } from "lucide-react";
import RoleBadge from "@/components/auth/RoleBadge";
import ChangePasswordDialog from "@/components/auth/ChangePasswordDialog";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

export default function ProfileSecurityTab() {
  const { user, logout } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await base44.auth.updateMe({ status: "deleted" });
      logout();
    } catch {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" /> الأمان وكلمة المرور
          </CardTitle>
          <CardDescription>إدارة كلمة المرور وإعدادات الحساب الأمنية</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="p-6 space-y-5">
          {/* Account summary */}
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">معلومات الحساب</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">البريد:</span>
                <span dir="ltr" className="font-medium text-foreground truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-muted-foreground">حالة الحساب:</span>
                <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">مفعّل</Badge>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">الدور:</span>
                <RoleBadge role={user?.role} size="sm" />
              </div>
            </div>
          </div>

          {/* Password change */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">إدارة كلمة المرور</p>
            <Button variant="outline" className="w-full h-11 cursor-pointer justify-start gap-3"
              onClick={() => setShowPwd(true)}>
              <KeyRound className="w-4 h-4 text-muted-foreground" />
              تغيير كلمة المرور
              <span className="mr-auto text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">آمن ومشفر</span>
            </Button>
          </div>

          <Separator />

          {/* Danger zone */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-destructive flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> منطقة الخطر
            </p>
            <Button variant="outline"
              className="w-full h-11 cursor-pointer justify-start gap-3 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
              onClick={() => logout()}>
              <LogOut className="w-4 h-4" />
              تسجيل الخروج من الحساب
            </Button>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost"
                  className="w-full h-11 cursor-pointer justify-start gap-3 text-destructive/70 hover:text-destructive hover:bg-destructive/5">
                  <Trash2 className="w-4 h-4" />
                  حذف الحساب نهائياً
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> حذف الحساب نهائياً
                  </DialogTitle>
                  <DialogDescription className="text-sm leading-relaxed space-y-3 pt-2">
                    <span className="block font-semibold text-foreground">تحذير: لا يمكن التراجع عن هذا الإجراء!</span>
                    <span className="block">
                      سيتم حذف جميع بياناتك المرتبطة بالمنصة بشكل دائم، بما في ذلك سجل المستفيدين، التقارير، والإعدادات الشخصية.
                    </span>
                    <span className="block text-muted-foreground">
                      اكتب <strong className="text-destructive">حذف</strong> في الحقل أدناه لتأكيد رغبتك في حذف الحساب.
                    </span>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="اكتب كلمة &#34;حذف&#34; للتأكيد"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full h-11 rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-destructive focus:ring-1 focus:ring-destructive/30"
                  />
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setDeleteConfirmText(""); }}
                    className="cursor-pointer">إلغاء</Button>
                  <Button variant="destructive" onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== "حذف" || deleting}
                    className="cursor-pointer gap-2">
                    {deleting ? "جاري الحذف…" : "نعم، احذف حسابي"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <ChangePasswordDialog open={showPwd} onClose={() => setShowPwd(false)} />
    </>
  );
}
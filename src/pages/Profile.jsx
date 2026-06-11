import { UserCircle, Mail, Shield, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-foreground">الملف الشخصي</h2>
        <p className="text-sm text-muted-foreground mt-1">عرض وتعديل معلومات حسابك</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <UserCircle className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{user?.full_name || "مستخدم"}</CardTitle>
                <Badge variant="secondary" className="mt-1">
                  <Shield className="w-3 h-3 ml-1" />
                  {user?.role === "admin" ? "مدير" : "مستخدم"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">البريد الإلكتروني</p>
                <p className="text-sm font-medium text-foreground" dir="ltr">{user?.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">تاريخ الانضمام</p>
                <p className="text-sm font-medium text-foreground">
                  {user?.created_date ? new Date(user.created_date).toLocaleDateString("ar-SA") : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">إجراءات الحساب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full cursor-pointer justify-start gap-2">
              تعديل المعلومات الشخصية
            </Button>
            <Button variant="outline" className="w-full cursor-pointer justify-start gap-2 text-destructive hover:text-destructive">
              تغيير كلمة المرور
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
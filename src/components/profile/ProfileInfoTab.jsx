import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  User, Mail, UserCircle, Save, Loader2, CheckCircle2, AlertTriangle,
  Phone, Building2, MapPin, Search, Megaphone, Briefcase, Info,
} from "lucide-react";
import { getRoleLabel, ROLE_DESCRIPTIONS } from "@/lib/rbac";
import UserService from "@/services/UserService";

const SA_CITIES = ["الرياض","جدة","مكة المكرمة","المدينة المنورة","الدمام","الخبر","تبوك","أبها","القصيم","حائل","جازان","نجران","الباحة","الطائف","خميس مشيط"];

const ROLE_EXTRA_FIELDS = {
  platform_admin: [
    { key: "phone",        label: "رقم الهاتف",           icon: Phone,     type: "tel",      placeholder: "+966 5x xxx xxxx" },
    { key: "city",         label: "المدينة",               icon: MapPin,    type: "city",     placeholder: "الرياض" },
  ],
  ngo_admin: [
    { key: "phone",        label: "رقم الهاتف",           icon: Phone,     type: "tel",      placeholder: "+966 5x xxx xxxx" },
    { key: "organization", label: "اسم المنظمة",           icon: Building2, type: "text",     placeholder: "اسم المنظمة" },
    { key: "city",         label: "المدينة",               icon: MapPin,    type: "city",     placeholder: "الرياض" },
    { key: "position",     label: "المسمى الوظيفي",       icon: Briefcase, type: "text",     placeholder: "مدير تنفيذي" },
  ],
  social_researcher: [
    { key: "phone",        label: "رقم الهاتف",           icon: Phone,     type: "tel",      placeholder: "+966 5x xxx xxxx" },
    { key: "organization", label: "المنظمة المنتسب إليها", icon: Building2, type: "text",     placeholder: "اسم المنظمة" },
    { key: "city",         label: "المدينة",               icon: MapPin,    type: "city",     placeholder: "الرياض" },
    { key: "specialization",label:"التخصص",               icon: Search,    type: "text",     placeholder: "باحث اجتماعي / علم نفس…" },
    { key: "bio",          label: "نبذة شخصية",           icon: Info,      type: "textarea", placeholder: "نبذة مختصرة عن عملك…" },
  ],
  marketer: [
    { key: "phone",        label: "رقم الهاتف",           icon: Phone,     type: "tel",      placeholder: "+966 5x xxx xxxx" },
    { key: "organization", label: "المنظمة المنتسب إليها", icon: Building2, type: "text",     placeholder: "اسم المنظمة" },
    { key: "city",         label: "المدينة",               icon: MapPin,    type: "city",     placeholder: "الرياض" },
    { key: "specialization",label:"التخصص التسويقي",      icon: Megaphone, type: "text",     placeholder: "تسويق رقمي / علاقات عامة…" },
    { key: "bio",          label: "نبذة شخصية",           icon: Info,      type: "textarea", placeholder: "نبذة مختصرة عن تجربتك…" },
  ],
};

function FieldItem({ field, value, onChange }) {
  const Icon = field.icon;
  if (field.type === "textarea") {
    return (
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor={field.key} className="flex items-center gap-1.5 text-sm">
          <Icon className="w-3.5 h-3.5 text-muted-foreground" /> {field.label}
        </Label>
        <Textarea id={field.key} value={value} onChange={e => onChange(field.key, e.target.value)}
          placeholder={field.placeholder} rows={3} className="resize-none" />
      </div>
    );
  }
  if (field.type === "city") {
    return (
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-sm">
          <Icon className="w-3.5 h-3.5 text-muted-foreground" /> {field.label}
        </Label>
        <Select value={value || ""} onValueChange={v => onChange(field.key, v)}>
          <SelectTrigger className="h-10"><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
          <SelectContent>{SA_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    );
  }
  return (
    <div className="space-y-1.5">
      <Label htmlFor={field.key} className="flex items-center gap-1.5 text-sm">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" /> {field.label}
      </Label>
      <Input id={field.key} type={field.type} value={value}
        onChange={e => onChange(field.key, e.target.value)}
        placeholder={field.placeholder} className="h-10"
        dir={field.type === "tel" ? "ltr" : "rtl"} />
    </div>
  );
}

export { ROLE_EXTRA_FIELDS };

export default function ProfileInfoTab({ user }) {
  const role = user?.role || "platform_admin";
  const extraFields = ROLE_EXTRA_FIELDS[role] || ROLE_EXTRA_FIELDS.platform_admin;

  const buildInitial = () => {
    const init = {};
    extraFields.forEach(f => { init[f.key] = user?.[f.key] || ""; });
    return init;
  };

  const [form, setForm]     = useState(buildInitial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setSaved(false);
    try {
      await UserService.updateMe(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } finally { setSaving(false); }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <User className="w-4 h-4 text-primary" /> المعلومات الشخصية
        </CardTitle>
        <CardDescription>تحديث بيانات ملفك الشخصي على منصة مُعين</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-6">
        <form onSubmit={handleSave} className="space-y-5">
          {/* Fixed read-only fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm">
                <UserCircle className="w-3.5 h-3.5 text-muted-foreground" /> الاسم الكامل
              </Label>
              <Input value={user?.full_name || ""} disabled className="h-10 bg-muted/40 cursor-not-allowed" />
              <p className="text-xs text-muted-foreground">لا يمكن تعديل الاسم من هنا</p>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" /> البريد الإلكتروني
              </Label>
              <Input value={user?.email || ""} disabled dir="ltr"
                className="h-10 bg-muted/40 cursor-not-allowed text-left" />
            </div>
          </div>

          <Separator />

          {/* Role-specific editable fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {extraFields.map(field => (
              <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                <FieldItem field={field} value={form[field.key] || ""} onChange={handleChange} />
              </div>
            ))}
          </div>

          {/* Role info chip */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">دورك الحالي: </span>
              {getRoleLabel(role)} — {ROLE_DESCRIPTIONS[role]}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving} className="cursor-pointer gap-2 min-w-36">
              {saving
                ? <><Loader2 className="w-4 h-4 animate-spin" />جاري الحفظ…</>
                : saved
                ? <><CheckCircle2 className="w-4 h-4" />تم الحفظ ✓</>
                : <><Save className="w-4 h-4" />حفظ التغييرات</>}
            </Button>
            {saved && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ تم تحديث ملفك الشخصي
              </motion.p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
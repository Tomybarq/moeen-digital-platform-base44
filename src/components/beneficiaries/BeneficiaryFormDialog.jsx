import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save, X, Users } from "lucide-react";

const EMPTY = {
  full_name: "", national_id: "", age: "", gender: "", phone: "", city: "",
  district: "", social_status: "", dependents_count: "", income_level: "",
  disability: false, case_type: "", priority: "متوسط", status: "active",
  ngo_name: "", researcher_name: "", notes: "", visit_date: "",
};

export default function BeneficiaryFormDialog({ open, onOpenChange, beneficiary, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(beneficiary ? { ...EMPTY, ...beneficiary } : EMPTY);
  }, [beneficiary, open]);

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target?.value ?? e }));
  const setSel = (field) => (v) => setForm(p => ({ ...p, [field]: v }));

  const isValid = form.full_name.trim() && form.phone.trim() && form.city.trim() && form.case_type && form.priority;

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true);
    await onSave({ ...form, age: form.age ? Number(form.age) : undefined, dependents_count: form.dependents_count ? Number(form.dependents_count) : undefined });
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Users className="w-4 h-4 text-primary" />
            {beneficiary ? "تعديل بيانات المستفيد" : "تسجيل مستفيد جديد"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Personal info */}
          <Section title="البيانات الشخصية">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="الاسم الكامل *"><Input placeholder="محمد أحمد العتيبي" value={form.full_name} onChange={set("full_name")} /></Field>
              <Field label="رقم الهوية"><Input placeholder="1xxxxxxxxx" value={form.national_id} onChange={set("national_id")} /></Field>
              <Field label="العمر"><Input type="number" placeholder="35" value={form.age} onChange={set("age")} /></Field>
              <Field label="الجنس">
                <Select value={form.gender} onValueChange={setSel("gender")}>
                  <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ذكر">ذكر</SelectItem>
                    <SelectItem value="أنثى">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="رقم الجوال *"><Input placeholder="05xxxxxxxx" value={form.phone} onChange={set("phone")} /></Field>
              <Field label="الحالة الاجتماعية">
                <Select value={form.social_status} onValueChange={setSel("social_status")}>
                  <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                  <SelectContent>
                    {["أعزب","متزوج","مطلق","أرمل"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="عدد أفراد الأسرة"><Input type="number" placeholder="4" value={form.dependents_count} onChange={set("dependents_count")} /></Field>
              <Field label="إعاقة">
                <div className="flex items-center gap-3 h-9">
                  <Switch checked={!!form.disability} onCheckedChange={(v) => setForm(p => ({ ...p, disability: v }))} />
                  <span className="text-sm text-muted-foreground">{form.disability ? "نعم" : "لا"}</span>
                </div>
              </Field>
            </div>
          </Section>

          {/* Location */}
          <Section title="الموقع الجغرافي">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="المدينة *"><Input placeholder="الرياض" value={form.city} onChange={set("city")} /></Field>
              <Field label="الحي"><Input placeholder="العليا" value={form.district} onChange={set("district")} /></Field>
            </div>
          </Section>

          {/* Case info */}
          <Section title="بيانات الحالة">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="نوع الحالة *">
                <Select value={form.case_type} onValueChange={setSel("case_type")}>
                  <SelectTrigger><SelectValue placeholder="اختر نوع الحالة" /></SelectTrigger>
                  <SelectContent>
                    {["مادي","صحي","تعليمي","اجتماعي","متعدد"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="الأولوية *">
                <Select value={form.priority} onValueChange={setSel("priority")}>
                  <SelectTrigger><SelectValue placeholder="اختر الأولوية" /></SelectTrigger>
                  <SelectContent>
                    {["عاجل","مرتفع","متوسط","منخفض"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="مستوى الدخل">
                <Select value={form.income_level} onValueChange={setSel("income_level")}>
                  <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                  <SelectContent>
                    {["لا يوجد دخل","دخل منخفض","دخل متوسط"].map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="الحالة">
                <Select value={form.status} onValueChange={setSel("status")}>
                  <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="supported">مدعوم</SelectItem>
                    <SelectItem value="archived">مؤرشف</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="تاريخ الزيارة الميدانية"><Input type="date" value={form.visit_date} onChange={set("visit_date")} /></Field>
            </div>
          </Section>

          {/* Researcher / NGO */}
          <Section title="الباحث والمنظمة">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="اسم الباحث الاجتماعي"><Input placeholder="اسم الباحث" value={form.researcher_name} onChange={set("researcher_name")} /></Field>
              <Field label="المنظمة المرتبطة"><Input placeholder="اسم المنظمة" value={form.ngo_name} onChange={set("ngo_name")} /></Field>
            </div>
          </Section>

          {/* Notes */}
          <Section title="ملاحظات">
            <Textarea placeholder="أي تفاصيل إضافية عن الحالة…" className="resize-none" rows={3} value={form.notes} onChange={set("notes")} />
          </Section>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer gap-1.5">
            <X className="w-4 h-4" /> إلغاء
          </Button>
          <Button onClick={handleSave} disabled={!isValid || saving} className="cursor-pointer gap-1.5">
            <Save className="w-4 h-4" />
            {saving ? "جاري الحفظ…" : beneficiary ? "حفظ التعديلات" : "تسجيل المستفيد"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground border-b border-border pb-1.5">{title}</h4>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save, X, Users } from "lucide-react";
import FormFieldError from "@/components/shared/FormFieldError";
import { validateBeneficiaryForm, sanitizeFormData } from "@/lib/validation";

const EMPTY = {
  full_name: "", national_id: "", age: "", gender: "", phone: "", city: "",
  district: "", social_status: "", dependents_count: "", income_level: "",
  disability: false, case_type: "", priority: "متوسط", status: "active",
  ngo_name: "", researcher_name: "", notes: "", visit_date: "",
};

export default function BeneficiaryFormDialog({ open, onOpenChange, beneficiary, onSave }) {
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setForm(beneficiary ? { ...EMPTY, ...beneficiary } : EMPTY);
    setErrors({});
    setTouched({});
  }, [beneficiary, open]);

  const set = (field) => (e) => {
    const value = e?.target?.value ?? e;
    setForm(p => ({ ...p, [field]: value }));
    setTouched(p => ({ ...p, [field]: true }));
    // Live validation for touched field
    const { errors: newErrors } = validateBeneficiaryForm({ ...form, [field]: value });
    setErrors(prev => ({ ...prev, [field]: newErrors[field] ?? undefined }));
  };

  const setSel = (field) => (v) => set(field)(v);

  const handleSave = async () => {
    const { valid, errors: validationErrors } = validateBeneficiaryForm(form);
    if (!valid) {
      setErrors(validationErrors);
      // Mark all fields as touched to show all errors
      const allTouched = Object.keys(validationErrors).reduce((acc, k) => ({ ...acc, [k]: true }), {});
      setTouched(allTouched);
      return;
    }
    setSaving(true);
    const clean = sanitizeFormData({
      ...form,
      age: form.age ? Number(form.age) : undefined,
      dependents_count: form.dependents_count ? Number(form.dependents_count) : undefined,
    });
    await onSave(clean);
    setSaving(false);
    onOpenChange(false);
  };

  const fieldErr = (f) => touched[f] ? errors[f] : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl"
        aria-label={beneficiary ? "تعديل بيانات المستفيد" : "تسجيل مستفيد جديد"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Users className="w-4 h-4 text-primary" aria-hidden="true" />
            {beneficiary ? "تعديل بيانات المستفيد" : "تسجيل مستفيد جديد"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Personal info */}
          <Section title="البيانات الشخصية">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="الاسم الكامل *" htmlFor="f-full_name">
                <Input id="f-full_name" placeholder="محمد أحمد العتيبي"
                  value={form.full_name} onChange={set("full_name")}
                  aria-required="true" aria-invalid={!!fieldErr("full_name")}
                  className={fieldErr("full_name") ? "border-destructive" : ""} />
                <FormFieldError message={fieldErr("full_name")} />
              </Field>
              <Field label="رقم الهوية" htmlFor="f-national_id">
                <Input id="f-national_id" placeholder="1xxxxxxxxx" inputMode="numeric"
                  value={form.national_id} onChange={set("national_id")}
                  aria-invalid={!!fieldErr("national_id")}
                  className={fieldErr("national_id") ? "border-destructive" : ""} />
                <FormFieldError message={fieldErr("national_id")} />
              </Field>
              <Field label="العمر" htmlFor="f-age">
                <Input id="f-age" type="number" placeholder="35" min={1} max={120}
                  value={form.age} onChange={set("age")}
                  aria-invalid={!!fieldErr("age")}
                  className={fieldErr("age") ? "border-destructive" : ""} />
                <FormFieldError message={fieldErr("age")} />
              </Field>
              <Field label="الجنس" htmlFor="f-gender">
                <Select value={form.gender} onValueChange={setSel("gender")}>
                  <SelectTrigger id="f-gender"><SelectValue placeholder="اختر" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ذكر">ذكر</SelectItem>
                    <SelectItem value="أنثى">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="رقم الجوال *" htmlFor="f-phone">
                <Input id="f-phone" placeholder="05xxxxxxxx" inputMode="tel"
                  value={form.phone} onChange={set("phone")}
                  aria-required="true" aria-invalid={!!fieldErr("phone")}
                  className={fieldErr("phone") ? "border-destructive" : ""} />
                <FormFieldError message={fieldErr("phone")} />
              </Field>
              <Field label="الحالة الاجتماعية" htmlFor="f-social_status">
                <Select value={form.social_status} onValueChange={setSel("social_status")}>
                  <SelectTrigger id="f-social_status"><SelectValue placeholder="اختر" /></SelectTrigger>
                  <SelectContent>
                    {["أعزب","متزوج","مطلق","أرمل"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="عدد أفراد الأسرة" htmlFor="f-dependents">
                <Input id="f-dependents" type="number" placeholder="4" min={0}
                  value={form.dependents_count} onChange={set("dependents_count")} />
              </Field>
              <Field label="إعاقة">
                <div className="flex items-center gap-3 h-9">
                  <Switch checked={!!form.disability}
                    onCheckedChange={(v) => setForm(p => ({ ...p, disability: v }))}
                    aria-label="هل يوجد إعاقة" />
                  <span className="text-sm text-muted-foreground">{form.disability ? "نعم" : "لا"}</span>
                </div>
              </Field>
            </div>
          </Section>

          {/* Location */}
          <Section title="الموقع الجغرافي">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="المدينة *" htmlFor="f-city">
                <Input id="f-city" placeholder="الرياض"
                  value={form.city} onChange={set("city")}
                  aria-required="true" aria-invalid={!!fieldErr("city")}
                  className={fieldErr("city") ? "border-destructive" : ""} />
                <FormFieldError message={fieldErr("city")} />
              </Field>
              <Field label="الحي" htmlFor="f-district">
                <Input id="f-district" placeholder="العليا"
                  value={form.district} onChange={set("district")} />
              </Field>
            </div>
          </Section>

          {/* Case info */}
          <Section title="بيانات الحالة">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="نوع الحالة *" htmlFor="f-case_type">
                <Select value={form.case_type} onValueChange={setSel("case_type")}>
                  <SelectTrigger id="f-case_type"
                    className={fieldErr("case_type") ? "border-destructive" : ""}
                    aria-required="true" aria-invalid={!!fieldErr("case_type")}>
                    <SelectValue placeholder="اختر نوع الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    {["مادي","صحي","تعليمي","اجتماعي","متعدد"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormFieldError message={fieldErr("case_type")} />
              </Field>
              <Field label="الأولوية *" htmlFor="f-priority">
                <Select value={form.priority} onValueChange={setSel("priority")}>
                  <SelectTrigger id="f-priority"
                    className={fieldErr("priority") ? "border-destructive" : ""}
                    aria-required="true" aria-invalid={!!fieldErr("priority")}>
                    <SelectValue placeholder="اختر الأولوية" />
                  </SelectTrigger>
                  <SelectContent>
                    {["عاجل","مرتفع","متوسط","منخفض"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormFieldError message={fieldErr("priority")} />
              </Field>
              <Field label="مستوى الدخل" htmlFor="f-income">
                <Select value={form.income_level} onValueChange={setSel("income_level")}>
                  <SelectTrigger id="f-income"><SelectValue placeholder="اختر" /></SelectTrigger>
                  <SelectContent>
                    {["لا يوجد دخل","دخل منخفض","دخل متوسط"].map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="الحالة" htmlFor="f-status">
                <Select value={form.status} onValueChange={setSel("status")}>
                  <SelectTrigger id="f-status"><SelectValue placeholder="اختر" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="supported">مدعوم</SelectItem>
                    <SelectItem value="archived">مؤرشف</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="تاريخ الزيارة الميدانية" htmlFor="f-visit">
                <Input id="f-visit" type="date" value={form.visit_date} onChange={set("visit_date")} />
              </Field>
            </div>
          </Section>

          {/* Researcher / NGO */}
          <Section title="الباحث والمنظمة">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="اسم الباحث الاجتماعي" htmlFor="f-researcher">
                <Input id="f-researcher" placeholder="اسم الباحث"
                  value={form.researcher_name} onChange={set("researcher_name")} />
              </Field>
              <Field label="المنظمة المرتبطة" htmlFor="f-ngo">
                <Input id="f-ngo" placeholder="اسم المنظمة"
                  value={form.ngo_name} onChange={set("ngo_name")} />
              </Field>
            </div>
          </Section>

          {/* Notes */}
          <Section title="ملاحظات">
            <Textarea placeholder="أي تفاصيل إضافية عن الحالة…"
              className="resize-none" rows={3}
              value={form.notes} onChange={set("notes")}
              maxLength={2000} />
            <p className="text-xs text-muted-foreground text-left mt-1">
              {form.notes?.length || 0}/2000
            </p>
          </Section>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer gap-1.5">
            <X className="w-4 h-4" /> إلغاء
          </Button>
          <Button onClick={handleSave} disabled={saving} className="cursor-pointer gap-1.5">
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
    <fieldset className="space-y-3 border-0 p-0 m-0">
      <legend className="text-sm font-semibold text-foreground border-b border-border pb-1.5 w-full">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
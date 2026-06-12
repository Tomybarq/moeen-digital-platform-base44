import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Building2, Save, X, Loader2 } from "lucide-react";
import FormFieldError from "@/components/shared/FormFieldError";
import { ngoSchema, zodValidate, withMinDelay } from "@/lib/schemas";
import { sanitizeFormData } from "@/lib/validation";

const EMPTY = {
  name: "", responsible_person: "", phone: "", email: "",
  donation_url: "", city: "", category: "", notes: "", logo_url: "",
};

const CATEGORIES = ["خيرية", "تعليمية", "صحية", "بيئية", "اجتماعية", "أخرى"];

export default function NGOFormDialog({ open, onOpenChange, ngo, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(ngo ? { ...EMPTY, ...ngo } : EMPTY);
    setErrors({});
  }, [ngo, open]);

  const set = (field) => (e) => {
    const value = e.target?.value ?? e;
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the field error as the user types
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSave = async () => {
    const { valid, errors: validationErrors } = zodValidate(ngoSchema, form);
    if (!valid) { setErrors(validationErrors); return; }
    setSaving(true);
    await withMinDelay(onSave(sanitizeFormData({ ...form })));
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Building2 className="w-4 h-4 text-primary" />
            {ngo ? "تعديل بيانات المنظمة" : "إضافة منظمة جديدة"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Name */}
          <Field label="اسم المنظمة *" error={errors.name}>
            <Input placeholder="جمعية البر الخيرية بعفراء" value={form.name} onChange={set("name")}
              aria-invalid={!!errors.name} className={errors.name ? "border-destructive" : ""} />
          </Field>

          {/* Responsible */}
          <Field label="المسؤول عن المنظمة *" error={errors.responsible_person}>
            <Input placeholder="اسم المسؤول" value={form.responsible_person} onChange={set("responsible_person")}
              aria-invalid={!!errors.responsible_person} className={errors.responsible_person ? "border-destructive" : ""} />
          </Field>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="رقم التواصل *" error={errors.phone}>
              <Input placeholder="05xxxxxxxx" inputMode="tel" value={form.phone} onChange={set("phone")}
                aria-invalid={!!errors.phone} className={errors.phone ? "border-destructive" : ""} />
            </Field>
            <Field label="البريد الإلكتروني *" error={errors.email}>
              <Input type="email" placeholder="info@ngo.org" value={form.email} onChange={set("email")}
                aria-invalid={!!errors.email} className={errors.email ? "border-destructive" : ""} />
            </Field>
          </div>

          {/* City + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="المدينة">
              <Input placeholder="الرياض" value={form.city} onChange={set("city")} />
            </Field>
            <Field label="التصنيف">
              <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Donation URL */}
          <Field label="رابط منصة التبرع" error={errors.donation_url}>
            <Input placeholder="https://sahem.ngo/..." value={form.donation_url} onChange={set("donation_url")}
              aria-invalid={!!errors.donation_url} className={errors.donation_url ? "border-destructive" : ""} />
          </Field>

          {/* Logo URL */}
          <Field label="رابط الشعار (اختياري)" error={errors.logo_url}>
            <Input placeholder="https://..." value={form.logo_url} onChange={set("logo_url")}
              aria-invalid={!!errors.logo_url} className={errors.logo_url ? "border-destructive" : ""} />
          </Field>

          {/* Notes */}
          <Field label="ملاحظات">
            <Textarea
              placeholder="أي معلومات إضافية عن المنظمة…"
              className="resize-none"
              rows={3}
              value={form.notes}
              onChange={set("notes")}
            />
          </Field>
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer gap-1.5">
            <X className="w-4 h-4" /> إلغاء
          </Button>
          <Button onClick={handleSave} disabled={saving} className="cursor-pointer gap-1.5">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "جاري الحفظ…" : ngo ? "حفظ التعديلات" : "إضافة المنظمة"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      <FormFieldError message={error} />
    </div>
  );
}
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle } from "lucide-react";

function Field({ label, required, error, children, hint }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

function Sel({ value, onChange, placeholder, options }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  );
}

export default function StepBasic({ form, setForm, errors }) {
  const set = f => e => setForm(p => ({ ...p, [f]: e.target?.value ?? e }));
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="اسم رب الأسرة" required error={errors.full_name}>
          <Input placeholder="محمد أحمد العتيبي" value={form.full_name} onChange={set("full_name")} className={errors.full_name ? "border-destructive" : ""} />
        </Field>
        <Field label="رقم الهوية الوطنية">
          <Input placeholder="1xxxxxxxxx" value={form.national_id} onChange={set("national_id")} maxLength={10} />
        </Field>
        <Field label="سنة الميلاد">
          <Input type="number" min={1920} max={2010} placeholder="1980" value={form.birth_year} onChange={set("birth_year")} />
        </Field>
        <Field label="العمر">
          <Input type="number" min={1} max={120} placeholder="44" value={form.age} onChange={set("age")} />
        </Field>
        <Field label="الجنس">
          <Sel value={form.gender} onChange={v => setForm(p => ({ ...p, gender: v }))} placeholder="اختر الجنس" options={["ذكر", "أنثى"]} />
        </Field>
        <Field label="الحالة الاجتماعية">
          <Sel value={form.social_status} onChange={v => setForm(p => ({ ...p, social_status: v }))} placeholder="اختر" options={["أعزب", "متزوج", "مطلق", "أرمل", "مهجور"]} />
        </Field>
        <Field label="المستوى التعليمي">
          <Sel value={form.education_level} onChange={v => setForm(p => ({ ...p, education_level: v }))} placeholder="اختر" options={["أمي", "ابتدائي", "متوسط", "ثانوي", "جامعي", "دراسات عليا"]} />
        </Field>
        <Field label="الحالة الصحية">
          <Sel value={form.health_status} onChange={v => setForm(p => ({ ...p, health_status: v }))} placeholder="اختر" options={["سليم", "معاق", "مريض"]} />
        </Field>
        {(form.health_status === "معاق") && (
          <Field label="نوع الإعاقة">
            <Input placeholder="حركية، بصرية، سمعية…" value={form.disability_type} onChange={set("disability_type")} />
          </Field>
        )}
        {(form.health_status === "مريض") && (
          <Field label="نوع المرض">
            <Input placeholder="سكري، ضغط، قلب…" value={form.sickness_type} onChange={set("sickness_type")} />
          </Field>
        )}
        <Field label="رقم الجوال الأساسي" required error={errors.phone}>
          <Input placeholder="05xxxxxxxx" value={form.phone} onChange={set("phone")} className={errors.phone ? "border-destructive" : ""} />
        </Field>
        <Field label="رقم جوال بديل">
          <Input placeholder="05xxxxxxxx" value={form.phone_alt} onChange={set("phone_alt")} />
        </Field>
        <Field label="عدد أفراد الأسرة">
          <Input type="number" min={0} placeholder="4" value={form.dependents_count} onChange={set("dependents_count")} />
        </Field>
      </div>
      <Field label="العنوان الوطني">
        <Input placeholder="المدينة، الحي، اسم الشارع، رقم المبنى" value={form.national_address} onChange={set("national_address")} />
      </Field>
      <Field label="رأي الباحث — البيانات الأساسية">
        <Textarea placeholder="ملاحظات حول البيانات الأساسية لرب الأسرة…" rows={3} className="resize-none"
          value={form.researcher_opinion_basic} onChange={e => setForm(p => ({ ...p, researcher_opinion_basic: e.target.value }))} />
      </Field>
    </div>
  );
}
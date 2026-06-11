import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
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

export default function StepHousing({ form, setForm }) {
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="المدينة">
          <Input placeholder="الرياض" value={form.city} onChange={e => set("city", e.target.value)} />
        </Field>
        <Field label="الحي">
          <Input placeholder="العليا" value={form.district} onChange={e => set("district", e.target.value)} />
        </Field>
        <Field label="نوع البيئة">
          <Sel value={form.environment_type} onChange={v => set("environment_type", v)} placeholder="اختر" options={["هجرة", "بادية", "قرية", "محافظة", "مدينة"]} />
        </Field>
        <Field label="نوع السكن">
          <Sel value={form.housing_type} onChange={v => set("housing_type", v)} placeholder="اختر" options={["شعبي", "شقة", "فيلا", "ملحق"]} />
        </Field>
        <Field label="حيازة السكن">
          <Sel value={form.housing_tenure} onChange={v => set("housing_tenure", v)} placeholder="اختر" options={["إيجار", "ملك", "إرث", "وقف"]} />
        </Field>
        <Field label="المنظمة الراعية">
          <Input placeholder="اسم المنظمة" value={form.ngo_name} onChange={e => set("ngo_name", e.target.value)} />
        </Field>
        <Field label="تاريخ الزيارة الميدانية">
          <Input type="date" value={form.visit_date} onChange={e => set("visit_date", e.target.value)} />
        </Field>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">رأي الباحث — البيئة والسكن</label>
        <Textarea placeholder="وصف السكن والبيئة المحيطة ومدى ملاءمتها…" rows={3} className="resize-none"
          value={form.researcher_opinion_housing}
          onChange={e => set("researcher_opinion_housing", e.target.value)} />
      </div>
    </div>
  );
}
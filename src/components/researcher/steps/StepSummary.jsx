import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Briefcase, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

const PRIORITY_CFG = {
  "عاجل":  "border-red-400 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  "مرتفع": "border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  "متوسط": "border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  "منخفض": "border-green-400 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400",
};

export default function StepSummary({ form, setForm }) {
  const docs = form.documents || [];
  const net = (Number(form.total_income) || 0) - (Number(form.total_expenses) || 0);

  const rows = [
    ["اسم رب الأسرة",   form.full_name || "—"],
    ["رقم الهوية",      form.national_id || "—"],
    ["الجوال",          form.phone || "—"],
    ["المدينة",         `${form.city || "—"}${form.district ? ` — ${form.district}` : ""}`],
    ["الأسرة",          form.dependents_count ? `${form.dependents_count} أفراد` : "—"],
    ["الحالة الصحية",   form.health_status || "—"],
    ["نوع السكن",       form.housing_type || "—"],
    ["إجمالي الدخل",    form.total_income ? `${Number(form.total_income).toFixed(2)} ر.س` : "—"],
    ["إجمالي المصروفات",form.total_expenses ? `${Number(form.total_expenses).toFixed(2)} ر.س` : "—"],
    ["صافي الدخل",      `${net.toFixed(2)} ر.س`],
    ["المنظمة",         form.ngo_name || "—"],
    ["تاريخ الزيارة",   form.visit_date || "—"],
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
        <p className="text-sm">راجع جميع البيانات قبل الإرسال. يمكنك العودة لأي خطوة لتعديل المعلومات.</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {form.case_type && (
          <span className="flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            <Briefcase className="w-3.5 h-3.5" /> {form.case_type}
          </span>
        )}
        {form.priority && (
          <span className={cn("flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full border-2", PRIORITY_CFG[form.priority])}>
            {form.priority}
          </span>
        )}
        {docs.length > 0 && (
          <span className="flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground">
            <Paperclip className="w-3.5 h-3.5" /> {docs.length} مرفق
          </span>
        )}
      </div>

      {/* Data rows */}
      <div className="rounded-xl border border-border overflow-hidden">
        {rows.map(([label, val], i) => (
          <div key={i} className={cn("flex items-center px-4 py-2.5 text-sm", i % 2 === 0 ? "bg-muted/30" : "bg-card")}>
            <span className="w-44 flex-shrink-0 text-muted-foreground font-medium">{label}</span>
            <span className="text-foreground">{val}</span>
          </div>
        ))}
      </div>

      {/* Case type + priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">تصنيف الحالة <span className="text-destructive">*</span></label>
          <Select value={form.case_type} onValueChange={v => setForm(p => ({ ...p, case_type: v }))}>
            <SelectTrigger className="h-10"><SelectValue placeholder="اختر" /></SelectTrigger>
            <SelectContent>
              {["مادي", "صحي", "تعليمي", "اجتماعي", "متعدد"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">أولوية الحالة <span className="text-destructive">*</span></label>
          <Select value={form.priority} onValueChange={v => setForm(p => ({ ...p, priority: v }))}>
            <SelectTrigger className="h-10"><SelectValue placeholder="اختر" /></SelectTrigger>
            <SelectContent>
              {["عاجل", "مرتفع", "متوسط", "منخفض"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">التوصية النهائية للباحث</label>
        <Textarea placeholder="التوصية النهائية، البنود المقترحة للمساعدة، الجهة الأنسب…" rows={4} className="resize-none"
          value={form.final_recommendation}
          onChange={e => setForm(p => ({ ...p, final_recommendation: e.target.value }))} />
      </div>
    </div>
  );
}
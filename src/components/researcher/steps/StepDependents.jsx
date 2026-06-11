import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Users } from "lucide-react";

const EMPTY_DEP = { name: "", age: "", relation: "", health_status: "سليم", education: "" };

export default function StepDependents({ form, setForm }) {
  const deps = form.dependents_data || [];

  const addRow = () => setForm(p => ({ ...p, dependents_data: [...(p.dependents_data || []), { ...EMPTY_DEP }] }));
  const removeRow = (i) => setForm(p => ({ ...p, dependents_data: p.dependents_data.filter((_, idx) => idx !== i) }));
  const updateRow = (i, key, val) => setForm(p => {
    const updated = [...p.dependents_data];
    updated[i] = { ...updated[i], [key]: val };
    return { ...p, dependents_data: updated };
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">أضف بيانات كل فرد من أفراد الأسرة التابعين لرب الأسرة.</p>
        <Button type="button" size="sm" onClick={addRow} className="gap-1.5">
          <Plus className="w-4 h-4" /> إضافة تابع
        </Button>
      </div>

      {deps.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border p-10 flex flex-col items-center gap-3 text-muted-foreground">
          <Users className="w-8 h-8" />
          <p className="text-sm">لا يوجد تابعون بعد. انقر "إضافة تابع" للبدء.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deps.map((dep, i) => (
            <div key={i} className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">التابع #{i + 1}</span>
                <button type="button" onClick={() => removeRow(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Input placeholder="الاسم" value={dep.name} onChange={e => updateRow(i, "name", e.target.value)} />
                <Input type="number" placeholder="العمر" min={0} max={120} value={dep.age} onChange={e => updateRow(i, "age", e.target.value)} />
                <Select value={dep.relation} onValueChange={v => updateRow(i, "relation", v)}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="العلاقة" /></SelectTrigger>
                  <SelectContent>
                    {["زوجة", "ابن", "ابنة", "أم", "أب", "أخ", "أخت", "أخرى"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={dep.health_status} onValueChange={v => updateRow(i, "health_status", v)}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="الصحة" /></SelectTrigger>
                  <SelectContent>
                    {["سليم", "معاق", "مريض"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={dep.education} onValueChange={v => updateRow(i, "education", v)}>
                  <SelectTrigger className="h-10"><SelectValue placeholder="التعليم" /></SelectTrigger>
                  <SelectContent>
                    {["لا يدرس", "روضة", "ابتدائي", "متوسط", "ثانوي", "جامعي"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-1.5 pt-2">
        <label className="text-sm font-medium">رأي الباحث — التابعون</label>
        <Textarea placeholder="ملاحظات حول أوضاع التابعين…" rows={3} className="resize-none"
          value={form.researcher_opinion_dependents}
          onChange={e => setForm(p => ({ ...p, researcher_opinion_dependents: e.target.value }))} />
      </div>
    </div>
  );
}
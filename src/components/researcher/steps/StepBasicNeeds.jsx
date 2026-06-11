import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const NEEDS_TREE = [
  {
    id: "renovation", label: "ترميم السكن", emoji: "🏠",
    subs: ["ترميم سقف", "ترميم جدران", "ترميم حمامات", "ترميم مطبخ", "أخرى"],
  },
  {
    id: "furniture", label: "أثاث", emoji: "🛋",
    subs: ["سرير", "طاولة طعام", "كنب", "خزانة", "أخرى"],
  },
  {
    id: "appliances", label: "أجهزة منزلية", emoji: "📺",
    subs: ["ثلاجة", "غسالة", "مكيف", "بوتاجاز", "أخرى"],
  },
  {
    id: "sponsorship", label: "كفالة مالية", emoji: "💵",
    subs: ["كفالة شهرية", "كفالة موسمية", "كفالة طارئة"],
  },
  {
    id: "bills", label: "سداد فواتير", emoji: "🧾",
    subs: ["فاتورة كهرباء", "فاتورة ماء", "فاتورة إنترنت", "أخرى"],
  },
  {
    id: "medical", label: "علاج طبي", emoji: "🏥",
    subs: ["أدوية", "عمليات جراحية", "أجهزة طبية", "علاج نفسي"],
  },
  {
    id: "education", label: "دعم تعليمي", emoji: "📚",
    subs: ["مستلزمات مدرسية", "رسوم دراسية", "دروس خصوصية"],
  },
];

export default function StepBasicNeeds({ form, setForm }) {
  const [selected, setSelected] = useState(() => {
    try { return JSON.parse(form.basic_needs || "{}"); } catch { return {}; }
  });

  const toggle = (id) => {
    const next = { ...selected };
    if (next[id]) delete next[id];
    else next[id] = { details: [] };
    setSelected(next);
    setForm(p => ({ ...p, basic_needs: JSON.stringify(next) }));
  };

  const toggleSub = (id, sub) => {
    const next = { ...selected };
    if (!next[id]) next[id] = { details: [] };
    const arr = next[id].details || [];
    next[id].details = arr.includes(sub) ? arr.filter(s => s !== sub) : [...arr, sub];
    setSelected(next);
    setForm(p => ({ ...p, basic_needs: JSON.stringify(next) }));
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">اختر الاحتياجات الأساسية للأسرة. يمكن اختيار أكثر من احتياج وتحديد التفاصيل لكل منها.</p>
      <div className="space-y-3">
        {NEEDS_TREE.map(n => {
          const isSelected = !!selected[n.id];
          return (
            <div key={n.id} className={cn("rounded-xl border-2 p-4 transition-all", isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/30")}>
              <button type="button" onClick={() => toggle(n.id)}
                className="flex items-center gap-3 w-full text-right">
                <span className="text-2xl">{n.emoji}</span>
                <span className={cn("font-medium text-sm flex-1", isSelected ? "text-primary" : "text-foreground")}>{n.label}</span>
                <div className={cn("w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                  isSelected ? "border-primary bg-primary" : "border-border"
                )}>
                  {isSelected && <span className="text-white text-xs">✓</span>}
                </div>
              </button>
              {isSelected && (
                <div className="mt-3 pr-9 flex flex-wrap gap-2">
                  {n.subs.map(sub => {
                    const active = selected[n.id]?.details?.includes(sub);
                    return (
                      <button key={sub} type="button" onClick={() => toggleSub(n.id, sub)}
                        className={cn("text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer",
                          active ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40"
                        )}>
                        {sub}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="space-y-1.5 pt-2">
        <label className="text-sm font-medium">رأي الباحث — الاحتياجات الأساسية</label>
        <Textarea placeholder="تفصيل الاحتياجات وأسبابها وأولويتها…" rows={3} className="resize-none"
          value={form.researcher_opinion_needs}
          onChange={e => setForm(p => ({ ...p, researcher_opinion_needs: e.target.value }))} />
      </div>
    </div>
  );
}
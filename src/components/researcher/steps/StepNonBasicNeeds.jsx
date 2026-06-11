import { cn } from "@/lib/utils";

const NON_BASIC = [
  { id: "laptop", label: "حاسب آلي", emoji: "💻" },
  { id: "tablet", label: "جهاز لوحي", emoji: "📱" },
  { id: "internet", label: "اشتراك إنترنت", emoji: "📡" },
  { id: "printer", label: "طابعة", emoji: "🖨" },
  { id: "vocational", label: "تدريب مهني", emoji: "🔧" },
  { id: "language", label: "تعلم لغة", emoji: "🌐" },
  { id: "business", label: "دعم مشروع صغير", emoji: "🏪" },
  { id: "financial_literacy", label: "تثقيف مالي", emoji: "📊" },
  { id: "parenting", label: "مهارات الأسرة", emoji: "👨‍👩‍👧" },
];

export default function StepNonBasicNeeds({ form, setForm }) {
  const selected = (() => {
    try { return JSON.parse(form.non_basic_needs || "[]"); } catch { return []; }
  })();

  const toggle = (id) => {
    const next = selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id];
    setForm(p => ({ ...p, non_basic_needs: JSON.stringify(next) }));
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">اختر الاحتياجات التطويرية وغير الأساسية التي تساعد الأسرة على الاستقلالية والتنمية.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {NON_BASIC.map(n => {
          const active = selected.includes(n.id);
          return (
            <button key={n.id} type="button" onClick={() => toggle(n.id)}
              className={cn("flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer text-center",
                active ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/30 hover:bg-muted/40"
              )}>
              <span className="text-3xl">{n.emoji}</span>
              <span className="text-xs font-medium leading-tight">{n.label}</span>
              {active && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">محدد</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function MoneyField({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <Input type="number" min={0} step="0.01" placeholder="0.00" value={value}
          onChange={e => onChange(Number(e.target.value) || 0)}
          className="h-9 pl-10" />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">ر.س</span>
      </div>
    </div>
  );
}

export default function StepFinancial({ form, setForm }) {
  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  // Auto-calculate totals
  useEffect(() => {
    const income =
      (Number(form.income_salary) || 0) +
      (Number(form.income_social_security) || 0) +
      (Number(form.income_account_citizen) || 0) +
      (Number(form.income_rehab) || 0) +
      (Number(form.income_other_ngos) || 0);
    const expenses =
      (Number(form.expense_rent) || 0) +
      (Number(form.expense_electricity) || 0) +
      (Number(form.expense_water) || 0) +
      (Number(form.expense_internet) || 0) +
      (Number(form.expense_medical) || 0) +
      (Number(form.expense_transport) || 0) +
      (Number(form.expense_food) || 0) +
      (Number(form.expense_debt_installment) || 0);
    setForm(p => ({
      ...p,
      total_income: income,
      total_expenses: expenses,
      net_income: income - expenses,
      income_level: income === 0 ? "لا يوجد دخل" : income < 3000 ? "دخل منخفض" : "دخل متوسط",
    }));
  }, [
    form.income_salary, form.income_social_security, form.income_account_citizen,
    form.income_rehab, form.income_other_ngos,
    form.expense_rent, form.expense_electricity, form.expense_water,
    form.expense_internet, form.expense_medical, form.expense_transport,
    form.expense_food, form.expense_debt_installment,
  ]);

  const net = (Number(form.total_income) || 0) - (Number(form.total_expenses) || 0);

  return (
    <div className="space-y-6">
      {/* Income */}
      <div>
        <h4 className="text-sm font-semibold mb-3 text-foreground">مصادر الدخل الشهري</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <MoneyField label="راتب وظيفي" value={form.income_salary} onChange={v => set("income_salary", v)} />
          <MoneyField label="الضمان الاجتماعي" value={form.income_social_security} onChange={v => set("income_social_security", v)} />
          <MoneyField label="حساب المواطن" value={form.income_account_citizen} onChange={v => set("income_account_citizen", v)} />
          <MoneyField label="التأهيل الشامل" value={form.income_rehab} onChange={v => set("income_rehab", v)} />
          <MoneyField label="دعم جمعيات أخرى" value={form.income_other_ngos} onChange={v => set("income_other_ngos", v)} />
        </div>
        <div className="mt-3 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">مصادر أخرى (ماشية، مزرعة، سيارة أجرة…)</label>
          <Input placeholder="اذكر المصادر وقيمتها" value={form.income_other_sources}
            onChange={e => set("income_other_sources", e.target.value)} />
        </div>
        <div className="mt-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-4 py-2.5 flex items-center justify-between">
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">إجمالي الدخل الشهري</span>
          <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{(form.total_income || 0).toFixed(2)} ر.س</span>
        </div>
      </div>

      {/* Expenses */}
      <div>
        <h4 className="text-sm font-semibold mb-3 text-foreground">الالتزامات الشهرية</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <MoneyField label="الإيجار" value={form.expense_rent} onChange={v => set("expense_rent", v)} />
          <MoneyField label="الكهرباء" value={form.expense_electricity} onChange={v => set("expense_electricity", v)} />
          <MoneyField label="الماء" value={form.expense_water} onChange={v => set("expense_water", v)} />
          <MoneyField label="الإنترنت" value={form.expense_internet} onChange={v => set("expense_internet", v)} />
          <MoneyField label="العلاج والدواء" value={form.expense_medical} onChange={v => set("expense_medical", v)} />
          <MoneyField label="المواصلات" value={form.expense_transport} onChange={v => set("expense_transport", v)} />
          <MoneyField label="الغذاء" value={form.expense_food} onChange={v => set("expense_food", v)} />
          <MoneyField label="أقساط الديون" value={form.expense_debt_installment} onChange={v => set("expense_debt_installment", v)} />
        </div>
        {(Number(form.expense_debt_installment) > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">سبب الدين</label>
              <Input placeholder="علاج، بناء…" value={form.debt_reason} onChange={e => set("debt_reason", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">مدة الدين</label>
              <Input placeholder="سنتان، 6 أشهر…" value={form.debt_period} onChange={e => set("debt_period", e.target.value)} />
            </div>
          </div>
        )}
        <div className="mt-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-2.5 flex items-center justify-between">
          <span className="text-sm font-medium text-red-700 dark:text-red-400">إجمالي المصروفات الشهرية</span>
          <span className="text-lg font-bold text-red-700 dark:text-red-400">{(form.total_expenses || 0).toFixed(2)} ر.س</span>
        </div>
      </div>

      {/* Net */}
      <div className={`rounded-xl border-2 px-5 py-4 flex items-center justify-between ${net >= 0 ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/10" : "border-red-400 bg-red-50 dark:bg-red-900/10"}`}>
        <span className="font-semibold text-sm">صافي الدخل الشهري</span>
        <span className={`text-xl font-bold ${net >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
          {net >= 0 ? "+" : ""}{net.toFixed(2)} ر.س
        </span>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">رأي الباحث — الوضع المالي</label>
        <Textarea placeholder="ملاحظات حول الوضع المالي للأسرة…" rows={3} className="resize-none"
          value={form.researcher_opinion_financial}
          onChange={e => set("researcher_opinion_financial", e.target.value)} />
      </div>
    </div>
  );
}
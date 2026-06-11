import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";

const PRIORITIES = ["الكل", "عاجل", "مرتفع", "متوسط", "منخفض"];
const CASE_TYPES = ["الكل", "مادي", "صحي", "تعليمي", "اجتماعي", "متعدد"];
const SOCIAL     = ["الكل", "أعزب", "متزوج", "مطلق", "أرمل"];
const INCOME     = ["الكل", "لا يوجد دخل", "دخل منخفض", "دخل متوسط"];
const STATUSES   = ["active", "supported", "archived", "all"];
const STATUS_LBL = { active: "نشط", supported: "مدعوم", archived: "مؤرشف", all: "الكل" };
const SORT_OPTS  = [
  { value: "priority_asc",  label: "الأولوية: الأعلى أولاً" },
  { value: "priority_desc", label: "الأولوية: الأقل أولاً" },
  { value: "age_asc",       label: "العمر: تصاعدي" },
  { value: "age_desc",      label: "العمر: تنازلي" },
  { value: "name_asc",      label: "الاسم: أ → ي" },
  { value: "date_desc",     label: "الأحدث أولاً" },
];

export default function BeneficiaryFilters({ filters, onFilterChange, onReset }) {
  const set = (key) => (val) => onFilterChange({ ...filters, [key]: val });
  const hasActive = Object.entries(filters).some(([k, v]) =>
    k !== "status" && v !== "الكل" && v !== "" && v !== "date_desc"
  ) || filters.status !== "active";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SlidersHorizontal className="w-4 h-4 text-muted-foreground flex-shrink-0" />

      <FilterSelect value={filters.priority} onChange={set("priority")} placeholder="الأولوية" options={PRIORITIES} />
      <FilterSelect value={filters.case_type} onChange={set("case_type")} placeholder="نوع الحالة" options={CASE_TYPES} />
      <FilterSelect value={filters.social_status} onChange={set("social_status")} placeholder="الحالة الاجتماعية" options={SOCIAL} />
      <FilterSelect value={filters.income_level} onChange={set("income_level")} placeholder="مستوى الدخل" options={INCOME} />
      <FilterSelect value={filters.status} onChange={set("status")} placeholder="الحالة"
        options={STATUSES} labelMap={STATUS_LBL} />
      <FilterSelect value={filters.sort} onChange={set("sort")} placeholder="الترتيب"
        options={SORT_OPTS.map(o => o.value)} labelMap={Object.fromEntries(SORT_OPTS.map(o => [o.value, o.label]))} />

      {hasActive && (
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
          <X className="w-3 h-3" /> إعادة ضبط
        </Button>
      )}
    </div>
  );
}

function FilterSelect({ value, onChange, placeholder, options, labelMap }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 text-xs w-auto min-w-[120px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(opt => (
          <SelectItem key={opt} value={opt} className="text-xs">
            {labelMap ? labelMap[opt] : opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
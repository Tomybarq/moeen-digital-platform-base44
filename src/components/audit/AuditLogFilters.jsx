import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, X, Search } from "lucide-react";

const EVENT_TYPES = [
  { value: "all", label: "جميع الأحداث" },
  { value: "CREATE", label: "إنشاء" },
  { value: "UPDATE", label: "تعديل" },
  { value: "DELETE", label: "حذف" },
  { value: "BULK_IMPORT", label: "استيراد جماعي" },
  { value: "BULK_EXPORT", label: "تصدير" },
  { value: "LOGIN_SUCCESS", label: "تسجيل دخول ناجح" },
  { value: "LOGIN_FAILURE", label: "تسجيل دخول فاشل" },
  { value: "ROLE_CHANGE", label: "تغيير دور" },
  { value: "PERMISSION_CHANGE", label: "تغيير صلاحية" },
  { value: "ARCHIVE", label: "أرشفة" },
  { value: "UNARCHIVE", label: "إلغاء أرشفة" },
];

const RESOURCE_TYPES = [
  { value: "all", label: "جميع الموارد" },
  { value: "NGO", label: "منظمة" },
  { value: "Beneficiary", label: "مستفيد" },
  { value: "Marketer", label: "مسوّق" },
  { value: "User", label: "مستخدم" },
  { value: "Platform", label: "المنصة" },
  { value: "Auth", label: "صلاحيات" },
];

export default function AuditLogFilters({ filters, onFilterChange, onReset }) {
  const hasFilters =
    filters.event_type !== "all" ||
    filters.resource_type !== "all" ||
    filters.search !== "";

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex items-center gap-2 min-w-[180px]">
        <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
        <Select
          value={filters.event_type}
          onValueChange={(v) => handleChange("event_type", v)}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="نوع الحدث" />
          </SelectTrigger>
          <SelectContent>
            {EVENT_TYPES.map((et) => (
              <SelectItem key={et.value} value={et.value}>
                {et.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 min-w-[160px]">
        <Select
          value={filters.resource_type}
          onValueChange={(v) => handleChange("resource_type", v)}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="نوع المورد" />
          </SelectTrigger>
          <SelectContent>
            {RESOURCE_TYPES.map((rt) => (
              <SelectItem key={rt.value} value={rt.value}>
                {rt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative min-w-[200px]">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="بحث باسم المستخدم أو المورد..."
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          className="h-9 pr-9 text-sm"
        />
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-9 text-muted-foreground hover:text-foreground gap-1"
        >
          <X className="w-3.5 h-3.5" />
          مسح الفلاتر
        </Button>
      )}
    </div>
  );
}
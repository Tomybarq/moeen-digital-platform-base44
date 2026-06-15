import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import moment from "moment";

const EVENT_LABELS = {
  CREATE: "إنشاء",
  UPDATE: "تعديل",
  DELETE: "حذف",
  BULK_IMPORT: "استيراد جماعي",
  BULK_EXPORT: "تصدير",
  LOGIN_SUCCESS: "تسجيل دخول ناجح",
  LOGIN_FAILURE: "تسجيل دخول فاشل",
  ROLE_CHANGE: "تغيير دور",
  PERMISSION_CHANGE: "تغيير صلاحية",
  ARCHIVE: "أرشفة",
  UNARCHIVE: "إلغاء أرشفة",
};

const EVENT_COLORS = {
  CREATE: "bg-emerald-100 text-emerald-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
  BULK_IMPORT: "bg-purple-100 text-purple-700",
  BULK_EXPORT: "bg-violet-100 text-violet-700",
  LOGIN_SUCCESS: "bg-green-100 text-green-700",
  LOGIN_FAILURE: "bg-red-100 text-red-700",
  ROLE_CHANGE: "bg-amber-100 text-amber-700",
  PERMISSION_CHANGE: "bg-orange-100 text-orange-700",
  ARCHIVE: "bg-gray-100 text-gray-700",
  UNARCHIVE: "bg-slate-100 text-slate-700",
};

const RESOURCE_LABELS = {
  NGO: "منظمة",
  Beneficiary: "مستفيد",
  Marketer: "مسوّق",
  User: "مستخدم",
  Platform: "المنصة",
  Auth: "صلاحيات",
};

export default function AuditLogTable({ logs, onViewDetail, loading }) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground mt-3">جاري تحميل السجلات…</p>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">لا توجد سجلات تدقيق مطابقة للفلاتر</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 border-b">
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground whitespace-nowrap">
                التاريخ والوقت
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground whitespace-nowrap">
                نوع الحدث
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground whitespace-nowrap">
                المورد
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground whitespace-nowrap">
                المستخدم
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground whitespace-nowrap">
                المنظمة
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground whitespace-nowrap w-16">
                عرض
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground text-xs">
                  {moment(log.created_date).format("YYYY-MM-DD HH:mm:ss")}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <Badge className={cn("text-[10px] font-medium", EVENT_COLORS[log.event_type] || "bg-gray-100 text-gray-700")}>
                    {EVENT_LABELS[log.event_type] || log.event_type}
                  </Badge>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">
                      {RESOURCE_LABELS[log.resource_type] || log.resource_type}
                    </span>
                    {log.resource_label && (
                      <>
                        <span className="text-border">•</span>
                        <span className="font-medium text-foreground truncate max-w-[140px]">
                          {log.resource_label}
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-xs">
                  <div className="flex flex-col">
                    <span className="text-foreground font-medium font-mono text-[11px] truncate max-w-[120px]">
                      {log.user_id || "—"}
                    </span>
                    {log.user_role && (
                      <span className="text-[10px] text-muted-foreground">
                        {log.user_role}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-xs">
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {log.associationId || "—"}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onViewDetail(log)}
                    title="عرض التفاصيل"
                  >
                    <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
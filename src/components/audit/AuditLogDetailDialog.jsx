import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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

export default function AuditLogDetailDialog({ log, open, onClose }) {
  if (!log) return null;

  const eventLabel = EVENT_LABELS[log.event_type] || log.event_type;
  const eventColor = EVENT_COLORS[log.event_type] || "bg-gray-100 text-gray-700";

  let parsedDetails = null;
  if (log.details) {
    try {
      parsedDetails = JSON.parse(log.details);
    } catch {
      parsedDetails = log.details;
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-right">تفاصيل سجل التدقيق</DialogTitle>
          <DialogDescription className="text-right">
            عرض تفاصيل الحدث المُسجَّل
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2 text-right">
          {/* Event type badge */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">نوع الحدث</span>
            <Badge className={cn("text-xs", eventColor)}>{eventLabel}</Badge>
          </div>

          {/* Timestamp */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">التاريخ والوقت</span>
            <span className="text-sm font-medium">
              {moment(log.created_date).format("YYYY-MM-DD HH:mm:ss")}
            </span>
          </div>

          {/* User */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">المستخدم</span>
            <span className="text-sm font-medium">
              {log.user_id || "—"}
            </span>
          </div>

          {/* User role */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">الدور</span>
            <span className="text-sm">{log.user_role || "—"}</span>
          </div>

          {/* Resource */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">نوع المورد</span>
            <span className="text-sm font-medium">{log.resource_type || "—"}</span>
          </div>

          {/* Resource ID */}
          {log.resource_id && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">معرّف المورد</span>
              <span className="text-sm font-mono text-xs">{log.resource_id}</span>
            </div>
          )}

          {/* Resource label */}
          {log.resource_label && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">المورد</span>
              <span className="text-sm font-medium">{log.resource_label}</span>
            </div>
          )}

          {/* associationId */}
          {log.associationId && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">معرّف المنظمة</span>
              <span className="text-sm font-mono text-xs">{log.associationId}</span>
            </div>
          )}

          {/* IP */}
          {log.ip_address && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">عنوان IP</span>
              <span className="text-sm font-mono text-xs">{log.ip_address}</span>
            </div>
          )}

          {/* Details JSON */}
          {parsedDetails && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-2">التفاصيل</p>
              <pre className="bg-muted/50 rounded-lg p-3 text-xs overflow-auto max-h-64 text-left dir-ltr">
                {typeof parsedDetails === "object"
                  ? JSON.stringify(parsedDetails, null, 2)
                  : parsedDetails}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
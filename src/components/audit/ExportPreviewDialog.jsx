import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import moment from "moment";

const COLUMNS = [
  { key: "event_type", label: "نوع الحدث", default: true },
  { key: "user_role", label: "الدور", default: true },
  { key: "resource_type", label: "نوع المورد", default: true },
  { key: "resource_label", label: "المورد", default: true },
  { key: "resource_id", label: "معرّف المورد", default: false },
  { key: "associationId", label: "معرّف المنظمة", default: false },
  { key: "created_date", label: "التاريخ والوقت", default: true },
  { key: "details", label: "التفاصيل", default: false },
  { key: "ip_address", label: "IP", default: false },
  { key: "user_id", label: "معرّف المستخدم", default: false },
];

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

export default function ExportPreviewDialog({
  open,
  onClose,
  logs,
  totalCount,
  onExport,
  exporting,
}) {
  const [selectedColumns, setSelectedColumns] = useState(
    COLUMNS.filter((c) => c.default).map((c) => c.key)
  );
  const [format, setFormat] = useState("csv");

  const toggleColumn = (key) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const previewRows = logs.slice(0, 15);

  const renderCell = (log, colKey) => {
    switch (colKey) {
      case "event_type":
        return EVENT_LABELS[log.event_type] || log.event_type;
      case "created_date":
        return moment(log.created_date).format("YYYY-MM-DD HH:mm");
      case "details":
        try {
          return JSON.stringify(JSON.parse(log.details || "{}"));
        } catch {
          return log.details || "—";
        }
      default:
        return log[colKey] || "—";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-auto" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-right">معاينة قبل التصدير</DialogTitle>
          <DialogDescription className="text-right">
            {totalCount} سجل جاهز للتصدير — اختر الأعمدة والصيغة
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Column selection */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 text-right">الأعمدة المختارة:</p>
            <div className="flex flex-wrap gap-2">
              {COLUMNS.map((col) => (
                <label
                  key={col.key}
                  className="flex items-center gap-1.5 text-xs cursor-pointer select-none"
                >
                  <Checkbox
                    checked={selectedColumns.includes(col.key)}
                    onCheckedChange={() => toggleColumn(col.key)}
                  />
                  {col.label}
                </label>
              ))}
            </div>
          </div>

          {/* Format selection */}
          <div className="flex items-center gap-3 justify-end">
            <span className="text-xs text-muted-foreground">الصيغة:</span>
            <Button
              variant={format === "csv" ? "default" : "outline"}
              size="sm"
              onClick={() => setFormat("csv")}
              className="gap-1.5 h-8"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              CSV
            </Button>
            <Button
              variant={format === "pdf" ? "default" : "outline"}
              size="sm"
              onClick={() => setFormat("pdf")}
              className="gap-1.5 h-8"
            >
              <FileText className="w-3.5 h-3.5" />
              PDF
            </Button>
          </div>

          {/* Preview table */}
          <div className="border rounded-lg overflow-auto max-h-64">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50 border-b">
                  {selectedColumns.map((key) => (
                    <th
                      key={key}
                      className="px-2.5 py-2 text-right text-muted-foreground font-medium whitespace-nowrap"
                    >
                      {COLUMNS.find((c) => c.key === key)?.label || key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((log, i) => (
                  <tr key={log.id || i} className="border-b last:border-0 hover:bg-muted/30">
                    {selectedColumns.map((key) => (
                      <td key={key} className="px-2.5 py-1.5 whitespace-nowrap">
                        {key === "event_type" ? (
                          <Badge
                            className={cn(
                              "text-[10px]",
                              log.event_type?.startsWith("DELETE")
                                ? "bg-red-100 text-red-700"
                                : log.event_type?.startsWith("CREATE")
                                  ? "bg-emerald-100 text-emerald-700"
                                  : log.event_type?.startsWith("UPDATE")
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                            )}
                          >
                            {renderCell(log, key)}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">
                            {renderCell(log, key)}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {logs.length > 15 && (
                  <tr>
                    <td
                      colSpan={selectedColumns.length}
                      className="px-2.5 py-2 text-center text-muted-foreground text-xs"
                    >
                      ... و {logs.length - 15} سجل آخر
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose} size="sm">
            إلغاء
          </Button>
          <Button
            onClick={() => onExport(format, selectedColumns)}
            disabled={exporting}
            size="sm"
            className="gap-1.5"
          >
            {exporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            تأكيد التصدير
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import UnauthorizedBanner from "@/components/auth/UnauthorizedBanner";
import { Button } from "@/components/ui/button";
import { Download, Shield, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import moment from "moment";
import AuditLogFilters from "@/components/audit/AuditLogFilters";
import AuditLogTable from "@/components/audit/AuditLogTable";
import AuditLogDetailDialog from "@/components/audit/AuditLogDetailDialog";
import ExportPreviewDialog from "@/components/audit/ExportPreviewDialog";
import AuditLogService from "@/services/AuditLogService";

const RESULTS_PER_PAGE = 50;

export default function AuditLogs() {
  const { user } = useAuth();

  // ── State ─────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    event_type: "all",
    resource_type: "all",
    search: "",
  });
  const [page, setPage] = useState(1);
  const [detailLog, setDetailLog] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Access control
  const canView =
    user?.role === "platform_admin" ||
    user?.role === "pdo" ||
    user?.role === "ngo_manager";

  // ── Data fetch ────────────────────────────────────────────────────
  const queryFilters = useMemo(() => {
    const q = {};
    if (filters.event_type !== "all") q.event_type = filters.event_type;
    if (filters.resource_type !== "all") q.resource_type = filters.resource_type;
    if (user?.role === "ngo_manager" && user?.ngo_id) {
      q.associationId = user.ngo_id;
    }
    return q;
  }, [filters, user]);

  const {
    data: logs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["audit-logs", queryFilters, page],
    queryFn: () => AuditLogService.list(queryFilters, page, RESULTS_PER_PAGE),
    keepPreviousData: true,
    enabled: canView,
  });

  // ── Client-side search filter ─────────────────────────────────────
  const filteredLogs = useMemo(() => {
    if (!filters.search) return logs;
    const term = filters.search.toLowerCase();
    return logs.filter(
      (log) =>
        (log.user_id && log.user_id.toLowerCase().includes(term)) ||
        (log.resource_label &&
          log.resource_label.toLowerCase().includes(term)) ||
        (log.resource_type &&
          log.resource_type.toLowerCase().includes(term)) ||
        (log.event_type && log.event_type.toLowerCase().includes(term))
    );
  }, [logs, filters.search]);

  // ── Export ────────────────────────────────────────────────────────
  const handleOpenExport = () => setExportOpen(true);

  const handleExport = async (format, columns) => {
    setExporting(true);
    try {
      const allLogs = await AuditLogService.exportAll(queryFilters);

      const rows = allLogs.map((log) => {
        const row = {};
        columns.forEach((col) => {
          switch (col) {
            case "event_type":
              row[col] =
                {
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
                }[log.event_type] || log.event_type;
              break;
            case "created_date":
              row[col] = moment(log.created_date).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              break;
            case "details":
              try {
                row[col] = JSON.stringify(JSON.parse(log.details || "{}"));
              } catch {
                row[col] = log.details || "";
              }
              break;
            default:
              row[col] = log[col] || "";
          }
        });
        return row;
      });

      if (format === "csv") {
        const headers = columns.join(",");
        const csvRows = rows.map((r) =>
          columns.map((c) => `"${String(r[c] || "").replace(/"/g, '""')}"`).join(",")
        );
        const csv = [headers, ...csvRows].join("\n");
        const blob = new Blob(["\uFEFF" + csv], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `audit_logs_${moment().format("YYYYMMDD_HHmmss")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // PDF via jsPDF
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF({ orientation: "landscape", unit: "mm" });

        doc.setFontSize(14);
        doc.text("سجلات التدقيق — منصة معين", 14, 15);
        doc.setFontSize(9);
        doc.text(
          `تاريخ التصدير: ${moment().format("YYYY-MM-DD HH:mm")}`,
          14,
          22
        );

        const colLabels = columns.map(
          (c) =>
            ({
              event_type: "نوع الحدث",
              user_role: "الدور",
              resource_type: "نوع المورد",
              resource_label: "المورد",
              resource_id: "معرّف المورد",
              associationId: "معرّف المنظمة",
              created_date: "التاريخ والوقت",
              details: "التفاصيل",
              ip_address: "IP",
              user_id: "معرّف المستخدم",
            })[c] || c
        );

        const colWidths = columns.map(() => 35);
        let y = 30;

        // Headers
        doc.setFontSize(8);
        colLabels.forEach((label, i) => {
          doc.text(label, 14 + i * 35, y);
        });
        y += 6;

        // Rows
        doc.setFontSize(7);
        rows.forEach((row) => {
          if (y > 185) {
            doc.addPage();
            y = 15;
          }
          columns.forEach((col, i) => {
            const text = String(row[col] || "").substring(0, 50);
            doc.text(text, 14 + i * 35, y);
          });
          y += 5;
        });

        doc.save(`audit_logs_${moment().format("YYYYMMDD_HHmmss")}.pdf`);
      }

      toast.success("تم التصدير بنجاح");
      setExportOpen(false);
    } catch (err) {
      toast.error("فشل التصدير: " + (err.message || "خطأ غير معروف"));
    } finally {
      setExporting(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({ event_type: "all", resource_type: "all", search: "" });
    setPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const hasMore = logs.length === RESULTS_PER_PAGE;

  if (!canView) {
    return (
      <UnauthorizedBanner message="هذه الصفحة مخصصة لمدير المنصة ومسؤول حماية البيانات ومديري المنظمات." />
    );
  }

  return (
    <div className="space-y-5 max-w-6xl mx-auto" dir="rtl">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              سجل التدقيق
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              سجل غير قابل للتعديل لجميع الأنشطة على المنصة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            تحديث
          </Button>
          <Button
            size="sm"
            onClick={handleOpenExport}
            className="gap-1.5 bg-primary"
          >
            <Download className="w-3.5 h-3.5" />
            تصدير
          </Button>
        </div>
      </motion.div>

      {/* ── Filters ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <AuditLogFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </motion.div>

      {/* ── Info bar ── */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {isLoading
            ? "جاري التحميل…"
            : `${filteredLogs.length} سجل${user?.role === "ngo_manager" ? " (منظمتك فقط)" : ""}`}
        </span>
        <span className="bg-muted/50 px-2 py-0.5 rounded text-[10px]">
          غير قابل للتعديل
        </span>
      </div>

      {/* ── Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AuditLogTable
          logs={filteredLogs}
          loading={isLoading}
          onViewDetail={setDetailLog}
        />
      </motion.div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          السابق
        </Button>
        <span className="text-sm text-muted-foreground">صفحة {page}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasMore}
          onClick={() => handlePageChange(page + 1)}
        >
          التالي
        </Button>
      </div>

      {/* ── Detail dialog ── */}
      <AuditLogDetailDialog
        log={detailLog}
        open={!!detailLog}
        onClose={() => setDetailLog(null)}
      />

      {/* ── Export preview ── */}
      <ExportPreviewDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        logs={filteredLogs}
        totalCount={filteredLogs.length}
        onExport={handleExport}
        exporting={exporting}
      />
    </div>
  );
}
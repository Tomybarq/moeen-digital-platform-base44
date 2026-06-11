import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPageRange, PAGE_SIZE_OPTIONS } from "@/lib/pagination";
import { cn } from "@/lib/utils";

/**
 * Reusable RTL-aware pagination bar.
 * Props: currentPage, totalPages, totalItems, pageSize, onPageChange, onPageSizeChange
 */
export default function PaginationBar({
  currentPage, totalPages, totalItems, pageSize,
  onPageChange, onPageSizeChange,
}) {
  if (totalPages <= 1 && totalItems <= pageSize) return null;

  const pages = getPageRange(currentPage, totalPages);
  const start = (currentPage - 1) * pageSize + 1;
  const end   = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3" role="navigation" aria-label="ترقيم الصفحات">
      {/* Info */}
      <p className="text-xs text-muted-foreground order-2 sm:order-1">
        عرض <span className="font-medium text-foreground">{start}–{end}</span> من <span className="font-medium text-foreground">{totalItems}</span>
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* Next (RTL: right arrow = next) */}
        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer"
          disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}
          aria-label="الصفحة التالية">
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {pages.map((p, i) =>
          p === null ? (
            <span key={`gap-${i}`} className="px-1 text-muted-foreground text-sm select-none">…</span>
          ) : (
            <Button key={p} variant={p === currentPage ? "default" : "outline"} size="icon"
              className={cn("h-8 w-8 cursor-pointer text-xs",
                p === currentPage && "pointer-events-none")}
              onClick={() => onPageChange(p)} aria-label={`صفحة ${p}`}
              aria-current={p === currentPage ? "page" : undefined}>
              {p}
            </Button>
          )
        )}

        {/* Prev (RTL: left arrow = prev) */}
        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer"
          disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}
          aria-label="الصفحة السابقة">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Page size selector */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2 order-3">
          <span className="text-xs text-muted-foreground">عناصر/صفحة</span>
          <Select value={String(pageSize)} onValueChange={v => { onPageSizeChange(Number(v)); onPageChange(1); }}>
            <SelectTrigger className="h-8 w-20 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map(s => (
                <SelectItem key={s} value={String(s)} className="text-xs">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
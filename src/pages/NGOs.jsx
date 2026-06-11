import { Building2, Plus, Search } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NGOs() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-foreground">إدارة المنظمات</h2>
          <p className="text-sm text-muted-foreground mt-1">عرض وإدارة جميع المنظمات غير الربحية المسجّلة</p>
        </div>
        <Button className="cursor-pointer gap-2">
          <Plus className="w-4 h-4" />
          إضافة منظمة
        </Button>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="البحث عن منظمة…" className="pr-10" />
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <EmptyState
          icon={Building2}
          title="لا توجد منظمات مسجّلة بعد"
          description="ابدأ بإضافة أول منظمة غير ربحية إلى المنصة لإدارة بياناتها وبرامجها."
          actionLabel="إضافة أول منظمة"
          onAction={() => {}}
        />
      </div>
    </div>
  );
}
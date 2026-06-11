import { Megaphone, Plus, Search } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Marketers() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-foreground">إدارة المسوّقين</h2>
          <p className="text-sm text-muted-foreground mt-1">عرض وإدارة فريق التسويق والحملات</p>
        </div>
        <Button className="cursor-pointer gap-2">
          <Plus className="w-4 h-4" />
          إضافة مسوّق
        </Button>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="البحث عن مسوّق…" className="pr-10" />
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <EmptyState
          icon={Megaphone}
          title="لا يوجد مسوّقون مسجّلون بعد"
          description="أضف المسوّقين لبدء إدارة الحملات التسويقية وتتبع أدائهم."
          actionLabel="إضافة أول مسوّق"
          onAction={() => {}}
        />
      </div>
    </div>
  );
}
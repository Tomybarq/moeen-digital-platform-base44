import { motion } from "framer-motion";
import { Building2, Users, Megaphone, TrendingUp, Search, ShieldCheck } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import PlatformOverviewChart from "@/components/dashboard/PlatformOverviewChart";
import ResearcherActivityWidget from "@/components/dashboard/ResearcherActivityWidget";
import NGOsWidget from "@/components/dashboard/NGOsWidget";
import MarketerActivityWidget from "@/components/dashboard/MarketerActivityWidget";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import { useAuth } from "@/lib/AuthContext";
import { getRoleLabel } from "@/lib/rbac";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-2xl font-bold text-foreground">
            مرحباً{user?.full_name ? `، ${user.full_name.split(" ")[0]}` : ""} 👋
          </h2>
          {user?.role && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {getRoleLabel(user.role)}
            </span>
          )}
        </div>
        <p className="text-muted-foreground text-sm">لوحة تحكم مدير المنصة — نظرة شاملة على الأداء</p>
      </motion.div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="المنظمات المسجّلة" value="٤٨" icon={Building2} trend={14} trendLabel="هذا الشهر" />
        <StatCard title="الباحثون النشطون" value="٢٣" icon={Search} trend={9} trendLabel="هذا الأسبوع" />
        <StatCard title="المسوّقون النشطون" value="٨٩" icon={Megaphone} trend={5} trendLabel="هذا الأسبوع" />
        <StatCard title="الحملات الجارية" value="١٥" icon={TrendingUp} trend={25} trendLabel="هذا الشهر" />
      </div>

      {/* Overview chart + activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PlatformOverviewChart />
        <RecentActivityFeed />
      </div>

      {/* Three main widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ResearcherActivityWidget />
        <NGOsWidget />
        <MarketerActivityWidget />
      </div>
    </div>
  );
}
import { useMemo } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

// Convert Arabic-Indic digits to Western Arabic (for display safety)
function toArabicNumeral(n) {
  return n?.toLocaleString("ar-SA") ?? "٠";
}

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch all three key entities in parallel — select only needed fields via filter
  const { data: ngos = [] } = useQuery({
    queryKey: ["dashboard-ngos"],
    queryFn: () => base44.entities.NGO.filter({ status: "active" }, "-created_date", 200),
    staleTime: 60_000,
  });

  const { data: beneficiaries = [] } = useQuery({
    queryKey: ["dashboard-beneficiaries"],
    queryFn: () => base44.entities.Beneficiary.list("-created_date", 500),
    staleTime: 60_000,
  });

  const { data: marketers = [] } = useQuery({
    queryKey: ["dashboard-marketers"],
    queryFn: () => base44.entities.Marketer.filter({ status: "active" }, "-created_date", 200),
    staleTime: 60_000,
  });

  // Compute aggregated stats client-side (materialized-view equivalent)
  const stats = useMemo(() => {
    const activeResearchers = new Set(
      beneficiaries
        .filter(b => b.researcher_name && b.status !== "archived")
        .map(b => b.researcher_name)
    ).size;

    const urgentCases = beneficiaries.filter(
      b => b.priority === "عاجل" && b.status !== "archived"
    ).length;

    return {
      ngoCount:         ngos.length,
      researcherCount:  activeResearchers,
      marketerCount:    marketers.length,
      urgentCases,
    };
  }, [ngos, beneficiaries, marketers]);

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

      {/* Top Stats — live data */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="المنظمات النشطة"      value={toArabicNumeral(stats.ngoCount)}        icon={Building2}   trend={null} trendLabel="منظمة مسجّلة" />
        <StatCard title="الباحثون النشطون"     value={toArabicNumeral(stats.researcherCount)} icon={Search}      trend={null} trendLabel="باحث ميداني" />
        <StatCard title="المسوّقون النشطون"    value={toArabicNumeral(stats.marketerCount)}   icon={Megaphone}   trend={null} trendLabel="مسوّق مسجّل" />
        <StatCard title="الحالات العاجلة"      value={toArabicNumeral(stats.urgentCases)}     icon={TrendingUp}  trend={null} trendLabel="بحاجة عاجلة" />
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
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
import { getRoleLabel, hasPermission, ROLES, filterByNGO } from "@/lib/rbac";
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

  const { data: rawBeneficiaries = [] } = useQuery({
    queryKey: ["dashboard-beneficiaries"],
    queryFn: () => base44.entities.Beneficiary.list("-created_date", 500),
    staleTime: 60_000,
  });

  const { data: marketers = [] } = useQuery({
    queryKey: ["dashboard-marketers"],
    queryFn: () => base44.entities.Marketer.filter({ status: "active" }, "-created_date", 200),
    staleTime: 60_000,
  });

  // Apply NGO/user-level isolation — same logic as Beneficiaries page
  const beneficiaries = useMemo(
    () => filterByNGO(user, rawBeneficiaries),
    [user, rawBeneficiaries]
  );

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


  const isAdmin       = user?.role === ROLES.PLATFORM_ADMIN;
  const isNgoManager  = user?.role === ROLES.NGO_MANAGER;
  const isResearcher  = user?.role === ROLES.RESEARCHER;
  const isMarketer    = user?.role === ROLES.MARKETER;
  const isPdo         = user?.role === ROLES.PDO;

  const dashSubtitle = {
    platform_admin: "لوحة التحكم الشاملة — نظرة كاملة على المنصة",
    ngo_manager:    "لوحة مدير المنظمة — مستفيدو منظمتك وتقاريرها",
    researcher:     "مساحة الباحث الميداني — حالاتك المسجّلة",
    marketer:       "لوحة التسويق — الحملات والحالات القابلة للمشاركة",
    pdo:            "لوحة مسؤول حماية البيانات — الامتثال والتدقيق",
  }[user?.role] || "لوحة التحكم";

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
            <span className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: "rgba(200,151,42,0.12)", color: "#c8972a" }}>
              {getRoleLabel(user.role)}
            </span>
          )}
          {user?.ngo_name && !isAdmin && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
              {user.ngo_name}
            </span>
          )}
        </div>
        <p className="text-muted-foreground text-sm">{dashSubtitle}</p>
      </motion.div>

      {/* Top Stats — visibility gated by role */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(isAdmin || isNgoManager) && (
          <StatCard title="المنظمات النشطة" value={toArabicNumeral(stats.ngoCount)} icon={Building2} trend={null} trendLabel="منظمة مسجّلة" />
        )}
        {(isAdmin || isNgoManager || isPdo) && (
          <StatCard title="الباحثون النشطون" value={toArabicNumeral(stats.researcherCount)} icon={Search} trend={null} trendLabel="باحث ميداني" />
        )}
        {(isAdmin || isNgoManager || isMarketer) && (
          <StatCard title="المسوّقون النشطون" value={toArabicNumeral(stats.marketerCount)} icon={Megaphone} trend={null} trendLabel="مسوّق مسجّل" />
        )}
        <StatCard title="الحالات العاجلة" value={toArabicNumeral(stats.urgentCases)} icon={TrendingUp} trend={null} trendLabel="بحاجة عاجلة" />
        {isResearcher && (
          <StatCard
            title="حالاتي المسجّلة"
            value={toArabicNumeral(beneficiaries.filter(b => b.created_by_id === user?.id).length)}
            icon={ShieldCheck} trend={null} trendLabel="حالة سجّلتها"
          />
        )}
      </div>

      {/* Overview chart + activity feed — admin/ngo_manager/pdo */}
      {(isAdmin || isNgoManager || isPdo) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PlatformOverviewChart />
          <RecentActivityFeed />
        </div>
      )}

      {/* Researcher: only their own activity feed */}
      {(isResearcher || isMarketer) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivityFeed />
          <NGOsWidget />
        </div>
      )}

      {/* Three main widgets — admin sees all */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ResearcherActivityWidget />
          <NGOsWidget />
          <MarketerActivityWidget />
        </div>
      )}

      {/* NGO Manager: researcher + marketer widgets */}
      {isNgoManager && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResearcherActivityWidget />
          <MarketerActivityWidget />
        </div>
      )}
    </div>
  );
}
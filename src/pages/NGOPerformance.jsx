import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Building2, Users, TrendingUp, Target, Activity, BarChart3, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell, LabelList } from "recharts";
import NGOService from "@/services/NGOService";
import BeneficiaryService from "@/services/BeneficiaryService";
import MarketerService from "@/services/MarketerService";
import KPICard from "@/components/dashboard/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CASE_COLORS = { مادي: "#00A651", صحي: "#e11d48", تعليمي: "#3b82f6", اجتماعي: "#f59e0b", متعدد: "#7c3aed" };
const PRIORITY_COLORS = { عاجل: "#dc2626", مرتفع: "#f97316", متوسط: "#c8972a", منخفض: "#6b7280" };

export default function NGOPerformance() {
  const [selectedNgoId, setSelectedNgoId] = useState("all");

  const { data: ngos = [], isLoading: loadingNGOs } = useQuery({
    queryKey: ["ngos"],
    queryFn: () => NGOService.getAll(),
  });
  const { data: beneficiaries = [], isLoading: loadingBens } = useQuery({
    queryKey: ["beneficiaries"],
    queryFn: () => BeneficiaryService.getAll(),
  });
  const { data: marketers = [], isLoading: loadingMark } = useQuery({
    queryKey: ["marketers"],
    queryFn: () => MarketerService.getAll(),
  });

  const activeNGOs = useMemo(() => ngos.filter((n) => n.status !== "archived"), [ngos]);
  const isLoading = loadingNGOs || loadingBens || loadingMark;

  const ngoStats = useMemo(() => {
    return activeNGOs.map((ngo) => {
      const ngoBeneficiaries = beneficiaries.filter((b) => b.ngo_id === ngo.id);
      const ngoMarketers = marketers.filter((m) => m.ngo_id === ngo.id);
      const activeCases = ngoBeneficiaries.filter((b) => b.status === "active").length;
      const supportedCases = ngoBeneficiaries.filter((b) => b.status === "supported").length;
      const archivedCases = ngoBeneficiaries.filter((b) => b.status === "archived").length;
      const urgentCases = ngoBeneficiaries.filter((b) => b.priority === "عاجل").length;

      const caseTypes = {};
      ngoBeneficiaries.forEach((b) => {
        if (b.case_type) caseTypes[b.case_type] = (caseTypes[b.case_type] || 0) + 1;
      });

      const priorities = {};
      ngoBeneficiaries.forEach((b) => {
        if (b.priority) priorities[b.priority] = (priorities[b.priority] || 0) + 1;
      });

      return {
        id: ngo.id,
        name: ngo.name,
        city: ngo.city,
        category: ngo.category,
        totalBeneficiaries: ngoBeneficiaries.length,
        activeCases,
        supportedCases,
        archivedCases,
        urgentCases,
        marketersCount: ngoMarketers.length,
        caseTypes,
        priorities,
      };
    });
  }, [activeNGOs, beneficiaries, marketers]);

  const selectedStats = selectedNgoId === "all"
    ? null
    : ngoStats.find((s) => s.id === selectedNgoId);

  const topBarData = useMemo(() => {
    return [...ngoStats]
      .sort((a, b) => b.totalBeneficiaries - a.totalBeneficiaries)
      .slice(0, 8)
      .map((s) => ({ name: s.name, المستفيدون: s.totalBeneficiaries }));
  }, [ngoStats]);

  const totalBeneficiaries = useMemo(() => ngoStats.reduce((sum, s) => sum + s.totalBeneficiaries, 0), [ngoStats]);
  const totalUrgent = useMemo(() => ngoStats.reduce((sum, s) => sum + s.urgentCases, 0), [ngoStats]);
  const totalMarketers = useMemo(() => ngoStats.reduce((sum, s) => sum + s.marketersCount, 0), [ngoStats]);
  const activeRatio = activeNGOs.length > 0
    ? Math.round((ngoStats.filter((s) => s.totalBeneficiaries > 0).length / activeNGOs.length) * 100)
    : 0;

  const caseTypeTotal = useMemo(() => {
    const totals = {};
    ngoStats.forEach((s) => {
      Object.entries(s.caseTypes).forEach(([k, v]) => {
        totals[k] = (totals[k] || 0) + v;
      });
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [ngoStats]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-36 rounded-2xl bg-muted" />)}
        </div>
        <div className="h-72 rounded-2xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">أداء المنظمات</h2>
          <p className="text-sm text-muted-foreground mt-1">
            مؤشرات الأداء الرئيسية للمنظمات النشطة
            <Badge variant="secondary" className="text-xs mr-2">{activeNGOs.length} منظمة نشطة</Badge>
          </p>
        </div>
        <Select value={selectedNgoId} onValueChange={setSelectedNgoId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="اختر منظمة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المنظمات</SelectItem>
            {activeNGOs.map((ngo) => (
              <SelectItem key={ngo.id} value={ngo.id}>{ngo.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="إجمالي المستفيدين" value={selectedStats ? selectedStats.totalBeneficiaries : totalBeneficiaries}
          icon={Users} color="emerald" trend={null} />
        <KPICard title="الحالات العاجلة" value={selectedStats ? selectedStats.urgentCases : totalUrgent}
          icon={Target} color="red" trend={null} />
        <KPICard title="المسوقون" value={selectedStats ? selectedStats.marketersCount : totalMarketers}
          icon={TrendingUp} color="purple" trend={null} />
        <KPICard title="نسبة التغطية" value={selectedStats ? (selectedStats.totalBeneficiaries > 0 ? 100 : 0) : activeRatio}
          icon={Activity} color="gold" trend={null} subtitle="من المنظمات لديها مستفيدين" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart — top NGOs by beneficiaries */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                أعلى المنظمات من حيث عدد المستفيدين
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topBarData.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-12">لا توجد بيانات كافية</p>
              ) : (
                <ResponsiveContainer width="100%" height={360}>
                  <BarChart data={topBarData} margin={{ top: 10, left: 5, right: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00A651" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#008a43" stopOpacity={0.7} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                      tickLine={false}
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--card))",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        fontSize: "13px",
                        direction: "rtl",
                        textAlign: "right",
                      }}
                      formatter={(v) => [`${v} مستفيد`, "العدد"]}
                      labelFormatter={(name) => `منظمة: ${name}`}
                    />
                    <Bar dataKey="المستفيدون" fill="url(#barGradient)" radius={[8, 8, 0, 0]} maxBarSize={50}>
                      <LabelList
                        dataKey="المستفيدون"
                        position="top"
                        style={{ fontSize: 11, fontWeight: 700, fill: "hsl(var(--foreground))" }}
                        formatter={(v) => v > 0 ? v : ""}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie chart — case type distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="w-4 h-4 text-primary" />
                توزيع أنواع الحالات
              </CardTitle>
            </CardHeader>
            <CardContent>
              {caseTypeTotal.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-12">لا توجد بيانات كافية</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RPieChart>
                    <Pie data={caseTypeTotal} dataKey="value" nameKey="name" cx="50%" cy="50%"
                      outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {caseTypeTotal.map((entry, i) => (
                        <Cell key={i} fill={CASE_COLORS[entry.name] || "#94a3b8"} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, name) => [v, name]} />
                  </RPieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Per-NGO Detail Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="text-base font-semibold text-foreground mb-4">
          تفاصيل المنظمات
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {(selectedNgoId === "all" ? ngoStats : ngoStats.filter((s) => s.id === selectedNgoId)).map((stat, i) => (
            <NGOPerformanceCard key={stat.id} stat={stat} index={i} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function NGOPerformanceCard({ stat, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }} whileHover={{ y: -3 }}
      className="rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Header bar */}
      <div className="h-1.5 bg-gradient-to-l from-brand-green to-brand-navy" />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-bold text-foreground text-base">{stat.name}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.city} — {stat.category}</p>
          </div>
          <Building2 className="w-5 h-5 text-brand-green flex-shrink-0" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatMini label="المستفيدون" value={stat.totalBeneficiaries} />
          <StatMini label="نشط" value={stat.activeCases} color="emerald" />
          <StatMini label="عاجل" value={stat.urgentCases} color="red" />
          <StatMini label="مسوقون" value={stat.marketersCount} color="purple" />
        </div>

        {/* Priority badges */}
        {Object.keys(stat.priorities).length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(stat.priorities).map(([p, count]) => (
              <Badge key={p} variant="outline" className="text-[11px]"
                style={{ borderColor: PRIORITY_COLORS[p] || "#94a3b8", color: PRIORITY_COLORS[p] || "#94a3b8" }}>
                {p}: {count}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function StatMini({ label, value, color = "slate" }) {
  const colors = {
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/15",
    red: "text-red-600 bg-red-50 dark:bg-red-900/15",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/15",
    slate: "text-slate-600 bg-slate-50 dark:bg-slate-800",
  };
  return (
    <div className={`rounded-xl px-3 py-2 ${colors[color] || colors.slate}`}>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-lg font-bold tabular-nums">{value.toLocaleString("en-US")}</p>
    </div>
  );
}
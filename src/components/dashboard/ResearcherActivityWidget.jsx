import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, UserCheck, TrendingUp } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const weeklyData = [
  { day: "الأحد", حالات: 14 },
  { day: "الإثنين", حالات: 22 },
  { day: "الثلاثاء", حالات: 18 },
  { day: "الأربعاء", حالات: 31 },
  { day: "الخميس", حالات: 27 },
  { day: "الجمعة", حالات: 9 },
  { day: "السبت", حالات: 12 },
];

const activeResearchers = [
  { name: "سارة المطيري", cases: 12, status: "نشط" },
  { name: "أحمد العتيبي", cases: 9, status: "نشط" },
  { name: "نوف الزهراني", cases: 7, status: "نشط" },
  { name: "محمد الشهري", cases: 5, status: "غير متاح" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-3 py-2 text-sm shadow-lg">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-primary">{payload[0].value} حالة</p>
      </div>
    );
  }
  return null;
};

export default function ResearcherActivityWidget() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-500" />
            نشاط الباحثين الاجتماعيين
          </CardTitle>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-xs">
            هذا الأسبوع
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: FileText, label: "الحالات المُقدَّمة", value: "١٣٣", color: "text-emerald-600", bg: "bg-emerald-500/10" },
            { icon: UserCheck, label: "باحثون نشطون", value: "٢٣", color: "text-blue-600", bg: "bg-blue-500/10" },
            { icon: TrendingUp, label: "متوسط الحالات/باحث", value: "٥.٨", color: "text-purple-600", bg: "bg-purple-500/10" },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/40"
            >
              <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <span className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</span>
              <span className="text-[10px] text-muted-foreground text-center leading-tight">{kpi.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="researcherGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142,76%,36%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142,76%,36%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="حالات" stroke="hsl(142,76%,36%)" strokeWidth={2} fill="url(#researcherGrad)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Active Researchers */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">أبرز الباحثين</p>
          {activeResearchers.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                  {r.name.charAt(0)}
                </div>
                <span className="text-sm text-foreground">{r.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{r.cases} حالة</span>
                <div className={`w-1.5 h-1.5 rounded-full ${r.status === "نشط" ? "bg-emerald-500" : "bg-muted-foreground"}`} />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
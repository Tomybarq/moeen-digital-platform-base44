import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle2, Clock, XCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";

const monthlyRegistrations = [
  { month: "يناير", منظمات: 4 },
  { month: "فبراير", منظمات: 7 },
  { month: "مارس", منظمات: 3 },
  { month: "أبريل", منظمات: 9 },
  { month: "مايو", منظمات: 11 },
  { month: "يونيو", منظمات: 6 },
];

const ngoList = [
  { name: "جمعية الإحسان", city: "الرياض", status: "نشطة" },
  { name: "مركز رعاية الطفل", city: "جدة", status: "نشطة" },
  { name: "مؤسسة الأمل", city: "الدمام", status: "قيد المراجعة" },
  { name: "جمعية التنمية الأسرية", city: "مكة المكرمة", status: "موقوفة" },
];

const statusConfig = {
  "نشطة": { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  "قيد المراجعة": { icon: Clock, color: "text-amber-600", bg: "bg-amber-500/10" },
  "موقوفة": { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
};

const barColors = ["#3B82F6", "#60A5FA", "#3B82F6", "#60A5FA", "#2563EB", "#3B82F6"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-3 py-2 text-sm shadow-lg">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-blue-500">{payload[0].value} منظمة</p>
      </div>
    );
  }
  return null;
};

export default function NGOsWidget() {
  const total = 48;
  const newThisMonth = 6;
  const active = 38;
  const pending = 7;

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-500" />
            المنظمات غير الربحية
          </CardTitle>
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-200 text-xs">
            هذا العام
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "إجمالي المنظمات", value: total, color: "text-blue-600", bg: "bg-blue-500/10" },
            { label: "تسجيلات جديدة", value: newThisMonth, color: "text-emerald-600", bg: "bg-emerald-500/10" },
            { label: "قيد المراجعة", value: pending, color: "text-amber-600", bg: "bg-amber-500/10" },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl ${kpi.bg}`}
            >
              <span className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</span>
              <span className="text-[10px] text-muted-foreground text-center leading-tight">{kpi.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Active bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>المنظمات النشطة</span>
            <span className="font-medium text-foreground">{active} / {total}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(active / total) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-blue-500 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-32">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">التسجيلات الشهرية</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRegistrations} margin={{ top: 2, right: 0, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="منظمات" radius={[4, 4, 0, 0]} maxBarSize={24}>
                {monthlyRegistrations.map((_, i) => <Cell key={i} fill={barColors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* NGO List */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">آخر المنظمات المسجّلة</p>
          {ngoList.map((ngo, i) => {
            const cfg = statusConfig[ngo.status];
            return (
              <motion.div
                key={ngo.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Building2 className="w-3 h-3 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground leading-none">{ngo.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{ngo.city}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.bg} ${cfg.color}`}>
                  <cfg.icon className="w-2.5 h-2.5" />
                  {ngo.status}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
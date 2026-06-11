import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Target, Eye, MousePointerClick } from "lucide-react";
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from "recharts";

const campaignData = [
  { name: "الوصول", value: 78, fill: "hsl(142,76%,36%)" },
  { name: "التفاعل", value: 55, fill: "#3B82F6" },
  { name: "التحويل", value: 32, fill: "#A855F7" },
];

const reachTrend = [
  { week: "أ١", وصول: 1200 },
  { week: "أ٢", وصول: 1850 },
  { week: "أ٣", وصول: 1600 },
  { week: "أ٤", وصول: 2400 },
  { week: "م١", وصول: 2100 },
  { week: "م٢", وصول: 3100 },
  { week: "م٣", وصول: 2800 },
  { week: "م٤", وصول: 3600 },
];

const campaigns = [
  { name: "حملة رمضان الخيري", reach: "١٢,٣٠٠", status: "نشطة", pct: 78 },
  { name: "التوعية بحقوق الطفل", reach: "٨,٧٠٠", status: "نشطة", pct: 55 },
  { name: "دعم المسنين", reach: "٥,٢٠٠", status: "مكتملة", pct: 100 },
  { name: "التشغيل والتوظيف", reach: "٣,٩٠٠", status: "مسودة", pct: 20 },
];

const statusBadge = {
  "نشطة": "bg-emerald-500/10 text-emerald-600",
  "مكتملة": "bg-blue-500/10 text-blue-600",
  "مسودة": "bg-muted text-muted-foreground",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-3 py-2 text-sm shadow-lg">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-purple-500">{payload[0].value.toLocaleString("ar-SA")} وصول</p>
      </div>
    );
  }
  return null;
};

export default function MarketerActivityWidget() {
  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-amber-500" />
            نشاط المسوّقين والحملات
          </CardTitle>
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 text-xs">
            هذا الشهر
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Megaphone, label: "حملات مُنشأة", value: "١٥", color: "text-amber-600", bg: "bg-amber-500/10" },
            { icon: Eye, label: "إجمالي الوصول", value: "٣٠,١٠٠", color: "text-purple-600", bg: "bg-purple-500/10" },
            { icon: MousePointerClick, label: "نسبة التفاعل", value: "٥٥٪", color: "text-blue-600", bg: "bg-blue-500/10" },
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
              <span className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</span>
              <span className="text-[10px] text-muted-foreground text-center leading-tight">{kpi.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Radial performance */}
        <div className="flex items-center gap-3">
          <div className="w-24 h-24 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="40%" outerRadius="100%" data={campaignData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={4} background={{ fill: "hsl(var(--muted))" }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {campaignData.map((d) => (
              <div key={d.name} className="space-y-0.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="font-medium text-foreground">{d.value}٪</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.value}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ backgroundColor: d.fill }}
                    className="h-1.5 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reach trend */}
        <div className="h-28">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">منحنى الوصول الأسبوعي</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={reachTrend} margin={{ top: 2, right: 0, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="وصول" stroke="#A855F7" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Campaign list */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">الحملات النشطة</p>
          {campaigns.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="space-y-1 py-1.5 px-2 rounded-lg hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{c.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{c.reach}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${statusBadge[c.status]}`}>{c.status}</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-1 rounded-full bg-amber-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
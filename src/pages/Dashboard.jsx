import { Building2, Users, Megaphone, TrendingUp, ArrowUpLeft, Activity } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recentActivity = [
  { id: 1, text: "تمت إضافة منظمة جديدة: جمعية الإحسان", time: "منذ ٥ دقائق", type: "ngo" },
  { id: 2, text: "تسجيل ١٢ مستفيداً جديداً هذا الأسبوع", time: "منذ ساعة", type: "beneficiary" },
  { id: 3, text: "اكتملت حملة تسويقية بنجاح", time: "منذ ٣ ساعات", type: "campaign" },
  { id: 4, text: "تحديث بيانات ٤ منظمات", time: "منذ يوم", type: "update" },
];

const typeColors = {
  ngo: "bg-blue-500/10 text-blue-500",
  beneficiary: "bg-emerald-500/10 text-emerald-500",
  campaign: "bg-purple-500/10 text-purple-500",
  update: "bg-amber-500/10 text-amber-500",
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h2 className="text-2xl font-bold text-foreground">مرحباً بك في مُعين 👋</h2>
        <p className="text-muted-foreground text-sm">نظرة عامة على أداء المنصة اليوم</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="المنظمات المسجّلة"
          value="٤٨"
          icon={Building2}
          trend={12}
          trendLabel="هذا الشهر"
        />
        <StatCard
          title="المستفيدون"
          value="١,٢٣٤"
          icon={Users}
          trend={8}
          trendLabel="هذا الشهر"
        />
        <StatCard
          title="المسوّقون النشطون"
          value="٨٩"
          icon={Megaphone}
          trend={-3}
          trendLabel="هذا الأسبوع"
        />
        <StatCard
          title="الحملات الجارية"
          value="١٥"
          icon={TrendingUp}
          trend={25}
          trendLabel="هذا الشهر"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              آخر النشاطات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors duration-200"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${typeColors[item.type]?.replace(/\/10\s/, " ").split(" ")[0] || "bg-muted"}`} 
                  style={{ backgroundColor: item.type === 'ngo' ? 'rgb(59,130,246)' : item.type === 'beneficiary' ? 'rgb(16,185,129)' : item.type === 'campaign' ? 'rgb(168,85,247)' : 'rgb(245,158,11)' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{item.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ArrowUpLeft className="w-4 h-4 text-primary" />
              إجراءات سريعة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "إضافة منظمة", path: "/ngos" },
              { label: "تسجيل مستفيد", path: "/beneficiaries" },
              { label: "إضافة مسوّق", path: "/marketers" },
              { label: "إعدادات المنصة", path: "/settings" },
            ].map((action, i) => (
              <motion.a
                key={action.path}
                href={action.path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors duration-200 cursor-pointer group"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                  {action.label}
                </span>
              </motion.a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
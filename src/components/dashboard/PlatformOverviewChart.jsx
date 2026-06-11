import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

const data = [
  { month: "يناير", منظمات: 38, باحثون: 18, مسوّقون: 70 },
  { month: "فبراير", منظمات: 40, باحثون: 19, مسوّقون: 74 },
  { month: "مارس", منظمات: 41, باحثون: 21, مسوّقون: 78 },
  { month: "أبريل", منظمات: 43, باحثون: 22, مسوّقون: 80 },
  { month: "مايو", منظمات: 45, باحثون: 23, مسوّقون: 85 },
  { month: "يونيو", منظمات: 48, باحثون: 23, مسوّقون: 89 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-4 py-3 text-sm shadow-lg space-y-1">
        <p className="font-bold text-foreground mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-medium text-foreground">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function PlatformOverviewChart() {
  return (
    <Card className="border-border lg:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            نمو المنصة — نظرة شاملة
          </CardTitle>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {[
              { color: "#3B82F6", label: "منظمات" },
              { color: "hsl(142,76%,36%)", label: "باحثون" },
              { color: "#A855F7", label: "مسوّقون" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                <span>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="h-52"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="منظمات" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={20} opacity={0.85} />
              <Line type="monotone" dataKey="باحثون" stroke="hsl(142,76%,36%)" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(142,76%,36%)" }} />
              <Line type="monotone" dataKey="مسوّقون" stroke="#A855F7" strokeWidth={2.5} dot={{ r: 3, fill: "#A855F7" }} strokeDasharray="6 3" />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}
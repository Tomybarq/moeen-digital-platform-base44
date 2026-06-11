import { Settings, Globe, Palette, Bell, Shield, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

const settingsSections = [
  {
    icon: Palette,
    title: "المظهر",
    description: "تخصيص مظهر المنصة والألوان",
    hasToggle: true,
    toggleId: "theme",
  },
  {
    icon: Globe,
    title: "اللغة والمنطقة",
    description: "إعدادات اللغة والمنطقة الزمنية",
  },
  {
    icon: Bell,
    title: "الإشعارات",
    description: "التحكم في إعدادات الإشعارات",
  },
  {
    icon: Shield,
    title: "الأمان والخصوصية",
    description: "إعدادات الأمان وسياسات الخصوصية",
  },
  {
    icon: Database,
    title: "البيانات والنسخ الاحتياطي",
    description: "إدارة بيانات المنصة والنسخ الاحتياطية",
  },
];

export default function PlatformSettings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-foreground">إعدادات المنصة</h2>
        <p className="text-sm text-muted-foreground mt-1">إدارة وتخصيص إعدادات منصة مُعين</p>
      </motion.div>

      <div className="space-y-4">
        {settingsSections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{section.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{section.description}</p>
                    </div>
                  </div>
                  {section.hasToggle && section.toggleId === "theme" && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="dark-mode" className="text-xs text-muted-foreground">
                        {theme === "dark" ? "الوضع الداكن" : "الوضع الفاتح"}
                      </Label>
                      <Switch
                        id="dark-mode"
                        checked={theme === "dark"}
                        onCheckedChange={toggleTheme}
                        className="cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getRoleLabel } from "@/lib/rbac";
import { MapPin, Building2, User, Shield, Settings, ShieldCheck, Search, Megaphone } from "lucide-react";
import ProfileInfoTab from "@/components/profile/ProfileInfoTab";
import ProfileSecurityTab from "@/components/profile/ProfileSecurityTab";
import ProfilePrefsTab from "@/components/profile/ProfilePrefsTab";

const ROLE_BANNERS = {
  platform_admin:    { from: "#7c3aed", to: "#a78bfa", icon: ShieldCheck },
  ngo_admin:         { from: "#1d4ed8", to: "#60a5fa", icon: Building2  },
  social_researcher: { from: "#059669", to: "#34d399", icon: Search     },
  marketer:          { from: "#d97706", to: "#fbbf24", icon: Megaphone  },
};

const ROLE_DESCRIPTIONS = {
  platform_admin:    "صلاحيات كاملة على جميع أقسام المنصة",
  ngo_admin:         "إدارة منظمة غير ربحية ومستفيديها",
  social_researcher: "البحث والمتابعة الميدانية للمستفيدين",
  marketer:          "إدارة الحملات التسويقية والترويجية",
};

const TABS = [
  { id: "info",     label: "المعلومات الشخصية", icon: User    },
  { id: "security", label: "الأمان",            icon: Shield  },
  { id: "prefs",    label: "التفضيلات",         icon: Settings },
];

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("info");

  const role   = user?.role || "platform_admin";
  const banner = ROLE_BANNERS[role] || ROLE_BANNERS.platform_admin;
  const BIcon  = banner.icon;

  const initials = user?.full_name?.split(" ").slice(0, 2).map(w => w[0]).join("") || "م";

  return (
    <div className="max-w-3xl mx-auto space-y-6" dir="rtl">

      {/* ── Page title ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-bold text-foreground">الملف الشخصي</h2>
        <p className="text-sm text-muted-foreground mt-1">منصة مُعين الرقمية — عرض وإدارة بيانات حسابك</p>
      </motion.div>

      {/* ── Hero Banner ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
        <div className="relative rounded-2xl overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${banner.from}, ${banner.to})` }}>
          {/* subtle dot grid */}
          <div className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }} />
          <div className="relative p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-white/25 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-extrabold text-2xl select-none">{initials}</span>
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0 text-white">
              <p className="text-xl font-bold leading-tight">{user?.full_name || "—"}</p>
              <p className="text-white/70 text-sm mt-0.5 font-mono" dir="ltr">{user?.email}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  <BIcon className="w-3.5 h-3.5" />
                  {getRoleLabel(role)}
                </span>
                {user?.city && (
                  <span className="inline-flex items-center gap-1 text-white/75 text-xs">
                    <MapPin className="w-3 h-3" /> {user.city}
                  </span>
                )}
                {user?.organization && (
                  <span className="inline-flex items-center gap-1 text-white/75 text-xs">
                    <Building2 className="w-3 h-3" /> {user.organization}
                  </span>
                )}
              </div>
            </div>

            {/* Role description — desktop */}
            <div className="hidden sm:flex flex-col items-end gap-1 text-white/85 text-xs max-w-52 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-right">
              <span className="font-semibold text-white">{getRoleLabel(role)}</span>
              <span className="leading-relaxed">{ROLE_DESCRIPTIONS[role]}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Tab bar ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}>
        <div className="flex border border-border rounded-xl overflow-hidden bg-muted/20">
          {TABS.map(tab => {
            const TIcon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all cursor-pointer",
                  active
                    ? "bg-card shadow-sm text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}>
                <TIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Tab content ── */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {activeTab === "info"     && <ProfileInfoTab user={user} />}
        {activeTab === "security" && <ProfileSecurityTab />}
        {activeTab === "prefs"    && <ProfilePrefsTab />}
      </motion.div>
    </div>
  );
}
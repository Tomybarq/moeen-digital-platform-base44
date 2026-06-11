import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Megaphone,
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "لوحة التحكم", icon: LayoutDashboard, path: "/" },
  { label: "المنظمات", icon: Building2, path: "/ngos" },
  { label: "المستفيدون", icon: Users, path: "/beneficiaries" },
  { label: "المسوّقون", icon: Megaphone, path: "/marketers" },
  { label: "الملف الشخصي", icon: UserCircle, path: "/profile" },
  { label: "إعدادات المنصة", icon: Settings, path: "/settings" },
];

export default function Sidebar({ collapsed, onToggle, onNavigate }) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed top-0 right-0 h-screen z-30 flex flex-col border-l border-sidebar-border bg-sidebar transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <Heart className="w-5 h-5 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-lg text-sidebar-foreground whitespace-nowrap overflow-hidden"
            >
              مُعين
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer group",
                isActive
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                )}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-2 pb-4 shrink-0">
        <button
          onClick={onToggle}
          aria-label={collapsed ? "توسيع القائمة" : "طي القائمة"}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors duration-200 cursor-pointer"
        >
          {collapsed ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <>
              <ChevronRight className="w-5 h-5" />
              <span>طي القائمة</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
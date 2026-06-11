import { Sun, Moon, Menu, Bell } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function TopBar({ onMenuToggle, pageTitle }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-4 md:px-6 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden cursor-pointer"
          onClick={onMenuToggle}
          aria-label="فتح القائمة"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold text-foreground">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative cursor-pointer"
          aria-label="الإشعارات"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-primary rounded-full" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"}
          className="cursor-pointer"
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </motion.div>
        </Button>
      </div>
    </header>
  );
}
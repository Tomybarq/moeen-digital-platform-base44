import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Languages } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function FloatingControls() {
  const { theme, toggleTheme } = useTheme();
  const [lang, setLang] = useState(() => localStorage.getItem("moeen-lang") || "ar");

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("moeen-lang", lang);
  }, [lang]);

  const toggleLang = () => setLang((prev) => prev === "ar" ? "en" : "ar");

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3" dir="ltr">
      {/* Theme Toggle */}
      















      

      {/* Language Toggle */}
      




















      
    </div>);

}
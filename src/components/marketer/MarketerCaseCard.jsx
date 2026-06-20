import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Copy, Check, Share2, AlertTriangle, ArrowUp, Minus, ArrowDown,
  MapPin, Users, Heart, Clock,
} from "lucide-react";

const PRIORITY_CFG = {
  "عاجل":  { icon: AlertTriangle, pill: "bg-red-100 text-red-700 border-red-200", bar: "bg-red-500", label: "عاجل" },
  "مرتفع": { icon: ArrowUp,       pill: "bg-orange-100 text-orange-700 border-orange-200", bar: "bg-orange-500", label: "مرتفع" },
  "متوسط": { icon: Minus,         pill: "bg-yellow-100 text-yellow-700 border-yellow-200", bar: "bg-yellow-500", label: "متوسط" },
  "منخفض": { icon: ArrowDown,     pill: "bg-green-100 text-green-700 border-green-200", bar: "bg-green-500", label: "منخفض" },
};

const CASE_EMOJIS = { "مادي": "💰", "صحي": "🏥", "تعليمي": "📚", "اجتماعي": "🤝", "متعدد": "🔀" };

function generateTitle(b) {
  const age = b.age || "";
  const gender = b.gender || "";
  const dependents = b.dependents_count || 0;
  const social = b.social_status || "";
  const city = b.city || "";

  if (social === "أرملة" || (gender === "أنثى" && social === "أرمل")) return `أرملة${dependents > 0 ? ` تعول ${dependents} ${dependents === 1 ? "يتيم" : "أيتام"}` : ""} تحتاج كفالة`;
  if (social === "أرمل" || (gender === "ذكر" && social === "أرمل")) return `أرمل${dependents > 0 ? ` يعول ${dependents} ${dependents === 1 ? "يتيم" : "أيتام"}` : ""} بحاجة للدعم`;
  if (dependents >= 5) return `أسرة مكوّنة من ${dependents + 1} أفراد${city ? ` في ${city}` : ""} بحاجة عاجلة`;
  if (social === "مطلق" || social === "مطلقة") return `${social === "مطلق" ? "أب" : "أم"}${dependents > 0 ? ` لـ ${dependents} أبناء` : ""}${city ? ` من ${city}` : ""} يبحث عن الأمان`;
  if (b.case_type === "صحي") return `حالة ${b.health_status === "مريض" ? "مرضية" : "صحية"}${age ? ` لعمر ${age} سنة` : ""} تحتاج رعاية طبية`;
  if (b.case_type === "تعليمي") return `طالب${dependents > 0 ? ` وأسرته (${dependents + 1} أفراد)` : ""}${city ? ` من ${city}` : ""} بحاجة لدعم تعليمي`;
  if (b.health_status === "معاق") return `شخص من ذوي الإعاقة${city ? ` في ${city}` : ""} يحتاج دعماً ورعاية`;
  return `أسرة${city ? ` من ${city}` : ""}${dependents > 0 ? ` (${dependents + 1} أفراد)` : ""} تستحق الدعم والمساندة`;
}

function generateStory(b) {
  const parts = [];
  const age = b.age || "";
  const gender = b.gender || "";
  const social = b.social_status || "";
  const dependents = b.dependents_count || 0;
  const city = b.city || "";
  const district = b.district || "";
  const caseType = b.case_type || "";
  const researcherOpinion = b.researcher_opinion_financial || b.researcher_opinion_basic || "";
  const health = b.health_status || "";
  const housing = b.housing_type || "";
  const income = b.income_level || "";
  const envType = b.environment_type || "";
  const education = b.education_level || "";

  if (social && age && gender) {
    const prefix = gender === "أنثى" ? "سيدة" : "رجل";
    const socialText = social === "أرمل" || social === "أرملة" ? ` ${social} ` : social === "مطلق" || social === "مطلقة" ? ` ${social} ` : ` ${social} `;
    parts.push(`${prefix}${socialText}تبلغ من العمر ${age} عاماً`);
  } else if (age) {
    parts.push(`يبلغ من العمر ${age} عاماً`);
  }

  if (dependents > 0) {
    parts.push(`تعول ${dependents} ${dependents === 1 ? "فرد" : "أفراد"} من أسرتها`);
  }

  if (city) {
    const location = district ? `في حي ${district} بمدينة ${city}` : `في مدينة ${city}`;
    parts.push(`تقطن ${location}`);
  }

  if (envType && housing) {
    parts.push(`في ${housing} ${housing === "شعبي" ? "شعبي" : ""} بمنطقة ${envType}`);
  } else if (housing) {
    parts.push(`تسكن في ${housing}`);
  }

  if (income === "لا يوجد دخل") {
    parts.push("ولا تملك أي مصدر دخل ثابت");
  } else if (income === "دخل منخفض") {
    parts.push("وتعاني من ضعف شديد في الدخل");
  }

  if (health === "مريض" && b.sickness_type) {
    parts.push(`وتعاني من ${b.sickness_type}`);
  } else if (health === "معاق" && b.disability_type) {
    parts.push(`وتعاني من ${b.disability_type}`);
  } else if (health === "مريض") {
    parts.push("وتعاني من ظروف صحية صعبة");
  } else if (health === "معاق") {
    parts.push("وهي من ذوي الإعاقة");
  }

  if (caseType === "صحي") {
    parts.push("بحاجة ماسة للعلاج والرعاية الطبية العاجلة");
  } else if (caseType === "تعليمي") {
    parts.push("بحاجة لدعم تعليمي لتأمين مستقبل أفضل لأبنائها");
  } else if (caseType === "مادي") {
    parts.push("بحاجة ماسة لكفالة شهرية لتأمين الاحتياجات الأساسية");
  } else {
    parts.push("بحاجة لدعمكم ومساندتكم لتجاوز هذه الظروف الصعبة");
  }

  if (researcherOpinion && researcherOpinion.length > 30) {
    parts.push(`\n\n📋 ${researcherOpinion.slice(0, 120)}${researcherOpinion.length > 120 ? "..." : ""}`);
  }

  return parts.join(". ");
}

function generateWhatsAppText(b) {
  const emoji = CASE_EMOJIS[b.case_type] || "📋";
  const title = generateTitle(b);
  const story = generateStory(b);
  const p = PRIORITY_CFG[b.priority] || PRIORITY_CFG["متوسط"];

  let text = `🌟 *${title}* 🌟\n\n`;
  text += `${story}\n\n`;
  text += `📂 نوع الحالة: ${emoji} ${b.case_type || "—"}\n`;
  text += `🔔 الأولوية: ${p.label}\n`;
  if (b.city) text += `📍 ${b.city}${b.district ? ` - ${b.district}` : ""}\n`;
  if (b.ngo_name) text += `🏢 ${b.ngo_name}\n`;
  text += `\n❤️ *ساهم في تغيير حياة هذه الأسرة*\n`;
  text += `🇸🇦 منصة مُعين | للتواصل: 0500000000`;

  return encodeURIComponent(text);
}

export default function MarketerCaseCard({ beneficiary, index }) {
  const [copied, setCopied] = useState(false);
  const p = PRIORITY_CFG[beneficiary.priority] || PRIORITY_CFG["متوسط"];
  const PIcon = p.icon;
  const emoji = CASE_EMOJIS[beneficiary.case_type] || "📋";
  const title = generateTitle(beneficiary);
  const story = generateStory(beneficiary);

  // Mock funding progress: based on income level
  const fundingGoal = 10000;
  const fundingRaised = (() => {
    if (beneficiary.income_level === "لا يوجد دخل") return fundingGoal * 0.1;
    if (beneficiary.income_level === "دخل منخفض") return fundingGoal * 0.3;
    return fundingGoal * 0.5;
  })();
  const progressPercent = Math.round((fundingRaised / fundingGoal) * 100);

  const handleCopyKit = () => {
    const waText = decodeURIComponent(generateWhatsAppText(beneficiary));
    const kit = `📋 *الحقيبة التسويقية*\n━━━━━━━━━━━━━━━━━━━━\n\n${waText}`;
    navigator.clipboard.writeText(kit);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${generateWhatsAppText(beneficiary)}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      {/* Top accent gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600" />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Emoji + type */}
          <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-2xl flex-shrink-0 ring-2 ring-teal-100">
            {emoji}
          </div>

          <div className="flex-1 min-w-0">
            {/* AI Title */}
            <h3 className="font-extrabold text-gray-800 text-base leading-snug line-clamp-2">
              {title}
            </h3>

            {/* Meta row */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge className={cn("text-xs font-semibold border", p.pill)}>
                <PIcon className="w-3 h-3 ml-1" />
                {p.label}
              </Badge>
              {beneficiary.case_type && (
                <Badge variant="outline" className="text-xs border-teal-200 text-teal-700 bg-teal-50/50">
                  {beneficiary.case_type}
                </Badge>
              )}
              {beneficiary.case_classification && (
                <Badge className={cn(
                  "text-xs border",
                  beneficiary.case_classification === "أولوية قصوى"
                    ? "bg-red-100 text-red-700 border-red-200"
                    : beneficiary.case_classification === "أولوية متوسطة"
                    ? "bg-amber-100 text-amber-700 border-amber-200"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                )}>
                  {beneficiary.case_classification}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Quick info pills */}
        <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
          {beneficiary.city && (
            <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-teal-500" />
              {beneficiary.city}{beneficiary.district ? ` · ${beneficiary.district}` : ""}
            </span>
          )}
          {(beneficiary.age || beneficiary.gender) && (
            <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <Users className="w-3.5 h-3.5 text-teal-500" />
              {beneficiary.age ? `${beneficiary.age} سنة` : ""}
              {beneficiary.gender ? ` · ${beneficiary.gender}` : ""}
            </span>
          )}
          {beneficiary.dependents_count > 0 && (
            <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-lg">
              <Heart className="w-3.5 h-3.5 text-teal-500" />
              {beneficiary.dependents_count} تابع
            </span>
          )}
        </div>

        {/* Story text */}
        <div className="relative">
          <div className="absolute -right-2 top-0 text-teal-200 text-4xl leading-none select-none">"</div>
          <p className="text-sm text-gray-600 leading-relaxed pr-5 pt-1 line-clamp-4">
            {story}
          </p>
        </div>

        {/* Funding progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">نسبة التمويل</span>
            <span className="text-teal-700 font-bold">{progressPercent}%</span>
          </div>
          {/* Custom progress bar */}
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 bg-gradient-to-r",
                progressPercent < 25 ? "from-red-400 to-red-500"
                : progressPercent < 50 ? "from-amber-400 to-amber-500"
                : "from-teal-400 to-teal-600"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{fundingRaised.toLocaleString("ar-SA")} ر.س</span>
            <span>المستهدف {fundingGoal.toLocaleString("ar-SA")} ر.س</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyKit}
            className={cn(
              "flex-1 gap-1.5 text-xs font-semibold border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 transition-all",
              copied && "border-green-300 text-green-700 bg-green-50"
            )}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "تم النسخ ✓" : "نسخ الحقيبة التسويقية"}
          </Button>
          <Button
            size="sm"
            onClick={handleShareWhatsApp}
            className="flex-1 gap-1.5 text-xs font-semibold bg-[#25D366] hover:bg-[#22c55e] text-white shadow-sm shadow-green-200 hover:shadow-green-300 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            مشاركة واتساب
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
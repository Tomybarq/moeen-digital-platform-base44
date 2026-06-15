import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2, Save } from "lucide-react";
import StepIndicator from "./StepIndicator";
import StepBasic from "./steps/StepBasic";
import StepDependents from "./steps/StepDependents";
import StepFinancial from "./steps/StepFinancial";
import StepHousing from "./steps/StepHousing";
import StepBasicNeeds from "./steps/StepBasicNeeds";
import StepNonBasicNeeds from "./steps/StepNonBasicNeeds";
import StepDocumentsUpload from "./steps/StepDocumentsUpload";
import StepSummary from "./steps/StepSummary";
import BeneficiaryService from "@/services/BeneficiaryService";
import { User, Users, DollarSign, Home, Heart, Lightbulb, Paperclip, CheckSquare } from "lucide-react";

const STEPS = [
  { label: "البيانات الأساسية",    icon: User },
  { label: "التابعون",             icon: Users },
  { label: "الوضع المالي",         icon: DollarSign },
  { label: "البيئة والسكن",        icon: Home },
  { label: "الاحتياجات الأساسية",  icon: Heart },
  { label: "الاحتياجات التطويرية", icon: Lightbulb },
  { label: "المرفقات",             icon: Paperclip },
  { label: "الخلاصة والإرسال",     icon: CheckSquare },
];

const EMPTY = {
  full_name: "", national_id: "", birth_year: "", age: "", gender: "",
  phone: "", phone_alt: "", city: "", district: "", national_address: "",
  social_status: "", education_level: "", health_status: "", disability: false,
  disability_type: "", sickness_type: "", dependents_count: "",
  dependents_data: [],
  researcher_opinion_basic: "", researcher_opinion_dependents: "",
  income_salary: 0, income_social_security: 0, income_account_citizen: 0,
  income_rehab: 0, income_other_ngos: 0, income_other_sources: "",
  total_income: 0, expense_rent: 0, expense_electricity: 0, expense_water: 0,
  expense_internet: 0, expense_medical: 0, expense_transport: 0,
  expense_food: 0, expense_debt_installment: 0, debt_reason: "", debt_period: "",
  total_expenses: 0, net_income: 0, researcher_opinion_financial: "",
  environment_type: "", housing_type: "", housing_tenure: "",
  researcher_opinion_housing: "", ngo_name: "",
  basic_needs: "{}", non_basic_needs: "[]",
  researcher_opinion_needs: "",
  documents: [],
  case_type: "", priority: "متوسط", final_recommendation: "",
  visit_date: new Date().toISOString().slice(0, 10),
  case_status: "جديد", status: "active",
};

function validateStep(step, form) {
  const e = {};
  if (step === 0) {
    if (!form.full_name?.trim()) e.full_name = "الاسم مطلوب";
    if (!form.phone?.trim()) e.phone = "الجوال مطلوب";
    if (form.phone && !/^05\d{8}$/.test(form.phone)) e.phone = "رقم الجوال غير صحيح (يبدأ بـ 05)";
  }
  if (step === 7) {
    if (!form.case_type) e.case_type = "يرجى تحديد التصنيف";
    if (!form.priority) e.priority = "يرجى تحديد الأولوية";
  }
  return e;
}

export default function CaseWizard({ researcherName, onSuccess }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ ...EMPTY, researcher_name: researcherName || "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const next = () => {
    const e = validateStep(step, form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const prev = () => { setErrors({}); setStep(s => Math.max(s - 1, 0)); };

  const saveDraft = () => {
    try {
      localStorage.setItem("case_draft", JSON.stringify(form));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    } catch { /* ignore */ }
  };

  const handleSubmit = async () => {
    const e = validateStep(7, form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    const docs = (form.documents || []).map(d => (typeof d === "object" ? d.url : d));
    await BeneficiaryService.create({
      ...form,
      age: form.age ? Number(form.age) : undefined,
      birth_year: form.birth_year ? Number(form.birth_year) : undefined,
      dependents_count: form.dependents_count ? Number(form.dependents_count) : undefined,
      documents: docs,
    });
    localStorage.removeItem("case_draft");
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setStep(0);
      setForm({ ...EMPTY, researcher_name: researcherName || "" });
      if (onSuccess) onSuccess();
    }, 2500);
  };

  // Load draft if exists
  const loadDraft = () => {
    try {
      const d = localStorage.getItem("case_draft");
      if (d) setForm(JSON.parse(d));
    } catch { /* ignore */ }
  };

  if (submitted) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">تم رفع الحالة بنجاح!</h3>
        <p className="text-muted-foreground text-sm">سيتم مراجعة البيانات وتحديد الأولويات.</p>
      </motion.div>
    );
  }

  const stepComponents = [
    <StepBasic key={0} form={form} setForm={setForm} errors={errors} />,
    <StepDependents key={1} form={form} setForm={setForm} />,
    <StepFinancial key={2} form={form} setForm={setForm} />,
    <StepHousing key={3} form={form} setForm={setForm} />,
    <StepBasicNeeds key={4} form={form} setForm={setForm} />,
    <StepNonBasicNeeds key={5} form={form} setForm={setForm} />,
    <StepDocumentsUpload key={6} form={form} setForm={setForm} />,
    <StepSummary key={7} form={form} setForm={setForm} errors={errors} />,
  ];

  return (
    <div className="space-y-6">
      {/* Draft banner */}
      {localStorage.getItem("case_draft") && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 px-4 py-2.5 flex items-center justify-between">
          <p className="text-sm text-amber-700 dark:text-amber-400">يوجد مسودة محفوظة</p>
          <button type="button" onClick={loadDraft}
            className="text-xs font-medium text-amber-700 dark:text-amber-400 underline underline-offset-2">تحميل المسودة</button>
        </div>
      )}

      {/* Step indicator with proper padding */}
      <div className="px-1 pb-2 border-b border-border">
        <StepIndicator steps={STEPS} currentStep={step} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.18 }}>
          {stepComponents[step]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation — sticky on mobile so the submit button is always reachable */}
      <div className="flex items-center justify-between pt-4 border-t border-border sticky bottom-0 bg-card pb-2 z-10">
        <Button variant="outline" onClick={prev} disabled={step === 0} className="gap-2 cursor-pointer">
          <ChevronRight className="w-4 h-4" /> السابق
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={saveDraft} className="gap-1.5 text-muted-foreground cursor-pointer">
            <Save className="w-3.5 h-3.5" />
            {draftSaved ? "تم الحفظ ✓" : "حفظ مسودة"}
          </Button>
          <span className="text-xs text-muted-foreground hidden sm:block">{step + 1} / {STEPS.length}</span>
        </div>

        {step < STEPS.length - 1 ? (
          <Button onClick={next} className="gap-2 cursor-pointer">
            التالي <ChevronLeft className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting}
            className="gap-2 cursor-pointer bg-primary shadow-lg shadow-primary/20 font-semibold px-6">
            <CheckCircle2 className="w-4 h-4" />
            {submitting ? "جاري الإرسال…" : "إرسال الحالة"}
          </Button>
        )}
      </div>
    </div>
  );
}
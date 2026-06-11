import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, i) => {
        const done    = i < currentStep;
        const active  = i === currentStep;
        const Icon    = step.icon;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                style={{
                  background: done ? "#0c3140" : active ? "rgba(200,151,42,0.15)" : undefined,
                  borderColor: done ? "#0c3140" : active ? "#c8972a" : undefined,
                  color: done ? "#fff" : active ? "#c8972a" : undefined,
                }}
              >
                {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className="text-xs font-medium text-center leading-tight hidden sm:block font-body"
                style={{ color: active ? "#c8972a" : done ? "#0c3140" : undefined }}
              >
                {step.label}
              </span>
            </div>
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className="h-0.5 flex-1 mx-1 mt-[-18px] sm:mt-[-22px] transition-colors duration-300"
                style={{ background: i < currentStep ? "#0c3140" : undefined }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
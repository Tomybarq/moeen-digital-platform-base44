import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="w-full">
      {/* Step circles + connectors */}
      <div className="flex items-center w-full">
        {steps.map((step, i) => {
          const done   = i < currentStep;
          const active = i === currentStep;
          const Icon   = step.icon;

          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              {/* Circle */}
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm",
                    done   && "border-transparent",
                    active && "ring-2 ring-offset-1",
                    !done && !active && "border-border bg-muted"
                  )}
                  style={{
                    background:  done   ? "#0c3140"                 : active ? "rgba(200,151,42,0.12)" : undefined,
                    borderColor: done   ? "#0c3140"                 : active ? "#c8972a"               : undefined,
                    color:       done   ? "#fff"                    : active ? "#c8972a"               : "hsl(var(--muted-foreground))",
                    boxShadow:   active ? "0 0 0 3px rgba(200,151,42,0.18)" : undefined,
                  }}
                >
                  {done
                    ? <Check className="w-3.5 h-3.5" />
                    : <Icon  className="w-3.5 h-3.5" />
                  }
                </div>
              </div>

              {/* Connector */}
              {i < steps.length - 1 && (
                <div
                  className="h-0.5 flex-1 mx-0.5 rounded-full transition-colors duration-300"
                  style={{ background: done ? "#0c3140" : "hsl(var(--border))" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Labels row — shown below circles */}
      <div className="flex items-start w-full mt-2">
        {steps.map((step, i) => {
          const done   = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={i} className="flex flex-col items-center flex-1 last:flex-none px-0.5">
              <span
                className={cn(
                  "text-center leading-tight font-medium transition-colors duration-200",
                  // Responsive font sizes
                  "text-[9px] sm:text-[10px] md:text-xs"
                )}
                style={{
                  color: active ? "#c8972a" : done ? "#0c3140" : "hsl(var(--muted-foreground))",
                  fontWeight: active ? 700 : done ? 600 : 400,
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
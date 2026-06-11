import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Inline form field error message — NDMO accessibility compliant.
 * Renders with role="alert" for screen readers.
 */
export default function FormFieldError({ message, className }) {
  if (!message) return null;
  return (
    <p role="alert" aria-live="polite"
      className={cn("flex items-center gap-1.5 text-xs text-destructive mt-1", className)}>
      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}
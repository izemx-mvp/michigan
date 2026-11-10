import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputCls = (error?: string) =>
  cn(
    "h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-slate-muted/70 focus:border-[#1a6fc7] focus:ring-2 focus:ring-sky-300/40",
    error ? "border-red-500" : "border-input",
  );

export function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-900">
        {label}
        {required && (
          <span className="text-red-600" aria-hidden="true">
            {" "}*
          </span>
        )}
        {required && <span className="sr-only"> (obligatoire)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

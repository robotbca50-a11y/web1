"use client";

import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium" style={{ color: "var(--theme-text)" }}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 appearance-none",
            "bg-[var(--theme-surface)] text-[var(--theme-text)]",
            "border border-[var(--theme-border)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-transparent",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";
export { Select };

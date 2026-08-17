"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium" style={{ color: "var(--theme-text)" }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-3 py-2 rounded-lg text-sm transition-all duration-200",
            "bg-[var(--theme-surface)] text-[var(--theme-text)]",
            "border border-[var(--theme-border)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:border-transparent",
            "placeholder:text-[var(--theme-text-muted)]",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };

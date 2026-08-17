"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", glow = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-[0.97]",
          {
            "bg-[var(--theme-primary)] text-[var(--theme-bg)] hover:brightness-110 focus:ring-[var(--theme-primary)]":
              variant === "primary",
            "bg-[var(--theme-surface)] text-[var(--theme-text)] border border-[var(--theme-border)] hover:bg-[var(--theme-border)] focus:ring-[var(--theme-primary)]":
              variant === "secondary",
            "bg-transparent text-[var(--theme-text)] hover:bg-[var(--theme-surface)] focus:ring-[var(--theme-primary)]":
              variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500":
              variant === "danger",
            "border border-[var(--theme-primary)] text-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-[var(--theme-bg)] focus:ring-[var(--theme-primary)]":
              variant === "outline",
          },
          {
            "px-3 py-1.5 text-xs": size === "sm",
            "px-4 py-2 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
          },
          glow && "btn-glow",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button, type ButtonProps };

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-[var(--theme-surface)] text-[var(--theme-text-muted)] border border-[var(--theme-border)]":
            variant === "default",
          "bg-[var(--theme-primary)]/20 text-[var(--theme-primary)]": variant === "primary",
          "bg-green-500/20 text-green-400": variant === "success",
          "bg-yellow-500/20 text-yellow-400": variant === "warning",
          "bg-red-500/20 text-red-400": variant === "danger",
        },
        className
      )}
    >
      {children}
    </span>
  );
}

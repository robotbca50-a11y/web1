"use client";

import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "3d" | "glow";
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl transition-all duration-300",
          {
            "bg-[var(--theme-surface)] border border-[var(--theme-border)]": variant === "default",
            "glass": variant === "glass",
            "card-3d": variant === "3d",
            "glow-border": variant === "glow",
          },
          hover && "hover:border-[var(--theme-primary)] hover:shadow-lg cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 border-b border-[var(--theme-border)]", className)} {...props}>
      {children}
    </div>
  );
}

function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 border-t border-[var(--theme-border)]", className)} {...props}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardContent, CardFooter };

"use client";

import { useMemo } from "react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";

export function Particles({ count = 30 }: { count?: number }) {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 4,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 5,
        color:
          i % 3 === 0
            ? theme.colors.primary
            : i % 3 === 1
            ? theme.colors.secondary
            : theme.colors.accent,
      })),
    [count, theme]
  );

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

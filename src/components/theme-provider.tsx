"use client";

import { useEffect, ReactNode } from "react";
import { useThemeStore } from "@/store/theme";
import { getTheme, getThemeCSSVars } from "@/lib/themes";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const currentTheme = useThemeStore((s) => s.currentTheme);

  useEffect(() => {
    const theme = getTheme(currentTheme);
    const vars = getThemeCSSVars(theme);
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.style.setProperty("--background", theme.colors.background);
    root.style.setProperty("--foreground", theme.colors.text);
  }, [currentTheme]);

  return <>{children}</>;
}

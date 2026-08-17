import { create } from "zustand";
import { ThemeName } from "@/lib/types";

interface ThemeStore {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  randomizeTheme: () => void;
}

const THEME_NAMES: ThemeName[] = [
  "cyborg", "samurai", "aurora", "marvel", "medieval",
  "cyberpunk", "space", "nature", "deep-ocean", "volcanic",
];

export const useThemeStore = create<ThemeStore>((set) => ({
  currentTheme: "cyborg",
  setTheme: (theme) => {
    set({ currentTheme: theme });
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  },
  randomizeTheme: () => {
    const random = THEME_NAMES[Math.floor(Math.random() * THEME_NAMES.length)];
    set({ currentTheme: random });
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", random);
    }
  },
}));

// Initialize from localStorage on client
if (typeof window !== "undefined") {
  const saved = localStorage.getItem("theme") as ThemeName | null;
  if (saved && THEME_NAMES.includes(saved)) {
    useThemeStore.setState({ currentTheme: saved });
  }
}

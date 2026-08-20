"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";
import { ThemeName } from "@/lib/types";

const THEME_NAMES: ThemeName[] = [
  "cyborg", "samurai", "aurora", "marvel", "medieval",
  "cyberpunk", "space", "nature", "deep-ocean", "volcanic",
];

const VIDEOS = [
  "/videos/103434-662525884_medium.mp4",
  "/videos/185498-875752971_medium.mp4",
  "/videos/214500_medium.mp4",
  "/videos/214940_medium.mp4",
  "/videos/240841_medium.mp4",
  "/videos/270408_medium.mp4",
  "/videos/283431_medium.mp4",
  "/videos/285203_medium.mp4",
  "/videos/352156_medium.mp4",
  "/videos/352949_medium.mp4",
  "/videos/65881-515617533_medium.mp4",
  "/videos/90408-626004752_medium.mp4",
  "/videos/91562-629172467_medium.mp4",
  "/videos/doc_2026-08-20_14-51-03.mp4",
  "/videos/g3.mp4",
  "/videos/komaru_gif_AgADyAYAAlt56EY.mp4",
  "/videos/video6116034915562687533.mp4",
  "/videos/video_2026-08-09_06-32-20.mp4",
];

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [currentThemeIdx, setCurrentThemeIdx] = useState(0);
  const [videoSrc] = useState(() => VIDEOS[Math.floor(Math.random() * VIDEOS.length)]);
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentThemeIdx((prev) => (prev + 1) % THEME_NAMES.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Video background */}
        <div className="absolute inset-0 overflow-hidden bg-black">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${theme.colors.background}DD 0%, ${theme.colors.background}AA 50%, ${theme.colors.background}DD 100%)`,
            }}
          />
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Logo / Title */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1
              className="text-5xl md:text-7xl font-bold tracking-tight gradient-text"
              style={{ fontFamily: theme.font }}
            >
              WEB UTAMA
            </h1>
            <motion.p
              className="mt-3 text-sm tracking-[0.3em] uppercase"
              style={{ color: theme.colors.textMuted }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Pusat Kendali Digital
            </motion.p>
          </motion.div>

          {/* Theme indicator */}
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full glass"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: theme.colors.primary, boxShadow: `0 0 8px ${theme.colors.primary}` }}
            />
            <span className="text-xs tracking-wider uppercase" style={{ color: theme.colors.textMuted }}>
              {theme.label} Mode
            </span>
          </motion.div>

          {/* Theme carousel */}
          <div className="flex gap-2 flex-wrap justify-center max-w-xs">
            {THEME_NAMES.map((name, i) => {
              const t = getTheme(name);
              return (
                <motion.div
                  key={name}
                  className="w-3 h-3 rounded-full cursor-pointer"
                  style={{
                    background: t.colors.primary,
                    boxShadow: currentThemeIdx === i ? `0 0 12px ${t.colors.primary}` : "none",
                  }}
                  animate={{
                    scale: currentThemeIdx === i ? 1.5 : 1,
                    opacity: currentThemeIdx === i ? 1 : 0.4,
                  }}
                />
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-64 md:w-80">
            <div className="typing-progress rounded-full overflow-hidden">
              <motion.div
                className="typing-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs" style={{ color: theme.colors.textMuted }}>Memuat...</span>
              <span className="text-xs font-mono" style={{ color: theme.colors.primary }}>{progress}%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";
import { ThemeName } from "@/lib/types";

const THEME_NAMES: ThemeName[] = [
  "cyborg", "samurai", "aurora", "marvel", "medieval",
  "cyberpunk", "space", "nature", "deep-ocean", "volcanic",
];

function MatrixRain() {
  const chars = "01アイウエオカキクケコサシスセソタチツテト";
  const columns = 20;
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className="absolute text-xs font-mono"
          style={{
            left: `${(i / columns) * 100}%`,
            color: "var(--theme-primary)",
            animation: `matrixScroll ${2 + Math.random() * 3}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          {Array.from({ length: 15 }).map((_, j) => (
            <div key={j}>
              {chars[Math.floor(Math.random() * chars.length)]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function NeonGridAnim() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="neon-grid absolute inset-0" />
    </div>
  );
}

function EnsoCircleAnim() {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="w-32 h-32 rounded-full border-4"
        style={{ borderColor: "var(--theme-primary)" }}
        initial={{ pathLength: 0, rotate: 0 }}
        animate={{ pathLength: 1, rotate: 360 }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute w-24 h-24 rounded-full"
        style={{ background: `radial-gradient(circle, color-mix(in srgb, var(--theme-primary) 20%, transparent), transparent)` }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

function AuroraAnim() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: "60%",
            height: "60%",
            left: "20%",
            top: "20%",
            background: `radial-gradient(ellipse, color-mix(in srgb, ${i === 1 ? "var(--theme-primary)" : i === 2 ? "var(--theme-secondary)" : "var(--theme-accent)"} 15%, transparent)`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

function ComicBurstAnim() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="w-40 h-40"
        style={{
          background: `conic-gradient(from 0deg, color-mix(in srgb, var(--theme-primary) 30%, transparent), color-mix(in srgb, var(--theme-accent) 30%, transparent), color-mix(in srgb, var(--theme-primary) 30%, transparent), color-mix(in srgb, var(--theme-accent) 30%, transparent))`,
          borderRadius: "50%",
        }}
        animate={{ rotate: 360, scale: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

function StarfieldAnim() {
  const stars = useMemo(() => (
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    }))
  ), []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: "var(--theme-text)",
          }}
          animate={{
            scale: [1, 3, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}

function BubbleAnim() {
  const bubbles = useMemo(() => (
    Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 10 + Math.random() * 30,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 3,
    }))
  ), []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full border"
          style={{
            left: `${b.x}%`,
            width: b.size,
            height: b.size,
            borderColor: `color-mix(in srgb, var(--theme-primary) 30%, transparent)`,
            background: `radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--theme-primary) 15%, transparent), transparent)`,
          }}
          animate={{ y: [400, -100], opacity: [0, 0.6, 0] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

function LavaAnim() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--theme-primary) 30%, transparent), transparent 70%)`,
        }}
        animate={{ y: [20, -20, 20], scaleY: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: `radial-gradient(ellipse at 30% 100%, color-mix(in srgb, var(--theme-accent) 20%, transparent), transparent 60%)`,
        }}
        animate={{ y: [10, -30, 10], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
      />
    </div>
  );
}

function ShieldAnim() {
  return (
    <div className="relative flex items-center justify-center">
      <motion.svg
        width="120"
        height="140"
        viewBox="0 0 120 140"
        fill="none"
        animate={{ scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.path
          d="M60 5 L115 30 L115 80 Q115 120 60 135 Q5 120 5 80 L5 30 Z"
          stroke="var(--theme-primary)"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.path
          d="M60 25 L95 42 L95 75 Q95 105 60 118 Q25 105 25 75 L25 42 Z"
          stroke="var(--theme-secondary)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
        />
      </motion.svg>
    </div>
  );
}

function VineAnim() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <motion.div
        className="w-1 h-0 rounded-full"
        style={{ background: `linear-gradient(to top, var(--theme-primary), var(--theme-secondary))` }}
        animate={{ height: ["0%", "80%", "0%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 8,
            height: 8,
            background: `var(--theme-primary)`,
            left: `calc(50% + ${(i - 2) * 20}px)`,
          }}
          animate={{
            top: ["80%", `${30 + i * 10}%`],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{ duration: 4, delay: i * 0.5, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function getLoadingAnimation(style: string) {
  switch (style) {
    case "matrix-rain": return <MatrixRain />;
    case "neon-grid": return <NeonGridAnim />;
    case "enso-circle": return <EnsoCircleAnim />;
    case "aurora-waves": return <AuroraAnim />;
    case "comic-burst": return <ComicBurstAnim />;
    case "starfield-warp": return <StarfieldAnim />;
    case "bubble-rise": return <BubbleAnim />;
    case "lava-flow": return <LavaAnim />;
    case "shield-reveal": return <ShieldAnim />;
    case "growing-vine": return <VineAnim />;
    default: return <MatrixRain />;
  }
}

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [currentThemeIdx, setCurrentThemeIdx] = useState(0);
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
        style={{ background: theme.colors.background }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background animation */}
        <div className="absolute inset-0">
          {getLoadingAnimation(theme.loadingStyle)}
        </div>

        {/* Floating particles */}
        <div className="particles-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${3 + Math.random() * 5}px`,
                height: `${3 + Math.random() * 5}px`,
                background: i % 3 === 0 ? theme.colors.primary : i % 3 === 1 ? theme.colors.secondary : theme.colors.accent,
                animationDuration: `${4 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
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

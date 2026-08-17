"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, FileText, Radio, Keyboard, MessageSquare,
  Shield, Palette, LogIn, LogOut, Menu, X, ChevronDown
} from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { useAuthStore } from "@/store/auth";
import { getTheme } from "@/lib/themes";
import { themes } from "@/lib/themes";
import { ThemeName } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

const userLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/notepad", label: "Notepad", icon: FileText },
  { href: "/broadcast", label: "Broadcast", icon: Radio },
  { href: "/typing-test", label: "Typing Test", icon: Keyboard },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const pathname = usePathname();
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const theme = getTheme(currentTheme);
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);

  useEffect(() => {
    setMobileOpen(false);
    setThemeOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ background: theme.colors.primary, color: theme.colors.background }}
            whileHover={{ rotate: 10, scale: 1.1 }}
          >
            WU
          </motion.div>
          <span className="text-lg font-bold gradient-text hidden sm:block">Web Utama</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {userLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200"
                style={{
                  color: active ? theme.colors.primary : theme.colors.textMuted,
                  background: active ? `color-mix(in srgb, ${theme.colors.primary} 10%, transparent)` : "transparent",
                }}
              >
                <Icon size={16} />
                <span>{link.label}</span>
                {active && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full"
                    style={{ background: theme.colors.primary }}
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/master"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
              style={{
                color: pathname.startsWith("/master") ? theme.colors.accent : theme.colors.textMuted,
                background: pathname.startsWith("/master") ? `color-mix(in srgb, ${theme.colors.accent} 10%, transparent)` : "transparent",
              }}
            >
              <Shield size={16} />
              <span>Master</span>
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme picker */}
          <div className="relative">
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:bg-[var(--theme-surface)]"
            >
              <Palette size={16} style={{ color: theme.colors.primary }} />
              <span className="hidden sm:inline" style={{ color: theme.colors.textMuted }}>Theme</span>
              <ChevronDown size={14} style={{ color: theme.colors.textMuted }} />
            </button>

            <AnimatePresence>
              {themeOpen && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-64 glass-strong rounded-xl p-3 shadow-xl"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                >
                  <p className="text-xs font-medium mb-2 px-2" style={{ color: theme.colors.textMuted }}>
                    Pilih Theme
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(Object.keys(themes) as ThemeName[]).map((name) => {
                      const t = themes[name];
                      return (
                        <button
                          key={name}
                          onClick={() => setTheme(name)}
                          className="flex items-center gap-2 p-2 rounded-lg text-left transition-all text-xs"
                          style={{
                            background: currentTheme === name ? `color-mix(in srgb, ${t.colors.primary} 15%, transparent)` : "transparent",
                            color: currentTheme === name ? t.colors.primary : theme.colors.textMuted,
                          }}
                        >
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ background: t.colors.primary }}
                          />
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full" style={{ color: theme.colors.textMuted }}>
                {user.email?.split("@")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-[var(--theme-surface)] transition-all"
              >
                <LogOut size={16} style={{ color: theme.colors.textMuted }} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
              style={{ color: theme.colors.primary }}
            >
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--theme-surface)]"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden glass-strong border-t border-[var(--theme-border)]"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="p-4 flex flex-col gap-1">
              {userLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
                    style={{
                      color: active ? theme.colors.primary : theme.colors.textMuted,
                      background: active ? `color-mix(in srgb, ${theme.colors.primary} 10%, transparent)` : "transparent",
                    }}
                  >
                    <Icon size={18} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {isAdmin && (
                <Link
                  href="/master"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm"
                  style={{ color: theme.colors.accent }}
                >
                  <Shield size={18} />
                  <span>Master Panel</span>
                </Link>
              )}

              <div className="border-t border-[var(--theme-border)] my-2" />

              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm"
                  style={{ color: theme.colors.primary }}
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

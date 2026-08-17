"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Link2, Radio, Brain, BarChart3,
  ArrowLeft, Shield, LogOut
} from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { useAuthStore } from "@/store/auth";
import { getTheme } from "@/lib/themes";
import { Particles } from "@/components/particles";

const adminLinks = [
  { href: "/master/links", label: "Links", icon: Link2 },
  { href: "/master/broadcasts", label: "Broadcasts", icon: Radio },
  { href: "/master/ai-settings", label: "AI Knowledge", icon: Brain },
  { href: "/master/analytics", label: "Analytics", icon: BarChart3 },
];

export default function MasterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const loading = useAuthStore((s) => s.loading);
  const setUser = useAuthStore((s) => s.setUser);
  const setIsAdmin = useAuthStore((s) => s.setIsAdmin);
  const setLoading = useAuthStore((s) => s.setLoading);
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  const isLoginPage = pathname === "/master";

  useEffect(() => {
    if (!loading && !isLoginPage && (!user || !isAdmin)) {
      router.push("/master");
    }
  }, [user, isAdmin, loading, router, isLoginPage]);

  // Re-check auth on mount for page refresh scenarios
  useEffect(() => {
    if (!loading) return;
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setIsAdmin(true);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch {
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [loading, setUser, setIsAdmin, setLoading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.colors.background }}>
        <div className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full" style={{ borderColor: `${theme.colors.primary}40`, borderTopColor: theme.colors.primary }} />
      </div>
    );
  }

  // Login page - no sidebar, just the content
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!user || !isAdmin) return null;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setIsAdmin(false);
    router.push("/master");
  };

  return (
    <div className="min-h-screen">
      <Particles count={15} />

      {/* Top bar */}
      <div className="sticky top-0 z-50 glass-strong border-b border-[var(--theme-border)]">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-sm" style={{ color: theme.colors.textMuted }}>
              <ArrowLeft size={16} /> Web Utama
            </Link>
            <div className="w-px h-6" style={{ background: theme.colors.border }} />
            <div className="flex items-center gap-2">
              <Shield size={16} style={{ color: theme.colors.accent }} />
              <span className="font-bold text-sm" style={{ color: theme.colors.accent }}>Master Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs hidden sm:block" style={{ color: theme.colors.textMuted }}>
              {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-[var(--theme-surface)] transition-all"
              title="Logout"
            >
              <LogOut size={16} style={{ color: theme.colors.textMuted }} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6 relative z-10">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 hidden md:block">
          <nav className="space-y-1">
            {adminLinks.map((link) => {
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
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-[var(--theme-border)]">
          <nav className="flex justify-around py-2">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg text-[10px]"
                  style={{
                    color: active ? theme.colors.primary : theme.colors.textMuted,
                  }}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { useAuthStore } from "@/store/auth";
import { getTheme } from "@/lib/themes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MasterLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const setIsAdmin = useAuthStore((s) => s.setIsAdmin);
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal");
        setLoading(false);
        return;
      }

      // Update auth store
      setUser(data.user);
      setIsAdmin(true);

      // Redirect to admin panel
      router.push("/master/links");
    } catch {
      setError("Terjadi kesalahan koneksi");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card variant="glass" className="p-8">
          <div className="text-center mb-8">
            <motion.div
              className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.primary})` }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <Shield size={36} style={{ color: theme.colors.background }} />
            </motion.div>
            <h1 className="text-2xl font-bold" style={{ color: theme.colors.text }}>
              Master Panel
            </h1>
            <p className="text-sm mt-1" style={{ color: theme.colors.textMuted }}>
              Akses khusus administrator
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.colors.textMuted }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                autoComplete="username"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--theme-accent)]"
                style={{
                  background: theme.colors.surface,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.colors.textMuted }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--theme-accent)]"
                style={{
                  background: theme.colors.surface,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff size={16} style={{ color: theme.colors.textMuted }} />
                ) : (
                  <Eye size={16} style={{ color: theme.colors.textMuted }} />
                )}
              </button>
            </div>

            {error && (
              <motion.p
                className="text-sm text-center py-2 px-3 rounded-lg"
                style={{ background: "#ef444420", color: "#ef4444" }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Memproses...</>
              ) : (
                <><Shield size={16} /> Masuk</>
              )}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

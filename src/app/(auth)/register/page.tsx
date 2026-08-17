"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: username },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card variant="glass" className="p-8">
          <div className="text-center mb-6">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` }}
            >
              <UserPlus size={28} style={{ color: theme.colors.background }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: theme.colors.text }}>Buat Akun</h1>
            <p className="text-sm mt-1" style={{ color: theme.colors.textMuted }}>Gabung ke Web Utama</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.colors.textMuted }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--theme-primary)]"
                style={{
                  background: theme.colors.surface,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
            </div>

            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.colors.textMuted }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--theme-primary)]"
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
                className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--theme-primary)]"
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
                {showPassword ? <EyeOff size={16} style={{ color: theme.colors.textMuted }} /> : <Eye size={16} style={{ color: theme.colors.textMuted }} />}
              </button>
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.colors.textMuted }} />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Konfirmasi Password"
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--theme-primary)]"
                style={{
                  background: theme.colors.surface,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Mendaftar..." : "Daftar"}
            </Button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: theme.colors.textMuted }}>
            Sudah punya akun?{" "}
            <Link href="/login" className="font-medium" style={{ color: theme.colors.primary }}>
              Masuk
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

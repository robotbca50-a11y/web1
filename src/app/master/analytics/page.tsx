"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, Keyboard, TrendingUp, Clock } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TypingResult } from "@/lib/types";

export default function AnalyticsPage() {
  const [results, setResults] = useState<TypingResult[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const [resultsRes, usersRes] = await Promise.all([
        supabase.from("typing_results").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("profiles").select("id", { count: "exact" }),
      ]);
      if (resultsRes.data) setResults(resultsRes.data);
      setTotalUsers(usersRes.count || 0);
    };
    loadData();
  }, []);

  const avgWpm = results.length ? Math.round(results.reduce((a, b) => a + b.wpm, 0) / results.length) : 0;
  const avgAccuracy = results.length ? Math.round(results.reduce((a, b) => a + Number(b.accuracy), 0) / results.length) : 0;
  const topWpm = results.length ? Math.max(...results.map((r) => r.wpm)) : 0;

  const difficultyStats = ["easy", "medium", "hard"].map((d) => {
    const filtered = results.filter((r) => r.difficulty === d);
    return {
      difficulty: d,
      count: filtered.length,
      avgWpm: filtered.length ? Math.round(filtered.reduce((a, b) => a + b.wpm, 0) / filtered.length) : 0,
    };
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BarChart3 size={24} style={{ color: theme.colors.primary }} />
        Analytics
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total Races", value: results.length, icon: Keyboard, color: theme.colors.primary },
          { label: "Total Users", value: totalUsers, icon: Users, color: theme.colors.secondary },
          { label: "Avg WPM", value: avgWpm, icon: TrendingUp, color: "#22c55e" },
          { label: "Top WPM", value: topWpm, icon: TrendingUp, color: "#eab308" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card variant="glass" className="p-4 text-center">
                <Icon size={20} className="mx-auto mb-2" style={{ color: s.color }} />
                <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: theme.colors.textMuted }}>{s.label}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Difficulty breakdown */}
      <Card variant="glass" className="p-6 mb-6">
        <h2 className="text-lg font-bold mb-4" style={{ color: theme.colors.text }}>By Difficulty</h2>
        <div className="grid grid-cols-3 gap-4">
          {difficultyStats.map((d) => (
            <div key={d.difficulty} className="text-center p-4 rounded-lg" style={{ background: theme.colors.surface }}>
              <Badge variant={d.difficulty === "easy" ? "success" : d.difficulty === "hard" ? "danger" : "primary"} className="mb-2 capitalize">
                {d.difficulty}
              </Badge>
              <div className="text-xl font-bold font-mono" style={{ color: theme.colors.primary }}>{d.avgWpm}</div>
              <div className="text-xs" style={{ color: theme.colors.textMuted }}>avg WPM</div>
              <div className="text-xs mt-1" style={{ color: theme.colors.textMuted }}>{d.count} races</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent results */}
      <Card variant="glass" className="p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Clock size={20} style={{ color: theme.colors.primary }} />
          Recent Results
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: theme.colors.textMuted }}>
                <th className="text-left py-2 px-2">Player</th>
                <th className="text-left py-2 px-2">Difficulty</th>
                <th className="text-right py-2 px-2">WPM</th>
                <th className="text-right py-2 px-2">Accuracy</th>
                <th className="text-right py-2 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 20).map((r) => (
                <tr key={r.id} className="border-t border-[var(--theme-border)]" style={{ color: theme.colors.text }}>
                  <td className="py-2 px-2">{r.nickname || "Anonymous"}</td>
                  <td className="py-2 px-2 capitalize">{r.difficulty}</td>
                  <td className="py-2 px-2 text-right font-mono font-bold" style={{ color: theme.colors.primary }}>{r.wpm}</td>
                  <td className="py-2 px-2 text-right font-mono">{r.accuracy}%</td>
                  <td className="py-2 px-2 text-right text-xs" style={{ color: theme.colors.textMuted }}>
                    {new Date(r.completed_at).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

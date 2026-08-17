"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Radio, AlertTriangle, Info, AlertCircle, Clock } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Broadcast } from "@/lib/types";

const priorityConfig = {
  low: { icon: Info, color: "#94a3b8", label: "Low" },
  normal: { icon: Info, color: "#3b82f6", label: "Normal" },
  high: { icon: AlertTriangle, color: "#eab308", label: "High" },
  urgent: { icon: AlertCircle, color: "#ef4444", label: "Urgent" },
};

export default function BroadcastPage() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const res = await fetch("/api/public/content");
        if (res.ok) {
          const data = await res.json();
          if (data.broadcasts) setBroadcasts(data.broadcasts);
        }
      } catch (e) {
        console.warn("Failed to fetch broadcasts:", e);
      }
      setLoading(false);
    };
    fetchBroadcasts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Radio size={24} style={{ color: theme.colors.accent }} />
          Broadcast
        </h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} variant="glass" className="p-6 animate-pulse">
                <div className="h-4 w-1/3 rounded mb-3" style={{ background: theme.colors.surface }} />
                <div className="h-3 w-full rounded mb-2" style={{ background: theme.colors.surface }} />
                <div className="h-3 w-2/3 rounded" style={{ background: theme.colors.surface }} />
              </Card>
            ))}
          </div>
        ) : broadcasts.length === 0 ? (
          <Card variant="glass" className="p-12 text-center">
            <Radio size={48} className="mx-auto mb-4 opacity-20" style={{ color: theme.colors.textMuted }} />
            <p style={{ color: theme.colors.textMuted }}>Belum ada broadcast</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {broadcasts.map((broadcast, i) => {
              const config = priorityConfig[broadcast.priority as keyof typeof priorityConfig] || priorityConfig.normal;
              const Icon = config.icon;
              return (
                <motion.div
                  key={broadcast.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card variant="glass" className="p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${config.color}20` }}
                      >
                        <Icon size={20} style={{ color: config.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h2 className="font-bold" style={{ color: theme.colors.text }}>
                            {broadcast.title}
                          </h2>
                          <Badge
                            variant={
                              broadcast.priority === "urgent" ? "danger" :
                              broadcast.priority === "high" ? "warning" :
                              broadcast.priority === "normal" ? "primary" : "default"
                            }
                          >
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: theme.colors.textMuted }}>
                          {broadcast.content}
                        </p>
                        <div className="flex items-center gap-1 mt-3">
                          <Clock size={12} style={{ color: theme.colors.textMuted }} />
                          <span className="text-xs" style={{ color: theme.colors.textMuted }}>
                            {new Date(broadcast.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}

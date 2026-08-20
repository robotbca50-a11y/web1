"use client";

import { useState, useEffect } from "react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";

interface TrainingStatus {
  totalLearned: number;
  totalPool: number;
  remaining: number;
  byCategory: Record<string, number>;
  topUsed: Array<{ question: string; usage_count: number }>;
  recentTrained: Array<{ question: string; category: string; created_at: string }>;
  aiProvider: string;
  hasApiKey: boolean;
  ollamaUrl: string;
  ollamaModel: string;
}

interface TrainItem {
  question: string;
  category: string;
  status: "pending" | "loading" | "success" | "failed";
  answer?: string;
}

export default function AITrainPage() {
  const [status, setStatus] = useState<TrainingStatus | null>(null);
  const [training, setTraining] = useState(false);
  const [items, setItems] = useState<TrainItem[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0, trained: 0, failed: 0 });
  const [count, setCount] = useState(10);
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/ai-train");
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error("Failed to fetch status:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const startTraining = async () => {
    setTraining(true);
    setItems([]);
    setProgress({ done: 0, total: count, trained: 0, failed: 0 });

    for (let i = 0; i < count; i++) {
      setProgress((p) => ({ ...p, done: i, total: count }));

      const pendingItem: TrainItem = { question: `Question ${i + 1}...`, category: "", status: "loading" };
      setItems((prev) => {
        const updated = [...prev];
        if (updated[i]) {
          updated[i] = { ...updated[i], status: "loading" };
        }
        return updated;
      });

      try {
        const res = await fetch("/api/ai-train", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count: 1 }),
        });
        const data = await res.json();

        if (data.questions && data.questions.length > 0) {
          const q = data.questions[0];
          setItems((prev) => {
            const updated = [...prev];
            updated[i] = {
              question: q.question,
              category: q.category || "",
              status: q.status === "success" ? "success" : "failed",
              answer: q.answer,
            };
            return updated;
          });
          setProgress((p) => ({
            ...p,
            trained: p.trained + (q.status === "success" ? 1 : 0),
            failed: p.failed + (q.status !== "success" ? 1 : 0),
          }));
        } else {
          setItems((prev) => {
            const updated = [...prev];
            updated[i] = { question: "No response", category: "", status: "failed", answer: "Empty response from API" };
            return updated;
          });
          setProgress((p) => ({ ...p, failed: p.failed + 1 }));
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Network error";
        setItems((prev) => {
          const updated = [...prev];
          updated[i] = { question: `Error ${i + 1}`, category: "", status: "failed", answer: msg };
          return updated;
        });
        setProgress((p) => ({ ...p, failed: p.failed + 1 }));
      }
    }

    setProgress((p) => ({ ...p, done: p.total }));
    setTraining(false);
    fetchStatus();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6" style={{ color: theme.colors.text }}>
        AI Training Panel
      </h1>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl p-4" style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
          <div className="text-sm" style={{ color: theme.colors.textMuted }}>Learned</div>
          <div className="text-3xl font-bold" style={{ color: theme.colors.primary }}>{status?.totalLearned || 0}</div>
          <div className="text-xs" style={{ color: theme.colors.textMuted }}>of {status?.totalPool || 0} questions</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
          <div className="text-sm" style={{ color: theme.colors.textMuted }}>Remaining</div>
          <div className="text-3xl font-bold" style={{ color: theme.colors.secondary }}>{status?.remaining || 0}</div>
          <div className="text-xs" style={{ color: theme.colors.textMuted }}>untrained questions</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
          <div className="text-sm" style={{ color: theme.colors.textMuted }}>AI Provider</div>
          <div className="text-lg font-bold" style={{ color: status?.hasApiKey ? "#22c55e" : "#ef4444" }}>
            {status?.aiProvider || "unknown"}
          </div>
          <div className="text-xs" style={{ color: theme.colors.textMuted }}>
            API Key: {status?.hasApiKey ? "Configured" : "NOT SET"}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {status?.byCategory && Object.keys(status.byCategory).length > 0 && (
        <div className="rounded-xl p-4 mb-6" style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
          <h3 className="font-bold mb-3" style={{ color: theme.colors.text }}>By Category</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(status.byCategory).map(([cat, num]) => (
              <span
                key={cat}
                className="px-3 py-1 rounded-full text-sm"
                style={{ background: `${theme.colors.primary}20`, color: theme.colors.primary }}
              >
                {cat}: {num}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Training Controls */}
      <div className="rounded-xl p-6 mb-6" style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
        <h3 className="font-bold mb-4" style={{ color: theme.colors.text }}>Start Training</h3>
        <div className="flex items-center gap-4 mb-4">
          <label style={{ color: theme.colors.text }}>Questions:</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 10)}
            min={1}
            max={50}
            className="w-20 px-3 py-2 rounded-lg text-sm"
            style={{ background: theme.colors.background, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
          />
          <button
            onClick={startTraining}
            disabled={training}
            className="px-6 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
              color: theme.colors.background,
            }}
          >
            {training ? `Training... (${progress.done}/${progress.total})` : "Start Training"}
          </button>
        </div>
        <p className="text-xs" style={{ color: theme.colors.textMuted }}>
          Trains one question at a time. Each question ~15-30 seconds.
        </p>
      </div>

      {/* Live Progress */}
      {training && (
        <div className="rounded-xl p-4 mb-6" style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: theme.colors.text }}>Progress</span>
            <span style={{ color: theme.colors.textMuted }}>{progress.done}/{progress.total}</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: theme.colors.background }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(progress.done / Math.max(progress.total, 1)) * 100}%`,
                background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
              }}
            />
          </div>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="text-green-400">✓ {progress.trained} trained</span>
            <span className="text-red-400">✗ {progress.failed} failed</span>
          </div>
        </div>
      )}

      {/* Training Results */}
      {items.length > 0 && (
        <div className="rounded-xl p-6 mb-6" style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
          <h3 className="font-bold mb-3" style={{ color: theme.colors.text }}>Results</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {items.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-lg text-sm"
                style={{
                  background: item.status === "success" ? "#22c55e10" : item.status === "failed" ? "#ef444410" : theme.colors.background,
                  border: `1px solid ${item.status === "success" ? "#22c55e30" : item.status === "failed" ? "#ef444430" : theme.colors.border}`,
                }}
              >
                <div className="flex items-center gap-2">
                  {item.status === "loading" && <span className="animate-spin">⏳</span>}
                  {item.status === "success" && <span className="text-green-400">✓</span>}
                  {item.status === "failed" && <span className="text-red-400">✗</span>}
                  <span className="font-medium" style={{ color: theme.colors.text }}>{item.question}</span>
                  {item.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${theme.colors.primary}20`, color: theme.colors.primary }}>
                      {item.category}
                    </span>
                  )}
                </div>
                {item.answer && (
                  <div className="text-xs mt-1" style={{ color: theme.colors.textMuted }}>
                    {item.status === "success" ? item.answer.substring(0, 120) + "..." : item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Trained */}
      {status?.recentTrained && status.recentTrained.length > 0 && (
        <div className="rounded-xl p-6" style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
          <h3 className="font-bold mb-3" style={{ color: theme.colors.text }}>Recently Trained</h3>
          <div className="space-y-2">
            {status.recentTrained.map((q, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg text-sm"
                style={{ background: theme.colors.background }}
              >
                <span style={{ color: theme.colors.text }}>{q.question}</span>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${theme.colors.primary}20`, color: theme.colors.primary }}>
                  {q.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

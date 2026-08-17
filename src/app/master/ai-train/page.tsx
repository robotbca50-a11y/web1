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
  ollamaUrl: string;
  ollamaModel: string;
}

interface TrainResult {
  trained: number;
  failed: number;
  questions: Array<{ question: string; answer: string; status: string }>;
}

export default function AITrainPage() {
  const [status, setStatus] = useState<TrainingStatus | null>(null);
  const [training, setTraining] = useState(false);
  const [result, setResult] = useState<TrainResult | null>(null);
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
    setResult(null);
    try {
      const res = await fetch("/api/ai-train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count }),
      });
      const data = await res.json();
      setResult(data);
      fetchStatus(); // refresh stats
    } catch (err) {
      console.error("Training failed:", err);
    } finally {
      setTraining(false);
    }
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
          <div className="text-sm" style={{ color: theme.colors.textMuted }}>Ollama Model</div>
          <div className="text-lg font-bold" style={{ color: theme.colors.text }}>{status?.ollamaModel || "llama3.1" }</div>
          <div className="text-xs" style={{ color: theme.colors.textMuted }}>{status?.ollamaUrl || "localhost:11434"}</div>
        </div>
      </div>

      {/* Category Breakdown */}
      {status?.byCategory && (
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
          <label style={{ color: theme.colors.text }}>Questions per batch:</label>
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
            {training ? "Training..." : "Start Training"}
          </button>
        </div>
        <p className="text-xs" style={{ color: theme.colors.textMuted }}>
          Sends random questions to Ollama, saves answers. Each batch trains {count} questions.
        </p>
      </div>

      {/* Training Result */}
      {result && (
        <div className="rounded-xl p-6 mb-6" style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
          <h3 className="font-bold mb-3" style={{ color: theme.colors.text }}>
            Training Result
          </h3>
          <div className="flex gap-4 mb-4">
            <span className="text-green-400">✓ {result.trained} trained</span>
            <span className="text-red-400">✗ {result.failed} failed</span>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {result.questions.map((q, i) => (
              <div
                key={i}
                className="p-3 rounded-lg text-sm"
                style={{
                  background: q.status === "success" ? "#22c55e10" : "#ef444410",
                  border: `1px solid ${q.status === "success" ? "#22c55e30" : "#ef444430"}`,
                }}
              >
                <div className="font-medium" style={{ color: theme.colors.text }}>{q.question}</div>
                <div className="text-xs mt-1" style={{ color: theme.colors.textMuted }}>
                  {q.status === "success" ? q.answer : `Failed: ${q.answer}`}
                </div>
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

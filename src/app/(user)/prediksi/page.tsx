"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Target } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  date: string;
  time: string;
  homeForm: string[];
  awayForm: string[];
  prediction: string;
  confidence: number;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
}

const LEAGUES = [
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "Liga Indonesia",
];

const SAMPLE_MATCHES: Match[] = [
  {
    id: 1,
    homeTeam: "Manchester City",
    awayTeam: "Arsenal",
    league: "Premier League",
    date: "Sabtu, 22 Agu",
    time: "21:00 WIB",
    homeForm: ["W", "W", "D", "W", "L"],
    awayForm: ["W", "D", "W", "W", "D"],
    prediction: "Over 2.5",
    confidence: 78,
    odds: { home: 1.85, draw: 3.60, away: 4.10 },
  },
  {
    id: 2,
    homeTeam: "Real Madrid",
    awayTeam: "Sevilla",
    league: "La Liga",
    date: "Sabtu, 22 Agu",
    time: "23:30 WIB",
    homeForm: ["W", "W", "W", "D", "W"],
    awayForm: ["L", "D", "W", "L", "D"],
    prediction: "Home Win -1.5",
    confidence: 72,
    odds: { home: 1.45, draw: 4.50, away: 6.75 },
  },
  {
    id: 3,
    homeTeam: "Inter Milan",
    awayTeam: "Juventus",
    league: "Serie A",
    date: "Minggu, 23 Agu",
    time: "02:45 WIB",
    homeForm: ["W", "D", "W", "L", "W"],
    awayForm: ["D", "W", "D", "W", "D"],
    prediction: "BTTS Yes",
    confidence: 65,
    odds: { home: 2.10, draw: 3.25, away: 3.40 },
  },
  {
    id: 4,
    homeTeam: "Bayern Munich",
    awayTeam: "Borussia Dortmund",
    league: "Bundesliga",
    date: "Minggu, 23 Agu",
    time: "23:30 WIB",
    homeForm: ["W", "L", "W", "W", "W"],
    awayForm: ["W", "W", "D", "L", "W"],
    prediction: "Over 2.5",
    confidence: 81,
    odds: { home: 1.70, draw: 4.00, away: 4.25 },
  },
  {
    id: 5,
    homeTeam: "Olympique Lyon",
    awayTeam: "Paris Saint-Germain",
    league: "Ligue 1",
    date: "Senin, 24 Agu",
    time: "02:00 WIB",
    homeForm: ["D", "L", "W", "D", "L"],
    awayForm: ["W", "W", "W", "W", "D"],
    prediction: "Away Win",
    confidence: 69,
    odds: { home: 4.80, draw: 3.90, away: 1.62 },
  },
  {
    id: 6,
    homeTeam: "Persija Jakarta",
    awayTeam: "Persib Bandung",
    league: "Liga Indonesia",
    date: "Senin, 24 Agu",
    time: "19:00 WIB",
    homeForm: ["W", "D", "L", "W", "D"],
    awayForm: ["D", "W", "D", "D", "W"],
    prediction: "Draw",
    confidence: 58,
    odds: { home: 2.55, draw: 3.05, away: 2.80 },
  },
];

function FormDot({ result }: { result: string }) {
  const color =
    result === "W" ? "#22c55e" : result === "D" ? "#eab308" : "#ef4444";
  return (
    <span
      className="inline-block h-2 w-2 rounded-full"
      style={{ backgroundColor: color }}
      title={result === "W" ? "Menang" : result === "D" ? "Serim" : "Kalah"}
    />
  );
}

export default function PrediksiPage() {
  const [activeLeague, setActiveLeague] = useState<string>("Semua");

  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);
  const colors = theme.colors;

  const filteredMatches =
    activeLeague === "Semua"
      ? SAMPLE_MATCHES
      : SAMPLE_MATCHES.filter((m) => m.league === activeLeague);

  return (
    <div className="min-h-screen px-4 py-8 md:px-8" style={{ backgroundColor: colors.background }}>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center"
        >
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
              color: colors.primary,
            }}
          >
            <TrendingUp className="h-4 w-4" />
            Prediksi Pertandingan
          </div>
          <h1
            className="text-3xl font-bold tracking-tight md:text-4xl"
            style={{ color: colors.text }}
          >
            Prediksi Bola Hari Ini
          </h1>
          <p className="mt-2 text-sm md:text-base" style={{ color: colors.textMuted }}>
            Analisis form tim dan prediksi pertandingan dari liga top Eropa & Indonesia
          </p>
        </motion.div>

        {/* League Filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 flex flex-wrap justify-center gap-2"
        >
          {["Semua", ...LEAGUES].map((league) => {
            const isActive = activeLeague === league;
            return (
              <button
                key={league}
                onClick={() => setActiveLeague(league)}
                className="rounded-full border px-4 py-2 text-sm font-medium transition-all hover:scale-105"
                style={{
                  borderColor: isActive ? colors.primary : colors.border,
                  backgroundColor: isActive ? colors.primary : colors.surface,
                  color: isActive ? colors.background : colors.text,
                }}
              >
                {league}
              </button>
            );
          })}
        </motion.div>

        {/* Match Cards */}
        <div className="grid gap-5">
          {filteredMatches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              {/* Top row: league badge + datetime */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span
                  className="rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.background,
                  }}
                >
                  {match.league}
                </span>
                <div
                  className="flex items-center gap-1.5 text-xs"
                  style={{ color: colors.textMuted }}
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>{match.date}</span>
                  <span>•</span>
                  <span>{match.time}</span>
                </div>
              </div>

              {/* Teams vs prediction */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                {/* Home team */}
                <div className="text-right">
                  <p className="font-semibold" style={{ color: colors.text }}>
                    {match.homeTeam}
                  </p>
                  <div className="mt-1.5 flex justify-end gap-1">
                    {match.homeForm.map((r, i) => (
                      <FormDot key={i} result={r} />
                    ))}
                  </div>
                </div>

                {/* Prediction box */}
                <div
                  className="flex min-w-[110px] flex-col items-center gap-1 rounded-lg border px-3 py-2"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  }}
                >
                  <div className="flex items-center gap-1 text-xs font-medium" style={{ color: colors.primary }}>
                    <Target className="h-3.5 w-3.5" />
                    <span>Prediksi</span>
                  </div>
                  <p className="text-sm font-bold" style={{ color: colors.text }}>
                    {match.prediction}
                  </p>
                  <div
                    className="h-1 w-full overflow-hidden rounded-full"
                    style={{ backgroundColor: colors.border }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: match.confidence + "%",
                        backgroundColor: colors.accent,
                      }}
                    />
                  </div>
                  <span className="text-[10px]" style={{ color: colors.textMuted }}>
                    Confidence {match.confidence}%
                  </span>
                </div>

                {/* Away team */}
                <div className="text-left">
                  <p className="font-semibold" style={{ color: colors.text }}>
                    {match.awayTeam}
                  </p>
                  <div className="mt-1.5 flex gap-1">
                    {match.awayForm.map((r, i) => (
                      <FormDot key={i} result={r} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Odds */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {(
                  [
                    { label: "Home", value: match.odds.home },
                    { label: "Draw", value: match.odds.draw },
                    { label: "Away", value: match.odds.away },
                  ] as const
                ).map((odd) => (
                  <div
                    key={odd.label}
                    className="flex flex-col items-center rounded-lg border py-2"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                    }}
                  >
                    <span className="text-[11px] uppercase tracking-wide" style={{ color: colors.textMuted }}>
                      {odd.label}
                    </span>
                    <span className="text-sm font-bold" style={{ color: colors.secondary }}>
                      {odd.value.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredMatches.length === 0 && (
          <p className="py-16 text-center text-sm" style={{ color: colors.textMuted }}>
            Tidak ada pertandingan untuk liga ini.
          </p>
        )}
      </div>
    </div>
  );
}

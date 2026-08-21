"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Plus, Trash2, Zap } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";

interface ParlayPick {
  id: number;
  match: string;
  pick: string;
  odds: number;
  selected: boolean;
}

interface MatchOption {
  match: string;
  league: string;
  options: { pick: string; odds: number }[];
}

const SAMPLE_MATCHES: MatchOption[] = [
  {
    match: "Manchester City vs Arsenal",
    league: "Premier League",
    options: [
      { pick: "Home Win", odds: 1.85 },
      { pick: "Draw", odds: 3.6 },
      { pick: "Away Win", odds: 4.1 },
      { pick: "Over 2.5", odds: 1.72 },
      { pick: "Under 2.5", odds: 2.05 },
      { pick: "BTTS Yes", odds: 1.66 },
      { pick: "BTTS No", odds: 2.1 },
    ],
  },
  {
    match: "Real Madrid vs Sevilla",
    league: "La Liga",
    options: [
      { pick: "Home Win", odds: 1.45 },
      { pick: "Draw", odds: 4.5 },
      { pick: "Away Win", odds: 6.75 },
      { pick: "Over 2.5", odds: 1.8 },
      { pick: "Under 2.5", odds: 1.95 },
      { pick: "BTTS Yes", odds: 1.9 },
      { pick: "BTTS No", odds: 1.85 },
    ],
  },
  {
    match: "Inter Milan vs Juventus",
    league: "Serie A",
    options: [
      { pick: "Home Win", odds: 2.1 },
      { pick: "Draw", odds: 3.25 },
      { pick: "Away Win", odds: 3.4 },
      { pick: "Over 2.5", odds: 2.15 },
      { pick: "Under 2.5", odds: 1.65 },
      { pick: "BTTS Yes", odds: 1.95 },
      { pick: "BTTS No", odds: 1.8 },
    ],
  },
  {
    match: "Bayern Munich vs Borussia Dortmund",
    league: "Bundesliga",
    options: [
      { pick: "Home Win", odds: 1.7 },
      { pick: "Draw", odds: 4.0 },
      { pick: "Away Win", odds: 4.25 },
      { pick: "Over 2.5", odds: 1.5 },
      { pick: "Under 2.5", odds: 2.45 },
      { pick: "BTTS Yes", odds: 1.55 },
      { pick: "BTTS No", odds: 2.3 },
    ],
  },
  {
    match: "Olympique Lyon vs Paris Saint-Germain",
    league: "Ligue 1",
    options: [
      { pick: "Home Win", odds: 4.8 },
      { pick: "Draw", odds: 3.9 },
      { pick: "Away Win", odds: 1.62 },
      { pick: "Over 2.5", odds: 1.75 },
      { pick: "Under 2.5", odds: 2.0 },
      { pick: "BTTS Yes", odds: 1.7 },
      { pick: "BTTS No", odds: 2.05 },
    ],
  },
  {
    match: "Liverpool vs Chelsea",
    league: "Premier League",
    options: [
      { pick: "Home Win", odds: 1.95 },
      { pick: "Draw", odds: 3.55 },
      { pick: "Away Win", odds: 3.7 },
      { pick: "Over 2.5", odds: 1.68 },
      { pick: "Under 2.5", odds: 2.1 },
      { pick: "BTTS Yes", odds: 1.6 },
      { pick: "BTTS No", odds: 2.2 },
    ],
  },
  {
    match: "Barcelona vs Atletico Madrid",
    league: "La Liga",
    options: [
      { pick: "Home Win", odds: 1.78 },
      { pick: "Draw", odds: 3.7 },
      { pick: "Away Win", odds: 4.3 },
      { pick: "Over 2.5", odds: 1.85 },
      { pick: "Under 2.5", odds: 1.9 },
      { pick: "BTTS Yes", odds: 1.75 },
      { pick: "BTTS No", odds: 2.0 },
    ],
  },
  {
    match: "AC Milan vs Napoli",
    league: "Serie A",
    options: [
      { pick: "Home Win", odds: 2.35 },
      { pick: "Draw", odds: 3.2 },
      { pick: "Away Win", odds: 2.95 },
      { pick: "Over 2.5", odds: 2.05 },
      { pick: "Under 2.5", odds: 1.72 },
      { pick: "BTTS Yes", odds: 1.88 },
      { pick: "BTTS No", odds: 1.86 },
    ],
  },
  {
    match: "Persija Jakarta vs Persib Bandung",
    league: "Liga Indonesia",
    options: [
      { pick: "Home Win", odds: 2.55 },
      { pick: "Draw", odds: 3.05 },
      { pick: "Away Win", odds: 2.8 },
      { pick: "Over 2.5", odds: 2.2 },
      { pick: "Under 2.5", odds: 1.62 },
      { pick: "BTTS Yes", odds: 2.0 },
      { pick: "BTTS No", odds: 1.75 },
    ],
  },
  {
    match: "Ajax Amsterdam vs PSV Eindhoven",
    league: "Eredivisie",
    options: [
      { pick: "Home Win", odds: 2.25 },
      { pick: "Draw", odds: 3.65 },
      { pick: "Away Win", odds: 2.85 },
      { pick: "Over 2.5", odds: 1.58 },
      { pick: "Under 2.5", odds: 2.3 },
      { pick: "BTTS Yes", odds: 1.62 },
      { pick: "BTTS No", odds: 2.18 },
    ],
  },
];

function buildPicks(): ParlayPick[] {
  const picks: ParlayPick[] = [];
  let id = 1;
  SAMPLE_MATCHES.forEach((m) => {
    m.options.forEach((opt) => {
      picks.push({
        id: id++,
        match: m.match,
        pick: opt.pick,
        odds: opt.odds,
        selected: false,
      });
    });
  });
  return picks;
}

export default function ParlayPage() {
  const [picks, setPicks] = useState<ParlayPick[]>(buildPicks);
  const [betAmount, setBetAmount] = useState<number>(10000);
  const [result, setResult] = useState<{
    totalOdds: number;
    potentialReturn: number;
    profit: number;
  } | null>(null);

  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);
  const colors = theme.colors;

  const selectedPicks = picks.filter((p) => p.selected);

  const togglePick = (id: number) => {
    setPicks((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
    setResult(null);
  };

  const clearAll = () => {
    setPicks((prev) => prev.map((p) => ({ ...p, selected: false })));
    setResult(null);
  };

  const calculate = () => {
    if (selectedPicks.length < 2) return;
    const totalOdds = selectedPicks.reduce((acc, p) => acc * p.odds, 1);
    const stake = betAmount > 0 ? betAmount : 0;
    const potentialReturn = totalOdds * stake;
    setResult({
      totalOdds,
      potentialReturn,
      profit: potentialReturn - stake,
    });
  };

  return (
    <div
      className="min-h-screen px-4 py-8 md:px-8"
      style={{ backgroundColor: colors.background }}
    >
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
            <Calculator className="h-4 w-4" />
            Hitung Kemenangan Parlay Kamu
          </div>
          <h1
            className="text-3xl font-bold tracking-tight md:text-4xl"
            style={{ color: colors.text }}
          >
            Parlay Calculator
          </h1>
          <p className="mt-2 text-sm md:text-base" style={{ color: colors.textMuted }}>
            Pilih beberapa pick dari pertandingan di bawah, lalu hitung potensi kemenanganmu
          </p>
        </motion.div>

        {/* Your Parlay */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 rounded-xl border p-5"
          style={{
            backgroundColor: colors.surface,
            borderColor: selectedPicks.length > 0 ? colors.primary : colors.border,
          }}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2
              className="flex items-center gap-2 text-lg font-bold"
              style={{ color: colors.text }}
            >
              <Zap className="h-5 w-5" style={{ color: colors.primary }} />
              Your Parlay
              <span
                className="rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                }}
              >
                {selectedPicks.length} pick
              </span>
            </h2>
            <button
              onClick={clearAll}
              disabled={selectedPicks.length === 0}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                borderColor: colors.border,
                color: colors.accent,
                backgroundColor: colors.background,
              }}
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          </div>

          {selectedPicks.length === 0 ? (
            <p className="py-4 text-center text-sm" style={{ color: colors.textMuted }}>
              Belum ada pick dipilih. Klik kartu di bawah untuk menambahkan.
            </p>
          ) : (
            <div className="grid gap-2">
              {selectedPicks.map((pick, index) => (
                <motion.div
                  key={pick.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className="flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  }}
                >
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-semibold"
                      style={{ color: colors.text }}
                    >
                      {pick.match}
                    </p>
                    <p className="text-xs" style={{ color: colors.textMuted }}>
                      {pick.pick}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className="text-sm font-bold"
                      style={{ color: colors.secondary }}
                    >
                      {pick.odds.toFixed(2)}
                    </span>
                    <button
                      onClick={() => togglePick(pick.id)}
                      className="rounded-md p-1.5 transition-colors hover:opacity-70"
                      style={{
                        border: "1px solid " + colors.border,
                        color: colors.accent,
                      }}
                      aria-label={"Remove " + pick.pick}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Bet amount + Calculate */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-lg border px-3 py-2"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.background,
              }}
            >
              <span className="text-sm font-medium" style={{ color: colors.textMuted }}>
                Rp
              </span>
              <input
                type="number"
                min={0}
                value={betAmount}
                onChange={(e) => {
                  setBetAmount(Number(e.target.value));
                  setResult(null);
                }}
                className="w-full bg-transparent text-sm font-semibold outline-none"
                style={{ color: colors.text }}
                placeholder="Masukkan jumlah taruhan"
              />
            </div>
            <button
              onClick={calculate}
              disabled={selectedPicks.length < 2}
              className="flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              <Calculator className="h-4 w-4" />
              Calculate
            </button>
          </div>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-5 rounded-lg border p-4"
              style={{
                borderColor: colors.primary,
                backgroundColor: colors.background,
              }}
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-wide" style={{ color: colors.textMuted }}>
                    Total Odds
                  </p>
                  <p className="text-xl font-bold" style={{ color: colors.secondary }}>
                    {result.totalOdds.toFixed(2)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-wide" style={{ color: colors.textMuted }}>
                    Potensi Kemenangan
                  </p>
                  <p className="text-xl font-bold" style={{ color: colors.primary }}>
                    {"Rp " + Math.round(result.potentialReturn).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-wide" style={{ color: colors.textMuted }}>
                    Keuntungan Bersih
                  </p>
                  <p className="text-xl font-bold" style={{ color: colors.accent }}>
                    {"Rp " + Math.round(result.profit).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-center text-xs" style={{ color: colors.textMuted }}>
                {"Dari taruhan Rp " +
                  Math.round(betAmount > 0 ? betAmount : 0).toLocaleString("id-ID") +
                  " untuk " +
                  selectedPicks.length +
                  " pick"}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Available Picks */}
        <h2 className="mb-4 text-lg font-bold" style={{ color: colors.text }}>
          Available Picks
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {picks.map((pick, index) => (
            <motion.div
              key={pick.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="rounded-xl border p-4 transition-all hover:shadow-md"
              style={{
                backgroundColor: colors.surface,
                borderColor: pick.selected ? colors.primary : colors.border,
                borderWidth: pick.selected ? 2 : 1,
                opacity: pick.selected ? 1 : 0.85,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className="truncate text-sm font-semibold"
                    style={{ color: colors.text }}
                  >
                    {pick.match}
                  </p>
                  <span
                    className="mt-1.5 inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
                    style={{
                      backgroundColor: pick.selected ? colors.primary : colors.background,
                      color: pick.selected ? colors.background : colors.textMuted,
                      border: "1px solid " + (pick.selected ? colors.primary : colors.border),
                    }}
                  >
                    {pick.pick}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span
                    className="text-base font-bold"
                    style={{ color: colors.secondary }}
                  >
                    {pick.odds.toFixed(2)}
                  </span>
                  <button
                    onClick={() => togglePick(pick.id)}
                    className="flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-semibold transition-all hover:scale-105"
                    style={{
                      borderColor: pick.selected ? colors.primary : colors.border,
                      backgroundColor: pick.selected ? colors.primary : colors.background,
                      color: pick.selected ? colors.background : colors.text,
                    }}
                  >
                    {pick.selected ? (
                      <>
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3" />
                        Pick
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

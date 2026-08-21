"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, RotateCcw, Swords } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";

interface Team {
  name: string;
  logo: string;
  league: string;
}

interface Matchup {
  id: number;
  home: Team;
  away: Team;
  homeFormation: string;
  awayFormation: string;
}

const TEAMS: Team[] = [
  // European top clubs
  { name: "Manchester City", logo: "⚽", league: "Premier League" },
  { name: "Liverpool", logo: "🔴", league: "Premier League" },
  { name: "Arsenal", logo: "🔫", league: "Premier League" },
  { name: "Chelsea", logo: "🔵", league: "Premier League" },
  { name: "Manchester United", logo: "😈", league: "Premier League" },
  { name: "Tottenham Hotspur", logo: "🐓", league: "Premier League" },
  { name: "Real Madrid", logo: "🏆", league: "La Liga" },
  { name: "Barcelona", logo: "🎯", league: "La Liga" },
  { name: "Atletico Madrid", logo: "🐻", league: "La Liga" },
  { name: "Sevilla", logo: "⚪", league: "La Liga" },
  { name: "Bayern Munich", logo: "🍺", league: "Bundesliga" },
  { name: "Borussia Dortmund", logo: "🐝", league: "Bundesliga" },
  { name: "Bayer Leverkusen", logo: "💊", league: "Bundesliga" },
  { name: "Inter Milan", logo: "🐍", league: "Serie A" },
  { name: "AC Milan", logo: "👹", league: "Serie A" },
  { name: "Juventus", logo: "🦓", league: "Serie A" },
  { name: "Napoli", logo: "🌋", league: "Serie A" },
  { name: "Paris Saint-Germain", logo: "🗼", league: "Ligue 1" },
  { name: "Olympique Marseille", logo: "⚓", league: "Ligue 1" },
  { name: "Ajax Amsterdam", logo: "🛡️", league: "Eredivisie" },
  { name: "FC Porto", logo: "🐉", league: "Primeira Liga" },
  { name: "Benfica", logo: "🦅", league: "Primeira Liga" },
  // Indonesian clubs
  { name: "Persija Jakarta", logo: "👑", league: "Liga Indonesia" },
  { name: "Persib Bandung", logo: "🐺", league: "Liga Indonesia" },
  { name: "Bali United", logo: "🌴", league: "Liga Indonesia" },
  { name: "Arema FC", logo: "🦁", league: "Liga Indonesia" },
  { name: "Persebaya Surabaya", logo: "🦈", league: "Liga Indonesia" },
  { name: "PSM Makassar", logo: "🐠", league: "Liga Indonesia" },
  { name: "Persis Solo", logo: "🗡️", league: "Liga Indonesia" },
  { name: "Dewa United", logo: "😇", league: "Liga Indonesia" },
  { name: "Madura United", logo: "🐃", league: "Liga Indonesia" },
  { name: "Borneo FC", logo: "🐬", league: "Liga Indonesia" },
];

const FORMATIONS = [
  "4-3-3",
  "4-4-2",
  "3-5-2",
  "4-2-3-1",
  "3-4-3",
  "5-3-2",
  "4-1-4-1",
];

function pickRandomFormation(): string {
  return FORMATIONS[Math.floor(Math.random() * FORMATIONS.length)];
}

export default function GeneratorBolaPage() {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);
  const colors = theme.colors;

  const [matchup, setMatchup] = useState<Matchup | null>(null);
  const [history, setHistory] = useState<Matchup[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);

  const generateMatchup = useCallback(() => {
    const firstIndex = Math.floor(Math.random() * TEAMS.length);
    let secondIndex = Math.floor(Math.random() * TEAMS.length);
    while (secondIndex === firstIndex) {
      secondIndex = Math.floor(Math.random() * TEAMS.length);
    }
    const newMatchup: Matchup = {
      id: Date.now(),
      home: TEAMS[firstIndex],
      away: TEAMS[secondIndex],
      homeFormation: pickRandomFormation(),
      awayFormation: pickRandomFormation(),
    };
    setMatchup(newMatchup);
    setTotalMatches((prev) => prev + 1);
    setHistory((prev) => [newMatchup, ...prev].slice(0, 10));
  }, []);

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
            <Dices className="h-4 w-4" />
            Random Match Generator
          </div>
          <h1
            className="text-3xl font-bold tracking-tight md:text-4xl"
            style={{ color: colors.text }}
          >
            Generator Bola
          </h1>
          <p className="mt-2 text-sm md:text-base" style={{ color: colors.textMuted }}>
            Acak dua tim dan lihat siapa yang akan bertanding satu sama lain
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 flex items-center justify-center gap-3"
        >
          <div
            className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
              color: colors.text,
            }}
          >
            <Swords className="h-4 w-4" style={{ color: colors.accent }} />
            Total Pertandingan:{" "}
            <span style={{ color: colors.primary }}>{totalMatches}</span>
          </div>
        </motion.div>

        {/* Generate button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-10 flex justify-center gap-3"
        >
          {!matchup ? (
            <button
              onClick={generateMatchup}
              className="inline-flex items-center gap-2 rounded-xl px-8 py-3 text-base font-bold transition-transform hover:scale-105 active:scale-95"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
                boxShadow: "0 0 24px " + colors.glow + "55",
              }}
            >
              <Dices className="h-5 w-5" />
              Generate
            </button>
          ) : (
            <button
              onClick={generateMatchup}
              className="inline-flex items-center gap-2 rounded-xl px-8 py-3 text-base font-bold transition-transform hover:scale-105 active:scale-95"
              style={{
                backgroundColor: colors.secondary,
                color: colors.text,
                boxShadow: "0 0 24px " + colors.glow + "55",
              }}
            >
              <RotateCcw className="h-5 w-5" />
              Regenerate
            </button>
          )}
        </motion.div>

        {/* Matchup display */}
        <div className="mb-12 min-h-[220px]">
          <AnimatePresence mode="wait">
            {matchup ? (
              <motion.div
                key={matchup.id}
                initial={{ opacity: 0, rotateY: 90, y: 40 }}
                animate={{ opacity: 1, rotateY: 0, y: 0 }}
                exit={{ opacity: 0, rotateY: -90, y: -40 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6"
              >
                {/* Home team card */}
                <motion.div
                  initial={{ x: -60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="rounded-xl border p-5 text-right md:p-6"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    boxShadow: "0 0 20px " + colors.glow + "33",
                  }}
                >
                  <div className="mb-3 text-5xl md:text-6xl">{matchup.home.logo}</div>
                  <span
                    className="mb-2 inline-block rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide md:text-xs"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.background,
                    }}
                  >
                    {matchup.home.league}
                  </span>
                  <p
                    className="text-lg font-bold leading-tight md:text-2xl"
                    style={{ color: colors.text }}
                  >
                    {matchup.home.name}
                  </p>
                  <p
                    className="mt-2 inline-block rounded-lg border px-3 py-1 text-xs font-bold md:text-sm"
                    style={{
                      borderColor: colors.border,
                      color: colors.secondary,
                      backgroundColor: colors.background,
                    }}
                  >
                    Formasi {matchup.homeFormation}
                  </p>
                </motion.div>

                {/* VS */}
                <motion.div
                  animate={{ scale: [1, 1.18, 1] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                  className="flex h-14 w-14 items-center justify-center rounded-full border-2 md:h-20 md:w-20"
                  style={{
                    borderColor: colors.accent,
                    backgroundColor: colors.background,
                    boxShadow: "0 0 30px " + colors.glow + "66",
                  }}
                >
                  <span
                    className="text-lg font-black italic md:text-2xl"
                    style={{ color: colors.accent }}
                  >
                    VS
                  </span>
                </motion.div>

                {/* Away team card */}
                <motion.div
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="rounded-xl border p-5 md:p-6"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    boxShadow: "0 0 20px " + colors.glow + "33",
                  }}
                >
                  <div className="mb-3 text-5xl md:text-6xl">{matchup.away.logo}</div>
                  <span
                    className="mb-2 inline-block rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide md:text-xs"
                    style={{
                      backgroundColor: colors.secondary,
                      color: colors.background,
                    }}
                  >
                    {matchup.away.league}
                  </span>
                  <p
                    className="text-lg font-bold leading-tight md:text-2xl"
                    style={{ color: colors.text }}
                  >
                    {matchup.away.name}
                  </p>
                  <p
                    className="mt-2 inline-block rounded-lg border px-3 py-1 text-xs font-bold md:text-sm"
                    style={{
                      borderColor: colors.border,
                      color: colors.secondary,
                      backgroundColor: colors.background,
                    }}
                  >
                    Formasi {matchup.awayFormation}
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16"
                style={{ borderColor: colors.border }}
              >
                <Dices
                  className="mb-4 h-12 w-12 animate-bounce"
                  style={{ color: colors.primary }}
                />
                <p className="text-sm" style={{ color: colors.textMuted }}>
                  Tekan Generate untuk mengacak pertandingan
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2
            className="mb-4 flex items-center gap-2 text-xl font-bold"
            style={{ color: colors.text }}
          >
            <Swords className="h-5 w-5" style={{ color: colors.primary }} />
            Riwayat Pertandingan
          </h2>

          {history.length === 0 ? (
            <div
              className="rounded-xl border border-dashed py-10 text-center text-sm"
              style={{ borderColor: colors.border, color: colors.textMuted }}
            >
              Belum ada riwayat pertandingan.
            </div>
          ) : (
            <div className="grid gap-3">
              <AnimatePresence initial={false}>
                {history.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-3"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.home.logo}</span>
                      <span className="font-semibold" style={{ color: colors.text }}>
                        {item.home.name}
                      </span>
                      <span
                        className="mx-1 text-xs font-black italic"
                        style={{ color: colors.accent }}
                      >
                        VS
                      </span>
                      <span className="font-semibold" style={{ color: colors.text }}>
                        {item.away.name}
                      </span>
                      <span className="text-xl">{item.away.logo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-md px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.secondary,
                          border: "1px solid " + colors.border,
                        }}
                      >
                        {item.homeFormation} vs {item.awayFormation}
                      </span>
                      <span
                        className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase"
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.background,
                        }}
                      >
                        {item.home.league === item.away.league
                          ? item.home.league
                          : item.home.league + " / " + item.away.league}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

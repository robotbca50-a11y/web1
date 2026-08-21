"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Filter, CheckCircle2 } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";

interface Schedule {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  date: string;
  time: string;
  venue: string;
  status: "live" | "upcoming" | "finished";
  score: string | null;
}

const SAMPLE_SCHEDULES: Schedule[] = [
  {
    id: 1,
    homeTeam: "Manchester City",
    awayTeam: "Arsenal",
    league: "Premier League",
    date: "Jumat, 21 Agu 2026",
    time: "21:00 WIB",
    venue: "Etihad Stadium",
    status: "live",
    score: "2 - 1",
  },
  {
    id: 2,
    homeTeam: "Real Madrid",
    awayTeam: "Sevilla",
    league: "La Liga",
    date: "Jumat, 21 Agu 2026",
    time: "23:30 WIB",
    venue: "Santiago Bernabeu",
    status: "live",
    score: "1 - 0",
  },
  {
    id: 3,
    homeTeam: "Inter Milan",
    awayTeam: "Juventus",
    league: "Serie A",
    date: "Jumat, 21 Agu 2026",
    time: "02:45 WIB",
    venue: "San Siro",
    status: "finished",
    score: "3 - 2",
  },
  {
    id: 4,
    homeTeam: "Persija Jakarta",
    awayTeam: "Persib Bandung",
    league: "Liga Indonesia",
    date: "Jumat, 21 Agu 2026",
    time: "19:00 WIB",
    venue: "Gelora Bung Karno",
    status: "finished",
    score: "0 - 0",
  },
  {
    id: 5,
    homeTeam: "Liverpool",
    awayTeam: "Chelsea",
    league: "Premier League",
    date: "Sabtu, 22 Agu 2026",
    time: "22:00 WIB",
    venue: "Anfield",
    status: "upcoming",
    score: null,
  },
  {
    id: 6,
    homeTeam: "Barcelona",
    awayTeam: "Atletico Madrid",
    league: "La Liga",
    date: "Sabtu, 22 Agu 2026",
    time: "23:30 WIB",
    venue: "Spotify Camp Nou",
    status: "upcoming",
    score: null,
  },
  {
    id: 7,
    homeTeam: "AC Milan",
    awayTeam: "Napoli",
    league: "Serie A",
    date: "Sabtu, 22 Agu 2026",
    time: "01:45 WIB",
    venue: "San Siro",
    status: "live",
    score: "2 - 1",
  },
  {
    id: 8,
    homeTeam: "Bali United",
    awayTeam: "Persis Solo",
    league: "Liga Indonesia",
    date: "Sabtu, 22 Agu 2026",
    time: "20:00 WIB",
    venue: "Kapten I Wayan Dipta",
    status: "upcoming",
    score: null,
  },
  {
    id: 9,
    homeTeam: "Tottenham Hotspur",
    awayTeam: "Manchester United",
    league: "Premier League",
    date: "Minggu, 23 Agu 2026",
    time: "23:00 WIB",
    venue: "Tottenham Hotspur Stadium",
    status: "upcoming",
    score: null,
  },
  {
    id: 10,
    homeTeam: "Villarreal",
    awayTeam: "Athletic Bilbao",
    league: "La Liga",
    date: "Minggu, 23 Agu 2026",
    time: "01:30 WIB",
    venue: "Estadio de la Ceramica",
    status: "finished",
    score: "1 - 2",
  },
  {
    id: 11,
    homeTeam: "AS Roma",
    awayTeam: "Lazio",
    league: "Serie A",
    date: "Minggu, 23 Agu 2026",
    time: "02:45 WIB",
    venue: "Stadio Olimpico",
    status: "upcoming",
    score: null,
  },
  {
    id: 12,
    homeTeam: "Persib Bandung",
    awayTeam: "Arema FC",
    league: "Liga Indonesia",
    date: "Minggu, 23 Agu 2026",
    time: "19:00 WIB",
    venue: "Si Jalak Harupat",
    status: "upcoming",
    score: null,
  },
  {
    id: 13,
    homeTeam: "Newcastle United",
    awayTeam: "Aston Villa",
    league: "Premier League",
    date: "Senin, 24 Agu 2026",
    time: "22:00 WIB",
    venue: "St James Park",
    status: "upcoming",
    score: null,
  },
  {
    id: 14,
    homeTeam: "Real Sociedad",
    awayTeam: "Valencia",
    league: "La Liga",
    date: "Senin, 24 Agu 2026",
    time: "00:30 WIB",
    venue: "Reale Arena",
    status: "finished",
    score: "2 - 2",
  },
  {
    id: 15,
    homeTeam: "Atalanta",
    awayTeam: "Fiorentina",
    league: "Serie A",
    date: "Senin, 24 Agu 2026",
    time: "01:45 WIB",
    venue: "Gewiss Stadium",
    status: "finished",
    score: "4 - 1",
  },
];

const STATUS_FILTERS = [
  { value: "all", label: "Semua" },
  { value: "live", label: "Live" },
  { value: "upcoming", label: "Akan Datang" },
  { value: "finished", label: "Selesai" },
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number]["value"];

const DATES = ["Semua", ...Array.from(new Set(SAMPLE_SCHEDULES.map((s) => s.date)))];

function StatusIndicator({
  status,
  mutedColor,
}: {
  status: Schedule["status"];
  mutedColor: string;
}) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-500">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        LIVE
      </span>
    );
  }
  if (status === "finished") {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs font-medium"
        style={{ color: mutedColor }}
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Selesai
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium"
      style={{ color: mutedColor }}
    >
      <Clock className="h-3.5 w-3.5" />
      Akan Datang
    </span>
  );
}

export default function JadwalPage() {
  const [activeDate, setActiveDate] = useState<string>("Semua");
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all");

  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);
  const colors = theme.colors;

  const filtered = SAMPLE_SCHEDULES.filter(
    (s) =>
      (activeDate === "Semua" || s.date === activeDate) &&
      (activeStatus === "all" || s.status === activeStatus)
  );

  const grouped = filtered.reduce<Record<string, Schedule[]>>((acc, match) => {
    if (!acc[match.date]) acc[match.date] = [];
    acc[match.date].push(match);
    return acc;
  }, {});

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
            <Calendar className="h-4 w-4" />
            Kalender Sepak Bola
          </div>
          <h1
            className="text-3xl font-bold tracking-tight md:text-4xl"
            style={{ color: colors.text }}
          >
            Jadwal Pertandingan
          </h1>
          <p className="mt-2 text-sm md:text-base" style={{ color: colors.textMuted }}>
            Jadwal lengkap pertandingan dari liga top Eropa &amp; Indonesia
          </p>
        </motion.div>

        {/* Date filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-4 flex flex-wrap justify-center gap-2"
        >
          {DATES.map((date) => {
            const isActive = activeDate === date;
            return (
              <button
                key={date}
                onClick={() => setActiveDate(date)}
                className="rounded-full border px-4 py-2 text-sm font-medium transition-all hover:scale-105"
                style={{
                  borderColor: isActive ? colors.primary : colors.border,
                  backgroundColor: isActive ? colors.primary : colors.surface,
                  color: isActive ? colors.background : colors.text,
                }}
              >
                {date}
              </button>
            );
          })}
        </motion.div>

        {/* Status filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-2"
        >
          <span
            className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide"
            style={{ color: colors.textMuted }}
          >
            <Filter className="h-3.5 w-3.5" />
            Status
          </span>
          {STATUS_FILTERS.map((filter) => {
            const isActive = activeStatus === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => setActiveStatus(filter.value)}
                className="rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all hover:scale-105"
                style={{
                  borderColor: isActive ? colors.accent : colors.border,
                  backgroundColor: isActive ? colors.accent : colors.surface,
                  color: isActive ? colors.background : colors.text,
                }}
              >
                {filter.label}
              </button>
            );
          })}
        </motion.div>

        {/* Schedule groups */}
        <div className="grid gap-10">
          {Object.entries(grouped).map(([date, matches], groupIndex) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: groupIndex * 0.08 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <h2
                  className="text-lg font-bold tracking-tight"
                  style={{ color: colors.secondary }}
                >
                  {date}
                </h2>
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: colors.border }}
                />
                <span
                  className="rounded-full border px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    borderColor: colors.border,
                    color: colors.textMuted,
                  }}
                >
                  {matches.length} laga
                </span>
              </div>

              <div className="grid gap-4">
                {matches.map((match, index) => {
                  const isLive = match.status === "live";
                  return (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.06 }}
                      className="rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: isLive ? "#ef4444" : colors.border,
                        borderWidth: isLive ? 1.5 : 1,
                        boxShadow: isLive ? "0 0 12px rgba(239, 68, 68, 0.15)" : undefined,
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
                          <span>{match.time}</span>
                        </div>
                      </div>

                      {/* Teams vs score */}
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <p
                          className="text-right font-semibold"
                          style={{ color: colors.text }}
                        >
                          {match.homeTeam}
                        </p>

                        <div
                          className="flex min-w-[80px] flex-col items-center gap-1.5 rounded-lg border px-3 py-2"
                          style={{
                            borderColor: isLive ? "#ef4444" : colors.border,
                            backgroundColor: colors.background,
                          }}
                        >
                          {match.score ? (
                            <span
                              className="text-lg font-bold tabular-nums"
                              style={{ color: isLive ? "#ef4444" : colors.text }}
                            >
                              {match.score}
                            </span>
                          ) : (
                            <span
                              className="text-sm font-bold"
                              style={{ color: colors.textMuted }}
                            >
                              VS
                            </span>
                          )}
                          <StatusIndicator
                            status={match.status}
                            mutedColor={colors.textMuted}
                          />
                        </div>

                        <p
                          className="font-semibold"
                          style={{ color: colors.text }}
                        >
                          {match.awayTeam}
                        </p>
                      </div>

                      {/* Venue */}
                      <div
                        className="mt-4 flex items-center justify-center gap-1.5 text-xs"
                        style={{ color: colors.textMuted }}
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{match.venue}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p
            className="py-16 text-center text-sm"
            style={{ color: colors.textMuted }}
          >
            Tidak ada pertandingan untuk filter ini.
          </p>
        )}
      </div>
    </div>
  );
}

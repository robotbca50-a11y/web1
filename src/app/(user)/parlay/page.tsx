"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Plus, Trash2, Info, Zap } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";

interface ParlayRow {
  id: number;
  odds: number;
  hasil: number;
}

const RESULT_OPTIONS: { label: string; value: number }[] = [
  { label: "Menang Full", value: 1 },
  { label: "Menang \u00bd", value: 0.5 },
  { label: "Kalah \u00bd", value: -0.5 },
  { label: "Seri", value: 0 },
];

function calcOx(odds: number, hasil: number): number {
  if (hasil === 1) return odds;
  if (hasil === 0.5) return ((odds - 1) / 2) + 1;
  if (hasil === -0.5) return 0.5;
  return 1;
}

function createRow(id: number): ParlayRow {
  return { id, odds: 1.5, hasil: 1 };
}

export default function ParlayPage() {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);
  const colors = theme.colors;

  const [rows, setRows] = useState<ParlayRow[]>([
    createRow(1),
    createRow(2),
    createRow(3),
  ]);
  const [nextId, setNextId] = useState(4);
  const [betAmount, setBetAmount] = useState<number>(100000);
  const [showCatatan, setShowCatatan] = useState(false);
  const [showRumus, setShowRumus] = useState(false);

  const updateRow = (id: number, patch: Partial<ParlayRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const addRow = () => {
    setRows((prev) => [...prev, createRow(nextId)]);
    setNextId((n) => n + 1);
  };

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const totalOdds = rows.reduce(
    (acc, r) => acc * calcOx(r.odds || 0, r.hasil),
    1
  );
  const stake = betAmount > 0 ? betAmount : 0;
  const hasilKemenangan = stake * totalOdds - stake;

  return (
    <div
      className="min-h-screen px-4 py-8 md:px-8"
      style={{ backgroundColor: colors.background }}
    >
      <div className="mx-auto max-w-3xl">
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
            Kalkulator Parlay
          </div>
          <h1
            className="text-3xl font-bold tracking-tight md:text-4xl"
            style={{ color: colors.text }}
          >
            Parlay Calculator
          </h1>
          <p className="mt-2 text-sm md:text-base" style={{ color: colors.textMuted }}>
            Masukkan odds dan hasil tiap partai untuk menghitung total odds &amp; kemenanganmu
          </p>
        </motion.div>

        {/* Rows Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 rounded-xl border p-5"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="flex items-center gap-2 text-lg font-bold"
              style={{ color: colors.text }}
            >
              <Zap className="h-5 w-5" style={{ color: colors.primary }} />
              Daftar Partai
              <span
                className="rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                }}
              >
                {rows.length}
              </span>
            </h2>
          </div>

          <div className="grid gap-3">
            {rows.map((row, index) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-lg border p-3"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: colors.textMuted }}
                  >
                    Partai {index + 1}
                  </span>
                  <button
                    onClick={() => removeRow(row.id)}
                    className="rounded-md p-1.5 transition-all hover:scale-110 hover:opacity-70"
                    style={{
                      border: "1px solid " + colors.border,
                      color: colors.accent,
                    }}
                    aria-label={"Hapus partai " + (index + 1)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div
                    className="flex items-center gap-2 rounded-lg border px-3 py-2 sm:w-36"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: colors.surface,
                    }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: colors.textMuted }}
                    >
                      Odds
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={row.odds}
                      onChange={(e) =>
                        updateRow(row.id, { odds: Number(e.target.value) })
                      }
                      className="w-full bg-transparent text-sm font-semibold outline-none"
                      style={{ color: colors.text }}
                      placeholder="1.50"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {RESULT_OPTIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex cursor-pointer items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-80"
                        style={{ color: colors.text }}
                      >
                        <input
                          type="radio"
                          name={"hasil-" + row.id}
                          checked={row.hasil === opt.value}
                          onChange={() => updateRow(row.id, { hasil: opt.value })}
                          style={{ accentColor: colors.primary }}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>

                  <div className="sm:ml-auto sm:text-right">
                    <p
                      className="text-[11px] uppercase tracking-wide"
                      style={{ color: colors.textMuted }}
                    >
                      Odds Efektif
                    </p>
                    <p
                      className="text-sm font-bold"
                      style={{ color: colors.secondary }}
                    >
                      {calcOx(row.odds || 0, row.hasil).toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={addRow}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{
              borderColor: colors.border,
              color: colors.primary,
              backgroundColor: colors.background,
            }}
          >
            <Plus className="h-4 w-4" />
            Tambah Partai
          </button>
        </motion.div>

        {/* Bet Amount */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-6 rounded-xl border p-5"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <label
            className="mb-2 block text-sm font-semibold"
            style={{ color: colors.text }}
          >
            Jumlah Taruhan (Rp)
          </label>
          <div
            className="flex items-center gap-2 rounded-lg border px-3 py-2.5"
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
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="w-full bg-transparent text-sm font-semibold outline-none"
              style={{ color: colors.text }}
              placeholder="Masukkan jumlah taruhan"
            />
          </div>
        </motion.div>

        {/* Result */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-6 rounded-xl border p-5"
          style={{
            borderColor: colors.primary,
            backgroundColor: colors.surface,
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="text-center">
              <p
                className="text-xs uppercase tracking-wide"
                style={{ color: colors.textMuted }}
              >
                Total Odds
              </p>
              <p className="text-2xl font-bold" style={{ color: colors.secondary }}>
                {totalOdds.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p
                className="text-xs uppercase tracking-wide"
                style={{ color: colors.textMuted }}
              >
                Hasil Kemenangan
              </p>
              <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                {"Rp " + Math.round(hasilKemenangan).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Catatan */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mb-4 overflow-hidden rounded-xl border"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <button
            onClick={() => setShowCatatan((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-opacity hover:opacity-80"
          >
            <span
              className="flex items-center gap-2 text-sm font-bold"
              style={{ color: colors.text }}
            >
              <Info className="h-4 w-4" style={{ color: colors.primary }} />
              Catatan
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: colors.textMuted }}
            >
              {showCatatan ? "\u25B2" : "\u25BC"}
            </span>
          </button>
          {showCatatan && (
            <div
              className="border-t px-5 py-4 text-sm leading-relaxed"
              style={{ borderColor: colors.border, color: colors.textMuted }}
            >
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Menang Full: pick menang penuh, odds dihitung utuh.</li>
                <li>Menang \u00bd (half win / HDP): odds dihitung setengah.</li>
                <li>Kalah \u00bd (half lose / HDP): nilai odds menjadi 0.5.</li>
                <li>Seri (push / void): nilai odds menjadi 1 (netral).</li>
                <li>Total odds adalah hasil perkalian seluruh odds efektif tiap partai.</li>
              </ul>
            </div>
          )}
        </motion.div>

        {/* Rumus */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="overflow-hidden rounded-xl border"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <button
            onClick={() => setShowRumus((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-opacity hover:opacity-80"
          >
            <span
              className="flex items-center gap-2 text-sm font-bold"
              style={{ color: colors.text }}
            >
              <Calculator className="h-4 w-4" style={{ color: colors.primary }} />
              Rumus
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: colors.textMuted }}
            >
              {showRumus ? "\u25B2" : "\u25BC"}
            </span>
          </button>
          {showRumus && (
            <div
              className="space-y-2 border-t px-5 py-4 font-mono text-xs leading-relaxed"
              style={{ borderColor: colors.border, color: colors.textMuted }}
            >
              <p>Menang Full : ox = odds</p>
              <p>Menang \u00bd : ox = ((odds - 1) / 2) + 1</p>
              <p>Kalah \u00bd : ox = 0.5</p>
              <p>Seri : ox = 1</p>
              <p>Total Odds = ox\u2081 \u00D7 ox\u2082 \u00D7 ... \u00D7 ox\u2099</p>
              <p>Hasil Kemenangan = (bet \u00D7 Total Odds) - bet</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

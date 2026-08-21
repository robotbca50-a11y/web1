"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, Copy, ZoomIn, ZoomOut, RotateCcw, X } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";

const TOGEL_GUIDES = [
  { label: "1.1 Cara Bet 4D 3D 2D", url: "https://i.imgur.com/sAT9he1.png" },
  { label: "1.2 Cara Bet BB", url: "https://i.imgur.com/4uosxH1.png" },
  { label: "1.3 Cara Bet BBFS (BB Campuran)", url: "https://i.imgur.com/fzw0OQl.png" },
  { label: "1.4 Cara Bet Angka Tarung", url: "https://i.imgur.com/uctIKzf.png" },
  { label: "1.5 Cara Bet Fast 4D", url: "https://i.imgur.com/Q50jW4e.png" },
  { label: "1.6 Cara Bet 4D, 3D, 2D Easy", url: "https://i.imgur.com/XHfBtfL.png" },
  { label: "1.7 Cara Bet 3D", url: "https://i.imgur.com/uJFQarG.png" },
  { label: "1.8 Cara Bet 2D Belakang", url: "https://i.imgur.com/7gyU5lO.png" },
  { label: "1.9 Cara Bet 2D Depan", url: "https://i.imgur.com/Wh9LLZH.png" },
  { label: "2.0 Cara Bet 2D Tengah", url: "https://i.imgur.com/3HjkZCu.png" },
  { label: "2.1 Cara Bet Colok Bebas", url: "https://i.imgur.com/a4NHaIk.png" },
  { label: "2.2 Cara Bet Colok Bebas 2D", url: "https://i.imgur.com/qtxc3tv.png" },
  { label: "2.3 Cara Bet Colok Naga", url: "https://i.imgur.com/JNCWCqu.png" },
  { label: "2.4 Pengertian Colok Jitu", url: "https://i.imgur.com/n39qLYT.png" },
  { label: "2.5 Cara Bermain Tengah Tepi", url: "https://i.imgur.com/E54ZOyy.png" },
  { label: "2.6 Bet Togel Menu Dasar", url: "https://i.imgur.com/gBLLJlh.png" },
  { label: "2.7 Bet Togel 50-50", url: "https://i.imgur.com/fT8OwHk.png" },
  { label: "2.8 Cara Betting Shio", url: "https://i.imgur.com/XUmmNBE.png" },
  { label: "2.9 Silang Homo", url: "https://i.imgur.com/jW3gHDi.png" },
  { label: "3.0 Kembang Kempis", url: "https://i.imgur.com/1ZG3LGW.png" },
  { label: "3.1 Kombinasi", url: "https://i.imgur.com/p6wPJon.png" },
];

const BOLA_TABS = [
  {
    id: "hcp",
    label: "Handicap",
    color: "#818cf8",
    title: "PANDUAN HANDICAP (HDP)",
    pengertian: "Handicap adalah sistem taruhan di mana tim yang diunggulkan memberikan fur/voran kepada tim yang lebih lemah. Nilai fur bervariasi seperti 0.5, 1, 1.5, dst.",
    contohJudul: "Real Madrid -1.5 vs Barcelona",
    contohBody: "Real Madrid harus menang selisih 2 gol atau lebih.\nJika bet Rp100.000 pada Real Madrid -1.5 (odds 1.90):\n✓ Menang: Rp100.000 × 1.90 = Rp190.000\n✗ Kalah: Rp100.000 (jika Real Madrid menang 1 gol / imbang / kalah)",
    tips: "Perhatikan kondisi tim, head-to-head, dan fur yang diberikan. Jika fur terlalu besar, pertimbangkan untuk bet di sisi yang diunggulkan.",
  },
  {
    id: "ou",
    label: "Besar/Kecil",
    color: "#22c55e",
    title: "PANDUAN OVER/UNDER (OU)",
    pengertian: "Over/Under adalah taruhan menebak jumlah gol lebih (Over) atau kurang (Under) dari pasaran yang ditentukan. Contoh: Over/Under 2.5 gol.",
    contohJudul: "Liverpool vs Chelsea — Over/Under 2.5",
    contohBody: "Pasaran menetapkan garis 2.5 gol.\nJika bet Rp100.000 pada Over 2.5 (odds 1.85):\n✓ Menang: minimal 3 gol tercipta. Rp100.000 × 1.85 = Rp185.000\n✗ Kalah: 2 gol atau kurang = kehilangan Rp100.000",
    tips: "Lihat rata-rata gol kedua tim. Jika kedua tim memiliki pertahanan kuat, pertimbangkan Under. Jika kedua tim agresif, Over lebih masuk akal.",
  },
  {
    id: "ox2",
    label: "1X2",
    color: "#38bdf8",
    title: "PANDUAN 1X2",
    pengertian: "1X2 adalah taruhan memilih hasil akhir pertandingan:\n1 = Home Menang | X = Seri | 2 = Away Menang\nTidak ada fur, murni menebak siapa pemenangnya.",
    contohJudul: "Bayern Munich vs Dortmund",
    contohBody: "Odds: 1 = 1.60 | X = 4.20 | 2 = 5.50\nJika bet Rp100.000 pada 1 (Bayern Menang) odds 1.60:\n✓ Menang: Rp100.000 × 1.60 = Rp160.000\n✗ Kalah: jika Bayern seri atau kalah",
    tips: "Odds rendah = peluang menang tinggi tapi keuntungan kecil. Odds tinggi = peluang kecil tapi hasil besar. Sesuaikan dengan analisis Anda.",
  },
  {
    id: "ml",
    label: "Moneyline",
    color: "#f59e0b",
    title: "PANDUAN MONEYLINE (ML)",
    pengertian: "Moneyline adalah taruhan pemenang langsung tanpa handicap. Cocok untuk pertandingan dengan selisih kekuatan jelas antara kedua tim.",
    contohJudul: "Manchester City vs Bournemouth",
    contohBody: "Moneyline: City 1.15 | Bournemouth 15.00\nJika bet Rp100.000 pada Manchester City odds 1.15:\n✓ Menang: Rp100.000 × 1.15 = Rp115.000 (untung Rp15.000)\n✗ Kalah: jika City seri atau kalah\n\nJika bet Rp100.000 pada Bournemouth odds 15.00:\n✓ Menang: Rp100.000 × 15.00 = Rp1.500.000\n✗ Kalah: jika Bournemouth seri atau kalah",
    tips: "Moneyline cocok untuk pertandingan dengan favorit jelas. Tim favorit odds rendah memberikan keuntungan kecil tapi peluang tinggi.",
  },
];

export default function PanduanPage() {
  const [selectedGuide, setSelectedGuide] = useState("");
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalScale, setModalScale] = useState(1);
  const [bolaTab, setBolaTab] = useState("hcp");
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  const activeBola = BOLA_TABS.find((t) => t.id === bolaTab) || BOLA_TABS[0];

  const handleCopy = async () => {
    if (!selectedGuide) return;
    try {
      const r = await fetch(selectedGuide);
      const b = await r.blob();
      if (navigator.clipboard && navigator.clipboard.write) {
        await navigator.clipboard.write([new ClipboardItem({ [b.type]: b })]);
      }
    } catch {
      const a = document.createElement("a");
      a.href = selectedGuide;
      a.download = "panduan-betting.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Togel Section */}
      <div className="text-center mb-6">
        <h1
          className="text-2xl font-extrabold uppercase tracking-widest"
          style={{ color: theme.colors.primary, textShadow: `0 0 20px ${theme.colors.primary}30` }}
        >
          Gambar Cara Betting Togel
        </h1>
        <p className="text-sm mt-1" style={{ color: theme.colors.textMuted }}>
          Panduan lengkap cara melakukan betting togel
        </p>
      </div>

      <div
        className="text-center py-2.5 mb-5 rounded-lg overflow-hidden whitespace-nowrap text-xs font-bold uppercase tracking-widest"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}15, ${theme.colors.primary}05)`,
          border: `1px solid ${theme.colors.primary}25`,
          color: theme.colors.primary,
        }}
      >
        SELAMAT DATANG DI PANDUAN BETTING TOGEL | PANDUAN LENGKAP CARA BETTING TOGEL
      </div>

      <div className="text-center mb-5">
        <div className="relative inline-block w-full max-w-[600px]">
          <select
            value={selectedGuide}
            onChange={(e) => {
              setSelectedGuide(e.target.value);
              setImgLoading(true);
              setImgError(false);
            }}
            className="w-full appearance-none cursor-pointer outline-none text-sm font-semibold py-3 px-5 rounded-xl"
            style={{
              background: theme.colors.surface,
              color: theme.colors.text,
              border: `2px solid ${theme.colors.primary}30`,
            }}
          >
            <option value="">-- Pilih Panduan --</option>
            {TOGEL_GUIDES.map((g) => (
              <option key={g.url} value={g.url}>
                {g.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: theme.colors.primary }}
          />
        </div>
      </div>

      {selectedGuide && (
        <div className="text-center mb-4">
          <div
            className="relative inline-block max-w-full mb-4 overflow-hidden rounded-xl"
            style={{ border: `2px solid ${theme.colors.primary}25`, boxShadow: `0 0 30px ${theme.colors.primary}10` }}
          >
            {imgLoading && (
              <div className="flex items-center justify-center py-20">
                <div
                  className="w-8 h-8 border-3 rounded-full animate-spin"
                  style={{ borderColor: `${theme.colors.primary}30`, borderTopColor: theme.colors.primary }}
                />
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedGuide}
              alt="Panduan Betting"
              className="max-w-full block cursor-zoom-in"
              style={{ display: imgLoading ? "none" : "block" }}
              onLoad={() => setImgLoading(false)}
              onError={() => { setImgLoading(false); setImgError(true); }}
              onClick={() => { setModalOpen(true); setModalScale(1); }}
            />
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide transition-transform hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
              color: theme.colors.background,
            }}
          >
            <Copy size={16} /> Salin Gambar
          </button>
          <p className="text-xs mt-3" style={{ color: theme.colors.textMuted }}>
            Klik gambar untuk memperbesar | Scroll atau gunakan zoom
          </p>
        </div>
      )}

      {imgError && (
        <p className="text-center text-sm py-8" style={{ color: theme.colors.accent }}>
          Gagal memuat gambar.
        </p>
      )}

      {/* Zoom Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setModalOpen(false)}
        >
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-50"
          >
            <X size={24} />
          </button>
          <div className="absolute top-4 left-4 flex gap-2 z-50">
            <button onClick={(e) => { e.stopPropagation(); setModalScale((s) => Math.min(5, s * 1.3)); }} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
              <ZoomIn size={18} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setModalScale((s) => Math.max(0.5, s / 1.3)); }} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
              <ZoomOut size={18} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setModalScale(1); }} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
              <RotateCcw size={18} />
            </button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedGuide}
            alt="Zoom"
            className="max-h-[90vh] max-w-[90vw] cursor-grab"
            style={{ transform: `scale(${modalScale})`, transition: "transform 0.2s" }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Bola Section */}
      <div
        className="rounded-xl overflow-hidden mt-10"
        style={{ border: `1px solid ${theme.colors.primary}20` }}
      >
        <div className="text-center py-5" style={{ background: `${theme.colors.surface}` }}>
          <h2
            className="text-xl font-extrabold uppercase tracking-widest"
            style={{ color: theme.colors.primary }}
          >
            ⚽ Cara Betting Bola
          </h2>
          <p className="text-xs mt-1" style={{ color: theme.colors.textMuted }}>
            Panduan lengkap cara melakukan betting bola online
          </p>
        </div>

        <div
          className="text-center py-2.5 text-xs font-bold uppercase tracking-widest"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.primary}10, ${theme.colors.primary}03)`,
            border: `1px solid ${theme.colors.primary}20`,
            color: theme.colors.primary,
          }}
        >
          PANDUAN BETTING BOLA | HANDICAP • OVER/UNDER • 1X2 • MONEYLINE
        </div>

        <div className="flex overflow-x-auto" style={{ borderBottom: `2px solid ${theme.colors.primary}15` }}>
          {BOLA_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setBolaTab(tab.id)}
              className="px-5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all relative"
              style={{
                color: bolaTab === tab.id ? tab.color : theme.colors.textMuted,
                background: "none",
                border: "none",
                borderBottom: bolaTab === tab.id ? `2px solid ${tab.color}` : "2px solid transparent",
                marginBottom: "-2px",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5" style={{ background: `${theme.colors.background}80` }}>
          <div className="text-center mb-4">
            <span
              className="inline-block px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{
                background: `${activeBola.color}18`,
                border: `1px solid ${activeBola.color}30`,
                color: activeBola.color,
              }}
            >
              {activeBola.title}
            </span>
          </div>
          <div className="text-sm leading-relaxed space-y-4" style={{ color: theme.colors.text }}>
            <div
              className="p-4 rounded-lg"
              style={{ background: `${activeBola.color}06`, borderLeft: `3px solid ${activeBola.color}` }}
            >
              <div className="font-bold text-xs mb-1.5" style={{ color: activeBola.color }}>
                📖 Pengertian
              </div>
              <div style={{ color: theme.colors.textMuted }}>{activeBola.pengertian}</div>
            </div>
            <div
              className="p-4 rounded-lg"
              style={{ background: `${theme.colors.primary}06`, borderLeft: `3px solid ${theme.colors.primary}` }}
            >
              <div className="font-bold text-xs mb-1.5" style={{ color: theme.colors.primary }}>
                ✅ Contoh Taruhan — Rp100,000
              </div>
              <div style={{ color: theme.colors.textMuted }}>
                <strong style={{ color: theme.colors.text }}>{activeBola.contohJudul}</strong>
                <br />
                {activeBola.contohBody.split("\n").map((line, i) => (
                  <span key={i}>
                    {line.startsWith("✓") ? (
                      <span style={{ color: "#86efac" }}>{line}</span>
                    ) : line.startsWith("✗") ? (
                      <span style={{ color: "#fca5a5" }}>{line}</span>
                    ) : (
                      line
                    )}
                    <br />
                  </span>
                ))}
              </div>
            </div>
            <div
              className="p-4 rounded-lg"
              style={{ background: "#f59e0b08", borderLeft: "3px solid #f59e0b" }}
            >
              <div className="font-bold text-xs mb-1.5" style={{ color: "#f59e0b" }}>
                💡 Tips
              </div>
              <div style={{ color: theme.colors.textMuted }}>{activeBola.tips}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

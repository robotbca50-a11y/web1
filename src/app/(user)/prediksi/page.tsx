"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Clock, Copy, Sparkles, Download } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";

const MARKETS = [
  "HOKI DRAW",
  "TOTO MACAU PAGI",
  "TOTO MACAU SIANG",
  "TOTO MACAU SORE",
  "TOTO MACAU MALAM I",
  "TOTO MACAU MALAM II",
  "TOTO MACAU MALAM III",
  "KENTUCKY MID",
  "KENTUCKY EVE",
  "FLORIDA MID",
  "FLORIDA EVE",
  "HUAHIN 0100",
  "HUAHIN 1630",
  "HUAHIN 2100",
  "BANGKOK 0130",
  "BANGKOK 0930",
  "NEW YORK MID",
  "NEW YORK EVE",
  "CAROLINA DAY",
  "CAROLINA EVE",
  "BRUNEI 02",
  "BRUNEI 14",
  "BRUNEI 21",
  "OREGON",
  "BULLSEYE",
  "TOTOCAMBODIA",
  "SYDNEY",
  "CALIFORNIA",
  "PCSO",
  "POIPET",
  "KING KONG4D I",
  "KING KONG4D II",
  "SINGAPORE",
  "MAGNUM4D",
  "TOTOMALI",
  "BANGKOK 0930",
  "NEVADA",
  "HONGKONG",
];

const LOGO_MAP: Record<string, string> = {
  HOKIDRAW: "https://cdn.areabermain.club/assets/cdn/az4/2024/12/25/20241225/1de5162dbfea7a85f41b654a2c3a4d07/logo-1.png",
  TOTOMACAU: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/033094b5e73f842fcbcc3b235c029e7c/macau-logo.png",
  KENTUCKY: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/ae8e720c8b7d930856cf3f364cc10158/kentucky-eve.png",
  FLORIDA: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/801479ca02e15020fac8df0024814152/florida-eve-new-2.png",
  HUAHIN: "https://huahinlottery.com/assets/img/logo.png",
  BANGKOK: "https://bangkokpoolstoday.com/assets/img/bangkokpools_logo.png",
  NEWYORK: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/1f9a654060201e07442bc78def1bc135/new-york-eve.png",
  CAROLINA: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/816329e82e136b1e9faad6d14c8c81bc/carolina-day-pools-jpg.png",
  BRUNEI: "https://bruneipools.com/assets/img/brunei-logo.png",
  OREGON: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/7715823646164db9d67d280a402dfb51/oregon-jpg.png",
  CALIFORNIA: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/c89c3a35f7323e90e2e2c5c255bdb7ae/california-pools-jpg.png",
  TOTOCAMBODIA: "https://totocambodialive.com/assets/img/logo.png",
  CHELSEA: "https://chelseapools.co.uk/assets/img/chelseaPools_logo.png",
  POIPET: "https://poipetlottery.com/img/logo.png",
  BULLSEYE: "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/f07d4e2a6517ef1cea9e2a897e4abb98/nz-bullseye.png",
  SYDNEY: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/1d9ba1f974240b7b5c5e48fa2ef98e0e/sydney-2.png",
  TOTOMALI: "https://totomali.com/assets/img/logo.svg",
  KINGKONG: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/32f87d6c932b0d2eee9b6e1c9028ab41/logo-2.png",
  SINGAPORE: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/ae20d56fcb2d0dea6b0ae637c6bed566/singapore-new.png",
  MAGNUM4D: "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/8889f1c5fc738b5148145100c08a0ebc/439-4390693-magnum-pengeluaran-magnum-4d-hari-clipart-removebg-preview.png",
  PCSO: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/a67d9fd134f7211cbe08bd89bd64f79d/pcso-2.png",
  NEVADA: "https://www.nevadalottery.us/images/logo.gif",
  HONGKONG: "https://cdn.animaapp.com/projects/66be29ddeca4d2e95aa7b4ce/releases/66be3e204d8f7eb28bb5de15/img/hongkong-lotto-1.png",
};

const SHIO = ["Tikus","Kerbau","Macan","Kelinci","Naga","Ular","Kuda","Kambing","Monyet","Ayam","Anjing","Babi"];

function rand(n: number): number { return Math.floor(Math.random() * n); }
function randDigit(): string { return String(rand(10)); }
function randDigits(len: number): string { return Array.from({ length: len }, () => randDigit()).join(""); }

function generatePrediksi(market: string) {
  const bbfs = randDigits(7);
  const angkaIkut = randDigits(5);
  const d4 = Array.from({ length: 5 }, () => randDigits(4)).join(" / ");
  const d3 = Array.from({ length: 4 }, () => randDigits(3)).join(" / ");
  const d2 = Array.from({ length: 10 }, () => randDigits(2)).join(" / ");
  const colokBebas = `${randDigit()} / ${randDigit()}`;
  const colokMacau = `${randDigits(2)} / ${randDigits(2)} / ${randDigits(2)}`;
  const twinNum = randDigits(2);
  const twin = `${twinNum} / ${twinNum}`;
  const shio = `${SHIO[rand(12)]} / ${SHIO[rand(12)]} / ${SHIO[rand(12)]}`;

  const now = new Date();
  const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const tanggal = `${String(now.getDate()).padStart(2, "0")} ${months[now.getMonth()]} ${now.getFullYear()}`;

  return { market, tanggal, bbfs, angkaIkut, d4, d3, d2, colokBebas, colokMacau, twin, shio };
}

function getLogo(market: string): string | null {
  const key = market.replace(/\s+/g, "").toUpperCase();
  for (const [k, v] of Object.entries(LOGO_MAP)) {
    if (key.includes(k)) return v;
  }
  return null;
}

interface PrediksiResult {
  market: string;
  tanggal: string;
  bbfs: string;
  angkaIkut: string;
  d4: string;
  d3: string;
  d2: string;
  colokBebas: string;
  colokMacau: string;
  twin: string;
  shio: string;
}

export default function PrediksiPage() {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);
  const [market, setMarket] = useState(MARKETS[0]);
  const [result, setResult] = useState<PrediksiResult | null>(null);
  const [copying, setCopying] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const generate = useCallback(() => {
    setResult(generatePrediksi(market));
  }, [market]);

  const copyAsImage = useCallback(async () => {
    if (!resultRef.current) return;
    setCopying(true);
    try {
      const text = resultRef.current.innerText;
      if (text) await navigator.clipboard.writeText(text);
    } catch {
      // silent
    }
    setCopying(false);
  }, []);

  const rows = result ? [
    { label: "Tanggal", value: result.tanggal },
    { label: "BBFS Kuat", value: result.bbfs },
    { label: "Angka Ikut", value: result.angkaIkut },
    { label: "4D (BB)", value: result.d4 },
    { label: "3D (BB)", value: result.d3 },
    { label: "2D (BB)", value: result.d2 },
    { label: "Colok Bebas", value: result.colokBebas },
    { label: "Colok Macau", value: result.colokMacau },
    { label: "Twin", value: result.twin },
    { label: "SHIO", value: result.shio },
  ] : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{ backgroundColor: `${theme.colors.primary}22`, color: theme.colors.primary, border: `1px solid ${theme.colors.primary}44` }}>
              <Target size={14} /> TOGEL PREDICTION
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: theme.colors.text, fontFamily: "'Cinzel', serif" }}>
              Prediksi Angka Togel
            </h1>
            <p style={{ color: theme.colors.textMuted }}>Generate prediksi BBFS, angka ikut, 4D/3D/2D, colok, dan shio</p>
          </div>

          <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.textMuted }}>Pilih Pasaran</label>
                <select value={market} onChange={(e) => setMarket(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: theme.colors.background, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}>
                  {MARKETS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <button onClick={generate}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:scale-105"
                style={{ backgroundColor: theme.colors.primary }}>
                <Sparkles size={16} /> Generate
              </button>
            </div>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="flex justify-end gap-2 mb-4">
                  <button onClick={copyAsImage} disabled={copying}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ backgroundColor: `${theme.colors.primary}22`, color: theme.colors.primary, border: `1px solid ${theme.colors.primary}44` }}>
                    {copying ? <Clock size={14} className="animate-spin" /> : <Download size={14} />}
                    {copying ? "Copying..." : "Salin Gambar"}
                  </button>
                  <button onClick={() => { navigator.clipboard.writeText(resultRef.current?.innerText || ""); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ backgroundColor: `${theme.colors.accent}22`, color: theme.colors.accent, border: `1px solid ${theme.colors.accent}44` }}>
                    <Copy size={14} /> Salin Teks
                  </button>
                </div>

                <div ref={resultRef} className="rounded-xl overflow-hidden" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
                  <div className="p-6 text-center" style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                    {getLogo(result.market) && (
                      <img src={getLogo(result.market)!} alt={result.market} className="h-16 mx-auto mb-3 object-contain" />
                    )}
                    <h2 className="text-xl font-bold" style={{ color: theme.colors.text, fontFamily: "'Cinzel', serif" }}>
                      {result.market}
                    </h2>
                    <p className="text-sm mt-1 flex items-center justify-center gap-1" style={{ color: theme.colors.textMuted }}>
                      <Clock size={12} /> {result.tanggal}
                    </p>
                  </div>
                  <div className="divide-y" style={{ borderColor: theme.colors.border }}>
                    {rows.map((row, i) => (
                      <div key={i} className="flex items-center px-6 py-3" style={i % 2 === 0 ? { backgroundColor: `${theme.colors.background}88` } : {}}>
                        <span className="w-32 text-sm font-medium" style={{ color: theme.colors.textMuted }}>{row.label}</span>
                        <span className="flex-1 text-sm font-mono font-bold" style={{ color: theme.colors.primary }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { Gift, ChevronDown, Calculator, RotateCcw } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";

const MARKET_LOGOS: Record<string, string> = {
  "HOKI DRAW": "https://cdn.areabermain.club/assets/cdn/az4/2024/12/25/20241225/1de5162dbfea7a85f41b654a2c3a4d07/logo-1.png",
  BANGKOK: "https://bangkokpoolstoday.com/assets/img/bangkokpools_logo.png",
  BRUNEI: "https://bruneipools.com/assets/img/brunei-logo.png",
  BULLSEYE: "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/f07d4e2a6517ef1cea9e2a897e4abb98/nz-bullseye.png",
  CALIFORNIA: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/c89c3a35f7323e90e2e2c5c255bdb7ae/california-pools-jpg.png",
  "CAROLINA DAY": "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/816329e82e136b1e9faad6d14c8c81bc/carolina-day-pools-jpg.png",
  "CAROLINA EVE": "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/799cce2ab08aca8bfb3a4a9c7484d78e/carolina-eve-jpg.png",
  CHELSEA: "https://chelseapools.co.uk/assets/img/chelseaPools_logo.png",
  "FLORIDA EVE": "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/801479ca02e15020fac8df0024814152/florida-eve-new-2.png",
  "FLORIDA MID": "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/1ffa2459adcc8330fa8874792d59eb1a/florida-mid.png",
  HONGKONG: "https://cdn.animaapp.com/projects/66be29ddeca4d2e95aa7b4ce/releases/66be3e204d8f7eb28bb5de15/img/hongkong-lotto-1.png",
  HUAHIN: "https://huahinlottery.com/assets/img/logo.png",
  "KENTUCKY EVE": "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/ae8e720c8b7d930856cf3f364cc10158/kentucky-eve.png",
  "KENTUCKY MID": "https://kentuckymid.com/wp-content/uploads/2022/07/KENTUCKY-MID.png",
  MAGNUM4D: "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/8889f1c5fc738b5148145100c08a0ebc/439-4390693-magnum-pengeluaran-magnum-4d-hari-clipart-removebg-preview.png",
  NEVADA: "https://www.nevadalottery.us/images/logo.gif",
  "NEW YORK EVE": "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/1f9a654060201e07442bc78def1bc135/new-york-eve.png",
  "NEW YORK MID": "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/7fb415d09885f1a79bfc30b48803cc4d/new-york-mid.png",
  OREGON: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/7715823646164db9d67d280a402dfb51/oregon-jpg.png",
  PCSO: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/a67d9fd134f7211cbe08bd89bd64f79d/pcso-2.png",
  POIPET: "https://poipetlottery.com/img/logo.png",
  SINGAPORE: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/ae20d56fcb2d0dea6b0ae637c6bed566/singapore-new.png",
  SYDNEY: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/1d9ba1f974240b7b5c5e48fa2ef98e0e/sydney-2.png",
  TOTOMALI: "https://totomali.com/assets/img/logo.svg",
  "TOTO MACAU 4D": "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/033094b5e73f842fcbcc3b235c029e7c/macau-logo.png",
  KINGKONG: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/32f87d6c932b0d2eee9b6e1c9028ab41/logo-2.png",
  "TOTO CAMBODIA": "https://totocambodialive.com/assets/img/logo.png",
};

type GameItem = { title?: string; hadiah?: number; diskon?: number; kei?: number };

const KEI_MINUS: Record<string, boolean> = {
  "silang homo": true,
  "50 - 50": true,
  "tengah tepi": true,
  "kembang - kempis - kembar": true,
  "dasar ganjil - besar": true,
};
const KEI_PLUS: Record<string, boolean> = {
  "dasar genap - kecil": true,
};

function norm(s: string) {
  return String(s || "").replace(/\s+/g, " ").trim().toLowerCase();
}
function idr(n: number) {
  return Number(n || 0).toLocaleString("id-ID");
}

function prizeBlock(p14: number, p13: number, p12: number, p24: number, p23: number, p22: number, p34: number, p33: number, p32: number) {
  return {
    "PRIZE 1 - 4D": { hadiah: p14, diskon: 0 },
    "PRIZE 1 - 3D": { hadiah: p13, diskon: 0 },
    "PRIZE 1 - 2D": { hadiah: p12, diskon: 0 },
    "PRIZE 2 - 4D": { hadiah: p24, diskon: 0 },
    "PRIZE 2 - 3D": { hadiah: p23, diskon: 0 },
    "PRIZE 2 - 2D": { hadiah: p22, diskon: 0 },
    "PRIZE 3 - 4D": { hadiah: p34, diskon: 0 },
    "PRIZE 3 - 3D": { hadiah: p33, diskon: 0 },
    "PRIZE 3 - 2D": { hadiah: p32, diskon: 0 },
  };
}

const BASE_MAP: Record<string, { hadiah?: number; diskon?: number; kei?: number }> = {
  "DISKON 4D": { hadiah: 3000, diskon: 66.5 },
  "DISKON 3D": { hadiah: 400, diskon: 59.5 },
  "DISKON 2D": { hadiah: 70, diskon: 29.5 },
  "DISKON 2D DEPAN": { hadiah: 65, diskon: 29.5 },
  "DISKON 2D TENGAH": { hadiah: 65, diskon: 29.5 },
  "BET FULL 4D": { hadiah: 10000, diskon: 0 },
  "BET FULL 3D": { hadiah: 1000, diskon: 0 },
  "BET FULL 2D": { hadiah: 100, diskon: 0 },
  "4D TEPAT": { hadiah: 4000 },
  "4D BB": { hadiah: 200 },
  "3D TEPAT": { hadiah: 400 },
  "3D BB": { hadiah: 100 },
  "2D TEPAT": { hadiah: 70 },
  "2D BB": { hadiah: 20 },
  "COLOK BEBAS ( 1 DIGIT )": { hadiah: 1.5, diskon: 6 },
  "COLOK BEBAS ( 2 DIGIT )": { hadiah: 3, diskon: 6 },
  "COLOK BEBAS ( 3 DIGIT )": { hadiah: 4.5, diskon: 6 },
  "COLOK BEBAS ( 4 DIGIT )": { hadiah: 6, diskon: 6 },
  "COLOK JITU": { hadiah: 8, diskon: 6 },
  "COLOK BEBAS 2D ( 2 DIGIT )": { hadiah: 7, diskon: 10 },
  "COLOK BEBAS 2D ( 3 DIGIT )": { hadiah: 11, diskon: 10 },
  "COLOK BEBAS 2D ( 4 DIGIT )": { hadiah: 18, diskon: 10 },
  "COLOK NAGA ( 3 DIGIT )": { hadiah: 23, diskon: 10 },
  "COLOK NAGA ( 4 DIGIT )": { hadiah: 35, diskon: 10 },
  SHIO: { hadiah: 9.5, diskon: 5 },
  "50 - 50": { kei: -3, diskon: 2 },
  "TENGAH TEPI": { kei: -3, diskon: 2 },
  "SILANG HOMO": { kei: -3, diskon: 2 },
  "KEMBANG - KEMPIS - KEMBAR": { kei: -3, diskon: 2 },
  KOMBINASI: { hadiah: 2.6, diskon: 8 },
  "DASAR GANJIL - BESAR": { kei: -25, diskon: 2 },
  "DASAR GENAP - KECIL": { kei: 10, diskon: 2 },
};

const PB = prizeBlock(6500, 650, 70, 2100, 210, 20, 1100, 110, 8);

function buildMarketConfig(name: string): { prize: boolean; map: Record<string, GameItem> } {
  const m: Record<string, GameItem> = {};
  for (const k in BASE_MAP) m[k] = { ...BASE_MAP[k] };

  if (name === "KINGKONG") {
    m["DISKON 4D"] = { hadiah: 6000, diskon: 33 };
    m["DISKON 3D"] = { hadiah: 700, diskon: 24 };
    m["DISKON 2D"] = { hadiah: 80, diskon: 15 };
  }
  if (name === "TOTOMALI") {
    m["DISKON 4D"] = { hadiah: 3000, diskon: 67 };
    m["DISKON 3D"] = { hadiah: 400, diskon: 57 };
    m["DISKON 2D"] = { hadiah: 70, diskon: 27 };
    delete m["DISKON 2D DEPAN"];
    delete m["DISKON 2D TENGAH"];
    m["COLOK BEBAS ( 1 DIGIT )"] = { hadiah: 1.6, diskon: 6 };
    m["COLOK BEBAS ( 2 DIGIT )"] = { hadiah: 3.2, diskon: 6 };
    m["COLOK BEBAS ( 3 DIGIT )"] = { hadiah: 4.8, diskon: 6 };
    m["COLOK BEBAS ( 4 DIGIT )"] = { hadiah: 6.4, diskon: 6 };
    m["COLOK JITU"] = { hadiah: 8.3, diskon: 6 };
    m["COLOK BEBAS 2D ( 2 DIGIT )"] = { hadiah: 7, diskon: 10 };
    m["COLOK BEBAS 2D ( 3 DIGIT )"] = { hadiah: 13, diskon: 10 };
    m["COLOK BEBAS 2D ( 4 DIGIT )"] = { hadiah: 21, diskon: 10 };
    m["COLOK NAGA ( 3 DIGIT )"] = { hadiah: 27, diskon: 10 };
    m["COLOK NAGA ( 4 DIGIT )"] = { hadiah: 41, diskon: 10 };
    m["SHIO"] = { hadiah: 10, diskon: 5 };
  }
  if (name === "HOKI DRAW") {
    const h: Record<string, GameItem> = {
      "DISKON 5D": { hadiah: 50000, diskon: 38 },
      "DISKON 4D": { hadiah: 7000, diskon: 20 },
      "DISKON 3D": { hadiah: 750, diskon: 20 },
      "DISKON 2D": { hadiah: 75, diskon: 20 },
      "BET FULL 5D": { hadiah: 88000 },
      "BET FULL 4D": { hadiah: 10000 },
      "BET FULL 3D": { hadiah: 1000 },
      "BET FULL 2D": { hadiah: 100 },
      "5D TEPAT": { hadiah: 50000 },
      "5D BB": { hadiah: 350 },
      "4D TEPAT": { hadiah: 5000 },
      "4D BB": { hadiah: 180 },
      "3D TEPAT": { hadiah: 500 },
      "3D BB": { hadiah: 75 },
      "2D TEPAT": { hadiah: 80 },
      "2D BB": { hadiah: 15 },
      "COLOK BEBAS ( 1 DIGIT )": { hadiah: 0.9, diskon: 6 },
      "COLOK BEBAS ( 2 DIGIT )": { hadiah: 1.8, diskon: 6 },
      "COLOK BEBAS ( 3 DIGIT )": { hadiah: 2.7, diskon: 6 },
      "COLOK BEBAS ( 4 DIGIT )": { hadiah: 3.6, diskon: 6 },
      "COLOK BEBAS ( 5 DIGIT )": { hadiah: 4.5, diskon: 6 },
      "COLOK JITU": { hadiah: 8, diskon: 6 },
      "COLOK BEBAS 2D ( 2 DIGIT )": { hadiah: 4, diskon: 10 },
      "COLOK BEBAS 2D ( 3 DIGIT )": { hadiah: 6, diskon: 10 },
      "COLOK BEBAS 2D ( 4 DIGIT )": { hadiah: 20, diskon: 10 },
      "COLOK BEBAS 2D ( 5 DIGIT )": { hadiah: 200, diskon: 10 },
      "COLOK BEBAS 4D ( 4 DIGIT )": { hadiah: 50, diskon: 10 },
      "COLOK BEBAS 4D ( 5 DIGIT )": { hadiah: 200, diskon: 10 },
      "COLOK NAGA ( 3 DIGIT )": { hadiah: 12, diskon: 10 },
      "COLOK NAGA ( 4 DIGIT )": { hadiah: 30, diskon: 10 },
      "COLOK NAGA ( 5 DIGIT )": { hadiah: 125, diskon: 10 },
      SHIO: { hadiah: 9.5, diskon: 5 },
      "50 - 50": { kei: -2.2, diskon: 2 },
      KOMBINASI: { hadiah: 2.7, diskon: 8 },
      "TENGAH TEPI": { kei: -2.2, diskon: 2 },
      "DASAR GANJIL - BESAR": { kei: -25, diskon: 2 },
      "DASAR GENAP - KECIL": { kei: 10, diskon: 2 },
    };
    return { prize: false, map: h };
  }

  const hasPrize = !["BULLSEYE", "CALIFORNIA", "CAROLINA EVE", "CAROLINA DAY", "FLORIDA EVE", "FLORIDA MID", "KENTUCKY EVE", "KENTUCKY MID", "NEW YORK EVE", "NEW YORK MID", "OREGON", "PCSO"].includes(name);
  if (hasPrize) {
    for (const pk in PB) m[pk] = { ...(PB as Record<string, GameItem>)[pk] };
  }
  return { prize: hasPrize, map: m };
}

const MARKETS = [
  "TOTO MACAU 4D", "KINGKONG", "BANGKOK", "BRUNEI",
  "CHELSEA", "HONGKONG", "HUAHIN", "MAGNUM4D", "NEVADA", "POIPET",
  "SYDNEY", "TOTO CAMBODIA", "BULLSEYE", "CALIFORNIA", "CAROLINA EVE",
  "CAROLINA DAY", "FLORIDA EVE", "FLORIDA MID", "KENTUCKY EVE",
  "KENTUCKY MID", "NEW YORK EVE", "NEW YORK MID", "OREGON", "PCSO",
  "SINGAPORE", "HOKI DRAW", "TOTOMALI",
];

function tagOf(title: string): string {
  const t = norm(title);
  if (t.startsWith("super diskon") || t.startsWith("diskon")) return "diskon";
  if (t.startsWith("bet full")) return "betfull";
  if (t.startsWith("prize")) return "prize";
  if (t.includes("tepat") || /\bbb\b/.test(t)) return "tepatbb";
  return "lain";
}

const TAB_DEFS = [
  { k: "all", label: "SEMUA" },
  { k: "diskon", label: "DISKON" },
  { k: "betfull", label: "BET FULL" },
  { k: "prize", label: "PRIZE 123" },
  { k: "tepatbb", label: "TEPAT & BB" },
  { k: "lain", label: "LAINNYA" },
];

const TAB_TITLES: Record<string, string> = {
  diskon: "Diskon",
  betfull: "Bet Full",
  prize: "Prize 123",
  tepatbb: "Tepat & BB",
  lain: "Lainnya",
};

export default function HadiahPage() {
  const [market, setMarket] = useState("");
  const [filter, setFilter] = useState("all");
  const [values, setValues] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, { bayar: number; menang: number; total: number; showTotal: boolean; steps: string[] } | null>>({});
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  const config = useMemo(() => (market ? buildMarketConfig(market) : null), [market]);

  const items = useMemo(() => {
    if (!config) return [];
    const list: GameItem[] = [];
    for (const k in config.map) {
      list.push({ title: k, ...config.map[k] });
    }
    return list.filter((g) => !!g.title);
  }, [config]);

  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((g) => tagOf(g.title!) === filter);
  }, [items, filter]);

  const groupedItems = useMemo(() => {
    if (filter !== "all") return [{ tag: filter, items: filteredItems }];
    const order = ["diskon", "betfull", "prize", "tepatbb", "lain"];
    return order
      .map((tag) => ({ tag, items: items.filter((g) => tagOf(g.title!) === tag) }))
      .filter((g) => g.items.length > 0);
  }, [items, filteredItems, filter]);

  const calc = (title: string) => {
    const val = parseFloat(values[title] || "0");
    const t = norm(title);
    const isKei = !!KEI_MINUS[t] || !!KEI_PLUS[t];
    if (!val || val <= 0) return;
    const cfg = config?.map[title];
    if (!cfg) return;
    const diskon = cfg.diskon || 0;
    const hadiah = cfg.hadiah || 0;
    const kei = cfg.kei || 0;
    const isMinus = /^(silang homo|50 - 50|tengah tepi|kembang - kempis - kembar|dasar ganjil - besar)$/i.test(t) || kei < 0;

    if (isKei) {
      let bayar: number, menang: number;
      const steps: string[] = [];
      if (isMinus) {
        const pre = val + (val * Math.abs(kei)) / 100;
        bayar = Math.ceil(pre * (1 - diskon / 100));
        menang = Math.round(val);
        steps.push(`1. Modal awal: ${idr(val)}`);
        steps.push(`2. Tambah kei minus: ${idr(val)} + ${Math.abs(kei)}% = ${idr(pre)}`);
        steps.push(`3. Yang dibayar (setelah diskon): ${idr(pre)} - ${diskon}% = ${idr(bayar)}`);
        steps.push(`4. Hadiah jika menang: ${idr(menang)}`);
      } else {
        bayar = Math.round(val * (1 - diskon / 100));
        menang = Math.round(val + (val * kei) / 100);
        steps.push(`1. Modal awal: ${idr(val)}`);
        steps.push(`2. Yang dibayar (setelah diskon): ${idr(val)} - ${diskon}% = ${idr(bayar)}`);
        steps.push(`3. Hadiah jika menang: ${idr(val)} + ${kei}% = ${idr(menang)}`);
      }
      const total = bayar + menang;
      steps.push(`5. Total jika menang: ${idr(bayar)} + ${idr(menang)} = ${idr(total)}`);
      setResults((prev) => ({ ...prev, [title]: { bayar, menang, total, showTotal: true, steps } }));
    } else {
      const bayar = Math.round(val * (1 - diskon / 100));
      const menang = Math.round(val * hadiah);
      const total = bayar + menang;
      const steps = [
        `1. Modal awal: ${idr(val)}`,
        `2. Yang dibayar (setelah diskon): ${idr(val)} - ${diskon}% = ${idr(bayar)}`,
        `3. Hadiah jika menang: ${idr(val)} × ${hadiah} = ${idr(menang)}`,
      ];
      const isColok = /^colok bebas/.test(t);
      const showTotal = isColok || ["colok bebas 2d", "colok bebas 4d", "colok naga", "shio", "kombinasi"].some((x) => t.startsWith(x));
      if (showTotal) steps.push(`4. Total jika menang: ${idr(bayar)} + ${idr(menang)} = ${idr(total)}`);
      setResults((prev) => ({ ...prev, [title]: { bayar, menang, total, showTotal, steps } }));
    }
  };

  const resetCard = (title: string) => {
    setValues((prev) => ({ ...prev, [title]: "" }));
    setResults((prev) => ({ ...prev, [title]: null }));
  };

  const minBet = (title: string) => (tagOf(title) === "lain" ? 1000 : 100);

  const renderCard = (game: GameItem) => {
    const title = game.title || "";
    const t = norm(title);
    const isKei = !!KEI_MINUS[t] || !!KEI_PLUS[t] || game.kei != null;
    const result = results[title];
    const diskon = game.diskon || 0;
    const hadiah = game.hadiah || 0;
    const kei = isKei ? game.kei || 0 : 0;
    const mb = minBet(title);

    return (
      <div
        key={title}
        className="rounded-xl p-4"
        style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}
      >
        <div className="mb-2">
          <h3
            className="font-bold text-sm"
            style={{ color: theme.colors.text, fontSize: norm(title).includes("kembang") ? "13px" : undefined }}
          >
            {title} :
          </h3>
          <div className="text-xs mt-1" style={{ color: theme.colors.textMuted }}>
            {isKei
              ? `Diskon : ${diskon}% | Kei : ${kei >= 0 ? "+" : ""}${kei}%`
              : `Diskon : ${diskon}% | Hadiah : x${hadiah || "-"}`}
          </div>
        </div>

        <div className="flex gap-2 mt-3 mb-3">
          <input
            type="number"
            inputMode="decimal"
            placeholder={`Min: ${idr(mb)}`}
            value={values[title] || ""}
            onChange={(e) => setValues((prev) => ({ ...prev, [title]: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && calc(title)}
            min={mb}
            step="any"
            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: theme.colors.background, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
          />
          <button
            onClick={() => calc(title)}
            className="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0"
            style={{ background: theme.colors.primary, color: theme.colors.background }}
          >
            <Calculator size={14} /> HITUNG
          </button>
          <button
            onClick={() => resetCard(title)}
            className="px-3 py-2 rounded-lg text-xs font-bold shrink-0"
            style={{ background: theme.colors.border, color: theme.colors.text }}
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {result && (
          <div className="space-y-2 mt-2">
            <div className="text-xs p-2.5 rounded-lg" style={{ background: `${theme.colors.primary}10`, color: theme.colors.text }}>
              Yang harus BAYAR : <strong style={{ color: theme.colors.primary }}>{idr(result.bayar)}</strong>
            </div>
            <div className="text-xs p-2.5 rounded-lg" style={{ background: "#22c55e10", color: theme.colors.text }}>
              Jika menang, di bayarkan : <strong style={{ color: "#22c55e" }}>{idr(result.menang)}</strong>
            </div>
            {result.showTotal && (
              <div className="text-xs p-2.5 rounded-lg" style={{ background: "#f59e0b10", color: theme.colors.text }}>
                Total hadiah + modal : <strong style={{ color: "#f59e0b" }}>{idr(result.total)}</strong>
              </div>
            )}
            {result.steps.length > 0 && (
              <div className="mt-2 text-xs space-y-1">
                <div className="font-bold text-xs mb-1" style={{ color: theme.colors.textMuted }}>Cara Perhitungan:</div>
                {result.steps.map((step: string, i: number) => (
                  <div key={i} className="pl-2" style={{ color: theme.colors.textMuted, borderLeft: `2px solid ${theme.colors.primary}30` }}>
                    {step}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: theme.colors.text }}>
          <Gift size={24} style={{ color: theme.colors.primary }} />
          Kalkulator Hadiah Togel
        </h1>
        <p className="text-sm mt-1" style={{ color: theme.colors.textMuted }}>Pilih pasaran dan hitung hadiah taruhan Anda</p>
      </div>

      {/* Market selector */}
      <div className="relative mb-5 max-w-md">
        <select
          value={market}
          onChange={(e) => { setMarket(e.target.value); setFilter("all"); setValues({}); setResults({}); }}
          className="w-full appearance-none cursor-pointer outline-none text-sm font-semibold py-3 px-5 rounded-xl"
          style={{ background: theme.colors.surface, color: theme.colors.text, border: `2px solid ${theme.colors.primary}30` }}
        >
          <option value="">-- Pilih Pasaran --</option>
          {MARKETS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: theme.colors.primary }} />
      </div>

      {/* Market logo */}
      {market && MARKET_LOGOS[market] && (
        <div className="flex justify-center mb-5">
          <div
            className="px-6 py-3 rounded-xl flex items-center justify-center"
            style={{ background: `${theme.colors.surface}`, border: `1px solid ${theme.colors.border}` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MARKET_LOGOS[market]}
              alt={market}
              className="max-h-10 object-contain"
              style={{ filter: `drop-shadow(0 0 6px ${theme.colors.primary}30)` }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      {market && (
        <div className="flex flex-wrap gap-2 mb-5">
          {TAB_DEFS.map((tab) => {
            if (tab.k === "prize" && !config?.prize) return null;
            if (tab.k === "lain" && !items.some((g) => tagOf(g.title!) === "lain")) return null;
            return (
              <button
                key={tab.k}
                onClick={() => setFilter(tab.k)}
                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all"
                style={{
                  background: filter === tab.k ? theme.colors.primary : theme.colors.surface,
                  color: filter === tab.k ? theme.colors.background : theme.colors.textMuted,
                  border: `1px solid ${filter === tab.k ? theme.colors.primary : theme.colors.border}`,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Cards */}
      {!market && (
        <div className="py-20 text-center text-sm" style={{ color: theme.colors.textMuted }}>
          Silakan pilih pasaran di atas.
        </div>
      )}

      {market && groupedItems.length === 0 && (
        <div className="py-12 text-center text-sm" style={{ color: theme.colors.textMuted }}>
          Tidak ada kartu untuk ditampilkan.
        </div>
      )}

      {groupedItems.map((group) => (
        <div key={group.tag} className="mb-6">
          {filter === "all" && (
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.colors.textMuted }}>
                {TAB_TITLES[group.tag] || group.tag}
              </span>
              <div className="h-px flex-1" style={{ background: theme.colors.border }} />
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map(renderCard)}
          </div>
        </div>
      ))}
    </div>
  );
}

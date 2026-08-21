"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Search, ExternalLink, Video } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";

interface Pasaran {
  title: string;
  hari: string;
  tutup: string;
  buka: string;
  website: string;
  live: string | null;
}

const PASARAN: Pasaran[] = [
  { title: "HOKIDRAW", hari: "Senin s/d Minggu", tutup: "RESULT 24X", buka: "1 JAM SEKALI", website: "https://hokidraw.com/", live: "https://dlive.tv/u/HOKIDRAW" },
  { title: "TOTO MACAU PAGI", hari: "Senin s/d Minggu", tutup: "00:00 WIB", buka: "00:15 WIB", website: "https://totomacaunew.us/", live: "https://kick.com/live-ttm4d" },
  { title: "KENTUCKY MIDDAY", hari: "Senin s/d Minggu", tutup: "00:05 WIB", buka: "00:20 WIB", website: "https://www.kylottery.com/apps/", live: null },
  { title: "FLORIDA MIDDAY", hari: "Senin s/d Minggu", tutup: "00:20 WIB", buka: "00:30 WIB", website: "https://floridalottery.com/", live: "https://www.youtube.com/user/floridalottery" },
  { title: "HUAHIN 0100", hari: "Senin s/d Minggu", tutup: "00:45 WIB", buka: "01:00 WIB", website: "https://huahinlottery.com/", live: "https://www.youtube.com/@huahinlottery5727" },
  { title: "BANGKOK 0130", hari: "Senin s/d Minggu", tutup: "01:15 WIB", buka: "01:30 WIB", website: "https://bangkokpoolstoday.com/", live: null },
  { title: "NEWYORK MIDDAY", hari: "Senin s/d Minggu", tutup: "01:15 WIB", buka: "01:25 WIB", website: "https://nylottery.ny.gov/", live: "https://www.youtube.com/@NewYorkLottery/streams" },
  { title: "CAROLINA DAY", hari: "Senin s/d Minggu", tutup: "01:45 WIB", buka: "02:00 WIB", website: "https://www.wral.com/entertainment/lottery/", live: null },
  { title: "BRUNEI 02", hari: "Senin s/d Minggu", tutup: "02:30 WIB", buka: "02:45 WIB", website: "https://bruneipools.com/", live: null },
  { title: "OREGON 03", hari: "Senin s/d Minggu", tutup: "02:50 WIB", buka: "03:00 WIB", website: "https://www.oregonlottery.org/pick-4/winning-numbers/", live: null },
  { title: "OREGON 06", hari: "Senin s/d Minggu", tutup: "05:50 WIB", buka: "06:00 WIB", website: "https://www.oregonlottery.org/pick-4/winning-numbers/", live: null },
  { title: "CALIFORNIA", hari: "Senin s/d Minggu", tutup: "08:25 WIB", buka: "08:30 WIB", website: "https://www.calottery.com/draw-games/daily-4", live: null },
  { title: "FLORIDA EVENING", hari: "Senin s/d Minggu", tutup: "08:35 WIB", buka: "08:45 WIB", website: "https://floridalottery.com/games/draw-games/pick-4", live: "https://www.youtube.com/user/floridalottery" },
  { title: "OREGON 09", hari: "Senin s/d Minggu", tutup: "08:50 WIB", buka: "09:00 WIB", website: "https://www.oregonlottery.org/pick-4/winning-numbers/", live: null },
  { title: "BANGKOK 0930", hari: "Senin s/d Minggu", tutup: "09:15 WIB", buka: "09:30 WIB", website: "https://bangkokpoolstoday.com/", live: null },
  { title: "NEWYORK EVENING", hari: "Senin s/d Minggu", tutup: "09:25 WIB", buka: "09:35 WIB", website: "https://nylottery.ny.gov/", live: "https://www.youtube.com/@NewYorkLottery/streams" },
  { title: "KENTUCKY EVENING", hari: "Senin s/d Minggu", tutup: "09:45 WIB", buka: "10:00 WIB", website: "https://www.kylottery.com/apps/", live: null },
  { title: "CAROLINA EVENING", hari: "Senin s/d Minggu", tutup: "10:17 WIB", buka: "10:22 WIB", website: "https://www.wral.com/entertainment/lottery/", live: null },
  { title: "TOTOCAMBODIA", hari: "Senin s/d Minggu", tutup: "10:45 WIB", buka: "11:00 WIB", website: "https://totocambodialive.com/", live: "https://kick.com/totocambodia" },
  { title: "CHELSEA 11", hari: "Senin s/d Minggu", tutup: "11:00 WIB", buka: "11:15 WIB", website: "https://chelseapools.co.uk/", live: null },
  { title: "OREGON 12", hari: "Senin s/d Minggu", tutup: "11:50 WIB", buka: "12:00 WIB", website: "https://www.oregonlottery.org/pick-4/winning-numbers/", live: null },
  { title: "POIPET12", hari: "Senin s/d Minggu", tutup: "12:15 WIB", buka: "12:30 WIB", website: "https://poipetlottery.com/", live: "https://dlive.tv/PoipetPools" },
  { title: "BULLSEYE", hari: "Senin s/d Minggu", tutup: "13:00 WIB", buka: "13:15 WIB", website: "https://mylotto.co.nz/results/bullseye", live: null },
  { title: "TOTOMACAU SIANG", hari: "Senin s/d Minggu", tutup: "13:00 WIB", buka: "13:15 WIB", website: "https://totomacaunew.us/", live: "https://kick.com/live-ttm4d" },
  { title: "SYDNEY", hari: "Senin s/d Minggu", tutup: "13:49 WIB", buka: "14:05 WIB", website: "https://sydneyfunlotto.net/", live: "https://kick.com/sydney-lotto-official" },
  { title: "BRUNEI 14", hari: "Senin s/d Minggu", tutup: "14:30 WIB", buka: "14:45 WIB", website: "https://bruneipools.com/", live: null },
  { title: "CHELSEA 15", hari: "Senin s/d Minggu", tutup: "15:00 WIB", buka: "15:15 WIB", website: "https://chelseapools.co.uk/", live: null },
  { title: "TOTOMALI 1530", hari: "Senin s/d Minggu", tutup: "15:15 WIB", buka: "15:30 WIB", website: "https://totomali.com/", live: "https://www.youtube.com/@TotoMaliLive" },
  { title: "POIPET15", hari: "Senin s/d Minggu", tutup: "15:15 WIB", buka: "15:30 WIB", website: "https://poipetlottery.com/", live: "https://dlive.tv/PoipetPools" },
  { title: "TOTOMACAU SORE", hari: "Senin s/d Minggu", tutup: "16:00 WIB", buka: "16:15 WIB", website: "https://totomacaunew.us/", live: "https://kick.com/live-ttm4d" },
  { title: "HUAHIN 1630", hari: "Senin s/d Minggu", tutup: "16:15 WIB", buka: "16:30 WIB", website: "https://huahinlottery.com/", live: "https://www.youtube.com/@huahinlottery5727" },
  { title: "KING KONG4D I", hari: "Senin s/d Minggu", tutup: "17:00 WIB", buka: "17:15 WIB", website: "https://kingkongpools.id/", live: "https://kick.com/king-kong-pools" },
  { title: "SINGAPORE", hari: "HARI SELASA & JUM'AT (LIBUR)", tutup: "17:30 WIB", buka: "17:45 WIB", website: "https://www.singaporepools.com.sg/landing/en/Pages/index.html", live: null },
  { title: "MAGNUM4D", hari: "HARI RABU, SABTU & MINGGU", tutup: "18:10 WIB", buka: "18:40 WIB", website: "https://www.magnum4d.my/en", live: null },
  { title: "TOTOMACAU MALAM I", hari: "Senin s/d Minggu", tutup: "19:00 WIB", buka: "19:15 WIB", website: "https://totomacaunew.us/", live: "https://kick.com/live-ttm4d" },
  { title: "CHELSEA 19", hari: "Senin s/d Minggu", tutup: "19:00 WIB", buka: "19:15 WIB", website: "https://chelseapools.co.uk/", live: null },
  { title: "POIPET19", hari: "Senin s/d Minggu", tutup: "19:30 WIB", buka: "19:45 WIB", website: "https://poipetlottery.com/", live: "https://dlive.tv/PoipetPools" },
  { title: "PCSO", hari: "Minggu Libur", tutup: "19:50 WIB", buka: "20:10 WIB", website: "https://www.pcso.gov.ph/", live: "https://www.youtube.com/@PCSOGOVPHOfficial/streams" },
  { title: "TOTOMALI 2030", hari: "Selasa s/d Minggu", tutup: "20:15 WIB", buka: "20:30 WIB", website: "https://totomali.com/", live: "https://www.youtube.com/@TotoMaliLive" },
  { title: "HUAHIN 2100", hari: "Selasa s/d Minggu", tutup: "20:45 WIB", buka: "21:00 WIB", website: "https://huahinlottery.com/", live: "https://www.youtube.com/@huahinlottery5727" },
  { title: "CHELSEA 21", hari: "Senin s/d Minggu", tutup: "21:00 WIB", buka: "21:15 WIB", website: "https://chelseapools.co.uk/", live: null },
  { title: "NEVADA", hari: "Senin s/d Minggu", tutup: "21:15 WIB", buka: "21:30 WIB", website: "https://www.nevadalottery.us/", live: null },
  { title: "BRUNEI 21", hari: "Senin s/d Minggu", tutup: "21:30 WIB", buka: "21:45 WIB", website: "https://bruneipools.com/", live: null },
  { title: "TOTOMACAU MALAM II", hari: "Senin s/d Minggu", tutup: "22:00 WIB", buka: "22:15 WIB", website: "https://totomacaunew.us/", live: "https://kick.com/live-ttm4d" },
  { title: "POIPET22", hari: "Senin s/d Minggu", tutup: "22:30 WIB", buka: "22:45 WIB", website: "https://poipetlottery.com/", live: "https://dlive.tv/PoipetPools" },
  { title: "HONGKONG", hari: "Senin s/d Minggu", tutup: "22:59 WIB", buka: "23:15 WIB", website: "https://hongkongfunlotto.net/", live: "https://kick.com/hongkong-lotto-official" },
  { title: "TOTOMACAU MALAM III", hari: "Senin s/d Minggu", tutup: "23:00 WIB", buka: "23:15 WIB", website: "https://totomacaunew.us/", live: "https://kick.com/live-ttm4d" },
  { title: "TOTOMALI 2330", hari: "Senin s/d Minggu", tutup: "23:15 WIB", buka: "23:30 WIB", website: "https://totomali.com/", live: "https://www.youtube.com/@TotoMaliLive" },
  { title: "KING KONG4D II", hari: "Senin s/d Sabtu", tutup: "23:30 WIB", buka: "23:45 WIB", website: "https://kingkongpools.id/", live: "https://kick.com/king-kong-pools" },
];

const LOGO_MAP: Record<string, string> = {
  HOKIDRAW: "https://cdn.areabermain.club/assets/cdn/az4/2024/12/25/20241225/1de5162dbfea7a85f41b654a2c3a4d07/logo-1.png",
  "TOTO MACAU": "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/033094b5e73f842fcbcc3b235c029e7c/macau-logo.png",
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
  "KING KONG4D": "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/32f87d6c932b0d2eee9b6e1c9028ab41/logo-2.png",
  SINGAPORE: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/ae20d56fcb2d0dea6b0ae637c6bed566/singapore-new.png",
  MAGNUM4D: "https://cdn.areabermain.club/assets/cdn/az4/2024/08/11/20240811/8889f1c5fc738b5148145100c08a0ebc/439-4390693-magnum-pengeluaran-magnum-4d-hari-clipart-removebg-preview.png",
  PCSO: "https://cdn.areabermain.club/assets/cdn/az4/2025/08/18/20250818/a67d9fd134f7211cbe08bd89bd64f79d/pcso-2.png",
  NEVADA: "https://www.nevadalottery.us/images/logo.gif",
  HONGKONG: "https://cdn.animaapp.com/projects/66be29ddeca4d2e95aa7b4ce/releases/66be3e204d8f7eb28bb5de15/img/hongkong-lotto-1.png",
};

type Status = "OPEN" | "LIVE" | "CLOSED";

interface CardState {
  status: Status;
  countdown: string;
  progress: number;
}

function getWibNow(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 7 * 3600000);
}

function parseTutupMinutes(tutup: string): number | null {
  const m = tutup.match(/^(\d{1,2}):(\d{2})\s*WIB$/);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

function getLogo(title: string): string {
  const normalized = title.replace(/\s+/g, "").toUpperCase();
  for (const key of Object.keys(LOGO_MAP)) {
    if (normalized.indexOf(key.replace(/\s+/g, "")) !== -1) {
      return LOGO_MAP[key];
    }
  }
  return "";
}

function getCardState(pasaran: Pasaran, wibNow: Date): CardState {
  const tutupMinutes = parseTutupMinutes(pasaran.tutup);
  if (tutupMinutes === null) {
    return { status: "OPEN", countdown: "--:--:--", progress: 0 };
  }

  const nowMinutes = wibNow.getHours() * 60 + wibNow.getMinutes() + wibNow.getSeconds() / 60;
  let diffMinutes = tutupMinutes - nowMinutes;
  if (diffMinutes <= 0) diffMinutes += 1440;

  const totalSeconds = Math.max(0, Math.floor(diffMinutes * 60));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const status: Status =
    diffMinutes < 2 ? "CLOSED" : diffMinutes < 10 ? "LIVE" : "OPEN";

  const progress = Math.min(100, Math.max(0, ((1440 - diffMinutes) / 1440) * 100));

  return {
    status,
    countdown: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
    progress,
  };
}

export default function JadwalPage() {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const theme = getTheme(currentTheme);
  const [query, setQuery] = useState("");
  const [wibNow, setWibNow] = useState(() => getWibNow());

  useEffect(() => {
    const id = setInterval(() => setWibNow(getWibNow()), 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PASARAN;
    return PASARAN.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.hari.toLowerCase().includes(q)
    );
  }, [query]);

  const statusColor = (status: Status): string => {
    if (status === "OPEN") return theme.colors.primary;
    if (status === "LIVE") return "#ef4444";
    return theme.colors.textMuted;
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1
              className="flex items-center gap-3 text-3xl font-bold tracking-tight"
              style={{ color: theme.colors.text }}
            >
              <Calendar size={32} style={{ color: theme.colors.primary }} />
              Jadwal Togel
            </h1>
            <p className="mt-2 text-sm" style={{ color: theme.colors.textMuted }}>
              Jadwal pasaran togel lengkap dengan countdown waktu WIB
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: theme.colors.textMuted }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari pasaran..."
              className="w-full rounded-lg border py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:ring-2"
              style={{
                background: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((pasaran) => {
            const state = getCardState(pasaran, wibNow ?? new Date(0));
            const color = statusColor(state.status);
            return (
              <div
                key={pasaran.title}
                className="rounded-xl border p-5 transition-transform hover:-translate-y-1"
                style={{
                  background: theme.colors.surface,
                  borderColor: theme.colors.border,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg p-1"
                    style={{ background: theme.colors.background }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getLogo(pasaran.title)}
                      alt={pasaran.title}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2
                      className="truncate text-base font-bold"
                      style={{ color: theme.colors.text }}
                    >
                      {pasaran.title}
                    </h2>
                    <p
                      className="mt-0.5 flex items-center gap-1 truncate text-xs"
                      style={{ color: theme.colors.textMuted }}
                    >
                      <Calendar size={12} />
                      {pasaran.hari}
                    </p>
                  </div>
                  <span
                    className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide"
                    style={{
                      color,
                      background: `${color}1a`,
                      border: `1px solid ${color}55`,
                    }}
                  >
                    {state.status === "LIVE" && (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                      </span>
                    )}
                    {state.status}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span
                      className="flex items-center gap-1.5"
                      style={{ color: theme.colors.textMuted }}
                    >
                      <Clock size={14} />
                      Tutup
                    </span>
                    <span className="font-semibold" style={{ color: theme.colors.text }}>
                      {pasaran.tutup}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="flex items-center gap-1.5"
                      style={{ color: theme.colors.textMuted }}
                    >
                      <Clock size={14} />
                      Buka
                    </span>
                    <span className="font-semibold" style={{ color: theme.colors.text }}>
                      {pasaran.buka}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span style={{ color: theme.colors.textMuted }}>Countdown</span>
                    <span
                      className="font-mono text-sm font-bold tabular-nums"
                      style={{ color }}
                    >
                      {state.countdown}
                    </span>
                  </div>
                  <div
                    className="h-1.5 w-full overflow-hidden rounded-full"
                    style={{ background: theme.colors.border }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${state.progress}%`,
                        background: color,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <a
                    href={pasaran.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold transition-opacity hover:opacity-80"
                    style={{
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                    }}
                  >
                    <ExternalLink size={14} />
                    Website
                  </a>
                  {pasaran.live && (
                    <a
                      href={pasaran.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-opacity hover:opacity-80"
                      style={{
                        background: theme.colors.primary,
                        color: theme.colors.background,
                      }}
                    >
                      <Video size={14} />
                      Live
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p
            className="py-16 text-center text-sm"
            style={{ color: theme.colors.textMuted }}
          >
            Tidak ada pasaran yang cocok dengan &quot;{query}&quot;
          </p>
        )}
      </div>
    </div>
  );
}

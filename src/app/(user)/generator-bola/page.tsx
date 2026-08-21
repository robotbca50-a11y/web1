"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, Swords, Copy, Settings, Eye, Trash2 } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";

const TEAM_LOGOS: Record<string, string> = {
  "MANCHESTER CITY": "https://cdn.simpleicons.org/6CABDD/FFFFFF",
  "LIVERPOOL": "https://cdn.simpleicons.org/C8102E/FFFFFF",
  "ARSENAL": "https://cdn.simpleicons.org/EF0107/FFFFFF",
  "CHELSEA": "https://cdn.simpleicons.org/034694/FFFFFF",
  "MANCHESTER UNITED": "https://cdn.simpleicons.org/DA291C/FFFFFF",
  "TOTTENHAM HOTSPUR": "https://cdn.simpleicons.org/132257/FFFFFF",
  "REAL MADRID": "https://cdn.simpleicons.org/FEBE10/000000",
  "BARCELONA": "https://cdn.simpleicons.org/A50044/000000",
  "ATLETICO MADRID": "https://cdn.simpleicons.org/CB3524/FFFFFF",
  "BAYERN MUNICH": "https://cdn.simpleicons.org/DC052D/FFFFFF",
  "BORUSSIA DORTMUND": "https://cdn.simpleicons.org/FDE100/000000",
  "INTER MILAN": "https://cdn.simpleicons.org/010E80/FFFFFF",
  "AC MILAN": "https://cdn.simpleicons.org/FB090B/FFFFFF",
  "JUVENTUS": "https://cdn.simpleicons.org/000000/FFFFFF",
  "NAPOLI": "https://cdn.simpleicons.org/12A0D7/FFFFFF",
  "PARIS SAINT-GERMAIN": "https://cdn.simpleicons.org/004170/FFFFFF",
  "AJAX": "https://cdn.simpleicons.org/D2122E/FFFFFF",
  "FC PORTO": "https://cdn.simpleicons.org/003893/FFFFFF",
  "BENFICA": "https://cdn.simpleicons.org/E31837/FFFFFF",
};

function generateSVGInitials(name: string): string {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" rx="8" fill="%234B5563"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="18" font-family="Arial" font-weight="bold">${initials}</text></svg>`)}`;
}

function getTeamLogo(name: string): string {
  const upper = name.toUpperCase().trim();
  if (TEAM_LOGOS[upper]) return TEAM_LOGOS[upper];
  return generateSVGInitials(name);
}

function autoPred(m: { team1: string; team2: string; score1: string; score2: string }) {
  const s1 = parseInt(m.score1) || 0;
  const s2 = parseInt(m.score2) || 0;
  const hasScore = m.score1 !== "-" && m.score2 !== "-";
  const total = s1 + s2;
  const diff = Math.abs(s1 - s2);
  const homeWin = s1 > s2;
  const awayWin = s2 > s1;

  let hcp: string;
  let hcpClass: string;
  let hcpNote: string;
  if (!hasScore) {
    hcp = `${m.team1} -0.5`;
    hcpClass = "green";
    hcpNote = "Prediksi Awal";
  } else if (s1 === s2) {
    hcp = "Draw / AH 0";
    hcpClass = "";
    hcpNote = "Imbang ketat";
  } else if (homeWin) {
    hcp = diff >= 2 ? `${m.team1} -${diff - 1}.5` : `${m.team1} -0.5`;
    hcpClass = "green";
    hcpNote = "Home unggul";
  } else {
    hcp = diff >= 2 ? `${m.team2} -${diff - 1}.5` : `${m.team2} -0.5`;
    hcpClass = "green";
    hcpNote = "Away unggul";
  }

  const ouLine = total <= 2 ? "2.5" : total <= 4 ? "3.5" : "4.5";
  const ouSeed = (m.team1 + m.team2).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const ouSide = ouSeed % 2 === 0 ? "Over" : "Under";

  let ox2: string;
  let ox2Class: string;
  if (homeWin) { ox2 = "Home Win"; ox2Class = "green"; }
  else if (awayWin) { ox2 = "Away Win"; ox2Class = "green"; }
  else { ox2 = "Draw"; ox2Class = ""; }

  return {
    hcp, hcpClass, hcpNote,
    ou: `${ouSide} ${ouLine}`,
    ouClass: ouSide === "Over" ? "green" : "red",
    ox2, ox2Class,
    acc: `${m.score1} - ${m.score2}`,
  };
}

function detectCountryFlag(league: string): string {
  const lower = league.toLowerCase();
  const flags: Record<string, string> = {
    "inggris": "gb", "england": "gb", "premier": "gb", "football league": "gb",
    "italia": "it", "italy": "it", "serie a": "it", "copa italia": "it",
    "jerman": "de", "germany": "de", "bundesliga": "de", "dfb pokal": "de",
    "prancis": "fr", "france": "fr", "ligue 1": "fr", "coupe": "fr",
    "spanyol": "es", "spain": "es", "la liga": "es", "copa del rey": "es", "liga mx": "mx",
    "belanda": "nl", "netherlands": "nl", "eredivisie": "nl",
    "jepang": "jp", "japan": "jp", "j league": "jp", "jl1": "jp",
    "korea": "kr", "korea selatan": "kr",
    "arab": "sa", "saudi": "sa",
    "turki": "tr", "turkey": "tr", "super lig": "tr",
    "portugal": "pt", "primeira liga": "pt", "liga portugal": "pt",
    "yunani": "gr", "greece": "gr", "super league": "gr",
    "brasil": "br", "brazil": "br", "brasileirao": "br", "sao paulo": "br", "paulistao": "br",
    "argentina": "ar", "liga prof": "ar",
    "indonesia": "id", "liga 1": "id", "ligaindonesia": "id",
  };
  for (const [key, code] of Object.entries(flags)) {
    if (lower.includes(key)) return code;
  }
  return "xx";
}

interface MatchData {
  league: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  score1: string;
  score2: string;
}

function parseInput(raw: string): MatchData[] {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const matches: MatchData[] = [];
  let currentLeague = "Unknown League";

  for (const line of lines) {
    const vsMatch = line.match(/(.+?)[\s]+(?:vs?|v\.s\.?)[\s]+(.+)/);
    if (vsMatch) {
      const [, teamsPart] = vsMatch;
      let dateStr = "";
      const timeStr = "";
      let team1 = teamsPart.split("vs")[0].trim();
      const team2 = teamsPart.split("vs")[1].trim();
      const dateMatch = team1.match(/^(\d{1,2}[\/.:]\d{1,2})\s+(.+)/);
      if (dateMatch) {
        dateStr = dateMatch[1];
        team1 = dateMatch[2].trim();
      }
      matches.push({
        league: currentLeague,
        team1,
        team2,
        date: dateStr,
        time: timeStr,
        score1: "-",
        score2: "-",
      });
    } else {
      currentLeague = line.replace(/^[-*•]\s*/, "").trim();
    }
  }
  return matches;
}

function generatePreviewHTML(matches: MatchData[], siteName: string, accentColor: string): string {
  let matchCardsHTML = "";
  const leagues = [...new Set(matches.map((m) => m.league))];

  for (const league of leagues) {
    const leagueMatches = matches.filter((m) => m.league === league);
    const flagCode = detectCountryFlag(league);
    matchCardsHTML += `
      <div class="league-box">
        <div class="league-header">
          <img src="https://flagcdn.com/w40/${flagCode}.png" alt="" class="flag" onerror="this.style.display='none'">
          <h2 class="league-title">${league}</h2>
        </div>
        <div class="match-grid">
    `;

    for (const m of leagueMatches) {
      const pred = autoPred(m);
      const homeLogo = getTeamLogo(m.team1);
      const awayLogo = getTeamLogo(m.team2);

      matchCardsHTML += `
        <div class="match-card">
          <div class="teams">
            <div class="team">
              <img src="${homeLogo}" alt="" class="team-logo">
              <span class="team-name">${m.team1}</span>
              <span class="score">${m.score1}</span>
            </div>
            <div class="vs-badge">VS</div>
            <div class="team">
              <img src="${awayLogo}" alt="" class="team-logo">
              <span class="team-name">${m.team2}</span>
              <span class="score">${m.score2}</span>
            </div>
          </div>
          <div class="predictions">
            <div class="pred-row"><span class="pred-label">Handicap</span><span class="pred-val ${pred.hcpClass}">${pred.hcp}</span><span class="pred-note">${pred.hcpNote}</span></div>
            <div class="pred-row"><span class="pred-label">Over/Under</span><span class="pred-val ${pred.ouClass}">${pred.ou}</span></div>
            <div class="pred-row"><span class="pred-label">1X2</span><span class="pred-val ${pred.ox2Class}">${pred.ox2}</span></div>
            <div class="pred-row"><span class="pred-label">Skor Akurat</span><span class="pred-val gold">${pred.acc}</span></div>
          </div>
        </div>
      `;
    }
    matchCardsHTML += `</div></div>`;
  }

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Cinzel:wght@700;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#060b14;color:#e2e8f0;font-family:'Poppins',sans-serif;padding:16px}
.hero{text-align:center;padding:24px 0 16px;border-bottom:1px solid #1e293b;margin-bottom:24px}
.hero h1{font-family:'Cinzel',serif;font-size:28px;font-weight:900;background:linear-gradient(135deg,${accentColor},#FFD700);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:6px}
.hero .sub{color:#94a3b8;font-size:13px}
.hero .date{display:inline-block;margin-top:10px;padding:5px 16px;border-radius:20px;font-size:12px;font-weight:600;background:${accentColor}22;color:${accentColor};border:1px solid ${accentColor}44}
.league-box{margin-bottom:28px}
.league-header{display:flex;align-items:center;gap:10px;margin-bottom:14px;padding:10px 16px;background:#0f1624;border-radius:10px;border-left:3px solid ${accentColor}}
.league-header .flag{width:28px;height:20px;border-radius:3px;object-fit:cover}
.league-title{font-size:16px;font-weight:700;color:#f1f5f9}
.match-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px}
.match-card{background:#0d1520;border:1px solid #1e293b;border-radius:12px;padding:16px;transition:transform .2s}
.match-card:hover{transform:translateY(-2px)}
.teams{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #1e293b}
.team{display:flex;flex-direction:column;align-items:center;flex:1;min-width:0}
.team-logo{width:40px;height:40px;border-radius:50%;object-fit:contain;background:#1e293b;padding:4px;margin-bottom:4px}
.team-name{font-size:12px;font-weight:600;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;color:#e2e8f0}
.score{font-size:20px;font-weight:900;color:#fbbf24;margin-top:2px}
.vs-badge{background:#1e293b;color:#64748b;font-size:11px;font-weight:700;padding:4px 8px;border-radius:6px;flex-shrink:0}
.predictions{display:flex;flex-direction:column;gap:6px}
.pred-row{display:flex;align-items:center;gap:8px;font-size:12px}
.pred-label{width:80px;color:#64748b;font-weight:600;flex-shrink:0}
.pred-val{font-weight:700;font-size:13px}
.pred-val.green{color:#10B981}
.pred-val.red{color:#EF4444}
.pred-val.gold{color:#fbbf24}
.pred-note{color:#94a3b8;font-size:11px;margin-left:auto}
.footer{text-align:center;margin-top:24px;padding-top:16px;border-top:1px solid #1e293b;color:#475569;font-size:11px}
</style>
</head>
<body>
<div class="hero">
  <h1>${siteName || "SPORTS PREDICTION"}</h1>
  <div class="sub">${matches.length} pertandingan · ${leagues.length} liga</div>
  <div class="date">${new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
</div>
${matchCardsHTML}
<div class="footer">Generated by ${siteName || "SPORTS PREDICTION"} · ${new Date().toLocaleDateString("id-ID")}</div>
</body>
</html>`;
}

export default function GeneratorBolaPage() {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);
  const [input, setInput] = useState("");
  const [siteName, setSiteName] = useState("SPORTS PREDICTION");
  const [accentColor, setAccentColor] = useState("#10B981");
  const [showConfig, setShowConfig] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const matches = input.trim() ? parseInput(input) : [];
  const leagues = [...new Set(matches.map((m) => m.league))];
  const previewHTML = generatePreviewHTML(matches, siteName, accentColor);

  const loadPreview = useCallback(() => {
    setShowPreview(true);
    setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = previewHTML;
      }
    }, 100);
  }, [previewHTML]);

  const copyScript = useCallback(async () => {
    await navigator.clipboard.writeText(previewHTML);
  }, [previewHTML]);

  const clearAll = useCallback(() => {
    setInput("");
    setShowPreview(false);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{ backgroundColor: `${theme.colors.primary}22`, color: theme.colors.primary, border: `1px solid ${theme.colors.primary}44` }}>
              <Swords size={14} /> MATCH PREDICTOR
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: theme.colors.text, fontFamily: "'Cinzel', serif" }}>
              Generator Bola
            </h1>
            <p style={{ color: theme.colors.textMuted }}>Paste jadwal pertandingan, dapatkan HTML prediksi otomatis</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="rounded-xl p-5" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm" style={{ color: theme.colors.text }}>Input Jadwal</h3>
                  <button onClick={() => setShowConfig(!showConfig)} className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg"
                    style={{ backgroundColor: `${theme.colors.accent}22`, color: theme.colors.accent }}>
                    <Settings size={12} /> Config
                  </button>
                </div>
                <AnimatePresence>
                  {showConfig && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-3 space-y-2">
                      <input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Nama Situs"
                        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                        style={{ backgroundColor: theme.colors.background, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }} />
                      <div className="flex gap-2 items-center">
                        <label className="text-xs" style={{ color: theme.colors.textMuted }}>Accent:</label>
                        <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14} placeholder={`League Name\nDD/MM Team1 vs Team2\nDD/MM Team3 vs Team4\n\nOther League\nDD/MM Team5 vs Team6`}
                  className="w-full px-4 py-3 rounded-lg text-sm font-mono resize-y outline-none"
                  style={{ backgroundColor: theme.colors.background, color: theme.colors.text, border: `1px solid ${theme.colors.border}`, minHeight: 200 }} />
              </div>

              {matches.length > 0 && (
                <div className="rounded-xl p-5" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
                  <div className="flex gap-4 text-sm" style={{ color: theme.colors.textMuted }}>
                    <span><strong style={{ color: theme.colors.primary }}>{leagues.length}</strong> liga</span>
                    <span><strong style={{ color: theme.colors.primary }}>{matches.length}</strong> pertandingan</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={loadPreview} disabled={matches.length === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-white text-sm transition-all hover:scale-[1.02] disabled:opacity-40"
                  style={{ backgroundColor: theme.colors.primary }}>
                  <Eye size={16} /> Preview
                </button>
                <button onClick={copyScript} disabled={matches.length === 0}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all"
                  style={{ backgroundColor: `${theme.colors.accent}22`, color: theme.colors.accent, border: `1px solid ${theme.colors.accent}44` }}>
                  <Copy size={14} /> Copy
                </button>
                <button onClick={clearAll}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all"
                  style={{ backgroundColor: `${theme.colors.textMuted}22`, color: theme.colors.textMuted, border: `1px solid ${theme.colors.textMuted}44` }}>
                  <Trash2 size={14} /> Clear
                </button>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}`, minHeight: 400 }}>
              {showPreview ? (
                <iframe ref={iframeRef} className="w-full h-full" style={{ minHeight: 600, border: "none" }} title="Preview" />
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-center px-8">
                  <Dices size={48} className="mb-4" style={{ color: theme.colors.textMuted }} />
                  <h3 className="text-lg font-bold mb-2" style={{ color: theme.colors.text }}>Generator Bola</h3>
                  <p className="text-sm" style={{ color: theme.colors.textMuted }}>
                    Paste jadwal pertandingan di sebelah kiri, lalu klik Preview untuk melihat hasil
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

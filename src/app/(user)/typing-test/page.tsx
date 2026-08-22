"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Keyboard, Clock, RotateCcw, Users, User, Trophy,
  Zap, Target, Check, X, Crown, Copy, Link as LinkIcon, Wifi
} from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateRoomCode, calculateWPM, calculateAccuracy } from "@/lib/utils";
import { getWordList, type Language } from "@/lib/typing-words";
import type { TypingResult } from "@/lib/types";

interface WordState {
  word: string;
  typed: string;
  status: "pending" | "current" | "correct" | "incorrect";
}

interface Player {
  id: string;
  name: string;
  wpm: number;
  progress: number;
  color: string;
  isYou: boolean;
  finished: boolean;
}

type View = "setup" | "lobby" | "countdown" | "racing" | "finished";

function generateText(difficulty: string, language: Language, wordCount: number = 50): string {
  const wordList = getWordList(difficulty, language);
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(wordList[Math.floor(Math.random() * wordList.length)]);
  }
  return words.join(" ");
}

function getPlayerId(): string {
  if (typeof window === "undefined") return "player-" + Math.random().toString(36).substring(2, 11);
  let id = localStorage.getItem("typing-player-id");
  if (!id) {
    id = "p-" + Math.random().toString(36).substring(2, 14);
    localStorage.setItem("typing-player-id", id);
  }
  return id;
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#8b5cf6", "#ec4899", "#14b8a6", "#f43f5e", "#3b82f6"];

function CarSVG({ color }: { color: string }) {
  return (
    <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
      <rect x="4" y="8" width="40" height="12" rx="4" fill={color} />
      <rect x="10" y="2" width="20" height="10" rx="3" fill={color} opacity="0.8" />
      <rect x="12" y="4" width="7" height="6" rx="1" fill="#88ccff" opacity="0.6" />
      <rect x="21" y="4" width="7" height="6" rx="1" fill="#88ccff" opacity="0.6" />
      <circle cx="12" cy="22" r="4" fill="#333" stroke="#666" strokeWidth="1.5" />
      <circle cx="12" cy="22" r="1.5" fill="#999" />
      <circle cx="36" cy="22" r="4" fill="#333" stroke="#666" strokeWidth="1.5" />
      <circle cx="36" cy="22" r="1.5" fill="#999" />
      <rect x="38" y="10" width="6" height="4" rx="1" fill="#fbbf24" />
    </svg>
  );
}

function MotoSVG({ color }: { color: string }) {
  return (
    <svg width="44" height="24" viewBox="0 0 44 24" fill="none">
      <path d="M16 4 L30 4 L34 12 L12 12 Z" fill={color} />
      <rect x="10" y="10" width="24" height="4" rx="2" fill={color} opacity="0.8" />
      <rect x="28" y="6" width="4" height="6" rx="1" fill={color} opacity="0.6" />
      <circle cx="8" cy="20" r="4" fill="#333" stroke="#666" strokeWidth="1.5" />
      <circle cx="8" cy="20" r="1.5" fill="#999" />
      <circle cx="36" cy="20" r="4" fill="#333" stroke="#666" strokeWidth="1.5" />
      <circle cx="36" cy="20" r="1.5" fill="#999" />
      <rect x="32" y="8" width="5" height="3" rx="1" fill="#fbbf24" />
      <line x1="18" y1="2" x2="22" y2="2" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RaceTrack({ players, theme }: { players: Player[]; theme: ReturnType<typeof getTheme> }) {
  return (
    <div className="space-y-2 p-4 rounded-xl" style={{ background: theme.colors.surface, border: "1px solid " + theme.colors.border }}>
      <div className="text-xs font-bold mb-3 tracking-wider flex items-center gap-2" style={{ color: theme.colors.textMuted }}>
        <Wifi size={12} /> RACE TRACK ({players.length} players)
      </div>
      {players.map((p, i) => (
        <div key={p.id} className="relative">
          {p.isYou && (
            <div
              className="absolute -top-6 z-10 transition-all duration-300"
              style={{ left: "calc(" + Math.min(p.progress, 92) + "% + 24px)", transform: "translateX(-50%)" }}
            >
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black tracking-wider" style={{ color: theme.colors.primary }}>YOU</span>
                <svg width="10" height="6" viewBox="0 0 10 6"><path d="M5 6L0 0h10z" fill={theme.colors.primary} /></svg>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono w-20 truncate shrink-0" style={{ color: p.isYou ? theme.colors.primary : theme.colors.text }}>
              {p.name}
            </span>
            <div className="flex-1 h-7 rounded-full relative overflow-hidden" style={{ background: theme.colors.background }}>
              <div className="absolute inset-y-0 left-0 rounded-full opacity-15 transition-all duration-200" style={{ width: p.progress + "%", background: p.color }} />
              <div className="absolute top-1/2 -translate-y-1/2 transition-all duration-200 ease-out" style={{ left: Math.min(p.progress, 90) + "%" }}>
                {i % 2 === 0 ? <CarSVG color={p.color} /> : <MotoSVG color={p.color} />}
              </div>
            </div>
            <span className="text-[11px] font-mono w-14 text-right shrink-0" style={{ color: p.finished ? "#22c55e" : theme.colors.textMuted }}>
              {p.wpm} wpm
            </span>
            {p.finished && <Check size={12} style={{ color: "#22c55e" }} />}
          </div>
        </div>
      ))}
    </div>
  );
}
export default function TypingTestPage() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [timeLimit, setTimeLimit] = useState(60);
  const [mode, setMode] = useState<"solo" | "race">("solo");
  const [language, setLanguage] = useState<Language>("en");
  const [nickname, setNickname] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("typing-nickname") || "";
    return "";
  });
  const [view, setView] = useState<View>("setup");

  const [text, setText] = useState("");
  const [words, setWords] = useState<WordState[]>([]);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [typedInput, setTypedInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [maxWpm, setMaxWpm] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);

  const [roomCode, setRoomCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isHost, setIsHost] = useState(false);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [leaderboard, setLeaderboard] = useState<TypingResult[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const broadcastRef = useRef<NodeJS.Timeout | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null);
  const playerIdRef = useRef(getPlayerId());
  const myColorRef = useRef(COLORS[0]);
  const isHostRef = useRef(false);
  const wpmRef = useRef(0);
  const correctCharsRef = useRef(0);
  const incorrectCharsRef = useRef(0);
  const maxWpmRef = useRef(0);
  const difficultyRef = useRef(difficulty);
  const languageRef = useRef(language);
  const timeLimitRef = useRef(timeLimit);
  const viewRef = useRef(view);
  useEffect(() => { viewRef.current = view; }, [view]);
  useEffect(() => { difficultyRef.current = difficulty; }, [difficulty]);
  useEffect(() => { languageRef.current = language; }, [language]);
  useEffect(() => { timeLimitRef.current = timeLimit; }, [timeLimit]);

  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);
  const progress = useMemo(() => {
    if (words.length === 0) return 0;
    return Math.round((currentWordIdx / words.length) * 100);
  }, [currentWordIdx, words.length]);


  useEffect(() => {
    if (nickname && typeof window !== "undefined") {
      localStorage.setItem("typing-nickname", nickname);
    }
  }, [nickname]);

  useEffect(() => {
    if (!nickname || view !== "setup") return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get("room");
    if (roomParam) {
      autoJoinRoom(roomParam.toUpperCase());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nickname]);

  const setupRoomChannel = useCallback((code: string) => {
    const supabase = createClient();
    if (channelRef.current) { channelRef.current.unsubscribe(); }
    myColorRef.current = isHostRef.current ? COLORS[0] : COLORS[Math.floor(Math.random() * COLORS.length)];
    const ch = supabase.channel("typing-room:" + code, {
      config: { presence: { key: playerIdRef.current } },
    });
    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState() as Record<string, { id: string; name: string; color: string; wpm: number; progress: number; finished: boolean }[]>;
      const allPlayers: Player[] = [];
      Object.values(state).forEach((members) => {
        members.forEach((m) => {
          allPlayers.push({
            id: m.id, name: m.name, wpm: m.wpm || 0, progress: m.progress || 0,
            color: m.color, isYou: m.id === playerIdRef.current, finished: m.finished || false,
          });
        });
      });
      setPlayers(allPlayers);
    });
    ch.on("broadcast", { event: "countdown" }, ({ payload }: { payload: { value: number } }) => {
      setView("countdown");
      setCountdown(payload.value);
    });
    ch.on("broadcast", { event: "race-start" }, ({ payload }: { payload: { startTime: number; text: string } }) => {
      setText(payload.text);
      const wl: WordState[] = payload.text.split(" ").map((w: string) => ({ word: w, typed: "", status: "pending" as const }));
      if (wl.length > 0) wl[0].status = "current";
      setWords(wl);
      setCurrentWordIdx(0);
      setTypedInput("");
      setCountdown(null);
      setView("racing");
      setIsActive(true);
      setStartTime(payload.startTime);
      setTimeLeft(timeLimitRef.current);
      setTimeout(() => inputRef.current?.focus(), 100);
    });
    ch.on("broadcast", { event: "player-progress" }, ({ payload }: { payload: { id: string; name: string; wpm: number; progress: number; finished: boolean } }) => {
      if (payload.id === playerIdRef.current) return;
      setPlayers((prev) => {
        const exists = prev.find((p) => p.id === payload.id);
        if (exists) return prev.map((p) => p.id === payload.id ? { ...p, wpm: payload.wpm, progress: payload.progress, finished: payload.finished } : p);
        return [...prev, { id: payload.id, name: payload.name, wpm: payload.wpm, progress: payload.progress, color: COLORS[prev.length % COLORS.length], isYou: false, finished: payload.finished }];
      });
    });
    ch.on("broadcast", { event: "race-finish" }, ({ payload }: { payload: { id: string; wpm: number } }) => {
      setPlayers((prev) => prev.map((p) => p.id === payload.id ? { ...p, wpm: payload.wpm, progress: 100, finished: true } : p));
    });
    ch.subscribe((status: string) => {
      if (status === "SUBSCRIBED") {
        ch.track({ id: playerIdRef.current, name: nickname || "Anonymous", color: myColorRef.current, wpm: 0, progress: 0, finished: false });
      }
    });
    channelRef.current = ch;
  }, [nickname]);

  const broadcastProgress = useCallback((myWpm: number, myProgress: number) => {
    const ch = channelRef.current;
    if (ch) ch.send({ type: "broadcast", event: "player-progress", payload: { id: playerIdRef.current, name: nickname || "Anonymous", wpm: myWpm, progress: myProgress, finished: false } });
    setPlayers((prev) => {
      const me = prev.find((p) => p.isYou);
      if (me) return prev.map((p) => p.isYou ? { ...p, wpm: myWpm, progress: myProgress } : p);
      return [...prev, { id: playerIdRef.current, name: nickname || "Anonymous", wpm: myWpm, progress: myProgress, color: myColorRef.current, isYou: true, finished: false }];
    });
  }, [nickname]);
  const createRoom = () => {
    const code = generateRoomCode();
    setRoomCode(code);
    setIsHost(true);
    isHostRef.current = true;
    myColorRef.current = COLORS[0];
    window.history.replaceState({}, "", "?room=" + code);
    setupRoomChannel(code);
    setView("lobby");
  };

  const autoJoinRoom = useCallback((code: string) => {
    setRoomCode(code);
    setIsHost(false);
    isHostRef.current = false;
    setupRoomChannel(code);
    setView("lobby");
  }, [nickname]);

  const startRace = () => {
    const newText = generateText(difficultyRef.current, languageRef.current);
    let count = 3;
    const ch = channelRef.current;
    if (ch) ch.send({ type: "broadcast", event: "countdown", payload: { value: 3 } });
    setView("countdown");
    setCountdown(3);
    const cd = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(cd);
        setCountdown(null);
        if (ch) ch.send({ type: "broadcast", event: "race-start", payload: { startTime: Date.now(), text: newText } });
        setText(newText);
        const wl: WordState[] = newText.split(" ").map((w) => ({ word: w, typed: "", status: "pending" as const }));
        if (wl.length > 0) wl[0].status = "current";
        setWords(wl);
        setCurrentWordIdx(0);
        setTypedInput("");
        setView("racing");
        setIsActive(true);
        setStartTime(Date.now());
        setTimeLeft(timeLimitRef.current);
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        setCountdown(count);
        if (ch) ch.send({ type: "broadcast", event: "countdown", payload: { value: count } });
      }
    }, 1000);
    countdownRef.current = cd as unknown as NodeJS.Timeout;
  };

  const startTest = useCallback(() => {
    if (mode === "race") return;
    const newText = generateText(difficulty, language);
    setText(newText);
    const wl: WordState[] = newText.split(" ").map((w) => ({ word: w, typed: "", status: "pending" }));
    if (wl.length > 0) wl[0].status = "current";
    setWords(wl);
    setCurrentWordIdx(0);
    setTypedInput("");
    setTimeLeft(timeLimit);
    setIsFinished(false);
    setWpm(0); setAccuracy(100); setMaxWpm(0); maxWpmRef.current = 0; setCorrectChars(0); setIncorrectChars(0);
    setCountdown(3);
    let count = 3;
    countdownRef.current = setInterval(() => {
      count--;
      if (count <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        setCountdown(null);
        setIsActive(true);
        setStartTime(Date.now());
        setTimeout(() => inputRef.current?.focus(), 50);
      } else { setCountdown(count); }
    }, 1000);
  }, [difficulty, language, timeLimit, mode]);

  const finishTest = useCallback(() => {
    setIsActive(false);
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (broadcastRef.current) clearInterval(broadcastRef.current);
    const curWpm = wpmRef.current;
    const curCorrect = correctCharsRef.current;
    const curIncorrect = incorrectCharsRef.current;
    const total = curCorrect + curIncorrect;
    const finalAcc = total > 0 ? calculateAccuracy(curCorrect, total) : 0;
    setAccuracy(finalAcc);
    if (mode === "race" && roomCode) {
      const ch = channelRef.current;
      if (ch) ch.send({ type: "broadcast", event: "race-finish", payload: { id: playerIdRef.current, name: nickname || "Anonymous", wpm: curWpm, accuracy: finalAcc } });
    }
    const supabase = createClient();
    supabase.from("typing_results").insert({ nickname: nickname || "Anonymous", wpm: curWpm, accuracy: finalAcc, difficulty, mode, text_content: text.substring(0, 200), max_wpm: maxWpmRef.current, completed_at: new Date().toISOString(), room_code: roomCode || null })
      .then(({ error }: { error: unknown }) => { if (error) console.error("Save failed:", error); });
    setView("finished");
  }, [difficulty, mode, text, nickname, roomCode]);

  useEffect(() => { wpmRef.current = wpm; }, [wpm]);
  useEffect(() => { correctCharsRef.current = correctChars; }, [correctChars]);
  useEffect(() => { incorrectCharsRef.current = incorrectChars; }, [incorrectChars]);
  useEffect(() => { maxWpmRef.current = maxWpm; }, [maxWpm]);

  useEffect(() => {
    if (isActive && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { if (timerRef.current) clearInterval(timerRef.current); setTimeout(() => finishTest(), 0); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, isFinished, finishTest]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isActive && startTime) {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 0) {
        const curWpm = calculateWPM(correctChars, elapsed);
        setWpm(curWpm);
        setMaxWpm((prev) => Math.max(prev, curWpm));
      }
    }
  }, [correctChars, isActive, startTime]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (isActive && !isFinished) {
      broadcastRef.current = setInterval(() => { broadcastProgress(wpmRef.current, progress); }, 200);
    }
    return () => { if (broadcastRef.current) clearInterval(broadcastRef.current); };
  }, [isActive, isFinished, progress, broadcastProgress]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isActive || isFinished) return;
    if (e.key === "Tab") { e.preventDefault(); if (countdownRef.current) clearInterval(countdownRef.current); if (timerRef.current) clearInterval(timerRef.current); setCountdown(null); startTest(); return; }
    if (e.key === "Backspace") { e.preventDefault(); if (typedInput.length > 0) setTypedInput((p) => p.slice(0, -1)); return; }
    if (e.key === " ") {
      e.preventDefault();
      const cw = words[currentWordIdx];
      if (!cw) return;
      const ft = typedInput;
      const wc = ft === cw.word;
      setWords((prev) => prev.map((w, i) => { if (i === currentWordIdx) return { ...w, typed: ft, status: wc ? "correct" : "incorrect" }; if (i === currentWordIdx + 1) return { ...w, status: "current" }; return w; }));
      if (wc) { setCorrectChars((p) => p + cw.word.length); }
      else { let c = 0; for (let i = 0; i < Math.min(ft.length, cw.word.length); i++) { if (ft[i] === cw.word[i]) c++; } setCorrectChars((p) => p + c); setIncorrectChars((p) => p + Math.abs(ft.length - cw.word.length) + (cw.word.length - c)); }
      if (currentWordIdx < words.length - 1) { setCurrentWordIdx((p) => p + 1); setTypedInput(""); }
      else { finishTest(); }
      return;
    }
    if (e.key.length === 1) { e.preventDefault(); const cw = words[currentWordIdx]; if (cw) setTypedInput((p) => p + e.key); }
  };
  const copyLink = () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const leaveRoom = () => { channelRef.current?.unsubscribe(); channelRef.current = null; setRoomCode(""); setIsHost(false); isHostRef.current = false; setPlayers([]); setView("setup"); window.history.replaceState({}, "", "/typing-test"); };

  const resetAll = () => {
    setIsActive(false); setIsFinished(false);
    setView(mode === "race" && roomCode ? "lobby" : "setup");
    setWpm(0); setAccuracy(100); setMaxWpm(0); maxWpmRef.current = 0; setCorrectChars(0); setIncorrectChars(0);
    if (mode === "solo") { setText(""); setWords([]); setCurrentWordIdx(0); }
  };

  useEffect(() => {
    const loadLeaderboard = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("typing_results").select("*").eq("difficulty", difficulty).order("wpm", { ascending: false }).limit(10);
      if (data) setLeaderboard(data);
    };
    loadLeaderboard();
  }, [difficulty, isFinished]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6" style={{ color: theme.colors.text }}>
      <AnimatePresence>
        {countdown !== null && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.85)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div key={countdown} className="text-[120px] font-black" style={{ color: theme.colors.primary, textShadow: "0 0 40px " + theme.colors.primary + "60" }} initial={{ scale: 3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.3, opacity: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
              {countdown === 0 ? "GO!" : countdown}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Keyboard size={24} style={{ color: theme.colors.primary }} />
          Typing Test
          {mode === "race" && roomCode && (
            <span className="flex items-center gap-1 text-xs font-normal ml-2">
              <code className="font-mono font-bold px-2 py-0.5 rounded" style={{ background: theme.colors.surface, color: theme.colors.primary }}>{roomCode}</code>
              {isHost && <Crown size={12} style={{ color: "#fbbf24" }} />}
            </span>
          )}
        </h1>
        <div className="flex items-center gap-2">
          {view === "racing" && mode === "race" && <Button variant="ghost" size="sm" onClick={leaveRoom}><X size={14} /> Leave</Button>}
          {view === "setup" && <Button variant="ghost" size="sm" onClick={startTest}><RotateCcw size={16} /> Solo</Button>}
        </div>
      </motion.div>
      {/* SETUP VIEW */}
      {view === "setup" && (
        <div className="space-y-4">
          {!nickname ? (
            <Card variant="glass" className="p-6 text-center">
              <User size={40} className="mx-auto mb-4" style={{ color: theme.colors.primary }} />
              <h2 className="text-xl font-bold mb-2">Masukkan Nickname</h2>
              <p className="text-sm mb-4" style={{ color: theme.colors.textMuted }}>Buat bermain solo atau race multiplayer</p>
              <div className="flex gap-2 justify-center">
                <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Nickname..."
                  className="w-48 px-3 py-2 rounded-lg text-sm font-mono text-center" style={{ background: theme.colors.background, color: theme.colors.text, border: "1px solid " + theme.colors.border }}
                  onKeyDown={(e) => { if (e.key === "Enter" && nickname.trim()) setNickname(nickname.trim()); }} maxLength={20} />
                <Button onClick={() => { if (nickname.trim()) setNickname(nickname.trim()); }} disabled={!nickname.trim()}>OK</Button>
              </div>
            </Card>
          ) : (
            <>
              <Card variant="glass" className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: theme.colors.textMuted }}><Users size={12} className="inline mr-1" /> Mode</label>
                    <div className="flex gap-1">
                      {(["solo", "race"] as const).map((m) => (
                        <button key={m} onClick={() => setMode(m)} className="flex-1 px-2 py-1.5 rounded text-xs font-medium capitalize transition-all flex items-center justify-center gap-1"
                          style={{ background: mode === m ? theme.colors.primary : theme.colors.surface, color: mode === m ? theme.colors.background : theme.colors.textMuted }}>
                          {m === "solo" ? <User size={12} /> : <Users size={12} />} {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: theme.colors.textMuted }}><Clock size={12} className="inline mr-1" /> Time</label>
                    <div className="flex gap-1">
                      {[15, 30, 60, 120].map((t) => (
                        <button key={t} onClick={() => setTimeLimit(t)} className="flex-1 px-1 py-1.5 rounded text-xs font-medium transition-all"
                          style={{ background: timeLimit === t ? theme.colors.primary : theme.colors.surface, color: timeLimit === t ? theme.colors.background : theme.colors.textMuted }}>{t}s</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: theme.colors.textMuted }}><Target size={12} className="inline mr-1" /> Difficulty</label>
                    <div className="flex gap-1">
                      {(["easy", "medium", "hard"] as const).map((d) => (
                        <button key={d} onClick={() => setDifficulty(d)} className="flex-1 px-2 py-1.5 rounded text-xs font-medium capitalize transition-all"
                          style={{ background: difficulty === d ? theme.colors.primary : theme.colors.surface, color: difficulty === d ? theme.colors.background : theme.colors.textMuted }}>{d}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: theme.colors.textMuted }}>Language</label>
                    <div className="flex gap-1">
                      {[{ key: "en" as Language, label: "EN" }, { key: "id" as Language, label: "ID" }].map((l) => (
                        <button key={l.key} onClick={() => setLanguage(l.key)} className="flex-1 px-2 py-1.5 rounded text-xs font-medium transition-all"
                          style={{ background: language === l.key ? theme.colors.primary : theme.colors.surface, color: language === l.key ? theme.colors.background : theme.colors.textMuted }}>{l.label}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {mode === "solo" && (
                <div className="flex justify-center">
                  <Button onClick={startTest} size="lg" glow><Keyboard size={20} /> Start Typing</Button>
                </div>
              )}

              {mode === "race" && (
                <Card variant="glass" className="p-4">
                  <div className="text-xs font-bold mb-3 tracking-wider" style={{ color: theme.colors.textMuted }}>MULTIPLAYER RACE</div>
                  <p className="text-sm mb-3" style={{ color: theme.colors.textMuted }}>Buat race, share link ke teman, dan balapan typing realtime!</p>
                  <Button size="sm" onClick={createRoom} glow><Crown size={12} /> Create Race</Button>
                </Card>
              )}
            </>
          )}
        </div>
      )}
      {/* LOBBY VIEW */}
      {view === "lobby" && (
        <div className="space-y-4">
          <Card variant="glow" className="p-6 text-center">
            <Crown size={32} className="mx-auto mb-3" style={{ color: "#fbbf24" }} />
            <h2 className="text-lg font-bold mb-2">Race Room</h2>
            <p className="text-sm mb-4" style={{ color: theme.colors.textMuted }}>Share link ini ke teman kamu:</p>
            <div className="flex items-center gap-2 justify-center mb-4 px-4 py-2 rounded-lg" style={{ background: theme.colors.background, border: "1px solid " + theme.colors.border }}>
              <LinkIcon size={14} style={{ color: theme.colors.textMuted }} />
              <code className="text-xs font-mono truncate flex-1 text-left" style={{ color: theme.colors.primary }}>{typeof window !== "undefined" ? window.location.href : ""}</code>
              <button onClick={copyLink} className="shrink-0 px-3 py-1 rounded text-xs font-medium transition-all" style={{ background: theme.colors.primary + "20", color: theme.colors.primary }}>
                {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
              </button>
            </div>
            <p className="text-xs" style={{ color: theme.colors.textMuted }}>
              {isHost ? "Menunggu pemain join..." : "Menunggu host mulai race..."}
            </p>
          </Card>

          <Card variant="glass" className="p-4">
            <div className="text-xs font-bold mb-3 tracking-wider flex items-center gap-2" style={{ color: theme.colors.textMuted }}>
              <Users size={12} /> PEMAIN ({players.length})
            </div>
            {players.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: theme.colors.textMuted }}>Menunggu pemain...</p>
            ) : (
              <div className="space-y-2">
      {players.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: p.isYou ? theme.colors.primary + "15" : theme.colors.background, border: "1px solid " + theme.colors.border }}>
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} />
                    <span className="text-sm font-medium flex-1">{p.name} {p.isYou && <Badge variant="primary" className="text-[9px] ml-1">YOU</Badge>}</span>
                    {p.id === players[0]?.id && <Crown size={12} style={{ color: "#fbbf24" }} />}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="flex justify-center gap-3">
            {isHost && players.length >= 2 && <Button onClick={startRace} size="lg" glow><Zap size={18} /> Start Race!</Button>}
            {isHost && players.length < 2 && (
              <p className="text-xs px-4 py-2 rounded-lg" style={{ background: theme.colors.surface, color: theme.colors.textMuted }}>
                Minimal 2 pemain untuk mulai race
              </p>
            )}
            {!isHost && <p className="text-sm py-2" style={{ color: theme.colors.textMuted }}>Menunggu host mulai race...</p>}
            <Button variant="secondary" onClick={leaveRoom}><X size={14} /> Leave</Button>
          </div>
        </div>
      )}
      {/* RACE TRACK - shows during racing */}
      {(view === "racing" || view === "countdown") && mode === "race" && players.length > 0 && (
        <div className="mb-6">
          <RaceTrack players={players} theme={theme} />
        </div>
      )}

      {/* TYPING AREA */}
      {((view === "racing") || (view === "setup" && mode === "solo" && words.length > 0 && !isFinished)) && words.length > 0 && (
        <Card variant="glass" className="p-6 mb-4 relative" onClick={() => inputRef.current?.focus()}>
          <div className="text-xl leading-relaxed font-mono cursor-text select-none min-h-[80px]">
            {words.map((w, wi) => (
              <span key={wi} style={{ padding: "1px 2px", borderRadius: "3px", background: wi === currentWordIdx ? theme.colors.primary + "15" : "transparent" }}>
                {w.word.split("").map((char, ci) => {
                  let st: React.CSSProperties = { color: "#555" };
                  if (wi < currentWordIdx) { st = { color: w.status === "correct" ? "#22c55e" : "#ef4444" }; }
                  else if (wi === currentWordIdx) {
                    if (ci < typedInput.length) { st = { color: typedInput[ci] === char ? "#22c55e" : "#ef4444", borderBottom: "2px solid " + (typedInput[ci] === char ? "#22c55e" : "#ef4444") }; }
                    else if (ci === typedInput.length) { st = { color: "#fff", borderBottom: "2px solid " + theme.colors.primary }; }
                  }
                   return <span key={ci} style={st}>{char}</span>;
                })}
                <span style={{ color: "transparent" }}> </span>
              </span>
            ))}
          </div>
          <input ref={inputRef} type="text" className="absolute inset-0 w-full h-full opacity-0 cursor-text" style={{ fontSize: "16px" }} onKeyDown={handleKeyDown} value={typedInput} readOnly autoFocus />
        </Card>
      )}

      {/* STATS BAR */}
      {(view === "racing" || (isActive && mode === "solo")) && (
        <div className="flex items-center justify-center gap-8 mb-6 py-3">
          {[
            { label: "wpm", value: wpm, color: theme.colors.primary },
            { label: "acc", value: accuracy + "%", color: "#22c55e" },
            { label: "time", value: timeLeft + "s", color: timeLeft <= 10 ? "#ef4444" : theme.colors.accent },
            { label: "raw", value: correctChars + incorrectChars, color: theme.colors.textMuted },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: theme.colors.textMuted }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* SOLO START BUTTON */}
      {view === "setup" && mode === "solo" && !isActive && !isFinished && nickname && (
        <div className="flex justify-center gap-4 mb-8">
          <p className="text-sm flex items-center gap-2" style={{ color: theme.colors.textMuted }}>
            Press <kbd className="px-2 py-0.5 rounded text-xs" style={{ background: theme.colors.surface, border: "1px solid " + theme.colors.border }}>Tab</kbd> to restart during typing
          </p>
        </div>
      )}
      {/* FINISHED VIEW */}
      <AnimatePresence>
        {view === "finished" && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card variant="glow" className="p-8 text-center mb-8">
              <Trophy size={48} className="mx-auto mb-4" style={{ color: theme.colors.primary }} />
              <h2 className="text-3xl font-bold mb-2">Test Selesai!</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[
                  { label: "WPM", value: wpm, color: theme.colors.primary },
                  { label: "Accuracy", value: accuracy + "%", color: "#22c55e" },
                  { label: "Max WPM", value: maxWpm, color: theme.colors.secondary },
                  { label: "Total Chars", value: correctChars + incorrectChars, color: theme.colors.accent },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-3xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-sm" style={{ color: theme.colors.textMuted }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {mode === "race" && players.length > 0 && (
                <div className="mt-6 pt-6" style={{ borderTop: "1px solid " + theme.colors.border }}>
                  <h3 className="text-lg font-bold mb-3">Race Results</h3>
                  <div className="space-y-1">
                    {[...players].sort((a, b) => b.wpm - a.wpm).map((p, i) => (
                      <div key={p.id} className="flex items-center gap-3 px-4 py-2 rounded-lg" style={{ background: p.isYou ? theme.colors.primary + "15" : "transparent" }}>
                        <span className="text-sm font-bold w-6" style={{ color: i === 0 ? "#fbbf24" : theme.colors.textMuted }}>#{i + 1}</span>
                        <span className="flex items-center gap-2 flex-1 text-sm">
                          <span className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                          {p.name} {p.isYou && <Badge variant="primary" className="text-[9px]">YOU</Badge>}
                        </span>
                        <span className="font-mono font-bold text-sm" style={{ color: theme.colors.primary }}>{p.wpm} wpm</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-center gap-3 mt-6">
                <Button onClick={() => { resetAll(); if (mode === "solo") startTest(); }} glow><RotateCcw size={16} /> Main Lagi</Button>
                <Button variant="secondary" onClick={resetAll}>Kembali</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEADERBOARD */}
      {view !== "lobby" && (
        <Card variant="glass" className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Trophy size={20} style={{ color: theme.colors.primary }} />
            Leaderboard
            <Badge variant="primary" className="ml-2 capitalize">{difficulty}</Badge>
          </h2>
          {leaderboard.length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: theme.colors.textMuted }}>Belum ada hasil. Jadilah yang pertama!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: theme.colors.textMuted }}>
                    <th className="text-left py-2 px-3">#</th>
                    <th className="text-left py-2 px-3">Player</th>
                    <th className="text-right py-2 px-3">WPM</th>
                    <th className="text-right py-2 px-3">Accuracy</th>
                    <th className="text-right py-2 px-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((result, i) => (
                    <tr key={result.id} style={{ color: theme.colors.text, borderTop: "1px solid " + theme.colors.border }}>
                      <td className="py-2.5 px-3 font-mono">
                        {i === 0 ? "\uD83E\uDD47" : i === 1 ? "\uD83E\uDD48" : i === 2 ? "\uD83E\uDD49" : i + 1}
                      </td>
                      <td className="py-2.5 px-3">{result.nickname || "Anonymous"}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold" style={{ color: theme.colors.primary }}>{result.wpm}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{result.accuracy}%</td>
                      <td className="py-2.5 px-3 text-right text-xs" style={{ color: theme.colors.textMuted }}>
                        {new Date(result.completed_at).toLocaleDateString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

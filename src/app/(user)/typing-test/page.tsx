"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Keyboard, Clock, RotateCcw, Users, User, Trophy,
  Settings, Zap, Target, Flame, Copy, Check
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
  vehicleType: "car" | "moto";
  targetWpm: number;
}

function generateText(difficulty: string, language: Language, wordCount: number = 50): string {
  const wordList = getWordList(difficulty, language);
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(wordList[Math.floor(Math.random() * wordList.length)]);
  }
  return words.join(" ");
}

const AI_NAMES = ["SpeedDemon", "TypeKing", "BlazeFingers", "QuickType", "NightRacer", "SwiftKeys", "ThunderType", "FastHands", "ProTyper"];
const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#8b5cf6", "#ec4899", "#14b8a6", "#f43f5e"];

function CarSVG({ color }: { color: string }) {
  return (
    <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <svg width="44" height="24" viewBox="0 0 44 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <div className="space-y-2 p-4 rounded-xl" style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
      <div className="text-xs font-bold mb-3 tracking-wider" style={{ color: theme.colors.textMuted }}>RACE TRACK</div>
      {players.map((p) => (
        <div key={p.id} className="relative">
          {p.isYou && (
            <div
              className="absolute -top-6 z-10 transition-all duration-300"
              style={{ left: `calc(${Math.min(p.progress, 92)}% + 24px)`, transform: "translateX(-50%)" }}
            >
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black tracking-wider" style={{ color: theme.colors.primary }}>YOU</span>
                <svg width="10" height="6" viewBox="0 0 10 6"><path d="M5 6L0 0h10z" fill={theme.colors.primary} /></svg>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] font-mono w-20 truncate shrink-0"
              style={{ color: p.isYou ? theme.colors.primary : theme.colors.text }}
            >
              {p.name}
            </span>
            <div className="flex-1 h-7 rounded-full relative overflow-hidden" style={{ background: theme.colors.background }}>
              <div
                className="absolute inset-y-0 left-0 rounded-full opacity-15 transition-all duration-200"
                style={{ width: `${p.progress}%`, background: p.color }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-200 ease-out"
                style={{ left: `${Math.min(p.progress, 90)}%` }}
              >
                {p.vehicleType === "car" ? <CarSVG color={p.color} /> : <MotoSVG color={p.color} />}
              </div>
            </div>
            <span className="text-[11px] font-mono w-14 text-right shrink-0" style={{ color: theme.colors.textMuted }}>
              {p.wpm} wpm
            </span>
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
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isHost, setIsHost] = useState(false);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [leaderboard, setLeaderboard] = useState<TypingResult[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  const totalChars = useMemo(() => text.length, [text]);

  const progress = useMemo(() => {
    if (words.length === 0) return 0;
    return Math.round((currentWordIdx / words.length) * 100);
  }, [currentWordIdx, words.length]);

  useEffect(() => {
    const newText = generateText(difficulty, language);
    setText(newText);
    const wordList: WordState[] = newText.split(" ").map((w) => ({
      word: w, typed: "", status: "pending",
    }));
    if (wordList.length > 0) wordList[0].status = "current";
    setWords(wordList);
    setCurrentWordIdx(0);
  }, [difficulty, language]);

  useEffect(() => {
    if (isActive && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimeout(() => finishTest(), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, isFinished]);

  useEffect(() => {
    if (isActive && startTime) {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed > 0) {
        const currentWpm = calculateWPM(correctChars, elapsed);
        setWpm(currentWpm);
        setMaxWpm((prev) => Math.max(prev, currentWpm));
      }
    }
  }, [correctChars, isActive, startTime]);

  useEffect(() => {
    if (!isActive || mode !== "race") return;
    const interval = setInterval(() => {
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.isYou || p.finished) return p;
          const wpmDelta = p.targetWpm / 600;
          const charDelta = wpmDelta * 5;
          const newProgress = p.progress + (totalChars > 0 ? (charDelta / totalChars) * 100 : 0);
          if (newProgress >= 100) return { ...p, progress: 100, wpm: Math.round(p.targetWpm), finished: true };
          return { ...p, progress: Math.min(newProgress, 99), wpm: Math.round(p.targetWpm * Math.min(newProgress / 80, 1)) };
        })
      );
    }, 100);
    return () => clearInterval(interval);
  }, [isActive, mode, totalChars]);

  const initRace = useCallback(() => {
    const opponents: Player[] = AI_NAMES.map((name, i) => ({
      id: `ai-${i}`,
      name,
      wpm: 0,
      progress: 0,
      color: COLORS[i % COLORS.length],
      isYou: false,
      finished: false,
      vehicleType: (i % 2 === 0 ? "car" : "moto") as "car" | "moto",
      targetWpm: 30 + Math.random() * 60,
    }));
    const you: Player = {
      id: "you",
      name: "You",
      wpm: 0,
      progress: 0,
      color: theme.colors.primary,
      isYou: true,
      finished: false,
      vehicleType: "car",
      targetWpm: 0,
    };
    setPlayers([you, ...opponents]);
  }, [theme.colors.primary]);

  const updateYourProgress = useCallback((charIdx: number) => {
    if (mode !== "race") return;
    setPlayers((prev) =>
      prev.map((p) => {
        if (!p.isYou) return p;
        const prog = totalChars > 0 ? (charIdx / totalChars) * 100 : 0;
        return { ...p, progress: Math.min(prog, 99) };
      })
    );
  }, [mode, totalChars]);

  const startTest = useCallback(() => {
    const newText = generateText(difficulty, language);
    setText(newText);
    const wordList: WordState[] = newText.split(" ").map((w) => ({
      word: w, typed: "", status: "pending",
    }));
    if (wordList.length > 0) wordList[0].status = "current";
    setWords(wordList);
    setCurrentWordIdx(0);
    setTypedInput("");
    setTimeLeft(timeLimit);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setMaxWpm(0);
    setCorrectChars(0);
    setIncorrectChars(0);

    if (mode === "race") initRace();

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
      } else {
        setCountdown(count);
      }
    }, 1000);
  }, [difficulty, language, timeLimit, mode, initRace]);

  const finishTest = useCallback(() => {
    setIsActive(false);
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const total = correctChars + incorrectChars;
    const finalAccuracy = total > 0 ? calculateAccuracy(correctChars, total) : 0;
    setAccuracy(finalAccuracy);

    if (mode === "race") {
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.isYou) return { ...p, wpm, progress: 100, finished: true };
          return p;
        })
      );
    }

    const supabase = createClient();
    supabase.from("typing_results").insert({
      nickname: "Player",
      wpm,
      accuracy: finalAccuracy,
      difficulty,
      mode,
      text_content: text.substring(0, 200),
      max_wpm: maxWpm,
      completed_at: new Date().toISOString(),
    }).then(({ error }: { error: unknown }) => {
      if (error) console.error("Failed to save typing result:", error);
    });
  }, [correctChars, incorrectChars, wpm, difficulty, mode, text, maxWpm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isActive || isFinished) return;

    if (e.key === "Tab") {
      e.preventDefault();
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      setCountdown(null);
      startTest();
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      if (typedInput.length > 0) {
        setTypedInput((prev) => prev.slice(0, -1));
      }
      return;
    }

    if (e.key === " ") {
      e.preventDefault();
      const currentWord = words[currentWordIdx];
      if (!currentWord) return;

      const finalTyped = typedInput;
      const wordCorrect = finalTyped === currentWord.word;

      setWords((prev) =>
        prev.map((w, i) => {
          if (i === currentWordIdx) return { ...w, typed: finalTyped, status: wordCorrect ? "correct" : "incorrect" };
          if (i === currentWordIdx + 1) return { ...w, status: "current" };
          return w;
        })
      );

      if (wordCorrect) {
        setCorrectChars((prev) => prev + currentWord.word.length);
      } else {
        let correct = 0;
        for (let i = 0; i < Math.min(finalTyped.length, currentWord.word.length); i++) {
          if (finalTyped[i] === currentWord.word[i]) correct++;
        }
        setCorrectChars((prev) => prev + correct);
        setIncorrectChars((prev) => prev + Math.abs(finalTyped.length - currentWord.word.length) + (currentWord.word.length - correct));
      }

      const newTotal = currentWordIdx + 1;
      updateYourProgress(newTotal);

      if (currentWordIdx < words.length - 1) {
        setCurrentWordIdx((prev) => prev + 1);
        setTypedInput("");
      } else {
        finishTest();
      }
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      const currentWord = words[currentWordIdx];
      if (!currentWord) return;
      setTypedInput((prev) => prev + e.key);
    }
  };

  const createRoom = () => {
    const code = generateRoomCode();
    setRoomCode(code);
    setIsHost(true);
    initRace();
  };

  const joinRoom = () => {
    if (joinCode.length === 6) {
      setRoomCode(joinCode.toUpperCase());
      initRace();
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const loadLeaderboard = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("typing_results")
        .select("*")
        .eq("difficulty", difficulty)
        .order("wpm", { ascending: false })
        .limit(10);
      if (data) setLeaderboard(data);
    };
    loadLeaderboard();
  }, [difficulty, isFinished]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6" style={{ color: theme.colors.text }}>
      <AnimatePresence>
        {countdown !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.85)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={countdown}
              className="text-[120px] font-black"
              style={{ color: theme.colors.primary, textShadow: `0 0 40px ${theme.colors.primary}60` }}
              initial={{ scale: 3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {countdown === 0 ? "GO!" : countdown}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Keyboard size={24} style={{ color: theme.colors.primary }} />
          Typing Test
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings size={16} /> Settings
          </Button>
          <Button variant="ghost" size="sm" onClick={startTest}>
            <RotateCcw size={16} /> Restart
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
            <Card variant="glass" className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium mb-2 block" style={{ color: theme.colors.textMuted }}>
                    <Users size={12} className="inline mr-1" /> Mode
                  </label>
                  <div className="flex gap-1">
                    {(["solo", "race"] as const).map((m) => (
                      <button key={m} onClick={() => setMode(m)}
                        className="flex-1 px-2 py-1.5 rounded text-xs font-medium capitalize transition-all flex items-center justify-center gap-1"
                        style={{ background: mode === m ? theme.colors.primary : theme.colors.surface, color: mode === m ? theme.colors.background : theme.colors.textMuted }}>
                        {m === "solo" ? <User size={12} /> : <Users size={12} />} {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-2 block" style={{ color: theme.colors.textMuted }}>
                    <Clock size={12} className="inline mr-1" /> Time
                  </label>
                  <div className="flex gap-1">
                    {[15, 30, 60, 120].map((t) => (
                      <button key={t} onClick={() => setTimeLimit(t)}
                        className="flex-1 px-1 py-1.5 rounded text-xs font-medium transition-all"
                        style={{ background: timeLimit === t ? theme.colors.primary : theme.colors.surface, color: timeLimit === t ? theme.colors.background : theme.colors.textMuted }}>
                        {t}s
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-2 block" style={{ color: theme.colors.textMuted }}>
                    <Target size={12} className="inline mr-1" /> Difficulty
                  </label>
                  <div className="flex gap-1">
                    {(["easy", "medium", "hard"] as const).map((d) => (
                      <button key={d} onClick={() => setDifficulty(d)}
                        className="flex-1 px-2 py-1.5 rounded text-xs font-medium capitalize transition-all"
                        style={{ background: difficulty === d ? theme.colors.primary : theme.colors.surface, color: difficulty === d ? theme.colors.background : theme.colors.textMuted }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-2 block" style={{ color: theme.colors.textMuted }}>Language</label>
                  <div className="flex gap-1">
                    {([{ key: "en" as Language, label: "EN" }, { key: "id" as Language, label: "ID" }]).map((l) => (
                      <button key={l.key} onClick={() => setLanguage(l.key)}
                        className="flex-1 px-2 py-1.5 rounded text-xs font-medium transition-all"
                        style={{ background: language === l.key ? theme.colors.primary : theme.colors.surface, color: language === l.key ? theme.colors.background : theme.colors.textMuted }}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {mode === "race" && (
                <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${theme.colors.border}` }}>
                  <div className="flex gap-2 items-center">
                    {roomCode ? (
                      <>
                        <span className="text-xs" style={{ color: theme.colors.textMuted }}>Room:</span>
                        <code className="text-sm font-mono font-bold px-3 py-1.5 rounded" style={{ background: theme.colors.background, color: theme.colors.primary }}>{roomCode}</code>
                        <button onClick={copyCode} className="p-1.5 rounded" style={{ background: theme.colors.surface }}>
                          {copied ? <Check size={14} style={{ color: "#22c55e" }} /> : <Copy size={14} style={{ color: theme.colors.textMuted }} />}
                        </button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" onClick={createRoom}>Create Room</Button>
                        <span className="text-xs" style={{ color: theme.colors.textMuted }}>or</span>
                        <input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="Join code"
                          className="w-24 px-2 py-1 rounded text-xs font-mono text-center"
                          style={{ background: theme.colors.background, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
                          maxLength={6} />
                        <Button size="sm" variant="secondary" onClick={joinRoom}>Join</Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {mode === "race" && players.length > 0 && (
        <div className="mb-6">
          <RaceTrack players={players} theme={theme} />
        </div>
      )}

      <Card variant="glass" className="p-6 mb-4">
        <div
          className="text-xl leading-relaxed font-mono cursor-text select-none min-h-[80px]"
          onClick={() => inputRef.current?.focus()}
        >
          {words.map((w, wi) => (
            <span key={wi} style={{
              padding: "1px 2px",
              borderRadius: "3px",
              background: wi === currentWordIdx ? `${theme.colors.primary}15` : "transparent",
            }}>
              {w.word.split("").map((char, ci) => {
                let style: React.CSSProperties = { color: "#555" };
                if (wi < currentWordIdx) {
                  style = { color: w.status === "correct" ? "#22c55e" : "#ef4444" };
                } else if (wi === currentWordIdx) {
                  if (ci < typedInput.length) {
                    style = {
                      color: typedInput[ci] === char ? "#22c55e" : "#ef4444",
                      borderBottom: `2px solid ${typedInput[ci] === char ? "#22c55e" : "#ef4444"}`,
                    };
                  } else if (ci === typedInput.length) {
                    style = {
                      color: "#fff",
                      borderBottom: `2px solid ${theme.colors.primary}`,
                    };
                  }
                }
                return <span key={ci} style={style}>{char}</span>;
              })}
              <span style={{ color: "transparent" }}> </span>
            </span>
          ))}
        </div>
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 w-0 h-0"
          onKeyDown={handleKeyDown}
          value={typedInput}
          readOnly
          autoFocus
        />
      </Card>

      <div className="flex items-center justify-center gap-8 mb-6 py-3">
        {[
          { label: "wpm", value: wpm, color: theme.colors.primary },
          { label: "acc", value: `${accuracy}%`, color: "#22c55e" },
          { label: "time", value: `${timeLeft}s`, color: timeLeft <= 10 ? "#ef4444" : theme.colors.accent },
          { label: "raw", value: correctChars + incorrectChars, color: theme.colors.textMuted },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: theme.colors.textMuted }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mb-8">
        {!isActive && !isFinished && (
          <Button onClick={startTest} size="lg" glow>
            <Keyboard size={20} /> Start Typing
          </Button>
        )}
        {isActive && (
          <p className="text-sm flex items-center gap-2" style={{ color: theme.colors.textMuted }}>
            Press <kbd className="px-2 py-0.5 rounded text-xs" style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>Tab</kbd> to restart
          </p>
        )}
      </div>

      <AnimatePresence>
        {isFinished && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card variant="glow" className="p-8 text-center mb-8">
              <Trophy size={48} className="mx-auto mb-4" style={{ color: theme.colors.primary }} />
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Cinzel', serif" }}>Test Selesai!</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[
                  { label: "WPM", value: wpm, color: theme.colors.primary },
                  { label: "Accuracy", value: `${accuracy}%`, color: "#22c55e" },
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
                <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${theme.colors.border}` }}>
                  <h3 className="text-lg font-bold mb-3" style={{ color: theme.colors.text }}>Race Results</h3>
                  <div className="space-y-1">
                    {[...players].sort((a, b) => b.wpm - a.wpm).map((p, i) => (
                      <div key={p.id} className="flex items-center gap-3 px-4 py-2 rounded-lg"
                        style={{ background: p.isYou ? `${theme.colors.primary}15` : "transparent" }}>
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
                <Button onClick={startTest} glow><RotateCcw size={16} /> Main Lagi</Button>
                <Button variant="secondary" onClick={() => setIsFinished(false)}>Leaderboard</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <tr key={result.id} style={{ color: theme.colors.text, borderTop: `1px solid ${theme.colors.border}` }}>
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
    </div>
  );
}

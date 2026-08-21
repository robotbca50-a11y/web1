"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Keyboard, Clock, RotateCcw, Users, User, Trophy,
  Settings, Zap, Target, Flame, Copy, Check, Loader2,
  ChevronDown
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

function generateText(difficulty: string, language: Language, wordCount: number = 50): string {
  const wordList = getWordList(difficulty, language);
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(wordList[Math.floor(Math.random() * wordList.length)]);
  }
  return words.join(" ");
}

export default function TypingTestPage() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [timeLimit, setTimeLimit] = useState(60);
  const [mode, setMode] = useState<"solo" | "friend">("solo");
  const [language, setLanguage] = useState<Language>("en");

  // Test state
  const [text, setText] = useState("");
  const [words, setWords] = useState<WordState[]>([]);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const [typedInput, setTypedInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Stats
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [maxWpm, setMaxWpm] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);

  // Multiplayer
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [opponentWpm, setOpponentWpm] = useState(0);
  const [opponentAccuracy, setOpponentAccuracy] = useState(100);

  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [leaderboard, setLeaderboard] = useState<TypingResult[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  const progress = useMemo(() => {
    if (words.length === 0) return 0;
    return Math.round((currentWordIdx / words.length) * 100);
  }, [currentWordIdx, words.length]);

  // Initialize text
  useEffect(() => {
    const newText = generateText(difficulty, language);
    setText(newText);
    const wordList: WordState[] = newText.split(" ").map((w) => ({
      word: w,
      typed: "",
      status: "pending",
    }));
    if (wordList.length > 0) wordList[0].status = "current";
    setWords(wordList);
    setCurrentWordIdx(0);
    setCurrentCharIdx(0);
  }, [difficulty, language]);

  // Timer - only depends on isActive and isFinished (not timeLeft!)
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
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isFinished]);

  // Calculate live WPM
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

  const startTest = () => {
    const newText = generateText(difficulty, language);
    setText(newText);
    const wordList: WordState[] = newText.split(" ").map((w) => ({
      word: w,
      typed: "",
      status: "pending",
    }));
    if (wordList.length > 0) wordList[0].status = "current";
    setWords(wordList);
    setCurrentWordIdx(0);
    setCurrentCharIdx(0);
    setTypedInput("");
    setTimeLeft(timeLimit);
    setIsActive(true);
    setIsFinished(false);
    setStartTime(Date.now());
    setWpm(0);
    setAccuracy(100);
    setMaxWpm(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setTotalTyped(0);
    setOpponentWpm(0);
    setOpponentAccuracy(100);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const finishTest = useCallback(() => {
    setIsActive(false);
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate final stats
    const total = correctChars + incorrectChars;
    const finalAccuracy = total > 0 ? calculateAccuracy(correctChars, total) : 0;
    setAccuracy(finalAccuracy);

    // Save result
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
      startTest();
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      if (currentCharIdx > 0) {
        setCurrentCharIdx((prev) => prev - 1);
        setTypedInput((prev) => prev.slice(0, -1));
      }
      return;
    }

    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const currentWord = words[currentWordIdx];
      if (!currentWord) return;

      const newTyped = typedInput + " ";
      const isCorrect = currentWord.word.startsWith(newTyped.trim());
      setTypedInput(newTyped);
      setTotalTyped((prev) => prev + 1);
      if (isCorrect) {
        setCorrectChars((prev) => prev + 1);
      } else {
        setIncorrectChars((prev) => prev + 1);
      }

      // Show space briefly then advance
      setWords((prev) =>
        prev.map((w, i) => {
          if (i === currentWordIdx) {
            const finalTyped = w.typed || typedInput;
            const wordCorrect = finalTyped === w.word;
            return { ...w, typed: finalTyped, status: wordCorrect ? "correct" : "incorrect" };
          }
          if (i === currentWordIdx + 1) {
            return { ...w, status: "current" };
          }
          return w;
        })
      );

      if (currentWordIdx < words.length - 1) {
        setCurrentWordIdx((prev) => prev + 1);
        setCurrentCharIdx(0);
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

      const newTyped = typedInput + e.key;
      const isCorrectSoFar = currentWord.word.startsWith(newTyped);

      setTypedInput(newTyped);
      setCurrentCharIdx((prev) => prev + 1);
      setTotalTyped((prev) => prev + 1);

      if (isCorrectSoFar) {
        setCorrectChars((prev) => prev + 1);
      } else {
        setIncorrectChars((prev) => prev + 1);
      }


    }
  };

  // Multiplayer handlers
  const createRoom = async () => {
    const code = generateRoomCode();
    setRoomCode(code);
    setIsHost(true);
    // In a real app, this would create a Supabase realtime channel
  };

  const joinRoom = async () => {
    if (joinCode.length === 6) {
      setRoomCode(joinCode.toUpperCase());
      setOpponentReady(true);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Load leaderboard
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
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={16} /> Settings
          </Button>
          <Button variant="ghost" size="sm" onClick={startTest}>
            <RotateCcw size={16} /> Restart
          </Button>
        </div>
      </motion.div>

      {/* Settings Bar */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <Card variant="glass" className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Difficulty */}
                <div>
                  <label className="text-xs font-medium mb-2 block" style={{ color: theme.colors.textMuted }}>
                    <Target size={12} className="inline mr-1" /> Difficulty
                  </label>
                  <div className="flex gap-1">
                    {(["easy", "medium", "hard"] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className="flex-1 px-2 py-1.5 rounded text-xs font-medium capitalize transition-all"
                        style={{
                          background: difficulty === d ? theme.colors.primary : theme.colors.surface,
                          color: difficulty === d ? theme.colors.background : theme.colors.textMuted,
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="text-xs font-medium mb-2 block" style={{ color: theme.colors.textMuted }}>
                    <Clock size={12} className="inline mr-1" /> Time
                  </label>
                  <div className="flex gap-1">
                    {[15, 30, 60, 120].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimeLimit(t)}
                        className="flex-1 px-1 py-1.5 rounded text-xs font-medium transition-all"
                        style={{
                          background: timeLimit === t ? theme.colors.primary : theme.colors.surface,
                          color: timeLimit === t ? theme.colors.background : theme.colors.textMuted,
                        }}
                      >
                        {t}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode */}
                <div>
                  <label className="text-xs font-medium mb-2 block" style={{ color: theme.colors.textMuted }}>
                    <Users size={12} className="inline mr-1" /> Mode
                  </label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setMode("solo")}
                      className="flex-1 px-2 py-1.5 rounded text-xs font-medium transition-all flex items-center justify-center gap-1"
                      style={{
                        background: mode === "solo" ? theme.colors.primary : theme.colors.surface,
                        color: mode === "solo" ? theme.colors.background : theme.colors.textMuted,
                      }}
                    >
                      <User size={12} /> Solo
                    </button>
                    <button
                      onClick={() => setMode("friend")}
                      className="flex-1 px-2 py-1.5 rounded text-xs font-medium transition-all flex items-center justify-center gap-1"
                      style={{
                        background: mode === "friend" ? theme.colors.primary : theme.colors.surface,
                        color: mode === "friend" ? theme.colors.background : theme.colors.textMuted,
                      }}
                    >
                      <Users size={12} /> Friend
                    </button>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="text-xs font-medium mb-2 block" style={{ color: theme.colors.textMuted }}>
                    🌐 Language
                  </label>
                  <div className="flex gap-1">
                    {([
                      { key: "en" as Language, label: "EN", full: "English" },
                      { key: "id" as Language, label: "ID", full: "Indonesia" },
                    ]).map((lang) => (
                      <button
                        key={lang.key}
                        onClick={() => setLanguage(lang.key)}
                        className="flex-1 px-2 py-1.5 rounded text-xs font-medium transition-all"
                        style={{
                          background: language === lang.key ? theme.colors.primary : theme.colors.surface,
                          color: language === lang.key ? theme.colors.background : theme.colors.textMuted,
                        }}
                        title={lang.full}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Room (if friend mode) */}
                {mode === "friend" && (
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: theme.colors.textMuted }}>
                      Room
                    </label>
                    {roomCode ? (
                      <div className="flex items-center gap-2">
                        <code
                          className="flex-1 text-sm font-mono font-bold px-2 py-1.5 rounded text-center"
                          style={{ background: theme.colors.surface, color: theme.colors.primary }}
                        >
                          {roomCode}
                        </code>
                        <button onClick={copyCode} className="p-1.5 rounded" style={{ background: theme.colors.surface }}>
                          {copied ? <Check size={14} style={{ color: "#22c55e" }} /> : <Copy size={14} style={{ color: theme.colors.textMuted }} />}
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={createRoom}>Create</Button>
                        <input
                          value={joinCode}
                          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                          placeholder="Code"
                          className="w-20 px-2 py-1 rounded text-xs font-mono text-center"
                          style={{ background: theme.colors.surface, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
                          maxLength={6}
                        />
                        <Button size="sm" variant="secondary" onClick={joinRoom}>Join</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Bar */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { label: "WPM", value: wpm, icon: Zap, color: theme.colors.primary },
          { label: "Accuracy", value: `${accuracy}%`, icon: Target, color: "#22c55e" },
          { label: "Time", value: `${timeLeft}s`, icon: Clock, color: timeLeft <= 10 ? "#ef4444" : theme.colors.accent },
          { label: "Max WPM", value: maxWpm, icon: Flame, color: theme.colors.secondary },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} variant="glass" className="p-3 text-center">
              <Icon size={16} className="mx-auto mb-1" style={{ color: stat.color }} />
              <div className="text-xl font-bold font-mono" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: theme.colors.textMuted }}>{stat.label}</div>
            </Card>
          );
        })}
      </motion.div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="typing-progress rounded-full">
          <motion.div
            className="typing-progress-bar rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: theme.colors.textMuted }}>
            Word {currentWordIdx + 1} / {words.length}
          </span>
          <span className="text-xs font-mono" style={{ color: theme.colors.primary }}>
            {progress}%
          </span>
        </div>
      </div>

      {/* Typing Area */}
      <Card variant="glass" className="p-6 mb-6">
        <div
          className="text-lg leading-loose font-mono cursor-text select-none min-h-[120px] flex flex-wrap gap-x-2 gap-y-1"
          onClick={() => inputRef.current?.focus()}
        >
          {words.map((w, wi) => (
            <span key={wi} className="typing-word relative">
              {w.word.split("").map((char, ci) => {
                let charClass = "typing-char untyped";
                if (wi < currentWordIdx) {
                  charClass = `typing-char ${w.status === "correct" ? "correct" : "incorrect"}`;
                } else if (wi === currentWordIdx) {
                  if (ci < typedInput.length) {
                    charClass = `typing-char ${typedInput[ci] === char ? "correct" : "incorrect"}`;
                  } else if (ci === typedInput.length) {
                    charClass = "typing-char current";
                  }
                }
                return (
                  <span key={ci} className={charClass}>
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
        </div>

        {/* Hidden input */}
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

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-8">
        {!isActive && !isFinished && (
          <Button onClick={startTest} size="lg" glow>
            <Keyboard size={20} /> Start Typing
          </Button>
        )}
        {isActive && (
          <p className="text-sm flex items-center gap-2" style={{ color: theme.colors.textMuted }}>
            Press <kbd className="px-2 py-0.5 rounded text-xs" style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>Tab</kbd> + <kbd className="px-2 py-0.5 rounded text-xs" style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>Enter</kbd> to restart
          </p>
        )}
      </div>

      {/* Results */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card variant="glow" className="p-8 text-center mb-8">
              <Trophy size={48} className="mx-auto mb-4" style={{ color: theme.colors.primary }} />
              <h2 className="text-3xl font-bold mb-2 gradient-text">Test Selesai!</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <div className="text-3xl font-bold font-mono" style={{ color: theme.colors.primary }}>{wpm}</div>
                  <div className="text-sm" style={{ color: theme.colors.textMuted }}>WPM</div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-mono" style={{ color: "#22c55e" }}>{accuracy}%</div>
                  <div className="text-sm" style={{ color: theme.colors.textMuted }}>Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-mono" style={{ color: theme.colors.secondary }}>{maxWpm}</div>
                  <div className="text-sm" style={{ color: theme.colors.textMuted }}>Max WPM</div>
                </div>
                <div>
                  <div className="text-3xl font-bold font-mono" style={{ color: theme.colors.accent }}>{correctChars + incorrectChars}</div>
                  <div className="text-sm" style={{ color: theme.colors.textMuted }}>Total Chars</div>
                </div>
              </div>

              {mode === "friend" && (
                <div className="mt-6 pt-6 border-t border-[var(--theme-border)]">
                  <h3 className="text-lg font-bold mb-2" style={{ color: theme.colors.text }}>Lawan</h3>
                  <div className="flex justify-center gap-8">
                    <div>
                      <div className="text-2xl font-bold font-mono" style={{ color: theme.colors.textMuted }}>{opponentWpm}</div>
                      <div className="text-xs" style={{ color: theme.colors.textMuted }}>WPM</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold font-mono" style={{ color: theme.colors.textMuted }}>{opponentAccuracy}%</div>
                      <div className="text-xs" style={{ color: theme.colors.textMuted }}>Accuracy</div>
                    </div>
                  </div>
                  <p className="mt-2 font-bold" style={{ color: wpm > opponentWpm ? "#22c55e" : wpm < opponentWpm ? "#ef4444" : theme.colors.text }}>
                    {wpm > opponentWpm ? "Kamu Menang!" : wpm < opponentWpm ? "Kamu Kalah!" : "Seri!"}
                  </p>
                </div>
              )}

              <div className="flex justify-center gap-3 mt-6">
                <Button onClick={startTest} glow>
                  <RotateCcw size={16} /> Main Lagi
                </Button>
                <Button variant="secondary" onClick={() => setIsFinished(false)}>
                  Lihat Leaderboard
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard */}
      <Card variant="glass" className="p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Trophy size={20} style={{ color: theme.colors.primary }} />
          Leaderboard
          <Badge variant="primary" className="ml-2 capitalize">{difficulty}</Badge>
        </h2>

        {leaderboard.length === 0 ? (
          <p className="text-center py-8 text-sm" style={{ color: theme.colors.textMuted }}>
            Belum ada hasil. Jadilah yang pertama!
          </p>
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
                  <tr
                    key={result.id}
                    className="border-t border-[var(--theme-border)]"
                    style={{ color: theme.colors.text }}
                  >
                    <td className="py-2.5 px-3 font-mono">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                    </td>
                    <td className="py-2.5 px-3">{result.nickname || "Anonymous"}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold" style={{ color: theme.colors.primary }}>
                      {result.wpm}
                    </td>
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

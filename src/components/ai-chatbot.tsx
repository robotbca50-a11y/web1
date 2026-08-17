"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, Bot, User, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";
import { createClient } from "@/lib/supabase/client";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  feedback?: number;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Halo! Saya AI assistant Web Utama. Ada yang bisa saya bantu? Saya bisa menjawab pertanyaan tentang fitur web, memberikan tips, atau membantu menyelesaikan masalah.",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      // Get knowledge base
      const { data: knowledge } = await supabase
        .from("ai_knowledge")
        .select("topic, content, category");

      // Get recent conversations for context
      const { data: recentConvos } = await supabase
        .from("ai_conversations")
        .select("role, content")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true })
        .limit(10);

      // Build context
      const knowledgeContext = knowledge
        ?.map((k: { category: string; topic: string; content: string }) => `[${k.category}] ${k.topic}: ${k.content}`)
        .join("\n") || "";

      const conversationHistory = recentConvos
        ?.map((c: { role: string; content: string }) => `${c.role}: ${c.content}`)
        .join("\n") || "";

      // Simple AI response generation (without external API)
      const response = generateResponse(
        userMsg.content,
        knowledgeContext,
        conversationHistory
      );

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Save conversation
      await supabase.from("ai_conversations").insert([
        {
          session_id: sessionId,
          role: "user",
          content: userMsg.content,
        },
        {
          session_id: sessionId,
          role: "assistant",
          content: response,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (msgId: string, feedback: number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, feedback } : m))
    );

    const supabase = createClient();
    await supabase
      .from("ai_conversations")
      .update({ feedback })
      .eq("session_id", sessionId);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
          color: theme.colors.background,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-[60] w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: theme.colors.background,
              border: `1px solid ${theme.colors.border}`,
            }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            {/* Header */}
            <div
              className="p-4 flex items-center gap-3"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.secondary}20)`,
                borderBottom: `1px solid ${theme.colors.border}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `${theme.colors.primary}30` }}
              >
                <Bot size={20} style={{ color: theme.colors.primary }} />
              </div>
              <div>
                <h3 className="font-bold text-sm" style={{ color: theme.colors.text }}>
                  Web Utama AI
                </h3>
                <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                  AI Assistant & IT Support
                </p>
              </div>
              <div
                className="ml-auto w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#22c55e" }}
              />
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1"
                      style={{ background: `${theme.colors.primary}20` }}
                    >
                      <Bot size={14} style={{ color: theme.colors.primary }} />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                      msg.role === "user" ? "rounded-br-md" : "rounded-bl-md"
                    }`}
                    style={{
                      background:
                        msg.role === "user"
                          ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`
                          : theme.colors.surface,
                      color: msg.role === "user" ? theme.colors.background : theme.colors.text,
                      border: msg.role === "assistant" ? `1px solid ${theme.colors.border}` : "none",
                    }}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "assistant" && (
                    <div className="flex flex-col gap-0.5 mt-1">
                      <button
                        onClick={() => handleFeedback(msg.id, 1)}
                        className="p-1 rounded hover:bg-[var(--theme-surface)] transition-colors"
                        style={{ color: msg.feedback === 1 ? "#22c55e" : theme.colors.textMuted }}
                      >
                        <ThumbsUp size={12} />
                      </button>
                      <button
                        onClick={() => handleFeedback(msg.id, -1)}
                        className="p-1 rounded hover:bg-[var(--theme-surface)] transition-colors"
                        style={{ color: msg.feedback === -1 ? "#ef4444" : theme.colors.textMuted }}
                      >
                        <ThumbsDown size={12} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `${theme.colors.primary}20` }}
                  >
                    <Bot size={14} style={{ color: theme.colors.primary }} />
                  </div>
                  <div
                    className="px-3 py-2 rounded-2xl rounded-bl-md"
                    style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}
                  >
                    <Loader2 size={16} className="animate-spin" style={{ color: theme.colors.primary }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              className="p-3"
              style={{ borderTop: `1px solid ${theme.colors.border}` }}
            >
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ketik pesan..."
                  className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                  style={{
                    background: theme.colors.surface,
                    color: theme.colors.text,
                    border: `1px solid ${theme.colors.border}`,
                  }}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 rounded-xl transition-all disabled:opacity-50"
                  style={{
                    background: theme.colors.primary,
                    color: theme.colors.background,
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Simple rule-based AI response (no external API needed)
function generateResponse(
  question: string,
  knowledgeBase: string,
  _history: string
): string {
  const q = question.toLowerCase();

  // Greeting
  if (q.match(/^(halo|hi|hey|hello|hei|yo|pagi|siang|sore|malam)/)) {
    return "Halo! Selamat datang di Web Utama. Ada yang bisa saya bantu hari ini? Saya bisa membantu tentang fitur web, tips typing test, atau pertanyaan umum lainnya.";
  }

  // Typing test
  if (q.includes("typing") || q.includes("tiping") || q.includes("mengetik") || q.includes("wpm")) {
    if (q.includes("mulai") || q.includes("cara") || q.includes("gimana") || q.includes("how")) {
      return "Untuk memulai Typing Test:\n1. Pilih mode waktu (15s, 30s, 60s, 120s)\n2. Pilih difficulty (Easy/Medium/Hard)\n3. Klik Start atau tekan Tab+Enter\n4. Ketik kata yang muncul sesuai urutan\n5. WPM dan accuracy dihitung otomatis!\n\nTips: Fokus pada accuracy dulu, WPM akan naik sendiri seiring waktu.";
    }
    if (q.includes("friend") || q.includes("teman") || q.includes("multiplayer") || q.includes("bareng")) {
      return "Untuk bermain dengan teman:\n1. Pilih mode 'Friend' di typing test\n2. Klik 'Create Room' untuk membuat room\n3. Share 6-digit room code ke teman\n4. Teman klik 'Join Room' dan masukkan code\n5. Game dimulai saat kedua pemain ready!\n\nPemenang ditentukan oleh WPM tertinggi dengan accuracy minimal 80%.";
    }
    if (q.includes("hard") || q.includes("sulit") || q.includes("tips")) {
      return "Tips meningkatkan WPM:\n1. Jangan terburu-buru, fokus accuracy\n2. Latihan 15-30 menit setiap hari\n3. Mulai dari Easy, naik ke Hard secara bertahap\n4. Gunakan semua jari, bukan 2-3 jari\n5. Jangan melihat keyboard\n6. Beristirahat jika jari mulai lelah\n\nIngat: Accuracy 95% dengan 50 WPM lebih baik dari 30% accuracy dengan 100 WPM!";
    }
    return "Typing Test adalah fitur untuk melatih kemampuan mengetik. Tersedia 3 difficulty:\n- Easy: Kata-kata umum, cocok untuk pemula\n- Medium: Campuran kata, tantangan sedang\n- Hard: Kata kompleks & snippet kode\n\nKamu bisa berlatih solo atau bersama teman. Mau tahu lebih detail tentang fitur tertentu?";
  }

  // Notepad
  if (q.includes("notepad") || q.includes("catatan") || q.includes("note") || q.includes("notes")) {
    return "Notepad adalah fitur catatan pribadi:\n- Klik '+ New Note' untuk membuat catatan baru\n- Ketik judul dan isi catatan\n- Klik ikon pin untuk menyematkan catatan penting\n- Catatan tersimpan otomatis ke cloud (Supabase)\n- Bisa diakses dari device manapun setelah login\n\nTips: Gunakan catatan untuk menyimpan room code, daftar task, atau ide-ide penting!";
  }

  // Broadcast
  if (q.includes("broadcast") || q.includes("siaran") || q.includes("info") || q.includes("pengumuman")) {
    return "Broadcast adalah halaman informasi dari admin:\n- Priority Low (abu-abu): Info biasa\n- Priority Normal (biru): Info penting\n- Priority High (kuning): Perlu perhatian\n- Priority Urgent (merah): Sangat penting!\n\nBroadcast terbaru muncul di atas. Halaman ini diupdate oleh admin secara berkala.";
  }

  // Theme
  if (q.includes("theme") || q.includes("tema") || q.includes("tampilan") || q.includes("warna") || q.includes("mode")) {
    return "Web Utama punya 10 tema keren:\n- Cyborg: Teknologi futuristik\n- Samurai: Elegansi Jepang\n- Aurora: Cahaya utara\n- Marvel: Superhero\n- Medieval: Abad pertengahan\n- Cyberpunk: Neon futuristik\n- Space: Luar angkasa\n- Nature: Alam hijau\n- Deep Ocean: Samudra dalam\n- Volcanic: Magma\n\nKlik tombol 'Theme' di navbar untuk ganti tema. Tersimpan otomatis!";
  }

  // AI
  if (q.includes("ai") || q.includes("bot") || q.includes("robot") || q.includes("kamu siapa")) {
    return "Saya adalah AI assistant custom yang dibangun khusus untuk Web Utama. Saya bisa:\n- Menjawab pertanyaan tentang fitur web\n- Memberikan tips typing test\n- Membantu troubleshooting\n- Menjadi panduan penggunaan web\n\nSaya terus belajar dari percakapan untuk memberikan jawaban yang lebih baik. Silakan bertanya apa saja!";
  }

  // Admin/Master
  if (q.includes("admin") || q.includes("master") || q.includes("panel")) {
    return "Master Panel (Admin) adalah area khusus admin:\n- Dashboard: Statistik dan overview\n- Links: Kelola semua link/project\n- Broadcasts: Kirim pengumuman\n- AI Settings: Kelola knowledge base AI\n\nHanya admin yang bisa mengakses. Login diperlukan.";
  }

  // Multiplayer
  if (q.includes("room") || q.includes("multiplayer") || q.includes("bersama")) {
    return "Multiplayer Typing Test:\n1. Pilih mode 'Friend'\n2. Create Room → dapat room code 6 digit\n3. Share code ke teman\n4. Teman: Join Room → masukkan code\n5. Tunggu kedua pemain siap\n6. Race dimulai!\n\nScore dihitung dari WPM + Accuracy. Yang menang adalah yang WPM lebih tinggi dengan accuracy minimal 80%.";
  }

  // Error / help
  if (q.includes("error") || q.includes("bug") || q.includes("rusak") || q.includes("masalah") || q.includes("help") || q.includes("bantuan")) {
    return "Jika kamu mengalami masalah:\n1. Coba refresh halaman (F5)\n2. Clear browser cache\n3. Coba browser lain\n4. Pastikan koneksi internet stabil\n5. Login ulang jika diperlukan\n\nJika masalah berlanjut, hubungi admin. Saya juga bisa membantu diagnose masalah - ceritakan error yang kamu lihat!";
  }

  // Thanks
  if (q.includes("terima kasih") || q.includes("thanks") || q.includes("makasih") || q.includes("thx")) {
    return "Sama-sama! Senang bisa membantu. Jangan ragu untuk bertanya lagi kapan saja. Have a great day! 😊";
  }

  // Default / fallback
  return `Pertanyaan yang menarik! Saya belum sepenuhnya memahami pertanyaan Anda, tapi saya bisa membantu tentang:\n\n- Typing Test (cara bermain, tips, multiplayer)\n- Notepad (cara pakai fitur catatan)\n- Broadcast (informasi pengumuman)\n- Theme (cara ganti tampilan)\n- AI & Fitur Web lainnya\n\nCoba tanyakan lebih spesifik, atau ketik "help" untuk daftar lengkap!`;
}

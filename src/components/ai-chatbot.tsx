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
      // Get knowledge base from public API (bypasses RLS)
      const knowledgeRes = await fetch("/api/public/ai-knowledge");
      const knowledgeJson = await knowledgeRes.json();
      const knowledge = knowledgeJson.data || [];

      // Build context
      const knowledgeContext = knowledge
        ?.map((k: { category: string; topic: string; content: string }) => `[${k.category}] ${k.topic}: ${k.content}`)
        .join("\n") || "";

      // Build conversation history from local state
      const conversationHistory = messages
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n");

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

      // Save conversation (best effort, may fail if RLS blocks)
      try {
        const supabase = createClient();
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
        // Conversation save is optional, don't break chat
      }
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

    // Save feedback best effort
    try {
      const supabase = createClient();
      await supabase
        .from("ai_conversations")
        .update({ feedback })
        .eq("session_id", sessionId);
    } catch {
      // Ignore
    }
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

// Smart AI response generator with knowledge base search
function generateResponse(
  question: string,
  knowledgeBase: string,
  history: string
): string {
  const q = question.toLowerCase().trim();

  // ========== GREETING ==========
  if (q.match(/^(halo|hi|hey|hello|hei|yo|pagi|siang|sore|malam|assalam)/)) {
    return "Halo! Selamat datang di Web Utama. Saya AI assistant yang bisa membantu tentang:\n\n- Rumus Excel & Google Sheets\n- Matematika & Statistik\n- Coding (Python, JS, HTML, SQL, Git)\n- Tips menulis (email, CV, laporan)\n- Fitur Web Utama\n\nAda yang ingin kamu tanyakan?";
  }

  // ========== EXCEL / GOOGLE SHEETS ==========
  const excelKeywords = ["excel", "rumus", "formula", "spreadsheet", "sel", "sheet",
    "vlookup", "hlookup", "index", "match", "xlookup", "pivot",
    "sumif", "countif", "averageif", "query", "filter", "sort",
    "arrayformula", "sparkline", "importhtml", "google sheets",
    "tabel", "kolom", "baris", "cell", "range"];

  if (excelKeywords.some(kw => q.includes(kw))) {
    // Search knowledge base for excel/gsheet entries
    const excelMatch = searchKnowledge(q, knowledgeBase, ["excel", "gsheet"]);
    if (excelMatch) return excelMatch;

    // Specific formula lookups
    if (q.includes("vlookup")) return getKnowledgeTopic("vlookup", knowledgeBase) ||
      "VLOOKUP: =VLOOKUP(cari, range, kolom_ke, FALSE)\nCari nilai di kolom pertama range, ambil dari kolom ke-n.\nFALSE = exact match. Hanya bisa mencari ke KANAN.";

    if (q.includes("xlookup")) return getKnowledgeTopic("xlookup", knowledgeBase) ||
      "XLOOKUP: =XLOOKUP(cari, range_cari, range_ambil, \"default\", 0)\nBisa ke kiri, ke atas. Menggantikan VLOOKUP.";

    if (q.includes("index") && q.includes("match")) return getKnowledgeTopic("index_match", knowledgeBase) ||
      "INDEX-MATCH: =INDEX(ambil,MATCH(cari,range,0))\nLebih fleksibel dari VLOOKUP, bisa ke kiri.";

    if (q.includes("query")) return getKnowledgeTopic("gsheet_query", knowledgeBase) ||
      "QUERY: =QUERY(data,\"SELECT A, SUM(B) WHERE C='X' GROUP BY A\",1)\nSQL-like query di Google Sheets. Paling powerful!";

    if (q.includes("iferror")) return getKnowledgeTopic("iferror", knowledgeBase) ||
      "IFERROR: =IFERROR(formula,\"pesan error\")\nTangani error seperti #DIV/0! atau #N/A.";

    if (q.includes("sumif")) return getKnowledgeTopic("sumif", knowledgeBase) ||
      "SUMIF: =SUMIF(kriteria_range,kriteria,nilai_range)\nSUMIFS untuk multi-kriteria.";

    if (q.includes("countif")) return getKnowledgeTopic("countif", knowledgeBase) ||
      "COUNTIF: =COUNTIF(range,kriteria)\nCOUNTIFS untuk multi-kriteria.";

    if (q.includes("arrayformula")) return getKnowledgeTopic("gsheet_arrayformula", knowledgeBase) ||
      "ARRAYFORMULA: =ARRAYFORMULA(IF(range>0,range*range2,\"\"))\nTerapkan formula ke seluruh kolom.";

    return "Saya tahu banyak tentang Excel & Google Sheets! Coba tanyakan spesifik:\n\n- Rumus lookup: VLOOKUP, INDEX-MATCH, XLOOKUP\n- Logical: IF, IFS, AND, OR, IFERROR\n- Agregasi: SUM, AVERAGE, COUNT, SUMIF\n- Google Sheets: QUERY, FILTER, SORT, UNIQUE\n- Text: LEFT, RIGHT, MID, CONCATENATE\n- Date: TODAY, NOW, DATEDIF\n\nContoh: \"Bagaimana cara pakai VLOOKUP?\"";
  }

  // ========== MATH ==========
  const mathKeywords = ["matematika", "math", "hitung", "angka", "rumus",
    "persamaan", "kuadrat", "pythagoras", "persen", "prosentase",
    "statistik", "mean", "median", "modus", "standar deviasi",
    "trigonometri", "sin", "cos", "tan", "pi", "luas", "volume",
    "keliling", "algebra", "kalkulus"];

  if (mathKeywords.some(kw => q.includes(kw))) {
    if (q.includes("persen") || q.includes("prosentase") || q.includes("diskon") || q.includes("ppn")) {
      return getKnowledgeTopic("math_percentage", knowledgeBase) ||
        "Persen:\n- X% dari Y = (X/100) x Y\n- Diskon: Harga x (1 - Diskon/100)\n- Pajak: Harga x (1 + PPN/100)\n- Profit: ((Jual-Beli)/Beli) x 100\n- Bunga majemuk: FV = PV x (1+r)^n";
    }
    if (q.includes("statistik") || q.includes("mean") || q.includes("median") || q.includes("modus")) {
      return getKnowledgeTopic("math_statistics", knowledgeBase) ||
        "Statistik:\n- Mean: sum(xi) / n\n- Median: nilai tengah\n- Modus: paling sering\n- Std Dev: sqrt(sum((xi-mean)^2)/n)";
    }
    if (q.includes("trigonometri") || q.includes("sin") || q.includes("cos") || q.includes("tan")) {
      return getKnowledgeTopic("math_trigonometry", knowledgeBase) ||
        "Trigonometri: sin=depan/miring, cos=samping/miring, tan=depan/samping\nsin2+cos2=1";
    }
    if (q.includes("pythagoras") || q.includes("segitiga")) {
      return "Pythagoras: a2 + b2 = c2\nContoh: sisi miring = sqrt(3^2 + 4^2) = sqrt(9+16) = sqrt(25) = 5";
    }
    if (q.includes("volume") || q.includes("luas")) {
      return "Rumus Luas & Volume:\n- Persegi: s2, Persegi Panjang: pxl\n- Lingkaran: pi*r2, Keliling: 2*pi*r\n- Segitiga: (alas x tinggi) / 2\n- Volume Bola: (4/3)*pi*r3\n- Volume Tabung: pi*r2*h\n- Volume Kerucut: (1/3)*pi*r2*h";
    }
    if (q.includes("kuadrat") || q.includes("persamaan")) {
      return "Persamaan Kuadrat: ax2 + bx + c = 0\nx = (-b +- sqrt(b2 - 4ac)) / 2a\nDiscriminant: D = b2 - 4ac\n- D > 0: 2 akar real\n- D = 0: 1 akar kembar\n- D < 0: akar kompleks";
    }

    const mathMatch = searchKnowledge(q, knowledgeBase, ["math"]);
    if (mathMatch) return mathMatch;

    return "Saya bisa bantu matematika! Contoh topik:\n\n- Persen & diskon\n- Pythagoras & geometri\n- Statistik (mean, median, modus)\n- Trigonometri\n- Persamaan kuadrat\n- Luas & volume\n\nCoba tanyakan spesifik: \"Berapa 15% dari 250.000?\"";
  }

  // ========== CODING ==========
  const codingKeywords = ["coding", "program", "code", "python", "javascript", "js",
    "html", "css", "react", "nextjs", "sql", "git", "github",
    "function", "array", "loop", "for", "while", "class",
    "api", "json", "typescript", "node", "backend", "frontend"];

  if (codingKeywords.some(kw => q.includes(kw))) {
    if (q.includes("python")) return getKnowledgeTopic("coding_python", knowledgeBase) ||
      "Python basics: variable, if/elif/else, for/while, list, dict, def, lambda, comprehension.";
    if (q.includes("javascript") || q.includes(" js ")) return getKnowledgeTopic("coding_javascript", knowledgeBase) ||
      "JS ES6+: const/let, arrow func, destructuring, spread, map/filter/reduce, async/await.";
    if (q.includes("html") || q.includes("css") || q.includes("flexbox") || q.includes("grid")) {
      return getKnowledgeTopic("coding_html_css", knowledgeBase) ||
        "HTML: semantic tags. CSS: Flexbox (display:flex) & Grid (display:grid).";
    }
    if (q.includes("git") || q.includes("github")) return getKnowledgeTopic("coding_git", knowledgeBase) ||
      "Git: init, add, commit, push, pull, branch, merge, log, stash, revert.";
    if (q.includes("sql") || q.includes("database") || q.includes("query")) {
      return getKnowledgeTopic("coding_sql", knowledgeBase) ||
        "SQL: SELECT, INSERT, UPDATE, DELETE, JOIN, GROUP BY, ORDER BY, HAVING.";
    }

    const codingMatch = searchKnowledge(q, knowledgeBase, ["coding"]);
    if (codingMatch) return codingMatch;

    return "Saya bisa bantu coding! Topik:\n\n- Python: syntax, function, list comprehension\n- JavaScript: ES6+, async/await, DOM\n- HTML/CSS: Flexbox, Grid, responsive\n- Git: version control commands\n- SQL: query, join, aggregation\n\nContoh: \"Bagaimana cara buat function di Python?\"";
  }

  // ========== WRITING ==========
  const writingKeywords = ["menulis", "tulis", "email", "cv", "resume", "laporan",
    "surat", "artikel", "blog", "copywriting", "proposal"];

  if (writingKeywords.some(kw => q.includes(kw))) {
    if (q.includes("email")) return getKnowledgeTopic("writing_email", knowledgeBase) ||
      "Email profesional: subjek jelas, salam sopan, langsung ke poin, penutup";
    if (q.includes("cv") || q.includes("resume")) return getKnowledgeTopic("writing_cv", knowledgeBase) ||
      "CV: contact, summary, experience, education, skills. 1-2 halaman, action verbs.";
    if (q.includes("laporan")) return getKnowledgeTopic("writing_report", knowledgeBase) ||
      "Laporan: Pendahuluan, Isi (data+analisis), Penutup (kesimpulan+rekomendasi).";

    const writingMatch = searchKnowledge(q, knowledgeBase, ["writing"]);
    if (writingMatch) return writingMatch;

    return "Saya bisa bantu menulis! Topik:\n- Email profesional\n- CV/Resume\n- Laporan kerja\n- Artikel & blog\n\nAda yang spesifik?";
  }

  // ========== TYPING TEST ==========
  if (q.includes("typing") || q.includes("mengetik") || q.includes("wpm") || q.includes("typing test")) {
    if (q.includes("multiplayer") || q.includes("teman") || q.includes("friend") || q.includes("bareng") || q.includes("room")) {
      return "Multiplayer:\n1. Pilih mode Friend\n2. Create Room -> dapat 6-digit code\n3. Share ke teman\n4. Teman: Join Room -> masukkan code\n5. Race dimulai saat kedua siap!\nWPM tertinggi + accuracy minimal 80% menang.";
    }
    if (q.includes("indonesia") || q.includes("bahasa")) {
      return "Typing test sudah support Bahasa Indonesia!\nBuka Settings > pilih ID (Indonesia).\n3 level: Easy (kata sehari-hari), Medium (kata menengah), Hard (kata formal/teknis).";
    }
    if (q.includes("tips") || q.includes("cara") || q.includes("latihan") || q.includes("meningkat")) {
      return "Tips menaikkan WPM:\n1. Fokus accuracy dulu (target 95%+)\n2. Latihan 15-30 menit/hari\n3. Mulai Easy, naik ke Hard\n4. Pakai 10 jari (touch typing)\n5. Jangan lihat keyboard\n6. Postur tegak, pergelangan mengambang\n7. Istirahat saat jari lelah";
    }
    return "Typing Test:\n- 3 difficulty: Easy, Medium, Hard\n- 4 mode waktu: 15s, 30s, 60s, 120s\n- Solo atau Multiplayer\n- Support English & Indonesia\n- Stats: WPM, Accuracy, Max WPM";
  }

  // ========== WEB UTAMA FEATURES ==========
  if (q.includes("notepad") || q.includes("catatan") || q.includes("note")) {
    return "Notepad: catatan pribadi online.\n- Buat, edit, pin catatan\n- Auto-save ke cloud\n- Search & filter\n- Akses dari device apapun";
  }

  if (q.includes("broadcast") || q.includes("siaran") || q.includes("pengumuman")) {
    return "Broadcast: info dari admin.\n- Low (abu-abu), Normal (biru), High (kuning), Urgent (merah)";
  }

  if (q.includes("theme") || q.includes("tema") || q.includes("tampilan")) {
    return "10 tema: Cyborg, Samurai, Aurora, Marvel, Medieval, Cyberpunk, Space, Nature, Deep Ocean, Volcanic.\nKlik tombol theme di navbar.";
  }

  if (q.includes("admin") || q.includes("master") || q.includes("panel")) {
    return "Master Panel (/master): admin area.\n- Links: kelola link\n- Broadcasts: pengumuman\n- AI Settings: knowledge base\n- Analytics: statistik\nLogin dengan username & password admin.";
  }

  if (q.includes("kamu siapa") || q.includes("siapa kamu") || q.includes("apa ini") || q.includes("tentang")) {
    return "Saya AI assistant Web Utama, seperti GPT/Claw/BigPickle tapi versi mini!\nKepintaran saya:\n- 40+ rumus Excel & Google Sheets\n- Matematika & Statistik\n- Coding (Python, JS, HTML, SQL, Git)\n- Tips menulis profesional\n- Semua fitur Web Utama\n\nSaya berjalan 100% di server tanpa API eksternal.";
  }

  // ========== HELLO / THANKS ==========
  if (q.match(/^(thanks|thank|terima kasih|makasih|thx|mantap|keren|bagus|oke|ok)/)) {
    return "Sama-sama! Senang bisa membantu. Tanya lagi kapan saja!";
  }

  if (q === "help" || q === "?" || q.includes("bantuan") || q.includes("bisa apa")) {
    return "Saya bisa bantu tentang:\n\n- Excel/Google Sheets: VLOOKUP, IF, QUERY, dll\n- Matematika: persen, statistik, aljabar\n- Coding: Python, JavaScript, SQL, Git, HTML/CSS\n- Menulis: email, CV, laporan\n- Fitur Web Utama\n\nCoba tanyakan langsung: \"rumus VLOOKUP\" atau \"cara hitung persen\"";
  }

  // ========== SMART KNOWLEDGE BASE SEARCH ==========
  const smartMatch = searchKnowledge(q, knowledgeBase, []);
  if (smartMatch) return smartMatch;

  // ========== DEFAULT ==========
  return "Pertanyaan menarik! Saya bisa membantu tentang:\n\n- Excel/Google Sheets (40+ rumus)\n- Matematika & Statistik\n- Coding (Python, JS, HTML, SQL, Git)\n- Menulis (email, CV, laporan)\n- Fitur Web Utama\n\nCoba tanyakan lebih spesifik, atau ketik \"help\" untuk daftar lengkap!";
}

// Search knowledge base by matching topic keywords with categories
function searchKnowledge(
  question: string,
  knowledgeBase: string,
  categories: string[]
): string | null {
  const q = question.toLowerCase();
  const entries = knowledgeBase.split("\n").filter(line => line.includes("]"));

  let bestMatch = "";
  let bestScore = 0;

  for (const entry of entries) {
    const match = entry.match(/\[(\w+)\]\s*(\w+):\s*(.+)/);
    if (!match) continue;

    const [, category, topic, content] = match;
    if (categories.length > 0 && !categories.includes(category)) continue;

    // Score based on keyword overlap
    const topicWords = topic.toLowerCase().replace(/_/g, " ").split(" ");
    let score = 0;
    for (const word of topicWords) {
      if (q.includes(word) && word.length > 2) score += 2;
    }

    // Also check content keywords
    const contentLower = content.toLowerCase();
    const questionWords = q.split(/\s+/).filter(w => w.length > 3);
    for (const word of questionWords) {
      if (contentLower.includes(word)) score += 1;
    }

    if (score > bestScore && score >= 3) {
      bestScore = score;
      bestMatch = content;
    }
  }

  return bestMatch || null;
}

// Find specific knowledge topic
function getKnowledgeTopic(topic: string, knowledgeBase: string): string | null {
  const regex = new RegExp(`\\[\\w+\\]\\s*${topic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*(.+)`, "i");
  const match = knowledgeBase.match(regex);
  return match ? match[1] : null;
}

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
          content: "Halo! Saya AI assistant Web Utama yang bisa belajar. Saya sudah tahu Excel, Matematika, Coding, Sains, dan Menulis. Tapi saya juga bisa belajar dari pertanyaan baru - tanya apa saja, dan saya akan mengingat jawabannya untuk pertanyaan berikutnya!",
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

      // Smart AI response generation (without external API)
      const localResponse = generateResponse(
        userMsg.content,
        knowledgeContext,
        conversationHistory
      );

      // Check if local response is a template/fallback (not a real answer)
      const isTemplate = isTemplateResponse(localResponse);

      let finalAnswer: string;
      let responseSource: string;

      if (isTemplate) {
        // Local knowledge doesn't know - call external AI to learn!
        try {
          const learnRes = await fetch("/api/ai-learn", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: userMsg.content }),
          });
          const learnData = await learnRes.json();
          finalAnswer = learnData.answer || localResponse;
          responseSource = learnData.source || "ai_api";
        } catch {
          // If AI API fails, use local template but make it more helpful
          finalAnswer = localResponse;
          responseSource = "local_fallback";
        }
      } else {
        finalAnswer = localResponse;
        responseSource = "local_knowledge";
      }

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: finalAnswer,
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
            content: finalAnswer,
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
                    className="px-3 py-2 rounded-2xl rounded-bl-md text-xs"
                    style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, color: theme.colors.textMuted }}
                  >
                    <div className="flex items-center gap-2">
                      <Loader2 size={12} className="animate-spin" style={{ color: theme.colors.primary }} />
                      <span>Thinking...</span>
                    </div>
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

// ============================================================
// SMART AI RESPONSE GENERATOR v2.0
// ============================================================

// Pre-compiled keyword sets for fast matching
const EXCEL_KEYWORDS = new Set([
  "excel", "rumus", "formula", "spreadsheet", "sel", "sheet", "cell", "range",
  "vlookup", "hlookup", "index", "match", "xlookup", "pivot",
  "sumif", "countif", "averageif", "sumifs", "countifs", "averageifs",
  "query", "filter", "sort", "unique", "arrayformula", "sparkline",
  "importhtml", "importxml", "importrange", "importdata",
  "google sheets", "gsheet", "tabel", "kolom", "baris",
  "sum", "average", "count", "max", "min", "round", "if",
  "iferror", "ifna", "choose", "switch", "and", "or", "not",
  "left", "right", "mid", "len", "trim", "upper", "lower", "proper",
  "concatenate", "textjoin", "text", "find", "search", "substitute",
  "today", "now", "year", "month", "day", "date", "datedif",
  "workday", "networkdays", "weekday", "eomonth", "edate",
  "sumproduct", "abs", "mod", "power", "sqrt", "fact",
  "sequence", "randarray", "lambda", "let",
  "conditional formatting", "data validation", "named range"
]);

const MATH_KEYWORDS = new Set([
  "matematika", "math", "hitung", "angka", "persamaan", "kuadrat",
  "pythagoras", "segitiga", "persen", "prosentase", "diskon", "ppn",
  "statistik", "mean", "median", "modus", "standar deviasi", "stddev",
  "varians", "probabilitas", "kemungkinan",
  "trigonometri", "sin", "cos", "tan", "sinus", "cosinus",
  "pi", "luas", "volume", "keliling", "geometri",
  "algebra", "aljabar", "kalkulus", "turunan", "integral",
  "logaritma", "log", "eksponen", "pangkat",
  "barisan", "deret", "aritmetika", "geometri",
  "matrices", "matriks", "determinan", "vektor",
  "kombinasi", "permutasi", "factorial",
  "akar", "sqrt", "pangkat", "x^2", "x2"
]);

const CODING_KEYWORDS = new Set([
  "coding", "program", "code", "python", "javascript", "js", "typescript", "ts",
  "html", "css", "react", "nextjs", "next", "vue", "angular", "svelte",
  "sql", "database", "git", "github", "node", "nodejs", "express",
  "function", "array", "loop", "for", "while", "class", "object",
  "api", "json", "rest", "graphql", "backend", "frontend", "fullstack",
  "bash", "shell", "terminal", "command line",
  "algorithm", "data structure", "sorting", "searching",
  "regex", "regular expression", "pattern",
  "html css", "flexbox", "grid", "responsive",
  "hook", "state", "component", "props", "context",
  "async", "await", "promise", "fetch",
  "decorator", "generator", "comprehension",
  "import", "export", "module", "package", "npm"
]);

const SCIENCE_KEYWORDS = new Set([
  "sains", "science", "fisika", "physics", "kimia", "chemistry", "biologi", "biology",
  "astronomi", "astronomy", "geologi", "geology", "bintang", "planet", "galaxy",
  "sel", "cell", "dna", "evolusi", "evolution", "energi", "energy", "gaya", "force",
  "listrik", "electric", "cahaya", "light", "suara", "sound", "radiasi", "radiation",
  "nuklir", "nuclear", "organisme", "hewan", "hewan", "tumbuhan", "ekosistem",
  "reaksi", "reaction", "atom", "molekul", "asam", "bas", "ph",
  "newton", "einstein", "gravitasi", "gravity", "magnet", "magnetism"
]);

const WRITING_KEYWORDS = new Set([
  "menulis", "tulis", "writing", "email", "cv", "resume",
  "laporan", "surat", "artikel", "blog", "copywriting",
  "proposal", "essay", "persuasi", "penulisan"
]);

const GENERAL_KEYWORDS = new Set([
  "keuangan", "finance", "investasi", "investing", "budget", "anggaran",
  "pajak", "tax", "saham", "stock", "crypto", "bitcoin",
  "kesehatan", "health", "diet", "olahraga", "exercise", "tidur", "sleep",
  "stres", "stress", "meditasi", "meditation",
  "produktivitas", "productivity", "pomodoro", "manajemen waktu",
  "sejarah", "history", "geografi", "geography", "negara", "country",
  "teknologi", "technology", "ai", "artificial intelligence", "blockchain",
  "5g", "cloud", "cybersecurity",
  "memasak", "cooking", "resep", "recipe",
  "perjalanan", "travel", "tips", "saran", "advice",
  "negosiasi", "negotiation", "komunikasi", "communication",
  "belajar", "study", "belajar", "motivasi", "motivation"
]);

const WEB_KEYWORDS = new Set([
  "typing", "mengetik", "wpm", "typing test",
  "notepad", "catatan", "note",
  "broadcast", "siaran", "pengumuman",
  "theme", "tema", "tampilan",
  "admin", "master", "panel",
  "fitur", "feature", "web utama"
]);

// Intent detection patterns
const INTENT_PATTERNS = {
  createCode: /\b(buat|create|bikin|generate|tulis|write|implementasi|implement|kode|code|script|program|fungsi|function|class|component|hook|api|endpoint|handler|route|query|script)\b/i,
  explain: /\b(jelaskan|explain|apa itu|apa yang|arti|mean|definisi|definition|mengapa|kenapa|why|bagaimana|how|kenapa|reason|makna|pengertian)\b/i,
  compare: /\b(beda|bedanya|difference|perbedaan|vs|versus|bandingkan|compare|mana yang lebih|which is better|kelebihan|kekurangan|pros? and cons?)\b/i,
  howTo: /\b(cara|how to|bagaimana|steps?|langkah|tutorial|panduan|guide|step by step)\b/i,
  troubleshoot: /\b(error|bug|masalah|salah|gagal|tidak bisa|gak bisa|eror|exception|failed|broken|not working)\b/i,
  formula: /\b(rumus|formula|persamaan|equation|equivalence)\b/i,
  calculation: /\b(hitung|calculate|berapa|what is|nilai|result|hasil)\b/i,
};

function generateResponse(
  question: string,
  knowledgeBase: string,
  _history: string
): string {
  const q = question.toLowerCase().trim();
  const words = q.split(/\s+/).filter(w => w.length > 2);

  // ===== DETECT INTENT =====
  const intent = detectIntent(q);
  const category = detectCategory(q);
  const specificTopic = extractSpecificTopic(q);

  // ===== GREETING =====
  if (q.match(/^(halo|hi|hey|hello|hei|yo|pagi|siang|sore|malam|assalam|assalamualaikum|selamat)/)) {
    return formatResponse("Halo! Selamat datang di Web Utama AI. Saya bisa membantu tentang:\n\n"
      + "**Excel/Google Sheets** (80+ rumus)\n"
      + "- Lookup: VLOOKUP, INDEX-MATCH, XLOOKUP\n"
      + "- Logic: IF, IFS, SWITCH, AND, OR, IFERROR\n"
      + "- Agregasi: SUMIF, COUNTIF, AVERAGEIF\n"
      + "- Google Sheets: QUERY, FILTER, SORT, UNIQUE, SPARKLINE\n\n"
      + "**Matematika** (aljabar, statistik, trigonometri, kalkulus)\n\n"
      + "**Coding** (Python, JavaScript, TypeScript, SQL, Git, React, Node.js, Regex, Bash)\n\n"
      + "**Sains** (fisika, kimia, biologi, astronomi)\n\n"
      + "**Menulis** (email profesional, CV, laporan, essay, copywriting)\n\n"
      + "**Pengetahuan Umum** (keuangan, kesehatan, sejarah, teknologi)\n\n"
      + "Tanya langsung, contoh: *\"rumus VLOOKUP\"* atau *\"buatkan function Python\"*");
  }

  // ===== THANKS =====
  if (q.match(/^(thanks|thank you|terima kasih|makasih|thx|mantap|keren|bagus|oke|ok|sip)/)) {
    return formatResponse("Sama-sama! Senang bisa membantu. Tanya lagi kapan saja! ");
  }

  // ===== HELP =====
  if (q === "help" || q === "?" || q.includes("bantuan") || q.includes("bisa apa")) {
    return formatResponse("**Saya bisa membantu tentang:**\n\n"
      + "**Excel/Google Sheets:**\n"
      + "- Rumus: VLOOKUP, IF, SUMIF, QUERY, FILTER, dll\n"
      + "- Contoh: *\"Bagaimana cara pakai VLOOKUP?\"*\n\n"
      + "**Matematika:**\n"
      + "- Aljabar, statistik, trigonometri, kalkulus\n"
      + "- Contoh: *\"Berapa 15% dari 250.000?\"*\n\n"
      + "**Coding:**\n"
      + "- Python, JavaScript, SQL, Git, React, dll\n"
      + "- Contoh: *\"Buatkan function sorting di Python\"*\n\n"
      + "**Sains:**\n"
      + "- Fisika, kimia, biologi, astronomi\n"
      + "- Contoh: *\"Jelaskan hukum Newton\"*\n\n"
      + "**Menulis:**\n"
      + "- Email, CV, laporan, essay, copywriting\n"
      + "- Contoh: *\"Tulis email profesional untuk client\"*\n\n"
      + "**Pengetahuan Umum:**\n"
      + "- Keuangan, kesehatan, sejarah, teknologi\n"
      + "- Contoh: *\"Apa itu compound interest?\"*\n\n"
      + "**Tips:** Tanya se-spesifik mungkin untuk jawaban terbaik!");
  }

  // ===== WHO ARE YOU =====
  if (q.includes("kamu siapa") || q.includes("siapa kamu") || q.includes("apa ini") || q.includes("tentang kamu") || q.includes("about you")) {
    return formatResponse("**Web Utama AI** - AI Assistant & Knowledge Base\n\n"
      + "Saya AI yang berjalan 100% di browser tanpa API eksternal.\n\n"
      + "**Kepintaran saya:**\n"
      + "- 535+ knowledge entries\n"
      + "- 80+ rumus Excel & Google Sheets (lengkap dengan contoh)\n"
      + "- Matematika: aljabar, statistik, trigonometri, kalkulus, matriks\n"
      + "- Coding: Python, JS, TS, SQL, Git, React, Node.js, Regex, Bash\n"
      + "- Sains: fisika, kimia, biologi, astronomi, geologi\n"
      + "- Menulis: email, CV, laporan, essay, copywriting\n"
      + "- Pengetahuan umum: keuangan, kesehatan, sejarah, teknologi\n\n"
      + "Fuzzy search: bisa menangani typo! Coba ketik apa saja.");
  }

  // ===== WEB UTAMA FEATURES =====
  if (category === "web") {
    return handleWebFeatures(q, specificTopic);
  }

  // ===== EXCEL / GOOGLE SHEETS =====
  if (category === "excel" || category === "gsheet") {
    return handleExcelResponse(q, intent, specificTopic, knowledgeBase, words);
  }

  // ===== MATH =====
  if (category === "math") {
    return handleMathResponse(q, intent, specificTopic, knowledgeBase, words);
  }

  // ===== CODING =====
  if (category === "coding") {
    return handleCodingResponse(q, intent, specificTopic, knowledgeBase, words);
  }

  // ===== WRITING =====
  if (category === "writing") {
    return handleWritingResponse(q, intent, specificTopic, knowledgeBase, words);
  }

  // ===== SCIENCE =====
  if (category === "science") {
    return handleScienceResponse(q, intent, specificTopic, knowledgeBase);
  }

  // ===== GENERAL (finance, health, history, tech, daily) =====
  if (category === "general") {
    return handleGeneralResponse(q, intent, specificTopic, knowledgeBase);
  }

  // ===== CALCULATION: Try to solve math problems =====
  if (intent === "calculation" || INTENT_PATTERNS.calculation.test(q)) {
    const mathResult = tryCalculate(q);
    if (mathResult) return mathResult;
  }

  // ===== SMART KNOWLEDGE BASE SEARCH (detected category) =====
  const smartMatch = searchKnowledge(q, knowledgeBase, category !== "unknown" ? [category] : []);
  if (smartMatch) return formatResponse(smartMatch);

  // ===== SEARCH ALL CATEGORIES AS FALLBACK =====
  const allMatch = searchKnowledge(q, knowledgeBase, []);
  if (allMatch) return formatResponse(allMatch);

  // ===== FALLBACK =====
  return formatResponse("Pertanyaan menarik! Saya bisa membantu tentang:\n\n"
    + "- **Excel/Google Sheets**: 80+ rumus\n"
    + "- **Matematika**: aljabar, statistik, trigonometri, kalkulus\n"
    + "- **Coding**: Python, JS, SQL, Git, React, Node.js\n"
    + "- **Sains**: fisika, kimia, biologi, astronomi\n"
    + "- **Menulis**: email, CV, laporan, essay\n"
    + "- **Pengetahuan Umum**: keuangan, kesehatan, sejarah, teknologi\n\n"
    + "Coba tanyakan lebih spesifik, atau ketik *\"help\"* untuk daftar lengkap!");
}

// ============================================================
// INTENT DETECTION
// ============================================================
function detectIntent(q: string): string {
  if (INTENT_PATTERNS.createCode.test(q)) return "createCode";
  if (INTENT_PATTERNS.compare.test(q)) return "compare";
  if (INTENT_PATTERNS.troubleshoot.test(q)) return "troubleshoot";
  if (INTENT_PATTERNS.howTo.test(q)) return "howTo";
  if (INTENT_PATTERNS.explain.test(q)) return "explain";
  if (INTENT_PATTERNS.formula.test(q)) return "formula";
  if (INTENT_PATTERNS.calculation.test(q)) return "calculation";
  return "general";
}

function detectCategory(q: string): string {
  if (EXCEL_KEYWORDS.has(q) || Array.from(EXCEL_KEYWORDS).some(kw => q.includes(kw))) {
    if (q.includes("google sheets") || q.includes("gsheet") || q.includes("query") || q.includes("sparkline") || q.includes("filter") || q.includes("sort") || q.includes("unique") || q.includes("arrayformula") || q.includes("importhtml") || q.includes("googlefinance") || q.includes("regexmatch"))
      return "gsheet";
    return "excel";
  }
  if (MATH_KEYWORDS.has(q) || Array.from(MATH_KEYWORDS).some(kw => q.includes(kw))) return "math";
  if (CODING_KEYWORDS.has(q) || Array.from(CODING_KEYWORDS).some(kw => q.includes(kw))) return "coding";
  if (SCIENCE_KEYWORDS.has(q) || Array.from(SCIENCE_KEYWORDS).some(kw => q.includes(kw))) return "science";
  if (WRITING_KEYWORDS.has(q) || Array.from(WRITING_KEYWORDS).some(kw => q.includes(kw))) return "writing";
  if (WEB_KEYWORDS.has(q) || Array.from(WEB_KEYWORDS).some(kw => q.includes(kw))) return "web";
  if (GENERAL_KEYWORDS.has(q) || Array.from(GENERAL_KEYWORDS).some(kw => q.includes(kw))) return "general";
  return "unknown";
}

function extractSpecificTopic(q: string): string {
  const specificMap: [RegExp, string][] = [
    [/vlookup/, "vlookup"], [/hlookup/, "hlookup"], [/xlookup/, "xlookup"],
    [/index.{0,5}match/, "index_match"], [/pivot/, "pivot_table"],
    [/sumif|sumifs/, "sumif"], [/countif|countifs/, "countif"],
    [/averageif/, "averageif"], [/maxif|minif/, "maxif_minif"],
    [/query/, "gsheet_query"], [/filter/, "gsheet_filter"],
    [/sort/, "gsheet_sort"], [/unique/, "gsheet_unique"],
    [/arrayformula/, "gsheet_arrayformula"], [/sparkline/, "gsheet_sparkline"],
    [/import/, "gsheet_import"], [/googlefinance/, "gsheet_gfinance"],
    [/regex/, "gsheet_regex"], [/hyperlink|image/, "gsheet_hyperlink"],
    [/iferror|ifna/, "iferror"], [/ifs\b/, "ifs"], [/switch/, "switch_func"],
    [/choose/, "choose"], [/let\b|lambda/, "let_lambda"],
    [/if\(/, "if"], [/and|or|not/, "and_or_not"],
    [/left|right|mid/, "left_right_mid"], [/upper|lower|proper/, "upper_lower"],
    [/concat|textjoin/, "concatenate"], [/find|search/, "find_search"],
    [/isnumber|istext|isblank|iserror/, "is_functions"],
    [/clean|char|code|rept/, "clean_func"],
    [/today|now/, "today_now"], [/year|month|day|date|datedif/, "date_parts"],
    [/eomonth|workday|networkdays|weekday/, "endmonth"],
    [/edate|yearfrac|days360/, "edate"],
    [/sum\b/, "sum"], [/average/, "average"], [/count\b/, "count"],
    [/max|min/, "max_min"], [/round/, "round"],
    [/sumproduct/, "sumproduct"], [/abs|mod/, "abs_mod"],
    [/power|sqrt|fact|rand/, "power_math"],
    [/sequence|randarray/, "sequence_func"],
    [/pythagoras/, "math_geometri"], [/luas|volume|keliling/, "math_geometri"],
    [/persen|diskon|ppn|prosentase/, "math_percentage"],
    [/statistik|mean|median|modus/, "math_statistics"],
    [/trigono|sin|cos|tan/, "math_trigonometri"],
    [/algebra|aljabar|persamaan|kuadrat/, "math_algebra"],
    [/logaritma|log|eksponen/, "math_log"],
    [/kalkulus|turunan|integral/, "math_calculus"],
    [/matriks|matrix|determinan/, "math_matrices"],
    [/vektor|vector/, "math_veter"],
    [/barisan|deret|aritmetika/, "math_sequences"],
    [/probabilitas|kemungkinan|bayes/, "math_probability"],
    [/python/, "coding_python"], [/javascript| js /, "coding_javascript"],
    [/typescript| ts /, "coding_typescript"],
    [/html|css|flexbox|grid/, "coding_html_css"],
    [/sql|database/, "coding_sql"],
    [/git|github/, "coding_git"],
    [/react|hook|component|state/, "coding_react"],
    [/node|express/, "coding_node"],
    [/algorithm|sorting|data structure/, "coding_algorithms"],
    [/api|http|rest|graphql/, "coding_api"],
    [/regex|pattern/, "coding_regex"],
    [/bash|shell|terminal/, "coding_bash"],
    [/email/, "writing_email"], [/cv|resume/, "writing_cv"],
    [/laporan|report/, "writing_report"],
    [/essay|artikel/, "writing_essay"],
    [/copywriting|persuasi|aida/, "writing_persuasive"],
    [/typing|mengetik|wpm/, "web_typing"],
    [/keuangan|investasi|budget/, "finance"],
    [/produktivitas|pomodoro|gtd/, "productivity"],
  ];
  for (const [regex, topic] of specificMap) {
    if (regex.test(q)) return topic;
  }
  return "";
}

// ============================================================
// HANDLER: EXCEL / GOOGLE SHEETS
// ============================================================
function handleExcelResponse(q: string, intent: string, specificTopic: string, knowledgeBase: string, _words: string[]): string {
  // First try to find specific knowledge
  if (specificTopic) {
    const kbMatch = getKnowledgeTopic(specificTopic, knowledgeBase);
    if (kbMatch) return formatResponse(kbMatch);
  }

  // Search knowledge base for relevant entries
  const kbMatch = searchKnowledge(q, knowledgeBase, ["excel", "gsheet"]);
  if (kbMatch) return formatResponse(kbMatch);

  // Try specific formula lookups with detailed responses
  if (q.includes("vlookup")) {
    return formatResponse("**VLOOKUP** - Vertical Lookup\n\n"
      + "**Rumus:** `=VLOOKUP(cari, range, kolom_ke, [FALSE])`\n\n"
      + "**Contoh:**\n"
      + "```\n=VLOOKUP(A2, D:E, 2, FALSE)\n```\n"
      + "Artinya: Cari nilai di A2 di kolom D, ambil nilai dari kolom E.\n\n"
      + "**Tips:**\n"
      + "- `FALSE` = exact match (PALING SERING DIPAKAI)\n"
      + "- `TRUE` = approximate match (range harus diurutkan ASC)\n"
      + "- **HANYA** bisa mencari ke KANAN\n"
      + "- Kolom dihitung dari range, bukan dari spreadsheet\n"
      + "- Error #N/A = tidak ditemukan, wrap dengan IFERROR\n\n"
      + "**Contoh Lengkap:**\n"
      + "```\n=IFERROR(VLOOKUP(A2,Sheet2!A:C,3,FALSE),\"Tidak ditemukan\")\n```\n\n"
      + "**Alternatif:** INDEX-MATCH atau XLOOKUP bisa ke kiri.");
  }

  if (q.includes("xlookup")) {
    return formatResponse("**XLOOKUP** - Pencarian Modern\n\n"
      + "**Rumus:**\n"
      + "```\n=XLOOKUP(cari, range_cari, range_ambil, [default], [match_mode], [search_mode])\n```\n\n"
      + "**Match Modes:**\n"
      + "- `0` = exact (default)\n"
      + "- `-1` = next smaller\n"
      + "- `1` = next larger\n"
      + "- `2` = wildcard\n\n"
      + "**Search Modes:**\n"
      + "- `1` = first-to-last (default)\n"
      + "- `-1` = last-to-first\n\n"
      + "**Contoh:**\n"
      + "```\n=XLOOKUP(A2, D:D, C:C, \"Tidak ditemukan\")\n```\n\n"
      + "**Menggantikan:** VLOOKUP, HLOOKUP, INDEX-MATCH\n"
      + "**Keunggulan:** Bisa ke kiri, ke atas, reverse search.\n"
      + "**Excel 365 / Google Sheets**");
  }

  if ((q.includes("index") && q.includes("match")) || q.includes("index-match")) {
    return formatResponse("**INDEX-MATCH** - Formula Lookup Favorit\n\n"
      + "**Rumus:**\n"
      + "```\n=INDEX(ambil_range, MATCH(cari, cari_range, 0))\n```\n\n"
      + "**Contoh:**\n"
      + "```\n=INDEX(C:C, MATCH(A2, A:A, 0))\n```\n"
      + "Artinya: Cari A2 di kolom A, ambil dari kolom C.\n\n"
      + "**Match Type:**\n"
      + "- `0` = exact match (paling sering)\n"
      + "- `1` = less than (range harus ASC)\n"
      + "- `-1` = greater than (range harus DESC)\n\n"
      + "**Multi-kriteria (Ctrl+Shift+Enter):**\n"
      + "```\n=INDEX(C:C, MATCH(1, (A:A=A2)*(B:B=B2), 0))\n```\n\n"
      + "**Keunggulan vs VLOOKUP:** Bisa mencari ke KIRI.");
  }

  if (q.includes("query")) {
    return formatResponse("**QUERY** - Paling Powerful di Google Sheets\n\n"
      + "**Rumus:**\n"
      + "```\n=QUERY(data, \"query_string\", header_row)\n```\n\n"
      + "**Clauses:** SELECT, WHERE, GROUP BY, ORDER BY, HAVING, PIVOT, LABEL, FORMAT, LIMIT\n\n"
      + "**Contoh:**\n"
      + "```sql\n-- Hitung total penjualan per kota\n=QUERY(A1:D100, \"SELECT A, SUM(C) WHERE B='Active' GROUP BY A ORDER BY SUM(C) DESC\", 1)\n\n-- Filter & sort\n=QUERY(A:Z, \"SELECT A,B,C WHERE C>1000 ORDER BY C DESC LIMIT 10\", 1)\n\n-- Pivot\n=QUERY(A:Z, \"SELECT A, SUM(B) WHERE B>0 GROUP BY A PIVOT C\", 1)\n```\n\n"
      + "**Tips:**\n"
      + "- String di query pakai single quote\n"
      + "- Paling powerful function di Google Sheets!");
  }

  if (q.includes("filter") && (q.includes("google") || q.includes("sheet") || q.includes("gsheet"))) {
    return formatResponse("**FILTER** - Filter Data Dinamis (Google Sheets)\n\n"
      + "**Rumus:**\n"
      + "```\n=FILTER(data, kondisi1, [kondisi2], ...)\n```\n\n"
      + "**Contoh:**\n"
      + "```\n=FILTER(A1:C100, B1:B100=\"Selesai\")\n=FILTER(A1:C100, B1:B100=\"Selesai\", C1:C100>1000)\n=FILTER(A:C, (A:A=\"Jan\")+(A:A=\"Feb\")) -- OR\n```\n\n"
      + "**Tips:**\n"
      + "- `*` = AND, `+` = OR\n"
      + "- Wrap IFERROR jika tidak ada hasil\n"
      + "- Lebih baik dari AutoFilter (otomatis update)");
  }

  if (q.includes("sumif")) {
    return formatResponse("**SUMIF & SUMIFS**\n\n"
      + "**SUMIF (1 kondisi):**\n"
      + "```\n=SUMIF(range_kondisi, kondisi, range_jumlah)\n=SUMIF(A:A, \"Selesai\", B:B)\n=SUMIF(A:A, \">100\", B:B)\n```\n\n"
      + "**SUMIFS (multi-kondisi):**\n"
      + "```\n=SUMIFS(range_jumlah, rk1, k1, rk2, k2, ...)\n=SUMIFS(C:C, A:A, \">=1/1/2024\", A:A, \"<=31/12/2024\", B:B, \"Yes\")\n```\n\n"
      + "**Tips:**\n"
      + "- SUMIFS: range pertama = range penjumlahan (beda dari SUMIF!)\n"
      + "- Wildcard: `*text*` untuk pencarian parsial");
  }

  if (q.includes("sumproduct")) {
    return formatResponse("**SUMPRODUCT** - Kalikan Lalu Jumlahkan\n\n"
      + "**Rumus Dasar:**\n"
      + "```\n=SUMPRODUCT(A1:A5, B1:B5) -- =A1*B1 + A2*B2 + ... + A5*B5\n```\n\n"
      + "**Conditional (tanpa array formula):**\n"
      + "```\n=SUMPRODUCT((A:A=\"Jan\")*(B:B>100)*(C:C))\n```\n\n"
      + "**Weighted Average:**\n"
      + "```\n=SUMPRODUCT((A:A=\"Yes\")*B:B*C:C) / SUMPRODUCT((A:A=\"Yes\")*C:C)\n```\n\n"
      + "**Tips:**\n"
      + "- `*` = AND, `+` = OR\n"
      + "- `--` konversi TRUE/FALSE ke 1/0\n"
      + "- Bisa menggantikan COUNTIFS/SUMIFS di versi lama");
  }

  if (q.includes("if") && !q.includes("iferror") && !q.includes("ifs")) {
    return formatResponse("**IF** - Conditional Logic\n\n"
      + "**Rumus Dasar:**\n"
      + "```\n=IF(kondisi, jika_benar, jika_salah)\n=IF(A1>60, \"Lulus\", \"Tidak Lulus\")\n```\n\n"
      + "**Nesting (max 64 level):**\n"
      + "```\n=IF(A1>=90,\"A\", IF(A1>=80,\"B\", IF(A1>=70,\"C\", IF(A1>=60,\"D\",\"E\"))))\n```\n\n"
      + "**Tips:**\n"
      + "- Gunakan **IFS** untuk multi-kondisi (lebih rapi)\n"
      + "- Gunakan **SWITCH** untuk pencocokan nilai\n"
      + "- IF bersarang sulit dibaca");
  }

  if (q.includes("iferror")) {
    return formatResponse("**IFERROR & IFNA**\n\n"
      + "```\n=IFERROR(A1/B1, \"Error: Pembagian nol\")\n=IFERROR(VLOOKUP(...), \"Tidak ditemukan\")\n=IFNA(VLOOKUP(...), \"-\") -- khusus #N/A\n```\n\n"
      + "**Error Types:**\n"
      + "- `#DIV/0!` pembagian nol\n"
      + "- `#N/A` tidak ditemukan\n"
      + "- `#NAME?` nama fungsi salah\n"
      + "- `#NULL!` referensi salah\n"
      + "- `#NUM!` angka tidak valid\n"
      + "- `#REF!` referensi rusak\n"
      + "- `#VALUE!` tipe data salah\n\n"
      + "**Tips:** Jangan terlalu banyak IFERROR, bisa menyembunyikan bug!");
  }

  // Check if user is asking for help with a specific formula
  if (intent === "createCode" || intent === "howTo" || intent === "formula") {
    return formatResponse("Saya punya 80+ rumus Excel & Google Sheets! Topik yang tersedia:\n\n"
      + "**Lookup:** VLOOKUP, INDEX-MATCH, XLOOKUP, HLOOKUP, INDIRECT\n"
      + "**Logic:** IF, IFS, SWITCH, AND/OR/NOT, IFERROR, CHOOSE, LET, LAMBDA\n"
      + "**Agregasi:** SUMIF/SUMIFS, COUNTIF, AVERAGEIF, MAXIFS, MINIFS, SUMPRODUCT\n"
      + "**Text:** LEFT/RIGHT/MID, UPPER/LOWER, CONCATENATE, TEXTJOIN, FIND/SEARCH\n"
      + "**Date:** TODAY/NOW, DATEDIF, WORKDAY, EOMONTH, EDATE\n"
      + "**Math:** ROUND, ABS, MOD, POWER, SQRT, SEQUENCE, RANDARRAY\n"
      + "**Google Sheets:** QUERY, FILTER, SORT, UNIQUE, ARRAYFORMULA, SPARKLINE, IMPORT*\n"
      + "**Advanced:** Conditional Formatting, Data Validation, Named Ranges\n\n"
      + "Coba tanyakan spesifik: *\"Bagaimana cara pakai VLOOKUP\"*");
  }

  // Default excel response
  return formatResponse("Saya punya 80+ rumus Excel & Google Sheets! Coba tanyakan:\n\n"
    + "- *\"Rumus VLOOKUP\"* atau *\"Cara pakai XLOOKUP\"*\n"
    + "- *\"Bedanya IF dan IFS\"*\n"
    + "- *\"Cara buat QUERY di Google Sheets\"*\n"
    + "- *\"Rumus SUMIF dengan multi-kondisi\"*\n"
    + "- *\"Bagaimana cara FILTER data\"*\n\n"
    + "Atau ketik *\"help\"* untuk daftar lengkap semua topik.");
}

// ============================================================
// HANDLER: MATH
// ============================================================
function handleMathResponse(q: string, intent: string, specificTopic: string, knowledgeBase: string, _words: string[]): string {
  // Try calculation first
  if (intent === "calculation") {
    const result = tryCalculate(q);
    if (result) return result;
  }

  // Knowledge base lookup
  if (specificTopic) {
    const kbMatch = getKnowledgeTopic(specificTopic, knowledgeBase);
    if (kbMatch) return formatResponse(kbMatch);
  }

  const kbMatch = searchKnowledge(q, knowledgeBase, ["math"]);
  if (kbMatch) return formatResponse(kbMatch);

  // Specific topics
  if (q.includes("persen") || q.includes("diskon") || q.includes("ppn") || q.includes("prosentase")) {
    return formatResponse("**Persen, Diskon, Pajak, Profit**\n\n"
      + "**Dasar:**\n"
      + "```\nX% dari Y = (X/100) * Y\nPersentase = (Bagian/Total) * 100\n```\n\n"
      + "**Diskon:**\n"
      + "```\nHarga Akhir = Harga * (1 - Diskon/100)\nContoh: Rp500.000 diskon 20% = 500.000 * 0.8 = Rp400.000\n```\n\n"
      + "**PPN/Pajak:**\n"
      + "```\nTotal = Harga * (1 + PPN/100)\nContoh: Rp100.000 + PPN 11% = Rp111.000\n```\n\n"
      + "**Profit:**\n"
      + "```\nProfit % = ((Jual - Beli) / Beli) * 100\nMargin % = ((Jual - Beli) / Jual) * 100\n```\n\n"
      + "**Bunga Majemuk:**\n"
      + "```\nFV = PV * (1 + r)^n\n```\n\n"
      + "**Tips:** Diskon bertingkat: `H * (1-d1) * (1-d2) * (1-d3)`. BUKAN `H * (1-d1-d2-d3)`!");
  }

  if (q.includes("statistik") || q.includes("mean") || q.includes("median") || q.includes("modus")) {
    return formatResponse("**Statistik Deskriptif**\n\n"
      + "**Central Tendency:**\n"
      + "```\nMean (rata-rata) = Sum(xi) / n\nMedian = nilai tengah (sort, ambil tengah)\nModus = nilai paling sering muncul\n```\n\n"
      + "**Spread:**\n"
      + "```\nRange = Max - Min\nVarian = Sum((xi - mean)^2) / n\nStd Dev = sqrt(Varian)\nCV = (StdDev / Mean) * 100%\n```\n\n"
      + "**Z-score:**\n"
      + "```\nz = (x - mean) / StdDev\n```\n\n"
      + "**Tips:** Mean sensitive outlier, Median lebih robust.");
  }

  if (q.includes("kuadrat") || q.includes("persamaan")) {
    return formatResponse("**Persamaan Kuadrat**\n\n"
      + "```\nax^2 + bx + c = 0\nx = (-b +- sqrt(b^2 - 4ac)) / 2a\n```\n\n"
      + "**Discriminant:** `D = b^2 - 4ac`\n"
      + "- `D > 0`: 2 akar real berbeda\n"
      + "- `D = 0`: 1 akar kembar\n"
      + "- `D < 0`: akar kompleks\n\n"
      + "**Contoh:** `2x^2 + 5x - 3 = 0`\n"
      + "```\na=2, b=5, c=-3\nD = 25 - 4(2)(-3) = 25 + 24 = 49\nx = (-5 + 7) / 4 = 0.5\nx = (-5 - 7) / 4 = -3\n```\n\n"
      + "**Identitas:**\n"
      + "- `(a+b)^2 = a^2 + 2ab + b^2`\n"
      + "- `(a-b)^2 = a^2 - 2ab + b^2`\n"
      + "- `(a+b)(a-b) = a^2 - b^2`");
  }

  if (q.includes("pythagoras") || (q.includes("segitiga") && q.includes("siku"))) {
    return formatResponse("**Pythagoras** - Segitiga Siku-siku\n\n"
      + "```\na^2 + b^2 = c^2\nc = sqrt(a^2 + b^2)\n```\n\n"
      + "**Contoh:**\n"
      + "a=3, b=4\n"
      + "c = sqrt(9 + 16) = sqrt(25) = **5**\n\n"
      + "**Mencari sisi:**\n"
      + "- Mencari c: `c = sqrt(a^2 + b^2)`\n"
      + "- Mencari a: `a = sqrt(c^2 - b^2)`\n"
      + "- Mencari b: `b = sqrt(c^2 - a^2)`");
  }

  if (q.includes("luas") || q.includes("volume") || q.includes("geometri")) {
    return formatResponse("**Geometri - Luas, Volume, Keliling**\n\n"
      + "**2D:**\n"
      + "```\nPersegi: L = s^2, P = 4s\nPersegi Panjang: L = p*l, P = 2(p+l)\nLingkaran: L = pi*r^2, K = 2*pi*r\nSegitiga: L = (alas * tinggi) / 2\nTrapesium: L = (a+b) * h / 2\nJajar Genjang: L = alas * tinggi\nBelah Ketupat: L = (d1 * d2) / 2\n```\n\n"
      + "**3D:**\n"
      + "```\nKubus: V = s^3\nBalok: V = p*l*t\nSilinder: V = pi*r^2*h\nKerucut: V = (1/3)*pi*r^2*h\nBola: V = (4/3)*pi*r^3\nLimas: V = (1/3)*Luas_alas*tinggi\n```\n\n"
      + "**Pythagoras:** `a^2 + b^2 = c^2`");
  }

  if (q.includes("trigonometri") || q.includes("sin") || q.includes("cos") || q.includes("tan")) {
    return formatResponse("**Trigonometri**\n\n"
      + "**Dasar:**\n"
      + "```\nsin(x) = depan / miring\ncos(x) = samping / miring\ntan(x) = depan / samping = sin(x)/cos(x)\n```\n\n"
      + "**Identitas:**\n"
      + "```\nsin^2(x) + cos^2(x) = 1\n1 + tan^2(x) = sec^2(x)\n```\n\n"
      + "**Double Angle:**\n"
      + "```\nsin(2x) = 2*sin(x)*cos(x)\ncos(2x) = cos^2(x) - sin^2(x)\n```\n\n"
      + "**Konversi:**\n"
      + "```\nRadian = Derajat * pi / 180\nDerajat = Radian * 180 / pi\n```\n\n"
      + "**Nilai khusus:** sin(30)=0.5, cos(30)=0.866, tan(45)=1");
  }

  if (q.includes("logaritma") || q.includes("log")) {
    return formatResponse("**Logaritma & Eksponen**\n\n"
      + "**Definisi:**\n"
      + "```\nlog_b(x) = y  <=>  b^y = x\nlog_10(100) = 2 karena 10^2 = 100\nln(e) = 1 karena e^1 = e\n```\n\n"
      + "**Sifat:**\n"
      + "```\nlog(a*b) = log(a) + log(b)\nlog(a/b) = log(a) - log(b)\nlog(a^n) = n * log(a)\nlog_b(a) = ln(a) / ln(b) -- change of base\n```\n\n"
      + "**Eksponen:**\n"
      + "```\na^0 = 1\na^(-n) = 1/a^n\na^(m/n) = n-th root(a^m)\n(e^x)^y = e^(xy)\n```");
  }

  if (q.includes("kalkulus") || q.includes("turunan") || q.includes("integral")) {
    return formatResponse("**Kalkulus Dasar**\n\n"
      + "**Turunan:**\n"
      + "```\nd/dx[x^n] = n*x^(n-1)\nd/dx[e^x] = e^x\nd/dx[ln(x)] = 1/x\nd/dx[sin(x)] = cos(x)\nd/dx[cos(x)] = -sin(x)\n```\n\n"
      + "**Product Rule:** `(fg)' = f'g + fg'`\n\n"
      + "**Chain Rule:** `d/dx[f(g(x))] = f'(g(x)) * g'(x)`\n\n"
      + "**Integral:**\n"
      + "```\nint[x^n]dx = x^(n+1)/(n+1) + C\nint[e^x]dx = e^x + C\nint[1/x]dx = ln|x| + C\n```");
  }

  if (q.includes("matriks") || q.includes("matrix") || q.includes("determinan")) {
    return formatResponse("**Matriks**\n\n"
      + "**Penjumlahan:** A + B (element-wise)\n\n"
      + "**Perkalian:** (AB)_ij = Sum(A_ik * B_kj)\n\n"
      + "**Determinan 2x2:**\n"
      + "```\n|A| = ad - bc\n```\n\n"
      + "**Invers 2x2:**\n"
      + "```\nA^-1 = (1/det) * [[d, -b], [-c, a]]\n```\n\n"
      + "**Transpose:** baris jadi kolom\n\n"
      + "**Excel/Sheets:** `=MMULT(A1:B2, C1:D2)` untuk perkalian matriks");
  }

  // Default math response
  return formatResponse("**Matematika** - Topik yang tersedia:\n\n"
    + "- **Persen & Diskon:** rumus persentase, diskon, pajak, profit\n"
    + "- **Algebra:** persamaan linear, kuadrat, identitas\n"
    + "- **Geometri:** luas, volume, keliling, Pythagoras\n"
    + "- **Statistik:** mean, median, modus, standar deviasi\n"
    + "- **Trigonometri:** sin, cos, tan, identitas\n"
    + "- **Logaritma & Eksponen**\n"
    + "- **Kalkulus:** turunan, integral\n"
    + "- **Matriks & Vektor**\n"
    + "- **Probabilitas & Kombinasi**\n\n"
    + "Atau langsung tanya: *\"Berapa 15% dari 500.000?\"*");
}

// ============================================================
// HANDLER: CODING
// ============================================================
function handleCodingResponse(q: string, intent: string, specificTopic: string, knowledgeBase: string, _words: string[]): string {
  if (specificTopic) {
    const kbMatch = getKnowledgeTopic(specificTopic, knowledgeBase);
    if (kbMatch) return formatResponse(kbMatch);
  }

  const kbMatch = searchKnowledge(q, knowledgeBase, ["coding"]);
  if (kbMatch) return formatResponse(kbMatch);

  // Code generation requests
  if (intent === "createCode") {
    if (q.includes("python")) return generatePythonCode(q);
    if (q.includes("javascript") || q.includes(" js ")) return generateJavaScriptCode(q);
    if (q.includes("sql") || q.includes("database")) return generateSQLCode(q);
    if (q.includes("html") || q.includes("css")) return generateHTMLCSSCode(q);
    if (q.includes("react") || q.includes("hook") || q.includes("component")) return generateReactCode(q);
    if (q.includes("bash") || q.includes("shell")) return generateBashCode(q);

    return formatResponse("Untuk generate kode, mohon spesifik bahasanya:\n\n"
      + "- *\"Buatkan function Python untuk sorting\"*\n"
      + "- *\"Buatkan JavaScript fetch API\"*\n"
      + "- *\"Buatkan SQL query untuk join\"*\n"
      + "- *\"Buatkan React component\"*\n"
      + "- *\"Buatkan bash script\"*\n\n"
      + "Atau tanyakan konsep: *\"Jelaskan async/await\"*");
  }

  // Explanation requests
  if (intent === "explain") {
    if (q.includes("async") || q.includes("await") || q.includes("promise")) {
      return formatResponse("**Async/Await & Promise**\n\n"
        + "**Promise:** Object yang merepresentasikan hasil operasi async\n"
        + "```javascript\nconst promise = new Promise((resolve, reject) => {\n  setTimeout(() => resolve('done'), 1000);\n});\npromise.then(result => console.log(result));\n```\n\n"
        + "**Async/Await:** Syntax sugar untuk Promise\n"
        + "```javascript\nasync function getData() {\n  try {\n    const res = await fetch(url);\n    const data = await res.json();\n    return data;\n  } catch (error) {\n    console.error(error);\n  }\n}\n```\n\n"
        + "**Tips:**\n"
        + "- `async` di depan function = return Promise\n"
        + "- `await` = tunggu Promise selesai\n"
        + "- Selalu handle error dengan try/catch\n"
        + "- `await` hanya bisa di dalam `async function`");
    }

    if (q.includes("closure")) {
      return formatResponse("**Closure** - Function yang mengakses variabel dari scope luar\n\n"
        + "```javascript\nfunction createCounter() {\n  let count = 0; // variabel ini \"diingat\"\n  return {\n    increment: () => ++count,\n    getCount: () => count\n  };\n}\nconst counter = createCounter();\ncounter.increment();\ncounter.getCount(); // 1\n```\n\n"
        + "**Mengapa penting:**\n"
        + "- Data privacy (encapsulation)\n"
        + "- Factory functions\n"
        + "- Event handlers\n"
        + "- Callback functions");
    }

    if (q.includes("react") || q.includes("hook") || q.includes("component")) {
      return formatResponse("**React Hooks**\n\n"
        + "**useState:** State management\n"
        + "```javascript\nconst [count, setCount] = useState(0);\n```\n\n"
        + "**useEffect:** Side effects\n"
        + "```javascript\nuseEffect(() => {\n  fetchData();\n  return () => cleanup(); // cleanup\n}, [dep]); // dependency array\n```\n\n"
        + "**useContext:** Context access\n"
        + "```javascript\nconst theme = useContext(ThemeContext);\n```\n\n"
        + "**useRef:** DOM reference\n"
        + "```javascript\nconst inputRef = useRef(null);\n```\n\n"
        + "**useMemo & useCallback:** Performance optimization");
    }

    if (q.includes("sql") || q.includes("join") || q.includes("database")) {
      return formatResponse("**SQL JOIN**\n\n"
        + "**INNER JOIN:** Baris yang match di kedua tabel\n"
        + "```sql\nSELECT a.name, b.order_date\nFROM users a\nINNER JOIN orders b ON a.id = b.user_id;\n```\n\n"
        + "**LEFT JOIN:** Semua dari tabel kiri + match dari kanan\n"
        + "```sql\nSELECT a.name, b.order_date\nFROM users a\nLEFT JOIN orders b ON a.id = b.user_id;\n```\n\n"
        + "**Window Functions:**\n"
        + "```sql\nSELECT *, ROW_NUMBER() OVER (PARTITION BY city ORDER BY age DESC) as rn\nFROM users;\n```");
    }
  }

  // Default coding response
  return formatResponse("**Coding** - Topik yang tersedia:\n\n"
    + "- **Python:** variable, function, class, comprehension, file I/O, regex\n"
    + "- **JavaScript:** ES6+, async/await, DOM, fetch, closures\n"
    + "- **TypeScript:** types, interfaces, generics, utilities\n"
    + "- **HTML/CSS:** semantic, Flexbox, Grid, responsive\n"
    + "- **SQL:** SELECT, JOIN, GROUP BY, window functions, CTE\n"
    + "- **Git:** branching, merge, stash, revert\n"
    + "- **React:** hooks, components, context, refs\n"
    + "- **Node.js:** Express, middleware, routes\n"
    + "- **Regex:** patterns, flags, common patterns\n"
    + "- **Algorithms:** sorting, searching, data structures\n\n"
    + "Contoh: *\"Buatkan function sorting di Python\"*");
}

function generatePythonCode(q: string): string {
  if (q.includes("sort") || q.includes("sorting")) {
    return formatResponse("**Python Sorting**\n\n"
      + "**Basic:**\n"
      + "```python\narr = [3, 1, 4, 1, 5, 9]\nsorted_arr = sorted(arr)  # [1, 1, 3, 4, 5, 9]\narr.sort()  # in-place\n```\n\n"
      + "**Custom key:**\n"
      + "```python\nnames = [\"Charlie\", \"Alice\", \"Bob\"]\nsorted(names, key=lambda x: len(x))  # by length\nsorted(names, key=str.lower)  # case-insensitive\n```\n\n"
      + "**Descending:**\n"
      + "```python\nsorted(arr, reverse=True)\n```\n\n"
      + "**Dict sort:**\n"
      + "```python\nstudents = [{\"name\": \"Budi\", \"grade\": 85}, {\"name\": \"Andi\", \"grade\": 92}]\nsorted(students, key=lambda x: x[\"grade\"], reverse=True)\n```");
  }

  if (q.includes("function") || q.includes("func")) {
    return formatResponse("**Python Function**\n\n"
      + "```python\n# Basic\ndef greet(name):\n    return f\"Hello, {name}!\"\n\n# Default args\ndef add(a, b=0):\n    return a + b\n\n# *args, **kwargs\ndef func(*args, **kwargs):\n    for arg in args: print(arg)\n    for k, v in kwargs.items(): print(k, v)\n\n# Lambda\nsquare = lambda x: x ** 2\n\n# List comprehension\nsquares = [x**2 for x in range(10)]\nevens = [x for x in range(10) if x % 2 == 0]\n\n# Decorator\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        import time\n        start = time.time()\n        result = func(*args, **kwargs)\n        print(f\"{func.__name__}: {time.time()-start}s\")\n        return result\n    return wrapper\n```");
  }

  return formatResponse("**Python Code Generation**\n\n"
    + "Saya bisa buatkan kode Python untuk:\n\n"
    + "- Sorting (bubble, merge, quick)\n"
    + "- Function & decorator\n"
    + "- Class & OOP\n"
    + "- File I/O (read/write)\n"
    + "- Regex pattern matching\n"
    + "- API requests\n"
    + "- CSV/JSON processing\n"
    + "- List comprehension\n\n"
    + "Contoh: *\"Buatkan function untuk sorting angka\"*");
}

function generateJavaScriptCode(q: string): string {
  return formatResponse("**JavaScript Code**\n\n"
    + "**Fetch API:**\n"
    + "```javascript\nasync function fetchData(url) {\n  try {\n    const res = await fetch(url);\n    if (!res.ok) throw new Error(res.statusText);\n    return await res.json();\n  } catch (error) {\n    console.error('Fetch error:', error);\n    throw error;\n  }\n}\n```\n\n"
    + "**Array Methods:**\n"
    + "```javascript\nconst arr = [1, 2, 3, 4, 5];\nconst doubled = arr.map(x => x * 2);\nconst evens = arr.filter(x => x % 2 === 0);\nconst sum = arr.reduce((a, b) => a + b, 0);\n```\n\n"
    + "**DOM Manipulation:**\n"
    + "```javascript\ndocument.querySelector('.btn').addEventListener('click', () => {\n  document.getElementById('output').textContent = 'Hello!';\n});\n```");
}

function generateSQLCode(q: string): string {
  return formatResponse("**SQL Code**\n\n"
    + "**SELECT with JOIN:**\n"
    + "```sql\nSELECT a.name, b.order_date, c.product_name\nFROM customers a\nINNER JOIN orders b ON a.id = b.customer_id\nLEFT JOIN products c ON b.product_id = c.id\nWHERE b.order_date >= '2024-01-01'\nORDER BY b.order_date DESC\nLIMIT 10;\n```\n\n"
    + "**Aggregate:**\n"
    + "```sql\nSELECT city, COUNT(*) as total_customers,\n  AVG(amount) as avg_spend\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nGROUP BY city\nHAVING COUNT(*) > 5\nORDER BY avg_spend DESC;\n```\n\n"
    + "**Window Function:**\n"
    + "```sql\nSELECT *,\n  ROW_NUMBER() OVER (PARTITION BY city ORDER BY age DESC) as rank_in_city\nFROM users;\n```");
}

function generateHTMLCSSCode(q: string): string {
  return formatResponse("**HTML/CSS Code**\n\n"
    + "**Responsive Card:**\n"
    + "```html\n<div class=\"card\">\n  <h2>Title</h2>\n  <p>Description</p>\n</div>\n```\n\n"
    + "```css\n.card {\n  display: flex;\n  flex-direction: column;\n  padding: 1.5rem;\n  border-radius: 12px;\n  background: var(--surface);\n  border: 1px solid var(--border);\n  transition: transform 0.2s;\n}\n.card:hover {\n  transform: translateY(-4px);\n}\n```\n\n"
    + "**Grid Layout:**\n"
    + "```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 1rem;\n}\n```\n\n"
    + "**Responsive:**\n"
    + "```css\n@media (max-width: 768px) {\n  .container { grid-template-columns: 1fr; }\n}\n```");
}

function generateReactCode(q: string): string {
  return formatResponse("**React Code**\n\n"
    + "**Function Component:**\n"
    + "```jsx\nfunction Card({ title, children, onClick }) {\n  return (\n    <div className=\"card\" onClick={onClick}>\n      <h2>{title}</h2>\n      <div>{children}</div>\n    </div>\n  );\n}\n```\n\n"
    + "**Custom Hook:**\n"
    + "```jsx\nfunction useFetch(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    fetch(url)\n      .then(res => res.json())\n      .then(setData)\n      .catch(setError)\n      .finally(() => setLoading(false));\n  }, [url]);\n\n  return { data, loading, error };\n}\n```\n\n"
    + "**Context Provider:**\n"
    + "```jsx\nconst ThemeCtx = createContext();\n\nfunction ThemeProvider({ children }) {\n  const [theme, setTheme] = useState('light');\n  return (\n    <ThemeCtx.Provider value={{ theme, setTheme }}>\n      {children}\n    </ThemeCtx.Provider>\n  );\n}\n```");
}

function generateBashCode(q: string): string {
  return formatResponse("**Bash Script**\n\n"
    + "```bash\n#!/bin/bash\n\n# Variables\nNAME=\"World\"\nDATE=$(date +%Y-%m-%d)\n\n# Conditional\nif [ \"$1\" = \"start\" ]; then\n  echo \"Starting server...\"\n  npm run dev\nelif [ \"$1\" = \"stop\" ]; then\n  echo \"Stopping...\"\n  pkill -f node\nelse\n  echo \"Usage: $0 start|stop\"\n  exit 1\nfi\n\n# Loop\nfor file in *.txt; do\n  echo \"Processing: $file\"\n  wc -l \"$file\"\ndone\n\n# Function\ndeploy() {\n  echo \"Deploying to $1\"\n  npm run build\n  git push origin main\n  echo \"Done!\"\n}\n\ndeploy production\n```\n\n"
    + "**Useful Commands:**\n"
    + "- `ls -la | grep .env` - find hidden files\n"
    + "- `curl -s URL` - fetch data\n"
    + "- `chmod +x script.sh` - make executable");
}

// ============================================================
// HANDLER: WRITING
// ============================================================
function handleWritingResponse(q: string, _intent: string, specificTopic: string, knowledgeBase: string, _words: string[]): string {
  if (specificTopic) {
    const kbMatch = getKnowledgeTopic(specificTopic, knowledgeBase);
    if (kbMatch) return formatResponse(kbMatch);
  }

  const kbMatch = searchKnowledge(q, knowledgeBase, ["writing"]);
  if (kbMatch) return formatResponse(kbMatch);

  if (q.includes("email")) {
    return formatResponse("**Email Profesional**\n\n"
      + "**Struktur:**\n"
      + "1. **Subjek:** Jelas & spesifik (max 8 kata)\n"
      + "   - Good: `[Proyek X] Update Deadline 15 Jan`\n"
      + "   - Bad: `Penting!!!`\n"
      + "2. **Salam:** \"Yth. Bapak/Ibu\" atau \"Dear [Name]\"\n"
      + "3. **Pembuka:** Tujuan email (1 kalimat)\n"
      + "   - \"Dengan email ini, saya ingin...\"\n"
      + "4. **Isi:** Langsung ke poin, paragraf pendek\n"
      + "5. **Penutup:** Action yang diperlukan\n"
      + "   - \"Mohon konfirmasi sebelum tanggal X\"\n"
      + "6. **Salam Hormat:** Hormat saya, [Nama]\n\n"
      + "**Tips:**\n"
      + "- Follow-up: tunggu 2-3 hari kerja\n"
      + "- CC: hati-hati, jangan spam\n"
      + "- Reply all: hanya jika perlu semua orang");
  }

  if (q.includes("cv") || q.includes("resume")) {
    return formatResponse("**CV/Resume**\n\n"
      + "**Struktur:**\n"
      + "1. **Contact:** Nama, email, HP, LinkedIn, portfolio\n"
      + "2. **Summary:** 2-3 kalimat tentang diri\n"
      + "3. **Experience:** Reverse chronological\n"
      + "   - Gunakan action verbs: Developed, Led, Increased\n"
      + "   - Quantifiable: \"Increased sales by 30%\"\n"
      + "4. **Education:** Gelar, universitas, tahun\n"
      + "5. **Skills:** Hard skills + soft skills\n"
      + "6. **Projects** (opsional)\n\n"
      + "**Tips:**\n"
      + "- 1-2 halaman\n"
      + "- Tailor untuk setiap lowongan\n"
      + "- ATS-friendly: pakai keyword dari job desc\n"
      + "- Hindari: foto, gaji, referensi");
  }

  return formatResponse("**Menulis** - Topik:\n\n"
    + "- **Email Profesional:** struktur, tips, follow-up\n"
    + "- **CV/Resume:** format, action verbs, ATS-friendly\n"
    + "- **Laporan:** pendahuluan, isi, penutup\n"
    + "- **Essay & Artikel:** thesis, argumen, bukti\n"
    + "- **Copywriting:** AIDA formula, persuasive writing\n\n"
    + "Contoh: *\"Tulis email profesional untuk client\"");
}

// ============================================================
// HANDLER: SCIENCE
// ============================================================
function handleScienceResponse(q: string, _intent: string, specificTopic: string, knowledgeBase: string): string {
  if (specificTopic) {
    const kbMatch = getKnowledgeTopic(specificTopic, knowledgeBase);
    if (kbMatch) return formatResponse(kbMatch);
  }

  const kbMatch = searchKnowledge(q, knowledgeBase, ["science"]);
  if (kbMatch) return formatResponse(kbMatch);

  // Fallback: search all knowledge
  const allMatch = searchKnowledge(q, knowledgeBase, []);
  if (allMatch) return formatResponse(allMatch);

  return formatResponse("**Sains & IPA** - Topik yang tersedia:\n\n"
    + "- **Fisika:** hukum Newton, energi, listrik, gelombang, termodinamika, optik\n"
    + "- **Kimia:** reaksi, asam-basa, stoikiometri, ikatan kimia, organik\n"
    + "- **Biologi:** sel, DNA, evolusi, ekosistem, anatomi tubuh manusia\n"
    + "- **Astronomi:** tata surya, bintang, galaksi, kosmologi\n\n"
    + "Contoh: *\"Jelaskan hukum Newton\"* atau *\"Apa itu fotosintesis?\"*");
}

// ============================================================
// HANDLER: GENERAL (Finance, Health, History, Tech, Daily Life)
// ============================================================
function handleGeneralResponse(q: string, _intent: string, specificTopic: string, knowledgeBase: string): string {
  if (specificTopic) {
    const kbMatch = getKnowledgeTopic(specificTopic, knowledgeBase);
    if (kbMatch) return formatResponse(kbMatch);
  }

  const kbMatch = searchKnowledge(q, knowledgeBase, ["general"]);
  if (kbMatch) return formatResponse(kbMatch);

  // Fallback: search all knowledge
  const allMatch = searchKnowledge(q, knowledgeBase, []);
  if (allMatch) return formatResponse(allMatch);

  return formatResponse("**Pengetahuan Umum** - Topik:\n\n"
    + "- **Keuangan:** budgeting, investasi, pajak, crypto, tabungan\n"
    + "- **Kesehatan:** nutrisi, olahraga, tidur, stres, ergonomi\n"
    + "- **Sejarah:** peradaban kuno, Renaissance, revolusi industri\n"
    + "- **Geografi:** benua, negara, sungai, iklim, timezone\n"
    + "- **Teknologi:** AI, blockchain, 5G, cybersecurity, UX\n"
    + "- **Kehidupan Sehari-hari:** produktivitas, komunikasi, memasak\n\n"
    + "Contoh: *\"Apa itu compound interest?\"* atau *\"Tips produktivitas\"*");
}

// ============================================================
// HANDLER: WEB FEATURES
// ============================================================
function handleWebFeatures(q: string, _specificTopic: string): string {
  if (q.includes("typing") || q.includes("mengetik") || q.includes("wpm")) {
    if (q.includes("multiplayer") || q.includes("teman") || q.includes("room")) {
      return formatResponse("**Multiplayer Typing Test**\n\n"
        + "1. Pilih mode **Friend**\n"
        + "2. **Create Room** -> dapat 6-digit code\n"
        + "3. Share code ke teman\n"
        + "4. Teman: **Join Room** -> masukkan code\n"
        + "5. Race dimulai saat kedua siap!\n\n"
        + "**Menang:** WPM tertinggi + accuracy minimal 80%");
    }
    if (q.includes("tips") || q.includes("cara") || q.includes("latihan")) {
      return formatResponse("**Tips Menaikkan WPM**\n\n"
        + "1. Fokus **accuracy** dulu (target 95%+)\n"
        + "2. Latihan 15-30 menit/hari\n"
        + "3. Mulai Easy, naik ke Hard\n"
        + "4. Pakai **10 jari** (touch typing)\n"
        + "5. Jangan lihat keyboard\n"
        + "6. Postur tegak, pergelangan mengambang\n"
        + "7. Istirahat saat jari lelah");
    }
    return formatResponse("**Typing Test**\n\n"
      + "- 3 difficulty: Easy, Medium, Hard\n"
      + "- 4 mode waktu: 15s, 30s, 60s, 120s\n"
      + "- Solo atau Multiplayer\n"
      + "- 2 bahasa: English & Indonesia\n"
      + "- Stats: WPM, Accuracy, Max WPM");
  }

  if (q.includes("notepad")) {
    return formatResponse("**Notepad**\n\n"
      + "- Buat, edit, pin catatan\n"
      + "- Auto-save ke cloud\n"
      + "- Search & filter\n"
      + "- Akses dari device apapun");
  }

  if (q.includes("broadcast")) {
    return formatResponse("**Broadcast**\n\n"
      + "- Low (abu-abu): info umum\n"
      + "- Normal (biru): pengumuman biasa\n"
      + "- High (kuning): penting\n"
      + "- Urgent (merah): sangat penting");
  }

  if (q.includes("theme") || q.includes("tema")) {
    return formatResponse("**10 Tema Web Utama**\n\n"
      + "1. **Cyborg** -科技蓝\n"
      + "2. **Samurai** -日本红\n"
      + "3. **Aurora** -极光绿\n"
      + "4. **Marvel** -英雄红\n"
      + "5. **Medieval** -中世纪棕\n"
      + "6. **Cyberpunk** -赛博紫\n"
      + "7. **Space** -太空深蓝\n"
      + "8. **Nature** -自然绿\n"
      + "9. **Deep Ocean** -深海蓝\n"
      + "10. **Volcanic** -火山红\n\n"
      + "Klik tombol theme di navbar.");
  }

  return formatResponse("**Web Utama Features**\n\n"
    + "- **Typing Test:** solo + multiplayer, EN + ID\n"
    + "- **Notepad:** pin, search, auto-save\n"
    + "- **Broadcast:** low/normal/high/urgent\n"
    + "- **10 Themes:** Cyborg, Samurai, Aurora, dll\n"
    + "- **AI Chatbot:** 100+ knowledge entries\n"
    + "- **Master Panel:** admin area (/master)");
}

// ============================================================
// MATH CALCULATOR
// ============================================================
function tryCalculate(q: string): string | null {
  // Try to calculate percentages
  const percentMatch = q.match(/(\d+(?:\.\d+)?)\s*%\s*(?:dari|of)\s*(\d+(?:\.\d+)?)/i);
  if (percentMatch) {
    const pct = parseFloat(percentMatch[1]);
    const base = parseFloat(percentMatch[2]);
    const result = (pct / 100) * base;
    return formatResponse(`**${pct}% dari ${base.toLocaleString("id-ID")}**\n\n`
      + "```\n"
      + `${pct}% x ${base.toLocaleString("id-ID")} / 100\n`
      + `= ${pct} x ${base.toLocaleString("id-ID")} / 100\n`
      + `= ${result.toLocaleString("id-ID")}\n`
      + "```\n\n"
      + `**Hasil: ${result.toLocaleString("id-ID")}**`);
  }

  // Try discount
  const discountMatch = q.match(/diskon\s*(\d+(?:\.\d+)?)\s*%.*?(\d+(?:\.\d+)?)/i) ||
    q.match(/(\d+(?:\.\d+)?)\s*(?:rb|ribu|jt|juta|k|m)?\s*(?:diskon|potongan|off)\s*(\d+(?:\.\d+)?)\s*%/i);
  if (discountMatch) {
    let price = parseFloat(discountMatch[1]);
    const discount = parseFloat(discountMatch[2]);
    if (q.includes("ribu") || q.includes("rb")) price *= 1000;
    if (q.includes("juta") || q.includes("jt")) price *= 1000000;
    const after = price * (1 - discount / 100);
    const saved = price - after;
    return formatResponse(`**Diskon ${discount}% dari Rp${price.toLocaleString("id-ID")}**\n\n`
      + "```\n"
      + `Harga Awal:  Rp ${price.toLocaleString("id-ID")}\n`
      + `Diskon:      -Rp ${saved.toLocaleString("id-ID")} (${discount}%)\n`
      + `─────────────────────\n`
      + `Harga Akhir: Rp ${after.toLocaleString("id-ID")}\n`
      + "```\n\n"
      + `**Anda hemat Rp ${saved.toLocaleString("id-ID")}!**`);
  }

  // Try simple arithmetic
  const mathMatch = q.match(/(\d+(?:\.\d+)?)\s*([+\-*/xX^])\s*(\d+(?:\.\d+)?)/);
  if (mathMatch) {
    const a = parseFloat(mathMatch[1]);
    const op = mathMatch[2];
    const b = parseFloat(mathMatch[3]);
    let result: number;
    let opName: string;
    switch (op) {
      case "+": result = a + b; opName = "Penjumlahan"; break;
      case "-": result = a - b; opName = "Pengurangan"; break;
      case "*": case "x": case "X": result = a * b; opName = "Perkalian"; break;
      case "/": result = b !== 0 ? a / b : NaN; opName = "Pembagian"; break;
      case "^": result = Math.pow(a, b); opName = "Pangkat"; break;
      default: return null;
    }
    if (isNaN(result)) return formatResponse("**Error:** Pembagian dengan nol!");
    return formatResponse(`**${opName}**\n\n\`${a} ${op} ${b} = ${result}\``);
  }

  return null;
}

// ============================================================
// LEVENSHTEIN DISTANCE (for fuzzy matching)
// ============================================================
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
}

function fuzzyMatch(word: string, target: string, threshold = 0.7): boolean {
  if (target.includes(word) || word.includes(target)) return true;
  const maxLen = Math.max(word.length, target.length);
  if (maxLen === 0) return true;
  const distance = levenshtein(word, target);
  return (1 - distance / maxLen) >= threshold;
}

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(w => w.length > 2);
}

// ============================================================
// KNOWLEDGE BASE SEARCH (with fuzzy matching)
// ============================================================
function searchKnowledge(question: string, knowledgeBase: string, categories: string[]): string | null {
  const q = question.toLowerCase();
  const entries = knowledgeBase.split("\n").filter(line => line.includes("]"));
  const questionTokens = tokenize(q);

  let bestMatch = "";
  let bestScore = 0;

  for (const entry of entries) {
    const match = entry.match(/\[(\w+)\]\s*(.+?):\s*(.+)/);
    if (!match) continue;

    const [, category, topic, content] = match;
    if (categories.length > 0 && !categories.includes(category)) continue;

    const topicWords = topic.toLowerCase().replace(/_/g, " ").split(" ");
    let score = 0;

    for (const tw of topicWords) {
      if (tw.length < 2) continue;
      if (q.includes(tw)) { score += 3; continue; }
      for (const qt of questionTokens) {
        if (fuzzyMatch(qt, tw, 0.7)) { score += 2; break; }
      }
    }

    const contentLower = content.toLowerCase();
    for (const qt of questionTokens) {
      if (qt.length < 3) continue;
      if (contentLower.includes(qt)) { score += 1; continue; }
      const contentWords = contentLower.split(/\s+/);
      for (const cw of contentWords) {
        if (fuzzyMatch(qt, cw, 0.75)) { score += 1; break; }
      }
    }

    if (score > bestScore && score >= 2) {
      bestScore = score;
      bestMatch = content;
    }
  }

  return bestMatch || null;
}

function getKnowledgeTopic(topic: string, knowledgeBase: string): string | null {
  const regex = new RegExp(`\\[\\w+\\]\\s*${topic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:\\s*(.+)`, "i");
  const match = knowledgeBase.match(regex);
  if (match) return match[1];

  const entries = knowledgeBase.split("\n").filter(line => line.includes("]"));
  for (const entry of entries) {
    const m = entry.match(/\[(\w+)\]\s*(.+?):\s*(.+)/);
    if (!m) continue;
    const [, , t, content] = m;
    if (fuzzyMatch(topic.toLowerCase(), t.toLowerCase().replace(/_/g, " "), 0.6)) {
      return content;
    }
  }
  return null;
}

// ============================================================
// RESPONSE FORMATTER
// ============================================================
function formatResponse(text: string): string {
  return text;
}

// ============================================================
// DETECT TEMPLATE/FALLBACK RESPONSES
// Template responses = generic messages that don't actually answer the question
// ============================================================
function isTemplateResponse(response: string): boolean {
  const templatePatterns = [
    /Pertanyaan menarik/,
    /Saya bisa membantu tentang:/,
    /Coba tanyakan lebih spesifik/,
    /Saya punya \d+ rumus/,
    /Topik yang tersedia/,
    /Contoh: \*"/,
    /Atau ketik \*"help"\*/,
    /Topik:/,
    /Untuk generate kode/,
    /Saya bisa buatkan kode/,
    /Saya ada \d+/,
    /fitur Web Utama/,
    /maaf.*belum bisa/,
  ];

  return templatePatterns.some(pattern => pattern.test(response));
}

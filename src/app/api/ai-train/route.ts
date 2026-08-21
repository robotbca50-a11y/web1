import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/admin-auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// ============================================================
// QUESTION POOL - 200+ diverse questions covering many topics
// ============================================================
const QUESTION_POOL: string[] = [
  // === MATH ===
  "Bagaimana cara menghitung BMI?", "Apa itu Deret Fibonacci?", "Jelaskan Teorema Pythagoras dengan contoh",
  "Bagaimana cara menghitung bunga majemuk?", "Apa itu statistik deskriptif?", "Jelaskan konsep limit dalam kalkulus",
  "Apa itu matriks dan cara mengalikannya?", "Bagaimana cara menyelesaikan persamaan kuadrat?", "Apa itu probabilitas kondisional?",
  "Jelaskan hukum Bayes", "Apa itu transformasi Fourier?", "Bagaimana cara menghitung standar deviasi?",

  // === CODING ===
  "Apa itu closure dalam JavaScript?", "Bagaimana cara membuat REST API dengan Express?", "Jelaskan perbedaan SQL dan NoSQL",
  "Apa itu Docker dan kenapa digunakan?", "Bagaimana cara deploy ke Vercel?", "Apa itu React hooks?",
  "Jelaskan async await dalam JavaScript", "Bagaimana cara membuat chatbot sederhana?", "Apa itu Git rebase?",
  "Bagaimana cara optimize query SQL?", "Apa itu WebSocket?", "Jelaskan MVC pattern",
  "Bagaimana cara membuat website responsive?", "Apa itu TypeScript dan kenapa pakai?", "Bagaimana cara menggunakan API GitHub?",
  "Apa itu CI/CD pipeline?", "Jelaskan konsep middleware dalam Express", "Bagaimana cara caching dengan Redis?",
  "Apa itu GraphQL?", "Bagaimana cara membuat Discord bot?",

  // === SCIENCE ===
  "Apa itu fotosintesis?", "Jelaskan hukum Newton ketiga", "Bagaimana cara kerja listrik?",
  "Apa itu DNA dan fungsinya?", "Jelaskan teori evolusi Darwin", "Apa itu black hole?",
  "Bagaimana terjadinya gempa bumi?", "Apa itu sel dan organelnya?", "Jelaskan siklus air",
  "Apa itu fotosintesis buatan?", "Bagaimana cara kerja vaksin?", "Apa itu renewable energy?",

  // === EXCEL/GOOGLE SHEETS ===
  "Bagaimana cara menggunakan VLOOKUP?", "Apa itu pivot table?", "Rumus IF bersarang yang benar",
  "Cara membuat chart di Excel", "Apa itu conditional formatting?", "Rumus INDEX MATCH",
  "Cara import data dari CSV ke Excel", "Apa itu Power Query?", "Rumus SUMPRODUCT",
  "Cara membuat dropdown di Google Sheets", "Apa itu QUERY function?", "Cara protect cell di Excel",

  // === WRITING ===
  "Tips menulis email profesional", "Cara membuat CV yang menarik", "Struktur essay yang baik",
  "Tips copywriting AIDA formula", "Cara menulis laporan tahunan", "Tips presentasi yang efektif",
  "Cara menulis proposal bisnis", "Tips menulis konten blog SEO",

  // === FINANCE ===
  "Apa itu cryptocurrency?", "Bagaimana cara investasi saham?", "Apa itu compound interest?",
  "Tips budgeting bulanan", "Apa itu asuransi jiwa?", "Cara menghitung pajak penghasilan",
  "Apa itu reksadana?", "Tips menabung yang efektif",

  // === HEALTH ===
  "Tips menjaga kesehatan mental", "Cara mengatasi stres", "Tips tidur yang berkualitas",
  "Manfaat olahraga rutin", "Cara diet sehat", "Tips menjaga postur tubuh",

  // === DAILY LIFE ===
  "Tips produktivitas kerja", "Cara mengatasi prokrastinasi", "Tips manajemen waktu",
  "Cara memasak nasi goreng", "Tips bekerja dari rumah", "Cara belajar efektif",
  "Tips presentasi di depan umum", "Cara membuat presentasi menarik",

  // === TECHNOLOGY ===
  "Apa itu artificial intelligence?", "Bagaimana cara kerja blockchain?", "Apa itu 5G?",
  "Tips keamanan siber", "Apa itu cloud computing?", "Cara menggunakan GitHub",
  "Apa itu machine learning?", "Bagaimana cara kerja VPN?",

  // === HISTORY ===
  "Sejarah kerajaan Majapahit", "Apa itu Renaissance?", "Sejarah kemerdekaan Indonesia",
  "Apa itu revolusi industri?", "Sejarah internet",

  // === GEOGRAPHY ===
  "Apa 7 benua di dunia?", "Negara terbesar di dunia", "Apa itu time zone?",
  "Faktor iklim tropis Indonesia",

  // === LEGAL (general knowledge) ===
  "Apa itu HAKI?", "Apa itu NIK?", "Cara membuat CV",
  "Apa itu kontrak kerja?", "Tips negosiasi gaji",

  // === UNIVERSE ===
  "Bagaimana terjadinya matahari?", "Apa itu Big Bang?", "Planet mana yang paling besar?",
  "Apa itu light year?",

  // === FOOD ===
  "Resep sate ayam", "Cara membuat bakso", "Tips memasak rendang",
  "Resep nasi goreng sederhana",

  // === PSYCHOLOGY ===
  "Apa itu MBTI?", "Apa itu overthinking?", "Cara mengatasixiety",
  "Apa itu zone of proximal development?",

  // === BUSINESS ===
  "Cara memulai bisnis online", "Apa itu lean startup?", "Tips marketing digital",
  "Cara membuat business plan",

  // === MISCELLANEOUS ===
  "Cara membuat email Gmail", "Tips belajar bahasa pemrograman", "Apa itu open source?",
  "Cara menggunakan Notion", "Tips belanja online aman", "Apa itu e-wallet?",
  "Cara membuat website gratis", "Tips belajar desain", "Apa itu UI/UX?",
  "Cara membuat CV ATS friendly", "Tips interview kerja", "Apa itu portofolio?",
  "Cara freelance untuk pemula", "Tips belajar data science", "Apa itu data analyst?",
  "Cara memulai karir di IT", "Tips networking profesional", "Apa itu personal branding?",
  "Cara membuat blog", "Tips SEO untuk pemula", "Apa itu Google Analytics?",
  "Cara menggunakan Canva", "Tips foto produk", "Apa itu dropshipping?",
  "Cara jualan di Shopee", "Tips customer service", "Apa itu CRM?",
  "Cara menggunakan ChatGPT", "Tips belajar Python", "Apa itu React Native?",
  "Cara membuat app mobile", "Tips belajar CSS", "Apa itu Tailwind CSS?",
  "Cara menggunakan Figma", "Tips belajar design", "Apa itu wireframe?",
  "Cara membuat prototype", "Tips user research", "Apa itu A/B testing?",
  "Cara menggunakan Photoshop", "Tips editing video", "Apa itu content creator?",
  "Cara memulai YouTube channel", "Tips podcast untuk pemula", "Apa itu affiliate marketing?",
  "Cara menghasilkan uang dari internet", "Tips side hustle", "Apa itu passive income?",
];

// ============================================================
// TRAINING ENGINE
// ============================================================
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type AIProvider = "openai" | "groq" | "deepseek" | "together" | "ollama" | "xai" | "ollama-cloud" | "openrouter";

async function callWithProvider(provider: AIProvider, apiKey: string, systemPrompt: string, question: string): Promise<string> {
  const configs: Record<AIProvider, { baseUrl: string; model: string }> = {
    openai: { baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini" },
    groq: { baseUrl: "https://api.groq.com/openai/v1", model: "llama-3.1-8b-instant" },
    deepseek: { baseUrl: "https://api.deepseek.com/v1", model: "deepseek-chat" },
    together: { baseUrl: "https://api.together.xyz/v1", model: "meta-llama/Llama-3-8b-chat-hf" },
    xai: { baseUrl: "https://api.x.ai/v1", model: "grok-3-mini" },
    "ollama-cloud": { baseUrl: "https://ollama.com/v1", model: "gpt-oss:20b" },
    openrouter: { baseUrl: "https://openrouter.ai/api/v1", model: "openai/gpt-4o" },
    ollama: { baseUrl: process.env.OLLAMA_URL || "http://localhost:11434", model: process.env.OLLAMA_MODEL || "llama3.2" },
  };
  const cfg = configs[provider];

  if (provider === "ollama") {
    const res = await fetch(`${cfg.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: cfg.model, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: question }], stream: false }),
    });
    if (!res.ok) throw new Error(`Ollama ${res.status}`);
    const d = await res.json();
    return d.message?.content || "";
  }

  if (!apiKey) throw new Error(`No API key for ${provider}`);
  const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: cfg.model, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: question }], max_tokens: 4096, temperature: 0.7 }),
  });
  if (!res.ok) { const e = await res.text(); throw new Error(`${provider} ${res.status}: ${e.substring(0, 100)}`); }
  const d = await res.json();
  const content = d.choices?.[0]?.message?.content || "";
  const reasoning = d.choices?.[0]?.message?.reasoning || "";
  return content || reasoning || "";
}

async function callExternalAI(question: string): Promise<string> {
  const systemPrompt = "Kamu adalah AI assistant yang membantu menjawab pertanyaan dengan akurat dan lengkap. Jawab dalam bahasa yang sama dengan pertanyaan. Berikan contoh jika relevan.";

  const apiKey = process.env.AI_API_KEY || "";
  const primary: AIProvider = apiKey.startsWith("xai-") ? "xai" : apiKey ? "ollama-cloud" : "ollama";

  try {
    return await callWithProvider(primary, apiKey, systemPrompt, question);
  } catch (e) {
    console.log(`[AI-TRAIN] ${primary} failed: ${e instanceof Error ? e.message : e}`);
  }

  if (apiKey && primary !== "ollama-cloud") {
    try {
      const result = await callWithProvider("ollama-cloud", apiKey, systemPrompt, question);
      console.log("[AI-TRAIN] Fallback ollama-cloud succeeded!");
      return result;
    } catch { /* skip */ }
  }

  const OR_KEY = "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";
  if (primary !== "openrouter") {
    try {
      const result = await callWithProvider("openrouter", OR_KEY, systemPrompt, question);
      console.log("[AI-TRAIN] Fallback openrouter succeeded!");
      return result;
    } catch { /* skip */ }
  }

  if (primary !== "ollama") {
    try {
      return await callWithProvider("ollama", "", systemPrompt, question);
    } catch { /* skip */ }
  }

  throw new Error("All AI providers failed. Set AI_API_KEY for Ollama Cloud.");
}

function detectCategory(question: string): string {
  const q = question.toLowerCase();
  if (/excel|rumus|vlookup|spreadsheet|formula|cell|sheet|pivot/.test(q)) return "excel";
  if (/google sheets|gsheet|query.*sheet|sparkline|importhtml/.test(q)) return "gsheet";
  if (/python|javascript|typescript|react|node|sql|git|coding|program|code|html|css|bash|api|function|docker|ci.cd|websocket|graphql|middleware/.test(q)) return "coding";
  if (/matematika|math|hitung|persamaan|kuadrat|algebra|statistik|kalkulus|trigonometri|fibonacci|pythagoras|matriks|limit|probabilitas|bayes|fourier|deviasi/.test(q)) return "math";
  if (/fisika|physics|kimia|chemistry|biologi|biology|sains|science|astronomi|fotosintesis|dna|evolusi|sel|gempa|vaksin|energi/.test(q)) return "science";
  if (/email|cv|resume|menulis|writing|laporan|essay|copywriting|proposal|presentasi/.test(q)) return "writing";
  if (/keuangan|finance|investasi|investing|budget|anggaran|pajak|tax|saham|stock|crypto|bitcoin|reksadana|asuransi|bunga majemuk|compound/.test(q)) return "general";
  if (/kesehatan|health|diet|olahraga|exercise|tidur|sleep|stres|stress|mental|postur|pikun/.test(q)) return "general";
  if (/sejarah|history|geografi|geography|negara|country|majapahit|renaissance|kemerdekaan|revolusi|internet|benua|timezone/.test(q)) return "general";
  if (/teknologi|technology|ai|artificial intelligence|blockchain|5g|cloud|cybersecurity|machine learning|vpn/.test(q)) return "general";
  if (/masak|resep|nasi goreng|sate|bakso|rendang|memasak|food|cooking/.test(q)) return "general";
  if (/psikologi|psychology|mbti|overthinking|anxiety|belajar|zone/.test(q)) return "general";
  if (/bisnis|business|startup|marketing|digital|freelance|career|portofolio|interview|gaji/.test(q)) return "general";
  return "general";
}

async function trainBatch(count: number = 10): Promise<{
  trained: number;
  failed: number;
  questions: Array<{ question: string; answer: string; status: string }>;
}> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get already trained questions to avoid duplicates
  const { data: existing } = await supabase
    .from("ai_learned_knowledge")
    .select("question");

  const existingSet = new Set(
    (existing || []).map((e: { question: string }) => e.question.toLowerCase().trim())
  );

  // Filter out already trained questions
  const available = QUESTION_POOL.filter(
    q => !existingSet.has(q.toLowerCase().trim())
  );

  // Shuffle and take N random questions
  const shuffled = shuffleArray(available);
  const selected = shuffled.slice(0, count);

  let trained = 0;
  let failed = 0;
  const results: Array<{ question: string; answer: string; status: string }> = [];

  for (const question of selected) {
    try {
      const answer = await callExternalAI(question);
      if (!answer || answer.length < 10) {
        results.push({ question, answer: "(no answer)", status: "failed" });
        failed++;
        continue;
      }

      const category = detectCategory(question);

      // Check if exists first, then insert or update
      const { data: existing } = await supabase
        .from("ai_learned_knowledge")
        .select("id")
        .ilike("question", question.trim())
        .limit(1);

      if (existing && existing.length > 0) {
        // Update existing
        await supabase
          .from("ai_learned_knowledge")
          .update({ answer, category, source: "ollama_training" })
          .eq("id", existing[0].id);
      } else {
        // Insert new
        await supabase.from("ai_learned_knowledge").insert({
          question: question.trim(),
          answer,
          category,
          source: "ollama_training",
          usage_count: 0,
        });
      }

      results.push({ question, answer: answer.substring(0, 150) + "...", status: "success" });
      trained++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown";
      results.push({ question, answer: `Error: ${msg}`, status: "error" });
      failed++;
    }
  }

  return { trained, failed, questions: results };
}

// ============================================================
// API ROUTES
// ============================================================

// POST: Start training batch
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if ("error" in auth) return auth.error;

    const body = await req.json().catch(() => ({}));
    const count = Math.min(Math.max(body.count || 10, 1), 50);

    const result = await trainBatch(count);

    return NextResponse.json({
      success: true,
      message: `Training complete: ${result.trained} trained, ${result.failed} failed`,
      ...result,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

// GET: Check training status and stats
export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { count: totalLearned } = await supabase
      .from("ai_learned_knowledge")
      .select("*", { count: "exact", head: true });

    const { data: byCategory } = await supabase
      .from("ai_learned_knowledge")
      .select("category")
      .then(({ data }) => {
        if (!data) return { data: [] };
        const counts: Record<string, number> = {};
        data.forEach((d: { category: string }) => {
          counts[d.category] = (counts[d.category] || 0) + 1;
        });
        return { data: counts };
      });

    const { data: topUsed } = await supabase
      .from("ai_learned_knowledge")
      .select("question, usage_count")
      .order("usage_count", { ascending: false })
      .limit(5);

    const { data: recent } = await supabase
      .from("ai_learned_knowledge")
      .select("question, category, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    const remaining = QUESTION_POOL.length - (totalLearned || 0);

    const apiKey = process.env.AI_API_KEY || "";
    const provider = apiKey.startsWith("xai-") ? "xai" : apiKey ? "ollama-cloud" : "ollama";

    return NextResponse.json({
      totalLearned: totalLearned || 0,
      totalPool: QUESTION_POOL.length,
      remaining: Math.max(0, remaining),
      byCategory: byCategory,
      topUsed: topUsed || [],
      recentTrained: recent || [],
      aiProvider: provider,
      hasApiKey: apiKey.length > 0,
      ollamaUrl: process.env.OLLAMA_URL || "http://localhost:11434",
      ollamaModel: process.env.OLLAMA_MODEL || "llama3.2",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

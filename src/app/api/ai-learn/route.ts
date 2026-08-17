import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Supported AI providers
type AIProvider = "openai" | "groq" | "deepseek" | "together" | "ollama";

function getAIConfig(): { provider: AIProvider; apiKey: string; baseUrl: string; model: string } {
  const provider = (process.env.AI_PROVIDER || "groq") as AIProvider;
  const apiKey = process.env.AI_API_KEY || "";
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";

  const configs: Record<AIProvider, { baseUrl: string; model: string }> = {
    openai: { baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini" },
    groq: { baseUrl: "https://api.groq.com/openai/v1", model: "llama-3.1-8b-instant" },
    deepseek: { baseUrl: "https://api.deepseek.com/v1", model: "deepseek-chat" },
    together: { baseUrl: "https://api.together.xyz/v1", model: "meta-llama/Llama-3-8b-chat-hf" },
    ollama: { baseUrl: ollamaUrl, model: process.env.OLLAMA_MODEL || "llama3.1" },
  };

  return { provider, apiKey, baseUrl: configs[provider].baseUrl, model: configs[provider].model };
}

async function callExternalAI(question: string, existingKnowledge: string): Promise<string> {
  const config = getAIConfig();

  // Ollama doesn't need API key
  if (config.provider !== "ollama" && !config.apiKey) {
    throw new Error("AI_API_KEY not configured");
  }

  const systemPrompt = `You are a helpful, knowledgeable AI assistant for Web Utama platform. 
Answer questions accurately, concisely, and in the same language as the question (Indonesian or English).
Provide practical, actionable answers with examples when relevant.
Format your response with markdown for readability (bold, code blocks, lists).

${existingKnowledge ? `Existing knowledge base context:\n${existingKnowledge}\n\nUse this context if relevant, but provide your own knowledge if the context is insufficient.` : ""}`;

  // Ollama uses different API format
  if (config.provider === "ollama") {
    const response = await fetch(`${config.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Ollama error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return data.message?.content || "Sorry, I couldn't generate an answer.";
  }

  // OpenAI-compatible API (Groq, OpenAI, DeepSeek, Together)
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      max_tokens: 2048,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Sorry, I couldn't generate an answer.";
}

function detectCategory(question: string): string {
  const q = question.toLowerCase();
  if (/excel|rumus|vlookup|spreadsheet|formula|cell|sheet/.test(q)) return "excel";
  if (/google sheets|gsheet|query.*sheet|sparkline|importhtml/.test(q)) return "gsheet";
  if (/python|javascript|typescript|react|node|sql|git|coding|program|code|html|css|bash|api|function/.test(q)) return "coding";
  if (/matematika|math|hitung|persamaan|kuadrat|algebra|statistik|kalkulus|trigonometri/.test(q)) return "math";
  if (/fisika|physics|kimia|chemistry|biologi|biology|sains|science|astronomi/.test(q)) return "science";
  if (/email|cv|resume|menulis|writing|laporan|essay|copywriting/.test(q)) return "writing";
  return "general";
}

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }

    const trimmed = question.trim();
    if (trimmed.length < 3) {
      return NextResponse.json({ error: "Question too short" }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Check if we already learned this question (fuzzy match via RPC)
    try {
      const { data: existing } = await supabase.rpc("get_or_learn_answer", {
        p_question: trimmed,
      });

      if (existing && !existing.is_new && existing.answer) {
        return NextResponse.json({
          answer: existing.answer,
          source: "learned_cache",
          isNew: false,
        });
      }
    } catch {
      // RPC might not exist yet, continue to AI API
    }

    // 2. Also check ai_knowledge (static knowledge base) first
    const { data: staticKB } = await supabase
      .from("ai_knowledge")
      .select("content, topic")
      .or(`topic.ilike.%${trimmed}%,content.ilike.%${trimmed}%`)
      .limit(3);

    const staticContext = staticKB
      ?.map((k: { topic: string; content: string }) => `${k.topic}: ${k.content}`)
      .join("\n") || "";

    // 3. Call external AI API
    let answer: string;
    try {
      answer = await callExternalAI(trimmed, staticContext);
    } catch (aiError) {
      // If AI API fails, try to provide a helpful response from static knowledge
      if (staticContext) {
        return NextResponse.json({
          answer: staticContext,
          source: "static_knowledge",
          isNew: false,
        });
      }
      throw aiError;
    }

    // 4. Save learned Q&A to database (upsert - don't duplicate)
    const category = detectCategory(trimmed);
    try {
      await supabase.from("ai_learned_knowledge").upsert(
        {
          question: trimmed,
          answer: answer,
          category: category,
          source: "ai_api",
          usage_count: 1,
        },
        { onConflict: "idx_ai_learned_unique_question" }
      );
    } catch {
      // Save failed, but we still have the answer
      console.warn("Failed to save learned knowledge");
    }

    return NextResponse.json({
      answer: answer,
      source: "ai_api_fresh",
      isNew: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Learning failed",
        message,
        answer: "Maaf, saya belum bisa menjawab pertanyaan ini. AI API belum dikonfigurasi atau sedang tidak tersedia. Silakan tanyakan tentang topik yang saya kuasai: Excel, Matematika, Coding, Sains, atau Menulis.",
        source: "error_fallback",
      },
      { status: 200 }
    );
  }
}

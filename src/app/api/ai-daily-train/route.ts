import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Load question pool (we'll generate on-the-fly using same algorithm as engine)
const QUESTION_POOL = [
  // CYBERSECURITY
  "Bagaimana cara memulai karir ethical hacking? Tools, sertifikasi, learning path, dan tips dari praktisi.",
  "Jelaskan OWASP Top 10 2021 secara mendalam - setiap vulnerability, cara eksploitasi, contoh kode, dan defense techniques.",
  "Apa itu penetration testing methodology? PTES, OSSTMM, cara planning, execution, reporting, dan follow-up.",
  "Bagaimana cara melakukan web application security testing? Manual vs automated, tools (Burp Suite, OWASP ZAP), dan best practices.",
  "Jelaskan tentang network security monitoring - IDS/IPS, SIEM, log analysis, anomaly detection, dan incident response.",
  "Apa itu threat modeling? STRIDE, DREAD, cara mengidentifikasi threats, mitigasi, dan integrasi dalam SDLC.",
  "Bagaimana cara secure API endpoints? Authentication, authorization, rate limiting, input validation, dan security headers.",
  "Jelaskan tentang digital forensics investigation - evidence collection, chain of custody, analysis tools, dan legal considerations.",
  "Apa itu bug bounty program? Cara memulai, tools yang digunakan, report writing, dan etika responsible disclosure.",
  "Bagaimana cara melakukan OSINT (Open Source Intelligence)? Tools, techniques, data sources, dan ethical considerations.",

  // PROGRAMMING
  "Ajarkan saya JavaScript event loop secara mendalam - call stack, task queue, microtask queue, browser vs Node.js differences, dan performance implications.",
  "Jelaskan tentang React rendering lifecycle - virtual DOM diffing, reconciliation, concurrent features, Suspense, dan performance optimization techniques.",
  "Bagaimana cara membangun scalable microservices? Service decomposition, communication patterns, data management, dan observability.",
  "Apa itu design patterns dalam software engineering? Singleton, Factory, Observer, Strategy, dan kapan menggunakannya.",
  "Jelaskan tentang database indexing strategies - B-tree, hash, composite indexes, covering indexes, dan query optimization.",
  "Bagaimana cara melakukan code refactoring yang aman? Techniques, anti-patterns, testing strategies, dan incremental improvement.",
  "Apa itu Test-Driven Development (TDD)? Cycle红绿重构, mocking, integration testing, dan benefits/challenges.",
  "Jelaskan tentang Git advanced workflows - Gitflow, rebasing, cherry-picking, bisect, dan conflict resolution strategies.",
  "Bagaimana cara optimize web performance? Core Web Vitals, lazy loading, code splitting, caching, dan CDN strategies.",
  "Apa itu WebSocket vs Server-Sent Events vs Polling? Perbandingan, use cases, implementation patterns, dan scaling considerations.",

  // MATH
  "Jelaskan tentang probability distributions - normal, binomial, Poisson, exponential,应用场景, dan bagaimana memilih distribusi yang tepat.",
  "Bagaimana cara kerja linear regression dari sudut pandang matematika? Least squares, gradient descent, assumptions, dan diagnostics.",
  "Apa itu eigenvalues dan eigenvectors? Definisi, cara menghitung, applications di PCA, Google PageRank, dan vibration analysis.",
  "Jelaskan tentang Fourier Transform - konsep, math behind it, applications di signal processing, image compression, dan audio analysis.",
  "Bagaimana cara memahami dan menggunakan Bayes Theorem? Prior, likelihood, posterior, applications di medical testing, spam filtering, dan machine learning.",
  "Apa itu differential equations? Types (ODE, PDE), solution methods, applications di physics, engineering, dan economics.",
  "Jelaskan tentang graph theory - types of graphs, algorithms (BFS, DFS, Dijkstra), applications di networks, social media, dan routing.",
  "Bagaimana cara kerja RSA encryption dari sisi matematika? Prime numbers, modular arithmetic, key generation, dan security proofs.",
  "Apa itu chaos theory? Sensitive dependence, strange attractors, butterfly effect, dan applications di weather forecasting dan finance.",
  "Jelaskan tentang Markov chains - definition, transition matrices, stationary distributions, applications di Google PageRank dan simulation.",

  // AI/TECHNOLOGY
  "Bagaimana cara kerja Transformer architecture dalam LLM? Self-attention, multi-head attention, positional encoding, dan training process.",
  "Jelaskan tentang RAG (Retrieval-Augmented Generation) systems - vector databases, embedding models, chunking strategies, dan evaluation metrics.",
  "Apa itu fine-tuning LLM? LoRA, QLoRA, prompt engineering, RLHF, dan trade-offs antara fine-tuning vs prompt engineering.",
  "Bagaimana cara membangun production ML pipeline? Feature engineering, model training, deployment, monitoring, dan A/B testing.",
  "Jelaskan tentang computer vision applications - object detection (YOLO), image segmentation, OCR, dan real-time processing.",
  "Apa itu reinforcement learning? Q-learning, policy gradient, reward shaping, exploration vs exploitation, dan real-world applications.",
  "Bagaimana cara evaluate dan compare AI models? Metrics (accuracy, F1, BLEU, ROUGE), benchmarking, dan statistical significance.",
  "Jelaskan tentang AI safety dan alignment - value alignment, interpretability, robustness, dan existential risk considerations.",
  "Apa itu MLOps? Model versioning, experiment tracking, feature stores, model serving, dan monitoring in production.",
  "Bagaimana cara membangun chatbot yang good? Intent recognition, dialogue management, context handling, dan evaluation methods.",

  // FINANCE
  "Jelaskan tentang portfolio theory modern - efficient frontier, CAPM, diversification, risk-adjusted returns, dan asset allocation strategies.",
  "Bagaimana cara melakukan fundamental analysis saham? Financial ratios, valuation methods (DCF, comparables), dan qualitative factors.",
  "Apa itu options trading? Call vs put, Greeks (delta, gamma, theta, vega), strategies (covered call, straddle), dan risk management.",
  "Jelaskan tentang cryptocurrency trading - technical analysis, market psychology, risk management, dan regulatory considerations.",
  "Bagaimana cara membangun bisnis startup yang sustainable? Lean methodology, product-market fit, unit economics, dan growth strategies.",
  "Apa itu financial modeling? DCF analysis, LBO modeling, sensitivity analysis, dan best practices dalam Excel modeling.",
  "Jelaskan tentang macroeconomics - GDP, inflation, unemployment, monetary policy, fiscal policy, dan business cycles.",
  "Bagaimana cara manage personal finance yang effective? Budgeting, emergency fund, debt elimination, investing, dan retirement planning.",
  "Apa itu real estate investing? Rental properties, REITs, house flipping, financing options, dan market analysis.",
  "Jelaskan tentang risk management dalam finance - types of risk, hedging strategies, insurance, dan regulatory requirements.",

  // HEALTH
  "Bagaimana cara optimize sleep quality? Sleep hygiene, circadian rhythm, sleep stages, common disorders, dan evidence-based interventions.",
  "Jelaskan tentang exercise science - progressive overload, periodization, recovery, nutrition, dan common training mistakes.",
  "Apa itu mental health first aid? Recognizing signs, initial response, professional referrals, dan self-care strategies.",
  "Bagaimana cara memahami dan mengelola stress? Physiological mechanisms, cognitive techniques, lifestyle changes, dan when to seek help.",
  "Jelaskan tentang nutrition science - macros, micros, meal timing, supplements, dan evidence-based dietary recommendations.",
  "Apa itu ergonomics workplace? Workstation setup, posture, break schedules, exercise routines, dan injury prevention.",
  "Bagaimana cara membangun healthy habits? Habit loop, implementation intentions, tracking methods, dan overcoming obstacles.",
  "Jelaskan tentang human body systems - cardiovascular, respiratory, digestive, nervous, dan immune systems.",
  "Apa itu first aid basics? CPR, AED, bleeding control, burns treatment, fracture management, dan emergency response.",
  "Bagaimana cara improve mental resilience? Psychological flexibility, growth mindset, social support, dan coping strategies.",

  // WRITING
  "Jelaskan tentang storytelling techniques - narrative structure, character arcs, conflict resolution, pacing, dan reader engagement.",
  "Bagaimana cara menulis content yang engaging? Hook techniques, readability, formatting, CTAs, dan audience analysis.",
  "Apa itu SEO writing? Keyword research, on-page optimization, content structure, internal linking, dan measurement.",
  "Jelaskan tentang persuasive writing - AIDA framework, emotional appeals, evidence-based arguments, dan call-to-action design.",
  "Bagaimana cara membangun personal brand through content? Content pillars, consistency, authenticity, dan audience building.",
  "Apa itu technical documentation? API docs, user guides, tutorials, style guides, dan documentation as code.",
  "Jelaskan tentang email marketing copywriting - subject lines, personalization, sequences, automation, dan deliverability.",
  "Bagaimana cara menulis proposal yang compelling? Structure, persuasive techniques, budget justification, dan visual design.",
  "Apa itu content strategy? Content audit, persona development, editorial calendar, distribution, dan ROI measurement.",
  "Jelaskan tentang public speaking - speech structure, delivery techniques, audience engagement, dan nervousness management.",

  // LEGAL
  "Jelaskan tentang UU ITE Indonesia - cybercrime definitions, penalties, evidence requirements, dan defense strategies.",
  "Apa itu GDPR compliance? Data subject rights, consent requirements, breach notification, dan cross-border transfers.",
  "Bagaimana cara memahami contract law? Essential elements, breach remedies, digital contracts, dan negotiation strategies.",
  "Jelaskan tentang intellectual property rights - patents, copyrights, trademarks, trade secrets, dan enforcement.",
  "Apa itu white-collar crime? Types, investigation methods, forensic accounting, dan prevention strategies.",
  "Bagaimana cara memahami employment law? Worker rights, contracts, termination, discrimination, dan dispute resolution.",
  "Jelaskan tentang data privacy laws globally - GDPR, CCPA, PDP Law, dan best practices untuk compliance.",
  "Apa itu digital forensics dari sisi hukum? Evidence collection, court admissibility, expert testimony, dan chain of custody.",
  "Bagaimana cara memahami criminal investigation procedures? Rights of suspects, evidence rules, dan legal protections.",
  "Jelaskan tentang regulatory compliance - compliance frameworks, audit procedures, documentation, dan penalty structures.",

  // HISTORY/GEOGRAPHY
  "Jelaskan tentang sejarah kerajaan Majapahit - pendirian, masa kejayaan, penurunan, dan pengaruh terhadap budaya Indonesia.",
  "Apa causes dan effects dari World War 2? Economic factors, political tensions, major battles, dan aftermath.",
  "Bagaimana cara memahami geologi Indonesia? Tectonic plates, volcanic activity, earthquake zones, dan natural disaster preparedness.",
  "Jelaskan tentang Renaissance - art, science, philosophy, key figures, dan impact pada modern society.",
  "Apa itu climate change? Greenhouse effect, global warming evidence, impacts, mitigation strategies, dan international agreements.",
  "Bagaimana cara memahami evolution? Natural selection, speciation, fossil evidence, genetics, dan modern synthesis.",
  "Jelaskan tentang sejarah internet - ARPANET, World Wide Web, social media, mobile revolution, dan future trends.",
  "Apa itu cultural anthropology? Research methods, cultural relativism, kinship, religion, dan economic systems.",
  "Bagaimana cara memahami political systems? Democracy, authoritarianism, federalism, constitutional law, dan governance.",
  "Jelaskan tentang oceanography - ocean currents, marine ecosystems, deep sea exploration, dan conservation.",

  // ADVANCED TECH
  "Jelaskan tentang quantum computing - qubits, superposition, entanglement, quantum algorithms, dan current limitations.",
  "Apa itu biotechnology applications? CRISPR, gene therapy, bioinformatics, synthetic biology, dan ethical considerations.",
  "Bagaimana cara kerja autonomous vehicles? Perception, sensor fusion, path planning, decision making, dan safety systems.",
  "Jelaskan tentang renewable energy technologies - solar, wind, hydro, storage, dan grid integration challenges.",
  "Apa itu nanotechnology applications? Nanomaterials, medicine, electronics, energy, dan environmental applications.",
  "Bagaimana cara membangun smart city infrastructure? IoT, data platforms, urban planning, sustainability, dan citizen engagement.",
  "Jelaskan tentang space exploration - Mars colonization, space stations, satellite technology, dan commercial spaceflight.",
  "Apa itu 3D printing / additive manufacturing? Technologies, materials, applications, limitations, dan future trends.",
  "Bagaimana cara kerja brain-computer interfaces? EEG, invasive vs non-invasive, applications, dan ethical considerations.",
  "Jelaskan tentang agricultural technology - precision farming, drones, IoT sensors, vertical farming, dan sustainability.",
];

// Shuffle and select daily questions using seeded random
function getDailyQuestions(dayNumber: number, count: number = 10) {
  let rng = dayNumber;
  function nextRandom() {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return rng / 0x7fffffff;
  }

  const shuffled = [...QUESTION_POOL];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

function detectCategory(question: string): string {
  const q = question.toLowerCase();
  if (/hack|security|forensic|malware|exploit|vulnerability|penetration|attack|defense|OWASP/.test(q)) return "cybersecurity";
  if (/python|javascript|typescript|react|node|sql|git|coding|program|code|html|css|docker|kubernetes|api|function|design pattern/.test(q)) return "programming";
  if (/matematika|math|statistik|probability|linear algebra|calculus|eigenvalue|fourier|bayes|graph theory|RSA|chaos|markov/.test(q)) return "math";
  if (/AI|machine learning|deep learning|LLM|transformer|RAG|NLP|computer vision|reinforcement|MLOps|chatbot/.test(q)) return "ai_tech";
  if (/financ|invest|stock|bond|portfolio|option|trading|crypto|startup|business|budget|retirement|wealth/.test(q)) return "finance";
  if (/health|sleep|exercise|stress|nutrition|ergonomic|habit|body|first aid|mental|resilience/.test(q)) return "health";
  if (/writ|content|SEO|copywriting|email|proposal|storytelling|public speaking|documentation|personal brand/.test(q)) return "writing";
  if (/law|legal|GDPR|privacy|contract|IP|copyright|compliance|regulation|crime|forensic.*legal/.test(q)) return "legal";
  if (/sejarah|history|geography|climate|evolution|ocean|renaissance|war|majapahit|internet.*history/.test(q)) return "history";
  if (/quantum|biotech|nanotech|autonomous|renewable|space|3D print|brain.*computer|smart city|agricultural/.test(q)) return "advanced_tech";
  return "general";
}

// Call Ollama to get answer
async function callOllama(question: string): Promise<string> {
  const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.1";

  const response = await fetch(`${ollamaUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: `Kamu adalah AI assistant expert yang memberikan jawaban lengkap, mendalam, dan praktis. 
Jawab dalam bahasa yang sama dengan pertanyaan.
Berikan penjelasan detail, contoh kode jika relevan, langkah-langkah praktis, dan tips.
Jawaban harus komprehensif - tidak hanya teori tapi juga penerapan di dunia nyata.
Jika pertanyaan tentang hacking/attacking, berikan juga defense-nya.
Jika pertanyaan tentang illegal topics, berikan pemahaman untuk defense/prevention.`
        },
        { role: "user", content: question },
      ],
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error ${response.status}`);
  }

  const data = await response.json();
  return data.message?.content || "";
}

// GET: Get today's training session status
export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate day number from project start
    const startDate = new Date("2025-01-01");
    const today = new Date();
    const dayNumber = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const todayQuestions = getDailyQuestions(dayNumber, 10);

    // Check which ones are already trained
    const { data: trained } = await supabase
      .from("ai_learned_knowledge")
      .select("question")
      .eq("source", "daily_training");

    const trainedSet = new Set((trained || []).map((t: { question: string }) => t.question));

    const status = todayQuestions.map(q => ({
      question: q,
      category: detectCategory(q),
      trained: trainedSet.has(q),
    }));

    const trainedCount = status.filter(s => s.trained).length;
    const totalPool = QUESTION_POOL.length;
    const totalDays = Math.ceil(totalPool / 10);

    return NextResponse.json({
      dayNumber,
      date: today.toISOString().split("T")[0],
      questions: status,
      trainedToday: trainedCount,
      remainingToday: 10 - trainedCount,
      totalPool,
      totalDays,
      yearsOfTraining: (totalDays / 365).toFixed(1),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST: Train today's questions (or specific batch)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate day number
    const startDate = new Date("2025-01-01");
    const today = new Date();
    const dayNumber = body.dayNumber ?? Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const count = Math.min(Math.max(body.count || 10, 1), 20);
    const questions = getDailyQuestions(dayNumber, count);

    const results: Array<{ question: string; answer: string; status: string; category: string }> = [];

    for (const question of questions) {
      try {
        // Check if already trained
        const { data: existing } = await supabase
          .from("ai_learned_knowledge")
          .select("id")
          .eq("question", question)
          .eq("source", "daily_training")
          .limit(1);

        if (existing && existing.length > 0) {
          results.push({ question, answer: "(already trained)", status: "skipped", category: detectCategory(question) });
          continue;
        }

        const answer = await callOllama(question);
        if (!answer || answer.length < 20) {
          results.push({ question, answer: "(empty answer)", status: "failed", category: detectCategory(question) });
          continue;
        }

        const category = detectCategory(question);

        const { error } = await supabase.from("ai_learned_knowledge").insert({
          question: question,
          answer: answer,
          category: category,
          source: "daily_training",
          usage_count: 0,
        });

        if (error) {
          results.push({ question, answer: error.message, status: "db_error", category });
        } else {
          results.push({ question, answer: answer.substring(0, 200) + "...", status: "success", category });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "unknown";
        results.push({ question, answer: msg, status: "error", category: detectCategory(question) });
      }
    }

    const trained = results.filter(r => r.status === "success").length;
    const failed = results.filter(r => r.status === "failed" || r.status === "error" || r.status === "db_error").length;
    const skipped = results.filter(r => r.status === "skipped").length;

    return NextResponse.json({
      success: true,
      dayNumber,
      date: today.toISOString().split("T")[0],
      trained,
      failed,
      skipped,
      questions: results,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

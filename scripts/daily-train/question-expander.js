// question-expander.js - Expands base questions into variations to reach 7300+ total
// Run: node scripts/daily-train/question-expander.js

const fs = require('fs');
const path = require('path');

// Load base questions
const baseQuestions = [];
function addTopic(category, items) {
  items.forEach(q => {
    baseQuestions.push({ category, question: q });
  });
}

require('./01-cybersecurity')(addTopic);
require('./02-programming')(addTopic);
require('./03-math-science')(addTopic);
require('./04-finance-business')(addTopic);
require('./05-health-daily')(addTopic);
require('./06-technology-ai')(addTopic);
require('./07-writing-creative')(addTopic);
require('./08-history-geography')(addTopic);
require('./09-legal-illegal')(addTopic);
require('./10-advanced-topics')(addTopic);

console.log(`Base questions: ${baseQuestions.length}`);

// Question templates for expansion
const DEEP_TEMPLATES = [
  // How-to deep
  "Bagaimana cara %TOPIC% dari nol sampai mahir? Jelaskan step by step, tools yang dibutuhkan, best practices, common mistakes, dan tips dari expert.",
  "Jelaskan secara mendalam tentang %TOPIC% - definisi, sejarah, bagaimana cara kerjanya, aplikasi di dunia nyata, kelebihan dan kekurangan, serta perkembangan terbaru.",
  "Ajarkan saya %TOPIC% untuk pemula sampai advanced - konsep dasar, intermediate techniques, advanced strategies, real-world projects, dan career opportunities.",
  "Apa itu %TOPIC%? Jelaskan dari nol - pengertian, konsep dasar, cara kerja, contoh penerapan, kegunaan, dan mengapa penting untuk dipelajari.",
  "Bagaimana %TOPIC% bekerja secara teknis? Jelaskan arsitektur, komponen utama, alur kerja, optimasi, troubleshooting, dan maintenance.",
  
  // Comparison
  "Bandingkan %TOPIC% dengan alternatif lainnya - kelebihan, kekurangan, use cases, performance, cost, dan kapan harus menggunakan yang mana.",
  "Apa perbedaan antara %TOPIC% dengan pendekatan tradisional? Analisis mendalam tentang efisiensi, skalabilitas, biaya, dan kasus penggunaan.",
  
  // Problem solving
  "Masalah umum dalam %TOPIC% adalah apa saja? Bagaimana cara mendeteksi, mencegah, dan menyelesaikan masalah tersebut dengan efektif?",
  "Bagaimana cara mengoptimalkan %TOPIC% untuk performance? Techniques, tools untuk profiling, bottleneck identification, dan scaling strategies.",
  
  // Real-world
  "Berikan contoh nyata penerapan %TOPIC% di industri - case studies, success stories, lessons learned, dan best practices dari company besar.",
  "Bagaimana %TOPIC% digunakan dalam production environment? Deployment strategies, monitoring, scaling, security considerations, dan disaster recovery.",
  
  // Security/Defense
  "Apa saja security risks dalam %TOPIC%? Vulnerability assessment, attack vectors, defense mechanisms, security auditing, dan compliance requirements.",
  "Bagaimana cara secure %TOPIC% dari berbagai serangan? Threat modeling, security hardening, monitoring, incident response, dan recovery procedures.",
  
  // Future & Trends
  "Apa masa depan %TOPIC%? Trend terbaru, research directions, upcoming technologies, predictions untuk 5-10 tahun ke depan, dan bagaimana bersiap.",
  "Bagaimana %TOPIC% berkembang dalam 5 tahun terakhir? Perubahan signifikan, new features, community growth, dan adoption rates.",
  
  // Career
  "Bagaimana memulai karir di %TOPIC%? Skills yang dibutuhkan, learning path, certifications, portfolio projects, job market, dan salary expectations.",
  "Apa saja roles dan responsibilities dalam %TOPIC%? Career ladder, daily tasks, tools yang digunakan, dan growth opportunities.",
  
  // Architecture & Design
  "Bagaimana mendesain sistem yang melibatkan %TOPIC%? Architecture patterns, design decisions, trade-offs, scalability, dan maintainability.",
  "Apa best practices untuk %TOPIC%? Coding standards, design principles, testing strategies, documentation, dan code review processes.",
  
  // Advanced Techniques
  "Apa advanced techniques dalam %TOPIC%? Cutting-edge research, experimental approaches, performance tricks, dan expert-level strategies.",
  "Bagaimana cara solve complex problems dengan %TOPIC%? Problem decomposition, algorithm design, optimization techniques, dan debugging strategies.",
  
  // Deep Dive Specifics
  "Jelaskan workflow lengkap %TOPIC% - dari planning, execution, testing, deployment, monitoring, sampai maintenance. Apa saja tools dan best practices di setiap tahap?",
  "Apa saja common anti-patterns dalam %TOPIC%? Bagaimana cara mendeteksinya, refactoring strategies, dan best practices untuk menghindarinya.",
  "Bagaimana cara melakukan code review untuk %TOPIC%? Checklist, common issues, security considerations, performance checks, dan知识transfer.",
  "Apa saja metrics dan KPIs untuk mengukur success dalam %TOPIC%? Measurement techniques, benchmarking, performance indicators, dan continuous improvement.",
  "Bagaimana cara debugging dan troubleshooting dalam %TOPIC%? Common errors, debugging tools, log analysis, root cause analysis, dan preventive measures.",
  
  // Integration & Ecosystem
  "Bagaimana cara mengintegrasikan %TOPIC% dengan teknologi lain? API integration, middleware, data flow, compatibility issues, dan ecosystem tools.",
  "Apa saja third-party tools dan libraries yang popular untuk %TOPIC%? Comparison, pros/cons, licensing, community support, dan maintenance status.",
  
  // Compliance & Standards
  "Apa saja standards dan regulations yang berlaku untuk %TOPIC%? Compliance requirements, audit procedures, documentation, dan penalty structures.",
  "Bagaimana cara memastikan %TOPIC% comply dengan industry standards? Certification processes, best practices, documentation requirements, dan regular audits.",
  
  // Migration & Modernization
  "Bagaimana cara migrate dari legacy system ke %TOPIC%? Planning, risk assessment, data migration, testing strategies, rollback plans, dan timeline estimation.",
  "Apa saja challenges dalam adopsi %TOPIC% di enterprise? Organizational resistance, training requirements, cost analysis, dan change management strategies.",
  
  // Research & Innovation
  "Apa research directions terbaru dalam %TOPIC%? Academic papers, breakthrough discoveries, experimental approaches, dan future possibilities.",
  "Bagaimana cara melakukan research dalam %TOPIC%? Methodology, data collection, analysis techniques, publication strategies, dan collaboration opportunities.",
];

// Topic variations for each category
const TOPIC_VARIATIONS = {
  CYBERSECURITY: [
    "ethical hacking", "penetration testing", "vulnerability assessment", "web application security",
    "network security", "cloud security", "mobile security", "IoT security", "forensics",
    "incident response", "threat intelligence", "security architecture", "encryption",
    "identity management", "access control", "security auditing", "compliance",
    "red team operations", "blue team defense", "purple team collaboration",
    "OSINT", "social engineering defense", "malware analysis", "reverse engineering",
    "exploit development", "bug bounty", "security automation", "DevSecOps",
  ],
  PROGRAMMING: [
    "Python web development", "JavaScript async programming", "TypeScript advanced types",
    "React performance optimization", "Next.js server components", "Node.js microservices",
    "Go concurrency patterns", "Rust memory safety", "Java Spring Boot", "PHP Laravel",
    "SQL query optimization", "GraphQL API design", "REST API best practices",
    "WebSocket real-time", "Docker containerization", "Kubernetes orchestration",
    "CI/CD pipelines", "Git advanced workflows", "data structures", "algorithms",
    "design patterns", "system design", "code review", "refactoring techniques",
    "test-driven development", "behavior-driven development", "pair programming",
  ],
  MATEMATIKA: [
    "linear algebra", "calculus", "statistics", "probability", "discrete math",
    "number theory", "geometry", "trigonometry", "differential equations",
    "numerical methods", "optimization", "graph theory", "combinatorics",
    "complex analysis", "real analysis", "abstract algebra", "topology",
    "mathematical modeling", "machine learning math", "cryptographic math",
    "game theory", "fuzzy logic", "chaos theory", "fractal geometry",
  ],
  TEKNOLOGI_AI: [
    "machine learning", "deep learning", "natural language processing", "computer vision",
    "reinforcement learning", "generative AI", "LLM fine-tuning", "RAG systems",
    "vector databases", "MLOps", "AI ethics", "explainable AI", "federated learning",
    "transfer learning", "attention mechanisms", "transformer architecture",
    "GANs", "diffusion models", "speech recognition", "recommendation systems",
    "time series analysis", "anomaly detection", "AutoML", "neural architecture search",
  ],
  KEUANGAN: [
    "stock investing", "bond investing", "ETF strategies", "portfolio management",
    "risk assessment", "financial modeling", "valuation techniques", "technical analysis",
    "fundamental analysis", "options trading", "futures trading", "forex trading",
    "cryptocurrency investing", "DeFi protocols", "NFT market", "real estate investing",
    "tax planning", "retirement planning", "estate planning", "insurance optimization",
    "budgeting strategies", "debt management", "wealth building", "passive income",
  ],
  KESEHATAN: [
    "nutrition science", "exercise physiology", "sleep optimization", "stress management",
    "mental health", "chronic disease prevention", "first aid", "ergonomics",
    "supplement science", "fasting protocols", "gut health", "immune system",
    "hormone balance", "brain health", "longevity science", "biohacking",
    "holistic health", "alternative medicine", "medical research literacy",
  ],
  MENULIS: [
    "creative writing", "technical writing", "SEO content", "copywriting",
    "email marketing", "business writing", "academic writing", "screenwriting",
    "blog writing", "social media content", "scriptwriting", "grant writing",
    "report writing", "proposal writing", "speech writing", "journalism",
    "content strategy", "brand storytelling", "UX writing", "medical writing",
  ],
  LEGAL_UNDERSTANDING: [
    "cyber law", "data privacy", "intellectual property", "contract law",
    "employment law", "corporate law", "criminal law", "digital forensics",
    "compliance management", "regulatory affairs", "legal tech", "dispute resolution",
    "international law", "human rights law", "environmental law", "tax law",
    "banking regulations", "securities law", "healthcare regulations",
  ],
  SEJARAH: [
    "ancient civilizations", "medieval history", "Renaissance", "industrial revolution",
    "world wars", "cold war", "decolonization", "digital revolution",
    "Indonesian history", "Asian history", "European history", "American history",
    "African history", "Middle Eastern history", "scientific revolution",
    "religious history", "economic history", "military history", "cultural history",
  ],
  ADVANCED_TECHNOLOGY: [
    "quantum computing", "biotechnology", "nanotechnology", "robotics",
    "autonomous vehicles", "space technology", "renewable energy", "energy storage",
    "materials science", "3D printing", "brain-computer interfaces", "AGI",
    "climate technology", "water technology", "food technology", "agricultural tech",
    "smart cities", "digital twins", "edge computing", "Web3",
  ],
};

// Generate expanded questions
const expandedQuestions = [];

baseQuestions.forEach(bq => {
  // Add original question
  expandedQuestions.push({ ...bq });
});

// Generate variations for each category
Object.entries(TOPIC_VARIATIONS).forEach(([category, topics]) => {
  topics.forEach(topic => {
    DEEP_TEMPLATES.forEach(template => {
      const question = template.replace(/%TOPIC%/g, topic);
      expandedQuestions.push({ category, question });
    });
  });
});

// Deduplicate by question text (fuzzy)
const seen = new Set();
const uniqueQuestions = [];

expandedQuestions.forEach(q => {
  const key = q.question.toLowerCase().replace(/[^\w\s]/g, '').substring(0, 100);
  if (!seen.has(key)) {
    seen.add(key);
    uniqueQuestions.push(q);
  }
});

console.log(`Expanded questions: ${expandedQuestions.length}`);
console.log(`After dedup: ${uniqueQuestions.length}`);
console.log(`\nDays at 10/day: ${Math.ceil(uniqueQuestions.length / 10)}`);

// Count by category
const catCounts = {};
uniqueQuestions.forEach(q => {
  catCounts[q.category] = (catCounts[q.category] || 0) + 1;
});
console.log(`\nBy category:`);
Object.entries(catCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});

// Generate the expanded pool as a single JS module
let output = `// expanded-pool.js - Auto-generated expanded question pool\n`;
output += `// Total: ${uniqueQuestions.length} questions\n`;
output += `// Days at 10/day: ${Math.ceil(uniqueQuestions.length / 10)}\n\n`;
output += `module.exports = [\n`;
uniqueQuestions.forEach(q => {
  const escaped = q.question.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  output += `  { category: "${q.category}", question: '${escaped}' },\n`;
});
output += `];\n`;

const outPath = path.join(__dirname, 'expanded-pool.js');
fs.writeFileSync(outPath, output, 'utf8');
console.log(`\nWritten to ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)}KB)`);

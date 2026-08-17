// daily-train-engine.js - Main engine for daily AI training
// Run: node scripts/daily-train/daily-train-engine.js

const fs = require('fs');
const path = require('path');

// Load expanded question pool (7800+ questions)
const questions = require('./expanded-pool.js');

console.log(`\n=== DAILY AI TRAINING ENGINE ===`);
console.log(`Total questions in pool: ${questions.length}`);

// Generate unique ID for each question based on content hash
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

// Assign unique IDs
questions.forEach(q => {
  q.id = hashCode(q.question);
});

// Get daily training session (10 random questions)
function getDailySession(dayNumber, totalQuestions) {
  // Use day number as seed for deterministic randomness
  // This ensures same day = same questions (for reproducibility)
  const seed = dayNumber;
  let rng = seed;
  function nextRandom() {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return rng / 0x7fffffff;
  }

  // Fisher-Yates shuffle with seeded random
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(nextRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Return first 10 unique questions
  const session = shuffled.slice(0, Math.min(10, totalQuestions));
  return session;
}

// Calculate days until pool is exhausted
const DAILY_COUNT = 10;
const DAYS_AVAILABLE = Math.ceil(questions.length / DAILY_COUNT);

console.log(`Questions per day: ${DAILY_COUNT}`);
console.log(`Days until pool exhausted: ${DAYS_AVAILABLE}`);
console.log(`Categories:`);

// Count by category
const catCounts = {};
questions.forEach(q => {
  catCounts[q.category] = (catCounts[q.category] || 0) + 1;
});
Object.entries(catCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});

// Export for API use
module.exports = {
  questions,
  getDailySession,
  getQuestionById: (id) => questions.find(q => q.id === id),
  getTotalQuestions: () => questions.length,
  getDaysAvailable: () => DAYS_AVAILABLE,
};

// If run directly, show today's session
if (require.main === module) {
  const dayNum = parseInt(process.argv[2]) || 1;
  console.log(`\n=== Session for Day ${dayNum} ===`);
  const session = getDailySession(dayNum, DAILY_COUNT);
  session.forEach((q, i) => {
    console.log(`\n${i + 1}. [${q.category}] ${q.question}`);
  });
}

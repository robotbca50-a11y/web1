const fs = require('fs');
const path = require('path');

const entries = [];
function add(t, c, cat) {
  entries.push({ t, c, cat });
}

// This script generates a MASSIVE knowledge base
// Run: node scripts/gen-mega-knowledge.js

// ============================================================
// Will be populated by sections below
// ============================================================

// Load all section data
require('./knowledge/01-coding-languages')(add);
require('./knowledge/02-coding-web')(add);
require('./knowledge/03-coding-database')(add);
require('./knowledge/04-coding-devops')(add);
require('./knowledge/05-coding-advanced')(add);
require('./knowledge/06-math')(add);
require('./knowledge/07-science')(add);
require('./knowledge/08-excel')(add);
require('./knowledge/09-gsheets')(add);
require('./knowledge/10-writing')(add);
require('./knowledge/11-general')(add);

// Generate SQL
let sql = `-- 006_mega_knowledge.sql\n-- ${entries.length} entries - MASSIVE knowledge base\nDELETE FROM public.ai_knowledge;\n\nINSERT INTO public.ai_knowledge (topic, content, category) VALUES\n`;

sql += entries.map(e => {
  const st = e.t.replace(/'/g, "''");
  const sc = e.c.replace(/'/g, "''");
  return `('${st}', E'${sc}', '${e.cat}')`;
}).join(',\n');

sql += ';\n';

const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '006_mega_knowledge.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log(`Generated ${entries.length} entries (${(fs.statSync(outPath).size/1024).toFixed(1)}KB)`);

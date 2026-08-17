// 11-general.js - Finance, Health, History, Geography, Technology, Daily Life
module.exports = function(add) {

// Finance & Money (10 entries)
add('finance_budget', `Budgeting: 50/30/20 rule: 50% needs, 30% wants, 20% savings/debt. Track income vs expenses. Zero-based: every dollar assigned. Emergency fund: 3-6 months expenses. Envelope method: cash categories. Apps: YNAB, Mint.`, 'general');
add('finance_invest', `Investing Basics: Stocks: ownership shares. Bonds: loan to issuer. ETF: basket of stocks, traded like stock. Mutual fund: managed basket. Index fund: tracks market (S&P 500). Diversification reduces risk. Compound interest.`, 'general');
add('finance_compound', `Compound Interest: A=P(1+r/n)^(nt). P=principal, r=annual rate, n=compounds/year, t=years. Rule of 72: years to double≈72/rate. At 7%: money doubles every 10.3 years. Start early. $1000/mo from age 25 to 65 at 7%=$2.6M.`, 'general');
add('finance_tax', `Tax Basics: Progressive brackets. Marginal rate vs effective rate. Deductions reduce taxable income. Credits reduce tax owed. W-2 employee vs 1099 contractor. Standard vs itemized deduction. Capital gains tax. Tax-advantaged accounts.`, 'general');
add('finance_debt', `Debt Management: Avalanche: highest interest first (saves money). Snowball: smallest balance first (psychology). Minimum payments always. Debt consolidation. Balance transfer 0% APR. Student loan options. Credit score impact.`, 'general');
add('finance_mortgage', `Mortgage: Fixed rate: same payment. ARM: adjusts after initial period. 15-year vs 30-year. Down payment: 20% avoids PMI. Interest paid over life of loan. Refinancing when rates drop. Property taxes + insurance.`, 'general');
add('finance_insurance', `Types of Insurance: Health, life, auto, home/renter, disability, umbrella. Premium, deductible, copay, out-of-pocket max. Term life vs whole life. HSA for medical. Umbrella for extra liability. Review annually.`, 'general');
add('finance_retirement', `Retirement Planning: 401(k): employer plan, match=free money. IRA: individual. Roth: after-tax, tax-free growth. Traditional: pre-tax, taxed at withdrawal. Target-date fund: auto-rebalance. Social Security. Required minimum distributions.`, 'general');
add('finance_crypto', `Cryptocurrency: Bitcoin: first decentralized digital currency. Blockchain: distributed ledger. Ethereum: smart contracts platform. Volatile, speculative. Wallet: public+private keys. Exchange: buy/sell. NFT: non-fungible token.`, 'general');
add('finance_side_hustle', `Side Income Ideas: Freelancing (writing, design, code). Tutoring. Affiliate marketing. Digital products (templates, courses). Content creation (YouTube, blog). Consulting. E-commerce. Passive income: rental, dividends, royalties.`, 'general');

// Health & Wellness (8 entries)
add('health_nutrition', `Nutrition Basics: Carbs 45-65%, protein 10-35%, fat 20-35%. 2000 cal/day average. Fiber: 25-30g. Water: 2-3 liters. Processed foods: limit. Whole grains, fruits, vegetables. Portion control. Meal prep saves money and calories.`, 'general');
add('health_exercise', `Exercise Guidelines: 150 min moderate or 75 min vigorous per week. Strength training 2x/week. Walking: easiest, cheapest. HIIT: efficient. Stretch daily. Sleep: 7-9 hours. Consistency > intensity. Start slow, increase gradually.`, 'general');
add('health_sleep', `Sleep Hygiene: 7-9 hours adults. Consistent schedule. Dark, cool room (18-20°C). No screens 1hr before. Limit caffeine after 2pm. No alcohol before bed. Relaxation routine. Sleep debt accumulates. Weekend catch-up limited.`, 'general');
add('health_stress', `Stress Management: Deep breathing: 4-7-8 technique. Exercise. Meditation/mindfulness. Time management. Social connection. Nature exposure. Journaling. Limit news/social media. Professional help when needed. Self-care routine.`, 'general');
add('health_mental', `Mental Health: Depression: persistent sadness, loss of interest. Anxiety: excessive worry. Therapy types: CBT, DBT, psychodynamic. Medication options. Exercise helps. Social support crucial. Self-care. Break stigma. Help lines available.`, 'general');
add('health_firstaid', `First Aid Basics: CPR: 30 compressions, 2 breaths. AED usage. Heimlich maneuver choking. Burns: cool water 20 min. Fractures: immobilize. Bleeding: direct pressure. Allergies: epinephrine. Emergency number: 112/911.`, 'general');
add('health_ergonomics', `Ergonomics: Monitor: arm's length, top at eye level. Feet flat on floor. Chair: lumbar support. Keyboard: elbows 90°. Take breaks every 30min. 20-20-20 rule for eyes. Standing desk option. Mouse close to body.`, 'general');
add('health_nutrition_labels', `Reading Labels: Serving size first. Calories per serving. %Daily Value: 5% low, 20% high. Ingredients: most to least. Sodium: <2300mg. Added sugars: <25g. Trans fat: avoid. Fiber: higher better. Protein: quality sources.`, 'general');

// History (8 entries)
add('history_ancient', `Ancient Civilizations: Mesopotamia (3500 BC): first writing, laws. Egypt: pyramids, pharaohs. Indus Valley: urban planning. China: dynasties, inventions. Greece: democracy, philosophy. Rome: law, engineering, empire.`, 'general');
add('history_medieval', `Medieval Period: 476-1453 AD. Feudalism: lords, vassals, serfs. Black Death: killed 30-60% of Europe. Crusades: religious wars. Magna Carta 1215: limited monarchy. Islamic Golden Age: science, math, medicine.`, 'general');
add('history_renaissance', `Renaissance: 14th-17th century. Art rebirth: da Vinci, Michelangelo. Scientific Revolution: Copernicus, Galileo. Gutenberg press: mass communication. Age of Exploration: Columbus, Magellan. Humanism.`, 'general');
add('history_industrial', `Industrial Revolution: 1760-1840. Steam engine: James Watt. Factory system. Urbanization. Child labor. Railroads. Telegraph. Standard of living eventually improved. Luddite movement. Labor unions formed.`, 'general');
add('history_modern', `Modern History: WWI 1914-1918. Great Depression 1929. WWII 1939-1945. Cold War: US vs USSR. Decolonization. Civil Rights Movement. Space race. Internet age. Globalization. 9/11 and aftermath.`, 'general');
add('history_indonesia', `Indonesia History: Majapahit Empire. Dutch colonization 1602. Independence 1945 (Aug 17). Five principles (Pancasila). New Order: Suharto. Reformation 1998. Largest archipelago: 17,000+ islands. Diverse cultures.`, 'general');
add('history_inventions', `Key Inventions: Wheel (3500 BC). Printing press (1440). Steam engine (1769). Electricity (1879). Telephone (1876). Internet (1969). World Wide Web (1989). Smartphone (2007). AI/ML recent advances.`, 'general');
add('history_empires', `Major Empires: Roman, Mongol (largest contiguous), British (largest colonial), Ottoman, Persian, Chinese dynasties, Aztec, Inca, Mughal. Rise and fall patterns. Cultural legacy. Trade routes (Silk Road).`, 'general');

// Geography (6 entries)
add('geo_continents', `Seven Continents: Asia (44.58M km²), Africa (30.37M), North America (24.71), South America (17.84), Antarctica (14.2), Europe (10.18), Australia (8.53). Population: Asia 4.7B, Africa 1.4B. Highest: Everest 8849m.`, 'general');
add('geo_countries', `Largest Countries: Russia 17.1M km², Canada 9.98, USA 9.83, China 9.59, Brazil 8.51. Most Populous: China 1.4B, India 1.4B, USA 335M, Indonesia 277M, Pakistan 230M. Landlocked: 44 countries.`, 'general');
add('geo_rivers', `Major Rivers: Nile 6650km (longest). Amazon: largest volume. Yangtze 6300km. Mississippi-Missouri 6275km. Congo, Mekong, Rhine. Great Lakes: Superior, Victoria, Baikal (deepest). Oceans: Pacific largest.`, 'general');
add('geo_climate', `Climate Zones: Tropical (equator), arid (deserts), temperate (moderate), continental (extreme), polar (cold). Köppen classification. Monsoon: seasonal wind. El Niño/La Niña: Pacific temperature effects.`, 'general');
add('geo_capitals', `Capital Cities: Jakarta (Indonesia), Washington DC (USA), London (UK), Tokyo (Japan), Berlin (Germany), Canberra (Australia), New Delhi (India), Brasília (Brazil), Ottawa (Canada). Some capitals moved for strategic reasons.`, 'general');
add('geo_timezones', `Time Zones: Earth rotates 15°/hour = 24 zones. UTC/GMT baseline. Daylight saving: spring forward. International Date Line: ±1 day. Indonesia: WIB (UTC+7), WITA (UTC+8), WIT (UTC+9). Crossing zones: adjust watch.`, 'general');

// Technology & Digital (8 entries)
add('tech_ai', `Artificial Intelligence: Machine Learning: patterns from data. Deep Learning: neural networks. LLM: large language models (GPT, Claude). NLP: text understanding. Computer Vision: image recognition. Ethics: bias, privacy, jobs.`, 'general');
add('tech_cloud', `Cloud Computing: IaaS: virtual machines (AWS EC2). PaaS: platforms (Heroku, Vercel). SaaS: software (Gmail, Slack). Serverless: functions (Lambda). Storage: S3, Blob. Benefits: scale, pay-as-you-go, no hardware.`, 'general');
add('tech_blockchain', `Blockchain: Distributed ledger. Blocks linked cryptographically. Decentralized: no central authority. Smart contracts: self-executing code. Consensus: proof of work, proof of stake. Applications: finance, supply chain, voting.`, 'general');
add('tech_5g', `5G Technology: Up to 20 Gbps. Low latency: <1ms. Massive IoT support. Network slicing. Edge computing. Applications: autonomous vehicles, remote surgery, AR/VR. Requires new infrastructure.`, 'general');
add('tech_cybersecurity', `Cybersecurity: Phishing: fake emails/websites. Ransomware: encrypted data for payment. 2FA/MFA: multiple verification. VPN: encrypted tunnel. Antivirus. Patch management. Zero trust: verify everything. Social engineering.`, 'general');
add('tech_ux', `UX Principles: Usability: easy to learn, efficient. Accessibility: all users. User research: interviews, testing. Wireframes before designs. Consistency. Feedback loops. Mobile-first. Performance matters. A/B testing.`, 'general');
add('tech_open_source', `Open Source: Free to use, modify, distribute. Licenses: MIT (permissive), GPL (copyleft), Apache 2.0. GitHub hosting. Contributing: fork, branch, PR. Maintain: issue triage, code review. Community building.`, 'general');
add('tech_version_control', `Version Control: Git: distributed VCS. commit, push, pull, merge, rebase. Branching: feature, develop, main. Pull requests. Conflicts: resolve manually. GitHub/GitLab/Bitbucket. Tags for releases.`, 'general');

// Daily Life & Practical (6 entries)
add('daily_productivity', `Productivity Methods: Pomodoro: 25min work + 5min break. Eisenhower matrix: urgent/important. GTD: get things done. Time blocking. 2-minute rule: do it now if quick. Batch similar tasks. Single-tasking > multitasking.`, 'general');
add('daily_communication', `Effective Communication: Active listening. I-statements: "I feel..." not "You always...". Nonverbal: body language, eye contact. Clarity: one idea per point. Empathy. Feedback sandwich: positive, improve, positive.`, 'general');
add('daily_cooking', `Cooking Basics: Knife skills: dice, julienne, chiffonade. Techniques: sauté, roast, steam, grill. Seasoning: salt enhances flavor. Mise en place: prep first. Food safety: temperatures. Meal planning saves money.`, 'general');
add('daily_travel', `Travel Tips: Documents: passport, visa, insurance. Currency exchange rates. Local customs/respect. Emergency contacts. Copies of documents. Offline maps. Learn basic phrases. Safety: awareness, valuables hidden.`, 'general');
add('daily_negotiation', `Negotiation Tactics: BATNA: best alternative. Anchoring: first offer matters. Win-win: find mutual interests. Listen more than talk. Silence: powerful tool. Separate people from problems. Document agreements.`, 'general');
add('daily_study', `Study Techniques: Spaced repetition: review at increasing intervals. Active recall: test yourself. Feynman technique: explain simply. Pomodoro for focus. Interleaving: mix subjects. Elaborative interrogation: ask why.`, 'general');
};

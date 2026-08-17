// 10-writing.js - Email, CV, Essay, Copywriting, Technical Writing
module.exports = function(add) {

// Email Writing (8 entries)
add('email_formal', `Formal Email: Subject: clear, specific. Greeting: Dear Mr./Ms. [Name]. Body: purpose in first paragraph, details, request/action. Closing: Best regards/Sincerely, Name, Title. Proofread. Professional tone. No slang.`, 'writing');
add('email_followup', `Follow-up Email: Subject: Re: [Original]. Opening: reference previous conversation. Update: new information/progress. Ask: specific next step. Timeline: when. Thank: appreciation. Keep under 150 words. Friendly but professional.`, 'writing');
add('email_request', `Request Email: State purpose clearly in first sentence. Why you need it. What exactly you need (specific). Deadline/urgency. Any supporting info. Make it easy to say yes. Offer to discuss. Thank them. Professional closing.`, 'writing');
add('email_apology', `Apology Email: Acknowledge mistake immediately. No excuses. Explain what happened (briefly). Steps to fix. Preventive measures. Offer compensation if appropriate. Sincere tone. Follow up with resolution.`, 'writing');
add('email_thankyou', `Thank You Email: Send within 24-48 hours. Reference specific thing. What it meant to you. How you'll use it. Future contact. Keep brief (100 words). Warm but professional. No generic copy-paste.`, 'writing');
add('email_resignation', `Resignation Email: Clear statement: I am resigning from [position]. Last day: [date]. Transition plan. Gratitude for opportunity. Offer to help. Professional. Keep positive. No complaints. Attach formal letter.`, 'writing');
add('email_cold', `Cold Email: Personalized opener (research recipient). Brief intro (1 sentence). Value proposition (what's in it for them). Specific ask (not vague). Social proof (results). Easy call-to-action. Under 100 words.`, 'writing');
add('email_tone', `Email Tone Guide: Direct for internal. Warm for relationships. Formal for external/unknown. Concise always. Active voice. Short sentences. Bullet points for lists. Number action items. Avoid ALL CAPS. Emojis sparingly.`, 'writing');

// CV & Resume (8 entries)
add('cv_structure', `CV Structure: Contact info. Professional summary (2-3 sentences). Work experience (reverse chronological). Education. Skills (technical + soft). Certifications. Projects. Languages. Keep 1-2 pages. ATS-friendly format.`, 'writing');
add('cv_action_verbs', `Action Verbs: Led, Developed, Implemented, Optimized, Increased, Reduced, Achieved, Managed, Created, Launched, Negotiated, Designed, Automated, Streamlined, Delivered. Quantify: "Increased sales by 30%" not "Helped with sales".`, 'writing');
add('cv_keywords', `CV Keywords: Match job description. Use same terms. ATS systems scan for keywords. Industry-specific terms. Technical skills. Certifications. Avoid graphics/tables for ATS. PDF format. Clean fonts.`, 'writing');
add('cv_summary', `Professional Summary: "[Title] with [X] years of experience in [field]. Proven track record in [achievement]. Skilled in [key skills]. [Unique value proposition]." Tailor per job. 3-4 lines max. Include quantified results.`, 'writing');
add('cv_experience', `Experience Section: Job Title, Company, Dates. 3-5 bullet points per role. Start with action verb. Quantify results. STAR method: Situation, Task, Action, Result. Focus on impact, not duties. Most recent 10 years.`, 'writing');
add('cv_skills', `Skills Section: Hard skills: programming languages, tools, certifications. Soft skills: leadership, communication, problem-solving. Group by category. Match job requirements. Don't lie. Include proficiency level if relevant.`, 'writing');
add('cv_cover_letter', `Cover Letter: 3-4 paragraphs. Why this company (research). Why you (relevant experience). Specific achievement. Enthusiasm. Call to action. Address to hiring manager if possible. Never repeat CV verbatim.`, 'writing');
add('cv_common_mistakes', `CV Mistakes: Typos/grammar errors. Generic objective statement. Too long (>2 pages). No quantified results. Irrelevant experience. Unprofessional email. Missing keywords. No LinkedIn. Outdated info. Wrong company name.`, 'writing');

// Essay & Academic Writing (6 entries)
add('essay_structure', `Essay Structure: Introduction: hook, context, thesis. Body paragraphs: topic sentence, evidence, analysis, transition. Conclusion: restate thesis, synthesize, final insight. Each paragraph=one idea. Clear logical flow.`, 'writing');
add('essay_thesis', `Thesis Statement: Clear, arguable, specific. "Social media increases anxiety in teenagers" not "Social media is bad." Place at end of introduction. Every body paragraph supports it. Revise as essay evolves. One sentence.`, 'writing');
add('essay_citation', `Citations: APA: (Author, Year). MLA: (Author Page). Footnotes: Chicago/Turabian. Bibliography/Works Cited. In-text vs reference list. Paraphrase > quote. Quote for specific words. Never plagiarize. Citation tools.`, 'writing');
add('essay_argument', `Argumentative Essay: Claim + Evidence + Warrant. Counterargument + rebuttal. Logos (logic), Ethos (credibility), Pathos (emotion). Strongest evidence first. Address opposing view. Avoid logical fallacies.`, 'writing');
add('essay_expository', `Expository Writing: Inform, explain, describe. No opinions. Thesis + facts. Compare/contrast, cause/effect, process analysis. Clear structure. Third person. Objective tone. Primary/secondary sources.`, 'writing');
add('essay_revision', `Revision Steps: 1st pass: structure & argument flow. 2nd: paragraph clarity. 3rd: sentence variety. 4th: word choice. 5th: grammar/spelling. Read aloud. Take breaks. Peer review. Compare to rubric. Final proofread.`, 'writing');

// Copywriting (8 entries)
add('copy_headlines', `Headline Formulas: How to [benefit] without [pain]. [Number] ways to [goal]. Why [audience] should [action]. The secret of [topic]. [Adjective] [topic] that [benefit]. Question headline. News headline. Curiosity gap.`, 'writing');
add('copy_persuasion', `Cialdini Principles: Reciprocity: give first. Scarcity: limited availability. Authority: expert proof. Consistency: small yes→big yes. Social proof: others doing it. Liking: relatability. Unity: belonging.`, 'writing');
add('copy_storytelling', `Story Framework: Character wants something. Faces obstacle. Learns/discovered something. Transformed. Brand as guide (not hero). Customer is hero. Problem-Agitation-Solution (PAS). Before-After-Bridge.`, 'writing');
add('copy_cta', `Call to Action: Be specific: "Download Free Guide" not "Click Here". Create urgency: "Limited time". Reduce friction: "No credit card required". Benefit-oriented: "Start Saving Today". One CTA per section. Button vs text.`, 'writing');
add('copy_benefits', `Features vs Benefits: Feature: what it is. Benefit: what it does for them. "Stainless steel"→"Never rusts, always clean". "AI-powered"→"Saves you 5 hours per week". Transform every feature. Lead with benefits.`, 'writing');
add('copy_seo', `SEO Copywriting: Primary keyword in title, first paragraph, H2s. Long-tail keywords for specifics. Natural density (1-2%). Meta description (155 chars). Internal/external links. Alt text for images. Readability.`, 'writing');
add('copy_email_marketing', `Email Marketing: Subject line: curiosity/urgency/benefit. Preview text support. Personalization. One goal per email. Clear CTA above fold. Mobile-friendly. Segmentation. A/B test subject lines. Send time optimization.`, 'writing');
add('copy_social', `Social Media Copy: Platform-specific tone. Hook in first line. Short paragraphs. Hashtag strategy (3-5 relevant). Visuals boost engagement. Questions drive comments. Threads for complex topics. Repurpose content.`, 'writing');

// Technical Writing (6 entries)
add('tech_documentation', `Technical Documentation: README: what, install, use, contribute. API docs: endpoints, params, responses, examples. User guide: step-by-step. Troubleshooting: common issues. Changelog: version history. Style guide consistency.`, 'writing');
add('tech_tutorial', `Tutorial Writing: Goal-oriented title. Prerequisites listed. Numbered steps. Code blocks with syntax highlighting. Expected output. Troubleshooting tips. Screenshots for UI. Source code link. Progressive complexity.`, 'writing');
add('tech_api_docs', `API Documentation: Overview. Authentication. Base URL. Endpoints: method, path, description. Parameters: name, type, required, description. Request examples. Response examples. Error codes. Rate limits. SDKs.`, 'writing');
add('tech_readme', `README Template: Project name + description. Badges (build, coverage). Features. Quick start/install. Usage examples. Configuration. Contributing guide. License. FAQ. Screenshots. Links to docs.`, 'writing');
add('tech_blog', `Technical Blog: Problem statement. Solution overview. Implementation (code). Comparison with alternatives. Performance. Lessons learned. Tags/categories. Related posts. Call to action.`, 'writing');
add('tech_changelog', `Changelog Format: Keep a Changelog standard. Added, Changed, Deprecated, Removed, Fixed, Security. Version numbers (semver). Date. Links to issues/PRs. User-facing changes. Breaking changes highlighted.`, 'writing');

// General Writing Tips (4 entries)
add('writing_clarity', `Clear Writing: One idea per sentence. Active voice: "The team launched" not "It was launched by the team". Short sentences (15-20 words avg). Define jargon. Delete filler words. Parallel structure. Transition words.`, 'writing');
add('writing_concise', `Concise Writing: Cut adverbs: "very", "really", "extremely". Replace "in order to" with "to". Remove "that" when optional. Shorter words: "use" not "utilize". Active over passive. Delete unnecessary qualifiers.`, 'writing');
add('writing_grammar', `Grammar Rules: Subject-verb agreement. Comma usage (series, clauses). Semicolons between related independent clauses. Apostrophes: possession, not plurals. Who vs whom. Affect vs effect. Their/there/they're.`, 'writing');
add('writing_style', `Style Guides: AP for journalism. Chicago for books. APA for social sciences. MLA for humanities. IEEE for technical. Consistency within document. Word choice matters. Read your writing aloud. Know your audience.`, 'writing');
};

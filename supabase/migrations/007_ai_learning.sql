-- 007_ai_learning.sql
-- Table for AI learned knowledge (persistent learning)
-- When chatbot doesn't know an answer, it calls external AI, saves Q&A here

CREATE TABLE IF NOT EXISTS public.ai_learned_knowledge (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  source TEXT DEFAULT 'ai_api',
  usage_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast question lookup
CREATE INDEX IF NOT EXISTS idx_ai_learned_question ON public.ai_learned_knowledge USING gin(to_tsvector('english', question));
CREATE INDEX IF NOT EXISTS idx_ai_learned_category ON public.ai_learned_knowledge(category);

-- Unique constraint to avoid duplicate questions
CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_learned_unique_question ON public.ai_learned_knowledge(LOWER(TRIM(question)));

-- RLS policies
ALTER TABLE public.ai_learned_knowledge ENABLE ROW LEVEL SECURITY;

-- Anyone can read learned knowledge (for chatbot responses)
CREATE POLICY "Public read ai_learned" ON public.ai_learned_knowledge
  FOR SELECT USING (true);

-- Service role can insert/update (for AI learning)
CREATE POLICY "Service insert ai_learned" ON public.ai_learned_knowledge
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service update ai_learned" ON public.ai_learned_knowledge
  FOR UPDATE USING (true);

-- Function to get or create learned answer
CREATE OR REPLACE FUNCTION get_or_learn_answer(p_question TEXT)
RETURNS TABLE(answer TEXT, is_new BOOLEAN) AS $$
DECLARE
  v_answer TEXT;
  v_is_new BOOLEAN := FALSE;
BEGIN
  -- Try to find existing answer (fuzzy match)
  SELECT ak.answer INTO v_answer
  FROM public.ai_learned_knowledge ak
  WHERE similarity(LOWER(ak.question), LOWER(p_question)) > 0.6
  ORDER BY similarity(LOWER(ak.question), LOWER(p_question)) DESC
  LIMIT 1;

  -- If found, increment usage count and return
  IF v_answer IS NOT NULL THEN
    UPDATE public.ai_learned_knowledge 
    SET usage_count = usage_count + 1, updated_at = NOW()
    WHERE LOWER(TRIM(question)) = LOWER(TRIM(
      (SELECT question FROM public.ai_learned_knowledge 
       WHERE similarity(LOWER(question), LOWER(p_question)) > 0.6
       ORDER BY similarity(LOWER(question), LOWER(p_question)) DESC LIMIT 1)
    ));
    RETURN QUERY SELECT v_answer, FALSE;
    RETURN;
  END IF;

  -- Not found - caller should call AI API and save via insert
  RETURN QUERY SELECT NULL::TEXT, TRUE;
END;
$$ LANGUAGE plpgsql;

-- Enable pg_trgm for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

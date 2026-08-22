-- Race players table for HTTP polling multiplayer (no Realtime needed)

CREATE TABLE IF NOT EXISTS public.race_players (
  id text PRIMARY KEY,
  room_code text NOT NULL,
  name text NOT NULL,
  color text DEFAULT '#ef4444',
  wpm int DEFAULT 0,
  progress int DEFAULT 0,
  finished boolean DEFAULT false,
  is_host boolean DEFAULT false,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_race_players_room ON public.race_players(room_code);

-- RLS: anyone can read/write (anonymous multiplayer)
ALTER TABLE public.race_players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view race players" ON public.race_players;
CREATE POLICY "Anyone can view race players" ON public.race_players
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert race players" ON public.race_players;
CREATE POLICY "Anyone can insert race players" ON public.race_players
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update race players" ON public.race_players;
CREATE POLICY "Anyone can update race players" ON public.race_players
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete race players" ON public.race_players;
CREATE POLICY "Anyone can delete race players" ON public.race_players
  FOR DELETE USING (true);

-- Auto-cleanup stale players (not seen in 30 seconds)
CREATE OR REPLACE FUNCTION cleanup_stale_players()
RETURNS void AS $$
BEGIN
  DELETE FROM public.race_players
  WHERE last_seen < now() - interval '30 seconds';
END;
$$ LANGUAGE plpgsql;

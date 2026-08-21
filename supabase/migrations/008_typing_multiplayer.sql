-- Multiplayer typing test support

-- Add multiplayer columns
ALTER TABLE public.typing_rooms
  ADD COLUMN IF NOT EXISTS time_limit int default 60,
  ADD COLUMN IF NOT EXISTS language text default 'en';

-- Add room_code to results for multiplayer tracking
ALTER TABLE public.typing_results
  ADD COLUMN IF NOT EXISTS room_code text;

-- Allow anyone to create rooms (anonymous multiplayer)
DROP POLICY IF EXISTS "Authenticated users can create rooms" on public.typing_rooms;
CREATE POLICY "Anyone can create typing rooms" on public.typing_rooms
  for insert with check (true);

-- Allow room updates by anyone
DROP POLICY IF EXISTS "Room participants can update rooms" on public.typing_rooms;
CREATE POLICY "Anyone can update typing rooms" on public.typing_rooms
  for update using (true);

-- Enable realtime on tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_results;

-- Auto-cleanup old rooms (older than 1 hour)
CREATE OR REPLACE FUNCTION cleanup_old_rooms()
returns void as $$
begin
  delete from public.typing_rooms
  where created_at < now() - interval '1 hour';
end;
$$ language plpgsql;

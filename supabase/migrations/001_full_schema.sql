-- COMBINED: Run this ONE script in Supabase SQL Editor
-- Drops old tables if they exist, then recreates everything clean

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- REMOVE OLD PUBLICATION MEMBERS FIRST (prevents the error)
-- ============================================================
DO $$
BEGIN
  -- Remove from realtime publication if already added
  IF EXISTS (SELECT 1 FROM pg_publication_rel WHERE prrelid = 'public.typing_rooms'::regclass) THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.typing_rooms;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_publication_rel WHERE prrelid = 'public.typing_results'::regclass) THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.typing_results;
  END IF;
END $$;

-- Drop old tables if they exist (in correct dependency order)
DROP TABLE IF EXISTS public.typing_broadcasts CASCADE;
DROP TABLE IF EXISTS public.typing_players CASCADE;
DROP TABLE IF EXISTS public.typing_results CASCADE;
DROP TABLE IF EXISTS public.typing_rooms CASCADE;
DROP TABLE IF EXISTS public.ai_conversations CASCADE;
DROP TABLE IF EXISTS public.ai_knowledge CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.notepads CASCADE;
DROP TABLE IF EXISTS public.links CASCADE;
DROP TABLE IF EXISTS public.broadcasts CASCADE;
DROP VIEW IF EXISTS public.leaderboard CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.cleanup_old_rooms() CASCADE;

-- ============================================================
-- CREATE ALL TABLES
-- ============================================================

-- Links table
create table public.links (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  url text not null,
  description text,
  category text not null default 'general',
  icon text,
  is_active boolean default true,
  order_index int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Broadcasts table
create table public.broadcasts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  priority text not null default 'normal',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Notepads table
create table public.notepads (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  content text not null default '',
  is_pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Typing results
create table public.typing_results (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  nickname text default 'Anonymous',
  wpm int not null,
  accuracy decimal(5,2) not null default 100,
  difficulty text not null default 'medium',
  mode text not null default 'solo',
  text_content text not null,
  max_wpm int default 0,
  room_code text,
  completed_at timestamptz default now()
);

-- Typing rooms for multiplayer (host_id is NULLABLE for anonymous)
create table public.typing_rooms (
  id uuid primary key default uuid_generate_v4(),
  room_code text unique not null,
  host_id uuid references auth.users(id) on delete set null,
  host_nickname text default 'Host',
  status text not null default 'waiting',
  difficulty text not null default 'medium',
  text_content text not null default '',
  time_limit int default 60,
  language text default 'en',
  created_at timestamptz default now()
);

-- AI Knowledge base
create table public.ai_knowledge (
  id uuid primary key default uuid_generate_v4(),
  topic text not null,
  content text not null,
  category text not null default 'general',
  source text,
  created_at timestamptz default now()
);

-- AI Conversations
create table public.ai_conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  session_id text not null,
  role text not null,
  content text not null,
  feedback int check (feedback >= 1 and feedback <= 5),
  created_at timestamptz default now()
);

-- Admin users
create table public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz default now()
);

-- Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'username', 'User')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_links_category on public.links(category);
create index idx_links_active on public.links(is_active);
create index idx_broadcasts_active on public.broadcasts(is_active);
create index idx_notepads_user on public.notepads(user_id);
create index idx_typing_results_user on public.typing_results(user_id);
create index idx_typing_results_wpm on public.typing_results(wpm desc);
create index idx_typing_rooms_code on public.typing_rooms(room_code);
create index idx_ai_conversations_session on public.ai_conversations(session_id);
create index idx_profiles_username on public.profiles(username);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.links enable row level security;
alter table public.broadcasts enable row level security;
alter table public.notepads enable row level security;
alter table public.typing_results enable row level security;
alter table public.typing_rooms enable row level security;
alter table public.ai_knowledge enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.admin_users enable row level security;
alter table public.profiles enable row level security;

-- ============================================================
-- POLICIES
-- ============================================================

-- Policies: links
create policy "Links are viewable by everyone" on public.links
  for select using (is_active = true);
create policy "Admins can manage links" on public.links
  for all using (exists (select 1 from public.admin_users where id = auth.uid()));

-- Policies: broadcasts
create policy "Broadcasts are viewable by everyone" on public.broadcasts
  for select using (is_active = true);
create policy "Admins can manage broadcasts" on public.broadcasts
  for all using (exists (select 1 from public.admin_users where id = auth.uid()));

-- Policies: notepads
create policy "Users can view own notepads" on public.notepads
  for select using (auth.uid() = user_id);
create policy "Users can create own notepads" on public.notepads
  for insert with check (auth.uid() = user_id);
create policy "Users can update own notepads" on public.notepads
  for update using (auth.uid() = user_id);
create policy "Users can delete own notepads" on public.notepads
  for delete using (auth.uid() = user_id);

-- Policies: typing results (anyone can read/write)
create policy "Anyone can view typing results" on public.typing_results
  for select using (true);
create policy "Anyone can insert typing results" on public.typing_results
  for insert with check (true);

-- Policies: typing rooms (ANONYMOUS multiplayer)
create policy "Anyone can view typing rooms" on public.typing_rooms
  for select using (true);
create policy "Anyone can create typing rooms" on public.typing_rooms
  for insert with check (true);
create policy "Anyone can update typing rooms" on public.typing_rooms
  for update using (true);

-- Policies: ai
create policy "Anyone can read AI knowledge" on public.ai_knowledge
  for select using (true);
create policy "Admins can manage AI knowledge" on public.ai_knowledge
  for all using (exists (select 1 from public.admin_users where id = auth.uid()));
create policy "Users can view own conversations" on public.ai_conversations
  for select using (auth.uid() = user_id or user_id is null);
create policy "Anyone can insert conversations" on public.ai_conversations
  for insert with check (true);
create policy "Users can update own conversations" on public.ai_conversations
  for update using (auth.uid() = user_id);

-- Policies: profiles
create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Policies: admin
create policy "Admins viewable by everyone" on public.admin_users
  for select using (true);
create policy "Super admins can manage admins" on public.admin_users
  for all using (exists (select 1 from public.admin_users where id = auth.uid() and role = 'superadmin'));

-- ============================================================
-- ENABLE REALTIME (safe now, tables are fresh)
-- ============================================================

alter publication supabase_realtime add table public.typing_rooms;
alter publication supabase_realtime add table public.typing_results;

-- ============================================================
-- LEADERBOARD VIEW
-- ============================================================

create or replace view public.leaderboard as
select
  user_id,
  nickname,
  max(wpm) as best_wpm,
  round(avg(accuracy), 2) as avg_accuracy,
  count(*) as total_races,
  difficulty
from public.typing_results
group by user_id, nickname, difficulty
order by best_wpm desc;

-- ============================================================
-- DEFAULT DATA
-- ============================================================

insert into public.ai_knowledge (topic, content, category) values
('welcome', 'Halo! Saya adalah AI assistant dari Web Utama. Saya bisa membantu menjawab pertanyaan tentang fitur-fitur web ini, memberikan tips, dan membantu menyelesaikan masalah.', 'general'),
('typing_test', 'Typing Test memiliki 3 mode difficulty: Easy, Medium, Hard. Waktu: 15s, 30s, 60s, 120s. Solo atau multiplayer race via room code.', 'features'),
('notepad', 'Notepad adalah fitur catatan pribadi. Kamu bisa membuat, mengedit, dan menghapus catatan. Catatan yang dipinned akan muncul di atas.', 'features'),
('broadcast', 'Broadcast menampilkan informasi penting dari admin.', 'features'),
('multiplayer', 'Typing Test multiplayer: buat room, share code, teman join. Real-time race dengan SVG vehicles.', 'features'),
('admin_panel', 'Master Panel hanya bisa diakses oleh admin.', 'general')
on conflict do nothing;

-- Auto cleanup old rooms
create or replace function cleanup_old_rooms()
returns void as $$
begin
  delete from public.typing_rooms
  where created_at < now() - interval '1 hour';
end;
$$ language plpgsql;

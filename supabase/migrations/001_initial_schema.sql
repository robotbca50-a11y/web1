-- Enable UUID extension
create extension if not exists "uuid-ossp";

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
  created_at timestamptz default now()
);

-- Typing rooms for multiplayer
create table public.typing_rooms (
  id uuid primary key default uuid_generate_v4(),
  room_code text unique not null,
  host_id uuid references auth.users(id) on delete cascade,
  host_nickname text default 'Host',
  guest_id uuid references auth.users(id) on delete set null,
  guest_nickname text default 'Guest',
  status text not null default 'waiting',
  difficulty text not null default 'medium',
  text_content text not null,
  host_wpm int default 0,
  guest_wpm int default 0,
  host_accuracy decimal(5,2) default 100,
  guest_accuracy decimal(5,2) default 100,
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

-- Profiles table (auto-created on signup)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
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

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Indexes
create index idx_links_category on public.links(category);
create index idx_links_active on public.links(is_active);
create index idx_broadcasts_active on public.broadcasts(is_active);
create index idx_notepads_user on public.notepads(user_id);
create index idx_typing_results_user on public.typing_results(user_id);
create index idx_typing_results_wpm on public.typing_results(wpm desc);
create index idx_typing_rooms_code on public.typing_rooms(room_code);
create index idx_ai_conversations_session on public.ai_conversations(session_id);
create index idx_profiles_username on public.profiles(username);

-- Row Level Security
alter table public.links enable row level security;
alter table public.broadcasts enable row level security;
alter table public.notepads enable row level security;
alter table public.typing_results enable row level security;
alter table public.typing_rooms enable row level security;
alter table public.ai_knowledge enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.admin_users enable row level security;
alter table public.profiles enable row level security;

-- Public read policies for links and broadcasts
create policy "Links are viewable by everyone" on public.links
  for select using (is_active = true);

create policy "Broadcasts are viewable by everyone" on public.broadcasts
  for select using (is_active = true);

-- Admin policies (using admin_users table)
create policy "Admins can manage links" on public.links
  for all using (
    exists (
      select 1 from public.admin_users where id = auth.uid()
    )
  );

create policy "Admins can manage broadcasts" on public.broadcasts
  for all using (
    exists (
      select 1 from public.admin_users where id = auth.uid()
    )
  );

-- Notepad policies
create policy "Users can view own notepads" on public.notepads
  for select using (auth.uid() = user_id);

create policy "Users can create own notepads" on public.notepads
  for insert with check (auth.uid() = user_id);

create policy "Users can update own notepads" on public.notepads
  for update using (auth.uid() = user_id);

create policy "Users can delete own notepads" on public.notepads
  for delete using (auth.uid() = user_id);

-- Typing results policies
create policy "Anyone can view typing results" on public.typing_results
  for select using (true);

create policy "Anyone can insert typing results" on public.typing_results
  for insert with check (true);

-- Typing rooms policies
create policy "Anyone can view typing rooms" on public.typing_rooms
  for select using (true);

create policy "Authenticated users can create rooms" on public.typing_rooms
  for insert with check (auth.uid() = host_id);

create policy "Room participants can update rooms" on public.typing_rooms
  for update using (
    auth.uid() = host_id or auth.uid() = guest_id
  );

-- AI policies
create policy "Anyone can read AI knowledge" on public.ai_knowledge
  for select using (true);

create policy "Admins can manage AI knowledge" on public.ai_knowledge
  for all using (
    exists (
      select 1 from public.admin_users where id = auth.uid()
    )
  );

create policy "Users can view own conversations" on public.ai_conversations
  for select using (auth.uid() = user_id or user_id is null);

create policy "Anyone can insert conversations" on public.ai_conversations
  for insert with check (true);

create policy "Users can update own conversations" on public.ai_conversations
  for update using (auth.uid() = user_id);

-- Profile policies
create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Admin policies
create policy "Admins viewable by everyone" on public.admin_users
  for select using (true);

create policy "Super admins can manage admins" on public.admin_users
  for all using (
    exists (
      select 1 from public.admin_users where id = auth.uid() and role = 'superadmin'
    )
  );

-- Leaderboard view
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

-- Insert default knowledge base entries
insert into public.ai_knowledge (topic, content, category) values
('welcome', 'Halo! Saya adalah AI assistant dari Web Utama. Saya bisa membantu menjawab pertanyaan tentang fitur-fitur web ini, memberikan tips, dan membantu menyelesaikan masalah.', 'general'),
('typing_test', 'Typing Test memiliki 3 mode difficulty: Easy (kata-kata umum), Medium (kata campuran), Hard (kata kompleks & kode). Waktu per sesi: 15s, 30s, 60s, atau 120s. Kamu bisa bermain solo atau bersama teman via room code.', 'features'),
('notepad', 'Notepad adalah fitur catatan pribadi. Kamu bisa membuat, mengedit, dan menghapus catatan. Catatan yang dipinned akan muncul di atas.', 'features'),
('broadcast', 'Broadcast menampilkan informasi penting dari admin. Priority: Low (abu-abu), Normal (biru), High (kuning), Urgent (merah).', 'features'),
('multiplayer', 'Untuk bermain bersama teman: Pilih mode Friend, buat room dan share room code ke teman. Teman masukkan code untuk join. Permainan dimulai saat kedua pemain siap.', 'features'),
('admin_panel', 'Master Panel hanya bisa diakses oleh admin. Di sini admin bisa mengelola link, broadcast, knowledge base AI, dan melihat analytics.', 'general');

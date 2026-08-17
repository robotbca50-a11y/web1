export interface Link {
  id: string;
  title: string;
  url: string;
  description: string | null;
  category: string;
  icon: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
}

export interface Broadcast {
  id: string;
  title: string;
  content: string;
  priority: "low" | "normal" | "high" | "urgent";
  is_active: boolean;
  created_at: string;
}

export interface Notepad {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface TypingResult {
  id: string;
  user_id: string | null;
  nickname: string | null;
  wpm: number;
  accuracy: number;
  difficulty: "easy" | "medium" | "hard";
  mode: "solo" | "friend";
  friend_id: string | null;
  text_content: string;
  max_wpm: number;
  completed_at: string;
}

export interface TypingRoom {
  id: string;
  room_code: string;
  host_id: string;
  guest_id: string | null;
  status: "waiting" | "playing" | "finished";
  difficulty: "easy" | "medium" | "hard";
  text_content: string;
  created_at: string;
}

export interface AIMessage {
  id: string;
  user_id: string | null;
  message: string;
  response: string;
  feedback: number | null;
  created_at: string;
}

export interface AIKnowledge {
  id: string;
  topic: string;
  content: string;
  category: string;
  source: string | null;
  created_at: string;
}

export type ThemeName = 
  | "cyborg" 
  | "samurai" 
  | "aurora" 
  | "marvel" 
  | "medieval" 
  | "cyberpunk" 
  | "space" 
  | "nature"
  | "deep-ocean"
  | "volcanic";

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    glow: string;
    gradient: string;
  };
  font: string;
  loadingStyle: string;
}

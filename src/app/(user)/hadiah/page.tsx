"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Star, Trophy, Lock, Check, Sparkles } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";

interface Reward {
  id: number;
  title: string;
  description: string;
  points: number;
  icon: "trophy" | "star" | "gift" | "sparkles";
  claimed: boolean;
  category: string;
}

const SAMPLE_REWARDS: Reward[] = [
  { id: 1, title: "Speed Demon", description: "Capai kecepatan mengetik 100 WPM dalam satu sesi typing test", points: 2500, icon: "trophy", claimed: false, category: "Typing" },
  { id: 2, title: "Perfect Score", description: "Raih akurasi 100% dalam satu tes mengetik penuh", points: 1500, icon: "star", claimed: false, category: "Typing" },
  { id: 3, title: "Marathon Typer", description: "Ketik total 10.000 kata dalam satu hari", points: 3000, icon: "sparkles", claimed: false, category: "Typing" },
  { id: 4, title: "Night Owl Typist", description: "Selesaikan sesi typing setelah tengah malam", points: 800, icon: "gift", claimed: false, category: "Typing" },
  { id: 5, title: "AI Scholar", description: "Latih AI dengan menyelesaikan 50 pertanyaan training", points: 2000, icon: "sparkles", claimed: false, category: "AI Training" },
  { id: 6, title: "Knowledge Master", description: "Ajukan 100 pertanyaan ke AI assistant", points: 3500, icon: "trophy", claimed: false, category: "AI Training" },
  { id: 7, title: "Curious Mind", description: "Tanyakan 10 pertanyaan pertamamu ke AI", points: 500, icon: "star", claimed: false, category: "AI Training" },
  { id: 8, title: "First Blood", description: "Login pertama kali ke aplikasi", points: 100, icon: "gift", claimed: true, category: "Daily Login" },
  { id: 9, title: "Loyal Member", description: "Login 7 hari berturut-turut tanpa absen", points: 1200, icon: "star", claimed: false, category: "Daily Login" },
  { id: 10, title: "Unstoppable", description: "Login 30 hari berturut-turut dan jadi legenda", points: 5000, icon: "trophy", claimed: false, category: "Daily Login" },
  { id: 11, title: "Friendly Neighbor", description: "Tambahkan 5 teman baru di komunitas", points: 700, icon: "gift", claimed: false, category: "Social" },
  { id: 12, title: "Community Star", description: "Bagikan 20 konten ke media sosial", points: 1800, icon: "sparkles", claimed: false, category: "Social" },
];

const CATEGORIES = ["Semua", "Typing", "AI Training", "Daily Login", "Social"];

const REWARD_ICONS = {
  trophy: Trophy,
  star: Star,
  gift: Gift,
  sparkles: Sparkles,
};

export default function HadiahPage() {
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);
  const [userPoints, setUserPoints] = useState(500);
  const [rewards, setRewards] = useState<Reward[]>(SAMPLE_REWARDS);
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filtered =
    activeCategory === "Semua"
      ? rewards
      : rewards.filter((r) => r.category === activeCategory);

  const claimReward = (id: number) => {
    const reward = rewards.find((r) => r.id === id);
    if (!reward || reward.claimed || userPoints < reward.points) return;
    setUserPoints((prev) => prev - reward.points);
    setRewards((prev) =>
      prev.map((r) => (r.id === id ? { ...r, claimed: true } : r))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1
          className="text-2xl font-bold flex items-center gap-2"
          style={{ color: theme.colors.text }}
        >
          <Gift size={24} style={{ color: theme.colors.primary }} />
          Hadiah &amp; Rewards
        </h1>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl self-start"
          style={{
            background: theme.colors.surface,
            border: "1px solid " + theme.colors.border,
          }}
        >
          <Star size={18} style={{ color: theme.colors.accent }} />
          <span className="font-bold text-lg" style={{ color: theme.colors.text }}>
            {userPoints} Points
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
            style={{
              background: activeCategory === cat ? theme.colors.primary : theme.colors.surface,
              color: activeCategory === cat ? theme.colors.background : theme.colors.textMuted,
              border: "1px solid " + (activeCategory === cat ? theme.colors.primary : theme.colors.border),
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((reward, index) => {
          const IconComponent = REWARD_ICONS[reward.icon];
          const affordable = userPoints >= reward.points;
          return (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="rounded-xl p-5 transition-shadow duration-300 hover:shadow-lg"
              style={{
                background: theme.colors.surface,
                border: "1px solid " + theme.colors.border,
                opacity: reward.claimed ? 0.75 : 1,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    background: theme.colors.background,
                    border: "1px solid " + theme.colors.border,
                  }}
                >
                  <IconComponent
                    size={22}
                    style={{ color: reward.claimed ? theme.colors.textMuted : theme.colors.primary }}
                  />
                </div>
                <span
                  className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full"
                  style={{
                    background: theme.colors.background,
                    color: theme.colors.textMuted,
                    border: "1px solid " + theme.colors.border,
                  }}
                >
                  {reward.category}
                </span>
              </div>

              <h3 className="font-bold text-lg mb-1" style={{ color: theme.colors.text }}>
                {reward.title}
              </h3>
              <p className="text-sm mb-4 min-h-[40px]" style={{ color: theme.colors.textMuted }}>
                {reward.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star size={14} style={{ color: theme.colors.accent }} />
                  <span className="text-sm font-bold" style={{ color: theme.colors.accent }}>
                    {reward.points} Points
                  </span>
                </div>
                {reward.claimed ? (
                  <button
                    disabled
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed"
                    style={{
                      background: theme.colors.background,
                      color: theme.colors.textMuted,
                      border: "1px solid " + theme.colors.border,
                    }}
                  >
                    <Check size={14} /> Claimed
                  </button>
                ) : (
                  <button
                    onClick={() => claimReward(reward.id)}
                    disabled={!affordable}
                    className={
                      "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 " +
                      (affordable ? "cursor-pointer hover:opacity-90" : "cursor-not-allowed opacity-60")
                    }
                    style={{
                      background: affordable ? theme.colors.primary : theme.colors.background,
                      color: affordable ? theme.colors.background : theme.colors.textMuted,
                      border: "1px solid " + (affordable ? theme.colors.primary : theme.colors.border),
                    }}
                  >
                    {affordable ? <Gift size={14} /> : <Lock size={14} />}
                    {affordable ? "Claim" : "Poin Kurang"}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

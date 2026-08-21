"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, Search, Keyboard, FileText, Radio, Bot, Trophy } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";

interface GuideSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  shortDesc: string;
  content: string[];
}

const GUIDES: GuideSection[] = [
  {
    id: "typing",
    icon: <Keyboard size={20} />,
    title: "Typing Test",
    shortDesc: "Uji kecepatan mengetikmu",
    content: [
      "Pilih difficulty (Easy/Medium/Hard) dan bahasa (English/Indonesian).",
      "Tekan Tab atau klik Start untuk memulai.",
      "Ketik setiap kata yang muncul. Tekan SPASI untuk pindah ke kata berikutnya.",
      "WPM (Words Per Minute) dihitung berdasarkan kata benar per menit.",
      "Akurasi dihitung dari rasio karakter benar vs total diketik.",
      "Hasil otomatis tersimpan ke leaderboard.",
      "Mode Solo untuk latihan, mode Friend untuk tantang teman via room code.",
    ],
  },
  {
    id: "notepad",
    icon: <FileText size={20} />,
    title: "Notepad",
    shortDesc: "Catatan pribadi online",
    content: [
      "Klik 'Buat Catatan Baru' untuk membuat notepad baru.",
      "Ketik judul dan isi catatan. Klik Save untuk menyimpan.",
      "Klik pin untuk menandai catatan penting (akan selalu di atas).",
      "Gunakan fitur search untuk mencari catatan.",
      "Semua catatan tersimpan aman di database.",
    ],
  },
  {
    id: "broadcast",
    icon: <Radio size={20} />,
    title: "Broadcast",
    shortDesc: "Lihat siaran dari admin",
    content: [
      "Halaman broadcast menampilkan pengumuman dan informasi dari admin.",
      "Scroll ke bawah untuk melihat semua broadcast terbaru.",
      "Setiap broadcast memiliki judul, isi, dan waktu publikasi.",
    ],
  },
  {
    id: "chatbot",
    icon: <Bot size={20} />,
    title: "AI Chatbot",
    shortDesc: "Tanya jawab dengan AI",
    content: [
      "Klik ikon chat di pojok kanan bawah untuk membuka chatbot.",
      "Ketik pertanyaan apa saja — AI akan menjawab secara lengkap.",
      "Chatbot mendukung semua topik termasuk coding, sains, dan keamanan siber.",
      "Jawaban disimpan ke knowledge base untuk pertanyaan serupa di masa depan.",
      "Berikan rating thumbs up/down untuk membantu evaluasi kualitas jawaban.",
    ],
  },
  {
    id: "theme",
    icon: <Trophy size={20} />,
    title: "Theme & Customization",
    shortDesc: "Ubah tampilan web",
    content: [
      "Klik tombol 'Theme' di navbar untuk membuka theme picker.",
      "Pilih dari 10 tema berbeda: Cyborg, Samurai, Aurora, Marvel, Medieval, Cyberpunk, Space, Nature, Deep Ocean, Volcanic.",
      "Setiap tema memiliki warna, font, dan animasi loading screen yang berbeda.",
      "Theme tersimpan otomatis di browser.",
    ],
  },
];

export default function PanduanPage() {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  const filtered = GUIDES.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.shortDesc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2" style={{ color: theme.colors.text }}>
          <BookOpen size={28} style={{ color: theme.colors.primary }} />
          Panduan Penggunaan
        </h1>
        <p style={{ color: theme.colors.textMuted }}>Pelajari cara menggunakan setiap fitur di Web Utama</p>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.colors.textMuted }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari panduan..."
          className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
          style={{
            background: theme.colors.surface,
            color: theme.colors.text,
            border: `1px solid ${theme.colors.border}`,
          }}
        />
      </div>

      {/* Guide list */}
      <div className="space-y-3">
        {filtered.map((guide, idx) => (
          <motion.div
            key={guide.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-xl overflow-hidden"
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <button
              onClick={() => setOpenId(openId === guide.id ? null : guide.id)}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${theme.colors.primary}15`, color: theme.colors.primary }}
              >
                {guide.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold" style={{ color: theme.colors.text }}>{guide.title}</div>
                <div className="text-xs" style={{ color: theme.colors.textMuted }}>{guide.shortDesc}</div>
              </div>
              <motion.div
                animate={{ rotate: openId === guide.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={18} style={{ color: theme.colors.textMuted }} />
              </motion.div>
            </button>

            <AnimatePresence>
              {openId === guide.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-0">
                    <div className="border-t pt-3" style={{ borderColor: theme.colors.border }}>
                      <ol className="space-y-2">
                        {guide.content.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm" style={{ color: theme.colors.text }}>
                            <span
                              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5"
                              style={{ background: `${theme.colors.primary}20`, color: theme.colors.primary }}
                            >
                              {i + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

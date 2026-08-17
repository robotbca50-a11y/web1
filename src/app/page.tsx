"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Keyboard, FileText, Radio, ExternalLink, Search,
  Sparkles, Zap, Globe, ArrowRight
} from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Link as LinkType, Broadcast } from "@/lib/types";

const quickAccess = [
  { href: "/typing-test", label: "Typing Test", icon: Keyboard, desc: "Latihan mengetik cepat", color: "var(--theme-primary)" },
  { href: "/notepad", label: "Notepad", icon: FileText, desc: "Catatan pribadi online", color: "var(--theme-secondary)" },
  { href: "/broadcast", label: "Broadcast", icon: Radio, desc: "Info & pengumuman", color: "var(--theme-accent)" },
];

export default function HubPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const [linksRes, broadcastsRes] = await Promise.all([
        supabase.from("links").select("*").eq("is_active", true).order("order_index"),
        supabase.from("broadcasts").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(3),
      ]);

      if (linksRes.data) {
        setLinks(linksRes.data);
        const cats = [...new Set(linksRes.data.map((l: LinkType) => l.category))];
        setCategories(cats);
      }
      if (broadcastsRes.data) setBroadcasts(broadcastsRes.data);
    };
    fetchData();
  }, []);

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.title.toLowerCase().includes(search.toLowerCase()) ||
      link.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "all" || link.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <motion.section
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles size={28} style={{ color: theme.colors.primary }} />
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">Web Utama</h1>
          <Sparkles size={28} style={{ color: theme.colors.primary }} />
        </div>
        <p className="text-lg max-w-xl mx-auto" style={{ color: theme.colors.textMuted }}>
          Pusat kendali digitalmu. Akses semua project, tools, dan layanan dalam satu tempat.
        </p>
      </motion.section>

      {/* Quick Access */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap size={20} style={{ color: theme.colors.primary }} />
          Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
          {quickAccess.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Card variant="3d" className="p-6 h-full group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                      style={{ background: `color-mix(in srgb, ${item.color} 15%, transparent)` }}
                    >
                      <Icon size={24} style={{ color: item.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-1" style={{ color: theme.colors.text }}>
                        {item.label}
                      </h3>
                      <p className="text-sm" style={{ color: theme.colors.textMuted }}>
                        {item.desc}
                      </p>
                    </div>
                    <ArrowRight
                      size={18}
                      className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: item.color }}
                    />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Broadcasts */}
      {broadcasts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Radio size={20} style={{ color: theme.colors.accent }} />
            Pengumuman Terbaru
          </h2>
          <div className="space-y-3">
            {broadcasts.map((b) => (
              <Card key={b.id} variant="glass" className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm" style={{ color: theme.colors.text }}>{b.title}</h3>
                      <Badge
                        variant={
                          b.priority === "urgent" ? "danger" :
                          b.priority === "high" ? "warning" :
                          b.priority === "normal" ? "primary" : "default"
                        }
                      >
                        {b.priority}
                      </Badge>
                    </div>
                    <p className="text-sm line-clamp-2" style={{ color: theme.colors.textMuted }}>
                      {b.content}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Links Section */}
      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Globe size={20} style={{ color: theme.colors.primary }} />
            Links & Projects
          </h2>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.colors.textMuted }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari link..."
                className="w-full sm:w-60 pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--theme-primary)]"
                style={{
                  background: theme.colors.surface,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setSelectedCategory("all")}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: selectedCategory === "all" ? theme.colors.primary : theme.colors.surface,
                color: selectedCategory === "all" ? theme.colors.background : theme.colors.textMuted,
              }}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize"
                style={{
                  background: selectedCategory === cat ? theme.colors.primary : theme.colors.surface,
                  color: selectedCategory === cat ? theme.colors.background : theme.colors.textMuted,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Links grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {filteredLinks.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer">
              <Card variant="3d" className="p-5 h-full group cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold group-hover:text-[var(--theme-primary)] transition-colors" style={{ color: theme.colors.text }}>
                    {link.title}
                  </h3>
                  <ExternalLink
                    size={16}
                    className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: theme.colors.primary }}
                  />
                </div>
                {link.description && (
                  <p className="text-sm mb-3 line-clamp-2" style={{ color: theme.colors.textMuted }}>
                    {link.description}
                  </p>
                )}
                <Badge>{link.category}</Badge>
              </Card>
            </a>
          ))}
        </div>

        {filteredLinks.length === 0 && (
          <div className="text-center py-16">
            <Globe size={48} className="mx-auto mb-4 opacity-20" style={{ color: theme.colors.textMuted }} />
            <p style={{ color: theme.colors.textMuted }}>
              {search ? "Tidak ada link yang cocok dengan pencarian" : "Belum ada link yang ditambahkan"}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

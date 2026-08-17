"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Plus, Trash2, Edit3, Save, X, Search } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { AIKnowledge } from "@/lib/types";

export default function AISettingsPage() {
  const [knowledge, setKnowledge] = useState<AIKnowledge[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ topic: "", content: "", category: "general", source: "" });
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  const loadData = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("ai_knowledge").select("*").order("category");
    if (data) setKnowledge(data);
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ topic: "", content: "", category: "general", source: "" });
    setIsModalOpen(true);
  };

  const openEdit = (k: AIKnowledge) => {
    setEditingId(k.id);
    setForm({ topic: k.topic, content: k.content, category: k.category, source: k.source || "" });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const supabase = createClient();
    if (editingId) {
      await supabase.from("ai_knowledge").update(form).eq("id", editingId);
    } else {
      await supabase.from("ai_knowledge").insert(form);
    }
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus knowledge ini?")) return;
    const supabase = createClient();
    await supabase.from("ai_knowledge").delete().eq("id", id);
    loadData();
  };

  const filtered = knowledge.filter(
    (k) =>
      k.topic.toLowerCase().includes(search.toLowerCase()) ||
      k.content.toLowerCase().includes(search.toLowerCase()) ||
      k.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Brain size={24} style={{ color: theme.colors.secondary }} />
          AI Knowledge Base
        </h1>
        <Button onClick={openCreate} glow>
          <Plus size={16} /> Add Knowledge
        </Button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.colors.textMuted }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search knowledge..."
          className="w-full pl-9 pr-3 py-2 rounded-lg text-sm"
          style={{ background: theme.colors.surface, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
        />
      </div>

      <div className="space-y-2">
        {filtered.map((k, i) => (
          <motion.div
            key={k.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card variant="default" className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm" style={{ color: theme.colors.text }}>{k.topic}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: theme.colors.surface, color: theme.colors.textMuted }}>
                      {k.category}
                    </span>
                  </div>
                  <p className="text-xs line-clamp-2" style={{ color: theme.colors.textMuted }}>{k.content}</p>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <button onClick={() => openEdit(k)} className="p-1.5 rounded-lg hover:bg-[var(--theme-surface)]">
                    <Edit3 size={14} style={{ color: theme.colors.primary }} />
                  </button>
                  <button onClick={() => handleDelete(k.id)} className="p-1.5 rounded-lg hover:bg-red-500/20">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <Card variant="glass" className="p-12 text-center">
            <Brain size={48} className="mx-auto mb-4 opacity-20" style={{ color: theme.colors.textMuted }} />
            <p style={{ color: theme.colors.textMuted }}>Tidak ada knowledge yang ditemukan</p>
          </Card>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Knowledge" : "Add Knowledge"} size="lg">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.colors.textMuted }}>Topic</label>
            <input
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: theme.colors.surface, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
              placeholder="typing_test"
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.colors.textMuted }}>Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm min-h-[150px] resize-y"
              style={{ background: theme.colors.surface, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
              placeholder="Detailed information about this topic..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: theme.colors.textMuted }}>Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ background: theme.colors.surface, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
                placeholder="features"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: theme.colors.textMuted }}>Source</label>
              <input
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ background: theme.colors.surface, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
                placeholder="Optional source"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}><X size={14} /> Cancel</Button>
            <Button onClick={handleSave}><Save size={14} /> {editingId ? "Update" : "Create"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pin, PinOff, Trash2, Save, FileText, Search,
  Clock, Edit3
} from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Notepad } from "@/lib/types";

export default function NotepadPage() {
  const [notepads, setNotepads] = useState<Notepad[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  const loadNotepads = useCallback(async () => {
    try {
      const res = await fetch("/api/notepad");
      const json = await res.json();
      if (json.data) setNotepads(json.data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    loadNotepads();
  }, [loadNotepads]);

  const createNotepad = async () => {
    try {
      const res = await fetch("/api/notepad", { method: "POST" });
      const json = await res.json();
      if (json.data) {
        setNotepads((prev) => [json.data, ...prev]);
        setSelectedId(json.data.id);
        setTitle(json.data.title || "");
        setContent(json.data.content || "");
      } else {
        alert("Gagal membuat catatan: " + (json.error || "Unknown error"));
      }
    } catch (e) {
      alert("Gagal membuat catatan: " + (e instanceof Error ? e.message : "Network error"));
    }
  };

  const saveNotepad = async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/notepad", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, title, content }),
      });
      const json = await res.json();
      if (json.success) {
        setLastSaved(new Date().toLocaleTimeString("id-ID"));
        loadNotepads();
      } else {
        alert("Gagal save: " + (json.error || "Unknown error"));
      }
    } catch (e) {
      alert("Gagal save: " + (e instanceof Error ? e.message : "Network error"));
    }
    setSaving(false);
  };

  const togglePin = async (id: string, current: boolean) => {
    try {
      await fetch("/api/notepad", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_pinned: !current }),
      });
      loadNotepads();
    } catch { /* ignore */ }
  };

  const deleteNotepad = async (id: string) => {
    if (!confirm("Yakin ingin menghapus catatan ini?")) return;
    try {
      await fetch(`/api/notepad?id=${id}`, { method: "DELETE" });
      setNotepads((prev) => prev.filter((n) => n.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setTitle("");
        setContent("");
      }
    } catch { /* ignore */ }
  };

  const selectNotepad = (n: Notepad) => {
    setSelectedId(n.id);
    setTitle(n.title || "");
    setContent(n.content);
  };

  const filtered = notepads.filter(
    (n) =>
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  if (notepads.length === 0 && !search) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <FileText size={48} className="mx-auto mb-4 opacity-30" style={{ color: theme.colors.textMuted }} />
        <h2 className="text-xl font-bold mb-2" style={{ color: theme.colors.text }}>Notepad</h2>
        <p style={{ color: theme.colors.textMuted }}>Klik tombol + untuk membuat catatan baru</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText size={24} style={{ color: theme.colors.primary }} />
          Notepad
        </h1>
        <Button onClick={createNotepad} glow>
          <Plus size={16} /> New Note
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[calc(100vh-12rem)]">
        {/* Sidebar - list of notes */}
        <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.colors.textMuted }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari catatan..."
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
              style={{
                background: theme.colors.surface,
                color: theme.colors.text,
                border: `1px solid ${theme.colors.border}`,
              }}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 hide-scrollbar">
            <AnimatePresence>
              {filtered.map((n) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card
                    variant={selectedId === n.id ? "glow" : "default"}
                    className={`p-3 cursor-pointer transition-all ${
                      selectedId === n.id ? "border-[var(--theme-primary)]" : ""
                    }`}
                    onClick={() => selectNotepad(n)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate" style={{ color: theme.colors.text }}>
                          {n.is_pinned && <Pin size={12} className="inline mr-1" style={{ color: theme.colors.accent }} />}
                          {n.title || "Untitled"}
                        </h3>
                        <p className="text-xs mt-1 truncate" style={{ color: theme.colors.textMuted }}>
                          {n.content.substring(0, 50) || "Kosong..."}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={10} style={{ color: theme.colors.textMuted }} />
                          <span className="text-[10px]" style={{ color: theme.colors.textMuted }}>
                            {new Date(n.updated_at).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 ml-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); togglePin(n.id, n.is_pinned); }}
                          className="p-1 rounded hover:bg-[var(--theme-surface)]"
                        >
                          {n.is_pinned ? <PinOff size={12} style={{ color: theme.colors.accent }} /> : <Pin size={12} style={{ color: theme.colors.textMuted }} />}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteNotepad(n.id); }}
                          className="p-1 rounded hover:bg-red-500/20"
                        >
                          <Trash2 size={12} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="text-center py-8">
                <Edit3 size={32} className="mx-auto mb-2 opacity-20" style={{ color: theme.colors.textMuted }} />
                <p className="text-sm" style={{ color: theme.colors.textMuted }}>
                  {search ? "Tidak ditemukan" : "Buat catatan baru"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col">
          {selectedId ? (
            <Card variant="glass" className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-[var(--theme-border)] flex items-center justify-between">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-bold bg-transparent outline-none flex-1"
                  style={{ color: theme.colors.text }}
                  placeholder="Judul catatan..."
                />
                <div className="flex items-center gap-2">
                  {lastSaved && (
                    <span className="text-xs" style={{ color: theme.colors.textMuted }}>
                      Tersimpan {lastSaved}
                    </span>
                  )}
                  <Button onClick={saveNotepad} size="sm" disabled={saving}>
                    <Save size={14} /> {saving ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 p-4 bg-transparent outline-none resize-none text-sm leading-relaxed"
                style={{ color: theme.colors.text }}
                placeholder="Mulai menulis..."
              />
            </Card>
          ) : (
            <Card variant="glass" className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText size={48} className="mx-auto mb-4 opacity-20" style={{ color: theme.colors.textMuted }} />
                <p style={{ color: theme.colors.textMuted }}>Pilih atau buat catatan baru</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

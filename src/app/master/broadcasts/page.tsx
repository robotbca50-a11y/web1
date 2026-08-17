"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Radio, Plus, Trash2, Edit3, Save, X
} from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import type { Broadcast } from "@/lib/types";

export default function BroadcastsPage() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    priority: "normal" as string,
    is_active: true,
  });
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  const loadData = async () => {
    try {
      const res = await fetch("/api/admin/broadcasts");
      const json = await res.json();
      if (json.data) setBroadcasts(json.data);
    } catch (e) {
      console.warn("Failed to load broadcasts:", e);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: "", content: "", priority: "normal", is_active: true });
    setIsModalOpen(true);
  };

  const openEdit = (b: Broadcast) => {
    setEditingId(b.id);
    setForm({ title: b.title, content: b.content, priority: b.priority, is_active: b.is_active });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (editingId) {
        await fetch("/api/admin/broadcasts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...form }),
        });
      } else {
        await fetch("/api/admin/broadcasts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setIsModalOpen(false);
      await loadData();
    } catch (e) {
      console.warn("Failed to save broadcast:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus broadcast ini?")) return;
    try {
      await fetch("/api/admin/broadcasts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      loadData();
    } catch (e) {
      console.warn("Failed to delete broadcast:", e);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Radio size={24} style={{ color: theme.colors.accent }} />
          Manage Broadcasts
        </h1>
        <Button onClick={openCreate} glow>
          <Plus size={16} /> New Broadcast
        </Button>
      </div>

      <div className="space-y-3">
        {broadcasts.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card variant="default" className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm" style={{ color: theme.colors.text }}>{b.title}</h3>
                    <Badge variant={
                      b.priority === "urgent" ? "danger" :
                      b.priority === "high" ? "warning" :
                      b.priority === "normal" ? "primary" : "default"
                    }>
                      {b.priority}
                    </Badge>
                    {!b.is_active && <Badge variant="default">Hidden</Badge>}
                  </div>
                  <p className="text-xs line-clamp-2" style={{ color: theme.colors.textMuted }}>{b.content}</p>
                  <span className="text-[10px] mt-1 block" style={{ color: theme.colors.textMuted }}>
                    {new Date(b.created_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-[var(--theme-surface)]">
                    <Edit3 size={14} style={{ color: theme.colors.primary }} />
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg hover:bg-red-500/20">
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {broadcasts.length === 0 && (
          <Card variant="glass" className="p-12 text-center">
            <Radio size={48} className="mx-auto mb-4 opacity-20" style={{ color: theme.colors.textMuted }} />
            <p style={{ color: theme.colors.textMuted }}>Belum ada broadcast</p>
          </Card>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Broadcast" : "New Broadcast"}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.colors.textMuted }}>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: theme.colors.surface, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.colors.textMuted }}>Content</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm min-h-[120px] resize-y"
              style={{ background: theme.colors.surface, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.colors.textMuted }}>Priority</label>
            <div className="flex gap-2">
              {["low", "normal", "high", "urgent"].map((p) => (
                <button
                  key={p}
                  onClick={() => setForm({ ...form, priority: p })}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                  style={{
                    background: form.priority === p ? theme.colors.primary : theme.colors.surface,
                    color: form.priority === p ? theme.colors.background : theme.colors.textMuted,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} id="bactive" className="rounded" />
            <label htmlFor="bactive" className="text-sm" style={{ color: theme.colors.text }}>Active</label>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}><X size={14} /> Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}><Save size={14} /> {isSaving ? "Saving..." : editingId ? "Update" : "Create"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

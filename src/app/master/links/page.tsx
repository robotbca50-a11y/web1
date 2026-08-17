"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Link2, Plus, Trash2, Edit3, Eye, EyeOff,
  GripVertical, Save, X, ExternalLink
} from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { getTheme } from "@/lib/themes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { Link as LinkType } from "@/lib/types";

export default function LinksPage() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Partial<LinkType> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    url: "",
    description: "",
    category: "general",
    icon: "",
    is_active: true,
    order_index: 0,
  });
  const currentTheme = useThemeStore((s) => s.currentTheme);
  const theme = getTheme(currentTheme);

  const loadLinks = async () => {
    try {
      const res = await fetch("/api/admin/links");
      const json = await res.json();
      if (json.data) setLinks(json.data);
    } catch (e) {
      console.warn("Failed to load links:", e);
    }
  };

  useEffect(() => { loadLinks(); }, []);

  const openCreate = () => {
    setEditingLink(null);
    setForm({ title: "", url: "", description: "", category: "general", icon: "", is_active: true, order_index: links.length });
    setIsModalOpen(true);
  };

  const openEdit = (link: LinkType) => {
    setEditingLink(link);
    setForm({
      title: link.title,
      url: link.url,
      description: link.description || "",
      category: link.category,
      icon: link.icon || "",
      is_active: link.is_active,
      order_index: link.order_index,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (editingLink?.id) {
        await fetch("/api/admin/links", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingLink.id, ...form }),
        });
      } else {
        await fetch("/api/admin/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setIsModalOpen(false);
      await loadLinks();
    } catch (e) {
      console.warn("Failed to save link:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus link ini?")) return;
    try {
      await fetch("/api/admin/links", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      loadLinks();
    } catch (e) {
      console.warn("Failed to delete link:", e);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await fetch("/api/admin/links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !current }),
      });
      loadLinks();
    } catch (e) {
      console.warn("Failed to toggle link:", e);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Link2 size={24} style={{ color: theme.colors.primary }} />
          Manage Links
        </h1>
        <Button onClick={openCreate} glow>
          <Plus size={16} /> Add Link
        </Button>
      </div>

      <div className="space-y-2">
        {links.map((link, i) => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card variant="default" className="p-4 flex items-center gap-4">
              <GripVertical size={16} style={{ color: theme.colors.textMuted }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm truncate" style={{ color: theme.colors.text }}>
                    {link.title}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: theme.colors.surface, color: theme.colors.textMuted }}>
                    {link.category}
                  </span>
                </div>
                <p className="text-xs truncate mt-0.5" style={{ color: theme.colors.textMuted }}>
                  {link.url}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleActive(link.id, link.is_active)}
                  className="p-1.5 rounded-lg hover:bg-[var(--theme-surface)]"
                >
                  {link.is_active ? <Eye size={14} style={{ color: "#22c55e" }} /> : <EyeOff size={14} style={{ color: theme.colors.textMuted }} />}
                </button>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-[var(--theme-surface)]">
                  <ExternalLink size={14} style={{ color: theme.colors.textMuted }} />
                </a>
                <button onClick={() => openEdit(link)} className="p-1.5 rounded-lg hover:bg-[var(--theme-surface)]">
                  <Edit3 size={14} style={{ color: theme.colors.primary }} />
                </button>
                <button onClick={() => handleDelete(link.id)} className="p-1.5 rounded-lg hover:bg-red-500/20">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            </Card>
          </motion.div>
        ))}

        {links.length === 0 && (
          <Card variant="glass" className="p-12 text-center">
            <Link2 size={48} className="mx-auto mb-4 opacity-20" style={{ color: theme.colors.textMuted }} />
            <p style={{ color: theme.colors.textMuted }}>Belum ada link. Klik &quot;Add Link&quot; untuk menambahkan.</p>
          </Card>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLink ? "Edit Link" : "Add Link"}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.colors.textMuted }}>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: theme.colors.surface, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
              placeholder="My Awesome Project"
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.colors.textMuted }}>URL</label>
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: theme.colors.surface, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.colors.textMuted }}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm min-h-[80px] resize-y"
              style={{ background: theme.colors.surface, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
              placeholder="Description of the link..."
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
                placeholder="general"
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: theme.colors.textMuted }}>Order</label>
              <input
                type="number"
                value={form.order_index}
                onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ background: theme.colors.surface, color: theme.colors.text, border: `1px solid ${theme.colors.border}` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="rounded"
              id="active"
            />
            <label htmlFor="active" className="text-sm" style={{ color: theme.colors.text }}>Active</label>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              <X size={14} /> Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save size={14} /> {isSaving ? "Saving..." : editingLink ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

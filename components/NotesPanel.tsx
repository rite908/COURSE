"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StickyNote, Save, Check } from "lucide-react";
import { saveNote, getUserProgress, type UserName } from "@/lib/storage";

interface Props {
  user: UserName;
  chapterId: string;
  topicId: string;
  accentColor?: string;
}

export default function NotesPanel({ user, chapterId, topicId, accentColor = "#2563EB" }: Props) {
  const [note, setNote]   = useState("");
  const [saved, setSaved] = useState(false);
  const key = `${chapterId}:${topicId}`;

  useEffect(() => {
    const progress = getUserProgress(user);
    setNote(progress.notes[key] || "");
    setSaved(false);
  }, [user, key]);

  const handleSave = () => {
    saveNote(user, chapterId, topicId, note);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Auto-save after 2s of inactivity
  useEffect(() => {
    if (!note) return;
    const timer = setTimeout(() => {
      saveNote(user, chapterId, topicId, note);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }, 2000);
    return () => clearTimeout(timer);
  }, [note, user, chapterId, topicId]);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
    >
      <div
        className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <StickyNote size={14} style={{ color: accentColor }} />
          <span className="text-sm font-bold text-gray-900">My Notes</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all font-semibold border"
          style={
            saved
              ? { color: "#059669", background: "#ECFDF5", borderColor: "#A7F3D0" }
              : { color: "#94A3B8", background: "#F8FAFF", borderColor: "#E2E8F0" }
          }
        >
          {saved ? <Check size={11} /> : <Save size={11} />}
          {saved ? "Saved!" : "Save"}
        </motion.button>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Is topic ke baare mein apne notes yahan likhein... (auto-saves)"
        className="w-full p-5 text-sm text-gray-700 placeholder-gray-300 resize-none focus:outline-none bg-white leading-relaxed"
        rows={4}
      />
    </div>
  );
}

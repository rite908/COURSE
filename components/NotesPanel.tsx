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

export default function NotesPanel({ user, chapterId, topicId, accentColor = "#00E5FF" }: Props) {
  const [note, setNote] = useState("");
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
    <div className="glass rounded-xl border border-white/8 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote size={14} style={{ color: accentColor }} />
          <span className="text-sm font-semibold text-white">My Notes</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-all font-medium ${
            saved
              ? "text-accent-green bg-accent-green/10"
              : "text-white/50 hover:text-white bg-white/5 hover:bg-white/10"
          }`}
        >
          {saved ? <Check size={11} /> : <Save size={11} />}
          {saved ? "Saved!" : "Save"}
        </motion.button>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Apne notes yahan likho... (auto-save hota hai)"
        className="w-full bg-transparent resize-none text-sm text-white/70 placeholder:text-white/20 p-4 min-h-[120px] focus:outline-none font-mono leading-relaxed"
        style={{ caretColor: accentColor }}
      />
    </div>
  );
}

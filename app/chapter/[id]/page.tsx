"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, HelpCircle, Clock, BarChart2, Play } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ChapterViewer from "@/components/ChapterViewer";
import { getChapter, type ChapterMeta } from "@/lib/chapters";
import { getCurrentUser, getChapterStats, type UserName } from "@/lib/storage";

const CHAPTER_META: Record<string, {
  difficulty: string; diffColor: string; diffBg: string;
  hours: string; tagline: string;
}> = {
  "1": { difficulty: "Beginner",     diffColor: "#059669", diffBg: "#ECFDF5", hours: "2–3h", tagline: "Pehle samjho, phir sikho, phir karo." },
  "2": { difficulty: "Beginner",     diffColor: "#059669", diffBg: "#ECFDF5", hours: "3–4h", tagline: "Computer ko andar se jaano — uska dost bano." },
  "3": { difficulty: "Intermediate", diffColor: "#D97706", diffBg: "#FFFBEB", hours: "4–5h", tagline: "Internet mein har packet ek kahani sunata hai." },
  "4": { difficulty: "Intermediate", diffColor: "#D97706", diffBg: "#FFFBEB", hours: "4–5h", tagline: "Hacker ka asli weapon — command line." },
  "5": { difficulty: "Advanced",     diffColor: "#DC2626", diffBg: "#FEF2F2", hours: "5–6h", tagline: "Ethical hacking ka practical duniya." },
};

export default function ChapterPage() {
  const params    = useParams();
  const router    = useRouter();
  const chapterId = params?.id as string;

  const [user,    setUser]    = useState<UserName | null>(null);
  const [chapter, setChapter] = useState<ChapterMeta | null>(null);
  const [mounted, setMounted] = useState(false);
  const [stats,   setStats]   = useState({ completed: 0, total: 0, percent: 0 });

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.replace("/login"); return; }
    setUser(u);
    const ch = getChapter(chapterId);
    if (!ch) { router.replace("/chapters"); return; }
    setChapter(ch);
    const s = getChapterStats(u, chapterId, ch.totalTopics);
    setStats(s);
    setMounted(true);
  }, [chapterId, router]);

  if (!mounted || !user || !chapter) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-gray-200 animate-spin"
            style={{ borderTopColor: "#2563EB" }}
          />
          <p className="text-sm text-gray-400">Loading chapter...</p>
        </div>
      </div>
    );
  }

  const meta   = CHAPTER_META[chapterId] || CHAPTER_META["1"];
  const accent = chapter.accentColor;

  const statCards = [
    { icon: <BookOpen size={15} />,  label: "Topics",    value: chapter.totalTopics },
    { icon: <HelpCircle size={15} />, label: "MCQs",     value: `~${chapter.totalTopics * 15}` },
    { icon: <BarChart2 size={15} />, label: "Difficulty", value: meta.difficulty },
    { icon: <Clock size={15} />,     label: "Reading",   value: meta.hours },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Chapter Hero ── */}
      <div
        className="pt-16 pb-0"
        style={{ background: `linear-gradient(180deg, ${accent}08 0%, #FFFFFF 100%)` }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-8 pb-10">
          {/* Breadcrumb */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-all mb-6 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Chapters
          </Link>

          {/* Hero content */}
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Icon */}
            <motion.div
              initial={mounted ? { scale: 0, rotate: -10 } : false}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.05 }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm"
              style={{ background: `${accent}12`, border: `1.5px solid ${accent}25` }}
            >
              {chapter.icon}
            </motion.div>

            <div className="flex-1">
              {/* Chapter number badge */}
              <motion.div
                initial={mounted ? { opacity: 0, y: -8 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 mb-2"
              >
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full font-mono tracking-wide"
                  style={{ color: accent, background: `${accent}10` }}
                >
                  Chapter {chapter.number} of 5
                </span>
                {stats.percent > 0 && (
                  <span className="text-xs text-gray-400">{stats.percent}% done</span>
                )}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={mounted ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight mb-1"
                style={{ letterSpacing: "-0.025em" }}
              >
                {chapter.title}
              </motion.h1>

              <motion.p
                initial={mounted ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-sm italic mb-5"
              >
                "{meta.tagline}"
              </motion.p>

              {/* Stat pills */}
              <motion.div
                initial={mounted ? { opacity: 0, y: 8 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-wrap items-center gap-2.5 mb-6"
              >
                {statCards.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-white text-xs"
                    style={{ borderColor: `${accent}20` }}
                  >
                    <span style={{ color: accent }}>{s.icon}</span>
                    <span className="text-gray-500">{s.label}:</span>
                    <span className="font-bold text-gray-800">{s.value}</span>
                  </div>
                ))}
              </motion.div>

              {/* Progress bar if in progress */}
              {stats.percent > 0 && (
                <div className="max-w-xs mb-5">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: accent }}
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.percent}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{stats.completed}/{chapter.totalTopics} topics completed</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />
      </div>

      {/* Chapter Viewer */}
      <ChapterViewer chapter={chapter} user={user} />
    </div>
  );
}

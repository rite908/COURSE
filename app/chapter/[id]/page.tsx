"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, HelpCircle, Clock, BarChart2 } from "lucide-react";
import Link from "next/link";
import ChapterViewer from "@/components/ChapterViewer";
import { getChapter, type ChapterMeta } from "@/lib/chapters";
import { getCurrentUser, getChapterStats, type UserName } from "@/lib/storage";
import { useTheme } from "@/lib/theme";

const CHAPTER_META: Record<string, { difficulty: string; diffColor: string; hours: string; tagline: string }> = {
  "1": { difficulty: "Beginner",     diffColor: "#059669", hours: "2–3h", tagline: "Pehle samjho, phir sikho, phir karo." },
  "2": { difficulty: "Beginner",     diffColor: "#059669", hours: "3–4h", tagline: "Computer ko andar se jaano — uska dost bano." },
  "3": { difficulty: "Intermediate", diffColor: "#D97706", hours: "4–5h", tagline: "Internet mein har packet ek kahani sunata hai." },
  "4": { difficulty: "Intermediate", diffColor: "#D97706", hours: "4–5h", tagline: "Hacker ka asli weapon — command line." },
  "5": { difficulty: "Advanced",     diffColor: "#DC2626", hours: "5–6h", tagline: "Ethical hacking ka practical duniya." },
};

export default function ChapterPage() {
  const params    = useParams();
  const router    = useRouter();
  const chapterId = params?.id as string;
  const { isDark } = useTheme();

  const [user,    setUser]    = useState<UserName | null>(null);
  const [chapter, setChapter] = useState<ChapterMeta | null>(null);
  const [mounted, setMounted] = useState(false);
  const [vw,      setVw]      = useState(1280);
  const [stats,   setStats]   = useState({ completed: 0, total: 0, percent: 0 });

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.replace("/login"); return; }
    setUser(u);
    const ch = getChapter(chapterId);
    if (!ch) { router.replace("/chapters"); return; }
    setChapter(ch);
    setStats(getChapterStats(u, chapterId, ch.totalTopics));
    setMounted(true);
    const upd = () => setVw(window.innerWidth);
    upd(); window.addEventListener("resize", upd, { passive: true });
    return () => window.removeEventListener("resize", upd);
  }, [chapterId, router]);

  const isMd = vw >= 640;
  const sp   = vw < 640 ? 16 : vw < 768 ? 24 : vw < 1024 ? 40 : 64;

  const T = {
    bg:      isDark ? "#060912"  : "#FFFFFF",
    text:    isDark ? "#F1F5F9"  : "#111827",
    text2:   isDark ? "#94A3B8"  : "#6B7280",
    muted:   isDark ? "#64748B"  : "#9CA3AF",
    border:  isDark ? "#1E2433"  : "#E5E7EB",
    card:    isDark ? "#0D1117"  : "#FFFFFF",
  };

  if (!mounted || !user || !chapter) {
    return (
      <div style={{ minHeight: "100vh", background: isDark ? "#060912" : "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: `2px solid ${isDark ? "#1E2433" : "#E5E7EB"}`, borderTopColor: "#2563EB", animation: "spin 0.8s linear infinite" }} />
          <p style={{ fontSize: "13px", color: isDark ? "#64748B" : "#9CA3AF" }}>Loading chapter...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  const meta   = CHAPTER_META[chapterId] || CHAPTER_META["1"];
  const accent = chapter.accentColor;

  const statCards = [
    { icon: <BookOpen size={14} />,   label: "Topics",     value: chapter.totalTopics },
    { icon: <HelpCircle size={14} />, label: "MCQs",       value: `~${chapter.totalTopics * 15}` },
    { icon: <BarChart2 size={14} />,  label: "Difficulty", value: meta.difficulty },
    { icon: <Clock size={14} />,      label: "Reading",    value: meta.hours },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg }}>

      {/* Chapter hero */}
      <div style={{
        paddingTop: 68,
        background: isDark
          ? `linear-gradient(180deg,${accent}12 0%,#060912 100%)`
          : `linear-gradient(180deg,${accent}08 0%,#FFFFFF 100%)`,
      }}>
        <div style={{ padding: `28px ${sp}px 28px` }}>

          {/* Breadcrumb */}
          <Link href="/chapters" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "13.5px", color: T.muted, textDecoration: "none", marginBottom: 24, fontWeight: 500 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = T.text; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = T.muted; }}>
            <ArrowLeft size={14} /> Back to Chapters
          </Link>

          {/* Hero content */}
          <div style={{ display: "flex", flexDirection: isMd ? "row" : "column", alignItems: "flex-start", gap: isMd ? 24 : 16 }}>
            {/* Icon */}
            <motion.div
              initial={mounted ? { scale: 0, rotate: -10 } : false}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.05 }}
              style={{
                width: isMd ? 72 : 56, height: isMd ? 72 : 56, borderRadius: 20, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem",
                background: `${accent}14`, border: `1.5px solid ${accent}28`,
              }}
            >{chapter.icon}</motion.div>

            <div style={{ flex: 1 }}>
              {/* Badge */}
              <motion.div initial={mounted ? { opacity: 0, y: -8 } : false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 12px", borderRadius: 999, color: accent, background: `${accent}12`, fontFamily: "monospace", letterSpacing: "0.05em" }}>
                  Chapter {chapter.number} of 5
                </span>
                {stats.percent > 0 && <span style={{ fontSize: "12px", color: T.muted }}>{stats.percent}% done</span>}
              </motion.div>

              {/* Title */}
              <motion.h1 initial={mounted ? { opacity: 0, y: 10 } : false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                style={{ fontWeight: 900, color: T.text, fontSize: isMd ? "2rem" : "1.55rem", letterSpacing: "-0.025em", marginBottom: 6, lineHeight: 1.15 }}>
                {chapter.title}
              </motion.h1>

              <motion.p initial={mounted ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                style={{ color: T.muted, fontSize: "13.5px", fontStyle: "italic", marginBottom: 20 }}>
                &ldquo;{meta.tagline}&rdquo;
              </motion.p>

              {/* Stat pills */}
              <motion.div initial={mounted ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: stats.percent > 0 ? 20 : 0 }}>
                {statCards.map((s) => (
                  <div key={s.label} style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 12,
                    border: `1px solid ${accent}20`, background: T.card,
                    boxShadow: `0 1px 6px rgba(0,0,0,${isDark ? 0.2 : 0.04})`,
                    fontSize: "12px",
                  }}>
                    <span style={{ color: accent }}>{s.icon}</span>
                    <span style={{ color: T.muted }}>{s.label}:</span>
                    <span style={{ fontWeight: 700, color: T.text }}>{s.value}</span>
                  </div>
                ))}
              </motion.div>

              {/* Progress */}
              {stats.percent > 0 && (
                <div style={{ maxWidth: 320 }}>
                  <div style={{ height: 5, background: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9", borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
                    <motion.div style={{ background: accent, height: "100%", borderRadius: 99 }}
                      initial={{ width: 0 }} animate={{ width: `${stats.percent}%` }} transition={{ duration: 0.8, delay: 0.4 }} />
                  </div>
                  <div style={{ fontSize: "12px", color: T.muted }}>{stats.completed}/{chapter.totalTopics} topics completed</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ borderBottom: `1px solid ${T.border}` }} />
      </div>

      {/* Chapter Viewer */}
      <ChapterViewer chapter={chapter} user={user} />
    </div>
  );
}

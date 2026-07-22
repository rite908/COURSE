"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle, Lock, BookOpen, Target, TrendingUp, Clock } from "lucide-react";
import {
  getCurrentUser, getUserProgress, getChapterStats, getOverallStats, type UserName,
} from "@/lib/storage";
import { CHAPTERS } from "@/lib/chapters";
import { formatTime } from "@/lib/utils";
import { useTheme } from "@/lib/theme";

const USER_CONFIG: Record<UserName, { color: string; darkBg: string; lightBg: string; greeting: string; emoji: string }> = {
  TWH:    { color: "#2563EB", darkBg: "rgba(37,99,235,0.15)",  lightBg: "#EEF3FF", greeting: "Waapas aagaye, Afsar Bhai!", emoji: "🔥" },
  Prince: { color: "#7C3AED", darkBg: "rgba(124,58,237,0.15)", lightBg: "#F3EEFF", greeting: "Waapas aagaye, Prince!",      emoji: "💪" },
  Ashish: { color: "#059669", darkBg: "rgba(5,150,105,0.15)",  lightBg: "#ECFDF5", greeting: "Waapas aagaye, Ashish!",      emoji: "🚀" },
};

const CH_COLORS: Record<string, string> = {
  "1": "#2563EB", "2": "#0EA5E9", "3": "#7C3AED", "4": "#059669", "5": "#DC2626",
};
const CH_DARK_BG: Record<string, string> = {
  "1": "rgba(37,99,235,0.15)", "2": "rgba(14,165,233,0.15)", "3": "rgba(124,58,237,0.15)",
  "4": "rgba(5,150,105,0.15)", "5": "rgba(220,38,38,0.15)",
};
const CH_LIGHT_BG: Record<string, string> = {
  "1": "#EEF3FF", "2": "#F0F9FF", "3": "#F3EEFF", "4": "#ECFDF5", "5": "#FEF2F2",
};

export default function DashboardPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [user,    setUser]    = useState<UserName | null>(null);
  const [mounted, setMounted] = useState(false);
  const [vw,      setVw]      = useState(1280);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.replace("/login?from=/dashboard"); return; }
    setUser(u);
    setMounted(true);
    const upd = () => setVw(window.innerWidth);
    upd(); window.addEventListener("resize", upd, { passive: true });
    return () => window.removeEventListener("resize", upd);
  }, [router]);

  const isMd = vw >= 640;
  const isLg = vw >= 1024;
  const sp = vw < 640 ? 16 : vw < 768 ? 24 : vw < 1024 ? 40 : 64;

  const T = {
    bg:      isDark ? "#060912"  : "#F5F8FF",
    bg2:     isDark ? "#0D1117"  : "#FFFFFF",
    text:    isDark ? "#F1F5F9"  : "#111827",
    text2:   isDark ? "#94A3B8"  : "#6B7280",
    muted:   isDark ? "#64748B"  : "#9CA3AF",
    border:  isDark ? "#1E2433"  : "#E5E7EB",
    card:    isDark ? "#0D1117"  : "#FFFFFF",
  };

  if (!mounted || !user) return <DashboardSkeleton isDark={isDark} />;

  const overall      = getOverallStats(user);
  const conf         = USER_CONFIG[user];
  const chapters     = CHAPTERS.map((ch) => {
    const stats = getChapterStats(user, ch.id, ch.totalTopics);
    return { ch, stats, isLocked: stats.unlocked === 0, isCompleted: stats.completed === ch.totalTopics };
  });
  const doneCount   = chapters.filter((c) => c.isCompleted).length;
  const activeCount = chapters.filter((c) => !c.isLocked && !c.isCompleted).length;
  const continuePath = overall.currentChapter ? `/chapter/${overall.currentChapter}` : `/chapter/1`;

  const statCards = [
    { icon: <BookOpen size={17} />, value: `${doneCount}/5`,                   label: "Chapters Done",  color: "#2563EB", darkBg: "rgba(37,99,235,0.15)",  lightBg: "#EEF3FF" },
    { icon: <Target size={17} />,   value: `${overall.topicsPassed}`,           label: "Topics Passed",  color: "#7C3AED", darkBg: "rgba(124,58,237,0.15)", lightBg: "#F3EEFF" },
    { icon: <TrendingUp size={17}/>, value: `${overall.mcqAccuracy}%`,          label: "MCQ Accuracy",   color: "#059669", darkBg: "rgba(5,150,105,0.15)",  lightBg: "#ECFDF5" },
    { icon: <Clock size={17} />,    value: formatTime(overall.timeSpentMinutes), label: "Time Spent",     color: "#D97706", darkBg: "rgba(217,119,6,0.15)",  lightBg: "#FFFBEB" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, paddingTop: 68 }}>
      <main style={{ padding: `32px ${sp}px 64px` }}>

        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{
            background: T.card, borderRadius: 20, padding: isMd ? "28px 36px" : "22px 24px",
            marginBottom: 24, border: `1px solid ${T.border}`,
            boxShadow: `0 2px 16px rgba(0,0,0,${isDark ? 0.28 : 0.05})`,
            display: "flex", flexDirection: isMd ? "row" : "column",
            alignItems: isMd ? "center" : "flex-start",
            justifyContent: "space-between", gap: 20,
          }}
        >
          <div>
            <p style={{ fontSize: "13px", color: T.muted, marginBottom: 4 }}>Good to see you,</p>
            <h1 style={{ fontSize: isMd ? "1.9rem" : "1.5rem", fontWeight: 900, color: T.text, letterSpacing: "-0.025em", marginBottom: 6 }}>
              {conf.greeting} {conf.emoji}
            </h1>
            <p style={{ color: T.text2, fontSize: "14px" }}>Your learning dashboard — track missions, unlock topics.</p>
          </div>
          {overall.currentChapter && (
            <Link href={continuePath}>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 24px", borderRadius: 14, background: conf.color, color: "white", fontWeight: 700, fontSize: "14px", cursor: "pointer", boxShadow: `0 4px 18px ${conf.color}44`, whiteSpace: "nowrap" }}>
                <Play size={15} style={{ fill: "white" }} /> Continue Learning
              </motion.div>
            </Link>
          )}
        </motion.div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: isMd ? "repeat(4,1fr)" : "repeat(2,1fr)", gap: 12, marginBottom: 24 }}>
          {statCards.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ background: T.card, borderRadius: 18, padding: isMd ? "22px 20px" : "18px 16px", border: `1px solid ${T.border}`, boxShadow: `0 1px 8px rgba(0,0,0,${isDark ? 0.22 : 0.04})` }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, background: isDark ? s.darkBg : s.lightBg, color: s.color }}>
                {s.icon}
              </div>
              <div style={{ fontSize: "1.65rem", fontWeight: 900, color: T.text, lineHeight: 1, marginBottom: 5 }}>{s.value}</div>
              <div style={{ fontSize: "11.5px", color: T.muted, fontWeight: 600 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Continue banner */}
        {overall.currentChapter && (() => {
          const currentCh = CHAPTERS.find((c) => c.id === overall.currentChapter);
          const accent = CH_COLORS[overall.currentChapter] || "#2563EB";
          return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginBottom: 28 }}>
              <Link href={continuePath} style={{ textDecoration: "none" }}>
                <motion.div whileHover={{ y: -3, boxShadow: `0 8px 32px ${accent}20` }}
                  style={{ background: T.card, borderRadius: 18, padding: isMd ? "20px 28px" : "18px 20px", border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "box-shadow 0.25s", boxShadow: `0 2px 12px rgba(0,0,0,${isDark ? 0.22 : 0.04})` }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: accent, flexShrink: 0 }}>
                    <Play size={20} style={{ fill: "white", color: "white" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "10.5px", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 3 }}>Continue where you left off</div>
                    <div style={{ fontWeight: 700, color: T.text, fontSize: "15px" }}>{currentCh?.title}</div>
                    {overall.currentTopic && (
                      <div style={{ fontSize: "12px", color: T.muted, fontFamily: "monospace", marginTop: 2 }}>Topic {overall.currentTopic}</div>
                    )}
                  </div>
                  <ArrowRight size={16} color={T.muted} style={{ flexShrink: 0 }} />
                </motion.div>
              </Link>
            </motion.div>
          );
        })()}

        {/* Chapter grid header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontWeight: 800, color: T.text, fontSize: "17px" }}>All Chapters</h2>
          <div style={{ display: "flex", gap: 16, fontSize: "12.5px", fontWeight: 600 }}>
            <span style={{ color: "#059669" }}>{doneCount} done</span>
            <span style={{ color: "#2563EB" }}>{activeCount} in progress</span>
          </div>
        </div>

        {/* Chapter cards */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          style={{ display: "grid", gridTemplateColumns: isLg ? "repeat(3,1fr)" : isMd ? "repeat(2,1fr)" : "1fr", gap: 14 }}>
          {chapters.map(({ ch, stats, isLocked, isCompleted }, i) => {
            const accent = CH_COLORS[ch.id] || "#2563EB";
            const dBg    = CH_DARK_BG[ch.id] || "rgba(37,99,235,0.15)";
            const lBg    = CH_LIGHT_BG[ch.id] || "#EEF3FF";
            return (
              <motion.div key={ch.id}
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}>
                <Link href={isLocked ? "#" : `/chapter/${ch.id}`} style={{ textDecoration: "none" }}>
                  <motion.div
                    whileHover={!isLocked ? { y: -4, boxShadow: `0 8px 28px ${accent}18` } : {}}
                    style={{
                      background: T.card, borderRadius: 18, padding: "20px",
                      border: `1px solid ${isCompleted ? "#10B981" + "44" : T.border}`,
                      opacity: isLocked ? 0.5 : 1,
                      cursor: isLocked ? "not-allowed" : "pointer",
                      boxShadow: `0 1px 8px rgba(0,0,0,${isDark ? 0.2 : 0.04})`,
                      transition: "box-shadow 0.25s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", background: isLocked ? (isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9") : (isDark ? dBg : lBg) }}>
                          {isLocked ? <Lock size={16} color={T.muted} /> : ch.icon}
                        </div>
                        <div>
                          <div style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: isLocked ? T.muted : accent }}>
                            CH {String(ch.number).padStart(2,"0")}
                          </div>
                          <div style={{ fontWeight: 700, color: T.text, fontSize: "14px", lineHeight: 1.25 }}>{ch.title}</div>
                        </div>
                      </div>
                      {isCompleted ? <CheckCircle size={16} color="#059669" style={{ flexShrink: 0 }} /> : isLocked ? <Lock size={14} color={T.muted} style={{ flexShrink: 0 }} /> : null}
                    </div>

                    <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                      <span style={{ color: T.muted }}>{stats.completed}/{ch.totalTopics} topics</span>
                      <span style={{ fontWeight: 700, color: isLocked ? T.muted : accent }}>{stats.percent}%</span>
                    </div>
                    <div style={{ height: 5, background: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${stats.percent}%` }}
                        transition={{ duration: 0.9, delay: 0.5 + i * 0.07 }}
                        style={{ height: "100%", borderRadius: 99, background: isCompleted ? "#10B981" : isLocked ? (isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0") : accent }}
                      />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
}

function DashboardSkeleton({ isDark }: { isDark: boolean }) {
  const bg   = isDark ? "#060912" : "#F5F8FF";
  const card = isDark ? "#0D1117" : "#FFFFFF";
  return (
    <div style={{ minHeight: "100vh", background: bg, paddingTop: 88, padding: "88px 32px 64px" }}>
      <div className="skeleton" style={{ height: 120, borderRadius: 20, marginBottom: 24, background: card }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[...Array(4)].map((_,i) => <div key={i} className="skeleton" style={{ height: 96, borderRadius: 18, background: card }} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {[...Array(5)].map((_,i) => <div key={i} className="skeleton" style={{ height: 128, borderRadius: 18, background: card }} />)}
      </div>
    </div>
  );
}

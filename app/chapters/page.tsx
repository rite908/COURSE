"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Cpu, Wifi, Terminal, Code2,
  BookOpen, HelpCircle, Clock, ChevronDown,
  CheckCircle, Play, Lock,
} from "lucide-react";
import { CHAPTERS } from "@/lib/chapters";
import { getCurrentUser, getChapterStats, getUserProgress, type UserName } from "@/lib/storage";
import { useTheme } from "@/lib/theme";

// ── Config ────────────────────────────────────────────────────────────────

const VISUALS = {
  "1": { accent: "#2563EB", bg: "rgba(37,99,235,0.14)",  Icon: Shield,   difficulty: "Beginner", diffColor: "#059669", hours: "2h 15m", mcqs: 90  },
  "2": { accent: "#0EA5E9", bg: "rgba(14,165,233,0.14)", Icon: Cpu,      difficulty: "Easy",     diffColor: "#059669", hours: "3h 45m", mcqs: 150 },
  "3": { accent: "#7C3AED", bg: "rgba(124,58,237,0.14)", Icon: Wifi,     difficulty: "Easy",     diffColor: "#059669", hours: "3h 30m", mcqs: 150 },
  "4": { accent: "#059669", bg: "rgba(5,150,105,0.14)",  Icon: Terminal, difficulty: "Medium",   diffColor: "#D97706", hours: "3h 30m", mcqs: 45  },
  "5": { accent: "#DC2626", bg: "rgba(220,38,38,0.14)",  Icon: Code2,    difficulty: "Hard",     diffColor: "#DC2626", hours: "4h 30m", mcqs: 180 },
} as const;

const TOPIC_DURATIONS: Record<string, number[]> = {
  "1": [15, 20, 18, 22, 25, 20],
  "2": [25, 30, 28, 35, 32, 30],
  "3": [25, 30, 35, 28, 32, 30],
  "4": [20, 25, 22, 28, 25, 30],
  "5": [30, 35, 40, 38, 42, 40],
};

// ── ProgressRing ──────────────────────────────────────────────────────────

function ProgressRing({ percent, accent, isDark }: { percent: number; accent: string; isDark: boolean }) {
  const [display, setDisplay] = useState(0);
  const size = 64, r = 26, circ = 2 * Math.PI * r;

  // Smooth count-up animation
  useEffect(() => {
    if (percent === 0) { setDisplay(0); return; }
    const duration = 1100;
    const startTime = Date.now();
    let raf: number;
    const tick = () => {
      const p = Math.min((Date.now() - startTime) / duration, 1);
      setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * percent));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [percent]);

  const trackColor = isDark ? `${accent}45` : `${accent}38`;
  const zeroColor  = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.30)";

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={32} cy={32} r={r} fill="none" stroke={trackColor} strokeWidth={4} />
        <motion.circle
          cx={32} cy={32} r={r} fill="none"
          stroke={accent} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (percent / 100) * circ }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
        />
      </svg>
      <motion.span
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "13px", fontWeight: 700,
          color: percent > 0 ? accent : zeroColor,
        }}
      >
        {display}%
      </motion.span>
    </div>
  );
}

// ── DifficultyBadge ───────────────────────────────────────────────────────

function DifficultyBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: "11px", fontWeight: 600, padding: "2px 10px", borderRadius: 999,
      color, background: color + "18", border: `1px solid ${color}35`,
    }}>
      {label}
    </span>
  );
}

// ── HexIcon ───────────────────────────────────────────────────────────────

function HexIcon({ accent, bg, Icon }: { accent: string; bg: string; Icon: React.ElementType }) {
  return (
    <motion.div
      whileHover={{ scale: 1.12, filter: `drop-shadow(0 0 14px ${accent}99)` }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      style={{
        width: 68, height: 68, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(135deg,${accent}28,${accent}14)`,
        border: `1.5px solid ${accent}45`,
        clipPath: "polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)",
      }}
    >
      <Icon size={30} color={accent} strokeWidth={1.7} />
    </motion.div>
  );
}

// ── TopicRow ──────────────────────────────────────────────────────────────

function TopicRow({
  topicId, accent, mins, status, isDark, index,
}: {
  topicId: string; accent: string; mins: number;
  status: "done" | "current" | "locked"; isDark: boolean; index: number;
}) {
  const lockedColor = isDark ? "#475569" : "#9CA3AF";
  const doneColor   = isDark ? "#94A3B8"  : "#6B7280";
  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, ease: "easeOut", delay: index * 0.05 }}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "9px 14px", borderRadius: 8,
        background: status === "current" ? accent + "12" : "transparent",
        border: `1px solid ${status === "current" ? accent + "28" : "transparent"}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {status === "done"    && <CheckCircle size={14} color="#10B981" />}
        {status === "current" && <Play        size={14} color={accent}  />}
        {status === "locked"  && <Lock        size={14} color={lockedColor} />}
        <span style={{
          fontSize: "13px",
          color: status === "locked" ? lockedColor : status === "current" ? accent : doneColor,
          fontWeight: status === "current" ? 600 : 400,
        }}>
          Topic {topicId}
        </span>
      </div>
      <span style={{ fontSize: "12px", color: lockedColor }}>{mins} min</span>
    </motion.div>
  );
}

// ── ChapterCard ───────────────────────────────────────────────────────────

type TopicStatus = "done" | "current" | "locked";

function ChapterCard({
  ch, vis, stats, topicStatuses, isExpanded, onToggle, isDark,
}: {
  ch: typeof CHAPTERS[0];
  vis: typeof VISUALS[keyof typeof VISUALS];
  stats: { completed: number; unlocked: number; total: number; percent: number };
  topicStatuses: TopicStatus[];
  isExpanded: boolean;
  onToggle: () => void;
  isDark: boolean;
}) {
  const { Icon, accent, bg, difficulty, diffColor, hours, mcqs } = vis;
  const isStarted  = stats.percent > 0;
  const durations  = TOPIC_DURATIONS[ch.id] ?? Array(ch.totalTopics).fill(20);
  const cardBg     = isDark ? "#0D1117" : "#FFFFFF";
  const cardBorder = isDark ? "#1E2433" : "#E5E7EB";
  const metaColor  = isDark ? "#64748B" : "#9CA3AF";
  const titleColor = isDark ? "#F1F5F9" : "#111827";
  const descColor  = isDark ? "#64748B" : "#6B7280";
  const btnIdleBg  = isDark ? "rgba(255,255,255,0.07)" : "#F3F4F6";
  const chevronCol = isDark ? "#64748B" : "#9CA3AF";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -5, boxShadow: `0 14px 44px ${accent}28` }}
      transition={{ type: "spring", stiffness: 270, damping: 26 }}
      style={{
        background: cardBg,
        border: `1px solid ${isExpanded ? accent + "55" : cardBorder}`,
        borderLeft: `4px solid ${accent}`,
        borderRadius: 16, overflow: "hidden",
        transition: "border-color 0.3s",
      }}
    >
      {/* Top stripe — sweeps in from left */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: "easeOut", delay: 0.15 }}
        style={{
          height: 4, transformOrigin: "left",
          background: `linear-gradient(90deg,${accent},${accent}88,${accent}22)`,
          boxShadow: `0 0 12px ${accent}55`,
        }}
      />

      {/* Card body */}
      <div style={{ padding: "22px 24px 20px", display: "flex", alignItems: "center", gap: 20 }}>
        <HexIcon accent={accent} bg={bg} Icon={Icon} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: accent, letterSpacing: "0.06em" }}>
              CH {String(ch.number).padStart(2, "0")}
            </span>
            <DifficultyBadge label={difficulty} color={diffColor} />
          </div>

          <h2 style={{ fontWeight: 800, fontSize: "16px", color: titleColor, marginBottom: 5, letterSpacing: "-0.01em" }}>
            {ch.title}
          </h2>
          <p style={{ fontSize: "13px", color: descColor, lineHeight: 1.6, marginBottom: 13 }}>
            {ch.description}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {([
              [BookOpen,   `${ch.totalTopics} Topics`],
              [HelpCircle, `${mcqs} MCQs`],
              [Clock,      hours],
            ] as [React.ElementType, string][]).map(([MI, text]) => (
              <span key={text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "12px", color: metaColor }}>
                <MI size={11} />{text}
              </span>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <ProgressRing percent={stats.percent} accent={accent} isDark={isDark} />

          <Link href={`/chapter/${ch.id}`} style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: isStarted ? `0 0 22px ${accent}55` : undefined }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              style={{
                padding: "9px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap",
                background: isStarted ? "linear-gradient(135deg,#2563EB,#7C3AED)" : btnIdleBg,
                color: isStarted ? "#FFFFFF" : titleColor,
              }}
            >
              {isStarted ? "Continue Learning →" : "Start Learning"}
            </motion.button>
          </Link>

          {/* Chevron — Framer Motion handles rotation */}
          <motion.button
            onClick={onToggle}
            animate={{ rotate: isExpanded ? 180 : 0 }}
            whileHover={{ scale: 1.2, color: isDark ? "#94A3B8" : "#6B7280" }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            aria-label="Toggle topics"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: chevronCol, display: "flex" }}
          >
            <ChevronDown size={20} />
          </motion.button>
        </div>
      </div>

      {/* Expandable topics */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="topics"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              borderTop: `1px solid ${accent}20`,
              padding: "14px 24px 20px",
              display: "flex", flexDirection: "column", gap: 3,
            }}>
              {topicStatuses.map((status, i) => (
                <TopicRow
                  key={i}
                  topicId={`${ch.id}.${i + 1}`}
                  accent={accent}
                  mins={durations[i] ?? 20}
                  status={status}
                  isDark={isDark}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

const heroVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const heroItem = {
  hidden:   { opacity: 0, y: -18 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function ChaptersPage() {
  const { isDark } = useTheme();
  const [user,     setUser]     = useState<UserName | null>(null);
  const [mounted,  setMounted]  = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);
  }, []);

  const bg          = isDark ? "#060912" : "#F8FAFF";
  const heroBg      = isDark ? "linear-gradient(180deg,#0A0E1A,#060912)" : "linear-gradient(180deg,#F5F8FF,#FFFFFF)";
  const textPrimary = isDark ? "#F1F5F9" : "#111827";
  const textMuted   = isDark ? "#64748B"  : "#9CA3AF";
  const chipBg      = isDark ? "rgba(37,99,235,0.15)" : "#EFF6FF";
  const chipBdr     = isDark ? "rgba(37,99,235,0.35)" : "#DBEAFE";
  const chipTxt     = isDark ? "#60A5FA" : "#2563EB";
  const dotBorder   = isDark ? "#2D3748" : "#E2E8F0";
  const dotEmpty    = isDark ? "#1E2433" : "#CBD5E1";

  const chapterData = CHAPTERS.map((ch) => {
    const vis   = VISUALS[ch.id as keyof typeof VISUALS];
    const stats = mounted && user
      ? getChapterStats(user, ch.id, ch.totalTopics)
      : { completed: 0, unlocked: 0, total: ch.totalTopics, percent: 0 };

    const topicStatuses: TopicStatus[] = Array.from({ length: ch.totalTopics }, (_, i) => {
      if (!mounted || !user) return "locked";
      const topicId = `${ch.id}.${i + 1}`;
      const progress = getUserProgress(user);
      const tp = progress.topicProgress[`${ch.id}:${topicId}`];
      if (tp?.passed)   return "done";
      if (tp?.unlocked) return "current";
      return "locked";
    });

    return { ch, vis, stats, topicStatuses };
  });

  return (
    <main style={{ minHeight: "100vh", background: bg, paddingTop: 68 }}>

      {/* ── Hero ── */}
      <div style={{ background: heroBg, padding: "64px 24px 52px", textAlign: "center" }}>
        <motion.div
          variants={heroVariants}
          initial={mounted ? "hidden" : false}
          animate="visible"
        >
          <motion.div variants={heroItem} style={{ display: "inline-block", marginBottom: 18 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "5px 14px", borderRadius: 999,
              background: chipBg, border: `1px solid ${chipBdr}`,
            }}>
              <BookOpen size={12} color="#3B82F6" />
              <span style={{ fontSize: "11px", fontWeight: 700, color: chipTxt, textTransform: "uppercase", letterSpacing: "0.09em" }}>
                Course Content
              </span>
            </div>
          </motion.div>

          <motion.h1 variants={heroItem}
            style={{ fontWeight: 900, color: textPrimary, fontSize: "2.5rem", letterSpacing: "-0.03em", marginBottom: 12 }}
          >
            5 Chapters · 41 Topics ·{" "}
            <span style={{ background: "linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              615+ MCQs
            </span>
          </motion.h1>

          <motion.p variants={heroItem} style={{ color: textMuted, fontSize: "15px", maxWidth: 500, margin: "0 auto" }}>
            Ek structured path jo tumhe zero se ethical hacker banata hai — computers ke andar se lekar Kali Linux tak.
          </motion.p>
        </motion.div>
      </div>

      {/* ── Chapter list ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px", position: "relative" }}>

        {/* Timeline line — draws downward on mount */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.3, ease: "easeInOut", delay: 0.25 }}
          style={{
            position: "absolute", left: 46, top: 52, bottom: 90, width: 3,
            background: isDark
              ? "linear-gradient(180deg,#2563EB,#7C3AED88)"
              : "linear-gradient(180deg,#2563EB,#2563EB55)",
            boxShadow: "0 0 10px rgba(37,99,235,0.45)",
            borderRadius: 2,
            transformOrigin: "top",
          }}
        />

        {chapterData.map(({ ch, vis, stats, topicStatuses }, i) => (
          <div key={ch.id} style={{ position: "relative", paddingLeft: 62, marginBottom: 18 }}>

            {/* Timeline dot — pops in with spring, pulses if in-progress */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.35 + i * 0.11 }}
              style={{ position: "absolute", left: 41, top: 34, zIndex: 1 }}
            >
              <div style={{
                width: 13, height: 13, borderRadius: "50%",
                background: stats.percent === 100 ? "#10B981" : stats.percent > 0 ? vis.accent : dotEmpty,
                border: `2px solid ${stats.percent > 0 ? vis.accent : dotBorder}`,
                boxShadow: stats.percent > 0 ? `0 0 12px ${vis.accent}70` : "none",
                transition: "background 0.3s, box-shadow 0.3s",
              }} />
              {/* Ping ring for actively in-progress chapters */}
              {stats.percent > 0 && stats.percent < 100 && (
                <motion.div
                  animate={{ scale: [1, 2.2], opacity: [0.55, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                  style={{
                    position: "absolute", inset: 0,
                    borderRadius: "50%", border: `1.5px solid ${vis.accent}`,
                    pointerEvents: "none",
                  }}
                />
              )}
            </motion.div>

            <ChapterCard
              ch={ch}
              vis={vis}
              stats={stats}
              topicStatuses={topicStatuses}
              isExpanded={expanded === ch.id}
              onToggle={() => setExpanded(prev => prev === ch.id ? null : ch.id)}
              isDark={isDark}
            />
          </div>
        ))}
      </div>
    </main>
  );
}

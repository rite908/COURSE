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

// ── Chapter visual config ─────────────────────────────────────────────────

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

// ── Small components ──────────────────────────────────────────────────────

function ProgressRing({ percent, accent, isDark }: { percent: number; accent: string; isDark: boolean }) {
  const size = 64, r = 26, circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  const trackColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const zeroColor  = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={32} cy={32} r={r} fill="none" stroke={trackColor} strokeWidth={4} />
        <circle
          cx={32} cy={32} r={r} fill="none"
          stroke={accent} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.9s ease" }}
        />
      </svg>
      <span style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "13px", fontWeight: 700,
        color: percent > 0 ? accent : zeroColor,
      }}>
        {percent}%
      </span>
    </div>
  );
}

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

function HexIcon({ accent, bg, Icon }: { accent: string; bg: string; Icon: React.ElementType }) {
  return (
    <div style={{
      width: 56, height: 56, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: bg,
      clipPath: "polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)",
    }}>
      <Icon size={22} color={accent} strokeWidth={1.8} />
    </div>
  );
}

function TopicRow({
  topicId, accent, mins, status, isDark,
}: {
  topicId: string; accent: string; mins: number; status: "done" | "current" | "locked"; isDark: boolean;
}) {
  const lockedColor = isDark ? "#475569" : "#9CA3AF";
  const doneColor   = isDark ? "#94A3B8"  : "#6B7280";
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "9px 14px", borderRadius: 8,
      background: status === "current" ? accent + "12" : "transparent",
      border: `1px solid ${status === "current" ? accent + "28" : "transparent"}`,
    }}>
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
    </div>
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
  const isStarted = stats.percent > 0;
  const durations = TOPIC_DURATIONS[ch.id] ?? Array(ch.totalTopics).fill(20);
  const cardBg     = isDark ? "#0D1117" : "#FFFFFF";
  const cardBorder = isDark ? "#1E2433" : "#E5E7EB";
  const metaColor  = isDark ? "#64748B" : "#9CA3AF";
  const titleColor = isDark ? "#F1F5F9" : "#111827";
  const descColor  = isDark ? "#64748B" : "#6B7280";
  const btnHoverBg = isDark ? "rgba(255,255,255,0.07)" : "#F3F4F6";
  const chevronCol = isDark ? "#64748B" : "#9CA3AF";

  return (
    <motion.div
      layout
      whileHover={{ y: -4, boxShadow: `0 8px 32px ${accent}22` }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        background: cardBg,
        border: `1px solid ${isExpanded ? accent + "40" : cardBorder}`,
        borderRadius: 16, overflow: "hidden",
        transition: "border-color 0.3s",
      }}
    >
      {/* Accent top stripe */}
      <div style={{ height: 2, background: `linear-gradient(90deg,${accent},${accent}44)` }} />

      {/* Card body */}
      <div style={{ padding: "22px 24px 20px", display: "flex", alignItems: "center", gap: 20 }}>
        {/* Hex icon */}
        <HexIcon accent={accent} bg={bg} Icon={Icon} />

        {/* Text content */}
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
              [BookOpen,    `${ch.totalTopics} Topics`],
              [HelpCircle,  `${mcqs} MCQs`],
              [Clock,       hours],
            ] as [React.ElementType, string][]).map(([MI, text]) => (
              <span key={text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "12px", color: metaColor }}>
                <MI size={11} />{text}
              </span>
            ))}
          </div>
        </div>

        {/* Right: progress + button + chevron */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <ProgressRing percent={stats.percent} accent={accent} isDark={isDark} />

          <Link href={`/chapter/${ch.id}`} style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ boxShadow: isStarted ? `0 0 18px ${accent}55` : undefined }}
              style={{
                padding: "9px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap",
                background: isStarted
                  ? "linear-gradient(135deg,#2563EB,#7C3AED)"
                  : btnHoverBg,
                color: isStarted ? "#FFFFFF" : titleColor,
              }}
            >
              {isStarted ? "Continue Learning →" : "Start Learning"}
            </motion.button>
          </Link>

          <button
            onClick={onToggle}
            aria-label="Toggle topics"
            style={{
              background: "none", border: "none", cursor: "pointer", padding: 4,
              color: chevronCol, display: "flex", alignItems: "center",
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          >
            <ChevronDown size={20} />
          </button>
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
            transition={{ duration: 0.28, ease: "easeInOut" }}
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

export default function ChaptersPage() {
  const { isDark } = useTheme();
  const [user,     setUser]     = useState<UserName | null>(null);
  const [mounted,  setMounted]  = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);
  }, []);

  const bg     = isDark ? "#060912" : "#F8FAFF";
  const heroBg = isDark ? "linear-gradient(180deg,#0A0E1A,#060912)" : "linear-gradient(180deg,#F5F8FF,#FFFFFF)";
  const textPrimary = isDark ? "#F1F5F9" : "#111827";
  const textMuted   = isDark ? "#64748B"  : "#9CA3AF";
  const chipBg  = isDark ? "rgba(37,99,235,0.15)" : "#EFF6FF";
  const chipBdr = isDark ? "rgba(37,99,235,0.35)" : "#DBEAFE";
  const chipTxt = isDark ? "#60A5FA" : "#2563EB";
  const dotBorder = isDark ? "#2D3748" : "#E2E8F0";
  const dotEmpty  = isDark ? "#1E2433" : "#CBD5E1";

  // Pre-compute per-chapter data
  const chapterData = CHAPTERS.map((ch) => {
    const vis = VISUALS[ch.id as keyof typeof VISUALS];
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

      {/* Hero */}
      <div style={{ background: heroBg, padding: "64px 24px 52px", textAlign: "center" }}>
        <motion.div
          initial={mounted ? { opacity: 0, y: -14 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "5px 14px", borderRadius: 999,
            background: chipBg, border: `1px solid ${chipBdr}`, marginBottom: 18,
          }}>
            <BookOpen size={12} color="#3B82F6" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: chipTxt, textTransform: "uppercase", letterSpacing: "0.09em" }}>
              Course Content
            </span>
          </div>

          <h1 style={{ fontWeight: 900, color: textPrimary, fontSize: "2.5rem", letterSpacing: "-0.03em", marginBottom: 12 }}>
            5 Chapters · 41 Topics ·{" "}
            <span style={{ background: "linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              615+ MCQs
            </span>
          </h1>
          <p style={{ color: textMuted, fontSize: "15px", maxWidth: 500, margin: "0 auto" }}>
            Ek structured path jo tumhe zero se ethical hacker banata hai — computers ke andar se lekar Kali Linux tak.
          </p>
        </motion.div>
      </div>

      {/* Chapter list */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px", position: "relative" }}>

        {/* Timeline line */}
        <div style={{
          position: "absolute", left: 47, top: 52, bottom: 90, width: 1,
          background: isDark ? "rgba(37,99,235,0.18)" : "rgba(37,99,235,0.12)",
          boxShadow: "0 0 6px rgba(37,99,235,0.25)",
        }} />

        {chapterData.map(({ ch, vis, stats, topicStatuses }, i) => (
          <div key={ch.id} style={{ position: "relative", paddingLeft: 62, marginBottom: 18 }}>

            {/* Timeline dot */}
            <div style={{
              position: "absolute", left: 41, top: 34,
              width: 13, height: 13, borderRadius: "50%", zIndex: 1,
              background: stats.percent === 100 ? "#10B981" : stats.percent > 0 ? vis.accent : dotEmpty,
              border: `2px solid ${stats.percent > 0 ? vis.accent : dotBorder}`,
              boxShadow: stats.percent > 0 ? `0 0 10px ${vis.accent}60` : "none",
              transition: "background 0.3s, box-shadow 0.3s",
            }} />

            <motion.div
              initial={mounted ? { opacity: 0, x: -16 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.38 }}
            >
              <ChapterCard
                ch={ch}
                vis={vis}
                stats={stats}
                topicStatuses={topicStatuses}
                isExpanded={expanded === ch.id}
                onToggle={() => setExpanded(prev => prev === ch.id ? null : ch.id)}
                isDark={isDark}
              />
            </motion.div>
          </div>
        ))}
      </div>
    </main>
  );
}

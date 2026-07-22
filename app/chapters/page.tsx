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
  "1": { accent: "#3B82F6", grad: "135deg,#2563EB,#4F46E5", glow: "59,130,246",   Icon: Shield,   difficulty: "Beginner", diffColor: "#10B981", hours: "2h 15m", mcqs: 90  },
  "2": { accent: "#06B6D4", grad: "135deg,#0EA5E9,#0284C7", glow: "6,182,212",    Icon: Cpu,      difficulty: "Easy",     diffColor: "#10B981", hours: "3h 45m", mcqs: 150 },
  "3": { accent: "#8B5CF6", grad: "135deg,#7C3AED,#C026D3", glow: "139,92,246",   Icon: Wifi,     difficulty: "Easy",     diffColor: "#10B981", hours: "3h 30m", mcqs: 150 },
  "4": { accent: "#10B981", grad: "135deg,#059669,#0D9488", glow: "16,185,129",   Icon: Terminal, difficulty: "Medium",   diffColor: "#F59E0B", hours: "3h 30m", mcqs: 45  },
  "5": { accent: "#F43F5E", grad: "135deg,#E11D48,#F97316", glow: "244,63,94",    Icon: Code2,    difficulty: "Hard",     diffColor: "#F43F5E", hours: "4h 30m", mcqs: 180 },
} as const;

const TOPIC_DURATIONS: Record<string, number[]> = {
  "1": [15, 20, 18, 22, 25, 20],
  "2": [25, 30, 28, 35, 32, 30],
  "3": [25, 30, 35, 28, 32, 30],
  "4": [20, 25, 22, 28, 25, 30],
  "5": [30, 35, 40, 38, 42, 40],
};

// ── ProgressRing ──────────────────────────────────────────────────────────

function ProgressRing({ percent, accent, grad, isDark }: {
  percent: number; accent: string; grad: string; isDark: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const size = 82, r = 34, circ = 2 * Math.PI * r;
  const gradId = `ring-${accent.replace("#", "")}`;

  useEffect(() => {
    if (percent === 0) { setDisplay(0); return; }
    const duration = 1200, start = Date.now();
    let raf: number;
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * percent));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [percent]);

  const [c1, c2] = grad.split(",").slice(1);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1?.trim() ?? accent} />
            <stop offset="100%" stopColor={c2?.trim() ?? accent} />
          </linearGradient>
        </defs>
        {/* Track ring */}
        <circle cx={41} cy={41} r={r} fill="none"
          stroke={isDark ? `rgba(255,255,255,0.07)` : `${accent}22`}
          strokeWidth={5.5}
        />
        {/* Progress arc */}
        <motion.circle
          cx={41} cy={41} r={r} fill="none"
          stroke={`url(#${gradId})`} strokeWidth={5.5} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (percent / 100) * circ }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.35 }}
          style={{ filter: percent > 0 ? `drop-shadow(0 0 5px ${accent}99)` : "none" }}
        />
      </svg>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}
      >
        <span style={{
          fontSize: "17px", fontWeight: 900, lineHeight: 1,
          color: percent > 0 ? accent : isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.20)",
        }}>
          {display}%
        </span>
        <span style={{
          fontSize: "8px", fontWeight: 700, letterSpacing: "0.10em", marginTop: 3,
          color: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)",
          textTransform: "uppercase",
        }}>
          done
        </span>
      </motion.div>
    </div>
  );
}

// ── DifficultyBadge ───────────────────────────────────────────────────────

function DifficultyBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: 999,
      color: "#fff",
      background: `linear-gradient(135deg,${color},${color}bb)`,
      boxShadow: `0 2px 10px ${color}55`,
      letterSpacing: "0.04em", textTransform: "uppercase" as const,
    }}>
      {label}
    </span>
  );
}

// ── ChapterIcon ───────────────────────────────────────────────────────────

function ChapterIcon({ accent, grad, Icon }: { accent: string; grad: string; Icon: React.ElementType }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, filter: `drop-shadow(0 0 18px ${accent}cc)` }}
      transition={{ type: "spring", stiffness: 340, damping: 20 }}
      style={{
        width: 72, height: 72, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(${grad})`,
        borderRadius: 22,
        boxShadow: `0 8px 28px ${accent}50, inset 0 1px 0 rgba(255,255,255,0.22)`,
      }}
    >
      <Icon size={32} color="#fff" strokeWidth={1.75} />
    </motion.div>
  );
}

// ── TopicRow ──────────────────────────────────────────────────────────────

function TopicRow({ topicId, accent, mins, status, isDark, index }: {
  topicId: string; accent: string; mins: number;
  status: "done" | "current" | "locked"; isDark: boolean; index: number;
}) {
  const lockedCol = isDark ? "#2D3A4A" : "#D1D9E0";
  const doneCol   = isDark ? "#64748B"  : "#94A3B8";

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.045 }}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px", borderRadius: 12,
        background: status === "current"
          ? `${accent}14`
          : status === "done"
          ? (isDark ? "rgba(16,185,129,0.07)" : "rgba(16,185,129,0.06)")
          : "transparent",
        border: `1px solid ${status === "current" ? accent + "2e" : status === "done" ? "#10B98128" : "transparent"}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {status === "done"    && <CheckCircle size={14} color="#10B981" />}
        {status === "current" && <Play size={14} color={accent} style={{ fill: accent }} />}
        {status === "locked"  && <Lock size={14} color={lockedCol} />}
        <span style={{
          fontSize: "13px", fontWeight: status === "current" ? 600 : 400,
          color: status === "locked" ? lockedCol : status === "current" ? accent : doneCol,
        }}>
          Topic {topicId}
        </span>
      </div>
      <span style={{
        fontSize: "11px", fontWeight: 600,
        color: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.22)",
        background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
        padding: "2px 9px", borderRadius: 6,
      }}>
        {mins}m
      </span>
    </motion.div>
  );
}

// ── ChapterCard ───────────────────────────────────────────────────────────

type TopicStatus = "done" | "current" | "locked";

function ChapterCard({ ch, vis, stats, topicStatuses, isExpanded, onToggle, isDark }: {
  ch: typeof CHAPTERS[0];
  vis: typeof VISUALS[keyof typeof VISUALS];
  stats: { completed: number; unlocked: number; total: number; percent: number };
  topicStatuses: TopicStatus[];
  isExpanded: boolean;
  onToggle: () => void;
  isDark: boolean;
}) {
  const { Icon, accent, grad, glow, difficulty, diffColor, hours, mcqs } = vis;
  const isStarted = stats.percent > 0;
  const durations = TOPIC_DURATIONS[ch.id] ?? Array(ch.totalTopics).fill(20);

  const cardBg     = isDark ? "rgba(10,14,28,0.88)" : "rgba(255,255,255,0.94)";
  const cardBorder = isDark ? `rgba(${glow},0.20)` : `rgba(${glow},0.16)`;
  const titleColor = isDark ? "#F1F5F9" : "#0F172A";
  const descColor  = isDark ? "#64748B"  : "#64748B";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{
        y: -7,
        boxShadow: isDark
          ? `0 28px 70px rgba(${glow},0.28), 0 8px 24px rgba(${glow},0.16)`
          : `0 28px 70px rgba(${glow},0.20), 0 8px 24px rgba(${glow},0.12)`,
      }}
      transition={{ type: "spring", stiffness: 250, damping: 28 }}
      style={{
        position: "relative",
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: 22,
        overflow: "hidden",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: isDark
          ? `inset 4px 0 0 ${accent}, 0 4px 28px rgba(${glow},0.12), inset 0 1px 0 rgba(255,255,255,0.05)`
          : `inset 4px 0 0 ${accent}, 0 4px 28px rgba(${glow},0.10), inset 0 1px 0 rgba(255,255,255,0.9)`,
      }}
    >
      {/* Ambient radial glow inside card */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: isDark
          ? `radial-gradient(ellipse 70% 90% at 96% 8%, rgba(${glow},0.11) 0%, transparent 65%)`
          : `radial-gradient(ellipse 70% 90% at 96% 8%, rgba(${glow},0.08) 0%, transparent 65%)`,
      }} />

      {/* Big watermark number */}
      <div style={{
        position: "absolute", right: -4, top: "50%", transform: "translateY(-52%)",
        fontSize: "130px", fontWeight: 900, letterSpacing: "-0.04em",
        lineHeight: 1, pointerEvents: "none", userSelect: "none",
        color: isDark ? `rgba(${glow},0.065)` : `rgba(${glow},0.055)`,
      }}>
        {String(ch.number).padStart(2, "0")}
      </div>

      {/* Top accent stripe */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, ease: "easeOut", delay: 0.12 }}
        style={{
          height: 3.5, transformOrigin: "left",
          background: `linear-gradient(90deg,${accent} 0%,${accent}99 60%,transparent 100%)`,
          boxShadow: `0 0 18px ${accent}70`,
        }}
      />

      {/* Card body */}
      <div style={{ position: "relative", padding: "26px 28px 24px", display: "flex", alignItems: "center", gap: 22 }}>
        <ChapterIcon accent={accent} grad={grad} Icon={Icon} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Chapter number + badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
            <span style={{
              fontSize: "12px", fontWeight: 800, letterSpacing: "0.07em",
              background: `linear-gradient(${grad})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              CH {String(ch.number).padStart(2, "0")}
            </span>
            <DifficultyBadge label={difficulty} color={diffColor} />
          </div>

          <h2 style={{
            fontWeight: 900, fontSize: "19px", color: titleColor,
            marginBottom: 7, letterSpacing: "-0.025em", lineHeight: 1.25,
          }}>
            {ch.title}
          </h2>
          <p style={{ fontSize: "13.5px", color: descColor, lineHeight: 1.65, marginBottom: 16 }}>
            {ch.description}
          </p>

          {/* Meta pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {([
              [BookOpen,   `${ch.totalTopics} Topics`, true],
              [HelpCircle, `${mcqs} MCQs`,             true],
              [Clock,      hours,                       false],
            ] as [React.ElementType, string, boolean][]).map(([MI, text, colored]) => (
              <span key={text} style={{
                display: "flex", alignItems: "center", gap: 5, fontSize: "12px",
                fontWeight: 600,
                color: colored ? accent : (isDark ? "#475569" : "#94A3B8"),
                background: colored
                  ? `rgba(${glow},0.12)`
                  : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"),
                padding: "4px 11px", borderRadius: 8,
                border: colored ? `1px solid rgba(${glow},0.20)` : "1px solid transparent",
              }}>
                <MI size={11} />{text}
              </span>
            ))}
          </div>
        </div>

        {/* Right column: ring + actions */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <ProgressRing percent={stats.percent} accent={accent} grad={grad} isDark={isDark} />

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href={`/chapter/${ch.id}`} style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: `0 8px 28px rgba(${glow},0.55)` }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 380, damping: 18 }}
                style={{
                  padding: "10px 20px", borderRadius: 13, border: "none", cursor: "pointer",
                  fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap",
                  background: `linear-gradient(${grad})`,
                  color: "#fff",
                  boxShadow: `0 4px 18px rgba(${glow},0.40)`,
                  letterSpacing: "-0.01em",
                }}
              >
                {isStarted ? "Continue →" : "Start →"}
              </motion.button>
            </Link>

            <motion.button
              onClick={onToggle}
              animate={{ rotate: isExpanded ? 180 : 0 }}
              whileHover={{
                background: isDark ? "rgba(255,255,255,0.09)" : `rgba(${glow},0.10)`,
                color: accent,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              aria-label="Toggle topics"
              style={{
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)"}`,
                borderRadius: 11, cursor: "pointer", padding: "9px",
                color: isDark ? "#64748B" : "#9CA3AF", display: "flex",
              }}
            >
              <ChevronDown size={18} />
            </motion.button>
          </div>
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
            transition={{ duration: 0.33, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
              padding: "16px 28px 24px",
              display: "flex", flexDirection: "column", gap: 4,
              position: "relative",
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

const heroV = { hidden: {}, visible: { transition: { staggerChildren: 0.13 } } };
const heroI = { hidden: { opacity: 0, y: -22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

export default function ChaptersPage() {
  const { isDark } = useTheme();
  const [user,     setUser]     = useState<UserName | null>(null);
  const [mounted,  setMounted]  = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { setUser(getCurrentUser()); setMounted(true); }, []);

  const pageBg  = isDark ? "#070B16" : "#EEF3FF";
  const heroBg  = isDark ? "#0C1020" : "#E6EEFF";
  const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
  const textMuted   = isDark ? "#475569"  : "#64748B";

  const statCardBg  = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)";
  const statCardBdr = isDark ? "rgba(255,255,255,0.08)" : "rgba(37,99,235,0.14)";

  const dotEmpty  = isDark ? "#1A2338" : "#DDE4EF";
  const dotBorder = isDark ? "#2A3650" : "#C8D3E8";

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
    <main style={{ minHeight: "100vh", background: pageBg, paddingTop: 68 }}>

      {/* ── Hero ── */}
      <div style={{ position: "relative", background: heroBg, padding: "76px 24px 64px", textAlign: "center", overflow: "hidden" }}>
        {/* Gradient orbs */}
        <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, background: "radial-gradient(ellipse,rgba(37,99,235,0.18) 0%,transparent 68%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 350, height: 350, background: "radial-gradient(ellipse,rgba(124,58,237,0.12) 0%,transparent 68%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "0%", left: "8%", width: 280, height: 280, background: "radial-gradient(ellipse,rgba(236,72,153,0.09) 0%,transparent 70%)", pointerEvents: "none" }} />

        <motion.div variants={heroV} initial={mounted ? "hidden" : false} animate="visible">
          {/* Pill badge */}
          <motion.div variants={heroI} style={{ display: "inline-block", marginBottom: 22 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 999,
              background: isDark ? "rgba(37,99,235,0.14)" : "rgba(37,99,235,0.09)",
              border: `1px solid ${isDark ? "rgba(37,99,235,0.32)" : "rgba(37,99,235,0.22)"}`,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#8B5CF6)", display: "inline-block" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: isDark ? "#60A5FA" : "#2563EB", textTransform: "uppercase", letterSpacing: "0.10em" }}>
                Course Curriculum
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={heroI} style={{
            fontWeight: 900, fontSize: "clamp(2.1rem,5vw,3.4rem)",
            letterSpacing: "-0.04em", lineHeight: 1.08, color: textPrimary, marginBottom: 18,
          }}>
            Master{" "}
            <span style={{ background: "linear-gradient(135deg,#2563EB 0%,#7C3AED 50%,#EC4899 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Ethical Hacking
            </span>
            <br />from Zero to Pro
          </motion.h1>

          <motion.p variants={heroI} style={{ color: textMuted, fontSize: "15px", maxWidth: 500, margin: "0 auto 44px", lineHeight: 1.7 }}>
            Ek structured path jo tumhe zero se ethical hacker banata hai — computers ke andar se lekar Kali Linux tak.
          </motion.p>

          {/* Stat cards */}
          <motion.div variants={heroI} style={{ display: "inline-flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            {([
              ["5",    "Chapters", "linear-gradient(135deg,#2563EB,#4F46E5)", "37,99,235"],
              ["41",   "Topics",   "linear-gradient(135deg,#7C3AED,#C026D3)", "124,58,237"],
              ["615+", "MCQs",     "linear-gradient(135deg,#E11D48,#F97316)", "225,29,72"],
            ] as [string, string, string, string][]).map(([num, label, grad, rgb]) => (
              <motion.div
                key={label}
                whileHover={{ y: -4, boxShadow: `0 16px 40px rgba(${rgb},0.25)` }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={{
                  padding: "20px 32px", borderRadius: 18, textAlign: "center",
                  background: statCardBg, border: `1px solid ${statCardBdr}`,
                  backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                  boxShadow: `0 4px 22px rgba(${rgb},0.12)`,
                  minWidth: 100,
                }}
              >
                <div style={{ fontSize: "2.2rem", fontWeight: 900, letterSpacing: "-0.04em", background: grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 }}>
                  {num}
                </div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: textMuted, letterSpacing: "0.09em", textTransform: "uppercase", marginTop: 6 }}>
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Skills tag cloud ── */}
          <motion.div variants={heroI} style={{ marginTop: 44 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 14,
              maxWidth: 560, margin: "0 auto 20px",
            }}>
              <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
              <span style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted, whiteSpace: "nowrap" }}>
                Skills You&apos;ll Master
              </span>
              <div style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9, justifyContent: "center", maxWidth: 620, margin: "0 auto" }}>
              {([
                ["Kali Linux",       "244,63,94"],
                ["Nmap",             "37,99,235"],
                ["Wireshark",        "124,58,237"],
                ["Bash Scripting",   "16,185,129"],
                ["TCP/IP",           "6,182,212"],
                ["OSINT",            "245,158,11"],
                ["Metasploit",       "244,63,94"],
                ["Ethical Hacking",  "37,99,235"],
                ["Network Security", "124,58,237"],
                ["Linux CLI",        "16,185,129"],
                ["Cryptography",     "245,158,11"],
                ["Reconnaissance",   "6,182,212"],
              ] as [string, string][]).map(([skill, rgb], i) => (
                <motion.span
                  key={skill}
                  initial={mounted ? { opacity: 0, scale: 0.75, y: 8 } : false}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.04, type: "spring", stiffness: 320, damping: 20 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  style={{
                    fontSize: "12px", fontWeight: 600, padding: "6px 15px", borderRadius: 999,
                    background: isDark ? `rgba(${rgb},0.12)` : `rgba(${rgb},0.09)`,
                    border: `1px solid rgba(${rgb},0.25)`,
                    color: isDark ? `rgba(${rgb},1)` : `rgb(${rgb})`,
                    cursor: "default",
                    boxShadow: `0 2px 10px rgba(${rgb},0.12)`,
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Chapter Journey strip ── */}
      <div style={{
        background: isDark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.7)",
        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(37,99,235,0.10)"}`,
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(37,99,235,0.10)"}`,
        backdropFilter: "blur(12px)",
        padding: "22px 24px",
        overflowX: "auto",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
          {([
            { num: "01", label: "Startup",      accent: "#3B82F6", rgb: "59,130,246",   Icon: Shield   },
            { num: "02", label: "How PC Works", accent: "#06B6D4", rgb: "6,182,212",    Icon: Cpu      },
            { num: "03", label: "Networking",   accent: "#8B5CF6", rgb: "139,92,246",   Icon: Wifi     },
            { num: "04", label: "Linux CLI",    accent: "#10B981", rgb: "16,185,129",   Icon: Terminal },
            { num: "05", label: "Kali Linux",   accent: "#F43F5E", rgb: "244,63,94",    Icon: Code2    },
          ] as { num: string; label: string; accent: string; rgb: string; Icon: React.ElementType }[]).map((c, i) => (
            <div key={c.num} style={{ display: "flex", alignItems: "center" }}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 300, damping: 22 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 80 }}
              >
                <motion.div
                  whileHover={{ scale: 1.15, boxShadow: `0 0 22px rgba(${c.rgb},0.55)` }}
                  transition={{ type: "spring", stiffness: 360, damping: 18 }}
                  style={{
                    width: 46, height: 46, borderRadius: 14,
                    background: `linear-gradient(135deg, ${c.accent}, ${c.accent}bb)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 4px 16px rgba(${c.rgb},0.32)`,
                    cursor: "default",
                  }}
                >
                  <c.Icon size={20} color="#fff" strokeWidth={1.75} />
                </motion.div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "9.5px", fontWeight: 800, letterSpacing: "0.10em", color: c.accent, textTransform: "uppercase" }}>
                    CH {c.num}
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: textMuted, marginTop: 1, whiteSpace: "nowrap" }}>
                    {c.label}
                  </div>
                </div>
              </motion.div>
              {i < 4 && (
                <div style={{ width: 48, height: 2, margin: "0 4px", marginBottom: 28,
                  background: `linear-gradient(90deg, ${c.accent}88, ${["#06B6D4","#8B5CF6","#10B981","#F43F5E"][i]}88)`,
                  flexShrink: 0,
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Chapter list ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 24px 110px", position: "relative" }}>

        {/* Rainbow timeline line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
          style={{
            position: "absolute", left: 51, top: 64, bottom: 110, width: 2,
            background: "linear-gradient(180deg,#3B82F6 0%,#8B5CF6 40%,#EC4899 75%,#F43F5E 100%)",
            opacity: isDark ? 0.55 : 0.45,
            transformOrigin: "top",
          }}
        />

        {chapterData.map(({ ch, vis, stats, topicStatuses }, i) => (
          <div key={ch.id} style={{ position: "relative", paddingLeft: 76, marginBottom: 22 }}>

            {/* Timeline dot */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.28 + i * 0.11 }}
              style={{ position: "absolute", left: 44, top: 40, zIndex: 2 }}
            >
              <div style={{
                width: 16, height: 16, borderRadius: "50%",
                background: stats.percent === 100
                  ? "linear-gradient(135deg,#10B981,#059669)"
                  : stats.percent > 0
                  ? `linear-gradient(${vis.grad})`
                  : dotEmpty,
                border: `2.5px solid ${stats.percent > 0 ? vis.accent : dotBorder}`,
                boxShadow: stats.percent > 0
                  ? `0 0 16px ${vis.accent}88, 0 0 0 5px ${vis.accent}18`
                  : "none",
              }} />
              {stats.percent > 0 && stats.percent < 100 && (
                <motion.div
                  animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                  style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1.5px solid ${vis.accent}`, pointerEvents: "none" }}
                />
              )}
            </motion.div>

            <ChapterCard
              ch={ch} vis={vis} stats={stats} topicStatuses={topicStatuses}
              isExpanded={expanded === ch.id}
              onToggle={() => setExpanded(p => p === ch.id ? null : ch.id)}
              isDark={isDark}
            />
          </div>
        ))}
      </div>
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
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

const CMDS = [
  { cmd: "nmap -sV 192.168.1.0/24",  out: "4 hosts up · 22,80,443 open",  col: "#10B981" },
  { cmd: "sqlmap -u target/login",    out: "Vuln found · MySQL 8.0 DB",    col: "#EF4444" },
  { cmd: "hashcat -m 0 hash.txt wl", out: "Speed: 1.4 GH/s · 34% done",   col: "#F59E0B" },
  { cmd: "tcpdump -i eth0 port 443", out: "TLS 1.3 · 1,024 packets",       col: "#06B6D4" },
  { cmd: "nikto -h 192.168.1.5",     out: "8 vulns · XSS  SQLi  LFI",      col: "#EF4444" },
] as const;

// ── CountUp ───────────────────────────────────────────────────────────────

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 1600, t0 = Date.now();
    let raf: number;
    const tick = () => {
      const p = Math.min((Date.now() - t0) / dur, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

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
        <circle cx={41} cy={41} r={r} fill="none"
          stroke={isDark ? `rgba(255,255,255,0.07)` : `${accent}22`}
          strokeWidth={5.5}
        />
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
    <motion.span
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{
        fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: 999,
        color: "#fff",
        background: `linear-gradient(135deg,${color},${color}bb)`,
        boxShadow: `0 2px 10px ${color}55`,
        letterSpacing: "0.04em", textTransform: "uppercase" as const,
        cursor: "default",
      }}
    >
      {label}
    </motion.span>
  );
}

// ── ChapterIcon ───────────────────────────────────────────────────────────

function ChapterIcon({ accent, grad, Icon }: { accent: string; grad: string; Icon: React.ElementType }) {
  return (
    <motion.div
      whileHover={{ scale: 1.12, rotate: 6, filter: `drop-shadow(0 0 20px ${accent}cc)` }}
      transition={{ type: "spring", stiffness: 340, damping: 18 }}
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
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.05 }}
      whileHover={{ x: 3 }}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px", borderRadius: 12,
        background: status === "current"
          ? `${accent}14`
          : status === "done"
          ? (isDark ? "rgba(16,185,129,0.07)" : "rgba(16,185,129,0.06)")
          : "transparent",
        border: `1px solid ${status === "current" ? accent + "2e" : status === "done" ? "#10B98128" : "transparent"}`,
        cursor: "default",
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
  const [hovered, setHovered] = useState(false);

  const cardBg     = isDark ? "rgba(10,14,28,0.88)" : "rgba(255,255,255,0.94)";
  const cardBorder = isDark ? `rgba(${glow},0.20)` : `rgba(${glow},0.16)`;
  const titleColor = isDark ? "#F1F5F9" : "#0F172A";
  const descColor  = isDark ? "#64748B"  : "#64748B";

  return (
    <motion.div
      layout
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        y: -8,
        boxShadow: isDark
          ? `0 32px 80px rgba(${glow},0.32), 0 8px 24px rgba(${glow},0.18)`
          : `0 32px 80px rgba(${glow},0.22), 0 8px 24px rgba(${glow},0.14)`,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
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
      {/* Ambient radial glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0.6 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: isDark
            ? `radial-gradient(ellipse 70% 90% at 96% 8%, rgba(${glow},0.13) 0%, transparent 65%)`
            : `radial-gradient(ellipse 70% 90% at 96% 8%, rgba(${glow},0.09) 0%, transparent 65%)`,
        }}
      />

      {/* Shimmer sweep on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="shimmer"
            initial={{ x: "-110%" }}
            animate={{ x: "210%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
            style={{
              position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
              background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.09) 50%,transparent 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Big watermark number */}
      <motion.div
        animate={{ opacity: hovered ? 0.1 : 0.065 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", right: -4, top: "50%", transform: "translateY(-52%)",
          fontSize: "130px", fontWeight: 900, letterSpacing: "-0.04em",
          lineHeight: 1, pointerEvents: "none", userSelect: "none",
          color: isDark ? `rgba(${glow},1)` : `rgba(${glow},1)`,
        }}
      >
        {String(ch.number).padStart(2, "0")}
      </motion.div>

      {/* Top accent stripe */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        style={{
          height: 3.5, transformOrigin: "left",
          background: `linear-gradient(90deg,${accent} 0%,${accent}99 60%,transparent 100%)`,
          boxShadow: `0 0 18px ${accent}70`,
        }}
      />

      {/* Card body */}
      <div style={{ position: "relative", zIndex: 2, padding: "26px 28px 24px", display: "flex", alignItems: "center", gap: 22 }}>
        <ChapterIcon accent={accent} grad={grad} Icon={Icon} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
            <motion.span
              animate={{ opacity: hovered ? 1 : 0.8 }}
              style={{
                fontSize: "12px", fontWeight: 800, letterSpacing: "0.07em",
                background: `linear-gradient(${grad})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}
            >
              CH {String(ch.number).padStart(2, "0")}
            </motion.span>
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
              <motion.span
                key={text}
                whileHover={{ scale: 1.06, y: -1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{
                  display: "flex", alignItems: "center", gap: 5, fontSize: "12px",
                  fontWeight: 600,
                  color: colored ? accent : (isDark ? "#475569" : "#94A3B8"),
                  background: colored
                    ? `rgba(${glow},0.12)`
                    : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"),
                  padding: "4px 11px", borderRadius: 8,
                  border: colored ? `1px solid rgba(${glow},0.20)` : "1px solid transparent",
                  cursor: "default",
                }}
              >
                <MI size={11} />{text}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Right: ring + actions */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, flexShrink: 0 }}>
          <ProgressRing percent={stats.percent} accent={accent} grad={grad} isDark={isDark} />

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href={`/chapter/${ch.id}`} style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.07, boxShadow: `0 10px 32px rgba(${glow},0.60)` }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
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
                scale: 1.08,
              }}
              whileTap={{ scale: 0.92 }}
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
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
              padding: "16px 28px 24px",
              display: "flex", flexDirection: "column", gap: 4,
              position: "relative", zIndex: 2,
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

// ── TerminalPanel ─────────────────────────────────────────────────────────

function TerminalPanel({ isDark, mounted, cmdIdx }: {
  isDark: boolean; mounted: boolean; cmdIdx: number;
}) {
  const cmd = CMDS[cmdIdx % CMDS.length];

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", zIndex: 3 }}
    >
      <motion.div
        initial={mounted ? { opacity: 0, x: -50, scale: 0.92 } : false}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.55, delay: 0.6, ease: "easeOut" }}
        style={{
          width: 250, pointerEvents: "none",
          borderRadius: 8,
          background: isDark ? "rgba(3,8,22,0.95)" : "rgba(255,255,255,0.97)",
          border: `1px solid ${isDark ? "rgba(16,185,129,0.38)" : "rgba(16,185,129,0.48)"}`,
          boxShadow: isDark
            ? "0 0 50px rgba(16,185,129,0.18), 0 16px 48px rgba(0,0,0,0.65)"
            : "0 8px 48px rgba(16,185,129,0.18), 0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Corner brackets */}
        {(["tl","tr","bl","br"] as const).map(c => (
          <div key={c} style={{
            position: "absolute",
            top: c[0]==="t" ? -1 : "auto", bottom: c[0]==="b" ? -1 : "auto",
            left: c[1]==="l" ? -1 : "auto", right: c[1]==="r" ? -1 : "auto",
            width: 11, height: 11,
            borderTop:    c[0]==="t" ? "2px solid #10B981" : "none",
            borderBottom: c[0]==="b" ? "2px solid #10B981" : "none",
            borderLeft:   c[1]==="l" ? "2px solid #10B981" : "none",
            borderRight:  c[1]==="r" ? "2px solid #10B981" : "none",
          }} />
        ))}

        {/* Title bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 7, padding: "8px 13px",
          background: isDark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.06)",
          borderBottom: `1px solid ${isDark ? "rgba(16,185,129,0.14)" : "rgba(16,185,129,0.16)"}`,
        }}>
          <div style={{ display: "flex", gap: 5 }}>
            {(["#EF4444","#F59E0B","#10B981"] as const).map(c => (
              <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
            ))}
          </div>
          <span style={{
            fontFamily: "monospace", fontSize: "10px", fontWeight: 800,
            letterSpacing: "0.12em", color: isDark ? "#34D399" : "#059669",
            textTransform: "uppercase", marginLeft: 4,
          }}>
            TWH Terminal
          </span>
          <motion.div
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ duration: 1.1, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", marginLeft: "auto",
              boxShadow: isDark ? "0 0 6px #10B981" : "none" }}
          />
        </div>

        {/* Body */}
        <div style={{ padding: "12px 13px 13px", fontFamily: "monospace" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={cmdIdx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.28 }}
            >
              {/* Prompt + command */}
              <div style={{ fontSize: "11px", marginBottom: 7, lineHeight: 1.5 }}>
                <span style={{ color: "#10B981" }}>root@kali</span>
                <span style={{ color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.28)" }}>:</span>
                <span style={{ color: "#F59E0B" }}>~# </span>
                <span style={{ color: isDark ? "#CBD5E1" : "#1E293B" }}>{cmd.cmd}</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.75, repeat: Infinity }}
                  style={{ color: "#10B981" }}
                >█</motion.span>
              </div>
              {/* Output */}
              <div style={{
                fontSize: "10.5px", color: cmd.col,
                paddingLeft: 8, borderLeft: `2px solid ${cmd.col}55`,
                lineHeight: 1.5,
              }}>
                {cmd.out}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Animated scan line */}
          <div style={{ marginTop: 10, height: 2, background: isDark ? "rgba(16,185,129,0.10)" : "rgba(16,185,129,0.13)", borderRadius: 999, overflow: "hidden" }}>
            <motion.div
              animate={{ x: ["-100%", "220%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.3 }}
              style={{ height: "100%", width: "40%", background: "linear-gradient(90deg,transparent,#10B981,transparent)" }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── CoursePathPanel ───────────────────────────────────────────────────────

function CoursePathPanel({ isDark, mounted }: { isDark: boolean; mounted: boolean }) {
  const SHORT = ["Startup", "How PC Works", "Networking", "Linux CLI", "Kali Linux"];

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", zIndex: 3 }}
    >
      <motion.div
        initial={mounted ? { opacity: 0, x: 50, scale: 0.92 } : false}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.55, delay: 0.75, ease: "easeOut" }}
        style={{
          width: 224, pointerEvents: "none",
          borderRadius: 8,
          background: isDark ? "rgba(4,4,22,0.95)" : "rgba(255,255,255,0.97)",
          border: `1px solid ${isDark ? "rgba(124,58,237,0.38)" : "rgba(124,58,237,0.44)"}`,
          boxShadow: isDark
            ? "0 0 50px rgba(124,58,237,0.18), 0 16px 48px rgba(0,0,0,0.65)"
            : "0 8px 48px rgba(124,58,237,0.15), 0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Corner brackets */}
        {(["tl","tr","bl","br"] as const).map(c => (
          <div key={c} style={{
            position: "absolute",
            top: c[0]==="t" ? -1 : "auto", bottom: c[0]==="b" ? -1 : "auto",
            left: c[1]==="l" ? -1 : "auto", right: c[1]==="r" ? -1 : "auto",
            width: 11, height: 11,
            borderTop:    c[0]==="t" ? "2px solid #7C3AED" : "none",
            borderBottom: c[0]==="b" ? "2px solid #7C3AED" : "none",
            borderLeft:   c[1]==="l" ? "2px solid #7C3AED" : "none",
            borderRight:  c[1]==="r" ? "2px solid #7C3AED" : "none",
          }} />
        ))}

        {/* Title bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 13px",
          background: isDark ? "rgba(124,58,237,0.08)" : "rgba(124,58,237,0.05)",
          borderBottom: `1px solid ${isDark ? "rgba(124,58,237,0.14)" : "rgba(124,58,237,0.16)"}`,
        }}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ width: 8, height: 8, borderRadius: 2, background: "linear-gradient(135deg,#7C3AED,#EC4899)", flexShrink: 0 }}
          />
          <span style={{
            fontFamily: "monospace", fontSize: "10px", fontWeight: 800,
            letterSpacing: "0.12em", color: isDark ? "#C4B5FD" : "#5B21B6",
            textTransform: "uppercase",
          }}>
            Course Path
          </span>
          <span style={{
            marginLeft: "auto", fontFamily: "monospace", fontSize: "9px",
            color: isDark ? "rgba(124,58,237,0.5)" : "rgba(91,33,182,0.5)", fontWeight: 700,
          }}>5 CH</span>
        </div>

        {/* Chapters list */}
        <div style={{ padding: "11px 13px 12px", position: "relative" }}>
          {/* Connector line */}
          <div style={{
            position: "absolute", left: 19, top: 18, bottom: 42, width: 1,
            background: isDark
              ? "linear-gradient(180deg,rgba(124,58,237,0.50) 0%,rgba(124,58,237,0.05) 100%)"
              : "linear-gradient(180deg,rgba(124,58,237,0.24) 0%,rgba(124,58,237,0.03) 100%)",
          }} />

          {CHAPTERS.map(({ id, number }, i) => {
            const vis = VISUALS[id as keyof typeof VISUALS];
            return (
              <motion.div
                key={id}
                initial={mounted ? { opacity: 0, x: 10 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.85 + i * 0.1, duration: 0.25 }}
                style={{
                  display: "flex", alignItems: "center", gap: 9,
                  marginBottom: i < 4 ? 11 : 0, position: "relative",
                }}
              >
                {/* Icon dot */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  style={{
                    width: 15, height: 15, borderRadius: "50%", flexShrink: 0, zIndex: 1,
                    background: `linear-gradient(${vis.grad})`,
                    boxShadow: isDark ? `0 0 9px ${vis.accent}65` : `0 2px 6px ${vis.accent}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <vis.Icon size={7} color="#fff" strokeWidth={2.5} />
                </motion.div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                    <span style={{
                      fontSize: "9px", fontFamily: "monospace", fontWeight: 700,
                      color: isDark ? `${vis.accent}99` : `${vis.accent}cc`,
                      letterSpacing: "0.04em",
                    }}>
                      CH.{String(number).padStart(2,"0")}
                    </span>
                    <span style={{
                      fontSize: "11px", fontWeight: 600,
                      color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.72)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {SHORT[i]}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Footer */}
          <div style={{
            marginTop: 11, paddingTop: 9,
            borderTop: `1px solid ${isDark ? "rgba(124,58,237,0.12)" : "rgba(124,58,237,0.12)"}`,
            display: "flex", justifyContent: "space-between",
            fontSize: "9px", fontFamily: "monospace",
          }}>
            <span style={{ color: isDark ? "rgba(124,58,237,0.45)" : "rgba(91,33,182,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Total
            </span>
            <span style={{ color: "#10B981", fontWeight: 800 }}>17h 30m</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

const heroV = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const heroI = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: "easeOut" } } };

export default function ChaptersPage() {
  const { isDark } = useTheme();
  const [user,     setUser]     = useState<UserName | null>(null);
  const [mounted,  setMounted]  = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [vw,       setVw]       = useState(1280);
  const [cmdIdx,   setCmdIdx]   = useState(0);

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);
    const upd = () => setVw(window.innerWidth);
    upd();
    window.addEventListener("resize", upd, { passive: true });
    return () => window.removeEventListener("resize", upd);
  }, []);

  // Cycle terminal commands
  useEffect(() => {
    const id = setInterval(() => setCmdIdx(p => p + 1), 2800);
    return () => clearInterval(id);
  }, []);

  const pageBg      = isDark ? "#070B16" : "#EEF3FF";
  const heroBg      = isDark ? "#0C1020" : "#E6EEFF";
  const textPrimary = isDark ? "#F1F5F9" : "#0F172A";
  const textMuted   = isDark ? "#475569"  : "#64748B";
  const statCardBg  = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)";
  const statCardBdr = isDark ? "rgba(255,255,255,0.08)" : "rgba(37,99,235,0.14)";

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
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      style={{ minHeight: "100vh", background: pageBg, paddingTop: 68 }}
    >
      {/* ── Hero ── */}
      <div style={{ position: "relative", background: heroBg, padding: "72px 24px 60px", textAlign: "center", overflow: "hidden" }}>

        {/* Animated dot grid */}
        <svg aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: isDark ? 0.18 : 0.22 }}>
          <defs>
            <pattern id="dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill={isDark ? "#3B82F6" : "#2563EB"} />
            </pattern>
            <radialGradient id="dot-fade" cx="50%" cy="50%" r="55%">
              <stop offset="0%"   stopColor="white" stopOpacity="0" />
              <stop offset="60%"  stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </radialGradient>
            <mask id="dot-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect width="100%" height="100%" fill="url(#dot-fade)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" mask="url(#dot-mask)" />
        </svg>

        {/* Floating animated orbs */}
        <motion.div
          animate={{ y: [0, -28, 0], x: [0, 12, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, background: "radial-gradient(ellipse,rgba(37,99,235,0.20) 0%,transparent 68%)", pointerEvents: "none" }}
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -15, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          style={{ position: "absolute", top: "10%", right: "5%", width: 350, height: 350, background: "radial-gradient(ellipse,rgba(124,58,237,0.14) 0%,transparent 68%)", pointerEvents: "none" }}
        />
        <motion.div
          animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{ position: "absolute", bottom: "0%", left: "8%", width: 280, height: 280, background: "radial-gradient(ellipse,rgba(236,72,153,0.11) 0%,transparent 70%)", pointerEvents: "none" }}
        />

        {/* Side panels */}
        {vw >= 1140 && <TerminalPanel isDark={isDark} mounted={mounted} cmdIdx={cmdIdx} />}
        {vw >= 1140 && <CoursePathPanel isDark={isDark} mounted={mounted} />}

        {/* Hero content */}
        <motion.div variants={heroV} initial={mounted ? "hidden" : false} animate="visible">

          {/* Pill badge */}
          <motion.div variants={heroI} style={{ display: "inline-block", marginBottom: 22 }}>
            <motion.div
              animate={{ boxShadow: ["0 0 0px rgba(37,99,235,0)", "0 0 18px rgba(37,99,235,0.25)", "0 0 0px rgba(37,99,235,0)"] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 999,
                background: isDark ? "rgba(37,99,235,0.14)" : "rgba(37,99,235,0.09)",
                border: `1px solid ${isDark ? "rgba(37,99,235,0.32)" : "rgba(37,99,235,0.22)"}`,
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                style={{ width: 7, height: 7, borderRadius: "50%", background: "linear-gradient(135deg,#3B82F6,#8B5CF6)", display: "inline-block" }}
              />
              <span style={{ fontSize: "11px", fontWeight: 700, color: isDark ? "#60A5FA" : "#2563EB", textTransform: "uppercase", letterSpacing: "0.10em" }}>
                Course Curriculum
              </span>
            </motion.div>
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

          {/* Stat cards with CountUp */}
          <motion.div variants={heroI} style={{ display: "inline-flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            {([
              [5,    "",  "Chapters", "linear-gradient(135deg,#2563EB,#4F46E5)", "37,99,235"],
              [41,   "",  "Topics",   "linear-gradient(135deg,#7C3AED,#C026D3)", "124,58,237"],
              [615,  "+", "MCQs",     "linear-gradient(135deg,#E11D48,#F97316)", "225,29,72"],
            ] as [number, string, string, string, string][]).map(([num, suf, label, grad, rgb]) => (
              <motion.div
                key={label}
                whileHover={{ y: -6, scale: 1.04, boxShadow: `0 20px 48px rgba(${rgb},0.28)` }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                style={{
                  padding: "20px 32px", borderRadius: 18, textAlign: "center",
                  background: statCardBg, border: `1px solid ${statCardBdr}`,
                  backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                  boxShadow: `0 4px 22px rgba(${rgb},0.12)`,
                  minWidth: 100, cursor: "default",
                }}
              >
                <div style={{ fontSize: "2.2rem", fontWeight: 900, letterSpacing: "-0.04em", background: grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1 }}>
                  <CountUp target={num} suffix={suf} />
                </div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: textMuted, letterSpacing: "0.09em", textTransform: "uppercase", marginTop: 6 }}>
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Skills tag cloud */}
          <motion.div variants={heroI} style={{ marginTop: 44 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, maxWidth: 560, margin: "0 auto 20px" }}>
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
                style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", transformOrigin: "right" }}
              />
              <span style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: textMuted, whiteSpace: "nowrap" }}>
                Skills You&apos;ll Master
              </span>
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
                style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", transformOrigin: "left" }}
              />
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
                  initial={mounted ? { opacity: 0, scale: 0.7, y: 10 } : false}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.04, type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.1, y: -3, boxShadow: `0 6px 20px rgba(${rgb},0.30)` }}
                  whileTap={{ scale: 0.95 }}
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

      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ maxWidth: 860, margin: "0 auto", padding: "52px 24px 0" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(37,99,235,0.12)", transformOrigin: "right" }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <motion.div
              animate={{ opacity: [1, 0.25, 1], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg,#2563EB,#7C3AED)" }}
            />
            <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.35)" : "rgba(37,99,235,0.55)", whiteSpace: "nowrap" }}>
              Choose Your Chapter
            </span>
            <motion.div
              animate={{ opacity: [1, 0.25, 1], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#EC4899)" }}
            />
          </div>
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            style={{ flex: 1, height: 1, background: isDark ? "rgba(255,255,255,0.07)" : "rgba(37,99,235,0.12)", transformOrigin: "left" }}
          />
        </div>
      </motion.div>

      {/* ── Chapter list ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 110px" }}>
        {chapterData.map(({ ch, vis, stats, topicStatuses }, i) => (
          <motion.div
            key={ch.id}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.07 }}
            style={{ marginBottom: 20 }}
          >
            <ChapterCard
              ch={ch} vis={vis} stats={stats} topicStatuses={topicStatuses}
              isExpanded={expanded === ch.id}
              onToggle={() => setExpanded(p => p === ch.id ? null : ch.id)}
              isDark={isDark}
            />
          </motion.div>
        ))}
      </div>
    </motion.main>
  );
}

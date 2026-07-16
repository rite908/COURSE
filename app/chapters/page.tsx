"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lock, CheckCircle, Clock, BookOpen, HelpCircle, BarChart2 } from "lucide-react";
import { CHAPTERS } from "@/lib/chapters";
import { getCurrentUser, getChapterStats, type UserName } from "@/lib/storage";
import { useTheme } from "@/lib/theme";

const VISUALS: Record<string, {
  accent: string; darkBg: string; lightBg: string; tag: string;
  difficulty: string; diffColor: string; diffDarkBg: string; diffLightBg: string;
  hours: string; illustration: React.ReactNode;
}> = {
  "1": {
    accent: "#2563EB", darkBg: "rgba(37,99,235,0.15)",  lightBg: "#EEF3FF",
    tag: "Startup",    difficulty: "Beginner", diffColor: "#059669", diffDarkBg: "rgba(5,150,105,0.15)", diffLightBg: "#ECFDF5",
    hours: "2–3h",
    illustration: (
      <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="32" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.3"/>
        <circle cx="40" cy="40" r="22" fill="#EEF3FF" stroke="#2563EB" strokeWidth="1.5" opacity="0.5"/>
        <path d="M40 28 L44 36 L52 37 L46 43 L48 51 L40 47 L32 51 L34 43 L28 37 L36 36 Z" fill="#2563EB" opacity="0.8"/>
        <circle cx="40" cy="16" r="3" fill="#2563EB" opacity="0.5"/><circle cx="64" cy="40" r="3" fill="#2563EB" opacity="0.5"/>
      </svg>
    ),
  },
  "2": {
    accent: "#0EA5E9", darkBg: "rgba(14,165,233,0.15)", lightBg: "#F0F9FF",
    tag: "Computer",   difficulty: "Beginner", diffColor: "#059669", diffDarkBg: "rgba(5,150,105,0.15)", diffLightBg: "#ECFDF5",
    hours: "3–4h",
    illustration: (
      <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
        <rect x="12" y="22" width="56" height="38" rx="4" fill="#F0F9FF" stroke="#0EA5E9" strokeWidth="1.5" opacity="0.7"/>
        <rect x="12" y="22" width="56" height="10" rx="4" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="1.5" opacity="0.5"/>
        <rect x="20" y="30" width="8" height="6" rx="1" fill="#0EA5E9" opacity="0.5"/>
        <rect x="36" y="30" width="8" height="6" rx="1" fill="#0EA5E9" opacity="0.5"/>
        <rect x="20" y="42" width="18" height="10" rx="2" fill="#0EA5E9" opacity="0.3"/>
        <path d="M40 60 L40 68" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  "3": {
    accent: "#7C3AED", darkBg: "rgba(124,58,237,0.15)", lightBg: "#F3EEFF",
    tag: "Networking", difficulty: "Intermediate", diffColor: "#D97706", diffDarkBg: "rgba(217,119,6,0.15)", diffLightBg: "#FFFBEB",
    hours: "4–5h",
    illustration: (
      <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="5" fill="#7C3AED" opacity="0.9"/>
        {([[20,20],[60,20],[20,60],[60,60],[40,14]] as [number,number][]).map(([cx,cy],i) => (
          <g key={i}><circle cx={cx} cy={cy} r="4" fill="#7C3AED" opacity={0.4+i*0.1}/><line x1="40" y1="40" x2={cx} y2={cy} stroke="#7C3AED" strokeWidth="1" opacity="0.25"/></g>
        ))}
        <circle cx="40" cy="40" r="16" stroke="#7C3AED" strokeWidth="1" strokeDasharray="3 3" opacity="0.3"/>
      </svg>
    ),
  },
  "4": {
    accent: "#059669", darkBg: "rgba(5,150,105,0.15)",  lightBg: "#ECFDF5",
    tag: "Linux CLI",  difficulty: "Intermediate", diffColor: "#D97706", diffDarkBg: "rgba(217,119,6,0.15)", diffLightBg: "#FFFBEB",
    hours: "4–5h",
    illustration: (
      <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
        <rect x="10" y="16" width="60" height="48" rx="5" fill="#ECFDF5" stroke="#059669" strokeWidth="1.5" opacity="0.7"/>
        <rect x="10" y="16" width="60" height="12" rx="5" fill="#D1FAE5" stroke="#059669" strokeWidth="1.5" opacity="0.5"/>
        <circle cx="22" cy="22" r="3" fill="#EF4444" opacity="0.7"/>
        <circle cx="32" cy="22" r="3" fill="#FBBF24" opacity="0.7"/>
        <circle cx="42" cy="22" r="3" fill="#10B981" opacity="0.7"/>
        <text x="18" y="40" fontFamily="monospace" fontSize="9" fill="#059669" opacity="0.9">$ sudo ls -la</text>
        <text x="18" y="52" fontFamily="monospace" fontSize="8" fill="#059669" opacity="0.6">drwxr-xr-x  root</text>
      </svg>
    ),
  },
  "5": {
    accent: "#DC2626", darkBg: "rgba(220,38,38,0.15)",  lightBg: "#FEF2F2",
    tag: "Kali Linux", difficulty: "Advanced", diffColor: "#DC2626", diffDarkBg: "rgba(220,38,38,0.15)", diffLightBg: "#FEF2F2",
    hours: "5–6h",
    illustration: (
      <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="28" stroke="#DC2626" strokeWidth="1" opacity="0.15"/>
        <circle cx="40" cy="40" r="4"  fill="#DC2626" opacity="0.9"/>
        <path d="M40 40 L40 14" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" opacity="0.8">
          <animateTransform attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="3s" repeatCount="indefinite"/>
        </path>
        <circle cx="28" cy="24" r="3" fill="#DC2626" opacity="0.5"/>
        <circle cx="55" cy="35" r="2.5" fill="#DC2626" opacity="0.7"/>
      </svg>
    ),
  },
};

export default function ChaptersPage() {
  const { isDark } = useTheme();
  const [user,    setUser]    = useState<UserName | null>(null);
  const [mounted, setMounted] = useState(false);
  const [vw,      setVw]      = useState(1280);

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);
    const u = () => setVw(window.innerWidth);
    u(); window.addEventListener("resize", u, { passive: true });
    return () => window.removeEventListener("resize", u);
  }, []);

  const isMd = vw >= 768;
  const isLg = vw >= 1024;
  const sp = vw < 640 ? 16 : vw < 768 ? 24 : vw < 1024 ? 40 : 64;
  const vp = isMd ? 80 : 52;

  const T = {
    bg:      isDark ? "#060912"  : "#F8FAFF",
    bg2:     isDark ? "#0D1117"  : "#FFFFFF",
    text:    isDark ? "#F1F5F9"  : "#111827",
    text2:   isDark ? "#94A3B8"  : "#6B7280",
    muted:   isDark ? "#64748B"  : "#9CA3AF",
    border:  isDark ? "#1E2433"  : "#E5E7EB",
    card:    isDark ? "#0D1117"  : "#FFFFFF",
    chipBg:  isDark ? "rgba(37,99,235,0.15)" : "#EFF6FF",
    chipBdr: isDark ? "rgba(37,99,235,0.35)" : "#DBEAFE",
    chipTxt: isDark ? "#60A5FA"  : "#2563EB",
    heroBg:  isDark ? "linear-gradient(180deg,#0A0E1A,#060912)" : "linear-gradient(180deg,#F5F8FF,#FFFFFF)",
  };

  return (
    <main style={{ minHeight: "100vh", background: T.bg, paddingTop: 68 }}>

      {/* Hero */}
      <div style={{ background: T.heroBg, padding: `${vp}px ${sp}px ${vp * 0.7}px` }}>
        <motion.div
          initial={mounted ? { opacity: 0, y: -16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center" }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 999, background: T.chipBg, border: `1px solid ${T.chipBdr}`, marginBottom: 18 }}>
            <BookOpen size={12} color="#3B82F6" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: T.chipTxt, textTransform: "uppercase", letterSpacing: "0.09em" }}>Choose Your Path</span>
          </div>
          <h1 style={{ fontWeight: 900, color: T.text, fontSize: isLg ? "2.8rem" : isMd ? "2.3rem" : "1.9rem", letterSpacing: "-0.03em", marginBottom: 14 }}>
            All <span style={{ background: "linear-gradient(130deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Chapters</span>
          </h1>
          <p style={{ color: T.muted, fontSize: "15px", maxWidth: 440, margin: "0 auto" }}>
            Structured path from zero to ethical hacking expert. Each chapter unlocks the next.
          </p>
        </motion.div>
      </div>

      {/* Chapter grid */}
      <div style={{ padding: `0 ${sp}px ${vp}px` }}>
        <div style={{ display: "grid", gridTemplateColumns: isLg ? "repeat(2,1fr)" : "1fr", gap: 16 }}>
          {CHAPTERS.map((ch, i) => {
            const vis = VISUALS[ch.id];
            const stats = mounted && user
              ? getChapterStats(user, ch.id, ch.totalTopics)
              : { completed: 0, unlocked: 0, total: ch.totalTopics, percent: 0 };
            const isLocked    = mounted && user ? stats.unlocked === 0 : false;
            const isCompleted = mounted && user ? stats.completed === ch.totalTopics : false;

            return (
              <motion.div key={ch.id}
                initial={mounted ? { opacity: 0, y: 24 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
              >
                <Link href={isLocked ? "#" : `/chapter/${ch.id}`} style={{ textDecoration: "none" }}>
                  <motion.div
                    whileHover={!isLocked ? { y: -6, boxShadow: `0 16px 48px ${vis.accent}20` } : {}}
                    transition={{ type: "spring", stiffness: 280, damping: 28 }}
                    style={{
                      position: "relative", background: T.card, borderRadius: 20,
                      border: `1px solid ${isCompleted ? "#10B981" + "50" : T.border}`,
                      overflow: "hidden",
                      boxShadow: `0 2px 16px rgba(0,0,0,${isDark ? 0.25 : 0.05})`,
                      opacity: isLocked ? 0.55 : 1,
                      cursor: isLocked ? "not-allowed" : "pointer",
                      transition: "border-color 0.25s",
                    }}
                  >
                    {/* Accent top bar */}
                    <div style={{ height: 3, background: isCompleted ? "linear-gradient(90deg,#10B981,#34D399)" : `linear-gradient(90deg,${vis.accent},${vis.accent}66)` }} />

                    <div style={{ padding: isMd ? "24px 28px" : "20px 20px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: isMd ? 20 : 16 }}>
                        {/* Illustration */}
                        <div style={{
                          flexShrink: 0, width: 76, height: 76, borderRadius: 18,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: isDark ? vis.darkBg : vis.lightBg,
                        }}>
                          {isLocked ? <Lock size={26} color={T.muted} /> : vis.illustration}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{
                              fontSize: "11px", fontWeight: 700, padding: "2px 11px", borderRadius: 999,
                              color: vis.accent, background: isDark ? vis.darkBg : vis.lightBg,
                            }}>
                              CH {String(ch.number).padStart(2,"0")} · {vis.tag}
                            </span>
                            {isCompleted && (
                              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "11px", fontWeight: 700, color: "#059669", background: isDark ? "rgba(5,150,105,0.15)" : "#ECFDF5", padding: "2px 11px", borderRadius: 999 }}>
                                <CheckCircle size={10} />Complete
                              </span>
                            )}
                            {isLocked && (
                              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "11px", fontWeight: 700, color: T.muted, background: isDark ? "rgba(255,255,255,0.06)" : "#F1F5F9", padding: "2px 11px", borderRadius: 999 }}>
                                <Lock size={10} />Locked
                              </span>
                            )}
                          </div>

                          <h2 style={{ fontWeight: 800, color: T.text, fontSize: isMd ? "17px" : "15px", marginBottom: 6, letterSpacing: "-0.01em" }}>{ch.title}</h2>
                          <p style={{ color: T.text2, fontSize: "13.5px", lineHeight: 1.65, marginBottom: 14 }}>{ch.description}</p>

                          {/* Meta row */}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: mounted && user && !isLocked ? 14 : 0 }}>
                            {[
                              { icon: <BookOpen size={11} color={T.muted} />,   text: `${ch.totalTopics} Topics`            },
                              { icon: <HelpCircle size={11} color={T.muted} />, text: `~${ch.totalTopics * 15} MCQs`         },
                              { icon: <Clock size={11} color={T.muted} />,      text: vis.hours                              },
                              { icon: <BarChart2 size={11} color={vis.diffColor}/>, text: vis.difficulty, color: vis.diffColor },
                            ].map(({ icon, text, color }) => (
                              <span key={text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "12px", color: color || T.muted }}>
                                {icon}{text}
                              </span>
                            ))}
                          </div>

                          {/* Progress */}
                          {mounted && user && !isLocked && (
                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontSize: "11.5px", color: T.muted }}>{stats.completed}/{ch.totalTopics} topics</span>
                                <span style={{ fontSize: "11.5px", fontWeight: 700, color: isCompleted ? "#059669" : vis.accent }}>{stats.percent}%</span>
                              </div>
                              <div style={{ height: 5, background: isDark ? "rgba(255,255,255,0.08)" : "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                                <motion.div
                                  initial={{ width: 0 }} animate={{ width: `${stats.percent}%` }}
                                  transition={{ duration: 1, delay: 0.3 + i * 0.08, ease: "easeOut" }}
                                  style={{ height: "100%", borderRadius: 99, background: isCompleted ? "#10B981" : vis.accent }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Arrow */}
                        {!isLocked && (
                          <ArrowRight size={16} color={T.muted} style={{ flexShrink: 0, alignSelf: "center" }} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

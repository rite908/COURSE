"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Lock, ChevronRight, X, BookOpen, Zap } from "lucide-react";
import type { TopicMeta } from "@/lib/chapters";
import { useTheme } from "@/lib/theme";

interface Props {
  topics: TopicMeta[];
  currentTopicId: string;
  unlockedTopics: Set<string>;
  passedTopics: Set<string>;
  accentColor: string;
  chapterTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topicId: string) => void;
}

export default function TopicSidebar({
  topics, currentTopicId, unlockedTopics, passedTopics,
  accentColor, chapterTitle, isOpen, onClose, onSelectTopic,
}: Props) {
  const { isDark } = useTheme();
  const passed  = passedTopics.size;
  const total   = topics.length;
  const percent = total > 0 ? Math.round((passed / total) * 100) : 0;

  // Derive a lighter tint of the accent for backgrounds
  const accentRgb = hexToRgb(accentColor);
  const accentBg  = accentRgb ? `rgba(${accentRgb},0.10)` : `${accentColor}18`;
  const accentBg2 = accentRgb ? `rgba(${accentRgb},0.06)` : `${accentColor}0f`;

  const T = {
    sidebar:  isDark ? "#0D1117" : "#FFFFFF",
    border:   isDark ? "#1E2433" : "#F1F5F9",
    header:   isDark ? "#0A0E1A" : "#FAFBFF",
    text:     isDark ? "#F1F5F9" : "#0F172A",
    muted:    isDark ? "#475569" : "#94A3B8",
    rowHover: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)",
    lockText: isDark ? "#2D3748" : "#CBD5E1",
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 30 }}
            className="lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed left-0 top-0 bottom-0 w-72 z-40 lg:sticky lg:top-20 lg:translate-x-0 lg:h-[calc(100vh-5rem)] flex flex-col"
        style={{ willChange: "transform" }}
      >
        <div style={{
          background: T.sidebar,
          borderRight: `1px solid ${T.border}`,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: isDark
            ? `4px 0 24px rgba(0,0,0,0.35), inset -1px 0 0 ${T.border}`
            : "4px 0 20px rgba(0,0,0,0.06)",
        }}>

          {/* ── Header ── */}
          <div style={{
            padding: "16px 18px 14px",
            borderBottom: `1px solid ${T.border}`,
            background: T.header,
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: accentBg,
                  border: `1px solid ${accentColor}33`,
                }}>
                  <BookOpen size={13} style={{ color: accentColor }} />
                </div>
                <span style={{
                  fontSize: "13px", fontWeight: 700, color: T.text,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {chapterTitle}
                </span>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden"
                style={{
                  padding: 6, borderRadius: 8, border: "none", background: "transparent",
                  cursor: "pointer", color: T.muted, flexShrink: 0,
                  display: "flex", alignItems: "center",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.rowHover; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* ── Progress bar ── */}
          <div style={{
            padding: "12px 18px",
            borderBottom: `1px solid ${T.border}`,
            flexShrink: 0,
            background: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.012)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Zap size={10} style={{ color: accentColor }} />
                <span style={{ fontSize: "10px", fontWeight: 700, color: T.muted, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                  Progress
                </span>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 800, color: accentColor }}>
                {passed}/{total}
              </span>
            </div>

            {/* Track */}
            <div style={{
              height: 5, borderRadius: 99,
              background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
              overflow: "hidden",
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                style={{
                  height: "100%", borderRadius: 99,
                  background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)`,
                  boxShadow: isDark ? `0 0 8px ${accentColor}88` : "none",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              <span style={{ fontSize: "10px", color: T.muted }}>
                {percent === 100 ? "🎉 Complete!" : `${percent}% done`}
              </span>
              <span style={{ fontSize: "10px", color: T.muted }}>
                {total - passed} left
              </span>
            </div>
          </div>

          {/* ── Topic list ── */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {topics.map((topic, idx) => {
              const isUnlocked = unlockedTopics.has(topic.id);
              const isPassed   = passedTopics.has(topic.id);
              const isCurrent  = topic.id === currentTopicId;
              const isLocked   = !isUnlocked;

              return (
                <motion.button
                  key={topic.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, delay: 0.05 + idx * 0.055, ease: "easeOut" }}
                  whileHover={!isLocked ? { x: 2 } : {}}
                  onClick={() => { if (!isLocked) { onSelectTopic(topic.id); onClose(); } }}
                  disabled={isLocked}
                  style={{
                    width: "100%", textAlign: "left",
                    padding: "11px 16px 11px 14px",
                    display: "flex", alignItems: "center", gap: 10,
                    position: "relative",
                    cursor: isLocked ? "not-allowed" : "pointer",
                    border: "none", outline: "none",
                    background: isCurrent
                      ? accentBg
                      : "transparent",
                    opacity: isLocked ? 0.45 : 1,
                    transition: "background 0.15s",
                    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`,
                  }}
                  onMouseEnter={e => {
                    if (!isLocked && !isCurrent) (e.currentTarget as HTMLElement).style.background = T.rowHover;
                  }}
                  onMouseLeave={e => {
                    if (!isLocked && !isCurrent) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {/* Active glow bar */}
                  {isCurrent && (
                    <motion.div
                      layoutId="sidebar-active-bar"
                      style={{
                        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                        background: `linear-gradient(180deg, ${accentColor}, ${accentColor}99)`,
                        borderRadius: "0 3px 3px 0",
                        boxShadow: isDark ? `0 0 10px ${accentColor}88` : "none",
                      }}
                    />
                  )}

                  {/* Status icon */}
                  <div style={{ flexShrink: 0, width: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isPassed ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      >
                        <CheckCircle size={15} color="#10B981" />
                      </motion.div>
                    ) : isLocked ? (
                      <Lock size={13} color={T.lockText} />
                    ) : isCurrent ? (
                      <motion.div
                        animate={{ scale: [1, 1.25, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                          width: 13, height: 13, borderRadius: "50%",
                          background: accentColor,
                          boxShadow: `0 0 0 3px ${accentBg2}, 0 0 8px ${accentColor}66`,
                        }}
                      />
                    ) : (
                      <div style={{
                        width: 13, height: 13, borderRadius: "50%",
                        border: `2px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)"}`,
                      }} />
                    )}
                  </div>

                  {/* Topic info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{
                        fontSize: "9.5px", fontWeight: 800, fontFamily: "monospace",
                        letterSpacing: "0.06em",
                        color: isCurrent ? accentColor
                             : isPassed  ? "#10B981"
                             : isLocked  ? T.lockText
                             : isDark    ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.30)",
                      }}>
                        {topic.id}
                      </span>
                      {isPassed && (
                        <span style={{
                          fontSize: "8px", fontWeight: 700, padding: "1px 6px",
                          borderRadius: 4, letterSpacing: "0.05em",
                          background: "rgba(16,185,129,0.12)",
                          color: "#10B981",
                          border: "1px solid rgba(16,185,129,0.22)",
                        }}>
                          DONE
                        </span>
                      )}
                      {isCurrent && !isPassed && (
                        <motion.span
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 1.6, repeat: Infinity }}
                          style={{
                            fontSize: "8px", fontWeight: 700, padding: "1px 6px",
                            borderRadius: 4, letterSpacing: "0.05em",
                            background: accentBg,
                            color: accentColor,
                            border: `1px solid ${accentColor}33`,
                          }}
                        >
                          NOW
                        </motion.span>
                      )}
                    </div>
                    <p style={{
                      fontSize: "12px", lineHeight: 1.4,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      fontWeight: isCurrent ? 600 : 400,
                      color: isCurrent  ? T.text
                           : isPassed   ? (isDark ? "#64748B" : "#94A3B8")
                           : isLocked   ? T.lockText
                           : (isDark    ? "#64748B" : "#64748B"),
                    }}>
                      {topic.title}
                    </p>
                  </div>

                  {isCurrent && (
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ChevronRight size={13} style={{ color: accentColor, flexShrink: 0 }} />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}

            {/* Bottom padding */}
            <div style={{ height: 20 }} />
          </div>
        </div>
      </motion.aside>
    </>
  );
}

/** Convert #RRGGBB to "R,G,B" string for rgba() usage */
function hexToRgb(hex: string): string | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return null;
  return `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}`;
}

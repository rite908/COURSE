"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Menu, Clock, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, AlignLeft, Hash } from "lucide-react";
import type { ChapterMeta, TopicMeta } from "@/lib/chapters";
import { extractTopicsFromMarkdown, extractTopicContent } from "@/lib/chapters";
import { parseMCQSets, extractTheoryContent, extractTaskContent } from "@/lib/mcq-parser";
import {
  getUserProgress, saveMCQResult, toggleBookmark, setCurrentLocation,
  addTimeSpent, isTopicUnlocked, type UserName,
} from "@/lib/storage";
import { estimateReadingTime, countWords } from "@/lib/utils";
import TopicSidebar from "./TopicSidebar";
import MCQSection from "./MCQSection";
import VideoSection from "./VideoSection";
import NotesPanel from "./NotesPanel";
import ReadingProgress from "./ReadingProgress";
import { useTheme } from "@/lib/theme";

interface Props { chapter: ChapterMeta; user: UserName }

const CH_ACCENTS: Record<string, string> = {
  "1": "#2563EB", "2": "#0EA5E9", "3": "#7C3AED", "4": "#059669", "5": "#DC2626",
};

export default function ChapterViewer({ chapter, user }: Props) {
  const { isDark } = useTheme();
  const [content,     setContent]     = useState("");
  const [loading,     setLoading]     = useState(true);
  const [topics,      setTopics]      = useState<TopicMeta[]>([]);
  const [currentId,   setCurrentId]   = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mcqSets,     setMcqSets]     = useState<Record<string, import("@/lib/mcq-parser").MCQuestion[]>>({});
  const [refreshKey,  setRefreshKey]  = useState(0);
  const [bookmarked,  setBookmarked]  = useState(false);
  const timeRef = useRef<number>(Date.now());

  const accent = CH_ACCENTS[chapter.id] || "#2563EB";

  const T = {
    bg:       isDark ? "#060912"  : "#FFFFFF",
    bg2:      isDark ? "#0D1117"  : "#FAFBFF",
    text:     isDark ? "#F1F5F9"  : "#111827",
    text2:    isDark ? "#94A3B8"  : "#6B7280",
    muted:    isDark ? "#64748B"  : "#9CA3AF",
    border:   isDark ? "#1E2433"  : "#F1F5F9",
    border2:  isDark ? "#2D3748"  : "#E5E7EB",
    stickyBg: isDark ? "rgba(6,9,18,0.97)"   : "rgba(255,255,255,0.97)",
    btnBg:    isDark ? "#1A2030"  : "#F1F5F9",
    btnHover: isDark ? "#252D42"  : "#E5E7EB",
    taskBg:   isDark ? "#0D1117"  : "#FAFBFF",
  };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/chapter/${chapter.id}`)
      .then((r) => r.json())
      .then((data) => {
        const md = data.content as string;
        setContent(md);
        const extracted = extractTopicsFromMarkdown(md, chapter.id);
        setTopics(extracted);
        setMcqSets(parseMCQSets(md));
        const progress = getUserProgress(user);
        const saved = progress.currentChapter === chapter.id ? progress.currentTopic : null;
        let start = extracted[0]?.id || "";
        if (saved && extracted.find((t) => t.id === saved)) {
          const tp = progress.topicProgress[`${chapter.id}:${saved}`];
          if (tp?.unlocked) start = saved;
        }
        setCurrentId(start);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [chapter.id, user]);

  useEffect(() => {
    timeRef.current = Date.now();
    return () => {
      const elapsed = Math.round((Date.now() - timeRef.current) / 1000);
      if (elapsed > 5) addTimeSpent(user, elapsed);
    };
  }, [currentId, user]);

  useEffect(() => {
    if (!currentId) return;
    const progress = getUserProgress(user);
    setBookmarked(progress.bookmarks.includes(`${chapter.id}:${currentId}`));
    setCurrentLocation(user, chapter.id, currentId);
  }, [currentId, user, chapter.id, refreshKey]);

  const getUnlocked = useCallback((): Set<string> => {
    const progress = getUserProgress(user);
    return new Set(topics.filter((t) => progress.topicProgress[`${chapter.id}:${t.id}`]?.unlocked).map((t) => t.id));
  }, [user, chapter.id, topics, refreshKey]);

  const getPassed = useCallback((): Set<string> => {
    const progress = getUserProgress(user);
    return new Set(topics.filter((t) => progress.topicProgress[`${chapter.id}:${t.id}`]?.passed).map((t) => t.id));
  }, [user, chapter.id, topics, refreshKey]);

  const handleMCQComplete = useCallback(
    (score: number, total: number, passed: boolean) => {
      const idx = topics.findIndex((t) => t.id === currentId);
      const nextId = idx + 1 < topics.length ? topics[idx + 1].id : null;
      const nextCh = nextId ? chapter.id : null;
      saveMCQResult(user, chapter.id, currentId, score, total, nextId, nextCh);
      setRefreshKey((k) => k + 1);
    },
    [user, chapter.id, currentId, topics]
  );

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handlePrev = () => {
    const idx = topics.findIndex((t) => t.id === currentId);
    if (idx > 0) { setCurrentId(topics[idx - 1].id); scrollToTop(); }
  };

  const handleNext = () => {
    const idx = topics.findIndex((t) => t.id === currentId);
    if (idx + 1 < topics.length && isTopicUnlocked(user, chapter.id, topics[idx + 1].id)) {
      setCurrentId(topics[idx + 1].id); scrollToTop();
    }
  };

  if (loading) return <ChapterSkeleton isDark={isDark} />;

  const currentTopic   = topics.find((t) => t.id === currentId);
  const topicMd        = extractTopicContent(content, currentId);
  const theoryMd       = extractTheoryContent(topicMd, currentId);
  const taskMd         = extractTaskContent(topicMd, currentId);
  const mcqQuestions   = mcqSets[currentId] || [];
  const unlockedTopics = getUnlocked();
  const passedTopics   = getPassed();
  const currentIdx     = topics.findIndex((t) => t.id === currentId);
  const hasPrev        = currentIdx > 0;
  const hasNext        = currentIdx + 1 < topics.length;
  const isNextUnlocked = hasNext && unlockedTopics.has(topics[currentIdx + 1]?.id);
  const progress       = getUserProgress(user);
  const tp             = progress.topicProgress[`${chapter.id}:${currentId}`];
  const alreadyPassed  = tp?.passed ?? false;
  const previousScore  = tp?.mcqScore ?? null;
  const readTime       = estimateReadingTime(theoryMd);
  const wordCount      = countWords(theoryMd);

  return (
    <>
      <ReadingProgress color={accent} />

      <div style={{ display: "flex", minHeight: "100vh", background: T.bg }}>
        {/* Sidebar */}
        <TopicSidebar
          topics={topics} currentTopicId={currentId}
          unlockedTopics={unlockedTopics} passedTopics={passedTopics}
          accentColor={accent} chapterTitle={chapter.title}
          isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
          onSelectTopic={(id) => { setCurrentId(id); scrollToTop(); }}
        />

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Sticky topic bar */}
          <div style={{
            position: "sticky", top: 68, zIndex: 20,
            background: T.stickyBg,
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            borderBottom: `1px solid ${T.border}`,
            padding: "10px 16px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              style={{ padding: 7, borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: T.muted, display: "flex", alignItems: "center", transition: "background 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.btnBg; (e.currentTarget as HTMLElement).style.color = T.text; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = T.muted; }}
            >
              <AlignLeft size={16} />
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "12px", fontWeight: 700, fontFamily: "monospace", flexShrink: 0, color: accent }}>{currentId}</span>
                <span style={{ fontSize: "13.5px", fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentTopic?.title}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "12px", color: T.muted }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={11} /> {readTime} min</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Hash size={11} /> {wordCount.toLocaleString()}</span>
              </div>
              <button
                onClick={() => { const isNow = toggleBookmark(user, chapter.id, currentId); setBookmarked(isNow); }}
                style={{ padding: 7, borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: bookmarked ? accent : T.muted, display: "flex", alignItems: "center", transition: "color 0.2s" }}
              >
                {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              </button>
            </div>
          </div>

          {/* Content area */}
          <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 60px" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentId}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.22 }}
              >
                {/* Topic heading */}
                <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, fontSize: "11px", fontWeight: 700, marginBottom: 16, color: accent, background: `${accent}12` }}>
                    Topic {currentId}
                  </div>
                  <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: T.text, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 12 }}>
                    {currentTopic?.title}
                  </h1>
                  <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: "13px", color: T.muted }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Clock size={13} /> {readTime} min read</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Hash size={13} /> {wordCount.toLocaleString()} words</span>
                  </div>
                </div>

                {/* Theory content */}
                <div
                  className="prose-magazine"
                  style={{
                    "--chapter-accent": accent,
                    color: T.text2,
                  } as React.CSSProperties}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{theoryMd}</ReactMarkdown>
                </div>

                {/* MCQ */}
                {mcqQuestions.length > 0 && (
                  <div style={{ marginTop: 48 }}>
                    <SectionDivider label="Knowledge Check" accent={accent} isDark={isDark} T={T} />
                    <MCQSection
                      questions={mcqQuestions} topicId={currentId} chapterId={chapter.id}
                      alreadyPassed={alreadyPassed} previousScore={previousScore}
                      accentColor={accent} onComplete={handleMCQComplete}
                    />
                  </div>
                )}

                {/* Task */}
                {taskMd && (
                  <div style={{ marginTop: 40 }}>
                    <SectionDivider label="Hands-On Task" accent={accent} isDark={isDark} T={T} />
                    <div
                      className="prose-magazine"
                      style={{ "--chapter-accent": accent, background: T.taskBg, borderRadius: 20, padding: "24px", border: `1px solid ${T.border}`, color: T.text2 } as React.CSSProperties}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{taskMd}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Video */}
                <div style={{ marginTop: 40 }}>
                  <SectionDivider label="Video Lesson" accent={accent} isDark={isDark} T={T} />
                  <VideoSection topicTitle={currentTopic?.title || ""} accentColor={accent} />
                </div>

                {/* Notes */}
                <div style={{ marginTop: 32 }}>
                  <NotesPanel user={user} chapterId={chapter.id} topicId={currentId} accentColor={accent} />
                </div>

                {/* Navigation */}
                <div style={{ marginTop: 48, paddingTop: 28, borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <motion.button
                    whileHover={hasPrev ? { x: -3 } : {}} whileTap={hasPrev ? { scale: 0.97 } : {}}
                    onClick={handlePrev} disabled={!hasPrev}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, border: "none", cursor: hasPrev ? "pointer" : "not-allowed",
                      fontSize: "13.5px", fontWeight: 600,
                      background: hasPrev ? T.btnBg : "transparent",
                      color: hasPrev ? T.text2 : T.muted,
                      opacity: hasPrev ? 1 : 0.35,
                      outline: `1px solid ${T.border2}`,
                    }}
                  >
                    <ChevronLeft size={15} /> Previous
                  </motion.button>

                  <span style={{ fontSize: "12px", color: T.muted, fontFamily: "monospace" }}>
                    {currentIdx + 1}/{topics.length}
                  </span>

                  <motion.button
                    whileHover={isNextUnlocked ? { x: 3 } : {}} whileTap={isNextUnlocked ? { scale: 0.97 } : {}}
                    onClick={handleNext} disabled={!hasNext}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, border: "none", cursor: hasNext ? "pointer" : "not-allowed",
                      fontSize: "13.5px", fontWeight: 700,
                      background: isNextUnlocked ? accent : (!hasNext ? "transparent" : T.btnBg),
                      color: isNextUnlocked ? "white" : (!hasNext ? T.muted : T.text2),
                      opacity: !hasNext ? 0.35 : 1,
                      outline: isNextUnlocked ? "none" : `1px solid ${T.border2}`,
                      boxShadow: isNextUnlocked ? `0 4px 16px ${accent}44` : "none",
                    }}
                  >
                    {!hasNext ? "Chapter Complete! 🎉" : isNextUnlocked ? "Next Topic" : "🔒 Locked"}
                    {hasNext && <ChevronRight size={15} />}
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}

function SectionDivider({ label, accent, isDark, T }: { label: string; accent: string; isDark: boolean; T: Record<string,string> }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ flex: 1, height: 1, background: T.border }} />
      <span style={{ fontSize: "11px", fontWeight: 700, padding: "4px 14px", borderRadius: 999, color: accent, background: `${accent}12`, whiteSpace: "nowrap" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  );
}

function ChapterSkeleton({ isDark }: { isDark: boolean }) {
  const bg     = isDark ? "#060912" : "#FFFFFF";
  const sidebarBg = isDark ? "#0D1117" : "#FFFFFF";
  const skelBg = isDark ? "#1E2433" : "#F1F5F9";
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: bg }}>
      <div style={{ width: 280, flexShrink: 0, borderRight: `1px solid ${isDark ? "#1E2433" : "#F1F5F9"}`, background: sidebarBg, padding: 16, display: "none" }} className="lg:block">
        {Array.from({ length: 6 }).map((_,i) => (
          <div key={i} style={{ height: 48, background: skelBg, borderRadius: 12, marginBottom: 8, animation: "pulse 1.5s infinite" }} />
        ))}
      </div>
      <div style={{ flex: 1, padding: "40px 24px", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ height: 32, width: "55%", background: skelBg, borderRadius: 10, marginBottom: 16, animation: "pulse 1.5s infinite" }} />
        <div style={{ height: 16, background: skelBg, borderRadius: 8, marginBottom: 12, animation: "pulse 1.5s infinite" }} />
        <div style={{ height: 16, width: "85%", background: skelBg, borderRadius: 8, marginBottom: 12, animation: "pulse 1.5s infinite" }} />
        <div style={{ height: 140, background: skelBg, borderRadius: 16, marginTop: 24, animation: "pulse 1.5s infinite" }} />
      </div>
    </div>
  );
}

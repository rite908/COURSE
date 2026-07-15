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

interface Props { chapter: ChapterMeta; user: UserName }

const CH_ACCENTS: Record<string, string> = {
  "1": "#2563EB", "2": "#0EA5E9", "3": "#7C3AED", "4": "#059669", "5": "#DC2626",
};

export default function ChapterViewer({ chapter, user }: Props) {
  const [content,      setContent]      = useState("");
  const [loading,      setLoading]      = useState(true);
  const [topics,       setTopics]       = useState<TopicMeta[]>([]);
  const [currentId,    setCurrentId]    = useState("");
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [mcqSets,      setMcqSets]      = useState<Record<string, import("@/lib/mcq-parser").MCQuestion[]>>({});
  const [refreshKey,   setRefreshKey]   = useState(0);
  const [bookmarked,   setBookmarked]   = useState(false);
  const timeRef = useRef<number>(Date.now());

  const accent = CH_ACCENTS[chapter.id] || "#2563EB";

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
      const nextId  = idx + 1 < topics.length ? topics[idx + 1].id : null;
      const nextCh  = nextId ? chapter.id : null;
      saveMCQResult(user, chapter.id, currentId, score, total, nextId, nextCh);
      setRefreshKey((k) => k + 1);
    },
    [user, chapter.id, currentId, topics]
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  if (loading) return <ChapterSkeleton />;

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

      <div className="flex min-h-screen pt-16 bg-white">
        {/* Sidebar */}
        <TopicSidebar
          topics={topics} currentTopicId={currentId}
          unlockedTopics={unlockedTopics} passedTopics={passedTopics}
          accentColor={accent} chapterTitle={chapter.title}
          isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
          onSelectTopic={(id) => { setCurrentId(id); scrollToTop(); }}
        />

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Sticky topic bar */}
          <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all"
            >
              <AlignLeft size={16} />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold font-mono shrink-0"
                  style={{ color: accent }}
                >
                  {currentId}
                </span>
                <span className="text-sm font-semibold text-gray-800 truncate">
                  {currentTopic?.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden sm:flex items-center gap-3 text-xs text-gray-300">
                <span className="flex items-center gap-1.5">
                  <Clock size={11} /> {readTime} min
                </span>
                <span className="flex items-center gap-1.5">
                  <Hash size={11} /> {wordCount.toLocaleString()} words
                </span>
              </div>
              <button
                onClick={() => {
                  const isNow = toggleBookmark(user, chapter.id, currentId);
                  setBookmarked(isNow);
                }}
                className={`p-1.5 rounded-lg transition-all ${bookmarked ? "" : "text-gray-300 hover:text-gray-500"}`}
                style={bookmarked ? { color: accent } : {}}
              >
                {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.22 }}
              >
                {/* Topic heading */}
                <div className="mb-8 pb-6 border-b border-gray-100">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
                    style={{ color: accent, background: `${accent}10` }}
                  >
                    Topic {currentId}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight" style={{ letterSpacing: "-0.02em" }}>
                    {currentTopic?.title}
                  </h1>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} /> {readTime} min read
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Hash size={13} /> {wordCount.toLocaleString()} words
                    </span>
                  </div>
                </div>

                {/* Theory content */}
                <div
                  className="prose-magazine"
                  style={{ "--chapter-accent": accent } as React.CSSProperties}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {theoryMd}
                  </ReactMarkdown>
                </div>

                {/* MCQ Section */}
                {mcqQuestions.length > 0 && (
                  <div className="mt-12">
                    <SectionDivider label="Knowledge Check" accent={accent} />
                    <MCQSection
                      questions={mcqQuestions} topicId={currentId} chapterId={chapter.id}
                      alreadyPassed={alreadyPassed} previousScore={previousScore}
                      accentColor={accent} onComplete={handleMCQComplete}
                    />
                  </div>
                )}

                {/* Task */}
                {taskMd && (
                  <div className="mt-10">
                    <SectionDivider label="Hands-On Task" accent={accent} />
                    <div
                      className="prose-magazine bg-[#FAFBFF] rounded-2xl p-6 border border-gray-100"
                      style={{ "--chapter-accent": accent } as React.CSSProperties}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{taskMd}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Video */}
                <div className="mt-10">
                  <SectionDivider label="Video Lesson" accent={accent} />
                  <VideoSection topicTitle={currentTopic?.title || ""} accentColor={accent} />
                </div>

                {/* Notes */}
                <div className="mt-8">
                  <NotesPanel user={user} chapterId={chapter.id} topicId={currentId} accentColor={accent} />
                </div>

                {/* Navigation */}
                <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between gap-4">
                  <motion.button
                    whileHover={hasPrev ? { x: -3 } : {}}
                    whileTap={hasPrev ? { scale: 0.97 } : {}}
                    onClick={handlePrev}
                    disabled={!hasPrev}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      hasPrev
                        ? "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                        : "opacity-30 cursor-not-allowed bg-gray-50 border border-gray-100 text-gray-300"
                    }`}
                  >
                    <ChevronLeft size={15} /> Previous
                  </motion.button>

                  <span className="text-xs text-gray-300 font-mono">
                    {currentIdx + 1}/{topics.length}
                  </span>

                  <motion.button
                    whileHover={isNextUnlocked ? { x: 3 } : {}}
                    whileTap={isNextUnlocked ? { scale: 0.97 } : {}}
                    onClick={handleNext}
                    disabled={!hasNext}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isNextUnlocked
                        ? "text-white"
                        : !hasNext
                        ? "opacity-30 cursor-not-allowed bg-gray-50 border border-gray-100 text-gray-300"
                        : "bg-gray-50 border border-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    style={isNextUnlocked ? { background: accent, boxShadow: `0 4px 16px ${accent}30` } : {}}
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

function SectionDivider({ label, accent }: { label: string; accent: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex-1 h-px bg-gray-100" />
      <span
        className="text-xs font-bold px-3 py-1 rounded-full"
        style={{ color: accent, background: `${accent}10` }}
      >
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function ChapterSkeleton() {
  return (
    <div className="flex min-h-screen pt-16 bg-white">
      <div className="w-72 hidden lg:block">
        <div className="border-r border-gray-100 h-full p-4 space-y-3 bg-white">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 skeleton rounded-xl" />
          ))}
        </div>
      </div>
      <div className="flex-1 max-w-3xl mx-auto px-6 py-10 space-y-5">
        <div className="h-8 skeleton rounded-xl w-2/3" />
        <div className="h-4 skeleton rounded-lg w-full" />
        <div className="h-4 skeleton rounded-lg w-5/6" />
        <div className="h-4 skeleton rounded-lg w-full" />
        <div className="h-36 skeleton rounded-2xl" />
      </div>
    </div>
  );
}

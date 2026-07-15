"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Menu, Clock, Hash, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, AlignLeft
} from "lucide-react";
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

interface Props {
  chapter: ChapterMeta;
  user: UserName;
}

export default function ChapterViewer({ chapter, user }: Props) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState<TopicMeta[]>([]);
  const [currentTopicId, setCurrentTopicId] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mcqSets, setMcqSets] = useState<Record<string, import("@/lib/mcq-parser").MCQuestion[]>>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const timeRef = useRef<number>(Date.now());
  const contentRef = useRef<HTMLDivElement>(null);

  // Load chapter content
  useEffect(() => {
    setLoading(true);
    fetch(`/api/chapter/${chapter.id}`)
      .then((r) => r.json())
      .then((data) => {
        const md = data.content as string;
        setContent(md);
        const extracted = extractTopicsFromMarkdown(md, chapter.id);
        setTopics(extracted);
        const sets = parseMCQSets(md);
        setMcqSets(sets);

        // Set first unlocked topic as current
        const progress = getUserProgress(user);
        const saved = progress.currentChapter === chapter.id ? progress.currentTopic : null;
        let startTopic = extracted[0]?.id || "";
        if (saved && extracted.find((t) => t.id === saved)) {
          const tp = progress.topicProgress[`${chapter.id}:${saved}`];
          if (tp?.unlocked) startTopic = saved;
        }
        setCurrentTopicId(startTopic);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [chapter.id, user]);

  // Track time spent
  useEffect(() => {
    timeRef.current = Date.now();
    return () => {
      const elapsed = Math.round((Date.now() - timeRef.current) / 1000);
      if (elapsed > 5) addTimeSpent(user, elapsed);
    };
  }, [currentTopicId, user]);

  // Sync bookmark state
  useEffect(() => {
    if (!currentTopicId) return;
    const progress = getUserProgress(user);
    setBookmarked(progress.bookmarks.includes(`${chapter.id}:${currentTopicId}`));
    setCurrentLocation(user, chapter.id, currentTopicId);
  }, [currentTopicId, user, chapter.id, refreshKey]);

  const getUnlockedTopics = useCallback((): Set<string> => {
    const progress = getUserProgress(user);
    const set = new Set<string>();
    topics.forEach((t) => {
      if (progress.topicProgress[`${chapter.id}:${t.id}`]?.unlocked) set.add(t.id);
    });
    return set;
  }, [user, chapter.id, topics, refreshKey]);

  const getPassedTopics = useCallback((): Set<string> => {
    const progress = getUserProgress(user);
    const set = new Set<string>();
    topics.forEach((t) => {
      if (progress.topicProgress[`${chapter.id}:${t.id}`]?.passed) set.add(t.id);
    });
    return set;
  }, [user, chapter.id, topics, refreshKey]);

  const handleMCQComplete = useCallback(
    (score: number, total: number, passed: boolean) => {
      const currentIdx = topics.findIndex((t) => t.id === currentTopicId);
      let nextTopicId: string | null = null;
      let nextChapterId: string | null = null;

      if (currentIdx + 1 < topics.length) {
        nextTopicId = topics[currentIdx + 1].id;
        nextChapterId = chapter.id;
      }

      saveMCQResult(user, chapter.id, currentTopicId, score, total, nextTopicId, nextChapterId);
      setRefreshKey((k) => k + 1);
    },
    [user, chapter.id, currentTopicId, topics]
  );

  const handleToggleBookmark = () => {
    const isNowBookmarked = toggleBookmark(user, chapter.id, currentTopicId);
    setBookmarked(isNowBookmarked);
  };

  const handlePrevTopic = () => {
    const idx = topics.findIndex((t) => t.id === currentTopicId);
    if (idx > 0) {
      setCurrentTopicId(topics[idx - 1].id);
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextTopic = () => {
    const idx = topics.findIndex((t) => t.id === currentTopicId);
    if (idx + 1 < topics.length) {
      const nextId = topics[idx + 1].id;
      if (isTopicUnlocked(user, chapter.id, nextId)) {
        setCurrentTopicId(nextId);
        contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  if (loading) return <ChapterSkeleton />;

  const currentTopic = topics.find((t) => t.id === currentTopicId);
  const topicMarkdown = content ? extractTopicContent(content, currentTopicId) : "";
  const theoryMarkdown = topicMarkdown ? extractTheoryContent(topicMarkdown, currentTopicId) : "";
  const taskMarkdown = topicMarkdown ? extractTaskContent(topicMarkdown, currentTopicId) : "";
  const mcqQuestions = mcqSets[currentTopicId] || [];

  const unlockedTopics = getUnlockedTopics();
  const passedTopics = getPassedTopics();

  const currentIdx = topics.findIndex((t) => t.id === currentTopicId);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx + 1 < topics.length;
  const isNextUnlocked = hasNext && unlockedTopics.has(topics[currentIdx + 1]?.id);

  const progress = getUserProgress(user);
  const tp = progress.topicProgress[`${chapter.id}:${currentTopicId}`];
  const alreadyPassed = tp?.passed ?? false;
  const previousScore = tp?.mcqScore ?? null;

  const readTime = estimateReadingTime(theoryMarkdown);
  const wordCount = countWords(theoryMarkdown);

  return (
    <>
      <ReadingProgress color={chapter.accentColor} />

      <div className="flex min-h-screen pt-16">
        {/* Sidebar */}
        <TopicSidebar
          topics={topics}
          currentTopicId={currentTopicId}
          unlockedTopics={unlockedTopics}
          passedTopics={passedTopics}
          accentColor={chapter.accentColor}
          chapterTitle={chapter.title}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelectTopic={(id) => {
            setCurrentTopicId(id);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Topic header bar */}
          <div className="sticky top-16 z-20 glass border-b border-white/5 px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-all"
            >
              <Menu size={18} />
            </button>

            {/* Desktop sidebar toggle */}
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-all"
            >
              <AlignLeft size={16} />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="text-xs font-mono font-bold shrink-0"
                  style={{ color: chapter.accentColor }}
                >
                  {currentTopicId}
                </span>
                <span className="text-sm font-semibold text-white truncate">
                  {currentTopic?.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-3 text-xs text-white/30">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {readTime} min
                </span>
                <span className="flex items-center gap-1">
                  <Hash size={11} />
                  {wordCount.toLocaleString()} words
                </span>
              </div>
              <button
                onClick={handleToggleBookmark}
                className={`p-1.5 rounded-lg transition-all ${
                  bookmarked ? "text-accent-cyan" : "text-white/30 hover:text-white/60"
                }`}
              >
                {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              </button>
            </div>
          </div>

          {/* Content area */}
          <div ref={contentRef} className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTopicId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                {/* Theory content */}
                <div className="prose-twh">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {theoryMarkdown}
                  </ReactMarkdown>
                </div>

                {/* MCQ Section */}
                {mcqQuestions.length > 0 && (
                  <div className="mt-12">
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="h-px flex-1"
                        style={{ background: `linear-gradient(90deg, ${chapter.accentColor}40, transparent)` }}
                      />
                      <span
                        className="text-xs font-mono font-bold px-3 py-1 rounded-full"
                        style={{ color: chapter.accentColor, background: `${chapter.accentColor}15` }}
                      >
                        🧠 MCQ SET
                      </span>
                      <div
                        className="h-px flex-1"
                        style={{ background: `linear-gradient(270deg, ${chapter.accentColor}40, transparent)` }}
                      />
                    </div>
                    <MCQSection
                      questions={mcqQuestions}
                      topicId={currentTopicId}
                      chapterId={chapter.id}
                      alreadyPassed={alreadyPassed}
                      previousScore={previousScore}
                      accentColor={chapter.accentColor}
                      onComplete={handleMCQComplete}
                    />
                  </div>
                )}

                {/* Hands-on Task */}
                {taskMarkdown && (
                  <div className="mt-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="h-px flex-1"
                        style={{ background: `linear-gradient(90deg, ${chapter.accentColor}40, transparent)` }}
                      />
                      <span
                        className="text-xs font-mono font-bold px-3 py-1 rounded-full"
                        style={{ color: chapter.accentColor, background: `${chapter.accentColor}15` }}
                      >
                        🎯 HANDS-ON TASK
                      </span>
                      <div
                        className="h-px flex-1"
                        style={{ background: `linear-gradient(270deg, ${chapter.accentColor}40, transparent)` }}
                      />
                    </div>
                    <div className="glass rounded-xl p-5 border border-white/8 prose-twh">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {taskMarkdown}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Video section */}
                <div className="mt-10">
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="h-px flex-1"
                      style={{ background: `linear-gradient(90deg, ${chapter.accentColor}40, transparent)` }}
                    />
                    <span
                      className="text-xs font-mono font-bold px-3 py-1 rounded-full"
                      style={{ color: chapter.accentColor, background: `${chapter.accentColor}15` }}
                    >
                      📹 VIDEO LESSON
                    </span>
                    <div
                      className="h-px flex-1"
                      style={{ background: `linear-gradient(270deg, ${chapter.accentColor}40, transparent)` }}
                    />
                  </div>
                  <VideoSection topicTitle={currentTopic?.title || ""} accentColor={chapter.accentColor} />
                </div>

                {/* Notes */}
                <div className="mt-8">
                  <NotesPanel
                    user={user}
                    chapterId={chapter.id}
                    topicId={currentTopicId}
                    accentColor={chapter.accentColor}
                  />
                </div>

                {/* Topic navigation */}
                <div className="mt-10 flex items-center justify-between gap-4">
                  <motion.button
                    whileHover={hasPrev ? { x: -3 } : {}}
                    whileTap={hasPrev ? { scale: 0.97 } : {}}
                    onClick={handlePrevTopic}
                    disabled={!hasPrev}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      hasPrev
                        ? "glass border border-white/10 text-white/70 hover:text-white hover:border-white/20"
                        : "opacity-30 cursor-not-allowed glass border border-white/5 text-white/30"
                    }`}
                  >
                    <ChevronLeft size={15} />
                    <span className="hidden sm:inline">Previous Topic</span>
                    <span className="sm:hidden">Prev</span>
                  </motion.button>

                  <div className="text-xs text-white/30 font-mono">
                    {currentIdx + 1} / {topics.length}
                  </div>

                  <motion.button
                    whileHover={isNextUnlocked ? { x: 3 } : {}}
                    whileTap={isNextUnlocked ? { scale: 0.97 } : {}}
                    onClick={handleNextTopic}
                    disabled={!hasNext}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isNextUnlocked
                        ? "text-bg-primary font-bold"
                        : !hasNext
                        ? "opacity-30 cursor-not-allowed glass border border-white/5 text-white/30"
                        : "glass border border-white/10 text-white/40 cursor-not-allowed"
                    }`}
                    style={isNextUnlocked ? { background: chapter.accentColor } : {}}
                  >
                    <span className="hidden sm:inline">
                      {!hasNext ? "Chapter Complete!" : isNextUnlocked ? "Next Topic" : "Locked"}
                    </span>
                    <span className="sm:hidden">
                      {!hasNext ? "Done!" : isNextUnlocked ? "Next" : "🔒"}
                    </span>
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

function ChapterSkeleton() {
  return (
    <div className="flex min-h-screen pt-16">
      <div className="w-72 hidden lg:block">
        <div className="glass h-full border-r border-white/8 p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 skeleton rounded-lg" />
          ))}
        </div>
      </div>
      <div className="flex-1 max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="h-8 skeleton rounded-lg w-3/4" />
        <div className="h-4 skeleton rounded w-full" />
        <div className="h-4 skeleton rounded w-5/6" />
        <div className="h-4 skeleton rounded w-full" />
        <div className="h-32 skeleton rounded-xl" />
      </div>
    </div>
  );
}

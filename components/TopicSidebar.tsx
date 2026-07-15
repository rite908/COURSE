"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Lock, ChevronRight, X, BookOpen } from "lucide-react";
import type { TopicMeta } from "@/lib/chapters";

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
  topics,
  currentTopicId,
  unlockedTopics,
  passedTopics,
  accentColor,
  chapterTitle,
  isOpen,
  onClose,
  onSelectTopic,
}: Props) {
  return (
    <>
      {/* Overlay on mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 bottom-0 w-72 z-40 lg:sticky lg:top-20 lg:translate-x-0 lg:h-[calc(100vh-5rem)] flex flex-col"
      >
        <div className="glass border-r border-white/8 h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen size={15} style={{ color: accentColor }} className="shrink-0" />
              <span className="text-sm font-semibold text-white truncate">{chapterTitle}</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all shrink-0"
            >
              <X size={16} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="px-4 py-3 border-b border-white/5 shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-white/40">Progress</span>
              <span className="text-xs font-mono" style={{ color: accentColor }}>
                {passedTopics.size}/{topics.length}
              </span>
            </div>
            <div className="h-1 bg-white/8 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: accentColor }}
                initial={{ width: 0 }}
                animate={{
                  width: `${topics.length > 0 ? (passedTopics.size / topics.length) * 100 : 0}%`,
                }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </div>
          </div>

          {/* Topics list */}
          <div className="flex-1 overflow-y-auto py-2">
            {topics.map((topic, idx) => {
              const isUnlocked = unlockedTopics.has(topic.id);
              const isPassed = passedTopics.has(topic.id);
              const isCurrent = topic.id === currentTopicId;
              const isLocked = !isUnlocked;

              return (
                <motion.button
                  key={topic.id}
                  onClick={() => {
                    if (!isLocked) {
                      onSelectTopic(topic.id);
                      onClose();
                    }
                  }}
                  whileHover={!isLocked ? { x: 4 } : {}}
                  disabled={isLocked}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-all group relative ${
                    isCurrent
                      ? "bg-white/5"
                      : isLocked
                      ? "opacity-45 cursor-not-allowed"
                      : "hover:bg-white/4 cursor-pointer"
                  }`}
                >
                  {/* Active indicator */}
                  {isCurrent && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r"
                      style={{ background: accentColor }}
                    />
                  )}

                  {/* Status icon */}
                  <div className="shrink-0 mt-0.5">
                    {isPassed ? (
                      <CheckCircle size={15} className="text-accent-green" />
                    ) : isLocked ? (
                      <Lock size={15} className="text-white/30" />
                    ) : (
                      <div
                        className={`w-[15px] h-[15px] rounded-full border-2 ${
                          isCurrent ? "border-accent-cyan" : "border-white/20"
                        }`}
                      />
                    )}
                  </div>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className="text-[10px] font-mono font-bold"
                        style={isCurrent || isUnlocked ? { color: accentColor } : { color: "rgba(255,255,255,0.3)" }}
                      >
                        {topic.id}
                      </span>
                      {isLocked && (
                        <span className="text-[9px] bg-white/8 text-white/30 px-1.5 py-0.5 rounded font-medium">
                          LOCKED
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs leading-snug line-clamp-2 ${
                        isCurrent
                          ? "text-white font-medium"
                          : isLocked
                          ? "text-white/30"
                          : "text-white/65 group-hover:text-white/90"
                      }`}
                    >
                      {topic.title}
                    </p>
                  </div>

                  {isCurrent && (
                    <ChevronRight size={12} style={{ color: accentColor }} className="shrink-0 mt-0.5" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.aside>
    </>
  );
}

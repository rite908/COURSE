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
  topics, currentTopicId, unlockedTopics, passedTopics,
  accentColor, chapterTitle, isOpen, onClose, onSelectTopic,
}: Props) {
  const passed  = passedTopics.size;
  const total   = topics.length;
  const percent = total > 0 ? Math.round((passed / total) * 100) : 0;

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
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed left-0 top-0 bottom-0 w-72 z-40 lg:sticky lg:top-20 lg:translate-x-0 lg:h-[calc(100vh-5rem)] flex flex-col"
      >
        <div className="bg-white border-r border-gray-100 h-full flex flex-col overflow-hidden shadow-sm">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen size={14} style={{ color: accentColor }} className="shrink-0" />
              <span className="text-sm font-bold text-gray-900 truncate">{chapterTitle}</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all shrink-0"
            >
              <X size={14} />
            </button>
          </div>

          {/* Progress */}
          <div className="px-5 py-3.5 border-b border-gray-50 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-medium">Progress</span>
              <span className="text-xs font-bold" style={{ color: accentColor }}>
                {passed}/{total} topics
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: accentColor }}
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.7, delay: 0.2 }}
              />
            </div>
            <div className="text-right mt-1">
              <span className="text-[10px] text-gray-300">{percent}%</span>
            </div>
          </div>

          {/* Topics */}
          <div className="flex-1 overflow-y-auto">
            {topics.map((topic, idx) => {
              const isUnlocked = unlockedTopics.has(topic.id);
              const isPassed   = passedTopics.has(topic.id);
              const isCurrent  = topic.id === currentTopicId;
              const isLocked   = !isUnlocked;

              return (
                <motion.button
                  key={topic.id}
                  onClick={() => {
                    if (!isLocked) { onSelectTopic(topic.id); onClose(); }
                  }}
                  whileHover={!isLocked ? { x: 3 } : {}}
                  disabled={isLocked}
                  className={`w-full text-left px-4 py-3.5 flex items-center gap-3 transition-all relative group ${
                    isCurrent
                      ? "bg-blue-50"
                      : isLocked
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-gray-50 cursor-pointer"
                  }`}
                >
                  {/* Active indicator */}
                  {isCurrent && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r"
                      style={{ background: accentColor }}
                    />
                  )}

                  {/* Status icon */}
                  <div className="shrink-0">
                    {isPassed ? (
                      <CheckCircle size={15} className="text-green-500" />
                    ) : isLocked ? (
                      <Lock size={14} className="text-gray-300" />
                    ) : (
                      <div
                        className={`w-[15px] h-[15px] rounded-full border-2 ${
                          isCurrent ? "" : "border-gray-200"
                        }`}
                        style={isCurrent ? { borderColor: accentColor } : {}}
                      />
                    )}
                  </div>

                  {/* Topic info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className="text-[10px] font-bold font-mono"
                        style={{
                          color: isCurrent || isUnlocked ? accentColor : "#CBD5E1",
                        }}
                      >
                        {topic.id}
                      </span>
                      {isLocked && (
                        <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-medium">LOCKED</span>
                      )}
                    </div>
                    <p
                      className={`text-xs leading-snug line-clamp-2 ${
                        isCurrent ? "text-gray-900 font-semibold" :
                        isLocked  ? "text-gray-300" :
                        "text-gray-500 group-hover:text-gray-800"
                      }`}
                    >
                      {topic.title}
                    </p>
                  </div>

                  {isCurrent && (
                    <ChevronRight size={12} style={{ color: accentColor }} className="shrink-0" />
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

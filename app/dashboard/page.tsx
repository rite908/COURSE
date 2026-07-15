"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle, Lock, BookOpen, Target, TrendingUp, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  getCurrentUser, getUserProgress, getChapterStats, getOverallStats, type UserName,
} from "@/lib/storage";
import { CHAPTERS } from "@/lib/chapters";
import { formatTime } from "@/lib/utils";

const USER_CONFIG: Record<UserName, {
  color: string; bg: string; light: string;
  greeting: string; emoji: string;
}> = {
  TWH:    { color: "#2563EB", bg: "#EEF3FF", light: "#DBEAFE", greeting: "Waapas aagaye, Afsar Bhai!", emoji: "🔥" },
  Prince: { color: "#7C3AED", bg: "#F3EEFF", light: "#EDE9FE", greeting: "Waapas aagaye, Prince!", emoji: "💪" },
  Ashish: { color: "#059669", bg: "#ECFDF5", light: "#D1FAE5", greeting: "Waapas aagaye, Ashish!", emoji: "🚀" },
};

const CH_COLORS: Record<string, string> = {
  "1": "#2563EB", "2": "#0EA5E9", "3": "#7C3AED", "4": "#059669", "5": "#DC2626",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser]     = useState<UserName | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.replace("/login"); return; }
    setUser(u);
    setMounted(true);
  }, [router]);

  if (!mounted || !user) return <DashboardSkeleton />;

  const overall = getOverallStats(user);
  const conf    = USER_CONFIG[user];

  const chapters = CHAPTERS.map((ch) => {
    const stats = getChapterStats(user, ch.id, ch.totalTopics);
    return {
      ch, stats,
      isLocked:    stats.unlocked === 0,
      isCompleted: stats.completed === ch.totalTopics,
    };
  });

  const doneCount    = chapters.filter((c) => c.isCompleted).length;
  const activeCount  = chapters.filter((c) => !c.isLocked && !c.isCompleted).length;
  const continuePath = overall.currentChapter ? `/chapter/${overall.currentChapter}` : `/chapter/1`;

  const statCards = [
    { icon: <BookOpen size={16} />, value: `${doneCount}/5`, label: "Chapters Done",   color: "#2563EB", bg: "#EEF3FF" },
    { icon: <Target size={16} />,   value: `${overall.topicsPassed}`, label: "Topics Passed",  color: "#7C3AED", bg: "#F3EEFF" },
    { icon: <TrendingUp size={16} />, value: `${overall.mcqAccuracy}%`, label: "MCQ Accuracy", color: "#059669", bg: "#ECFDF5" },
    { icon: <Clock size={16} />,    value: formatTime(overall.timeSpentMinutes), label: "Time Spent", color: "#D97706", bg: "#FFFBEB" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">

        {/* ── Welcome Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-6 sm:p-8 mb-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
        >
          <div>
            <p className="text-sm text-gray-400 mb-1">Good to see you,</p>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900" style={{ letterSpacing: "-0.02em" }}>
              {conf.greeting} {conf.emoji}
            </h1>
            <p className="text-gray-400 mt-1.5 text-sm">
              Your learning dashboard — track missions, unlock topics.
            </p>
          </div>

          {overall.currentChapter && (
            <Link href={continuePath}>
              <motion.div
                whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(37,99,235,0.2)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-6 py-3.5 rounded-xl text-white text-sm font-bold shrink-0 shadow-sm"
                style={{ background: conf.color }}
              >
                <Play size={15} className="fill-white" />
                Continue Learning
              </motion.div>
            </Link>
          )}
        </motion.div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: s.bg, color: s.color }}
              >
                {s.icon}
              </div>
              <div className="text-2xl font-black text-gray-900 mb-0.5">{s.value}</div>
              <div className="text-xs text-gray-400 font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Continue Banner ── */}
        {overall.currentChapter && (() => {
          const currentCh = CHAPTERS.find((c) => c.id === overall.currentChapter);
          const accentColor = CH_COLORS[overall.currentChapter] || "#2563EB";
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <Link href={continuePath}>
                <motion.div
                  whileHover={{ y: -2, boxShadow: `0 8px 32px ${accentColor}18` }}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 group cursor-pointer transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ background: accentColor }}
                  >
                    <Play size={20} className="fill-white ml-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Continue where you left off</div>
                    <div className="font-bold text-gray-900">{currentCh?.title}</div>
                    {overall.currentTopic && (
                      <div className="text-xs text-gray-400 mt-0.5 font-mono">Topic {overall.currentTopic}</div>
                    )}
                  </div>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0" />
                </motion.div>
              </Link>
            </motion.div>
          );
        })()}

        {/* ── Chapter Grid ── */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-lg">All Chapters</h2>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="text-green-600">{doneCount} done</span>
            <span className="text-blue-600">{activeCount} in progress</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {chapters.map(({ ch, stats, isLocked, isCompleted }, i) => {
            const accent = CH_COLORS[ch.id] || "#2563EB";
            return (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.07 }}
              >
                <Link href={isLocked ? "#" : `/chapter/${ch.id}`}>
                  <motion.div
                    whileHover={!isLocked ? { y: -4, boxShadow: `0 8px 28px ${accent}14` } : {}}
                    className={`bg-white rounded-2xl p-5 border transition-all h-full ${
                      isLocked
                        ? "border-gray-100 opacity-55 cursor-not-allowed"
                        : isCompleted
                        ? "border-green-200 cursor-pointer"
                        : "border-gray-100 cursor-pointer"
                    }`}
                    style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                          style={{ background: isLocked ? "#F1F5F9" : `${accent}12` }}
                        >
                          {isLocked ? <Lock size={16} className="text-gray-300" /> : ch.icon}
                        </div>
                        <div>
                          <div
                            className="text-[10px] font-bold tracking-widest uppercase"
                            style={{ color: isLocked ? "#CBD5E1" : accent }}
                          >
                            CH {String(ch.number).padStart(2, "0")}
                          </div>
                          <div className="font-bold text-gray-900 text-sm leading-tight">{ch.title}</div>
                        </div>
                      </div>
                      {isCompleted ? (
                        <CheckCircle size={16} className="text-green-500 shrink-0" />
                      ) : isLocked ? (
                        <Lock size={14} className="text-gray-200 shrink-0" />
                      ) : null}
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">{stats.completed}/{ch.totalTopics} topics</span>
                        <span className="font-bold" style={{ color: isLocked ? "#CBD5E1" : accent }}>
                          {stats.percent}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.percent}%` }}
                          transition={{ duration: 0.9, delay: 0.5 + i * 0.07 }}
                          style={{ background: isCompleted ? "#10B981" : isLocked ? "#E2E8F0" : accent }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#F5F8FF] pt-24 px-4 max-w-7xl mx-auto">
      <div className="h-32 skeleton rounded-2xl mb-8" />
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-3 gap-5">
        {[...Array(5)].map((_, i) => <div key={i} className="h-36 skeleton rounded-2xl" />)}
      </div>
    </div>
  );
}

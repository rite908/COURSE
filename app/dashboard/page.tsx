"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield, BookOpen, Clock, Target, TrendingUp, ArrowRight,
  Lock, CheckCircle, Play, Star, Zap
} from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  getCurrentUser, getUserProgress, getChapterStats, getOverallStats, type UserName,
} from "@/lib/storage";
import { CHAPTERS } from "@/lib/chapters";
import { formatTime } from "@/lib/utils";

const USER_COLORS: Record<UserName, { color: string; glow: string; greeting: string }> = {
  TWH: { color: "#00E5FF", glow: "rgba(0,229,255,0.2)", greeting: "Waapas aagaye, Afsar Bhai! 🔥" },
  Prince: { color: "#8A5CFF", glow: "rgba(138,92,255,0.2)", greeting: "Waapas aagaye, Prince! 💪" },
  Ashish: { color: "#00FF95", glow: "rgba(0,255,149,0.2)", greeting: "Waapas aagaye, Ashish! 🚀" },
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserName | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) { router.replace("/login"); return; }
    setUser(u);
    setMounted(true);
  }, [router]);

  if (!mounted || !user) return <DashboardSkeleton />;

  const overallStats = getOverallStats(user);
  const userConf = USER_COLORS[user];

  // Build chapter cards
  const chapterCards = CHAPTERS.map((ch) => {
    const stats = getChapterStats(user, ch.id, ch.totalTopics);
    const isLocked = stats.unlocked === 0;
    const isCompleted = stats.completed === ch.totalTopics;
    return { ch, stats, isLocked, isCompleted };
  });

  const completedChapters = chapterCards.filter((c) => c.isCompleted).length;
  const inProgressChapters = chapterCards.filter((c) => !c.isLocked && !c.isCompleted).length;
  const lockedChapters = chapterCards.filter((c) => c.isLocked).length;

  const continuePath = overallStats.currentChapter
    ? `/chapter/${overallStats.currentChapter}`
    : `/chapter/1`;

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 cyber-grid-bg opacity-60 pointer-events-none" />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 80% 20%, ${userConf.glow} 0%, transparent 60%)`,
        }}
      />

      <main className="relative pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-white/40">Namaste,</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {userConf.greeting}
          </h1>
          <p className="text-white/40 mt-2">
            Aapka learning dashboard — progress track karo, topics unlock karo.
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            {
              icon: <BookOpen size={18} />,
              value: `${completedChapters}/5`,
              label: "Chapters Done",
              color: "#00E5FF",
            },
            {
              icon: <Target size={18} />,
              value: `${overallStats.topicsPassed}`,
              label: "Topics Passed",
              color: "#8A5CFF",
            },
            {
              icon: <TrendingUp size={18} />,
              value: `${overallStats.mcqAccuracy}%`,
              label: "MCQ Accuracy",
              color: "#00FF95",
            },
            {
              icon: <Clock size={18} />,
              value: formatTime(overallStats.timeSpentMinutes),
              label: "Time Spent",
              color: "#FF7A00",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-xl p-4 border border-white/8"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${s.color}15`, color: s.color }}
              >
                {s.icon}
              </div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Continue learning */}
        {overallStats.currentChapter && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <Link href={continuePath}>
              <div
                className="glass rounded-2xl p-6 border border-white/10 hover:border-accent-cyan/40 transition-all group flex items-center gap-5 relative overflow-hidden"
                style={{ boxShadow: "0 0 0 0 rgba(0,229,255,0)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(0,229,255,0.1)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 rgba(0,229,255,0)")
                }
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(135deg, rgba(0,229,255,0.04) 0%, transparent 60%)",
                  }}
                />

                <div className="w-14 h-14 rounded-xl bg-accent-cyan/10 flex items-center justify-center shrink-0">
                  <Play size={22} className="text-accent-cyan ml-0.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono font-bold text-accent-cyan uppercase tracking-widest mb-1">
                    Continue Learning
                  </div>
                  <div className="text-white font-bold text-lg">
                    {CHAPTERS.find((c) => c.id === overallStats.currentChapter)?.title}
                  </div>
                  {overallStats.currentTopic && (
                    <div className="text-white/40 text-sm mt-0.5 font-mono">
                      Topic {overallStats.currentTopic}
                    </div>
                  )}
                </div>

                <ArrowRight
                  size={20}
                  className="text-white/20 group-hover:text-accent-cyan transition-all shrink-0 group-hover:translate-x-1"
                />
              </div>
            </Link>
          </motion.div>
        )}

        {/* Chapter overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white">All Chapters</h2>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-accent-green">{completedChapters} done</span>
              <span className="text-accent-cyan">{inProgressChapters} in progress</span>
              <span className="text-white/30">{lockedChapters} locked</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {chapterCards.map(({ ch, stats, isLocked, isCompleted }, i) => (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.07 }}
              >
                <Link href={isLocked ? "#" : `/chapter/${ch.id}`}>
                  <motion.div
                    whileHover={!isLocked ? { y: -4 } : {}}
                    className={`glass rounded-xl p-5 border transition-all h-full ${
                      isLocked
                        ? "border-white/5 opacity-50 cursor-not-allowed"
                        : isCompleted
                        ? "border-accent-green/20 hover:border-accent-green/40"
                        : `border-white/8 hover:border-white/20`
                    }`}
                    style={
                      !isLocked
                        ? { borderColor: `${ch.accentColor}25` }
                        : {}
                    }
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                          style={{ background: `${ch.accentColor}15` }}
                        >
                          {isLocked ? "🔒" : ch.icon}
                        </div>
                        <div>
                          <div
                            className="text-xs font-mono font-bold"
                            style={{ color: isLocked ? "rgba(255,255,255,0.3)" : ch.accentColor }}
                          >
                            CH {ch.number}
                          </div>
                          <h3 className="text-sm font-bold text-white leading-tight">{ch.title}</h3>
                        </div>
                      </div>

                      {isCompleted ? (
                        <CheckCircle size={16} className="text-accent-green shrink-0" />
                      ) : isLocked ? (
                        <Lock size={14} className="text-white/20 shrink-0" />
                      ) : null}
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/40">
                          {stats.completed}/{ch.totalTopics} topics
                        </span>
                        <span
                          className="font-mono font-bold"
                          style={{ color: isLocked ? "rgba(255,255,255,0.2)" : ch.accentColor }}
                        >
                          {stats.percent}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.percent}%` }}
                          transition={{ duration: 0.8, delay: 0.5 + i * 0.07 }}
                          style={{ background: isLocked ? "rgba(255,255,255,0.15)" : ch.accentColor }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-10 glass rounded-xl p-5 border border-white/8"
        >
          <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider text-xs">Quick Access</h3>
          <div className="flex flex-wrap gap-3">
            {CHAPTERS.map((ch) => (
              <Link key={ch.id} href={`/chapter/${ch.id}`}>
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-white/8 hover:border-white/20 text-sm text-white/60 hover:text-white transition-all"
                >
                  <span>{ch.icon}</span>
                  <span>{ch.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-bg-primary pt-24 px-4 max-w-7xl mx-auto">
      <div className="h-10 skeleton rounded-xl w-64 mb-10" />
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 skeleton rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-36 skeleton rounded-xl" />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lock, CheckCircle, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import { CHAPTERS } from "@/lib/chapters";
import { getCurrentUser, getChapterStats, type UserName } from "@/lib/storage";

export default function ChaptersPage() {
  const [user, setUser] = useState<UserName | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="fixed inset-0 cyber-grid-bg opacity-50 pointer-events-none" />

      <main className="relative pt-28 pb-16 px-4 max-w-5xl mx-auto">
        <motion.div
          initial={mounted ? { opacity: 0, y: -10 } : false}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-accent-cyan/20 text-xs font-mono font-bold text-accent-cyan mb-5">
            <BookOpen size={12} />
            COURSE CURRICULUM
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            All <span className="text-accent-cyan">Chapters</span>
          </h1>
          <p className="text-white/40 max-w-xl mx-auto">
            5 chapters · 30+ topics · 450+ MCQs · Structured path from zero to ethical hacking
          </p>
        </motion.div>

        <div className="space-y-5">
          {CHAPTERS.map((ch, i) => {
            const stats =
              mounted && user
                ? getChapterStats(user, ch.id, ch.totalTopics)
                : { completed: 0, unlocked: 0, total: ch.totalTopics, percent: 0 };
            const isLocked = mounted && user ? stats.unlocked === 0 : false;
            const isCompleted = mounted && user ? stats.completed === ch.totalTopics : false;

            return (
              <motion.div
                key={ch.id}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mounted ? i * 0.1 : 0 }}
              >
                <Link href={`/chapter/${ch.id}`}>
                  <motion.div
                    whileHover={{ y: -3, x: 4 }}
                    className={`glass rounded-2xl p-6 border transition-all group relative overflow-hidden ${
                      isCompleted ? "border-accent-green/25" : "border-white/8 hover:border-white/20"
                    }`}
                  >
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${ch.accentColor}08 0%, transparent 60%)`,
                      }}
                    />

                    <div className="flex items-center gap-5 relative">
                      {/* Number */}
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                        style={{ background: `${ch.accentColor}12` }}
                      >
                        {ch.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span
                            className="text-xs font-mono font-bold"
                            style={{ color: ch.accentColor }}
                          >
                            CHAPTER {ch.number}
                          </span>
                          {isCompleted && (
                            <span className="text-xs bg-accent-green/10 text-accent-green border border-accent-green/20 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              <CheckCircle size={10} /> Completed
                            </span>
                          )}
                          {isLocked && (
                            <span className="text-xs bg-white/5 text-white/30 border border-white/8 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              <Lock size={10} /> Locked
                            </span>
                          )}
                        </div>

                        <h2 className="text-lg sm:text-xl font-black text-white mb-0.5">
                          {ch.title}
                        </h2>
                        <p className="text-white/40 text-sm">{ch.description}</p>

                        {/* Progress */}
                        {mounted && user && (
                          <div className="mt-3 flex items-center gap-3">
                            <div className="flex-1 h-1 bg-white/6 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${stats.percent}%` }}
                                transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                                style={{ background: ch.accentColor }}
                              />
                            </div>
                            <span
                              className="text-xs font-mono font-bold shrink-0"
                              style={{ color: ch.accentColor }}
                            >
                              {stats.completed}/{ch.totalTopics}
                            </span>
                          </div>
                        )}
                      </div>

                      <ArrowRight
                        size={18}
                        className="text-white/15 group-hover:text-white/60 transition-all shrink-0 group-hover:translate-x-1"
                        style={{ color: ch.accentColor + "60" }}
                      />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
